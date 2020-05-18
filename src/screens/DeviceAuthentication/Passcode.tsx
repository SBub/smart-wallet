import React, { useState, useRef } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native'

import Header from '~/components/Header'
import ScreenContainer from '~/components/ScreenContainer'
import PasscodeInput from '~/components/PasscodeInput'

import { Colors } from '~/utils/colors'

const PASSCODE_LENGTH = new Array(4).fill(0)
const DIGIT_WIDTH = 65
const DIGIT_MARGIN_RIGHT = 7

const Passcode = () => {
  const [passcode, setPasscode] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<TextInput>(null)

  const digits = passcode.split('')
  const selectedIndex =
    digits.length < PASSCODE_LENGTH.length
      ? digits.length
      : PASSCODE_LENGTH.length - 1
  const hideInput = !(digits.length < PASSCODE_LENGTH.length)

  const handlePress = () => {
    inputRef.current?.focus()
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const handleChange = (passcode: string) => {
    setPasscode((prevState) => {
      if (prevState.length >= PASSCODE_LENGTH.length) return prevState
      return (prevState + passcode).slice(0, PASSCODE_LENGTH.length)
    })
  }

  const handleRemove = (e) => {
    if (e.nativeEvent.key === 'Backspace') {
      setPasscode((prevState) => prevState.slice(0, prevState.length - 1))
    }
  }

  return (
    <ScreenContainer>
      <Header>Passcode</Header>
      {/* <PasscodeInput /> */}
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.wrap}>
          {PASSCODE_LENGTH.map((v, index) => {
            const isSelected = digits.length === index
            return (
              <View
                style={[
                  styles.display,
                  isSelected && isFocused && styles.active,
                ]}
                key={index}
              >
                <Text style={styles.text}>{digits[index] || ''}</Text>
              </View>
            )
          })}
          <TextInput
            value=""
            ref={inputRef}
            onChangeText={handleChange}
            onKeyPress={handleRemove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={[
              styles.input,
              {
                left: selectedIndex * (65 + DIGIT_MARGIN_RIGHT),
                opacity: hideInput ? 0 : 1,
              },
            ]}
            keyboardType="numeric"
          />
        </View>
      </TouchableWithoutFeedback>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    flexDirection: 'row',
  },
  input: {
    position: 'absolute',
    fontSize: 43,
    textAlign: 'center',
    backgroundColor: 'transparent',
    width: DIGIT_WIDTH,
    borderRadius: 11,
    top: 0,
    bottom: 0,
  },
  display: {
    width: DIGIT_WIDTH,
    height: 87,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    backgroundColor: Colors.black,
    marginRight: DIGIT_MARGIN_RIGHT,
  },
  active: {
    borderWidth: 3,
    borderColor: Colors.activity,
  },
  text: {
    fontSize: 43,
    color: Colors.white,
  },
})

export default Passcode
