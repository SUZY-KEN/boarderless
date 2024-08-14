const { AdvancedMarkerElement, PinElement} = await google.maps.importLibrary("marker");

let map;
let mapId="450e2771037cc321";
let infoWindow;
var marker=[];
var markerLatLng=[];


var markerData = spotList;


//マップ生成
async function initMap() {
   const  {Map}  = await google.maps.importLibrary("maps");
   
   
    
//    マップ描画
    map = new Map(document.getElementById("map"), {
        center: { lat: 34.87061649739068, lng: 137.0625514544945},
        zoom: 10,  
        mapId:mapId,    
  });
  
//  マーカー位置情報の取得
	for(var i=0;i<markerData.length;i++)
	{
		console.log( markerData[i]['lat']);
		console.log( markerData[i]['lng']);

		markerLatLng.push(new google.maps.LatLng({lat: markerData[i]['lat'], lng: markerData[i]['lng']}));
//		markerLatLng = new google.maps.LatLng({lat: markerData[i]['lat'], lng: markerData[i]['lng']}); // 緯度経度のデータ作成
	}
	
//マーカーの生成
	for(var i=0;i<markerData.length;i++)
	{
		
		
		marker[i]=new google.maps.marker.AdvancedMarkerElement({
				position:markerLatLng[i],
				map,
				  
			});
			console.log(marker[i]);
//		 markerEvent(i); // マーカーにクリックイベントを追加
	}
  
 
	infoWindow = new google.maps.InfoWindow();
	
	
//	現在位置ボタン
  const locationButton = document.createElement("button");

  locationButton.textContent = "位置情報の取得";
  locationButton.classList.add("custom-map-control-button-current");
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(locationButton);
  
  
  
   //    現在位置の取得
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

//	現在地ピン
	//infoWindow.setPosition(pos);
	//infoWindow.setContent("現在地");
	//infoWindow.open(map);

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
  });
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
  
  
//  地図のセンターからの距離の測定
	google.maps.event.addListener(map,'center_changed',function(){
		
//		ズームの判定に合わせて距離をカエル
		var zoomLevel=map.getZoom();
		console.log(zoomLevel);
		
		var mapCenter=map.getCenter();
		console.log(mapCenter);
		
		
		
		var markerSetRadius=0.1;
		
		for(var i=0;i<markerData.length;i++)
		{
			if(mapCenter.lat()-markerSetRadius<marker[i].getlat()&&mapCenter.lat()+markerSetRadius>marker[i].getlat()
			&&mapCenter.lng()-markerSetRadius<marker[i].getlng()&&mapCenter.lng()+markerSetRadius>marker[i].getlng())
			{
				//ピンの非表示処理
			}


		}
		
		
	});
	
		
//		
		
		
	

}






initMap();