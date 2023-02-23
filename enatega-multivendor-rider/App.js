import React, { useState, useEffect } from 'react'
import {
  ActivityIndicator,
  View,
  StatusBar,
  StyleSheet,
  LogBox
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Font from 'expo-font'
import { ApolloProvider } from '@apollo/client'
import FlashMessage from 'react-native-flash-message'
import * as Location from 'expo-location'
import * as SplashScreen from 'expo-splash-screen'
import * as Updates from 'expo-updates'
import * as Sentry from 'sentry-expo'
import AppContainer from './src/routes/index'
import i18n from './i18n'
import colors from './src/utilities/colors'
import setupApolloClient from './src/apollo/index'
import { ConfigurationProvider } from './src/context/configuration'
import { AuthContext } from './src/context/auth'
import { TabsContext } from './src/context/tabs'
import TextDefault from './src/components/Text/TextDefault/TextDefault'
import { LocationProvider } from './src/context/location'
import getEnvVars from './environment'
import moment from 'moment-timezone'
moment.tz.setDefault('Asia/Karachi')
LogBox.ignoreLogs([
  'Warning: ...',
  'Sentry Logger ',
  'Constants.deviceYearClass'
]) // Ignore log notification by message
LogBox.ignoreAllLogs() // Ignore all log notifications
const client = setupApolloClient()
const { SENTRY_DSN } = getEnvVars()
Sentry.init({
  dsn: SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: true,
  tracesSampleRate: 1.0 // to be changed to 0.2 in production
})

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)
  const [token, setToken] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [active, setActive] = useState('NewOrder')

  useEffect(() => {
    ;(async() => {
      await SplashScreen.preventAutoHideAsync()
      await i18n.initAsync()
      await Font.loadAsync({
        MuseoSans300: require('./assets/font/MuseoSans/MuseoSans300.ttf'),
        MuseoSans500: require('./assets/font/MuseoSans/MuseoSans500.ttf'),
        MuseoSans700: require('./assets/font/MuseoSans/MuseoSans700.ttf')
      })
      const token = await AsyncStorage.getItem('rider-token')
      if (token) setToken(token)
      setAppIsReady(true)
      await SplashScreen.hideAsync()
    })()
  }, [])

  useEffect(() => {
    // eslint-disable-next-line no-undef
    if (__DEV__) return
    ;(async() => {
      const { isAvailable } = await Updates.checkForUpdateAsync()
      if (isAvailable) {
        try {
          setIsUpdating(true)
          const { isNew } = await Updates.fetchUpdateAsync()
          if (isNew) {
            await Updates.reloadAsync()
          }
        } catch (error) {
          console.log('error while updating app', JSON.stringify(error))
        } finally {
          setIsUpdating(false)
        }
      }
    })()
  }, [])

  const setTokenAsync = async token => {
    await AsyncStorage.setItem('rider-token', token)
    client.clearStore()
    setToken(token)
  }

  const logout = async() => {
    try {
      await AsyncStorage.removeItem('rider-token')
      setToken(null)
      if (await Location.hasStartedLocationUpdatesAsync('RIDER_LOCATION')) {
        await Location.stopLocationUpdatesAsync('RIDER_LOCATION')
      }
    } catch (e) {
      console.log('Logout Error: ', e)
    }
  }

  if (isUpdating) {
    return (
      <View
        style={[
          styles.flex,
          styles.mainContainer,
          { backgroundColor: colors.startColor }
        ]}>
        <TextDefault textColor={colors.white} bold>
          Please wait while app is updating
        </TextDefault>
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    )
  }

  if (appIsReady) {
    return (
      <ApolloProvider client={client}>
        <StatusBar
          backgroundColor={colors.headerBackground}
          barStyle="dark-content"
        />
        <ConfigurationProvider>
          <AuthContext.Provider value={{ token, setTokenAsync, logout }}>
            <LocationProvider>
              <TabsContext.Provider value={{ active, setActive }}>
                <AppContainer />
              </TabsContext.Provider>
            </LocationProvider>
          </AuthContext.Provider>
        </ConfigurationProvider>
        <FlashMessage />
      </ApolloProvider>
    )
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={colors.spinnerColor} />
    </View>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})
