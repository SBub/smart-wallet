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
} from 'react-native-reanimated'
import { State } from 'react-native-gesture-handler'

import { WordState, WordPosition } from './'
import { animateInteraction } from './animations'

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
      console.log(height)
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
  const xDrag = useRef(new Animated.Value(0)).current
  const yDrag = useRef(new Animated.Value(0)).current
  const xAbs = useRef(new Animated.Value(0)).current
  const yAbs = useRef(new Animated.Value(0)).current

  // NOTE set active to increase the elevation of the card, since it renders below the others during a gesture
  useCode(
    () =>
      cond(
        eq(gestureState, State.ACTIVE),
        call([new Animated.Value(true)], (sel: readonly boolean[]) => {
          setHighlighted(sel[0])
        }),
        call([new Animated.Value(false)], (sel: readonly boolean[]) => {
          setHighlighted(sel[0])
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

  const isIntersection = (x: number, y: number, position: WordPosition) => {
    const isRange = (val: number, min: number, max: number) =>
      val >= min && val <= max
    return (
      isRange(x, position.x, position.x + position.width) &&
      isRange(y, position.y, position.y + position.height)
    )
  }

  const DRAG_THRESHOLD = 5
  const isDragThreshold = or(
    greaterThan(abs(xDrag), DRAG_THRESHOLD),
    greaterThan(abs(yDrag), DRAG_THRESHOLD),
  )

  useCode(() => {
    return cond(eq(dimensionsReady, 1), [
      cond(and(eq(gestureState, State.END), isDragThreshold), [
        set(gestureState, 0),
        call([xAbs, yAbs, yDrag], ([x, y, d]) => {
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

  const translateX = animateInteraction(xDrag, gestureState)
  const translateY = animateInteraction(yDrag, gestureState)

  const handleDragStart = () => setHighlighted(true)

  return {
    handleDragStart,
    translateX,
    translateY,
    handleGesture,
    isHighlighted,
  }
}
