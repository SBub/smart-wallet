import React from 'react'
import { View, StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler'

import { Colors } from '~/utils/colors'
import Paragraph from '~/components/Paragraph'
import { WordState, WordPosition } from './types'
import { useDragAndDrop, useLayoutPosition } from './dragDropHooks'

interface Props {
  id: number
  onLayout: (position: WordPosition, word: number) => void
  phraseState: WordState[]
  onDrop: (next: number, prev: number) => void
  isLastDropped: boolean
}

const PhraseDraggable: React.FC<Props> = ({
  id,
  onLayout,
  phraseState,
  onDrop,
  isLastDropped,
}) => {
  const word = phraseState.find((w) => w.id === id)

  const { dimensionsReady, viewRef } = useLayoutPosition(id, onLayout)
  const {
    handleDragStart,
    translateX,
    translateY,
    handleGesture,
    isHighlighted,
  } = useDragAndDrop(id, phraseState, dimensionsReady.current, onDrop)

  return (
    <View
      style={{
        zIndex: isHighlighted ? 1 : 0,
      }}
      ref={viewRef}
      onTouchStart={handleDragStart}
    >
      {isHighlighted ? (
        <View style={styles.placeholderWrapper}>
          <View style={styles.placeholder} />
        </View>
      ) : (
        <View />
      )}
      <PanGestureHandler
        maxPointers={1}
        onGestureEvent={handleGesture}
        onHandlerStateChange={handleGesture}
      >
        <Animated.View
          style={[
            styles.card,
            {
              borderColor:
                isHighlighted || isLastDropped
                  ? Colors.activity
                  : 'transparent',
            },
            { transform: [{ translateX }, { translateY }] },
          ]}
        >
          <Paragraph>{word?.text}</Paragraph>
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}

const styles = StyleSheet.create({
  placeholderWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: 7.7,
  },
  placeholder: {
    flex: 1,
    width: '100%',
    borderRadius: 17,
    borderColor: Colors.dragBlack,
    borderWidth: 1,
  },
  card: {
    backgroundColor: Colors.dragBlack,
    height: 54,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
    paddingHorizontal: 20,
    elevation: 10,
    borderWidth: 1.7,
  },
})

export default PhraseDraggable
