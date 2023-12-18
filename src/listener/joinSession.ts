import { WebSocket } from "ws";
import { BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { ConnectingMindsSocket } from "../../index";
import { ConnectingMindsHooks } from "../hooks/connectingMindsHooks";
import { ConnectToSession, ConnectingMindsEvents, EClientType } from "../../Connecting-Minds-Data-Types/types";
import { Session } from "../data/session";
import { ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";

import { Player } from "../data/player";
import { PassListener } from "../types/passListener";
import { Watcher } from "../data/watcher";
import { SessionHooks } from "../hooks/sessionHooks";

class JoinSessionListener extends BaseWebSocketListener implements PassListener {
  listenerKey: string;
  private _application: ConnectingMindsSocket;
  private _player: Player | null = null;
  private _watcher: Watcher | null = null
  private _session: Session | null;

  constructor(webSocketServer: ConnectingMindsSocket, webSocket: WebSocket, webSocketHooks: ConnectingMindsHooks) {
    super(webSocketServer, webSocket, webSocketHooks);
    this._application = webSocketServer;

    this.webSocketHooks.SubscribeHookListener(ConnectingMindsHooks.CREATE_PLAYER, this.OnCreatePlayer.bind(this));
    this.webSocketHooks.SubscribeHookListener(ConnectingMindsHooks.CREATE_WATCHER, this.OnCreateWatcher.bind(this));
    this.webSocketHooks.SubscribeHookListener(ConnectingMindsHooks.JOIN_SESSION, this.OnJoinSession.bind(this));

  }

  TakeSession(session: Session): void {
    this._session = session
    this._session.SessionHooks.SubscribeHookListener(SessionHooks.SEND_MESSAGE, this.OnSendMessage.bind(this))
  }

  private OnSendMessage(sendMessage: ReceivedEvent): void {
    this.webSocket.send(sendMessage.JSONString)
  }

  RemoveSession(session: Session): void {
    session.SessionHooks.UnSubscribeListener(SessionHooks.SEND_MESSAGE, this.OnSendMessage.bind(this))
    this._session = null
  }

  private OnJoinSession(session: Session): void {
    const onJoinSession: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.ON_JOIN_SESSION);
    console.log("Session " + session.ID, " wurde beigetreten")
    onJoinSession.addData("Session", session.ID);
    this.webSocket.send(onJoinSession.JSONString);
  }

  private OnCreatePlayer(player: Player): void {
    this._player = player;
    player.TakeListener(this);
  }

  private OnCreateWatcher(watcher: Watcher): void {
    this._watcher = watcher
    watcher.TakeListener(this)
  }

  protected Init(): void { }

  protected SetKey(): void {
    this.listenerKey = ConnectingMindsEvents.JOIN_SESSION
  }

  public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
    this.webSocketHooks.UnSubscribeListener(ConnectingMindsHooks.CREATE_PLAYER, this.OnCreatePlayer.bind(this));
    this.webSocketHooks.UnSubscribeListener(ConnectingMindsHooks.JOIN_SESSION, this.OnJoinSession.bind(this));
    this.webSocketHooks.UnSubscribeListener(ConnectingMindsHooks.CREATE_WATCHER, this.OnCreateWatcher.bind(this));
  }

  protected listener(body: ConnectToSession): void {
    const sessionID: string = body.SessionID
    const type: string = body.Type

    const session: Session | null = this._application.GetSession(sessionID);

    if (session === null) {
      const sessionNotFound: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.SESSION_NOT_FOUND)
      sessionNotFound.addData("Messsage", `Session ${sessionID} konnte nicht gefunden werden.`)
      this.webSocket.send(sessionNotFound.JSONString)

      return;
    }

    if (type === EClientType.PLAYER) {
      if (session.Player !== null) {
        const sessionIsOcupied: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.SESSION_IS_OCCUPIED)
        sessionIsOcupied.addData("Message", `Session ${sessionID} ist bereits mit einem Spieler belegt.`)
        this.webSocket.send(sessionIsOcupied.JSONString)

        return;
      }
      if (this._player === null) {
        this._application.CreatePlayer(this.webSocket, this.webSocketHooks)
      }
      this._application.JoinSessionAsPlayer(this._player as Player, session);
    }
    if (type === EClientType.WATCHER) {
      if (this._watcher === null) {
        this._application.CreateWatcher(this.webSocket, this.webSocketHooks)
      }

      if (this._application.IsWatcherContaining(this._watcher as Watcher)) {
        const isAlreadyInASession: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.WATCHER_IS_CONTAINING)
        isAlreadyInASession.addData("Message", `Du bist bereits in einer Session`)
        this.webSocket.send(isAlreadyInASession.JSONString)
        return;
      }

      this._application.JoinSessionAsWatcher(this._watcher as Watcher, session);
    }
  }
}

module.exports = JoinSessionListener;
