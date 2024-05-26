import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Timer from "./components/Timer";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/daytime" element={<App />} />
          <Route path="/nighttime" element={<App />} />
          <Route path="/timer" element={<Timer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
