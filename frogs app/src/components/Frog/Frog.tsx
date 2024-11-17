import "./Frog.scss";

type FrogProps = {
  gender: "male" | "female";
  characteristic: [height: "tall" | "short", width: "slim" | "fat"];
  onClick: () => void;
};

const Frog = ({ gender, onClick }: FrogProps) => {
  return (
    <div className="container" onClick={onClick}>
      <div className={`genderBox ${gender}`}></div>
    </div>
  );
};

export default Frog;
