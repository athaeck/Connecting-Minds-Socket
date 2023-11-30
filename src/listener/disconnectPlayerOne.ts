import { WebSocket } from "ws";
import { BaseWebSocketExpressAdoon, BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { ConnectingMindsEvents } from "../../Connecting-Minds-Data-Types/types";
import { ConnectingMindsSocket } from "../..";
import { Broadcast, ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";
import { ConnectingMindsHooks } from "../hooks/connectingMindsHooks";


class DisconnectPlayerOneListener extends BaseWebSocketListener {
    listenerKey: string;
    private _application: ConnectingMindsSocket

    constructor(webSocketServer: BaseWebSocketExpressAdoon, webSocket: WebSocket, hooks: WebSocketHooks) {
        super(webSocketServer, webSocket, hooks)
        this._application = <ConnectingMindsSocket>this.webSocketServer

        this._application.ConnectingMindsHooks.SubscribeHookListener(ConnectingMindsHooks.DISCONNECT_PLAYER_ONE, this.OnDisconnectPlayerOne.bind(this))
    }

    protected Init(): void {

    }
    protected SetKey(): void {
        this.listenerKey = ConnectingMindsEvents.DISCONNECT_PLAYER_ONE
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
        this._application.ConnectingMindsHooks.UnSubscribeListener(ConnectingMindsHooks.DISCONNECT_PLAYER_ONE, this.OnDisconnectPlayerOne.bind(this))
    }
    private OnDisconnectPlayerOne(body: any): void {
        const waitForPlayerOne: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.WAIT_FOR_PLAYER_ONE)

        this._application.PlayerTwo?.socket.send(waitForPlayerOne.JSONString)
    }
    protected listener(body: any): void {
        this.OnDisconnectPlayerOne(null)
    }

}

module.exports = DisconnectPlayerOneListener