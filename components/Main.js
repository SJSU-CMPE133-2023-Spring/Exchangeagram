import React, { Component } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { connect } from 'react-redux';
import { fetchUser, fetchUserPosts } from '../redux/actions';
import FeedScreen from './main/Feed'
import ProfileScreen from './main/Profile'
import { bindActionCreators } from 'redux';

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen =() => {
    return(null)
}

export class Main extends Component {
  componentDidMount() {
    this.props.fetchUser();
    this.props.fetchUserPosts();
  }

  render() {
    return (
        <Tab.Navigator initialRouteName="Feed" labeled ={false}>
            <Tab.Screen name="Feed" component={ FeedScreen } 
            options={ {
                tabBarIcon: ({ color, size}) => (
                    <MaterialCommunityIcons name = "home" color = {color} size={26}/>
                ),
            }}/>
            <Tab.Screen name="UploadContainer" component = { EmptyScreen } 
            listeners={({ navigation }) => ({
                tabPress: event => {
                    event.preventDefault()
                    navigation.navigate("Upload")
                }
            })}
            options={ { 
                tabBarIcon: ({ color, size}) => (
                    <MaterialCommunityIcons name = "plus-box" color = {color} size={26}/>
                ),
            }}/>
            <Tab.Screen name="Profile" component={ ProfileScreen } 
            options={ {
                tabBarIcon: ({ color, size}) => (
                    <MaterialCommunityIcons name = "account-circle" color = {color} size={26}/>
                ),
            }}/>
        </Tab.Navigator>
    );
  }
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserPosts}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
