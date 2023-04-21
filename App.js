import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { View, Text } from 'react-native'

// Fire Base Components
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyC63abKl535Hdz0gHccQ9qAFF-bHxWamOw",
  authDomain: "exchangeagram-b6617.firebaseapp.com",
  projectId: "exchangeagram-b6617",
  storageBucket: "exchangeagram-b6617.appspot.com",
  messagingSenderId: "17035677494",
  appId: "1:17035677494:web:1690c2231be362112a6d97",
  measurementId: "G-3Q716G2L8Q"
};

// INIT Firebase Components
export const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase);

// React Navigation Components
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'

// Screens
import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'

const Stack = createStackNavigator();

export class App extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      loaded: false,
    }
  }

  // Check if in specific life mount to render view
  componentDidMount(){
    // Check if the User has already logged in
    onAuthStateChanged(auth, (user) => {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      }else{
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }

  render() {
    const { loggedIn, loaded } = this.state;
    if(!loaded){
      return(
        <View style = {{ flex: 1, justifyContent: 'center'}}>
          <Text>Loading</Text>
        </View>
      )
    }

    if(!loggedIn){
      return (
        <NavigationContainer>
          <Stack.Navigator initalRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{headerShown: false}} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return(
      <View style = {{ flex: 1, justifyContent: 'center'}}>
        <Text>User is logged in</Text>
      </View>
    )
  }
}

export default App