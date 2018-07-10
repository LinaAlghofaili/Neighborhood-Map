import React from 'react';
import LocationList from './LocationList';

export default class SideMenuLocation extends React.Component {
    render() {
        const { locations,selectFavourite } = this.props;
        return (
            <div id="container">
                <div className="humberger-search">
                    <input id="pac-input" className="control" type="text" placeholder="Search here..."
                        onChange={(event) => this.props.onSearchLocation(event.target.value)} />
                </div>
                <LocationList selectFavourite={selectFavourite} locations={locations}/>
            </div>
        )
    }
}