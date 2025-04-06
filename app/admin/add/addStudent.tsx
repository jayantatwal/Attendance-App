// app/admin/addStudent.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig.js';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const AddStudent = () => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const role = 'Student'

  const handleAddStudent = async () => {
    if (!name || !rollNumber || !selectedClass || !email || !password) {
      Alert.alert('Error', 'Please fill all the fields.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const studentData = {
        name,
        rollNumber,
        class: selectedClass,
        email,
        role: role.toLowerCase(), 
      };

      await setDoc(doc(db, 'users', uid), studentData);

      Alert.alert('Success', 'Student created successfully!');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Student</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Roll Number"
        value={rollNumber}
        onChangeText={setRollNumber}
        style={styles.input}
      />

      <Text style={styles.label}>Select Class</Text>
      <View style={styles.input}>
        <Picker
          selectedValue={selectedClass}
          onValueChange={(itemValue) => setSelectedClass(itemValue)}
          style={styles.picker}
          dropdownIconColor="#000"
        >
          <Picker.Item label="-- Select Class --" value="" />
          <Picker.Item label="MCA Morning" value="mca morning" />
          <Picker.Item label="MCA Evening" value="mca evening" />
          <Picker.Item label="MSc Computer Science" value="msc computer science" />
        </Picker>
      </View>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddStudent}>
        <Text style={styles.buttonText}>Add Student</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddStudent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  picker: {
    color: '#000',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
