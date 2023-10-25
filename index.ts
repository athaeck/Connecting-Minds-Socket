import { WebSocket } from "ws";
import { AddRoute, BaseExpressRoute } from "./athaeck-websocket-express-base/athaeck-express-base/base/express";
import { BaseWebSocketExpressAdoon } from "./athaeck-websocket-express-base/base";
import { WebSocketHooks } from "./athaeck-websocket-express-base/base/hooks";
import { ConnectingMindsServerAdapterFactory, ConnectingMindsSocketListenerFactory } from "./src";
import bodyParser from "body-parser"






export class ConnectingMindsSocket extends BaseWebSocketExpressAdoon{
    // private _connectingMinds


    constructor(port:number){
        super(port)
        this.factory = new ConnectingMindsSocketListenerFactory("./listener/")
        this.initializeMiddleware()
        this.apiFactory = new ConnectingMindsServerAdapterFactory("./api/")
        this.apiFactory.ConnectAdpater(this)
    }

    Init(webSocket: WebSocket, hooks: WebSocketHooks): void {
        
    }
    Disconnect(webSocket: WebSocket): WebSocketHooks | undefined {
        return undefined
    }
    AddRoute(route: BaseExpressRoute): void {
        this.app = AddRoute(this.app,route)
    }
    initializeMiddleware(): void {
        this.app.use(bodyParser.json());
    }   
}

export const connectingMindsSocket: ConnectingMindsSocket = new ConnectingMindsSocket(8080)
connectingMindsSocket.Start()