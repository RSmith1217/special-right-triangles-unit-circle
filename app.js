const svg = document.querySelector("#geometryCanvas");
const triangleGroup = document.querySelector("#triangleGroup");
const triangleFill = document.querySelector("#triangleFill");
const horizontalLeg = document.querySelector("#horizontalLeg");
const verticalLeg = document.querySelector("#verticalLeg");
const hypotenuse = document.querySelector("#hypotenuse");
const rightAngleMark = document.querySelector("#rightAngleMark");
const dragHitArea = document.querySelector("#dragHitArea");
const dragHandle = document.querySelector("#dragHandle");
const rightVertex = document.querySelector("#rightVertex");
const legALabel = document.querySelector("#legALabel");
const legBLabel = document.querySelector("#legBLabel");
const hypotenuseLabel = document.querySelector("#hypotenuseLabel");
const triangleName = document.querySelector("#triangleName");
const specialPointsLayer = document.querySelector("#specialPoints");
const statusText = document.querySelector("#statusText");
const interactionHint = document.querySelector("#interactionHint");
const angleButtons = document.querySelector("#angleButtons");
const resetButton = document.querySelector("#resetButton");
const liveMessage = document.querySelector("#liveMessage");

const output = {
  degree: document.querySelector("#degreeValue"),
  radian: document.querySelector("#radianValue"),
  quadrant: document.querySelector("#quadrantBadge"),
  quadrantValue: document.querySelector("#quadrantValue"),
  referenceDegree: document.querySelector("#referenceDegree"),
  referenceRadian: document.querySelector("#referenceRadian"),
  coordinate: document.querySelector("#coordinateValue"),
  sin: document.querySelector("#sinValue"),
  cos: document.querySelector("#cosValue"),
  tan: document.querySelector("#tanValue"),
  csc: document.querySelector("#cscValue"),
  sec: document.querySelector("#secValue"),
  cot: document.querySelector("#cotValue"),
};

const center = { x: 450, y: 290 };
const circleRadius = 220;
const snapTolerance = 3;
const svgNamespace = "http://www.w3.org/2000/svg";
const quadrantalAngles = [0, 90, 180, 270];
const allSpecialAngles = [
  0, 30, 45, 60, 90, 120, 135, 150,
  180, 210, 225, 240, 270, 300, 315, 330,
];

const exactValues = {
  0: {
    radian: "0", coordinate: "(1, 0)",
    sin: "0", cos: "1", tan: "0",
    csc: "undefined", sec: "1", cot: "undefined",
  },
  30: {
    radian: "π/6", coordinate: "(√3/2, 1/2)",
    sin: "1/2", cos: "√3/2", tan: "√3/3",
    csc: "2", sec: "2√3/3", cot: "√3",
  },
  45: {
    radian: "π/4", coordinate: "(√2/2, √2/2)",
    sin: "√2/2", cos: "√2/2", tan: "1",
    csc: "√2", sec: "√2", cot: "1",
  },
  60: {
    radian: "π/3", coordinate: "(1/2, √3/2)",
    sin: "√3/2", cos: "1/2", tan: "√3",
    csc: "2√3/3", sec: "2", cot: "√3/3",
  },
  90: {
    radian: "π/2", coordinate: "(0, 1)",
    sin: "1", cos: "0", tan: "undefined",
    csc: "1", sec: "undefined", cot: "0",
  },
  120: {
    radian: "2π/3", coordinate: "(−1/2, √3/2)",
    sin: "√3/2", cos: "−1/2", tan: "−√3",
    csc: "2√3/3", sec: "−2", cot: "−√3/3",
  },
  135: {
    radian: "3π/4", coordinate: "(−√2/2, √2/2)",
    sin: "√2/2", cos: "−√2/2", tan: "−1",
    csc: "√2", sec: "−√2", cot: "−1",
  },
  150: {
    radian: "5π/6", coordinate: "(−√3/2, 1/2)",
    sin: "1/2", cos: "−√3/2", tan: "−√3/3",
    csc: "2", sec: "−2√3/3", cot: "−√3",
  },
  180: {
    radian: "π", coordinate: "(−1, 0)",
    sin: "0", cos: "−1", tan: "0",
    csc: "undefined", sec: "−1", cot: "undefined",
  },
  210: {
    radian: "7π/6", coordinate: "(−√3/2, −1/2)",
    sin: "−1/2", cos: "−√3/2", tan: "√3/3",
    csc: "−2", sec: "−2√3/3", cot: "√3",
  },
  225: {
    radian: "5π/4", coordinate: "(−√2/2, −√2/2)",
    sin: "−√2/2", cos: "−√2/2", tan: "1",
    csc: "−√2", sec: "−√2", cot: "1",
  },
  240: {
    radian: "4π/3", coordinate: "(−1/2, −√3/2)",
    sin: "−√3/2", cos: "−1/2", tan: "√3",
    csc: "−2√3/3", sec: "−2", cot: "√3/3",
  },
  270: {
    radian: "3π/2", coordinate: "(0, −1)",
    sin: "−1", cos: "0", tan: "undefined",
    csc: "−1", sec: "undefined", cot: "0",
  },
  300: {
    radian: "5π/3", coordinate: "(1/2, −√3/2)",
    sin: "−√3/2", cos: "1/2", tan: "−√3",
    csc: "−2√3/3", sec: "2", cot: "−√3/3",
  },
  315: {
    radian: "7π/4", coordinate: "(√2/2, −√2/2)",
    sin: "−√2/2", cos: "√2/2", tan: "−1",
    csc: "−√2", sec: "√2", cot: "−1",
  },
  330: {
    radian: "11π/6", coordinate: "(√3/2, −1/2)",
    sin: "−1/2", cos: "√3/2", tan: "−√3/3",
    csc: "−2", sec: "2√3/3", cot: "−√3",
  },
};

let state = {
  angle: 45,
  dragging: false,
  pointerId: null,
};

function toSvgPoint(event) {
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  return point.matrixTransform(svg.getScreenCTM().inverse());
}

function polarPoint(angle, radius = circleRadius) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: center.x + radius * Math.cos(radians),
    y: center.y - radius * Math.sin(radians),
  };
}

function angleFromPoint(point) {
  let angle =
    (Math.atan2(center.y - point.y, point.x - center.x) * 180) / Math.PI;
  if (angle < 0) angle += 360;
  return angle;
}

function angularDistance(a, b) {
  return Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
}

function snapAngle(angle) {
  const nearest = allSpecialAngles.reduce((best, candidate) =>
    angularDistance(angle, candidate) < angularDistance(angle, best)
      ? candidate
      : best,
  );
  return angularDistance(angle, nearest) <= snapTolerance ? nearest : angle;
}

function setLine(line, a, b) {
  line.setAttribute("x1", a.x);
  line.setAttribute("y1", a.y);
  line.setAttribute("x2", b.x);
  line.setAttribute("y2", b.y);
}

function setText(element, point, text) {
  element.setAttribute("x", point.x);
  element.setAttribute("y", point.y);
  element.textContent = text;
}

function mathAtomMarkup(value) {
  if (value === "undefined" || value === "not applicable" || value === "on an axis") {
    return `<mtext>${value}</mtext>`;
  }
  const radicalMatch = value.match(/^(\d*)√(\d+)$/);
  if (radicalMatch) {
    const coefficient = radicalMatch[1] || "";
    return `<mrow>${coefficient ? `<mn>${coefficient}</mn>` : ""}<msqrt><mrow><mspace width="0" height="0.14em"></mspace><mn>${radicalMatch[2]}</mn></mrow></msqrt></mrow>`;
  }
  const piMatch = value.match(/^(\d*)π$/);
  if (piMatch) {
    return `<mrow>${piMatch[1] ? `<mn>${piMatch[1]}</mn>` : ""}<mi>π</mi></mrow>`;
  }
  if (/^-?\d*\.?\d+$/.test(value)) return `<mn>${value}</mn>`;
  return `<mtext>${value}</mtext>`;
}

function mathBodyMarkup(value) {
  const raw = String(value);
  if (raw.startsWith("≈ ")) {
    return `<mrow><mo>≈</mo>${mathBodyMarkup(raw.slice(2))}</mrow>`;
  }
  const negative = raw.startsWith("−");
  const unsigned = negative ? raw.slice(1) : raw;
  const slashIndex = unsigned.indexOf("/");
  const sign = negative ? "<mo>−</mo>" : "";

  if (slashIndex !== -1) {
    const numerator = unsigned.slice(0, slashIndex);
    const denominator = unsigned.slice(slashIndex + 1);
    return `<mrow>${sign}<mfrac>${mathAtomMarkup(numerator)}${mathAtomMarkup(denominator)}</mfrac></mrow>`;
  }
  return `<mrow>${sign}${mathAtomMarkup(unsigned)}</mrow>`;
}

function mathMarkup(value) {
  return `<math xmlns="http://www.w3.org/1998/Math/MathML">${mathBodyMarkup(value)}</math>`;
}

function coordinateMarkup(value) {
  const match = String(value).match(/^\((.*), (.*)\)$/);
  if (!match) return mathMarkup(value);
  return `<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>(</mo>${mathBodyMarkup(match[1])}<mo>,</mo>${mathBodyMarkup(match[2])}<mo>)</mo></mrow></math>`;
}

function setMathPosition(element, point, value) {
  const width = Number(element.getAttribute("width")) || 120;
  const height = Number(element.getAttribute("height")) || 46;
  element.setAttribute("x", point.x - width / 2);
  element.setAttribute("y", point.y - height / 2);
  element.querySelector(".svg-math").innerHTML = mathMarkup(value);
}

function cleanNumber(value, digits = 3) {
  if (Math.abs(value) < 0.0005) return "0";
  return value.toFixed(digits).replace(/\.?0+$/, "");
}

function anglePosition(angle) {
  if (angle === 0 || angle === 360) {
    return { name: "Positive x-axis", roman: "Axis", reference: null };
  }
  if (angle === 90) {
    return { name: "Positive y-axis", roman: "Axis", reference: null };
  }
  if (angle === 180) {
    return { name: "Negative x-axis", roman: "Axis", reference: null };
  }
  if (angle === 270) {
    return { name: "Negative y-axis", roman: "Axis", reference: null };
  }
  if (angle < 90) return { name: "Quadrant I", roman: "I", reference: angle };
  if (angle < 180) {
    return { name: "Quadrant II", roman: "II", reference: 180 - angle };
  }
  if (angle < 270) {
    return { name: "Quadrant III", roman: "III", reference: angle - 180 };
  }
  return { name: "Quadrant IV", roman: "IV", reference: 360 - angle };
}

function currentValues() {
  const roundedAngle = Math.round(state.angle);
  const exact =
    allSpecialAngles.includes(roundedAngle) &&
    Math.abs(state.angle - roundedAngle) < 0.001 &&
    exactValues[roundedAngle];
  const radians = (state.angle * Math.PI) / 180;
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);
  const tan = Math.abs(cos) < 0.0005 ? null : sin / cos;
  const position = anglePosition(state.angle);

  if (exact) {
    return {
      ...exact,
      degree: `${roundedAngle}°`,
      position,
      referenceDegree:
        position.reference === null
          ? "not applicable"
          : `${cleanNumber(position.reference, 1)}°`,
      referenceRadian:
        position.reference === null
          ? "on an axis"
          : position.reference === 30
          ? "π/6"
          : position.reference === 45
            ? "π/4"
            : "π/3",
      exact: true,
    };
  }

  const referenceRadians =
    position.reference === null ? null : (position.reference * Math.PI) / 180;
  return {
    degree: `${cleanNumber(state.angle, 1)}°`,
    radian: `≈ ${cleanNumber(state.angle / 180, 2)}π`,
    coordinate: `(${cleanNumber(cos)}, ${cleanNumber(sin)})`,
    sin: cleanNumber(sin),
    cos: cleanNumber(cos),
    tan: tan === null ? "undefined" : cleanNumber(tan),
    csc: Math.abs(sin) < 0.0005 ? "undefined" : cleanNumber(1 / sin),
    sec: Math.abs(cos) < 0.0005 ? "undefined" : cleanNumber(1 / cos),
    cot: Math.abs(sin) < 0.0005 ? "undefined" : cleanNumber(cos / sin),
    position,
    referenceDegree:
      position.reference === null
        ? "not applicable"
        : `${cleanNumber(position.reference, 1)}°`,
    referenceRadian:
      position.reference === null
        ? "on an axis"
        : `≈ ${cleanNumber(referenceRadians / Math.PI, 2)}π`,
    exact: false,
  };
}

function renderDockedTriangle() {
  const point = polarPoint(state.angle);
  const projection = { x: point.x, y: center.y };
  const horizontalSign = Math.sign(point.x - center.x) || 1;
  const verticalSign = Math.sign(point.y - center.y) || 1;
  const values = currentValues();

  triangleFill.setAttribute(
    "points",
    `${center.x},${center.y} ${projection.x},${projection.y} ${point.x},${point.y}`,
  );
  setLine(horizontalLeg, center, projection);
  setLine(verticalLeg, projection, point);
  setLine(hypotenuse, center, point);
  rightAngleMark.setAttribute(
    "d",
    `M${projection.x - horizontalSign * 15} ${projection.y} ` +
      `V${projection.y + verticalSign * 15} H${projection.x}`,
  );
  dragHandle.setAttribute("cx", point.x);
  dragHandle.setAttribute("cy", point.y);
  dragHitArea.setAttribute("cx", point.x);
  dragHitArea.setAttribute("cy", point.y);
  rightVertex.setAttribute("cx", center.x);
  rightVertex.setAttribute("cy", center.y);
  setMathPosition(
    legALabel,
    {
      x: (center.x + projection.x) / 2,
      y: center.y + (verticalSign < 0 ? 28 : -14),
    },
    values.cos,
  );
  setMathPosition(
    legBLabel,
    {
      x: projection.x + (horizontalSign > 0 ? 42 : -42),
      y: (projection.y + point.y) / 2 + 5,
    },
    values.sin,
  );
  setMathPosition(
    hypotenuseLabel,
    {
      x: (center.x + point.x) / 2 - verticalSign * 18,
      y: (center.y + point.y) / 2 - horizontalSign * 14,
    },
    "1",
  );
  setText(
    triangleName,
    {
      x: (center.x + projection.x) / 2,
      y: center.y + (verticalSign < 0 ? 54 : -38),
    },
    values.exact
      ? `${values.referenceDegree} reference triangle`
      : "dynamic reference triangle",
  );
}

function makeSvgElement(tag, attributes = {}) {
  const element = document.createElementNS(svgNamespace, tag);
  Object.entries(attributes).forEach(([name, value]) =>
    element.setAttribute(name, value),
  );
  return element;
}

function buildSpecialPoints() {
  specialPointsLayer.replaceChildren(
    ...allSpecialAngles.map((angle) => {
      const point = polarPoint(angle);
      const radians = (angle * Math.PI) / 180;
      const radial = {
        x: Math.cos(radians),
        y: -Math.sin(radians),
      };
      const degreePoint = {
        x: point.x + radial.x * 48,
        y: point.y + radial.y * 48,
      };
      const coordinatePoint = {
        x: Math.max(
          100,
          Math.min(
            800,
            point.x +
              radial.x * 125 +
              (angle === 90 || angle === 270 ? 115 : 0),
          ),
        ),
        y: Math.max(35, Math.min(545, point.y + radial.y * 125)),
      };
      const group = makeSvgElement("g", {
        class: `special-point${quadrantalAngles.includes(angle) ? " quadrantal-point" : ""}`,
        "data-special-angle": angle,
      });
      group.append(
        makeSvgElement("circle", {
          class: "point-ring",
          cx: point.x,
          cy: point.y,
          r: 17,
        }),
        makeSvgElement("circle", {
          class: "point-dot",
          cx: point.x,
          cy: point.y,
          r: 7,
        }),
      );
      const degree = makeSvgElement("text", {
        class: "point-degree",
        x: degreePoint.x,
        y: degreePoint.y + 4,
        "text-anchor": "middle",
      });
      degree.textContent = `${angle}°`;
      const coordinate = makeSvgElement("foreignObject", {
        class: "point-coordinate",
        x: coordinatePoint.x - 90,
        y: coordinatePoint.y - 23,
        width: 180,
        height: 46,
      });
      const coordinateDiv = document.createElement("div");
      coordinateDiv.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
      coordinateDiv.className = "svg-coordinate align-center";
      coordinateDiv.innerHTML = coordinateMarkup(exactValues[angle].coordinate);
      coordinate.append(coordinateDiv);
      group.append(degree, coordinate);
      return group;
    }),
  );
}

function updateSpecialPoints() {
  document.querySelectorAll("[data-special-angle]").forEach((point) => {
    const angle = Number(point.dataset.specialAngle);
    point.classList.toggle("active", angularDistance(state.angle, angle) < 0.01);
  });
}

function updateValues() {
  const values = currentValues();
  output.degree.textContent = values.degree;
  output.radian.innerHTML = mathMarkup(values.radian);
  output.quadrant.textContent = values.position.name;
  output.quadrantValue.textContent = values.position.roman;
  output.referenceDegree.textContent = values.referenceDegree;
  output.referenceRadian.innerHTML = mathMarkup(values.referenceRadian);
  output.coordinate.innerHTML = coordinateMarkup(values.coordinate);
  ["sin", "cos", "tan", "csc", "sec", "cot"].forEach((key) => {
    output[key].innerHTML = mathMarkup(values[key]);
  });
  document.querySelectorAll("[data-angle]").forEach((button) => {
    button.classList.toggle(
      "active",
      angularDistance(state.angle, Number(button.dataset.angle)) < 0.01,
    );
  });
}

function render() {
  renderDockedTriangle();
  updateValues();
  updateSpecialPoints();
}

function reset() {
  state = {
    angle: 45,
    dragging: false,
    pointerId: null,
  };
  interactionHint.textContent = "16 exact snap points";
  statusText.textContent = "Reset to 45° — drag the blue point";
  liveMessage.textContent = "The reference triangle has been reset to 45 degrees.";
  render();
}

function renderAngleButtons() {
  angleButtons.replaceChildren(
    ...allSpecialAngles.map((angle) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.angle = angle;
      button.textContent = `${angle}°`;
      button.addEventListener("click", () => {
        state.angle = angle;
        statusText.textContent = `${angle}° — exact radical values`;
        render();
      });
      return button;
    }),
  );
}

triangleGroup.addEventListener("pointerdown", (event) => {
  if (event.target !== dragHandle && event.target !== dragHitArea) return;
  event.preventDefault();
  const point = toSvgPoint(event);
  state.dragging = true;
  state.pointerId = event.pointerId;
  triangleGroup.classList.add("is-dragging");
  triangleGroup.setPointerCapture(event.pointerId);
  state.angle = snapAngle(angleFromPoint(point));
  render();
});

triangleGroup.addEventListener("pointermove", (event) => {
  if (!state.dragging || event.pointerId !== state.pointerId) return;
  const point = toSvgPoint(event);
  state.angle = snapAngle(angleFromPoint(point));
  statusText.textContent = `Angle ${currentValues().degree}`;
  render();
});

function finishDrag(event) {
  if (!state.dragging) return;
  if (
    event?.pointerId !== undefined &&
    state.pointerId !== null &&
    event.pointerId !== state.pointerId
  ) {
    return;
  }

  const activePointerId = state.pointerId;
  state.dragging = false;
  state.pointerId = null;
  triangleGroup.classList.remove("is-dragging");

  if (
    activePointerId !== null &&
    triangleGroup.hasPointerCapture?.(activePointerId)
  ) {
    triangleGroup.releasePointerCapture(activePointerId);
  }

  const values = currentValues();
  statusText.textContent = values.exact
    ? `${values.degree} — exact radical values`
    : `${values.degree} — approximate values`;
  liveMessage.textContent = statusText.textContent;
  render();
}

triangleGroup.addEventListener("pointerup", (event) => {
  if (event.pointerId !== state.pointerId) return;
  finishDrag(event);
});

triangleGroup.addEventListener("pointercancel", finishDrag);
triangleGroup.addEventListener("lostpointercapture", finishDrag);
document.addEventListener("pointerup", finishDrag);
document.addEventListener("pointercancel", finishDrag);
window.addEventListener("blur", () => finishDrag());
document.addEventListener("visibilitychange", () => {
  if (document.hidden) finishDrag();
});

triangleGroup.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowUp") {
    event.preventDefault();
    state.angle = (state.angle + 1) % 360;
    render();
  }
  if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
    event.preventDefault();
    state.angle = (state.angle - 1 + 360) % 360;
    render();
  }
});

resetButton.addEventListener("click", reset);
renderAngleButtons();
buildSpecialPoints();
render();
