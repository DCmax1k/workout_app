import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Defs, LinearGradient, Path, Stop, SvgAst } from 'react-native-svg'
import * as d3 from "d3"

const LineGraph = (props) => {
  const [width, setWidth] = React.useState(0);
  const height = width * props.aspectRatio;

  const min = Math.min(...props.data);
  const max = Math.max(...props.data);

  const yScale = d3.scaleLinear().domain([min, max]).range([height, 0]);
  const xScale = d3.scaleLinear().domain([0, props.data.length - 1]).range([0, width]);

  const lineFn = d3.line().x((d, ix) => xScale(ix)).y((d, ix) => yScale(d));

  const svgLine = lineFn(props.data);


  return (
    <View style={[]} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <Svg width={width} height={height}>
        <Path d={svgLine} fill={"none"} stroke={props.color} strokeWidth={2} />
      </Svg>
    </View>
  )
}

export default LineGraph

const styles = StyleSheet.create({})