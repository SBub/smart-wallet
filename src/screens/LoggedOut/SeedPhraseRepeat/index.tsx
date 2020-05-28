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

  const handleDrop = (dragId: number, replaceId: number) => {
    const arr = [...seedphrase]
    const cutout = arr.splice(dragId, 1)[0]
    arr.splice(replaceId, 0, cutout)
    console.log('drag', seedphrase[dragId].word)
    console.log('replace', seedphrase[replaceId].word)
    console.log(seedphrase.map((w) => w.word))
    console.log(arr.map((w) => w.word))
    setSeedphrase(arr)
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
              word={seedphrase[key]}
              onLayout={handleLayout}
              phraseState={seedphrase}
              onDrop={handleDrop}
            />
          )
        })}
      </View>
    </ScreenContainer>
  )
}

export default SeedPhraseRepeat
