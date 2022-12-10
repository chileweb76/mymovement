import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import FoodEntry from './pages/FoodEntry';
import MoodEntry from './pages/MoodEntry';
import MedsEntry from './pages/MedsEntry'
import BowelEntry from './pages/BowelEntry';
import ForgotPassword from './pages/ForgotPassword';

const App = () => {

  return (
  <main>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/homepage" element={<Homepage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/foodentry" element={<FoodEntry />} />
      <Route path="/moodentry" element={<MoodEntry />} />
      <Route path="/medsentry" element={<MedsEntry />} />
      <Route path="/bowelentry" element={<BowelEntry />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
    </Routes>
  </main>
  );
}

export default App;
