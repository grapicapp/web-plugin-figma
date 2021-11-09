export type FigmaMessage =
  | FigmaActionMessage
  | FigmaImageMessage
  | FigmaNotificationMessage
  | FigmaRoomMessage;

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
}

export interface FigmaRoomMessage {
  type: "room";
  roomId: string;
}
