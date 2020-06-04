import React, { useState } from 'react'
import {
  View,
  Platform,
  UIManager,
  LayoutAnimation,
  StyleSheet,
} from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import SDK from '~/utils/SDK'
import PhraseDraggable from './draggableWord'
import { WordState, WordPosition } from './types'
import { Text } from 'react-native-svg'
import Paragraph from '~/components/Paragraph'
import BtnGroup from '~/components/BtnGroup'
import Btn, { BtnTypes, BtnSize } from '~/components/Btn'
import { strings } from '~/translations/strings'

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }
}

const shuffleArray = (arr: any[]) =>
  arr
    .map((a) => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1])

const originalPhrase = SDK.getMnemonic()
const shuffledPhrase = shuffleArray(originalPhrase)

const SeedPhraseRepeat: React.FC = () => {
  const redirectToSeedphrase = useRedirectTo(ScreenNames.SeedPhrase)
  const redirectToClaims = useRedirectTo(ScreenNames.LoggedIn)
  const [seedphrase, setSeedphrase] = useState<WordState[]>(
    shuffledPhrase.map((word, key) => ({
      id: key,
      text: word,
      position: {
        x: 0,
        y: 0,
        height: 0,
        width: 0,
      },
    })),
  )
  const [droppedIndex, setDroppedIndex] = useState(-1)
  const [isSorted, setSorted] = useState(false)

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
      const isMatch =
        arr.map((w) => w.text).toString() == originalPhrase.toString()
      if (isMatch) {
        setSorted(true)
        setDroppedIndex(-1)
      } else {
        setDroppedIndex(dragId)
      }
      return arr
    })
  }

  return (
    <ScreenContainer>
      <View style={styles.topContainer}>
        <View style={styles.phraseContainer}>
          {seedphrase.map((word, key) => {
            return (
              <PhraseDraggable
                key={key}
                id={word.id}
                onLayout={handleLayout}
                phraseState={seedphrase}
                onDrop={handleDrop}
                isLastDropped={word.id === droppedIndex}
              />
            )
          })}
        </View>
        <Paragraph customStyles={styles.info}>
          {strings.DRAG_AND_DROP_WORDS_UNTIL_IT_WILL_BE_EXACTLY_THE_SAME_PHRASE}
        </Paragraph>
      </View>
      <View style={styles.bottomContainer}>
        <BtnGroup>
          <Btn
            size={BtnSize.medium}
            type={BtnTypes.primary}
            disabled={!isSorted}
            onPress={redirectToClaims}
          >
            {strings.DONE}
          </Btn>
          <Btn type={BtnTypes.secondary} onPress={redirectToSeedphrase}>
            {strings.BACK}
          </Btn>
        </BtnGroup>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  topContainer: {
    justifyContent: 'center',
    flex: 2,
  },
  bottomContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  phraseContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  info: {
    paddingHorizontal: 30,
    position: 'absolute',
    bottom: 0,
  },
})

export default SeedPhraseRepeat
