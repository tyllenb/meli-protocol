import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Session } from '@supabase/supabase-js';

const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const WeekdayStreak = ({ completedDays, session }) => {
// console.log(session)
  return (
    <View style={styles.weekdayStreakContainer}>
      <Text style={styles.streakTitleText}>Way to kick off your day Tyllen!</Text>
      <Text style={styles.streakText}>You have a 1 week streak going!</Text>
      <View style={styles.daysContainer}>
        {daysOfWeek.map((day, index) => {
          const isActive = completedDays.includes(index); // Assuming completedDays is an array of active day indexes
          return (
            <View key={index} style={[styles.day, isActive ? styles.activeDay : styles.inactiveDay]}>
              <Text style={styles.dayText}>{day}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statTitleText}>Days This Week</Text>
        <Text style={styles.statText}>{completedDays.length}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  weekdayStreakContainer: {
    padding: 10,
    paddingBottom: -10,
    backgroundColor: 'white',
    // borderRadius: 10,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    alignItems: 'center', // Center children horizontally
    marginBottom: 20
  },
  streakTitleText: {
    fontWeight: '300',
    fontSize: 16,
    marginBottom: 2, // Add some space between the text and the days
    padding: 10,
    alignSelf: 'flex-start', // Align this item to the start of the flex-direction
  },
  streakText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20, // Add some space between the text and the days
    padding: 10,
    alignSelf: 'flex-start', // Align this item to the start of the flex-direction
    marginTop: -15
  },
  daysContainer: {
    flexDirection: 'row', // Arrange days in a row
    justifyContent: 'space-around',
    width: '100%', // Take up full width of the container
    marginTop: -20
  },
  day: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2, // Add a little space between days
  },
  activeDay: {
    backgroundColor: '#4c669f', // Active day color
  },
  inactiveDay: {
    backgroundColor: '#ccc', // Inactive day color
  },
  dayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statTitleText: {
    color: 'gray',
    fontWeight: '600',
    fontSize: 12
  },
  statText: {
    color: 'gray',
    fontWeight: '700',
    fontSize: 16,
    marginTop: 5
  },
  statCard: {
    padding: 10,
    backgroundColor: 'rgba(128, 128, 128, 0.06)', // Here the alpha value is 0.5 for semi-transparent gray
    borderRadius: 10,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    alignSelf: 'flex-start', // Align this item to the start of the flex-direction
    width: '40%', // Ensure the card extends the full width of the container
    marginBottom: 20,
    marginTop: 20,
    marginLeft: 10
  },
});

export default WeekdayStreak;
