import WebSocket from "ws";
import { AddRoute, BaseExpressRoute } from "./athaeck-websocket-express-base/athaeck-express-base/base/express";
import { BaseWebSocketExpressAdoon } from "./athaeck-websocket-express-base/base";
import { WebSocketHooks } from "./athaeck-websocket-express-base/base/hooks";
import { ConnectingMindsServerAdapterFactory, ConnectingMindsSocketListenerFactory } from "./src";
import bodyParser from "body-parser"
import { Player } from "./Connecting-Minds-Data-Types/types";






export class ConnectingMindsSocket extends BaseWebSocketExpressAdoon {
    private _playerOne: Player
    private _playerTwo: Player

    constructor(port: number) {
        super(port)
        this.factory = new ConnectingMindsSocketListenerFactory("./listener/")
        this.initializeMiddleware()
        this.apiFactory = new ConnectingMindsServerAdapterFactory("./api/")
        this.apiFactory.ConnectAdpater(this)
    }

    public set PlayerOne(player: Player) {
        this._playerOne = player
    }
    public set PlayerTwo(player: Player) {
        this.PlayerTwo = player
    }
    public get PlayerOne(): Player {
        return this._playerOne
    }
    public get PlayerTwo(): Player {
        return this._playerTwo
    }
    public IsPlayerOne(socket: WebSocket.WebSocket): Boolean {
        if (!this._playerOne) {
            return false
        }
        return this._playerOne.socket === socket
    }
    public IsPlayerTwo(socket: WebSocket.WebSocket): Boolean {
        if (!this._playerTwo) {
            return false
        }
        return this._playerTwo.socket === socket
    }


    Init(webSocket: WebSocket, hooks: WebSocketHooks): void {

    }
    Disconnect(webSocket: WebSocket): WebSocketHooks | undefined {
        return undefined
    }
    AddRoute(route: BaseExpressRoute): void {
        this.app = AddRoute(this.app, route)
    }
    initializeMiddleware(): void {
        this.app.use(bodyParser.json());
    }
}

export const connectingMindsSocket: ConnectingMindsSocket = new ConnectingMindsSocket(8080)
connectingMindsSocket.Start()