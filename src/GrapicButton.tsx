import * as colors from "./colors";
import * as figmaUtils from "./figmaUtils";

const { widget } = figma;
const { AutoLayout, Text } = widget;

const GrapicButton = (props: { text: string; onClick?: () => void }) => {
  return (
    <AutoLayout
      fill={colors.GRAPIC_YELLOW}
      padding={{
        top: figmaUtils.remToPx(0.8),
        bottom: figmaUtils.remToPx(0.8),
        left: figmaUtils.remToPx(1.5),
        right: figmaUtils.remToPx(1.5),
      }}
      cornerRadius={figmaUtils.remToPx(0.8)}
      onClick={props.onClick}
    >
      <Text
        fontSize={16}
        fontWeight={600}
        horizontalAlignText="center"
        fill={colors.GRAPIC_BLACK}
      >
        {props.text}
      </Text>
    </AutoLayout>
  );
};

export default GrapicButton;
