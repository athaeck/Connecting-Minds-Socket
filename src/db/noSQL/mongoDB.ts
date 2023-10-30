import { MongoClient, Db } from "mongodb";
import config from "config";
import { BaseDB } from "../../../athaeck-express-nosql-extension/base/db/types";


class MongoDB extends BaseDB {
    private _url: string
    constructor() {
        super();
        console.log("Init MongoDB Adapter")
        const nosql: any = config.get("noSQL");
        this.config = nosql["mongoDB"]
        this._url = <string>this.config["url"];
        this.Connect();
    }
    public async Connect(): Promise<void> {
        if (this._url.length === 0) {
            return
        }
        this.client = await MongoClient.connect(this._url)
    }
    public async GetDB<T>(db: string): Promise<T | undefined> {
        return await this.client?.db(db);
    }
}
module.exports = MongoDB;