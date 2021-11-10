import * as colors from "./colors";
import * as figmaUtils from "./figmaUtils";
import GrapicButton from "./GrapicButton";
import * as images from "./images";
import * as types from "./types";

const { widget } = figma;
const { AutoLayout, Image, SVG, Text, useEffect, useSyncedState } = widget;

// const IFRAME_BASE_URL = "https://staging.app.grapic.co/";
// const IFRAME_BASE_URL = "http://localhost:3000/";
const IFRAME_BASE_URL =
  "https://grapic--pr31-feat-figma-plugin-pw7m8tlx.web.app/";

function Widget() {
  const widgetId = widget.useWidgetId();
  // TODO: think about the naming here before launch because they are not backward comp.
  const [opened, setOpened] = useSyncedState<boolean>("opened", false);
  const [roomId, setRoomId] = useSyncedState<string | null>("roomId", null);
  const [imageIds, setImageIds] = useSyncedState<string[]>("imageIds", []);
  const [imageUrls, setImageUrls] = useSyncedState<string[]>("imageUrls", []);

  useEffect(() => {
    figma.ui.onmessage = (message: types.FigmaMessage) => {
      // or figma.ui.on("message", (message) => {
      console.log("Message from UI:", message);
      if (message.type === "notification") {
        // TODO: remove the current user permission? or maybe sent it as display name?
        figma.notify(`Hello ${figma.currentUser.name}: ${message.message}`);
      }
      if (message.type === "action") {
        figma.closePlugin();
      }
      if (message.type === "room") {
        setRoomId(message.roomId);
      }
      if (message.type === "image") {
        if (imageIds.includes(message.id)) {
          console.log("Image", message.id, "already on board");
          return;
        }
        figma.notify(`Adding image on board (${imageIds.length + 1})`);
        const widget = figma.getNodeById(widgetId) as WidgetNode;
        figmaUtils.createImage({
          imageMessage: message,
          position: imageIds.length,
          widget,
        });
        setImageIds([message.id, ...imageIds]);
        setImageUrls([message.url, ...imageUrls]);
      }
    };
  });

  return (
    <AutoLayout
      direction="vertical"
      horizontalAlignItems="start"
      verticalAlignItems="center"
      height="hug-contents"
      padding={{
        top: figmaUtils.remToPx(0.8),
        bottom: figmaUtils.remToPx(0.8),
        left: figmaUtils.remToPx(1.5),
        right: figmaUtils.remToPx(1.5),
      }}
      fill={colors.LIGHT_BACKGROUND}
      cornerRadius={figmaUtils.remToPx(1.8)}
      spacing={6}
    >
      <AutoLayout>
        <Image
          src={images.grapicNoBorderDataURI}
          width={26}
          height={26 * (90 / 110)}
        />
        <AutoLayout padding={{ top: 1, left: 7 }}>
          <Text fontSize={16} fontWeight={800} fill={colors.GRAPIC_BLACK}>
            Grapic
          </Text>
        </AutoLayout>
      </AutoLayout>

      <AutoLayout direction="vertical" horizontalAlignItems="center">
        <AutoLayout padding={{ top: 10 }}>
          <GrapicButton
            text="Start Grapic"
            // Use async callbacks or return a promise to keep the Iframe window
            // opened. Resolving the promise, closing the Iframe window, or calling
            // "figma.closePlugin()" will terminate the code.
            // () => new Promise((resolve) => {figma.showUI(__html__);})
            onClick={async () => {
              await new Promise((resolve) => {
                const url =
                  IFRAME_BASE_URL + (roomId ? `embed/${roomId}` : "new");
                console.log("Opening URL", url);
                const ui = `<script>window.location.href="${url}"</script>`;
                figma.showUI(ui, { width: 600, height: 600 });
                setOpened(true);
                // figma.ui.on("message", (msg) => { could also be here...
              });
            }}
          />
        </AutoLayout>

        <AutoLayout padding={{ top: 10 }}>
          <Text
            fontSize={14}
            fontWeight={400}
            horizontalAlignText="center"
            fill={colors.GRAPIC_BLACK}
          >
            {!!roomId
              ? "Follow the instructions in the popup"
              : opened
              ? "Creating your Grapic..."
              : "Sketch on paper or whiteboard and\nget it directly in Figma"}
          </Text>
        </AutoLayout>

        {!!roomId && imageUrls.length === 0 && (
          <AutoLayout padding={{ top: 20, bottom: 10 }} spacing={10}>
            {!!roomId && (
              <SVG src={images.snapshotButton} width={20} height={20} />
            )}
            <Text
              fontSize={10}
              fill={colors.GRAPIC_BLACK}
              fontWeight={300}
              italic
              horizontalAlignText="left"
            >
              {`Take snapshots with your phone \nto make them appear in Figma`}
            </Text>
          </AutoLayout>
        )}

        {imageUrls.length > 0 && (
          <AutoLayout padding={{ top: 20, bottom: 10 }} spacing={10}>
            {imageUrls
              .reverse()
              .slice(3 * -1)
              .map((imageUrl) => (
                <Image
                  key={imageUrl}
                  src={imageUrl}
                  width={80}
                  height={80}
                  name={imageUrl}
                  cornerRadius={6}
                />
              ))}
            {imageUrls.length > 3 && (
              <AutoLayout verticalAlignItems="center" height="fill-parent">
                <Text fontSize={12}>{`+${imageUrls.length - 3}`}</Text>
              </AutoLayout>
            )}
          </AutoLayout>
        )}

        {!!roomId && (
          <AutoLayout padding={{ top: 10 }}>
            <Text
              fontSize={10}
              fill={colors.GRAPIC_BLACK}
              fontWeight={300}
              italic
            >
              Room: {roomId}
            </Text>
          </AutoLayout>
        )}
      </AutoLayout>
    </AutoLayout>
  );
}

widget.register(Widget);
