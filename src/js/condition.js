/* ---------------- エリアの選択状態を管理 ---------------- */
const getCurrentLocationBtn = document.getElementById('getCurrentLocationBtn');
const geocoder = new google.maps.Geocoder();

const areaInput = document.getElementById('area')

getCurrentLocationBtn.addEventListener('click', function() {
    getCurrentLocation((error, locationInfo) => {
        if (error) {
            console.error('現在地の取得に失敗しました');
        } else {
            console.log(locationInfo);
            areaInput.value = locationInfo.currentAreaName;
            areaInput.setAttribute('lat', locationInfo.currentLocation.lat);
            areaInput.setAttribute('lng', locationInfo.currentLocation.lng);
        }
    });
});

function getCurrentLocation(callback) {
    let responseCurrentLocationInfo = {};
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const currentLocation = {
                lat : position.coords.latitude,
                lng : position.coords.longitude,
            };
            geocoder.geocode(
                { location: currentLocation },
                (results, status) => {
                    if (status === 'OK') {
                        const currentAreaArr = results[0].address_components;   // 番地 → 町名 → 市区名 → 都道府県名 → 国名
                        console.log(currentAreaArr);
                        const currentAreaArrLen = currentAreaArr.length;
                        const selectionCurrentAreaArr = currentAreaArr.filter(area => area.types.includes('political') && !area.types.includes('country')); // 都道府県名以降の要素を取得
                        const reverseSelectionCurrentAreaArr = selectionCurrentAreaArr.slice().reverse();   // 都道府県名 市区名 町名の順に並べる;
                        
                        let currentAreaName = '';
                        reverseSelectionCurrentAreaArr.forEach(area => {
                            currentAreaName += area.long_name;
                        });

                        responseCurrentLocationInfo = {
                            status              : 'success',
                            currentLocation     : currentLocation,
                            currentAreaName     : currentAreaName,
                        }

                        callback(null, responseCurrentLocationInfo);

                    } else {
                        callback('error', status);
                    }
                }
            )
        }
    );

    return responseCurrentLocationInfo;
}

/* ---------------- ジャンルの選択状態を管理 ---------------- */
const genreSelectedIUl = document.getElementById('selectedList');
const genreUnselectedUl = document.getElementById('unselectedList');

const genreArr = [
        {code : 'G001', name : '居酒屋',                  isSelected : false},
        {code : 'G002', name : 'ダイニングバー・バル',      isSelected : false},
        {code : 'G003', name : '創作料理',                isSelected : false},
        {code : 'G004', name : '和食',                   isSelected : false},
        {code : 'G005', name : '洋食',                   isSelected : false},
        {code : 'G006', name : 'イタリアン・フレンチ',      isSelected : false},
        {code : 'G007', name : '中華',                   isSelected : false},
        {code : 'G008', name : '焼肉・ホルモン',           isSelected : false},
        {code : 'G017', name : '韓国料理',                isSelected : false},
        {code : 'G009', name : 'アジア・エスニック料理',    isSelected : false},
        {code : 'G010', name : '各国料理',                isSelected : false},
        {code : 'G011', name : 'カラオケ・パーティ',        isSelected : false},
        {code : 'G012', name : 'バー・カクテル',           isSelected : false},
        {code : 'G013', name : 'ラーメン',                isSelected : false},
        {code : 'G016', name : 'お好み焼き・もんじゃ',      isSelected : false},
        {code : 'G014', name : 'カフェ・スイーツ',         isSelected : false},
        {code : 'G015', name : 'その他',                  isSelected : false},
]

updateGenreUI();

function updateGenreUI() {
    genreSelectedIUl.innerHTML = '';
    genreUnselectedUl.innerHTML = '';
    
    genreArr.forEach(genreObj => {
        if (genreObj.isSelected) {
            genreSelectedIUl.innerHTML += '<li data="' + genreObj.code + '">' + genreObj.name + '<button class="selectedGenreBtn" type="button">&times;</button></li>';
        } else {
            genreUnselectedUl.innerHTML += '<li data="' + genreObj.code + '"><button class="unselectedGenreBtn" type="button">' + genreObj.name + '</button></li>';
        }
    });

    const selectedGenreBtn              = document.getElementsByClassName('selectedGenreBtn');
    const unselectedGenreBtn            = document.getElementsByClassName('unselectedGenreBtn');
    const selectedGenreBtnArr           = Array.from(selectedGenreBtn);
    const unselectedGenreBtnArr         = Array.from(unselectedGenreBtn);

    selectedGenreBtnArr.forEach(function(selectedGenreBtn) {
        selectedGenreBtn.addEventListener('click', function() {
            console.log("selected", selectedGenreBtnArr.length);
            const selectedGenre = this.parentElement.getAttribute('data');
            genreArr.forEach(genreObj => {
                if (genreObj.code === selectedGenre) {
                    genreObj.isSelected = false;
                    console.log(genreObj);
                }
            });
            updateGenreUI();
        });
    }, false);
    
    
    unselectedGenreBtnArr.forEach(function(unselectedGenreBtn) {
        unselectedGenreBtn.addEventListener('click', function() {
            console.log("unselected", unselectedGenreBtnArr.length);
            const unselectedGenre = this.parentElement.getAttribute('data');
            genreArr.forEach(genreObj => {
                if (genreObj.code === unselectedGenre) {
                    genreObj.isSelected = true;
                    console.log(genreObj);
                }
            });
            updateGenreUI();
        });
    }, false);
}

const displayUnselectedGenre        = document.getElementById('displayUnselectedGenre');
const openDisplayUnselectedGenre    = document.getElementById('openDisplayUnselectedGenre');

openDisplayUnselectedGenre.addEventListener('click', function() {
    console.log('click');
    displayUnselectedGenre.classList.toggle('showSelectList');
}, false);



/* ---------------- 選択された距離を表示する ---------------- */
const displayUnselectedDistance     = document.getElementById('displayUnselectedDistance');
const openDisplayUnselectedDistance = document.getElementById('openDisplayUnselectedDistance');

const showSelectedDistance          = document.getElementById('showSlectedDistance');
const distanceList                  = document.querySelectorAll('#distanceList li');
const distanceListBtn               = document.querySelectorAll('#distanceList li button');
const distanceListArr               = Array.from(distanceList);
const distanceListBtnArr            = Array.from(distanceListBtn);

distanceListBtnArr.forEach(distanceListElement => {
    distanceListElement.addEventListener('click', function() {
        const distanceListIndex = distanceListArr.indexOf(this.parentElement);
        showSelectedDistance.textContent = distanceListElement.textContent;
        showSelectedDistance.setAttribute('data', distanceListIndex);
        updateUnselectedDistanceList(distanceListIndex);
    });
});

openDisplayUnselectedDistance.addEventListener('click', function() {
    displayUnselectedDistance.classList.toggle('showSelectList');
});

function updateUnselectedDistanceList(index) {
    for (let i = 0; i < distanceList.length; i++) {
        if (i === index) {
            distanceList[i].style.display = 'none';
        } else {
            distanceList[i].style.display = 'block';
        }
    }
}

const defaultDistanceIndex = 6; // 初期値では範囲指定をしない
updateUnselectedDistanceList(defaultDistanceIndex);



/* ---------------- 検索条件を送信する ---------------- */
const searchBtn = document.getElementById('searchBtn');

searchBtn.addEventListener('click', function() {
    const area = document.getElementById('area').value;
    const areaLat = document.getElementById('area').getAttribute('lat');
    const areaLng = document.getElementById('area').getAttribute('lng');
    const genre = genreArr.filter(genreObj => genreObj.isSelected === true).map(genreObj => genreObj.code);
    const distance = showSelectedDistance.getAttribute('data');
   
    /**
     * @property {'latlng'|'address'|'genre'|'distance'} conditionName - 条件の名前
     * @property {number} [lat] - 緯度（`conditionName`が`latlng`の場合のみ）
     * @property {number} [lng] - 経度（`conditionName`が`latlng`の場合のみ）
     * @property {string} [areaName] - 地域名（`conditionName`が`address`の場合のみ）
     * @property {string} [genreCode] - ジャンルコード（`conditionName`が`genre`の場合のみ）
     * @property {number} [distanceId] - 距離ID（`conditionName`が`distance`の場合のみ）
     */
    const serarchCondition = {
        condition: [
            {
                conditionName   : 'lat',
                value           : areaLat,
            },
            {
                conditionName   : 'lng',
                value           : areaLng,
            },
            {
                conditionName   : 'address',
                value           : area,
            },
            {
                conditionName   : 'range',
                value           : distance
            },
            {
                conditionName   : 'genre',
                valueArr        : genre,
            }
        ]
    };
    console.log(serarchCondition);
    fetchFilteredShopData(serarchCondition);
});

const resultDisplay = document.getElementById('result');
const resultList = document.getElementById('resultList');


function fetchFilteredShopData(conditionObj) {
    const apiUrl = 'http://localhost:8080/foreign_api/gourmet/v1';
    const apiKey = '2506182a2b82d52b';

    // パラメータに不足がないようにする
    if (conditionObj.condition[0].value === '' || conditionObj.condition[0].lng === '') {
        if (conditionObj.condition[2].value === '' || conditionObj.condition[3].value > 0) {
            getCurrentLocation((error, locationInfo) => {
                if (error) {
                    console.error('現在地の取得に失敗しました');
                } else {
                    conditionObj.condition[0].value = locationInfo.currentLocation.lat;
                    conditionObj.condition[0].value = locationInfo.currentLocation.lng;
                    conditionObj.condition[1].value = locationInfo.currentAreaName;
                }
            });
            
        } else if (conditionObj.condition[3].value > 0) {
            conditionObj.condition[3].value = '';
        }
    } else {
        if (conditionObj.condition[4].value === '') {
            conditionObj.condition[4].valueArr = 5;
        }
        conditionObj.condition[2].value = '';
    }
    
    const params = new URLSearchParams({
        key     : apiKey,
        count   : 50,
        format  : 'json',
    });

    conditionObj.condition.forEach(condition => {
        if (condition.valueArr !== undefined) {
            condition.valueArr.forEach(value => {
                params.append(condition.conditionName, value);
            });
        } else if (condition.value !== '') {
            params.append(condition.conditionName, condition.value);
        }
    });

    console.log(params.toString());

    areaInput.setAttribute('lat', "");
    areaInput.setAttribute('lng', "");

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
        const shopListJson = fetchData['results']['shop'];
        console.log(shopListJson);
        resultDisplay.style.display = 'block';
        resultList.innerHTML = '';
        shopListJson.forEach((shopDetails) => {
            const shopName = shopDetails.name;
            const shopAccess = shopDetails.access;
            const shopThumbnail = shopDetails.photo.pc.l;

            resultList.innerHTML += '<li><h2 class="shopName">' + shopName + '</h2><p class="shopAccess">' + shopAccess + '</p><img src="' + shopThumbnail + '" alt="店舗画像" class="shopThumbnail"></li>';
        });
    })
    .catch(error => {
        console.error('Error:', error); // エラーハンドリング
    });
}