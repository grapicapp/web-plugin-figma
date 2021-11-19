export interface ActiveUsers {
  id: string;
  name: string;
  color: string;
  photoUrl: string;
  active: boolean;
}

export interface Snapshots {
  createdAtMs: number;
  url: string;
  width: number;
  height: number;
}

export type Creator =
  | {
      id: string;
      name: string;
    }
  | {};

export type FigmaMessage =
  | FigmaActionMessage
  | FigmaImageMessage
  | FigmaNotificationMessage
  | FigmaRoomMessage
  | FigmaStatusMessage;

export interface FigmaActionMessage {
  type: "action";
  message: "close";
}

export interface FigmaNotificationMessage {
  type: "notification";
  message: string;
}

export interface FigmaImageMessage {
  type: "image";
  id: string;
  bytes: Uint8Array;
  url: string;
  width: number;
  height: number;
  createdAtMs: number;
}

export interface FigmaRoomMessage {
  type: "room";
  roomId: string;
}

export interface FigmaStatusMessage {
  type: "status";
  status: "creating-room";
}
