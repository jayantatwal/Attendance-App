import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { doc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig.js';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

const UpdateUserScreen = () => {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [subjects, setSubjects] = useState<string[]>(['']);


  const router = useRouter();


  const fetchUserDetails = async () => {
    if (!email) {
      Alert.alert('Missing Email', 'Please enter an email address.');
      return;
    }
  
    setLoading(true);
    try {
      // Query Firestore for a user document where email matches
      const q = query(collection(db, 'users'), where('email', '==', email));
      const snapshot = await getDocs(q); // Executes the query
  
      if (snapshot.empty) {
        Alert.alert('Not Found', 'No user found with that email.');
        setLoading(false);
        return;
      }
  
      const docSnap = snapshot.docs[0]; // Get the first matched document
      const userData = docSnap.data();  // Extract the data from the document
  
      // Update state based on user data
      setUserId(docSnap.id);
      setName(userData.name);
      setRole(userData.role);
      setRollNumber(userData.rollNumber || '');
      setClassName(userData.className || '');
  
      // If the user is a teacher, load the subjects array
      if (userData.role === 'teacher') {
        setSubjects(userData.subjects || ['']); // if no subjects, default to one empty field
      }
  
      setFetched(true); // Show the update form
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch user.');
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };
  
  const updateUser = async () => {
    if (!name || !role) {
      Alert.alert('Missing Fields', 'Name and Role are required.');
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', userId);

      const updatedData: any = {
        name,
        role,
      };

      if (role === 'student') {
        updatedData.rollNumber = rollNumber;
        updatedData.className = className;
      }
      if (role === 'teacher') {
        updatedData.subjects = subjects.filter((s) => s.trim() !== '');
      }
      

      await updateDoc(userRef, updatedData);
      Alert.alert('Success', 'User updated successfully.');
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert('Update Failed', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Update User</Text>

      <TextInput
        placeholder="Enter User Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.fetchButton} onPress={fetchUserDetails} disabled={loading}>
        <Text style={styles.buttonText}>Fetch User</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator style={{ marginVertical: 10 }} />}

      {fetched && (
        <>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Role"
            value={role}
            editable={false}
            style={[styles.input, { backgroundColor: '#eee' }]}
          />

          {role === 'student' && (
            <>
              <TextInput
                placeholder="Roll Number"
                value={rollNumber}
                onChangeText={setRollNumber}
                style={styles.input}
              />

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={className}
                  onValueChange={(itemValue) => setClassName(itemValue)}
                >
                  <Picker.Item label="Select Class" value="" />
                  <Picker.Item label="MCA Morning" value="MCA Morning" />
                  <Picker.Item label="MCA Evening" value="MCA Evening" />
                  <Picker.Item label="MSc Computer Science" value="MSc Computer Science" />
                </Picker>
              </View>
            </>
          )}
          {role === 'teacher' && (
  <>
    <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Subjects</Text>
    {subjects.map((subject, index) => (
      <TextInput
        key={index}
        placeholder={`Subject ${index + 1}`}
        value={subject}
        onChangeText={(text) => {
          const newSubjects = [...subjects];
          newSubjects[index] = text;
          setSubjects(newSubjects);
        }}
        style={styles.input}
      />
    ))}
    <TouchableOpacity
      style={[styles.fetchButton, { backgroundColor: '#6f42c1', marginBottom: 16 }]}
      onPress={() => setSubjects([...subjects, ''])}
    >
      <Text style={styles.buttonText}>Add Subject</Text>
    </TouchableOpacity>
  </>
)}

          <TouchableOpacity style={styles.updateButton} onPress={updateUser} disabled={loading}>
            <Text style={styles.buttonText}>Update User</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default UpdateUserScreen;

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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  fetchButton: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
