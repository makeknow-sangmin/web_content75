
function pay(frm)
{
	// MakePayMessage()를 호출함으로써 플러그인이 화면에 나타나며, Hidden Field
	// 에 값들이 채워지게 됩니다. 일반적인 경우, 플러그인은 결제처리를 직접하는 것이
	// 아니라, 중요한 정보를 암호화 하여 Hidden Field의 값들을 채우고 종료하며,
	// 다음 페이지인 INIsecureresult.php로 데이터가 포스트 되어 결제 처리됨을 유의하시기 바랍니다.

	//if(document.GeneralBaseForm1.clickcontrol.value == "enable")
	//{
		
		if(document.GeneralBaseForm1.goodname.value == "")  // 필수항목 체크 (상품명, 상품가격, 구매자명, 구매자 이메일주소, 구매자 전화번호)
		{
			alert("상품명이 빠졌습니다. 필수항목입니다.");
			return false;
		}
		else if(document.GeneralBaseForm1.buyername.value == "")
		{
			alert("구매자명이 빠졌습니다. 필수항목입니다.");
			return false;
		} 
		else if(document.GeneralBaseForm1.buyeremail.value == "")
		{
			alert("구매자 이메일주소가 빠졌습니다. 필수항목입니다.");
			return false;
		}
		else if(document.GeneralBaseForm1.buyertel.value == "")
		{
			alert("구매자 전화번호가 빠졌습니다. 필수항목입니다.");
			return false;
		}
		else if(document.INIpay == null || document.INIpay.object == null)  // 플러그인 설치유무 체크
		{
			alert("\n이니페이 플러그인 128이 설치되지 않았습니다. \n\n안전한 결제를 위하여 이니페이 플러그인 128의 설치가 필요합니다. \n\n다시 설치하시려면 Ctrl + F5키를 누르시거나 메뉴의 [보기/새로고침]을 선택하여 주십시오.");
			return false;
		}
		else
		{
			/******
			 * 플러그인이 참조하는 각종 결제옵션을 이곳에서 수행할 수 있습니다.
			 * (자바스크립트를 이용한 동적 옵션처리)
			 */
				alert(1);		 
			if (MakePayMessage(frm))
			{
				//disable_click();
				openwin = window.open("childwin.htm","childwin","width=299,height=149");		
				return true;
			}
			else
			{
				alert("결제를 취소하셨습니다.");
				return false;
			}
		}
	//}
	//else
	//{
		return false;
	//}
}


function doRequestPayedUser(frm) {

	var svr_name = SafeGetValue('svr_name');
	var svr_hp = SafeGetValue('svr_hp');
	var svr_email = SafeGetValue('svr_email');
	var cash_name = SafeGetValue('cash_name');
	var cash_hp = SafeGetValue('cash_hp');
	var cash_email = SafeGetValue('cash_email');

	if(svr_name=='') {
		alert('서버관리 담당자 이름를 입력하세요.');
		return;
	}
	if(svr_hp=='') {
		alert('서버관리 담당자 연락처를 입력하세요.');
		return;
	}
	if(svr_email=='') {
		alert('서버관리 담당자 e-메일을 입력하세요.');
		return;
	}
	if(cash_name=='') {
		alert('요금결재 담당자 이름를 입력하세요.');
		return;
	}
	if(cash_hp=='') {
		alert('요금결재 담당자 연락처를 입력하세요.');
		return;
	}
	if(cash_email=='') {
		alert('요금결재 담당자 e-메일을 입력하세요.');
		return;
	}
	/*
	w = screen.availWidth / 1.5;
	h = screen.availHeight / 1.3;
	var win_option = 
		//"direction=yes," +
		//"location=yes," +
		"menubar=no," +
		//"scrollbars=yes," +
		//"status=yes," +
		//"toolbar=yes," +
		"resizable=no," +
		"width="+w+",height="+h;
		
	newWin1 = window.open("inisecurestart.html", "newWin1", win_option);
	*/
	/*
	var action_para = "inisecurestart.html"
	document.GeneralBaseForm1.action=action_para;
	document.GeneralBaseForm1.submit();
	*/
	pay(frm);

}

function enable_click()
{
	document.GeneralBaseForm1.clickcontrol.value = "enable"
}

function disable_click()
{
	document.GeneralBaseForm1.clickcontrol.value = "disable"
}

function focus_control()
{
	if(document.GeneralBaseForm1.clickcontrol.value == "disable")
		openwin.focus();
}

function MM_reloadPage(init) {  //reloads the window if Nav4 resized
	  if (init==true) with (navigator) {if ((appName=="Netscape")&&(parseInt(appVersion)==4)) {
	    document.MM_pgW=innerWidth; document.MM_pgH=innerHeight; onresize=MM_reloadPage; }}
	  else if (innerWidth!=document.MM_pgW || innerHeight!=document.MM_pgH) location.reload();
}

function MM_jumpMenu(targ,selObj,restore){ //v3.0
	  eval(targ+".location='"+selObj.options[selObj.selectedIndex].value+"'");
	  if (restore) selObj.selectedIndex=0;
}