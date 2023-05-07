import React, {useState, useEffect} from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { getAuth, currentUser } from 'firebase/auth';
import { getFirestore, collection, doc, getDocs, query, orderBy, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

const db = getFirestore();

function Feed(props) {
  const [posts, setPosts] = useState([]);

  const auth = getAuth();
  const currentUserUid = auth.currentUser.uid;

  useEffect(() => {
    let posts = [];
    if (props.usersLoaded == props.following.length){
      for (let i = 0; i < props.following.length; i++){
        const user = props.users.find(el => el.uid === props.following[i]);
        if (user != undefined){
          posts = [...posts, ...user.posts]
        }
      }
      posts.sort(function(x,y) {
        return x.creation - y.creation;
      })
      setPosts(posts);
    }


  }, [props.usersLoaded])

  return (
    <View style={styles.container}>
      <View style={styles.gallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
              <Text style={styles.container}>{item.user.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
});

export default connect(mapStateToProps, null)(Feed);

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
  description: {
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
