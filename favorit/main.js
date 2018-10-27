import axios from "axios"
import {render} from "react-dom"
import React from "react"
import "./css/app.less"
//import map from "./js/map"
axios.get("history.json")
.then((res)=>{
    console.log(res.data[1]);
})

var Table = React.createClass({
    getDefaultProps(){
        return {
            row : 10,
            column : 10,
            map(row, col){
                return row + col
            }
        }
    },
    
    counter(size, map){
        map = map || function(index)  {return index}
        return new Array(size).fill(map).map((map, index)=>{
            return map(index);
        })
        
    },
    getRow(props, row){
        return (
            <tr key = {row+"_row"}>
                {this.counter(this.props.column).map((value, index)=>{
                    return ( 
                    <td key = {index+"_tr"}  > 
                        {this.props.map(row, index).toFixed(0)} 
                    </td>
                    )
                })}
            </tr>
        )
    },
    render(){
        //var size = this.props.size

        return (
            <table >
                <tbody>    
                    {this.counter(this.props.row).map(this.getRow)}
                </tbody>    
            </table>
            
        )
    }
})

var Formul = React.createClass({
    /*
    getInput(props, index){
        var change =(e)=>{
            var list = this.state.list.slice();
            list[index] = e.target.value;
            this.setState({ list });
        }
        return <input onChange={change} key={index}/>
    },
    */

    getInitialState(){
        return {
            index: 0,
            list: ["Введите текст"],
            get active() {
                return this.list[this.index]
            }
        }
    },
    goto(e){
        if(e.key == 'Enter'){
            console.log(e);
            this.setState((state)=> {
                var list = ["Введите текст"].concat(state.list)
                console.log({list})
                return {list}
            })
        }else if(e.key == "ArrowUp"){
            
        }else if(e.key == "ArrowDown"){

        }
    },
    update(e){
        var text = e.target.value
        this.setState(state=> {
            return{
                list : text.split('-')//state.list.slice()//.splice(state.index, 0, text)    
            }
        })
    },
    render(){
        
        return (
            <div>
                <input 
                    onKeyUp ={this.goto} 
                    onChange={this.update}
                   // value = {this.state.text}
                />
                <div>{this.state.list.map((value, index)=>
                    <p key ={"formul_"+ index}
                        onClick ={e => this.setState({index: index})} 
                        className={index==this.state.index ? "active":"passive"}>
                        {value}
                    </p>
                )} 
                </div>
            </div>
        )
            
    }
})
var App = React.createClass({
    getInitialState(){
        return {
            map(row, col){
                return row + col
            }
        }
    },
    calculate(e){
        
        //console.log(e.key, e.keyCode);
        if(e.key !== "Enter") return;
        var formul = e.target.value.replace("_","Math.")
        this.setState({
            map : Function("y", "x", "return "+formul)  
        })
    },
    render(){
        console.log(this.state)
        return (
            <div>
                <Table map = {this.state.map}/>
                
                <Formul />
            </div>     
        )    
    }
})
render(<Formul/>, document.querySelector("#app"))
