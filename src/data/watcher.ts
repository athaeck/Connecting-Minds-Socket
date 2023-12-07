import { ConnectingMindsHooks } from "../hooks/connectingMindsHooks";
import { WebSocket } from "ws";
import { PassListener } from "../types/passListener";

export class Watcher {
  public socket: WebSocket;
  public hooks: ConnectingMindsHooks;

  private _listener: PassListener[] = [];

  constructor(socket: WebSocket, hooks: ConnectingMindsHooks) {
    this.socket = socket;
    this.hooks = hooks;
  }

  public TakeListener(listener: PassListener) {
    this._listener.push(listener);
  }
}
