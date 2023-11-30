import { WebSocket } from "ws";
import { BaseWebSocketExpressAdoon, BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { ConnectingMindsEvents, Player } from "../../Connecting-Minds-Data-Types/types";
import { ConnectingMindsSocket } from "../..";
import { Broadcast, ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";
import { ConnectingMindsHooks } from "../hooks/connectingMindsHooks";




class ConnectPlayerOneListener extends BaseWebSocketListener {
    listenerKey: string;
    private _application: ConnectingMindsSocket

    constructor(webSocketServer: BaseWebSocketExpressAdoon, webSocket: WebSocket, hooks: WebSocketHooks) {
        super(webSocketServer, webSocket, hooks)
        this._application = <ConnectingMindsSocket>this.webSocketServer

        this._application.ConnectingMindsHooks.SubscribeHookListener(ConnectingMindsHooks.CONNECT_PLAYER_ONE, this.OnConnectPlayerOne.bind(this))
    }

    protected Init(): void {

    }
    protected SetKey(): void {
        this.listenerKey = ConnectingMindsEvents.CONNECT_PLAYER_ONE
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
        this._application.ConnectingMindsHooks.UnSubscribeListener(ConnectingMindsHooks.CONNECT_PLAYER_ONE, this.OnConnectPlayerOne.bind(this))
    }
    private OnConnectPlayerOne(body: any): void {
        const onConnectPlayerOne: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.ON_CONNECT_PLAYER_ONE)

        this._application.PlayerTwo?.socket.send(onConnectPlayerOne.JSONString)
    }

    protected listener(body: any): void {
        const playerTwo: Player | null = this._application.PlayerTwo;
        if (playerTwo != null) {
            this._application.ConnectingMindsHooks.DispatchHook(ConnectingMindsHooks.CONNECT_PLAYER_TWO, null);
        } else {
            this._application.ConnectingMindsHooks.DispatchHook(ConnectingMindsHooks.DISCONNECT_PLAYER_TWO, null);
        }

        const hooks: ConnectingMindsHooks = <ConnectingMindsHooks>this.webSocketHooks
        this._application.TakePlayerOne(this.webSocket, hooks)


        this.OnConnectPlayerOne(null);
    }

}
module.exports = ConnectPlayerOneListener