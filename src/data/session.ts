import axios, { AxiosResponse } from "axios";
import {
  Item,
  Path,
  PlaceItemProxy,
  PlacedItem,
  Position,
  RemoveItemProxy,
  RemovePositionProxy,
  UnlockItemProxy,
  UnlockPathProxy,
  UnlockPositionProxy,
  UnlockedPath,
} from "../../Connecting-Minds-Data-Types/types";
import { GetGUID } from "../../athaeck-websocket-express-base/base/helper";
import { SessionHooks } from "../hooks/sessionHooks";
import { Player } from "./player";
import { Watcher } from "./watcher";

const apiEndpoints = {
  baseAvailableItemsEndpoint: "/api/mongoDB/world/availableItems",
  baseUnlockedPathsEndpoint: "/api/mongoDB/world/unlockedPaths",
  baseAvailablePositionsEndpoint: "/api/mongoDB/world/availablePositions",
  basePlacedItemsEndpoint: "/api/mongoDB/world/placedItems",
  baseUsedPositionsEndpoint: "/api/mongoDB/world/usedPosition",
};
const apiFunctions = {
  del: "/remove",
  post: "/add",
  get: "/get",
  set: "/set",
};

export class Session {
  private _id: string = GetGUID();
  private _player: Player | null;
  private _watcher: Watcher[] = [];

  private _sessionHooks: SessionHooks;

  private _availableItems: Item[] = [];
  private _availablePositions: Position[] = [];

  private _unlockedPaths: Path[] = [];
  private _placedItems: PlacedItem[] = [];

  constructor(player: Player) {
    this._sessionHooks = new SessionHooks();
    this._player = player;
    this._player?.TakeSession(this);
  }

  public DisconnectPlayer(player: Player): void {
    if (this._player === player) {
      this._player = null;
    }

    this._player?.RemoveSession(this);
    this._sessionHooks.DispatchHook(SessionHooks.DISCONNECT_PLAYER, player);
  }
  public ReConnectPlayer(player: Player): void {
    this._player = player;

    this._player?.TakeSession(this);

    this._sessionHooks.DispatchHook(SessionHooks.CONNECT_PLAYER, player);
  }
  public ConnectWatcher(watcher: Watcher): void {
    if (this._watcher === null) {
      this._watcher = [];
    }

    watcher.TakeSession(this);

    if (this._watcher.length === 0) {
      this._sessionHooks.DispatchHook(SessionHooks.WATCHER_EXISTING, null)
    }

    this._watcher.push(watcher);
    this._sessionHooks.DispatchHook(SessionHooks.CONNECT_WATCHER, watcher);
  }
  public DisconnectWatcher(watcher: Watcher): void {
    watcher.RemoveSession(this);
    this._sessionHooks.DispatchHook(SessionHooks.DISCONNECT_WATCHER, watcher);
    this._watcher = this._watcher.filter((w: Watcher) => w !== watcher);

    if (this._watcher.length === 0) {
      this._sessionHooks.DispatchHook(SessionHooks.WAIT_FOR_WATCHER, null);
    }
  }

  public get Player(): Player | null {
    return this._player;
  }
  public get Watcher(): Watcher[] {
    return this._watcher;
  }
  public get SessionHooks(): SessionHooks {
    return this._sessionHooks;
  }
  public get ID(): string {
    return this._id;
  }

  public get AvailableItems(): Item[] {
    return this._availableItems;
  }
  public get UnlockedPaths(): Path[] {
    return this._unlockedPaths;
  }
  public get AvailablePositions(): Position[] {
    return this._availablePositions;
  }
  public get PlacedItems(): PlacedItem[] {
    return this._placedItems;
  }

  public PlaceItem(item: PlacedItem): void {
    this._placedItems.push(item)
    this._availableItems = this._availableItems.filter((aI: Item) => aI.Name !== item.Item.Name)
    this._availablePositions = this._availablePositions.filter((aP: Position) => aP.ID !== item.Position.ID)

    const placedItemProxy: PlaceItemProxy = {
      PlacedItems: this._placedItems,
      AvailableItems: this._availableItems,
      AvailablePositions: this._availablePositions
    }

    console.log("Session Data Update")
    console.log(this.AvailableItems)
    console.log(this.UnlockedPaths)
    console.log(this.AvailablePositions)
    console.log(this.PlacedItems)

    this._sessionHooks.DispatchHook(SessionHooks.PLACE_ITEM, placedItemProxy);
  }
  public RemoveItem(item: PlacedItem): void {
    this._placedItems = this._placedItems.filter((pI: PlacedItem) => pI.Item.Name !== item.Item.Name && pI.Position.ID !== item.Position.ID)
    this._availableItems.push(item.Item)
    this._availablePositions.push(item.Position)

    const removeItemProxy: RemoveItemProxy = {
      PlacedItems: this._placedItems,
      AvailableItems: this._availableItems,
      AvailablePositions: this._availablePositions
    }

    console.log("Session Data Update")
    console.log(this.AvailableItems)
    console.log(this.UnlockedPaths)
    console.log(this.AvailablePositions)
    console.log(this.PlacedItems)

    this._sessionHooks.DispatchHook(SessionHooks.REMOVE_ITEM, removeItemProxy)
  }
  public UnlockPath(unlockedPath: UnlockedPath): void {
    this._unlockedPaths.push(unlockedPath.Path)
    this._availablePositions.push(...unlockedPath.Positions)

    const unlockedPathProxy: UnlockPathProxy = {
      AvailablePositions: this._availablePositions,
      UnlockedPaths: this._unlockedPaths
    }

    console.log("Session Data Update")
    console.log(this.AvailableItems)
    console.log(this.UnlockedPaths)
    console.log(this.AvailablePositions)
    console.log(this.PlacedItems)

    this._sessionHooks.DispatchHook(SessionHooks.UNLOCK_PATH, unlockedPathProxy)
  }

  public UnlockItem(unlockedItem: Item): void {
    this._availableItems.push(unlockedItem)

    const unlockItemProxy: UnlockItemProxy = {
      AvaibaleItems: this._availableItems
    }

    console.log("Session Data Update")
    console.log(this.AvailableItems)
    console.log(this.UnlockedPaths)
    console.log(this.AvailablePositions)
    console.log(this.PlacedItems)

    this._sessionHooks.DispatchHook(SessionHooks.UNLOCK_ITEM, unlockItemProxy);
  }
  public UnlockPosition(unlockedPosition: Position): void {

    if (this._placedItems.find((pi: PlacedItem) => pi.Position.ID === unlockedPosition.ID) || this._availablePositions.includes(unlockedPosition)) {
      return;
    }

    this._availablePositions.push(unlockedPosition)

    const unlockPositionProxy: UnlockPositionProxy = {
      AvailablePositions: this._availablePositions
    }

    console.log("Session Data Update")
    console.log(this.AvailableItems)
    console.log(this.UnlockedPaths)
    console.log(this.AvailablePositions)
    console.log(this.PlacedItems)

    this._sessionHooks.DispatchHook(SessionHooks.UNLOCK_POSITION, unlockPositionProxy)
  }
  public RemovePosition(removedPosition: Position): void {
    const placedItem: PlacedItem | undefined = this._placedItems.find((pI: PlacedItem) => pI.Position.ID === removedPosition.ID);

    if (placedItem) {
      this.RemoveItem(placedItem)
    }
    this._availablePositions = this._availablePositions.filter((aP: Position) => removedPosition.ID !== aP.ID)

    const removePositionProxy: RemovePositionProxy = {
      AvailablePositions: this._availablePositions
    }

    console.log("Session Data Update")
    console.log(this.AvailableItems)
    console.log(this.UnlockedPaths)
    console.log(this.AvailablePositions)
    console.log(this.PlacedItems)

    this._sessionHooks.DispatchHook(SessionHooks.REMOVE_POSITION, removePositionProxy)
  }

  public Init(basePath: string): void {
    axios.get(basePath + apiEndpoints.baseAvailableItemsEndpoint + apiFunctions.get).then(this.OnGetAvailableItems.bind(this)).catch(this.OnError.bind(this));
    axios.get(basePath + apiEndpoints.baseUnlockedPathsEndpoint + apiFunctions.get).then(this.OnGetUnlockedPaths.bind(this)).catch(this.OnError.bind(this));
    axios.get(basePath + apiEndpoints.baseAvailablePositionsEndpoint + apiFunctions.get).then(this.OnGetAvailablePositions.bind(this)).catch(this.OnError.bind(this));
  }
  private OnError(error: any): void {
    console.log(error);
  }
  private OnGetAvailableItems(response: AxiosResponse): void {
    if (response.status === 200) {
      this._availableItems = response.data;
    }
  }
  private OnGetUnlockedPaths(response: AxiosResponse): void {
    if (response.status === 200) {
      this._unlockedPaths = response.data;
    }
  }
  private OnGetAvailablePositions(response: AxiosResponse): void {
    if (response.status === 200) {
      this._availablePositions = response.data;
    }
  }
}
