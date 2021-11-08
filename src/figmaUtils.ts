export function clone<Type>(value: Type): Type {
  return JSON.parse(JSON.stringify(value));
}

export const createImage = ({
  id,
  imageData,
  width,
  height,
}: {
  id: string;
  imageData: Uint8Array;
  width?: number;
  height?: number;
}) => {
  const image = figma.createImage(imageData);
  console.log("Created Figma image", image);

  const rectangle = figma.createRectangle();
  if (id) rectangle.setPluginData("id", id);
  if (width && height) {
    rectangle.resize(width, height);
  }

  console.log("Rectangle id", rectangle.getPluginData("id"));

  // console.log("Rectangle x before", rectangle.x);
  // rectangle.x += 100;
  // console.log("Rectangle x after", rectangle.x);

  console.log("Created Figma rectangle", rectangle);
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
  console.log("Filled rectangle with image", rectangle.fills);
};
