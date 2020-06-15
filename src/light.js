Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ODRjNjcyZC02MWNiLTRiMjktODUwMi01ZjRhNTg0ODRiZmMiLCJpZCI6MzIwLCJpYXQiOjE1MjUyMjExOTF9.2WKC_dGzCKPCqdn051lh2MjiP85suxaOtYfnqb5dTzI";

var satBase = new Cesium.UrlTemplateImageryProvider({
  url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  tileWidth: 128,
  tileHeight: 128
});
satBase.defaultAlpha = 0.7;
var mapBase = new Cesium.MapboxStyleImageryProvider({
  username: "yanpogutsa",
  styleId: "ck93derk3314v1ioao222bsh2",
  accessToken:
    "pk.eyJ1IjoieWFucG9ndXRzYSIsImEiOiJjajBhMzJydzIwZmtmMndvY3ozejFicTdqIn0.T6DCFk1BSoEkdG-2agIoQQ"
});

var viewer = new Cesium.Viewer("cesiumContainer", {
  requestRenderMode: true,
  maximumRenderTimeChange: Infinity,
  selectionIndicator: false,
  infoBox: false,
  scene3DOnly: true,
  sceneModePicker: false,
  fullscreenButton: false,
  homeButton: false,
  animation: false,
  timeline: false,
  geocoder: false,
  navigationHelpButton: false,
  baseLayerPicker: false,
  projectionPicker: true,
  skyBox: new Cesium.SkyBox({ show: false }),
  imageryProvider: satBase
});
viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#6c6419"); //3f3b18
//viewer.scene.globe.baseColor = Cesium.Color.WHITE;
//viewer.resolutionScale = window.devicePixelRatio;
//viewer.scene.debugShowFramesPerSecond = true;
viewer.scene.postProcessStages.fxaa.enabled = true;

const lowQ = 2.5;
const highQ = 1.5;
var scene = viewer.scene;
///////////////////////////////////////////////1000
let tileset = viewer.scene.primitives.add(
  new Cesium.Cesium3DTileset({
    url: "./src/master-tileset.json",
    skipLevelOfDetail: true,
    immediatelyLoadDesiredLevelOfDetail: true,
    maximumScreenSpaceError: lowQ,
    maximumNumberOfLoadedTiles: 10,
    maximumMemoryUsage: 256
  })
);

var droneBounds = Cesium.GeoJsonDataSource.load("./src/droneBounds.geojson", {
  stroke: new Cesium.Color(0.23, 0.77, 1, 0.4),
  fill: new Cesium.Color(0.23, 0.77, 1, 0.2)
}).then(function(droneBounds) {
  droneBounds.name = "extent";
  viewer.dataSources.add(droneBounds);
  droneBounds.show = false;
});

///////////////////////////////////////////////drone
/*const tileset = require("./tilesets.json");
for (var i = 0; i < tileset.drone.length; i++) {
  tileset.drone[i] = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
      url:
        "https://smart.mos.ru/geodata/3dtiles/rfgm/drone/" +
        tileset.drone[i] +
        "/tileset.json",
      maximumScreenSpaceError: 1,
      skipLevelOfDetail: true,
      immediatelyLoadDesiredLevelOfDetail: true,
      maximumNumberOfLoadedTiles: 10
    })
  );
}*/

var center = Cesium.Cartesian3.fromDegrees(37.618, 55.751, 4000);
viewer.scene.camera.setView({
  destination: center
});
/*
function updatePostProcess() {
  var ambientOcclusion = viewer.scene.postProcessStages.ambientOcclusion;
  ambientOcclusion.enabled = true;
  ambientOcclusion.uniforms.ambientOcclusionOnly = true;
  ambientOcclusion.uniforms.intensity = 1;
  ambientOcclusion.uniforms.bias = 0;
  ambientOcclusion.uniforms.lengthCap = 100;
  ambientOcclusion.uniforms.stepSize = 10;
  ambientOcclusion.uniforms.blurStepSize = 0;
}
updatePostProcess();
*/
let bOrtho = document.getElementById("ortho");
let bNorth = document.getElementById("north");
//let sliderMassive = document.getElementsByClassName("slider");
let slider = document.getElementById("quality"); //sliderMassive[0]; quality

slider.addEventListener("click", function() {
  var sliderValue = window
    .getComputedStyle(document.querySelector("#quality"), ":before")
    .getPropertyValue("content");
  if (sliderValue === `"low"`) {
    viewer.resolutionScale = window.devicePixelRatio;
    tileset.maximumScreenSpaceError = highQ;
    scene.requestRender();
  } else {
    viewer.resolutionScale = 1;
    tileset.maximumScreenSpaceError = lowQ;
    scene.requestRender();
  }
});

let source = document.getElementById("source");
source.addEventListener("click", function() {
  var sliderValue = window
    .getComputedStyle(document.querySelector("#source"), ":before")
    .getPropertyValue("content");

  let droneBoundsLayer = viewer.dataSources.getByName("extent")[0];
  if (sliderValue === `"plane"`) {
    tileset.destroy();
    droneBoundsLayer.show = true;
    tileset = viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: "./src/master-tileset-drone.json",
        skipLevelOfDetail: true,
        immediatelyLoadDesiredLevelOfDetail: true,
        maximumScreenSpaceError: lowQ,
        maximumNumberOfLoadedTiles: 10,
        maximumMemoryUsage: 256
      })
    );
    scene.requestRender();
  } else {
    tileset.destroy();
    droneBoundsLayer.show = false;
    tileset = viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: "./src/master-tileset.json",
        skipLevelOfDetail: true,
        immediatelyLoadDesiredLevelOfDetail: true,
        maximumScreenSpaceError: lowQ,
        maximumNumberOfLoadedTiles: 10,
        maximumMemoryUsage: 256
      })
    );
    scene.requestRender();
  }
});

bNorth.addEventListener("click", function() {
  var center = viewer.camera.position;
  viewer.scene.camera.flyTo({
    destination: center,
    duration: 0.5,
    orientation: {
      heading: 0,
      pitch: -Math.PI / 2
    },
    complete: function() {
      bNorth.style.display = "none";
      scene.requestRender();
    }
  });
});
bOrtho.addEventListener("click", function() {
  if (bOrtho.className === "q") {
    bOrtho.className = "q-active";
    viewer.projectionPicker.viewModel.switchToOrthographic();
    scene.requestRender();
  } else {
    bOrtho.className = "q";
    viewer.projectionPicker.viewModel.switchToPerspective();
    scene.requestRender();
  }
});

let bToggle = document.getElementById("toggle");
bToggle.addEventListener("click", function(e) {
  if (tileset.show === true) {
    e.currentTarget.className = "q-active";
    tileset.show = false;
    scene.requestRender();
  } else {
    e.currentTarget.className = "q";
    tileset.show = true;
    scene.requestRender();
  }
});

let altField = document.getElementById("alt");

viewer.camera.moveEnd.addEventListener(function() {
  var heightData = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
    viewer.camera.position
  ).height;
  //let heightValue = Math.round(heightData) + " m";
  altField.value = Math.round(heightData);
});

altField.addEventListener("change", function() {
  let altValue = altField.value;
  altField.blur();
  if (altValue > 200) {
    var currentPosition = viewer.camera.positionCartographic;
    viewer.camera.position = new Cesium.Cartesian3.fromRadians(
      currentPosition.longitude,
      currentPosition.latitude,
      altValue
    );
    scene.requestRender();
  }
});

viewer.camera.changed.addEventListener(function() {
  let north = Cesium.Math.toDegrees(viewer.camera.heading);
  if (north < 359 && north > 1) {
    bNorth.style.display = "inline-block";
    bNorth.style.transform = "rotate(" + -north + "deg)";
  } else {
    bNorth.style.display = "none";
  }
});

var rectangle = Cesium.Rectangle.fromDegrees(-180, -90, 180, 90);
var blancLayer = viewer.entities.add({
  rectangle: {
    coordinates: rectangle,
    material: ""
  },
  show: false
});

var blanc = document.querySelector("#blanc");
blanc.addEventListener("click", function() {
  if (blancLayer.show == false) {
    blancLayer.show = true;
    blanc.className = "q-active";
    scene.requestRender();
  } else {
    blancLayer.show = false;
    blanc.className = "q";
    scene.requestRender();
  }
});

////////////////////////////PANO
var modal = document.getElementById("myModal");
var iFrame = document.getElementById("iFrame");

window.onclick = function(e) {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};

let togglePick = false;
var pick = document.getElementById("pano");
var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

pick.addEventListener("click", function(e) {
  if (togglePick === false) {
    e.currentTarget.className = "q-active";
    togglePick = true;
    handler.setInputAction(function(e) {
      var feature = viewer.scene.pick(e.position);
      if (Cesium.defined(feature)) {
        var cartesian = viewer.scene.pickPosition(e.position);
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        var lng = Cesium.Math.toDegrees(cartographic.longitude);
        var lat = Cesium.Math.toDegrees(cartographic.latitude);
        var urlPano =
          "https://www.google.com/maps/embed/v1/streetview?key=AIzaSyAiBlN_z2kIvx1ZX-3yAclOVxUVCNOkiLs&location=" +
          lat +
          "," +
          lng +
          "&heading=360&pitch=10&fov=65";
        iFrame.src = urlPano;
        modal.style.display = "block";
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    document.body.style.cursor = "crosshair";
  } else {
    e.currentTarget.className = "q";
    togglePick = false;
    document.body.style.cursor = "";
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
});

let memo = document.querySelector("#memo");

function memoryTickF() {
  let memoSum = Math.floor(tileset.totalMemoryUsageInBytes / 1000000);
  let memoValue = memoSum + " MB";
  let h = 50 - memoSum / 30;
  let a = 0.2 + memoSum / 1000;
  let color = "hsla(" + h + ",81%,72%," + a + ")";
  //let color = "rgba(255,111,97," + memoSum / 1000 + ")";
  memo.innerHTML = memoValue;
  memo.style.background = color;
}

var memoryTick;

memoryTick = setInterval(memoryTickF, 1000);

memo.addEventListener("click", function() {
  tileset.trimLoadedTiles();
});

let tab = document.querySelector("#tab");
let toolbar = document.querySelector(".cesium-viewer-toolbar");

let currentLayer = 0;
var layers = viewer.imageryLayers;
var baseLayer = layers.get(0);
let baseLayerPicker = document.querySelector("#base");

baseLayerPicker.addEventListener("click", function() {
  //layers.remove(baseLayer);
  viewer.scene.globe.imageryLayers.removeAll();
  if (currentLayer === 0) {
    baseLayerPicker.className = "q-active";
    viewer.scene.globe.baseColor = Cesium.Color.WHITE;
    layers.addImageryProvider(mapBase);
    currentLayer = 1;
  } else {
    baseLayerPicker.className = "q";
    viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#6c6419");
    layers.addImageryProvider(satBase);
    currentLayer = 0;
  }
});

document.addEventListener("keydown", function(event) {
  if (event.code === "KeyZ") {
    tab.style.display = "none";
    toolbar.style.display = "none";
  }
});

document.addEventListener("keydown", function(event) {
  if (event.code === "KeyX") {
    tab.style.display = "block";
    toolbar.style.display = "block";
  }
});
////////////////////////////////////////////////////////////////////////////////////
let counter = 0;
const snapshot = document.querySelector("#snapshot");
snapshot.addEventListener("click", function() {
  counter++;
  let tail = Math.random()
    .toString(36)
    .substring(9);
  let res = viewer.resolutionScale;
  var timeout = 100; // in ms
  //////////////////////////////////WORLD FILE
  if (bOrtho.className === "q") {
    bOrtho.className = "q-active";
    viewer.projectionPicker.viewModel.switchToOrthographic();
    scene.requestRender();
  }
  /*viewer.camera.setView({
    orientation: {
      heading: 0,
      pitch: -Math.PI / 2
    }
  });*/
  let saveWorldFile = function() {
    var posUL = viewer.camera.pickEllipsoid(
      new Cesium.Cartesian2(0, 0),
      Cesium.Ellipsoid.WGS84
    );
    var lon1 = Cesium.Math.toDegrees(
      Cesium.Cartographic.fromCartesian(posUL).longitude
    );
    var lat1 = Cesium.Math.toDegrees(
      Cesium.Cartographic.fromCartesian(posUL).latitude
    );

    var posLR = viewer.camera.pickEllipsoid(
      new Cesium.Cartesian2(
        viewer.canvas.width / res,
        viewer.canvas.height / res
      ),
      Cesium.Ellipsoid.WGS84
    );
    var lon2 = Cesium.Math.toDegrees(
      Cesium.Cartographic.fromCartesian(posLR).longitude
    );
    var lat2 = Cesium.Math.toDegrees(
      Cesium.Cartographic.fromCartesian(posLR).latitude
    );

    var xsize = viewer.canvas.width;
    var ysize = viewer.canvas.height;
    if (lon1 < lon2) {
      var t = +lon1;
      lon1 = lon2;
      lon2 = t;
    }
    var ppx = (lon1 - lon2) / xsize;
    if (lat1 > lat2) {
      var t = +lat1;
      lat1 = lat2;
      lat2 = t;
    }
    var ppy = (lat1 - lat2) / ysize;
    lon2 += ppx / 2; // x center of pixel
    lat2 += ppy / 2; // y center of pixel
    var wf =
      ppx.toString() +
      "\n" +
      "0.00000\n0.00000\n" +
      ppy.toString() +
      "\n" +
      lon2.toString() +
      "\n" +
      lat2.toString();
    var blob = new Blob([wf], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "Screenshot" + counter + "-" + tail + ".jgw");
  };

  ///////////////////////////////////////////SAVE IMAGE

  var prepareScreenshot = function() {
    scene.preRender.removeEventListener(prepareScreenshot);
    setTimeout(function() {
      scene.postRender.addEventListener(takeScreenshot);
    }, timeout);
  };

  var takeScreenshot = function() {
    scene.postRender.removeEventListener(takeScreenshot);
    var canvas = scene.canvas;
    canvas.toBlob(function(blob) {
      var url = URL.createObjectURL(blob);
      downloadURI(url, "Screenshot" + counter + "-" + tail + ".jpeg");
    });
  };

  tileset.readyPromise.then(function() {
    scene.preRender.addEventListener(prepareScreenshot);
    setTimeout(saveWorldFile, timeout);
  });

  function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
});

var F1 = document.querySelector("#F1");

var streetview = false;

function globalResetPOV() {
  streetview = false;
  F1.className = "q";
  scene.screenSpaceCameraController.enableRotate = true;
  scene.screenSpaceCameraController.enableTranslate = true;
  scene.screenSpaceCameraController.enableLook = true;
  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
  handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  clearInterval(updateTimer);
}
F1.addEventListener("click", function() {
  if (streetview === false) {
    streetview = true;
    F1.className = "q-active";
    handler.setInputAction(function(e) {
      var feature = viewer.scene.pick(e.position);
      if (Cesium.defined(feature)) {
        var currentHeading = viewer.camera.heading;
        var cartesian = viewer.scene.pickPosition(e.position);
        cartesian.z += 1.6;
        viewer.scene.camera.flyTo({
          destination: cartesian,
          duration: 1,
          orientation: {
            pitch: Cesium.Math.toRadians(0.0),
            heading: currentHeading
          },
          complete: activateWASD()
        });
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  } else {
    globalResetPOV();
  }
});

var updateTimer;

function activateWASD() {
  var canvas = viewer.canvas;
  var ellipsoid = scene.globe.ellipsoid;

  // disable the default event handlers
  scene.screenSpaceCameraController.enableRotate = false;
  scene.screenSpaceCameraController.enableTranslate = false;
  //scene.screenSpaceCameraController.enableZoom = false;
  //scene.screenSpaceCameraController.enableTilt = false;
  scene.screenSpaceCameraController.enableLook = false;

  var startMousePosition;
  var mousePosition;
  var flags = {
    looking: false,
    moveForward: false,
    moveBackward: false,
    moveUp: false,
    moveDown: false,
    moveLeft: false,
    moveRight: false
  };

  handler.setInputAction(function(movement) {
    flags.looking = true;
    mousePosition = startMousePosition = Cesium.Cartesian3.clone(
      movement.position
    );
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

  handler.setInputAction(function(movement) {
    mousePosition = movement.endPosition;
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  handler.setInputAction(function(position) {
    flags.looking = false;
  }, Cesium.ScreenSpaceEventType.LEFT_UP);

  function getFlagForKeyCode(keyCode) {
    switch (keyCode) {
      case "W".charCodeAt(0):
        return "moveForward";
      case "S".charCodeAt(0):
        return "moveBackward";
      case "Q".charCodeAt(0):
        return "moveUp";
      case "E".charCodeAt(0):
        return "moveDown";
      case "D".charCodeAt(0):
        return "moveRight";
      case "A".charCodeAt(0):
        return "moveLeft";
      default:
        return undefined;
    }
  }

  document.addEventListener(
    "keydown",
    function(e) {
      var flagName = getFlagForKeyCode(e.keyCode);
      if (typeof flagName !== "undefined" && streetview === true) {
        flags[flagName] = true;
      }
    },
    false
  );
  document.addEventListener(
    "keyup",
    function(e) {
      var flagName = getFlagForKeyCode(e.keyCode);
      if (typeof flagName !== "undefined" && streetview === true) {
        flags[flagName] = false;
      }
    },
    false
  );

  //viewer.clock.onTick.addEventListener(function(clock) {
  function updateCam() {
    var camera = viewer.camera;

    if (flags.looking) {
      var width = canvas.clientWidth;
      var height = canvas.clientHeight;

      // Coordinate (0.0, 0.0) will be where the mouse was clicked.
      var x = (mousePosition.x - startMousePosition.x) / width;
      var y = -(mousePosition.y - startMousePosition.y) / height;

      var lookFactor = 0.1;
      camera.lookRight(x * lookFactor);
      //camera.lookUp(y * lookFactor);
    }

    // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
    var cameraHeight = ellipsoid.cartesianToCartographic(camera.position)
      .height;
    var moveRate = 0.1; //cameraHeight / 100 - 1.5;

    if (flags.moveForward) {
      camera.moveForward(moveRate);
    }
    if (flags.moveBackward) {
      camera.moveBackward(moveRate);
    }
    if (flags.moveUp) {
      camera.moveUp(moveRate);
    }
    if (flags.moveDown) {
      camera.moveDown(moveRate);
    }
    if (flags.moveLeft) {
      camera.moveLeft(moveRate);
    }
    if (flags.moveRight) {
      camera.moveRight(moveRate);
    }
  }

  updateTimer = setInterval(updateCam, 5);

  handler.setInputAction(function() {
    globalResetPOV();
  }, Cesium.ScreenSpaceEventType.WHEEL);
}
