import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js'; 

const AdminHomeScreen = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddUser = async (role: 'Admin' | 'Teacher' | 'Student' | 'Update' | 'Delete') => {
    setIsLoading(true);
    switch (role) {
      case 'Admin':
        router.push('/admin/add/addAdmin');
        break;
      case 'Teacher':
        router.push('/admin/add/addTeacher');
        break;
      case 'Student':
        router.push('/admin/add/addStudent');
        break;
      case 'Update':
        router.push('/admin/update/updateUser');
        break;
      case 'Delete':
        router.push('/admin/delete/deleteUser');
        break;
    }
    setTimeout(() => setIsLoading(false), 300);
  };

  //Handles the logout button
  const handleLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace('/'); // Replace with your login screen route
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert('Logout Failed', 'Something went wrong. Please try again.');
            }
          },
        },
      ],
      { cancelable: true } //means the user can also dismiss the dialog by tapping outside it (on Android).
    );
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Dashboard</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleAddUser('Admin')} disabled={isLoading}>
        <Text style={styles.buttonText}>Add Admin</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleAddUser('Teacher')} disabled={isLoading}>
        <Text style={styles.buttonText}>Add Teacher</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleAddUser('Student')} disabled={isLoading}>
        <Text style={styles.buttonText}>Add Student</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.updateButton} onPress={() => handleAddUser('Update')} disabled={isLoading}>
        <Text style={styles.buttonText}>Update User</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={() => handleAddUser('Delete')} disabled={isLoading}>
        <Text style={styles.buttonText}>Delete User</Text>
      </TouchableOpacity>

      {isLoading && <ActivityIndicator style={{ marginTop: 20 }} color="#007bff" />}

      {/* Logout button at the bottom */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminHomeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2', // Soft background
    padding: 24,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 26,
    marginBottom: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#4A90E2', // Brighter blue
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  updateButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    paddingVertical: 16,
    backgroundColor: '#6c757d',
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});





