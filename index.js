// prompt the user for input
function readCoordinates(promptText) {
    const coordinates = [];
    let input;
    while ((input = prompt(promptText)) !== "done") {
        const parts = input.split(" ");
        if (parts.length === 2) {
            const x = parseInt(parts[0]);
            const y = parseInt(parts[1]);
            if (!isNaN(x) && !isNaN(y)) {
                coordinates.push([x, y]);
            } else {
                alert("Invalid input, please enter coordinates in format: x y");
            }
        } else {
            alert("Invalid input, please enter coordinates in format: x y");
        }
    }
    return coordinates;
}

function processFlight(flight, ...occupiedSets) {
    const adjustedFlight = [];
    const occupied = new Set();

    // Add initial coordinate to the path
    let [x, y] = flight[0];
    adjustedFlight.push([x, y]);
    occupied.add(`${x},${y}`);

    // Add coordinates from all sets
    occupiedSets.forEach(set => set.forEach(item => occupied.add(item)));

    // Iterate through each coordinate, starting from the second one
    for (let i = 1; i < flight.length; i++) {
        let [nextX, nextY] = flight[i];
        let [prevX, prevY] = adjustedFlight[adjustedFlight.length - 1];

        while (prevX !== nextX || prevY !== nextY) {
            if (prevX < nextX) prevX++;
            else if (prevX > nextX) prevX--;
            else if (prevY < nextY) prevY++;
            else if (prevY > nextY) prevY--;

            while (occupied.has(`${prevX},${prevY}`)) {
                if (prevY < nextY || prevY === y) prevY++;
                else if (prevY > nextY) prevY--;
                else if (prevX < nextX || prevX === x) prevX++;
                else if (prevX > nextX) prevX--;
            }

            adjustedFlight.push([prevX, prevY]);
            occupied.add(`${prevX},${prevY}`);
        }

        adjustedFlight.push([nextX, nextY]);
        occupied.add(`${nextX},${nextY}`);
    }

    return adjustedFlight;
}

function drawFlightPaths(contextCanva, flights) {
    const colors = ['red', 'green', 'blue'];

    flights.forEach((flight, index) => {
        contextCanva.strokeStyle = colors[index];
        contextCanva.lineWidth = 2;

        contextCanva.beginPath();
        flight.forEach(([x, y], idx) => {
            const offsetX = x * 50;
            const offsetY = y * 50;

            if (idx === 0) {
                contextCanva.moveTo(offsetX, offsetY);
            } else {
                contextCanva.lineTo(offsetX, offsetY);
            }
        });
        contextCanva.stroke();
    });
}

// Read coordinates for flights
const flight1 = readCoordinates("Enter coordinates for Flight 1 (format: x y, enter 'done' to finish):");
const flight2 = readCoordinates("Enter coordinates for Flight 2 (format: x y, enter 'done' to finish):");
const flight3 = readCoordinates("Enter coordinates for Flight 3 (format: x y, enter 'done' to finish):");

// Track coordinates occupied by flights
const coordinateFlight1 = new Set();
const coordinateFlight2 = new Set();
const coordinateFlight3 = new Set();

// Process flights
const Flight1 = processFlight(flight1, coordinateFlight1);
const Flight2 = processFlight(flight2, coordinateFlight1, coordinateFlight2);
const Flight3 = processFlight(flight3, coordinateFlight1, coordinateFlight2, coordinateFlight3);

// Get canvas and context
const canvas = document.getElementById('flightCanvas');
const contextCanva = canvas.getContext('2d');

// Draw flight paths
drawFlightPaths(contextCanva, [Flight1, Flight2, Flight3]);