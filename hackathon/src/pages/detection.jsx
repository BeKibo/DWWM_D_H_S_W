import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { drawRect } from "../assets/js/utilities";
import PredictionHistory from "../components/PredictionHistory";
import snapshot from "../assets/img/cam.png";
import noise from "../assets/img/noise.png";
import noise2 from "../assets/img/noise2.png";
import Sound from "../assets/sound/capture.mp3";

function Detection() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const [reloadId, setReloadId] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        modelRef.current = await cocossd.load();
      } catch (e) {
        console.error("Failed to load model", e);
      }
    };
    loadModel();
  }, []);

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
// permet de détecter les objets en temps réel avec une webcam
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
  };
  

  // Fonction pour envoyer l'image capturée au serveur


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

  // Fonction pour capturer une image de la webcam et l'envoyer au serveur
  // actualise la capture de l'image et l'envoi au serveur
  // et met à jour l'historique de la galerie

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

    const labels = predictions.length > 0 ? predictions.map(p => p.class) : ["No Detection"];

    await uploadSnapshot(imageSrc, labels);

    setReloadId(prev => prev + 1);
  };

  
  return (
    <div className="flex flex-col md:flex-row w-full h-auto min-h-screen"id="bottom">
      {/* Zone caméra */}
      <div
        className="bg-[#22333B] w-full md:w-1/3 flex flex-col gap-6 p-4"
        style={{ backgroundImage: `url(${noise2})` }}
      >
        <div className="flex flex-col gap-6 p-4 w-full">
          <div className="relative w-full min-w-0 mx-auto aspect-video min-h-[200px]" >
            {error ? (
              <div className="flex items-center justify-center text-white text-xl">Camera access denied</div>
            ) : (
              <>
                <Webcam
                  ref={webcamRef}
                  muted
                  screenshotFormat="image/png"
                  className="absolute top-0 left-0 w-full h-full object-cover z-8 rounded-lg"
                  onUserMediaError={() => setError(true)}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full object-cover z-9 rounded-lg pointer-events-none"
                />
              </>
            )}
          </div>

          {/* Bouton Capture */}
          <button
            onClick={() => { capture(); playSound(); }}
            className="w-16 h-16 md:w-20 md:h-20 cursor-pointer mx-5"
          >
            <img src={snapshot} alt="Snap Shot" className="w-full h-full object-contain" />
          </button>

          {/* Instructions */}
          <div className="text-[#c4c4c4] text-base md:text-2xl p-2 md:p-5 gap-4 flex flex-col md:text-left text-center">
            <p>
              Please position the target object directly in front of the camera, ensuring there are no other items obstructing its visibility.
            </p>
            <p>
              After capturing your photo, you will be able to view it on the right along with the following information: Date and Type.
            </p>
          </div>
        </div>
      </div>

      {/* Zone historique */}
      <div
        className="bg-[#C4C4C4] w-full md:w-2/3 min-h-[40vh] md:min-h-screen overflow-y-auto"
        style={{ backgroundImage: `url(${noise})` }}
      >
        <PredictionHistory key={reloadId} />
      </div>
    </div>
  );
}

export default Detection;
