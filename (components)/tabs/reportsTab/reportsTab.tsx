import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-root-toast';
import StyledButton from '../../utilities/button/styledButton';
import WeekdayStreak from '../../utilities/weekdayStreak/weekdayStreak';
import Icon from 'react-native-vector-icons/Ionicons'; // Replace 'Ionicons' with any icon set you are using
import DateTimePicker from '@react-native-community/datetimepicker';

type InfoCardProps = {
  title: string;
  value: string;
  iconName: string;
  iconColor: string;
  onEditPress?: () => void; // Make it optional if not required for all InfoCards
};

export default function ReportsTab ({ route }) {
  const [wakeUpTime, setWakeUpTime] = useState(null);
  const [weightLogged, setWeightLogged] = useState(null);
  const [sunlightLogged, setSunlightLogged] = useState(null);
  const [sunlightMinutes, setSunlightMinutes] = useState(0);
  const [weight, setWeight] = useState('');
  const { session } = route.params;
  const [isEditingWakeUpTime, setIsEditingWakeUpTime] = useState(false);
  const [tempWakeUpTime, setTempWakeUpTime] = useState(null);
  const completedDays = [1, 3, 5];
  console.log("helslso")

  useEffect(() => {
    // const currentDate = new Date().toISOString().split('T')[0];

    const currentTime = new Date();
    // Format the date and time to the user's local timezone
    const formattedDate = `${currentTime.getFullYear()}-${(currentTime.getMonth() + 1).toString().padStart(2, '0')}-${currentTime.getDate().toString().padStart(2, '0')}`;
    // const formattedDateTime = currentTime.toISOString(); // If you want to keep the time in UTC
    // console.log(currentDate)
    const fetchStats = async () => {
      try {
        setWakeUpTime('')
        setWeightLogged('')
        setSunlightLogged('')
        let { data, error } = await supabase
          .from('dailyStats')
          .select('wakeUpTime, weight, sunlightTime')
          .eq('userUUID_new', session?.user.id)
          .eq('created_at', formattedDate);

        if (error) throw error;
        
        if (data && data.length > 0) {
          // Assuming all the fields are stored in the expected format
          const entry = data[0];
          if (entry.wakeUpTime) {
            setWakeUpTime(new Date(entry.wakeUpTime));
          }
          if (entry.weight) {
            setWeightLogged(entry.weight);
          }
          if (entry.sunlightTime) {
            setSunlightLogged(entry.sunlightTime);
          }
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        showToast("Failed to fetch daily stats.");
      }
    };

    fetchStats();
  }, []);

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

  const formatTime = (date) => {
    // You can use date-fns or any other library to format the time
    // return format(date, 'p'); // e.g., '12:00 PM'
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };


  const handleTimeConfirm = async () => {
    const currentTime = new Date();
    // Format the date and time to the user's local timezone
    const formattedDate = `${currentTime.getFullYear()}-${(currentTime.getMonth() + 1).toString().padStart(2, '0')}-${currentTime.getDate().toString().padStart(2, '0')}`;
    const formattedDateTime = currentTime.toISOString(); // If you want to keep the time in UTC

    try {
      let { error } = await supabase
        .from('dailyStats')
        .upsert({
          userUUID_new: session?.user.id, 
          wakeUpTime: formattedDateTime, // Continue using UTC or convert to the desired timezone
          created_at: formattedDate  // Sets the date in 'YYYY-MM-DD' format using the user's local timezone
        });
  
      if (error) {
        showToast("Failed to log wake-up time. Please try again.");
        console.error("Error inserting/updating data:", error);
      } else {
        showToast("Wake-up time logged! ☀️");
        setWakeUpTime(currentTime); // Update the state to reflect the logged time
      }
    } catch (error) {
      showToast("Failed to log wake-up time.");
      console.error("Error logging wake-up time:", error);
    }
};
  
  const handleTimeUpdate = async (newTime) => {
    // const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date();
    // Format the date and time to the user's local timezone
    const formattedDate = `${currentTime.getFullYear()}-${(currentTime.getMonth() + 1).toString().padStart(2, '0')}-${currentTime.getDate().toString().padStart(2, '0')}`;
    try {
      let { error } = await supabase
        .from('dailyStats')
        .upsert({
          userUUID_new: session?.user.id,
          wakeUpTime: newTime.toISOString(),
          created_at: formattedDate
        });
  
      if (error) {
        showToast("Failed to update wake-up time.");
        console.error("Error updating wake-up time:", error);
      } else {
        showToast("Wake-up time updated!");
      }
    } catch (error) {
      showToast("Failed to update wake-up time.");
      console.error("Error updating wake-up time:", error);
    }
  };  

  const handleWeightLog = async () => {
    if (weight) {
      const currentTime = new Date();
      // Format the date and time to the user's local timezone
      const formattedDate = `${currentTime.getFullYear()}-${(currentTime.getMonth() + 1).toString().padStart(2, '0')}-${currentTime.getDate().toString().padStart(2, '0')}`;  
        try {
        let { error } = await supabase
          .from('dailyStats')
          .upsert({
            userUUID_new: session?.user.id,
            weight: weight,
            created_at: formattedDate
          });

        if (error) throw error;

        showToast(`Weight logged: ${weight} kg`);
        setWeightLogged(weight);
        setWeight('');
      } catch (error) {
        showToast("Failed to log weight.");
        console.error("Error logging weight:", error);
      }
    } else {
      showToast("Please enter your weight");
    }
  };

  const handleSliderChange = (value) => {
    setSunlightMinutes(value);
    // Toast message
    // showToast(`Logged ${value} minutes in sunlight! 🌞`);
  };

  const handleSunlightConfirm = async () => {
    const currentTime = new Date();
    // Format the date and time to the user's local timezone
    const formattedDate = `${currentTime.getFullYear()}-${(currentTime.getMonth() + 1).toString().padStart(2, '0')}-${currentTime.getDate().toString().padStart(2, '0')}`;
    try {
      let { error } = await supabase
        .from('dailyStats')
        .upsert({
          userUUID_new: session?.user.id,
          sunlightTime: sunlightMinutes,
          created_at: formattedDate
        });

      if (error) throw error;

      showToast(`Logged ${sunlightMinutes} minutes in sunlight! 🌞`);
      setSunlightLogged(sunlightMinutes);
    } catch (error) {
      showToast("Failed to log sunlight time.");
      console.error("Error logging sunlight time:", error);
    }
  };

  const getGradientColor = (value) => {
    // This function will return a color based on the slider's value
    // Adjust the colors as per your design
    if (value < 5) return ['#fff999', '#ffecd2'];
    if (value < 20) return ['#ffecd2', '#fcb69f'];
    return ['#fcb69f', '#ff9a9e'];
  };

  const InfoCard: React.FC<InfoCardProps> = ({ title, value, iconName, iconColor, onEditPress }) => (
    <View style={styles.infoCard}>
      <Icon name={iconName} size={30} color={iconColor} style={styles.infoIcon} />
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
      <TouchableOpacity onPress={onEditPress} style={styles.editButton}>
        <Icon name="pencil-outline" size={25} color="#6e6e6e" />
      </TouchableOpacity>
    </View>
  );
  


  return (
    <ScrollView style={styles.container}>
      <WeekdayStreak completedDays={completedDays} session={session}/>
      <Text style={styles.headerText}>
        Today's Stats
      </Text>
      <View style={styles.timerCard}>
        {wakeUpTime && !isEditingWakeUpTime ? (
          <InfoCard
            title="Wake-Up Time"
            value={formatTime(wakeUpTime)}
            iconName="alarm-outline"
            iconColor="#A4DC5A"
            onEditPress={() => setIsEditingWakeUpTime(true)} // This function should be passed as a prop
            />
        ) : (
          <>
            {isEditingWakeUpTime ? (
              <View style={styles.centeredContainer}>
                <DateTimePicker
                  value={tempWakeUpTime || wakeUpTime || new Date()}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={(event, selectedTime) => {
                    setTempWakeUpTime(selectedTime || wakeUpTime); // Temporarily store the new time
                  }}
                />
                <StyledButton
                  title="Confirm Time"
                  onPress={() => {
                    setWakeUpTime(tempWakeUpTime); // Set the new time
                    setIsEditingWakeUpTime(false); // Exit editing mode
                    handleTimeUpdate(tempWakeUpTime); // Update the time in the database
                  }}
                  colors={['#4c669f', '#3b5998', '#192f6a']}
                  disabled={false}
                />
              </View>
            )  : (
              <StyledButton
                title="Log Wake-Up Time"
                onPress={handleTimeConfirm}
                disabled={false}
                colors={['#4c669f', '#3b5998', '#192f6a']}
              />
            )}
          </>
        )}
      </View>
      <View style={styles.card}>
      {weightLogged ? (
        <InfoCard
          title="Weight"
          value={`${weightLogged} lbs`}
          iconName="body-outline" // Change the icon name as per your icon set
          iconColor="#60a5fa" // Example color - blue
        />
        ) : (
        <>
        <TextInput 
          style={styles.input} 
          onChangeText={setWeight} 
          value={weight} 
          placeholder="Enter your weight in lbs"
          keyboardType="numeric"
        />
        <StyledButton 
          title="Log Weight" 
          onPress={handleWeightLog}
          disabled={false}
          colors={['#4c669f', '#3b5998', '#192f6a']} // Custom gradient colors
          />
          </> ) }
      </View>
      <View style={styles.card}>
      {sunlightLogged ? (
        <InfoCard
          title="Sunlight Exposure"
          value={`${sunlightLogged} min`}
          iconName="sunny-outline" // Change the icon name as per your icon set
          iconColor="#fbbf24" // Example color - amber
        />
        ) : (<>
        <View style={styles.sunlightSlider}>
          <Text style={styles.sunlightText}>
            Minutes in Sunlight: {sunlightMinutes} min
          </Text>
          <LinearGradient
            colors={getGradientColor(sunlightMinutes)}
            style={styles.gradientBackground}>
            <Slider
              style={{ width: '100%', height: 20 }}
              minimumValue={0}
              maximumValue={60}
              minimumTrackTintColor="#FFFFFF00" // Transparent
              maximumTrackTintColor="#FFFFFF00" // Transparent
              thumbTintColor="#FFFFFF"
              step={1}
              value={sunlightMinutes}
              onValueChange={(handleSliderChange)} // Updated to use handleSliderChange
            />
          </LinearGradient>
        </View>
          <StyledButton 
            title="Log Sunlight" 
            onPress={handleSunlightConfirm}
            disabled={false} // Add this line
            colors={['#4c669f', '#3b5998', '#192f6a']} // Custom gradient colors
          />
          </>)}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // padding: 20,
    backgroundColor: '#f5f5f5',
  },
  timeLogger: {
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
  },
  sunlightSlider: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  gradientBackground: {
    borderRadius: 25,
    width: '100%',
    padding: 2,
    marginBottom: 20
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 16,
    marginHorizontal: 10

  },
  timerCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 20,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 16,
    marginHorizontal: 10
  },
  sunlightText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333', // Darker text for better readability
    marginBottom: 20
  },
  buttonHeaderText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333', // Darker text for better readability
    marginBottom: 20
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333', // Darker text for better readability
    marginBottom: 20,
    marginLeft: 10
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  infoCard: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // for Android
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 8,
  },
  infoIcon: {
    marginBottom: 10,
    marginRight: 20
  },
  infoContent: {
    flex: 1,
    // ... styles for the content area
  },
  editButton: {
    // ... styles for the edit button
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#f5f5f5', // or any other desired background color
  },
});