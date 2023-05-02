import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);

  const takePicture = async () => {
    if(camera){
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  }

  const pickImage = async () => {
    // Ask for Permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
  
    // Permissions not Granted
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={ styles.container }>
      <View style={ styles.cameraContainer }>
        <Camera
        ref= { ref => setCamera(ref) } 
        style={styles.fixedRatio} 
        type={type}
        ratio={'1:1'}/>
      </View>
      <Button
      title ="Switch Camera"
      onPress={() => {
        setType(
          type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
        )
      }}>
      </Button>
      <Button title = "Take Picture" onPress={() => takePicture()}/>
      <Button title = "Pick Image From Gallery" onPress={() => pickImage()}/>
      { image && <Image source = {{uri: image}} style= {styles.imageContainer}/> }
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  imageContainer: {
    flex: 1
  }
});