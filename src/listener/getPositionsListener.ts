import { WebSocket } from "ws";
import {
    BaseWebSocketExpressAdoon,
    BaseWebSocketListener,
} from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { ConnectingMindsEvents } from "../../Connecting-Minds-Data-Types/types";
import { ConnectingMindsSocket } from "../..";
import axios from "axios";
import { ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";

class GetPositionsListener extends BaseWebSocketListener {
    listenerKey: string;
    private _application: ConnectingMindsSocket;
    private _endpoint: string;

    constructor(
        webSocketServer: BaseWebSocketExpressAdoon,
        webSocket: WebSocket,
        hooks: WebSocketHooks
    ) {
        super(webSocketServer, webSocket, hooks);
        this._application = <ConnectingMindsSocket>this.webSocketServer;
        this._endpoint = "/api/mongoDB/world/availablePositions/get";
    }

    protected Init(): void { }
    protected SetKey(): void {
        this.listenerKey = ConnectingMindsEvents.GET_POSITIONS;
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void { }
    protected listener(body: any): void {
        const baseUrl: string = this._application.ExpressURL;
        axios
            .get(`${baseUrl + this._endpoint}`)
            .then(this.OnResponse.bind(this))
            .catch(this.OnError.bind(this));
    }

    private OnResponse(response: any): void {
        const responseEvent: ReceivedEvent = new ReceivedEvent(
            ConnectingMindsEvents.ON_GET_POSITIONS
        );
        responseEvent.addData("Positions", response.data);
        this.webSocket.send(responseEvent.JSONString);
    }
    private OnError(error: any): void {
        console.log(error);
    }
}

module.exports = GetPositionsListener;
