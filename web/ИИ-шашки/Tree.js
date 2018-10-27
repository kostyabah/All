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

var App = function(setting){
	
	setting.element =  setting.el
		? document.querySelector(setting.el)
		: document.createDocumentFragment();
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
	
	setting._create = function(tag){
		return this.type != "svg"
			? document.createElement(tag)
			: document.createElementNS("http://www.w3.org/2000/svg", tag);
	}
	setting._dom = new Dom(setting);
	
	Object.defineProperties(setting, {
		body : {
			get : function(){
				
				var _self = this;
				var obhod = function(parent, data){
					if(Array.isArray(data)){
						var fragment = data.reduce(obhod, document.createDocumentFragment())
						parent.lastElementChild.appendChild(fragment);
					}else if(typeof data == "object"){
						element = data.tag 
							? _self._create(data.tag)
							: document.createElement('div');
						if('text' in data){
							element.textContent = data.text;
						}
						if(data.style){
							Object.assign(element.style, data.style);
						}
						
						 
						for(prop in data)
						if(["text",'tag',"style"].indexOf(prop) == -1){
							element.setAttribute(prop, data[prop]);
						}
						parent.appendChild(element)    
					}
					return parent
				}
		
				return this._dom.state.reduce(obhod, document.createDocumentFragment());
			}
		},


	})
	setting._manager = {}
	if(setting.on){
		
		setting._on = function(){
			var app = this;
			
			function getHandler(type){
				return function(e){
					var data = e.target.dataset
					
					if(data[type] in app._manager == false)
						return;
					if(type == 'mousemove' && ! PRESS)
						return;
					console.log('hi')
					if(type == 'mousemove' && window.onmousemove == null){
						window.onmousemove = function(e){
							
							var arg = app._getPoint(e);
							
							app._manager[data[type]](arg);
							app._render();
						}
					}else if( type != "mousemove") {
						var arg = type == 'click'? data : e;
						app._manager[data[type]](arg);
						app._render();
					}
				}
			}
			this.on.forEach(function(ls){
				//if(ls == 'mousemove')
					//onmousemove = getHandler(ls);
				app.element['on'+ ls] = getHandler(ls);
			})
		}
		setting._on();
	}
	
	if(setting.animate){
		setting._animate = function(){
		
			function getAnimate(that, change){
				return function(){
					change.call(that.data);
					that._render();
				}
			}
			return setInterval(getAnimate(this, this.animate), 20);
		}
		setting._animate();
	}
	setting._render = function(){
		this._dom.state = [];
		this.element.innerHTML = "";
		this.render.call(this._dom, this.data);
		this.element.appendChild(this.body);
	}
	setting._app = this;
	this._setting = setting; 
	

	var that = this._setting;


	var getter = function(key){
		var data = that.data,
			result = data[key];
		if(typeof data[key] == 'function'){
			result = function(){
				data[key].apply(data, arguments)
				that._render();
			}
		}
		return function(){
			return result;
		}
	}
	var setter = function(key){
		
		return function(value){
			if(typeof value == 'function'){
				//var method = value.bind(this.data);
				that._setting.data[key] = function(){
					method.apply();
					this._render();
				}
			}
			that.data[key] = value;
			that._render();
		}
	}
	var self = this;
	Object.keys(that.data).forEach(function(key){
		Object.defineProperty(self, key, {
			get : getter(key),
			set : setter(key)
		})
	});
	
	that._render();
};


function Dom(app){
	this.state = [];
	this.app = app;
}

Dom.prototype = {  
	get current(){
		return this.state.slice(-1)[0]
	},

	el : function(data){
		this.state.push(data);
		return this;
	},
	
	dataset: function(data){
		for(prop in data){
			this.current['data-'+ prop] = data[prop]
		}
		return this;
	},
	

	click : function(key, data, name){
		name = name || key;
		data = data || this.app.data;
		
		this.dataset({
			click : name
		})
		//console.log(data, key);
		this.app_.manager[name] = data[key].bind(data)
		return this; 
	},
	change : function(key, data, name){
		name = name || key;
		data = data || this.app.data;
		
		this.dataset({
			change : name
		})
		this.app_manager[name] = function(e){
			data[key] = e.target.value
		}
		return this;
	},
	mousemove : function(key, data, name){
		name = name || key;
		data = data || this.app.data;
		
		this.dataset({
			mousemove : name
		})
		this.app._manager[name] = data[key].bind(data)
		return this;
	},
	for : function(data, func){
		if(typeof data == 'number'){
			for(var n = 0; n < data; n++)
				func.call(this, n)
		}else if(Array.isArray(data)){
			var dom = this
			data.forEach(function(value, index){
				func.call(dom, value, index)
			})
		}else if(typeof data == 'object'){
			var index = 0;
			for(prop in data){
				func.call(this, data[prop], prop, index++)
			}
		}
		return this;
	},
	if : function(cond, yes, no){
		if(cond){
			this.state.push(yes.call(this));
		}else if(no){
			this.state.push(no.call(this));
		}
		return this;
	},
	switch : function(key, data, other){
		if(key in data)
			data[key].call(this);
		else if(other)
			other.call(this);
		return this;			
	},
	append : function(func){
		
		var parent = this.state.slice();
		this.state = [];
		func.call(this);
		parent.push(this.state.slice())
		this.state = parent.slice();
		//console.log(this.state);
		return this;
	}  
}
