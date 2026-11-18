import type { ColorValue } from "react-native";
import Svg, { Path } from "react-native-svg";
import { withUniwind } from "uniwind";

const ThemedPath = withUniwind(Path);

export function T3Wordmark(props: {
  readonly height: number;
  readonly color?: ColorValue;
  readonly colorClassName?: string;
}) {
  const aspectRatio = 1;
  return (
    <Svg
      accessibilityLabel="Alejandro"
      height={props.height}
      width={props.height * aspectRatio}
      viewBox="0 0 24 24"
    >
      <ThemedPath
        d="M3 21 10 3h4l7 18h-4l-1.5-4h-7L7 21H3Zm7-8h4l-2-6-2 6Z"
        color={props.color}
        colorClassName={props.colorClassName}
        fill="currentColor"
      />
    </Svg>
  );
}
