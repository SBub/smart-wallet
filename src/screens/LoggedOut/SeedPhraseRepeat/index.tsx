import React, { useState } from 'react'
import { View, Platform, UIManager, LayoutAnimation } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import SDK from '~/utils/SDK'
import PhraseDraggable from './draggableWord'

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }
}

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
    })),
  )
  const [droppedIndex, setDroppedIndex] = useState(-1)

  const handleLayout = (position: WordPosition, wordId: number) => {
    setSeedphrase((prevState) => {
      const stateWordI = prevState.findIndex((w) => w.id === wordId)
      const newState = prevState
      newState[stateWordI].position = position
      return newState
    })
  }

  const handleDrop = (dragId: number, replaceId: number) => {
    setSeedphrase((prevState) => {
      const arr = [...prevState]
      const dragKey = arr.findIndex((w) => w.id == dragId)
      const replaceKey = arr.findIndex((w) => w.id == replaceId)
      const cutout = arr.splice(dragKey, 1)[0]
      arr.splice(replaceKey, 0, cutout)
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.spring,
        duration: 400,
      })
      setDroppedIndex(dragId)
      return arr
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
              id={word.id}
              onLayout={handleLayout}
              phraseState={seedphrase}
              onDrop={handleDrop}
              isHighlight={word.id === droppedIndex}
            />
          )
        })}
      </View>
    </ScreenContainer>
  )
}

export default SeedPhraseRepeat
