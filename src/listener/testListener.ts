import { WebSocket } from "ws";
import { BaseWebSocketExpressAdoon, BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { ConnectingMindsEvents } from "../../Connecting-Minds-Data-Types/types";
import { ConnectingMindsSocket } from "../..";
import { Broadcast, ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";
// import { ConnectingMindsHooks } from "../hooks/connectingMindsHooks";




class TestListener extends BaseWebSocketListener {
    listenerKey: string;

    constructor(webSocketServer: BaseWebSocketExpressAdoon, webSocket: WebSocket, hooks: WebSocketHooks) {
        super(webSocketServer, webSocket, hooks)
    }

    protected Init(): void {
    }
    protected SetKey(): void {
        this.listenerKey = ConnectingMindsEvents.TEST
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {

    }
    protected listener(body: any): void {
        const onConnectPlayerOne: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.ON_CONNECT_PLAYER_ONE)
        onConnectPlayerOne.addData("Test","Test")
        Broadcast(this.webSocketServer.WebSocketServer, (ws: WebSocket) => {
            ws.send(onConnectPlayerOne.JSONString)
        })
    }

}
module.exports = TestListener