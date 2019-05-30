import React from 'react';
import logo from './logo.svg';
import './App.css';
import Autosuggest from 'react-autosuggest';
import Find from './Find';

const LocationAPI = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?types=geocode&language=en&key=AIzaSyDzv1V8Ml0oNMbq_s9_LCFaio5Uet-9bQc&input=';
var fetch_initiated = false;
var controller = new AbortController();
var signal = controller.signal;
const languages = [
  {
    name: 'C',
    year: 1972
  },
  {
    name: 'Elm',
    year: 2012
  }
];


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      start_suggestions: [],
      end_suggestions:[],
      start_place:'NONE',
      end_place:'NONE',
    };
    this.find_routes = this.find_routes.bind(this)
  }


handleStartChange(e){
  this.setState({ start_suggestions:[]})
  if(fetch_initiated){
    controller.abort()
    controller = new AbortController()
    signal = controller.signal
    fetch_initiated = false;
  }
  if (e.target.value.length > 4){
    fetch_initiated = true;
    fetch(LocationAPI + e.target.value,{
                method: 'get',
                signal: signal,
            })
      .then(response => response.json())
      .then(data => this.setState({ start_suggestions: data.predictions }));
  }
}
handleEndChange(e){
  this.setState({ end_suggestions:[]})
  if(fetch_initiated){
    controller.abort()
    controller = new AbortController()
    signal = controller.signal
    fetch_initiated = false;
  }
  if (e.target.value.length > 4){
    fetch_initiated = true;
    fetch(LocationAPI + e.target.value,{
                method: 'get',
                signal: signal,
            })
      .then(response => response.json())
      .then(data => this.setState({ end_suggestions: data.predictions }));
  }
}

setStart(val){
  this.setState({start_place:val,start_suggestions:[]})
}

setEnd(val){
  this.setState({end_place:val,end_suggestions:[]})
}

find_routes(){
  this.props.history.push("/find_routes/"+this.state.start_place+"/"+this.state.end_place)
  console.log([this.state.start_place,this.state.end_place])
}

  render() {

    return (
    <div className="App">
      <header className="App-header">
          <h2>Google Directions!</h2>
      </header>
      <div className="input_text">
        <div className="width45">
          <h2>{this.state.start_place}</h2>
          <h3>Start Destination</h3>
          <input type="text" onChange={(e) => {this.handleStartChange(e)}}/>
          <div className="leftAlign">
  {
     this.state.start_suggestions.map(elem => <div className="suggestions" onClick={() => this.setStart(elem.description)}> {elem.description} </div>)
  }
</div>
        </div>
        <div className="width10">
            <button onClick={this.find_routes}> Find Routes! </button>
        </div>
        <div className="width45">
          <h2>{this.state.end_place}</h2>
          <h3>End Destination</h3>
          <input type="text" onChange={(e) => {this.handleEndChange(e)}}/>
          <div className="leftAlign">
  {
     this.state.end_suggestions.map(elem => <div className="suggestions" onClick={() => this.setEnd(elem.description)}> {elem.description} </div>)
  }
</div>

        </div>
      </div>
    </div>

    );
  }
}
