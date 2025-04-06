import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const AdminHomeScreen = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAddUser = async (role: 'Admin' | 'Teacher' | 'Student' | 'Update' | 'Delete') => {
    setIsLoading(true);
   // Navigate to respective screens
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

  //This will update the handleAddUser's role and will pass it to the switch case 
  //and depending upon whichever button we pressed it will update the role and open the respective page
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

      <TouchableOpacity 
        style={styles.updateButton} 
        onPress={() => handleAddUser('Update')} 
        disabled={isLoading}
      >
        <Text style={styles.updateButtonText}>Update User</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => handleAddUser('Delete')} 
        disabled={isLoading}
      >
        <Text style={styles.deleteButtonText}>Delete User</Text>
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
  updateButtonText: {
    backgroundColor: '#28a745', // Green
  },
  deleteButtonText: {
    backgroundColor: '#dc3545', // Red
  },
  updateButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#28a745', // Green
  },
  deleteButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#dc3545', // Red
  },
});
