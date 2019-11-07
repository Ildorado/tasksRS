/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
/* eslint-disable operator-linebreak */
/* eslint-disable no-cond-assign */
/* eslint-disable no-plusplus */
/* eslint-disable brace-style */
/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-template */
/* eslint-disable spaced-comment */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
import domtoimage from 'dom-to-image-more';

const body = document.getElementsByTagName('body')[0];
const paintBucket = document.getElementById('paint-bucket');
const chooseColor = document.getElementById('choose-color');
const move = document.getElementById('move');
const transform = document.getElementById('transform');
const currentColor = document.getElementById('current-color');
currentColor.style.backgroundColor = 'green';
const previousColor = document.getElementById('previous-color');
const canvas = document.getElementById('canvas');
const refreshButton = document.getElementById('refresh_Button');
let draggedElement;
let dragCoords = {
  startLeft: 0,
  startTop: 0,
  endLeft: 0,
  endTop: 0,
};
let isStarting = false;
// let lastTargetedItem;
let rect;
let fromStorage = JSON.parse(localStorage.getItem('stateObject'));
let stateObject = {};
//choosing color tool
chooseColor.addEventListener('click', Activate_choosing_color);
function Activate_choosing_color(e) {
  e.stopImmediatePropagation();
  document.body.style.cursor = 'pointer';
  body.addEventListener('click', Choose_color_function);
}
function Choose_color_function(e) {
  previousColor.style.backgroundColor = currentColor.style.backgroundColor;
  currentColor.style.backgroundColor = e.target.style.backgroundColor;
  document.body.style.cursor = 'default';
  body.removeEventListener('click', Choose_color_function);
}
//paint bucket tool
paintBucket.addEventListener('click', Activate_paint_bucket);
function Activate_paint_bucket(e) {
  e.stopImmediatePropagation();
  document.body.style.cursor = 'pointer';
  canvas.addEventListener('click', paint_bucket_function);
}
function paint_bucket_function(e) {
  //console.log(e.target);
  if (e.target !== canvas) {
    e.target.style.backgroundColor = currentColor.style.backgroundColor;
  }
  document.body.style.cursor = 'default';
  canvas.removeEventListener('click', paint_bucket_function);
}
//transforming tool
transform.addEventListener('click', Activate_transforming);
function Activate_transforming(e) {
  e.stopImmediatePropagation();
  document.body.style.cursor = 'pointer';
  canvas.addEventListener('click', Transforming_function);
}
function Transforming_function(e) {
  //console.log(e.target.classList);
  if (e.target.classList.contains('circle')) {
    e.target.classList.remove('circle');
  }
  else {
    e.target.classList.add('circle');
  }
  document.body.style.cursor = 'default';
  canvas.removeEventListener('click', Transforming_function);
}
//move tool
move.addEventListener('click', Activate_move);

function Activate_move(e) {
  document.body.style.cursor = 'pointer';
  e.stopImmediatePropagation();
  canvas.addEventListener('mousedown', Move_start_function);
  body.addEventListener('mouseup', Move_end_function);
  body.addEventListener('mousemove', Move_function);
}
function Move_start_function(e) {
  isStarting = true;
  draggedElement = e.target;
  if (draggedElement === canvas) {
    draggedElement = null;
  }
  draggedElement.style.position = 'absolute';
  draggedElement.ondragstart = function () {
    return false;
  };
  e.target.setAttribute('draggable', 'true');
  Move_function(e);
}
function moveAt(pageX, pageY) {
  if (draggedElement) {
    draggedElement.style.left = pageX - draggedElement.offsetWidth / 2 + 'px';
    draggedElement.style.top = pageY - draggedElement.offsetHeight / 2 + 'px';
  }
}
function Move_function(e) {
  moveAt(e.pageX, e.pageY);
  if (e.type = 'mousedown' && isStarting === true) {
    rect = e.target.getBoundingClientRect();
    dragCoords.startLeft = rect.left + window.scrollX;
    dragCoords.startTop = rect.top + window.scrollY;
    isStarting = false;
  }
  else if (e.type = 'mouseup' && e.target.parentNode === canvas) {
    rect = e.target.getBoundingClientRect();
    dragCoords.endLeft = rect.left + window.scrollX;
    dragCoords.endTop = rect.top + window.scrollY;
    // lastTargetedItem = e.target;
  }
}
function Move_end_function(e) {
  document.body.style.cursor = 'default';
  draggedElement.style.left = dragCoords.endLeft + 'px';
  draggedElement.style.top = dragCoords.endTop + 'px';
  // draggedElement.style.zIndex = 1;
  canvas.removeEventListener('mousedown', Move_start_function);
  body.removeEventListener('mouseup', Move_end_function);
  body.removeEventListener('mousemove', Move_function);
  body.removeEventListener('mouseup', Move_function);
  draggedElement = null;
  //console.log(e.target.getAttribute("draggable"));
  //canvas.removeEventListener('click', Move_function);
}
//keyboard control
body.addEventListener('keydown', keyEvent);
function keyEvent(e) {
  if (e.key === 'p') {
    Activate_paint_bucket(e);
  }
  else if (e.key === 'c') {
    Activate_choosing_color(e);
  }
  else if (e.key === 'm') {
    Activate_move(e);
  }
  else if (e.key === 't') {
    Activate_transforming(e);
  }
}
window.addEventListener('unload', unloadEvent);
function unloadEvent() {
  stateObject.currentColorBackgroundColor = currentColor.style.backgroundColor;
  stateObject.previousColorBackgroundColor = previousColor.style.backgroundColor;
  for (let i = 1; i < 10; i++) {
    let elem = document.getElementById('canvas_' + i);
    stateObject['canvas_' + i] = {
      position: elem.style.position,
      left: elem.style.left,
      top: elem.style.top,
      zIndex: elem.style.zIndex,
      backgroundColor: elem.style.backgroundColor,
      circle: elem.classList.contains('circle'),
    };
  }
  localStorage.removeItem('stateObject');
  localStorage.setItem('stateObject', JSON.stringify(stateObject));
}
window.addEventListener('load', loadEvent);
function loadEvent() {
  if (Object.entries(fromStorage).length === 0) {
    return;
  }
  currentColor.style.backgroundColor = fromStorage.currentColorBackgroundColor;
  previousColor.style.backgroundColor = fromStorage.previousColorBackgroundColor;
  for (let i = 1; i < 10; i++) {
    let elem = document.getElementById('canvas_' + i);
    if (fromStorage[elem.id].position !== '') {
      elem.style.position = fromStorage[elem.id].position;
    }
    if (fromStorage[elem.id].left !== '') {
      elem.style.left = fromStorage[elem.id].left;
    }
    if (fromStorage[elem.id].top !== '') {
      elem.style.top = fromStorage[elem.id].top;
    }
    if (fromStorage[elem.id].zIndex !== '') {
      elem.style.zIndex = fromStorage[elem.id].zIndex;
    }
    if (fromStorage[elem.id].backgroundColor !== '') {
      elem.style.backgroundColor = fromStorage[elem.id].backgroundColor;
    }
    if (fromStorage[elem.id].circle === true) {
      elem.classList.add('circle');
    }
  }
}
refreshButton.addEventListener('click', refreshEvent);
function refreshEvent() {
  window.removeEventListener('unload', unloadEvent);
  window.addEventListener('unload', function () {
    localStorage.removeItem('stateObject');
    localStorage.setItem('stateObject', JSON.stringify(stateObject));
  });
}

//save this frame
const mainFrames = document.querySelector('.main__frames');
const saveButton = document.querySelector('.SaveButton');
const AddNewFrameButton = document.querySelector('.addNewFrame');
let frames = [];
let currentFrame = 1;
function saveThisFrame() {
  let thisFrame = {};
  for (let i = 1; i < 10; i++) {
    let elem = document.getElementById('canvas_' + i);
    thisFrame['canvas_' + i] = {
      position: elem.style.position,
      left: elem.style.left,
      top: elem.style.top,
      zIndex: elem.style.zIndex,
      backgroundColor: elem.style.backgroundColor,
      circle: elem.classList.contains('circle'),
    };
  }
  if (frames[currentFrame - 1]) {
    frames[currentFrame - 1] = thisFrame;
  }
  else {
    frames.push(thisFrame);
  }
}
saveButton.addEventListener('click', saveThisFrame);
//add new frame
function addNewFrame() {
  saveThisFrame();
  let newFrame = document.createElement('div');
  let numberOfFrame = document.createElement('div');
  numberOfFrame.classList.add('numberOfFrame');
  numberOfFrame.innerText = Number(mainFrames.children[mainFrames.children.length - 2]
    .children[0].innerText) + 1;
  newFrame.classList.add('frame');
  newFrame.appendChild(numberOfFrame);
  mainFrames.insertBefore(newFrame, mainFrames.children[mainFrames.children.length - 1]);
  currentFrame++;
  newFrameObject();
  loadFrame(currentFrame);
}
function newFrameObject() {
  let thisFrame = {};
  for (let i = 1; i < 10; i++) {
    thisFrame['canvas_' + i] = {
      position: '',
      left: '',
      top: '',
      zIndex: '',
      backgroundColor: '',
      circle: false,
    };
  }
  if (frames[currentFrame - 1]) {
    frames[currentFrame - 1] = thisFrame;
  }
  else {
    frames.push(thisFrame);
  }
}
AddNewFrameButton.addEventListener('click', addNewFrame);

function loadFrame(numberOfFrame) {
  let loadingFrame = frames[numberOfFrame - 1];
  for (let i = 1; i < 10; i++) {
    let elem = document.getElementById('canvas_' + i);
    elem.style.position = loadingFrame[elem.id].position;
    elem.style.left = loadingFrame[elem.id].left;
    elem.style.top = loadingFrame[elem.id].top;
    elem.style.zIndex = loadingFrame[elem.id].zIndex;
    elem.style.backgroundColor = loadingFrame[elem.id].backgroundColor;
    if (loadingFrame[elem.id].circle === true) {
      if (!elem.classList.contains('circle')) {
        elem.classList.add('circle');
      }
    }
    else if (elem.classList.contains('circle')) {
      elem.classList.remove('circle');
    }
  }
}
// add frames switch
mainFrames.addEventListener('click', framesSwitchEvent);
function framesSwitchEvent(e) {
  if (e.target.classList.contains('frame')) {
    currentFrame = e.target.children[0].innerText;
    loadFrame(currentFrame);
  }
}
// delete frame
const deleteButton = document.querySelector('.DeleteButton');
deleteButton.addEventListener('click', deleteButtonEvent);
function deleteButtonEvent() {
  if (frames.length > 1) {
    mainFrames.children[currentFrame - 1].remove();
    frames.splice(currentFrame - 1, 1);
    for (let i = 0; i < mainFrames.children.length - 1; i++) {
      mainFrames.children[i].children[0].innerText = i + 1;
    }
    if (currentFrame == 1) {
      loadFrame(currentFrame);
    }
    else {
      currentFrame--;
      loadFrame(currentFrame);
    }
  }
}
//duplicate frame
const duplicateButton = document.querySelector('.DuplicateButton');
function duplicateThisFrame() {
  let FrameToArrayOfFrames = frames[currentFrame - 1];
  saveThisFrame();
  let newFrame = document.createElement('div');
  let numberOfFrame = document.createElement('div');
  numberOfFrame.classList.add('numberOfFrame');
  numberOfFrame.innerText = Number(mainFrames.children[mainFrames.children.length - 2]
    .children[0].innerText) + 1;
  newFrame.classList.add('frame');
  newFrame.appendChild(numberOfFrame);
  mainFrames.insertBefore(newFrame, mainFrames.children[mainFrames.children.length - 1]);
  currentFrame = mainFrames.children.length - 1;
  frames.push(FrameToArrayOfFrames);
  loadFrame(currentFrame);
  saveThisFrame();
}
duplicateButton.addEventListener('click', duplicateThisFrame);
//dom to image
let showAnimation = document.querySelector('.showAnimation');
domtoimage.toPng(canvas).then(function (dataUrl) {
  let img = new Image();
  img.src = dataUrl;
  showAnimation.appendChild(img);
}).catch(function (error) {
  console.error('oops, something went wrong!', error);
});
