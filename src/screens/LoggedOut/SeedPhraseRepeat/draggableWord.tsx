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
  lessOrEq,
  greaterOrEq,
  and,
  block,
  add,
  neq,
  Clock,
  startClock,
  clockRunning,
  stopClock,
  diffClamp,
  diff,
  set,
} from 'react-native-reanimated'
import { PanGestureHandler, State } from 'react-native-gesture-handler'

import { Colors } from '~/utils/colors'
import Paragraph from '~/components/Paragraph'
import { WordState, WordPosition } from './'
import { animateInteraction } from './animations'
import { random } from 'sjcl'

interface Props {
  word: WordState
  onLayout: (position: WordPosition, word: number) => void
  phraseState: WordState[]
  onDrop: (next: number, prev: number) => void
}
const PhraseDraggable: React.FC<Props> = ({
  word,
  onLayout,
  phraseState,
  onDrop,
}) => {
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
  const dimensionsReady = useRef<Animated.Node<number>>(new Animated.Value(0))
  const lastHoverId = useRef(new Animated.Value(word.id)).current

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
        absoluteX: xAbs,
        absoluteY: yAbs,
      },
    },
  ])

  const inRange = (
    val: Animated.Node<number>,
    min: number,
    max: Animated.Node<number>,
  ) => and(greaterOrEq(val, min), lessOrEq(val, max))

  const clock = new Clock()
  const getOverlap = (w: WordState) =>
    block([
      cond(
        and(
          and(
            inRange(xAbs, w.position.x, add(w.position.x, w.position.width)),
            inRange(yAbs, w.position.y, add(w.position.y, w.position.height)),
          ),
          neq(w.id, word.id),
        ),
        [
          [
            cond(greaterOrEq(diff(clock), 50), [
              cond(neq(lastHoverId, w.id), [
                /* call([], () => {
                 *   console.log('OVERLAP')
                 * }), */
                /* cond(
                 *   eq(gestureState, State.END),
                 *   call([], () => {
                 *     console.log('DROPPED')
                 *   }),
                 * ), */
                call([gestureState], ([state]) => {
                  console.log(state)
                }),
                set(lastHoverId, w.id),
              ]),
              stopClock(clock),
            ]),
          ],
          [startClock(clock)],
        ],
        [cond(clockRunning(clock), stopClock(clock))],
      ),
    ])

  const isIntersection = (x: number, y: number, position: WordPosition) => {
    const isRange = (val: number, min: number, max: number) =>
      val >= min && val <= max
    return (
      isRange(x, position.x, position.x + position.width) &&
      isRange(y, position.y, position.y + position.height)
    )
  }

  useCode(() => {
    /* return cond(
     *   and(eq(dimensionsReady.current, 1), eq(gestureState, State.ACTIVE)),
     *   [phraseState.map(getOverlap)],
     * ) */
    return cond(eq(dimensionsReady.current, 1), [
      cond(eq(gestureState, State.END), [
        call([xAbs, yAbs], ([x, y]) => {
          const replaceWord = phraseState.find((w) =>
            isIntersection(x, y, w.position),
          )
          if (replaceWord) onDrop(word.id, replaceWord.id)
        }),
      ]),
    ])
  }, [gestureState, dimensionsReady.current])

  const translateX = animateInteraction(xDrag, gestureState)
  const translateY = animateInteraction(yDrag, gestureState)

  return (
    <View
      style={{
        zIndex: isSelected ? 4 : 0,
      }}
      ref={(ref) => {
        ref?.measure((x, y, width, height, pageX, pageY) => {
          if (
            !positionReady &&
            height !== 0 &&
            phraseState[0].position.height === 0
          ) {
            const p = { x: pageX, y: pageY, width, height }
            setPosition(p)
            setPositionReady(true)
            dimensionsReady.current = new Animated.Value(1)
            onLayout(p, word.id)
          }
        })
      }}
      // NOTE: @ref.measure() returns undefined without the @onLayout prop
      onLayout={() => {}}
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
              elevation: 10,
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

export default React.memo(PhraseDraggable)
