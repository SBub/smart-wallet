import React, {
  useRef,
  useState,
  ReactNode,
  MutableRefObject,
  useEffect,
} from 'react'
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
import { random } from 'sjcl'

const PhraseDraggable: React.FC<{
  word: WordState
  onLayout: (position: WordPosition, word: number) => void
  phraseState: WordState[]
}> = ({ word, onLayout, phraseState }) => {
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
  const xAbs = useRef(new Animated.Value(0)).current
  const yAbs = useRef(new Animated.Value(0)).current
  const [positionReady, setPositionReady] = useState(false)

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

  const xVal = useRef(new Animated.Value(0)).current
  const yVal = useRef(new Animated.Value(0)).current

  const onGesture = event([
    {
      nativeEvent: {
        translationX: xDrag,
        translationY: yDrag,
        velocityY: vDrag,
        state: gestureState,
        absoluteX: xAbs,
        absoluteY: yAbs,
        x: xVal,
        y: yVal,
      },
    },
  ])

  useCode(
    () =>
      call([xDrag, yDrag], ([x, y]) => {
        /* console.log('gesture', { x, y })
         * console.log('layout', { x: position.x, y: position.y })
         * console.log('dim', { height: position.height, width: position.width })
         * console.log('=====') */
      }),
    [xDrag, yDrag, position],
  )

  const valueInRange = (val: number, min: number, max: number) => {
    return val >= min && val <= max
  }

  useCode(
    () =>
      call([xAbs, yAbs], ([x, y]) => {
        phraseState.map((w) => {
          const xInside = valueInRange(
            x,
            w.position.x,
            w.position.x + w.position.width,
          )
          const yInside = valueInRange(
            y,
            w.position.y,
            w.position.y + w.position.height,
          )
          const isOverlap = xInside && yInside
          const sameWord = w.id === word.id
          if (isOverlap && !sameWord) {
            console.log('OVERLAP: ', w.word)
          }
        })
      }),
    [xAbs, yAbs],
  )

  const translateX = animateInteraction(xDrag, gestureState)
  const translateY = animateInteraction(yDrag, gestureState)
  /* const handleLayout = (e: LayoutChangeEvent) => {
   *   const position = e.nativeEvent.layout
   *   setPosition(position)
   *   onLayout(position, word.id)
   * } */
  const handleLayout = () => {}

  return (
    <View
      ref={(ref) => {
        ref?.measure((x, y, width, height, pageX, pageY) => {
          const p = { x: pageX, y: pageY, width, height }
          if (!positionReady) {
            onLayout(p, word.id)
            console.log(p)
            setPosition(p)
            setPositionReady(true)
          }
        })
      }}
      onLayout={handleLayout}
    >
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
          <Paragraph>{word.word}</Paragraph>
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}

export default PhraseDraggable
