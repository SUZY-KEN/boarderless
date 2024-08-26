const { AdvancedMarkerElement, PinElement} = await google.maps.importLibrary("marker");
const  {Map}  = await google.maps.importLibrary("maps");




let map;
let mapId="450e2771037cc321";
let infoWindow;
//現在あるマーカーインスタンスの格納
var markers=[];

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
	
	resetmarker();

	const XHR=new XMLHttpRequest();
	XHR.open('POST', '/map/marker/list', true);
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
				const pinDefault = new google.maps.marker.PinView({ background: "#FBBC04",});
				
			 const marker=new google.maps.marker.AdvancedMarkerElement({
						position:new google.maps.LatLng({lat: markerData[i]['lat'], lng: markerData[i]['lng']}),
						content:pinDefault.element,
						title:"spotId"+markerData[i]['id'],
						map,	
				
				});
				

		//マーカーのクリックイベント(markerDataをmarkerに描画してる最中にクリックしたらやばいかも)
				marker.addListener("click",function(){
					
					switchPinTexture(this);
					
				});
	
	
				markers.push(marker);
			}
  }
  
//  ピンのテクスチャ変更及びレビュー詳細作成メソッドへ転送
  function switchPinTexture(marker)
  {
	for(var i=0;i<markers.length;i++)
		{
			const pinDefault = new google.maps.marker.PinView({ background: "#FBBC04",});
			markers[i].content=pinDefault.element;
		};	

		if(marker!=null)
		{
			//スポットテクスチャの変更
			const pinSelected = new google.maps.marker.PinView({ background: "#0804fb",});
			marker.content=pinSelected.element;
	
			//レビューのクリックイベント（レビュー詳細へ）
			const spotId=marker.title.substr(6);
			createReviewDetail(spotId);
		}
					
  }
  
  
//  マーカーリセット機能
  function resetmarker()
  {
	if(markers!=null)
	{
		for(var i=0;i<markers.length;i++)
			{
				
				markers[i].setMap(null);
						  
			};
			markers=[];
	};
  };
  
  //右端レビューの表示機能
  function createReview(markerData)
  {
		
		const reviewContainer=document.getElementById("review-container");
		
		while(reviewContainer.firstChild)
		{
			reviewContainer.removeChild(reviewContainer.firstChild);
		}
	
	
	
		if(markerData.length!=0)
		{
			
			for(var i=0;i<markerData.length;i++)
			{
				var spotName=markerData[i]['name'];
				var spotDescription=markerData[i]['description'];
				var spotId=markerData[i]['id'];
				
				var imageFileUrl;
				if(markerData[i]['imagefileId'])
				{
					//imageRepositoryからとってくる
				}else
				{
					imageFileUrl="./image/noImage.png";
				}
				
				var evalues=markerData[i]['evalues'];
				var star;
				if(evalues!=null)
				{
					switch(evalues)
					{
						case 0:star="&#9734;&#9734;&#9734;&#9734;&#9734;"
							break;
						case 1:star="&#9733;&#9734;&#9734;&#9734;&#9734;"
							break;
						case 2:star="&#9733;&#9733;&#9734;&#9734;&#9734;"
							break;
						case 3:star="&#9733;&#9733;&#9733;&#9734;&#9734;"
							break;
						case 4:star="&#9733;&#9733;&#9733;&#9733;&#9734;"
							break;
						case 5:star="&#9733;&#9733;&#9733;&#9733;&#9733;"
							break;
					}
					
				}else{
					
					star="まだ評価がありません";
					
				}
				
				var evaluesDouble=markerData[i]['evaluesDouble'];
				
				var price;
				if(markerData[i]['price']!=null)
				{
					price=markerData[i]['price']+"円";
				}else{
					price="なし";
				}
				
				
				
				//innerHTMLの作成
				const reviewCard=document.createElement('div');
				reviewCard.classList.add("review-card");
				reviewCard.innerHTML="<a href='javascript:void(0)' onclick='' id=reviewId"+spotId+" data-spot-id="+spotId+"><div class='m-2 d-flex justify-content-between review-card-contents'><div><div>"+
										spotName+"</div><div>"+
										star+"<span class='mx-2'>"+evaluesDouble+"</span></div><div>"+
										spotDescription+"</div><div><span>料金</span><span class='mx-2'>"+
										price+"</span></div></div><img src="+imageFileUrl+" alt='スポット画像' class='w-25'></img></div><hr class='my-0 '></a>";
				reviewContainer.appendChild(reviewCard);
				
				
				
				
				//レビューのクリックイベント（レビュー詳細へ）
				
				
				document.getElementById('reviewId'+spotId).addEventListener("click",function(){
					console.log(this);
					const spotId= this.getAttribute('data-spot-id');
					
					for(var i=0;i<markers.length;i++)
					{
						console.log(markers[i]);
						if(markers[i].title.substr(6)==spotId)
						{
							switchPinTexture(markers[i]);
						}
					}
			
				});
				
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
  
//レビュー詳細表示機能
function createReviewDetail(spotId)
{
	const mapContainer=document.getElementById("map-container");
	
		if(document.querySelector(".review-detail-container"))
			{
				console.log("cancelDetails");
				
				document.querySelector(".review-detail-container").remove();
			};
			
			
			const XHR=new XMLHttpRequest();
			XHR.open('GET', `/map/marker/detail?spotId=${encodeURIComponent(spotId)}`, true);
			XHR.responseType = 'json';
			XHR.send();
			
			XHR.onload=function(){ 
				if (XHR.status === 200) {  
					console.log('HTTPresponse:'+this.response); 
		        	const spotDetail=this.response;
		        	
		        	var spotName=spotDetail['name'];
					var spotDescription=spotDetail['description'];
					
					
					var imageFileUrl;
					if(spotDescription['imagefileId'])
					{
						//imageRepositoryからとってくる
					}else
					{
						imageFileUrl="./image/noImage.png";
					}
					
					var evalues=spotDetail['evalues'];
					var star;
					if(evalues!=null)
					{
						switch(evalues)
						{
							case 0:star="&#9734;&#9734;&#9734;&#9734;&#9734;"
								break;
							case 1:star="&#9733;&#9734;&#9734;&#9734;&#9734;"
								break;
							case 2:star="&#9733;&#9733;&#9734;&#9734;&#9734;"
								break;
							case 3:star="&#9733;&#9733;&#9733;&#9734;&#9734;"
								break;
							case 4:star="&#9733;&#9733;&#9733;&#9733;&#9734;"
								break;
							case 5:star="&#9733;&#9733;&#9733;&#9733;&#9733;"
								break;
						}
						
					}else{
						
						star="まだ評価がありません";
						
					}
					
					var evaluesDouble=spotDetail['evaluesDouble'];
					
					var price;
					if(spotDetail['price']!=null)
					{
						price=spotDetail['price']+"円";
					}else{
						price="なし";
					}
      	
			   	 } else {  // statusが200以外の場合はリクエストが適切でなかったとしてエラー表示
			          alert("error");
				}
				
				const reviewDetailCard=document.createElement('div');
				reviewDetailCard.classList.add("review-detail-container" );
				reviewDetailCard.innerHTML="<div class='review-detail-card'>"
											+"<div class='d-flex'><p class='text-center w-100'>"+spotName+"</p><div><button onclick='' class='review-detail-delete-btn'>消去</button></div></div>"		
											+"<div role='tablist' class='review-detail-tab-group'>"
											+"<div class='review-detail-presentation' role='presentation'><button role='tab' aria-controls='panel01' aria-selected='true' class='review-detail-tab'>概要</button></div>"
											+"<div class='review-detail-presentation' role='presentation'><button role='tab' aria-controls='panel02' aria-selected='false' class='review-detail-tab'>レビュー</button></div>"
											+"</div>"
											+"<div class='panel-group'>"
											+"<div class='panel' id='panel-top' role='tabpanel' aria-hidden='false'>"
											+"<div><img src="+imageFileUrl+" class='review-detail-image'></div>"
											+"<div>"+spotName+"</div><div>"+star+"<span class='mx-2'>"+evaluesDouble+"</span></div>"
											+"<div>"+spotDescription+"</div>"
											+"<div><span>料金</span><span class='mx-2'>"+price+"</span></div></div>"
											
											+"<div class='panel' id='panel-review-show' role='tabpanel' aria-hidden='true'></div>"

											+"</div>";
				mapContainer.appendChild(reviewDetailCard);
				
				
				
				//レビュー詳細タブ消去イベント
				const reviewDetailDeleter=document.querySelector('.review-detail-delete-btn')
				reviewDetailDeleter.addEventListener("click",()=>{	
				document.querySelector(".review-detail-container").remove();	
				
				switchPinTexture(null);
				});
				
				
				//	reviewshow詳細タブ
				const tabs= document.getElementsByClassName("review-detail-tab");
				  for (let i = 0; i < tabs.length; i++) {
					
				    tabs[i].addEventListener("click", reviewDetailTabSwitch);
				  };
				  
				  createReviewShow(spotId);			
			}	
			
			
			
			
}

function createReviewShow(spotId)
{
	const XHR=new XMLHttpRequest();
	XHR.open('GET', `/map/review/show?spotId=${encodeURIComponent(spotId)}`, true);
			XHR.responseType = 'json';
			XHR.send();
			
			XHR.onload=function(){
				if (XHR.status === 200) {
					const reviewDataList=this.response;
					const panelReviewShow=document.getElementById('panel-review-show');
					
					if(reviewDataList!=null)
					{
						for(let i=0;i<reviewDataList.length;i++)
						{
						const reviewShowCard=document.createElement('div');

							var userName=reviewDataList[i]['user_name'];
							var evalue=reviewDataList[i]['evalues'];
							var contents=reviewDataList[i]['contents'];
							
							reviewShowCard.innerHTML="<div>"+userName+"</div>"
													+"<div>"+evalue+"</div>"
													+"<div>"+contents+"</div><hr class='my-0 '>"
													
							panelReviewShow.appendChild(reviewShowCard);
						}
						
					}else{
						const reviewShowCard=document.createElement('div');

						reviewShowCard.innerHTML="<div>まだレビューがありません</div>";
						panelReviewShow.appendChild(reviewShowCard);
						
					}
	
				}
				else{
					 alert("reviewShowError");
				}
				
			}
}


//レビュー詳細タブ切り替え機能
  function reviewDetailTabSwitch() {
    // タブのaria属性変更
    
   	const tabs= document.getElementsByClassName("review-detail-tab");
    document.querySelector(".review-detail-tab[aria-selected='true']").setAttribute("aria-selected", "false");
    this.setAttribute("aria-selected", "true");

    // パネルのaria属性変更
    console.log(document.querySelector(".panel[aria-hidden='false']"));
    document.querySelector(".panel[aria-hidden='false']").setAttribute("aria-hidden", "true");
     const arrayTabs = Array.prototype.slice.call(tabs);
    const index = arrayTabs.indexOf(this);
    document.getElementsByClassName('panel')[index].setAttribute('aria-hidden', 'false');
  }
  

  
  
  
//  スポット情報CRUD用の情報取得
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



  
  
