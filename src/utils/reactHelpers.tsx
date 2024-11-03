import React from "react";
import Image from "next/image";
import serviceShape_1 from "@/assets/images/shape/title_shape_07.svg";

export const underlineWordElement = (
  string: string,
  start: number,
  end: number = 0
) => {
  if (!end) {
    end = start + 1;
  }

  const words = string.trim().split(/\s+/);

  const modifiedWords = words.map((word, index) => {
    if (index >= start && index < end) {
      return (
        <span
          key={`word-${index}`}
          style={{ position: "relative", display: "inline-block" }}
        >
          {word}
          <Image src={serviceShape_1} alt="" className="lazy-img" />
        </span>
      );
    }
    return word;
  });

  return (
    <>
      {modifiedWords.map((word, index) => (
        <React.Fragment key={`fragment-${index}`}>
          {index > 0 && " "}
          {word}
        </React.Fragment>
      ))}
    </>
  );
};
