import { ConnectingMindsHooks } from "../hooks/connectingMindsHook";
import { WebSocket } from "ws";
import { PassListener } from "../types/passListener";
import { Session } from "./session";

export class Watcher {
  public socket: WebSocket;
  public hooks: ConnectingMindsHooks;

  protected listener: PassListener[] = [];

  constructor(socket: WebSocket, hooks: ConnectingMindsHooks) {
    this.socket = socket;
    this.hooks = hooks;
  }

  public TakeListener(listener: PassListener):void {
    this.listener.push(listener);
  }

  public TakeSession(session: Session):void{
    for(const l of this.listener){
      l.TakeSession(session)
    }
  }
  public RemoveSession(session:Session):void{
    for(const l of this.listener){
      l.RemoveSession(session)
    }
  }
}
