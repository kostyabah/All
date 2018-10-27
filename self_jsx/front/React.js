//import { moveCursor } from "readline";
var parent = null;
var Tree = {
	replaceChild(component){
		if(this.iteration > this.child.length){
			this.child.push(component)
			this.iteration++;
		}	
		else
			this.child[this.iteration-1] = component
	},
	nextChild(){
		
		if(this.iteration  > this.child.length)
			return false
		else{
			this.iteration ++;
			return this.child[this.iteration-1];
		}	 
	},
	clear(){
		while(this.iteration < this.child.length){
			this.child.pop();
			this.iteration--;
		}
		this.iteration = 0;
	}
}
export function createElement (tag, attrs, ...children) {
	
	//console.log({tag, attrs, children});
	var e, component;
	//console.log(tag);
	if(typeof tag == "function"){
		try {
			e = tag(attrs)
		}catch(g){
			
			component = Router.root && Router.root.nextChild();
			
			if(!component && (component instanceof tag) == false ){
				component = new tag(Router.root);
				if(Router.root)
					Router.root.replaceChild(component);
			}
			
			//console.log(component)
			Router.root = component
			component.render(attrs);
			
			Router.root = component.getParent();
			//console.log(component)
			
			e = component.element;
		}
		
		
	}
	
	else if(typeof tag == "object"){
		e = tag.render(attrs);
	}
	else{
		
		e = document.createElement(tag);
		if(e instanceof HTMLUnknownElement)
			e = document.createElementNS("http://www.w3.org/2000/svg", tag);
		if(attrs) for (var name in attrs) {
			if(name == 'style') Object.assign(e.style, attrs.style)
			else e[name] = attrs[name]; 
		}
	}
	//console.log({tag, attrs, children});
	var append = (child) => {
		if(Array.isArray(child))
			child.forEach(append)
		else if(child instanceof HTMLElement)
			e.appendChild(child)
		else if(typeof child == 'object'){
			//console.log(child.element);
			e.appendChild(child.element)
		}
		else{
			e.textContent += child
		}		
	} 
	children.forEach(append) 
	//console.log(e);
	return  e;	
}
export function render(component, where){
	where.innerHTML = "";
	console.log(component);
	where.appendChild(component);
					
}

var Router = {
	handlers : [],
	root: null,
	finalTo(){
		if(this.handlers.length)
			return;
			
		this.root.render();
		console.log(this.root)
	},
	gethandler(method, prop, caller){
		var router = this;
		return function(){
			router.handlers.push(prop)
			router.root = caller;
			//console.log(router.root, caller)
			method.call(this, caller.props, ...arguments);
			router.handlers.pop();
			router.finalTo();
		}
		
	}
}


export function Component(model) {
	
	var render = model.render;
	function getData(component, config){
		var data = {}
		for( var prop in config){
			var field = config[prop]//
			if(typeof field !== "function"){
				//data[prop] = model.data[prop]
				Object.defineProperty(data, prop,
					Object.getOwnPropertyDescriptor(config, prop))
			
			}else{
				data[prop] = Router.gethandler(field, prop, component).bind(data) 
			}		 
		}
		
		return data;
	}

	
	//console.log(model.render.toString())
	return class{
		constructor(parent){
			
			this.data = getData(this, model.data);
			if("map" in this.constructor == false)
				this.constructor.map = [];
			this.constructor.map.push(this)
			this.getParent = function(){
				return parent;
			}
			this.child = []
			this.iteration = 0;
		}
		
		render(props){
			this.props = model.props
				? Object.assign(model.props, props) 
				: props;
			var will = render.call(this.data, this.props);
			if(this.element){
				this.element.parentNode.replaceChild(will, this.element);
			}
			this.element = will;
			this.clear();
		}
		replaceChild(component){
			if(this.iteration > this.child.length){
				this.child.push(component)
				this.iteration++;
			}	
			else
				this.child[this.iteration-1] = component
		}
		nextChild(){
			
			if(this.iteration  > this.child.length)
				return false
			else{
				this.iteration ++;
				return this.child[this.iteration-1];
			}	 
		}
		clear(){
			while(this.iteration < this.child.length){
				this.child.pop();
				this.iteration--;
			}
			this.iteration = 0;
		}
	} 

	
	
	
}
