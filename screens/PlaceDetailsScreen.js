import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import MapPreview from '../components/MapPreview';
import Colors from '../constants/Colors';

const PlaceDetailsScreen = (props) => {
  //console.log(props);
  //const place = props.route?.params?.place;

  //we can easily access all info about place, because we have sended it as navigation/route param from PlacesListScreen.js
  //for example: <Text>{place.address}</Text> ... and... <Image source={{ uri: place.imageUri }} />
  //but we are gonna select all info from redux store again! joke? no...
  const placeId = props.route?.params?.place?.id;
  const selectedPlace = useSelector((state) =>
    state.places.places.find((place) => place.id === placeId)
  );

  const selectedLoc = { lat: selectedPlace.lat, lng: selectedPlace.lng };

  const showMapHandler = () => {
    //sending params to navigated screens (components) like below means "props.navigation.setParams({ paramName: paramValue })"
    props.navigation.navigate('Map', {
      readOnly: true,
      initialLocation: selectedLoc,
      initialAddress: selectedPlace.address,
    });
  };

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
      {/* <Image source={{ uri: place.imageUri }} /> */}
      <Image source={{ uri: selectedPlace.imageUri }} style={styles.image} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          {/* <Text>{place.address}</Text> */}
          <Text style={styles.address}>{selectedPlace.address}</Text>
        </View>
        <MapPreview
          location={selectedLoc}
          style={styles.mapPreview}
          onPressOnTheMap={showMapHandler}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    height: '35%',
    minHeight: 300,
    width: '100%',
    backgroundColor: '#ccc',
  },
  locationContainer: {
    marginVertical: 20,
    width: '90%',
    maxWidth: 350,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primaryColor,
    textAlign: 'center',
  },
  mapPreview: {
    width: '100%',
    maxWidth: 350,
    height: 300,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});
export default PlaceDetailsScreen;
