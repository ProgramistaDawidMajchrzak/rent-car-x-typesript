import React from 'react';
import { AppRouter } from "./router";
import '../App.css';
// import {CarCard} from '../components/Cars/CarCard';

function App() {
  // const carData = {
  //   name: "All New Rush",
  //   type: "SUV",
  //   specs: {
  //     gas: "70L",
  //     gear_box: "Manual",
  //     capacity: "6 People"
  //   },
  //   price: {
  //     current: 72,
  //     original: 80
  //   }
  // };
  // <CarCard {...carData} />

  return <AppRouter />;
}

export default App;
