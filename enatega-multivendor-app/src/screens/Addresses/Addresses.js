import React, { useContext, useEffect, useLayoutEffect } from 'react'
import {
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform,
  Text,
  ScrollView
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useMutation } from '@apollo/client'
import {
  AntDesign,
  EvilIcons,
  SimpleLineIcons,
  MaterialIcons
} from '@expo/vector-icons'

import gql from 'graphql-tag'
import i18n from '../../../i18n'
import { scale } from '../../utils/scaling'
import { deleteAddress } from '../../apollo/mutations'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import UserContext from '../../context/User'
import { theme } from '../../utils/themeColors'
import styles from './styles'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import EmptyAddress from '../../assets/SVG/imageComponents/EmptyAddress'
import Analytics from '../../utils/analytics'
import navigationService from '../../routes/navigationService'
import { HeaderBackButton } from '@react-navigation/elements'
import CustomHomeIcon from '../../assets/SVG/imageComponents/CustomHomeIcon'
import CustomWorkIcon from '../../assets/SVG/imageComponents/CustomWorkIcon'
import CustomOtherIcon from '../../assets/SVG/imageComponents/CustomOtherIcon'

const DELETE_ADDRESS = gql`
  ${deleteAddress}
`

function Addresses() {
  const navigation = useNavigation()
  const [mutate, { loading: loadingMutation }] = useMutation(DELETE_ADDRESS)
  const { profile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const inset = useSafeAreaInsets()
  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.headerBackground)
    }
    StatusBar.setBarStyle('light-content')
  })
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_ADDRESS)
    }
    Track()
  }, [])
  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('myAddresses'),
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleContainerStyle: {
        marginBottom: scale(10),
        paddingLeft: scale(20),
        paddingRight: scale(20),
        backgroundColor: currentTheme.black,
        borderRadius: scale(10),
        borderColor: currentTheme.white,
        borderWidth: 1,
        marginLeft: 0
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
              <MaterialIcons name="arrow-back" size={30} color="black" />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [])

  const addressIcons = {
    Home: CustomHomeIcon,
    Work: CustomWorkIcon,
    Other: CustomOtherIcon
  }

  function emptyView() {
    return (
      <View style={styles().subContainerImage}>
        <EmptyAddress width={scale(300)} height={scale(300)} />
        <View>
          <View style={styles().descriptionEmpty}>
            <View style={styles().viewTitle}>
              <TextDefault textColor={currentTheme.fontMainColor} bolder>
                It&#39;s empty here.
              </TextDefault>
            </View>
            <View>
              <TextDefault textColor={currentTheme.fontMainColor} bold>
                You haven&#39;t saved any address yet.
                {'\n'}
                Click Add New Address to get started
              </TextDefault>
            </View>
          </View>
        </View>
      </View>
    )
  }
  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles(currentTheme).containerInfo}>
          <FlatList
            data={profile.addresses}
            ListEmptyComponent={emptyView}
            keyExtractor={item => item._id}
            ItemSeparatorComponent={() => (
              <View style={styles(currentTheme).line} />
            )}
            ListHeaderComponent={() => (
              <View style={{ ...alignment.MTmedium }} />
            )}
            renderItem={({ item: address }) => (
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles().width100,
                  styles(currentTheme).containerSpace
                ]}>
                <View style={styles().width100}>
                  <View style={[styles().titleAddress, styles().width100]}>
                    <TextDefault
                      textColor={currentTheme.fontMainColor}
                      style={styles().labelStyle}>
                      {/* style={{ width: '60%', textAlignVertical: 'bottom' }}> */}
                      {address.label}
                    </TextDefault>
                  </View>
                  <View style={{ ...alignment.MTxSmall }}></View>

                  <View style={styles().midContainer}>
                    <View style={[styles().homeIcon]}>
                      {/* <FontAwesome
                      name={addressIcons[address.label]}
                      size={scale(32)}
                      color={currentTheme.iconColorPink}
                    /> */}
                      {addressIcons[address.label] ? (
                        React.createElement(addressIcons[address.label], {
                          // width: scale(32),
                          // height: scale(32),
                          fill: currentTheme.iconColorPink
                        })
                      ) : (
                        <AntDesign name="question" size={24} color="black" />
                      )}
                    </View>

                    {/* <CustomHomeIcon /> */}
                    <View style={styles().addressDetail}>
                      <TextDefault textColor={currentTheme.fontSecondColor}>
                        {address.deliveryAddress}
                      </TextDefault>
                      <TextDefault textColor={currentTheme.fontSecondColor}>
                        {address.details}
                      </TextDefault>
                    </View>
                  </View>

                  <View style={[styles().buttonsAddress, styles().width100]}>
                    {/* <TextDefault> */}
                    {/* <View style={[styles().width10, { alignItems: 'center' }]}> */}

                    <TouchableOpacity
                      disabled={loadingMutation}
                      activeOpacity={0.7}
                      style={styles(currentTheme).editButton}
                      onPress={() => {
                        navigation.navigate('EditAddress', { ...address })
                      }}>
                      <SimpleLineIcons
                        name="pencil"
                        size={scale(13)}
                        style={[styles().editIcon, styles().btnTextWhite]}
                      />
                      <Text style={styles().btnTextWhite}>Update</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      disabled={loadingMutation}
                      style={[styles().width10, styles().deleteButton]}
                      onPress={() => {
                        mutate({ variables: { id: address._id } })
                      }}>
                      <EvilIcons
                        name="trash"
                        size={scale(20)}
                        style={styles().btnTextWhite}
                      />
                      <Text style={styles().btnTextWhite}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />

          <View style={styles(currentTheme).containerButton}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles().addButton}
              onPress={() => navigation.navigate('NewAddress')}>
              <AntDesign name="plus" size={scale(30)} color={'#FFF'} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          paddingBottom: inset.bottom,
          backgroundColor: currentTheme.themeBackground
        }}
      />
    </>
  )
}

export default Addresses
