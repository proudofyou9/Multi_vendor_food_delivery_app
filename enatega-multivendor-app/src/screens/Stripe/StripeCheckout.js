import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { myOrders } from '../../apollo/queries'
import gql from 'graphql-tag'
import useEnvVars from '../../../environment'
import { useApolloClient } from '@apollo/client'
import UserContext from '../../context/User'
import analytics from '../../utils/analytics'

const MYORDERS = gql`
  ${myOrders}
`

function StripeCheckout(props) {
  const Analytics = analytics()

  const { SERVER_URL } = useEnvVars()
  console.log('SERVER_URL', SERVER_URL)
  const [loading, loadingSetter] = useState(true)
  const { clearCart } = useContext(UserContext)
  const client = useApolloClient()
  const { _id } = props.route.params

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: null,
      title: 'Stripe Checkout'
    })
  }, [props.navigation])

  function onClose(flag) {
    // showMessage here
    props.navigation.goBack()
  }
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_STRIPE)
    }
    Track()
  }, [])

  async function handleResponse(data) {
    if (data.url.includes('stripe/success')) {
      const result = await client.query({
        query: MYORDERS,
        fetchPolicy: 'network-only'
      })
      const order = result.data.orders.find(order => order.orderId === _id)
      await clearCart()
      console.log('cart clear')
      props.navigation.reset({
        routes: [
          { name: 'Main' },
          {
            name: 'OrderDetail',
            params: { _id: order._id }
          }
        ]
      })
    } else if (data.url.includes('stripe/cancel')) {
      props.navigation.goBack()
      // goBack on Payment Screen
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        javaScriptEnabled={true}
        // scrollEnabled={false}
        bounces={false}
        onLoad={() => {
          loadingSetter(false)
          console.log(loading)
        }}
        source={{
          uri: `${SERVER_URL}stripe/create-checkout-session?id=${_id}`
        }}
        scalesPageToFit={true}
        onNavigationStateChange={data => {
          handleResponse(data)
        }}
      />
      {loading ? (
        <ActivityIndicator
          style={{ position: 'absolute', bottom: '50%', left: '50%' }}
        />
      ) : null}
    </View>
  )
}

export default StripeCheckout
