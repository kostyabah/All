
import {h, render, Component} from "preact"
import Canvas from "../canvas/index"
import "./style.less"
//import Manager from "./mngPaint"
import list  from "./list";

class CurveLine extends Component  {
    state = {
        curvelines : list()
    }
    
    click = event => {
        return state =>({ 
            index: null, 
                 
        })  
    }
    
    active = event => {
        return state =>({    
            curvelines: state.curvelines.set({
                x : event.clientX,
                y : event.clientY,
                ax : event.clientX,
                ay: event.clientY
            }),
            index: state.curvelines.length
        })
    }
    change = event => {
        //if(this.isUp) return;
        return state => ({
            curvelines: state.curvelines.set({
                x: state.curvelines.get(state.index).x,
                y: state.curvelines.get(state.index).y,            
                ax : event.clientX,
                ay : event.clientY
            }, state.index),    
                    
        })    
    }
    keyhandler = {
        backspace(){
            return state =>({
                curvelines: state.curvelines.remove()
            })
        }
    }
    
    circleSelect(){
        return state=> ({
            index: this.index,
            active: state.curvelines.get(this.index)
        })
    }
    circleChange(p){
        return state =>({
            curvelines: state.curvelines.set({
                x: p.clientX,
                y: p.clientY,
                ax: state.active.ax + p.clientX - state.active.x,
                ay: state.active.ay + p.clientY - state.active.y
            }, state.index)
        })
    }
    render(props, state){
        let CircleList = (state) =>state
        .circles.map((item, index)=>(
            <ellipse
                cx={item.x}
                cy={item.y}
                r={5}
                index = {index}
                fill="orange"
                onActive = {this.circleSelect}
                onChange = {this.circleChange}
            />
        ))
        return (
            <Canvas
                
                lineWidth={1}
                onActive = {this.active}
                onClick = {this.click}
                onChange = {this.change}
                onKey = {this.keyhandler}
            >
                <path lines={state.curvelines}/>
                {//<CircleList circles={state.curvelines}/>
                }
            </Canvas>
        )
    }
    
}

class PhotoView extends Component{
    state = {
        scale: 100
    }
    choosePhoto = event=>{
        let fr = new FileReader();
        fr.onload = ()=>{
            this.setState({
                src : fr.result
            })
        }
        fr.readAsDataURL(event.target.files[0])
    }
    render(props, state){
        return(
            <div class='tools'>
                <div class ="photo" >
                    <img
                        
                        src={state.src} 
                        style ={{ 
                            width: `${state.scale}%`,
                            height: `auto`
                        }}
                    />
                    <input type = "file" onChange ={this.choosePhoto}/>
                </div>
                <input type='range' 
                    max={600} min={100} 
                    step = {10} 
                    value={state.scale}
                    onChange={e=>{this.setState({scale: e.target.value})}}  
                />
                <p>
                    Масштаб = {state.scale} %
                </p>
            </div>
        )
    }
} 

let App = () =>(
    <div class="app">
        <CurveLine/>
        <PhotoView/>
    </div>
)
    


render(<App/>, document.querySelector("#app"))