import React, { useState, useContext, useLayoutEffect, useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { OutlinedTextField } from 'react-native-material-textfield'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { getCoupon } from '../../apollo/mutations'
import { scale } from '../../utils/scaling'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import i18n from '../../../i18n'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import styles from './styles'
import analytics from '../../utils/analytics'
import { HeaderBackButton } from '@react-navigation/elements'
import navigationService from '../../routes/navigationService'
import { MaterialIcons, Entypo } from '@expo/vector-icons'

const GET_COUPON = gql`
  ${getCoupon}
`

function SelectVoucher(props) {
  const { paymentMethod } = props.route.params
  const [voucherCode, voucherCodeSetter] = useState('')
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const inset = useSafeAreaInsets()
  const [mutate] = useMutation(GET_COUPON, {
    onCompleted,
    onError
  })

  function onCompleted({ coupon }) {
    if (coupon) {
      if (coupon.enabled) {
        props.navigation.navigate('Cart', { paymentMethod, coupon })
        FlashMessage({
          message: i18n.t('coupanApply')
        })
      } else {
        FlashMessage({
          message: i18n.t('coupanFailed')
        })
      }
    }
  }
  useEffect(() => {
    async function Track() {
      await analytics.track(analytics.events.NAVIGATE_TO_COUPON)
    }
    Track()
  }, [])
  // eslint-disable-next-line handle-callback-err
  function onError(error) {
    FlashMessage({
      message: i18n.t('invalidCoupan')
    })
  }

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: 'My Vouchers',
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleContainerStyle: {
        marginTop: '1%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        borderRadius: scale(10),
        borderWidth: 1,
        borderColor: currentTheme.white,
        backgroundColor: currentTheme.black
      },
      headerStyle: {
        backgroundColor: currentTheme.headerColor,
        shadowColor: 'transparent',
        shadowRadius: 0
      },
      headerTitleAlign: 'center',
      headerRight: null,
      headerLeft: () => (
        <HeaderBackButton
          backImage={() => (
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 50,
                marginLeft: 10,
                width: 55,
                alignItems: 'center'
              }}>
              <Entypo name="cross" size={30} color="black" />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [props.navigation])

  function onSelectCoupon(text) {
    mutate({ variables: { coupon: text } })
  }

  const HeaderLine = props => {
 
  }
  return (
    <>
      <View style={[styles().flex, styles(currentTheme).mainContainer]}>
        <HeaderLine
          // headerName="TYPe voucher code"
          textWidth="45%"
          lineWidth="25%"
        />
        <View style={styles().upperContainer}>
          <View style={styles().innerContainer}>
            <OutlinedTextField
              label="Enter your voucher code"
              labelFontSize={scale(12)}
              fontSize={scale(12)}
              maxLength={15}
              textAlignVertical="top"
              textColor={currentTheme.fontMainColor}
              baseColor={currentTheme.fontSecondColor}
              errorColor={currentTheme.textErrorColor}
              tintColor={currentTheme.iconColorPink}
              labelOffset={{ y1: -5 }}
              labelTextStyle={{ fontSize: scale(12), paddingTop: scale(1) }}
              onChangeText={text => {
                voucherCodeSetter(text)
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => onSelectCoupon(voucherCode)}
            style={styles(currentTheme).buttonContainer}>
            <TextDefault textColor={currentTheme.buttonText} H5 bold uppercase>
              {i18n.t('apply')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          paddingBottom: inset.bottom,
          backgroundColor: currentTheme.themeBackground
        }}
      />
    </>
  )
}

export default SelectVoucher
