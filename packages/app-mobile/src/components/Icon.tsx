import type { SvgProps } from "react-native-svg";
import Svg, { Path } from "react-native-svg";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@hooks";

export const RedBackpack = (props: SvgProps) => (
  <Svg width={55} height={80} fill="none" {...props}>
    <Path
      d="M32.71 6.29c2.908 0 5.635.39 8.16 1.113C38.398 1.641 33.266 0 27.553 0c-5.724 0-10.866 1.647-13.333 7.437 2.507-.748 5.222-1.147 8.12-1.147H32.71Zm-11.036 5.785C7.867 12.075 0 22.937 0 36.336V50.1c0 1.34 1.12 2.4 2.5 2.4h50c1.38 0 2.5-1.06 2.5-2.4V36.336c0-13.399-9.148-24.26-22.955-24.26H21.674Zm5.806 24.38a8.75 8.75 0 1 0 0-17.5 8.75 8.75 0 0 0 0 17.5ZM0 60.59c0-1.34 1.12-2.426 2.5-2.426h50c1.38 0 2.5 1.086 2.5 2.426v14.557c0 2.68-2.239 4.852-5 4.852H5c-2.761 0-5-2.173-5-4.852V60.59Z"
      fill="#E33E3F"
    />
  </Svg>
);

type IconProps = {
  color?: string;
  size?: number;
};

export function TwitterIcon({
  color = "#1D9BF0",
  size = 24,
}: IconProps): JSX.Element {
  return <MaterialCommunityIcons name="twitter" color={color} size={size} />;
}

export function DiscordIcon({
  color = "#5865F2",
  size = 24,
}: IconProps): JSX.Element {
  return <MaterialCommunityIcons name="discord" color={color} size={size} />;
}

export function WidgetIcon({
  color = "#E33E3F",
  size = 24,
}: IconProps): JSX.Element {
  return <MaterialCommunityIcons name="widgets" color={color} size={size} />;
}

export function MenuIcon({
  color = useTheme().custom.colors.fontColor,
  size = 24,
}: IconProps): JSX.Element {
  return <MaterialIcons name="menu" color={color} size={size} />;
}
