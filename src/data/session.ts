import { GetGUID } from "../../athaeck-websocket-express-base/base/helper";
import { BroadcastToWatcher } from "../helper/broadcastToWatcher";
import { ConnectingMindsHooks } from "../hooks/connectingMindsHooks";
import { SessionHooks } from "../hooks/sessionHooks";
import { Player } from "./player";
import { Watcher } from "./watcher";

export class Session {
    private _id: string = GetGUID()
    private _player: Player | null;
    private _watcher: Watcher[]

    private _sessionHooks: SessionHooks

    constructor(player: Player) {
        this._sessionHooks = new SessionHooks()
        this._player = player
    }

    // private 

    public DisconnectPlayer(player: Player): void {
        if (this._player === player) {
            this._player = null
        }


        // BroadcastToWatcher(this._watcher,ConnectingMindsHooks.DISCONNECT_PLAYER,player)
        this._sessionHooks.DispatchHook(SessionHooks.DISCONNECT_PLAYER, player)
    }
    public ReConnectPlayer(player: Player): void {
        this._player = player
        this._sessionHooks.DispatchHook(SessionHooks.CONNECT_PLAYER, player)
    }
    public ConnectWatcher(watcher: Watcher): void {
        if (this._watcher === null) {
            this._watcher = []
        }
        this._watcher.push(watcher)
        this._sessionHooks.DispatchHook(SessionHooks.CONNECT_WATCHER, watcher)
    }
    public DisconnectWatcher(watcher: Watcher): void {
        this._watcher = this._watcher.filter((w: Watcher) => w !== watcher)
        this._sessionHooks.DispatchHook(SessionHooks.DISCONNECT_WATCHER, watcher)
    }

    public get Player() {
        return this._player
    }
    public get Watcher() {
        return this._watcher
    }
    public get SessionHooks() {
        return this._sessionHooks
    }
    public get ID() {
        return this._id
    }
}