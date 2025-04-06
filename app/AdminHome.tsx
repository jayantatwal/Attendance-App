import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';

const AdminHomeScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddUser = async (role: 'Admin' | 'Teacher' | 'Student') => {
    setIsLoading(true);
    try {
      // Replace this with actual user creation logic (e.g., Firebase functions)
      console.log(`Creating new user with role: ${role}`);
      setTimeout(() => {
        Alert.alert('Success', `${role} created successfully.`);
        setIsLoading(false);
      }, 1000);
    } catch (error: any) {
      console.log(`Failed to create ${role}:`, error.message);
      Alert.alert('Error', `Failed to create ${role}.`);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Dashboard</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => handleAddUser('Admin')} 
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Add Admin</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => handleAddUser('Teacher')} 
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Add Teacher</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => handleAddUser('Student')} 
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Add Student</Text>
      </TouchableOpacity>

      {isLoading && <ActivityIndicator style={{ marginTop: 20 }} color="#007bff" />}
    </View>
  );
};

export default AdminHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
