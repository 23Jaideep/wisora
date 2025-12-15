import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import WelcomePage from "./components/welcomePage";
import Home from "./components/home";
import BookSection from "./components/BookSection";
import CoinHUD from "./components/CoinHUD";

// Lazy-loaded component
const Studying = lazy(() => import("./components/Studying"));

function App() {
  return (
    <BrowserRouter>
      <CoinHUD />

      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/BookSection" element={<BookSection />} />
          <Route path="/Studying" element={<Studying />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
