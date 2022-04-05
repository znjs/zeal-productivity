import { useHome } from "../../context";

function Search() {
  const { homeState } = useHome();
  window.location.href = `https://google.com/search?q=${homeState.search}`;
  return null;
}

export { Search };
