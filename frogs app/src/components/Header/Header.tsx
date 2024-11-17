import { useState } from "react";
import "./Header.scss";

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playCroakSound = () => {
    if (isPlaying) return;

    const audio = new Audio("/frog_quak.mp3");

    setIsPlaying(true);

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
    });

    audio.play().catch(() => {
      setIsPlaying(false);
    });
  };
  return (
    <h1>
      {title}
      <img
        src={"/frog_logo.svg.webp"}
        alt={`${title} logo`}
        onClick={playCroakSound}
        style={{ cursor: isPlaying ? "auto" : "pointer" }}
      />
    </h1>
  );
};

export default Header;
