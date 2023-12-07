import { WebSocket } from "ws";
import { BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { ConnectingMindsSocket } from "../..";
import { ConnectingMindsHooks } from "../hooks/connectingMindsHooks";
import { ConnectingMindsEvents } from "../../Connecting-Minds-Data-Types/types";
import { Session } from "../data/session";
import { ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";
import { ConnectToSession } from "../types/connectToSession";
import { EClientType } from "../types/clientType";

class ConnectToSessionListener extends BaseWebSocketListener {
  listenerKey: string;
  private _application: ConnectingMindsSocket;
  // private _player: 

  constructor(
    webSocketServer: ConnectingMindsSocket,
    webSocket: WebSocket,
    webSocketHooks: ConnectingMindsHooks
  ) {
    super(webSocketServer, webSocket, webSocketHooks);
    this._application = webSocketServer;
  }

  protected Init(): void { }
  protected SetKey(): void {
    this.listenerKey = ConnectingMindsEvents.CONNECT_TO_SESSION
  }
  public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void { }
  protected listener(body: ConnectToSession): void {
    const sessionID: string = body.SessionID
    const type: string = body.Type

    const session: Session | null = this._application.GetSession(sessionID);

    if (session === null) {
      const sessionNotFound: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.SESSION_NOT_FOUND)
      sessionNotFound.addData("Messsage", `Session mit der ID ${sessionID} konnte nicht gefunden werden.`)
      this.webSocket.send(sessionNotFound.JSONString)
    }

    if (type === EClientType.PLAYER) {
      if (session?.Player !== null) {
        const sessionIsOcupied: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.SESSION_IS_OCCUPIED)
        sessionIsOcupied.addData("Message", `Session ${sessionID} ist bereits mit einem Spieler belegt.`)
        this.webSocket.send(sessionIsOcupied.JSONString)
      }


    }
  }
}

module.exports = ConnectToSessionListener;
