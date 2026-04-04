;(function(global,P){
    var CONFIG = global.CONFIG;
    var Util = P.Util;
    var Sprite = P.Sprite;
    var RenderObjectModel = P.RenderObjectModel;
    var MARIOWIDTH = 30;
    var MARIOHEIGHT = 37;
    var g = 9.8;
    var CELL = CONFIG['CELL'];

    function isBlockTile(value){
        return value && value.indexOf('block') === 0;
    }

    function isPipeTile(value){
        return value && value.indexOf('pipe') === 0;
    }

    function isWallTile(value){
        return isPipeTile(value) || isBlockTile(value);
    }

    function isGroundTile(value){
        return isWallTile(value) || (value && value.indexOf('meadow') === 0);
    }

    function getTile(matrix,row,col){
        return matrix[row] && matrix[row][col];
    }

    function eachCell(left,top,right,bottom,iterator){
        var startCol = Math.floor(left/CELL);
        var endCol = Math.floor(right/CELL);
        var startRow = Math.floor(top/CELL);
        var endRow = Math.floor(bottom/CELL);
        for(var row = startRow;row<=endRow;row++){
            for(var col = startCol;col<=endCol;col++){
                if(iterator(row,col,getTile(this.matrix,row,col))){
                    return true;
                }
            }
        }
        return false;
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
                var nextY = that.y - v;
                if(that.hitDetector('up',nextY)){
                    that.remove('jump');
                    that.drop();
                }else{
                    that.y = nextY;
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
            that.set('drop',function(){
                var nextY = that.y + 1/2 * g;
                if(that.hitDetector('down',nextY)){
                    that.remove('drop');
                }else{
                    that.y = nextY;
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
        breakBlock:function(row,col){
            var that = this;
            if(!that.matrix[row] || !isBlockTile(that.matrix[row][col])){
                return;
            }
            delete that.matrix[row][col];
            that.spawnBrickDebris(row,col);
        },
        spawnBrickDebris:function(row,col){
            var that = this;
            var blockResource = that.resource && that.resource['block00'];
            var pieceSize = Math.floor(CELL/2);
            var pieces = [
                {sx:0,sy:0,vx:-1.8,vy:-5.4},
                {sx:pieceSize,sy:0,vx:1.8,vy:-5.2},
                {sx:0,sy:pieceSize,vx:-1.2,vy:-3.8},
                {sx:pieceSize,sy:pieceSize,vx:1.2,vy:-3.6}
            ];
            if(!that.screen || !blockResource || !blockResource.image){
                return;
            }
            Util.each(pieces,function(pieceCfg){
                var piece = new RenderObjectModel({
                    x:col*CELL + pieceCfg.sx,
                    y:row*CELL + pieceCfg.sy,
                    width:pieceSize,
                    height:pieceSize,
                    event:false
                });
                piece.life = 0;
                piece.vx = pieceCfg.vx;
                piece.vy = pieceCfg.vy;
                piece.draw = function(){
                    this.context.drawImage(
                        blockResource.image,
                        pieceCfg.sx,
                        pieceCfg.sy,
                        pieceSize,
                        pieceSize,
                        0,
                        0,
                        pieceSize,
                        pieceSize
                    );
                };
                piece.update = function(){
                    this.x += this.vx;
                    this.y += this.vy;
                    this.vy += 0.35;
                    this.life++;
                    if(this.life > 25){
                        this.visible = false;
                        this.update = function(){};
                        this.draw = function(){};
                    }
                };
                that.screen.append(piece);
            });
        },
        hasGroundSupport:function(nextX,nextY){
            var that = this;
            var left = nextX;
            var right = nextX + that.width - 1;
            var supportY = nextY + that.height;
            return eachCell.call(that,left,supportY,right,supportY,function(row,col,value){
                return isGroundTile(value);
            });
        },
        hitDetector:function(type,nextValue){
            var that = this;
            var leftCol = Math.floor(that.x/CELL);
            var rightCol = Math.floor((that.x + that.width - 1)/CELL);
            if(type == 'down'){
                var currentBottom = that.y + that.height - 1;
                var nextBottom = nextValue + that.height - 1;
                var startRow = Math.floor(currentBottom/CELL);
                var endRow = Math.floor(nextBottom/CELL);
                for(var row = startRow;row<=endRow;row++){
                    for(var col = leftCol;col<=rightCol;col++){
                        if(isGroundTile(getTile(that.matrix,row,col))){
                            that.y = row*CELL - that.height;
                            return true;
                        }
                    }
                }
                return false;
            }else if(type=='up'){
                var nextTop = nextValue;
                var startHitRow = Math.floor(nextTop/CELL);
                var endHitRow = Math.floor(that.y/CELL);
                for(var hitRow = endHitRow;hitRow>=startHitRow;hitRow--){
                    var hit = false;
                    for(var hitCol = leftCol;hitCol<=rightCol;hitCol++){
                        var hitTile = getTile(that.matrix,hitRow,hitCol);
                        if(isWallTile(hitTile)){
                            if(isBlockTile(hitTile)){
                                that.breakBlock(hitRow,hitCol);
                            }
                            hit = true;
                        }
                    }
                    if(hit){
                        that.y = (hitRow + 1)*CELL;
                        return true;
                    }
                }
                return false;
            }else if(type=='left'||type=='right'){
                var targetX = nextValue;
                var targetSide = type == 'left' ? targetX : targetX + that.width - 1;
                var blocked = eachCell.call(that,targetSide,that.y,targetSide,that.y + that.height - 1,function(row,col,value){
                    if(isWallTile(value)){
                        that.x = type == 'left' ? (col + 1)*CELL : col*CELL - that.width;
                        return true;
                    }
                });
                if(blocked){
                    return true;
                }
                if(!that.has('jump') && !that.hasGroundSupport(targetX,that.y)){
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
