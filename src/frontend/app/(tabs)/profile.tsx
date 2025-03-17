import React from 'react';
import { useUser } from '@/context/UserContext'
import { useAuth } from '@/context/AuthContext';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const ProfilePage = () => {
  const { user } = useUser();
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Text style={styles.title}>User Profile</Text>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user?.username}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email}</Text>
        <Text style={styles.label}>About Me:</Text>
        <Text style={styles.value}>A short bio about the user goes here.</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
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
    flexDirection: 'column',
    gap: 10,
    marginBottom: 10,
  },
  button: {
    width: '75%',
    height: 50,
    backgroundColor: '#000', // Black button
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff', // White text on button
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ProfilePage; 