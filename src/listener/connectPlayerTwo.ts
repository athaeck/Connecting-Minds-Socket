import { WebSocket } from "ws";
import { BaseWebSocketExpressAdoon, BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { ConnectingMindsEvents, Player } from "../../Connecting-Minds-Data-Types/types";
import { ConnectingMindsSocket } from "../..";
import { Broadcast, ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";
import { ConnectingMindsHooks } from "../hooks/connectingMindsHooks";


class ConnectPlayerTwoListener extends BaseWebSocketListener {
    listenerKey: string;
    private _application: ConnectingMindsSocket

    constructor(webSocketServer: BaseWebSocketExpressAdoon, webSocket: WebSocket, hooks: WebSocketHooks) {
        super(webSocketServer, webSocket, hooks)
        this._application = <ConnectingMindsSocket>this.webSocketServer
        this._application.ConnectingMindsHooks.SubscribeHookListener(ConnectingMindsHooks.CONNECT_PLAYER_TWO, this.ConnectPlayerTwo.bind(this))
    }

    protected Init(): void {

    }
    protected SetKey(): void {
        this.listenerKey = ConnectingMindsEvents.CONNECT_PLAYER_TWO
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
        this._application.ConnectingMindsHooks.UnSubscribeListener(ConnectingMindsHooks.CONNECT_PLAYER_TWO, this.ConnectPlayerTwo.bind(this))
    }
    private ConnectPlayerTwo(body: any) {
        const onConnectPlayerTwo: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.ON_CONNECT_PLAYER_TWO)

        this._application.PlayerOne?.socket.send(onConnectPlayerTwo.JSONString)
    }
    protected listener(body: any): void {
        const playerOne: Player | null = this._application.PlayerOne;
        if (playerOne != null) {
            this._application.ConnectingMindsHooks.DispatchHook(ConnectingMindsHooks.CONNECT_PLAYER_ONE, null);
        } else {
            this._application.ConnectingMindsHooks.DispatchHook(ConnectingMindsHooks.DISCONNECT_PLAYER_ONE, null);
        }

        const hooks: ConnectingMindsHooks = <ConnectingMindsHooks>this.webSocketHooks
        this._application.TakePlayerTwo(this.webSocket, hooks)

        this.ConnectPlayerTwo(null)
    }
}

module.exports = ConnectPlayerTwoListener