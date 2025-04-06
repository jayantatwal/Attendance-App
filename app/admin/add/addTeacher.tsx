import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig.js';
import { useRouter } from 'expo-router';

const AddTeacher = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subjects, setSubjects] = useState<string[]>(['']);
  const router = useRouter();

  const role = 'Teacher';

  //This function is adding a new empty subject field when the user taps "Add Another Subject".
  const handleAddSubject = () => {
    setSubjects([...subjects, '']);
  };

  //Updates a specific subject's value when the user types in it.
  const handleSubjectChange = (text: string, index: number) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = text;
    setSubjects(updatedSubjects);
  };

  const handleSubmit = async () => {
    if (!name || !email || !password || subjects.some(subject => subject.trim() === '')) {
      Alert.alert('Validation Error', 'Please fill all fields and subjects.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const teacherData = {
        name,
        email,
        role: role.toLowerCase(),
        subjects,
      };
    
      //Take the teacherData and save it to the Firestore users collection, using the teacher’s uid as the document ID.
      await setDoc(doc(db, 'users', uid), teacherData);

      Alert.alert('Success', 'Teacher added successfully.');
      router.back(); // Navigate back after success
    } catch (error: any) {
      console.log('Error creating teacher:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add Teacher</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.subHeading}>Subjects</Text>
      {subjects.map((subject, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Subject ${index + 1}`}
          value={subject}
          onChangeText={(text) => handleSubjectChange(text, index)}
        />
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddSubject}>
        <Text style={styles.addButtonText}>+ Add Another Subject</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Create Teacher</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddTeacher;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
