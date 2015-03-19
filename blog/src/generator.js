;(function(global,P){
    var CONFIG = global.CONFIG;
    var Util = P.Util;
    var math = P.Math;
    var Map = P.Map;
    var MATRIX = [];
    function Generator(cfg){
        var that = this;
        Util.merge(that,cfg);
        that.init();
        return that.map;
    }
    var proto = {
        init:function(){
            var that = this;
            that.SCREENWIDTHSIZE = Math.round(CONFIG['SCREENWIDTH']/CONFIG['CELL']);
            that.SCREENHEIGHTSIZE = Math.round(CONFIG['SCREENHEIGHT']/CONFIG['CELL']);
            that.create();
        },
        create:function(){
            var that = this;
            that.creatMap();
            that.creatMeadow();
            that.createPipe();
            that.createBlock();
            that.matrix = MATRIX;
            that.map = new Map({
                matrix:that.matrix,
                size:{
                    width:CONFIG['CELL'],
                    height:CONFIG['CELL']
                },
                x:0,
                y:0,
                resource:that.resource,
                cache:false
            });
        },
        creatMap:function(){
            var that = this;
            for(var y=0;y<that.SCREENHEIGHTSIZE;y++){
                MATRIX[y] = [];
            }
        },
        creatMeadow:function(){
            var that = this;
            var name = 'meadow';
            for(var i=0;i<that.SCREENWIDTHSIZE;i++){
                if(i==0){
                    MATRIX[that.SCREENHEIGHTSIZE -4][i] = name+'00';
                    MATRIX[that.SCREENHEIGHTSIZE -3][i] = name+'10';
                    MATRIX[that.SCREENHEIGHTSIZE -2][i] = name+'20';
                    MATRIX[that.SCREENHEIGHTSIZE -1][i] = name+'30';
                }else if(i == that.SCREENWIDTHSIZE-1){
                    MATRIX[that.SCREENHEIGHTSIZE -4][i] = name+'05';
                    MATRIX[that.SCREENHEIGHTSIZE -3][i] = name+'15';
                    MATRIX[that.SCREENHEIGHTSIZE -2][i] = name+'25';
                    MATRIX[that.SCREENHEIGHTSIZE -1][i] = name+'35';
                }else{
                    MATRIX[that.SCREENHEIGHTSIZE -4][i] = name+'0'+(i%4+1);
                    MATRIX[that.SCREENHEIGHTSIZE -3][i] = name+'1'+(i%4+1);
                    MATRIX[that.SCREENHEIGHTSIZE -2][i] = name+'2'+(i%4+1);
                    MATRIX[that.SCREENHEIGHTSIZE -1][i] = name+'3'+(i%4+1);
                }
            }
        },
        createPipe:function(){
            var that = this;
            var name = 'pipe';
            var x = math.random(25,30);

            MATRIX[that.SCREENHEIGHTSIZE -4][x-1] = 'meadow05';
            MATRIX[that.SCREENHEIGHTSIZE -3][x-1] = 'meadow15';
            MATRIX[that.SCREENHEIGHTSIZE -2][x-1] = 'meadow25';
            MATRIX[that.SCREENHEIGHTSIZE -1][x-1] = 'meadow35';
            MATRIX[that.SCREENHEIGHTSIZE -4][x+2] = 'meadow00';
            MATRIX[that.SCREENHEIGHTSIZE -3][x+2] = 'meadow10';
            MATRIX[that.SCREENHEIGHTSIZE -2][x+2] = 'meadow20';
            MATRIX[that.SCREENHEIGHTSIZE -1][x+2] = 'meadow30';

            MATRIX[that.SCREENHEIGHTSIZE -7][x] = name + '00';
            MATRIX[that.SCREENHEIGHTSIZE -6][x] = name + '00';
            MATRIX[that.SCREENHEIGHTSIZE -5][x] = name + '00';
            MATRIX[that.SCREENHEIGHTSIZE -4][x] = name + '00';
            MATRIX[that.SCREENHEIGHTSIZE -3][x] = name + '00';
            MATRIX[that.SCREENHEIGHTSIZE -2][x] = name + '00';
            MATRIX[that.SCREENHEIGHTSIZE -1][x] = name + '00';
            MATRIX[that.SCREENHEIGHTSIZE -7][x+1] = name + '01';
            MATRIX[that.SCREENHEIGHTSIZE -6][x+1] = name + '01';
            MATRIX[that.SCREENHEIGHTSIZE -5][x+1] = name + '01';
            MATRIX[that.SCREENHEIGHTSIZE -4][x+1] = name + '01';
            MATRIX[that.SCREENHEIGHTSIZE -3][x+1] = name + '01';
            MATRIX[that.SCREENHEIGHTSIZE -2][x+1] = name + '01';
            MATRIX[that.SCREENHEIGHTSIZE -1][x+1] = name + '01';
        },
        createBlock:function(){
            var that = this;
            var name = 'block';
            MATRIX[that.SCREENHEIGHTSIZE -8][5] = name +'00';
            MATRIX[that.SCREENHEIGHTSIZE -8][6] = name +'00';
            MATRIX[that.SCREENHEIGHTSIZE -8][7] = name +'00';

            MATRIX[that.SCREENHEIGHTSIZE -8][35] = name +'00';
            MATRIX[that.SCREENHEIGHTSIZE -8][36] = name +'00';
            MATRIX[that.SCREENHEIGHTSIZE -8][37] = name +'00';

            MATRIX[that.SCREENHEIGHTSIZE -8][55] = name +'00';
            MATRIX[that.SCREENHEIGHTSIZE -8][56] = name +'00';
            MATRIX[that.SCREENHEIGHTSIZE -8][57] = name +'00';

        }
    };
    Util.augment(Generator,proto);
    global.Generator = Generator;
})(window,pillow);
