import { WebSocket } from "ws";
import { BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { ConnectingMindsSocket } from "../..";
import { ConnectingMindsHooks } from "../hooks/connectingMindsHooks";
import { EClientType } from "../types/clientType";
import { Player } from "../data/player";
import { PassListener } from "../types/passListener";
import { ConnectingMindsEvents, CreateSession } from "../../Connecting-Minds-Data-Types/types";
import { Session } from "../data/session";
import { ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";

class CreateSessionListener
  extends BaseWebSocketListener
  implements PassListener {
  listenerKey: string;
  private _application: ConnectingMindsSocket;
  private _player: Player | null = null;

  constructor(
    webSocketServer: ConnectingMindsSocket,
    webSocket: WebSocket,
    webSocketHooks: ConnectingMindsHooks
  ) {
    super(webSocketServer, webSocket, webSocketHooks);
    this._application = webSocketServer;

    this.webSocketHooks.SubscribeHookListener(ConnectingMindsHooks.CREATE_PLAYER, this.OnCreatePlayer.bind(this));

    this.webSocketHooks.SubscribeHookListener(ConnectingMindsHooks.CREATE_SESSION, this.OnCreateSession.bind(this));
  }
  TakeSession(session: Session): void {

  }
  RemoveSession(session: Session): void {

  }

  private OnCreatePlayer(player: Player): void {
    this._player = player;
    player.TakeListener(this);
  }
  private OnCreateSession(session: Session): void {
    if (!this._player) {
      return;
    }
    const onCreateSession: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.ON_CREATE_SESSION);
    console.log("Session mit ID " + session.ID, "wurde erstellt")
    onCreateSession.addData("Session", session.ID);
    this.webSocket.send(onCreateSession.JSONString);
  }

  protected Init(): void { }
  protected SetKey(): void {
    this.listenerKey = ConnectingMindsEvents.CREATE_SESSION;
  }
  public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
    this.webSocketHooks.UnSubscribeListener(
      ConnectingMindsHooks.CREATE_PLAYER,
      this.OnCreatePlayer.bind(this)
    );
    this.webSocketHooks.UnSubscribeListener(
      ConnectingMindsHooks.CREATE_SESSION,
      this.OnCreateSession.bind(this)
    );
  }
  protected listener(body: CreateSession): void {
    const clientType: string = body.Type;
    if (clientType === EClientType.PLAYER && this._player === null) {
      this._application.CreatePlayer(this.webSocket, this.webSocketHooks);
    }
    this._application.CreateSession(this._player as Player);
  }
}

module.exports = CreateSessionListener;
