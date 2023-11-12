import React, { useContext } from 'react'
import { View, TouchableOpacity, TextInput } from 'react-native'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import styles from './styles'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import i18n from '../../../../i18n'

function Search(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return (
    <View style={styles(currentTheme).mainContainerHolder}>
      <View style={styles(currentTheme).mainContainer}>
        <View style={styles().subContainer}>
          <View style={styles().leftContainer}>
            <View style={styles().searchContainer}>
              <Ionicons
                name="ios-search"
                color={currentTheme.fontSecondColor}
                size={scale(20)}
              />
            </View>
            <View style={styles().inputContainer}>
              <TextInput
                style={styles(currentTheme).bodyStyleOne}
                placeholder={i18n.t('searchRestaurant')}
                placeholderTextColor={currentTheme.fontSecondColor}
                onChangeText={text => props.setSearch(text)}
                value={props.search}
              />
            </View>
          </View>
          <View style={styles().filterContainer}>
            {props.search ? (
              <TouchableOpacity
                onPress={() => {
                  props.setSearch('')
                }}>
                <AntDesign
                  name="closecircleo"
                  size={20}
                  color={currentTheme.fontSecondColor}
                />
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

export default Search
