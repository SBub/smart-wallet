import React from 'react'
import { Animated, StyleSheet, Platform } from 'react-native'

import BtnGroup from '~/components/BtnGroup'
import Btn, { BtnTypes } from '~/components/Btn'

import Suggestions from './Suggestions'
import useAnimation from './useAnimation'
import { strings } from '~/translations/strings'
import { useNavigation } from '@react-navigation/native'

type ScreenFooterProps = {
  areBtnsVisible: boolean
  handleKeySubmit: (word: string) => void
  isPhraseComplete: boolean
  suggestedKeys: string[]
  handlePhraseSubmit: () => void
}

const ScreenFooter: React.FC<ScreenFooterProps> = ({
  areBtnsVisible,
  handlePhraseSubmit,
  isPhraseComplete,
  suggestedKeys,
  handleKeySubmit,
}) => {
  const { animatedBtns, animatedSuggestions } = useAnimation()

  const navigation = useNavigation()

  if (areBtnsVisible) {
    return (
      <Animated.View style={{ width: '100%', opacity: animatedBtns }}>
        <BtnGroup>
          <Btn onPress={handlePhraseSubmit} disabled={!isPhraseComplete}>
            {strings.CONFIRM}
          </Btn>
          <Btn type={BtnTypes.secondary} onPress={() => navigation.goBack()}>
            {strings.BACK_TO_WALKTHROUGH}
          </Btn>
        </BtnGroup>
      </Animated.View>
    )
  }
  return (
    <Animated.View style={[styles.footer, { opacity: animatedSuggestions }]}>
      <Suggestions
        suggestedKeys={suggestedKeys}
        onSelectKey={handleKeySubmit}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  footer: {
    height: 50,
    position: 'absolute',
    bottom: 10,
    width: '100%',
    ...Platform.select({
      android: {
        bottom: 30,
      },
    }),
  },
})

export default ScreenFooter
