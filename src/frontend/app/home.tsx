import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Home () {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>Welcome, Guest!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000', // Black text
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
  },
});
