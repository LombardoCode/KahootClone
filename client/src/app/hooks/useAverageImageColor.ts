import { FastAverageColor, FastAverageColorResult } from "fast-average-color";
import { useEffect, useRef, useState } from "react";

const useAverageImageColor = () => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [facColor, setFacColor] = useState<FastAverageColorResult | null>(null);
  const [bgColor, setBgColor] = useState<string>("rgb(0, 0, 0)");

  useEffect(() => {
    const fac = new FastAverageColor();
    const img = imgRef.current;
    
    if (!img) {
      return;
    }

    const handleLoad = async () => {
      try {
        const color = await fac.getColorAsync(img);
        setFacColor(color);
        setBgColor(color.rgb);
      } catch (err) {
        console.error(`Error getting average color from image`, err);
      }
    }

    if (img.complete) {
      handleLoad();
    } else {
      img.addEventListener("load", handleLoad);
      return () => img.removeEventListener("load", handleLoad);
    }
  }, []);

  return { imgRef, facColor, bgColor };
}

export default useAverageImageColor;
