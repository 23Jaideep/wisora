import React, { useState } from 'react';
import { useRef } from 'react';
import './home.css';
import clickSound from '../assets/click.mp3';
import ClickableItem from './ClickableItem';
import video1 from '../assets/video1.mp4';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import lofimusic from '../assets/lofi.mp3';
import emptybg from '../assets/emptybg.png';
import bookshelf from '../assets/bookshelf.png';
import computer from '../assets/computer.png';
import tablechair from '../assets/tablechair.png';
import lamp from '../assets/lamp.png';
import plant from '../assets/plant.png';
import windoww from '../assets/windoww.png';
import bookshelf2 from '../assets/bookshelf2.png';
import bookshelf3 from '../assets/bookshelf3.png';
import bookshelf4 from '../assets/bookshelf4.png';
import bookshelf5 from '../assets/bookshelf5.png';
import scenary1 from '../assets/scenary1.jpg';
import scenary2 from '../assets/scenary2.jpg';
import scenary3 from '../assets/scenary3.jpg';
import scenary4 from '../assets/scenary4.jpg';
import scenary5 from '../assets/scenary5.jpg';
import bed1 from '../assets/bed1.png';
import bed2 from '../assets/bed2.png';
import bed3 from '../assets/bed3.png';
import bed4 from '../assets/bed4.png';
import bed5 from '../assets/bed5.png';
import book1 from '../assets/book1.png';
import book2 from '../assets/book2.png';
import book3 from '../assets/book3.png';
import book4 from '../assets/book4.png';
import book5 from '../assets/book5.png';
import computer2 from '../assets/computer2.png';
import computer3 from '../assets/computer3.png';
import computer4 from '../assets/computer4.png';
import computer5 from '../assets/computer5.png';
import lamp2 from '../assets/lamp2.png';
import lamp3 from '../assets/lamp3.png';
import lamp4 from '../assets/lamp4.png';
import lamp5 from '../assets/lamp5.png';
import plant2 from '../assets/plant2.png';
import plant3 from '../assets/plant3.png';
import plant4 from '../assets/plant4.png';
import plant5 from '../assets/plant5.png';
import window2 from '../assets/window2.png';
import window3 from '../assets/window3.png';
import window4 from '../assets/window4.png';
import window5 from '../assets/window5.png';
import sandclock from '../assets/sandclock.png';
const Home = () => {
  const [showBedMenu, setShowBedMenu] = useState(false);
  const [showComputerMenu, setShowComputerMenu] = useState(false);
  const [showLampMenu, setShowLampMenu] = useState(false);
  const [showWindowMenu, setShowWindowMenu] = useState(false);
  const [showPlantMenu, setShowPlantMenu] = useState(false);
  const [showBookMenu, setShowBookMenu] = useState(false);
  const [showScenaryMenu, setShowScenaryMenu] = useState(false);

  const playClickSound = ()=>{
    const audio = new Audio(clickSound);
    audio.play().catch(error=>{
      console.log("click sound failed",error)
    });
  };

  const FurnitureMenu = ({ options, setSelected, menuRef, position, onClose }) => {
  return (
    <div
      ref={menuRef}
      style={{
        width: '360px',
        height: '100px',
        position: 'absolute',
        top: position.top,
        left: position.left,
        borderRadius: '5%',
        backgroundColor: '#eabfa0a7',
        zIndex: 50,
        cursor: 'pointer'
      }}
    >
      {options.map((item, index) => (
        <div
          key={index}
          style={{
            width: '60px',
            height: '80px',
            backgroundColor: '#ffffff20',
            position: 'absolute',
            top: '10px',
            left: `${10 + index * 70}px`,
            borderRadius: '5%',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            cursor: 'pointer'
          }}
          onClick={() => {
            playClickSound();
            setSelected(item);
            onClose(); // close menu after selecting
          }}
        >
          <img
            src={item.src}
            alt={`option-${index}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '5%' }}
          />
        </div>
      ))}
    </div>
  );
};



  const bookshelfMenuRef = useRef(null);
  const bookshelfOptions = [
    {src: bookshelf,style: {top:'0%', left:'0%'}},
    {src: bookshelf2,style: {top:'15%', left:'5%'}},
    {src: bookshelf3,style: { top:'17%', left:'4%'}},
    {src: bookshelf4,style: {top:'17%', left:'4%'}},
    {src: bookshelf5,style: {top:'6%', left:'-4%'}}
  ];
  const scenaryOptions = [
    {src: scenary1,style: {top:'5%', left:'19%', width: '20%', height: '30%'}},
    {src: scenary2,style: {top:'5%', left:'19%', width: '20%', height: '30%'}},
    {src: scenary3,style: {top:'5%', left:'19%', width: '20%', height: '30%'}},
    {src: scenary4,style: {top:'5%', left:'19%', width: '20%', height: '30%'}},
    {src: scenary5,style: {top:'5%', left:'19%', width: '20%', height: '30%'}}
  ];
  const bedOptions = [
    {src: bed1,style: {top:'58%', left:'75%', width: '30%', height: '40%'}},
    {src: bed2,style: {top:'40%', left:'65%', width: '60%', height: '60%', transform: 'rotate(5deg)'}},
    {src: bed3,style: { top:'40%', left:'65%', width: '60%', height: '60%', transform: 'rotate(4deg)' }},
    {src: bed4,style: {top:'40%', left:'65%', width: '60%', height: '60%', transform: 'rotate(12deg)'}},
    {src: bed5,style: {top:'58%', left:'75%', width: '30%', height: '40%'}}
  ];
  const bookOptions = [
    {src: book1,style: {top:'35%', left:'40%', width: '7%', height: '15%'}},
    {src: book2,style: {top:'35%', left:'40%', width: '7%', height: '15%'}},
    {src: book3,style: {top:'35%', left:'40%', width: '7%', height: '15%'}},
    {src: book4,style: {top:'35%', left:'40%', width: '7%', height: '15%'}},
    {src: book5,style: {top:'35%', left:'40%', width: '7%', height: '15%'}}
  ];
  const computerOptions = [
    {src: computer,style: {top:'33%', left:'49.5%', width: '8%', height: '16%'}},
    {src: computer2,style: {top:'33%', left:'49.5%', width: '8%', height: '16%'}},
    {src: computer3,style: { top:'33%', left:'49.5%', width: '8%', height: '16%'}},
    {src: computer4,style: {top:'33%', left:'49.5%', width: '8%', height: '16%'}},
    {src: computer5,style: {top:'33%', left:'49.5%', width: '8%', height: '16%'}}
  ];
  const lampOptions = [
    {src: lamp,style: {top:'27.5%', left:'56%', width: '20%', height: '30%'}},
    {src: lamp2,style: {top:'34%', left:'60%', width: '13%', height: '20%'}},
    {src: lamp3,style: { top:'39%', left:'62%', width: '10%', height: '15%'}},
    {src: lamp4,style: {top:'39%', left:'62%', width: '10%', height: '15%'}},
    {src: lamp5,style: {top:'39%', left:'62%', width: '10%', height: '15%'}}
  ];
  const windowOptions = [
    {src: windoww,style: {width: '30%', height: '50%'}},
    {src: window2,style: {width: '30%', height: '40%'}},
    {src: window3,style: {width: '30%', height: '40%'}},
    {src: window4,style: {width: '30%', height: '40%'}},
    {src: window5,style: { width: '30%', height: '40%'}}
  ];
  const plantOptions = [
    {src: plant,style: {position: 'absolute',top:'40%', left:'23%', width: '10%', height: '45%'}},
    {src: plant2,style: {position: 'absolute',top:'57%', left:'23%', width: '10%', height: '25%'}},
    {src: plant3,style: {position: 'absolute', top:'61%', left:'24%', width: '10%', height: '20%'}},
    {src: plant4,style: {position: 'absolute',top:'60%', left:'25%', width: '7%', height: '20%'}},
    {src: plant5,style: {position: 'absolute',top:'60%', left:'23%', width: '10%', height: '20%'}}
  ];

  const bedMenuRef = useRef(null);
  const computerMenuRef = useRef(null);
  const lampMenuRef = useRef(null);
  const windowMenuRef = useRef(null);
  const plantMenuRef = useRef(null);
  const bookMenuRef = useRef(null);
  const scenaryMenuRef = useRef(null);

  const [selectedBookshlef, setSelectedBookshelf] = useState(bookshelfOptions[0]);
  const [selectedScenary, setSelectedScenary] = useState(scenaryOptions[0]);
  const [selectedBed, setSelectedBed] = useState(bedOptions[0]);
  const [selectedBook, setSelectedBook] = useState(bookOptions[0]);
  const [selectedComputer, setSelectedComputer] = useState(computerOptions[0]);
  const [selectedLamp, setSelectedLamp] = useState(lampOptions[0]);
  const [selectedWindow, setSelectedWindow] = useState(windowOptions[0]);
  const [selectedPlant, setSelectedPlant] = useState(plantOptions[0]);
  const[isPlaying, setIsPlaying] = useState(false);
  const [showBookshelfMenu, setShowBookshelfMenu] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const handleVolumeClicked = () =>{
    if(!audioRef.current){
      audioRef.current = new Audio(lofimusic);
      audioRef.current.loop = true;
    }
    if(isPlaying){
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }else{
      audioRef.current.play().catch(error=>{
        console.log("Audio play failed", error);
      });
      setIsPlaying(true);
    }
  };
  const handleSandclockClicked = () => {
    navigate('/studying')
  };
  const handleSpellBookClicked = () => {
    alert("SpellBook clicked! Pomodoro timer should now start.");
  };
  const handleBookshelfClicked = () => {
    navigate('/BookSection');
  };

  return (
    <div className="home-container realtive">
 
  <img
  src={selectedBookshlef.src}
  alt="bookshlef"
  style={{
    position: 'absolute',
    ...selectedBookshlef.style,
    zIndex: 60,
    objectFit: 'contain'
  }}
  onContextMenu={(e)=>{ e.preventDefault(); setShowBookshelfMenu(true);
  }}
  onClick={handleBookshelfClicked}
/>
      {showBookshelfMenu && (
  <FurnitureMenu
    options={bookshelfOptions}
    setSelected={setSelectedBookshelf}
    menuRef={bookshelfMenuRef}
    position={{ top: '600px', left: '200px' }}
    onClose={() => setShowBookshelfMenu(false)}
  />
)}
      <img
        src={emptybg}
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{zIndex: 0, pointerEvents:"none"}}
      />
      <img
      src = {sandclock}
      alt = "sandclock"
      style = {{
        position : 'absolute',
        top: '43%',
        left: '59%',
        height: '60px',
        width: '40px',
        zIndex: 80
      }}
      />
      <img
  src={selectedBed.src}
  alt="bed"
  style={{
    position: 'absolute',
    ...selectedBed.style,
    zIndex: 60,
    objectFit: 'contain'
  }}
  onContextMenu={(e)=>{ e.preventDefault(); setShowBedMenu(true); }}
/>
      {showBedMenu && (
  <FurnitureMenu
    options={bedOptions}
    setSelected={setSelectedBed}
    menuRef={bedMenuRef}
    position={{ top: '600px', left: '200px' }}
    onClose={() => setShowBedMenu(false)}
  />
)}
      <img
  src={selectedComputer.src}
  alt="computer"
  style={{
    position: 'absolute',
    ...selectedComputer.style,
    zIndex: 40,
    objectFit: 'contain'
  }}
  onContextMenu={(e)=>{ e.preventDefault(); setShowComputerMenu(true); }}
/>
      {showComputerMenu && (
  <FurnitureMenu
    options={computerOptions}
    setSelected={setSelectedComputer}
    menuRef={computerMenuRef}
    position={{ top: '600px', left: '200px' }}
    onClose={() => setShowComputerMenu(false)}
  />
)}
      <img
  src={selectedLamp.src}
  alt="lamp"
  style={{
    position: 'absolute',
    ...selectedLamp.style,
    zIndex: 60,
    objectFit: 'contain'
  }}
  onContextMenu={(e)=>{ e.preventDefault(); setShowLampMenu(true); }}
/>
      {showLampMenu && (
  <FurnitureMenu
    options={lampOptions}
    setSelected={setSelectedLamp}
    menuRef={lampMenuRef}
    position={{ top: '600px', left: '200px' }}
    onClose={() => setShowLampMenu(false)}
  />
)}
      <div
      name = "windoww"
      style={{
        position: 'absolute',
        top:'30px',
        left: '900px',
        width: '100%',
        height: '100%',
        zIndex: 50
      }}
      
      >
        <img
        src = {selectedWindow.src}
        alt = "windoww"
        style={selectedWindow.style}
        onContextMenu={(e) => {
    e.preventDefault();
    setShowWindowMenu(true);
  }}
        />
      </div>
      {showWindowMenu && (
  <FurnitureMenu
    options={windowOptions}
    setSelected={setSelectedWindow}
    menuRef={windowMenuRef}
    position={{ top: '600px', left: '200px' }}
    onClose={() => setShowWindowMenu(false)}
  />
)}
      <div
      name = "tablechair"
      style={{
        position: 'absolute',
        top:'280px',
        left: '400px',
        width: '100%',
        height: '100%',
        zIndex: 10
      }}
      onClick={handleSandclockClicked}
      >
        <img
        src = {tablechair}
        className = "w-full h-full object-cover"
        alt = "tablechair"
        
        />
      </div>
      
      <img
  src={selectedScenary.src}
  alt="scenary"
  style={{
    position: 'absolute',
    ...selectedScenary.style,
    zIndex: 30,
    objectFit: 'contain'
  }}
  onContextMenu={(e)=>{ e.preventDefault(); setShowScenaryMenu(true); }}
/>
      {showScenaryMenu && (
        <FurnitureMenu
        options={scenaryOptions}
        setSelected={setSelectedScenary}
        menuRef={scenaryMenuRef}
        position={{ top: '600px', left: '200px' }}
        onClose={() => setShowScenaryMenu(false)}
  />
)}
      <img
  src={selectedPlant.src}
  alt="plant"
  style={{
    position: 'absolute',
    ...selectedPlant.style,
    zIndex: 20,
    objectFit: 'contain'
  }}
  onContextMenu={(e)=>{ e.preventDefault(); setShowPlantMenu(true); }}
/>
      {showPlantMenu && (
  <FurnitureMenu
    options={plantOptions}
    setSelected={setSelectedPlant}
    menuRef={plantMenuRef}
    position={{ top: '600px', left: '200px' }}
    onClose={() => setShowPlantMenu(false)}
  />
)}
      <img
  src={selectedBook.src}
  alt="book"
  style={{
    position: 'absolute',
    ...selectedBook.style,
    zIndex: 30,
    objectFit: 'contain'
  }}
  onContextMenu={(e)=>{ e.preventDefault(); setShowBookMenu(true); }}
/>
      {showBookMenu && (
  <FurnitureMenu
    options={bookOptions}
    setSelected={setSelectedBook}
    menuRef={bookMenuRef}
    position={{ top: '600px', left: '200px' }}
    onClose={() => setShowBookMenu(false)}
  />
)}
      <div className="relative z-10">
        <div
      style = {{
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        backgroundColor: '#6e5858ff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        position: 'absolute',
        top: '30px',
        left: '87%',
        cursor: 'pointer',
        zIndex: 10
      }}
      onClick={handleVolumeClicked}
      >{isPlaying? '🔇': '🔊'}</div>
      </div>
    </div>
    
  );
};

export default Home;