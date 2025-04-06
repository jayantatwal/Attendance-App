

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TeacherHome = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is Teacher's Home Page</Text>
    </View>
  );
};

export default TeacherHome;

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
