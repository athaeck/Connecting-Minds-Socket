import { WebSocket } from "ws";
import { BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { Session } from "../data/session";
import { PassListener } from "../types/passListener";
import { ConnectingMindsHooks } from "../hooks/connectingMindsHooks";
import { ConnectingMindsSocket } from "../..";
import { ConnectingMindsEvents } from "../../Connecting-Minds-Data-Types/types";


class RotateItemListener extends BaseWebSocketListener implements PassListener {
    listenerKey: string;
    private _application: ConnectingMindsSocket

    constructor(webSocketServer: ConnectingMindsSocket, webSocket: WebSocket, webSocketHooks: ConnectingMindsHooks) {
        super(webSocketServer, webSocket, webSocketHooks);
        this._application = webSocketServer;
    }


    protected Init(): void {

    }
    protected SetKey(): void {
        this.listenerKey = ConnectingMindsEvents.ROTATE_ITEM
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

// hierfür müsste ich die Rotation innerhalb des Items abspeichern