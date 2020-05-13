import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import { Colors } from '~/utils/colors'
import { getSuggestedSeedKeys, isKeyValid } from '~/utils/mnemonic'
import { BackArrowIcon, ForthArrowIcon } from '~/assets/svg'

import Arrow, { ArrowDirections } from './Arrow'
import useBtnsVisibility from './useBtnsVisibility'
import RecoveryInputMetadata from './RecoveryInputMetadata'
import RecoveryHeader from './RecoveryHeader'
import RecoveryFooter from './RecoveryFooter'

import {
  setSeedKey,
  setPhrase,
  setCurrentWordIdx,
  setSuggestedKeys,
} from './module/actions'
import RecoveryContextProvider, {
  useRecoveryDispatch,
  useRecoveryState,
} from './module/context'

const Recovery: React.FC = () => {
  const dispatch = useRecoveryDispatch()
  const recoveryState = useRecoveryState()
  const { seedKey, phrase, currentWordIdx, suggestedKeys } = recoveryState

  const [keyHasError, setHasError] = useState(false) // used to color border of input in 'failed' color and display an error
  const [keyIsValid, setKeyIsValid] = useState(false) // used to color border of input in 'success' color

  const { inputRef, areBtnsVisible, hideBtns } = useBtnsVisibility()

  const handleKeySubmit = (word = seedKey) => {
    if (word) {
      if (currentWordIdx === phrase.length) {
        dispatch(setPhrase([...phrase, word]))
      } else {
        // this is when we are moving across seed phrase back and forth with arrows - it sets
        const updatedPhrase = phrase.slice()
        updatedPhrase[currentWordIdx] = word
        dispatch(setPhrase(updatedPhrase))
      }
      dispatch(setCurrentWordIdx(currentWordIdx + 1)) // move to the next word
      setKeyIsValid(false)
    }
  }

  const selectPrevWord = () => {
    dispatch(setCurrentWordIdx(currentWordIdx - 1))
  }
  const selectNextWord = () => {
    dispatch(setCurrentWordIdx(currentWordIdx + 1))
  }

  useEffect(() => {
    dispatch(setSeedKey(phrase[currentWordIdx]))
  }, [currentWordIdx])

  useEffect(() => {
    if (seedKey && seedKey.length > 1) {
      const suggestions = getSuggestedSeedKeys(seedKey)
      dispatch(setSuggestedKeys(suggestions))

      const isValid = isKeyValid(seedKey)
      setKeyIsValid(isValid)
    } else {
      dispatch(setSuggestedKeys([]))
    }
  }, [seedKey])

  useEffect(() => {
    if (seedKey && seedKey.length > 1 && !suggestedKeys.length) {
      setHasError(true)
    } else {
      setHasError(false)
    }
  }, [suggestedKeys])

  const dismissKeyboard = () => {
    Keyboard.dismiss()
    selectNextWord()
    setKeyIsValid(false)
  }

  const handleSeedKeyChange = useCallback((val: string) => {
    dispatch(setSeedKey(val))
  }, [])

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScreenContainer
        customStyles={{
          justifyContent: areBtnsVisible ? 'space-between' : 'flex-start',
        }}
      >
        <RecoveryHeader phrase={phrase} currentWordIdx={currentWordIdx} />
        <View style={styles.inputContainer}>
          <View
            style={[
              styles.inputField,
              keyHasError && styles.inputError,
              keyIsValid && styles.inputValid,
            ]}
          >
            {currentWordIdx > 0 && (
              <Arrow direction={ArrowDirections.left} onPress={selectPrevWord}>
                <BackArrowIcon />
              </Arrow>
            )}
            <TextInput
              value={seedKey}
              ref={inputRef}
              editable={currentWordIdx < 12}
              onChangeText={handleSeedKeyChange}
              onSubmitEditing={
                keyIsValid
                  ? (e) => handleKeySubmit(e.nativeEvent.text)
                  : Keyboard.dismiss
              }
              onFocus={hideBtns}
              style={styles.input}
              testID="seedphrase-input"
              keyboardAppearance="dark"
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              //@ts-ignore
              textAlign="center"
              returnKeyType="next"
              blurOnSubmit={false}
              spellCheck={false}
              autoCorrect={false}
            />
            {currentWordIdx !== phrase.length && (
              <Arrow direction={ArrowDirections.right} onPress={selectNextWord}>
                {currentWordIdx < 11 && <ForthArrowIcon />}
              </Arrow>
            )}
            {currentWordIdx === 11 && phrase.length === 12 && (
              <Arrow
                direction={ArrowDirections.right}
                onPress={dismissKeyboard}
              >
                <ForthArrowIcon />
              </Arrow>
            )}
          </View>
          <RecoveryInputMetadata keyHasError={keyHasError} />
        </View>
        <RecoveryFooter
          suggestedKeys={suggestedKeys}
          areBtnsVisible={areBtnsVisible}
          handleKeySubmit={handleKeySubmit}
          isPhraseComplete={phrase.length === 12}
        />
      </ScreenContainer>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  body: {
    width: '100%',
    justifyContent: 'space-between',
  },
  inputContainer: {
    width: '100%',
  },
  inputField: {
    width: '100%',
    backgroundColor: 'black',
    height: 80,
    borderRadius: 7,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    borderWidth: 2,
  },
  input: {
    fontSize: 34,
    width: '70%',
    color: Colors.white,
    textDecorationLine: 'none',
  },
  inputError: {
    borderColor: Colors.error,
    borderWidth: 2,
  },
  inputValid: {
    borderColor: Colors.success,
  },
})

export default function () {
  return (
    <RecoveryContextProvider>
      <Recovery />
    </RecoveryContextProvider>
  )
}
