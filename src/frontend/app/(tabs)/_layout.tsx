import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router'; // Slot to render child routes
import { Tabs } from 'expo-router'; // Tabs component for tab navigation
import Navbar from '../../components/navbar'; // Import Navbar component

const Layout = () => {
  return (
    <View style={styles.container}>
      {/* Render the tab navigation */}
      <Tabs>
        <View style={styles.contentContainer}>
          {/* Render the content of the active tab */}
          <Slot />
        </View>
      </Tabs>

      {/* Navbar fixed at the bottom */}
      <View style={styles.navbarContainer}>
        <Navbar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Content starts from the top
    backgroundColor: '#fff', // White background
  },
  contentContainer: {
    flex: 1, // Fill up remaining space with the content
  },
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black', // Navbar background color
    zIndex: 100, // Ensure navbar is on top of other elements
  },
});

export default Layout;