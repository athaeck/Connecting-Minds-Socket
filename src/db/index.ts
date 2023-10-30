import { BaseNoSQLFactory } from "../../athaeck-express-nosql-extension/base";


export class ConnectingMindsNoSQLFactory extends BaseNoSQLFactory {
    constructor(root: string) {
        super(root)
        this.rootDir = __dirname
    }
}