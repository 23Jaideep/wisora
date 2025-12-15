import { useCoins } from "../context/coinContext";

export default function CoinHUD() {
  const { coins } = useCoins();

  return (
    <div
      style={{
        position: "fixed",
        top: "25px",
        right: "30px",
        background: "#1f1f1f",
        color: "#ffd700",
        padding: "10px 18px",
        borderRadius: "25px",
        fontSize: "18px",
        fontWeight: "bold",
        zIndex: 99999
      }}
    >
      🪙 {coins}
    </div>
  );
}
