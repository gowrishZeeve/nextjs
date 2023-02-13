import Image, { StaticImageData } from "next/image";
import React, { ReactFragment } from "react";

export interface LoaderProps {
  imagePath: StaticImageData;
  height?: number | string;
  width?: number | string;
  marginTop?: number | string;
  marginLeft?: number | string;
  className?: string;
}

export const Loader = ({
  imagePath,
  height,
  width,
  marginLeft,
  marginTop,
  className,
}: LoaderProps) => {
  const customStyle = () => {
    return `.loaderComponentBackdrop{
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            align-items: center;
            background-color: rgba(0,0,0,0.5);
            z-index: 990;
        }
        .loaderComponentDiv{
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            min-height: 100vh;
        }
        `;
  };

  const sanitizeNumber = (val: number | string) => {
    if (typeof val === "number") return val;

    if (typeof val === "string") {
      let _n = val;
      if (val.endsWith("px")) {
        _n = val.slice(0, val.indexOf("px"));
      }

      return Number(_n);
    }

    return val;
  };

  return (
    <>
      <style>{customStyle()}</style>
      <div className="loaderComponentBackdrop">
        <div
          className={`loaderComponentDiv ${className} `}
          style={{ marginLeft: marginLeft, marginTop: marginTop }}
        >
          <Image
            src={imagePath}
            alt="loader"
            height={sanitizeNumber(height || 0)}
            width={sanitizeNumber(width || 0)}
          />
        </div>
      </div>
    </>
  );
};
