import React, { memo } from 'react'
import { View, StyleSheet } from 'react-native'

import Paragraph from '~/components/Paragraph'
import { Colors } from '~/utils/colors'
import { strings } from '~/translations/strings'

type Props = {
  keyHasError: boolean
}

const InputMetadata: React.FC<Props> = ({ keyHasError }) => {
  return (
    <View style={styles.inputMeta}>
      {keyHasError ? (
        <Paragraph color={Colors.error}>{strings.CANT_MATCH_WORD}</Paragraph>
      ) : (
        <Paragraph>{strings.WHAT_IF_I_FORGOT}</Paragraph>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  inputMeta: {
    marginTop: 15,
  },
})

// to avoid rerendering on every key stroke
export default memo(InputMetadata)
