import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import { drawRect } from "../assets/js/utilities.js";

function Detection() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null); // ✅ pour ne charger qu'une fois le modèle
  const [imgSrc, setImgSrc] = useState(null);
  const [history, setHistory] = useState([]);

  // Chargement initial du modèle + historique
  useEffect(() => {
    const loadModelAndHistory = async () => {
      modelRef.current = await cocossd.load();
      const stored = localStorage.getItem("predictions");
      if (stored) setHistory(JSON.parse(stored));
    };
    loadModelAndHistory();
  }, []);

  // Détection continue
  useEffect(() => {
    const interval = setInterval(() => {
      detect();
    }, 100); // évite de trop solliciter la machine

    return () => clearInterval(interval);
  }, []);

  const detect = async () => {
    const video = webcamRef.current?.video;
    const net = modelRef.current;

    if (
      video &&
      video.readyState === 4 &&
      canvasRef.current &&
      net
    ) {
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Mise à jour des dimensions
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const predictions = await net.detect(video);
      const ctx = canvasRef.current.getContext("2d");
      drawRect(predictions, ctx);
    }
  };

  // Fonction de capture
const capture = async () => {
  const imageSrc = webcamRef.current.getScreenshot(); 
  // setImgSrc(imageSrc); // affichage direct

  const net = modelRef.current;
  const video = webcamRef.current?.video;
  let predictions = [];

  if (video && video.readyState === 4 && net) {
    predictions = await net.detect(video);
  }

  const now = new Date();
const date = now.toLocaleDateString();   // ⬅️ ex: "26/04/2025"
const time = now.toLocaleTimeString();   // ⬅️ ex: "04:00:38"

const prediction = {
  name: predictions.length > 0 ? predictions.map(p => p.class).join(", ") : "Aucune détection",
  date: date,   // ⬅️ juste la date
  time: time,   // ⬅️ juste l'heure
  image: imageSrc,
  objects: predictions
};


  const updatedHistory = [...history, prediction];
  localStorage.setItem("predictions", JSON.stringify(updatedHistory));
  setHistory(updatedHistory);
  };

  return (
    <div className="App">
      <Webcam
        ref={webcamRef}
        muted
        screenshotFormat="image/png"
        width={640}
        height={480}
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 8,
        }}
      />
      <button className="snapshot-btn" onClick={capture}>
        SnapShot
      </button>
      {imgSrc && (
        <img
          src={imgSrc}
          alt="Snapshot"
          style={{ marginTop: 10, width: 320, height: 240 }}
        />
      )}
      {history.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Historique des prédictions</h3>
          <ul>
            {history.map((item, idx) => (
              <li key={idx}>
                <strong>{item.date}</strong> | <strong>{item.time}</strong> - {item.name}

                <br />
                <img src={item.image} alt="Snapshot" style={{ width: 160, margin: 5 }} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Detection;