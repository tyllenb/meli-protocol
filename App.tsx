import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import Login from './(components)/auth/login'
import { NavigationContainer } from '@react-navigation/native'
import { RootSiblingParent } from 'react-native-root-siblings';
import AppNavigator from './(components)/nav/bottomNav'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])
  
  return (
    <View style={{ flex: 1 }}>
      {session && session.user ? 
          <NavigationContainer>
            <RootSiblingParent> 
              <AppNavigator session={session} />
            </RootSiblingParent>
          </NavigationContainer>
          : 
      <Login />
      }
    </View>
  )
}