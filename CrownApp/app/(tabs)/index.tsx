import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../icon.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to Crown!</Text>
      <Text style={styles.subtitle}></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
});
