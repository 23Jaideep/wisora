import { createContext, useContext, useState, useEffect } from "react";

const coinContext = createContext();

export const CoinProvider = ({children}) =>{
    const [coins, setCoins] = useState (()=>{
        const saved = localStorage.getItem("wisora_coins");
        return saved? Number(saved):0;
    });
    
    useEffect(()=>{
        localStorage.setItem("wisora_coins", coins);
    }, [coins]);
    return(
        <coinContext.Provider value = {{coins, setCoins}}>
            {children}
        </coinContext.Provider>
    );
};

export const useCoins = () => useContext(coinContext);
