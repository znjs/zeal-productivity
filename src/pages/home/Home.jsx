import React, { useEffect, useRef, useState } from "react";
import "./home.css";
import tw from "tailwind-styled-components";
import date from "date-and-time";
import axios from "axios";
import { useHome } from "../../context";
import { useNavigate } from "react-router-dom";
import { Weather } from "../../components/weather/Weather";
import { Note } from "../../components";
import { CONSTANTS } from "../../utils";

function Home() {
  const [now, setNow] = useState(new Date());
  const [clockTwentyFour, setClockTwentyFour] = useState(false);
  const [quote, setQuote] = useState({ content: "", author: "" });
  const [user, setUser] = useState("");
  const [logged, setLogged] = useState(false);
  const [focus, setFocus] = useState(false);
  const { homeState, homeDispatch } = useHome();
  const [focusText, setFocusText] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    let userName = localStorage.getItem("userName");
    let focusText = localStorage.getItem("focus");
    if (userName) {
      setUser(userName);
      setLogged(true);
    }
    if (focusText) {
      setFocus(true);
    }
    setInterval(() => setNow(new Date()), 1000);
    (async () => {
      try {
        let res = await axios.get(
          "https://api.quotable.io/random?maxLength=90"
        );
        setQuote({
          content: res.data.content.slice(0, -1),
          author: res.data.author,
        });
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <CONTAINER>
      <WRAPPER>
        {logged ? (
          <>
            <SUBWRAPPER>
              <TIMEWRAPPER>
                {clockTwentyFour ? (
                  <TIME>{date.format(now, "HH:mm")}</TIME>
                ) : (
                  <TIME>{date.format(now, "hh:mm A")}</TIME>
                )}
                <div className="tooltip">
                  <i className="fa-solid fa-retweet mx-4 cursor-pointer"></i>
                  <span className="tooltiptext flex items-center justify-center">
                    24hr-format
                    <label className="switch mx-2">
                      <input
                        type="checkbox"
                        onChange={() => setClockTwentyFour((prev) => !prev)}
                        checked={clockTwentyFour}
                      />
                      <span className="slider round"></span>
                    </label>
                  </span>
                </div>
              </TIMEWRAPPER>
              <FLEXROWCONTAINER>
                <MESSAGE>Welcome {user}</MESSAGE>
                <USEREDIT onClick={() => setLogged(false)} />
              </FLEXROWCONTAINER>
              {focus ? (
                <FLEXROWCONTAINER>
                  <MESSAGE>Your Foucus for the day is {focusText}</MESSAGE>
                  <FOCUSEDIT onClick={() => setFocus(false)} />
                  <FOCUSCHECK
                    onClick={() => {
                      setFocusText("");
                      setFocus(false);
                    }}
                  />
                </FLEXROWCONTAINER>
              ) : (
                <>
                  <MESSAGE>What's Your Main focus for today?</MESSAGE>
                  <TEXTLG
                    value={focusText}
                    onChange={(e) => setFocusText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !!focusText.trim()) {
                        setFocus(true);
                        localStorage.setItem("focus", focusText.current.value);
                      }
                    }}
                  />
                </>
              )}
            </SUBWRAPPER>
          </>
        ) : (
          <SUBWRAPPER>
            <TEXT
              value={user}
              onChange={(e) => {
                setUser(e.target.value);
              }}
              type="text"
              placeholder="Your Name"
              onKeyDown={(e) => {
                if (user && e.key === "Enter") {
                  setLogged(true);
                  localStorage.setItem("userName", user);
                }
              }}
            />
            <BUTTON
              onClick={() => {
                if (user) {
                  setLogged(true);
                }
              }}
            >
              Next &nbsp;<i className="fa-solid fa-angle-right"></i>
            </BUTTON>
          </SUBWRAPPER>
        )}
      </WRAPPER>
      {!!quote.content && (
        <QUOTE>
          {quote.content} <i className="text-gray-400">~{quote.author}</i>
        </QUOTE>
      )}
      <SEARCHWRAPPER>
        <SEARCH
          type="search"
          value={homeState.search}
          onChange={(e) =>
            homeDispatch({
              type: CONSTANTS.UPDATE_SEARCH,
              payload: { searchText: e.target.value },
            })
          }
          onKeyUp={(e) => e.key === "Enter" && navigate("/search")}
          placeholder="Search"
        />
        <SEARCHICON onClick={() => !!homeState.search && navigate("/search")} />
      </SEARCHWRAPPER>
      <Weather />
      <Note />
    </CONTAINER>
  );
}

const CONTAINER = tw.div`h-screen bg-image text-gray-50`;
const WRAPPER = tw.div` fixed h-screen w-screen flex justify-center items-center z-0`;
const BUTTON = tw.button`my-4 text-2xl`;
const TEXT = tw.input`bg-transparent border-b-4 outline-none p-1 text-white text-2xl w-36 mx-auto text-center`;
const TEXTLG = tw.input`bg-transparent border-b-4 outline-none p-1 text-white text-2xl w-46 mx-auto text-center`;
const SUBWRAPPER = tw.div`flex flex-col text-center backdrop-blur-xs`;
const MESSAGE = tw.h1`text-2xl`;
const TIME = tw.time`text-9xl`;
const TIMEWRAPPER = tw.div`flex flex-row items-center select-none`;
const QUOTE = tw.q`absolute bottom-0 right-0 left-0 mx-auto text-center text-xl cursor-default`;
const SEARCH = tw.input` text-gray-900 outline-none bg-transparent border-b-2 border-black search text-center`;
const SEARCHWRAPPER = tw.div`p-4 relative z-10 flex items-center`;
const SEARCHICON = tw.i`text-gray-900 text-2xl fa-solid fa-magnifying-glass cursor-pointer`;
const FLEXROWCONTAINER = tw.div`flex items-center justify-center gap-x-4`;
const FOCUSEDIT = tw.i`fa-solid fa-pencil transition cubic-bezier(0.38, 0.25, 0.42, 0.71) delay-400 hover:bg-[#8080809c] cursor-pointer  p-3 rounded-full`;
const USEREDIT = tw.i`fa-solid fa-pencil transition cubic-bezier(0.38, 0.25, 0.42, 0.71) delay-400 hover:bg-[#8080809c] cursor-pointer p-3 rounded-full`;
const FOCUSCHECK = tw.i`fa-solid fa-check transition cubic-bezier(0.38, 0.25, 0.42, 0.71) delay-400 hover:bg-[#8080809c] cursor-pointer p-3 rounded-full`;
export { Home };
