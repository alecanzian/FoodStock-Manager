import { barcodeDetector_atomic } from "./barcode/barcode.js";
import { setCameraStream } from "./webcam/webcam.js"

const bcDetector = new barcodeDetector_atomic();

// Canvas code
var canvas = document.createElement('canvas');
canvas.style.width='100%';
canvas.style.height='100%';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position='absolute';
canvas.style.left=0;
canvas.style.top=0;
canvas.style.zIndex=100000;
canvas.style.pointerEvents='none';
document.body.appendChild(canvas);

var currentlyDetected;
var waitingOnDetection = true;

var context2D = canvas.getContext("2d");

var BARCODE_DETECTED = false;

document.addEventListener("DOMContentLoaded", async () => {
  let webcamElement = document.getElementById("webcam");
  await setCameraStream(webcamElement);
  webcamElement.addEventListener("loadedmetadata", () => { webcamElement.play() })
  webcamElement.addEventListener("loadedmetadata", () => {
    setInterval(() => {
      if (waitingOnDetection === true) {
        bcDetector.detect(webcamElement).then((res) => {
          if (!(res === null)) {
            context2D.reset();
            context2D.strokeStyle = "green";
            context2D.shadowColor = "#dddddd";
            context2D.lineJoin = "bevel";
            context2D.lineWidth = 10;
            context2D.shadowBlur = 20;
            context2D.strokeRect(res.boundingBox.x, res.boundingBox.y, res.boundingBox.width, res.boundingBox.height);
            currentlyDetected = res.val;
            waitingOnDetection = false;
            useDetection();
          }
        })
      }
    }, 200)
  })
})

document.addEventListener("DOMContentLoaded", async () => {
  let item_elem = document.getElementById("item");
  let amount_elem = document.getElementById("amount");

  let addButton = document.getElementById("add_button");
  let removeButton = document.getElementById("remove_button");

  let alertSpan = document.getElementById("alert_span");

  addButton.addEventListener("click", async () => {
    if (item_elem.value === undefined || item_elem.value === "" || amount_elem === undefined || amount_elem === 0) {
      alertSpan.textContent.appendChild(document.createTextNode("Please enter valid values."))
    }
    else {
      alertSpan.replaceChildren();
      console.log(item_elem.value)
      modifyCount(item_elem.value, amount_elem.value);
    }
  })
  removeButton.addEventListener("click", async () => {
    if (item_elem.value === undefined || item_elem.value === "" || amount_elem === undefined || amount_elem === 0) {
      alertSpan.textContent.appendChild(document.createTextNode("Please enter valid values."))
    }
    else {
      alertSpan.replaceChildren();
      modifyCount(item_elem.value, -amount_elem.value);
    }
  })
})

function useDetection() {
  console.log(currentlyDetected);
  setTimeout(() => { }, 200)
  console.log("Resetting for recapture");
  document.getElementById("item").value = currentlyDetected;
  waitingOnDetection = true;
  return;
}

async function modifyCount(item, amount) {
  let url = window.location.protocol + "//" + location.host + "/api/post";
  let x = JSON.stringify({ item: item, amount: amount })
  console.log(x)
  let req = new Request(url, {
    method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
    body: JSON.stringify({ item: item, amount: amount })
  })
  return await fetch(req);
}
