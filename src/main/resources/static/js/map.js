const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
const { Map } = await google.maps.importLibrary("maps");


// ピンの画像各種
const pinImg = {
	default: createImageElement("/image/pin-default.png"),
	selected: createImageElement("/image/pin-selected.png"),
	notAllowed: createImageElement("/image/pin-not-allowed.png")
};

// 画像の要素
function createImageElement(src) {
	const img = document.createElement("img");
	img.src = src;
	img.style.width = "40px";
	img.style.height = "60px";
	return img;
}

const rightContainer = document.getElementById('right-container');
const reviewDetailContainer = document.getElementById('review-detail-container');
const reviewDetailContainerMin = document.getElementById('review-detail-container-min');
const registerSpotContainer = document.getElementById('register-spot-container');
const registerSpotContainerMin = document.getElementById('register-spot-container-min');


const mediaQuery = window.matchMedia('(max-width: 800px)');
let previousState = mediaQuery.matches;//画面リサイズに使用する初期値



let map;
let mapId = "450e2771037cc321";
let infoWindow;

let markerPin;//指定されているマーカーの保持

let previousZoomLevel = 10;//クラスター境界ズームレベル

let markers = [];//現在あるマーカーインスタンスの格納
let newMarkers = [];//描写するマーカー
let markersForClustering = []; // クラスタ化するマーカーのリスト
let markersCluster = null;//マーカークラスターのインスタンス
let reportHandler;//通報ハンドル
let repoortSubmitHandler;//通報提出ハンドル

var markerDataList = [];//スポット情報の格納
var markerDataListOnScreen = [];//スポット画面内の情報の格納

var categoryId = null;//カテゴリーID
let UrlCopiedBlockTimeoutId;//コピー後UIのタイム

let currentViewPost = null;

var spotRegisteredOnmapPos = null;//登録マーカーの緯度経度

//ソート判定オブジェクト
var sortValues = {
	sortCreatedAt: false,
	sortFavorite: false,
	sortMySpot: false,
	sortReportBox: false,
};

var authenticAdminBtn = false;//スポット承認の判定




initMap();
displaySystemMessage();
screenTransition();


//マップ生成
async function initMap() {
	resetReviewConteiner();

	//    マップ描画
	map = new Map(document.getElementById("map"), {
		center: { lat: 35.709808, lng: 139.810357 },
		zoom: 10,
		restriction: {
			latLngBounds: //日本地図までの描画
			{
				north: 50.026559,
				south: 21.587347,
				east: 155.372231,
				west: 122.914971,
			},
		},
		disableDefaultUI: true,
		mapId: mapId,
	});



	getCurrentpos(map);//	現在位置取得

	google.maps.event.addListener(map, 'zoom_changed', () => {
		const currentZoomLevel = map.getZoom();

		if (previousZoomLevel < 10 && currentZoomLevel >= 10) {
			markerDataList = [];
		} else if (previousZoomLevel >= 10 && currentZoomLevel < 10) {
			//			reviewDetailDelete();
			markerDataList = [];
		}
		previousZoomLevel = currentZoomLevel;

	})


	//マーカー生成イベント
	google.maps.event.addListener(map, "idle", () => {
		console.log("総マーカー数:" + markers.length)
		console.log("総クラスタマーカー数:" + markersForClustering.length)
		createMarker(map);
	});

	//  カテゴリー選択

	document.querySelectorAll('.category-btn').forEach(button => {

		button.addEventListener('click', () => {
			markerDataList = [];
			resetmarker();
			reviewDetailDelete();
			categorySelect(button);
			createMarker(map);
		});
	});

	//マーカー登録ボタン
	if (document.getElementById("register-arleady-btn")) {


		const registerArleadyBtn = document.getElementById("register-arleady-btn");
		registerArleadyBtn.addEventListener('click', function() {
			document.getElementById('registering-now').style.display = "inline-block";
			createUserResisterSpot(map, this);
			const imageInput = document.getElementById('imageFile');
			imageInput.addEventListener('change', () => { changeImage(imageInput) });



		});
	}

};


//	現在位置ボタン
const locationButton = document.getElementById("get-current-pos-btn");
locationButton.addEventListener("click", () => {
	getCurrentpos(map);
});


//ヒストリーバック
window.addEventListener('popstate', function(e) {


	createMarker(map);
	screenTransition();
});

//スクリーン遷移時
function screenTransition() {
	const url = new URL(window.location.href);
	//	if(document.getElementById("review-detail-container")){
	//		document.getElementById("review-detail-container").remove();
	//	}


	if (url.searchParams.get('spotId')) {
		const spotId = url.searchParams.get('spotId');
		const XHR = new XMLHttpRequest();
		XHR.open('POST', '/map/general/pos', true);
		XHR.setRequestHeader('Content-Type', 'application/json');
		XHR.responseType = 'json';
		XHR.send(JSON.stringify(spotId));

		XHR.onload = function() {
			if (XHR.status === 200) {
				const latlng = this.response;

				if (latlng != null) {
					console.log("latlngOk");
					map.setCenter(latlng);
					createReviewDetail(spotId);

				} else {
					selectReviewConteiner().style.display = "none";


					switchPinTexture(null);
				}

			}
		};


	} else {
		selectReviewConteiner().style.display = "none";


		switchPinTexture(null);
	}

}

//	現在位置取得機能
function getCurrentpos(map) {
	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,

				};


				map.setCenter(pos);

			},
			() => {
				handleLocationError(true, infoWindow, map.getCenter());
			}
		);
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}


};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(
		browserHasGeolocation
			? "Error: The Geolocation service failed."
			: "Error: Your browser doesn't support geolocation."
	);
};


//システムメッセージ表示機能
function displaySystemMessage() {
	if (document.getElementById('login-info') || document.getElementById('logout-info') || document.getElementById('system-success-message') || document.getElementById('system-error-message')) {
		const box = document.getElementById("system-alert-message");
		setTimeout(() => {
			box.classList.add('shrink');
		}, 6000);

		box.addEventListener('transitionend', () => {
			box.style.display = 'none';
		});
	}
}


// 現在あるマーカーの削除
function refreshMarker(marker) {
	if (marker != null && marker.length > 0) {
		for (let i = 0; i < marker.length; i++) {
			marker[i].setMap(null);
		}
	}
}

//  スポット情報表示機能
async function createMarker(map) {

	//	resetmarker();
	console.log('createMarker' + map);
	const zoomlevel = map.getZoom();
	console.log("現在のズームレヴェル：" + zoomlevel);
	const XHR = new XMLHttpRequest();
	XHR.open('POST', '/map/general/marker/list', true);
	XHR.setRequestHeader('Content-Type', 'application/json');
	XHR.responseType = 'json';
	XHR.send(JSON.stringify(getMarkerConfig(map, sortValues, zoomlevel)));

	XHR.onload = async function() {
		if (XHR.status === 200) {
			console.log('createMarkerからのresponse:' + this.response);

			const markerData = this.response


			const registerMarkerPromise = registerMarker((markerData.limitedByBoundSpotList), pinImg['default'].cloneNode(true));

			let createReviewPromise;

			if (authenticAdminBtn) {
				createReviewPromise = createNotAllowedMarkerList();

			} else {
				createReviewPromise = createReview(markerData.limitedByBoundSpotListForReviewer);
			}


			try {
				await Promise.all([registerMarkerPromise, createReviewPromise]);
			} catch (error) {
				console.error("Error in parallel execution: ", error);
			}

			for (let i = 0; i < markerData.limitedByBoundSpotList.length; i++) {
				markerDataList.push(markerData.limitedByBoundSpotList[i]);
			}



		} else {  // statusが200以外の場合はリクエストが適切でなかったとしてエラー表示
			alert("error");
		}

	}

};


//  スポット情報CRUD用の情報取得
function getMarkerConfig(map, sortValues, zoomlevel) {

	const bounds = map.getBounds();
	const configData =
	{
		zoomLevel: zoomlevel,
		minLat: bounds.getSouthWest().lat(),
		minLng: bounds.getSouthWest().lng(),
		maxLat: bounds.getNorthEast().lat(),
		maxLng: bounds.getNorthEast().lng(),
		categoryId: categoryId,
		sortCreatedAt: sortValues.sortCreatedAt,
		sortFavorite: sortValues.sortFavorite,
		sortMySpot: sortValues.sortMySpot,
		sortReportBox: sortValues.sortReportBox,
		markerDataList: markerDataList

	};

	return configData;
};


//マーカーの表示機能
async function registerMarker(markerData, pinImage) {
	const url = new URL(window.location.href);


	for (var i = 0; i < markerData.length; i++) {

		const pinDefault = pinImage.cloneNode(true);
		const marker = new google.maps.marker.AdvancedMarkerElement({
			position: new google.maps.LatLng({ lat: markerData[i]['lat'], lng: markerData[i]['lng'] }),
			content: pinDefault,
			title: "spotId" + markerData[i]['id'],
			zIndex: 1,
			map: null

		});


		//マーカーのクリックイベント
		marker.addListener("click", function() { switchPinTexture(this) });

		//URLの判定	
		if (markerData[i]['id'] == url.searchParams.get('spotId')) {
			const pinSelected = pinImg['selected'].cloneNode(true);
			marker.content = pinSelected;
			marker.zIndex = 2;
			markerPin = marker;

		}

		newMarkers.push(marker);//マーカーリストへ追加

	}

	console.log("画面内のスポットデータ" + markerData.length);

	let algorithm = new markerClusterer.SuperClusterAlgorithm({
		maxZoom: 11,
		radius: 400
	});



	if (markersCluster != null) {
		markersCluster.clearMarkers();
		markersCluster = null;
	}

	if (map.getZoom() < 10) {
		let count = 0;
		for (var i = 0; i < newMarkers.length; i++) {

			markersForClustering.push(newMarkers[i]);
			count++;
		}
		console.log("描写したクラスター内のスポット数:" + count);

		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
		markers = [];

		markersCluster = new markerClusterer.MarkerClusterer(
			{
				map: map,
				markers: markersForClustering,
				algorithm: new markerClusterer.SuperClusterAlgorithm({ maxZoom: 10, radius: 300 }),
				renderer: {
					render: ({ count, position }) => {


						const area = 100 + 200 * (count / markersForClustering.length);//マーカの割合に合わせたエリアの大きさ
						const offset = 5; // オフセット値

						const adjustedPosition = {
							lat: position.lat() + (Math.random() - 0.5) * offset / 100000, // 緯度にオフセット
							lng: position.lng() + (Math.random() - 0.5) * offset / 100000, // 経度にオフセット
						};

						// SVGを生成
						const svg = `
							      <svg fill="#ff0000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="${area}" height="${area}">
							        <circle cx="120" cy="120" opacity=".4" r="70" />
							        <circle cx="120" cy="120" opacity=".3" r="90" />
							        <circle cx="120" cy="120" opacity=".2" r="110" />
							        
							      </svg>`;

						// Base64エンコードされたSVG
						const iconUrl = `data:image/svg+xml;base64,${btoa(svg)}`;

						return new google.maps.Marker({
							position,
							zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
							icon: {
								url: iconUrl,
								anchor: new google.maps.Point(area / 2, area / 2), // アイコンの中心
							},
						});
					},
				},
			});

	} else {
		let count = 0;
		for (var i = 0; i < newMarkers.length; i++) {
			newMarkers[i].setMap(map);
			markers.push(newMarkers[i]);
			count++;
		}
		console.log("描写したスポット数:" + count);

		for (var i = 0; i < markersForClustering.length; i++) {
			markersForClustering[i].setMap(null);
		}

		markersForClustering = [];

	}

	newMarkers = [];

}




//  ピンのテクスチャ変更及びレビュー詳細作成メソッドへ転送  
function switchPinTexture(marker) {

	console.log("選択されていたマーカーID；" + markerPin);

	if (marker != null) {
		//スポットテクスチャの変更
		if (marker != markerPin) {
			const pinSelected = pinImg['selected'].cloneNode(true);
			marker.content = pinSelected;
			marker.zIndex = 2;



			if (markerPin) {
				const pinDefault = pinImg['default'].cloneNode(true);
				markerPin.content = pinDefault;
				markerPin.zIndex = 1;

			}

		}


		markerPin = marker;
		//レビューのクリックイベント（レビュー詳細へ）
		isAllowedSpot(marker.title.substr(6)).then((isAllowed) => {
			if (isAllowed) {
				history.pushState(null, '', '?spotId=' + marker.title.substr(6));
				createReviewDetail(marker.title.substr(6));
			} else {
				history.pushState(null, '', '?spotId=' + marker.title.substr(6));
				createReviewDetail(marker.title.substr(6));
			}

		});


	} else {
		if (markerPin) {
			const pinDefault = pinImg['default'].cloneNode(true);
			markerPin.content = pinDefault;
			markerPin.zIndex = 1;
		}
		console.log("spotId:error");
		history.pushState(null, '', '/');
		markerPin = null;
	}

}




function isAllowedSpot(spotId) {
	return new Promise((resolve, reject) => {
		const XHR = new XMLHttpRequest();
		XHR.open('GET', `/map/general/marker/approve?spotId=${encodeURIComponent(spotId)}`, true);
		XHR.responseType = 'json';


		XHR.onload = function() {
			if (XHR.status === 200) {

				resolve(XHR.response);

			} else {
				reject(new Error('Request failed'));
			}
		}
		XHR.send();
	});
}

//  マーカーリセット機能
function resetmarker() {
	if (markersCluster) {
		markersCluster.clearMarkers();
	}

	if (markers != null) {
		for (var i = 0; i < markers.length; i++) { markers[i].setMap(null); };
		markers = [];
	};

	if (markersForClustering != null) {
		for (var i = 0; i < markersForClustering.length; i++) {
			markersForClustering[i].setMap(null);
		}

		markersForClustering = [];
	}
};



//右端レビューの表示機能
function createReview(markerData) {

	const reviewContainer = document.getElementById("review-container");




	while (reviewContainer.firstChild) {
		reviewContainer.removeChild(reviewContainer.firstChild);

	}



	if (markerData.length != 0) {

		for (var i = 0; i < markerData.length; i++) {
			var spotName = markerData[i]['name'];
			var spotDescription = markerData[i]['description'];
			var spotId = markerData[i]['id'];
			var spotCategory;
			if (markerData[i]['categoryId'] != null) {
				if (markerData[i]['categoryId']['name'] != null) {
					spotCategory = markerData[i]['categoryId']['name'];
				}
				else { spotCategory = "なし"; }
			} else { spotCategory = "なし"; }



			var imageFileUrl;
			if (markerData[i]['imagefileId']) {
				imageFileUrl ="https://boarderless-repositories.s3.ap-northeast-1.amazonaws.com/spotImage/"+  markerData[i]['imagefileId'];
			} else {
				imageFileUrl = "/image/noImage.png";
			}

			var evalues = markerData[i]['evalues'];
			var star = translateStars(evalues);

			var evaluesDouble;
			if (markerData[i]['evaluesDouble'] != null) {
				evaluesDouble = markerData[i]['evaluesDouble'].toFixed(1);
			} else {
				evaluesDouble = "";
			}

			var price;
			if (markerData[i]['price'] != null) {
				price = markerData[i]['price'] + "円";
			} else {
				price = "なし";
			}



			//innerHTMLの作成
			const reviewCard = document.createElement('div');
			reviewCard.classList.add("review-card");
			reviewCard.innerHTML = "<a href='javascript:void(0)' onclick='' id=reviewId" + spotId + " data-spot-id=" + spotId + " class='review-card-a'>" +
				"<div class=' review-card-contents' id='review-card-contents" + i + "'>"
				+ "<div class=' review-card-contents-description' id='review-card-contents-description" + spotId + "'>"
				+ "<div class='sub-header-font-size'>"
				+ "<div class='text-display-overflow'><p class='text-display-anim' id='review-card-contents-description-spot-name" + spotId + "'>" + spotName + "</p></div>"
				+ "</div>"
				+ "<div class='review-card-contents-description-sub'>"
				+ "<div class='text-warning'>" + star + "<span class='mx-2' text=''>" + evaluesDouble + "</span></div>"
				+ "<div><span>料金</span><span class='mx-2'>" + price + "</span></div>"
				+ "</div>"
				+ "<div class='my-3'><span class='category-outline p-1'>" + spotCategory + "</span></div>"
				+ "</div>"
				+ "<div class='review-card-image-container'>"
				+ "<img src=" + imageFileUrl + " alt='スポット画像' class='review-card-image'></img>"

				+ "</div>"
				+ "</div>"
				+ "</a><hr class='my-0 '>";
			reviewContainer.appendChild(reviewCard);

			checkOverflow(spotId, `review-card-contents-description-spot-name${spotId}`);

			document.getElementById('reviewId' + spotId).addEventListener("click", function() {
				console.log(this);
				const spotId = this.getAttribute('data-spot-id');
				if (map.getZoom() >= 10) {
					for (var i = 0; i < markers.length; i++) {
						console.log("右ウインドウからのスポットの検索" + markers[i].title);
						if (markers[i].title.substr(6) == spotId) {

							console.log("右ウインドウで選択された対象のマーカーID" + markers[i].title);

							switchPinTexture(markers[i]);
							centeredPin(markers[i].position.lat, markers[i].position.lng, true, 11)


						}
					}
				} else {
					for (var i = 0; i < markersForClustering.length; i++) {
						console.log("右ウインドウからのスポットの検索" + markersForClustering[i].title);
						if (markersForClustering[i].title.substr(6) == spotId) {

							console.log("右ウインドウで選択された対象のマーカーID" + markersForClustering[i].title);

							switchPinTexture(markersForClustering[i]);
							centeredPin(markersForClustering[i].position.lat, markersForClustering[i].position.lng, true, 11)


						}
					}
				}

			});

		}

		const reviewCardPadding = document.createElement('div');
		reviewCardPadding.classList.add("review-card-none-color");
		reviewCardPadding.classList.add("w-100");
		reviewCardPadding.classList.add("h-100");
		reviewContainer.appendChild(reviewCardPadding);

	}
	else {
		const reviewCard = document.createElement('div');
		reviewCard.classList.add("review-none");
		reviewContainer.classList.add("review-card-none-color");

		reviewCard.innerHTML = "スポットがありません";
		reviewContainer.appendChild(reviewCard);
	}
}

//右端ソートボタンクリック
if (document.getElementById('sort-btn')) {
	const sortBtn = document.getElementById('sort-btn');
	sortBtn.addEventListener('click', () => {
		const sortImg = document.getElementById('sort-img');

		if (sortValues["sortCreatedAt"] == true) {
			sortImg.innerHTML = "<img class='funciton-img-right'  src='./image/sort-btn.svg' alt='ソート' >";
			sortValues["sortCreatedAt"] = false;
		} else {
			sortImg.innerHTML = "<img class='funciton-img-right'  src='./image/sort-pushed-btn.svg' alt='ソート' >";
			sortValues["sortCreatedAt"] = true;
		}
		console.log("sorytBtn" + sortValues["sortCreatedAt"]);
		createMarker(map);
	});
}

//右端お気に入りソートボタンクリック
if (document.getElementById('fav-sort-btn')) {

	const sortFavBtn = document.getElementById('fav-sort-btn');

	sortFavBtn.addEventListener('click', () => {
		const sortFavImg = document.getElementById('fav-sort-img');
		const sortMyspotImg = document.getElementById('myspot-sort-img');
		const sortReportBoxImg = document.getElementById('report-sort-img');
		
		sortValues["sortMySpot"] = false;
		
		sortMyspotImg.innerHTML = "<img class='funciton-img-right'  src='./image/myspot-btn.svg' alt='マイスポット' >";
		
		if(sortReportBoxImg!=null){
			sortValues["sortReportBox"] = false;
		sortReportBoxImg.innerHTML = '<img src="/image/report-btn.svg" alt="通報箱" class="funciton-img-right">';
		}
		
		
		if (sortValues["sortFavorite"] == true) {
			sortFavImg.innerHTML = "<img class='funciton-img-right'  src='./image/star-btn.svg' alt='お気に入り' >";
			sortValues["sortFavorite"] = false;
		} else {
			sortFavImg.innerHTML = "<img class='funciton-img-right'  src='./image/star-pushed-btn.svg' alt='お気に入り閲覧中' >";
			sortValues["sortFavorite"] = true;
		}
		
		console.log("sortFavoriteBtn" + sortValues["sortFavorite"]);
		resetmarker();
		markerDataList = [];
		createMarker(map);
	});
}

//mySpotクリック
if (document.getElementById('myspot-sort-btn')) {
	const sortMyspotBtn = document.getElementById('myspot-sort-btn');


	sortMyspotBtn.addEventListener('click', () => {
		const sortFavImg = document.getElementById('fav-sort-img');
		const sortMyspotImg = document.getElementById('myspot-sort-img');
		const sortReportBoxImg = document.getElementById('report-sort-img');
		sortValues["sortFavorite"] = false;
		sortFavImg.innerHTML = "<img class='funciton-img-right'  src='./image/star-btn.svg' alt='お気に入り' >";
		
	if(sortReportBoxImg!=null){
			sortValues["sortReportBox"] = false;
		sortReportBoxImg.innerHTML = '<img src="/image/report-btn.svg" alt="通報箱" class="funciton-img-right">';
		}
		
		
		if (sortValues["sortMySpot"] == true) {
			sortMyspotImg.innerHTML = "<img class='funciton-img-right'  src='./image/myspot-btn.svg' alt='マイスポット' >";
			sortValues["sortMySpot"] = false;

		} else {
			sortMyspotImg.innerHTML = "<img class='funciton-img-right'  src='./image/myspot-pushed-btn.svg' alt='マイスポット閲覧中' >";
			sortValues["sortMySpot"] = true;
		}
	
		resetmarker();
		markerDataList = [];
		createMarker(map);
	});
}


//reportBoxクリック
if (document.getElementById('report-sort-btn')) {
	const sortMyspotBtn = document.getElementById('report-sort-btn');


	sortMyspotBtn.addEventListener('click', () => {
		const sortFavImg = document.getElementById('fav-sort-img');
		const sortMyspotImg = document.getElementById('myspot-sort-img');
		const sortReportBoxImg = document.getElementById('report-sort-img');
		if (sortValues["sortReportBox"] == true) {
			sortReportBoxImg.innerHTML = "<img class='funciton-img-right'  src='./image/report-btn.svg' alt='通報箱' >";
			sortValues["sortReportBox"] = false;


		} else {
			sortReportBoxImg.innerHTML = "<img class='funciton-img-right'  src='./image/report-pushed-btn.svg' alt='通報箱閲覧中' >";
			sortValues["sortReportBox"] = true;
		}
		sortFavImg.innerHTML = "<img class='funciton-img-right'  src='./image/star-btn.svg' alt='お気に入り' >";
		sortMyspotImg.innerHTML = "<img class='funciton-img-right'  src='./image/myspot-btn.svg' alt='マイスポット' >";

		sortValues["sortFavorite"] = false;
		sortValues["sortMySpot"] = false;
		resetmarker();
		markerDataList = [];
		createMarker(map);
	});
}

//レビュー詳細表示機能
async function createReviewDetail(spotId) {
	const wholeTable = document.getElementById('wholeTable');
	const mapContainer = document.getElementById("map-container");
	currentViewPost = spotId;
	judgeDisplaySpotRegisterContainer(true, false);

	if (document.getElementById('spot-approve-btn-container')) { document.getElementById('spot-approve-btn-container').style.display = "none"; }



	const XHR = new XMLHttpRequest();
	XHR.open('GET', `/map/general/marker/detail?spotId=${encodeURIComponent(spotId)}`, true);
	XHR.responseType = 'json';
	XHR.send();

	XHR.onload = function() {
		if (XHR.status === 200) {
			const spotDetail = this.response;
			console.log("createReviewDetail:" + spotDetail.isFavorite + ":" + spotDetail.isReport);



			var spotName = spotDetail.spot['name'];
			var spotDescription = spotDetail.spot['description'];
			var spotLat = spotDetail.spot['lat'];
			var spotLng = spotDetail.spot['lng'];
			var spotEnable = spotDetail.spot['enable'];
			var userName = spotDetail.userName;


			var spotCategory;
			if (spotDetail.spot['categoryId'] != null) {
				if (spotDetail.spot['categoryId']['name'] != null) {
					spotCategory = spotDetail.spot['categoryId']['name'];
				}
				else { spotCategory = "なし"; }
			} else {
				spotCategory = "なし";
			}


			var imageFileUrl;
			if (spotDetail.spot['imagefileId']) {
				imageFileUrl ="https://boarderless-repositories.s3.ap-northeast-1.amazonaws.com/spotImage/"+ spotDetail.spot['imagefileId'];
			} else {
				imageFileUrl = "./image/noImage.png";
			}

			var evalues = spotDetail.spot['evalues'];
			var star = translateStars(evalues);



			var evaluesDouble;
			if (spotDetail.spot['evaluesDouble'] != null) {
				evaluesDouble = spotDetail.spot['evaluesDouble'].toFixed(1);
			} else {
				evaluesDouble = "";
			}
			console.log(evaluesDouble);
			var price;
			if (spotDetail.spot['price'] != null) {
				price = spotDetail.spot['price'] + "円";
			} else {
				price = "なし";
			}

			isFavorite(spotDetail.isFavorite);
			isReport(spotDetail.isReport, spotName, spotId);

		} else {  // statusが200以外の場合はリクエストが適切でなかったとしてエラー表示
			alert("error");
		}

		document.getElementById('review-header-text').innerHTML = spotName;

		document.getElementById('review-detail-image').src =imageFileUrl;
		document.getElementById('review-show-star').innerHTML = star;
		document.getElementById('review-show-price').innerText = price;
		//document.getElementById('review-show-evalues').innerHTML = evaluesDouble;				
		document.getElementById('review-show-description').innerText = spotDescription;
		document.getElementById('review-show-user-name').innerHTML = userName;
		document.getElementById('review-show-category').innerText = spotCategory;




		selectReviewConteiner().style.display = "block";


		createReviewShow(spotId);
		createReviewShowStatistics(spotId);
		cretaeReviewShowAdmin(spotId);
		createReviewShowUser(spotId, true);


		if (spotEnable == false) {
			document.getElementById('share-btn').style.display = "none";



			document.getElementById('spot-approve-btn-container').style.display = "block";
			const approveConfirmBtn = document.getElementById('spot-approve-confirm-btn');
			const approveCancelBtn = document.getElementById('spot-approve-cancel-confirm-btn');
			approveConfirmBtn.replaceWith(approveConfirmBtn.cloneNode(true));
			approveCancelBtn.replaceWith(approveCancelBtn.cloneNode(true));


			//スポット承認ボタン

			document.getElementById('spot-approve-confirm-btn').addEventListener('click', () => {
				approveNotAllowedSpot(spotId);
			})

			//スポット承認拒否ボタン
			document.getElementById('spot-approve-cancel-confirm-btn').addEventListener('click', () => {

				const notAllowedSpotRejectedDialog = document.getElementById('not-allowed-spot-rejected-dialog');
				const notAllowedSpotRejectedDialogForm = document.getElementById('not-allowed-spot-rejected-form');
				document.getElementById('not-allowed-spot-name').innerText = spotName;
				notAllowedSpotRejectedDialogForm.rejectedSpotId.value = spotId;
				notAllowedSpotRejectedDialog.showModal();

				document.getElementById('not-allowed-spot-rejected-cancel-btn').replaceWith(
					document.getElementById('not-allowed-spot-rejected-cancel-btn').cloneNode(true)
				);

				document.getElementById('not-allowed-spot-rejected-cancel-btn').addEventListener('click', () => {
					document.getElementById('not-allowed-spot-rejected-dialog').close();
				});

				document.getElementById('not-allowed-spot-rejected-cancel-btn').addEventListener('click', () => { document.getElementById('not-allowed-spot-rejected-dialog').close(); })
				notAllowedSpotRejectedDialogForm.addEventListener("submit", submitSpotApproveRejectDialogForm, { once: true });


			})
		}



		//スポッターボタンクリック
		const spotMapSetterBtn = document.getElementById('spot-mapset-btn');
		spotMapSetterBtn.addEventListener('click', function() {
			centeredPin(spotLat, spotLng, true, 14);
		});


		//favoriteボタンクリック
		function favoriteClickHandler() {
			isFavoriteTab(spotId, true);
		}

		if (document.getElementById('favorite-btn')) {

			const favoriteBtn = document.getElementById('favorite-btn');
			const newFavoriteBtn = favoriteBtn.cloneNode(true);
			favoriteBtn.parentNode.replaceChild(newFavoriteBtn, favoriteBtn);

			newFavoriteBtn.addEventListener('click', favoriteClickHandler);
		}




		//共有ボタンクリック
		const shareBtn = document.getElementById('share-btn');
		shareBtn.addEventListener('click', function() {
			document.getElementById('share-spot-name').innerText = spotName;
			document.getElementById('spot-url').value = location.href;
			document.getElementById('share-img').src = '/image/share-pushed-btn.svg';
			document.getElementById('share-text').style = "color:rgb(120, 215, 119)!important;";
			document.getElementById('share-dialog').showModal();

			//共有ダイアログを閉じる
			const shareDialogDismiss = document.getElementById('share-dialog-dismiss');
			shareDialogDismiss.addEventListener('click', function() {
				console.log("shareDialogDismiss");
				document.getElementById('share-img').src = '/image/share-btn.svg';
				document.getElementById('share-text').style = "color:rgb(178,178,178)!important;";
				document.getElementById('share-dialog').close();

			});

			// LINEで共有する関数
			document.getElementById('line-share-btn').addEventListener('click', function() {
				console.log('line-share-btn');
				var spotUrl = document.getElementById('spot-url').value;
				var lineShareUrl = "https://line.me/R/msg/text/?" + encodeURIComponent(spotUrl);
				window.open(lineShareUrl, '_blank');
			});

			// Twitterで共有する関数
			document.getElementById('twitter-share-btn').addEventListener('click', function() {
				var spotUrl = document.getElementById('spot-url').value;
				var tweetText = "Check Out This Spot! ";
				var twitterShareUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweetText) + "&url=" + encodeURIComponent(spotUrl);
				window.open(twitterShareUrl, '_blank');
			});

			// Facebookで共有する関数  
			document.getElementById('facebook-share-btn').addEventListener('click', function() {
				var spotUrl = document.getElementById('spot-url').value;
				var facebookShareUrl = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(spotUrl);
				window.open(facebookShareUrl, '_blank');
			});

			//コピーURLボタン
			document.getElementById('cory-url-btn').addEventListener('click', function() {
				console.log("urlCopy");
				const element = document.getElementById('spot-url');
				element.select();
				element.setSelectionRange(0, 99999);
				document.execCommand('copy');


				//コピーURL完了
				const copiedUrlBlock = document.getElementById('copied-url-block');
				fadeIn(copiedUrlBlock, UrlCopiedBlockTimeoutId);

			});



		});

		//レビュー詳細タブ消去イベント
		const reviewDetailDeleter = document.getElementById('review-detail-delete-btn');
		reviewDetailDeleter.addEventListener("click", () => {
			judgeDisplaySpotRegisterContainer(false, true);
			reviewDetailDelete();
		});


		//	reviewshow詳細タブ
		const tabs = document.getElementsByClassName("review-detail-tab");
		for (let i = 0; i < tabs.length; i++) {

			tabs[i].addEventListener("click", reviewDetailTabSwitch);
		};





	}

}



//レビュー詳細タブ切り替え機能
function reviewDetailTabSwitch() {
	// タブのaria属性変更

	const tabs = document.getElementsByClassName("review-detail-tab");
	document.querySelector(".review-detail-tab[aria-selected='true']").setAttribute("aria-selected", "false");
	this.setAttribute("aria-selected", "true");

	// パネルのaria属性変更
	console.log(document.querySelector(".panel[aria-hidden='false']"));
	document.querySelector(".panel[aria-hidden='false']").setAttribute("aria-hidden", "true");
	const arrayTabs = Array.prototype.slice.call(tabs);
	const index = arrayTabs.indexOf(this);

	document.getElementsByClassName('panel')[index].setAttribute('aria-hidden', 'false');
}





function reviewDetailDelete() {
	if (selectReviewConteiner().style.display == "block") { selectReviewConteiner().style.display = "none"; };

	switchPinTexture(null);
}


//reviewDetailContainerリセット
function reviewDetailContainerReset() {
	if (document.getElementById('review-detail-container')) {
		console.log("reviewDetailContainerReset");
		document.getElementById('review-detail-container').remove();
	}
}


//お気に入りボタンのon/offの描画
function isFavoriteTab(spotId, pushed) {

	console.log("お気に入りスポットID：" + spotId)
	const favoriteUserData = { spotId: spotId, pushed: pushed };
	const XHR = new XMLHttpRequest();

	XHR.open('POST', '/map/permit/favorite', true);
	XHR.setRequestHeader('Content-Type', 'application/json');
	XHR.responseType = 'json';
	XHR.send(JSON.stringify(favoriteUserData));

	XHR.onload = function() {
		if (XHR.status === 200) {
			const bool = this.response;

			if (bool) {
				document.getElementById('favorite-img').src = "/image/star-pushed-btn.svg";
				document.getElementById('favorite-text').style = "color:rgb(255, 193, 7)!important;";
			} else {
				document.getElementById('favorite-img').src = "/image/star-btn.svg";
				document.getElementById('favorite-text').style = "color:rgb(178,178,178)!important;";
			}

			createMarker(map);
		}
	}
}

function isFavorite(bool) {
	if (document.getElementById('favorite-btn')) {
		if (bool) {
			document.getElementById('favorite-img').src = "/image/star-pushed-btn.svg";
			document.getElementById('favorite-text').style = "color:rgb(255, 193, 7)!important;";
		} else {
			document.getElementById('favorite-img').src = "/image/star-btn.svg";
			document.getElementById('favorite-text').style = "color:rgb(178,178,178)!important;";
		}
	}
}


function isReport(bool, spotName, spotId) {

	if (document.getElementById('report-btn')) {
		const reportBtn = document.getElementById('report-btn');
		// 既存のイベントリスナーを削除
		reportBtn.removeEventListener('click', reportHandler);

		// 無名関数で `spotName` と `spotId` を含む `reportHandler` を再定義
		reportHandler = () => reportRegisater(spotName, spotId);

		// 新しいイベントリスナーを追加
		reportBtn.addEventListener('click', reportHandler);
		if (bool) {
			document.getElementById('report-text').innerText = "通報済み";
			document.getElementById('report-text').style = "color:rgb(223, 86, 86)!important;";
			document.getElementById('report-img').src = '/image/report-pushed-btn.svg';
			document.getElementById('report-btn').style = " pointer-events:none;";
		} else {
			document.getElementById('report-text').style = "color:rgb(178,178,178)!important;";
			document.getElementById('report-text').innerText = "通報";
			document.getElementById('report-btn').style = " pointer-events:auto;";
			document.getElementById('report-img').src = '/image/report-btn.svg';

		}
	}

}



//通報機能
function reportRegisater(name, spotId) {
	console.log("reportRegisater called with:", name, spotId);
	const reportRegisterDialogForm = document.getElementById('report-register-dialog-form');
	const reportRegisterDialog = document.getElementById('report-register-dialog');
	const reportRegisterCancelBtn = document.getElementById('report-register-cancel-confirm-btn');
	const reportSpotName = document.getElementById('report-spot-name');
	const reportconfirmBtn = document.getElementById('report-register-confirm-btn');
	//	const reportDialogDismiss=document.getElementById('report-dialog-dismiss');
	document.getElementById("errorReportContents").innerText = "";
	document.getElementById("reportContents").innerText = "";

	reportSpotName.innerText = name;
	reportRegisterDialogForm.reportSpotId.value = spotId;


	// 既存のイベントリスナーを削除
	reportconfirmBtn.removeEventListener('click', repoortSubmitHandler);

	// 無名関数で `spotName` と `spotId` を含む `reportHandler` を再定義
	repoortSubmitHandler = () => submitReportRegisterDialogForm(spotId);

	reportconfirmBtn.addEventListener('click', repoortSubmitHandler);
	reportRegisterDialog.showModal();

	reportRegisterCancelBtn.addEventListener("click", function() {

		reportRegisterDialog.close();


	});







	//	function handleSubmit() {
	//		submitReportRegisterDialogForm(spotId);
	//	}

}

function submitReportRegisterDialogForm(spotId) {



	const reportRegisterConfirmBtn = document.getElementById('report-register-confirm-btn');
	const form = document.forms['reportRegisterDialogForm'];
	const formData = new FormData(form);
	const jsonData = {};

	reportRegisterConfirmBtn.style.disabled = true;
	formData.forEach((value, key) => {
		jsonData[key] = value;
		console.log("通報内容：" + value);
	});


	const XHR = new XMLHttpRequest();
	XHR.open('POST', '/map/permit/report/register');
	XHR.setRequestHeader('Content-Type', 'application/json');
	XHR.responseType = 'json';
	XHR.send(JSON.stringify(jsonData));

	XHR.onload = function() {
		if (XHR.status === 200) {
			const reportRegisterDialog = document.getElementById('report-register-dialog');
			const result = this.response;

			if (result["bool"]) {
				isReport(spotId);
				alert("通報を申請しました。");
				form.reset();
				reportRegisterDialog.close();

			} else {
				document.getElementById("errorReportContents").innerText = result["str"];


			}

		} else {
			alert("通報を申請できませんでした。");
		}
		reportRegisterConfirmBtn.style.disabled = false;
	}

}

//フェードインアウト
function fadeIn(elem, time) {

	if (time) {
		clearTimeout(time);
	}

	if (elem.style.display == "flex") {
		elem.style.display = "none";
		elem.classList.add('fadein');
		elem.classList.remove('fadeout');

		setTimeout(function() {
			elem.style.display = "flex";
		}, 50);

	} else {
		elem.style.display = "flex";
	}



	time = setTimeout(function() {
		fadeOut(elem);
	}, 5000);

};

function fadeOut(elem) {
	new Promise((resolve) => {
		elem.classList.remove('fadein');
		elem.classList.add('fadeout');
		setTimeout(function() {
			resolve();
		}, 1000);
	}).then(() => {
		elem.style.display = "none";
		elem.classList.add('fadein');
		elem.classList.remove('fadeout');
	});
}



//レビュー登録ユーザー認証API
function createReviewShowUser(spotId, isReview, isAdmin, name) {
	const XHR = new XMLHttpRequest();
	XHR.open('GET', '/map/permit/authenticUser', true);
	XHR.responseType = 'json';
	XHR.send();

	XHR.onload = function() {
		if (XHR.status === 200) {
			const userId = this.response;
			if (userId != null) {
				if (isReview) {
					detectReviewRegisteredUser(spotId, userId);
				} else {
					console.log('displayReviewDetailTab');
					displayReviewDetailTab(spotId, userId, isAdmin, name);
				}

			} else {
				console.log("USER:NONE")
			}

		}
	}
}

function detectReviewRegisteredUser(spotId, userId) {
	const reviewUserData = { spotId: spotId, userId: userId };

	console.log(reviewUserData);
	const XHR = new XMLHttpRequest();
	XHR.open('POST', '/map/permit/review/detect', true);
	XHR.setRequestHeader('Content-Type', 'application/json');
	XHR.responseType = 'json';
	XHR.send(JSON.stringify(reviewUserData));

	XHR.onload = function() {
		if (XHR.status === 200) {
			const review = this.response;
			const panelReviewShowUserDiv = document.getElementById('panel-review-show-user');
			const userReviewDiv = document.createElement('div');
			let id = review['id'];
			let evalues = review['evalues'];
			let contents = review['contents'];
			let name = document.getElementById('review-header-text').innerText;

			console.log(review);

			while (panelReviewShowUserDiv.firstChild) {
				panelReviewShowUserDiv.removeChild(panelReviewShowUserDiv.firstChild);
			}


			if (evalues != null) {


				var star = translateStars(evalues);

				userReviewDiv.innerHTML = "<div class='m-2'>"

					+ "<div >"
					+ "<div style='position:relative'>"
					+ "<p class='text-center'>あなたのレビュー</p>"
					+ "<a href='javascript:void(0);' style='position:absolute;top:0;right:0;' class='text-danger' id='review-deleter'>消去</a>"
					+ "</div>"
					+ "<div class='mb-2'>"
					+ "<p class='text-warning mb-1'>" + star + "</p>"
					+ "<p  class=' m-0'>" + contents + "</p>"
					+ "</div>"
					+ "<div class='outer-btn-boarderless outer-width'>"
					+ "<button type='button' id='trigger-review-register-dialog' class='w-100 btn-boarderless'>レビュー編集</button>"
					+ "</div>"

					+ "</div>"
					+ "</div>"
					+ "<hr class='mt-2 '>"
				panelReviewShowUserDiv.appendChild(userReviewDiv);
			} else {
				evalues = 0;
				contents = "";
				id = 0;
				userReviewDiv.innerHTML = "<div class='m-2'>"
					+ "<p class='text-center sub-parag'>あなたのレビュー</p>"

					+ "<div class='outer-btn-boarderless outer-width'>"
					+ "<button type='button' id='trigger-review-register-dialog'  class='w-100 btn-boarderless'>レビュー登録</button>"
					+ "</div>"
					+ "</div>"
					+ "<hr class='mt-2 mb-0'>"

				panelReviewShowUserDiv.appendChild(userReviewDiv);
			}

			//ボタンクリック時の処理
			const triggerReviewRegisterDialog = document.getElementById('trigger-review-register-dialog');
			triggerReviewRegisterDialog.addEventListener('click', () => clickReviewResisterSpotListener(evalues, contents, spotId, userId, id, name));

			//消去ボタンクリック時
			if (document.getElementById('review-deleter')) {
				const reviewDeleter = document.getElementById('review-deleter');
				reviewDeleter.addEventListener('click', () => clickReviewDeleter(id, spotId));
			}



		}
	}

}

//レビュー消去の処理
function clickReviewDeleter(reviewId, reviewSpotId) {
	const reviewData = { id: reviewId };
	const XHR = new XMLHttpRequest();
	XHR.open('POST', '/map/permit/review/delete');
	XHR.setRequestHeader('Content-Type', 'application/json');
	XHR.responseType = 'json';
	XHR.send(JSON.stringify(reviewData));

	XHR.onload = function() {
		console.log("clickReviewDeleter");

		if (XHR.status === 200) {

			console.log("clickReviewDeleter>>>");


			createReviewShow(reviewSpotId);
			createReviewShowStatistics(reviewSpotId);
			createReviewShowUser(reviewSpotId, true);
			createMarker(map);

			alert("レビューを消去しました");

		} else {
			alert("レビューを消去できませんでした");
		}

	}

}

//レビュー登録ダイアログの処理
function clickReviewResisterSpotListener(evalues, contents, spotId, userId, id, name) {
	const reviewRegisterDialogForm = document.getElementById('review-register-dialog-form');
	const reviewRegisterDialog = document.getElementById('review-register-dialog');
	const reviewRegisterCancelBtn = document.getElementById('review-register-cancel-confirm-btn');
	const reviewSpotName = document.getElementById('review-spot-name');
	const reviewDialogDismiss = document.getElementById('review-dialog-dismiss');

	//ダイアログフォームのユーザーID、スポットIDの入力
	reviewSpotName.innerText = name;
	reviewRegisterDialogForm.reviewId.value = id;
	reviewRegisterDialogForm.reviewUserId.value = userId;
	reviewRegisterDialogForm.reviewSpotId.value = spotId;
	reviewRegisterDialogForm.reviewEvalues.value = evalues;
	reviewRegisterDialogForm.reviewContents.value = contents;


	//レビュー登録ダイアログ表示
	reviewRegisterDialog.showModal();

	//レビュー登録ダイアログフォームのキャンセル
	reviewRegisterCancelBtn.addEventListener("click", function() {

		reviewRegisterDialog.close();

	});

	reviewDialogDismiss.addEventListener("click", function() {

		reviewRegisterDialog.close();

	});

	//レビュー登録ダイアログフォームの確定

	reviewRegisterDialogForm.addEventListener("submit", submitReviewRegisterDialogForm, { once: true });

}

//reviewの提出
function submitReviewRegisterDialogForm(event) {

	event.preventDefault();
	//	document.getElementById('review-register-confirm-btn').disabled=true;
	console.log("ResisterReviewApi");
	const form = document.forms['reviewRegisterDialogForm'];
	const formData = new FormData(form);
	const jsonData = {};

	formData.forEach((value, key) => {
		jsonData[key] = value;
	});


	const XHR = new XMLHttpRequest();
	XHR.open('POST', '/map/permit/review/register');
	XHR.setRequestHeader('Content-Type', 'application/json');
	XHR.responseType = 'json';
	XHR.send(JSON.stringify(jsonData));

	XHR.onload = function() {
		console.log("ResisterReviewApi>>>");
		const reviewSpotId = this.response;
		if (XHR.status === 200) {

			console.log("ResisterReviewApi>>>");
			form.reset();
			form.submit();


			createReviewShow(reviewSpotId);
			createReviewShowStatistics(reviewSpotId);
			createReviewShowUser(reviewSpotId, true);
			createMarker(map);

			alert("レビューを登録しました");

		} else {
			alert("レビューを登録できませんでした");
		}

	}

}

//詳細レビュー一覧の描画
function createReviewShow(spotId) {
	console.log('createReviewShow実行.spotId=' + spotId);
	const XHR = new XMLHttpRequest();
	XHR.open('GET', `/map/general/review/show?spotId=${encodeURIComponent(spotId)}`, true);
	XHR.responseType = 'json';
	XHR.send();

	XHR.onload = function() {
		if (XHR.status === 200) {
			const reviewDataList = this.response;
			const panelReviewShow = document.getElementById('panel-review-show');

			while (panelReviewShow.firstChild) {
				panelReviewShow.removeChild(panelReviewShow.firstChild);
			}

			if (reviewDataList != null) {
				for (let i = 0; i < reviewDataList.length; i++) {
					const reviewShowCard = document.createElement('div');

					var userName = reviewDataList[i]['user_name'];
					var evalue = reviewDataList[i]['evalues'];
					var contents = reviewDataList[i]['contents'];

					var star = translateStars(evalue);

					reviewShowCard.innerHTML = "<div class='m-2'>"
						+ "<div>" + userName + "</div>"
						+ "<div class='pb-3 pt-3'>"
						+ "<div class='text-warning'>" + star + "</div>"
						+ "<div class='text-break'>" + contents + "</div>"
						+ "</div>"
						+ "</div><hr class='my-0 '>"

					panelReviewShow.appendChild(reviewShowCard);
				}

			} else {
				const reviewShowCard = document.createElement('div');
				reviewShowCard.classList.add('m-2');
				reviewShowCard.innerHTML = "<div style='padding: 40px;text-align: center; vertical-align: top;' ><div class='text-center'>まだレビューがありません</div></div>";
				panelReviewShow.appendChild(reviewShowCard);

			}
		}
		else {
			alert("reviewShowError");
		}

	}
}

//レビューチャートの描画
function createReviewShowStatistics(spotId) {
	const XHR = new XMLHttpRequest();
	XHR.open('GET', `/map/general/review/statics?spotId=${encodeURIComponent(spotId)}`, true);
	XHR.responseType = 'json';
	XHR.send();

	XHR.onload = function() {
		if (XHR.status === 200) {
			const staticsData = this.response;
			console.log("staticsData:" + staticsData);

			const panelReviewShowStatics = document.getElementById('panel-review-show-statics');

			while (panelReviewShowStatics.firstChild) {
				panelReviewShowStatics.removeChild(panelReviewShowStatics.firstChild);
			}

			if (staticsData != null) {

				const reviewAll = staticsData['all'];
				const reviewNone = staticsData['none'];
				const reviewSingle = staticsData['single'];
				const reviewDouble = staticsData['double'];
				const reviewTriple = staticsData['triple'];
				const reviewFourth = staticsData['fourth'];
				const reviewFifth = staticsData['fifth'];

				var reviewAve
				if (staticsData['ave'] != null) {
					reviewAve = staticsData['ave'].toFixed(1);
				} else {
					reviewAve = "";
				}

				const panelReviewShowStaticsDiv = document.createElement('div');
				panelReviewShowStaticsDiv.innerHTML = "<div>"
					+ "<div class=' m-2 review-statics-container' >"

					+ "<div class='review-statics'>"
					+ "<div class='review-statics-header'>"
					+ "<div style='font-size: 3.5rem;font-weight: 400;'>" + reviewAve + "</div>"
					+ "<div >" + reviewAll + "件のレビュー</div>"
					+ "</div>"
					+ "</div>"
					+ "<div class='chart-statics'>"
					+ "<canvas id='chartStatics' ></canvas>"
					+ "</div>"

					+ "</div>"

					+ "</div>"
					+ "<hr class='my-0 '>";

				panelReviewShowStatics.appendChild(panelReviewShowStaticsDiv);

				var ctx = document.getElementById("chartStatics");//グラフを描画したい場所のid
				displayChartStatics(ctx, reviewNone, reviewSingle, reviewDouble, reviewTriple, reviewFourth, reviewFifth, reviewAll);
			} else {
				const panelReviewShowStaticsDiv = document.createElement('div');
				panelReviewShowStaticsDiv.innerHTML = "<div m-4>"
					+ "<div style='padding: 40px;text-align: center; vertical-align: top;'>"
					+ "<div style='font-size: 1.5rem;font-weight: bold;'>レビューなし</div>"
					+ "</div>"

					+ "</div>"
					+ "<hr class='my-0 '>";

				panelReviewShowStatics.appendChild(panelReviewShowStaticsDiv);
			}


		} else {
			alert("reviewStaticsError");
		}

	}
}

//チャートコンフィグ
function displayChartStatics(ctx, reviewNone, reviewSingle, reviewDouble, reviewTriple, reviewFourth, reviewFifth, reviewAll) {



	// 線グラフの設定
	let barConfig = {
		type: 'bar',
		data: {

			labels: ['0', '1', '2', '3', '4', '5'],
			datasets: [{
				data: [reviewNone, reviewSingle, reviewDouble, reviewTriple, reviewFourth, reviewFifth],

				backgroundColor: [  // それぞれの棒の色を設定(dataの数だけ)
					'#ffc107',
					'#ffc107',
					'#ffc107',
					'#ffc107',
					'#ffc107',
					'#ffc107',]
			}]
		},
		options: {
			responsive: true,
			indexAxis: 'y',

			scales: {
				x: {
					border: { display: false },
					min: 0,
					max: reviewAll,
					grid: {
						display: false,
						drawBorder: false
					},

					ticks: {
						display: false,
					}

				},
				yAxes: {
					beginAtZero: true,
					barPercentage: 0.3,

					grid: {
						display: false,
						drawBorder: false,
					},

					ticks: {

						color: '#8c8b8b',
						stepSize: 1, // 1ずつ増えるように設定
						max: 5, // 最大値の設定
						callback: function(value) { return value; }
					},

				},
			},
			plugins: {
				legend: { display: false }
			}
		}
	};

	let barChart = new Chart(ctx, barConfig);

};

//ユーザー確認API
function authenticUser() {
	return new Promise(function(resolve, reject) {
		const XHR = new XMLHttpRequest();
		XHR.open('GET', '/map/permit/authenticUser');
		XHR.responseType = 'json';
		XHR.send();

		XHR.onload = function() {
			if (XHR.status === 200) {
				const userId = this.response;
				console.log(userId); // 正しくユーザーIDを出力
				resolve(userId); // 成功時にユーザーIDを返す
			} else {
				reject("User authentication failed");
			}
		};

		XHR.onerror = function() {
			reject("Network error");
		};
	});
}

//スポット登録ボタン作成機能
function createUserResisterSpot(map, registerArleadyBtn) {
	console.log("createUserResisterSpot");
	const XHR = new XMLHttpRequest();
	XHR.open('GET', '/map/permit/authenticUser');
	XHR.responseType = 'json';
	XHR.send();

	XHR.onload = function() {
		if (XHR.status === 200) {

			const userId = this.response;
			console.log("createUserResisterSpot:userId:" + userId);
			if (userId != null) {

				//	登録モードキャンセルボタン表示
				registerArleadyBtn.classList.add('d-none');
				const registerCancelBtn = document.getElementById("register-cancel-btn");
				registerCancelBtn.classList.remove('d-none');



				//マップ制御
				getCurrentpos(map);
				map.setZoom(14);

				// AdvancedMarkerElement を使用してマーカーを作成
				var selectedmarker = new google.maps.marker.AdvancedMarkerElement({
					map: map,
					position: null,
					content: pinImg['notAllowed'].cloneNode(true),
				});

				// 地図のクリックイベントを登録
				google.maps.event.addListener(map, 'click', event => clickResisterSpotListener2(event, selectedmarker, map, userId));



				//登録モードキャンセルボタンクリックイベント

				registerCancelBtn.addEventListener('click', function() {
					const registerArleadyBtn = document.getElementById("register-arleady-btn");
					registerArleadyBtn.classList.remove('d-none');
					this.classList.add('d-none');
					document.getElementById('registering-now').style.display = "none";
					spotRegisteredOnmapPos = null;
					judgeDisplaySpotRegisterContainer(false, false);
					switchDisplayImage(false, true, true);
					const form = document.forms['registerDialogForm'];
					form.reset();



					//ピンの制御
					google.maps.event.clearListeners(map, 'click');
					selectedmarker.setMap(null);
				});
			}

		} else {
			console.log("general-view-situation");
		}

	}

};

//スポット登録タブのDISPLAYH判定
function judgeDisplaySpotRegisterContainer(openNewReviewDetail, closeNewReviewDetail) {
	if (spotRegisteredOnmapPos != null) {
		if (openNewReviewDetail) {
			matchMediaQuerySpotRegisterContainer('none');
			//			document.getElementById('register-spot-container').style.display='none';
		} else {
			matchMediaQuerySpotRegisterContainer('block');
			//			document.getElementById('register-spot-container').style.display='block';
			reviewDetailDelete();

			if (closeNewReviewDetail) {
				centeredPin(spotRegisteredOnmapPos["lat"], spotRegisteredOnmapPos["lng"]);

			}

		}

	} else {
		matchMediaQuerySpotRegisterContainer('none');

		//		document.getElementById('register-spot-container').style.display='none';
	}
}



//ピンをセンターへ
function centeredPin(lat, lng, zoomOn, zoomLevel) {
	const pos = { lat: lat, lng: lng };
	map.setCenter(pos);
	if (zoomOn) {
		map.setZoom(zoomLevel);
	}
}

function clickResisterSpotListener2(event, marker, map, userId) {



	const registerDialogForm = document.getElementById('register-dialog-form');
	const registerDialog = document.getElementById('register-dialog');
	const registerCancelBtn = document.getElementById('register-cancel-confirm-btn');
	//	const registerConfirmBtn=document.getElementById('register-spot-confirm-btn');


	const latPos = event.latLng.lat();
	const lngPos = event.latLng.lng();

	spotRegisteredOnmapPos = { lat: latPos, lng: lngPos };
	judgeDisplaySpotRegisterContainer(false, false);
	//	centeredPin(latPos,lngPos,false);

	//ダイアログフォームのユーザーID、緯度経度の入力
	registerDialogForm.spotUserId.value = userId;
	registerDialogForm.spotLatPos.value = latPos;
	registerDialogForm.spotLngPos.value = lngPos;

	//スポットポジションの変更
	marker.position = new google.maps.LatLng({ lat: latPos, lng: lngPos });

	//スポット登録ダイアログフォームのキャンセル
	registerCancelBtn.addEventListener("click", function() {
		marker.position = null;
		spotRegisteredOnmapPos = null;
		judgeDisplaySpotRegisterContainer(false, false);

		switchDisplayImage(false, true, true);



	});

	addConfirmListener();
	//スポット登録ダイアログフォームの確定
	addConfirmListener();


	//スポット登録ダイアログフォームのバツボタン
	document.getElementById('spot-register-dialog-dismiss').addEventListener('click', function() {


		marker.position = null;
		spotRegisteredOnmapPos = null;
		judgeDisplaySpotRegisterContainer(false, false);



	});

}

function addConfirmListener() {
	const registerConfirmBtn = document.getElementById('register-spot-confirm-btn');

	// 以前のイベントリスナーを解除する（もし存在していれば）
	registerConfirmBtn.removeEventListener("click", submitRegisterDialogForm);

	// 新しいイベントリスナーを追加
	registerConfirmBtn.addEventListener("click", submitRegisterDialogForm);
}




//スポット登録ダイアログフォームの確定時の処理
function submitRegisterDialogForm() {



	console.log("resisterSpotApi");
	const spotIsPriceAmountDiv = document.getElementById('spot-is-price-amount-div');
	const spotIsPriceAmountInput = document.getElementById('spot-is-price-amount-input');
	const registerConfirmBtn = document.getElementById('register-spot-confirm-btn');
	const form = document.forms['registerDialogForm'];
	const formData = new FormData(form);

	registerConfirmBtn.disabled = true;

	const XHR = new XMLHttpRequest();
	XHR.open('POST', '/map/permit/spot/register', true);
	XHR.responseType = 'json';
	XHR.send(formData);

	XHR.onload = function() {
		if (XHR.status === 200) {
			const resultValidate = this.response;
			switchDisplayImage(true, false, true);

			if (resultValidate == null) {
				form.reset();
				registerConfirmBtn.disabled = false;
				spotRegisteredOnmapPos = null;
				judgeDisplaySpotRegisterContainer(false, false);
				switchDisplayImage(false, true, true);

				alert("スポット情報の登録を申請しました");
				if (document.getElementById('errorImage')) { document.getElementById('errorImage').innerText = '' };



			} else {
				console.log("resister-spot-validated:", this.response);
				console.log("XHR status:", XHR.status);
				switchDisplayImage(false, true, false);

				for (let key in resultValidate) {
					document.getElementById(key).innerText = resultValidate[key];

				}
				registerConfirmBtn.disabled = false;
			}


		} else {
			alert("スポット情報の登録の申請ができませんでした");
		}
	}

}






//  カテゴリーの特定
function identifyCategory(spotId) {
	return new Promise(function(resolve, reject) {
		const XHR = new XMLHttpRequest();
		XHR.open('GET', `/map/general/identify/category?spotId=${encodeURIComponent(spotId)}`, true);
		XHR.responseType = 'json';


		XHR.onload = function() {
			if (XHR.status === 200) {
				resolve(this.response);
			} else {
				resolve(null);
			}


		}

		XHR.onerror = function() {
			reject("Network error");
		};

		XHR.send();
	});
}




//  カテゴリーボタンの挙動とcategoryIdの代入
function categorySelect(button) {

	if (categoryId === null) {
		categoryId = button.value;
		console.log(categoryId);
		button.classList.toggle('selected');
	}
	else if (categoryId === button.value) {

		categoryId = null;
		button.classList.toggle('selected');
		console.log(categoryId);


	} else {
		document.querySelectorAll('.category-btn').forEach(button => {
			if (button.value == categoryId) {
				button.classList.toggle('selected');
			}
		});

		categoryId = button.value;
		console.log(categoryId);
		button.classList.toggle('selected');
	}
};


//イメージ登録の確認画面
const imageInput = document.getElementById('imageFile');


imageInput.addEventListener('change', () => {


	if (imageInput.files[0]) {
		let fileReader = new FileReader();
		fileReader.onload = () => {
			if (fileReader.result != null) {
				switchDisplayImage(true, false, false)
					;
			}
			const imagePreview = document.getElementById('imagePreview');
			imagePreview.innerHTML = `<img src="${fileReader.result}"  style="max-width:100%;height:100%; object-fit:cover" >`
				+ "<div style='position:absolute; right:0;top:0;z-index-100'><button onclick='cancelImage();' type='button'id='register-image-dismiss-btn' class='p-0 btn-icon' style='width:30px;height:30px'><img class='m-1' src='./image/cancel-btn(178,178,178).svg' alt='キャンセル'></button></div>";
		}


		fileReader.readAsDataURL(imageInput.files[0]);
	}
	else {
		imagePreview.innerHTML = '';

	}



});


function changeImage(imageInput) {
	if (imageInput.files[0]) {
		let fileReader = new FileReader();
		fileReader.onload = () => {
			if (fileReader.result != null) {
				switchDisplayImage(true, false, false)
					;
			}
			const imagePreview = document.getElementById('imagePreview');
			imagePreview.innerHTML = `<img src="${fileReader.result}"  style="max-width:100%;height:100%; object-fit:cover" >`
				+ "<div style='position:absolute; right:0;top:0;z-index-100'><button onclick='cancelImage();' type='button'id='register-image-dismiss-btn' class='p-0 btn-icon' style='width:30px;height:30px'><img class='m-1' src='./image/cancel-btn(178,178,178).svg' alt='キャンセル'></button></div>";
		}


		fileReader.readAsDataURL(imageInput.files[0]);
	}
	else {
		imagePreview.innerHTML = '';

	}
}

//画像登録フィールドの切り替え
function switchDisplayImage(open, imageFileDelete, validateFlash) {
	const imagePreview = document.getElementById('imagePreview');
	const noneImageLabel = document.getElementById('none-image-label');
	if (open) {
		noneImageLabel.style.display = 'none';
		imagePreview.style.display = 'flex';
	} else {

		noneImageLabel.style.display = 'flex';
		imagePreview.style.display = 'none';
		while (imagePreview.firstChild) {
			imagePreview.removeChild(imagePreview.firstChild);
		}
	}

	if (imageFileDelete) {
		document.getElementById('imageFile').value = '';

	}

	if (validateFlash) {
		document.getElementById('errorName').innerHTML = '';
		document.getElementById('errorDescription').innerHTML = '';
		document.getElementById('errorSpotIsPrice').innerHTML = '';
		document.getElementById('errorSpotPriceAmount').innerHTML = '';

	}
}



//星への変換			
function translateStars(evalues) {
	var star;
	if (evalues != null) {
		switch (evalues) {
			case 0: star = "&#9734;&#9734;&#9734;&#9734;&#9734;"
				break;
			case 1: star = "&#9733;&#9734;&#9734;&#9734;&#9734;"
				break;
			case 2: star = "&#9733;&#9733;&#9734;&#9734;&#9734;"
				break;
			case 3: star = "&#9733;&#9733;&#9733;&#9734;&#9734;"
				break;
			case 4: star = "&#9733;&#9733;&#9733;&#9733;&#9734;"
				break;
			case 5: star = "&#9733;&#9733;&#9733;&#9733;&#9733;"
				break;
		}

	} else {

		star = "まだ評価がありません";
	}

	return star;

}

//テキストのアニメーション
function checkOverflow(spotId, element) {
	const textElement = document.getElementById(element);
	const parentElement = textElement.parentElement;

	// テキストがコンテナを超えているかをチェック
	if (textElement.scrollWidth > parentElement.clientWidth) {
		textElement.classList.add('text-display-anim');
	} else {
		textElement.classList.remove('text-display-anim');
	}
}

//admin

//通報一覧
function cretaeReviewShowAdmin(spotId) {

	if (!document.getElementById('panel-review-show-admin')) {
		return;
	}
	const panelShowAdminDiv = document.getElementById('panel-review-show-admin');

	while (panelShowAdminDiv.firstChild) {
		panelShowAdminDiv.removeChild(panelShowAdminDiv.firstChild);
	}


	const XHR = new XMLHttpRequest();
	XHR.open('GET', `/admin/map/report?spotId=${encodeURIComponent(spotId)}`, true);

	XHR.responseType = 'json';
	XHR.send();

	XHR.onload = function() {
		if (XHR.status === 200) {
			const report = this.response;

			if (report.length) {
				const userReportDivHeader = document.createElement('div');
				userReportDivHeader.innerHTML = "<div class='m-2'>" +
					"<p class='text-center mb-2'>通報一覧</p>" +
					"<div class='outer-btn-boarderless'><button type='button' class='w-100 btn-boarderless' id='spot-deleter' data-spot=" + spotId + ">スポット削除</button>" +

					"</div>"

				panelShowAdminDiv.appendChild(userReportDivHeader);
				deleteSpot(spotId);
			}


			for (let i = 0; i < report.length; i++) {
				let userId = report[i]['userId'];
				let userName = report[i]['userName'];
				let contents = report[i]['contents'];


				const userReportDiv = document.createElement('div');
				userReportDiv.style = "margin:0.75rem;border:1px solid #f5f5f5";
				userReportDiv.innerHTML = "<div class='m-1'>"
					+ "<div>" + userId + "<span class='mx-2'>" + userName + "</span></div>"
					+ "<div class='pb-2 pt-2'>"

					+ "<div class='text-break'>" + contents + "</div>"
					+ "</div>"
					+ "</div>"
				panelShowAdminDiv.appendChild(userReportDiv);
				if (i == report.length - 1) {
					const hr = document.createElement('hr');
					hr.classList.add("my-3");
					panelShowAdminDiv.appendChild(hr);

				}

			}


		}
	}

}

//スポットデリート
function deleteSpot(spotId){
	document.getElementById("spot-deleter").addEventListener('click',function(){
		console.log("spot-delete:spotId:"+spotId);
		
		const XHR = new XMLHttpRequest();
		XHR.open('GET', `/admin/map/spot/delete?spotId=${encodeURIComponent(spotId)}`, true);
	
		XHR.responseType = 'json';
		XHR.send();
	
		XHR.onload = function() {
			if (XHR.status === 200) {
				alert("スポットを削除しました");
				judgeDisplaySpotRegisterContainer(false, true);
				reviewDetailDelete();
				createMarker(map);
			}
		}	
		
	});
}


//スポット承認ボタン
if (document.getElementById("approve-arleady-btn")) {
	const approveArleadyBtn = document.getElementById("approve-arleady-btn");
	approveArleadyBtn.addEventListener('click', function() {
		document.getElementById('approving-now').style.display = "block";
		//	承認モードキャンセルボタン表示
		approveArleadyBtn.classList.add('d-none');
		const approveCancelBtn = document.getElementById("approve-cancel-btn");
		approveCancelBtn.classList.remove('d-none');

		const sortBtn = document.getElementById('sort-btn');
		const favSortBtn = document.getElementById('fav-sort-btn');
		const mySpotSortBtn = document.getElementById('myspot-sort-btn');
		const reportBoxSortBtn = document.getElementById('report-sort-btn');
		
			
		reportBoxSortBtn.style.visibility='hidden';
		sortBtn.style.visibility = 'hidden';
		favSortBtn.style.visibility = 'hidden';
		mySpotSortBtn.style.visibility = 'hidden';

		authenticAdminBtn = true;
		createMarker(map);

	});
}

//スポット承認キャンセルボタン
if (document.getElementById("approve-cancel-btn")) {
	const approveCancelBtn = document.getElementById("approve-cancel-btn");

	approveCancelBtn.addEventListener('click', function() {
		document.getElementById('approving-now').style.display = "none";

		const sortBtn = document.getElementById('sort-btn');
		const favSortBtn = document.getElementById('fav-sort-btn');
		const mySpotSortBtn = document.getElementById('myspot-sort-btn');
		const reportBoxSortBtn = document.getElementById('report-sort-btn');
		
		reportBoxSortBtn.style.visibility='visible';
		sortBtn.style.visibility = 'visible';
		favSortBtn.style.visibility = 'visible';
		mySpotSortBtn.style.visibility = 'visible';


		approveCancelBtn.classList.add('d-none');
		const approveArleadyBtn = document.getElementById("approve-arleady-btn");
		approveArleadyBtn.classList.remove('d-none');
		authenticAdminBtn = false;
		createMarker(map);
		reviewDetailDelete();
		createMarker(map);

	});
}


function createNotAllowedMarkerList() {
	const XHR = new XMLHttpRequest();
	XHR.open('GET', '/admin/map/marker/list', true);

	XHR.responseType = 'json';
	XHR.send();

	XHR.onload = function() {
		if (XHR.status === 200) {
			markerDataList = this.response;
			registerMarker(markerDataList, createImageElement("/image/pin-not-allowed.png").cloneNode(true));
			createReview(markerDataList);
		};

	}

};

//スポット承認API
function approveNotAllowedSpot(spotId) {
	const XHR = new XMLHttpRequest();

	XHR.open('GET', `/admin/map/approve/spot/notallowed?spotId=${encodeURIComponent(spotId)}`, true);
	XHR.responseType = 'json';
	XHR.send();

	XHR.onload = function() {
		if (XHR.status === 200) {
			alert("スポットを承認しました");
			reviewDetailDelete();
			createMarker(map);


		} else {
			alert("spot-approve-error");
		}
	}

}


//spot申請拒否フォームの送信
function submitSpotApproveRejectDialogForm(event) {

	event.preventDefault();

	document.getElementById('not-allowed-spot-rejected-confirm-btn').disabled = true;
	console.log("ResisterReviewApi");
	const form = document.forms['notAllowedSpotRejectedForm'];
	const formData = new FormData(form);
	const jsonData = {};

	formData.forEach((value, key) => {
		jsonData[key] = value;
	});


	const XHR = new XMLHttpRequest();
	XHR.open('POST', '/admin/map/reject/spot/notallowed');
	XHR.setRequestHeader('Content-Type', 'application/json');
	XHR.responseType = 'json';
	XHR.send(JSON.stringify(jsonData));

	XHR.onload = function() {


		if (XHR.status === 200) {
			form.reset();
			form.submit();

			reviewDetailDelete();
			createMarker(map);


			alert("スポット申請を拒否しました");

		} else {
			alert("スポット申請を拒否を正常に行えませんでした");
		}

		document.getElementById('not-allowed-spot-rejected-confirm-btn').disabled = false;

	}

}


//スマホ用

let boolReviewer = false;


let startY;
let startX;

const swipeReviewList = document.getElementById('swipe-right-container');

const swipeUpImg = document.getElementById('swipe-up-img');
const swipeDownImg = document.getElementById('swipe-down-img');



mediaQuery.addEventListener('change', handleResize);


//メディアクエリが既定幅以内である場合
if (mediaQuery.matches) {

	document.getElementById('register-spot-container').remove();

	//	Yスワイプ
	swipeReviewList.addEventListener('touchstart', handleTouchStart);
	swipeReviewList.addEventListener('touchend', handleTouchEnd);
	handleClick();
	
	document.querySelectorAll(".swipe-y").forEach((element) => {
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);
});
	//   Xスワイプ
	const panel = document.getElementById('panelGroup');
	panel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
	panel.addEventListener('touchend', hundlerSwipeX);

} else {
	document.getElementById('register-spot-container-min').remove();
}

//画面リサイズ用
function handleResize(event) {
	// 800px以下から800px以上、またはその逆になった場合のみリロード
	if (event.matches !== previousState) {
		location.reload();
	}

	previousState = event.matches;
}






//Yスワイプハンドラー
function handleTouchStart(e) {
	startY = e.touches[0].clientY;
};


function handleTouchEnd(e) {
	const endY = e.changedTouches[0].clientY;
	console.log("swiping");
	// スワイプ距離が一定以上であればメニューを開く
	if ((startY - endY > 100) && (boolReviewer == false)) {
		swipeAndDelayBool(rightContainer, true, boolReviewer, "full");
		console.log("swipe-up");
	} else if ((startY - endY > 50) && (boolReviewer == false)) {
		swipeAndDelayBool(rightContainer, true, boolReviewer, 'medium');
		console.log("swipe-up");
	}
	else if ((endY - startY) > (100 && boolReviewer == true)) {
		swipeAndDelayBool(rightContainer, false, boolReviewer);
		console.log("swipe-down");
	}
};

//  Xスワイプハンドラー
function hundlerSwipeX(e) {
	let endX = e.changedTouches[0].clientX;

	const tabs = document.getElementsByClassName("review-detail-tab");
	console.log(tabs[0].getAttribute("aria-selected"));

	if (tabs[0].getAttribute("aria-selected") == 'true' && tabs[1].getAttribute("aria-selected") == 'false') {

		if (startX - endX > 100) {
			document.querySelector(".review-detail-tab[aria-selected='true']").setAttribute("aria-selected", "false");
			tabs[1].setAttribute("aria-selected", "true");
			document.querySelector(".panel[aria-hidden='false']").setAttribute("aria-hidden", "true");
			document.getElementsByClassName('panel')[1].setAttribute('aria-hidden', 'false');
		}

	} else if (tabs[1].getAttribute("aria-selected") == 'true' && tabs[0].getAttribute("aria-selected") == 'false') {
		if (endX - startX > 100) {
			document.querySelector(".review-detail-tab[aria-selected='true']").setAttribute("aria-selected", "false");
			tabs[0].setAttribute("aria-selected", "true");
			document.querySelector(".panel[aria-hidden='false']").setAttribute("aria-hidden", "true");
			document.getElementsByClassName('panel')[0].setAttribute('aria-hidden', 'false');


		}
	}
}



function handleClick() {
	if (boolReviewer === false) {
		swipeAndDelayBool(rightContainer, true, boolReviewer, "full");
	} else if (boolReviewer === true) {
		swipeAndDelayBool(rightContainer, false, boolReviewer);
	}
}



function swipeAndDelayBool(swipedElem, bool, status, power) {
	swipeReviewList.removeEventListener('click', handleClick);
	const topImg = document.getElementById('review-detail-image');
	new Promise((resolve) => {
		if (status == true) {

			swipedElem.style.height = '90px';
			swipeUpImg.style = "display:block"
			swipeDownImg.style = "display:none"

		} else {
			if (power == "full") {
				swipedElem.style.height = '70vh';
				swipeUpImg.style = "display:none"
				swipeDownImg.style = "display:block"
				topImg.style = "height:40vh";
			} else if (power == "medium") {
				swipedElem.style.height = '40vh';
				swipeUpImg.style = "display:none"
				swipeDownImg.style = "display:block"
				topImg.style = "height:20vh";
			}
		}

		setTimeout(function() { resolve(); }, 1000);
	}).then(() => {


		boolReviewer = bool;
		swipeReviewList.addEventListener('click', handleClick);
	});
}

function selectReviewConteiner() {
	if (mediaQuery.matches) {
		return reviewDetailContainerMin;
	} else {
		return reviewDetailContainer;
	}


}

function resetReviewConteiner() {
	if (mediaQuery.matches) {
		reviewDetailContainer.remove();
	} else {
		reviewDetailContainerMin.remove();
	}


}

function selectSpotRegisterContainer() {
	if (mediaQuery.matches) {
		return registerSpotContainerMin;
	} else {
		return registerSpotContainer;
	}
}

//  スポット登録時のELEMの選定
function matchMediaQuerySpotRegisterContainer(str) {
	if (mediaQuery.matches) {
		document.getElementById('register-spot-container-min').style.display = str;

	} else {
		document.getElementById('register-spot-container').style.display = str;
	}
}