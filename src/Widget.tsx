import * as figmaUtils from "./figmaUtils";

const { widget } = figma;
const { AutoLayout, Text, Image, useEffect, useSyncedState } = widget;

// const IFRAME_URL = "https://staging.app.grapic.co";
// const IFRAME_URL = "http://localhost:3000/";
// const IFRAME_URL = "http://localhost:3000/miro";
// const IFRAME_URL = "http://localhost:3000/embed/txuYyrodm34RKXXtVvY4qz";
// const IFRAME_URL = "http://localhost:3000/new";
const IFRAME_URL =
  "https://grapic--pr31-feat-figma-plugin-pw7m8tlx.web.app/new";

function Widget() {
  const [image, setImage] = useSyncedState("image", "");

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
      if (typeof msg === "object" && msg.type === "image") {
        const message = msg as {
          type: "image";
          id: string;
          bytes: Uint8Array;
          url: string;
          width: number;
          height: number;
        };
        setImage(message.url);
        figmaUtils.createImage({
          id: message.id,
          imageData: message.bytes,
          width: message.width,
          height: message.height,
        });
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
          const ui = `<script>window.location.href="${IFRAME_URL}"</script>`;
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
