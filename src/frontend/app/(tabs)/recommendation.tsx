import React, { useEffect, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import { useUser } from '@/context/UserContext'
import { Link, router } from 'expo-router';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as SecureStore from "expo-secure-store";
import { hair_profile } from "@/types/user";
import { Picker } from '@react-native-picker/picker';
import LottieView from 'lottie-react-native';
import { MotiView, AnimatePresence } from 'moti'
import { Easing  } from 'react-native-reanimated'
import { replace } from 'expo-router/build/global-state/routing';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecommendationPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recStartActive, setRecStartActive] = useState<boolean>(true);
  const { user, addRecommendation } = useUser();
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    () => user?.hair_profiles?.[0]?.id ?? null
  );

  useEffect(() => {
    // If we don’t yet have a selectedProfileId but now do have profiles, pick the first
    if (user?.hair_profiles?.length) {
      setSelectedProfileId(user.hair_profiles[0].id);
    }
  }, [user?.hair_profiles]);

  // derive the “live” profile object on every render
  const selectedProfile = user?.hair_profiles.find(
    (p) => p.id === selectedProfileId
  ) ?? null;

  const [currRec, setCurrRec] = useState<{ conditioners: Array<string>, shampoos:Array<string>, leave_in_conditioners: Array<string> }>(
    {
      conditioners: [],
      shampoos: [],
      leave_in_conditioners: [],
    }
  )

  useEffect(() => {
    console.log("recs: ", selectedProfile?.recommendation);
  });

  // useEffect(() => {
  //   console.log("Selected Profile: ", selectedProfile);
  // }, [selectedProfile]);

  const goToRec = () => {
    setRecStartActive(true);

  }

  const handleRecommend = async(hair_profile_id: number) => {
    setRecStartActive(false);
    setIsLoading(true);
    const storedToken = await SecureStore.getItemAsync("bearer");
  
    try {
      const response = await fetch(`https://crown-api-production.up.railway.app/recommendation/${hair_profile_id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${storedToken}` },
      });
  
      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      const data = await response.json();

      const recData: {
        id: number;
        profile_id: number;
        conditioners: Array<string>;
        shampoos: Array<string>;
        leave_in_conditioners: Array<string>;
      } = data.recommendation;
  
      const recommendation = {
        id: recData.id,
        profile_id: recData.profile_id,
        conditioners: recData.conditioners,
        shampoos: recData.shampoos,
        leave_in_conditioners: recData.leave_in_conditioners,
      };
      
      setCurrRec(
        {
          conditioners: recData.conditioners,
          shampoos: recData.shampoos,
          leave_in_conditioners: recData.leave_in_conditioners,
        }
      )
      addRecommendation(recommendation);
      console.log("Recommendation success", recommendation);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recommendation</Text>
      </View>

      {recStartActive === true && (
        <>
          {user?.hair_profiles && user.hair_profiles.length === 0 && (
            <View>
              <Text style={styles.role}>It seems you don't have a hair profile yet...</Text>
              <TouchableOpacity style={styles.button} onPress={() => router.replace('/(tabs)/hairsurvey')}>
                <Text style={styles.buttonText}>Create Hair Profile</Text>
              </TouchableOpacity>
            </View>
          )}

          {user?.hair_profiles && user.hair_profiles.length > 0 && (
            <View>
              <Text style={styles.role}>Select Hair Profile</Text>
              <Picker
                selectedValue={selectedProfileId?.toString() ?? ''}
                onValueChange={(itemValue) => setSelectedProfileId(Number(itemValue))}
                style={styles.picker}
                itemStyle={{ color: 'hsl(0, 0%, 20%)' }}
              >
                {user.hair_profiles.map((profile) => (
                  <Picker.Item
                    key={profile.id}
                    label={profile.name}
                    value={profile.id.toString()}
                    color="hsl(0, 0%, 20%)"
                  />
                ))}
              </Picker>

              {selectedProfile && (
                <View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => selectedProfile && handleRecommend(selectedProfile.id)}
                  >
                    <Text style={styles.buttonText}>Recommend</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, {backgroundColor: 'hsl(0, 0%, 95%)'}]}
                    onPress={() => router.replace("/(tabs)/hairsurvey")}
                  >
                    <Text style={[styles.buttonText, {color: 'hsl(0, 0%, 0%)'}]}>Create new profile</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </>
      )}

      {isLoading === true && (
        <MotiView 
          style={styles.loadingContainer}
          from={{ opacity: 0 }} // Start from invisible
          animate={{ opacity: 1 }} // Fade to visible
          exit={{ opacity: 0 }} // Fade out when exiting
          transition={{
            type: 'timing',
            duration: 500, // Adjust duration as needed
            easing: Easing.out(Easing.ease), // Use ease-out easing for smooth fade
          }}
        >
          <LottieView
            source={require('../../assets/animations/spinner.json')}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        </MotiView>
      )}

      {recStartActive === false && isLoading === false && (
        <View>
          <View style={styles.recContainer}>
            <Text style={styles.prodTypeTitle}> - Conditioners -</Text>
            <View style={styles.prodTypeBodyContainer}>
              {currRec.conditioners.map((product, index) =>
                <Text
                  key={index}
                  style={styles.prodRecText}
                >
                  {index + 1}). {product}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.recContainer}>
            <Text style={styles.prodTypeTitle}> - Shampoos -</Text>
            <View style={styles.prodTypeBodyContainer}>
              {currRec.shampoos.map((product, index) =>
                <Text
                  key={index}
                  style={styles.prodRecText}
                >
                  {index + 1}). {product}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.recContainer}>
            <Text style={styles.prodTypeTitle}> - Leave-ins -</Text>
            <View style={styles.prodTypeBodyContainer}>
              {currRec.leave_in_conditioners.map((product, index) =>
                <Text
                  key={index}
                  style={styles.prodRecText}
                >
                  {index + 1}). {product}
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={[styles.button]}
            onPress={() => goToRec()}
          >
            <Text style={styles.buttonText}>Back to Recommendations</Text>
          </TouchableOpacity>
        </View>
      )}

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
    marginBottom: 15,
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
    alignSelf: 'center',
    fontSize: 14,
    color: 'hsl(0, 0%, 70%)',
    marginBottom: 15,
  },
  button: {
    width: 375,
    height: 60,
    backgroundColor: '#000', // Black button
    borderRadius:50,
    alignItems: 'center',
    textAlign: `center`,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff', // White text on button
    fontSize: 16,
    fontWeight: '500',
  },
  picker: {
    height: 200,
    width: 375,
    backgroundColor: 'hsl(0, 0%, 95%)',
    borderRadius: 15,
    marginBottom: 50,
    color: 'black',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "hsl(0, 0%, 100%)",
    opacity: 1,
  },
  recContainer: {
    marginBottom: 10,
  },
  prodTypeTitle: {
    alignSelf: 'center',
    color: 'hsl(0, 0%, 40%)',
    marginBottom: 10,
    fontSize: 16,
  },
  prodTypeBodyContainer: {
    flexDirection: 'column',
    gap: 5,
  },
  prodRecText: {
    color: 'hsl(0, 0%, 20%)',
    backgroundColor: 'hsl(0, 0%, 90%)',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 50,
  },
});

export default RecommendationPage;
