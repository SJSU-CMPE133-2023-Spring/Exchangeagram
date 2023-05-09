import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'


import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { getFirestore, collection } from "firebase/firestore"
import { doc, setDoc } from "firebase/firestore";

export class Register extends Component {
    constructor(props){
        super(props);

        this.state = {
            name: '',
            email : '',
            password: ''
        }
        this.onSignUp = this.onSignUp.bind(this);
    }

    onSignUp(){
        const { name, email, password } = this.state;
        const auth = getAuth();
        const db = getFirestore();
        createUserWithEmailAndPassword(auth, email, password)
        .then(async (currentUser) => { // Succesfull Sign Up
            await setDoc(doc(db, "users", currentUser.user.uid), {
                name,
                email
            })
            console.log(currentUser)
        })
        .catch((error) => { // Error on Sign Up
            console.log(error)
        });
    }

  render() {
    return (
        // TextInputScreens for Sign Up
      <View style={styles.container} >
        <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#a6a6a6"
            onChangeText = { (name) => this.setState({ name })}
        />
        <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#a6a6a6"
            onChangeText = { (email) => this.setState({ email })}
        />
        <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#a6a6a6"
            secureTextEntry={true}
            onChangeText={(password) => this.setState({ password })}
        />
        <TouchableOpacity style={styles.button} onPress={() => this.onSignUp()}>
            <Text style={styles.buttonText}>Sign Up</Text>
             </TouchableOpacity>
      </View>
    )
  }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: 200,
      height: 60,
      marginBottom: 30,
    },
    input: {
      borderWidth: 1,
      borderColor: '#dbdbdb',
      borderRadius: 5,
      padding: 10,
      marginVertical: 5,
      width: 300,
      fontSize: 16,
    },
    button: {
      backgroundColor: '#0095f6',
      borderRadius: 5,
      padding: 10,
      marginTop: 10,
      width: 300,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: '#dbdbdb',
    },
});

export default Register