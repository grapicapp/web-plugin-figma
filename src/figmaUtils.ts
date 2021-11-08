export function clone<Type>(value: Type): Type {
  return JSON.parse(JSON.stringify(value));
}

export const createImage = ({
  imageData,
  width,
  height,
}: {
  imageData: Uint8Array;
  width?: number;
  height?: number;
}) => {
  const image = figma.createImage(imageData);
  console.log("Created Figma image", image);

  const rectangle = figma.createRectangle();
  if (width && height) {
    rectangle.resize(width, height);
  }
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
