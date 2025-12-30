import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

const GradientText = ({ text, style, textStyle, colors }) => {
  return (
    <MaskedView
      maskElement={
        <Text style={[textStyle, { backgroundColor: 'transparent' }]}>
          {text}
        </Text>
      }
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Invisible text just to define size */}
        <Text style={[textStyle, { opacity: 0 }]}>{text}</Text>

        <View style={[StyleSheet.absoluteFill, {backgroundColor: "#ffffff46"}]}></View>
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;
