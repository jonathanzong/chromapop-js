// requires config.js

var RED = 0xFF0000;
var GREEN = 0x00FF00;
var BLUE = 0x0000FF;
var CYAN = 0x00FFFF;
var MAGENTA = 0xFF00FF;
var YELLOW = 0xFFFF00;
var WHITE = 0xFFFFFF;
var VALS = [RED,GREEN,BLUE,CYAN,MAGENTA,YELLOW,WHITE];

var SCORE = 0;

function isPrimary(c){
	return c==RED || c==GREEN || c==BLUE;
}

function getColorString(i){
	var hexStr = i.toString(16);
  	while (hexStr.length < 6) { hexStr = '0' + hexStr; } // Zero pad.
  	return '#'+hexStr.toUpperCase();
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

Array.prototype.rotate = function(){
	this.unshift(this.pop());
}

function Set(initialData) {
    // can pass initial data for the set in an object
    this.data = initialData || [];
}

Set.prototype = {
    add: function(key) {
    	for(var i=0;i<this.data.length;i++)
        	if(this.data[i] == key)
        		return;
        this.data.push(key);
    },
    get: function(idx) {
        return this.data[idx];
    },
    pop: function() {
        return this.data.pop();
    },
    contains: function(key) {
        for(var i=0;i<this.data.length;i++)
        	if(this.data[i] == key)
        		return true;
        return false;
    },
    isEmpty: function() {
        return this.data.length === 0;
    },
    keys: function() {
        return this.data;
    },
    size: function() {
    	return this.data.length;
    },
    clear: function() {
        this.data = []; 
    }
};

// @param 2d array grid of bubbles, set (object) of bubbles to delete
function deleteAndFill(grid, delList){
	// rotate bubbles down in place of removed
	for(var i=0;i<delList.size();i++){
		var item = delList.get(i);
		console.log(item);
		if(item.color != 0)
			continue;
		var list = new Array();
		var r = item.r;
		var col = item.c;
		for(var row = 0;row<=r;row++)
			list.push(grid[row][col]);		
		for(var x=0;x<r&&list[list.length-1].color == 0 && delList.contains(list[list.length-1]);x++)
			list.rotate();
		for(var row = 0;row<=r;row++){
			grid[row][col] = list[row];
			list[row].r = row;
			grid[row][col].update();
		}
	}
	// refill bubbles
	if(refill)
		for(var i=0;i<delList.size();i++){
			if(delList.get(i).color==0){
				var color = VALS[(Math.random()*VALS.length)|0];
				var r = delList.get(i).r;
				var c = delList.get(i).c;
				var canvas = delList.get(i).canvas;
		        grid[r][c] = new Bubble(grid, r, c, canvas, color, new fabric.Circle({
		          radius: rad, fill: getColorString(color) ,strokeWidth: 1, stroke: '#c3bfbf', left: c*(rad+pad)*2+rad, top: r*(rad+pad)*2+rad, selectable: false
		        }));
		    }
		}
}

// returns [score, set (object) to pop] or null if invalid click
function doClick(grid, r, c){
	var delList;
	var score;
	if(!isPrimary(grid[r][c].color)){
		//check for consecutive complex colors
		delList = new Set();
		processClick(grid,r,c,grid[r][c].color,true,delList);
		score = delList.size();
		if(score >= 3){
			var subtr = grid[r][c].color;
    		if(grid[r][c].color == 0xFFFFFF) //white x3 multiplier
    			score *= 3;
    		else score *= 2; //non-primary non-white x2 multiplier
    		for(var i=0;i<delList.size();i++)
    			delList.get(i).subtractColor(subtr);   		
    		return [score,delList];
		}
		//decompose and pop primary components
		delList.clear();
		for(var mask = 0xFF0000; mask>=0x0000FF; mask >>= 8){
			var prim = grid[r][c].color & mask;
			if(prim == 0) continue;
			var templist = new Set();
			processClick(grid,r,c,prim,true,templist);
			for(var i=0;i<templist.size();i++){
				templist.get(i).rmcolor = prim;
				delList.add(templist.get(i));
			}
		}
		score = delList.size();
		if(score >= 3){
    		for(var i=0;i<delList.size();i++)
    			delList.get(i).subtractColor(delList.get(i).rmcolor);	    
			return [score,delList];
		}
	}
	else{
		//pop 3 or more consecutive primaries - decompose complex
		delList = new Set();
		processClick(grid,r,c,grid[r][c].color,true,delList);
		score = delList.size();
		if(score >= 3){
			var subtr = grid[r][c].color;
    		for(var i=0;i<delList.size();i++)
    			delList.get(i).subtractColor(subtr);
			return [score,delList];
		}
	}    	
	return null;
}


//method fills param-traversed with the bubbles to pop
//@param 2d grid, row, col, color int, boolean, set (object)
function processClick(grid, r, c, curCommon, strictcolors, traversed){
	if(curCommon == 0)
		return;
	var frontier = new Set();
	frontier.add(grid[r][c]);
	while(!frontier.isEmpty()){
		var cur = frontier.pop();
		r = cur.r;
		c = cur.c;
		if(r<0 || r>= grid.length || c<0 || 
			c>= grid[r].length)
			continue;
		if(traversed.contains(grid[r][c]))
			continue;
		traversed.add(grid[r][c]);
		for(var x=-1;x<=1;x++){
			for(var y=-1;y<=1;y++){
				if(x==0&&y==0||x!=0&&y!=0 || r+x<0 || r+x >= grid.length || c+y<0 || c+y>=grid[r].length) continue;
				var crit = strictcolors ?
						grid[r+x][c+y].color == curCommon : // strictly equal colors
						grid[r+x][c+y].containsColor(curCommon); // contains the search color - too OP
				if(crit){
					frontier.add(grid[r+x][c+y]);
				}
			}
		}
	}	
}