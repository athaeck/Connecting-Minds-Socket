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

export class ConnectingMindsSocket extends BaseWebSocketExpressAdoon {
  // private _playerOne: Player | null = null
  // private _playerTwo: Player | null = null
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

  // public set PlayerOne(player: Player) {
  //     this._playerOne = player
  // }
  // public set PlayerTwo(player: Player) {
  //     this.PlayerTwo = player
  // }
  // public get PlayerOne(): Player | null {
  //     return this._playerOne
  // }
  // public get PlayerTwo(): Player | null {
  //     return this._playerTwo
  // }
  public get ConnectingMindsHooks() {
    return this._connectingMindsHooks;
  }
  // public IsPlayerOne(socket: WebSocket): Boolean {
  //     if (!this._playerOne) {
  //         return false
  //     }
  //     return this._playerOne.socket === socket
  // }
  // public IsPlayerTwo(socket: WebSocket): Boolean {
  //     if (!this._playerTwo) {
  //         return false
  //     }
  //     return this._playerTwo.socket === socket
  // }

  protected ValidateConnection(webSocket: WebSocket): boolean {
    // if (this.PlayerOne !== null && this.PlayerTwo !== null) {
    //     return false
    // }
    return true;
  }

  Init(webSocket: WebSocket, hooks: WebSocketHooks): void { }

  // public TakePlayerOne(webSocket: WebSocket, hooks: ConnectingMindsHooks): void {
  //     this._playerOne = new Player(webSocket, hooks);
  // }

  // public TakePlayerTwo(webSocket: WebSocket, hooks: ConnectingMindsHooks): void {
  //     this._playerTwo = new Player(webSocket, hooks)
  // }

  protected CreateHooks(): WebSocketHooks {
    return new ConnectingMindsHooks();
  }
  Disconnect(webSocket: WebSocket): WebSocketHooks | undefined {
    // let player: Player | null = null
    // if (this.IsPlayerOne(webSocket)) {
    //     player = this.PlayerOne
    //     this._playerOne = null
    // }
    // if (this.IsPlayerTwo(webSocket)) {
    //     player = this.PlayerTwo
    //     this._playerTwo = null
    // }
    // return player?.hooks
  }

  public CreatePlayer(webSocket: WebSocket, hooks: ConnectingMindsHooks): void {
    const player: Player = new Player(webSocket, hooks);
    hooks.DispatchHook(ConnectingMindsHooks.CREATE_PLAYER, player);
  }

  public CreateSession(player: Player): void {
    const session: Session = new Session(player);
    player.hooks.DispatchHook(ConnectingMindsHooks.CREATE_SESSION, session);
    this._sessions.push(session);
  }

  public JoinSession(player: Player, session: Session): void {
    player.hooks.DispatchHook(ConnectingMindsHooks.JOIN_SESSION, session)
    session.ReConnectPlayer(player)
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
