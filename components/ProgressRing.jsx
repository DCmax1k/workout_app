import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Svg, { G, Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import Spacer from "./Spacer";

// Make Circle animatable
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ProgressRing({
  value = 110,
  target = 2000,
  size = 160,
  strokeWidth = 10,
  trackColor = "#313131",
  progressColor = "#546FDB",
  duration = 1000, // ms
  delay=0,
  ...props
}) {
  const half = size / 2;
  const radius = half - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  // clamp percentage between 0 and 1
  const pct = Math.max(0, Math.min(1, value / target));

  // Shared value for animation
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(delay, withTiming(pct, { duration }));
  }, [pct]);

  // Animated props for Circle
  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference * (1 - progress.value),
    };
  });

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Svg width={size} height={size}>
        {/* rotate group so start is at 12 o’clock */}
        <G transform={`rotate(-90 ${half} ${half})`}>
          {/* track */}
          <Circle
            cx={half}
            cy={half}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* progress */}
          <AnimatedCircle
            cx={half}
            cy={half}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            animatedProps={animatedProps}
          />
        </G>
      </Svg>

      {/* label */}
      <View style={{position: "absolute", height: size, width: size, top: 0, left: 0, justifyContent: "center", alignItems: "center"}}>
        {props.children}
      </View>
    </View>
  );
}
