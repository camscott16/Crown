import React from 'react';
import { UserContext } from '@/context/UserContext';
import { useUser } from '@/context/UserContext'
import { View, Text, StyleSheet, Image } from 'react-native';

const HomePage = () => {
  const { user } = useUser()
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Your Dashboard</Text>
      </View>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://gifer.com/en/Y3iq' }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.role}>{user?.role == 0 ? "Customer" : "Admin"}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Recent Activity</Text>
        <Text style={styles.text}>
          Here you can display your recent activity or achievements.
        </Text>
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
  }
});

export default HomePage;
