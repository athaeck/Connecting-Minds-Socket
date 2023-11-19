import { WebSocket } from "ws";
import { AddRoute, BaseExpressRoute } from "./athaeck-websocket-express-base/athaeck-express-base/base/express";
import { BaseWebSocketExpressAdoon } from "./athaeck-websocket-express-base/base";
import { WebSocketHooks } from "./athaeck-websocket-express-base/base/hooks";
import { ConnectingMindsServerAdapterFactory, ConnectingMindsSocketListenerFactory } from "./src";
import bodyParser from "body-parser"
import { Player } from "./Connecting-Minds-Data-Types/types";
import { ConnectingMindsHooks } from "./src/hooks/connectingMindsHooks";






export class ConnectingMindsSocket extends BaseWebSocketExpressAdoon {
    private _playerOne: Player | null = null
    private _playerTwo: Player | null = null
    private _connectingMindsHooks: ConnectingMindsHooks

    constructor(port: number) {
        super(port)
        this._connectingMindsHooks = new ConnectingMindsHooks()
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
    public get PlayerOne(): Player | null {
        return this._playerOne
    }
    public get PlayerTwo(): Player | null {
        return this._playerTwo
    }
    public get ConnectingMindsHooks() {
        return this._connectingMindsHooks
    }
    public IsPlayerOne(socket: WebSocket): Boolean {
        if (!this._playerOne) {
            return false
        }
        return this._playerOne.socket === socket
    }
    public IsPlayerTwo(socket: WebSocket): Boolean {
        if (!this._playerTwo) {
            return false
        }
        return this._playerTwo.socket === socket
    }

    protected ValidateConnection(webSocket: WebSocket): boolean {
        if (this.PlayerOne !== null && this.PlayerTwo !== null) {
            return false
        }
        return true
    }


    Init(webSocket: WebSocket, hooks: WebSocketHooks): void {
        // const connectingMindsHooks: ConnectingMindsHooks = <ConnectingMindsHooks>hooks
        // if (this.PlayerOne !== null && this.PlayerTwo !== null) {
        //     return;
        // }
        // const player: Player = {
        //     hooks: connectingMindsHooks,
        //     socket: webSocket
        // }
        // if (this.PlayerOne === null) {
        //     this._playerOne = player
        //     return;
        // }
        // if (this.PlayerTwo === null) {
        //     this._playerTwo = player
        //     return
        // }
        // return connectingMindsHooks

        // TODO: mal noch generalisierne in der Base, ob eine Connection eingeschränkt ist oder nicht und dass das im Child definiert wird
        // if(this.PlayerOne !== null && this.PlayerTwo !== null){
        //     webSocket.close(500,"Too many users connected")
        // }
    }

    public TakePlayerOne(webSocket: WebSocket, hooks: ConnectingMindsHooks): void {
        this._playerOne = {
            socket: webSocket,
            hooks
        }
    }
    public TakePlayerTwo(webSocket: WebSocket, hooks: ConnectingMindsHooks): void {
        this._playerTwo = {
            socket: webSocket,
            hooks
        }
    }

    protected CreateHooks(): WebSocketHooks {
        return new ConnectingMindsHooks()
    }
    Disconnect(webSocket: WebSocket): WebSocketHooks | undefined {
        if (this.PlayerOne === null && this.PlayerTwo === null) {
            return undefined
        }
        let player: Player | null = null
        if (this.IsPlayerOne(webSocket)) {
            player = this.PlayerOne
            this._playerOne = null
        }
        if (this.IsPlayerTwo(webSocket)) {
            player = this.PlayerTwo
            this._playerTwo = null
        }
        return player?.hooks
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