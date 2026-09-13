const math = require('mathjs');
const { generateElements } = require('./geometry.js');

const elements = generateElements();
const numElements = elements.length;
const lambda = 72; 
const k = (2 * Math.PI) / lambda; 

let Z = []; 
function calcDistance(a, b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2) + Math.pow(b.z - a.z, 2));
}

// 1. Build the Z Matrix
for (let i = 0; i < numElements; i++) {
  Z[i] = [];
  for (let j = 0; j < numElements; j++) {
    if (i === j) {
      // UFER GROUND UPGRADE: 
      // Base ring (Level 0) gets 10 ohms per AS/NZS 1768 standard
      // The rest of the lattice stays at 50 ohms
      if (elements[i].level === 0) {
        Z[i][j] = math.complex(10, 0); 
      } else {
        Z[i][j] = math.complex(50, 0); 
      }
    } else {
      let r = calcDistance(elements[i], elements[j]);
      let magnitude = (120 * Math.PI) / r; 
      let phase = -k * r;
      Z[i][j] = math.complex({ r: magnitude, phi: phase }); 
    }
  }
}

// 2. Build the Voltage (V) vector
// We push 1 Volt into the wide top ring (Level 6) to simulate catching an atmospheric wave.
let V = [];
for (let i = 0; i < numElements; i++) {
  if (elements[i].level === 6) {
    V.push([math.complex(1, 0)]);
  } else {
    V.push([math.complex(0, 0)]);
  }
}

// 3. Solve for Current (I = Inverted Z * V)
console.log("Inverting Z matrix to solve for top-down wave compression (10-Ohm Ufer Ground)...");
const Z_inv = math.inv(Z);
const I = math.multiply(Z_inv, V);

// 4. Output the results
console.log("\n--- TOP-DOWN CURRENT DISTRIBUTION (10-OHM UFER GROUND) ---");
console.log(`Top ring  (Level 6, Node 36) [ENTRY]:  ${math.abs(I[36][0]).toFixed(5)} Amps`);
console.log(`Mid ring  (Level 3, Node 18) [FUNNEL]: ${math.abs(I[18][0]).toFixed(5)} Amps`);
console.log(`Base ring (Level 0, Node 0)  [CRUSH]:  ${math.abs(I[0][0]).toFixed(5)} Amps`)

