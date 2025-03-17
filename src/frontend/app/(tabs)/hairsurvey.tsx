import React from 'react';
import { UserContext } from '@/context/UserContext';
import { useUser } from '@/context/UserContext'
import { Link } from 'expo-router';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const HairSurveyPage = () => {
  const { user } = useUser()
  return (
    <View style={styles.container}>
        <View style={styles.header}>
        <Text style={styles.title}>Hair Survey Will be Implemented Next Sprint</Text>
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  section: {
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  text: {
    color: '#000',
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  role: {
    fontSize: 14,
    color: 'hsl(0, 0%, 70%)',
    marginBottom: 20,
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

export default HairSurveyPage;
