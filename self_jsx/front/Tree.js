var PRESS = false;
var change = function(){}
window.onload = function(){
	this.onmouseup = function(){
		PRESS = false;
		this.onmousemove = null;
		//this.onmousemove = null;
	}
	this.onmousedown = function(){
		PRESS = true;
	}	
}
var points = function(value){
	
	return value.reduce(function(result, value, n){
		if( n%2 ) return result + value +','
		else return result + value + ' '
	}, '')	
}
var rgb = function(value){
	if(value.length = 3)
		value.push(255)
	return `rgba(${value.join(", ")})`
}
var hsl = function(value){
	return `hsl(${value[0]}, ${value[1]}%, ${value[2]}%)`
}

export default function(setting){
	
	//Object.assign(setting, {})
	setting.width = setting.width || setting.element.clientWidth;
	setting.height = setting.height || setting.element.clientHeight; 
	setting._getPoint = function(e){
		var that = this,
			coord = that.element.getBoundingClientRect(),
			x = (e.clientX - coord.left) * that.width / that.element.clientWidth,
			y = (e.clientY - coord.top) * that.height / that.element.clientHeight;
		return {
			x : Math.round(x),
			y : Math.round(y)	
		}
		
	}
	
	if(setting.animate){
		var animate = function(){
		
			function getAnimate(that, change){
				return function(){
					change.call(that.data);
					that._render();
				}
			}
			return setInterval(getAnimate(setting, setting.animate), 20);
		}
		animate();
	}
	setting._render = function(){
		//this._dom.state = [];
		var parent = this.element.parentNode;
		var young = this.render.call(this.data, this.data.props);
		parent.replaceNode(young, this.element)
		this.element = young;
	}

	this._setting = setting; 

	var getter = function(key){

		var result = that._setting.data[key];
		//var result;
		if(typeof result == "function"){
			result = function(){
				result.apply(that._setting.data, arguments);
				that._setting.render
				.call(that._setting.data)
			}
		}
		return function(){
			return result
		}
	}
	var setter = function(key){
		
		return function(value){
			that._setting.data[key] = value;
			that._setting.render();
		}
	}
	Object.keys(that._setting.data).forEach(function(key){
		Object.defineProperty(that, key, {
			get : getter(key),
			set : setter(key)
		})
	});
	
	that._setting._render();
};


  

