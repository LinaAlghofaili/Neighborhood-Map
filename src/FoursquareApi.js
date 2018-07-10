//API to get infomation about location based on LAT and LNG
const CLIENT_ID = "ICK4GLHZJPJGAVAZD5CSQLU5UD1MJKY4NZ2VEJGI0VDAMUQ2";
const CLIENT_SECRET = "IT52JQ5CK2N0RCCNHJCGNZA2V34Z11ONVZ0VMWBLT3X14XBG";
const URL_REQ = "https://api.foursquare.com/v2/venues/search?limit=1&v=20170101&client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&ll=";
export const requestFoursqureApi = (lat, lng) =>
    fetch(URL_REQ + lat + "," + lng, {})
        .then(res => res.json())
        .then(data => data);