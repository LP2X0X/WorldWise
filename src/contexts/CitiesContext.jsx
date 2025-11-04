import { createContext, useEffect, useReducer } from "react";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "fetchedCity":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "fetchedCities":
      return { ...state, isLoading: false, cities: action.payload };
    case "createdCity":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    case "deleteCity":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    case "loading":
      return { ...state, isLoading: true };
    case "doneLoading":
      return { ...state, isLoading: false };
    default:
      throw new Error("Unknown action type...");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        let res = await fetch(`${BASE_URL}/cities`);
        if (!res.ok) {
          throw new Error("There is something wrong when fetching the data...");
        }
        let data = await res.json();
        dispatch({ type: "fetchedCities", payload: data });
      } catch (err) {
        console.log(err);
      } finally {
        dispatch({ type: "doneLoading" });
      }
    }

    fetchCities();
    return () => {};
  }, []);

  async function getCity(id) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      if (!res.ok) {
        throw new Error("There is something wrong when fetching city data!");
      }
      const data = await res.json();
      dispatch({ type: "fetchedCity", payload: data });
    } catch (err) {
      console.log(err);
    } finally {
      dispatch({ type: "doneLoading" });
    }
  }

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error(
          "There is something wrong when sending city data to the server!"
        );
      }
      // Get the new city WITH the ID
      const data = await res.json();
      dispatch({ type: "createdCity", payload: data });
    } catch (err) {
      console.log(err);
    } finally {
      dispatch({ type: "doneLoading" });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(
          "There is something wrong when delete city data on the server!"
        );
      }
      dispatch({ type: "deleteCity", payload: id });
    } catch (err) {
      console.log(err);
    } finally {
      dispatch({ type: "doneLoading" });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

export { CitiesProvider, CitiesContext };
