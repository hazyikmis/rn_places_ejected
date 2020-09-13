import React from 'react';
import { StyleSheet } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import { NavigationContainer } from '@react-navigation/native';
import PlacesNavigator from './navigation/PlacesNavigator';

import placesReducer from './store/places-reducer';
import * as db from './helpers/db';

//import {init} from './helpers/db';
//init();

db.init()
  .then(() => {
    console.log('Database initialized.');
  })
  .catch((err) => {
    console.log('Initializing Database Error!');
    console.log(err);
  });

const rootReducer = combineReducers({
  places: placesReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <PlacesNavigator />
      </NavigationContainer>
    </Provider>
  );
}
