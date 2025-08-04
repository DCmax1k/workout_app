// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import Svg, { Defs, LinearGradient, Path, Stop, SvgAst } from 'react-native-svg'
// import * as d3 from "d3"
// import Spacer from './Spacer'

// const LineGraph = (props) => {
//   const [width, setWidth] = React.useState(0);
//   const height = width * props.aspectRatio;

//   const min = Math.min(...props.data);
//   const max = Math.max(...props.data);

//   const yScale = d3.scaleLinear().domain([min, max]).range([height, 0]);
//   const xScale = d3.scaleLinear().domain([0, props.data.length - 1]).range([0, width]);

//   const lineFn = d3.line().x((d, ix) => xScale(ix)).y((d, ix) => yScale(d));

//   const svgLine = lineFn(props.data);


//   return (
//     <View style={[{}]} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      
//       <Svg width={width} height={height}>
//         <View style={{width: "95%", height: "95%", overflow: "visible"}}>
//           <Path d={svgLine} fill={"none"} stroke={props.color} strokeWidth={10} />
//         </View>
        
//       </Svg>
//     </View>
//   )
// }

// export default LineGraph

// const styles = StyleSheet.create({})
import { StyleSheet, View } from 'react-native';
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import * as d3 from 'd3';

const LineGraph = ({ data, aspectRatio = 0.5, color = 'black', strokeWidth = 7 }) => {
  const [width, setWidth] = React.useState(0);
  const height = width * aspectRatio;

  // Margin inside the graph to avoid clipping
  const padding = strokeWidth;

  const min = Math.min(...data);
  const max = Math.max(...data);

  // y-axis: padding at top and bottom
  const yScale = d3
    .scaleLinear()
    .domain([min, max])
    .range([height - padding, padding]);

  // x-axis: padding on left and right
  const xScale = d3
    .scaleLinear()
    .domain([0, data.length - 1])
    .range([padding, width - padding]);

  const lineFn = d3.line()
    .x((d, i) => xScale(i))
    .y((d) => yScale(d))
    .curve(d3.curveMonotoneX); // Optional: smooth curve

  const svgLine = lineFn(data);

  return (
    <View style={{ width: '100%' }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 && (
        <Svg width={width} height={height}>
          <Path d={svgLine} fill="none" stroke={color} strokeWidth={strokeWidth} />
        </Svg>
      )}
    </View>
  );
};

export default LineGraph;
