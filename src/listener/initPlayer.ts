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
  Item,
  Path,
  Position,
} from "../../Connecting-Minds-Data-Types/types";

class InitPlayerListener extends BaseWebSocketListener implements PassListener {
  listenerKey: string;
  private _application: ConnectingMindsSocket;
  private _player: Player;
  private _session: Session;

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

  protected Init(): void {}
  protected SetKey(): void {
    this.listenerKey = ConnectingMindsEvents.INIT_PLAYER;
  }
  public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {}
  protected listener(body: any): void {
    const containsWatcher: boolean = this._session.Watcher.length > 0;
    const availableItems: Item[] = this._session.AvailableItems;
    const unlockedPaths: Path[] = this._session.UnlockedPaths;
    const availablePositions: Position[] = this._session.AvailablePositions;

    const initPlayer: ReceivedEvent = new ReceivedEvent(
      ConnectingMindsEvents.ON_INIT_PLAYER
    );
    initPlayer.addData("SessionData", {
      ContainsWatcher: containsWatcher,
      AvailableItems: availableItems,
      UnlockedPaths: unlockedPaths,
      AvailablePositions: availablePositions,
    });
    this.webSocket.send(initPlayer.JSONString);
  }
  TakeSession(session: Session): void {
    session.SessionHooks.SubscribeHookListener(
      SessionHooks.NO_WATCHER,
      this.NoWatcher.bind(this)
    );
  }
  private NoWatcher(): void {
    const noWatcher: ReceivedEvent = new ReceivedEvent(
      ConnectingMindsEvents.NO_WATCHER
    );
    this.webSocket.send(noWatcher.JSONString);
  }
  RemoveSession(session: Session): void {
    session.SessionHooks.UnSubscribeListener(
      SessionHooks.NO_WATCHER,
      this.NoWatcher.bind(this)
    );
  }
}

module.exports = InitPlayerListener;
