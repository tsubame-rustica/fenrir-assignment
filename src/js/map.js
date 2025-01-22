let googleMap;
let currentLocationMarker;
let watchId;
let searchResultsArr = [];
let currentShowShopData;

// ページ読み込み時に地図を初期化
initMap();

function initMap() {
    // 座標の初期値（東京駅）
    const initialPos = { lat: 35.6811673, lng: 139.7670516 };

    googleMap = new google.maps.Map(
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
        map: googleMap,
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
                googleMap.setCenter(currentLocation);
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
        
    }
}

const modal         = document.getElementById('modal');
const modalContent  = document.getElementById('modalContent');
const modalTitle    = document.getElementById('shopTitle');
const catchCopy     = document.getElementById('catchCopy');
const shopThumbnail = document.getElementById('thumbnailList');

const closeModalBtn = document.getElementById('closeModalBtn');


function showShopModal(fetchData) {

    currentShowShopData     = fetchData;    // モーダル画面をクリックしたときに使用する店舗情報を保持

    const mapTools          = document.querySelectorAll('.gmnoprint.gm-bundled-control')[1];

    modal.style.display     = 'block';
    mapTools.style.display  = 'none';

    const shopName          = '<h2 class="shopName">' + fetchData.name + '</h2>';
    const shopCatch         = '<h3 class="shopCatch">' + fetchData.genre.catch + '</h3>';
    const shopAccess        = '<div class="shopAccess"><img class="detailsIcon" src="/src/img/location.svg" alt="ピンのアイコン"><span>' + fetchData.access + '</span></div>';
    const shopThumbnail     = '<img src="' + fetchData.photo.pc.l + '" alt="店舗画像" class="shopThumbnail">';
    const shopFee           = '<div class="fee"><img class="detailsIcon" src="/src/img/yen.svg" alt="日本円のアイコン"><span>' + fetchData.budget.name + '</span></div>';
    const shopGenre         = '<div class="genre"><img class="detailsIcon" src="/src/img/restaurant.svg" alt="食器のアイコン"><span>' + fetchData.genre.name + '</span></div>';
    const shopDetailTextArr = [shopName, shopCatch, shopGenre, shopAccess, shopFee];
    modalContent.innerHTML = `<button data=${fetchData.id} id="jumpDetails"><div class="textInfo">${shopDetailTextArr.join('')}</div><div class="imgInfo">${shopThumbnail}</div></button>`;


    const jumpDetailsBtn = document.getElementById('jumpDetails');

    jumpDetailsBtn.addEventListener('click', () => {
        generateShopDetailPage(currentShowShopData);
    });
}

const shopDetail    = document.getElementById('details');

function generateShopDetailPage(shopDetailInfo) {
    if (shopDetailInfo === undefined) {
        return;
    }
    
    mapScreen.style.display = 'none';
    conditionScreen.style.display = 'block';
    shopDetail.style.display = 'block';


    
    
    const shopAddress   = shopDetailInfo.address;
    const shopOpenTime  = shopDetailInfo.open;
    const shopCloseTime = shopDetailInfo.close;

    const shopElseInfoName = [
        'カード利用可',
        'Wi-Fiあり',
        '禁煙席あり',
        'ランチあり',
        '深夜営業あり',
        '駐車場あり',
        'バリアフリー',
        '座敷席あり',
        '個室あり',
        '掘りごたつ',
        'こたつ',
        '夜景が見える',
        '貸切可',
        'カラオケ',
    ];
    const shopElseInfo = {
        card        : shopDetailInfo.card,
        wifi        : shopDetailInfo.wifi,
        nonSmoking  : shopDetailInfo.non_smoking,
        lunch       : shopDetailInfo.lunch,
        midnight    : shopDetailInfo.midnight,
        parking     : shopDetailInfo.parking,
        barrierFree : shopDetailInfo.barrier_free,
        tatami      : shopDetailInfo.tatami,
        privateRoom : shopDetailInfo.private_room,
        horigotatsu : shopDetailInfo.horigotatsu,
        kotatsu     : shopDetailInfo.kotatsu,
        nightView   : shopDetailInfo.night_view,
        charter     : shopDetailInfo.charter,
        karaoke     : shopDetailInfo.karaoke,
    };

    let shopElseInfoHtml = '';
    for (let i = 0; i < shopElseInfoName.length; i++) {
        if (shopElseInfo[Object.keys(shopElseInfo)[i]] === 'あり') {
            shopElseInfoHtml += `<li>${shopElseInfoName[i]}</li>`;
        }
    }


    const shopDetailHtml = `
        <button id="backMap"><img src="/src/img/arrow_back.svg"></button>
        <div class="shopDetailInfo">
            <h2 class="shopName">${shopDetailInfo.name}</h2>
            <h3 class="shopCatch">${shopDetailInfo.genre.catch}</h3>
            <div class="shopThumbnail">
                <img src="${shopDetailInfo.photo.pc.l}" alt="店舗画像">
            </div>
            <div class="detailInfo">
                <div class="genre">
                    <span class="title">ジャンル</span>
                    <span>${shopDetailInfo.genre.name}</span>
                </div>
                <div class="shopAddress">
                    <span class="title">住所</span>
                    <span>${shopAddress}</span>
                </div>
                <div class="shopAccess">
                    <span class="title">アクセス</span>
                    <span>${shopDetailInfo.access}</span>
                </div>
                <div class="fee">
                    <span class="title">予算</span>
                    <span>${shopDetailInfo.budget.name}</span>
                </div>
                <div class="shopOpenTime">
                    <span class="title">営業時間</span>
                    <span>${shopOpenTime}</span>
                </div>
                <div class="shopCloseTime">
                    <span class="title">定休日</span>
                    <span>${shopCloseTime}</span>
                </div>
                <div class="elseInfo">
                    <span class="title">その他の情報</span>
                    <ul class="shopDetailList">
                        ${shopElseInfoHtml}
                    </ul>
                </div>
            </div>
        </div>
        `;
    shopDetail.innerHTML = shopDetailHtml;
    

    const backMapBtn = document.getElementById('backMap');

    // 表示をマップ画面に戻す
    backMapBtn.addEventListener('click', function() {
        mapScreen.style.display = 'block';
        conditionScreen.style.display = 'none';
        shopDetail.style.display = 'none';
    });

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
        range   : 5,
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
                map : googleMap,
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

// タブの切り替えに関係する要素を取得
const mapBtn                = document.getElementById('searchMapBtn');
const conditionBtn          = document.getElementById('searchConditionBtn');
const mapTab                = document.querySelector('.map');
const conditionTab          = document.querySelector('.condition');

// 各タブで表示する要素を取得
const mapScreen             = document.getElementById('map');
const conditionScreen       = document.getElementById('condition');

mapBtn.addEventListener('click', {type: 'map', handleEvent: switchSearchType}, false);
conditionBtn.addEventListener('click', {type: 'condition', handleEvent: switchSearchType}, false);


// タブを切り替える際にタブのスタイルの変更と表示する要素の切り替えを行う
function switchSearchType(e) {
    
    if (this.type === 'map') {
        mapTab.classList.add('selected');
        conditionTab.classList.remove('selected');
        mapScreen.style.display = 'block';
        conditionScreen.style.display = 'none';
    } else if (this.type === 'condition') {
        mapTab.classList.remove('selected');
        conditionTab.classList.add('selected');
        mapScreen.style.display = 'none';
        conditionScreen.style.display = 'block';
    }
}

// ページを閉じた際にトラッキングを停止
window.addEventListener('beforeunload', () => {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
    }
});