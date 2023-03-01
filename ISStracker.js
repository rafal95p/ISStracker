window.addEventListener('load', () => {
    setInterval(getIssPosition, 2000)
})

function getIssPosition() {
    const URL = 'https://api.wheretheiss.at/v1/satellites/25544';
    fetch (URL)
    .then((response) => response.json())
    .then((data) => displayIssPosition(data))
}

function displayIssPosition(data) {
    const currentIssPosition = parseJson(data);
    const mapSize = getMapSize();
    drawOnMap(currentIssPosition, mapSize);
    displayReadings(currentIssPosition);
}

function parseJson(data) {
    const currentIssPosition = {
        "altitude" : data.altitude,
        "latitude" : data.latitude,
        "longitude" : data.longitude,
        "timestamp" : new Date(data.timestamp * 1000), 
        "velocity" : data.velocity
    };
    return currentIssPosition;     
}

function getMapSize() {
    const map = document.getElementById("world_map");
    const mapSize = {
        "positionX" : map.getBoundingClientRect().x,
        "positionY" : map.getBoundingClientRect().y,
        "width" : map.getBoundingClientRect().width,
        "height" : map.getBoundingClientRect().height
    };
    return mapSize; 
}

function displayReadings(currentIssPosition) {
    const decimalPrecision = 2;
    document.getElementById('altitude').textContent = "wysokość: " + currentIssPosition.altitude.toFixed(decimalPrecision) + " km";
    document.getElementById('latitude').textContent = "szerokość: " + currentIssPosition.latitude.toFixed(decimalPrecision) + latitudeDirection(currentIssPosition.latitude);
    document.getElementById('longitude').textContent = "długość: " + currentIssPosition.longitude.toFixed(decimalPrecision) + longitudeDirection(currentIssPosition.longitude);
    document.getElementById('timestamp').textContent = "czas: " + currentIssPosition.timestamp;
    document.getElementById('velocity').textContent = "prędkość: " + currentIssPosition.velocity.toFixed(decimalPrecision) + " km/h";
}

function latitudeDirection(latitude) {
    return (latitude >= 0) ? "N" : "S";
}

function longitudeDirection(longitude) {
    return (longitude >= 0) ? "E" : "W";    
}

function drawOnMap(currentIssPosition, mapSize) {
    const ISSmarker = document.getElementById("ISSmarker");
    const ISSmarkerSize = ISSmarker.getBoundingClientRect().width;

    const scalledLatitude = (-1 * (currentIssPosition.latitude) + 90)/180;
    const newPositionY = mapSize.positionY - (ISSmarkerSize/2) + (scalledLatitude * mapSize.height);
    if (newPositionY !== 0) { 
        ISSmarker.style.setProperty("top", newPositionY + "px");
    }

    const scalledLongitude = (1 * (currentIssPosition.longitude) + 180)/360;
    const newPositionX = mapSize.positionX - (ISSmarkerSize/2) + (scalledLongitude * mapSize.width);
    if (newPositionX !== 0) { 
        ISSmarker.style.setProperty("left", newPositionX + "px");
    }
}
