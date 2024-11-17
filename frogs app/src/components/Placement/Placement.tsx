import "./Placement.scss";

type PlacementProps = {
  occupied: boolean;
  active: boolean;
  inRange: boolean;
  chosen: boolean;
  onClick: () => void;
  children?: React.ReactNode;
};

const Placement = ({
  occupied,
  inRange,
  active,
  chosen,
  onClick,
  children,
}: PlacementProps) => {
  return (
    <div
      className={`placement ${active ? "active" : inRange ? "inRange" : ""} ${
        occupied ? "occupied" : ""
      } ${chosen ? "chosen" : ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Placement;
