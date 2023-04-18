import react, { Component } from 'react'
import { View, Button, TextInput  } from 'react-native'


import { getAuth, signInWithEmailAndPassword } from "firebase/auth"

export class Login extends Component {
    constructor(props){
        super(props);

        this.state = {
            email : '',
            password: ''
        }
        this.onSignUp = this.onSignUp.bind(this);
    }

    onSignUp(){
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
      <View>
        <TextInput
            placeholder = " Email "
            onChangeText={ (email) => this.setState({ email })}
        />
        <TextInput
            placeholder = " Password "
            secureTextEntry={ true }
            onChangeText={ (password) => this.setState({ password })}
        />
        <Button
            title="Sign In"
            onPress={() => this.onSignUp()}
        />
      </View>
    )
  }
}

export default Login