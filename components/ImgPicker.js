import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert } from 'react-native';
import Colors from '../constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const ImgPicker = (props) => {
  //const {} = props;
  const [pickedImage, setPickedImage] = useState(null);

  //this check required for iOS devices, because for iOS, "Expo" app asks permission when you call "askAsync"
  //So, you have to uninstall Expo first from your simulator, and then you have install again to clear permissions
  const verifyPermissions = async () => {
    //if user granted access to camera before in the history, this askAsync call returns "status: granted"
    const result = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL
    );
    if (result.status !== 'granted') {
      Alert.alert(
        'Insufficient permissions!',
        'You need to grant camera permission to use this app.',
        [{ text: 'Okay' }]
      );
      return false;
    }
    return true;
  };

  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true, //allows us to directly enter edit mode after taking picture!
      aspect: [16, 9],
      quality: 0.5,
    });
    //ACTUALLY the returned image is saved in a temporary folder.
    //We need to store it more professionally by using expo-file-system.
    //And if user do nat want to save the place, it should not be saved, must remain in the temporary folder.
    //console.log(image);

    if (!image?.cancelled) {
      setPickedImage(image);
    }
    props.onImageTaken(image.uri);
  };

  return (
    <View style={styles.imagePicker}>
      <View style={styles.imagePreview}>
        {!pickedImage ? (
          <Text>No image picked yet!</Text>
        ) : (
          <Image style={styles.image} source={{ uri: pickedImage.uri }} />
        )}
      </View>
      <Button
        title="Take Image"
        color={Colors.primaryColor}
        onPress={takeImageHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImgPicker;
