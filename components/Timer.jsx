import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const Timer = ({ startTime, textStyle, style, ...props }) => {
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds

  const runUpdate = () => {
      const now = Date.now();
      const diff = Math.floor((now - startTime) / 1000); // seconds
      setElapsedTime(diff);
  }

  useEffect(() => {
    runUpdate();
    const interval = setInterval(() => {
      runUpdate();
    }, 1000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [startTime]);

  // Helper to format seconds to hh:mm:ss
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString();
    const s = (secs % 60).toString().padStart(2, '0');
    if (parseInt(h) > 0) return `${h}:${m.padStart(2, '0')}:${s}`;
    return `${m}:${s}`;
    
  };

  return (
    <View style={style}>
      <Text style={[{ fontSize: 20, color: "white" }, textStyle]}>{formatTime(elapsedTime)}</Text>
    </View>
  );
};

export default Timer;
