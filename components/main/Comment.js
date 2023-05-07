import React, { useState, useEffect} from 'react'
import { View, Text, FlatList, Button, TextInput } from 'react-native'

import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, getDocs } from 'firebase/firestore';

export default function Comment(props) {
  const [comments, setComments]  = useState([])
  const [postId, setPostId] = useState("")
  const [text, setText] = useState("")

  useEffect(() => {
    const fetchComments = async () => {
      if (props.route.params.postId !== postId) {
        const db = getFirestore();

        const commentsRef = collection(doc(db,'posts',props.route.params.uid,'userPosts',props.route.params.postId,'comments'));

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
  }, [props.route.params.postId])

  return (
    <View>
      <FlatList>
        numColumns = {1}
        horizontal = {false}
        data = {comments}
        renderItem = {({item}) => (
          <View>
            <Text>{item.text}</Text>
          </View>
        )}
      </FlatList>
    </View>
  );
}