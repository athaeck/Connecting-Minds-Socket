import { WebSocket } from "ws";
import { BaseWebSocketExpressAdoon, BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { ConnectingMindsSocket } from "../..";
import { ConnectingMindsEvents, Item } from "../../Connecting-Minds-Data-Types/types";
import { Broadcast, ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";


class PlaceItemListener extends BaseWebSocketListener {
    listenerKey: string;
    private _application: ConnectingMindsSocket

    constructor(webSocketServer: BaseWebSocketExpressAdoon, webSocket: WebSocket, hooks: WebSocketHooks) {
        super(webSocketServer, webSocket, hooks)
    }
    protected Init(): void {
        this._application = <ConnectingMindsSocket>this.webSocketServer
    }
    protected SetKey(): void {
        this.listenerKey = ConnectingMindsEvents.PLACE_ITEM
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {

    }
    protected listener(body: any): void {
        // const item: Item = <Item>body

        // const placeItemEvent: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.ON_PLACE_ITEM)
        // placeItemEvent.addData("Item", item)


        

    }

}

module.exports = PlaceItemListener