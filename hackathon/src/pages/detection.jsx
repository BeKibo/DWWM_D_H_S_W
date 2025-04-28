import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { drawRect } from "../assets/js/utilities";
import PredictionHistory from "../components/PredictionHistory";
import snapshot from "../assets/img/cam.png";
import noise from "../assets/img/noise.png";
import noise2 from "../assets/img/noise2.png";
import Sound from "../assets/sound/capture.mp3"; // Importer le son de capture

function Detection() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const [reloadId, setReloadId] = useState(0); // ➔ Pour recharger PredictionHistory

  useEffect(() => {
    const loadModel = async () => {
      modelRef.current = await cocossd.load();
    };
    loadModel();
  }, []);

  // Détection continue
  useEffect(() => {
    let animationFrameId;

    const runDetection = async () => {
      await detect();
      animationFrameId = requestAnimationFrame(runDetection);
    };

    runDetection();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
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

    const playSound = () => {
    const audio = new Audio(Sound); 
    audio.play();
  }

  const uploadSnapshot = async (imageSrc, labels, person = "Unknown") => {
    try {
      const blob = await (await fetch(imageSrc)).blob();
      const formData = new FormData();

      formData.append('snapshot', blob, 'snapshot.png');
      formData.append('person', person);

      if (Array.isArray(labels)) {
        labels.forEach(label => formData.append('labels', label));
      } else {
        formData.append('labels', labels || 'Unknown');
      }

      await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Upload successful');
    } catch (error) {
      console.error('Upload failed', error);
    }
  };

  const capture = async () => {
    const video = webcamRef.current?.video;

    if (!video) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;
    const ctx = tempCanvas.getContext('2d');
    ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

    const imageSrc = tempCanvas.toDataURL('image/png');

    const net = modelRef.current;
    let predictions = [];

    if (video && video.readyState === 4 && net) {
      predictions = await net.detect(video);
    }

    const labels = predictions.length > 0
      ? predictions.map(p => p.class)
      : ["No Detection"];

    await uploadSnapshot(imageSrc, labels);

    setReloadId(prev => prev + 1); // ➔ Recharge uniquement PredictionHistory
  };

  return (
    <div className="flex w-full h-screen">
      {/* Zone caméra */}
      <div className="bg-[#22333B] flex flex-col gap-6 p-4"
        style={{
          backgroundImage: `url(${noise2})`,
      }}
      >
        <div className="relative w-full min-w-[700px]">
          <Webcam
            ref={webcamRef}
            muted
            screenshotFormat="image/png"
            className="top-0 left-0 w-full h-auto z-8 rounded-lg"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-auto z-9 rounded-lg"
          />
        </div>

        {/* Bouton Capture */}
        <button onClick={() => {capture(); playSound();}}
          className="w-20 h-20 mx-5 cursor-pointer">
          <img src={snapshot} alt="Snap Shot" />
        </button>

        {/* Instructions */}
        <div className="text-[#c4c4c4] text-2xl p-5 gap-4 flex flex-col">
          <p>Please position the target object directly in front of the camera, ensuring there are no other items obstructing its visibility.</p>
          <p>After capturing your photo, you will be able to view it on the right along with the following information: Date and Type.</p>
        </div>
      </div>

      {/* Zone historique */}
      <div className="bg-[#C4C4C4]  noise-bg w-full h-screen"
        style={{
          backgroundImage: `url(${noise})`,
      }}

      
      
      >
        <PredictionHistory key={reloadId} /> {/* Key dynamique pour reload */}
      </div>
    </div>
  );
}

export default Detection;
