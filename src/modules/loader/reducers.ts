import {LoaderMsgs} from '~/translations/strings';

import {LoaderActions, LoaderTypes, LoaderStateI} from '~/types/loader';

type Actions = {
  type: LoaderActions;
  payload?: any;
};

const initialState: LoaderStateI = {
  type: LoaderTypes.default,
  msg: LoaderMsgs.EMPTY,
};

const reducer = (state = initialState, action: Actions) => {
  switch (action.type) {
    case LoaderActions.set:
      return action.payload;
    case LoaderActions.dismiss:
      return initialState;
    default:
      return state;
  }
};

export default reducer;