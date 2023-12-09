import { WebSocket } from "ws";
import { BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { Session } from "../data/session";
import { PassListener } from "../types/passListener";
import { ConnectingMindsSocket } from "../..";
import { ConnectingMindsHooks } from "../hooks/connectingMindsHooks";
import { ConnectingMindsEvents, Item, Path, PlaceItemProxy, PlacedItem, Position } from "../../Connecting-Minds-Data-Types/types";
import { Watcher } from "../data/watcher";
import { ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";
import { SessionHooks } from "../hooks/sessionHooks";
import { Player } from "../data/player";

class InitWatcherListener
  extends BaseWebSocketListener
  implements PassListener
{
  listenerKey: string;
  private _application: ConnectingMindsSocket;
  private _watcher: Watcher | null = null;
  private _session: Session| null = null;

  constructor(
    webSocketServer: ConnectingMindsSocket,
    webSocket: WebSocket,
    webSocketHooks: ConnectingMindsHooks
  ) {
    super(webSocketServer, webSocket, webSocketHooks);
    this._application = webSocketServer;

    this.webSocketHooks.SubscribeHookListener(ConnectingMindsHooks.CREATE_WATCHER,this.OnCreateWatcher.bind(this));
  }

  private OnCreateWatcher(watcher: Watcher): void {
    this._watcher = watcher;
    watcher.TakeListener(this);
  }
  protected Init(): void {}

  protected SetKey(): void {
    this.listenerKey = ConnectingMindsEvents.INIT_WATCHER;
  }
  public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
    this.webSocketHooks.UnSubscribeListener(ConnectingMindsHooks.CREATE_WATCHER,this.OnCreateWatcher.bind(this));
  }
  protected listener(body: any): void {

    if(!this._session){
        const sessionMissing: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.MISSING)
        sessionMissing.addData("Message","Es ist ein Netzwerk Fehler aufgetreten.")
        this.webSocket.send(sessionMissing.JSONString)
  
        return;
    }

    const availableItems:Item[] = this._session.AvailableItems
    const availablePositions:Position[] = this._session.AvailablePositions
    const unlockedPaths:Path[] = this._session.UnlockedPaths
    const placedItems:PlacedItem[] = this._session.PlacedItems
    const containsPlayer:boolean = this._session.Player != null

    const initWatcher:ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.ON_INIT_WATCHER)
    initWatcher.addData("SessionData",{
        ContainsPlayer:containsPlayer,
        PlacedItems:placedItems,
        UnlockedPaths:unlockedPaths,
        AvailablePositions:availablePositions,
        AvailableItems:availableItems
    })
    this.webSocket.send(initWatcher.JSONString)

  }
  TakeSession(session: Session): void {
    this._session = session

    session.SessionHooks.SubscribeHookListener(SessionHooks.SEND_MESSAGE,this.OnSendMessage.bind(this))

    if(!this._watcher){
        return;
    }
    session.SessionHooks.SubscribeHookListener(SessionHooks.CONNECT_PLAYER,this.OnConnectPlayer.bind(this));
    session.SessionHooks.SubscribeHookListener(SessionHooks.DISCONNECT_PLAYER,this.OnDisconnectPlayer.bind(this))
    session.SessionHooks.SubscribeHookListener(SessionHooks.PLACE_ITEM, this.OnPlaceItem.bind(this))
  }

  private OnSendMessage(sendMessage:ReceivedEvent): void{
    this.webSocket.send(sendMessage.JSONString)
  }

  private OnPlaceItem(proxy:PlaceItemProxy):void{
    const onPlaceItems:ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.ON_PLACE_ITEM)
    onPlaceItems.addData("PlacedItemProxy",proxy)
    this.webSocket.send(onPlaceItems.JSONString)
  }

  private OnConnectPlayer(player:Player): void{
    const playerConnected:ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.CONNECT_PLAYER)
    this.webSocket.send(playerConnected.JSONString)
  }

  private OnDisconnectPlayer(player:Player): void{
    const playerDisconnected:ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.DISCONNECT_PLAYER)
    this.webSocket.send(playerDisconnected.JSONString)
  }

  RemoveSession(session: Session): void {
    this._session = null

    session.SessionHooks.UnSubscribeListener(SessionHooks.SEND_MESSAGE,this.OnSendMessage.bind(this))

    if(!this._watcher){
        return;
    }
    session.SessionHooks.UnSubscribeListener(SessionHooks.PLACE_ITEM, this.OnPlaceItem.bind(this))
    session.SessionHooks.UnSubscribeListener(SessionHooks.CONNECT_PLAYER,this.OnConnectPlayer.bind(this));
    session.SessionHooks.UnSubscribeListener(SessionHooks.DISCONNECT_PLAYER,this.OnDisconnectPlayer.bind(this))
  }
}

module.exports = InitWatcherListener;