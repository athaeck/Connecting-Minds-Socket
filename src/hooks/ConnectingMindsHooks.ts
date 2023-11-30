import { WebSocketHooks } from "../../athaeck-websocket-express-base/base/hooks";


export class ConnectingMindsHooks extends WebSocketHooks {
    public static readonly CONNECT_PLAYER_ONE = "CONNECT_PLAYER_ONE"
    public static readonly CONNECT_PLAYER_TWO = "CONNECT_PLAYER_TWO"
    public static readonly DISCONNECT_PLAYER_ONE = "DISCONNECT_PLAYER_ONE"
    public static readonly DISCONNECT_PLAYER_TWO = "DISCONNECT_PLAYER_TWO"
}