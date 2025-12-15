import { createContext, useContext, useState, useEffect } from "react";

const CoinContext = createContext();

export const CoinProvider = ({children}) =>{
    const [coins, setCoins] = useState (()=>{
        const saved = localStorage.getItem("wisora_coins");
        return saved? Number(saved):0;
    });
    
    useEffect(()=>{
        localStorage.setItem("wisora_coins", coins);
    }, [coins]);
    return(
        <CoinContext.Provider value = {{coins, setCoins}}>
            {children}
        </CoinContext.Provider>
    );
};

export const useCoins = () => useContext(CoinContext);