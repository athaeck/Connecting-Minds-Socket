import { WebSocket } from "ws";
import { BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { Session } from "../data/session";
import { PassListener } from "../types/passListener";
import { ConnectingMindsSocket } from "../..";
import { ConnectingMindsHooks } from "../hooks/connectingMindsHooks";
import { ConnectingMindsEvents, Item } from "../../Connecting-Minds-Data-Types/types";
import { Watcher } from "../data/watcher";
import { EmitSessionNetworkError } from "../helper/sessionNetworkError";
import { Player } from "../data/player";
import { ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";
import { SessionHooks } from "../hooks/sessionHooks";



class UnlockItemListener extends BaseWebSocketListener implements PassListener {
    listenerKey: string;
    private _player: Player | null = null
    private _session: Session | null = null

    constructor(webSocketServer: ConnectingMindsSocket, webSocket: WebSocket, webSocketHooks: ConnectingMindsHooks) {
        super(webSocketServer, webSocket, webSocketHooks);

        this.webSocketHooks.SubscribeHookListener(ConnectingMindsHooks.CREATE_PLAYER, this.OnCreatePlayer.bind(this))
    }
    private OnCreatePlayer(watcher: Watcher): void {
        this._player = watcher
        this._player.TakeListener(this)
    }

    protected Init(): void {

    }
    protected SetKey(): void {
        this.listenerKey = ConnectingMindsEvents.UNLOCK_ITEM
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
        this.webSocketHooks.UnSubscribeListener(ConnectingMindsHooks.CREATE_PLAYER, this.OnCreatePlayer.bind(this))
    }
    protected listener(body: Item): void {
        if (this._session === null) {
            EmitSessionNetworkError(this.webSocket)

            return;
        }
        this._session.UnlockItem(body)

        const sendMessage: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.SEND_MESSAGE)
        sendMessage.addData("Message", "Gegenstand wurde freigeschalten.")
        this._session.SessionHooks.DispatchHook(SessionHooks.SEND_MESSAGE, sendMessage)
    }
    TakeSession(session: Session): void {
        this._session = session
    }
    RemoveSession(session: Session): void {
        this._session = null
    }

}

module.exports = UnlockItemListener