
const classColors = {};
const colorTimers = {};
const COLOR_REFRESH_DELAY = 1000;

function generatePastelColor() {
  const r = Math.floor(Math.random() * 100 + 100);
  const g = Math.floor(Math.random() * 100 + 100);
  const b = Math.floor(Math.random() * 100 + 100);
  return `rgb(${r}, ${g}, ${b})`;
}

export const drawRect = (detections, ctx) => {
  const now = Date.now();

  detections.forEach(prediction => {
    const [x, y, width, height] = prediction['bbox'];
    const text = prediction['class'];

    if (!classColors[text] || now - colorTimers[text] > COLOR_REFRESH_DELAY) {
      classColors[text] = generatePastelColor();
      colorTimers[text] = now;
    }

    const color = classColors[text];
    const label = text.toUpperCase();

    ctx.font = '18px Arial';
    ctx.lineWidth = 2;

    // Fond du texte
    const textWidth = ctx.measureText(label).width;
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(x - 2, y - 24, textWidth + 6, 20);

    // Texte
    ctx.fillStyle = color;
    ctx.fillText(label, x, y - 8);

    const cornerLength = 60;
    ctx.strokeStyle = color;

    // Coins stylisés
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
