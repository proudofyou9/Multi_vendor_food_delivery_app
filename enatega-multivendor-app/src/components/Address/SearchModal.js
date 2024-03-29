import React, { useContext, useEffect } from 'react'
import {
  Modal,
  View,
  TouchableOpacity,
  Keyboard,
  Dimensions
} from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import Animated, {
  EasingNode,
  Extrapolate,
  interpolateNode,
  timing,
  useValue
} from 'react-native-reanimated'
import useEnvVars from '../../../environment'
import CloseIcon from '../../assets/SVG/imageComponents/CloseIcon'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'
import { theme } from '../../utils/themeColors'
import TextDefault from '../Text/TextDefault/TextDefault'
import styles from './styles'

import { useTranslation } from 'react-i18next'

const { height } = Dimensions.get('screen')

export default function SearchModal({
  visible = false,
  onClose = () => {},
  onSubmit = () => {}
}) {
  const { t } = useTranslation()
  const animation = useValue(0)
  const { GOOGLE_MAPS_KEY } = useEnvVars()
  console.log('GOOGLE_MAPS_KEY', GOOGLE_MAPS_KEY)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  const marginTop = interpolateNode(animation, {
    inputRange: [0, 1],
    outputRange: [height * 0.4, height * 0.06],
    extrapolate: Extrapolate.CLAMP
  })

  const radius = interpolateNode(animation, {
    inputRange: [0, 1],
    outputRange: [scale(30), 0],
    extrapolate: Extrapolate.CLAMP
  })

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow)
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide)

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow)
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide)
    }
  }, [])

  const _keyboardDidShow = () => {
    animate()
  }

  const _keyboardDidHide = () => {
    // alert('Off')
    animate(true)
  }

  function animate(hide = false) {
    timing(animation, {
      toValue: hide ? 0 : 1,
      duration: 300,
      easing: EasingNode.inOut(EasingNode.ease)
    }).start()
  }
  function close() {
    animation.setValue(0)
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType={'slide'}
      onRequestClose={onClose}>
      <Animated.View
        style={[
          styles(currentTheme).modalContainer,
          {
            marginTop: marginTop,
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius
          }
        ]}>
        <TouchableOpacity style={styles().modalTextBtn} onPress={close}>
          <CloseIcon />
        </TouchableOpacity>
        <TextDefault bold H4>
          {t('searchAddress')}
        </TextDefault>
        <View style={[styles(currentTheme).flex, alignment.MTsmall]}>
          <GooglePlacesAutocomplete
            placeholder={t('search')}
            minLength={2} // minimum length of text to search
            autoFocus={true}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed="auto" // true/false/undefined
            fetchDetails={true}
            renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => {
              onSubmit(data.description, details.geometry.location)
            }}
            getDefaultValue={() => {
              return '' // text input default value
            }}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: GOOGLE_MAPS_KEY,
              language: 'en' // language of the results
            }}
            styles={{
              description: {
                fontWeight: 'bold'
              },
              predefinedPlacesDescription: {
                color: '#1faadb'
              },
              textInputContainer: {
                borderWidth: 1,
                borderColor: currentTheme.tagColor,
                // backgroundColor:"blue",
                ...alignment.PRxSmall,
                padding: 5
              },
              textInput: {
                ...alignment.MLxSmall
              }
            }}
            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={
              {
                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
              }
            }
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: 'distance'
            }}
            // filterReverseGeocodingByTypes={[
            //   'locality',
            // ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            debounce={200}
          />
        </View>
      </Animated.View>
    </Modal>
  )
}
