import { Session } from "../data/session";


export interface PassListener{
    TakeSession(session:Session):void
    RemoveSession(session:Session):void
}