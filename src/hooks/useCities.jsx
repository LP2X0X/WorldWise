import { useContext } from "react";
import { CitiesContext } from "../contexts/CitiesContext";

export function useCities() {
  const context = useContext(CitiesContext);
  if (!context) {
    throw new Error("CitiesContext is used outside of CitiesProvider!");
  }
  return context;
}
