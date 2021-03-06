import { createStore, combineReducers, compose } from 'redux'
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase'
import { reduxFirestore, firestoreReducer } from 'redux-firestore'
import { devToolsEnhancer } from 'redux-devtools-extension'

//* Instead of "import firebase from 'firebase'"...only import what you need
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
// import 'firebase/database'
// import 'firebase/storage'

//? import custom REDUCERS
import settingsReducer from './reducers/settingsReducer'

//* Init Firebase App instance
firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'client-panel-redux-nds.firebaseapp.com',
  databaseURL: 'https://client-panel-redux-nds.firebaseio.com',
  projectId: 'client-panel-redux-nds',
  // storageBucket: 'client-panel-redux-nds.appspot.com',
  // messagingSenderId: '737345577599',
})

//* Init Firestore
firebase.firestore().settings({ timestampsInSnapshots: true })

//? react-redux-firebase config
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
}

//* Add reactReduxFirebase and reduxFirestore enhancers when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig),
  reduxFirestore(firebase),
)(createStore)

//? Combine all reducers
const reducers = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  settings: settingsReducer,
})

//? Check for settings in LocalStorage
if (localStorage.getItem('settings') === null) {
  const defaultSettings = {
    allowRegistration: false,
    disableBalanceOnAdd: true,
    disableBalanceOnEdit: false,
  }
  localStorage.setItem('settings', JSON.stringify(defaultSettings))
}

//? Create initial state
const initialState = { settings: JSON.parse(localStorage.getItem('settings')) }

//* Create store
const store = createStoreWithFirebase(
  reducers,
  initialState,
  devToolsEnhancer(),
)

export default store
