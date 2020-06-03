import React, { useEffect } from 'react'
import Keychain from 'react-native-keychain'
import {
  View,
  Alert,
  Linking,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import FingerprintScanner from 'react-native-fingerprint-scanner'

import ScreenContainer from '~/components/ScreenContainer'
import Header, { HeaderSizes } from '~/components/Header'
import Paragraph from '~/components/Paragraph'
import Btn, { BtnTypes } from '~/components/Btn'
import BtnGroup from '~/components/BtnGroup'
import Ripple from '~/components/Ripple'

import { strings } from '~/translations/strings'

import TouchIdIcon from '~/assets/svg/TouchIdIcon'
import FaceIdIcon from '~/assets/svg/FaceIdIcon'

import useResetKeychainValues from '~/hooks/useResetKeychainValues'
import useRedirectTo from '~/hooks/useRedirectTo'

import { Colors } from '~/utils/colors'

import { ScreenNames } from '~/types/screens'

import { useDeviceAuthState } from './module/context'

import useBiometryRegistrationLoader from './useBiometryRegistrationLoader'

interface BiometricsPropsI {
  authType: string
}

const Biometrics: React.FC<BiometricsPropsI> = ({ authType }) => {
  const handleBiometryRegistration = useBiometryRegistrationLoader()
  const biometryType = useDeviceAuthState()

  const redirectToLoggedIn = useRedirectTo(ScreenNames.LoggedIn)

  const resetServiceValuesInKeychain = useResetKeychainValues(
    //@ts-ignore
    process.env['BIOMETRY_SERVICE'],
  )

  // 🧨🧨🧨🧨🧨
  // this is only for testing purposes !!! should be removed later on
  // this will delete credentials associated with a service name
  useEffect(() => {
    resetServiceValuesInKeychain()
  }, [])
  // 🧨🧨🧨🧨🧨

  const authenticate = async () => {
    try {
      await FingerprintScanner.authenticate({
        description:
          biometryType === 'FaceID'
            ? strings.SCAN_YOUR_FACE
            : strings.SCAN_YOUR_FINGERPRINT_ON_THE_DEVICE_SCANNER,
        fallbackEnabled: false, // on this stage we don't want to prompr use passcode as a fallback
      })

      await AsyncStorage.setItem('biometry', biometryType || '')
      handleBiometryRegistration()
    } catch (err) {
      if (err.name === 'FingerprintScannerNotEnrolled') {
        Alert.alert(
          strings.BIOMETRY_IS_DISABLED(biometryType),
          strings.TO_USE_BIOMETRICS_ENABLE,
          [
            {
              text: strings.SETTINGS,
              onPress: () => Linking.openSettings(),
            },
            {
              text: strings.CANCEL,
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
          ],
          { cancelable: false },
        )
      }
    }
  }

  return (
    <ScreenContainer customStyles={{ justifyContent: 'space-between' }}>
      <View>
        <Header size={HeaderSizes.small}>
          {strings.USE_ID_TO_AUTHORIZE(authType)}
        </Header>
        <Paragraph color={Colors.white70}>
          {strings.SO_YOU_DONT_NEED_TO_CONFIRM}
        </Paragraph>
      </View>
      <TouchableOpacity onPress={authenticate}>
        <View style={styles.animationContainer}>
          <Ripple
            color={Colors.activity}
            initialValue1={5}
            maxValue1={15}
            maxValue2={15}
          />
        </View>
        {authType === Keychain.BIOMETRY_TYPE.FACE_ID ? (
          <FaceIdIcon />
        ) : (
          <TouchIdIcon />
        )}
      </TouchableOpacity>
      <Paragraph color={Colors.success}>
        {strings.TAP_TO_ACTIVATE(authType)}
      </Paragraph>
      <BtnGroup>
        <Btn type={BtnTypes.secondary} onPress={redirectToLoggedIn}>
          {strings.SKIP}
        </Btn>
      </BtnGroup>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  animationContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Biometrics
