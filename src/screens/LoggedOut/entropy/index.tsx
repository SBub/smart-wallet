import React, { useRef, useState, useEffect, useCallback } from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'

import ScreenContainer from '~/components/ScreenContainer'
import Header from '~/components/Header'

import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import { LoaderTypes } from '~/modules/loader/types'
import { generateSecureRandomBytes } from '~/utils/generateBytes'
import { setLoader, dismissLoader } from '~/modules/loader/actions'
import { strings } from '~/translations/strings'
import SDK from '~/utils/SDK'

import { EntropyIntro } from './EntropyIntro'
import { EntropyGenerator } from './EntropyGenerator'
import { EntropyCanvas } from './EntropyCanvas'

const ENOUGH_ENTROPY_PROGRESS = 0.3

const useDelay = (callback: () => void, timeout = 2000) => {
  return new Promise((res) => {
    setTimeout(() => {
      callback()
      res()
    }, timeout)
  })
}

export const Entropy: React.FC = () => {
  const redirectToSeedPhrase = useRedirectTo(ScreenNames.SeedPhrase)
  const redirectToEntropy = useRedirectTo(ScreenNames.Entropy)
  const dispatch = useDispatch()

  const submitEntropy = async (entropy: string) => {
    dispatch(setLoader({ type: LoaderTypes.default, msg: strings.CREATING }))
    try {
      await SDK.createIdentity(entropy)

      dispatch(setLoader({ type: LoaderTypes.success, msg: strings.SUCCESS }))
      await useDelay(() => dispatch(dismissLoader()))
      redirectToSeedPhrase()
    } catch (err) {
      dispatch(setLoader({ type: LoaderTypes.error, msg: strings.FAILED }))
      await useDelay(() => dispatch(dismissLoader()))
      // this is for Android: when you dismiss a modal overlay still stays
      redirectToEntropy()
    }
  }

  const { entropyProgress, addPoint } = useEntropyProgress(submitEntropy)

  return (
    <ScreenContainer>
      {!!entropyProgress ? (
        <View style={styles.percentage}>
          <Header>{`${Math.trunc(entropyProgress * 100)} %`}</Header>
        </View>
      ) : (
        <EntropyIntro />
      )}
      <EntropyCanvas disabled={entropyProgress === 1} addPoint={addPoint} />
    </ScreenContainer>
  )
}

export const useEntropyProgress = (submit: (entropy: string) => void) => {
  const [entropyProgress, setProgress] = useState(0)

  const entropyGenerator = useRef(new EntropyGenerator()).current

  useEffect(() => {
    if (entropyProgress === 1) {
      ;(async () => {
        await supplementEntropyProgress()
        submit(entropyGenerator.generateRandomString(4))
      })()
    }
  }, [entropyProgress])

  const supplementEntropyProgress = async () => {
    while (entropyGenerator.getProgress() < 1) {
      const moreEntropy = await generateSecureRandomBytes(512)
      // NOTE do not use moreEntropy.forEach, Buffer API is inconsistent, it
      // doesn't work in some envirtonments
      for (let i = 0; i < moreEntropy.length; i++) {
        entropyGenerator.addFromDelta(moreEntropy[i])
      }
    }
  }

  const updateProgress = () => {
    const progress = entropyGenerator.getProgress() / ENOUGH_ENTROPY_PROGRESS
    setProgress(progress >= 1 ? 1 : progress)
  }

  const addPoint = useCallback((x: number, y: number) => {
    entropyGenerator.addFromDelta(x)
    entropyGenerator.addFromDelta(y)

    updateProgress()
  }, [])

  return { entropyProgress, addPoint, entropyGenerator }
}

const styles = StyleSheet.create({
  percentage: {
    position: 'absolute',
    bottom: '10%',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
})
