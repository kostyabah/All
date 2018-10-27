import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//import callApi from './callApi.js'
console.log(React.createElement)
class App extends Component {
  
  render() {
	return (
	  <div className="App">
		<header className="App-header">
		  <img src={logo} className="App-logo" alt="logo" />
		  <h1 className="App-title">Погода</h1>
		</header>
		<Weather lat = {46.47} lon = {30.76} /> 
	  </div>
	);
  }
}

class Weather extends Component{
  
  constructor(prop){
	super(prop)
	
	console.log(prop);
	//this.state = prop;
	this.state = {}
	
	
	
  }
  componentDidMount(){
	var that = this;
	
	this.callApi('weather', this.props).then((data)=>{
	  console.log(data);
	  that.setState(data.main);
	})
  }
   
  callApi(type, props){
	var head = "https://api.openweathermap.org/data/2.5/"
	var footer = "APPID=95b6cd227ea49a0370aa443afad6ad81";
	var body = Object.keys(props).reduce((result, key)=>{
	  return result + key + '='+ props[key]+'&';
	}, '?');

	var url = head + type + body + footer;
	console.log(url);
	return fetch(url).then(function(res){
	  return res.json();  
	})
  }
  
  render(){
	//var state = this.state
	return(
	  <div>
		<p> доллота : {this.props.lat} широта : {this.props.lon} </p>
		<table align='center'>
		  <tr>
		  {Object.keys(this.state).map((value, index)=>(
			<th key={value+index}> {value} </th>
		  ))}
		  </tr>  
		  <tr>
		  {Object.keys(this.state).map((value, index)=>(
			<td key={value+index}> {this.state[value]} </td>
		  ))}
		  </tr>
		</table>
	  </div>
	   
	)
  }
}

export default App;
