import React, { useState } from 'react'
import { View } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'

import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import SDK from '~/utils/SDK'
import PhraseDraggable from './draggableWord'

export interface WordPosition {
  x: number
  y: number
  height: number
  width: number
}

export interface WordState {
  id: number
  word: string
  position: WordPosition
  active: boolean
}

const SeedPhraseRepeat: React.FC = () => {
  const redirectToClaims = useRedirectTo(ScreenNames.LoggedIn)
  const [seedphrase, setSeedphrase] = useState<WordState[]>(
    SDK.getMnemonic().map((word, key) => ({
      id: key,
      word,
      position: {
        x: 0,
        y: 0,
        height: 0,
        width: 0,
      },
      active: false,
    })),
  )

  const handleLayout = (position: WordPosition, wordId: number) => {
    setSeedphrase((prevState) => {
      const stateWordI = prevState.findIndex((w) => w.id === wordId)
      const newState = prevState
      newState[stateWordI].position = position
      return newState
    })
  }

  return (
    <ScreenContainer>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {seedphrase.map((word, key) => {
          return (
            <PhraseDraggable
              key={key}
              word={word}
              onLayout={handleLayout}
              phraseState={seedphrase}
            />
          )
        })}
      </View>
    </ScreenContainer>
  )
}

export default SeedPhraseRepeat
