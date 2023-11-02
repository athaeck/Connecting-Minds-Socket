import { WebSocket } from "ws";
import { BaseWebSocketExpressAdoon, BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { ConnectingMindsEvents } from "../../Connecting-Minds-Data-Types/types";
import { ConnectingMindsSocket } from "../..";
import { Broadcast, ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";


class DisconnectPlayerOneListener extends BaseWebSocketListener{
    listenerKey: string;
    private _application:ConnectingMindsSocket

    constructor(webSocketServer: BaseWebSocketExpressAdoon, webSocket: WebSocket, hooks: WebSocketHooks) {
        super(webSocketServer, webSocket, hooks)
    }

    protected Init(): void {
        this._application = <ConnectingMindsSocket>this.webSocketServer
    }
    protected SetKey(): void {
        this.listenerKey = ConnectingMindsEvents.DISCONNECT_PLAYER_ONE
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
        
    }
    protected listener(body: any): void {
        const waitForPlayerOne:ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.WAIT_FOR_PLAYER_ONE)

        Broadcast(this._application.WebSocketServer,(ws:WebSocket)=>{
            if(ws === this.webSocket){
                return
            }
            ws.send(waitForPlayerOne.JSONString)
        })
    }
    
}

module.exports = DisconnectPlayerOneListener