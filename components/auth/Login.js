import react, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity  } from 'react-native'


import { getAuth, signInWithEmailAndPassword } from "firebase/auth"

export class Login extends Component {
    constructor(props){
        super(props);

        this.state = {
            email : '',
            password: ''
        }
        this.onSignIn = this.onSignIn.bind(this);
    }

    onSignIn(){
        const { email, password } = this.state;
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
        .then((result) => { // Succesfull Sign In
            console.log(result)
        })
        .catch((error) => { // Error on Sign In
            console.log(error)
        });
    }

  render() {
    return (
        // TextInputScreens for Email and Password
      <View style={styles.container} >
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
        <TouchableOpacity style={styles.button} onPress={() => this.onSignIn()}>
            <Text style={styles.buttonText}>Log In</Text>
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

export default Login