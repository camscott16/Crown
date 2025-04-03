import React, { useState } from 'react';
import { UserContext } from '@/context/UserContext';
import { useUser } from '@/context/UserContext'
import { Link, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { RadioButton } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';

const HairSurveyPage: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();

  const [survProgState, updateSurvProgState] = useState<number[]>([1, 0, 0, 0, 0]); // 1st question starts as "in progress"
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      desired_outcome: answers[3] || answers[4] || ""
    };
  
    return sanitizedProfile;
  };
  
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
    setIsLoading(true);
    const saneAnswers = sanitizeAnswers(answers)

    try {
      const token = await AsyncStorage.getItem('bearer');

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
        console.log("login succesful!")
        
        setIsLoading(true);
      } else {
        console.error('Hair profile submission failed:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
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

      <View style={styles.survContainer}>
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
      </View>

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
          onPress={currentQuestion < totalQuestions - 1 ? handleNextQuestion : () => console.log("Survey Complete!", answers)}
          style={[styles.button, { backgroundColor: currentQuestion < totalQuestions - 1 ? "hsl(147, 100%, 43%)" : "hsl(220, 80%, 50%)" }]}
          disabled={!answers[currentQ.id]}
        >
          <Text style={styles.buttonText}>{currentQuestion < totalQuestions - 1 ? "Next" : "Finish"}</Text>
        </TouchableOpacity>
      </View>
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
});

export default HairSurveyPage;
