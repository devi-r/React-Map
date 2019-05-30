/*global google*/

import React from 'react';
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
    containerElement: <div style={{ height: `400px` }} />,
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
      show: false
      }

    fetch(query_request)
      .then(response => response.json())
      .then(data => this.setState({ total_steps: data.routes[0].legs[0].steps,
                                    origin: data.routes[0].legs[0].start_location,
                                    destination: data.routes[0].legs[0].end_location,
                                    show: true
                                  }));
  }



  componentDidMount() {
    this.delayedShowMarker()
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
{
this.state.show ? <MapWithADirectionsRenderer   origin={this.state.origin} destination={this.state.destination} /> : null
}
          <h2>Stuffs will get displayed any time from now </h2>
          {
         this.state.total_steps.map(elem => <div> {htmlToReactParser.parse(elem.html_instructions)} </div>)
       }

</div>
    );
  }
}
