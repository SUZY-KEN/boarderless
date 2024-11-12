//スマホ用
const mediaQuery = window.matchMedia('(max-width: 1350px)');


let boolReviewer=false;
 let startY;
 
 const swipeReviewList=document.getElementById('swipe-right-container');
 const rightContainer=document.getElementById('right-container');
 const swipeUpImg=document.getElementById('swipe-up-img');
 const swipeDownImg=document.getElementById('swipe-down-img');
 
 
  swipeReviewList.addEventListener('touchstart', function(e) {
	
    startY = e.touches[0].clientY;
  });
  
  swipeReviewList.addEventListener('touchend', function(e) {
    const endY = e.changedTouches[0].clientY;

    // スワイプ距離が一定以上であればメニューを開く
    if ((startY - endY > 100&&boolReviewer==false)) {
      swipeAndDelayBool(rightContainer,true,boolReviewer);
      
    } else if (endY - startY > 100&&boolReviewer==true) {
      swipeAndDelayBool(rightContainer,false,boolReviewer);
    }
  });
  
  swipeReviewList.addEventListener('click',handleClick);
  
  function handleClick() {
  if (boolReviewer === false) {
    swipeAndDelayBool(rightContainer, true, boolReviewer);
  } else if (boolReviewer === true) {
    swipeAndDelayBool(rightContainer, false, boolReviewer);
  }
}
  
  
  function swipeAndDelayBool(swipedElem,bool,status){
	 swipeReviewList.removeEventListener('click', handleClick);
	
	new Promise((resolve)=>{
		if(status==true){
			 swipedElem.style.height = '56px';
			 swipeUpImg.style="display:block"
			swipeDownImg.style="display:none"
		}else{
			  swipedElem.style.height = '40vh';
			    swipeUpImg.style="display:none"
			swipeDownImg.style="display:block"
		}
		
		setTimeout(function(){ resolve();}, 1000);
	}).then(()=>{
		
		
		boolReviewer=bool;
		 swipeReviewList.addEventListener('click', handleClick);
	});
  }