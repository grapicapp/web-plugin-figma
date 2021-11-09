import * as types from "./types";

export const remToPx = (rem: number) => rem * 16;

export function clone<Type>(value: Type): Type {
  return JSON.parse(JSON.stringify(value));
}

export const createImage = ({
  imageMessage,
  position,
  widget,
}: {
  imageMessage: types.FigmaImageMessage;
  position: number;
  widget: WidgetNode;
}) => {
  const image = figma.createImage(imageMessage.bytes);
  console.log(`Created Figma image (${imageMessage.id})`, image);

  const rectangle = figma.createRectangle();
  rectangle.x = widget.x - 1000 + position * 50;
  rectangle.y = widget.y + position * 50;

  rectangle.setPluginData("id", imageMessage.id);
  rectangle.resize(imageMessage.width, imageMessage.height);

  console.log(`Created Figma rectangle (${imageMessage.id})`, rectangle);
  // for (const paint of rectangle.fills) {
  //   console.log("paint", paint)
  // }

  const imagePaint: ImagePaint = {
    type: "IMAGE",
    imageHash: image.hash,
    scaleMode: "FIT",
  };
  const newFills = [imagePaint];
  // const newFills = clone(rectangle.fills) as Paint[];
  // newFills.shift();
  // newFills.push(imagePaint);
  // fills[0].color.r = 0.5

  rectangle.fills = newFills;
  // console.log(`Filled rectangle (${id}) with image`, rectangle.fills);
};
