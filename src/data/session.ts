import axios, { AxiosResponse } from "axios";
import { Item, Path, Position } from "../../Connecting-Minds-Data-Types/types";
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
  private _unlockedPaths: Path[] = [];
  private _availablePositions: Position[] = [];

  private _placedItems: Item[] = [];
  private _usedPositions: Position[] = [];

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

    this._watcher.push(watcher);
    this._sessionHooks.DispatchHook(SessionHooks.CONNECT_WATCHER, watcher);
  }
  public DisconnectWatcher(watcher: Watcher): void {
    watcher.RemoveSession(this);
    this._sessionHooks.DispatchHook(SessionHooks.DISCONNECT_WATCHER, watcher);
    this._watcher = this._watcher.filter((w: Watcher) => w !== watcher);

    if (this._watcher.length === 0) {
      this._sessionHooks.DispatchHook(SessionHooks.NO_WATCHER, null);
    }
  }

  public get Player() {
    return this._player;
  }
  public get Watcher() {
    return this._watcher;
  }
  public get SessionHooks() {
    return this._sessionHooks;
  }
  public get ID() {
    return this._id;
  }

  public get AvailableItems() {
    return this._availableItems;
  }
  public get UnlockedPaths() {
    return this._unlockedPaths;
  }

  public get AvailablePositions() {
    return this._availablePositions;
  }

  public Init(basePath: string): void {
    axios
      .get(
        basePath + apiEndpoints.baseAvailableItemsEndpoint + apiFunctions.get
      )
      .then(this.OnGetAvailableItems.bind(this))
      .catch(this.OnError.bind(this));
    axios
      .get(basePath + apiEndpoints.baseUnlockedPathsEndpoint + apiFunctions.get)
      .then(this.OnGetUnlockedPaths.bind(this))
      .catch(this.OnError.bind(this));
    axios
      .get(
        basePath +
          apiEndpoints.baseAvailablePositionsEndpoint +
          apiFunctions.get
      )
      .then(this.OnGetAvailablePositions.bind(this))
      .catch(this.OnError.bind(this));
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
