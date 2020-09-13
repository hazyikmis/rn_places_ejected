//IMPORTANT!
/*
The steps defined under "Configuration" section might be required in the MapView Expo API Reference
(https://docs.expo.io/versions/v38.0.0/sdk/map-view/)
*/

import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapScreen = (props) => {
  const initialLocation = props.route?.params?.initialLocation;
  const readOnly = props.route?.params?.readOnly;

  // const [selectedLocation, setSelectedLocation] = useState();
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  //helps us to focus on that area!
  const mapRegion = {
    latitude: initialLocation ? initialLocation.lat : 37.78,
    longitude: initialLocation ? initialLocation.lng : -122.43,
    //zoom factors, how much space you can see around the center point above
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const selectLocationHandler = (event) => {
    //console.log(event);
    if (readOnly) {
      return; //if readOnly, (opened from PlaceDetailsScree.js) do not continue, do not pick a location!!!
    }
    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude,
    });
  };

  const savePickedLocationHandler = useCallback(() => {
    //console.log('savePickedLocationHandler called!');
    //props.navigation.goBack();
    if (!selectedLocation) {
      //could show an alert!
      //if no location picked then app stays still on the MapScreen
      return;
    }
    props.navigation.navigate('NewPlace', { pickedLocation: selectedLocation });
  }, [selectedLocation]);

  useEffect(() => {
    props.navigation.setParams({ saveLocation: savePickedLocationHandler });
  }, [savePickedLocationHandler]);

  let markerCoordinates;

  if (selectedLocation) {
    markerCoordinates = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    };
  }

  return (
    <MapView
      style={styles.map}
      region={mapRegion}
      onPress={selectLocationHandler}
    >
      {markerCoordinates ? (
        <Marker title="Picked Location" coordinate={markerCoordinates} />
      ) : null}
    </MapView>
  );
};

const styles = StyleSheet.create({
  //"style" is important! If there is no styling on MapView, you can not see the map!
  map: {
    //flexDirection: 'row',
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

export default MapScreen;

/*
  return (
    <MapView
      style={styles.map}
      region={mapRegion}
      onPress={selectLocationHandler}
    />
  );
*/

// Here is the result of clicking/pressing on the map: "event" object
/*
SyntheticEvent {
  "_dispatchInstances": FiberNode {
    "tag": 5,
    "key": null,
    "type": "AIRMap",
  },
  "_dispatchListeners": [Function selectLocationHandler],
  "_targetInst": FiberNode {
    "tag": 5,
    "key": null,
    "type": "AIRMap",
  },
  "bubbles": undefined,
  "cancelable": undefined,
  "currentTarget": 395,
  "defaultPrevented": undefined,
  "dispatchConfig": Object {
    "registrationName": "onPress",
  },
  "eventPhase": undefined,
  "isDefaultPrevented": [Function functionThatReturnsFalse],
  "isPropagationStopped": [Function functionThatReturnsFalse],
  "isTrusted": undefined,
  "nativeEvent": Object {
    "action": "press",
    "coordinate": Object {
      "latitude": 37.7780428496713,
      "longitude": -122.42600496858357,
    },
    "position": Object {
      "x": 604,
      "y": 974,
    },
  },
  "target": undefined,
  "timeStamp": 1599812790384,
  "type": undefined,
}
*/
