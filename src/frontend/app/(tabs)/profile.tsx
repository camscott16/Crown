import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfilePage = () => {
  const { user, setUser } = useUser();
  const { logout } = useAuth();

  // Commenting out the image picker functionality
  // const pickImage = async () => {
  //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (status !== 'granted') {
  //     Alert.alert(
  //       'Permission required',
  //       'Permission to access your media library is needed to select a profile picture.'
  //     );
  //     return;
  //   }

  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     const { uri } = result.assets[0];
  //     setAvatarUri(uri);
  //     const updatedUser = { ...user, profileImage: uri };
  //     setUser(updatedUser);
  //     try {
  //       await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  //     } catch (error) {
  //       console.error('Error saving user data:', error);
  //     }
  //   }
  // };

  return (
    <ScrollView style={styles.container}>
      <MotiView 
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 500, easing: Easing.out(Easing.ease) }}
        style={styles.content}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {/* Commenting out the avatar UI element */}
           {/* <View style={styles.avatarContainer} onPress={pickImage}>
            <Image
              source={{ uri: avatarUri || 'https://via.placeholder.com/100' }}
              style={styles.avatar}
            />
          </View> */}
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View> 

        {/* Profile Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Edit Profile</Text>
              <Text style={styles.menuItemIcon}>→</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Notifications</Text>
              <Text style={styles.menuItemIcon}>→</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Privacy</Text>
              <Text style={styles.menuItemIcon}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hair Profile</Text>
          <View style={styles.sectionContent}>
            {user?.hair_profiles[0] ? (
              <>
                <View style={styles.profileInfo}>
                  <Text style={styles.infoLabel}>Hair Type</Text>
                  <Text style={styles.infoValue}>{user.hair_profiles[0].curl_type}</Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.infoLabel}>Porosity</Text>
                  <Text style={styles.infoValue}>{user.hair_profiles[0].porosity}</Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.infoLabel}>Volume</Text>
                  <Text style={styles.infoValue}>{user.hair_profiles[0].volume}</Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.infoLabel}>Desired Outcome</Text>
                  <Text style={styles.infoValue}>{user.hair_profiles[0].desired_outcome}</Text>
                </View>
              </>
            ) : (
              <TouchableOpacity style={styles.createProfileButton}>
                <Text style={styles.createProfileText}>Create Hair Profile</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </MotiView>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  menuItemIcon: {
    fontSize: 16,
    color: '#666',
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  createProfileButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  createProfileText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfilePage;
