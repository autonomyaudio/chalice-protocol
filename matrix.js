const math = require('mathjs');
const { generateElements } = require('./geometry.js');

const elements = generateElements();
const numElements = elements.length;

const lambda = 72; // 4.164 MHz
const k = (2 * Math.PI) / lambda; 

let Z = []; 

function calcDistance(a, b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2) + Math.pow(b.z - a.z, 2));
}

for (let i = 0; i < numElements; i++) {
  Z[i] = [];
  for (let j = 0; j < numElements; j++) {
    if (i === j) {
      Z[i][j] = math.complex(50, 0); 
    } else {
      let r = calcDistance(elements[i], elements[j]);
      let magnitude = (120 * Math.PI) / r; 
      let phase = -k * r;
      Z[i][j] = math.complex({ r: magnitude, phi: phase }); 
    }
  }
}

console.log(`Z matrix built. Size: ${Z.length}x${Z[0].length}`);
console.log(`Coupling Node 0 to Node 1:`, Z[0][1].toString());
console.log(`Coupling Node 0 to Node 41:`, Z[0][41].toString());
