import { createContext, useContext, useEffect, useReducer } from "react";
import { homeReducer } from "../../reducer";

const initialState = {
  search: "",
  weather: {
    name: "",
    main: {
      temp: 0,
      temp_max: 0,
      temp_min: 0,
      humidity: 0,
      pressure: 0,
      sealevel: 0,
    },
    sys: { country: "", sunrise: 0, sunset: 0 },
    timezone: 0,
    weather: [{ description: "", icon: "", id: 0, main: "" }],
  },
};

const HomeContext = createContext();
const HomeProvider = ({ children }) => {
  const [homeState, homeDispatch] = useReducer(homeReducer, initialState);

  return (
    <HomeContext.Provider value={{ homeState, homeDispatch }}>
      {children}
    </HomeContext.Provider>
  );
};

const useHome = () => useContext(HomeContext);
export { useHome, HomeProvider };
