import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, TextInput } from 'react-native';
import { checklistQuestions } from '../../../../data/checklistQuestions/checklistQuestions';
import * as Animatable from 'react-native-animatable';

export const ChecklistItem = ({ question, followUpQuestions, onToggle, onUpdateFollowUp }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [followUpAnswers, setFollowUpAnswers] = useState({});
  
    const toggleSwitch = () => {
      const newValue = !isEnabled;
      setIsEnabled(newValue);
      onToggle(question, newValue);
  
      // Reset follow-up answers if toggle is turned off
      if (!newValue) {
        setFollowUpAnswers({});
        followUpQuestions.forEach(fq => onUpdateFollowUp(fq.question, null));
      }
    };
  
    const handleFollowUpAnswer = (followUpQuestion, answer) => {
      setFollowUpAnswers(prev => ({ ...prev, [followUpQuestion]: answer }));
      onUpdateFollowUp(followUpQuestion, answer);
    };

  return (
    <View>
    <View style={styles.checklistItem}>
      <Text style={styles.checklistText}>{question}</Text>
      <Animatable.View animation="bounceIn" duration={1500}>
      <Switch
          trackColor={{ false: "#767577", true: "#81C784" }} // Correct usage for trackColor
          thumbColor={isEnabled ? "#4CAF50" : "#f4f3f4"} // Correct usage for thumbColor
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </Animatable.View>
    </View>
        {isEnabled && followUpQuestions.map((followUpQuestion, index) => (
            <View key={index} style={styles.followUpItem}>
            <Text style={styles.followUpText}>{followUpQuestion.question}</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => handleFollowUpAnswer(followUpQuestion.question, text)}
                value={followUpAnswers[followUpQuestion.question]}
                placeholder={followUpQuestion.placeholder}
            />
            </View>
        ))}
    </View>
  );
};

export const initializeChecklistResponses = () => {
    const initialResponses = {};
    checklistQuestions.forEach(category => {
      category.items.forEach(item => {
        initialResponses[item.question] = false;
        item.followUpQuestions.forEach(fq => {
          initialResponses[fq.question] = ''; // Default value for follow-up questions
        });
      });
    });
    return initialResponses;
};

export const SentimentItem = ({ question, options, onSelect }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleSelect = (option) => {
        setSelectedOption(option);
        onSelect(question, option);
    };

    return (
        <View style={styles.sentimentItem}>
            <Text style={styles.sentimentText}>{question}</Text>
            <View style={styles.sentimentOptions}>
                {options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.sentimentOption,
                            selectedOption === option && styles.sentimentOptionSelected,
                            // If you're using maxWidth, you might not need the flexGrow style
                            // { flexGrow: selectedOption === option ? 0 : 1 },
                        ]}
                        onPress={() => handleSelect(option)}
                    >
                        <Text style={selectedOption === option ? { color: '#FFFFFF' } : { color: '#333' }}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

// New Component to Render Categories
export const ChecklistCategory = ({ category, items, onToggle, onUpdateFollowUp }) => {
    return (
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{category}</Text>
        {items.map((item, index) => (
          <ChecklistItem
            key={index}
            question={item.question}
            followUpQuestions={item.followUpQuestions}
            onToggle={onToggle}
            onUpdateFollowUp={onUpdateFollowUp}
          />
        ))}
      </View>
    );
  };

  export const isSectionComplete = (sectionResponses, questions) => {
    const complete = questions.every((item) => {
      // Check if the response is not null, not undefined, not an empty string, and not just whitespace
      const isComplete = sectionResponses[item.question] &&
                         sectionResponses[item.question].trim() !== '';
      return isComplete;
    });

    return complete;
  };
  
  


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
    },
    toggleButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
        backgroundColor: '#E8F5E9', // Light green background for toggle buttons
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
        width: '100%',
        backgroundColor: '#FFFFFF', // Matching card-style layout with white background
        borderRadius: 10, // Rounded corners for a consistent look
        shadowColor: '#000', // Shadow for card-style
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3, // Elevation for Android shadow
        marginBottom: 10, // Space between sentiment items
    },
    sentimentText: {
        fontSize: 16,
        fontWeight: 'bold', // Match the bold style of category titles
        color: '#333',
        marginBottom: 10, // Space above the options
        marginLeft: 15,
        paddingTop:5
    },
    sentimentOptions: {
        flexDirection: 'row',
        justifyContent: 'flex-start', // Align to the start
        flexWrap: 'wrap', // Allow the options to wrap to the next line
        padding: 10, // Padding inside the options container
    },
    sentimentOption: {
        // Give the buttons a flexible width or maxWidth if needed
        // e.g., maxWidth: '30%', to ensure three buttons fit comfortably in one row
        // Use margin to provide spacing between buttons
        padding: 10,
        margin: 4, // Add margin around the buttons
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20, // Rounded corners for individual buttons
        // If using maxWidth, you might not need flexGrow
        // flexGrow: 1, // Allow the button to grow
      },
    sentimentOptionSelected: {
        backgroundColor: '#4CAF50', // Brand green for selected state
        color: '#FFFFFF', // White text for selected option
    },
    submitButton: {
        backgroundColor: '#4CAF50', // Use brand green for submit button
        padding: 15,
        margin: 10,
        borderRadius: 20, // Rounded corners for submit button
        alignItems: 'center',
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
        backgroundColor: "FFFFFF"
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
  });
  