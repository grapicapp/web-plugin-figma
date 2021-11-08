export function clone<Type>(value: Type): Type {
  return JSON.parse(JSON.stringify(value));
}

export const createImage = ({
  id,
  imageData,
  width,
  height,
  position,
}: {
  id: string;
  imageData: Uint8Array;
  width?: number;
  height?: number;
  position: number;
}) => {
  const image = figma.createImage(imageData);
  console.log(`Created Figma image (${id})`, image);

  const rectangle = figma.createRectangle();
  if (id) rectangle.setPluginData("id", id);
  if (width && height) rectangle.resize(width, height);

  rectangle.x += position * 50;
  rectangle.y += position * 50;

  console.log(`Created Figma rectangle (${id})`, rectangle);
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
