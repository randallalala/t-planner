import React from "react";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  InfoWindow,
  Marker,
} from "react-google-maps";
import Autocomplete from "react-google-autocomplete";
import Geocode from "react-geocode";
import * as parksData from "../map/skateboard-parks.json";

Geocode.enableDebug();
Geocode.setApiKey(process.env.REACT_APP_API_KEY);

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      place: {
        address: "",
        city: "",
        area: "",
        state: "",
        mapPosition: {
          lat: this.props.center.lat,
          lng: this.props.center.lng,
        },
      },
      markerPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng,
      },
    };
  }
  /**
   * Get the current address from the default map position and set those values in the state
   */
  componentDidMount() {
    Geocode.fromLatLng(
      this.state.place.mapPosition.lat,
      this.state.place.mapPosition.lng
    ).then(
      (response) => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray);

        // console.log("city", city, area, state);

        this.setState({
          address: address ? address : "",
          area: area ? area : "",
          city: city ? city : "",
          state: state ? state : "",
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }
  /**
   * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
   *
   * @param nextProps
   * @param nextState
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.place.markerPosition.lat !== this.props.center.lat ||
      this.state.place.address !== nextState.place.address ||
      this.state.place.city !== nextState.place.city ||
      this.state.place.area !== nextState.place.area ||
      this.state.place.state !== nextState.place.state
    ) {
      return true;
    } else if (this.props.center.lat === nextProps.center.lat) {
      return false;
    }
  }
  /**
   * Get the city and set the city input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getCity = (addressArray) => {
    let city = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "administrative_area_level_2" === addressArray[i].types[0]
      ) {
        city = addressArray[i].long_name;
        return city;
      }
    }
  };
  /**
   * Get the area and set the area input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getArea = (addressArray) => {
    let area = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if (
            "sublocality_level_1" === addressArray[i].types[j] ||
            "locality" === addressArray[i].types[j]
          ) {
            area = addressArray[i].long_name;
            return area;
          }
        }
      }
    }
  };
  /**
   * Get the address and set the address input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getState = (addressArray) => {
    let state = "";
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[i].types[0] &&
          "administrative_area_level_1" === addressArray[i].types[0]
        ) {
          state = addressArray[i].long_name;
          return state;
        }
      }
    }
  };
  /**
   * And function for city,state and address input
   @param event
   */
  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  /**
   * This Event triggers when the marker window is closed
   *
   @param event
   */
  onInfoWindowClose = (event) => {};
  /**
   * When the user types an address in the search box
   * @param place
   */
  onPlaceSelected = (place) => {
    const address = place.formatted_address,
      addressArray = place.address_components,
      city = this.getCity(addressArray),
      area = this.getArea(addressArray),
      state = this.getState(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();
    // Set these values in the state.
    this.setState({
      place: {
        address: address ? address : "",
        area: area ? area : "",
        city: city ? city : "",
        state: state ? state : "",
        markerPosition: {
          lat: latValue,
          lng: lngValue,
        },
        mapPosition: {
          lat: latValue,
          lng: lngValue,
        },
      },
    });
  };
  /**
   * When the marker is dragged you get the lat and long using the functions available from event object.
   * Use geocode to get the address, city, area and state from the lat and lng positions.
   * And then set those values in the state.
   *
   * @param event
   */
  // onMarkerDragEnd = (event) => {
  //   // console.log("event", event);
  //   let newLat = event.latLng.lat(),
  //     newLng = event.latLng.lng(),
  //     addressArray = [];
  //   Geocode.fromLatLng(newLat, newLng).then(
  //     (response) => {
  //       const address = response.results[0].formatted_address,
  //         addressArray = response.results[0].address_components,
  //         city = this.getCity(addressArray),
  //         area = this.getArea(addressArray),
  //         state = this.getState(addressArray);
  //       this.setState({
  //         address: address ? address : "",
  //         area: area ? area : "",
  //         city: city ? city : "",
  //         state: state ? state : "",
  //       });
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // };
  render() {
    console.log("lat", this.state.place.mapPosition.lat);
    console.log("lng", this.state.place.mapPosition.lng);
    console.log("place", this.state.place.mapPosition);

    const AsyncMap = withScriptjs(
      withGoogleMap((props) => (
        <GoogleMap
          google={this.props.google}
          defaultZoom={this.props.zoom}
          defaultCenter={{
            lat: this.state.mapPosition.lat,
            lng: this.state.mapPosition.lng,
          }}
        >
          {/* For Auto complete Search Box */}
          <Autocomplete
            style={{
              width: "100%",
              height: "40px",
              paddingLeft: "16px",
              marginTop: "2px",
              marginBottom: "100px",
            }}
            onPlaceSelected={this.onPlaceSelected}
            types={["(regions)"]}
          />
          {/*Marker*/}
          <Marker
            google={this.props.google}
            name={"Dolores park"}
            draggable={false}
            // onDragEnd={this.onMarkerDragEnd}
            position={{
              lat: this.state.markerPosition.lat,
              lng: this.state.markerPosition.lng,
            }}
          />
          <Marker />
          {/* InfoWindow on top of marker */}
          <InfoWindow
            onClose={this.onInfoWindowClose}
            position={{
              lat: this.state.markerPosition.lat + 0.0018,
              lng: this.state.markerPosition.lng,
            }}
          >
            <div>
              <span style={{ padding: 0, margin: 0 }}>
                {this.state.address}
              </span>
            </div>
          </InfoWindow>
          {/* SKATEPARKS */}
          {parksData.features.map((park) => (
            <Marker
              key={park.properties.park_ID}
              position={{
                lat: park.geometry.coordinates[1],
                lng: park.geometry.coordinates[0],
              }}
            />
          ))}
        </GoogleMap>
      ))
    );
    let map;
    if (this.props.center.lat !== undefined) {
      map = (
        <div>
          <div>
            <div className="form-group">
              <label htmlFor="">City</label>
              <input
                type="text"
                name="city"
                className="form-control"
                onChange={this.onChange}
                readOnly="readOnly"
                value={this.state.city}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Area</label>
              <input
                type="text"
                name="area"
                className="form-control"
                onChange={this.onChange}
                readOnly="readOnly"
                value={this.state.area}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">State</label>
              <input
                type="text"
                name="state"
                className="form-control"
                onChange={this.onChange}
                readOnly="readOnly"
                value={this.state.state}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                onChange={this.onChange}
                readOnly="readOnly"
                value={this.state.address}
              />
            </div>
          </div>
          <AsyncMap
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}&libraries=places`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: this.props.height }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      );
    } else {
      map = <div style={{ height: this.props.height }} />;
    }
    return map;
  }
}
export default Map;