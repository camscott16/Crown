import React, { useState } from 'react';
import * as SecureStore from 'expo-secure-store'
import { Link, useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, Animated } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const { login } = useAuth();

  // form states
  const [formState, setFormState] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // animation stuff
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-100))[0];  // start the toaster msg above the screen

  // misc
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const response = await fetch('https://crown-api-production.up.railway.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // extract the JWT token from the response
        const token = data.jwt_token;
        // use the Authentication Context to handle redirection, token storage.
        login(token);
        console.log("login succesful!")
      } else {
        setToastMessage("Login failed")
        showToast();
        console.error('Login Failed:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch('https://crown-api-production.up.railway.app/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_name: username,
          email: email,
          password: password
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log(data)
        setToastMessage("Signup successful!")
        showToast();
        setFormState("login")
      } else {
        setToastMessage("Signup failed")
        showToast();
        console.error('Signup Failed:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Show toast
  const showToast = () => {
    setToastVisible(true);

    // Animate toast into view
    Animated.spring(slideAnim, {
      toValue: 0, // Slide the toast into view
      useNativeDriver: true,
    }).start();

    // Hide toast after 3 seconds
    setTimeout(() => {
      Animated.spring(slideAnim, {
        toValue: -100, // Slide the toast out of view
        useNativeDriver: true,
      }).start(() => {
        setToastVisible(false)
      });
    }, 2000); // 3 seconds
    
};

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
      
      {toastVisible && (
        <Animated.View
          style={[styles.toast,
            {
              transform: [{ translateY: slideAnim}]
            }
          ]}
        >
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}
      {formState == 'login' && (
        <>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Please log in or create an account to continue</Text>
          <TextInput
            style={styles.input}
            placeholder="Email or Username"
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#777"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>LOG IN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setFormState('signup')}>
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </>
      )}
      {formState == 'signup' && (
        <>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Please log in or create an account to continue</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#777"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#777"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setFormState('login')}>
            <Text style={styles.secondaryButtonText}>Login</Text>
          </TouchableOpacity>
        </>
      )}
          <TouchableOpacity style={styles.guestButton}>
            <Link href="/(tabs)/home"> Continue as Guest</Link>
          </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000', // Black text
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#000', // Black border
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#000', // Black input text
    backgroundColor: '#fff',
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
  secondaryButton: {
    width: '75%',
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  secondaryButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  guestButton: {
    marginTop: 10,
  },
  guestButtonText: {
    color: '#000',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  toast: {
    position: 'absolute',
    top: 30,  // Adjust this value to move the toast further down if necessary
    left: '10%',
    right: '10%',
    backgroundColor: 'hsl(0, 0%, 90%)',
    padding: 10,
    borderRadius: 5,
    zIndex: 100,  // Ensure the toast is above other content
    opacity: 1,   // Make sure the toast is fully visible
  },
  toastText: {
    color: 'hsl(0, 0%, 20%)',
    fontSize: 16,
    textAlign: 'center',
  },
});