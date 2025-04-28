import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { drawRect } from "../assets/js/utilities";
import PredictionHistory from "../components/PredictionHistory";
import header from "../components/header";
import snapshot from "../assets/img/cam.png"
function Detection() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadModelAndHistory = async () => {
      modelRef.current = await cocossd.load();
      const stored = localStorage.getItem("predictions");
      if (stored) setHistory(JSON.parse(stored));
    };
    loadModelAndHistory();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      detect();
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const detect = async () => {
    const video = webcamRef.current?.video;
    const net = modelRef.current;

    if (!video || video.readyState !== 4 || !canvasRef.current || !net) return;

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    webcamRef.current.video.width = videoWidth;
    webcamRef.current.video.height = videoHeight;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const predictions = await net.detect(video);
    const ctx = canvasRef.current.getContext("2d");
    drawRect(predictions, ctx);
  };

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const net = modelRef.current;
    const video = webcamRef.current?.video;
    let predictions = [];

    if (video && video.readyState === 4 && net) {
      predictions = await net.detect(video);
    }

    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();

    const prediction = {
      name: predictions.length > 0
        ? predictions.map(p => p.class).join(", ")
        : "Aucune détection",
      date,
      time,
      image: imageSrc,
      objects: predictions
    };

    const updatedHistory = [...history, prediction];
    localStorage.setItem("predictions", JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
    setImgSrc(imageSrc);
  };

  return (
    <div className="flex  w-full h-screen">
      <div className="bg-[#22333B]">
            <div className="flex flex-col items-center gap-6 p-4">
      <div className="relative w-full min-w-[700px]">
        <Webcam
          ref={webcamRef}
          muted
          screenshotFormat="image/png"
          className="absolute top-0 left-0 w-full h-auto z-8 rounded-lg "
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-auto z-9 rounded-lg"
        />
      </div>

      <button
        onClick={capture}
        className=" - py-2 px-6 rounded-lg shadow z-10 absolute left-15 "
      >
         <img src={snapshot} alt="Description" />
      </button>

      {imgSrc && (
        <img
          src={imgSrc}
          alt="Snapshot"
          className="mt-4 w-80 mx-auto rounded-lg"
        />
      )}
      </div>
      </div>
      


      <div className="bg-[#C4C4C4] noise-bg w-full">
        <PredictionHistory history={history}/>
      </div>
    </div>
  );
}

export default Detection;
