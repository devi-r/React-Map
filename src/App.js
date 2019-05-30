/*global google*/

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
      start_place:null,
      end_place:null,
      dest_disabled: true
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
                signal: signal
            })
      .then(response => response.json())
      .then(data => this.setState({ end_suggestions: data.predictions }));
  }
}

setStart(val){
  var e = this.refs.source
  e.value = val;
    this.setState({ dest_disabled:false})
  this.setState({start_place:val,start_suggestions:[]})
}

setEnd(val){
  var e = this.refs.destination
  e.value = val;
  this.setState({end_place:val,end_suggestions:[]})
}

find_routes(){
  if(this.state.start_place && this.state.end_place){
    this.props.history.push("/find_routes/"+this.state.start_place+"/"+this.state.end_place)
  }else{
    alert("Please select source and destination.")
  }

}

  render() {

    return (
      <div className="main-container">
        <div className="main-title">Choose Source and Destination</div>
        <div className="select-container">
          <div className="select-button" onClick={this.find_routes}>GO</div>
          <div className="item-container">
            <input id="source" ref="source" type="text" onChange={(e) => {this.handleStartChange(e)}} placeholder="Source"/>
          </div>

          <div className="item-container">
            <input id="destination"
            ref="destination"
            type="text"
            onChange={(e) => {this.handleEndChange(e)}}
            disabled = {(this.state.dest_disabled)? "disabled" : ""}
            placeholder="Destination"/>
          </div>

              <div className="suggestion-container">
                {
                   this.state.start_suggestions.map(elem => <div className="suggestions" onClick={() => this.setStart(elem.description)}> {elem.description} </div>)
                }
              </div>
            <div className="suggestion-container">
              {
                 this.state.end_suggestions.map(elem => <div className="suggestions" onClick={() => this.setEnd(elem.description)}> {elem.description} </div>)
              }
            </div>
        </div>
      </div>

    );
  }
}
