import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const StyledButton = ({ title, onPress, disabled, colors = ['#4c669f', '#3b5998', '#192f6a']}) => {
  
    return (
        <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
        >
        <TouchableOpacity
            style={[styles.button, disabled && styles.disabledButton]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    width: '100%', // Full-width button

  },
  gradient: {
    borderRadius: 15,
    width: "auto"
  },
  enabledButton: {
    backgroundColor: '#007bff', // Primary color for enabled state
  },
  disabledButton: {
    backgroundColor: '#cccccc', // Grey color for disabled state
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StyledButton;
