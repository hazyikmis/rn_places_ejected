import React from 'react';
import { Platform, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import CustomHeaderButton from '../components/CustomHeaderButton';

import PlacesListScreen from '../screens/PlacesListScreen';
import PlaceDetailsScreen from '../screens/PlaceDetailsScreen';
import NewPlaceScreen from '../screens/NewPlaceScreen';
import MapScreen from '../screens/MapScreen';

const defaultStackNavScreenOptions = {
  headerStyle: {
    //height: 80,
    backgroundColor: Platform.OS === 'android' ? Colors.primaryColor : '',
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primaryColor,
  //headerTransparent: true,
  // headerTitleStyle: {
  //   fontFamily: 'open-sans-bold',
  // },
  // headerBackTitleStyle: {
  //   fontFamily: 'open-sans', //no effect on android (no "back" text, just icon)
  // },
};

const placesListScreenOptions = ({ navigation, route }) => ({
  headerTitle: 'All Places',
  //headerLeft: () => drawerMenu(navigation),
  headerRight: () => (
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item
        title="Add New Place"
        iconName={Platform.OS === 'android' ? 'md-add' : 'ios-add'}
        onPress={() => navigation.navigate('NewPlace')}
      />
    </HeaderButtons>
  ),
});

const mapScreenOptions = ({ navigation, route }) => ({
  //headerTitle: 'Pick a location',
  //headerTitle: route.params?.readOnly ? '...' : 'Pick a location',
  headerTitle: route.params?.readOnly
    ? route.params?.initialAddress
    : 'Pick a location',

  //headerLeft: () => drawerMenu(navigation),
  /*
  headerRight: () => (
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item
        title="Save"
        iconName={Platform.OS === 'android' ? 'md-save' : 'ios-save'}
        onPress={() => navigation.navigate('...')}
      />
    </HeaderButtons>
  ),
  */
  headerRight: () =>
    route.params?.readOnly ? null : (
      <TouchableOpacity
        style={styles.headerSaveButton}
        onPress={() => route.params['saveLocation']()}
      >
        <Text style={styles.headerSaveButtonText}>Save</Text>
      </TouchableOpacity>
    ),
  //WHY THE CODE BELOW DOES NOT WORK WHILE THE ABOVE WORKS ???
  // headerRight: () => {
  //   console.log(route);  //params: undefined!!!
  //   const saveFn = route.params['saveLocation'];
  //   return (
  //     <TouchableOpacity style={styles.headerSaveButton} onPress={saveFn}>
  //       <Text style={styles.headerSaveButtonText}>Save</Text>
  //     </TouchableOpacity>
  //   );
  // },
});

const StackPlaces = createStackNavigator();

const PlacesNavigator = () => {
  return (
    <StackPlaces.Navigator screenOptions={defaultStackNavScreenOptions}>
      <StackPlaces.Screen
        name="PlacesList"
        component={PlacesListScreen}
        //options={{ headerTitle: 'All Places' }}
        options={placesListScreenOptions}
      />
      <StackPlaces.Screen
        name="PlaceDetails"
        component={PlaceDetailsScreen}
        options={({ route }) => ({ headerTitle: route.params.place.title })}
      />
      <StackPlaces.Screen
        name="NewPlace"
        component={NewPlaceScreen}
        options={{ headerTitle: 'New Place' }}
      />
      <StackPlaces.Screen
        name="Map"
        component={MapScreen}
        options={mapScreenOptions}
      />
    </StackPlaces.Navigator>
  );
};

const styles = StyleSheet.create({
  headerSaveButton: {
    marginHorizontal: 20,
  },
  headerSaveButtonText: {
    fontSize: 16,
    color: Platform.OS === 'android' ? 'white' : Colors.primaryColor,
  },
});

export default PlacesNavigator;
