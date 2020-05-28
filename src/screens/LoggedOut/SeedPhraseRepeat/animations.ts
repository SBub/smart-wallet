import { useRef } from 'react'
import Animated, {
  event,
  multiply,
  set,
  block,
  abs,
  add,
  cond,
  eq,
  useCode,
  call,
  Clock,
  log,
  clockRunning,
  startClock,
  spring,
  debug,
  divide,
  diff,
  and,
  lessThan,
  stopClock,
  greaterThan,
} from 'react-native-reanimated'
import { State } from 'react-native-gesture-handler'

export const runSpring = (
  clock: Animated.Node<number>,
  value: Animated.Node<number>,
  velocity: Animated.Node<number>,
  dest: Animated.Node<number>,
) => {
  const state = {
    finished: new Animated.Value(0),
    velocity: new Animated.Value(0),
    position: new Animated.Value(0),
    time: new Animated.Value(0),
  }

  const config = {
    damping: 7,
    mass: 1,
    stiffness: 121.6,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new Animated.Value(0),
  }

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, velocity),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]
}

export const animateInteraction = (
  gestureTranslation: Animated.Node<number>,
  gestureState: Animated.Node<number>,
) => {
  const start = useRef(new Animated.Value(0)).current
  const dragging = useRef(new Animated.Value(0)).current
  const position = useRef(new Animated.Value(0)).current
  const velocity = useRef(new Animated.Value(0)).current

  const clock = useRef(new Clock()).current

  return cond(
    eq(gestureState, State.ACTIVE),
    [
      cond(eq(dragging, 0), [set(dragging, 1), set(start, position)]),
      set(position, add(start, gestureTranslation)),
    ],
    //[set(dragging, 0), set(position, runSpring(clock, position, velocity, 0))],
  )
}
