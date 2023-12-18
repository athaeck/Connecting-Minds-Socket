import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";

export class ConnectingMindsHooks extends WebSocketHooks {
  public static readonly CREATE_PLAYER = "CREATE_PLAYER";
  public static readonly CREATE_WATCHER = "CREATE_WATCHER";
  public static readonly CREATE_SESSION = "CREATE_SESSION";
  public static readonly JOIN_SESSION = "JOIN_SESSION";
  public static readonly LEAVE_SESSION = "LEAVE_SESSION"
}
