import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { connect } from 'react-redux';
import { fetchUser } from '../redux/actions';
import { current } from '@reduxjs/toolkit';

export class Main extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    const { currentUser } = this.props;

    // If currentUser has not been fetched before render output this
    if (currentUser == undefined) {
      return <View></View>;
    }

    // currentUser has been fetched
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f8f8' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>{currentUser.name} is logged in</Text>
      </View>
    );
  }
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  fetchUser: () => dispatch(fetchUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
