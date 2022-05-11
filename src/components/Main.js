import React, {useState, useEffect} from 'react';
import axios from "axios";
import "./main.css";

const Main = () => {

    const [countries, setCountries] = useState([]);

    const [lastDays, setLastDays] = useState([]);

    const [countryNow, setCountryNow] = useState('Kyrgyzstan');

    const [months, setMonths] = useState({
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December"
    });

    const [record, setRecord] = useState([]);


    useEffect(() => {
        axios("https://api.covid19api.com/countries")
            .then(({data}) => setCountries(data));

        if (localStorage.getItem("country") !== null) {
            setCountryNow(localStorage.getItem("country"))
        }
        else {
            setCountryNow("Kyrgyzstan")
        }

        let maxIndex = countries.reduce((acc, curr, i) => countries[acc].Recovered > curr.Recovered ? acc : i, 0);
        setRecord([maxIndex])

    }, []);

    useEffect(() => {
        axios(`https://api.covid19api.com/country/${countryNow}`)
            .then(({data}) => setLastDays(data.slice(data.length - 5)));
    }, [countryNow]);


    return (
        <div className="Main">
            <div className="container">
                <div className="Main__row">

                    <div className="Main__row_countries">
                        <select onChange={(e) => {
                            setCountryNow(e.target.value);
                            localStorage.setItem("country", e.target.value);
                        }}>
                            <option value={countryNow}>
                                {countryNow}
                            </option>
                            {countries.filter((item) => item.slug !== countryNow).map((item) => (
                                <option key={item.Country}
                                        value={item.country}>{item.Country}</option>
                            ))}
                        </select>
                    </div>


                    <div className="Main__statistics">

                        <div className="Main__statistics_week">
                            {lastDays.length !== 0
                                ?
                                lastDays.map((item) => (
                                    <div className="Main__statistics_week-card" key={item.Date}>
                                        <div className="date">
                                            <span>{item.Date.split("-")[2].slice(0, 2)}</span>
                                            <span> {months[item.Date.split("-")[1]]}</span>
                                        </div>

                                        <div className="statistics">
                                            <div className="statistics__up">
                                                <div className="statistics__info">
                                                    Active: <span>{item.Active}</span>
                                                </div>

                                                <div className="statistics__info">
                                                    Deaths: <span>{item.Deaths}</span>
                                                </div>

                                            </div>
                                            <div className="statistics__down">
                                                <div className="statistics__info">
                                                    Confirmed: <span>{item.Confirmed}</span>
                                                </div>
                                                <div className="statistics__info">
                                                    Recovered: <span>{item.Recovered}</span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ))
                                : <div>Данные по стране не найдены!</div>
                            }


                        </div>

                        {record !== ""
                            ? <div className="Main__statistics_record">
                                <h3>Top recovered cases</h3>
                                <span className="recovered">
                                    {lastDays.length !== 0
                                        ? lastDays[record].Recovered
                                        : ""
                                    }
                                </span>
                                <span className="recovered__date">
                                    {lastDays.length !== 0
                                        ? `${lastDays[record].Date.split("-")[2].slice(0, 2)} ${months[lastDays[record].Date.split("-")[1]]}`
                                        : ""
                                    }
                                </span>
                            </div>
                            : ""
                        }

                    </div>


                </div>


            </div>


        </div>
    );
};

export default Main;