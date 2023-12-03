import { WebSocket } from "ws";
import {
  BaseWebSocketExpressAdoon,
  BaseWebSocketListener,
} from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import {
  ConnectingMindsEvents,
  FilesToIndex,
} from "../../Connecting-Minds-Data-Types/types";
import { ConnectingMindsSocket } from "../..";
import {
  ReceivedEvent,
} from "../../athaeck-websocket-express-base/base/helper";
import axios from "axios";


type IndexType = {
  url: string;
};
type IndexTypeMapper = {
  [key in string]: IndexType;
};

const IndexTypeMapper: IndexTypeMapper = {
  ITEMS: {
    url: "/api/mongoDB/world/items/set",
  },
  PATHS: {
    url: "/api/mongoDB/world/paths/set",
  },
  POSITIONS: {
    url: "/api/mongoDB/world/positions/set",
  },
};


class IndexDataListener extends BaseWebSocketListener {
  listenerKey: string;
  private _application: ConnectingMindsSocket;

  constructor(
    webSocketServer: BaseWebSocketExpressAdoon,
    webSocket: WebSocket,
    hooks: WebSocketHooks
  ) {
    super(webSocketServer, webSocket, hooks);
    this._application = <ConnectingMindsSocket>this.webSocketServer;
  }

  protected Init(): void {}
  protected SetKey(): void {
    this.listenerKey = ConnectingMindsEvents.INDEX_DATA;
  }
  public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {}
  protected listener(body: any): void {
    const data = <FilesToIndex>body;

    const type: string = data.IndexType;

    const indexedData: any = data.DataToIndex;

    const baseUrl: string = this._application.ExpressURL;

    axios
      .post(`${baseUrl + IndexTypeMapper[type].url}`, indexedData)
      .then(this.OnResponse.bind(this))
      .catch(this.OnCatchError.bind(this));
  }
  private OnResponse(response: any) {
    const responseEvent: ReceivedEvent = new ReceivedEvent(
      ConnectingMindsEvents.FINISHED_INDEXING
    );
    responseEvent.addData("State", response.data);

    this.webSocket.send(responseEvent.JSONString);
  }
  private OnCatchError(e: any) {
    this.webSocket.send(this.GetMessageEvent(e.toString()))
  }
  private GetMessageEvent(message: string): string {
    const responseEvent: ReceivedEvent = new ReceivedEvent(
      ConnectingMindsEvents.ON_INDEX_DATA
    );
    responseEvent.addData("Message", message);
    return responseEvent.JSONString;
  }
}
module.exports = IndexDataListener;
