import React from 'react';
import { UserContext } from '@/context/UserContext';
import { useUser } from '@/context/UserContext'
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity, Image } from 'react-native';
import { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const HomePage = () => {
  const { user } = useUser();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Default profile image if user doesn't have one
  const profileImage = user?.profileImage || 'https://ui-avatars.com/api/?name=' + (user?.username || 'User') + '&background=random';

  const handleProfilePress = () => {
    router.push('/profile');
  };

  const handleRecommendationsPress = () => {
    router.push('/recommendation');
  };

  const handleNewSurveyPress = () => {
    router.push('/hairsurvey')
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.username}>{user?.username}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
            <Image 
              source={{ uri: profileImage }} 
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleNewSurveyPress}>
              <Ionicons name="clipboard-outline" size={24} color="#333" />
              <Text style={styles.actionText}>New Survey</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleRecommendationsPress}>
              <Ionicons name="analytics-outline" size={24} color="#333" />
              <Text style={styles.actionText}>Profiles</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="calendar-outline" size={24} color="#333" />
              <Text style={styles.actionText}>Upcoming</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityIconContainer}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Hair survey completed</Text>
              <Text style={styles.activityDate}>2 days ago</Text>
            </View>
          </View>
          <View style={styles.activityCard}>
            <View style={styles.activityIconContainer}>
              <Ionicons name="notifications-outline" size={20} color="#2196F3" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>New recommendations available</Text>
              <Text style={styles.activityDate}>5 days ago</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 18,
    color: '#666',
    marginBottom: 4,
  },
  username: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
  },
  profileButton: {
    padding: 5,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 12,
  },
  quickActionsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  recentActivitySection: {
    marginBottom: 20,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIconContainer: {
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomePage;
