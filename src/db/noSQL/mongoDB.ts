import { MongoClient, Db } from "mongodb";
import config from "config";
import { BaseDB } from "../../../athaeck-express-nosql-extension/base/db/types";


class MongoDB extends BaseDB {
    private _url: string
    constructor() {
        super();
        this.config = config.get("mongodb");
        this._url = <string>this.config["url"];
        this.Connect();
    }
    public async Connect(): Promise<void> {
        this.client = await MongoClient.connect(this._url)
    }
    public async GetDB<T>(db: string): Promise<T | undefined> {
        return await this.client?.db(db);
    }
}
module.exports = MongoDB;