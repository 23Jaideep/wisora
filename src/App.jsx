import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/welcomePage';
import Home from './components/home';
import Studying from './components/Studying';
import BookSection from './components/BookSection';
import CoinHUD from './components/CoinHUD';

function App() {
  return (
    <>
      <CoinHUD />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/BookSection" element={<BookSection />} />
          <Route path="/Studying" element={<Studying />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
