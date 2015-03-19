;(function(global,P){
    var CONFIG = global.CONFIG;
    var Util = P.Util;
    var Sprite = P.Sprite;
    var MARIOWIDTH = 30;
    var MARIOHEIGHT = 37;
    var g = 9.8;
    var CELL = CONFIG['CELL'];
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
            that.hitDetector('right');
            that.x += that.speedX;
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
            that.hitDetector('left');
            that.x -= that.speedX;
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
                }
            });
        },
        update:function(){
            var that = this;
            Util.each(that.all(),function(action,k){
                action();
            });
        },
        hitDetector:function(type){
            var that = this;
            if(type == 'down'){
                that.cx = Math.round(that.x/CELL);
                that.cy = Math.round((that.y+g/2+MARIOHEIGHT)/CELL);
                if(that.matrix[that.cy][that.cx] =='meadow00'||that.matrix[that.cy][that.cx] =='meadow01'||that.matrix[that.cy][that.cx] =='meadow02'||that.matrix[that.cy][that.cx] =='meadow03'||that.matrix[that.cy][that.cx] =='meadow04'||that.matrix[that.cy][that.cx] =='meadow05'||that.matrix[that.cy][that.cx] =='block00'){
                    that.y= that.cy*CELL -MARIOHEIGHT ;
                    return true;
                }
            }else if(type=='up'){
                return false;
            }else if(type=='left'||type=='right'){
                that.cx = Math.round(that.x/CELL);
                that.cy = Math.round((that.y+MARIOHEIGHT)/CELL);
                if(!that.matrix[that.cy][that.cx]){
                    that.drop();
                }else{
                    return false;
                }
            }else{
            
            }
        }
    };
    Util.augment(Mario,proto)
    Util.inherit(Mario,Sprite);
    global.Mario = Mario;
})(window,pillow);
