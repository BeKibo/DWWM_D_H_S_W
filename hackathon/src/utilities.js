import { upcastType } from "@tensorflow/tfjs";

const classColors = {};
const colorTimers = {};
const COLOR_REFRESH_DELAY = 1000; // 10 secondes

function generatePastelColor() {
  const r = Math.floor(Math.random() * 100 + 200); // 120–200
  const g = Math.floor(Math.random() * 100 + 200);
  const b = Math.floor(Math.random() * 100 + 200);
  return `rgb(${r}, ${g}, ${b})`;
}

export const drawRect = (detections, ctx) => {
  const now = Date.now();

  detections.forEach(prediction => {
    const [x, y, width, height] = prediction['bbox'];
    const text = prediction['class'];

    ctx.font = '18px Arial';
    ctx.lineWidth = 4;

    // ⏱ Si la couleur n'existe pas ou est trop vieille, on la met à jour
    if (!classColors[text] || now - colorTimers[text] > COLOR_REFRESH_DELAY) {
      classColors[text] = generatePastelColor();
      colorTimers[text] = now;
    }

    const color = classColors[text];
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    // 📝 Texte
   ctx.fillText(text.toUpperCase(), x, y - 8);

 
    const cornerLength = 60;

    // 🔲 Coins caméra
    ctx.beginPath();
    ctx.moveTo(x, y + cornerLength);
    ctx.lineTo(x, y);
    ctx.lineTo(x + cornerLength, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + width - cornerLength, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + cornerLength);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y + height - cornerLength);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + cornerLength, y + height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + width - cornerLength, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width, y + height - cornerLength);
    ctx.stroke();
  });
};
