// components/Navbar.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Image } from 'expo-image'
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';

const Navbar = () => {

    const [activeTab, setActiveTab] = useState<number>(1);
    const positions = [0, 133, 266];

    return (
    <View style={styles.navbarContainer}>
        <View style={styles.navbar}>
        <MotiView 
            from={{ 
                translateX: positions[activeTab - 1],
                opacity: 0, 
            }}
            animate={{
                translateX: positions[activeTab - 1],
                opacity: 1, 
            }}
            transition={{ type: 'timing', duration: 500, easing: Easing.out(Easing.exp), }}   
            style={styles.selectHover}>
        </MotiView>
            <Link href="/(tabs)/home" onPress={() => setActiveTab(1)}>
                <View style={styles.navItem}>
                    <Image
                        source={require('../assets/images/home.png')}
                        style={styles.navImg}
                        contentFit="contain" 
                    />
                </View>
            </Link>
            <Link href="/(tabs)/recommendation" onPress={() => setActiveTab(2)}>
                <View style={styles.navItem}>
                    <Image
                        source={require('../assets/images/quiz.png')}  // Local image
                        style={styles.navImg}
                        contentFit="contain"  // Adjust how the image is scaled to fit the container
                    />
                </View>
            </Link>
            <Link href="/(tabs)/profile" onPress={() => setActiveTab(3)}>
                <View style={styles.navItem}>
                    <Image
                        source={require('../assets/images/account.png')}  // Local image
                        style={styles.navImg}
                        contentFit="contain"  // Adjust how the image is scaled to fit the container
                    />
                </View>
            </Link>
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
    navbarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'hsl(0, 0%, 100%)',
        borderTopColor: 'hsl(0, 0%, 95%)',
        borderTopWidth: 0, // Adjust thickness of the border
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'hsl(0, 0%, 95%)',
        // paddingBottom: 50,
        height: 75,
        width: 400,
        marginBottom: 30,
        borderRadius: 50,
    },
    navItem: {
        width: 133,
        height: 75,
        padding: 25, // space around the image
        backgroundColor: 'hsl(0, 0%, 95%, 0)',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navImg: {
        width: '100%',
        height: '100%',
    },
    selectHover: {
        position: 'absolute',
        borderRadius: 50,
        width: 133,
        height: 75,
        backgroundColor: 'hsl(0, 0%, 90%)',
    }
});

export default Navbar;