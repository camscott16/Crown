import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ProfilePage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Text style={styles.title}>User Profile</Text>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>John Doe</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>john.doe@example.com</Text>
        <Text style={styles.label}>About Me:</Text>
        <Text style={styles.value}>A short bio about the user goes here.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  profileHeader: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  text: {
    color: '#000',
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
  },
  value: {
    marginLeft: 10,
    color: '#000',
  },
  profileInfo: {
    flexDirection: 'row',
    marginBottom: 10,
  }
});

export default ProfilePage; 