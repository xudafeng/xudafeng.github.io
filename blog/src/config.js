(function(global,P){
    var SCREENWIDTH = document.body.clientWidth;
    var SCREENHEIGHT = document.body.clientHeight;
    var CONFIG = {
        CELL:16,
        SCREENWIDTH:SCREENWIDTH,
        SCREENHEIGHT:SCREENHEIGHT,
        FPS:60
    };
    global.CONFIG = CONFIG;
})(window,pillow);
