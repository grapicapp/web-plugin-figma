import * as colors from "./colors";

const { widget } = figma;
const { Text } = widget;

const GrapicText: TextComponent = (props) => {
  return (
    <Text
      fontFamily="Open Sans"
      fontSize={12}
      fontWeight={400}
      fill={colors.GRAPIC_BLACK}
      {...props}
    >
      {props.children}
    </Text>
  );
};

export default GrapicText;
