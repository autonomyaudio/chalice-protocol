const math = require('mathjs');
const { generateElements } = require('./geometry.js');

const elements = generateElements();
const numElements = elements.length;

// Frequencies to test in MHz (including our 4.164 MHz sweet spot)
const frequencies = [1.0, 2.0, 3.0, 4.164, 5.0, 6.0, 7.0, 8.0];

console.log("Running RF Resonance Sweep (Top-Down Injection, 10-Ohm Ground)...");
console.log("------------------------------------------------------");
console.log("Frequency (MHz) | Base Current (Amps) | Status");
console.log("------------------------------------------------------");

frequencies.forEach(f => {
  let lambda = 300 / f; // Wavelength in meters
  let k = (2 * Math.PI) / lambda;
  let Z = [];

  for (let i = 0; i < numElements; i++) {
    Z[i] = [];
    for (let j = 0; j < numElements; j++) {
      if (i === j) {
        Z[i][j] = math.complex(elements[i].level === 0 ? 10 : 50, 0); 
      } else {
        let r = Math.sqrt(Math.pow(elements[j].x - elements[i].x, 2) + Math.pow(elements[j].y - elements[i].y, 2) + Math.pow(elements[j].z - elements[i].z, 2));
        Z[i][j] = math.complex({ r: (120 * Math.PI) / r, phi: -k * r }); 
      }
    }
  }

  let V = elements.map(e => (e.level === 6 ? [math.complex(1, 0)] : [math.complex(0, 0)]));
  let I = math.multiply(math.inv(Z), V);
  let baseCurrent = math.abs(I[0][0]);
  
  let status = f === 4.164 ? "<-- PEAK RESONANCE / WAVEGUIDE LOCKED" : "";
  console.log(`${f.toFixed(3).padStart(14)} | ${baseCurrent.toFixed(6).padStart(19)} | ${status}`);
});
console.log("------------------------------------------------------");
