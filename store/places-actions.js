import * as FileSystem from 'expo-file-system';
import * as db from '../helpers/db';

import ENV from '../env';

//import {insertPlace} from '../helpers/db';
//insertPlace();

export const placesActionTypes = {
  ADD_PLACE: 'ADD_PLACE',
  DELETE_PLACE: 'DELETE_PLACE',
  FETCH_PLACES: 'FETCH_PLACES',
};

//export const addPlace = (title, image) => {
export const addPlace = (title, image, location) => {
  return async (dispatch) => {
    //reverse geocoding - start
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${ENV.googleApiKey}`
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    const resData = await response.json();
    //console.log(resData);  //huge object!
    if (!resData.results) {
      throw new Error('Something went wrong!');
    }

    const address = resData.results[0].formatted_address;
    //reverse geocoding - finish

    const fileName = image.split('/').pop(); //splits all folder names and pops out the last part which is a file name.
    const newPath = FileSystem.documentDirectory + fileName;

    try {
      //move image to persistent file store area
      await FileSystem.moveAsync({
        from: image, //this is the full path of the image including filename
        to: newPath,
      });

      //insert whole place data (including the images new path) into SQLite database
      const dbResult = await db.insertPlace(
        title,
        newPath,
        address,
        location.lat,
        location.lng
      );
      //console.log(dbResult);

      //in the dispatched action below, we are going to change the temp location of the image file and store place data into SQLite db by executing the code above
      //this is the reason why we have put the code above (why not in reducer? because of this, it must be done before dispatching action!)
      dispatch({
        type: placesActionTypes.ADD_PLACE,
        //placeData: { title: title, imageUri: image },
        //placeData: { title: title, imageUri: newPath },
        placeData: {
          id: dbResult.insertId,
          title: title,
          imageUri: newPath,
          address: address,
          coords: { lat: location.lat, lng: location.lng },
        }, //after inserting SQLite db, we can send id
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

/*
export const addPlace = (title, image) => {
  return {
    type: placesActionTypes.ADD_PLACE,
    placeData: { title: title, imageUri: image },
  };
};
*/

export const loadPlaces = () => {
  return async (dispatch) => {
    try {
      const dbResult = await db.fetchPlaces();
      //console.log(dbResult);

      dispatch({
        type: placesActionTypes.FETCH_PLACES,
        places: dbResult.rows._array,
      });
    } catch (err) {
      throw err;
    }
  };
};

//example of (console.log) dbResult in addPlace (its an insert statement)
/*
WebSQLResultSet {
  "insertId": 1,
  "rows": WebSQLRows {
    "_array": Array [],
    "length": 0,
  },
  "rowsAffected": 1,
}
*/

//example of (console.log) dbResult in loadPlaces (its a select statement)
/*
WebSQLResultSet {
  "insertId": undefined,
  "rows": WebSQLRows {
    "_array": Array [
      Object {
        "address": "Dummy Address",
        "id": 1,
        "imageUri": "file:///data/user/0/host.exp.exponent/files/ExperienceData/%2540anonymous%252Frn_places-5c008cda-754b-4632-9d4b-c3c783932863/f182c5ad-468b-4ba4-862d-26bb14c65b4b.jpg",
        "lat": 15.6,
        "lng": 12.3,
        "title": "A Test image 1",
      },
    ],
    "length": 1,
  },
  "rowsAffected": 0,
}
*/
