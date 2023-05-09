import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import { getFirestore, collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { connect } from 'react-redux';

function Feed(props) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (props.usersFollowingLoaded === props.following.length && props.following.length !== 0) {
        //console.log('usersFollowingLoaded:', props.usersFollowingLoaded);
        //console.log('props.feed:', props.feed);
        const uniquePosts = [];
        const postIds = new Set();

        props.feed.forEach(post => {
            if (!postIds.has(post.id)) {
                postIds.add(post.id);
                uniquePosts.push(post);
            }
        });

        uniquePosts.sort((x, y) => y.creation - x.creation);
        setPosts(uniquePosts);
    }
}, [props.usersFollowingLoaded, props.feed]);

const onLikePress = async (userId, postId) => {
  const db = getFirestore();
  const likeRef = doc(db, 'posts', userId, 'userPosts', postId, 'likes', getAuth().currentUser.uid);
  await setDoc(likeRef, {});

  // Update the post object in the posts array with the currentUserLike property set to true
  const updatedPosts = posts.map(post => {
    if (post.id === postId) {
      return {
        ...post,
        currentUserLike: true
      };
    }
    return post;
  });
  setPosts(updatedPosts);
};

const onDislikePress = async (userId, postId) => {
  const db = getFirestore();
  const likeRef = doc(db, 'posts', userId, 'userPosts', postId, 'likes', getAuth().currentUser.uid);
  await deleteDoc(likeRef);

  // Update the post object in the posts array with the currentUserLike property set to false
  const updatedPosts = posts.map(post => {
    if (post.id === postId) {
      return {
        ...post,
        currentUserLike: false
      };
    }
    return post;
  });
  setPosts(updatedPosts);
};


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Exchangeagram</Text>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Image style={styles.userImage} source={{ uri: item.user.image || 'https://via.placeholder.com/150' }} />
              <Text style={styles.userName}>{item.user.name}</Text>
            </View>
            <Image style={styles.postImage} source={{ uri: item.downloadURL }} />
            <View style={styles.postActions}>
              {item.currentUserLike ? (
                <TouchableOpacity onPress={() => onDislikePress(item.user.uid, item.id)}>
                  <AntDesign name="heart" size={24} color="red" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => onLikePress(item.user.uid, item.id)}>
                  <AntDesign name="hearto" size={24} color="black" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.uid })}>
                <Text style={styles.viewComments}>View Comments...</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: 60,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    marginTop: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  postContainer: {
    marginBottom: 20,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 300,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  viewComments: {
    marginLeft: 15,
    fontSize: 16,
    color: 'gray',
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  feed: store.usersState.feed,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded,
});

export default connect(mapStateToProps, null)(Feed);
