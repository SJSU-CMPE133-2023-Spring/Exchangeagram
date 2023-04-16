import { StatusBar } from 'expo-status-bar';
import react from 'react';

// Fire Base Components
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

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
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// React Navigation Components
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initalRouteName="Landing">
        <Stack.Screen name="Landing" component={LandingScreen} options={{headerShown: false}} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}