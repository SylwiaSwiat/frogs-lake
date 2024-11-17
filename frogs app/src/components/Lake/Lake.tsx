import "./Lake.scss";
import { useState, useEffect } from "react";
import Placement from "../Placement/Placement";
import Frog from "../Frog/Frog";
import Button from "../Button/Button";

type FrogType = {
  id: number;
  gender: "male" | "female";
  characteristic: [height: "tall" | "short", width: "slim" | "fat"];
  position: number;
};

const Lake = () => {
  const lakeElements = Array.from({ length: 60 });
  const [frogs, setFrogs] = useState<FrogType[]>([]);
  const [selectedFrogs, setSelectedFrogs] = useState<FrogType[]>([]);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [disabled, setDisabled] = useState(true);

  const getRandomPosition = (): number =>
    Math.floor(Math.random() * lakeElements.length);

  useEffect(() => {
    const firstPosition = getRandomPosition();
    let secondPosition;

    do {
      secondPosition = getRandomPosition();
    } while (secondPosition === firstPosition);

    const initialFrogs: FrogType[] = [
      {
        id: 0,
        gender: "male",
        characteristic: ["tall", "slim"],
        position: firstPosition,
      },
      {
        id: 1,
        gender: "female",
        characteristic: ["short", "fat"],
        position: secondPosition,
      },
    ];

    setFrogs(initialFrogs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectFrog = (index: number | null): void => {
    const frogAtPosition = frogs.find((f) => f.position === index);

    if (frogAtPosition) {
      const alreadySelected = selectedFrogs.some(
        (f) => f.id === frogAtPosition.id
      );

      const updatedSelectedFrogs = alreadySelected
        ? selectedFrogs.filter((f) => f.id !== frogAtPosition.id)
        : [...selectedFrogs, frogAtPosition];

      if (updatedSelectedFrogs.length <= 2) {
        setSelectedFrogs(updatedSelectedFrogs);
      }
    }
  };

  const handleJump = (): void => {
    if (selectedFrogs.length === 1 && targetIndex != null) {
      const frog = selectedFrogs[0];
      const maxJump = frog.gender === "male" ? 3 : 2;

      if (calculateDistance(frog.position, targetIndex) <= maxJump) {
        setFrogs((prevFrogs) =>
          prevFrogs.map((f) =>
            f.id === frog.id ? { ...f, position: targetIndex } : f
          )
        );
        setSelectedFrogs([]);
        setTargetIndex(null);
      }
    }
  };

  const handleReproduce = (): void => {
    if (!disabled && selectedFrogs.length === 2) {
      const [mother, father] =
        selectedFrogs[0].gender === "female"
          ? [selectedFrogs[0], selectedFrogs[1]]
          : [selectedFrogs[1], selectedFrogs[0]];

      const availableSpaces = getAdjacentSpaces(mother.position);

      if (availableSpaces.length > 0) {
        const newFrogPosition = availableSpaces[0];
        const newHeight =
          Math.random() > 0.5
            ? mother.characteristic[0]
            : father.characteristic[0];
        const newWidth =
          Math.random() > 0.5
            ? mother.characteristic[1]
            : father.characteristic[1];

        const newFrog: FrogType = {
          id: frogs.length,
          gender: Math.random() > 0.5 ? "male" : "female",
          characteristic: [newHeight, newWidth],
          position: newFrogPosition,
        };

        setFrogs((prevFrogs) => [...prevFrogs, newFrog]);
        setSelectedFrogs([]);
        setTargetIndex(null);
        setDisabled(true);
      }
    }
  };

  const areAdjacent = (pos1: number, pos2: number): boolean => {
    const colDifference = Math.abs((pos1 % 10) - (pos2 % 10));
    const rowDifference = Math.abs(
      Math.floor(pos1 / 10) - Math.floor(pos2 / 10)
    );
    return colDifference <= 1 && rowDifference <= 1 && pos1 !== pos2;
  };

  useEffect(() => {
    if (selectedFrogs.length === 2) {
      const [firstFrog, secondFrog] = selectedFrogs;
      const isDifferentGender = firstFrog.gender !== secondFrog.gender;
      const adjacent = areAdjacent(firstFrog.position, secondFrog.position);

      setDisabled(!(isDifferentGender && adjacent));
    } else {
      setDisabled(true);
    }
  }, [selectedFrogs]);

  const getAdjacentSpaces = (position: number): number[] => {
    const cols = 10;
    const adjacent = [
      position - 1,
      position + 1,
      position - cols,
      position + cols,
    ];

    return adjacent.filter(
      (pos) =>
        pos >= 0 &&
        pos < lakeElements.length &&
        !frogs.some((f) => f.position === pos)
    );
  };

  const calculateDistance = (fromIndex: number, toIndex: number): number => {
    const cols = 10;
    const rowDiff = Math.abs(
      Math.floor(fromIndex / cols) - Math.floor(toIndex / cols)
    );
    const colDiff = Math.abs((fromIndex % cols) - (toIndex % cols));
    return Math.max(rowDiff, colDiff);
  };

  return (
    <div className="lakeContainer">
      <div className="buttonContainer">
        <Button
          title="jump"
          handleClick={handleJump}
          disabled={selectedFrogs.length !== 1 || targetIndex === null}
        />
        <Button
          title="reproduce"
          handleClick={handleReproduce}
          disabled={disabled}
        />
      </div>
      <div className="lakeGrid">
        {lakeElements.map((_, index) => {
          const frogAtPosition = frogs.find((frog) => frog.position === index);
          const isWithinReach =
            selectedFrogs.length === 1 &&
            calculateDistance(selectedFrogs[0].position, index) <=
              (selectedFrogs[0].gender === "male" ? 3 : 2);

          return (
            <Placement
              key={index}
              occupied={!!frogAtPosition}
              active={selectedFrogs.some((f) => f.position === index)}
              inRange={isWithinReach && !frogAtPosition}
              chosen={targetIndex === index}
              onClick={() =>
                frogAtPosition
                  ? handleSelectFrog(index)
                  : isWithinReach && setTargetIndex(index)
              }
            >
              {frogAtPosition && (
                <Frog
                  gender={frogAtPosition.gender}
                  characteristic={frogAtPosition.characteristic}
                  onClick={() => handleSelectFrog(index)}
                />
              )}
            </Placement>
          );
        })}
      </div>
    </div>
  );
};

export default Lake;
