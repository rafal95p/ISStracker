window.addEventListener('load', () => {
    setInterval(getIssPosition, 3000);
})

function getIssPosition() {
    const URL = 'https://api.wheretheiss.at/v1/satellites/25544';
    fetch (URL)
    .then((response) => response.json())
    .then((data) => displayIssPosition(data))
}

function displayIssPosition(data) {
    const currentIssPosition = parseIssPosition(data);
    const mapSize = getMapSize();
    drawOnMap(currentIssPosition, mapSize);
    displayReadings(currentIssPosition);
}

function parseIssPosition(data) {
    const currentIssPosition = {
        altitude : data.altitude,
        latitude : data.latitude,
        longitude : data.longitude,
        timestamp : new Date(data.timestamp * 1000), 
        velocity : data.velocity
    };
    return currentIssPosition;     
}

function getMapSize() {
    const map = document.getElementById("world_map").getBoundingClientRect();
    const mapSize = {
        positionX : map.x,
        positionY : map.y,
        width : map.width,
        height : map.height
    };
    return mapSize; 
}

function displayReadings(currentIssPosition) {
    const decimalPrecision = 2;
    document.getElementById('altitude').textContent = "wysokość: " + stringifyAltitude(currentIssPosition.altitude, decimalPrecision);
    document.getElementById('latitude').textContent = "szerokość: " + stringifyLatitude(currentIssPosition.latitude, decimalPrecision);
    document.getElementById('longitude').textContent = "długość: " + stringifyLongitude(currentIssPosition.longitude, decimalPrecision);
    document.getElementById('timestamp').textContent = "czas: " + stringifyTimestamp(currentIssPosition.timestamp);
    document.getElementById('velocity').textContent = "prędkość: " + stringifyVelocity(currentIssPosition.velocity, decimalPrecision);
}

function stringifyAltitude(altitude, decimalPrecision) {
    return altitude.toFixed(decimalPrecision) + " km";
}

function stringifyLatitude(latitude, decimalPrecision) {
    return latitude.toFixed(decimalPrecision) + ((latitude >= 0) ? " N" : " S");
}

function stringifyLongitude(longitude, decimalPrecision) {
    return longitude.toFixed(decimalPrecision) + ((longitude >= 0) ? " E" : " W");
}

function stringifyTimestamp(timestamp) {
    return timestamp.toString().slice(0, 24);
}

function stringifyVelocity(velocity, decimalPrecision) {
    return velocity.toFixed(decimalPrecision) + " km/h";
}

function drawOnMap(currentIssPosition, mapSize) {
    const ISSicon = document.getElementById("ISSicon");
    const ISSiconSize = ISSicon.getBoundingClientRect().width;

    const scalledLatitude = (-1 * (currentIssPosition.latitude) + 90)/180;
    const newPositionY = mapSize.positionY - (ISSiconSize/2) + (scalledLatitude * mapSize.height);
    if (newPositionY !== 0) { 
        ISSicon.style.setProperty("top", newPositionY + "px");
    }

    const scalledLongitude = (1 * (currentIssPosition.longitude) + 180)/360;
    const newPositionX = mapSize.positionX - (ISSiconSize/2) + (scalledLongitude * mapSize.width);
    if (newPositionX !== 0) { 
        ISSicon.style.setProperty("left", newPositionX + "px");
    }

    addISSmarker((newPositionX + (ISSiconSize/2) - 1), (newPositionY + (ISSiconSize/2) - 1));
}

function addISSmarker(positionX, positionY) {
 
    const ISSmap = document.getElementById("mapSection");
    const ISSmarker = document.createElement("div");

    ISSmarker.setAttribute("class", "ISSmarker");
    ISSmarker.style.setProperty("top", positionY + "px");
    ISSmarker.style.setProperty("left", positionX + "px");

    ISSmap.appendChild(ISSmarker);
}