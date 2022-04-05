import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Home, PageNotFound, Search } from "./pages";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}
export default App;
