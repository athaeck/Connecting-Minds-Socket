import { WebSocket } from "ws";
import { BaseWebSocketExpressAdoon, BaseWebSocketListener } from "../../athaeck-websocket-express-base/base"
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { ConnectingMindsEvents } from "../../Connecting-Minds-Data-Types/types";
import { ConnectingMindsSocket } from "../..";
import axios from "axios";




class GetItemsListener extends BaseWebSocketListener {
    listenerKey: string;
    private _endpoint: string;
    private _application: ConnectingMindsSocket

    constructor(webSocketServer: BaseWebSocketExpressAdoon, webSocket: WebSocket, hooks: WebSocketHooks) {
        super(webSocketServer, webSocket, hooks);
        this._application = <ConnectingMindsSocket>this.webSocketServer;
        this._endpoint = "/api/mongoDB/world/availableItems/get"
    }

    protected Init(): void {

    }
    protected SetKey(): void {
        this.listenerKey = ConnectingMindsEvents.GET_ITEMS
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {

    }
    protected listener(body: any): void {

        const baseUrl: string = this._application.ExpressURL;
        axios.get(`${baseUrl + this._endpoint}`).then(this.OnResponse.bind(this)).catch(this.OnError.bind(this));

    }
    private OnError(error: any): void {
        console.log(error)
    }
    private OnResponse(response: any) {
        console.log(response)

    }

}

module.exports = GetItemsListener