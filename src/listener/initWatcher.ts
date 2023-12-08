import { WebSocket } from "ws";
import { BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { Session } from "../data/session";
import { PassListener } from "../types/passListener";
import { ConnectingMindsSocket } from "../..";
import { ConnectingMindsHooks } from "../hooks/connectingMindsHooks";



class InitWatcherListener extends BaseWebSocketListener implements PassListener{
    listenerKey: string;
    private _application:ConnectingMindsSocket

    constructor(
        webSocketServer: ConnectingMindsSocket,
        webSocket: WebSocket,
        webSocketHooks: ConnectingMindsHooks
      ) {
        super(webSocketServer, webSocket, webSocketHooks);
        this._application = webSocketServer;
      }

    protected Init(): void {
        
    }
    protected SetKey(): void {
        
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
        
    }
    protected listener(body: any): void {
        
    }
    TakeSession(session: Session): void {
        
    }
    RemoveSession(session: Session): void {
        
    }
}

module.exports = InitWatcherListener