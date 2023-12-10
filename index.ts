import { WebSocket } from "ws";
import {
  AddRoute,
  BaseExpressRoute,
} from "./athaeck-websocket-express-base/athaeck-express-base/base/express";
import { BaseWebSocketExpressAdoon } from "./athaeck-websocket-express-base/base";
import { WebSocketHooks } from "./athaeck-websocket-express-base/base/hooks";
import {
  ConnectingMindsServerAdapterFactory,
  ConnectingMindsSocketListenerFactory,
} from "./src";
import bodyParser from "body-parser";
import { ConnectingMindsHooks } from "./src/hooks/connectingMindsHooks";
import { Session } from "./src/data/session";
import { Player } from "./src/data/player";
import { Watcher } from "./src/data/watcher";

export class ConnectingMindsSocket extends BaseWebSocketExpressAdoon {
  private _connectingMindsHooks: ConnectingMindsHooks;
  private _sessions: Session[] = [];

  constructor(port: number) {
    super(port);
    this._connectingMindsHooks = new ConnectingMindsHooks();
    this.factory = new ConnectingMindsSocketListenerFactory("./listener/");
    this.initializeMiddleware();
    this.apiFactory = new ConnectingMindsServerAdapterFactory("./api/");
    this.apiFactory.ConnectAdpater(this);
  }

  public get ConnectingMindsHooks() {
    return this._connectingMindsHooks;
  }

  protected ValidateConnection(webSocket: WebSocket): boolean {
    return true;
  }

  Init(webSocket: WebSocket, hooks: WebSocketHooks): void { }

  protected CreateHooks(): WebSocketHooks {
    return new ConnectingMindsHooks();
  }
  Disconnect(webSocket: WebSocket): WebSocketHooks | undefined {
    let watcher: Watcher | null = null;

    for (const s of this._sessions) {
      if (s.Player?.socket === webSocket) {
        this.PlayerDisconnect(s, s.Player)
        watcher = s.Player;
      }
      for (const w of s.Watcher) {
        if (w.socket === webSocket) {
          this.WatcherDisconnect(s, w)
          watcher = w;
        }
      }
    }
    return watcher?.hooks;
  }

  public PlayerDisconnect(session: Session, player: Player): void {
    player.hooks.DispatchHook(ConnectingMindsHooks.LEAVE_SESSION, session);
    session.DisconnectPlayer(player);
  }

  public WatcherDisconnect(session: Session, watcher: Watcher): void {
    watcher.hooks.DispatchHook(ConnectingMindsHooks.LEAVE_SESSION, session);
    session.DisconnectWatcher(watcher);
  }

  public CreatePlayer(webSocket: WebSocket, hooks: ConnectingMindsHooks): void {
    const player: Player = new Player(webSocket, hooks);
    hooks.DispatchHook(ConnectingMindsHooks.CREATE_PLAYER, player);
  }

  public CreateWatcher(webSocket: WebSocket, hooks: ConnectingMindsHooks): void {
    const watcher: Watcher = new Watcher(webSocket, hooks);
    hooks.DispatchHook(ConnectingMindsHooks.CREATE_WATCHER, watcher);
  }

  public CreateSession(player: Player): void {
    const session: Session = new Session(player);
    session.Init(this.ExpressURL);
    player.hooks.DispatchHook(ConnectingMindsHooks.CREATE_SESSION, session);
    this._sessions.push(session);
  }

  public JoinSessionAsPlayer(player: Player, session: Session): void {
    player.hooks.DispatchHook(ConnectingMindsHooks.JOIN_SESSION, session);
    session.ReConnectPlayer(player);
  }
  public JoinSessionAsWatcher(watcher: Watcher, session: Session): void {
    watcher.hooks.DispatchHook(ConnectingMindsHooks.JOIN_SESSION, session);
    session.ConnectWatcher(watcher);
  }

  public IsWatcherContaining(watcher: Watcher): boolean {
    let isContaining: boolean = false;

    for (const s of this._sessions) {
      for (const w of s.Watcher) {
        if (w === watcher) {
          isContaining = true;
        }
      }
    }

    return isContaining;
  }

  public GetSession(id: string): Session | null {
    let session: Session | null = null;

    for (const s of this._sessions) {
      if (s.ID === id) {
        session = s;
      }
    }

    return session;
  }

  AddRoute(route: BaseExpressRoute): void {
    this.app = AddRoute(this.app, route);
  }
  initializeMiddleware(): void {
    this.app.use(bodyParser.json());
  }
}

export const connectingMindsSocket: ConnectingMindsSocket =
  new ConnectingMindsSocket(8080);
connectingMindsSocket.Start();
