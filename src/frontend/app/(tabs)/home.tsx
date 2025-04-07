import React from 'react';
import { UserContext } from '@/context/UserContext';
import { useUser } from '@/context/UserContext'
import { View, Text, StyleSheet, Image, ScrollView, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

const HomePage = () => {
  const { user } = useUser();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.headerSection}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.username}>{user?.username}!</Text>
          </View>
          <View style={styles.gifSection}>
            <Image
              source={{ uri: 'https://i.gifer.com/3iCT.gif' }}
              style={styles.rotatingGif}
              resizeMode="contain"
              height={600}
            />
          </View>
        </View>

        <View style={styles.recentActivitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>Your last hair survey was completed</Text>
            <Text style={styles.activityDate}>2 days ago</Text>
          </View>
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>New recommendations available</Text>
            <Text style={styles.activityDate}>5 days ago</Text>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 40,
    marginBottom: 30,
  },
  welcomeSection: {
    flex: 1,
    marginRight: 20,
  },
  welcomeText: {
    fontSize: 24,
    color: '#333',
    marginBottom: 5,
  },
  username: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  gifSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rotatingGif: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  recentActivitySection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  activityText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  activityDate: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomePage;
