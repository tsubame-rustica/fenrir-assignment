/* ---------------- エリアの選択状態を管理 ---------------- */
const getCurrentLocationBtn = document.getElementById('getCurrentLocationBtn');
const geocoder = new google.maps.Geocoder();

const areaInput = document.getElementById('area')

getCurrentLocationBtn.addEventListener('click', getCurrentLatlng, false);

// 画面読み込み時に現在地を取得する
getCurrentLatlng();

function getCurrentLatlng() {
    getCurrentLocation((error, locationInfo) => {
        if (error) {
            console.error('現在地の取得に失敗しました');
        } else {
            
            areaInput.value = locationInfo.currentAreaName;
            areaInput.setAttribute('lat', locationInfo.currentLocation.lat);
            areaInput.setAttribute('lng', locationInfo.currentLocation.lng);
        }
    });
}

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
                        
                        const currentAreaArrLen = currentAreaArr.length;
                        const selectionCurrentAreaArr = currentAreaArr.filter(area => area.types.includes('political') && !area.types.includes('country')); // 都道府県名以降の要素を取得
                        const reverseSelectionCurrentAreaArr = selectionCurrentAreaArr.slice().reverse();   // 都道府県名 市区名 町名の順に並べる;
                        
                        let currentAreaName = '';
                        for (let i = 0; i < currentAreaArrLen; i++) {
                            
                            if (reverseSelectionCurrentAreaArr[i].types.includes("sublocality")) {    // 数字が含まれている場合は住所として扱わない
                                break;
                            }
                            currentAreaName += reverseSelectionCurrentAreaArr[i].long_name;
                            
                        }

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
            
            const selectedGenre = this.parentElement.getAttribute('data');
            genreArr.forEach(genreObj => {
                if (genreObj.code === selectedGenre) {
                    genreObj.isSelected = false;
                    
                }
            });
            updateGenreUI();
        });
    }, false);
    
    
    unselectedGenreBtnArr.forEach(function(unselectedGenreBtn) {
        unselectedGenreBtn.addEventListener('click', function() {
            
            const unselectedGenre = this.parentElement.getAttribute('data');
            genreArr.forEach(genreObj => {
                if (genreObj.code === unselectedGenre) {
                    genreObj.isSelected = true;
                    
                }
            });
            updateGenreUI();
        });
    }, false);
}

const displayUnselectedGenre        = document.getElementById('displayUnselectedGenre');
const openDisplayUnselectedGenre    = document.getElementById('openDisplayUnselectedGenre');

openDisplayUnselectedGenre.addEventListener('click', function() {
    
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
    let area = document.getElementById('area').value;
    const areaLat = document.getElementById('area').getAttribute('lat');
    const areaLng = document.getElementById('area').getAttribute('lng');
    const genre = genreArr.filter(genreObj => genreObj.isSelected === true).map(genreObj => genreObj.code);
    const distance = showSelectedDistance.getAttribute('data');

    if (area === '') {
        area = '東京都渋谷区';
    }
   
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
    
    fetchFilteredShopData(serarchCondition);
});

const resultDisplay = document.getElementById('result');
const resultList = document.getElementById('resultList');

const pageList = document.getElementById('pageList');

const shopPagingListJson = {
    group   : []
}

let pageIndex = 1;
let maxPageIndex = 1;

function fetchFilteredShopData(conditionObj) {
    const apiUrl = 'http://localhost:8080/foreign_api/gourmet/v1';
    const apiKey = '2506182a2b82d52b';

    // パラメータに不足がないようにする
    /*
        - 緯度と経度が指定されていない場合
            - 地域が指定されていない場合は現在地を取得する
        - 範囲指定をしない場合は緯度と経度を削除する
        - 地域が指定されていないかつ範囲指定をしない場合は検索範囲を1kmにする
    */
    if (conditionObj.condition[0].value === '' || conditionObj.condition[0].value === '') {   // 緯度と経度が指定されていない場合
        if (conditionObj.condition[2].value === '') {   // 地域が指定されていない場合は現在地を取得する
            getCurrentLocation((error, locationInfo) => {
                if (error) {
                    const tokyoStationPos = {
                        lat : 35.681236,
                        lng : 139.767125,
                    };
                    conditionObj.condition[0].value = tokyoStationPos.lat;
                    conditionObj.condition[1].value = tokyoStationPos.lng;
                    console.error('現在地の取得に失敗しました');
                } else {
                    conditionObj.condition[0].value = locationInfo.currentLocation.lat;
                    conditionObj.condition[1].value = locationInfo.currentLocation.lng;
                }
            });
        }
    }  else {
        if (conditionObj.condition[3].value === '6' && conditionObj.condition[2].value !== '') {   // 範囲指定をしない場合は緯度と経度を削除する
            
            conditionObj.condition[0].value = '';
            conditionObj.condition[1].value = '';

        } else if (conditionObj.condition[3].value === '6' && conditionObj.condition[2].value === '') {
            
            conditionObj.condition[2].value = '';
            conditionObj.condition[3].value = 3;
        }
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
        const shopListJson = fetchData.results.shop;

        resultDisplay.style.display = 'block';
        isShowResultPage = true;

        if (shopListJson.length === 0) {
            nextBtn.style.display = 'none';
            prevBtn.style.display = 'none';
            resultList.innerHTML = '<h2 class="noresult">検索結果がありません</h2>';
            return;
        } else {
            nextBtn.style.display = 'block';
            prevBtn.style.display = 'block';
        }


        resultList.innerHTML = '';

        const pagingGroup = Math.ceil(shopListJson.length / 5);
        maxPageIndex = pagingGroup;
        for (let i = 0; i < pagingGroup; i++) {
            shopPagingListJson.group.push({
                page    : i + 1,
                shopInfoHtml : [

                ],
                elseInfo : [

                ]
            });
            for (let j = 0; j < 5; j++) {
                if (i * 5 + j >= shopListJson.length) {
                    break;
                }
                const shopDetails       = shopListJson[i * 5 + j];
                console.log(shopDetails);
                const shopName          = '<h2 class="shopName">' + shopDetails.name + '</h2>';
                const shopCatch         = '<h3 class="shopCatch">' + shopDetails.genre.catch + '</h3>';
                const shopAccess        = '<div class="shopAccess"><img class="detailsIcon" src="/src/img/location.svg" alt="ピンのアイコン"><span>' + shopDetails.access + '</span></div>';
                const shopThumbnail     = '<img src="' + shopDetails.photo.pc.l + '" alt="店舗画像" class="shopThumbnail">';
                const shopFee           = '<div class="fee"><img class="detailsIcon" src="/src/img/yen.svg" alt="日本円のアイコン"><span>' + shopDetails.budget.name + '</span></div>';
                const shopGenre         = '<div class="genre"><img class="detailsIcon" src="/src/img/restaurant.svg" alt="食器のアイコン"><span>' + shopDetails.genre.name + '</span></div>';
                const shopDetailTextArr = [shopName, shopCatch, shopGenre, shopAccess, shopFee];
                const pushJsonHtml      = `<li><button data=${j} class="shopDetail"><div class="textInfo">${shopDetailTextArr.join('')}</div><div class="imgInfo">${shopThumbnail}</div></button></li>`;
                shopPagingListJson.group[i].shopInfoHtml[j] = pushJsonHtml;
                shopPagingListJson.group[i].elseInfo[j]     = shopDetails;
            }
        }
        pageIndex = 1;
        updateShopList(pageIndex);  // ページングの初期値は1
    })
    .catch(error => {
        console.error('Error:', error); // エラーハンドリング
    });
}


const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

/* ---------------- ページング機能を実装 ---------------- */

function updateShopList(currentPageIndex) {
    // スクロールを一番上に戻す
    window.scrollTo(0, 0);

    resultList.innerHTML = '';

    
    shopPagingListJson.group[currentPageIndex - 1].shopInfoHtml.forEach(html => {
        resultList.innerHTML += html;
    });

    pageList.innerHTML = '';

    nextBtn.style.visibility = 'visible';
    prevBtn.style.visibility = 'visible';

    const pagingGroup = shopPagingListJson.group.length;

    pageIndex = currentPageIndex;
    let startIndex = currentPageIndex;
    if (currentPageIndex === 1) {
        startIndex = 2;
        prevBtn.style.visibility = 'hidden';
    } else if (currentPageIndex === pagingGroup) {
        startIndex -= 1;
        nextBtn.style.visibility = 'hidden';
    }
    if (maxPageIndex === 1) {
        nextBtn.style.visibility = 'hidden';
        prevBtn.style.visibility = 'hidden';
    }
    for (let i = startIndex - 1; i < startIndex + 2; i++) {
        if (i < 1 || i > pagingGroup) {
            continue;
        } else if (i == currentPageIndex) {
            pageList.innerHTML += `<li><button class="pagingBtn" data="${i}" style="background-color: #f2f2f2;">${i}</button></li>`;
        } else {
            pageList.innerHTML += `<li><button class="pagingBtn" data="${i}" >${i}</button></li>`;
        }
    }

    const pagingBtn = document.getElementsByClassName('pagingBtn');
    const pagingBtnArr = Array.from(pagingBtn);

    pagingBtnArr.forEach(pagingBtn => {
        pagingBtn.addEventListener('click', function() {
            const pageIndex = this.getAttribute('data');
            updateShopList(Number(pageIndex));
        });
    });


    const shopDetailBtn = document.getElementsByClassName('shopDetail');
    const shopDetailBtnArr = Array.from(shopDetailBtn);

    shopDetailBtnArr.forEach(shopDetailBtn => {
        shopDetailBtn.addEventListener('click', function() {
            
            const responseFetchData = getShopDetailInfo(this.getAttribute('data'), pageIndex)
            generateShopDetailPage(responseFetchData);
        });
    });
}

nextBtn.addEventListener('click', function() {
    pageIndex += 1;
    updateShopList(pageIndex);
});

prevBtn.addEventListener('click', function() {
    pageIndex -= 1;
    updateShopList(pageIndex);
});

const closeResultDisplayBtn = document.getElementById('closeResultDisplayBtn');

closeResultDisplayBtn.addEventListener('click', function() {
    resultDisplay.style.display = 'none';
    isShowResultPage = false;
});

/* ---------------- 店舗詳細ページへ遷移 ---------------- */
let isShowResultPage = false;
const shopDetail = document.getElementById('details');

function getShopDetailInfo(index, pageIndex) {
    const shopDetailInfo = shopPagingListJson.group[pageIndex - 1].elseInfo[index];
    return shopDetailInfo;
}

function generateShopDetailPage(shopDetailInfo) {
    if (shopDetailInfo === undefined) {
        return;
    }
    resultDisplay.style.display = 'none';
    shopDetail.style.display = 'block';
    
    
    const shopAddress = shopDetailInfo.address;
    const shopOpenTime = shopDetailInfo.open;
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
        <button id="closeDetailsBtn"><img src="/src/img/arrow_back.svg"></button>
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
                <div class='shopSite'>
                    <span class="title">公式サイト</span>
                    <span><a href="${shopDetailInfo.urls.pc}" target="_blank">${shopDetailInfo.urls.pc}</a></span>
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
    

    const closeDetailsBtn = document.getElementById('closeDetailsBtn');

    closeDetailsBtn.addEventListener('click', function() {
        if (isShowResultPage) {
            resultDisplay.style.display = 'block';
        }
        shopDetail.style.display = 'none';
    });

}