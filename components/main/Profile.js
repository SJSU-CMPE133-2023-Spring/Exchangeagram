import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

function Profile(props) {
  const { currentUser, posts } = props;
  console.log({currentUser, posts})

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>USERNAMEHERE</Text>
        <View style={styles.userInfo}>
          <Image
            style={styles.profileImage}
            source={{ uri: 'https://via.placeholder.com/150' }}
          />
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{posts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>
        <Text style={styles.name}>{currentUser.name}</Text>
        <Text style={styles.descritpion}>descritpion will go here</Text>
      </View>
      <View style={styles.gallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
    );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
});

export default connect(mapStateToProps, null)(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  descritpion: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
    paddingBottom: 16,
  },
  gallery: {
    flex: 1,
  },
  imageContainer: {
    flex: 1 / 3,
    aspectRatio: 1,
    margin: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
