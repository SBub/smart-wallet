import React from 'react'
import { View, StyleSheet } from 'react-native'

import { HandAnimation } from './HandAnimation'
import Header from '~/components/Header'
import Paragraph from '~/components/Paragraph'
import { strings } from '~/translations/strings'

export const EntropyIntro: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.handContainer}>
        <HandAnimation />
      </View>
      <View style={styles.textContainer}>
        <Header>{strings.SET_UP_YOUR_IDENTITY}</Header>
        <Paragraph>
          {strings.TAP_THE_SCREEN_AND_DRAW_RANDOMLY_ON_IT_UNTIL_YOU_COLLECT_100}
        </Paragraph>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  handContainer: {
    margin: 60,
    width: 78,
    height: 84,
  },
  textContainer: {
    alignItems: 'center',
  },
})
