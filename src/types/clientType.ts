export enum EClientType {
  PLAYER = "PLAYER",
  WATCHER = "WATCHER",
}

export type ClientType = {
  type: EClientType;
};
