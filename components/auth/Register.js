import React, { Component } from 'react'
import { View, Button, TextInput  } from 'react-native'


import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"

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
        createUserWithEmailAndPassword(auth, email, password)
        .then((result) => { // Succesfull Sign Up
            console.log(result)
        })
        .catch((error) => { // Error on Sign Up
            console.log(error)
        });
    }

  render() {
    return (
      <View>
        <TextInput
            placeholder = "name"
            onChangeText={ (name) => this.setState({ name })}
        />
        <TextInput
            placeholder = "email"
            onChangeText={ (email) => this.setState({ email })}
        />
        <TextInput
            placeholder = "password"
            secureTextEntry={ true }
            onChangeText={ (password) => this.setState({ password })}
        />
        <Button
            title="Sign Up"
            onPress={() => this.onSignUp()}
        />
      </View>
    )
  }
}

export default Register