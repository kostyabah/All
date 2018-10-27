import {h, Component} from "preact"
import {createArtist} from "./artist"
export default class Canvas extends Component {    
    static defaultProps = {
        redraw: true,
        stroke : "black",
        background: "white",
        fill: "transparent",
        opacity: 1,
        lineWidth: 1,
        top: 0,
        left:0,
        scale: 1,
        //onUpdate: this._parentComponent.setState,
        //state: this._parentComponent.state
    }
    onUpdate = (state) =>{
        this._parentComponent.setState(state)
    }
    state = this.props.state || {};
    target = {}
    getEvent = e =>{
        let that = this.base,
            coord = that.getBoundingClientRect(),
            {top, left, scale} = this.props
        return {
            clientX : left + (e.clientX - coord.left) * 
                that.width / scale / that.clientWidth,
            clientY : top + (e.clientY - coord.top) * 
                that.height / scale / that.clientHeight,
            which : e.which,
            shift : e.shiftKey,
            alt : e.altKey,
            ctrl : e.ctrlKey,
            //get color(){
                //return self._holst.context.getImageData(this.x, this.y,1,1).data;
            //}	
        }
    }
    componentDidMount(){
        this.base.width = this.props.width ||this.base.clientWidth
        this.base.height = this.props.height ||this.base.clientHeight
        //console.log(this);
        this.artist = createArtist();   
        this.drawTo();
    }
    
    drawTo = () =>{
        
        if(!this.ctx)
            return;
        //console.log(this.props)    
        this.artist.style(this.ctx, this.props);
        if(this.props.redraw){
            this.ctx.save();
            this.ctx.fillStyle = this.props.background;
            this.ctx.fillRect(0, 0, this.base.width, this.base.height);
            this.ctx.restore();
        }
        	
        let endOfResult = (res, config) =>{
            let attr = config.attributes  
            this.artist.drawShape(this.ctx, config)
            //console.log(attr)
            if(attr.onClick ||attr.onChange
                || attr.onFocus ||attr.onActive)                   
                res.push(config)
            return res
        }
        this.dispatcher = [];
        this.dispatcher = this.props.children.reduce((res, config) =>{
            if(typeof config.nodeName == "function"){
                let addBefore = config.nodeName(config.attributes);
                if(!Array.isArray(addBefore))
                    addBefore = [addBefore]
                return addBefore.reduce(endOfResult, res)
            }
            else{
                return endOfResult(res, config)
            }        
        },[])
        //console.log(this.dispatcher)    
    }
    
    
    componentDidUpdate(_props, _state){
        this.drawTo()
    }
    
    isEvent=false;

    isUp = true;
    catchTarget = (place, point) =>{
        
        if(Array.isArray(place) && place.length==0)
            return;
        if(typeof place.nodeName == "function")
            this.catchTarget(place.nodeName(place.attributes),point)
        let result;
        
        return Array.isArray(place)  
        ?   this.catchTarget(result = place.pop(), point)
            ?   result
            :   this.catchTarget(place, point)    
        :   this.artist.contain(this.ctx, place, point)
            ?   place
            :   null
                  
    }
    getTarget = point=>{
        let 
        {dispatcher} = this,
        {onActive, onClick, onFocus, onChange} = this.props,
        active = this.catchTarget(dispatcher, {
            x: point.clientX, 
            y: point.clientY
        })

        return active
            ? Object.assign({}, this.props, active.attributes)
            : this.props
               
    }
    update = (name, point) =>{
        //console.log(this.target)
        let callback =this.target[name] 
        if(!callback)
            return;
        //console.log(this.dispatcher)
        let newState= callback.call(this.target, point)
        
        this.onUpdate(newState)
    }
    onMouseDown = event =>{
        this.isUp = false
        let point = this.getEvent(event)
        this.target = this.getTarget(point); 
        this.update("onActive", point)
    }
    onMouseUp = event =>{
        console.log(this.dispatcher)
        this.isUp = true
        this.update("onClick", this.getEvent(event))
    }
    onMouseMove = event =>{
        let point = this.getEvent(event)
        //this.target = this.getTarget(point)
        if(!this.isUp)
            this.update("onChange", point)
        else {
            this.update("onFocus", point)
        }    
    }
    onKeyUp = event =>{
        console.log(event.key, this.props.onKey)
        let lower = event.key.toLowerCase()
        if(!this.props.onKey || !(lower in this.props.onKey))
            return 
        let newState = this.props.onKey[lower](event.key)
        this.onUpdate(newState);    
    }
     
    render(props, state){
        //console.log(this._parentComponent)
        let getCtx = canvas=>{
            if(canvas && !this.ctx)
                this.ctx = canvas.getContext("2d")
        }
        return ( 
            <canvas
                tabIndex ={1000}
                class={props.class} 
                width={props.width}
                height={props.height}
                
                onMouseDown = {this.onMouseDown}
                onMouseUp = {this.onMouseUp}
                onMouseMove ={this.onMouseMove}
                onKeyUp = {this.onKeyUp}
                ref ={getCtx}    
            />
        )    
    }
}