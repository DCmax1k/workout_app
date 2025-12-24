import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import rotateIcon from '../assets/icons/rotate.png';
import sunIcon from '../assets/icons/sun.svg';
import ImageContain from './ImageContain';
import ThemedText from './ThemedText';
import BlueButton from './BlueButton';
import { ImageManipulator } from 'expo-image-manipulator';
import TouchableScale from './TouchableScale';

export default function Camera({cameraStyle, imageTaken=()=>{}, ...props}) {
  const [facing, setFacing] = useState('back');
  const [torch, setTorch] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const [shutterColor, setShutterColor] = useState("white");
  
  const cameraRef = useRef(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={{justifyContent: "center", paddingVertical: 20}}>
        <ThemedText style={styles.message}>We need your permission to show the camera</ThemedText>
        <BlueButton onPress={requestPermission} title="Allow Camera" />
      </View>
    );
  }

  function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

    function toggleFlashlight() {
        setTorch(current => !current);
    }

    const takePhoto = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.7,
                skipProcessing: true, // Android optimization
                base64: false,
            });
            if (torch) setTorch(false);
            imageTaken(photo);
        }
    };


    

  return (
    <View style={styles.container} {...props}>
        <CameraView
        ref={cameraRef}
        style={[styles.camera, {...cameraStyle}]}
        facing={facing}
        enableTorch={torch}
        
        // onBarcodeScanned={}
        // barcodeScannerSettings={{barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e']}} // For scanning barcodes
        />
        {/* Action buttons */}
        <View style={{position: 'absolute', top: 20, right: 20, gap: 10}}>
            {/* Flip camera */}
            <Pressable onPress={toggleCameraFacing} style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 30,}}>
                <ImageContain source={rotateIcon} />
            </Pressable>
            {/* Toggle Flashlight */}
            {facing === 'back' && (
                <Pressable onPress={toggleFlashlight} style={{backgroundColor: torch ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 30,}}>
                    <ImageContain source={sunIcon} />
                </Pressable>
            )}
        </View>
        {/* Shutter button */}
        <View style={{position: 'absolute', bottom: 30, alignSelf: 'center', }}>

            <TouchableScale activeScale={1.2} onPress={takePhoto} onPressIn={() => setShutterColor("#7e7e7eff")} onPressOut={() => setShutterColor("white")} style={{height: 82, width: 82, borderRadius: 40, borderWidth: 2, borderColor: shutterColor, alignItems: 'center', justifyContent: 'center',}}>
                    <View style={{height: 70, width: 70, borderRadius: 35, backgroundColor: shutterColor,}}>
                    
                    </View>
            </TouchableScale>
            

        </View>
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
