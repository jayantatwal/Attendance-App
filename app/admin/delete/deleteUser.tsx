import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { db } from '../../../firebaseConfig.js'; // adjust path if needed
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';

const DeleteUser = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!email) {
      Alert.alert("Input Error", "Please enter the user's email.");
      return;
    }

    setIsLoading(true);

    try {
      // Search for user by email
      const q = query(collection(db, 'users'), where('email', '==', email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        Alert.alert("User Not Found", "No user with this email exists in the database.");
        setIsLoading(false);
        return;
      }

      // Assuming only one match
      const userDoc = snapshot.docs[0];
      const uid = userDoc.id;

      await deleteDoc(doc(db, 'users', uid));

      Alert.alert("Success", `User with email ${email} has been deleted from the database.`);
      setEmail('');
    } catch (error: any) {
      console.error("Delete user error:", error.message);
      Alert.alert("Error", "Something went wrong while deleting the user.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Delete User</Text>

      <TextInput
        placeholder="Enter user's email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TouchableOpacity onPress={handleDelete} style={styles.button} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Delete User</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default DeleteUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  button: {
    backgroundColor: 'red',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
