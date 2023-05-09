import React, { useState } from 'react';
import { View, TextInput, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';

// Firebase Components
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function PhotoSave(props) {
  const [caption, setCaption] = useState('');

  const uploadImage = async () => {
    const uri = props.route.params.image;
    const auth = getAuth();
    const childPath = `post/${auth.currentUser.uid}/${Math.random().toString(36)}`;
    console.log(childPath);
  
    const response = await fetch(uri);
    const blob = await response.blob();
  
    const storage = getStorage();
    const storageRef = ref(storage, childPath);
    const task = uploadBytesResumable(storageRef, blob);
  
    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };
  
    const taskCompleted = async () => {
      const downloadURL = await getDownloadURL(storageRef);
      savePostData(downloadURL);
      console.log(downloadURL);
    };
  
    const taskError = (snapshot) => {
      console.log(snapshot);
    };
  
    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };
  

  const savePostData = async (downloadURL) => {
    const auth = getAuth();
    const db = getFirestore();
    const postsRef = collection(db, 'posts', auth.currentUser.uid, 'userPosts');
  
    try {
      await addDoc(postsRef, {
        downloadURL,
        caption,
        likesCount: 0,
        creation: serverTimestamp(),
      });
      props.navigation.popToTop();
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };
  
    return (
      <View style={styles.container}>
        <Image source={{ uri: props.route.params.image }} style={styles.previewImage} />
        <View style={styles.captionContainer}>
          <TextInput
            style={styles.captionInput}
            placeholder="Write a Caption . . ."
            onChangeText={(caption) => setCaption(caption)}
          />
          <TouchableOpacity style={styles.uploadButton} onPress={() => uploadImage()}>
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    previewImage: {
      width: '100%',
      height: '50%',
    },
    captionContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    captionInput: {
      flex: 1,
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginRight: 10,
    },
    uploadButton: {
      backgroundColor: '#3897f0',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
    },
    uploadButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });
