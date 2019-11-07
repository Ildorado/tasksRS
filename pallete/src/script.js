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
const transform = document.getElementById('transform');
const currentColor = document.getElementById('current-color');
currentColor.style.backgroundColor = 'green';
const previousColor = document.getElementById('previous-color');
const canvas = document.getElementById('canvas');
const refreshButton = document.getElementById('refresh_Button');
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
  if (e.target.classList.contains('circle')) {
    e.target.classList.remove('circle');
  }
  else {
    e.target.classList.add('circle');
  }
  document.body.style.cursor = 'default';
  canvas.removeEventListener('click', Transforming_function);
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
let animateButton = document.querySelector('.AnimateButton');
let showAnimation = document.querySelector('.showAnimation');
let takePictureButton = document.querySelector('.takePictureButton');
let clearAnimatonButton = document.querySelector('.clearAnimationBotton');
function takePicture() {
  domtoimage.toPng(canvas).then(function (dataUrl) {
    let img = new Image();
    img.src = dataUrl;
    img.classList.add('AnimationImg');
    img.style.display = 'none';
    showAnimation.appendChild(img);
  }).catch(function (error) {
    console.error('oops, something went wrong!', error);
  });
}
let i = 0;
let interval = null;
function goThroughFrames() {
  if (i == showAnimation.children.length - 1) {
    i = 0;
  }
  else {
    i++;
  }
  for (let j = 0; j < showAnimation.children.length; j++) {
    if (j !== i) {
      showAnimation.children[j].style.display = 'none';
    }
    else {
      showAnimation.children[j].style.display = '';
    }
  }
}
let FPS = document.querySelector('.FPS');
function animateEvent() {
  let delta = FPS.value;
  if (delta < 1) { delta = 1; }
  else if (delta > 24) { delta = 24; }
  clearInterval(interval);
  interval = window.setInterval(goThroughFrames, 1000 / delta);
}
function clearAnimation() {
  clearInterval(interval);
  showAnimation.innerHTML = '';
}
takePictureButton.addEventListener('click', takePicture);
animateButton.addEventListener('click', animateEvent);
clearAnimatonButton.addEventListener('click', clearAnimation);
//fullscreen
let FullscreenButton = document.querySelector('.FullscreenButton');
FullscreenButton.addEventListener('click', fullScreenEvent);
function fullScreenEvent() {
  if (showAnimation.innerHTML !== '') {
    showAnimation.requestFullscreen();
  }
}
