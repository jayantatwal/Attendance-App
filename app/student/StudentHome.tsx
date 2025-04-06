// app/student/studentHome.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StudentHome = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is Student's Home Page</Text>
    </View>
  );
};

export default StudentHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
