//This screen called from 2 different places:
//1.From MapScreen with params (in order to go back): props.navigation.navigate('NewPlace', { pickedLocation: selectedLocation });
//2.From PlacesNavigator without params: onPress={() => navigation.navigate('NewPlace')}  //actually this is the + button on right top of PlacesListScreen.
import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';
import Colors from '../constants/Colors';

import * as placesActions from '../store/places-actions';
import { useDispatch } from 'react-redux';
import ImgPicker from '../components/ImgPicker';
import LocationPicker from '../components/LocationPicker';

const NewPlaceScreen = (props) => {
  const [titleValue, setTitleValue] = useState('');
  const [selectedImage, setSelectedImage] = useState();
  const [selectedLocation, setSelectedLocation] = useState();

  const dispatch = useDispatch();

  const titleChangeHandler = (text) => {
    //might be some validation
    setTitleValue(text);
  };

  const savePlaceHandler = () => {
    dispatch(
      placesActions.addPlace(titleValue, selectedImage, selectedLocation)
    );
    props.navigation.goBack();
  };

  const imageTakenHandler = (imagePath) => {
    setSelectedImage(imagePath);
  };

  // const locationPickedHandler = (location) => {
  //   console.log(location);
  // };

  const locationPickedHandler = useCallback((location) => {
    //console.log(location);
    setSelectedLocation(location);
  }, []);
  //}, [setSelectedLocation]);

  return (
    <ScrollView>
      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={titleChangeHandler}
          value={titleValue}
        />
        <ImgPicker onImageTaken={imageTakenHandler} />
        <LocationPicker
          navigation={props.navigation}
          route={props.route}
          onLocationPicked={locationPickedHandler}
        />
        <Button
          title="Save Place"
          color={Colors.primaryColor}
          onPress={savePlaceHandler}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  form: {
    //flexDirection: 'row',
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    margin: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 15,
  },
  textInput: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
});

export default NewPlaceScreen;
