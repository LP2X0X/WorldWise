import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";

function CountryList({ isLoading, cities }) {
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking a city on a map" />
    );

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((item) => item.country).includes(city.country)) {
      arr.push({ country: city.country, emoji: city.emoji });
    }
    return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountryList;
