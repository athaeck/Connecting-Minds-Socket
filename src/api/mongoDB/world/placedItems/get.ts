import { BaseNoSQLExpressRouteExtension } from "../../../../../athaeck-express-nosql-extension/base";
import { ExpressRouteType } from "../../../../../athaeck-websocket-express-base/athaeck-express-base/base/express";


class GetPlacedItemsEndpoint extends BaseNoSQLExpressRouteExtension {
  dbName: string;
  private _collectionName: string = "PlacedItems";

  constructor() {
    super("/world/placedItems/get", ExpressRouteType.GET);
    this.dbName = "World";
  }

}


module.exports = GetPlacedItemsEndpoint