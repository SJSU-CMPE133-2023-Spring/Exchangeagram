import React, { Component } from 'react';
import { View, Text } from 'react-native'

// Import firebase components
import firebaseApp from './components/firebaseConfig.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { Provider } from 'react-redux'; 
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './redux/reducers';

const store = configureStore({
  reducer: rootReducer,
});

// INIT Firebase Components
export const auth = getAuth(firebaseApp);

// React Navigation Components
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'

// Screens
import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'
import UploadScreen from './components/main/Upload'
import SavePhotoScreen from './components/main/SavePhoto'

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
            <Stack.Screen name="Register" component={RegisterScreen} navigation={this.props.navigation} />
            <Stack.Screen name="Login" component={LoginScreen} navigation={this.props.navigation} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return(
      <Provider store = { store }>
        <NavigationContainer>
          <Stack.Navigator initalRouteName="Main">
              <Stack.Screen name="Main" component={ MainScreen } options={{ headerShown: false }} />
              <Stack.Screen name="Upload" component={ UploadScreen } navigation= { this.props.navigation }/>
              <Stack.Screen name="SavePhoto" component={ SavePhotoScreen }/>
            </Stack.Navigator>
          </NavigationContainer>
      </Provider>
    )
  }
}

export default App