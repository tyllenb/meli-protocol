import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import Toast from 'react-native-root-toast';
import { checklistQuestions } from '../../../data/checklistQuestions/checklistQuestions';
import { sentimentQuestions } from '../../../data/sentimentQuestions/sentimentQuestions';
import * as Animatable from 'react-native-animatable';
import { ChecklistCategory, initializeChecklistResponses, isSectionComplete, SentimentItem } from './functions/functions';
import axios from 'axios';
import { supabase } from '../../../lib/supabase';

export default function EveningTab({ route }) {
  const { session } = route.params;
  const [activeSection, setActiveSection] = useState('Checklist');
  const [checklistResponses, setChecklistResponses] = useState(initializeChecklistResponses());
  const [sentimentResponses, setSentimentResponses] = useState({});
  const [hasCheckinToday, setHasCheckinToday] = useState(false)
  const [hasSentimentToday, setHasSentimentToday] = useState(false)

  const isSubmitDisabled = !isSectionComplete(sentimentResponses, sentimentQuestions);
  
  useEffect(() => {
    const currentTime = new Date();
    // Format the date and time to the user's local timezone
    const formattedDate = `${currentTime.getFullYear()}-${(currentTime.getMonth() + 1).toString().padStart(2, '0')}-${currentTime.getDate().toString().padStart(2, '0')}`;

    const fetchStats = async () => {
      try {
        let { data, error } = await supabase
          .from('dailyStats')
          .select('dailyCheckIns, dailySentiment')
          .eq('userUUID_new', session?.user.id)
          .eq('created_at', formattedDate);

        if (error) throw error;
        
        if (data && data.length > 0) {
          // Assuming all the fields are stored in the expected format
          const entry = data[0];
          if (entry.dailyCheckIns) {
            setHasCheckinToday(true)
          }
          if (entry.dailySentiment) {
            setHasSentimentToday(true)
          }
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        showToast("Failed to fetch daily stats.");
      }
    };

    fetchStats();
  }, []);
  

  const updateChecklistResponse = (question, answer) => {
    setChecklistResponses(prevResponses => ({ ...prevResponses, [question]: answer }));
  };

// Update follow-up response
  const updateFollowUpResponse = (question, answer) => {
    setChecklistResponses(prevResponses => ({ ...prevResponses, [question]: answer }));
  };

  // Update sentiment response
  const updateSentimentResponse = (question, answer) => {
    setSentimentResponses((prevResponses) => {
      const newResponses = { ...prevResponses, [question]: answer };
      return newResponses;
    });
  };
  
  // When a sentiment option is selected, update the corresponding question's response
  const handleSentimentSelect = (question, option) => {
    updateSentimentResponse(question, option);
  };
  
  // Function to handle data submission
  const handleSubmit = () => {
    const dataToSubmit = {
      checklist: checklistResponses,
      sentiment: sentimentResponses,
    };

    // console.log(checklistResponses)
    // console.log(sentimentResponses)

    const dataToSend = {
      checklistResp: checklistResponses,
      // Add more data as needed
    };

    axios.post('http://192.168.68.105:4000/', dataToSend)
    // .then(function (response) {
    //   // Handle success
    //   console.log('Success:', response.data);
    // })
    // .catch(function (error) {
    //   // Handle error
    //   console.error('Error:', error);
    // });
    // Logic to submit dataToSubmit to your database
    // ...
  };

  const handleChecklistSubmit = async () => {
    const currentTime = new Date();
    // Format the date and time to the user's local timezone
    const formattedDate = `${currentTime.getFullYear()}-${(currentTime.getMonth() + 1).toString().padStart(2, '0')}-${currentTime.getDate().toString().padStart(2, '0')}`;
    try {
      let { error } = await supabase
        .from('dailyStats')
        .upsert({
          userUUID_new: session?.user.id, 
          dailyCheckIns: checklistResponses, // Continue using UTC or convert to the desired timezone
          created_at: formattedDate  // Sets the date in 'YYYY-MM-DD' format using the user's local timezone
        });
  
      if (error) {
        showToast("Failed to log wake-up time. Please try again.");
        console.error("Error inserting/updating data:", error);
      } else {
        showToast("Wake-up time logged! ☀️");
        setHasCheckinToday(true)
      }
    } catch (error) {
      showToast("Failed to log wake-up time.");
      console.error("Error logging wake-up time:", error);
    }
  };

  const handleSentimentSubmit = async () => {
    const currentTime = new Date();
    // Format the date and time to the user's local timezone
    const formattedDate = `${currentTime.getFullYear()}-${(currentTime.getMonth() + 1).toString().padStart(2, '0')}-${currentTime.getDate().toString().padStart(2, '0')}`;
    try {
      let { error } = await supabase
        .from('dailyStats')
        .upsert({
          userUUID_new: session?.user.id, 
          dailySentiment: sentimentResponses, // Continue using UTC or convert to the desired timezone
          created_at: formattedDate  // Sets the date in 'YYYY-MM-DD' format using the user's local timezone
        });
  
      if (error) {
        showToast("Failed to log wake-up time. Please try again.");
        console.error("Error inserting/updating data:", error);
      } else {
        showToast("Wake-up time logged! ☀️");
        setHasSentimentToday(true)
      }
    } catch (error) {
      showToast("Failed to log wake-up time.");
      console.error("Error logging wake-up time:", error);
    }
  };

  const showToast = (message) => {
    Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.toggleButtons}>
        <TouchableOpacity
          style={[styles.toggleButton, activeSection === 'Checklist' && styles.activeButton]}
          onPress={() => setActiveSection('Checklist')}
        >
          <Text>Checklist</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, activeSection === 'Sentiment' && styles.activeButton]}
          onPress={() => setActiveSection('Sentiment')}
        >
          <Text>Sentiment</Text>
        </TouchableOpacity>
      </View>

      {activeSection === 'Checklist' && (
        // <Animatable.View animation="fadeInDown" duration={1500}>
        (!hasCheckinToday ? 
          <View style={styles.section}>
            {checklistQuestions.map((category, index) => (
              <ChecklistCategory
                key={index}
                category={category.category}
                items={category.items}
                onToggle={updateChecklistResponse}
                onUpdateFollowUp={updateFollowUpResponse}
            />
            ))}
              <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleChecklistSubmit}
                  // disabled={!isSectionComplete(checklistResponses, checklistQuestions)}
              >
                  <Text style={styles.submitButtonText}>Submit Checklist</Text>
              </TouchableOpacity>
          </View>
        :
        <View style={styles.gradientBackground}>
          <View style={styles.completionCard}>
            <Text style={styles.emoji}>🎉</Text>
            <Text style={styles.completionText}>
              Checklist for today completed! ✔️
            </Text>
          </View>
        </View>
        )
        // </Animatable.View>
      )}

      {activeSection === 'Sentiment' && (
        (!hasSentimentToday ?
          <View style={styles.section}>
            {sentimentQuestions.map((item, index) => (
            <SentimentItem 
                key={index} 
                question={item.question} 
                options={item.options}
                onSelect={handleSentimentSelect} // Pass the correct function
            />
            ))}
            <TouchableOpacity
                style={[styles.submitButton, isSubmitDisabled && styles.submitButtonDisabled]}
                onPress={handleSentimentSubmit}
                disabled={isSubmitDisabled}
            >
                <Text style={styles.submitButtonText}>Submit Sentiment</Text>
            </TouchableOpacity>
          </View>
        :
        <View style={styles.gradientBackground}>
          <View style={styles.completionCard}>
            <Text style={styles.emoji}>🎉</Text>
            <Text style={styles.completionText}>
              Sentiment for today completed! 👍
            </Text>
          </View>
        </View>
        )
      )}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
    },
    toggleButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
        // backgroundColor: '#E8F5E9', // Light green background for toggle buttons
        borderRadius: 20, // Rounded corners for toggle buttons
    },
    toggleButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#4CAF50', // Brand green for borders
        flex: 1,
        alignItems: 'center',
        margin: 5, // Add some space between buttons
        borderRadius: 20, // Rounded corners for individual buttons
    },
    activeButton: {
        backgroundColor: '#4CAF50', // Active button has the brand green color
    },
    section: {
        padding: 10,
    },
    checklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF', // Card-style layout with white background
        borderRadius: 10, // Rounded corners for card-style
        marginVertical: 5, // Space between cards
        shadowColor: '#000', // Shadow for card-style
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3, // Elevation for Android shadow
    },
    checklistText: {
        fontSize: 16,
        color: '#333', // Dark text for better readability
        flexShrink: 1,
        marginRight: 10,    
    },
    sentimentItem: {
        paddingVertical: 10,
        width: '100%', // Ensure sentiment items take full width
    },
    sentimentText: {
        fontSize: 16,
        marginBottom: 5,
    },
    sentimentOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    sentimentOption: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    sentimentOptionSelected: {
        backgroundColor: '#ddd',
    },
    submitButton: {
        backgroundColor: '#4CAF50', // Use brand green for submit button
        padding: 15,
        margin: 10,
        borderRadius: 20, // Rounded corners for submit button
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#C0C0C0', // disabled state color
    },
    submitButtonText: {
        color: '#FFFFFF', // White text for submit button
        fontSize: 18,
        fontWeight: 'bold',
    },
    followUpItem: {
        padding: 10,
        width: '100%',
        marginBottom: 15, // Increased bottom margin for visual separation
    },
    followUpText: {
        fontSize: 14,
        marginBottom: 5,
        // Add more styling as needed
    },
    input: {
        borderWidth: 1,
        borderColor: '#4CAF50', // Brand green for borders
        borderRadius: 5,
        padding: 8,
        marginBottom: 10,
        width: '100%',
        backgroundColor: '#E8F5E9', // Light green background for input fields
        color: '#333', // Dark color for input text
    },
    categoryContainer: {
        marginBottom: 20,
        backgroundColor: '#E8F5E9', // Light green background for category container
        borderRadius: 10, // Rounded corners for category container
        padding: 10, // Padding inside the category container
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50', // Brand green for category titles
        paddingBottom: 10,
    },
    completionCard: {
      margin: 20,
      paddingVertical: 30,
      paddingHorizontal: 20,
      borderRadius: 20,
      backgroundColor: '#ffffff', // Pure white background
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 8, // for Android
      alignItems: 'center', // Center items horizontally in the container
    },
    completionText: {
      fontSize: 22,
      fontWeight: '600',
      color: '#313131', // Dark grey for text
      textAlign: 'center',
      marginBottom: 20,
    },
    emoji: {
      fontSize: 44, // Large size for emoji
      marginBottom: 20,
    },
    gradientBackground: {
      borderRadius: 20,
      padding: 1,
      background: 'linear-gradient(145deg, #f6f6f6, #ffffff)', // Subtle gradient for elevated look
    },
    // Add additional styles as needed
  });
  