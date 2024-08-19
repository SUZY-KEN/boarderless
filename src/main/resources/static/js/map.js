const { AdvancedMarkerElement, PinElement} = await google.maps.importLibrary("marker");
const  {Map}  = await google.maps.importLibrary("maps");

let map;
let mapId="450e2771037cc321";
let infoWindow;
//現在あるマーカーインスタンスの格納
var marker=[];
//スポット情報の格納
var markerData = [];
var categoryId=null;


initMap();




//マップ生成
async function initMap() {
   
   
    
//    マップ描画
    map = new Map(document.getElementById("map"), {
        center: { lat: 36.87061649739068, lng: 137.0625514544945},
        zoom: 10,  
        mapId:mapId,    
  });
  
   const infoWindow = new google.maps.InfoWindow();
  
  
//	現在位置取得
  getCurrentpos(map);


	
//	現在位置ボタン
  const locationButton = document.createElement("button");

  locationButton.textContent = "位置情報の取得";
  locationButton.classList.add("custom-map-control-button-current");
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(locationButton);
//	現在位置取得イベント
  locationButton.addEventListener("click", () => {
   		getCurrentpos(map);
	});

//マーカー生成イベント
   google.maps.event.addListener(map, "idle", () => {
    
      createMarker(map);
    });


//	review
 
  


//  カテゴリー選択

document.querySelectorAll('.category-btn').forEach(button => {

    button.addEventListener('click', () => {
		categorySelect(button); 
		createMarker(map);
    });
});

};




//	現在位置取得機能
 function getCurrentpos(map){
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
  );};
  
  
  
//  スポット情報表示機能
function createMarker(map){
	
	deletemarker();

	const XHR=new XMLHttpRequest();
	XHR.open('POST', '/map/list/marker', true);
	XHR.setRequestHeader('Content-Type', 'application/json'); 
	XHR.responseType = 'json';
	XHR.send(JSON.stringify(getMarkerConfig(map)));
	
	XHR.onload=function(){ 
		if (XHR.status === 200) {  
			console.log('HTTPresponse:'+this.response); 
			
			markerData=this.response;
			registerMarker(markerData);
			createReview(markerData);

        
	   	 } else {  // statusが200以外の場合はリクエストが適切でなかったとしてエラー表示
	          alert("error");
		}
	}
	
  };
  
  //マーカーの表示機能
  function registerMarker(markerData)
  {
	
			for(var i=0;i<markerData.length;i++)
			{

				marker[i]=new google.maps.marker.AdvancedMarkerElement({
						position:new google.maps.LatLng({lat: markerData[i]['lat'], lng: markerData[i]['lng']}),
						map,
						  
					});
					
					
				marker[i].addListener("click",()=>{
					 infoWindow.close();
					 infoWindow.open(marker.getMap(), marker);
					
					
					
				});
				console.log("marker:"+marker);	
			}
  }
  
  
//  マーカー削除機能
  function deletemarker()
  {
	if(markerData!=null)
	{
		for(var i=0;i<markerData.length;i++)
			{
				console.log('setMap(null):'+markerData[i]); 
				
				marker[i].setMap(null);
						  
			};
	};
  };
  
  //レビューの表示機能
  function createReview(markerData)
  {
		const reviewContainer=document.getElementById("review-container");
		
		while(reviewContainer.firstChild)
		{
			reviewContainer.removeChild(reviewContainer.firstChild);
		}
	
	
	
		if(markerData.length!==0)
		{
			
			for(var i=0;i<markerData.length;i++)
			{
				var spotName=markerData[i]['name'];
				var spotDescription=markerData[i]['description'];
				const reviewCard=document.createElement('div');
				reviewCard.classList.add("review-card");
				reviewCard.innerHTML="<div class='m-2 review-card-contents'><div>"+
										spotName+"</div><div>"+
										spotDescription+"</div></div><hr class='my-0 '>";
				reviewContainer.appendChild(reviewCard);
				
			}
		}
		else
		{
			const reviewCard=document.createElement('div');
			reviewCard.classList.add("review-none" );
			reviewCard.innerHTML="スポットがありません";
			reviewContainer.appendChild(reviewCard);
		}
  }
  
  
  
//  CRUD用の情報取得
  function getMarkerConfig(map)
  {
	const bounds = map.getBounds();
	const configData=
		{
			minLat :bounds.getSouthWest().lat(),
	  		 minLng :bounds.getSouthWest().lng(),
	  		maxLat :bounds.getNorthEast().lat(),
	  		 maxLng  :bounds.getNorthEast().lng(),
	  		 categoryId :categoryId
		};
	
	return configData;
  };
  
  
  
  
//  カテゴリーボタンの挙動とcategoryIdの代入
 function categorySelect(button)
 {
	 if(categoryId===null)
        {
			categoryId = button.value;
	        console.log(categoryId);
	     	button.classList.toggle('selected');
		}
         else if(categoryId===button.value)
        { 
			
			categoryId = null;
			button.classList.toggle('selected');
			console.log(categoryId);

	        
         }else{
			document.querySelectorAll('.category-btn').forEach(button => {
				if(button.value==categoryId){
				button.classList.toggle('selected');
				}
			});
		
			categoryId = button.value;
	        console.log(categoryId);
	     	button.classList.toggle('selected');
	     	}
 };



  
  
