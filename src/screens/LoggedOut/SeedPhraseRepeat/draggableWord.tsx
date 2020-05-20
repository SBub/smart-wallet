import React, { useRef, useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import Animated, {
  event,
  cond,
  eq,
  useCode,
  call,
} from 'react-native-reanimated'
import { PanGestureHandler, State } from 'react-native-gesture-handler'

import { Colors } from '~/utils/colors'
import Paragraph from '~/components/Paragraph'
import { WordState, WordPosition } from './'
import { animateInteraction } from './animations'

const PhraseDraggable: React.FC<{
  word: string
  onLayout: (position: WordPosition, word: string) => void
  phraseState: WordState[]
}> = ({ word, onLayout }) => {
  const xDrag = useRef(new Animated.Value(0)).current
  const yDrag = useRef(new Animated.Value(0)).current
  const vDrag = useRef(new Animated.Value(0)).current
  const gestureState = useRef(new Animated.Value(-1)).current
  const [position, setPosition] = useState<WordPosition>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  })

  const [isSelected, setSelected] = useState(false)

  // NOTE set active to increase the elevation of the card, since it renders below the others during a gesture
  useCode(
    () =>
      cond(
        eq(gestureState, State.ACTIVE),
        call([new Animated.Value(true)], (sel: readonly boolean[]) => {
          setSelected(sel[0])
        }),
        call([new Animated.Value(false)], (sel: readonly boolean[]) => {
          setSelected(sel[0])
        }),
      ),

    [gestureState],
  )

  const onGesture = event([
    {
      nativeEvent: {
        translationX: xDrag,
        translationY: yDrag,
        velocityY: vDrag,
        state: gestureState,
      },
    },
  ])

  useCode(
    () =>
      call([xDrag], ([x]) => {
        //console.log(x)
      }),
    [xDrag],
  )

  const translateX = animateInteraction(xDrag, gestureState)
  const translateY = animateInteraction(yDrag, gestureState)

  const handleLayout = (e: LayoutChangeEvent) => {
    const position = e.nativeEvent.layout
    setPosition(position)
    onLayout(position, word)
  }

  return (
    <View>
      {isSelected ? (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            padding: 7.7,
          }}
        >
          <View
            style={{
              flex: 1,
              width: '100%',
              borderRadius: 17,
              borderColor: Colors.dragBlack,
              borderWidth: 1,
            }}
          />
        </View>
      ) : (
        <View />
      )}
      <PanGestureHandler
        maxPointers={1}
        onGestureEvent={onGesture}
        onHandlerStateChange={onGesture}
      >
        <Animated.View
          onLayout={handleLayout}
          style={[
            {
              backgroundColor: Colors.dragBlack,
              height: 54,
              borderRadius: 17,
              alignItems: 'center',
              justifyContent: 'center',
              margin: 6,
              paddingHorizontal: 20,
              elevation: isSelected ? 11 : 10,
              borderColor: isSelected ? Colors.activity : 'transparent',
              borderWidth: 1.7,
            },
            { transform: [{ translateX }, { translateY }] },
          ]}
        >
          <Paragraph>{word}</Paragraph>
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}

export default PhraseDraggable
