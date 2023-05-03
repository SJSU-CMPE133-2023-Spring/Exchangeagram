import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';

export default function App({ navigation }) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [showCamera, setShowCamera] = useState(true);
  const [showRetake, setShowRetake] = useState(false);


  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
      setShowRetake(true);
      setShowCamera(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

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
      setShowRetake(true);
      setShowCamera(false);
  }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
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
    <View style={styles.container}>
      {image && (
        <SafeAreaView style={styles.uploadButtonContainer}>
          <Button
            title="Upload Picture"
            onPress={() => navigation.navigate('SavePhoto', { image })}
          />
        </SafeAreaView>
      )}
      <View style={styles.cameraContainer}>
        {showCamera ? (
          <Camera
            ref={ref => setCamera(ref)}
            style={styles.fixedRatio}
            type={type}
            ratio={'1:1'}
          />
        ) : (
          <View>
            <Image source={{ uri: image }} style={styles.imageFixedRatio} />
            {showRetake && (
              <Button
                title="Retake"
                onPress={() => {
                  setImage(null);
                  setShowRetake(false);
                  setShowCamera(true);
                }}
              />
            )}
          </View>
        )}
      </View>
      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={toggleCameraType} style={styles.iconContainer}>
          <Ionicons name="camera-reverse-outline" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={takePicture} style={styles.iconContainer}>
          <Ionicons name="ellipse-outline" size={72} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage} style={styles.iconContainer}>
          <Ionicons name="images-outline" size={32} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },imageFixedRatio: {
    width: '100%',
    aspectRatio: 1,
  }
});
