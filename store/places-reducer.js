import * as placesAction from './places-actions';
import Place from '../models/place';

const initialState = {
  places: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case placesAction.placesActionTypes.ADD_PLACE:
      const newPlace = new Place(
        //new Date().toString(), //previously used as Id
        action.placeData.id.toString(), //after using SQLite DB as a persistent storage
        action.placeData.title,
        action.placeData.imageUri,
        action.placeData.address,
        action.placeData.coords.lat,
        action.placeData.coords.lng
      );
      return {
        places: state.places.concat(newPlace),
      };
    case placesAction.placesActionTypes.FETCH_PLACES:
      //return { places: action.places };
      return {
        places: action.places.map(
          //only care about id, title and imageUri; and we need to convert id to string
          //this is the reason we are mapping
          //(pl) => new Place(pl.id.toString(), pl.title, pl.imageUri)
          (pl) =>
            new Place(
              pl.id.toString(),
              pl.title,
              pl.imageUri,
              pl.address,
              pl.lat,
              pl.lng
            )
        ),
      };
    default:
      return state;
  }
};
