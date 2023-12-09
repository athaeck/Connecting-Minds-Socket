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
  PlaceItemProxy,
  PlacedItem,
} from "../../Connecting-Minds-Data-Types/types";
import { EmitSessionNetworkError } from "../helper/sessionNetworkError";

class InitPlayerListener extends BaseWebSocketListener implements PassListener {
  listenerKey: string;
  private _application: ConnectingMindsSocket;
  private _player: Player | null = null;
  private _session: Session | null = null;

  constructor(webSocketServer: ConnectingMindsSocket, webSocket: WebSocket, webSocketHooks: ConnectingMindsHooks) {
    super(webSocketServer, webSocket, webSocketHooks);
    this._application = webSocketServer;

    this.webSocketHooks.SubscribeHookListener(ConnectingMindsHooks.CREATE_PLAYER, this.OnCreatePlayer.bind(this));
  }

  private OnCreatePlayer(player: Player): void {
    this._player = player;
    player.TakeListener(this);
  }

  protected Init(): void { }
  protected SetKey(): void {
    this.listenerKey = ConnectingMindsEvents.INIT_PLAYER;
  }
  public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
    this.webSocketHooks.UnSubscribeListener(ConnectingMindsHooks.CREATE_PLAYER, this.OnCreatePlayer.bind(this));
  }
  protected listener(body: any): void {

    if (!this._session) {
      EmitSessionNetworkError(this.webSocket)

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

    this._session.SessionHooks.SubscribeHookListener(SessionHooks.SEND_MESSAGE,this.OnSendMessage.bind(this))

    if (!this._player) {
      return;
    }
    this._session.SessionHooks.SubscribeHookListener(SessionHooks.WAIT_FOR_WATCHER, this.OnWaitForWatcher.bind(this));
    this._session.SessionHooks.SubscribeHookListener(SessionHooks.WATCHER_EXISTING, this.OnWatcherExisting.bind(this));
    this._session.SessionHooks.SubscribeHookListener(SessionHooks.PLACE_ITEM, this.OnPlaceItem.bind(this))
  }

  private OnSendMessage(sendMessage:ReceivedEvent): void{
    this.webSocket.send(sendMessage.JSONString)
  }

  private OnPlaceItem(proxy: PlaceItemProxy): void {
    const onPlaceItem:ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.ON_PLACE_ITEM)
    onPlaceItem.addData("Items",proxy.PlacedItems)
    this.webSocket.send(onPlaceItem.JSONString)
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
    session.SessionHooks.UnSubscribeListener(SessionHooks.SEND_MESSAGE,this.OnSendMessage.bind(this))
    this._session = null

    if (!this._player) {
      return;
    }
    session.SessionHooks.UnSubscribeListener(SessionHooks.WAIT_FOR_WATCHER, this.OnWaitForWatcher.bind(this));
    session.SessionHooks.UnSubscribeListener(SessionHooks.PLACE_ITEM, this.OnPlaceItem.bind(this))
    session.SessionHooks.UnSubscribeListener(SessionHooks.WATCHER_EXISTING, this.OnWatcherExisting.bind(this));
  }
}

module.exports = InitPlayerListener;
