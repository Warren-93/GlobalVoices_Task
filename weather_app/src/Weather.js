import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import TemperatureToggle from './TempToggle';
import './index.css';

const Weather = () => {
  const [searchCity, setSearchCity] = useState('London'); // Default search criteria
  const [weatherData, setWeatherData] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [error, setError] = useState(null);
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  const handleSearch = () => {
    setError(null); // Reset error state
    setSearchSubmitted(true); // Mark search as submitted
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=ed94ec84f5cd47a1bcf164348231509&q=${searchCity}&days=6&aqi=yes&alerts=no`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error.message); // Handle API error response
        } else {
          setWeatherData(data);
        }
      })
      .catch((error) => {
        setError('Error fetching weather data. Please try again later.'); // Handle network or other errors
        console.error('Error fetching weather data:', error);
      });
  };

  useEffect(() => {
    
    handleSearch();
  }, []); // Include handleSearch as a dependency
  

  // Condition to prevent onClick execution before search submission
  const handleButtonClick = () => {
    if (searchSubmitted) {
      handleSearch();
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  const currentWeather = weatherData.current || {};
  const forecastDays = (weatherData.forecast && weatherData.forecast.forecastday) || [];


  const handleToggle = (unit) => {
    setIsCelsius(unit);
  };
  

  return (
    <Container>
      <h1 className="mt-4">Weather App</h1>
      <Container className="mt-5">
      <Row>
        <Col md={4}>
          <Form className="d-flex">
          <Form.Group controlId="formCity">
            <Form.Control
              type="text"
              className="me-2 rounded-pill"
              placeholder="Enter a city"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              autoFocus
            />
            </Form.Group>
            <Button className="rounded-pill" variant="outline-primary" onClick={handleButtonClick}>
              Search
            </Button>
          </Form>
          
        </Col>
        <Col sm={8}><TemperatureToggle isCelsius={isCelsius} onToggle={handleToggle} /></Col>
        
      </Row>
    </Container>

      
      <Row>
        <Col lg={12}>
          <Card bg="info" text="white" className="mb-4">
            <Card.Body>
                <Card.Header>Today</Card.Header>
                <Card.Title>{<img src={currentWeather.condition.icon}></img> }</Card.Title>
                <Card.Text>
                <p>Temperature: {isCelsius ? currentWeather.temp_c + '°C' : currentWeather.temp_f + '°F'}<br /></p>
                <p>Humidity: {currentWeather.humidity}%</p>
                <p>Wind: {currentWeather.wind_mph}mph </p>
                <p>Direction: {currentWeather.wind_dir}</p> 
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2>6-Day Weather Forecast for {weatherData.location?.name}</h2>
      {forecastDays.length === 0 ? (
        <div>No forecast data available.</div>
      ) : (
        <Row>
          {forecastDays.map((day, index) => (
            <Col key={index+1} md={4}>
              <Card bg="dark">
                <Card.Body>
                  <Card.Title>{day.date}</Card.Title>
                  <Card.Text>
                    <p>{<img src={day.day.condition.icon}></img> }</p>
                    <p>Max Temperature: {isCelsius ? day.day.maxtemp_c + '°C' : day.day.maxtemp_f + '°F'}<br /></p>
                    <p>Min Temperature: {isCelsius ? day.day.mintemp_c + '°C' : day.day.mintemp_f + '°F'}<br /></p>
                    <p>Humidity: {day.day.avghumidity}%</p>
                    <p>Rain Chance: {day.day.daily_chance_of_rain}% </p>
                    <p>Snow Chance: {day.day.daily_chance_of_snow}% </p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Weather;
