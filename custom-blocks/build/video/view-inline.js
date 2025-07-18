/******/ (() => { // webpackBootstrap
/*!**********************************!*\
  !*** ./src/video/view-inline.js ***!
  \**********************************/
// Launch video with a poster on click on ots button.
if (document.querySelectorAll('.video-with-poster').length > 0) {
  document.querySelectorAll('.video-with-poster').forEach(videoContainer => {
    videoContainer.querySelector('button').addEventListener('click', e => {
      videoContainer.querySelector('video').play();
      videoContainer.querySelector('img').style.display = 'none';
      videoContainer.querySelector('button').style.display = 'none';
    });
  });
}
/******/ })()
;
//# sourceMappingURL=view-inline.js.map