import { WebSocket } from "ws";
import { BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { ConnectingMindsSocket } from "../..";
import { ConnectingMindsHooks } from "../hooks/connectingMindsHooks";
import { ConnectingMindsEvents } from "../../Connecting-Minds-Data-Types/types";
import { Session } from "../data/session";

class ConnectToSessionListener extends BaseWebSocketListener {
  listenerKey: string;
  private _application: ConnectingMindsSocket;

  constructor(
    webSocketServer: ConnectingMindsSocket,
    webSocket: WebSocket,
    webSocketHooks: ConnectingMindsHooks
  ) {
    super(webSocketServer, webSocket, webSocketHooks);
    this._application = webSocketServer;
  }

  protected Init(): void {}
  protected SetKey(): void {
    this.listenerKey = ConnectingMindsEvents.CONNECT_TO_SESSION
  }
  public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {}
  protected listener(body: any): void {
    const sessionID:string = body.data

    const session: Session | null = this._application.GetSession(sessionID);

    if(session === null){
        
    }
  }
}

module.exports = ConnectToSessionListener;
