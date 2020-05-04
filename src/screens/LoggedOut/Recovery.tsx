import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  InputAccessoryView,
} from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import Header, { HeaderSizes } from '~/components/Header'
import Btn, { BtnTypes } from '~/components/Btn'
import BtnGroup from '~/components/BtnGroup'
import Paragraph, { ParagraphSizes } from '~/components/Paragraph'

import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { getSuggestedSeedKeys } from '~/utils/mnemonic'

const MNEMONIC_SEED_KEYS = 'MNEMONIC_SEED_KEYS'

enum ArrowDirections {
  left,
  right,
}

const Arrow: React.FC<{ direction?: ArrowDirections; onPress: () => void }> = ({
  children,
  direction = ArrowDirections.left,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.arrows,
        direction === ArrowDirections.left
          ? styles.leftArrow
          : styles.rightArrow,
      ]}
    >
      {children}
    </TouchableOpacity>
  )
}

type PillProps = {
  seedKey: string
  onSelectKey: (key: string) => void
}

const Pill: React.FC<PillProps> = ({ seedKey, onSelectKey }) => {
  return (
    <TouchableOpacity style={styles.pill} onPress={() => onSelectKey(seedKey)}>
      <Paragraph size={ParagraphSizes.medium}>{seedKey}</Paragraph>
    </TouchableOpacity>
  )
}

type SuggestionsProps = {
  suggestedKeys: string[]
  onSelectKey: (key: string) => void
}

const Suggestions: React.FC<SuggestionsProps> = ({
  suggestedKeys,
  onSelectKey,
}) => {
  return (
    <FlatList
      style={styles.suggestionsContainer}
      data={suggestedKeys}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <Pill key={item} seedKey={item} onSelectKey={onSelectKey} />
      )}
      horizontal={true}
      keyboardShouldPersistTaps="always"
    />
  )
}

const Recovery: React.FC = ({ navigation }) => {
  const [seedKey, setSeedKey] = useState('')
  const [phrase, setPhrase] = useState<string[]>([])
  const [currentWordIdx, setCurrentWordIdx] = useState(0)
  const [loading, setLoading] = useState(false)
  const [suggestedKeys, setSuggestedKeys] = useState<string[]>([])

  const handleKeySubmit = (word = seedKey) => {
    if (word) {
      if (currentWordIdx === phrase.length) {
        setPhrase((prevPhrase) => [...prevPhrase, word])
      } else {
        setPhrase((prevState) => {
          const phrase = prevState.slice()
          phrase[currentWordIdx] = word
          return phrase
        })
      }
      setCurrentWordIdx((prevIdx) => prevIdx + 1)
    }
  }

  const selectPrevWord = () => {
    setCurrentWordIdx((prevState) => prevState - 1)
  }
  const selectNextWord = () => {
    setCurrentWordIdx((prevState) => prevState + 1)
  }

  useEffect(() => {
    setSeedKey(phrase[currentWordIdx])
  }, [currentWordIdx])

  useEffect(() => {
    if (seedKey && seedKey.length > 1) {
      const suggestions = getSuggestedSeedKeys(seedKey)
      setSuggestedKeys(suggestions)
    } else {
      setSuggestedKeys([])
    }
  }, [seedKey])

  const redirectToSeedPhrase = useRedirectTo(ScreenNames.SeedPhrase)

  return (
    <ScreenContainer>
      <View style={styles.body}>
        <View style={styles.header}>
          {phrase.length ? (
            <>
              <Header>
                {currentWordIdx === phrase.length
                  ? phrase.length
                  : currentWordIdx + 1}
                /12
              </Header>
              <View style={styles.seedPhraseContainer}>
                {phrase.map((seedKey, idx) => (
                  <Header
                    key={seedKey}
                    size={HeaderSizes.small}
                    color={
                      currentWordIdx === 12
                        ? Colors.success
                        : idx === currentWordIdx
                        ? Colors.white
                        : Colors.activity
                    }
                  >
                    {seedKey}
                  </Header>
                ))}
              </View>
            </>
          ) : (
            <>
              <Header>Recovery</Header>
              <Paragraph>
                Start entering your seed-phrase word by word and it will appear
                here{' '}
              </Paragraph>
            </>
          )}
        </View>
        <View>
          <View style={styles.inputContainer}>
            {currentWordIdx > 0 && (
              <Arrow onPress={selectPrevWord}>
                <Paragraph>prev</Paragraph>
              </Arrow>
            )}
            <TextInput
              value={seedKey}
              editable={currentWordIdx < 12}
              onChangeText={setSeedKey}
              onSubmitEditing={handleKeySubmit}
              inputAccessoryViewID={MNEMONIC_SEED_KEYS}
              style={styles.input}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              blurOnSubmit={false}
              textAlign="center"
              spellCheck={false}
              autoCorrect={false}
              returnKeyType="next"
            />
            {currentWordIdx !== phrase.length && (
              <Arrow direction={ArrowDirections.right} onPress={selectNextWord}>
                {currentWordIdx < phrase.length - 1 && !loading && (
                  <Paragraph>next</Paragraph>
                )}
                {loading && <Paragraph>load</Paragraph>}
              </Arrow>
            )}
          </View>
          <Btn type={BtnTypes.secondary} onPress={() => {}}>
            What if I forgot my phrase?
          </Btn>
        </View>
      </View>
      <BtnGroup>
        <Btn onPress={redirectToSeedPhrase}>Confirm</Btn>
        <Btn type={BtnTypes.secondary} onPress={redirectToSeedPhrase}>
          Back to walkthrough
        </Btn>
      </BtnGroup>
      <InputAccessoryView nativeID={MNEMONIC_SEED_KEYS}>
        <Suggestions
          suggestedKeys={suggestedKeys}
          onSelectKey={handleKeySubmit}
        />
      </InputAccessoryView>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 0.55,
    width: '100%',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
  },
  seedPhraseContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: 'black',
    height: 80,
    borderRadius: 7,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
  },
  input: {
    fontSize: 34,
    width: '70%',
    color: Colors.white,
    borderWidth: 2,
    textDecorationLine: 'none',
  },
  arrows: {
    position: 'absolute',
    top: 22,
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
  suggestionsContainer: {
    marginBottom: 8,
  },
  pill: {
    backgroundColor: 'black',
    borderRadius: 4,
    paddingHorizontal: 17,
    paddingVertical: 10,
    marginRight: 8,
  },
})

export default Recovery
