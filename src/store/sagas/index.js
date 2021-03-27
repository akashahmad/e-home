import authSagas from './Auth';

import { all } from 'redux-saga/effects';

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
  ]);
}
