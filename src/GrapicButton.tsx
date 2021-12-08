import * as colors from "./colors";
import * as figmaUtils from "./figmaUtils";

const { widget } = figma;
const { AutoLayout, Text } = widget;

const GrapicButton: AutoLayout = (props) => {
  return (
    <AutoLayout
      name="Grapic button"
      fill={colors.GRAPIC_YELLOW}
      padding={{
        top: figmaUtils.remToPx(0.8),
        bottom: figmaUtils.remToPx(0.8),
        left: figmaUtils.remToPx(1.5),
        right: figmaUtils.remToPx(1.5),
      }}
      cornerRadius={figmaUtils.remToPx(0.6)}
      effect={{
        blur: 10,
        color: { r: 0, g: 0, b: 0, a: 0.07 },
        offset: { x: 1, y: 4 },
        type: "drop-shadow",
      }}
      {...props}
    >
      <Text
        fontFamily="Poppins"
        fontSize={16}
        fontWeight={700}
        horizontalAlignText="center"
        fill={colors.GRAPIC_BLACK}
      >
        {props.children}
      </Text>
    </AutoLayout>
  );
};

export default GrapicButton;
