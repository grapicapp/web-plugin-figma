import * as types from "./types";

export const remToPx = (rem: number) => rem * 16;

export function clone<Type>(value: Type): Type {
  return JSON.parse(JSON.stringify(value));
}

export const createImage = ({
  imageMessage,
  position,
  widget,
  roomId,
}: {
  imageMessage: types.FigmaImageMessage;
  position: number;
  widget: WidgetNode;
  roomId: string;
}) => {
  const image = figma.createImage(imageMessage.bytes);
  // console.log(`Created Figma image (${imageMessage.id})`, image);

  const rectangle = figma.createRectangle();
  rectangle.name = new Date(imageMessage.createdAtMs).toLocaleString();

  // stack to the left
  // rectangle.x = widget.x - 500 + position * 50;
  // rectangle.y = widget.y + position * 50;

  // stack below
  rectangle.x = widget.x + position * 40;
  rectangle.y = widget.y + 350 + position * 20;

  rectangle.setPluginData("id", imageMessage.id);
  rectangle.setPluginData("width", imageMessage.width.toString());
  rectangle.setPluginData("height", imageMessage.height.toString());
  rectangle.setPluginData("createdAtMs", imageMessage.createdAtMs.toString());
  rectangle.setPluginData("url", imageMessage.url);
  rectangle.setPluginData("roomId", roomId);
  rectangle.setPluginData("figmaUserId", figma.currentUser.id);

  rectangle.resize(imageMessage.width * 0.25, imageMessage.height * 0.25);

  // console.log(`Created Figma rectangle (${imageMessage.id})`, rectangle);

  const imagePaint: ImagePaint = {
    type: "IMAGE",
    imageHash: image.hash,
    scaleMode: "FIT",
  };

  rectangle.fills = [imagePaint];
};
