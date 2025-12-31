
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  useDerivedValue, 
  useAnimatedStyle,
} from 'react-native-reanimated';
import Svg, { Circle, Line } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const PADD = 20; 

const GraphScrubber = ({ data, dates, max, min, style, decimals=2, unit = "", series = [] }) => {
  const [layout, setLayout] = React.useState({ width: 0, height: 0 });
  const touchX = useSharedValue(0);
  const isActive = useSharedValue(false);

  const onLayout = (event) => setLayout(event.nativeEvent.layout);

  // Normalize data: use 'series' if provided, else wrap the single 'data' prop
  const activeSeries = series.length > 0 
    ? series 
    : [{ data, color: 'white', label: '', unit }];
  
  // Use the first series for index and date calculations
  const referenceData = activeSeries[0].data;

  const tapGesture = Gesture.LongPress()
    .minDuration(0)
    .onStart((e) => {
      isActive.value = true;
      touchX.value = Math.max(0, Math.min(e.x, layout.width));
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      touchX.value = Math.max(0, Math.min(e.x, layout.width));
    })
    .onFinalize(() => {
      isActive.value = false;
    });

  const composedGesture = Gesture.Simultaneous(tapGesture, panGesture);

  const currentIndex = useDerivedValue(() => {
    if (!referenceData || referenceData.length < 2 || layout.width === 0) return 0;
    return Math.round((touchX.value / layout.width) * (referenceData.length - 1));
  });

  const tooltipStyle = useAnimatedStyle(() => {
    const index = currentIndex.value;
    const x = PADD + (index / (referenceData.length - 1)) * (layout.width - PADD * 2);
    
    const isRightHalf = x > layout.width / 2;
    const translateX = isRightHalf ? x - 115 : x + 15;

    return {
      opacity: isActive.value ? 1 : 0,
      transform: [
        { translateX: translateX },
        { translateY: layout.height / 2 - 30 }
      ],
    };
  });

  const dateTextProps = useAnimatedProps(() => {
    const dateObj = new Date(dates[currentIndex.value]);
    return { 
      text: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: "numeric" }) 
    };
  });

  const animatedLineProps = useAnimatedProps(() => {
    const x = PADD + (currentIndex.value / (referenceData.length - 1)) * (layout.width - PADD * 2);
    return { x1: x, x2: x, y1: 0, y2: layout.height, opacity: isActive.value ? 0.3 : 0 };
  });

  return (
    <GestureDetector gesture={composedGesture}>
      <View style={[style, { position: "absolute", top: -PADD, right: -PADD + 40, bottom: -PADD, left: -PADD }]}>
        <Animated.View 
          style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent', overflow: "visible" }]} 
          onLayout={onLayout}
        >
          <Svg style={[StyleSheet.absoluteFill, { overflow: 'visible' }]}>
            <AnimatedLine animatedProps={animatedLineProps} stroke="white" strokeWidth={1} />
            
            {activeSeries.map((s, i) => (
              <ScrubCircle 
                key={i}
                index={currentIndex}
                data={s.data}
                max={max}
                min={min}
                color={s.color || 'white'}
                isActive={isActive}
                layout={layout}
              />
            ))}
          </Svg>

          <Animated.View style={[styles.tooltip, tooltipStyle, { height: 'auto', minHeight: 40 }]}>
            <AnimatedTextInput
              underlineColorAndroid="transparent"
              editable={false}
              animatedProps={dateTextProps}
              style={styles.tooltipDate}
            />
            {activeSeries.map((s, i) => (
              <TooltipRow 
                key={i}
                index={currentIndex}
                data={s.data}
                decimals={decimals}
                unit={s.unit || unit}
                label={s.label}
                color={s.color || 'white'}
              />
            ))}
          </Animated.View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

// Internal component for multi-line circles
const ScrubCircle = ({ index, data, max, min, color, isActive, layout }) => {
  const animatedProps = useAnimatedProps(() => {
    const idx = index.value;
    const range = max - min;
    const x = PADD + (idx / (data.length - 1)) * (layout.width - PADD * 2);
    const y = range === 0 
      ? layout.height / 2 
      : PADD + (layout.height - PADD * 2) - ((data[idx] - min) / range) * (layout.height - PADD * 2);

    return { cx: x, cy: y, opacity: isActive.value ? 1 : 0 };
  });

  return (
    <AnimatedCircle 
      animatedProps={animatedProps} 
      r={6} 
      fill={color} 
      stroke="rgba(0,0,0,0.3)" 
      strokeWidth={2} 
    />
  );
};

// Internal component for tooltip rows
const TooltipRow = ({ index, data, decimals, unit, label, color }) => {
  const textProps = useAnimatedProps(() => {
    'worklet';
    const rawValue = data[index.value];
    if (rawValue === undefined || rawValue === null) return { text: "" };
    
    const displayValue = parseFloat(Number(rawValue).toFixed(decimals)).toString();
    const prefix = label ? `${label}: ` : "";
    return { text: `${prefix}${displayValue}${unit}` };
  });

  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      animatedProps={textProps}
      defaultValue={""}
      style={[styles.tooltipValue, { color: color }]}
    />
  );
};


const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    width: 125, // Slightly wider for labels
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    zIndex: 99,
    pointerEvents: 'none',
  },
  tooltipValue: { 
    fontWeight: 'bold', 
    fontSize: 12, // Slightly smaller to fit multi-line
    padding: 0,
    margin: 0
  },
  tooltipDate: { 
    color: '#aaa', 
    fontSize: 10, 
    padding: 0,
    margin: 0,
    marginBottom: 2
  },
});

export default GraphScrubber;
