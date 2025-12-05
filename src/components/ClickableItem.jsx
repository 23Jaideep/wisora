import React, { useRef } from 'react';
import clickSound from '../assets/click.mp3';
import './ClickableItem.css';

const ClickableItem = ({name, style, onClick, children, onContextMenu, ...props}) => {
    const audioRef = useRef(null);

    const handleClick = async(e) =>{
        if(audioRef.current){

            try{
                audioRef.current.currentTime = 0;
                await audioRef.current.play();

                await new Promise(resolve => {
                    audioRef.current.onended = resolve;
                    setTimeout(resolve,300);
                });
            }catch(error){
            console.log("Audio play failed",SyntaxError);
            
        }
        } 
        if(onClick) onClick(e);
    };
    return (
        <>
        <div
        className="clickable-item"
        style= {style}
        onClick={handleClick}
        >{children}
        </div>
        <audio ref = {audioRef} src={clickSound} preload="auto"/>
        </>
    );
};
export default ClickableItem;