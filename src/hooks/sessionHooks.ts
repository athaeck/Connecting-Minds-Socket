import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";


export class SessionHooks extends WebSocketHooks {
    public static readonly CONNECT_PLAYER = "CONNECT_PLAYER"
    public static readonly DISCONNECT_PLAYER = "DISCONNECT_PLAYER"
    public static readonly CONNECT_WATCHER = "CONNECT_WATCHER"
    public static readonly DISCONNECT_WATCHER = "DISCONNECT_WATCHER"
    public static readonly WAIT_FOR_WATCHER = "WAIT_FOR_WATCHER"
    public static readonly WATCHER_EXISTING = "WATCHER_EXISTING"
    public static readonly PLACE_ITEM = "PLACE_ITEM"
    public static readonly SEND_MESSAGE="SEND_MESSAGE"
    public static readonly REMOVE_ITEM="REMOVE_ITEM"
    public static readonly UNLOCK_PATH="UNLOCK_PATH"
    public static readonly UNLOCK_POSITION="UNLOCK_POSITION"
    public static readonly UNLOCK_ITEM="UNLOCK_ITEM"
    public static readonly REMOVE_POSITION="REMOVE_POSITION"
}