var container = document.querySelector("#unity-container");
var canvas = document.querySelector("#unity-canvas");
var loadingBar = document.querySelector("#unity-loading-bar");
var progressBarFull = document.querySelector("#unity-progress-bar-full");
var fullscreenButton = document.querySelector("#unity-fullscreen-button");
var warningBanner = document.querySelector("#unity-warning");
var footer = document.querySelector("#unity-footer");
// Shows a temporary message banner/ribbon for a few seconds, or
// a permanent error message on top of the canvas if type=='error'.
// If type=='warning', a yellow highlight color is used.
// Modify or remove this function to customize the visually presented
// way that non-critical warnings and error messages are presented to the
// user.
function unityShowBanner(msg, type) {
  function updateBannerVisibility() {
    warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
  }
  var div = document.createElement('div');
  div.innerHTML = msg;
  warningBanner.appendChild(div);
  if (type == 'error') div.style = 'background: red; padding: 10px;';
  else {
    if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
    setTimeout(function() {
      warningBanner.removeChild(div);
      updateBannerVisibility();
    }, 5000);
  }
  updateBannerVisibility();
}

var buildUrl = "Build";
var loaderUrl = buildUrl + "/web.loader.js";
var config = {
  dataUrl: buildUrl + "/web.data.unityweb",
  frameworkUrl: buildUrl + "/web.framework.js.unityweb",
  codeUrl: buildUrl + "/web.wasm.unityweb",
  streamingAssetsUrl: "StreamingAssets",
  companyName: "com.tafl",
  productName: "Ohayo Master",
  productVersion: "1.5",
  showBanner: unityShowBanner,
};

// By default Unity keeps WebGL canvas render target size matched with
// the DOM size of the canvas element (scaled by window.devicePixelRatio)
// Set this to false if you want to decouple this synchronization from
// happening inside the engine, and you would instead like to size up
// the canvas DOM size and WebGL render target sizes yourself.
// config.matchWebGLToCanvasSize = false;
console.log("init unity")
 // 利用 CSS3 旋转 对根容器逆时针旋转 90 度
 var detectOrient = function () {
  var width = document.documentElement.clientWidth,
    height = document.documentElement.clientHeight,
    $wrapper = document.getElementsByTagName('body')[0],
    style = "";
  if (width >= height) { // 横屏
    style += "width:" + width + "px;"; // 注意旋转后的宽高切换
    style += "height:" + (height - 50) + "px;";
    style += "-webkit-transform: rotate(0); transform: rotate(0);";
    style += "-webkit-transform-origin: 0 0;";
    style += "transform-origin: 0 0;";
    canvas.style.width = width + "px";
    canvas.style.height =height + "px";
    console.log(1)
  } else { // 竖屏
    style += "width:" + height + "px;";
    style += "height:" + (height - 50) + "px;";
    style += "-webkit-transform: rotate(90deg); transform: rotate(90deg);";
    // 注意旋转中点的处理
    style += "-webkit-transform-origin: " + width / 2 + "px " + width / 2 + "px;";
    style += "transform-origin: " + width / 2 + "px " + width / 2 + "px;";
    canvas.style.width = height + "px";
    canvas.style.height = width + "px";
    console.log(2)
  }
  canvas.style.cssText = style;
}
// window.onresize = detectOrient;
detectOrient();

// if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  
//   unityShowBanner('WebGL builds are not supported on mobile devices.');
// } else {
//   // Desktop style: Render the game canvas in a window that can be maximized to fullscreen:

//   canvas.style.width = window.innerWidth + "px";
//   canvas.style.height = window.innerHeight + "px";
// }

loadingBar.style.display = "block";

var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
  createUnityInstance(canvas, config, (progress) => {
    progressBarFull.style.width = 100 * progress + "%";
  }).then((unityInstance) => {
    loadingBar.style.display = "none";
    window.unityInstance = unityInstance;
    fullscreenButton.onclick = () => {
      unityInstance.SetFullscreen(1);
    };
  }).catch((message) => {
    alert(message);
  });
};
document.body.appendChild(script);