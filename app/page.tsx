"use client";

import { useState, useEffect, useRef } from "react";
import { FaFileUpload, FaSpinner, FaCopy } from "react-icons/fa";
import Image from "next/image"

interface BoundingBox {
  x_min: number;
  y_min: number;
  x_max: number;
  y_max: number;
}

interface LineData {
  bounding_boxes: BoundingBox[];
  line: number;
}

export default function Home() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [boundingBoxes, setBoundingBoxes] = useState<LineData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [hoveredLine, setHoveredLine] = useState<{ line: number; x: number; y: number } | null>(null);
  const [scalingFactor, setScalingFactor] = useState({ widthScale: 1, heightScale: 1 });
  const imgRef = useRef<HTMLImageElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageDataUrl(URL.createObjectURL(file));
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append(
      "options",
      JSON.stringify({ return_image: false, return_coords: true })
    );

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/process_image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to process image");

      const data: { lines: LineData[] } = await response.json();
      setBoundingBoxes(data.lines);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (boundingBoxes.length) {
      navigator.clipboard.writeText(JSON.stringify(boundingBoxes, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const calculateScalingFactor = () => {
    if (imgRef.current) {
      const renderedWidth = imgRef.current.offsetWidth;
      const renderedHeight = imgRef.current.offsetHeight;
      const actualWidth = imgRef.current.naturalWidth;
      const actualHeight = imgRef.current.naturalHeight;

      const widthScale = renderedWidth / actualWidth;
      const heightScale = renderedHeight / actualHeight;

      setScalingFactor({ widthScale, heightScale });
    }
  };

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.onload = calculateScalingFactor;
    }
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-12 bg-gray-100 relative">
      <main className="flex flex-col items-center gap-12 w-full max-w-6xl">
        <h1 className="text-6xl font-extrabold text-gray-900">Extract Lines From Document</h1>
        <label className="flex items-center justify-center cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6 px-8 rounded-lg">
          <FaFileUpload className="mr-4 text-3xl" />
          <span className="text-2xl">Upload Image</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>

        {loading && (
          <div className="mt-6 text-center text-gray-700 flex flex-col items-center">
            <FaSpinner className="animate-spin text-5xl mb-4" />
            <p className="text-2xl">Processing image, please wait...</p>
          </div>
        )}

        <div className="flex flex-row items-center gap-12 w-full">
          {imageDataUrl && !loading && (
            <div className="relative p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl min-h-[750px]">
              <Image
                width={750}
                height={750}
                src={imageDataUrl}
                alt="Uploaded document"
                className="w-full h-auto"
                ref={imgRef}
              />
            <svg
              ref={svgRef}
              className="absolute top-0 left-0 w-full h-full"
            >
              {boundingBoxes.map(({ bounding_boxes, line }, index) => {
                const sortedBoxes = bounding_boxes.sort((a, b) => a.x_min - b.x_min);
                const firstBox = sortedBoxes[0];
                const lastBox = sortedBoxes[sortedBoxes.length - 1];

                // Coordinates for the polygon: top-left of first word, top-right of last word,
                // bottom-right of last word, bottom-left of first word
                const points = [
                  `${(firstBox.x_min * scalingFactor.widthScale) + 24},${(firstBox.y_min * scalingFactor.heightScale) + 24}`,
                  `${(lastBox.x_max * scalingFactor.widthScale) + 24},${(lastBox.y_min * scalingFactor.heightScale) + 24}`,
                  `${(lastBox.x_max * scalingFactor.widthScale) + 24},${(lastBox.y_max * scalingFactor.heightScale) + 24}`,
                  `${(firstBox.x_min * scalingFactor.widthScale) + 24},${(firstBox.y_max * scalingFactor.heightScale) + 24}`,
                ].join(" ");

                return (
                  <polygon
                    key={index}
                    points={points}
                    fill="transparent"
                    stroke="red"
                    strokeWidth="2"
                    className="hover-stroke"
                    onMouseOver={(e) => {
                      setHoveredLine({ line, x: firstBox.x_min * scalingFactor.widthScale, y: firstBox.y_min * scalingFactor.heightScale });
                      e.currentTarget.setAttribute("stroke", "blue");
                      e.currentTarget.setAttribute("stroke-width", "4");
                    }}
                    onMouseLeave={(e) => {
                      setHoveredLine(null);
                      e.currentTarget.setAttribute("stroke", "red");
                      e.currentTarget.setAttribute("stroke-width", "2");
                    }}
                  />
                );
              })}

              {hoveredLine !== null && (
                <>
                  <rect
                    x={hoveredLine.x + 24}  // Positioning it near the top-left of the bounding box
                    y={hoveredLine.y -6}
                    width="100"
                    height="30"
                    fill="white"
                    stroke="black"
                    strokeWidth="1"
                  />
                  <text
                    x={hoveredLine.x + 30}
                    y={hoveredLine.y + 14}
                    fill="black"
                    fontSize="16"
                    fontWeight="bold"
                  >
                    Line {hoveredLine.line}
                  </text>
                </>
              )}
            </svg>
            </div>
          )}

          <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-2xl min-h-[750px] overflow-auto">
            <h3 className="text-2xl font-medium mb-6">Bounding Box Data (JSON)</h3>
            <pre className="overflow-auto max-h-[1020px] text-lg">
              {JSON.stringify(boundingBoxes, null, 2)}
            </pre>
            <button
              onClick={handleCopy}
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg mt-6 text-xl"
            >
              <FaCopy className="text-2xl" />
              {copied ? "Copied!" : "Copy JSON"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
