// components/Navbar.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Image } from 'expo-image'

const Navbar = () => {
  return (
    <View style={styles.navbarContainer}>
        <View style={styles.navbar}>
        <Link href="/(tabs)/home">
            <Image
                source={require('../assets/images/home_icon.png')}
                style={styles.navItem}
                contentFit="cover" 
            />
        </Link>
        <Link href="/(tabs)/recommendation">
            <Image
                source={require('../assets/images/explore_icon.png')}  // Local image
                style={styles.navItem}
                contentFit="cover"  // Adjust how the image is scaled to fit the container
            />
        </Link>
        <Link href="/(tabs)/profile">
            <Image
                source={require('../assets/images/profile_icon.png')}  // Local image
                style={styles.navItem}
                contentFit="cover"  // Adjust how the image is scaled to fit the container
            />
        </Link>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    navbarContainer: {
        justifyContent: `flex-start`,
        backgroundColor: 'black',
        borderTopColor: 'hsl(0, 0%, 20%)',
        borderTopWidth: 2, // Adjust thickness of the border
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'hsl(0, 0%, 10%)',
        padding: 10,
        paddingBottom: 50,
        height: 100,
    },
    navItem: {
        width: 30,
        height: 30,
        padding: 15,
        // backgroundColor: 'hsl(0, 0%, 50%)'
    },
});

export default Navbar;