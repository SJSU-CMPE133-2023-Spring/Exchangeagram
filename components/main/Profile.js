import React, {useState, useEffect} from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { getAuth, currentUser } from 'firebase/auth';
import { getFirestore, collection, doc, getDocs, query, orderBy, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

const db = getFirestore();

function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);

  const auth = getAuth();
  const currentUserUid = auth.currentUser.uid;

  useEffect(() => {
    const auth = getAuth();
    const currentUserUid = auth.currentUser.uid;

    const { currentUser, posts } = props;
    //console.log({ currentUser, posts })

    if(props.route.params.uid === currentUserUid) {
      setUser(currentUser)
      setUserPosts(posts)
    }
    else {
      getDoc(doc(db, "users", props.route.params.uid)).then((snapshot) => {
        if (snapshot.exists()) {
          setUser(snapshot.data());
        }
        else {
          console.log('does not exist ')
        }
      });

      try {
        const fetchUserPosts = async () => {
          const q = query(
            collection(
              doc(collection(db, 'posts'), props.route.params.uid),
              'userPosts'
            ),
            orderBy('creation', 'asc')
          );
          const querySnapshot = await getDocs(q);
          const posts = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const id = doc.id;
            // Convert the 'creation' field to a Unix timestamp
            const creation = data.creation.toMillis();
            return { id, ...data, creation };
          });
          setUserPosts(posts);
        };
        fetchUserPosts();
      } 
      catch (error) {
        console.error('Error fetching user posts:', error);
      }
    }

    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    }
    else {
      setFollowing(false);
    }

  }, [props.route.params.uid, props.following])

  const onFollow = () => {
    setDoc(
      doc(db, 'following', currentUserUid, 'userFollowing', props.route.params.uid),
      {}
    );
  }

  const onUnfollow = () => {
    deleteDoc(
      doc(db, 'following', currentUserUid, 'userFollowing', props.route.params.uid)
    );
  }

  if (user === null) {
    return <View/>
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>{user.name}</Text>
        <View style={styles.userInfo}>
          <Image
            style={styles.profileImage}
            source={{ uri: 'https://via.placeholder.com/150' }}
          />
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{userPosts.length}</Text>
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
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.description}>bio will go here</Text>
        {props.route.params.uid !== currentUserUid ? (
          <View>
            {following ? (
              <Button
                title = "Following"
                onPress = {() => onUnfollow()}
              />
            ) : 
            (
              <Button
                title = "Follow"
                onPress = {() => onFollow()}
              />
            )}
          </View>
        ) : null}
      </View>
      <View style={styles.gallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
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
  following: store.userState.following,
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
