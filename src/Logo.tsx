import * as colors from "./colors";
import * as images from "./images";

const { widget } = figma;
const { AutoLayout, Image, Text } = widget;

const Logo: AutoLayout = (props) => {
  return (
    <AutoLayout {...props}>
      <Image
        src={images.grapicNoBorderDataURI}
        width={26}
        height={26 * (90 / 110)}
      />
      <AutoLayout padding={{ top: 1, left: 7 }}>
        <Text
          fontFamily="Poppins"
          fontSize={16}
          fontWeight={700}
          fill={colors.GRAPIC_BLACK}
        >
          Grapic
        </Text>
      </AutoLayout>
    </AutoLayout>
  );
};

export default Logo;
