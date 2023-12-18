import { WebSocket } from "ws";
import { BaseWebSocketExpressAdoon, BaseWebSocketListener, } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { ConnectingMindsEvents, FilesToIndex, Item, Path, Position, } from "../../Connecting-Minds-Data-Types/types";
import { ConnectingMindsSocket } from "../../index";
import { ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";
import axios from "axios";


type IndexType = {
  url: string;
};
type IndexTypeMapper = {
  [key in string]: IndexType;
};

const IndexTypeMapper: IndexTypeMapper = {
  ITEMS: {
    url: "/api/mongoDB/world/availableItems/set",
  },
  PATHS: {
    url: "/api/mongoDB/world/unlockedPaths/set",
  },
  POSITIONS: {
    url: "/api/mongoDB/world/availablePositions/set",
  },
};

type Starter = {
  Paths: Path[];
  Items: Item[];
  Positions: Position[]
}


class IndexDataListener extends BaseWebSocketListener {
  listenerKey: string;
  private _application: ConnectingMindsSocket;

  constructor(webSocketServer: ConnectingMindsSocket, webSocket: WebSocket, hooks: WebSocketHooks) {
    super(webSocketServer, webSocket, hooks);
    this._application = webSocketServer;
  }

  protected Init(): void { }
  protected SetKey(): void {
    this.listenerKey = ConnectingMindsEvents.INDEX_DATA;
  }
  public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void { }
  protected listener(body: FilesToIndex): void {

    const type: string = body.IndexType;

    const indexedData: any = body.DataToIndex;

    const baseUrl: string = this._application.ExpressURL;

    if (type === "STARTER") {
      const starter: Starter = indexedData[0] as Starter
      axios.post(`${baseUrl + IndexTypeMapper["PATHS"].url}`, starter.Paths).then(this.OnUpdate.bind(this)).catch(this.OnCatchError.bind(this));
      axios.post(`${baseUrl + IndexTypeMapper["ITEMS"].url}`, starter.Items).then(this.OnUpdate.bind(this)).catch(this.OnCatchError.bind(this));
      axios.post(`${baseUrl + IndexTypeMapper["POSITIONS"].url}`, starter.Positions).then(this.OnUpdate.bind(this)).catch(this.OnCatchError.bind(this));

      this.OnResponse({ data: "finished" })
    } else {
      axios.post(`${baseUrl + IndexTypeMapper[type].url}`, indexedData).then(this.OnResponse.bind(this)).catch(this.OnCatchError.bind(this));
    }
  }
  private OnResponse(response: any) {
    const responseEvent: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.FINISHED_INDEXING);
    responseEvent.addData("State", response.data);

    this.webSocket.send(responseEvent.JSONString);
  }
  private OnUpdate(response: any) {
    const responseEvent: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.INDEXING_STEP_FORWARD);
    responseEvent.addData("State", response.data);
    this.webSocket.send(responseEvent.JSONString);
  }
  private OnCatchError(e: any) {
    this.webSocket.send(this.GetMessageEvent(e.toString()))
  }
  private GetMessageEvent(message: string): string {
    const responseEvent: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.ON_INDEX_DATA);
    responseEvent.addData("Message", message);
    return responseEvent.JSONString;
  }
}
module.exports = IndexDataListener;
