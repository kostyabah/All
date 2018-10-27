
import * as React from "./React.js"
import "./style.less"


var Item = React.Component({
    data :{
        
        colors: ['black', "red",'green','blue','cyan','magenta',"yellow", 'white'],
        index: 0, 
        get style(){
            var index = this.index < 0
                ? -this.index % 8  
                : this.index % 8
            return {
                backgroundColor: this.colors[index],
                color : this.colors[7 - index],
                display : 'inline',
                margin : '5px'
            }
        },
        back(props){
            console.log(props)
            this.index--;
            //this.validate()
            props.changeMax(this.index);
            props.changeMin(this.index);
        }, 
        front(props){
            console.log(props)
            this.index++;
            //this.validate();
            props.changeMax(this.index);
            props.changeMin(this.index);       
        },
        
        validate(){
            if(this.index >= this.colors.length)
                this.index = 0;
            if(this.index < 0)
                this.index = this.colors.length -1

        }
    },
    mutation(props){
        this.validate 
        //console.log(this);
    }, 
    render(props){
        //console.log(this);
        return( 
        <div className = 'block'>
            <button onclick ={this.back}> - </button>
            <p style ={this.style}> {this.index} </p>
            <button onclick = {this.front}> + </button>
        </div> 
        )
    }    
})

var Phaza = React.Component({
    data : {
        max : 0, min: 0,
        
        setMin(props, value){
            console.log(value);
            if(this.min > value)
                this.min = value
        },
        setMax(props, value){
            console.log(value);
            if(this.max < value)
                this.max = value
        }
        
    },
    render(props){
        return(
        <div>
            <p>Minimum = {this.min}</p>
            <p>Maximum = {this.max}</p>
            <p>Size = {this.max - this.min}</p>
            <div>
                {Array(15).fill(0).map(value =>
                    <Item
                        changeMin = {this.setMin}
                        changeMax = {this.setMax}
                    />
                )}
            </div>    
        </div>
        )
    }
})

//console.log(Phaza.render.call(Phaza.data))

React.render(
    <Phaza/>, 
    document.querySelector("#app")
)

//model.show();



