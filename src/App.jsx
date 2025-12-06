import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/welcomePage.jsx';
import Home from './components/Home';
import Studying from './components/Studying';
import BookSection from './components/BookSection'; 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/BookSection" element={<BookSection />} />
        <Route path = "/Studying" element = {<Studying/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;