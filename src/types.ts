export interface ImageMessage {
  type: "image";
  id: string;
  bytes: Uint8Array;
  url: string;
  width: number;
  height: number;
}

export interface RoomMessage {
  type: "room";
  roomId: string;
}
