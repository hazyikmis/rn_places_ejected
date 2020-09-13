import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import PlaceItem from '../components/PlaceItem';

import * as placesActions from '../store/places-actions';

const PlacesListScreen = (props) => {
  const places = useSelector((state) => state.places.places);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(placesActions.loadPlaces());
  }, [dispatch]);

  return (
    <FlatList
      data={places}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <PlaceItem
          place={itemData.item}
          //image={itemData.item.imageUri}
          onSelect={() => {
            props.navigation.navigate({
              name: 'PlaceDetails',
              params: {
                place: itemData.item,
              },
            });
          }}
        />
      )}
    />
  );
};

export default PlacesListScreen;
