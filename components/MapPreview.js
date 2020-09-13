import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';

//import { GOOGLE_API_KEY } from '@env';
import ENV from '../env';

const MapPreview = (props) => {
  let imagePreviewUrl;

  if (props.location) {
    const { lat, lng } = props.location;
    imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:A%7C${lat}, ${lng}&key=${ENV.googleApiKey}`;
    //console.log(imagePreviewUrl);
  }

  return (
    <TouchableOpacity
      onPress={props.onPressOnTheMap}
      style={{ ...styles.mapPreview, ...props.style }}
    >
      {
        //the check below could be done with imagePreviewUrl also
        props.location ? (
          <Image style={styles.mapImage} source={{ uri: imagePreviewUrl }} />
        ) : (
          props.children
        )
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mapPreview: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
});

export default MapPreview;
