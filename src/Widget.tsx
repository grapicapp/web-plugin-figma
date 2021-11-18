import * as colors from "./colors";
import * as figmaUtils from "./figmaUtils";
import GrapicButton from "./GrapicButton";
import GrapicText from "./GrapicText";
import * as images from "./images";
import Logo from "./Logo";
import * as types from "./types";

const { widget } = figma;
const { AutoLayout, Image, SVG, useEffect, useSyncedMap, useSyncedState } =
  widget;

// const IFRAME_BASE_URL = "https://staging.app.grapic.co/";
// const IFRAME_BASE_URL = "http://localhost:3000/";
const IFRAME_BASE_URL =
  "https://grapic--pr31-feat-figma-plugin-pw7m8tlx.web.app/";

const NO_OF_SNAPSHOTS_IN_WIDGET = 3;
const NO_OF_USERS_IN_WIDGET = 6;

function Widget() {
  const widgetId = widget.useWidgetId();
  // TODO: think about the naming here before launch because they are not backward comp.
  const [opened, setOpened] = useSyncedState<boolean>("opened", false);
  const [roomIsCreating, setRoomIsCreating] = useSyncedState<boolean>(
    "roomIsCreating",
    false
  );
  const [roomId, setRoomId] = useSyncedState<string | null>("roomId", null);

  const snapshots = useSyncedMap<{
    // TODO: maybe add owner userID here?
    id: string;
    createdAtMs: number;
    url: string;
  }>("snapshotMap");
  const figmaUsers = useSyncedMap<{
    id: string;
    name: string;
    color: string;
    photoUrl: string;
    active: boolean;
  }>("figmaUsers");

  useEffect(() => {
    figma.ui.onmessage = (message: types.FigmaMessage, props) => {
      console.log("Message from UI:", message, props.origin);
      // TOOD: maybe this is even better
      // const actions = {
      //   notification: (message: types.FigmaNotificationMessage) => {
      //     figma.notify(`Hello ${figma.currentUser.name}: ${message.message}`);
      //   },
      //   action: (message: types.FigmaNotificationMessage) => {
      //     figma.closePlugin();
      //   },
      // };
      // actions[message.type](message);

      switch (message.type) {
        case "notification":
          // TODO: remove the current user permission? or maybe sent it as display name?
          figma.notify(`Hello ${figma.currentUser.name}: ${message.message}`);
          break;
        case "action":
          figma.closePlugin();
          break;
        case "room":
          setRoomId(message.roomId);
          break;
        case "image":
          const { id, createdAtMs, url } = message;
          if (!!snapshots.get(id)) {
            console.log(`Image ${id} already on board`);
            return;
          }
          const positionOnBoard = snapshots.size;
          snapshots.set(id, { id, createdAtMs, url });

          const widget = figma.getNodeById(widgetId) as WidgetNode;
          figmaUtils.createImage({
            imageMessage: message,
            position: positionOnBoard,
            widget,
          });
          figma.notify(
            `Adding image on board (${new Date(
              createdAtMs
            ).toLocaleTimeString()})`
          );
          break;
        case "status":
          if (message.status === "creating-room") {
            setRoomIsCreating(true);
          }
          break;
        default:
          console.error("This message is not supported", message);
          break;
      }
    };
    figma.on("close", () => {
      figmaUsers.set(figma.currentUser.id, {
        id: figma.currentUser.id,
        photoUrl: figma.currentUser.photoUrl,
        name: figma.currentUser.name,
        color: figma.currentUser.color,
        active: false,
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
      if (!opened && !roomId && roomIsCreating) {
        figma.notify(
          "Someone is already creating a room right now, wait a second and try again."
        );
        return resolve();
      }
      const url = `${IFRAME_BASE_URL}${roomId ? `embed/${roomId}` : "new"}`;
      console.log("Opening URL", url);
      const ui = `<script>window.location.href="${url}"</script>`;
      figma.showUI(ui, { width: 575, height: 575 });
      setOpened(true);
      // TODO: should I use figma.currentUser.sessionId here?
      figmaUsers.set(figma.currentUser.id, {
        id: figma.currentUser.id,
        photoUrl: figma.currentUser.photoUrl,
        name: figma.currentUser.name,
        color: figma.currentUser.color,
        active: true,
      });
    });

  return (
    <AutoLayout
      name="Grapic for Figma"
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
              .values()
              .slice(NO_OF_USERS_IN_WIDGET * -1)
              .map((user) => (
                <Image
                  key={user.id}
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
            {opened && !roomId
              ? "Creating your Grapic..."
              : "Sketch on paper or whiteboard and\nget it directly into Figma"}
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
              {`Take snapshots with your phone \nto make them appear in Figma`}
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
              .values()
              .sort((a, b) => a.createdAtMs - b.createdAtMs)
              .slice(NO_OF_SNAPSHOTS_IN_WIDGET * -1)
              .map((image) => (
                <Image
                  key={image.id}
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
              href={`${IFRAME_BASE_URL}room/${roomId}`}
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
