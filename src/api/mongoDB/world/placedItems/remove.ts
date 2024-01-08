import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";


class RemovePlacedItemEndpoint extends BaseNoSQLExpressRouteExtension {
  dbName: string;
  private _collectionName: string = "placedItems";

  constructor() {
    super("/world/placedItems/del", ExpressRouteType.DELETE);
    this.dbName = "world";
  }

}


module.exports = RemovePlacedItemEndpoint