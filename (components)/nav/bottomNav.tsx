import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Account from '../account/account';
import { Session } from '@supabase/supabase-js';
import MorningTab from '../tabs/morningTab/morningTab';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image } from 'react-native';
import EveningTab from '../tabs/eveningTab/eveningTab';


interface BottomTabNavigatorProps {
    session: Session;
  }
  
const Tab = createBottomTabNavigator();

export default function BottomTabNavigator({ session }: BottomTabNavigatorProps) {

  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Morning') {
          iconName = focused
            ? 'sunny'
            : 'sunny';
        } else if (route.name === 'Account') {
          iconName = focused ? 'person' : 'person';
        } else if (route.name === 'Evening') {
          iconName = focused ? 'moon' : 'moon';
        } else if (route.name === 'Reports') {
          iconName = focused ? 'analytics' : 'analytics';
        }


        // You can return any component that you like here!
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      headerLeft: () => (
        <Image
          source={require('../../assets/MP.png')} // replace with your logo image path
          resizeMode="contain" // or 'cover', 'stretch', etc.
          style={{ width: 35, height: 35, marginLeft: 10, marginBottom: 10 }} // adjust sizing as needed
        />
      ),
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}
  >
      <Tab.Screen 
        name="Morning" 
        component={MorningTab} 
        initialParams={{ session }}         
        options={{
          title: 'Morning Routine', // Set the title for your screen
          // ... other specific options for HomeTab
        }}
      />
      <Tab.Screen 
        name="Evening" 
        component={EveningTab} 
        initialParams={{ session }}         
        options={{
          title: 'Evening Routine', // Set the title for your screen
          // ... other specific options for HomeTab
        }}
      />
      <Tab.Screen 
        name="Reports" 
        component={MorningTab} 
        initialParams={{ session }}         
        options={{
          title: 'Reports', // Set the title for your screen
          // ... other specific options for HomeTab
        }}
      />
      <Tab.Screen name="Account" component={Account} initialParams={{ session }}/>
      {/* <Tab.Screen name="Other2" component="" /> */}
    </Tab.Navigator>
  );
}
