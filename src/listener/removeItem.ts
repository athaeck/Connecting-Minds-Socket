import { WebSocket } from "ws";
import { BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { Session } from "../data/session";
import { PassListener } from "../types/passListener";
import { ConnectingMindsSocket } from "../../index";
import { ConnectingMindsEvents, PlacedItem } from "../../Connecting-Minds-Data-Types/types";
import { ConnectingMindsHooks } from "../hooks/connectingMindsHook";
import { Watcher } from "../data/watcher";
import { EmitSessionNetworkError } from "../helper/sessionNetworkError";
import { ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";
import { SessionHooks } from "../hooks/sessionHooks";


class RemoveItemListener extends BaseWebSocketListener implements PassListener {
    listenerKey: string;
    private _session: Session | null = null;
    private _application: ConnectingMindsSocket

    constructor(webSocketServer: ConnectingMindsSocket, webSocket: WebSocket, webSocketHooks: ConnectingMindsHooks) {
        super(webSocketServer, webSocket, webSocketHooks);
        this._application = webSocketServer;

        this.webSocketHooks.SubscribeHookListener(ConnectingMindsHooks.CREATE_WATCHER, this.OnCreateWatcher.bind(this));
    }

    private OnCreateWatcher(watcher: Watcher): void {
        watcher.TakeListener(this)
    }

    protected Init(): void {

    }
    protected SetKey(): void {
        this.listenerKey = ConnectingMindsEvents.REMOVE_ITEM
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
        this.webSocketHooks.UnSubscribeListener(ConnectingMindsHooks.CREATE_WATCHER, this.OnCreateWatcher.bind(this));
    }
    protected listener(body: any): void {
        if (this._session === null) {
            EmitSessionNetworkError(this.webSocket)

            return
        }
        const removedItem:PlacedItem = body.PlacedItem
        this._session.RemoveItem(removedItem)

        const sendMessage: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.SEND_MESSAGE)
        sendMessage.addData("Message", "Gegenstand wurde entfernt.")
        this._session.SessionHooks.DispatchHook(SessionHooks.SEND_MESSAGE, sendMessage)
    }
    TakeSession(session: Session): void {
        this._session = session
    }
    RemoveSession(session: Session): void {
        this._session = null
    }

}

module.exports = RemoveItemListener