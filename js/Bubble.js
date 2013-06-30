// requires util.js

// @param row, column, color int, fabric circle object
function Bubble(grid, r, c, canvas, color, circle){
	this.grid = grid;
	this.r = r;
	this.c = c;
	this.color = color;
	this.circle = circle;
	this.circle.Bubble = this;
	this.canvas = canvas;
    this.canvas.add(this.circle);
}

Bubble.prototype.update = function(){
	this.circle.animate('top', this.r*(rad+pad)*2+rad, {
		onChange: this.canvas.renderAll.bind(this.canvas),
		duration: 800,
		easing: fabric.util.ease.easeInCubic
	});	
}

// @param sincle color int
Bubble.prototype.subtractColor = function(coltosubtr){
	this.color &= ~coltosubtr;
	if(this.color != 0)
		this.circle.setFill(getColorString(this.color));
	else this.circle.visible = false;
}
	
Bubble.prototype.toString = function(){
	var ret = ''+this.r+this.c;
	switch(this.color){
		case RED:
			ret += "R";
			break;
		case GREEN:
			ret += "G";
			break;
		case BLUE:
			ret += "B";
			break;
		case CYAN:
			ret += "C";
			break;
		case MAGENTA:
			ret += "M";
			break;
		case YELLOW:
			ret += "Y";
			break;
		case WHITE:
			ret += "W";
			break;
	}
	return ret;
}