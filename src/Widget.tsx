import * as figmaUtils from "./figmaUtils";

const { widget } = figma;
const { AutoLayout, Text, Image, useEffect, useSyncedState } = widget;

// const IFRAME_BASE_URL = "https://staging.app.grapic.co";
// const IFRAME_BASE_URL = "http://localhost:3000/";
const IFRAME_BASE_URL =
  "https://grapic--pr31-feat-figma-plugin-pw7m8tlx.web.app/";

function Widget() {
  const [roomId, setRoomId] = useSyncedState<string | null>("roomId", null);
  const [image, setImage] = useSyncedState<string | null>("image", null);
  const [images, setImages] = useSyncedState<string[]>("images", []);

  useEffect(() => {
    figma.ui.onmessage = (msg) => {
      // or figma.ui.on("message", (msg) => {
      console.log("Message from UI:", msg);
      if (msg === "hello") {
        figma.notify(`Hello ${figma.currentUser.name}`);
      }
      if (msg === "close") {
        figma.closePlugin();
      }
      if (typeof msg === "object" && msg.type === "room") {
        const message = msg as {
          type: "room";
          roomId: string;
        };
        setRoomId(message.roomId);
      }
      if (typeof msg === "object" && msg.type === "image") {
        const message = msg as {
          type: "image";
          id: string;
          bytes: Uint8Array;
          url: string;
          width: number;
          height: number;
        };
        if (images.includes(message.id)) {
          console.log("Image", message.id, "already on board");
          return;
        }

        setImage(message.url);
        figmaUtils.createImage({
          id: message.id,
          imageData: message.bytes,
          width: message.width,
          height: message.height,
          position: images.length,
        });
        setImages([message.id, ...images]);
      }
    };
  });

  return (
    <AutoLayout
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      height="hug-contents"
      padding={10}
      fill="#FFFFFF"
      cornerRadius={8}
      spacing={12}
      // Use async callbacks or return a promise to keep the Iframe window
      // opened. Resolving the promise, closing the Iframe window, or calling
      // "figma.closePlugin()" will terminate the code.
      // () => new Promise((resolve) => {figma.showUI(__html__);})
      onClick={async () => {
        await new Promise((resolve) => {
          const url = IFRAME_BASE_URL + (roomId ? `embed/${roomId}` : "new");
          console.log("Opening URL", url);
          const ui = `<script>window.location.href="${url}"</script>`;
          figma.showUI(ui, { width: 600, height: 600 });
          // figma.ui.on("message", (msg) => { could also be here...
        });
      }}
    >
      {!image && (
        <Text fontSize={32} horizontalAlignText="center">
          New Grapic
        </Text>
      )}

      {!!image && (
        <Text fontSize={20} horizontalAlignText="center">
          Grapic
        </Text>
      )}

      {!!image && (
        <Text fontSize={12} horizontalAlignText="center">
          Latest snapshot
        </Text>
      )}

      {!!image && <Image src={image} width={400} height={400} />}
    </AutoLayout>
  );
}

widget.register(Widget);
