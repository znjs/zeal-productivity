import { CONSTANTS } from "../utils";

const homeReducer = (homeState, action) => {
  switch (action.type) {
    case CONSTANTS.UPDATE_SEARCH:
      return { ...homeState, search: action.payload.searchText };
    case CONSTANTS.UPDATE_WEATHER:
      return { ...homeState, weather: action.payload.weather };

    default:
      return { ...homeState };
  }
};

export { homeReducer };
