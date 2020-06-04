import { useRef } from 'react'
import Animated, { set, add, cond, eq } from 'react-native-reanimated'
import { State } from 'react-native-gesture-handler'

export const gestureFollow = (
  gestureTranslation: Animated.Node<number>,
  gestureState: Animated.Node<number>,
) => {
  const start = useRef(new Animated.Value(0)).current
  const dragging = useRef(new Animated.Value(0)).current
  const position = useRef(new Animated.Value(0)).current

  return cond(eq(gestureState, State.ACTIVE), [
    cond(eq(dragging, 0), [set(dragging, 1), set(start, position)]),
    set(position, add(start, gestureTranslation)),
  ])
}
