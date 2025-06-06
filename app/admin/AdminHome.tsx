import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import styles from './AdminHomeScreen.styles.tsx';

const AdminHomeScreen = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = async (role: 'Admin' | 'Teacher' | 'Student' | 'Update' | 'Delete' | 'Timetable') => {
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
      case 'Timetable':
        router.push('/admin/add/addTimetable');
        break;
    }
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace('/');
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert('Logout Failed', 'Something went wrong. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <LinearGradient colors={['#e0f7fa', '#ffffff']} style={styles.container}>
      <View style={styles.profileSection}>
        <Text style={styles.heading}>Welcome, Admin</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Users</Text>

        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Admin')} disabled={isLoading}>
          <Ionicons name="person-add-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}> Add Admin</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Teacher')} disabled={isLoading}>
          <Ionicons name="school-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}> Add Teacher</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Student')} disabled={isLoading}>
          <Ionicons name="people-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}> Add Student</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Timetable')} disabled={isLoading}>
    <Ionicons name="calendar-outline" size={20} color="#fff" />
    <Text style={styles.buttonText}> Add Timetable</Text>
  </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Manage Users</Text>

        <TouchableOpacity style={styles.updateButton} onPress={() => handleNavigation('Update')} disabled={isLoading}>
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}> Update User</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => handleNavigation('Delete')} disabled={isLoading}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}> Delete User</Text>
        </TouchableOpacity>
      </View>

      {isLoading && <ActivityIndicator style={{ marginTop: 20 }} color="#007bff" />}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}> Logout</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default AdminHomeScreen;