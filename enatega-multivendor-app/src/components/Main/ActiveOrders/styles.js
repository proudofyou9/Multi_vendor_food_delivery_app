import { StyleSheet } from 'react-native'
import { verticalScale, scale } from '../../../utils/scaling'
import { fontStyles } from '../../../utils/fontStyles'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    safeAreaViewStyles: {
      flex: 1,
      backgroundColor: props !== null ? props.headerBackground : 'transparent'
    },
    mainContentContainer: {
      width: '100%',
      height: '100%',
      alignSelf: 'center',
      backgroundColor: props !== null ? props.themeBackground : 'transparent'
    },
    randomShapeContainer: {
      right: 0,
      position: 'absolute',
      zIndex: -1,
      transform: [{ rotate: '90deg' }]
    },
    statusContainer: {
      overflow: 'hidden',
      width: '95%',
      alignSelf: 'center',
      backgroundColor: '#90EA93',
      borderRadius: scale(12),
      marginTop: verticalScale(10),
      // marginBottom: verticalScale(10),
      elevation: 7,
      shadowColor: props != null ? props.shadowColor : 'grey',
      shadowOffset: {
        width: 0,
        height: verticalScale(0)
      },
      shadowOpacity: 0.3,
      shadowRadius: verticalScale(3),
      borderWidth: 1,
      borderColor: '#FFF'
    },
    // cardViewContainer: {
    //   width: '98%',
    //   alignSelf: 'center',
    //   height: verticalScale(180),
    //   marginTop: verticalScale(2),
    //   marginBottom: verticalScale(10),
    //   elevation: 7,
    //   shadowColor: props !== null ? props.shadowColor : 'transparent',
    //   shadowOffset: {
    //     width: 0,
    //     height: verticalScale(3)
    //   },
    //   shadowOpacity: 1,
    //   shadowRadius: verticalScale(4),
    //   borderWidth: 1,
    //   borderColor: props !== null ? props.white : '#FFF'
    // },
    imgCard: {
      position: 'relative',
      flex: 1,
      width: undefined,
      height: undefined
    },
    textContainer: {
      width: scale(300),
      paddingTop: scale(15),
      paddingLeft: scale(15),
      paddingRight: scale(15)
    },
    title: {
      color: props !== null ? props.statusSecondColor : 'grey',
      fontSize: verticalScale(15),
      fontFamily: fontStyles.MuseoSans500
    },
    description: {
      color: props !== null ? props.fontMainColor : '#000',
      fontSize: verticalScale(15),
      fontFamily: fontStyles.MuseoSans500,
      paddingLeft: scale(5),
      paddingTop: scale(3),
      fontWeight: '700'
    },
    statusText: {
      color: props !== null ? props.statusSecondColor : 'grey',
      fontSize: verticalScale(13),
      fontFamily: fontStyles.MuseoSans500,
      marginBottom: scale(10),
      paddingLeft: 40,
      fontWeight: '500'
    },
    timeText: {
      color: props !== null ? props.iconColorPink : 'red',
      fontSize: verticalScale(24),
      fontFamily: fontStyles.MuseoSans300,
      marginLeft: -10
    },
    statusCircle: {
      marginRight: scale(5),
      marginBottom: scale(5),
      marginTop: scale(5)
    },
    viewAllButton: {
      paddingTop: 0,
      paddingBottom: 10
    },
    btncontainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    button: {
      padding: 10,
      borderRadius: 5
    },
    buttonText: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold'
    },
    textInnerContainer: {
      flexDirection: 'row'
    },
    activeOrdersContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginTop: scale(2),
      marginBottom: scale(2),
      paddingLeft: 40
    }
  })

export default styles
