import React, { useState } from 'react';
import { UserContext } from '@/context/UserContext';
import { useUser } from '@/context/UserContext'
import { Link, useRouter } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { MotiView, AnimatePresence } from 'moti'
import { Easing } from 'react-native-reanimated'
import AsyncStorage from '@react-native-async-storage/async-storage';

const HairSurveyPage: React.FC = () => {
  const { user, addProfile } = useUser();
  const router = useRouter();

  const [survProgState, updateSurvProgState] = useState<number[]>([1, 0, 0, 0, 0]); // 1st question starts as "in progress"
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [survActive, setSurvActive] = useState<boolean>(true);

  const surveyQuestions = [
    { 
      id: 0, title: "I would describe my hair type as ____.",
      options: ["3b", "3c", "4a", "4b", "4c"]
    },
    { 
      id: 1, title: "I would describe the volume of my hair as ____.",
      options: ["Thick", "Normal", "Thin"]
    },
    { 
      id: 2, title: "When I apply product to my hair, it tends to _____.",
      options: ["Absorb quickly", "Absorb slowly", "Stays on top of my hair"]
    },
    { 
      id: 3, title: "My main concern with my hair is ____?",
      options: ["Growth", "Frizz", "Breakage", "Dryness"]
    },
    { 
      id: 4, title: "I'm looking for products that help ____ my hair.",
      options: ["Moisturize", "Style", "Repair"]
    },
  ];

  const totalQuestions = surveyQuestions.length;
  const currentQ = surveyQuestions[currentQuestion];

  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => prev + 1);

    updateSurvProgState((prevState) => {
      const newState = [...prevState];
      newState[currentQuestion] = 2; // marks current question as completed
      if (currentQuestion + 1 < totalQuestions) {
        newState[currentQuestion + 1] = 1; // marks next question as in progress
      }
      return newState;
    });
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestion((prev) => prev - 1);

    updateSurvProgState((prevState) => {
      const newState = [...prevState];
      newState[currentQuestion] = 1; // mark current question as in progress
      return newState;
    });
  };

  const sanitizeAnswers = (answers: { [key: number]: string }): { curl_type: string, porosity: string, volume: string, desired_outcome: string } => {
    // Define the sanitized object according to the HairProfile schema
    const sanitizedProfile: { curl_type: string, porosity: string, volume: string, desired_outcome: string } = {
      curl_type: answers[0] || "",
      volume: mapVolumeToValue(answers[1] || ""),
      porosity: mapPorosityToValue(answers[2] || ""),
      desired_outcome: answers[4] || ""
    };
  
    return sanitizedProfile;
  };
  
  const sanitizeProfile = (data: {[key: string]: string}) => {
    const saneData = {
      curl_type: data.curl_type,
      porosity: data.porosity,
      volume: data.volume,
      desired_outcome: data.desired_outcome,
    }
    return saneData;
  }
  // Helper function to map volume options to high, medium, low
  const mapVolumeToValue = (volume: string): string => {
    switch (volume) {
      case "Thick":
        return "High";
      case "Normal":
        return "Medium";
      case "Thin":
        return "Low";
      default:
        return "";
    }
  };
  
  // Helper function to map porosity options to high, medium, low
  const mapPorosityToValue = (porosity: string): string => {
    switch (porosity) {
      case "Absorb quickly":
        return "High";
      case "Absorb slowly":
        return "Medium";
      case "Stays on top of my hair":
        return "Low";
      default:
        return "";
    }
  };

  const handleSubmit = async (answers: { [key: number]: string }) => {
    setSurvActive(false);
    setIsLoading(true);
    const saneAnswers = sanitizeAnswers(answers)

    try {
      const token = await SecureStore.getItemAsync("bearer");

      if (!token) {
        console.error("No jwt token found, please login again")
        router.replace("/(login)");
      }

      const response = await fetch(`https://crown-api-production.up.railway.app/users/${user?.user_id}/hair-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authentication': `Bearer: ${token}`
        },
        body: JSON.stringify(saneAnswers)
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const saneData = sanitizeProfile(data);
        addProfile(saneData)
        console.log("Hair profile submission success!")
      } else {
        console.error('Hair profile submission failed:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {survActive && (
        <MotiView
        style={styles.activeContainer}
          from={{ opacity: 0 }} // Start from invisible
          animate={{ opacity: 1 }} // Fade to visible
          exit={{ opacity: 0 }} // Fade out when exiting
          transition={{
            type: 'timing',
            duration: 500, // Adjust duration as needed
            easing: Easing.out(Easing.ease), // Use ease-out easing for smooth fade
          }}
        >
          {/* title of screen */}
          <View style={styles.header}>
            <Text style={styles.title}>Hair Survey</Text>
            <View style={styles.prog}>
              {survProgState.map((step, index) => {
                let backgroundColor = step === 2
                  ? "hsl(147, 100%, 43%)" // completed
                  : step === 1
                  ? "hsl(23, 100%, 56%)" // in progress
                  : "hsl(0, 0%, 92%)"; // not started

                return <View key={index} style={[styles.progPill, { backgroundColor }]} />;
              })}
            </View>
          </View>
          {/* quiz questions */}
          <AnimatePresence exitBeforeEnter>
            <MotiView 
              key={currentQ.id} // triggers animation on question change
              style={styles.survContainer}
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                type: 'timing',
                duration: 200,
                easing: Easing.out(Easing.ease),
              }}
            >
              <Text style={styles.questText}>{currentQ.title}</Text>
              {currentQ.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.radioItem,
                    answers[currentQ.id] === option && styles.selectedRadioItem,
                  ]}
                  onPress={() => setAnswers((prev) => ({ ...prev, [currentQ.id]: option }))}
                  activeOpacity={0.6}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      { borderColor: answers[currentQ.id] === option ? "hsl(23, 100%, 56%)" : "hsl(0, 0%, 80%)" },
                    ]}
                  >
                    {answers[currentQ.id] === option && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </MotiView>
          </AnimatePresence>
          {/* nav buttons */}
          <View style={styles.navButtons}>
            <TouchableOpacity
              onPress={handlePreviousQuestion}
              style={[styles.button, currentQuestion === 0 && styles.hiddenButton]}
              disabled={currentQuestion === 0}
            >
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={currentQuestion < totalQuestions - 1 ? handleNextQuestion : () => handleSubmit(answers)}
              style={[
                styles.button,
                { backgroundColor: currentQuestion < totalQuestions - 1 ? 
                  (answers[currentQuestion] ? "hsl(147, 100%, 43%)" : "hsl(0, 0.00%, 85%)") : (answers[currentQuestion] ? "hsl(147, 100%, 43%)" : "hsl(0, 0.00%, 85%)") }
              ]}
              disabled={!answers[currentQ.id]}
            >
              <Text style={styles.buttonText}>{currentQuestion < totalQuestions - 1 ? "Next" : "Finish"}</Text>
            </TouchableOpacity>
          </View>
        </MotiView>
      )}

      {isLoading && (
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

      {(!survActive && !isLoading) && (
        <MotiView 
          style={styles.sumContainer}
          from={{ opacity: 0 }} // Start from invisible
          animate={{ opacity: 1 }} // Fade to visible
          exit={{ opacity: 0 }} // Fade out when exiting
          transition={{
            type: 'timing',
            duration: 500, // Adjust duration as needed
            easing: Easing.out(Easing.ease), // Use ease-out easing for smooth fade
          }}
        >
        <View>
          <Text style={styles.resTitle}>RESULTS</Text>
          <View style={styles.resCont}>
            <View style={styles.resFieldCont}>
              <Text style={styles.resField1}>Type:</Text>
              <Text style={styles.resField2}>{user?.hair_profiles[user.hair_profiles.length-1].curl_type}</Text>
            </View>
            <View style={styles.resFieldCont}>
              <Text style={styles.resField1}>Porosity:</Text>
              <Text style={styles.resField2}>{user?.hair_profiles[user.hair_profiles.length-1].porosity}</Text>
            </View>
            <View style={styles.resFieldCont}>
              <Text style={styles.resField1}>Volume:</Text>
              <Text style={styles.resField2}>{user?.hair_profiles[user.hair_profiles.length-1].volume}</Text>
            </View>
            <View style={styles.resFieldCont}>
              <Text style={styles.resField1}>Desired Outcome:</Text>
              <Text style={styles.resField2}>{user?.hair_profiles[user.hair_profiles.length-1].desired_outcome}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.recommendBtn}>
          <Text style={styles.btnText}>Recommend Products</Text>
        </TouchableOpacity>
        </MotiView>
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
  activeContainer: {
    opacity: 1,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'semibold',
    marginBottom: 20,
    color: '#000',
  },
  prog: {
    flexDirection: "row",
    gap: 10,
    height: 4,
    width: 250,
    backgroundColor: 'hsl(0, 0%, 70%, 0)',
  },
  progPill: {
    height: '100%',
    width: '15%',
    borderRadius: 5,
  },
  survContainer: {
    backgroundColor: 'hsl(0, 0%, 90%, 0)',
    height: 400,
    width: '90%',
  },
  questTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  questText: {
    color: 'hsl(0, 0%, 10%)',
    fontSize: 20,
    marginBottom: 20,
  },
  radioItem: {
    backgroundColor: 'hsl(0, 0%, 98%)',
    height: 55,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingLeft: 15,
  },
  radioText: {
    fontSize: 16,
    color: 'hsl(0, 0%, 10%)',
    fontWeight: "500"
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "hsl(23, 100%, 56%)",
  },
  selectedRadioItem: {
    borderWidth: 2,
    borderColor: "hsl(23, 100.00%, 71.00%)", // highlight selection
    backgroundColor: 'hsl(0, 0%, 98%)',
  },
  navButtons: {
    width: '90%',
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    width: 125,
    height: 50,
    borderRadius: 6,
    backgroundColor: "hsl(23, 100%, 56%)",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "semibold",
    textAlign: "center",
  },
  hiddenButton: { opacity: 0 },
  loadingContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "hsl(0, 0%, 100%)",
    opacity: 1,
  },
  sumContainer: {
    position: 'relative',
    gap: 50,
    alignItems: 'center',
    backgroundColor: 'hsl(0, 0%, 90%, 0)',
    height: 400,
    width: '90%',
    opacity: 1,
  },
  resTitle: {
    alignSelf: 'center',
    fontSize: 28,
    fontWeight: 'semibold',
    marginBottom: 50,
    color: '#000',
  },
  resCont: {
    width: 300,
    alignContent: 'center',
    justifyContent: 'center',
  },
  resFieldCont: {
    width: 300,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resField1: {
    fontSize: 18,
    fontWeight: 'semibold',
    marginBottom: 20,
    color: '#000',
  },
  resField2: {
    fontSize: 18,
    fontWeight: 'semibold',
    marginBottom: 20,
    color: '#000',
  },
  recommendBtn: {
    backgroundColor: 'hsl(248, 100.00%, 63.70%)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: 200,
    height: 50,
  },
  btnText: {
    color: 'hsl(0, 0%, 98%)'
  },
});

export default HairSurveyPage;
