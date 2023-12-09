import { WebSocket } from "ws";
import { BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { Session } from "../data/session";
import { PassListener } from "../types/passListener";
import { ConnectingMindsSocket } from "../..";
import { ConnectingMindsHooks } from "../hooks/connectingMindsHooks";
import { Player } from "../data/player";
import { SessionHooks } from "../hooks/sessionHooks";
import { ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";
import {
  ConnectingMindsEvents,
  Path,
  PlacedItem,
} from "../../Connecting-Minds-Data-Types/types";

class InitPlayerListener extends BaseWebSocketListener implements PassListener {
  listenerKey: string;
  private _application: ConnectingMindsSocket;
  private _player: Player | null = null;
  private _session: Session | null = null;

  constructor(
    webSocketServer: ConnectingMindsSocket,
    webSocket: WebSocket,
    webSocketHooks: ConnectingMindsHooks
  ) {
    super(webSocketServer, webSocket, webSocketHooks);
    this._application = webSocketServer;

    this.webSocketHooks.SubscribeHookListener(
      ConnectingMindsHooks.CREATE_PLAYER,
      this.OnCreatePlayer.bind(this)
    );
  }

  private OnCreatePlayer(player: Player): void {
    this._player = player;
    player.TakeListener(this);
  }

  protected Init(): void { }
  protected SetKey(): void {
    this.listenerKey = ConnectingMindsEvents.INIT_PLAYER;
  }
  public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void { }
  protected listener(body: any): void {

    if (!this._session) {
      const sessionMissing: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.MISSING)
      sessionMissing.addData("Message", "Es ist ein Netzwerk Fehler aufgetreten.")
      this.webSocket.send(sessionMissing.JSONString)

      return;
    }

    const containsWatcher: boolean = this._session.Watcher.length > 0;
    const unlockedPaths: Path[] = this._session.UnlockedPaths;
    const placedItems: PlacedItem[] = this._session.PlacedItems;

    const initPlayer: ReceivedEvent = new ReceivedEvent(
      ConnectingMindsEvents.ON_INIT_PLAYER
    );
    initPlayer.addData("SessionData", {
      ContainsWatcher: containsWatcher,
      PlacedItems: placedItems,
      UnlockedPaths: unlockedPaths,
    });
    this.webSocket.send(initPlayer.JSONString);
  }
  TakeSession(session: Session): void {
    this._session = session
    if (!this._player) {
      return;
    }
    session.SessionHooks.SubscribeHookListener(SessionHooks.WAIT_FOR_WATCHER, this.OnWaitForWatcher.bind(this));
    session.SessionHooks.SubscribeHookListener(SessionHooks.WATCHER_EXISTING, this.OnWatcherExisting.bind(this));
  }
  private OnWatcherExisting(): void {
    const watcherExisting: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.WATCHER_EXISTING)
    this.webSocket.send(watcherExisting.JSONString)
  }
  private OnWaitForWatcher(): void {
    const waitForWatcher: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.WAIT_FOR_WATCHER);
    this.webSocket.send(waitForWatcher.JSONString);
  }
  RemoveSession(session: Session): void {
    this._session = null

    if (!this._player) {
      return;
    }
    session.SessionHooks.UnSubscribeListener(SessionHooks.WAIT_FOR_WATCHER, this.OnWaitForWatcher.bind(this));

    session.SessionHooks.UnSubscribeListener(SessionHooks.WATCHER_EXISTING, this.OnWatcherExisting.bind(this));
  }
}

module.exports = InitPlayerListener;
