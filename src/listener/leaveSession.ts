import { WebSocket } from "ws";
import { BaseWebSocketListener } from "../../athaeck-websocket-express-base/base";
import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";
import { Session } from "../data/session";
import { PassListener } from "../types/passListener";
import { ConnectingMindsHooks } from "../hooks/connectingMindsHooks";
import { ConnectingMindsSocket } from "../..";
import { Watcher } from "../data/watcher";
import { Player } from "../data/player";
import { ConnectingMindsEvents, LeaveSession } from "../../Connecting-Minds-Data-Types/types";
import { ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper";
import { EClientType } from "../types/clientType";


class LeaveSessionListener extends BaseWebSocketListener implements PassListener {
    listenerKey: string;
    private _application: ConnectingMindsSocket;
    private _player: Player | null = null;
    private _watcher: Watcher | null = null
    private _session: Session | null;

    constructor(webSocketServer: ConnectingMindsSocket, webSocket: WebSocket, webSocketHooks: ConnectingMindsHooks) {
        super(webSocketServer, webSocket, webSocketHooks);
        this._application = webSocketServer;

        this.webSocketHooks.SubscribeHookListener(ConnectingMindsHooks.LEAVE_SESSION, this.OnLeaveSession.bind(this));
        this.webSocketHooks.SubscribeHookListener(ConnectingMindsHooks.CREATE_PLAYER, this.OnCreatePlayer.bind(this));
        this.webSocketHooks.SubscribeHookListener(ConnectingMindsHooks.CREATE_WATCHER, this.OnCreateWatcher.bind(this));
    }

    private OnLeaveSession(session: Session): void {
        const onLeaveSession: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.ON_LEAVE_SESSION);
        console.log("Session " + session.ID, " wurde verlassen")
        onLeaveSession.addData("Session", session.ID);
        this.webSocket.send(onLeaveSession.JSONString);
    }

    private OnCreateWatcher(watcher: Watcher): void {
        this._watcher = watcher
        watcher.TakeListener(this)
    }

    private OnCreatePlayer(player: Player): void {
        this._player = player;
        player.TakeListener(this);
    }

    protected Init(): void {

    }
    protected SetKey(): void {
        this.listenerKey = ConnectingMindsEvents.LEAVE_SESSION
    }
    public OnDisconnection(webSocket: WebSocket, hooks: WebSocketHooks): void {
        this.webSocketHooks.UnSubscribeListener(ConnectingMindsHooks.LEAVE_SESSION, this.OnLeaveSession.bind(this));
        this.webSocketHooks.UnSubscribeListener(ConnectingMindsHooks.CREATE_PLAYER, this.OnCreatePlayer.bind(this));
        this.webSocketHooks.UnSubscribeListener(ConnectingMindsHooks.CREATE_WATCHER, this.OnCreateWatcher.bind(this));
    }
    protected listener(body: LeaveSession): void {
        const type: string = body.Type

        if (this._session === null) {
            const sessionNotExisting: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.NOT_IN_SESSION)
            sessionNotExisting.addData("Messsage", `Du bist derzeit in keiner Session angemeldet.`)
            this.webSocket.send(sessionNotExisting.JSONString)

            return;
        }

        if (type === EClientType.PLAYER) {
            if (this._player !== this._session.Player) {
                const playerNotFound: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.WRONG_PLAYER)
                playerNotFound.addData("Message", "Du bist nicht als Player in der Session angemeldet")
                this.webSocket.send(playerNotFound.JSONString)

                return;
            }
            this._application.PlayerDisconnect(this._session, this._player as Player)
        }
        if (type === EClientType.WATCHER) {
            let amIWatcher: boolean = false;

            for (const w of this._session.Watcher) {
                if (w === this._watcher) {
                    amIWatcher = true;
                }
            }
            if (!amIWatcher) {
                const watcherNotFound: ReceivedEvent = new ReceivedEvent(ConnectingMindsEvents.WRONG_WATCHER)
                watcherNotFound.addData("Message", "Du bist nicht als Watcher in der Session angemeldet")
                this.webSocket.send(watcherNotFound.JSONString)

                return;
            }
            this._application.WatcherDisconnect(this._session, this._watcher as Watcher)
        }
    }
    TakeSession(session: Session): void {
        this._session = session
    }
    RemoveSession(session: Session): void {
        this._session = null
    }
}

module.exports = LeaveSessionListener