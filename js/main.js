// requires jquery, config, utils, and Bubble

window.onload = function(){
    var canvas = new fabric.Canvas('c');
    canvas.selection = false;
    canvas.setWidth(n*(rad+pad)*2);
    canvas.setHeight(m*(rad+pad)*2+fontSize*2);

    // m x n matrix
    var grid = createArray(m,n);

    for(var r=0;r<m;r++){
        for(var c=0;c<n;c++){
            var color = VALS[(Math.random()*VALS.length)|0];
            grid[r][c] = new Bubble(grid, r, c, canvas, color, new fabric.Circle({
              radius: rad, fill: getColorString(color) ,strokeWidth: 1, stroke: '#c3bfbf', left: c*(rad+pad)*2+rad, top: r*(rad+pad)*2+rad, selectable: false
            }));
        }
    }

    var score = new fabric.Text("Score: 0", {
        left: canvas.getWidth()/2,
        top: canvas.getHeight()-fontSize,
        fontFamily: 'Helvetica',
        strokeStyle: '#f7f7f7',
        strokeWidth: 1,
        fill: '#F7F7F7'
    });
    canvas.add(score);

    canvas.on('mouse:down', function(options) {
        if (options.target) {
            var bubble = options.target.Bubble;
            var arr = doClick(grid, bubble.r, bubble.c);
            if(arr){
                SCORE += (arr[0]);
                score.text = "Score: "+SCORE;
                deleteAndFill(grid,arr[1]);
                canvas.renderAll();
            }
        }
    });
};