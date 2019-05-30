/*global google*/

import React from 'react';
import { FiArrowRight,FiArrowLeft,FiCornerRightDown, FiCornerUpRight,FiCornerUpLeft, FiArrowUp,FiGitMerge } from "react-icons/fi";
import { FaTrain, FaShip } from "react-icons/fa";
import './Find.css';
const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
} = require("react-google-maps");

const HtmlToReactParser = require('html-to-react').Parser;
const DirectionAPI =   "https://maps.googleapis.com/maps/api/directions/json?key=AIzaSyDzv1V8Ml0oNMbq_s9_LCFaio5Uet-9bQc"
const htmlToReactParser = new HtmlToReactParser();



const MapWithADirectionsRenderer = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDzv1V8Ml0oNMbq_s9_LCFaio5Uet-9bQc&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      const DirectionsService = new google.maps.DirectionsService();

      DirectionsService.route({
        origin:  this.props.origin,
        destination: this.props.destination,
        travelMode: google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      });
    }
  })
)(props =>
  <GoogleMap
    defaultZoom={7}
    defaultCenter={new google.maps.LatLng(41.8507300, -87.6512600)}
  >
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
);


export default class Find extends React.Component {
  constructor(props) {
    super(props);
    var query_request = DirectionAPI+"&origin="+this.props.match.params.from+"&destination="+this.props.match.params.to
    console.log(query_request)
    this.state = {
      isMarkerShown: false,
      total_steps: [],
      origin:{},
      destination:{},
      show: false,
      lookup: {
        "turn-sharp-left":(<FiArrowLeft />),
        "uturn-right": (<FiCornerRightDown />),
        "turn-slight-right": (<FiArrowRight />),
        "merge":(<FiGitMerge />),
        "roundabout-left":(<FiCornerUpLeft />),
        "roundabout-right":(<FiCornerUpRight />),
        "uturn-left":(<FiArrowLeft />),
        "turn-slight-left":(<FiArrowLeft />),
        "turn-left": (<FiArrowLeft />),
        "ramp-right": (<FiArrowRight />),
        "turn-right": (<FiArrowRight />),
        "fork-right": (<FiArrowRight />),
        "straight": (<FiArrowUp />),
        "fork-left":(<FiArrowLeft />),
        "ferry-train":(<FaTrain />),
        "turn-sharp-right":(<FiArrowRight />),
        "ramp-left":(<FiArrowLeft />),
        "ferry":(<FaShip/>),
        "keep-left":(<FiArrowLeft />),
        "keep-right":(<FiArrowRight />)
      },
      sidebar:true
    }

    fetch(query_request)
      .then(response => response.json())
      .then(data =>
          { if(data.status != "ZERO_RESULTS"){
                       this.setState({ total_steps: data.routes[0].legs[0].steps,
                                                origin: data.routes[0].legs[0].start_location,
                                                destination: data.routes[0].legs[0].end_location,
                                                show: true
                                              })
                                }else{
                                    var obj = this.refs.load_status
                                    obj.innerHTML = "No route found. Proceedng Back."
                                    var self = this
                                    setTimeout(function(){
                                      self.props.history.push("/")
                                    },3000)

                                }
                                });
  }



  componentDidMount() {
    this.delayedShowMarker()
  }
route_toggle(){
  this.setState({sidebar: !this.state.sidebar});
  console.log('clicked')
}
  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 3000)
  }

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false })
    this.delayedShowMarker()
  }

  render() {

    return (
          <div>
          { (!this.state.show) ?
          (<div className="loading">
            <img src="/giphy.gif" / >
            <h4 ref="load_status">Loading. Please Wait...</h4>
          </div>) : ""
        }
          <div className="map-container">
            <div className={(this.state.sidebar ? "sidebar" : "noSidebar" )}>
              <div className="select-block">
                <div className="select-directions-box">
                  <div className="select-title">Source and Destination</div>
                  <div className="select-directions-waypoints">
                    <div className="select-directions-searchbox-container">
                      <span className="marker">A</span>
                      <div className="searchbox">{this.props.match.params.from}</div>
                    </div>
                    <div className="select-directions-searchbox-container">
                      <span className="marker">B</span>
                      <div className="searchbox">{this.props.match.params.to}</div>
                    </div>
                  </div>
                </div>

                <div className="info-block">
                  <div className="route-title">ROUTE INFO:</div>
                  {
                  this.state.total_steps.map(elem =>
                  <div className="route-box">
                    <div className="route-icon">
                        {this.state.lookup[elem.maneuver]}
                     </div>
                  <div className="route-text">{htmlToReactParser.parse(elem.html_instructions)}</div></div> )
                  }

                </div>
              </div>
            </div>

            <div className={(this.state.sidebar ? "sidebar" : "noSidebar" )}>
              <div className="toggler" onClick={() => this.route_toggle()}>
                      <span>R</span>
                      <span>O</span>
                      <span>U</span>
                      <span>T</span>
                      <span>E</span>
              </div>
            </div>
            {
            this.state.show ? <MapWithADirectionsRenderer   origin={this.state.origin} destination={this.state.destination} /> : null
            }
          </div>
          </div>
    );
  }
}
