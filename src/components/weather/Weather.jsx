import axios from "axios";
import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import date from "date-and-time";
import { useHome } from "../../context";
import "./weather.css";

const Weather = () => {
  const API_KEY = "27df1b8242a73117c0fd10fedc5077c9";
  const [now, setNow] = useState(new Date());
  const [city, setCity] = useState("");
  const { homeState, homeDispatch } = useHome();
  const [coordinates, setCoordinates] = useState({
    lon: 88.3697,
    lat: 22.5697,
  });
  const [descVisibility, setDescVisibility] = useState(false);

  function success(pos) {
    var crd = pos.coords;
    setCoordinates({ lon: crd.longitude, lat: crd.latitude });
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(success, error);
  };
  const updateWeather = (city) => {
    try {
      (async () => {
        let res = await axios.post(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        homeDispatch({
          type: "UPDATE_WEATHER",
          payload: { weather: res.data },
        });
      })();
    } catch (err) {
      console.error(err);
    }
    setCity("");
  };
  useEffect(() => {
    setInterval(() => setNow(new Date()), 1000);
  }, []);
  useEffect(() => {
    getLocation();
  }, []);
  useEffect(() => {
    if (coordinates.lat) {
      try {
        (async () => {
          let res = await axios.post(
            `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}&units=metric`
          );
          homeDispatch({
            type: "UPDATE_WEATHER",
            payload: { weather: res.data },
          });
        })();
      } catch (err) {
        console.error(err);
      }
    }
  }, [coordinates]);

  const { weather } = homeState;

  return (
    <SUPERCONTAINER>
      <WRAPPERSEARCH>
        <GLOBE />
        <CITYINPUT
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              updateWeather(city);
            }
          }}
        />
      </WRAPPERSEARCH>
      <CONTAINER onClick={() => setDescVisibility((prev) => !prev)}>
        <WRAPPER>
          <ICON
            src={`http://openweathermap.org/img/wn/${weather?.weather[0]?.icon}.png`}
          />
          <TEMP>
            {weather?.main?.temp}
            <sup>&deg;c</sup>
          </TEMP>
        </WRAPPER>
        <CITY>{weather?.name}</CITY>
      </CONTAINER>
      {descVisibility && (
        <DETAILS>
          <WRAPPERDETAIL>
            <CITYDETAILS>{weather?.name}</CITYDETAILS>
            <DAY>{date.format(now, "dddd")}</DAY>
          </WRAPPERDETAIL>
          <TEMPWRAPPER>
            <ICON
              src={`http://openweathermap.org/img/wn/${weather?.weather[0]?.icon}.png`}
            />
            <TEMPDETAIL>
              {weather?.main?.temp}
              <sup>&deg;c</sup>
            </TEMPDETAIL>
            <MINMAX>
              <TEXTSMALL>
                Max:{weather.main.temp_max}
                <sup>&deg;</sup>C
              </TEXTSMALL>
              <TEXTSMALL>
                Min:{weather.main.temp_min}
                <sup>&deg;</sup>C
              </TEXTSMALL>
            </MINMAX>
          </TEMPWRAPPER>
          <COLWRAPPER>
            <TEXTSMALL>Speed: {weather.wind.speed} kmph</TEXTSMALL>
            <TEXTSMALL>Visibility: {weather.visibility}</TEXTSMALL>
            <TEXTSMALL>Desc: {weather.weather[0].description}</TEXTSMALL>
          </COLWRAPPER>
        </DETAILS>
      )}
    </SUPERCONTAINER>
  );
};
const SUPERCONTAINER = tw.div`absolute z-10 top-0 right-0 m-2 weather-container`;
const GLOBE = tw.i`fa-solid fa-earth-asia text-black`;
const CITYINPUT = tw.input`bg-transparent border-b-2 outline-0 p-1 text-black border-black w-32 text-m p-1 mx-2`;
const CONTAINER = tw.div`cursor-pointer backdrop-blur-xs select-none`;
const DETAILS = tw.div`backdrop-blur-m p-2 rounded bg-[#0f0f0fa3]`;
const WRAPPERSEARCH = tw.div`flex items-center justify-between hidden search-city max-w-lg text-right`;
const WRAPPER = tw.div`flex items-center justify-between gap-x-2 w-40 ml-auto`;
const WRAPPERDETAIL = tw.div`flex items-end  gap-x-2`;
const TEMPWRAPPER = tw.div`flex items-start  gap-x-4`;
const ICON = tw.img``;
const TEMP = tw.p`text-gray-900 text-3xl`;
const TEMPDETAIL = tw.p`text-gray-50 text-5xl`;
const MINMAX = tw.div`flex flex-col justify-between h-12`;
const TEXTSMALL = tw.small``;
const CITY = tw.p`text-gray-900 text-center text-2xl text-right`;
const CITYDETAILS = tw.h1`text-2xl`;
const DAY = tw.p`text-gray-300`;
const COLWRAPPER = tw.div`flex flex-col gap-y-1`;
export { Weather };
