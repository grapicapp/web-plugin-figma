import * as colors from "./colors";
import * as figmaUtils from "./figmaUtils";
import GrapicButton from "./GrapicButton";
import GrapicText from "./GrapicText";
import * as images from "./images";
import Logo from "./Logo";
import * as routes from "./routes";
import * as types from "./types";

const { widget } = figma;
const { AutoLayout, Image, SVG, useEffect, useSyncedMap, useSyncedState } =
  widget;

const NO_OF_SNAPSHOTS_IN_WIDGET = 3;
const NO_OF_USERS_IN_WIDGET = 6;
const UI_WIDTH = 575;
const UI_HEIGHT = 575;
const MAX_WIDGET_WIDTH = 310;
const UI_MARGIN_FROM_WIDGET = 20;

/**
 * TODO: add analytics?
 */
function Widget() {
  const widgetId = widget.useWidgetId();

  /**
   * Note:  the names of useSyncedState or useSyncedMap can not be changed
   * Note:  default values only set if the client doesn't have a value stored already
   * Read more at: https://www.figma.com/widget-docs/stability-and-updates/
   */
  const [creator, setCreator] = useSyncedState<types.Creator>("creator", {});
  const [roomId, setRoomId] = useSyncedState<string>("roomId", "");
  const figmaUsers = useSyncedMap<types.FigmaUsers>("figmaUsers");
  const snapshots = useSyncedMap<types.Snapshots>("snapshots");

  useEffect(() => {
    figma.ui.onmessage = (message: types.FigmaMessage, props) => {
      console.log("Message from UI:", message, props.origin);
      switch (message.type) {
        case "notification":
          figma.notify(message.message);
          break;
        case "action":
          if (message.message === "close") {
            figma.closePlugin();
          }
          break;
        case "room":
          setRoomId(message.roomId);
          break;
        case "image":
          const { id, createdAtMs, url, width, height } = message;
          if (!!snapshots.get(id)) {
            console.log(`Image ${id} already on board`);
            return;
          }
          const positionOnBoard = snapshots.size;
          snapshots.set(id, { createdAtMs, url, width, height });

          const widget = figma.getNodeById(widgetId) as WidgetNode;
          figmaUtils.createImage({
            imageMessage: message,
            position: positionOnBoard,
            widget,
            roomId,
          });
          figma.notify(
            `Adding image on board (${new Date(
              createdAtMs
            ).toLocaleTimeString()})`
          );
          break;
        default:
          console.warn("This message is not supported", message);
          break;
      }
    };

    figma.on("run", () => {
      const { sessionId, ...user } = figma.currentUser;
      setCreator({ id: user.id, name: user.name });
      figmaUsers.set(sessionId.toString(), { ...user, active: true });

      figma.once("close", () => {
        figmaUsers.set(sessionId.toString(), { ...user, active: false });
      });
    });
  });

  /**
   * Use async callbacks or return a promise to keep the Iframe window opened.
   * Resolving the promise, closing the Iframe window, or calling
   * `figma.closePlugin()` will terminate the code.
   */
  const onStartClick = () =>
    new Promise<void>((resolve) => {
      if (!roomId && "id" in creator && creator.id !== figma.currentUser.id) {
        figma.notify(
          `${creator.name} is already creating a Grapic, you can view it in any second now.`
        );
        return resolve();
      }

      const url = `${routes.baseUrl}${
        roomId
          ? `${routes.EMBED_FIGMA_ROOM_BASE}/${roomId}`
          : routes.NEW_GRAPIC_EMBED_FIGMA
      }?${routes.QUERY_AUTO_SIGN_IN}=${routes.QUERY_AUTO_SIGN_IN_ANONYMOUS}`;
      console.log("Opening URL", url);
      const ui = `<script>window.location.href="${url}"</script>`;

      const widget = figma.getNodeById(widgetId) as WidgetNode;
      const shouldPositionUiToLeft =
        widget.x + MAX_WIDGET_WIDTH + UI_WIDTH / figma.viewport.zoom >
        figma.viewport.bounds.x + figma.viewport.bounds.width;

      figma.showUI(ui, {
        width: UI_WIDTH,
        height: UI_HEIGHT,
        position: {
          x: shouldPositionUiToLeft
            ? widget.x - UI_MARGIN_FROM_WIDGET - UI_WIDTH / figma.viewport.zoom
            : widget.x + MAX_WIDGET_WIDTH + UI_MARGIN_FROM_WIDGET,
          y: widget.y - widget.height / 2,
        },
      });
    });

  return (
    <AutoLayout
      name="Grapic for FigJam"
      direction="vertical"
      horizontalAlignItems="start"
      verticalAlignItems="center"
      height="hug-contents"
      padding={figmaUtils.remToPx(0.8)}
      fill={colors.LIGHT_BACKGROUND}
      cornerRadius={figmaUtils.remToPx(1)}
      spacing={6}
    >
      <AutoLayout name="Header" width="fill-parent">
        <Logo />
        {figmaUsers.size > 0 && (
          <AutoLayout
            name="Users"
            width="fill-parent"
            horizontalAlignItems="end"
            verticalAlignItems="center"
            spacing={4}
          >
            {figmaUsers
              .entries()
              .slice(0, NO_OF_USERS_IN_WIDGET)
              .reverse()
              .map(([sessionId, user]) => (
                <Image
                  key={sessionId}
                  src={user.photoUrl}
                  name={user.name}
                  cornerRadius={24}
                  width={24}
                  height={24}
                  opacity={user.active ? 1 : 0.5}
                />
              ))}
            {figmaUsers.size > NO_OF_USERS_IN_WIDGET && (
              <GrapicText>
                {`+${figmaUsers.size - NO_OF_USERS_IN_WIDGET}`}
              </GrapicText>
            )}
          </AutoLayout>
        )}
      </AutoLayout>

      <AutoLayout
        name="Content"
        direction="vertical"
        horizontalAlignItems="center"
        padding={{ top: 15 }}
      >
        <GrapicButton onClick={onStartClick}>
          {roomId ? "View Grapic" : "Start Grapic"}
        </GrapicButton>

        <AutoLayout
          name="Instructions"
          padding={{ top: 20, bottom: 10, left: 25, right: 25 }}
        >
          <GrapicText horizontalAlignText="center">
            {"id" in creator && !roomId
              ? "Creating your Grapic..."
              : "Sketch on paper or whiteboard and\nget it directly into FigJam"}
          </GrapicText>
        </AutoLayout>

        {!!roomId && snapshots.size === 0 && (
          <AutoLayout
            name="Phone instructions"
            padding={{ top: 15, bottom: 15 }}
            spacing={10}
            verticalAlignItems="center"
          >
            {!!roomId && (
              <SVG
                name="Snapshot icon"
                src={images.snapshotButton}
                width={18}
                height={18}
              />
            )}
            <GrapicText
              fontSize={10}
              opacity={0.5}
              italic
              horizontalAlignText="left"
            >
              {`Take snapshots with your phone \nto make them appear in FigJam`}
            </GrapicText>
          </AutoLayout>
        )}

        {snapshots.size > 0 && (
          <AutoLayout
            name="Snapshots"
            padding={{ top: 20, bottom: 10 }}
            spacing={10}
            verticalAlignItems="center"
          >
            {snapshots
              .entries()
              .sort(([, a], [, b]) => a.createdAtMs - b.createdAtMs)
              .slice(NO_OF_SNAPSHOTS_IN_WIDGET * -1)
              .map(([id, image]) => (
                <Image
                  key={id}
                  name={new Date(image.createdAtMs).toLocaleString()}
                  src={image.url}
                  width={80}
                  height={80}
                  cornerRadius={6}
                />
              ))}
            {snapshots.size > NO_OF_SNAPSHOTS_IN_WIDGET && (
              <GrapicText>
                {`+${snapshots.size - NO_OF_SNAPSHOTS_IN_WIDGET}`}
              </GrapicText>
            )}
          </AutoLayout>
        )}

        {!!roomId && (
          <AutoLayout name="Room" padding={{ top: 10 }}>
            <GrapicText
              fontSize={10}
              opacity={0.5}
              italic
              href={`${routes.baseUrl}${routes.ROOM_BASE}/${roomId}`}
            >
              {`Room: ${roomId}`}
            </GrapicText>
          </AutoLayout>
        )}
      </AutoLayout>
    </AutoLayout>
  );
}

widget.register(Widget);
