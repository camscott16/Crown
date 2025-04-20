import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, TextInput, Button } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfilePage = () => {
  const { user, setUser } = useUser();
  const { logout } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isNotificationsModalVisible, setNotificationsModalVisible] = useState(false);
  const [isPrivacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUri, setAvatarUri] = useState(user?.profileImage || '');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleNotificationsModal = () => {
    setNotificationsModalVisible(!isNotificationsModalVisible);
  };

  const togglePrivacyModal = () => {
    setPrivacyModalVisible(!isPrivacyModalVisible);
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const { uri } = result.assets[0];
        console.log('Selected image URI:', uri); // Debug log
        setAvatarUri(uri);
        
        // Save immediately when image is picked
        if (user && user.user_id) {
          const updatedUser = { ...user, profileImage: uri };
          console.log('Saving user with new image:', updatedUser); // Debug log
          setUser(updatedUser);
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error('Error picking/saving image:', error);
      alert('Failed to save profile picture. Please try again.');
    }
  };

  const handleSave = async () => {
    try {
      if (user && user.user_id) {
        const updatedUser = { ...user, username, email, profileImage: avatarUri };
        console.log('Saving user data:', updatedUser); // Debug log
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        toggleModal();
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      alert('Failed to save profile changes. Please try again.');
    }
  };

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
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: avatarUri || 'https://www.vecteezy.com/png/58465446-generic-user-profile-icon-in-3d-design-modern-avatar-placeholder-digital-identity-symbol-abs' }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Profile Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity style={styles.menuItem} onPress={toggleModal}>
              <Text style={styles.menuItemText}>Edit Profile</Text>
              <Text style={styles.menuItemIcon}>→</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={toggleNotificationsModal}>
              <Text style={styles.menuItemText}>Notifications</Text>
              <Text style={styles.menuItemIcon}>→</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={togglePrivacyModal}>
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

        {/* Edit Profile Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              <Button title="Choose Profile Image" onPress={pickImage} />
              <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={toggleModal} />
                <Button title="Save" onPress={handleSave} />
              </View>
            </View>
          </View>
        </Modal>

        {/* Notifications Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isNotificationsModalVisible}
          onRequestClose={toggleNotificationsModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <Text style={styles.modalParagraph}>Notification System coming soon!</Text>
              <Button title="Close" onPress={toggleNotificationsModal} />
            </View>
          </View>
        </Modal>

        {/* Privacy Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isPrivacyModalVisible}
          onRequestClose={togglePrivacyModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>More About Privacy</Text>
              <Text style={styles.modalParagraph}>We, the developers of Crown, vow to never share your data with any of 
                your personal or private data with any outiside organizations or parties. We care deeply about the safety of our Users!</Text>
              <Button title="Close" onPress={togglePrivacyModal} />
            </View>
          </View>
        </Modal>
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
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalParagraph: {
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ProfilePage;
