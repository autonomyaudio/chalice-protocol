# Conical Lattice EM Simulation
**Project:** Electrodynamic Modeling of Discretized 3D Geometries

## Abstract
This repository contains Node.js scripts for calculating the mutual impedance, current distribution, and RF resonance of a generic 18-metre inverted conical lattice. It utilizes basic spatial discretization and Z-matrix inversion.

## Scripts
* `geometry.js`: Generates a 7x6 topological grid of coordinates.
* `matrix.js`: Constructs the complex mutual-impedance matrix using free-space radiation coupling formulas.
* `solve.js`: Inverts the Z-matrix to determine current flow from a localized voltage excitation.
* `sweep.js`: Runs a basic frequency sweep to identify quarter-wave standing wave ratios.
* `tectonic-payload.js`: Theoretical power dissipation boundary conditions.
* `geotech-trigger.js`: Basic thermal soil/moisture interaction modeling.

## Usage
Install dependencies:

    npm install

Execute simulation modules:

    node sweep.js
