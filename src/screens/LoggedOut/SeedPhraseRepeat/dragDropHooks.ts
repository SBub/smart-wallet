import { useRef, useState, useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  event,
  cond,
  eq,
  useCode,
  call,
  set,
  greaterThan,
  and,
  abs,
  or,
  neq,
} from 'react-native-reanimated'
import { State } from 'react-native-gesture-handler'

import { WordState, WordPosition } from './types'
import { gestureFollow } from './animations'

export const useLayoutPosition = (
  id: number,
  onLayoutCb: (position: WordPosition, word: number) => void,
) => {
  const [positionReady, setPositionReady] = useState(false)
  const dimensionsReady = useRef<Animated.Node<number>>(new Animated.Value(0))
  const viewRef = useRef<View | null>(null)

  // NOTE: setting position/dimensions when the phrase order has changed
  useEffect(() => {
    if (positionReady) {
      viewRef.current?.measure((x, y, width, height, pageX, pageY) => {
        const p = { x: pageX, y: pageY, width, height }
        onLayoutCb(p, id)
      })
    }
  }, [id])

  // NOTE: setting initial position/dimensions
  useEffect(() => {
    viewRef.current?.measure((x, y, width, height, pageX, pageY) => {
      if (!positionReady && height !== 0) {
        setPositionReady(true)
        dimensionsReady.current = new Animated.Value(1)
        onLayoutCb({ x: pageX, y: pageY, width, height }, id)
      }
    })
  }, [viewRef.current])

  return { dimensionsReady, viewRef }
}

export const useDragAndDrop = (
  id: number,
  phrase: WordState[],
  dimensionsReady: Animated.Node<number>,
  onDrop: (id1: number, id2: number) => void,
) => {
  const [isHighlighted, setHighlighted] = useState(false)

  const gestureState = useRef(new Animated.Value(-1)).current
  //NOTE used for the drag gesture
  const xDrag = useRef(new Animated.Value(0)).current
  const yDrag = useRef(new Animated.Value(0)).current
  //NOTE used for assessing if the drop was above another word
  const xAbs = useRef(new Animated.Value(0)).current
  const yAbs = useRef(new Animated.Value(0)).current

  // NOTE: using View's @onTouchStart for enabling the highlight (because of fast feedback,
  // since using the gestureState has a longer delay). @gestureState is used for disabling the
  // feedback due to the View's touch event being cancelled (possibly by the @gesture-handler).
  useCode(
    () =>
      cond(
        neq(gestureState, State.ACTIVE),
        call([], () => {
          setHighlighted(false)
        }),
      ),

    [gestureState],
  )

  const handleGesture = event([
    {
      nativeEvent: {
        translationX: xDrag,
        translationY: yDrag,
        state: gestureState,
        absoluteX: xAbs,
        absoluteY: yAbs,
      },
    },
  ])

  // NOTE: finds whether the gesture coordinates fall within the position of a word
  const isIntersection = (x: number, y: number, position: WordPosition) => {
    const isRange = (val: number, min: number, max: number) =>
      val >= min && val <= max
    return (
      isRange(x, position.x, position.x + position.width) &&
      isRange(y, position.y, position.y + position.height)
    )
  }

  // NOTE: distance from original position required to register a drop
  const DROP_THRESHOLD = 5
  const isDragThreshold = or(
    greaterThan(abs(xDrag), DROP_THRESHOLD),
    greaterThan(abs(yDrag), DROP_THRESHOLD),
  )

  // NOTE: while all the words were assigned with coordinates and a gesture is active,
  // loop through the phrase to find which word to replace.
  useCode(() => {
    return cond(eq(dimensionsReady, 1), [
      cond(and(eq(gestureState, State.END), isDragThreshold), [
        set(gestureState, 0),
        call([xAbs, yAbs], ([x, y]) => {
          const replaceWord = phrase.find((w) =>
            isIntersection(x, y, w.position),
          )
          if (replaceWord) {
            onDrop(id, replaceWord.id)
          }
        }),
      ]),
    ])
  }, [gestureState, dimensionsReady, id])

  // NOTE allows the view to follow the gesture coordinates
  const translateX = gestureFollow(xDrag, gestureState)
  const translateY = gestureFollow(yDrag, gestureState)

  const handleDragStart = () => setHighlighted(true)

  return {
    handleDragStart,
    translateX,
    translateY,
    handleGesture,
    isHighlighted,
  }
}
