;(function(global){
    var PATH = 'blog/resource/';
    var Q = [];
    var addSource = function(v){
        v.src = PATH + v.src;
        Q.push(v);
    }
    addSource({
        id:'bg00',
        src:'bg-00.png'
    });
    addSource({
        id:'mario00',
        src:'mario-00.png'
    });
    addSource({
        id:'pipe00',
        src:'pipe-00.png'
    });
    addSource({
        id:'pipe01',
        src:'pipe-01.png'
    });
    addSource({
        id:'block00',
        src:'block-00.png'
    });
    addSource({
        id:'cloud00',
        src:'cloud-00.png'
    });
    addSource({
        id:'cloud01',
        src:'cloud-01.png'
    });
    addSource({
        id:'tree00',
        src:'tree-00.png'
    });
    addSource({
        id:'tree01',
        src:'tree-01.png'
    });
    addSource({
        id:'tree02',
        src:'tree-02.png'
    });
    addSource({
        id:'tree03',
        src:'tree-03.png'
    });
    for(var x=0;x<6;x++){
        for(var y=0;y<4;y++){
            addSource({
                id:'meadow'+y+x,
                src:'meadow-'+y+x+'.png'
            });
        }
    }
    global.Resource = Q;
})(window);
