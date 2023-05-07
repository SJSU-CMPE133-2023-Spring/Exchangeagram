import React, { useState, useEffect} from 'react'
import { View, Text, FlatList, Button, TextInput } from 'react-native'

import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, getDocs, addDoc } from 'firebase/firestore';

export default function Comment(props) {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
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
        setComments(commentsData);
        setPostId(props.route.params.postId);
      }
    };
    fetchComments();
  }, [props.route.params.postId]);

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