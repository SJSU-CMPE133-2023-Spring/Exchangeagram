import React, { useState, useEffect} from 'react'
import { View, Text, FlatList, Button, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, getDocs, addDoc } from 'firebase/firestore';

function Comment(props) {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    function matchUserToComment(comments){
      for(let i = 0; i < comments.length; i++){
        if (comments[i].hasOwnProperty('user')){
          continue;
        }
        const user = props.users.find(x => x.uid === comments[i].creator)
        if (user == undefined) {
          props.fetchUsersData(comments[i].creator, false)
        }
        else {
          comments[i].user = user
        }
      }
      setComments(comments)
    }

    const fetchComments = async () => {
      if (props.route.params.postId !== postId) {
        const db = getFirestore();
        const commentsRef = collection(db,'posts',props.route.params.uid,'userPosts',props.route.params.postId,'comments');
        const querySnapshot = await getDocs(commentsRef);
        const commentsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        matchUserToComment(commentsData);
        setPostId(props.route.params.postId);
      }
      else {
        matchUserToComment(comments);
      }
    };
    fetchComments();
  }, [props.route.params.postId, props.users]);

  const onCommentSend = async () => {
    const auth = getAuth();
    const db = getFirestore();

    await addDoc(collection(db,'posts',props.route.params.uid,'userPosts',props.route.params.postId,'comments'),
      {
        creator: auth.currentUser.uid,
        text: text,
      }
    );
    setText('');
  };

  return (
    <View>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => (
          <View>
            {item.user !== undefined ?
            <Text>
              {item.user.name}
            </Text>
            : null}
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <View>
        <TextInput
          placeholder="comment..."
          onChangeText={(text) => setText(text)}
        />
        <Button onPress={onCommentSend} title="Send" />
      </View>
    </View>
  );
}

const mapStateToProps = (store) => ({
  users: store.usersState.users
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Comment);