import React from 'react'
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Circle,
  G,
  Use,
  Path,
} from 'react-native-svg'

function FaceIdIcon() {
  return (
    <Svg width={83} height={83} viewBox="0 0 83 83">
      <Defs>
        <LinearGradient
          x1="87.632%"
          y1="34.618%"
          x2="31.544%"
          y2="50%"
          id="prefix__c"
        >
          <Stop stopColor="#D22D69" offset="0%" />
          <Stop stopColor="#911942" offset="100%" />
        </LinearGradient>
        <Circle id="prefix__b" cx={37.5} cy={37.5} r={37.5} />
      </Defs>
      <G fill="none" fillRule="evenodd">
        <G transform="translate(4 2)">
          <Use fill="#000" filter="url(#prefix__a)" xlinkHref="#prefix__b" />
          <Use fill="url(#prefix__c)" xlinkHref="#prefix__b" />
        </G>
        <G fill="#FFF" fillRule="nonzero">
          <Path d="M38.989 44.374h-1.267a.95.95 0 010-1.9h1.267c.873 0 1.584-.711 1.584-1.584v-6.336a.95.95 0 011.9 0v6.336a3.488 3.488 0 01-3.484 3.484zM40.573 51.027a6.123 6.123 0 01-5.254-3.002.951.951 0 011.638-.965 4.216 4.216 0 003.617 2.066 4.216 4.216 0 003.617-2.066.952.952 0 011.638.966 6.13 6.13 0 01-5.256 3.001zM55.462 36.579a.95.95 0 01-.95-.95v-6.144c0-.873-.71-1.584-1.584-1.584h-6.143a.95.95 0 010-1.901h6.143a3.489 3.489 0 013.485 3.485v6.143a.95.95 0 01-.95.95zM26.95 36.579a.95.95 0 01-.95-.95v-6.144A3.489 3.489 0 0129.485 26h6.143a.95.95 0 010 1.9h-6.143c-.873 0-1.584.712-1.584 1.585v6.143a.95.95 0 01-.95.95zM52.928 56.413h-6.143a.95.95 0 010-1.901h6.143c.873 0 1.584-.71 1.584-1.584v-6.143a.95.95 0 011.9 0v6.143a3.489 3.489 0 01-3.484 3.485zM35.628 56.413h-6.143A3.489 3.489 0 0126 52.928v-6.143a.95.95 0 011.9 0v6.143c0 .873.712 1.584 1.585 1.584h6.143a.95.95 0 010 1.9zM33.286 33.603a.95.95 0 00-.95.95v1.901a.95.95 0 001.9 0v-1.9a.95.95 0 00-.95-.95zM47.86 33.603a.95.95 0 00-.951.95v1.901a.95.95 0 001.9 0v-1.9a.95.95 0 00-.95-.95z" />
        </G>
      </G>
    </Svg>
  )
}

export default FaceIdIcon