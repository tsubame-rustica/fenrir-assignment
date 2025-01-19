let map;
let currentLocationMarker;
let watchId;
let searchResultsArr = [];

function initMap() {
    // 座標の初期値（東京駅）
    const initialPos = { lat: 35.6811673, lng: 139.7670516 };

    map = new google.maps.Map(
        document.getElementById('showMap'), {
            center  : initialPos,
            zoom    : 16,
            styles  : [
                // POI（ピン）を非表示
                {
                    featureType : "poi", 
                    stylers     : [{ visibility: "off" }],
                },
                // 交通機関のアイコンを非表示
                {
                    featureType : "transit", 
                    stylers     : [{ visibility: "off" }],
                },
                // 道路のラベルを非表示
                {
                    featureType : "road", 
                    elementType : "labels.icon",
                    stylers     : [{ visibility: "off" }],
                }
            ],
            mapTypeId   : 'roadmap',
        }
    );

    currentLocationMarker = new google.maps.Marker({
        position: initialPos,
        map: map,
        title: "Your Current Location",
        icon : {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        },
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
                fetchRestaurantInfoFromMap(currentLocation);
            },
            (error) => {
                console.error(error);
            },
            {
                enableHighAccuracy  : true,
                timeout             : 5000,
                maximumAge          : 0,
            }
        );
    } else {
        console.log('Geolocation is not supported by your browser');
    }
}

const modal         = document.getElementById('modal');
const modalTitle    = document.getElementById('shopTitle');
const catchCopy     = document.getElementById('catchCopy');
const shopThumbnail = document.getElementById('thumbnailList');

const closeModalBtn = document.getElementById('closeModalBtn');

function showShopModal(fetchData) {
    const mapTools              = document.querySelectorAll('.gmnoprint.gm-bundled-control')[1];

    modal.style.display         = 'block';
    mapTools.style.display      = 'none';

    modalTitle.innerHTML        = '<h2>' + fetchData['name'] + '</h2>';
    catchCopy.innerHTML         = fetchData['catch'];
    shopThumbnail.innerHTML     = '<img src="' + fetchData['photo']['pc']['l'] + '" alt="店舗画像" class="">';
}

function closeShopModal() {
    const mapTools              = document.querySelectorAll('.gmnoprint.gm-bundled-control')[1];

    modal.style.display         = 'none';
    mapTools.style.display      = 'block';
}

closeModalBtn.addEventListener('click', closeShopModal, false);

function fetchRestaurantInfoFromMap(currentLocation) {
    const apiUrl = 'http://localhost:8080/foreign_api/gourmet/v1';
    const apiKey = '2506182a2b82d52b'
    const params = new URLSearchParams({
        key     : apiKey,
        lat     : currentLocation.lat,
        lng     : currentLocation.lng,
        range   : 3,
        count   : 30,
        format  : 'json',     // レスポンス形式をJSONに指定
    });

    fetch(`${apiUrl}?${params.toString()}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // レスポンスをJSONとしてパース
    })
    .then((fetchData) => {
        let shopIndex = 0;  // マーカーに紐づける店舗のインデックス
        const shopListJson = fetchData['results']['shop'];
        shopListJson.forEach((shopDetails) => {
            shopDetails.fetchShopIndex = shopIndex;
            const marker = new google.maps.Marker({
                position: {
                    lat : shopDetails.lat,
                    lng : shopDetails.lng,
                },
                map : map,
            });

            // マーカークリック時のイベントリスナー
            google.maps.event.addListener(marker, "click", () => {
                showShopModal(shopListJson[shopDetails.fetchShopIndex]);
            });

            shopIndex++;
        });
    })
    .catch(error => {
        console.error('Error:', error); // エラーハンドリング
    });
}

// ページを閉じた際にトラッキングを停止
window.addEventListener('beforeunload', () => {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
    }
});

window.onload = initMap;