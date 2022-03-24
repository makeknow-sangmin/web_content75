function tableScrollling(divHeaderId, divContentId, tableId){
try {
	var divHeaderObj = document.getElementById(divHeaderId); //그리드 헤더
	var divContentObj = document.getElementById(divContentId); //그리드 내용 스크롤 영역
	var tableObj = document.getElementById(tableId); //그리드 내용 영역
	
	var bdHeight = divContentObj.offsetHeight; //바디 div 높이
	var btHeight = tableObj.offsetHeight; //바디 테이블 높이

	if (btHeight > bdHeight){
		//그리드에 세로스크롤이 생기면 해더부분에 스크롤 넓이만큼 오른쪽 마진 생성
		divHeaderObj.style.margin = "0 17px 0 0";  
	} else {
		divHeaderObj.style.margin = "0 0 0 0";
	}
} catch(e) {}
}

function tableScrollling2(divHeaderId, divContentId, tableId, footFixId){
	var divHeaderObj = document.getElementById(divHeaderId); //그리드 헤더
	var divContentObj = document.getElementById(divContentId); //그리드 내용 스크롤 영역
	var tableObj = document.getElementById(tableId); //그리드 내용 영역
	var divFooterObj = document.getElementById(footFixId); //그리드 하단 영역
	
	var bdHeight = divContentObj.offsetHeight; //바디 div 높이
	var btHeight = tableObj.offsetHeight; //바디 테이블 높이

	if (btHeight > bdHeight){
		//그리드에 세로스크롤이 생기면 해더부분에 스크롤 넓이만큼 오른쪽 마진 생성
		divHeaderObj.style.margin = "0 17px 0 0";  
		divFooterObj.style.margin = "0 17px 0 0"; 
	} else {
		divHeaderObj.style.margin = "0 0 0 0";  
		divFooterObj.style.margin = "0 0 0 0"; 
	}
}

function setDivHeight(objSetId,objTarId)
{
	var objSetHeight = document.getElementById(objSetId).offsetHeight; //테이블 높이값
	var objSetWidth = document.getElementById(objSetId).offsetWidth; //테이블 넒이값
	
	var objTarWidth = document.getElementById(objTarId).offsetWidth; //가로 스크롤 생기는 Div 넓이값
	var objTar = document.getElementById(objTarId); //가로 스크롤 생기는 Div
	
	if (objSetWidth == objTarWidth){ //가로 스크롤이 없을 때
		objTar.style.height = (objSetHeight) + "px"; //테이블 높이
	}else{
		objTar.style.height = (objSetHeight+17) + "px"; //테이블 높이 + 17(스크롤 높이) 
	}
}

function scMove(moveHeaderId, moveContentId){
	var headDiv = document.getElementById(moveHeaderId); //그리드 해더 스크롤 영역 (가로이동)
	var bodyDiv = document.getElementById(moveContentId); //그리드 내용 스크롤 영역 (가로이동)
	
	var scMove = bodyDiv.scrollLeft; //내용 스크롤 이동값
	
	headDiv.scrollLeft = scMove; //내용과 해더 스크롤 이동값을 같게 함
}

function scMove2(moveHeaderId, moveContentId, footFixId){
	var headDiv = document.getElementById(moveHeaderId); //그리드 해더 스크롤 영역 (가로이동)
	var bodyDiv = document.getElementById(moveContentId); //그리드 내용 스크롤 영역 (가로이동)
	var footDiv = document.getElementById(footFixId); //그리드 하단 스크롤 영역 (가로이동)
	
	var scMove = footDiv.scrollLeft;
	
	headDiv.scrollLeft = scMove; //내용과 해더 스크롤 이동값을 같게 함
	bodyDiv.scrollLeft = scMove; //내용과 풋터 스크롤 이동값을 같게 함
}

//탭 메뉴
function init_tabs() {
   	$('.TapArea').each(function() {
   			var tabBtn = $(this).children('ul').children('li');
   			
   			tabBtn.click(function() { //탭 클릭
   					if (!$(this).hasClass('tap-on')) {
   							$(this).addClass('tap-on').siblings('li').removeClass('tap-on'); //선택된 탭을 제외하고 나머지 class를 지움
   							$($(this).find('a').attr('href')).show().siblings('div.tab_content').hide(); //선택된 컨텐츠를 제외하고 나머지 컨텐츠들을 숨김
   					}
   					return false;
   			});
   			tabBtn.eq(0).click(); //탭 첫번째 컨텐츠를 보여줌
  	});
}

//상단 메뉴
function top_menu(){
		$("#Mpoint ul").show(); //현재 페이지의 서브페이지를 보여줌
		$("#menu li").hover(function(){
		    $(this).find("ul").stop().fadeIn(0); //마우스오버 된 메뉴의 서브페이지 보여줌
		    $("#Mpoint ul").fadeOut(0); //현재 페이지의 서브페이지 숨김
		    $(this).find(">a").attr('style','color:red;');
		    
		    var liId = $(this).attr("id"); 
		    if (liId == "Mpoint"){  //현재 페이지 상단메뉴를 마우스오버 했을 때는
		    		$("#Mpoint ul").show();  //현재 페이지 서브페이지 보여줌
		    }
		},function(){  //마우스가 메뉴영역 밖으로 나갔을 때
		   	$(this).find("ul").stop().fadeOut(0);  //모든 서브페이지 메뉴 숨김
		   	$("#Mpoint ul").show();  //현재페이지의 서브페이지는 보여줌
		   	$(this).find(">a").attr('style',' ');
		});
}

function console_logs(tag, val) {
	try {
		console.log(tag, val);
	} catch(e) {}
}