import React from 'react'
import Svg, { Defs, G, Path } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: filter */

const SvgHandIcon = (props) => (
  <Svg width={'100%'} height="101" viewBox="0 0 94 101" {...props}>
    <Defs></Defs>
    <G
      filter="url(#HandIcon_svg__a)"
      transform="translate(4 1.5)"
      fill="#FFEFDF"
      fillRule="nonzero"
    >
      <Path d="M86.144 69.365c-1.803-4.854-2.208-8.4-2.602-11.827-.531-4.621-1.079-9.402-5.003-16.748L67.786 20.66c-1.732-3.24-6.038-4.491-9.04-2.617-1.005.627-1.842 1.568-2.417 2.692-1.114-1.732-2.738-2.97-4.644-3.522-2.134-.619-4.362-.298-6.276.892-1.82 1.136-3.09 2.91-3.706 4.911-2.587-2.31-6.34-2.774-9.412-.854-1.788 1.115-3.101 2.873-3.73 4.982L14.324 5.506C10.136-.664 6.016.592 3.93 1.895 2.01 3.093.742 5 .36 7.269c-.353 2.086.062 4.375 1.194 6.488l22.892 40.197c.478.84 1.497 1.103 2.275.586.779-.519 1.022-1.618.542-2.458L4.393 11.927c-.713-1.338-.99-2.763-.779-4.018.209-1.235.89-2.243 1.97-2.917.745-.465 3.008-1.881 6.058 2.608L29.35 34.516c.511.776 1.497.983 2.243.469.743-.517.98-1.574.538-2.4a5.709 5.709 0 0 1-.496-4.07c.342-1.384 1.164-2.541 2.31-3.256 2.371-1.477 5.415-.6 6.782 1.963l1.647 3.086a.036.036 0 0 1 .007.01c.457.857 1.47 1.147 2.26.655.79-.493 1.062-1.586.605-2.442-1.368-2.562-.554-5.848 1.817-7.327a4.612 4.612 0 0 1 3.765-.536c1.282.372 2.35 1.258 3.012 2.5l2.477 4.633.005.011c.458.855 1.469 1.146 2.261.654.791-.493 1.062-1.586.606-2.442-.419-.781-.523-1.77-.285-2.71.238-.937.783-1.73 1.496-2.175 1.449-.904 3.687-.254 4.52 1.309l10.754 20.13c3.59 6.717 4.073 10.936 4.584 15.4.38 3.311.771 6.724 2.301 11.267l-32.004 19.97C44.98 82.727 36.459 75.92 25.2 68.963a199.17 199.17 0 0 0-3.612-2.18c-3.04-1.791-5.188-5.353-5.226-8.658-.016-1.502.42-3.578 2.597-4.935.793-.495 1.064-1.59.608-2.444-.459-.855-1.473-1.148-2.262-.654-2.779 1.736-4.29 4.603-4.25 8.075.05 4.611 2.844 9.335 6.95 11.757a192.98 192.98 0 0 1 3.552 2.142c11.573 7.152 20.128 14.083 25.425 20.6.323.397.78.608 1.242.608.283 0 .57-.079.828-.24L85.436 71.58c.713-.445 1.014-1.389.708-2.215z" />
    </G>
  </Svg>
)

export default SvgHandIcon
