import { WebSocket } from "ws";
import { BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { Session } from "../data/session";
import { PassListener } from "../types/passListener";


class RotateItemListener extends BaseWebSocketListener implements PassListener{
    listenerKey: string;

    

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

module.exports = RotateItemListener