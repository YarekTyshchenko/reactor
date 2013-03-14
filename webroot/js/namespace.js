var Reactor = Reactor || {
    Collection: {},
    Model: {},
    View: {}
}

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  // Temporary override to limit framerate
  //return function( callback ){
  //  window.setTimeout(callback, 1000 / 5);
  //};
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();