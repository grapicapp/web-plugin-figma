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
