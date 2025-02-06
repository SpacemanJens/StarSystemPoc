// Initial angle and speed variables
let angleStars = 0;
let starSpeed = 0.5;

// Planet configuration
const planets = [
    {
        angle: 10,
        baseSpeed: 0.7,
        distance: 400,
        tiltEffect: 0.05,
        baseSize: 40,
        color: [0, 102, 204]
    },
    {
        angle: 90,
        baseSpeed: 0.5,
        distance: 700,
        tiltEffect: 0.08,
        baseSize: 50,
        color: [0, 122, 174]
    },
    {
        angle: 190,
        baseSpeed: 0.4,
        distance: 1100,
        tiltEffect: 0.04,
        baseSize: 45,
        color: [0, 142, 144]
    },
    {
        angle: 270,
        baseSpeed: 0.3,
        distance: 1400,
        tiltEffect: 0.06,
        baseSize: 55,
        color: [0, 162, 114]
    },
    {
        angle: 350,
        baseSpeed: 0.25,
        distance: 1800,
        tiltEffect: 0.03,
        baseSize: 60,
        color: [0, 182, 84]
    }
];

function setup() {
  createCanvas(2500, 1300);
  angleMode(DEGREES);
}

function draw() {
  background(20);
  translate(width / 2 - 600, height / 2);

  let redStarMass = 5;
  let yellowStarMass = 1;
  let totalMass = redStarMass + yellowStarMass;

  let commonCenterX = (yellowStarMass * 120 - redStarMass * 50) / totalMass;
  let commonCenterY = 0;

  let redStarOrbit = 75 * (yellowStarMass / totalMass);
  let yellowStarOrbit = 300 * (redStarMass / totalMass);
  let tiltEffect = 0.15;

  let redStarX = cos(angleStars) * redStarOrbit - commonCenterX;
  let redStarY = sin(angleStars) * redStarOrbit * tiltEffect + commonCenterY;

  let yellowStarX = -cos(angleStars) * yellowStarOrbit - commonCenterX;
  let yellowStarY = -sin(angleStars) * yellowStarOrbit * tiltEffect + commonCenterY;

  let planetsFront = [];
  let planetsBack = [];

  for (let i = 0; i < planets.length; i++) {
    let planet = planets[i];
    let planetX = cos(planet.angle) * planet.distance;
    let planetY = sin(planet.angle) * planet.distance * planet.tiltEffect;
    
    // Calculate distance factor for size and speed adjustment
    let distanceFactor = map(planetY, 0, planet.distance * planet.tiltEffect, 1.5, 0.5);
    let planetSize = planet.baseSize * (4 - distanceFactor);
    
    // Adjust speed based on apparent distance (faster when closer)
    let speedMultiplier = map(distanceFactor, 0.5, 1.5, 1.5, 0.8);
    planet.angle += planet.baseSpeed * speedMultiplier;

    if (planetY < 0) {
      planetsBack.push({ x: planetX, y: planetY, size: planetSize, index: i });
    } else {
      planetsFront.push({ x: planetX, y: planetY, size: planetSize, index: i });
    }
  }

  for (let p of planetsBack) {
    fill(
        planets[p.index].color[0],
        planets[p.index].color[1],
        planets[p.index].color[2]
    );
    noStroke();
    ellipse(p.x, p.y, p.size, p.size);
  }

  if (yellowStarY > 0) {
    drawBackHole(redStarX, redStarY);
    drawYellowStar(yellowStarX, yellowStarY);
  } else {
    drawYellowStar(yellowStarX, yellowStarY);
    drawBackHole(redStarX, redStarY);
  }

/*
  stroke(100);
  noFill();
  for (let i = 0; i < planets.length; i++) {
    beginShape();
    for (let a = 0; a < 360; a++) {
      let x = cos(a) * planets[i].distance;
      let y = sin(a) * planets[i].distance * planets[i].tiltEffect;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
    */

  for (let p of planetsFront) {
    fill(
        planets[p.index].color[0],
        planets[p.index].color[1],
        planets[p.index].color[2]
    );
    noStroke();
    ellipse(p.x, p.y, p.size, p.size);
  }

  angleStars += starSpeed;
}

function drawBackHole(x, y) {
  drawStar(x, y, 1000, 100, 100, 710, 50, 100, 100, 30, 150, 10);
  fill(0);
  circle(x, y, 30);
}

function drawYellowStar(x, y) {
  fill(0);
  circle(x, y, 110);
  drawStar(x, y, 430, 800, 1500, 1010, 50, 550, 300, 400, 300, 0);
}

function drawStar(x, y, hsb2, hsb3, hsb4, hsb5, fill1, fill2, fill3, fill4, cr, coronaEffect) {
  push();
  blendMode(BLEND);
  colorMode(HSB, hsb2, hsb3, hsb4, hsb5);
  blendMode(ADD);
  for (let r = 0; r < 1; r += 0.01) {
    fill(fill1, fill2, fill3, (1.1 - r * 1.2) * fill4);
    circle(x, y, cr * r + random(0, coronaEffect));
  }
  pop();
}