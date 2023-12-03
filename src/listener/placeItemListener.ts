import { WebSocket } from "ws";
import { BaseWebSocketExpressAdoon, BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { ConnectingMindsSocket } from "../..";
import { ConnectingMindsEvents, Item, PlacedItem, Position } from "../../Connecting-Minds-Data-Types/types";
import { Broadcast, ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";
import axios from "axios";


class PlaceItemListener extends BaseWebSocketListener {
    listenerKey: string;
    private _application: ConnectingMindsSocket
    private _removePositionFromSelectionEndpoint:string="/api/mongoDB/world/availablePositions/del"
    private _removeItemFromSelectionEndpoint:string ="/api/mongoDB/world/availableItems/del"

    constructor(webSocketServer: BaseWebSocketExpressAdoon, webSocket: WebSocket, hooks: WebSocketHooks) {
        super(webSocketServer, webSocket, hooks)
        this._application = <ConnectingMindsSocket>this.webSocketServer
    }
    protected Init(): void {
        
    }
    protected SetKey(): void {
        this.listenerKey = ConnectingMindsEvents.PLACE_ITEM
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {

    }
    protected async listener(body: any): Promise<void> {

        if(this._application.PlayerOne === null && this._application.PlayerTwo === null){
            return;
        }

        const placedItemData: PlacedItem = <PlacedItem>body

        // const convertedItemToPlace = ConvertItemToPlaceData(placedItemData);
        const placeItemPlayerOne: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.ON_PLACE_ITEM);
        placeItemPlayerOne.addData("ItemToPlace",placedItemData)

        if(this._application.PlayerOne){
            this._application.PlayerOne.socket.send(placeItemPlayerOne.JSONString)
        }

        const baseUrl: string = this._application.ExpressURL;

        try{
            const newItemSelections:Item[] = await axios.delete(baseUrl + this._removeItemFromSelectionEndpoint,{
                data:placedItemData.Item._id
            })
            const newPositionSelections:Position[] = await axios.delete(baseUrl + this._removePositionFromSelectionEndpoint,{
                data:placedItemData.Position._id
            })

            const newSynchronicedSelection:ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.ON_PLACE_ITEM)
            newSynchronicedSelection.addData("Items",newItemSelections)
            newSynchronicedSelection.addData("Positions",newPositionSelections)

            this.webSocket.send(newSynchronicedSelection.JSONString)

        }catch(error:any){
            console.log("error at set and get new values on item placement with following reasons: ",error)
        }
    }

}
// axios.get(`${baseUrl + this._endpoint}`).then(this.OnResponse.bind(this)).catch(this.OnError.bind(this));
function ConvertItemToPlaceData(itemToPlace:PlacedItem){
    let itpd: PlacedItem = itemToPlace
    delete itpd.Item._id
    delete itpd.Position._id
    return itpd
}

module.exports = PlaceItemListener