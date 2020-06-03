import { StackNavigationOptions } from '@react-navigation/stack'
import { Fonts } from './fonts'

export const modalScreenOptions: StackNavigationOptions = {
  cardStyle: { backgroundColor: 'transparent' },
  cardOverlayEnabled: true,
  cardStyleInterpolator: ({ current: { progress } }) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.25, 0.7, 1],
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.9],
        extrapolate: 'clamp',
      }),
    },
    transparentCard: true,
  }),
}