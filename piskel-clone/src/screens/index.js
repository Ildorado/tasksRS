/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
/* eslint-disable eqeqeq */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
import '../../reset.css';
import './index.css';
import { } from '../export/tranform to gif code/GIFEncoder';
import { } from '../export/tranform to gif code/LZWEncoder';
import { } from '../export/tranform to gif code/NeuQuant';
import { } from '../export/tranform to gif code/b64';

const utilities = require('./utilities');

const canvas = document.getElementById('canvas');
const mainColor = document.querySelector('.mainColor');
// const secondColor = document.querySelector('.secondColor');
const ctx = canvas.getContext('2d');
const canvasBackgroundColor = 'lightgray';
ctx.fillStyle = canvasBackgroundColor;
ctx.fillRect(0, 0, canvas.width, canvas.height);
const mainFrames = document.querySelector('.main__frames');
const AddNewFrameButton = document.querySelector('.addNewFrame');
const frames = [];
let currentFrame = 1;
const fromStorage = JSON.parse(localStorage.getItem('stateObject'));
const stateObject = {};
const [areArraysEqual, getRandomInt] = [utilities.areArraysEqual, utilities.getRandomInt];
// TAKE IMAGE IMPLEMENTATION
function takePicture() {
  const dataURL = canvas.toDataURL();
  const img = new Image();
  img.src = dataURL;
  if (frames[currentFrame - 1]) {
    frames[currentFrame - 1] = img;
  } else {
    frames.push(img);
  }
  mainFrames.children[currentFrame - 1].style.backgroundImage = `url(${dataURL})`;
}
// TAKE IMAGE IMPLEMENTATION END
// LOAD FRAME IMPLEMENTATION
function loadFrame(numberOfFrame) {
  takePicture();
  const loadingFrame = frames[numberOfFrame - 1];
  currentFrame = numberOfFrame;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(loadingFrame, 0, 0);
}
// LOAD FRAME IMPLEMENTATION END
// ADD NEW FRAME FRAME IMPLEMENTATION
function addNewFrame() {
  takePicture();
  const coppied = document.querySelector('.frame').cloneNode(true);
  if (coppied.classList.contains('firstFrame')) {
    coppied.classList.remove('firstFrame');
  }
  const numberOfFrame = coppied.children[0];
  numberOfFrame.innerText = Number(mainFrames.children[mainFrames.children.length - 2]
    .children[0].innerText) + 1;
  mainFrames.insertBefore(coppied, mainFrames.children[mainFrames.children.length - 1]);
  currentFrame = mainFrames.children.length - 1;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = canvasBackgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  loadFrame(currentFrame);
}
AddNewFrameButton.addEventListener('click', addNewFrame);
// ADD NEW FRAME FRAME IMPLEMENTATION END
// DUPLICATE FRAME IMPLEMENTATION
function duplicateFrame(numberOfDuplicatedFrame) {
  const coppied = document.querySelectorAll('.frame')[numberOfDuplicatedFrame - 1].cloneNode(true);
  if (coppied.classList.contains('firstFrame')) {
    coppied.classList.remove('firstFrame');
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  coppied.children[0].innerText = mainFrames.children.length;
  mainFrames.insertBefore(coppied, mainFrames.children[mainFrames.children.length - 1]);
  currentFrame = mainFrames.children.length - 1;

  ctx.drawImage(frames[numberOfDuplicatedFrame - 1], 0, 0);
  takePicture();
}
// DUPLICATE FRAME IMPLEMENTATION END
// DELETE FRAME IMPLEMENTATION
function deleteFrame(numberOfDeletedFrame) {
  if (mainFrames.children.length > 2) {
    if (numberOfDeletedFrame === currentFrame) {
      if (frames.length === currentFrame) {
        loadFrame(currentFrame - 1);
      } else if (frames.length > currentFrame) {
        loadFrame(currentFrame + 1);
        currentFrame -= 1;
      }
    } else if (numberOfDeletedFrame < currentFrame) {
      currentFrame -= 1;
    }
    mainFrames.children[numberOfDeletedFrame - 1].remove();
    frames.splice(numberOfDeletedFrame - 1, 1);
    for (let i = 0; i < mainFrames.children.length - 1; i += 1) {
      if (mainFrames.children[i].classList.contains('frame')) {
        mainFrames.children[i].children[0].innerText = i + 1;
      }
    }
  }
}
// DELETE FRAME IMPLEMENTATION END
// LOAD FRAME FROM CLICK FRAME IMPLEMENTATION
function frameLoadEvent(event) {
  if (event.target.classList.contains('numberOfFrame')) {
    loadFrame(Number(event.target.innerText));
  } else if (event.target.classList.contains('frame')) {
    loadFrame(Number(event.target.children[0].innerText));
  } else if (event.target.classList.contains('duplicateIcon')) {
    duplicateFrame(event.target.parentElement.children[0].innerText);
  } else if (event.target.classList.contains('deleteIcon')) {
    deleteFrame(event.target.parentElement.children[0].innerText);
  }
}
mainFrames.addEventListener('click', frameLoadEvent);
// LOAD FRAME FROM CLICK FRAME IMPLEMENTATION END
// take first picture to add first frame to array
takePicture();
// CREATE ANIMATION IMPLEMENTATION
const FPS = document.querySelector('.FPS');
let interval = null;
const showAnimation = document.querySelector('.showAnimation');
let counter = 0;
function goThroughFrames(passedFrames, passedDelta) {
  showAnimation.innerHTML = '';
  if (!passedFrames[counter].classList.contains('AnimationImg')) {
    passedFrames[counter].classList.add('AnimationImg');
  }
  showAnimation.appendChild(passedFrames[counter]);
  if (counter === passedFrames.length - 1) {
    if (!areArraysEqual(passedFrames, frames) || passedDelta !== FPS.value) {
      counter = 0;
      animateEvent();
    } else {
      counter = 0;
    }
  } else {
    counter += 1;
  }
}
function animateEvent() {
  const newFrames = frames.slice();
  let delta = FPS.value;
  if (delta < 1) {
    delta = 1;
  } else if (delta > 24) { delta = 24; }
  clearInterval(interval);
  interval = window.setInterval(goThroughFrames, 1000 / delta, newFrames, delta);
}
animateEvent();
// CREATE ANIMATION IMPLEMENTATION END
// FULLS SCREEN IMPLEMENTATION
function fullScreenEvent() {
  if (showAnimation.innerHTML !== '') {
    showAnimation.requestFullscreen();
  }
}
const FullscreenButton = document.querySelector('.FullscreenButton');
FullscreenButton.addEventListener('click', fullScreenEvent);
// CREATE ANIMATION IMPLEMENTATION END
// PEN SIZE IMPLEMENTATION
const penSizeContainer = document.querySelector('.size-picker-container');
let currentPenSize = 1;
let selectedPenSizeElement = penSizeContainer.children[0];
function PenSizeEvent(event) {
  if (event.target.parentElement === penSizeContainer) {
    currentPenSize = event.target.attributes[1].value;
    selectedPenSizeElement.classList.remove('selected');
    selectedPenSizeElement = event.target;
    selectedPenSizeElement.classList.add('selected');
  }
}
penSizeContainer.addEventListener('click', PenSizeEvent);
// PEN SIZE IMPLEMENTATION END
const toolPicker = document.querySelector('.main__pallete__tool-picker');
const arrayOfEventListeners = [];
// REMOVE EVENT LISTENERS FROM CANVAS IMPLEMENTATION
function removeEventListenersFromCanvas() {
  arrayOfEventListeners.forEach((element) => {
    canvas.removeEventListener(element[0], element[1]);
  });
}
// REMOVE EVENT LISTENERS FROM CANVAS IMPLEMENTATION END
let started = false;
let x = 0;
let y = 0;
let ratio = canvas.clientWidth / canvas.width;
// PEN IMPLEMENTATION
function getCoordinates(event) {
  x = event.offsetX;
  y = event.offsetY;
}
function penStart(event) {
  getCoordinates(event);
  started = true;
}
function penMove(event) {
  if (started === true) {
    drawLine(ctx, x, y, event.offsetX, event.offsetY);
    getCoordinates(event);
  }
}
function penEnd(event) {
  if (started === true) {
    drawLine(ctx, x, y, event.offsetX, event.offsetY);
    x = 0;
    y = 0;
    started = false;
  }
}
function drawLine(context, x1, y1, x2, y2) {
  context.beginPath();
  context.strokeStyle = mainColor.value;
  context.lineWidth = currentPenSize;
  context.moveTo(x1 / ratio, y1 / ratio);
  context.lineTo(x2 / ratio, y2 / ratio);
  context.stroke();
  context.closePath();
}
function PenEvent() {
  canvas.addEventListener('mousedown', penStart);
  canvas.addEventListener('mousemove', penMove);
  canvas.addEventListener('mouseup', penEnd);
  arrayOfEventListeners.push(['mousedown', penStart]);
  arrayOfEventListeners.push(['mousemove', penMove]);
  arrayOfEventListeners.push(['mouseup', penEnd]);
}
// PEN IMPLEMENTATION END
// FILL ALL PIXELS IMPLEMENTATION
function fillAllPixelsEvent() {
  ctx.fillStyle = mainColor.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
// FILL ALL PIXELS IMPLEMENTATION END
// ERASER IMPLEMENTATION
function eraserStart(event) {
  getCoordinates(event);
  started = true;
}
function eraserMove(event) {
  if (started === true) {
    cleanCircle(ctx, x, y, event.offsetX, event.offsetY);
    getCoordinates(event);
  }
}
function eraserEnd(event) {
  if (started === true) {
    cleanCircle(ctx, x, y, event.offsetX, event.offsetY);
    x = 0;
    y = 0;
    started = false;
  }
}
function cleanCircle(context, x1, y1, x2, y2) {
  context.beginPath();
  context.strokeStyle = canvasBackgroundColor;
  context.lineWidth = currentPenSize * 10;
  context.moveTo(x1 / ratio, y1 / ratio);
  context.lineTo(x2 / ratio, y2 / ratio);
  context.stroke();
  context.closePath();
}
function eraserEvent() {
  canvas.addEventListener('mousedown', eraserStart);
  canvas.addEventListener('mousemove', eraserMove);
  canvas.addEventListener('mouseup', eraserEnd);
  arrayOfEventListeners.push(['mousedown', eraserStart]);
  arrayOfEventListeners.push(['mousemove', eraserMove]);
  arrayOfEventListeners.push(['mouseup', eraserEnd]);
}
// ERASER IMPLEMENTATION END
// STROKE IMPLEMENTATION
function strokeStart(event) {
  getCoordinates(event);
  started = true;
}
function strokeEnd(event) {
  if (started === true) {
    drawLine(ctx, x, y, event.offsetX, event.offsetY);
    started = false;
  }
}
function strokeEvent() {
  canvas.addEventListener('mousedown', strokeStart);
  canvas.addEventListener('mouseup', strokeEnd);
  arrayOfEventListeners.push(['mousedown', strokeStart]);
  arrayOfEventListeners.push(['mouseup', strokeEnd]);
}
// STROKE IMPLEMENTATION END
// RECTANGLE AND FILLED RECTANGLE IMPLEMENTATION
function rectangleStart(event) {
  getCoordinates(event);
  started = true;
}
function rectangleEnd(event) {
  if (started === true) {
    drawRectangle(ctx, x, y, event.offsetX, event.offsetY);
    started = false;
  }
}
function filledRectangleEnd(event) {
  if (started === true) {
    drawFilledRectangle(ctx, x, y, event.offsetX, event.offsetY);
    started = false;
  }
}
function drawRectangle(context, x1, y1, x2, y2) {
  const width = x2 - x1;
  const height = y2 - y1;
  context.beginPath();
  context.strokeStyle = mainColor.value;
  context.lineWidth = currentPenSize;
  context.strokeRect(parseInt(x1 / ratio, 10), parseInt(y1 / ratio, 10),
    parseInt(width / ratio, 10), parseInt(height / ratio, 10));
  context.closePath();
}
function drawFilledRectangle(context, x1, y1, x2, y2) {
  const width = x2 - x1;
  const height = y2 - y1;
  context.fillStyle = mainColor.value;
  context.fillRect(parseInt(x1 / ratio, 10), parseInt(y1 / ratio, 10),
    parseInt(width / ratio, 10), parseInt(height / ratio, 10));
}
function rectangleEvent() {
  canvas.addEventListener('mousedown', rectangleStart);
  canvas.addEventListener('mouseup', rectangleEnd);
  arrayOfEventListeners.push(['mousedown', rectangleStart]);
  arrayOfEventListeners.push(['mouseup', rectangleEnd]);
}
function filledRectangleEvent() {
  canvas.addEventListener('mousedown', rectangleStart);
  canvas.addEventListener('mouseup', filledRectangleEnd);
  arrayOfEventListeners.push(['mousedown', rectangleStart]);
  arrayOfEventListeners.push(['mouseup', filledRectangleEnd]);
}
// RECTANGLE AND FILLED RECTANGLE IMPLEMENTATION END
// CIRCLE AND FILLED CIRCLE IMPLEMENTATION
function circleStart(event) {
  getCoordinates(event);
  started = true;
}
function circleEnd(event) {
  if (started === true) {
    drawCircle(ctx, x, y, event.offsetX, event.offsetY);
    started = false;
  }
}
function filledCircleEnd(event) {
  if (started === true) {
    drawFilledCircle(ctx, x, y, event.offsetX, event.offsetY);
    started = false;
  }
}
function drawCircle(context, x1, y1, x2, y2) {
  let temporary;
  if (x2 < x1) {
    temporary = x2;
    x2 = x1;
    x1 = temporary;
  }
  if (y2 < y1) {
    temporary = y2;
    y2 = y1;
    y1 = temporary;
  }
  context.strokeStyle = mainColor.value;
  context.lineWidth = currentPenSize;
  context.beginPath();
  context.arc((x2 + x1) / 2 / ratio, (y2 + y1) / 2 / ratio,
    (x2 - x1) / 2 / ratio, 0, 2 * Math.PI);
  context.stroke();
  context.closePath();
}
function drawFilledCircle(context, x1, y1, x2, y2) {
  let temporary;
  if (x2 < x1) {
    temporary = x2;
    x2 = x1;
    x1 = temporary;
  }
  if (y2 < y1) {
    temporary = y2;
    y2 = y1;
    y1 = temporary;
  }
  context.beginPath();
  context.arc((x2 + x1) / 2 / ratio, (y2 + y1) / 2 / ratio,
    (x2 - x1) / 2 / ratio, 0, 2 * Math.PI);
  context.fillStyle = mainColor.value;
  context.fill();
  context.closePath();
}
function circleEvent() {
  canvas.addEventListener('mousedown', circleStart);
  canvas.addEventListener('mouseup', circleEnd);
  arrayOfEventListeners.push(['mousedown', circleStart]);
  arrayOfEventListeners.push(['mouseup', circleEnd]);
}
function filledCircleEvent() {
  canvas.addEventListener('mousedown', circleStart);
  canvas.addEventListener('mouseup', filledCircleEnd);
  arrayOfEventListeners.push(['mousedown', circleStart]);
  arrayOfEventListeners.push(['mouseup', filledCircleEnd]);
}
// CIRCLE AND FILLED CIRCLE IMPLEMENTATION END
// HALF CIRCLE IMPLEMENTATION
function drawHalfCircle(context, x1, y1, x2, y2) {
  let clockWise = false;

  if (x1 < x2) {
    clockWise = true;
  }
  context.strokeStyle = mainColor.value;
  context.lineWidth = currentPenSize;
  context.beginPath();
  const radius = Math.abs(y2 - y1) / 2;
  const gip = Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2)) / 2;
  const tVar = (radius * radius) / gip;
  const kVar = Math.sqrt((radius * radius) - (tVar * tVar));
  const alpha = Math.acos(kVar / radius);
  context.arc((x2 + x1) / 2 / ratio, (y2 + y1) / 2 / ratio,
    radius / ratio, alpha, Math.PI + alpha, clockWise);
  context.stroke();
  context.closePath();
}
function halfCircleEnd(event) {
  if (started === true) {
    drawHalfCircle(ctx, x, y, event.offsetX, event.offsetY);
    started = false;
  }
}
function halfCircleEvent() {
  canvas.addEventListener('mousedown', circleStart);
  canvas.addEventListener('mouseup', halfCircleEnd);
  arrayOfEventListeners.push(['mousedown', circleStart]);
  arrayOfEventListeners.push(['mouseup', halfCircleEnd]);
}
// HALF CIRCLE IMPLEMENTATION END
// CLEAR IMPLEMENTATION
function clearEvent() {
  ctx.fillStyle = canvasBackgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
// CLEAR IMPLEMENTATION END
// SPRAY IMPLEMENTATION
let timeout;
function drawSpray() {
  for (let i = 20 * currentPenSize; i > 0; i -= 1) {
    const radius = 20 * currentPenSize;
    const offX = getRandomInt(-radius, radius);
    const offY = getRandomInt(-radius, radius);
    ctx.fillStyle = mainColor.value;
    ctx.fillRect((x + offX) / ratio, (y + offY) / ratio, 1, 1);
  }
}
function sprayStart(event) {
  getCoordinates(event);
  started = true;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  timeout = setInterval(drawSpray, 50);
}
function sprayMove(event) {
  if (started === true) {
    getCoordinates(event);
  }
}
function sprayEnd() {
  if (started === true) {
    clearInterval(timeout);
    started = false;
  }
}
function sprayEvent() {
  canvas.addEventListener('mousedown', sprayStart);
  canvas.addEventListener('mousemove', sprayMove);
  canvas.addEventListener('mouseup', sprayEnd);
  arrayOfEventListeners.push(['mousedown', sprayStart]);
  arrayOfEventListeners.push(['mousemove', sprayMove]);
  arrayOfEventListeners.push(['mouseup', sprayEnd]);
}
// SPRAY IMPLEMENTATION END
// TOOLPICKER IMPLEMENTATION
function toolPickEvent(event) {
  if (event.target.parentElement === toolPicker) {
    removeEventListenersFromCanvas();
    switch (event.target.classList[1]) {
      case 'pen':
        PenEvent();
        break;
      case 'fillAllPixels':
        fillAllPixelsEvent();
        break;
      case 'eraser':
        eraserEvent();
        break;
      case 'stroke':
        strokeEvent();
        break;
      case 'rectange':
        rectangleEvent();
        break;
      case 'filledRectange':
        filledRectangleEvent();
        break;
      case 'circle':
        circleEvent();
        break;
      case 'filledCircle':
        filledCircleEvent();
        break;
      case 'halfCircle':
        halfCircleEvent();
        break;
      case 'clear':
        clearEvent();
        break;
      case 'spray':
        sprayEvent();
        break;
      default:
        break;
    }
  }
}

toolPicker.addEventListener('click', toolPickEvent);
// TOOLPICKER IMPLEMENTATION END
// CANVAS RESIZE IMPLEMENTATION
const canvasSizeContainer = document.querySelector('.canvas-size-container');
let currentCanvasSize = 32;
let selectedCanvasSizeElement = canvasSizeContainer.children[0];
function ResizeFrames() {
  ctx.fillStyle = canvasBackgroundColor;
  const frameToReturn = currentFrame;
  for (let i = 0; i < frames.length; i += 1) {
    const loadedFrame = frames[i];
    currentFrame = i + 1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(loadedFrame, 0, 0);
    takePicture();
  }
  loadFrame(frameToReturn);
}
function changeCanvasSize(newCanvasSize) {
  currentCanvasSize = newCanvasSize;
  canvas.width = currentCanvasSize;
  canvas.height = currentCanvasSize;
  ratio = canvas.clientWidth / canvas.width;
  ctx.fillStyle = canvasBackgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(frames[currentFrame - 1], 0, 0);
  takePicture();
  ResizeFrames();
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function CanvasSizeEvent(event) {
  if (event.target.parentElement === canvasSizeContainer) {
    selectedCanvasSizeElement.classList.remove('selected');
    selectedCanvasSizeElement = event.target;
    selectedCanvasSizeElement.classList.add('selected');
  }
  changeCanvasSize(event.target.attributes[1].value);
}
document.onresize = function resizing() {
  ratio = canvas.clientWidth / canvas.width;
};
canvasSizeContainer.addEventListener('click', CanvasSizeEvent);
// CANVAS RESIZE IMPLEMENTATION END
// LOCAL STORAGE IMPLEMENTATION
function unloadEvent() {
  stateObject.imgs = [];
  frames.forEach((el) => {
    stateObject.imgs.push(el.src);
  });
  stateObject.penSize = String(currentPenSize);
  stateObject.currentCanvasSize = String(currentCanvasSize);
  localStorage.removeItem('stateObject');
  localStorage.setItem('stateObject', JSON.stringify(stateObject));
}
function loadEvent() {
  selectedPenSizeElement.classList.remove('selected');
  selectedCanvasSizeElement.classList.remove('selected');
  switch (fromStorage.penSize) {
    case '1':
      selectedPenSizeElement = penSizeContainer.children[0];
      currentPenSize = 1;
      selectedPenSizeElement.classList.add('selected');
      break;
    case '2':
      selectedPenSizeElement = penSizeContainer.children[1];
      currentPenSize = 2;
      selectedPenSizeElement.classList.add('selected');
      break;
    case '3':
      selectedPenSizeElement = penSizeContainer.children[2];
      currentPenSize = 3;
      selectedPenSizeElement.classList.add('selected');
      break;
    case '4':
      selectedPenSizeElement = penSizeContainer.children[3];
      currentPenSize = 4;
      selectedPenSizeElement.classList.add('selected');
      break;
    default:
      selectedPenSizeElement = penSizeContainer.children[0];
      currentPenSize = 1;
      selectedPenSizeElement.classList.add('selected');
      break;
  }
  switch (fromStorage.currentCanvasSize) {
    case '32':
      selectedCanvasSizeElement = canvasSizeContainer.children[0];
      selectedCanvasSizeElement.classList.add('selected');
      break;
    case '64':
      selectedCanvasSizeElement = canvasSizeContainer.children[1];
      selectedCanvasSizeElement.classList.add('selected');
      canvas.width = 64;
      canvas.height = 64;
      break;
    case '128':
      selectedCanvasSizeElement = canvasSizeContainer.children[2];
      selectedCanvasSizeElement.classList.add('selected');
      canvas.width = 128;
      canvas.height = 128;
      break;
    default:
      selectedCanvasSizeElement = canvasSizeContainer.children[0];
      selectedCanvasSizeElement.classList.add('selected');
      break;
  }
  ratio = canvas.clientWidth / canvas.width;
  ctx.fillStyle = canvasBackgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
window.addEventListener('unload', unloadEvent);
window.addEventListener('load', loadEvent);
// LOCAL STORAGE IMPLEMENTATION
// SHOW CURSOR COORDINATES IMPLEMENTATION
const coords = document.querySelector('.coords');
function showCoords(event) {
  coords.innerText = `[${currentCanvasSize}x${currentCanvasSize}] ${parseInt(event.offsetX / ratio, 10)}:${parseInt(event.offsetY / ratio, 10)}`;
}
canvas.addEventListener('mousemove', showCoords);
// SHOW CURSOR COORDINATES IMPLEMENTATION END
// GIF CREATION IMPLEMENTATION
const downloadButton = document.querySelector('.downloadButton');
function createGif() {
  const encoder = new GIFEncoder();
  encoder.setRepeat(0);
  encoder.setDelay(1000 / FPS.value);
  encoder.start();
  const fakeCanvas = document.createElement('canvas');
  fakeCanvas.width = currentCanvasSize;
  fakeCanvas.height = currentCanvasSize;
  const fakeContext = fakeCanvas.getContext('2d');
  for (let i = 0; i < frames.length; i += 1) {
    fakeContext.clearRect(0, 0, canvas.width, canvas.height);
    fakeContext.drawImage(frames[i], 0, 0);
    encoder.addFrame(fakeContext);
  }
  encoder.finish();
  encoder.download('download.gif');
}
downloadButton.addEventListener('click', createGif);
// GIF CREATION IMPLEMENTATION END
// KEY SHORTCUTS IMPLEMENTATION
document.onkeyup = function keyShortcuts(e) {
  if (e.code === 'KeyP') {
    PenEvent();
  } else if (e.shiftKey && e.code === 'KeyN') {
    duplicateFrame(currentFrame);
  } else if (e.shiftKey && e.code === 'KeyB') {
    deleteFrame(currentFrame);
  } else if (e.shiftKey && e.code === 'Equal') {
    if (currentCanvasSize == 32) {
      canvasSizeContainer.children[1].click();
    } else if (currentCanvasSize == 64) {
      canvasSizeContainer.children[2].click();
    }
  } else if (e.shiftKey && e.code === 'Minus') {
    if (currentCanvasSize == 64) {
      canvasSizeContainer.children[0].click();
    } else if (currentCanvasSize == 128) {
      canvasSizeContainer.children[1].click();
    }
  } else if (e.code === 'BracketRight') {
    if (currentPenSize == 1) {
      penSizeContainer.children[1].click();
    } else if (currentPenSize == 2) {
      penSizeContainer.children[2].click();
    } else if (currentPenSize == 3) {
      penSizeContainer.children[3].click();
    }
  } else if (e.code === 'BracketLeft') {
    if (currentPenSize == 2) {
      penSizeContainer.children[0].click();
    } else if (currentPenSize == 3) {
      penSizeContainer.children[1].click();
    } else if (currentPenSize == 4) {
      penSizeContainer.children[2].click();
    }
  } else if (e.ctrlKey && e.code === 'KeyS') {
    downloadButton.click();
  } else if (e.ctrlKey && e.code === 'KeyF') {
    FullscreenButton.click();
  } else if (e.code === 'ArrowUp' && currentFrame < mainFrames.children.length - 1) {
    loadFrame(currentFrame + 1);
  } else if (e.code === 'ArrowDown' && currentFrame > 1) {
    loadFrame(currentFrame - 1);
  } else if (e.code === 'KeyF') {
    fillAllPixelsEvent();
  } else if (e.code === 'KeyE') {
    eraserEvent();
  } else if (e.code === 'KeyS') {
    sprayEvent();
  } else if (e.code === 'KeyT') {
    strokeEvent();
  } else if (e.code === 'KeyR') {
    rectangleEvent();
  } else if (e.code === 'KeyG') {
    filledRectangleEvent();
  } else if (e.code === 'KeyA') {
    circleEvent();
  } else if (e.code === 'KeyD') {
    filledCircleEvent();
  } else if (e.code === 'KeyH') {
    halfCircleEvent();
  } else if (e.code === 'KeyC') {
    clearEvent();
  } else if (e.code === 'KeyN') {
    addNewFrame();
  }
};
// KEY SHORTCUTS IMPLEMENTATION END
// export
