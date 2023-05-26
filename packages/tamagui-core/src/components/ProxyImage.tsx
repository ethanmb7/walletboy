import type { ImageStyle, StyleProp } from "react-native";
import { Image } from "react-native";
import { proxyImageUrl } from "@coral-xyz/common";

// React Native apps need to specifcy a width and height for remote images
export const ProxyImage = ({
  src,
  style,
}: {
  src: string;
  style?: StyleProp<ImageStyle>;
}) => {
  const uri = proxyImageUrl(src);
  return <Image style={style} source={{ uri }} />;
};
