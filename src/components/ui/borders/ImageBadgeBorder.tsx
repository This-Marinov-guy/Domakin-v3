import React from "react";
import Badge from "react-bootstrap/Badge";
import Image from "next/image"; // or <img> if you're not using Next.js

const ImageWithBadge = ({
  label,
  color = "#ff914d",
  src,
  alt,
  ...props
}: any) => {
  return (
    <div className="position-relative d-inline-block text-center">
      <Badge
        bg=""
        className="position-absolute top-0 start-50 translate-middle"
        style={{ zIndex: 1, backgroundColor: color, color: "#fff" }}
      >
        {label}
      </Badge>

      <div
        className="rounded"
        style={{
          border: `5px solid ${color}`,
          overflow: "hidden",
        }}
      >
        <Image src={src} alt={alt} {...props} />
      </div>
    </div>
  );
};

export default ImageWithBadge;
