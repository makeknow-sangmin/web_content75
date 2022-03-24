
/*	로그인 화면의 Script 모음
 *						2008.03.02
 *						박경원
 */
 
	var	GLogin_user_id = '';
	var	GLogin_user_email = '';
	var	GLogin_user_name = '';
	//뮤료 사용자 로그인 되어있는지 여부
	var GloginState= false;
	//로그인 창 없이 풀 Window 사용
	//var GuseFullWindow = false;
	//선택된 메뉴
	var GselectedMenu = '';
	//선택된 명령
	var GselectedCom = '';

	var	animCount = 0;
	var	animTimer;
	var TitlePosition = 0;
	var LogoPosition = 0;

	var hasReceiver = false;
	
	var GFileGroupKey;

	var topMenu = new Array();
	topMenu[0] = new Array();//key
	topMenu[1] = new Array();//kor name
	topMenu[2] = new Array();//eng label
	topMenu[3] = new Array();//background
	topMenu[4] = new Array();//page Key
	topMenu[5] = new Array();//0:로그아웃 메뉴, 1:로그인 메뉴, -1:no action
	topMenu[6] = new Array();//로그인 창 필요 true/false;
	topMenu[7] = new Array();//도움말 메세지
	
	var selected_span=0;//두개의 주소를 입력하므로 이를 구분하기 위한 변수
	var boolZipApan = [];
	boolZipApan[0] = false;
	boolZipApan[1] = false;
	
	
	//견적요청 메일에서 선택한 자재
	var listUniqueId = new Array();
	
	//수신처에서 지정된 수신처
	var listUniqueIdRecv = new Array();
	//listUniqueId[0] = new Array();//unique_id
	//listUniqueId[1] = new Array();//selected true/false;
	

///---------------------------------------- 쿠키 ---------------------------------------------
		
	//쿠키저장
	function saveid(form) 
	{
		var expdate = new Date();
		 // 기본적으로 30일동안 기억하게 함. 일수를 조절하려면 * 30에서 숫자를 조절하면 됨
		 if (form.checksaveid.checked){
			expdate.setTime(expdate.getTime() + 1000 * 3600 * 24 * 30); // 30일
		 }else{
			expdate.setTime(expdate.getTime() - 1);		// 쿠키 삭제조건
		 }

		 setCookie("bizloubgeusername", form.username.value, expdate);
		 setCookie("bizloubgevomcode", form.com_code.value, expdate);
		 setCookie("bizloubgenationcode", form.nation_code.value, expdate);
	}
	
	
	//쿠키저장
	function saveidLocal(form) 
	{
		var expdate = new Date();
		 // 기본적으로 30일동안 기억하게 함. 일수를 조절하려면 * 30에서 숫자를 조절하면 됨
		 if (form.checksaveid.checked){
				expdate.setTime(expdate.getTime() + 1000 * 3600 * 24 * 30); // 30일
			 }else{
				expdate.setTime(expdate.getTime() - 1);		// 쿠키 삭제조건
			 }
		setCookie("workspaceuserid", form.username.value, expdate);
	}
	
	
	function setCookie (name, value, expires) 
	{
		document.cookie = name + "=" + escape (value) + "; path=/; expires=" + expires.toGMTString();
	}

	//쿠키에서 가져오기	
	function getid(form) 
	{
		form.checksaveid.checked = ((form.username.value = getCookie("bizloubgeusername")) != "");
		
		var com_code = getCookie("bizloubgevomcode");
		if(com_code==null || com_code=='') {
			com_code='';
		}
		form.com_code.value = com_code.toUpperCase();
		var nation_code = getCookie("bizloubgenationcode");
		selectItem(nation_code);
	}
	
	function selectItem(nation_code)
	{
		var obj = $('nation_code');

		for(var i=(obj.options.length-1);i>=0;i--) {

			var o=obj.options[i];
			var value = o.value;
			if(o.value==nation_code) {
				o.selected = true;
			} else {
				o.selected = false;
			}
		}
	}
	
	
	function getidLocal(form) 
	{
		form.checksaveid.checked = ((form.username.value = getCookie("workspaceuserid")) != "");
	}
	function getCookie(Name) {
		var search = Name + "="
		 if (document.cookie.length > 0) 
		 {						// 쿠키가 설정되어 있다면
			offset = document.cookie.indexOf(search)
			if (offset != -1) 
			{													// 쿠키가 존재하면
				offset += search.length
				// set index of beginning of value
				end = document.cookie.indexOf(";", offset)
				// 쿠키 값의 마지막 위치 인덱스 번호 설정
				if (end == -1)
				 end = document.cookie.length
				return unescape(document.cookie.substring(offset, end))
			}
		}
		return "";
	}

///----------------------------명령-------------------------------------------

	function gotoWorkspace()
	{
		this.location.href="rfxmailc.html?cmdKey=rma022";
	}
	function gotoBizLounge()
	{
		this.location.href="index.html?page_type=R";
	}
	function gotoHome()
	{
		this.location.href="index.html";
	}
	function onclickChangeType ( type)
	{
	}
	
	function getZipCodeSpan(no)
	{
		selected_span = no;
		if(boolZipApan[no]==false) {
			var strHtml = '&nbsp;&nbsp;' + JRFXLOGIN_01 +'<br>';
			strHtml		= strHtml + "&nbsp;&nbsp;<input class='light_input' type=text name='dong_name" + no;
			strHtml		= strHtml + "'onkeypress='DWRUtil.onReturn(event, getZipCode)'></input>&nbsp;&nbsp;<a href='javascript:getZipCode()'>" + JRFXLOGIN_02 + "</a><hr size=1 style='border:1 dotted #DDDDDD'><br>";
			
			SafeSetValue('zipcode_page'+no, strHtml);
			
			boolZipApan[no] = true;
		}
		else
		{
			SafeSetValue('zipcode_page'+no, '');
			boolZipApan[no] = false;
		}
	}
	
	function makeTelNo(code)
	{
		var val1 = SafeGetValue(code + '1');
		var val2 = SafeGetValue(code + '2');
		var val3 = SafeGetValue(code + '3');
		SafeSetValue(code, val1 + '-' + val2 + '-' + val3);
		
	}
	
	function makeWaCode()
	{
		
		var wa_code1 = SafeGetValue('wa_code1');
alert(wa_code1);
		if(wa_code1=='') {
			$('wa_code1').focus();
			return;
		}

		SafeSetValue('wa_code1', wa_code1.toUpperCase());
		var wa_code2 = SafeGetValue('wa_code2');
		var wa_code3 = SafeGetValue('wa_code3');
		var wa_code = wa_code1.toUpperCase()+wa_code2.toUpperCase()+wa_code3.toUpperCase();
		SafeSetValue('wa_code', wa_code);
		
		WaCodeValidator.isValid(wa_code, replyWaCode);
		
	}
	
	function changeNation()
	{
		changeNationObj($( 'nation_code' ));
	}
	
	function changeCompanyType(obj)
	{
		var company_code_type = obj.value;
		var wa_code3 = SafeGetValue('wa_code3').toUpperCase();
		SafeSetValue('company_code1',  wa_code3 + company_code_type);
	}
	
	function changeNationObj(obj)
	{
		var wa_code3 = 'KR';
		if(obj!=null) {
			wa_code3 = obj.value;
		}
		SafeSetValue('wa_code3', wa_code3.toUpperCase());
		
		var company_code_type = $('company_code_type').value;
		SafeSetValue('company_code1', wa_code3.toUpperCase() + company_code_type);
		
		
		var obj = $('company_code2');
		if(obj!=null) {		
			obj.select();
		}
		
		var nation_flag = "<img src='media/flags/" + wa_code3.toLowerCase() + ".png' />";
		
		SafeSetValue('nation_flag', nation_flag);
		
		
	}
	
	function toUpperObj(obj)
	{
		obj.value = obj.value.toUpperCase();
	}
	

	function replyWaCode(valid)
	{
	    processWaReply(valid, "wa_code_err", JRFXLOGIN_03);
	}
	
	function makeBizNo()
	{
		var biz_no1 = SafeGetValue('biz_no1');
		var biz_no2 = SafeGetValue('biz_no2');
		var biz_no3 = SafeGetValue('biz_no3');
		
		if(biz_no1.length ==3 && biz_no2.length ==2 && biz_no3.length ==5)
		{
			var biz_no = biz_no1 + '-' + biz_no2 + '-' + biz_no3;
			BizNoValidator.isValid(biz_no, replyBizNo);
		}
		
	}
	function checkBizNo()
	{
		var biz_no = SafeGetValue('biz_no');
		if(biz_no.length < 4) {
			return false;
		}
		BizNoValidator.isValid(biz_no, replyBizNo);
	}
	
	function replyBizNo(valid)
	{
	    processWaReply(valid, "biz_no_err", JRFXLOGIN_04);
	}
	
	function processWaReply(valid, errid, error)
	{
	    if (valid)
	    {
	    	aleady_use_code = true;
	    	//alert('SafeSetValue(errid, "")');
	        SafeSetValue(errid, "");

	    }
	    else
	    {
	    	aleady_use_code = false;
	    	//alert('SafeSetValue(errid, error)');
	        SafeSetValue(errid, error);
	    }
	}
	
	function getZipCode()
	{
		var key = SafeGetValue('dong_name' + selected_span);
		
		if( key.length < 2)
		{
			alert(JRFXLOGIN_05);
			return;
		}
	
		var page_path = "/no_security.html?searchType=zipcode";
		page_path = page_path + "&searchKey=" + key + "&searchHandler=" + 'none';
		CommonInfo_getForward(loadforwardZip, page_path);

	}
	
	function loadforwardZip(my_data)
	{ 
		
		SafeSetValue('zipcode_page' + selected_span, my_data);
	}
	
	function selectMe(hanler, zipcode, address)
	{
			SafeSetValue("zip_code" + selected_span, zipcode);
			SafeSetValue("address_1" + selected_span, address);
			
			//$('zipcode_page').style.visibility = 'hidden';
			//$('address_page').style.visibility = 'visible';
			
			getZipCodeSpan(selected_span);
			$('address_2' + selected_span).focus();

	}
	
	function checkNum(obj, max_input)
	{
		var input_name = obj.name;
		
		
		
		var input_size = obj.size;
		var input_str = obj.value;
		var CHARS = '0123456789';
		var len = input_str.length;
		
		if(len > input_size) {//키보드를 빠르게 입력하면 발생할 수 있음.
	    	obj.value = input_str.substr(0,input_size);
	    	
	    }
		len = input_str.length;
	    for (var inx = 0; inx < len; inx++) {
	    	var ch = input_str.charAt(inx);
	       if (CHARS.indexOf(ch) == -1) { //숫자가 아니면
	       		if(inx==0) {
	       			SafeSetValue(input_name, '');
	       		} else {
	       			SafeSetValue(input_name, input_str.substr(0,inx));
	       		}
	       		return;
	       } 
	    }
	    
	    var input_len = input_name.length;
	    if(len == input_size) { //다응 입력 칸으로 이동 필요
	    	var input_pos  = Number(input_name.substr(input_len-1));
	    	var input_type = input_name.substr(0,input_len-1);
//alert('input_pos='+ input_pos);
//alert('input_name='+ input_name);
//alert('input_type='+ input_type);
	    	if(input_pos<max_input) {
	    		var next_name = input_type+(input_pos+1);
	    		var next_obj = $( next_name);
	    		if(next_obj!=null) {
	    			next_obj.select();
	    		}
	    	} else {
	    		//$('wa_name' ).select();
	    	}
	    	 
	    }
	}

	function checkDigit(obj, max_input)
	{
		var input_name = obj.name;
		var input_size = obj.size;
		var input_str = obj.value;
		var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		var len = input_str.length;
		
		if(len > input_size) {//키보드를 빠르게 입력하면 발생할 수 있음.
	    	obj.value = input_str.substr(0,input_size);
	    	
	    }
		len = input_str.length;
	    for (var inx = 0; inx < len; inx++) {
	    	var ch = input_str.charAt(inx);
	       if (CHARS.indexOf(ch) == -1) { //숫자가 아니면
	       		if(inx==0) {
	       			SafeSetValue(input_name, '');
	       		} else {
	       			SafeSetValue(input_name, input_str.substr(0,inx));
	       		}
	       		return;
	       } 
	    }
	    
	    var input_len = input_name.length;
	    if(len == input_size) { //다응 입력 칸으로 이동 필요
	    	var input_pos  = Number(input_name.substr(input_len-1));
	    	var input_type = input_name.substr(0,input_len-1);
//alert('input_pos='+ input_pos);
//alert('input_name='+ input_name);
//alert('input_type='+ input_type);
	    	if(input_pos<max_input) {
	    		$(input_type+(input_pos+1) ).select();
	    	} else {
	    		//$('wa_name' ).select();
	    	}
	    	 
	    }
	}
	
	
	function checkAlphaNum(obj)
	{
		var input_str = obj.value;
		var CHARS = '_0123456789';
		CHARS = CHARS + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		var newstr = '';
		
		for (var inx = 0; inx < input_str.length; inx++) {
			if (CHARS.indexOf(input_str.charAt(inx)) != -1) {
				newstr = newstr + input_str.charAt(inx);
			} else {
				alert(JRFXLOGIN_06);
			}
		}
		obj.value = newstr;
		obj.focus();
		
		SafeSetValue("user_id_err", "");
	}

	function checkUserEmail()
	{
		var valid = isValidEmail($('email'));
		if(valid==false) {
			replyEMail(valid);
		} else {
			var email = SafeGetValue("email");
			EmailIdValidator.isValid(email, replyEMailId);	
		}
	}
	
	function checkUserId(obj)
	{
		var user_id = obj.value;
		if(user_id.length < 5 )
		{
			SafeSetValue("user_id_err", JRFXLOGIN_13);
			can_submit = false;
		}
		else
		{
			UserIdValidator.isValid(user_id, 0, replyUserid);
		}
	
	}
	
	
	function resetErr()
	{
		SafeSetValue("biz_no_err", "");
		SafeSetValue("wa_name_err", "");
		SafeSetValue("president_name_err", "");
		SafeSetValue("company_code2_err", "");
		SafeSetValue("address0_err", "");
		SafeSetValue("biz_condition_err", "");
		SafeSetValue("biz_category_err", "");
		SafeSetValue("company_grade_err", "");
		SafeSetValue("max_capacity_err", "");
		SafeSetValue("user_id_err", "");
		SafeSetValue("password_err", "");
		SafeSetValue("email_err", "");
		SafeSetValue("user_name_err", "");
		SafeSetValue("password_err", "");
		SafeSetValue("tel_no_err", "");
		SafeSetValue("hp_no_err", "");
		SafeSetValue("fax_no_err", "");
		SafeSetValue("arap_user_name_err", "");
		SafeSetValue("arap_email_err", "");
		SafeSetValue("arap_tel_no_err", "");
		SafeSetValue("arap_fax_no_err", "");
	}
	
	function resetErrFree()
	{
		SafeSetValue("biz_no_err", "");
		SafeSetValue("wa_name_err", "");
		SafeSetValue("president_name_err", "");
		SafeSetValue("company_code2_err", "");
		SafeSetValue("address0_err", "");
		SafeSetValue("biz_condition_err", "");
		SafeSetValue("biz_category_err", "");
		SafeSetValue("user_id_err", "");
		SafeSetValue("password_err", "");
		SafeSetValue("email_err", "");
		SafeSetValue("user_name_err", "");
		SafeSetValue("password_err", "");
		SafeSetValue("tel_no_err", "");
		SafeSetValue("hp_no_err", "");
		SafeSetValue("fax_no_err", "");
		SafeSetValue("arap_user_name_err", "");
		SafeSetValue("arap_email_err", "");
		SafeSetValue("arap_tel_no_err", "");
		SafeSetValue("arap_fax_no_err", "");

	}
	
	function replyUserid(valid)
	{
		if(valid) {
			 SafeSetValue("user_id_err", "");
		} else {
			processReply(valid, "user_id_err", JRFXLOGIN_07);
		}
	}
	
	function replyEMailId(valid)
	{
		if(valid) {
			 SafeSetValue("email_err", "");
		} else {
			processReply(valid, "email_err", "사용중인 e메일"/*JRFXLOGIN_13*/);
		}
	}
	function replyEMail(valid)
	{
		if(valid) {
			 SafeSetValue("email_err", "");
		} else {
			processReply(valid, "email_err", JRFXLOGIN_13);
		}
	}

	function processReply(valid, errid, error) {

		if(valid) {
			 SafeSetValue(errid, "");
		} else {
			 SafeSetValue(errid, error);
		}
	}
	
	function sendRequestMail()
	{
		var type = SafeGetValue('contact_type');
		var company_name = SafeGetValue('company_name');
		var rep_name = SafeGetValue('rep_name');
		var email = SafeGetValue('email');
		var tel = SafeGetValue('tel');
		var hp = SafeGetValue('hp');
		var content = SafeGetValue('content');

		if(company_name==null || company_name=='') {
			alert(JRFXLOGIN_08);
			return;
		}
		if(rep_name==null || rep_name=='') {
			alert(JRFXLOGIN_09);
			return;
		}
		if(email==null || email=='') {
			alert(JRFXLOGIN_10);
			return;
		}
		if(content==null || content=='') {
			alert(JRFXLOGIN_11);
			return;
		}
		
		var valid = isValidEmail($('email'));
		if(valid==false)
		{
			alert(JRFXLOGIN_12);
			return;
		}

		var action_para = "no_secure_service.html?&cmdKey=QuestionRequest"
		document.GeneralBaseForm1.action=action_para;
		document.GeneralBaseForm1.submit();
				
	}
	
	function checkThisObj(obj) {
		var id = obj.id;
		var value = obj.value;
		
		if(value==null || value=='') {
			SafeSetValue(id+"_err", JRFXLOGIN_13);
			can_submit = false;
		} else {
			SafeSetValue(id+"_err", "");
		}
		
	}
	
	function doRequest()
	{
		var search_allow;
		/*
		if (GeneralBaseForm1.openinfo.checked){
			search_allow = JRFXLOGIN_14;
			SafeSetValue("uid_comast", "0");
		} else {
			search_allow = JRFXLOGIN_15;
			SafeSetValue("uid_comast", "-1");
		}
		*/
		if(aleady_use_code==false) {
			alert(JRFXLOGIN_16);
			return;
		}
		resetErr();
	
		var can_submit = true;
		
		//alert(0);alert(can_submit);
		
		var wa_code = SafeGetValue('wa_code');
		var wa_code1 = SafeGetValue('wa_code1');
		var wa_code2 = SafeGetValue('wa_code2');
		if(wa_code1.length !=4 || wa_code2.length!=2 )
		{
			SafeSetValue("wa_code_err", JRFXLOGIN_13);
			can_submit = false;
		} else { 
			SafeSetValue("wa_code_err", "");
		}

		var biz_no = SafeGetValue('biz_no');
		if(biz_no.length < 3)
		{
			SafeSetValue("biz_no_err", JRFXLOGIN_13);
			can_submit = false;
		} else {
			SafeSetValue("biz_no_err", "");
		}
		
		var wa_name = SafeGetValue('wa_name');
		if(wa_name.length == 0)
		{
			SafeSetValue("wa_name_err", JRFXLOGIN_13);
			can_submit = false;
		} else {
			SafeSetValue("wa_name_err", "");
		}
		var president_name = SafeGetValue('president_name');
		if(president_name.length == 0)
		{
			SafeSetValue("president_name_err", JRFXLOGIN_13);
			can_submit = false;
		} else {
			SafeSetValue("president_name_err", "");
		}

		var company_code1 = SafeGetValue('company_code1');
		var company_code2 = SafeGetValue('company_code2');
		if(company_code2.length <3 )
		{
			SafeSetValue("company_code2_err", JRFXLOGIN_13);
			can_submit = false;
		} else {
			SafeSetValue("company_code2_err", "");
		}
		
		//alert(1);alert(can_submit);
		/*var zip_code0 = SafeGetValue('zip_code0');
		var address_10 = SafeGetValue('address_10');
		var address_20 = SafeGetValue('address_20');
		if(address_10.length == 0 || address_20.length==0)
		{
			SafeSetValue("address0_err", JRFXLOGIN_13);
			can_submit = false;
		} else {
			SafeSetValue("address0_err", "");
		}*/
		var address_10 = SafeGetValue('address_10');
		if(address_10.length == 0)
		{
			SafeSetValue("address_10_err", JRFXLOGIN_13);
			can_submit = false;
		} else {
			SafeSetValue("address_10_err", "");
		}
		
		var biz_condition = SafeGetValue('biz_condition');
		if(biz_condition.length == 0)
		{
			SafeSetValue("biz_condition_err", JRFXLOGIN_13);
			can_submit = false;
		} else {
			SafeSetValue("biz_condition_err", "");
		}
		
		var biz_category = SafeGetValue('biz_category');
		if(biz_category.length == 0)
		{
			SafeSetValue("biz_category_err", JRFXLOGIN_13);
			can_submit = false;
		} else {
			SafeSetValue("biz_category_err", "");
		}
		
		/*
		var company_grade = SafeGetValue('company_grade');
		if(company_grade.length == 0)
		{
			SafeSetValue("company_grade_err", JRFXLOGIN_13);
			can_submit = false;
		} else {
			SafeSetValue("company_grade_err", "");
		}
		var max_capacity = SafeGetValue('max_capacity');
		if(max_capacity.length == 0)
		{
			SafeSetValue("max_capacity_err", JRFXLOGIN_13);
			can_submit = false;
		}else {
			SafeSetValue("max_capacity_err", "");
		}
		*/
		
		//alert(2);alert(can_submit);
		
		var user_id = SafeGetValue('user_id');
		if(user_id.length < 5 )
		{
			SafeSetValue("user_id_err", JRFXLOGIN_13);
			can_submit = false;
		}else {
			SafeSetValue("user_id_err", "");
		}
		var password1 = SafeGetValue('password1');
		var password2 = SafeGetValue('password2');
		
		if(password1.length < 6 )
		{
			SafeSetValue("password_err", JRFXLOGIN_17);
			can_submit = false;
		}
		else if(password1 != password2)
		{
			SafeSetValue("password_err", JRFXLOGIN_18);
			can_submit = false;
		}else {
			SafeSetValue("password_err", "");
		}
		
		var email = SafeGetValue('email');
		
		var user_name = SafeGetValue('user_name');
		if(user_name.length == 0)
		{
			SafeSetValue("user_name_err", JRFXLOGIN_13);
			can_submit = false;
		}else {
			SafeSetValue("user_name_err", "");
		}
		
		var tel_no = SafeGetValue('tel_no');
		if(tel_no.length == 0)
		{
			SafeSetValue("tel_no_err", JRFXLOGIN_13);
			can_submit = false;
		}else {
			SafeSetValue("tel_no_err", "");
		}
		
		//alert(3);alert(can_submit);
		var hp_no = SafeGetValue('hp_no');
		if(hp_no.length == 0)
		{
			SafeSetValue("hp_no_err", JRFXLOGIN_13);
			can_submit = false;
		}else {
			SafeSetValue("hp_no_err", "");
		}
		var fax_no = SafeGetValue('fax_no');
		if(fax_no.length == 0)
		{
			SafeSetValue("fax_no_err", JRFXLOGIN_13);
			can_submit = false;
		}else {
			SafeSetValue("fax_no_err", "");
		}
		
		
		var valid_email = isValidEmail($('email'));
		if(valid_email==false)
		{
			SafeSetValue("email_err", JRFXLOGIN_13);
			can_submit = false;
		}else {
			SafeSetValue("email_err", "");
		}
		
		var arap_user_name = SafeGetValue('arap_user_name');
		if(arap_user_name.length == 0)
		{
			SafeSetValue("arap_user_name_err", JRFXLOGIN_13);
			can_submit = false;
		}else {
			SafeSetValue("arap_user_name_err", "");
		}
		
		var arap_email_valid = isValidEmail($('arap_email'));
		if(arap_email_valid==false)
		{
			SafeSetValue("arap_email_err", JRFXLOGIN_13);
			can_submit = false;
		}else {
			SafeSetValue("arap_email_err", "");
		}
		
		//alert(4);alert(can_submit);
		var arap_tel_no = SafeGetValue('arap_tel_no');
		if(arap_tel_no.length == 0)
		{
			SafeSetValue("arap_tel_no_err", JRFXLOGIN_13);
			can_submit = false;
		}else {
			SafeSetValue("arap_tel_no_err", "");
		}
		
		var arap_fax_no = SafeGetValue('arap_fax_no');
		if(arap_fax_no.length == 0)
		{
			SafeSetValue("arap_fax_no_err", JRFXLOGIN_13);
			can_submit = false;
		}else {
			SafeSetValue("arap_fax_no_err", "");
		}

		//alert(5);alert(can_submit);
		
		var establish = SafeGetValue('establish_year') + JRFXLOGIN_19
		+ SafeGetValue('establish_month') + JRFXLOGIN_20
		+ SafeGetValue('establish_day') + JRFXLOGIN_21;
		
		var company_info = SafeGetValue('company_info') ;
		
		//alert(6);alert(can_submit);
		if(can_submit==true)
		{
		
			var msg = '\n----------' + JRFXLOGIN_22 + '----------\n';
			msg = msg + JRFXLOGIN_23 + ' ' + wa_code + '\n';
			//msg = msg + JRFXLOGIN_24 + ' ' + search_allow + '\n';
			msg = msg + JRFXLOGIN_25 + ' ' + biz_no + '\n';
			msg = msg + JRFXLOGIN_26 + ' ' + wa_name + '\n';
			msg = msg + JRFXLOGIN_27 + ' ' + president_name + '\n';
			msg = msg + JRFXLOGIN_28 + ' ' + establish + '\n';
			msg = msg + JRFXLOGIN_29 + ' ' + company_code1 + company_code2 + '\n';

			msg = msg + JRFXLOGIN_30 + ' ' + address_10 + '\n';
			
			msg = msg + JRFXLOGIN_31 + ' ' + biz_condition + '\n';
			msg = msg + JRFXLOGIN_32 + ' ' + biz_category + '\n';
			msg = msg + JRFXLOGIN_33 + ' ' + company_info + '\n';
			
			//msg = msg + '\n----------신청자원----------\n';
			//msg = msg + '[최대사용자]' + ' ' + company_grade + '명\n';
			//msg = msg + '[최대사용용량]' + ' ' + max_capacity + 'GB\n';
			
			msg = msg + '\n----------' + JRFXLOGIN_34 + '----------\n';
			msg = msg + JRFXLOGIN_35 + ' ' + user_id + '\n';
			msg = msg + JRFXLOGIN_36 + ' ' + email + '\n';
			msg = msg + JRFXLOGIN_37 + ' ' + user_name + '\n';
			//msg = msg + '[주소 = [' + zip_code1 + ']' + address_11 + ' ' + address_21 + '\n';
			//msg = msg + '[주민등록번호]' + ' ' + social_no1 + '-' + social_no2 + '\n';
			msg = msg + JRFXLOGIN_38 + ' ' + tel_no + '\n';
			msg = msg + JRFXLOGIN_39 + ' ' + hp_no + '\n';
			msg = msg + JRFXLOGIN_40 + ' ' + fax_no + '\n';
			
			msg = msg + '\n----------' + '결제담당자' + '----------\n';
			msg = msg + '[결제담당자]' + ' ' + user_name + '\n';
			msg = msg + '[메일]' + ' ' + email + '\n';
			msg = msg + '[연락처]' + ' ' + tel_no + '\n';
			msg = msg + '[팩스]' + ' ' + fax_no + '\n';
			
			var	res = confirm(msg);
			if(res != true)
				return;
			
			var action_para = "no_secure_service.html?&cmdKey=NewUserRequest";
			document.GeneralBaseForm1.action=action_para;
			document.GeneralBaseForm1.submit();
		} else {
			alert(JRFXLOGIN_41);
		}
		
	}
	
	function doFreeRequest()
	{

		resetErrFree();
	
		var can_submit = true;
		
		//var wa_code = SafeGetValue('wa_code');
		var biz_no1 = SafeGetValue('biz_no1');
		var biz_no2 = SafeGetValue('biz_no2');
		var biz_no3 = SafeGetValue('biz_no3');
		if(biz_no1.length !=3 || biz_no2.length!=2 || biz_no3.length!=5)
		{
			SafeSetValue("biz_no_err", JRFXLOGIN_13);
			can_submit = false;
		}
		var wa_name = SafeGetValue('wa_name');
		if(wa_name.length == 0)
		{
			SafeSetValue("wa_name_err", JRFXLOGIN_13);
			can_submit = false;
		}
		var president_name = SafeGetValue('president_name');
		if(president_name.length == 0)
		{
			SafeSetValue("president_name_err", JRFXLOGIN_13);
			can_submit = false;
		}
		var company_code1 = SafeGetValue('company_code1');
		var company_code2 = SafeGetValue('company_code2');
		if(company_code1.length !=6 || company_code2.length!=7 )
		{
			SafeSetValue("company_code2_err", JRFXLOGIN_13);
			can_submit = false;
		}
		
		var zip_code0 = SafeGetValue('zip_code0');
		var address_10 = SafeGetValue('address_10');
		var address_20 = SafeGetValue('address_20');
		if(address_10.length == 0 || address_20.length==0)
		{
			SafeSetValue("address0_err", JRFXLOGIN_13);
			can_submit = false;
		}
		
		
		var biz_condition = SafeGetValue('biz_condition');
		if(biz_condition.length == 0)
		{
			SafeSetValue("biz_condition_err", JRFXLOGIN_13);
			can_submit = false;
		}
		
		var biz_category = SafeGetValue('biz_category');
		if(biz_category.length == 0)
		{
			SafeSetValue("biz_category_err", JRFXLOGIN_13);
			can_submit = false;
		}
		
		var user_id = SafeGetValue('user_id');
		if(user_id.length < 5 )
		{
			SafeSetValue("user_id_err", JRFXLOGIN_13);
			can_submit = false;
		}
		else
		{
			UserIdValidator.isValid(user_id, 0, replyUserid);
		}
		
		
		var password1 = SafeGetValue('password1');
		var password2 = SafeGetValue('password2');
		
		if(password1.length < 6 )
		{
			SafeSetValue("password_err", JRFXLOGIN_17);
			can_submit = false;
		}
		
		if(password1 != password2)
		{
			SafeSetValue("password_err", JRFXLOGIN_18);
			can_submit = false;
		}
		
		var user_name = SafeGetValue('user_name');
		if(user_name.length == 0)
		{
			SafeSetValue("user_name_err", JRFXLOGIN_13);
			can_submit = false;
		}
			
		var tel_no = SafeGetValue('tel_no');
		if(tel_no.length == 0)
		{
			SafeSetValue("tel_no_err", JRFXLOGIN_13);
			can_submit = false;
		}
		
		var hp_no = SafeGetValue('hp_no');
		if(hp_no.length == 0)
		{
			SafeSetValue("hp_no_err", JRFXLOGIN_13);
			can_submit = false;
		}
		var fax_no = SafeGetValue('fax_no');
		if(fax_no.length == 0)
		{
			SafeSetValue("fax_no_err", JRFXLOGIN_13);
			can_submit = false;
		}

		var email = SafeGetValue('email');

		var valid = isValidEmail($('email'));
		if(valid==false)
		{
			SafeSetValue("email_err", JRFXLOGIN_13);
			can_submit = false;
		}
		
		if(can_submit==true)
		{
		
			var msg = '\n----------'+ JRFXLOGIN_22 + '----------\n';
			msg = msg + JRFXLOGIN_25 + ' ' + biz_no1 + '-' + biz_no2 + '-' + biz_no3 + '\n';
			msg = msg + JRFXLOGIN_26 + ' ' + wa_name + '\n';
			msg = msg + JRFXLOGIN_27 + ' ' + president_name + '\n';
			msg = msg + JRFXLOGIN_29 + ' ' + company_code1 + '-' + company_code2 + '\n';

			msg = msg + JRFXLOGIN_30 + ' (' + zip_code0 + ')' + address_10 + ' ' + address_20 + '\n';
			
			msg = msg + JRFXLOGIN_31 + ' ' + biz_condition + '\n';
			msg = msg + JRFXLOGIN_32 + ' ' + biz_category + '\n';
			
			msg = msg + '\n----------' + JRFXLOGIN_34 + '----------\n';
			msg = msg + JRFXLOGIN_35 + ' ' + user_id + '\n';
			msg = msg + JRFXLOGIN_36 + ' ' + email + '\n';
			msg = msg + JRFXLOGIN_37 + ' ' + user_name + '\n';
			//msg = msg + '[주소 = [' + zip_code1 + ']' + address_11 + ' ' + address_21 + '\n';
			//msg = msg + '[주민등록번호]' + ' ' + social_no1 + '-' + social_no2 + '\n';
			msg = msg + JRFXLOGIN_38 + ' ' + tel_no + '\n';
			msg = msg + JRFXLOGIN_39 + ' ' + hp_no + '\n';
			msg = msg + JRFXLOGIN_40 + ' ' + fax_no + '\n';
			
			var	res = confirm(msg);
			if(res != true)
				return;
			
			var action_para = "no_secure_service.html?&cmdKey=NewFreeUserRequest"
			document.GeneralBaseForm1.action=action_para;
			document.GeneralBaseForm1.submit();
		}
		
	}
	
	function setAgreement()
	{
		if($("agreement_yes").checked == true)
		{
			$("request_detail").style.visibility = 'visible';
			document.location = '#__company_info_pos';
			
			var obj = $('wa_code1');
			if(obj!=null) {		
				obj.select();
			}
		}
		else
		{
			$("request_detail").style.visibility = 'hidden';
			document.location = '#__agreement_pos';

		}		
	}
	
	function copyContent(tag)
	{
		
		var name = SafeGetValue('root_name');
		var hp = SafeGetValue('root_hp');
		var email = SafeGetValue('root_email');
		
		var readonly = false;
		var background = 'white';
		if($('chkbox_' + tag).checked == true)
		{
			SafeSetValue(tag + '_name', name);
			SafeSetValue(tag + '_hp', hp);
			SafeSetValue(tag + '_email', email);
			background = '#F5F5DC';
			readonly = true;
		}
		else
		{
			SafeSetValue(tag + '_name', '');
			SafeSetValue(tag + '_hp', '');
			SafeSetValue(tag + '_email', '');
		}
		
		$(tag + '_name').style.background = background;
		$(tag + '_hp').style.background = background;
		$(tag + '_email').style.background = background;
		
		$(tag + '_name').disabled = readonly;
		$(tag + '_hp').disabled = readonly;		
		$(tag + '_email').disabled = readonly;
	}
	


	function setVisibleTog(id, content)
	{
		var obj = $(id);
		var visibility = obj.style.visibility;
		if(visibility == 'visible')
		{
			SafeSetValue(id, "");
			obj.style.visibility = 'hidden';
			obj.style.height = 1;
		}
		else
		{
			SafeSetValue(id, content);
			obj.style.visibility = 'visible';
		}
		
	}
	
	///-------------------------------메뉴/Utility------------------------------

	r_color = "aaaaaaaaaaaaaaaaaabbccddeeff";
	g_color = "aaaaaaaaaaaaaaaaaaaabbddeeff";
	b_color = "112233445566778899aabbccddef";
	
	r_color1 ="112233445566778899aabbccddef";
	g_color1 ="ccccccccccccccccccccccddeeff";
	b_color1 ="112233445566778899aabbccddef";
	
	r_color2 ="aaaaaaaaaaaaaaaaaabbccddeeff";
	g_color2 ="112233445566778899aabbccddef";
	b_color2 ="112233445566778899aabbccddef";
	
	function fadein1(pos){
		
		if($("slogan")==null) {
			return;
		}
	
		r = r_color.charAt(pos);
		g = g_color.charAt(pos);
		b = b_color.charAt(pos);
		
		r1 = r_color1.charAt(pos);
		g1 = g_color1.charAt(pos);
		b1 = b_color1.charAt(pos);
		
		r2 = r_color2.charAt(pos);
		g2 = g_color2.charAt(pos);
		b2 = b_color2.charAt(pos);

		
		my_color = "#"  + r + r + g + g + b + b ;
		my_color2 = "#"  + r1 + r1 + g1 + g1 + b1 + b1 ;
		my_color1 = "#"  + r2 + r2 + g2 + g2 + b2 + b2 ;
	
		$("slogan").style.color = my_color;
		$("slogan1").style.color = my_color1;
		$("slogan2").style.color = my_color2;
	}
	
	function doingProcessInter1()
	{

		if(varTimer1==70) {
			varTimer1 = 0;
		}
		
		if(varTimer1==0) {
			var divStr = 
			"<table border=0 cellspacing=0 cellpadding=0><tr><td>" +
			"<marquee scrollamount=50 direction=left behavior=slide width=335>" +
			"<span class=title_span_marque id=slogan1>복수견적은 구매의 기본! 시스템은 경영의 기본</span>" +
			"</marquee></td></tr><tr><td>" +
			"<marquee scrollamount=10 direction=right behavior=alternate loop=2 width=335>" +
			"<span class=title_span_marque id=slogan>起動してください！ビジネスの新しいスタイル</span>" +
			"</marquee></td></tr><tr><td>" +
			"<marquee scrollamount=20 direction=left behavior=slide  width=335>" +
			"<span class=title_span_marque id=slogan2>从现在开始！一种新的业务方式,一種新的業務方式</span>" +
			"</marquee></td></tr></table>";
			SafeSetValue('table_span_div',  divStr);
			
		} else if(varTimer1==28 ) {
			var strDiv0 = 
				"<table border=0 cellspacing=2 cellpadding=0><tr><td height=30>" +
				"<span class=div_gangso><b>直</b><small>Direct</small></span>" +

				"</td></tr><tr><td height=30>" +

				"</td></tr></table>";
			SafeSetValue('table_span_div', strDiv0);
			
		}  else if(varTimer1==32 ) {
			var strDiv0 = 
				"<table border=0 cellspacing=2 cellpadding=0><tr><td height=30>" +
				"<span class=div_gangso><b>直</b><small>Direct</small></span>" +
				"<span class=div_gangso1><b>生</b><small>Raw</small></span>" +

				"</td></tr><tr><td height=30>" +

				"</td></tr></table>";
				SafeSetValue('table_span_div', strDiv0);
				
		} else if(varTimer1==36 ) {
			var strDiv1 = 
				"<table border=0 cellspacing=2 cellpadding=0><tr><td height=30>" +
				"<span class=div_gangso><b>直</b><small>Direct</small></span>" +
				"<span class=div_gangso1><b>生</b><small>Raw</small></span>" +
				"<span class=div_gangso><b>秘</b><small>Secret</small></span>" +

				"</td></tr><tr><td height=30>" +

				"</td></tr></table>";
			SafeSetValue('table_span_div', strDiv1);
			
		}   else if(varTimer1==40 ) {
			var strDiv1 = 
				"<table border=0 cellspacing=2 cellpadding=0><tr><td height=30>" +
				"<span class=div_gangso><b>直</b><small>Direct</small></span>" +
				"<span class=div_gangso1><b>生</b><small>Raw</small></span>" +
				"<span class=div_gangso><b>秘</b><small>Secret</small></span>" +
				"<span class=div_gangso1><b>開</b><small>Open</small></span>" +
				"</td></tr><tr><td height=30>" +

				"</td></tr></table>";
				SafeSetValue('table_span_div', strDiv1);
				
		}   else if(varTimer1==44 ) {
			
			var strDiv2 = 
				"<table border=0 cellspacing=2 cellpadding=0><tr><td height=30>" +
				"<span class=div_gangso><b>直</b><small>Direct</small></span>" +
				"<span class=div_gangso1><b>生</b><small>Raw</small></span>" +
				"<span class=div_gangso><b>秘</b><small>Secret</small></span>" +
				"<span class=div_gangso1><b>開</b><small>Open</small></span>" +
				"</td></tr><tr><td height=30>" +
				"<span class=div_gangso1><b>設</b><small>Infra</small></span>" +

				"</td></tr></table>";;
			SafeSetValue('table_span_div', strDiv2);
			
		}      else if(varTimer1==48 ) {
			
			var strDiv2 = 
				"<table border=0 cellspacing=2 cellpadding=0><tr><td height=30>" +
				"<span class=div_gangso><b>直</b><small>Direct</small></span>" +
				"<span class=div_gangso1><b>生</b><small>Raw</small></span>" +
				"<span class=div_gangso><b>秘</b><small>Secret</small></span>" +
				"<span class=div_gangso1><b>開</b><small>Open</small></span>" +
				"</td></tr><tr><td height=30>" +
				"<span class=div_gangso1><b>設</b><small>Infra</small></span>" +
				"<span class=div_gangso><b>球</b><small>Global</small></span>" +

				"</td></tr></table>";
			SafeSetValue('table_span_div', strDiv2);
			
		}   else if(varTimer1==52 ) {
			
			var strDiv3 = 
				"<table border=0 cellspacing=2 cellpadding=0><tr><td height=30>" +
				"<span class=div_gangso><b>直</b><small>Direct</small></span>" +
				"<span class=div_gangso1><b>生</b><small>Raw</small></span>" +
				"<span class=div_gangso><b>秘</b><small>Secret</small></span>" +
				"<span class=div_gangso1><b>開</b><small>Open</small></span>" +
				"</td></tr><tr><td height=30>" +
				"<span class=div_gangso1><b>設</b><small>Infra</small></span>" +
				"<span class=div_gangso><b>球</b><small>Global</small></span>" +
				"<span class=div_gangso1><b>標</b><small>Stndrd</small></span>" +

				"</td></tr></table>";
			SafeSetValue('table_span_div', strDiv3);
		}    else if(varTimer1==56 ) {
			
			var strDiv2 =
				"<table border=0 cellspacing=2 cellpadding=0><tr><td height=30>" +
				"<span class=div_gangso><b>直</b><small>Direct</small></span>" +
				"<span class=div_gangso1><b>生</b><small>Raw</small></span>" +
				"<span class=div_gangso><b>秘</b><small>Secret</small></span>" +
				"<span class=div_gangso1><b>開</b><small>Open</small></span>" +
				"</td></tr><tr><td height=30>" +
				"<span class=div_gangso1><b>設</b><small>Infra</small></span>" +
				"<span class=div_gangso><b>球</b><small>Global</small></span>" +
				"<span class=div_gangso1><b>標</b><small>Stndrd</small></span>" +
				"<span class=div_gangso>MagicPLM</span>" +
				"</td></tr></table>";
			SafeSetValue('table_span_div', strDiv2);
			
		}   else if( varTimer1==70) {
			SafeSetValue('table_span_div',  "");
			
		}
		
		fadein1(varTimer1%28);
		varTimer1++;
		
	}
	function doingProcessInter2()
	{
			var divStr = 
			"<table width=350 border=0 cellspacing=0 cellpadding=0><tr><td style='font-size: 11pt;font-weight: bold;'>" +
			"<span id=slogan1>이젠 더이상 도면출력 하지마세요.</span>" +
			"</td></tr><tr><td style='font-size: 11pt;'>" +
			"<span id=slogan2><b>도면 PDF/FAX 서비스 Open !</b></span>" +
			"</td></tr><tr><td align=right style='font-size: 11pt;'>" +
			"<span id=slogan></span>" +
			"<a href='javascript:getDivInfo(" + '"non27"' + ");' style='color:#259862;font-size: 10pt;' ><b>Web PDF/FAX</b></a> 소개" +
			"</td></tr></table>";
			SafeSetValue('table_span_div',  divStr);
			
			fadein1(varTimer1%28);
			varTimer1++;
	}
	
	var dgntob2b = null;
	var oldmachine = null;
	var architect = null;
	function doingProcessInter3()
	{
		if(varTimer1<31) {
			varTimer1++;
			dgntob2b.style.left = 360-varTimer1;
			architect.style.left = 600+varTimer1;
			oldmachine.style.top = 91+varTimer1/2;
		}
	}

	function highlightProcess()
	{
	
		varTimer1=0;
		dgntob2b = $('dgntob2b');
		oldmachine = $('oldmachine');
		architect = $('architect');
		//dgntob2b.style.visibility = 'visible';
		//architect.style.visibility = 'visible';
		setInterval("doingProcessInter3()", 30);
		//setInterval("doingProcessInter2()", 100);
	
	}

	function addTopMenuLine (key, kor_label, eng_label, background, command, menu_type, view_log_win, mesg)
	{
		topMenu[0].push(key);	//WidgetName
		topMenu[1].push(kor_label);
		topMenu[2].push(eng_label);
		topMenu[3].push(background);
		topMenu[4].push(command);	//pageKey
		topMenu[5].push(menu_type);	//log/out menu
		topMenu[6].push(view_log_win);	//view_log_win
		topMenu[7].push(mesg);	//help mesg
	}
	
	function getPageKey(key)
	{
		for(i=0;i<topMenu[0].length;i++)
		{			
			if(topMenu[0][i] == key)
			{

				return topMenu[4][i];
			}
		}
		return '';
	}
	
	
	function getTitleHelp(key)
	{
		for(i=0;i<topMenu[0].length;i++)
		{			
			if(topMenu[0][i] == key)
			{

				return topMenu[7][i];
			}
		}
		return '';
	}
	
	function getMenuType(key)
	{
		for(i=0;i<topMenu[0].length;i++)
		{			
			if(topMenu[0][i] == key)
			{

				return topMenu[5][i];
			}
		}
		return -1;
	}
	
	function getViwLogin(key)
	{
		for(i=0;i<topMenu[0].length;i++)
		{			
			if(topMenu[0][i] == key)
			{
				return topMenu[6][i];
			}
		}
		return false;
	}
	
	function createLabel()
	{
		//Label 생성
		for( var i=0; i<topMenu[0].length; i++)
		{
			var key = topMenu[0][i];
			
			//명령키가 div만 메뉴생성 나머지는  hidden 메뉴임.
			if(key!=null && key.substring(0,3) == 'div') {
				
				var width = '77';
				if(key=='div00') {
					width = '52';
				}
				
				var label = "<span style='width:" + width + "'>"+ topMenu[1][i] + "</span>";
	
				if( topMenu[2][i] != '') {
					label = label + "<br><span style='width:" + width + "'>" + topMenu[2][i] + '</span>';
				}
	
				var background = topMenu[3][i];
				
				SafeSetValue(key, label);
				$(key).style.background = background;
				
				Rounded("div#"+ key,	"white", background);
			}
		}
	}

	//라벨가져오기
	function getLabel(searchKey)
	{
		//Label 생성
		for( var i=0; i<topMenu[0].length; i++)
		{
			var key = topMenu[0][i];
			
			if(key == searchKey)
			{
				return topMenu[1][i];
			}
		}
		return "";
	}
	
	//영어라벨가져오기 
	function getLabelEng(searchKey)
	{
		//Label 생성
		for( var i=0; i<topMenu[0].length; i++)
		{
			var key = topMenu[0][i];
			
			if(key == searchKey)
			{
				return topMenu[2][i];
			}
		}
		return "";
	}
	
	function setSearchCondition1()
	{
		startSearchNoForm();
		
		addSearchForm("sp_code", J2MSG_A40_JSP_06, "doGeneralSearchSubmit");
		addSearchForm("supplier_name", J2MSG_A40_JSP_07, "doGeneralSearchSubmit");
		addSearchForm("business_registration_no", J2MSG_G03_JSP_02, "doGeneralSearchSubmit");
		addSearchForm("president_name", J2MSG_A10_JSP_02, "doGeneralSearchSubmit");
		addSearchForm("business_condition", J2MSG_E03_JSP_02, "doGeneralSearchSubmit");
		addSearchForm("business_category", J2MSG_A10_JSP_22, "doGeneralSearchSubmit");
		endSearchNoForm();		
	}
	
	function loadforwardMain(my_data)
	{ 
		SafeSetValue('info_page', my_data);
	}
	
	function loadforward(my_data)
	{ 
		SafeSetValue('info_page', my_data);
		
		var view_login = getViwLogin(GselectedMenu);

		if(GloginState==false && view_login == true) {
		
			var page_path = "/no_security.html?searchType=div-info";
			page_path = page_path + "&searchKey=" + 'login_window';
		
			simpleTarget = 'login_page';
			CommonInfo_getForward(loadforwardSimple, page_path);
		}
		
		SafeSetValue('login_page', '');
		SafeSetValue('search_condition', '');
		
		
		postHandler(GselectedMenu, GselectedCom);
			
		
	}

	
	function getDirectInfo( page_key, label, title_help, param1, param2 )
	{
		closeResultSpan();
		
		GselectedCom = page_key;
		
		if(title_help == undefined || title_help=='') {
			SafeSetValue('title_span', label);
		} else {
			SafeSetValue('title_span', title_help);
		}
		var title_span = $('title_span');
		title_span.style.lineHeight = '25px';
		//SafeSetValue('title_help', title_help);
		
		dhtmlHistory.add(page_key,label);
		
		if(page_key=='pay_money') {
			//alert('CANNOT POCESS!! in Beta Service');
			doRequestPayedUser(label);
			return;
		}

		if( page_key!='') {
			var page_path = '';
			
			/** Drawing Anymation 처리*/
			 var oldmachine = $('oldmachine');
			 var dgntob2b = $('dgntob2b');
			 var dgntob2b2 = $('dgntob2b2');
			 var login_div = $('login_div');
			 var architect = $('architect');
			
			if(page_key == 'first_window') {
				$('drawingbase').style.height = 260;
				oldmachine.style.visibility=   'visible';
				dgntob2b.style.visibility=   'visible';
				dgntob2b2.style.visibility=   'visible';
				login_div.style.visibility=   'visible';
				architect.style.visibility=   'visible';
				
				highlightProcess();
				
			} else {
				$('drawingbase').style.height = 40;

				oldmachine.style.visibility=   'hidden';
				dgntob2b.style.visibility=   'hidden';
				dgntob2b2.style.visibility=   'hidden';
				login_div.style.visibility=   'hidden';
				architect.style.visibility=   'hidden';
			}
			
			switch(page_key) {
			
			case 'major_function':
				page_path = "callpage.html?pageName=major-function";
				showLoadingBar();
				break;
			case 'success_story':
				page_path = "callpage.html?pageName=success-story";
				showLoadingBar();
				break;
			case 'join_process':
				page_path = "callpage.html?pageName=join-process";
				showLoadingBar();
				break;
			case 'customer_service':
				page_path = "callpage.html?pageName=customer-service";
				showLoadingBar();
				break;				
			case 'ucad':
				page_path = "callpage.html?pageName=ucad";
				showLoadingBar();
				break;	
			case 'mes':
				page_path = "callpage.html?pageName=mes";
				showLoadingBar();
				break;			
			case 'orderedsw':
				page_path = "callpage.html?pageName=orderedsw";
				showLoadingBar();
				break;	
			case "server":
				page_path = "callpage.html?pageName=server";
				showLoadingBar();
				break;	
			case "hajin":
				page_path = "callpage.html?pageName=hajin";
				showLoadingBar();
				break;	
			case "rfxsoft":
				page_path = "callpage.html?pageName=rfxsoft";
				showLoadingBar();
				break;					
			default:
				page_path = "no_security.html?searchType=div-info";
				page_path = page_path +  "&menuKey=" + GselectedMenu + "&searchKey=" + page_key;
				break;
			}
			document.all["ContentFrameMain"].src = page_path;
			//CommonInfo_getForward( loadforwardMain, '/' + page_path);
			SafeSetValue('login_page', '');
			SafeSetValue('search_condition', '');
		
			postHandler(GselectedMenu, GselectedCom);
		}

	}
	
	function refreahSearchSpan() {

		var srch_word = eval("document.GeneralBaseForm1.srch_word");//$("srch_word");

		var search_result = $("search_result");
		var search_result_head = $("search_result_head");
		var search_result_bottom = $("search_result_bottom");
		var srch_type = SafeGetValue('srch_type');

	}

	function getDivInfo( type, param1, param2 )
	{	
		var menuType = getMenuType(type);
		
		//사용하지 않는 메뉴
		if(getMenuType(type)==-1){
			return;
		}

		//로그인 메뉴인지/로그오프 메뉴인지.
		var need_login = getViwLogin(type);
		
		if(need_login==true && GloginState==false) {
			alert(JRFXLOGIN_42);
			return;
		}

		//모드 설정
		if(type=='non03') {
			RFX_MODE = true;
		} else if(type=='non04') {
			RFX_MODE = false;
		}
		
		refreahSearchSpan();
		
		//에니메이션 효과
		//animCount = 0;
		//animTimer = setInterval("menuAnimation()", 40);

		var label 		= getLabel(type);
		var label_eng	= getLabelEng(type);
		var page_key 	= getPageKey(type);
		var title_help 	= getTitleHelp(type);

		GselectedMenu = type;
		
		//로그인이 필요한 메뉴면.
		var menuType = getMenuType(type);
		if(GloginState==false && menuType != 0) {
			page_key = 'need_login';
		}
		
		SafeSetValue('menu_key', type );
		
		if(page_key=='main_page') {
			top.location.href="index.html";
			return;
		}else if(page_key=='shop') {
			var supplier_code = SafeGetValue('supplier_code' );
			top.location.href="bizhome.html?id=" + supplier_code;
			return;
		}else if(page_key=='notice') {
			var supplier_code = SafeGetValue('supplier_code' );
			this.location.href="board-list.do?boardId=notice" + supplier_code;
			return;
		}else if(page_key=='pds') {
			var supplier_code = SafeGetValue('supplier_code' );
			this.location.href="board-list.do?boardId=pds" + supplier_code;
			return;
		}else if(page_key=='qna') {
			var supplier_code = SafeGetValue('supplier_code' );
			this.location.href="board-list.do?boardId=qna" + supplier_code;
			return;
		}

		getDirectInfo( page_key, label + ' <font size=1>' + label_eng + '</font>', title_help, param1, param2 );
		createLabel();
		

	}
	
	
	var simpleTarget;

	function loadforwardSimple(my_data)
	{ 
		SafeSetValue(simpleTarget, my_data);	
		
		//Cursor 설정
		if(simpleTarget=='login_page') {
		
			getid(document.GeneralBaseForm1);

			if(document.GeneralBaseForm1.checksaveid.checked==true) {
				
				$('password').focus();
			} else {
				var obj = $('com_code');
				if(obj != null) {
					obj.focus();
					obj.select();
				}
			}
			
		}
		
	}	
	
	function getDivInfoSimple( type, target )
	{
		doingProcessWidget(target);
		
		var page_path = "/no_security.html?searchType=div-info";
		page_path = page_path + "&searchKey=" + type
		
		simpleTarget = target;
		
		//SafeSetValue(target, GwaitingMessageServ);
		CommonInfo_getForward(loadforwardSimple, page_path);
		return;
	}
	function getDivInfoSimpleMsg( type, target, obj )
	{
		SafeSetValue('command_line', '<center><marquee behavior=slide scrollAmount=5 direction=up height=20 width=200>'
				+obj.innerHTML
				+'</marquee></center>');
		getDivInfoSimple( type, target );
	}
	var animGap = 0;

	function menuAnimation()
	{
		animCount++;	
		
		if(animCount>10)
		{
			clearTimeout(animTimer);
			//$('dot_pos').style.left = LogoPosition;
			animGap = 0;
			//$('jang_biman').style.color = '#9B9813';
			//SafeSetValue('jang_biman', '<b>장</b>인, <b>비</b>즈니스<b>맨</b>');
			return;
		}
		//$('jang_biman').style.color = 'red';
		
		$('title_span').style.left = TitlePosition +5 - animCount;
		

		if(animCount<5) {
			animGap = animGap- 2;
		} else {
			animGap = animGap+ 2;
		}
		
		//$('dot_pos').style.left = LogoPosition +animGap;

	}

	function changeBackground(type, obj, color)
	{
		if(getMenuType(type)==-1){
			return;
		}
		
		//var title_help 	= getTitleHelp(type);
		//SafeSetValue('title_help', title_help);
		
		obj.style.borderColor = color;
	}
	function changeBackgroundObj(obj, color)
	{
		obj.style.borderColor = color;
		if(color!='white') {
			obj.style.background = '#FFFFDD';
		} else {
			obj.style.background = color;
		}
	}

	function makeHaderLine() {
		SafeSetValue('search_result_bottom_right', "");
		SafeSetValue('search_result_bottom_left', "");
		SafeSetValue('search_result_bottom_center', "");
		
		var srch_type = SafeGetValue('srch_type');
		

		var head_line = '<div onmousedown="javascript:closeResultSpan();" style="cursor: pointer;"><table border=0 cellpadding=0 cellspacing=0><tr><td style="padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;"><table width=905  border=1 cellpadding=0 cellspacing=0	bordercolor=#CCCCCC style="border-collapse:collapse;padding-right:0;"><tr>';
		var bottom_line = '';
		if(srch_type=='com_name') {
			head_line = head_line +	'<td  width=6% align="center" class="table_title_slim">' + J2MSG_C01_JSP_12 + '</td>';
			head_line = head_line +	'<td  width=4% align="center" class="table_title_slim">' + views_entry_edit_type + '</td>';
			head_line = head_line +	'<td width=18% align="center" class="table_title_slim">' + J2MSG_A10_JSP_01 + '</td>';
			head_line = head_line +	'<td  width=8% align="center" class="table_title_slim">' + J2MSG_DWR_WA_REC_02 + '</td>';
			head_line = head_line +	'<td width=26% align="center" class="table_title_slim">' + JRFXLOGIN_45 + '</td>';
			head_line = head_line +	'<td  width=8% align="center" class="table_title_slim">' + J2MSG_F20_JSP_08 + '</td>';
			head_line = head_line +	'<td width=20% align="center" class="table_title_slim">' + JRFXLOGIN_46 + '</td>';
			head_line = head_line +	'<td width=10% align="center" class="table_title_slim">' + J2MSG_A06_JSP_07 + '</td>';
			head_line = head_line +	'</tr>';
			
			bottom_line = JRFXLOGIN_47;
		} else {
			head_line = head_line +	'<td width=9% align="center" class="table_title_slim">' + J2MSG_C01_JSP_12 + '</td>';
			head_line = head_line +	'<td width=20% align="center" class="table_title_slim">' + J2MSG_A07_JSP_67 + '</td>';
			head_line = head_line +	'<td width=40% align="center" class="table_title_slim">' + J2MSG_B07V_JSP_01 + '</td>';
			head_line = head_line +	'<td width=10% align="center" class="table_title_slim">' + J2MSG_A07_JSP_68 + '</td>';
			head_line = head_line +	'<td width=14% align="center" class="table_title_slim">'  + J2MSG_J05_JSP_22 + '</td>';
			head_line = head_line +	'<td width=7% align="center" class="table_title_slim">' + J2MSG_J01_JSP_08 + '</td>';
			head_line = head_line +	'</tr>';
			
			bottom_line = '';
		}
		head_line = head_line +	'</table></td><td style="padding-left:6;padding-right:0;padding-top:0;padding-bottom:0;"><a href="javascript:closeResultSpan();" style="padding-left:2;padding-right:0;font-size:11px"><b>X</b></a></td></tr></table></div>'; 

		SafeSetValue('search_result_head', head_line);
		SafeSetValue('search_result_bottom_left', bottom_line);
	}
	
	function doSearch() {
		doSearch(0);
	}
	var srch_type;
	function doSearch(start_point) {

		var srch_word  = SafeGetValue('srch_word');
		var srch_word1 = SafeGetValue('srch_word1');
		var srch_word2 = SafeGetValue('srch_word2');
		var srch_word3 = SafeGetValue('srch_word3');
		var srch_word4 = SafeGetValue('srch_word4');
		var srch_word5 = SafeGetValue('srch_word5');
		
		if(		srch_word==''
				&& srch_word1==''
				&& srch_word2==''
				&& srch_word3==''
				&& srch_word4==''
				&& srch_word5==''
		) {
			return;
		}
		
		srch_type = SafeGetValue('srch_type');
		
		makeHaderLine();
		RESULT_SPAN_OPEN = true;
		SafeSetValue('search_result', GwaitingMessage);
		
		
		//refreahSearchSpan();
		
		search_result.style.visibility = 'visible';
		search_result_head.style.visibility = 'visible';
		search_result_bottom.style.visibility = 'visible';
		search_result.style.height = 240;
		search_result_head.style.height = 20;
		search_result_bottom.style.height = 0;


		var myJSONObject =
        {
			"uid_comast": UID_GLOB_COMAST,
			"user_uid": UID_GLOB_USER_KEY,
			"srch_word" : srch_word,
			"srch_word1": srch_word1,
			"srch_word2": srch_word2,
			"srch_word3": srch_word3,
			"srch_word4": srch_word4,
			"srch_word5": srch_word5,
			"start_point": start_point
		};

		var myJSONText = JSON.stringify(myJSONObject)/*CHANGED*/ ;myJSONText = stripSpecialChar(myJSONText);
		var page_path = "/no_security.html?searchType=search-action";
		page_path = page_path +  "&menuKey=" + srch_type + "&searchKey=" + myJSONText;
		
		CommonInfo_getForward( loadforwardSearch, page_path);
		
		
	}
	
	var prod_page_var ='';
	var prod_search_cond ='';
	
	function loadforwardSearch(my_data)
	{

		SafeSetValue('search_result', my_data);
		
		if( srch_type == 'prod_spec') {
			RESULT_DATA = my_data;
			prod_page_var =  SafeGetValue('pageBar');
			prod_search_cond = SafeGetValue('searchCond');
			SafeSetValue('search_result_bottom_right', prod_page_var);
			SafeSetValue('search_result_bottom_left',  prod_search_cond);
			SafeSetValue('search_result_bottom_center',  JRFXLOGIN_48);
			
			RESULT_DATA_BOTTOM_RIGHT = prod_page_var;
			RESULT_DATA_BOTTOM_LEFT = prod_search_cond;
			RESULT_DATA_BOTTOM_CENTER = JRFXLOGIN_48;
			
		} else {
			RESULT_DATA_COM = my_data;
		}
		
	}

	function checkMultiCond()
	{
		if($("multi_cond").checked == true)
		{
			DETAIL_SRCH = true;
		}
		else
		{
			DETAIL_SRCH = false;
		}
		setSearchDetail();
	}
	
	function checkMultiCond1() {
		var multi_cond = $("multi_cond");
		if(multi_cond.checked == true)
		{
			multi_cond.checked = false;
		}
		else
		{
			multi_cond.checked = true;
		}
		checkMultiCond();
	}
	
	
	function setSearchDetail1(no) {
		document.GeneralBaseForm1.srch_type[no].checked = true;
		setSearchDetail();
		doSearch(0);
	}
	
	function clickSrchTypeRadio(pos) {
		
		document.GeneralBaseForm1.srch_type[pos].checked = true;
		setSearchDetailAndDo();
	}
	function setSearchDetailAndDo() {
		var srch_type = SafeGetValue('srch_type');
		if(srch_type=='prod_spec') {
			$('srch_word').style.background = 'white';
		}else {
			$('srch_word').style.background = '#ECF5FB';
		}
		
		setSearchDetail();
		doSearch(0);
	}

	function setSearchDetail() {
		
		var def_line = '<u>' + SHOP_NAME + JRFXLOGIN_44 + '</u>';
		
		if(SHOP_CODE=='') {
			def_line = ROOTLAYOUT1_jsp_48;
		}
		if(DETAIL_SRCH==false) {
			SafeSetValue('search_detail_span', def_line);
			$('srch_word').select();
		} else {
			var msg = '';
			
			var mode = SafeGetValue('srch_type');
			if(mode=='prod_spec') {
				msg = msg + '<center><table border=0 cellspacing=0 cellpadding=0 width=510>';
				msg = msg + '<tr>';
				msg = msg + '<td align=center class=search_detail_span_upper width=20%>' + J2MSG_C01_JSP_12 + '</td>';
				msg = msg + '<td align=center class=search_detail_span_upper width=20%>' + J2MSG_A07_JSP_67 + '</td>';
				msg = msg + '<td align=center class=search_detail_span_upper width=20%>' + J2MSG_A07_JSP_74 + '</td>';
				msg = msg + '<td align=center class=search_detail_span_upper width=20%>' + J2MSG_A07_JSP_68 + '</td>';
				msg = msg + '<td align=center class=search_detail_span_upper1 width=20%>' + J2MSG_J05_JSP_22 + '</td>';
				msg = msg + '</tr>';
				msg = msg + '<tr>';
				msg = msg + '<td align=center class=search_detail_span_lower ><input class=light_input name=srch_word1 type=text onkeypress="DWRUtil.onReturn(event, doSearch)" size=14></td>';
				msg = msg + '<td align=center class=search_detail_span_lower ><input class=light_input name=srch_word2 type=text onkeypress="DWRUtil.onReturn(event, doSearch)" size=14></td>';
				msg = msg + '<td align=center class=search_detail_span_lower ><input class=light_input name=srch_word3 type=text onkeypress="DWRUtil.onReturn(event, doSearch)" size=14></td>';
				msg = msg + '<td align=center class=search_detail_span_lower ><input class=light_input name=srch_word4 type=text onkeypress="DWRUtil.onReturn(event, doSearch)" size=14></td>';
				msg = msg + '<td align=center class=search_detail_span_lower1 ><input class=light_input name=srch_word5 type=text onkeypress="DWRUtil.onReturn(event, doSearch)" size=14></td>';
				msg = msg + '</tr>';
				msg = msg + '</table></center>';
				
			} else if(mode=='com_name') {
				msg = msg + '<center><table border=0 cellspacing=0 cellpadding=0 width=510>';
				msg = msg + '<tr>';
				msg = msg + '<td align=center class=search_detail_span_upper width=20%>' + J2MSG_C01_JSP_12 + '</td>';
				msg = msg + '<td align=center class=search_detail_span_upper width=20%>' + J2MSG_F20_JSP_08 + '</td>';
				msg = msg + '<td align=center class=search_detail_span_upper width=20%>' + JRFXLOGIN_45 + '</td>';
				msg = msg + '<td align=center class=search_detail_span_upper width=20%>' + J2MSG_A10_JSP_02 + '</td>';
				msg = msg + '<td align=center class=search_detail_span_upper1 width=20%>' + views_entry_edit_type + '</td>';
				msg = msg + '</tr>';
				msg = msg + '<tr>';
				msg = msg + '<td align=center class=search_detail_span_lower ><input class=light_input name=srch_word1 type=text onkeypress="DWRUtil.onReturn(event, doSearch)" size=14></td>';
				msg = msg + '<td align=center class=search_detail_span_lower ><input class=light_input name=srch_word2 type=text onkeypress="DWRUtil.onReturn(event, doSearch)" size=14></td>';
				msg = msg + '<td align=center class=search_detail_span_lower ><input class=light_input name=srch_word3 type=text onkeypress="DWRUtil.onReturn(event, doSearch)" size=14></td>';
				msg = msg + '<td align=center class=search_detail_span_lower ><input class=light_input name=srch_word4 type=text onkeypress="DWRUtil.onReturn(event, doSearch)" size=14></td>';
				msg = msg + '<td align=center class=search_detail_span_lower1 ><select class=light_input name=srch_word5 onkeypress="DWRUtil.onReturn(event, doSearch)" style="width:100;">';
				msg = msg + '<option value="">' + JRFXLOGIN_49 + '</option>';
				msg = msg + '<option value=E>' + JRFXLOGIN_50 + '</option>';
				msg = msg + '<option value=Q>' + JRFXLOGIN_51 + '</option>';
				msg = msg + '<option value=O>' + JRFXLOGIN_52 + '</option>';
				msg = msg + '<option value=M>' + JRFXLOGIN_53 + '</option>';
				msg = msg + '<option value=S>' + JRFXLOGIN_54 + '</option>';
				msg = msg + '<option value=A>' + JRFXLOGIN_55 + '</option>';
				msg = msg + '<option value=C>' + JRFXLOGIN_56 + '</option>';
				msg = msg + '<option value=I>' + J2MSG_C02E_JSP_05 + '</option>';
				msg = msg + '</select>';
				msg = msg + '</tr>';
				msg = msg + '</table></center>';
			
			}
			SafeSetValue('search_detail_span', msg);
			
			$('srch_word1').select();
			
		}
		
		//창 내용 변경
		if(RESULT_SPAN_OPEN == false) {
			onclickOpenClose('close');
		} else {
			onclickOpenClose('open');
		}
		
		//doSearch(0);
		
		
	}
	
	
	function refreahData() {
		alert('refreahData');
	}
	
	function doReguestQuata() {
		alert('doReguestQuata');
	}
	function addMaterial() {
		alert('addMaterial');
	}
	function addExcelMaterial() {
		alert('addExcelMaterial');
	}
	function addPartner() {
		alert('addPartner');
	}
	
	function doBlink() { 
		var blink = document.all.tags("BLINK") 
		for (var i=0; i < blink.length; i++) 
		    blink[i].style.visibility = blink[i].style.visibility == "" ? "hidden" : "" 
	} 


	function onclickReset() {
		
	}
	
	var new_added_id = -1;
	var old_added_id = -1;
	
	function refreshEditingLine() {

		if(new_added_id==-1) {
			return;
		}
		
		if(old_added_id!= -1) {
			var oldObj = $("pattern" + old_added_id);
			if(oldObj!=null) {
				oldObj.style.background = '#F5F5DC';
			}
		}
		old_added_id = new_added_id;
		
		
		var obj = $("pattern" + new_added_id);
		
		if(obj!=null) {
			if(RFX_MODE==true) {
				obj.style.background = COLOR_MENU_BUY;
			} else {
				obj.style.background = COLOR_MENU_SELL;
			}
		}
	
	}
	
	function addToRFQ (srcahd_uid, supplier_code) {
		
		//alert(srcahd_uid);
		
		
		if(GloginState==false) {
			alert(JRFXLOGIN_42);
			return;
		}
		
		if(	RFX_MODE == true ) {
			getDivInfo('non03');
		} else {
			getDivInfo('non04');
		}
		var item_code = srcahd_uidCache[ srcahd_uid];
		//alert(srcahd_uid + ':' + item_code);
		if(item_code!=null) {
			alert(JRFXLOGIN_57);
		} else {
			closeResultSpan();
			CommonInfo.getListCartLineByAddingCatalog (UID_GLOB_COMAST, UID_GLOB_USER_KEY, GLogin_user_id, srcahd_uid, function(listCartLine) {
			    // Delete all the rows except for the "pattern" row
			    dwr.util.removeAllRows("cartbody", { filter:function(tr) {
			      return (tr.id != "pattern");
			    }});
			    addToTableLine(listCartLine);
		    });
		
		}
		var supastUid = supast_codeCache[ supplier_code ];
	
		if(supastUid!=null) {
			//alert(JRFXLOGIN_65);
		} else {
		
			CommonInfo.getListSupLineUpByAddingCode (UID_GLOB_USER_KEY, supplier_code, UID_GLOB_COMAST, MY_USER_ID, GLogin_user_email, function(listLineUp) {
			    // Delete all the rows except for the "pattern" row
				hasReceiver =false;
			    dwr.util.removeAllRows("receiverbody", { filter:function(tr) {
			      return (tr.id != "pattern_recv");
			    }});
	
			    addToTableReceiver(listLineUp);
	
		    });
		}
		
	}

	
	function fillUserInfo() {
		CommonInfo.getMyInfo (UID_GLOB_USER_KEY, function(myinfo) {
		if(myinfo==null) {
			return;
		}
		if(myinfo.ep_company_name==null) {
			return;
		}
			dwr.util.setValue("company_name", myinfo.ep_company_name );
			dwr.util.setValue("requester_name", myinfo.user_name );
			dwr.util.setValue("requester_email_address", myinfo.email );
			dwr.util.setValue("requester_telephone_no", myinfo.tel_no );
			dwr.util.setValue("requester_mobilephone_no", myinfo.hp_no );
			dwr.util.setValue("ceo_name", myinfo.ep_dept_name );
			dwr.util.setValue("requester_address", myinfo.address_1 );
			
			fillUserInput();

	    });
		
	}
	
	function fillSupplierInfo(uidSupast) {
		CommonInfo.getSupplierInfo (uidSupast, function(supInfo) {

			if(myinfo==null) {
				return;
			}
			if(myinfo.ep_company_name==null) {
				return;
			}
			
			dwr.util.setValue("company_name", supInfo.ep_company_name );
			dwr.util.setValue("requester_name", supInfo.user_name );
			dwr.util.setValue("requester_email_address", supInfo.email );
			dwr.util.setValue("requester_telephone_no", supInfo.tel_no );
			dwr.util.setValue("requester_mobilephone_no", supInfo.hp_no );
			dwr.util.setValue("ceo_name", supInfo.ep_dept_name );
			dwr.util.setValue("requester_address", supInfo.address_1 );

	    });
		
	}
	
	

	function getCartList(txt_name) {

		CommonInfo.getListCartLine(UID_GLOB_USER_KEY, function(listCartLine) {
		    // Delete all the rows except for the "pattern" row
		    dwr.util.removeAllRows("cartbody", { filter:function(tr) {
		      return (tr.id != "pattern");
		    }});
		    
		    var msg = addToTableLine(listCartLine);
			if(txt_name!=undefined && txt_name!=null && txt_name!='') {
		    	SafeSetValue(txt_name, mail_main_title);
		    }
		  });
	}
	
	function makeSelecttedUidList() {
	    var str ='';
	    for(i=0; i<listUniqueId.length; i++) {
			var obj = $("unique_uid" + listUniqueId[i]);
			if(obj.checked == true) {
	    		if(str != '') {
	    			str = str + ';';
	    		}
	    		str = str + listUniqueId[i];
			}
	    }
	    
	    return str;
	}
	
	function makeSelecttedUidRecvList() {
	    var str ='';
	    for(i=0; i<listUniqueIdRecv.length; i++) {
			var obj = $("lineup_uid" + listUniqueIdRecv[i]);
			if(obj.checked == true) {
	    		if(str != '') {
	    			str = str + ';';
	    		}
	    		str = str + listUniqueIdRecv[i];
			}
	    }
	    
	    return str;
	}
	
	
	function makeReceiverInfo() {
	    var str ='';
	    for(i=0; i<listUniqueIdRecv.length; i++) {
			var obj = $("lineup_uid" + listUniqueIdRecv[i]);
			if(obj.checked == true) {
				str = str + lineupCache[listUniqueIdRecv[i]].sales_email
				+ ': ' + lineupCache[listUniqueIdRecv[i]].sales_name
				+ '[' + lineupCache[listUniqueIdRecv[i]].supplier_name
				+ ']\n';
			}
	    }
	    
	    return str;
	}
	
	
	
	
	function checkMe(obj) {
		var checked = obj.checked;
		var id = obj.id;
		var value = obj.value;
		var unique_id = id.substr(value.length);
		var call_str = null;
		if(checked==true){
			call_str = "Y:" + unique_id;
		} else {
			call_str = "N:" + unique_id;
		}
		var page_path = "/no_security.html?searchType=toggle-receiver";
		page_path = page_path + "&searchKey=" + call_str;
			
		CommonInfo_getForward(dummy_fc, page_path);
	}
	
	
	function checkMeCart(obj) {
		var checked = obj.checked;
		var id = obj.id;
		var value = obj.value;
		var unique_id = id.substr(value.length);
		var call_str = null;
		if(checked==true){
			call_str = "Y:" + unique_id;
		} else {
			call_str = "N:" + unique_id;
		}
		var page_path = "/no_security.html?searchType=toggle-cartline";
		page_path = page_path + "&searchKey=" + call_str;
			
		CommonInfo_getForward(dummy_fc, page_path);
	}
	
	function getReceiverList() {

		CommonInfo.getListReceiverLine(UID_GLOB_COMAST, UID_GLOB_USER_KEY, GLogin_user_id, GLogin_user_email, function(listLineUp) {
		    // Delete all the rows except for the "pattern" row
			hasReceiver =false;
		    dwr.util.removeAllRows("receiverbody", { filter:function(tr) {
		      return (tr.id != "pattern_recv");
		    }});
		    addToTableReceiver(listLineUp);

		  });
	}
	
	function getReceiverListAddingSupplier() {

		CommonInfo.getListReceiverLineAddingSupplier(UID_GLOB_COMAST, UID_GLOB_USER_KEY, GLogin_user_id, GLogin_user_email, function(listLineUp) {

			hasReceiver =false;
		    dwr.util.removeAllRows("receiverbody", { filter:function(tr) {
		      return (tr.id != "pattern_recv");
		    }});

		    addToTableReceiver(listLineUp);

		  });
	}
	
	function editClicked(eleid) {
		//document.location = '#__material_add_pos';
		  var cartline = cartlineCache[eleid.substring(4)];
		  dwr.util.setValues(cartline);
		  new_added_id = Number(eleid.substring(4));
		  refreshEditingLine();
	}
	function editClickedRecv(eleid) {

		  var lineup = lineupCache[eleid.substring(4)];
		  dwr.util.setValues(lineup);
		  new_receiver_id = Number(eleid.substring(4));
		 
		  //등록여부
		  var temp_vendor_flag = lineup.temp_vendor_flag;
		  
		  if(temp_vendor_flag == 'C' || temp_vendor_flag == 'J') {
			  toggleReceiverLock( true );
		  } else {
			  toggleReceiverLock( false );
		  }
		  
		  var unique_id_long = lineup.unique_id_long;
		SafeSetValue("suphst-company-detail", GwaitingMessageServ);
		page_path = "/dong.html?searchType=suphst-company";
		CommonInfo_getForward(displaySupHstCom, page_path + "&searchKey=" + unique_id_long);
		
		 refreshEditingLineRecv();
	}
	
	function printClickedRecv(eleid) {


		  // we were an id of the form "edit{id}", eg "edit42". We lookup the "42"
		  var lineup = lineupCache[eleid.substring(5)];

		  //등록여부
		  //var temp_vendor_flag = lineup.temp_vendor_flag;
		  //var sp_code = lineup.sp_code;
		  //var supast_uid = lineup.supast_uid;
		  var unique_id_long = lineup.unique_id_long;
		  //var supplier_name = lineup.supplier_name;
		  //var sales_name = lineup.sales_name;
		  //var sales_telephone_no = lineup.sales_telephone_no;
		  //var sales_mobilephone_no = lineup.sales_mobilephone_no;
		  
		SafeSetValue("suphst-company-detail", GwaitingMessageServ);
    	page_path = "/dong.html?searchType=suphst-company";
		CommonInfo_getForward(displaySupHstCom, page_path + "&searchKey=" + unique_id_long);

	}
	
	function displaySupHstCom(content)
	{
		SafeSetValue("suphst-company-detail", content);

	}
	
	function initSupHstCom()
	{
		SafeSetValue("suphst-company-detail", GENMAIL_jsp_01);
	}
	
	function deleteClicked(eleid) {
		  // we were an id of the form "delete{id}", eg "delete42". We lookup the "42"
		  var cartline = cartlineCache[eleid.substring(6)];
		  if (confirm(JRFXLOGIN_58 + cartline.item_name + "]")) {
		    dwr.engine.beginBatch();
		    CommonInfo.deleteCartLine(UID_GLOB_USER_KEY, cartline.unique_uid, dummy_fc);
		    getCartList();
		    dwr.engine.endBatch();
		  }
		  clearCartLine();
	}
	
	
	
	function addToCart() {

		  var cartline = { 
				  unique_uid:null,
				  item_code:null,
				  item_name:null,
				  specification:null,
				  maker_name:null,
				  static_sales_price:null,
				  cart_qty:null,
				  model_no:null,
				  description:null };
		  dwr.util.getValues(cartline);
		  
		  if(cartline.item_name==null || cartline.item_name=='') {
			  alert(JRFXLOGIN_59);
			  return;
		  }
		  if(cartline.specification==null || cartline.specification=='') {
			  alert(JRFXLOGIN_60);
			  return;
		  }
		  
		CommonInfo.modifyCartLine (UID_GLOB_USER_KEY, cartline, function(listCartLine) {
		    // Delete all the rows except for the "pattern" row
		    dwr.util.removeAllRows("cartbody", { filter:function(tr) {
		      return (tr.id != "pattern");
		    }});

		    addToTableLine(listCartLine);
	    });
		
		clearCartLine();
	}

	function addToLineUp() {
		  var lineup = { 
				  unique_id_long:null,
				  supast_uid:null,
				  sp_code:null,
				  supplier_name:null,
				  sales_name:null,
				  sales_email:null,
				  sales_telephone_no:null,
				  sales_mobilephone_no:null,
				  sales_fax_no:null,
				  charged_business:null};

		  
		  dwr.util.getValues(lineup);
		  
		  if(
				  (lineup.supplier_name==null || lineup.supplier_name=='') &&
				  (lineup.sales_name==null || lineup.sales_name=='') &&
				  (lineup.sales_email==null || lineup.sales_email=='')
		  ) { return; }
		  

		  if(lineup.supplier_name==null || lineup.supplier_name=='') {
			  alert(JRFXLOGIN_61);
			  return;
		  }
		  if(lineup.sales_name==null || lineup.sales_name=='') {
			  alert(JRFXLOGIN_62);
			  return;
		  }
		  if(lineup.sales_email==null || lineup.sales_email=='') {
			  alert(JRFXLOGIN_63);
			  return;
		  }		  
		  
		  CommonInfo.modifyLineUp (UID_GLOB_COMAST, UID_GLOB_USER_KEY, lineup, GLogin_user_email, function(listLineUp) {
			    // Delete all the rows except for the "pattern" row
			  hasReceiver =false;  
			  dwr.util.removeAllRows("receiverbody", { filter:function(tr) {
				      return (tr.id != "pattern_recv");
				    }});

				    addToTableReceiver(listLineUp);
		    });
			
		  //clearReceiver();
		}
	
	function clearCartLine() {
	  dwr.util.setValues({ unique_uid:null,
		  item_code:null,
		  item_name:null,
		  specification:null,
		  maker_name:null,
		  static_sales_price:0,
		  cart_qty:1,
		  model_no:null,
		  description:null });
	  /*
		if(old_added_id!= -1) {
			$("pattern" + old_added_id).style.background = '#F5F5DC';
		}
	  */
	}

	var new_receiver_id = -1;
	var old_receiver_id = -1;
	function clearReceiver() {
		  toggleReceiverLock( false );
		  dwr.util.setValues({ 
			  supast_uid:null,
			  unique_id_long:null,
			  sp_code:null,
			  supplier_name:null,
			  sales_name:null,
			  sales_email:null,
			  sales_telephone_no:null,
			  sales_mobilephone_no:null,
			  sales_fax_no:null,
			  charged_business:null});
		  
			if(old_receiver_id!= -1) {
				$("pattern_recv" + old_receiver_id).style.background = '#F5F5DC';
			}
			
			
		}
	function clearReceiverInitSupHst() {
		clearReceiver();
		initSupHstCom();
	}
	
	function deleteClickedRecv(eleid) {
		  // we were an id of the form "delete{id}", eg "delete42". We lookup the "42"
		  var lineup = lineupCache[eleid.substring(6)];
		  if (confirm(JRFXLOGIN_64 + lineup.sales_email + "]?")) {
		    dwr.engine.beginBatch();
		    CommonInfo.deleteReceiverLineUp(UID_GLOB_USER_KEY, lineup.unique_id_long, dummy_fc);
		    getReceiverList();
		    dwr.engine.endBatch();
		  }
		  clearReceiver();
		}

	function addToReceiver(supastUid) {
		
		
		if( GselectedMenu != 'non10'
			&& GselectedMenu != 'non11'
				&& GselectedMenu != 'non03' ) {
			
			if(	RFX_MODE == true ) {
				getDivInfo('non03');
			} else {
				getDivInfo('non04');
			}
		}

		var supplier_code = supast_uidCache[ supastUid];
		
		if(supplier_code!=null) {
			alert(JRFXLOGIN_65);
			return;
		}

		CommonInfo.getListSupLineUpByAdding (UID_GLOB_USER_KEY, supastUid, UID_GLOB_COMAST, MY_USER_ID, GLogin_user_email, function(listLineUp) {
		    // Delete all the rows except for the "pattern" row
			hasReceiver =false;
			dwr.util.removeAllRows("receiverbody", { filter:function(tr) {
		      return (tr.id != "pattern_recv");
		    }});

		    addToTableReceiver(listLineUp);

	    });
		
		//document.location = '#__receiver_pos';
		
	}
	
	function isAddedSupAst(supplier_code) {
		
	}

	function addToReceiverByCode(supplier_code) {
		
		if(GloginState==false) {
			alert(JRFXLOGIN_42);
			return;
		}
		
		if( GselectedMenu != 'non10'
			&& GselectedMenu != 'non11'
				&& GselectedMenu != 'non03'
					&& GselectedMenu != 'non19'
						&& GselectedMenu != 'non08') {
			
			if(	RFX_MODE == true ) {
				getDivInfo('non03');
			} else {
				getDivInfo('non04');
			}
		}
		var supastUid = supast_codeCache[ supplier_code ];
	
		if(supastUid!=null) {
			alert(JRFXLOGIN_65);
			return;
		}
		closeResultSpan();
		CommonInfo.getListSupLineUpByAddingCode (UID_GLOB_USER_KEY, supplier_code, UID_GLOB_COMAST, MY_USER_ID, GLogin_user_email, function(listLineUp) {
		    // Delete all the rows except for the "pattern" row
			hasReceiver =false;
		    dwr.util.removeAllRows("receiverbody", { filter:function(tr) {
		      return (tr.id != "pattern_recv");
		    }});

		    addToTableReceiver(listLineUp);

	    });

		
		//document.location = '#__receiver_pos';
		
	}

	
	function refreshEditingLineRecv() {

		if(new_receiver_id==-1 || new_receiver_id==null)
			return;


		if(old_receiver_id!= -1 && old_receiver_id!=null) {
			var obj = $("pattern_recv" + old_receiver_id);
			if(obj!=null)
				obj.style.background = '#F5F5DC';
		}
		old_receiver_id = new_receiver_id;

		if(RFX_MODE==true) {
			var obj =$("pattern_recv" + new_receiver_id);
			if(obj!=null)
				obj.style.background = COLOR_MENU_BUY;
		} else {
			var obj =$("pattern_recv" + new_receiver_id);
			if(obj!=null)
				obj.style.background = COLOR_MENU_SELL;
		}

	
	}
	
	function addToTableReceiver(listLineUp) {
		
	    // Create a new set cloned from the pattern row
	    var lineup, id;
	    
	    lineupCache =  { };
	    supast_uidCache =  { };
	    supast_codeCache = { };
	    
	    listUniqueIdRecv.clear();

	   if(listLineUp==null || listLineUp.length==0) {
		   return;
	   }
	   
	   for (var i = 0; i < listLineUp.length; i++) {
	    	lineup = listLineUp[i];
	    	if(lineup!=null) {

		    	hasReceiver =true;
		    	id = lineup.unique_id_long;
		    	
		    	listUniqueIdRecv.push(id);
		    	
				dwr.util.cloneNode("pattern_recv", { idSuffix:id });
				dwr.util.setValue("sp_code" + id, lineup.sp_code);
				dwr.util.setValue("supast_uid" + id, lineup.supast_uid);
				dwr.util.setValue("unique_id_long" + id, lineup.unique_id_long);
				dwr.util.setValue("supplier_name" + id, lineup.supplier_name);
				dwr.util.setValue("sales_name" + id, lineup.sales_name);
				dwr.util.setValue("sales_telephone_no" + id, lineup.sales_telephone_no);
				dwr.util.setValue("sales_mobilephone_no" + id, lineup.sales_mobilephone_no);
				$("pattern_recv" + id).style.display = "block";
				
				var sms_bs_rfq_flag = lineup.sms_bs_rfq_flag;
				if(sms_bs_rfq_flag == 'Y') {
					dwr.util.setValue("sales_email" + id, JRFXLOGIN_66);
					$("sales_email" + id).style.color = "red";
				} else {
					dwr.util.setValue("sales_email" + id, lineup.sales_email);
				}
	
				lineupCache[id] = lineup;
				supast_uidCache[lineup.supast_uid] = lineup.sp_code;
				supast_codeCache[lineup.sp_code] = lineup.supast_uid;
				
				var sms_rfq_flag = lineup.sms_rfq_flag;
				if(sms_rfq_flag == 'Y') {
					$("lineup_uid" + id).checked = true;
				} else {
					$("lineup_uid" + id).checked = false;
				}
	
		    	if(lineup.rownum == -100) {
		    		//새로추가된 것인지 체크
		    		new_receiver_id = id;
		    		var lineup = lineupCache[id];
		    		dwr.util.setValues(lineup);
		    		old_receiver_id = new_receiver_id;
		    		if(RFX_MODE==true) {
		    			$("pattern_recv" + new_receiver_id).style.background = COLOR_MENU_BUY;
		    		} else {
		    			$("pattern_recv" + new_receiver_id).style.background = COLOR_MENU_SELL;
		    		}
		    		
		    		
			  		  var temp_vendor_flag = lineup.temp_vendor_flag;
					  
					  if(temp_vendor_flag == 'C' || temp_vendor_flag == 'J') {
						  toggleReceiverLock( true );
					  } else {
						  toggleReceiverLock( false );
					  }
				  
				  
		    	}
		    	
	    	}else {
	    		//alert(i);
	    	}
	    }
	}
	
	function addToTableLine(listCartLine) {
		
		if(listCartLine==null) {
			return;
		}
		if(listCartLine.length==0) {
			return;
		}
		
	    // Create a new set cloned from the pattern row
	    var cartline, id;

	    
	    cartlineCache =  { };
	    srcahd_uidCache =  { };
	    
	    
	    var qty_sum = 0.0;		//수량 합계
	    var total_sum = 0.0;	//가격 합계
	    
	    mail_main_title = '';
	    
	    listUniqueId.clear();

	    for (var i = 0; i < listCartLine.length; i++) {
	    	cartline = listCartLine[i];
	    	qty_sum = qty_sum + cartline.cart_qty;
	    	total_sum = total_sum + cartline.static_sales_price*cartline.cart_qty;
	    	
	    	id = cartline.unique_uid;

			dwr.util.cloneNode("pattern", { idSuffix:id });
			dwr.util.setValue("no" + id, i+1);
			dwr.util.setValue("unique_uid" + id, id);
			
			listUniqueId.push(id);
			

			var obj = $("unique_uid" + id);
			obj.value = id;
			if(obj.checked == false) {
				obj.checked = true;
				//listUniqueId[1].push(true);
			}
			
			dwr.util.setValue("item_code" + id, cartline.item_code);
			dwr.util.setValue("item_name" + id, cartline.item_name);
			
			var specification = "<b>" + cartline.specification + "</b>";
			var model_no = " <font color=green>" + cartline.model_no + "</font> [";
			var description = cartline.description + "]";
			
			var my_spec = "<b>" + cartline.specification + "</b>";
			if(cartline.model_no!=null && cartline.model_no!='') {
				my_spec = my_spec + " <font color=green><i>" + cartline.model_no + "</i></font>";
			}
			if(cartline.description!=null && cartline.description!='') {
				my_spec = my_spec + " [" + cartline.description + "]";
			}
			
			dwr.util.setValue("specification" + id, my_spec, { escapeHtml:false } );
			dwr.util.setValue("model_desc_maker" + id, cartline.maker_name);
			dwr.util.setValue("static_sales_price" + id, cartline.static_sales_price_str );
			dwr.util.setValue("cart_qty" + id, cartline.cart_qty_str);
			dwr.util.setValue("sales_amount" + id, cartline.static_sales_amount_str);
			$("pattern" + id).style.display = "block";

			cartlineCache[id] = cartline;
			//alert(cartline.unique_id_long + ':' + cartline.item_code);
			srcahd_uidCache[cartline.item_code] = cartline.item_code;
			
			if(mail_main_title=='') {
				mail_main_title = getRfqMailHeader(cartline.item_name);
			}

			var reserved_integer1 = cartline.reserved_integer1;
			if(reserved_integer1 == 0) {
				$("unique_uid" + id).checked = false;
			} else {
				$("unique_uid" + id).checked = true;
			}
			
	    	if(cartline.parent == -100) {
	    		//새로추가된 것인지 체크
	    		new_added_id = id;
	    		var cartline = cartlineCache[id];
	    		dwr.util.setValues(cartline);
	    	}
	    }
	    refreshEditingLine();
	    
	    SafeSetValue("qty_sum", addComma( ''+ qty_sum ) );
	    SafeSetValue("total_sum", addComma( ''+ total_sum ) );
	    
	    //document.location = '#__material_add_pos';
	    
	    //mail_main_title = mail_main_title + qty_sum + JRFXLOGIN_69;
	    return mail_main_title;

	}
    
	function getRfqMailHeader(item_name) {
		return JRFXLOGIN_67 + item_name + " " + JRFXLOGIN_68;
	}
	
	function toggleReceiverLock( state ){

	    whenNullCanEdit("supplier_name", state);
	    whenNullCanEdit("sales_name", state);
	    whenNullCanEdit("sales_email", state);
	    whenNullCanEdit("sales_telephone_no", state);
	    whenNullCanEdit("sales_mobilephone_no", state);
	}
	
	function whenNullCanEdit( input_name, state ) {
	    //값이 없으면 추가할 수 있다.
		
	    if(SafeGetValue(input_name) == '') {
	    	$(input_name).disabled = false;
	    	$(input_name).background = 'white';
	    } else {
	    	$(input_name).disabled = state;
	    	if( state == true) {
	    		$(input_name).background = 'beige';
	    	} else {
	    		$(input_name).background = 'white';
	    	}
	    }
	}
	
	function printExcel(line_uid) {
		
		var req_delivery_date = SafeGetValue('req_delivery_date');
		var to_date = SafeGetValue('to_date');
		
		
		var w = screen.availWidth / 1.5;
		var h = screen.availHeight / 1.5;
		
		var win_option = 
			"menubar=yes," +
			"resizable=yes," +
			"width="+w+",height="+h;
		
		var html_str = "excel_view.html" + 
			"?&excel_page=EXCEL_LOGINRFQ" + 
			"&rtgast_uid=" + line_uid.substring(4) +
			"&dateTo=" + to_date +
			"&req_delivery_date=" + req_delivery_date
			;

		newWin1 = window.open(html_str, "newWin1", win_option);
		newWin1.moveTo(0,0);
		
	}
	
	
	function fillToday2day(input_text) {
		today = today_global;
		var today2 = new Date();
		today2.setTime(today.getTime()+ ( 2*24*60*60*1000));//2틀추가
		yyyy= today2.getFullYear();
		mm 	= today2.getMonth()+1;
		dd	= today2.getDate();
		if(mm < 10) {
			mm = "0" + mm;
		}
		
		if(dd < 10) {
			dd = "0" + dd;
		}
		
		fstr = yyyy + "/" + mm + "/" + dd;
		if(input_text != null) {
			input_text.value = fstr;
		}
	}
	
	function sendMailQuotaConfirm() {
		var txt_name = SafeGetValue('txt_name');
		var txt_content = SafeGetValue('txt_content');
		var txt_content_sub = SafeGetValue('txt_content_sub');
		var req_delivery_date = SafeGetValue('req_delivery_date');
		var to_date = SafeGetValue('to_date');
		
		var selectedList = makeSelecttedUidList();
		
		var file_item_name_list = getAttachedFileContent();
		
		
		var seleted_lineup_uid = makeSelecttedUidRecvList();
		
		if(seleted_lineup_uid=='') {
			alert(JRFXLOGIN_70);
			return;
		} else {
			var yes_no = confirm(JRFXLOGIN_71 + '\n\n' + makeReceiverInfo());
		    if (yes_no != true) {
		    	return false;
		    }
		}
		
		//Server Update
		var myJSONObject =
        {
			"seleted_lineup_uid": seleted_lineup_uid,
			"selectedList": selectedList,
			"txt_name": txt_name,
			"txt_content": txt_content,
			"txt_content_sub": txt_content_sub,
			"req_delivery_date": req_delivery_date,
			"to_date": to_date,
			"file_item_name_list": file_item_name_list
		};

		var myJSONText = JSON.stringify(myJSONObject)/*CHANGED*/ ;myJSONText = stripSpecialChar(myJSONText);

		var page_path = "/no_security.html?searchType=sendmail-quota";
		page_path = page_path + "&menuKey=" + GselectedMenu;
		page_path = page_path + "&searchKey=" + myJSONText;
		page_path = page_path + "&file_group_code=" + SafeGetValue("file_upload_key");

		GselectedMenu = 'non12';
		GselectedCom = 'sendmail_result';
		
		CommonInfo_getForward(loadforward, page_path);
		
	}
	
	function sendMailMatConfirm() {
		
		//상품소개서
		var chkBoxProduct = $('chkBoxProduct');
		//회사소개서
		var chkBoxCompany = $('chkBoxCompany');
		//사업자등록증
		var chkBoxBiz = $('chkBoxBiz');
		//법인등기부등본
		var chkBoxLegal = $('chkBoxLegal');
		//약도
		var chkBoxMap = $('chkBoxMap');
		//통장사본
		var chkBoxBank = $('chkBoxBank');
		
		var inputMat1 = SafeGetValue('inputMat1');
		var inputMat2 = SafeGetValue('inputMat2');
		var inputMat3 = SafeGetValue('inputMat3');
		var inputMat4 = SafeGetValue('inputMat4');
		var inputMat5 = SafeGetValue('inputMat5');
		var inputMat6 = SafeGetValue('inputMat6');

		var reqMat = "<b><u>" + JRFXLOGIN_72 + '</u></b><br>';
		var no = 1;
		if(chkBoxProduct.checked==true) {
			reqMat = reqMat + no + ". " + JRFXLOGIN_73 + '<br>';
			no++;
		}
		if(chkBoxCompany.checked==true) {
			reqMat = reqMat + no + ". " + JRFXLOGIN_74 + '<br>';
			no++;
		}
		if(chkBoxBiz.checked==true) {
			reqMat = reqMat + no + ". " + JRFXLOGIN_75 + '<br>';
			no++;
		}
		if(chkBoxLegal.checked==true) {
			reqMat = reqMat + no + ". " + JRFXLOGIN_76 + '<br>';
			no++;
		}
		if(chkBoxMap.checked==true) {
			reqMat = reqMat + no + ". " + JRFXLOGIN_77 + '<br>';
			no++;
		}
		if(chkBoxBank.checked==true) {
			reqMat = reqMat + no + ". " + JRFXLOGIN_78 + '<br>';
			no++;
		}
		if(inputMat1!='') {
			reqMat = reqMat + no + ". " + inputMat1 + '<br>';
			no++;
		}
		if(inputMat2!='') {
			reqMat = reqMat + no + ". " + inputMat2 + '<br>';
			no++;
		}
		if(inputMat3!='') {
			reqMat = reqMat + no + ". " + inputMat3 + '<br>';
			no++;
		}
		if(inputMat4!='') {
			reqMat = reqMat + no + ". " + inputMat4 + '<br>';
			no++;
		}
		if(inputMat5!='') {
			reqMat = reqMat + no + ". " + inputMat5 + '<br>';
			no++;
		}
		if(inputMat6!='') {
			reqMat = reqMat + no + ". " + inputMat6 + '<br>';
			no++;
		}

		var txt_name = SafeGetValue('txt_name');
		var txt_content = SafeGetValue('txt_content');
		
		if(txt_name=='') {
			alert(JRFXLOGIN_79);
			return;
		}
		if(txt_content=='') {
			alert(JRFXLOGIN_11);
			return;
		}
		
		if(hasReceiver==false) {
			alert(JRFXLOGIN_80);
			return;
		}
		
		GselectedMenu = 'non12';
		GselectedCom = 'sendmail_result';
		
		txt_content = SafeGetValue('txt_content') + '<hr>' + reqMat;


		doSendMail(txt_name, txt_content);
	}
	
	
	function getAttachedFileContent() {
		var file_item_name_list = '';
		var file_display = SafeGetValue('file_display');
		
		if(file_display!='')
		{

			var lo_form = document.GeneralBaseForm1;
			var count = 1;
			var lo_check = lo_form.elements["file_item_code"];
			var lo_size = lo_form.elements["file_f_size"];
			var lo_fname = lo_form.elements["file_f_name"];
			
			if(lo_check == null) {
				count = 0;
			}
			if(lo_check.length>1) {
				count = lo_check.length;
			}
			
			if(count==1){
				file_item_name_list = lo_check.value + ":" + lo_size.value + ":" + lo_fname.value;
			} else {			
				for(i=0;i<count;i++){
					file_item_name_list = file_item_name_list + 
						lo_check[i].value +  ":" + lo_size[i].value +  ":" + lo_fname[i].value
						+ "|";
				}
			}
		}
		return file_item_name_list;
		
	}
	function doSendMail(txt_name, txt_content) {

		addToLineUp();
		
		var file_item_name_list = getAttachedFileContent();
		
		var seleted_lineup_uid = makeSelecttedUidRecvList();
		
		if(seleted_lineup_uid=='') {
			alert(JRFXLOGIN_70);
			return;
		} else {
			var yes_no = confirm(JRFXLOGIN_71 + '\n\n' + makeReceiverInfo());
		    if (yes_no != true) {
		    	return false;
		    }
		}
		
		//Server Update
		var myJSONObject =
        {
			"seleted_lineup_uid": seleted_lineup_uid,
			"txt_name": txt_name,
			"txt_content": txt_content,
			"file_item_name_list": file_item_name_list
		};

		var myJSONText = JSON.stringify(myJSONObject)/*CHANGED*/ ;myJSONText = stripSpecialChar(myJSONText);

		var page_path = "/no_security.html?searchType=sendmail-general";
		page_path = page_path + "&menuKey=" + GselectedMenu;
		page_path = page_path + "&searchKey=" + myJSONText;
		page_path = page_path + "&file_group_code=" + SafeGetValue("file_upload_key");
		
		CommonInfo_getForward(loadforward, page_path);
		
	}
	
	function sendMailGenConfirm() {
		var txt_name = SafeGetValue('txt_name');
		var txt_content = SafeGetValue('txt_content');
		
		if(txt_name=='') {
			alert(JRFXLOGIN_79);
			return;
		}
		if(txt_content=='') {
			alert(JRFXLOGIN_11);
			return;
		}
		
		if(hasReceiver==false) {
			alert(JRFXLOGIN_80);
			return;
		}
		
		GselectedMenu = 'non12';
		GselectedCom = 'sendmail_result';

		doSendMail(txt_name, txt_content);
	}
	

	function deployAddExcel() {

		var file_display = SafeGetValue('file_display');
		if(file_display=='')
		{
			alert(JRFXLOGIN_81);
			return;
		}
		var lo_form = document.GeneralBaseForm1;
		var count = 1;
		var lo_check = lo_form.elements["file_item_code"];

		if(lo_check == null)
			count = 0;
			
		if(lo_check.length>1)
			count = lo_check.length;

		if(count==0) {
			alert(JRFXLOGIN_81);
			return;
		}
		
		
		var file_item_list = '';
		
		if(i==0){
			file_item_list = lo_check.value;
		} else {			
			for(i=0;i<count;i++){
				file_item_list = file_item_list + lo_check[i].value + ";";
			}
		}
		

		var page_path = "/no_security.html?searchType=addexcel-deploy";
		page_path = page_path + "&menuKey=" + GselectedMenu;
		page_path = page_path + "&searchKey=" + file_item_list;
		page_path = page_path + "&file_group_code=" + SafeGetValue("file_upload_key");

		GselectedMenu = 'non13';
		GselectedCom = 'addexcel_result';
		
		CommonInfo_getForward(loadforward, page_path);

	}
	
	function addPromotion() {

		var banner_size = 	SafeGetValue('banner_size');
		var prmt_title = 	SafeGetValue('prmt_title');
		var prmt_content = 	SafeGetValue('prmt_content');
		var from_date = 	SafeGetValue('from_date');
		var to_date = 		SafeGetValue('to_date');
		var user_id = 		SafeGetValue('user_id');
		var prmt_name = 	SafeGetValue('prmt_name');
		var prmt_email = 	SafeGetValue('prmt_email');
		var gubun = 		SafeGetValue('gubun');
		var prmt_link = 	SafeGetValue('prmt_link');
		
		//Server Update
		var myJSONObject =
        {
			"banner_size": banner_size,
			"prmt_title": prmt_title,
			"prmt_content": prmt_content,
			"from_date": from_date,
			"to_date": to_date,
			"user_id": user_id,
			"prmt_name": prmt_name,
			"prmt_email": prmt_email,
			"gubun": gubun,
			"prmt_link": prmt_link		
		};
		var myJSONText = JSON.stringify(myJSONObject) ;myJSONText = stripSpecialChar(myJSONText);
		var page_path = "/no_security.html?searchType=promotion_add";
		page_path = page_path + "&menuKey=" + GselectedMenu;
		page_path = page_path + "&searchKey=" + myJSONText;
		
		GselectedMenu = 'non16';
		GselectedCom = 'promotion_result';
		CommonInfo_getForward(loadforward, page_path);
		
	}
	
	function fillUserInput() {
		var company_name = SafeGetValue('company_name');
		var requester_name = SafeGetValue('requester_name');
		var requester_telephone_no = SafeGetValue('requester_telephone_no');
		var requester_mobilephone_no = SafeGetValue('requester_mobilephone_no');
		var requester_email_address = SafeGetValue('requester_email_address');
		
		var ceo_name = SafeGetValue('ceo_name');
		var requester_address = SafeGetValue('requester_address');

		//update myInfo
		
		var my_info = '(' + J2MSG_DWR_WA_REC_01 +') ';
		my_info = my_info + requester_name + " [" + company_name + "]\n";
		my_info = my_info + "TEL: " + requester_telephone_no + ", ";
		my_info = my_info + "HP: " + requester_mobilephone_no ;
		
		SafeSetValue('txt_content_sub', my_info);
	}
	
	function setMyInfo() {
		
		fillUserInput();
		
		var company_name = SafeGetValue('company_name');
		var requester_name = SafeGetValue('requester_name');
		var requester_telephone_no = SafeGetValue('requester_telephone_no');
		var requester_mobilephone_no = SafeGetValue('requester_mobilephone_no');
		var requester_email_address = SafeGetValue('requester_email_address');
		var ceo_name = SafeGetValue('ceo_name');
		var requester_address = SafeGetValue('requester_address');

		//Server Update
		var myJSONObject =
        {
			"user_uid": UID_GLOB_USER_KEY,
			"company_name": company_name,
			"requester_name": requester_name,
			"requester_telephone_no": requester_telephone_no,
			"requester_mobilephone_no": requester_mobilephone_no,
			"requester_email_address": requester_email_address,
			"ceo_name": ceo_name,
			"requester_address": requester_address
			
		};

		var myJSONText = JSON.stringify(myJSONObject)/*CHANGED*/ ;myJSONText = stripSpecialChar(myJSONText);

		var page_path = "/no_security.html?searchType=update-myinfo";
		page_path = page_path + "&menuKey=" + GselectedMenu;
		page_path = page_path + "&searchKey=" + myJSONText;
			
		CommonInfo_getForward(dummy_fc, page_path);

	}

	function checkDateReq() {
		
	}
	
	function checkDateTo() {
		
	}
	
	function gotoBizHome() {
		var biz_home_code = SafeGetValue('biz_home_code');
		gotoBizHomeLink(biz_home_code);
	}
	
	function gotoBizHomeLink(biz_home_code) {
		location.href="bizhome.html?id=" + biz_home_code;
	}
	
	function fn_downloadByCode( code )
	{
		w = screen.availWidth / 1.5;
		h = screen.availHeight / 1.5;
		
		var win_option = 
		//"direction=yes," +
		//"location=yes," +
		"menubar=yes," +
		//"scrollbars=yes," +
		//"status=yes," +
		//"toolbar=yes," +
		"resizable=yes," +
		"width="+w+",height="+h;
		
		var html_str = "excel_view.html" + "?&excel_page=EXCEL_" + code;
		newWin1 = window.open(html_str, "newWin1", win_option);
		newWin1.moveTo(0,0);
	}
	
	function sendPassId()
	{
		var biz_no1 = SafeGetValue('biz_no1');
		var biz_no2 = SafeGetValue('biz_no2');
		var biz_no3 = SafeGetValue('biz_no3');
		if(biz_no1.length !=3 || biz_no2.length!=2 || biz_no3.length!=5)
		{
			SafeSetValue("biz_no_err", JRFXLOGIN_82);
			
			return;
		} else {
			SafeSetValue("biz_no_err", "");
		}

		var action_para = "no_secure_service.html?&cmdKey=FindIdPass"
		document.GeneralBaseForm1.action=action_para;
		document.GeneralBaseForm1.submit();
		
	}
	
	function gotoNewWin(path){
		
		if(path==null || path.length<8) {
			return;
		}
		var w = screen.availWidth / 1.3;
		var h = screen.availHeight / 1.3;

		var win_option = 
			"direction=yes," +
			"location=yes," +
			"menubar=yes," +
			"scrollbars=yes," +
			"status=yes," +
			"toolbar=yes," +
			"resizable=yes," +
			"width="+w+",height="+h;
			
		//newWin1 = 
		window.open(path, "newWin1", win_option);
		//newWin1.moveTo(0,0);
	}
	
	function doDbExport() {
		getDivInfo('non18');
	}
	
	function doingProcessWidget(target) {
		SafeSetValue(target, 
				"<marquee style='color:#7AA5D6;' behavior=alternate width=300>■■■■■■■■■■■■■■■■■■■■■■</marquee>"
				);
	}
	
	function createProgram() {
		SafeSetValue('program_div',
				"<center><marquee style='color:#579862;font-weight:bold;' height=25 direction=down scrollAmount=2 width=400>프로그램을 생성하고 있습니다. 약 30초 정도 소요됩니다.</marquee></center>"
				);
	}
	
	function doRequestPayedUser(chk_type) {

		SafeSetValue('chk_type', chk_type);
		var action_para = "inisecurestart.html"
		document.GeneralBaseForm1.action=action_para;
		document.GeneralBaseForm1.submit();

	}
	
	function openTransWin() {
		var w = screen.availWidth / 1.5;
		var h = screen.availHeight / 2;
		
		var win_option = 
			"menubar=yes," +
			"resizable=yes," +
			"width="+w+",height="+h;
		
		var html_str = "http://translate.google.com/translate_t";

		newWin1 = window.open(html_str, "newWin1", win_option);
		//newWin1.moveTo(0,0);
	}
	
	function downloadInst() {
		this.location.href="filedown.html?filename=webprint.exe";
	}
	
	function changeLang()
	{
		var w = screen.availWidth / 2;
		var h = screen.availHeight / 1.2;
		
		var win_option = 
			"menubar=yes," +
			"resizable=yes," +
			"scrollbars=yes," +
			"width="+w+",height="+h;
		
		var html_str = "change_lang.jsp";

		newWin1 = window.open(html_str, "newWin1", win_option);
		newWin1.moveTo(0,0);
	}
	
	function exportConfirm()
	{
	}
	
	function downloadExcelForm1()
	{
		this.location.href="filedown.html?filename=biz_excel_upload.xls";
	}

	