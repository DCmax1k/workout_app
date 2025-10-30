////works well but when length changes the stroke offset hides some
// import React, { useEffect, useState, useRef } from 'react';
// import { View } from 'react-native';
// import Svg, { Path } from 'react-native-svg';
// import * as d3 from 'd3';
// import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';

// const AnimatedPath = Animated.createAnimatedComponent(Path);

// const LineGraph = ({
//   data,
//   aspectRatio = 0.5,
//   color = 'black',
//   strokeWidth = 7,
//   duration = 1000,
//   delay = 0,
// }) => {
//   const [width, setWidth] = useState(0);
//   const height = width * aspectRatio;

//   const pathRef = useRef(null);
//   const [pathLength, setPathLength] = useState(0);

//   const padding = strokeWidth;
//   const min = Math.min(...data);
//   const max = Math.max(...data);

//   const yScale = d3.scaleLinear().domain([min, max]).range([height - padding, padding]);
//   const xScale = d3.scaleLinear().domain([0, data.length - 1]).range([padding, width - padding]);

//   const lineFn = d3.line()
//     .x((d, i) => xScale(i))
//     .y(d => yScale(d))
//     .curve(d3.curveMonotoneX);

//   const svgLine = lineFn(data);

//   const progress = useSharedValue(0);

//   // Only animate once pathLength is known
//   useEffect(() => {
//     if (pathLength > 0) {
//       progress.value = 0;
//       progress.value = withTiming(pathLength, { duration, delay });
//     }
//   }, [pathLength, duration, delay]);

//   const animatedProps = useAnimatedProps(() => ({
//     strokeDashoffset: pathLength - progress.value,
//   }));

//   return (
//     <View style={{ width: '100%' }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
//       {width > 0 && (
//         <Svg width={width} height={height}>
//           <AnimatedPath
//             ref={pathRef}
//             d={svgLine}
//             fill="none"
//             stroke={color}
//             strokeWidth={strokeWidth}
//             strokeLinecap="round"
//             strokeDasharray={pathLength}
//             animatedProps={animatedProps}
//             onLayout={() => {
//               // Measure the path length safely after it’s rendered
//               if (pathRef.current && pathLength === 0) {
//                 const length = pathRef.current.getTotalLength();
//                 setPathLength(length);
//               }
//             }}
//           />
//         </Svg>
//       )}
//     </View>
//   );
// };

// export default LineGraph;

////Works well, flashes the new one, reanimates each time
// import React, { useEffect, useState, useRef } from 'react';
// import { View } from 'react-native';
// import Svg, { Path } from 'react-native-svg';
// import * as d3 from 'd3';
// import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';

// const AnimatedPath = Animated.createAnimatedComponent(Path);

// const LineGraph = ({
//   data,
//   aspectRatio = 0.5,
//   color = 'black',
//   strokeWidth = 7,
//   duration = 1000,
//   delay = 0,
// }) => {
//   const [width, setWidth] = useState(0);
//   const height = width * aspectRatio;

//   const pathRef = useRef(null);
//   const [pathLength, setPathLength] = useState(0);
//   const progress = useSharedValue(0);

//   const padding = strokeWidth;
//   const min = Math.min(...data);
//   const max = Math.max(...data);

//   const yScale = d3.scaleLinear().domain([min, max]).range([height - padding, padding]);
//   const xScale = d3.scaleLinear().domain([0, data.length - 1]).range([padding, width - padding]);

//   const lineFn = d3.line()
//     .x((d, i) => xScale(i))
//     .y(d => yScale(d))
//     .curve(d3.curveMonotoneX);

//   const svgLine = lineFn(data);

//   // Whenever data or width changes, recalc pathLength and animate
//   useEffect(() => {
//     if (width === 0) return;

//     // Reset pathLength and progress first
//     setPathLength(0);
//     progress.value = 0;

//     // Wait for next tick to measure path
//     requestAnimationFrame(() => {
//       if (pathRef.current) {
//         const length = pathRef.current.getTotalLength();
//         setPathLength(length);
//         progress.value = withTiming(length, { duration, delay });
//       }
//     });
//   }, [data, width, duration, delay]);

//   const animatedProps = useAnimatedProps(() => ({
//     strokeDashoffset: pathLength - progress.value,
//   }));

//   return (
//     <View style={{ width: '100%' }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
//       {width > 0 && (
//         <Svg width={width} height={height}>
//           <AnimatedPath
//             ref={pathRef}
//             d={svgLine}
//             fill="none"
//             stroke={color}
//             strokeWidth={strokeWidth}
//             strokeLinecap="round"
//             strokeDasharray={pathLength}
//             animatedProps={animatedProps}
//           />
//         </Svg>
//       )}
//     </View>
//   );
// };

// export default LineGraph;





import React, { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as d3 from 'd3';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const LineGraph = ({
  data,
  otherMaxValue = 0,
  otherMinValue = Infinity,
  aspectRatio = 0.5,
  color = 'black',
  strokeWidth = 7,
  duration = 1000,
  delay = 0,
  dashed = false,
  dashPattern = [5, 7], 
  style,
  ...props
}) => {
  const [width, setWidth] = useState(0);
  const height = width * aspectRatio;

  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  const progress = useSharedValue(0);

  const padding = strokeWidth;
  const min = Math.min(...data, otherMinValue);
  const max = Math.max(...data, otherMaxValue);

  const yScale = d3.scaleLinear().domain([min, max]).range([height - padding, padding]);
  const xScale = d3.scaleLinear().domain([0, data.length - 1]).range([padding, width - padding]);

  const lineFn = d3.line()
    .x((d, i) => xScale(i))
    .y(d => yScale(d))
    .curve(d3.curveMonotoneX);

  const svgLine = lineFn(data);

  useEffect(() => {
    if (width === 0 || !pathRef.current) return;

    // measure on next tick
    requestAnimationFrame(() => {
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        setPathLength(length);
        progress.value = 0; // reset first
        progress.value = withTiming(length, { duration, delay });
      }
    });
  }, [data, width, duration, delay]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDasharray: dashed ? dashPattern.join(',') : pathLength,
    strokeDashoffset: pathLength - progress.value,
  }));

  return (
    <View style={[{ width: '100%' }, style]} onLayout={(e) => setWidth(e.nativeEvent.layout.width)} {...props}>
      {width > 0 && (
        <Svg width={width} height={height}>
          <AnimatedPath
            ref={pathRef}
            d={svgLine}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            animatedProps={animatedProps}
          />
        </Svg>
      )}
    </View>
  );
};

export default LineGraph;
