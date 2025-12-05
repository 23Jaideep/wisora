import bookSectionImg from '../assets/BookSection.png';
import clickSound from '../assets/click.mp3';
import bookImg from '../assets/books.png';
import ClickableItem from './ClickableItem';
import { useNavigate } from 'react-router-dom';
import {useState} from 'react';
const BookSection = () =>{
    const navigate = useNavigate();
    const handleCloseClicked = () => {
    navigate('/home')
  };
    const[subjectName, setSubjectName] = useState(()=>{
        const savedSubject = localStorage.getItem('bookSubject');
        return savedSubject? JSON.parse(savedSubject): Array(12).fill('');
    });
    const [cells, setCells]  = useState(()=>{
        const savedCells = localStorage.getItem('bookCells');
        return savedCells? JSON.parse(savedCells): Array(12).fill(null);
    });
    const [isHovered, setIsHovered] = useState(false);
    const saveToLocalStorage = (newCells, newsubject)=>{
        localStorage.setItem('bookCells',JSON.stringify(newCells));
        localStorage.setItem('bookSubject',JSON.stringify(newsubject));
    }
    const playClickSound = () =>{
        const audio = new Audio(clickSound);
        audio.currentTime = 0;
        audio.play().catch(error=>{
            console.log("Audio play failed:",error);   
        });
    };
    const handleAddClick=()=>{
        playClickSound();
        const emptyCellIndex = cells.findIndex((cell,index)=> cell === null && index>=1);
        if(emptyCellIndex !==-1){
            const newCells = [...cells];
            newCells[emptyCellIndex] = 'book';
            setCells(newCells);
            saveToLocalStorage(newCells, subjectName);
        }else{
            alert('All cells are full!');
        }
    };
    const handleRemoveBook = (index) => {
        playClickSound();
        const newCells = [...cells];
        const newSubjectNames = [...subjectName];
        newCells[index] = null;
        newSubjectNames[index] = '';
        setCells(newCells);
        setSubjectName(newSubjectNames);
        saveToLocalStorage(newCells, newSubjectNames);
    };
    const handleSubjectChange= (index, value) => {
        const newSubjectName = [...subjectName];
        newSubjectName[index] = value;
        setSubjectName(newSubjectName);
        saveToLocalStorage(cells,newSubjectName);
    };
    return(
        <div
        style = {{
            backgroundImage: `url(${bookSectionImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}
        >
            <div className="relative z-10">
        <ClickableItem
          name="Close"
          style={{ backgroundColor: 'transparent', top: '13.2%', left: '71%', width: '3.15%', height: '5%' }}
          onClick={handleCloseClicked}
        />
      </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4,1fr)',
                gridTemplateRows: 'repeat(3,1fr)',
                width: '45%',
                height: '45%'
            }}>
                {cells.map((cell, index) => (
                    <div 
                        key={index}
                        style={{
                            borderRadius: '10px',
                            backgroundColor: 'transparent',
                            position: 'relative',
                            minHeight: '150px',
                            pointerEvents: 'none'
                        }}
                    >
                        {
                            cell && (
                                <div
                                style = {{
                                    position: 'absolute',
                                    top: '10px',
                                    left: '0',
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    pointerEvents: 'auto' 
                                }}
                                >
                                    <input
                                    type = "text"
                                    value = {subjectName[index]}
                                    onChange = {(e) => handleSubjectChange(index, e.target.value)}
                                    placeholder="enter subject name"
                                    style = {{
                                        width: '60px',
                                        padding : '2px 5px',
                                        fontSize: '10px',
                                        backgroundColor: 'transparent',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                                        border: '1px solid transparent',
                                        borderRadius: '3px',
                                        marginBottom: '5px',
                                        textAlign: 'center',
                                        position: 'absolute',
                                        top: '41px',
                                        left: '14px',
                                        pointerEvents: 'auto',
                                        zIndex: 10
                                    }}
                                    />
                                    <button
                onClick={() => handleRemoveBook(index)}
                style={{
                    position: 'absolute',
                    top: '140px', // Position below the book
                    left: '30px',
                    backgroundColor: '#A65B42',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '2px 6px',
                    fontSize: '8px',
                    cursor: 'pointer'
                }}
            >
                Remove
            </button>

                                    <img
                                src = {bookImg}
                                alt = "Book"
                                style = {{
                                    width: '80px',
                                    height: '100px',
                                    objectFit: 'cover',
                                    borderRadius: '5px',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                                    position: 'absolute',
                                    top: '35px',
                                    left: '9px'
                                }}
                               />
                                </div>
                            )}
                    </div>
                ))}

            </div>
            <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#A65B42',
                border: '2px solid #502f23ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                fontSize: '30px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                position: 'absolute',
                top: '240px',
                left: '371px'
            }}
            onClick={handleAddClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            >
            </div>
            <div style={{
                width: '20px',
                height: '2px',
                backgroundColor: '#502f23ff',
                position: 'absolute',
                top: '266px',
                left: '387px'
            }}>
            </div>
            <div style={{
                width: '2px',
                height: '20px',
                backgroundColor: '#502f23ff',
                position: 'absolute',
                top: '256.5px',
                left: '396px'
            }}>
            </div>
        </div>
    );
};
export default BookSection;