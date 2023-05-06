import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';

import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const db = getFirestore();

export default function Search(props) {
  const [users, setUsers] = useState([]);

  const searchUsers = async (search) => {
    const q = query(collection(db, 'users'), where('name', '>=', search));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setUsers(users);
  };

  return (
    <View>
      <TextInput placeholder="Type Here..." onChangeText={(search) => searchUsers(search)} />

      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>
            <Text>{item.name}</Text>
          </TouchableOpacity>  
        )}
      />
    </View>
  );
}
