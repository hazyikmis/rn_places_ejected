import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import Colors from '../constants/Colors';
import MapPreview from './MapPreview';

const LocationPicker = (props) => {
  const { onLocationPicked } = props;
  const [pickedLocation, setPickedLocation] = useState();
  const [isFetching, setIsFetching] = useState(false);

  //console.log(props);
  //IMPORTANT!: IN ORDER TO ACCESS "route" YOU NEED TO PASS IT FROM A SCREEN (TOP LEVEL COMPONENT ON THE NAVIGATOR) TO THIS COMPONENT
  //THIS IS SAME FOR THE "navigation"
  //PLEASE CHECK THE NewPlaceScreen.js: <LocationPicker navigation={props.navigation} route={props.route} />
  //const mapPickedLocation = props.route.params['pickedLocation'];
  const mapPickedLocation = props.route?.params?.pickedLocation;

  useEffect(() => {
    if (mapPickedLocation) {
      setPickedLocation(mapPickedLocation);
      //props.onLocationPicked(mapPickedLocation);
      onLocationPicked(mapPickedLocation);
    }
  }, [mapPickedLocation, onLocationPicked]);

  //this check required for iOS devices, because for iOS, "Expo" app asks permission when you call "askAsync"
  //So, you have to uninstall Expo first from your simulator, and then you have install again to clear permissions
  const verifyPermissions = async () => {
    //if user granted access to camera before in the history, this askAsync call returns "status: granted"
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if (result.status !== 'granted') {
      Alert.alert(
        'Insufficient permissions!',
        'You need to grant location permission to use this app.',
        [{ text: 'Okay' }]
      );
      return false;
    }
    return true;
  };

  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    try {
      setIsFetching(true);
      const location = await Location.getCurrentPositionAsync({
        timeout: 5000,
        accuracy: Location.Accuracy.High, //if accuracy did not set to "High", it does not work in android emulator
      });
      //console.log(location);
      setPickedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });

      //props.onLocationPicked(pickedLocation); //might not be set yet!
      //props.onLocationPicked({
      onLocationPicked({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (err) {
      console.log(err);
      Alert.alert(
        'Could not fetch location!',
        'Please try again later or pick a location on the map.',
        [{ text: 'Okay' }]
      );
    }
    setIsFetching(false);
  };

  //this event handler called in 2 ways:
  //1.pressing the "Pick on Map" button
  //2.clicking the MapPreview component
  const pickOnMapHandler = () => {
    //the navigation prop is only available on components which are directly loaded as screens which the location picker of course isn't.
    //because of that we are sending "navigation" as props from NewPlaceScreen to here!

    //IMPORTANT!: IN ORDER TO ACCESS "route" YOU NEED TO PASS IT FROM A SCREEN (TOP LEVEL COMPONENT ON THE NAVIGATOR) TO THIS COMPONENT
    //THIS IS SAME FOR THE "navigation"
    //PLEASE CHECK THE NewPlaceScreen.js: <LocationPicker navigation={props.navigation} route={props.route} />
    props.navigation.navigate('Map');
  };

  return (
    <View style={styles.locationPicker}>
      <MapPreview
        style={styles.mapPreview}
        location={pickedLocation}
        onPressOnTheMap={pickOnMapHandler}
      >
        {isFetching ? (
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        ) : (
          <Text>No location chosen yet!</Text>
        )}
      </MapPreview>
      <View style={styles.actions}>
        <Button
          title="Get User Location"
          color={Colors.primaryColor}
          onPress={getLocationHandler}
        />
        <Button
          title="Pick on Map"
          color={Colors.primaryColor}
          onPress={pickOnMapHandler}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  locationPicker: {
    marginBottom: 15,
  },
  mapPreview: {
    marginBottom: 10,
    width: '100%',
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default LocationPicker;

//location object returning from Location.getCurrentPositionAsync call
/*
Object {
  "coords": Object {
    "accuracy": 5,
    "altitude": 0,
    "heading": 0,
    "latitude": 36.5896383,
    "longitude": -121.898605,
    "speed": 0,
  },
  "mocked": false,
  "timestamp": 1599729077571,
}
*/
