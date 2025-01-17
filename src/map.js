let map;
let currentLocationMarker;
let watchId;

function initMap() {
    const initialPos = { lat: 35.6811673, lng: 139.7670516 };

    map = new google.maps.Map(
        document.getElementById('showMap'), {
            center: initialPos,
            zoom: 16,
            styles: [
                // POI（ピン）を非表示
                {
                    featureType: "poi", 
                    stylers: [{ visibility: "off" }],
                },
                // 交通機関のアイコンを非表示
                {
                    featureType: "transit", 
                    stylers: [{ visibility: "off" }],
                },
                // 道路のラベルを非表示
                {
                    featureType: "road", 
                    elementType: "labels.icon",
                    stylers: [{ visibility: "off" }],
                }
            ],
            mapTypeId: 'roadmap',
        }
    );

    currentLocationMarker = new google.maps.Marker({
        position: initialPos,
        map: map,
        title: "Your Current Location",
    });

    trackCurrentLocation();
}

function trackCurrentLocation() {
    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                const currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(currentLocation);
                currentLocationMarker.setPosition(currentLocation);
            },
            (error) => {
                console.error(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );
    } else {
        console.log('Geolocation is not supported by your browser');
    }
}

// ページを閉じた際にトラッキングを停止
window.addEventListener('beforeunload', () => {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
    }
});

window.onload = initMap;