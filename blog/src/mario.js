;(function(global,P){
    var CONFIG = global.CONFIG;
    var Util = P.Util;
    var Sprite = P.Sprite;
    var MARIOWIDTH = 30;
    var MARIOHEIGHT = 37;
    var g = 9.8;
    var CELL = CONFIG['CELL'];

    function isWallTile(value){
        return value && (value.indexOf('pipe') === 0 || value.indexOf('block') === 0);
    }

    function isGroundTile(value){
        return isWallTile(value) || (value && value.indexOf('meadow') === 0);
    }
    function Mario(cfg){
        var that = this;
        cfg.width = cfg.width||MARIOWIDTH;
        cfg.height = cfg.height||MARIOHEIGHT;
        cfg.x = 0;
        cfg.y = 0;
        that.speedX = 2;
        that.speedY = 2;
        Mario.sup.call(that,cfg);
        Util.merge(that,cfg);
    }
    var proto = {
        forward:function(){
            var that = this;
            var nextX = that.x + that.speedX;
            if(that.hitDetector('right', nextX)){
                return;
            }
            that.x = nextX;
            if(that.x>= CONFIG['SCREENWIDTH']){
                that.x =-10;
            }
            if(that.frame ==11){
                that.to(1);
            }else{
                that.next();
            }
        },
        backforward:function(){
            var that = this;
            var nextX = that.x - that.speedX;
            if(that.hitDetector('left', nextX)){
                return;
            }
            that.x = nextX;
            if(that.x<= 0){
                that.x = CONFIG['SCREENWIDTH'];
            }
            if(that.frame ==11){
                that.to(1);
            }else{
                that.next();
            }
        },
        jump:function(){
            var that = this;
            var v = 10;
            that.set('jump',function(){
                if(that.hitDetector('up')){
                    that.remove('jump');
                }else{
                    that.y -= v;
                    v -= g/20;
                    if(v<0){
                        that.remove('jump');
                        that.drop();
                    }
                }
            });
        },
        drop:function(){
            var that = this;
            if(that.has('drop')){
                return;
            }
            var t = 0;
            that.set('drop',function(){
                if(that.hitDetector('down')){
                    that.remove('drop');
                }else{
                    that.y += 1/2 * g;
                    t++;
                    if(that.y>CONFIG['SCREENHEIGHT']){
                        that.respawn();
                    }
                }
            });
        },
        update:function(){
            var that = this;
            Util.each(that.all(),function(action,k){
                action();
            });
        },
        respawn:function(){
            var that = this;
            that.remove('drop');
            that.remove('jump');
            that.x = 0;
            that.y = 0;
            that.drop();
        },
        hitDetector:function(type,nextX){
            var that = this;
            if(type == 'down'){
                that.cx = Math.round(that.x/CELL);
                that.cy = Math.round((that.y+g/2+MARIOHEIGHT)/CELL);
                var bottomCell = that.matrix[that.cy] && that.matrix[that.cy][that.cx];
                if(isGroundTile(bottomCell)){
                    that.y= that.cy*CELL -MARIOHEIGHT ;
                    return true;
                }
            }else if(type=='up'){
                return false;
            }else if(type=='left'||type=='right'){
                var targetX = nextX;
                var cx = Math.round(targetX/CELL);
                var cyBottom = Math.round((that.y+MARIOHEIGHT-1)/CELL);
                var cyTop = Math.round(that.y/CELL);
                var bottomCell = that.matrix[cyBottom] && that.matrix[cyBottom][cx];
                var topCell = that.matrix[cyTop] && that.matrix[cyTop][cx];
                if(isWallTile(bottomCell) || isWallTile(topCell)){
                    return true;
                }
                if(!that.matrix[cyBottom] || !that.matrix[cyBottom][cx]){
                    that.drop();
                }
                return false;
            }else{

            }
        }
    };
    Util.augment(Mario,proto)
    Util.inherit(Mario,Sprite);
    global.Mario = Mario;
})(window,pillow);
