import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";

export class ConnectingMindsHooks extends WebSocketHooks {
  // public static readonly CONNECT_PLAYER="CONNECT_PLAYER"
  // public static readonly DISCONNECT_PLAYER="DISCONNECT_PLAYER"
  // public static readonly CONNECT_WATCHER="CONNECT_WATCHER"
  // public static readonly DISCONNECT_WATCHER="DISCONNECT_WATCHER"
  public static readonly CREATE_PLAYER = "CREATE_PLAYER";
  public static readonly CREATE_WATCHER = "CREATE_WATCHER";
  public static readonly CREATE_SESSION = "CREATE_SESSION";
  public static readonly JOIN_SESSION = "JOIN_SESSION";
}
