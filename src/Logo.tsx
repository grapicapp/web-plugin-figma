import * as colors from "./colors";
import * as images from "./images";

const { widget } = figma;
const { AutoLayout, Image, Text } = widget;

const Logo: AutoLayout = (props) => {
  return (
    <AutoLayout
      name="Logo"
      height="hug-contents"
      verticalAlignItems="center"
      spacing={7}
      {...props}
    >
      <Image
        name="Grapic Logo"
        src={images.grapicNoBorderDataURI}
        width={26}
        height={26 * (90 / 110)}
      />
      <Text
        fontFamily="Poppins"
        fontSize={16}
        fontWeight={700}
        fill={colors.GRAPIC_BLACK}
        verticalAlignText="center"
      >
        Grapic
      </Text>
    </AutoLayout>
  );
};

export default Logo;
