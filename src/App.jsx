import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/welcomePage.jsx';
import Home from './components/home.jsx';
import Studying from './components/Studying.jsx';
import BookSection from './components/BookSection.jsx'; 
import CoinHUD from './components/coinHUD.jsx';
function App() {
  return (
    <>
    <CoinHUD/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/BookSection" element={<BookSection />} />
        <Route path = "/Studying" element = {<Studying/>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;