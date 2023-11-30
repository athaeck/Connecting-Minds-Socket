import { WebSocket } from "ws";
import { BaseWebSocketExpressAdoon, BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { ConnectingMindsEvents } from "../../Connecting-Minds-Data-Types/types";
import { ConnectingMindsSocket } from "../..";
import { Broadcast, ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";
import { ConnectingMindsHooks } from "../hooks/connectingMindsHooks";


class DisconnectPlayerTwoListener extends BaseWebSocketListener {
    listenerKey: string;
    private _application: ConnectingMindsSocket

    constructor(webSocketServer: BaseWebSocketExpressAdoon, webSocket: WebSocket, hooks: WebSocketHooks) {
        super(webSocketServer, webSocket, hooks)
        this._application = <ConnectingMindsSocket>this.webSocketServer

        this._application.ConnectingMindsHooks.SubscribeHookListener(ConnectingMindsHooks.DISCONNECT_PLAYER_TWO, this.OnDisconnectPlayerTwo.bind(this))
    }

    protected Init(): void {

    }
    protected SetKey(): void {
        this.listenerKey = ConnectingMindsEvents.DISCONNECT_PLAYER_TWO
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
        this._application.ConnectingMindsHooks.UnSubscribeListener(ConnectingMindsHooks.DISCONNECT_PLAYER_TWO, this.OnDisconnectPlayerTwo.bind(this))
    }
    private OnDisconnectPlayerTwo(body: any): void {
        const waitForPlayerTwo: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.WAIT_FOR_PLAYER_TWO)

        this._application.PlayerOne?.socket.send(waitForPlayerTwo.JSONString)
    }
    protected listener(body: any): void {
        this.OnDisconnectPlayerTwo(null);
    }

}

module.exports = DisconnectPlayerTwoListener