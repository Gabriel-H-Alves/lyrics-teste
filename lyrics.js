
// printLyrics();
const OFFSET = 500; // milissegundos - aumenta ou diminui o tempo geral

const fs = require("fs");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const RESET = "\x1b[0m";
const BRIGHT = "\x1b[1m";
const COLORS = [
  // "\x1b[36m", // ciano
  // "\x1b[35m", // magenta
  // "\x1b[33m", // amarelo
  // "\x1b[32m", // verde
  // "\x1b[34m", // azul
  "\x1b[31m", // vermelho
];

// === LÊ O ARQUIVO .LRC ===
const lrcText = fs.readFileSync("lisboa.lrc", "utf8");

// === CONVERTE .LRC PARA ARRAY DE OBJETOS ===
const lines = lrcText
  .split("\n")
  .map(line => {
    const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
    if (!match) return null;
    const [, min, sec, text] = match;
    const time = parseInt(min) * 60 + parseFloat(sec);
    return { time, text: text.trim() };
  })
  .filter(Boolean);

// === CALCULA DELAYS ENTRE AS LINHAS ===
const lyrics = lines.map(l => l.text);
const SPEED = 0.7; // diminui os intervalos (0.8 = 20% mais rápido)
const delays = lines.map((l, i) => {
  const next = lines[i + 1];
  return next ? (next.time - l.time) * 1000 * SPEED : 3000 * SPEED;
});

// === ANIMAÇÃO DE DIGITAÇÃO COLORIDA ===
async function printLineAnimated(text, color) {
  for (const char of text) {
    process.stdout.write(`${BRIGHT}${color}${char}${RESET}`);
    await sleep(40); // velocidade da digitação (ms)
  }
  console.log();
}

// === MOSTRA AS LETRAS SINCRONIZADAS ===
async function printLyrics() {
  console.clear();
  console.log(`${BRIGHT}\x1b[37m🎵 Lisboa — ANAVITÓRIA ft. Lenine 🎶\n${RESET}`);
  await sleep(1000);

  for (let i = 0; i < lyrics.length; i++) {
    const color = COLORS[i % COLORS.length];
    await printLineAnimated(lyrics[i], color);
    await sleep(delays[i]);
  }

  console.log("\n\x1b[32mFim da música 🌙\x1b[0m");
}

printLyrics();
