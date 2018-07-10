import React from 'react'
import SideMenuLocation from './SideMenuLocation';
import * as FoursquareApi from './FoursquareApi';


// Main Screen

class Screen extends React.Component {
    state = {
        locations: []
    }
    constructor(props) {
        super(props);
        this.locations = [
            { name: "Le dor", lat: 24.75326895, lng: 46.6119774 },
            { name: "Molten", lat: 24.75312219, lng: 46.61025308 },
            { name: "Madeleine", lat: 24.75097393, lng: 46.61296251 },
            { name: "Sultan Steakhouse", lat: 24.75005319, lng: 46.61417487 },
            { name: "Cioccolat italiani", lat: 24.75123944, lng: 46.61291692 },
            { name: "Signature", lat: 24.75332203, lng: 46.61014478 }
        ]

        this.initMap = this.initMap.bind(this);
        this.onSearchLocation = this.onSearchLocation.bind(this);
        this.selectFavourite = this.selectFavourite.bind(this);
    }
    componentDidMount() {
        this.setState({ locations: this.locations })
        window.initMap = this.initMap;
        loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyA-u7kCxhvPC_YOG80jCkHjuCAD655fsjE&callback=initMap')

    }


    // initialize map

    initMap() {
        var self = this;
        var mapview = document.getElementById('map-canvas');
        mapview.style.height = window.innerHeight + "px";
        var map = new window.google.maps.Map(mapview, {
            center: { lat: 21.0075704, lng: 105.8029119 },
            mapTypeControlOptions: {
                style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: window.google.maps.ControlPosition.LEFT_BOTTOM
            },
            mapTypeControl: true
        });
        this.map = map;
        this.foursquareInfoWindow = new window.google.maps.InfoWindow();
        var bounds = new window.google.maps.LatLngBounds();

        this.state.locations.forEach(function (fav) {
            var favmarker = self.createMarker(fav);
            bounds.extend(favmarker.position);
            fav.marker = favmarker;
        });

        this.map.fitBounds(bounds);
    };


    // Info Window data from FourSquare API

    populateInfoWindow(marker, infowindow) {
        if (infowindow.marker != marker) {
            this.map.panTo(new window.google.maps.LatLng(marker.position.lat(), marker.position.lng()));
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
            infowindow.marker = marker;
            setTimeout(function () {
                marker.setAnimation(null);
            }, 2000);
            infowindow.setContent('<div>Loading..</div>');
            infowindow.open(this.map, marker);
            infowindow.addListener('closeclick', function () {
                infowindow.marker = null;
            });
        }


        // Using Fetch to get the location data 

        FoursquareApi.requestFoursqureApi(marker.position.lat(), marker.position.lng()).then((response) => {
            console.log(response);
            if (response.response.venues.length > 0) {
                var venue = response.response.venues[0];
                var restName = "";
                var restPhone = "";
                var restAddress = "";
                if (venue.name) {
                    restName = venue.name;
                }
                if (venue.location && venue.location.formattedAddress && venue.location.formattedAddress.length > 0) {
                    restAddress = venue.location.formattedAddress[0];
                }
                if (venue.contact && venue.contact.phone) {
                    restPhone = venue.contact.phone;
                }
                infowindow.setContent('<div><div><strong>Name: ' + restName + '</strong></div><div>Address: ' + restAddress + '</div><div>Phone: ' + restPhone + ' </div></div>');
            }

        }).catch(function (err) {
            infowindow.setContent('<div><strong>Can Not Load Data</strong></div>');
        });;
    }


    // Filter the list of locations

    onSearchLocation(query) {
        var self = this;
        this.setState({
            locations: this.locations.filter(location => {
                if (location.marker) {
                    if (location.name.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0) {
                        location.marker.setMap(self.map);
                    } else {
                        location.marker.setMap(null);
                    }
                }
                return location.name.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0;
            })
        })
    }

    // Create markers on map

    createMarker(fav) {
        var self = this;
        var marker = new window.google.maps.Marker({
            position: {
                lat: fav.lat,
                lng: fav.lng
            },
            icon: this.makeMarkerIcon(true),
            map: this.map,
            title: fav.name,
            animation: window.google.maps.Animation.DROP
        });
        marker.addListener('click', function () {
            self.populateInfoWindow(this, self.foursquareInfoWindow);
        });
        marker.addListener('mouseover', function () {
            this.setIcon(self.makeMarkerIcon(false));
        });
        marker.addListener('mouseout', function () {
            this.setIcon(self.makeMarkerIcon(true));
        });
        return marker;
    };

    // Customize Marker icon

    makeMarkerIcon(defaultIcon) {
        console.log("create marker" + defaultIcon)
        var markerNoSale = require('./icons/marker.png');
        var markerSale = require('./icons/marker_hover.png');
        if (defaultIcon)
            return new window.google.maps.MarkerImage(markerNoSale);
        else
            return new window.google.maps.MarkerImage(markerSale);
    };

    // Choosing location from side menu will automatically show Info Window on map


    selectFavourite(data) {
        console.log(data)
        this.populateInfoWindow(data.marker, this.foursquareInfoWindow);
    }

    

    render() {
        const { locations } = this.state;
        return (
            <div>
                <div id="map-canvas"></div>
                <SideMenuLocation selectFavourite={this.selectFavourite} locations={locations} onSearchLocation={this.onSearchLocation} />
            </div>
        );
    }
}


export default Screen;


function loadJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
}