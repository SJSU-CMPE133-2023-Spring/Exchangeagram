import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

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
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        onChangeText={(search) => searchUsers(search)}
      />

      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => props.navigation.navigate('Profile', { uid: item.id })}>
            <Text style={styles.userName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 22
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 8,
    margin: 16,
  },
  userItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  userName: {
    fontSize: 16,
  },
});
