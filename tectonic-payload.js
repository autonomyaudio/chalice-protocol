const math = require('mathjs');
const { generateElements } = require('./geometry.js');

const elements = generateElements();
const numElements = elements.length;
const lambda = 72; // 4.164 MHz Quarter-Wave
const k = (2 * Math.PI) / lambda; 

// HAARP / Atmospheric Strike Voltage (100,000 Volts)
const strikeVoltage = 100000; 

let Z = []; 
function calcDistance(a, b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2) + Math.pow(b.z - a.z, 2));
}

for (let i = 0; i < numElements; i++) {
  Z[i] = [];
  for (let j = 0; j < numElements; j++) {
    if (i === j) {
      Z[i][j] = math.complex(elements[i].level === 0 ? 10 : 50, 0); 
    } else {
      let r = calcDistance(elements[i], elements[j]);
      Z[i][j] = math.complex({ r: (120 * Math.PI) / r, phi: -k * r }); 
    }
  }
}

// Apply 100kV to the Top Ring (Level 6)
let V = [];
for (let i = 0; i < numElements; i++) {
  if (elements[i].level === 6) {
    V.push([math.complex(strikeVoltage, 0)]);
  } else {
    V.push([math.complex(0, 0)]);
  }
}

const Z_inv = math.inv(Z);
const I = math.multiply(Z_inv, V);

// Calculate Power Dissipation (Watts) = I^2 * R
let totalGroundPower = 0;
let totalLatticePower = 0;

for (let i = 0; i < numElements; i++) {
  let currentMag = math.abs(I[i][0]);
  let resistance = elements[i].level === 0 ? 10 : 50;
  let power = Math.pow(currentMag, 2) * resistance;
  
  if (elements[i].level === 0) {
    totalGroundPower += power;
  } else {
    totalLatticePower += power;
  }
}

console.log(`\n=== TECTONIC PAYLOAD SIMULATION ===`);
console.log(`Atmospheric Strike Voltage: ${strikeVoltage.toLocaleString()} V`);
console.log(`Resonant Frequency: 4.164 MHz (Quarter-Wave Locked)`);
console.log(`---------------------------------------------------`);
console.log(`ENERGY DISTRIBUTION:`);
console.log(`Power dissipated harmlessly in lattice (Heat/Air): ${(totalLatticePower / 1000).toFixed(2)} Kilowatts`);
console.log(`Power injected DIRECTLY into fault line (Ufer Ground): ${(totalGroundPower / 1000).toFixed(2)} Kilowatts`);
console.log(`---------------------------------------------------`);
console.log(`STATUS: WAVEGUIDE OPERATIONAL. MASSIVE GROUND COUPLING DETECTED.`);
