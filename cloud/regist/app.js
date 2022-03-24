if(consoleCheck()==false) {
	console = window.console || {log:function() {}}; // IE8이하일경우
	//alert('console checked');
}

function console_log(s) {
	  try { console.log(s); } catch (e) { /*alert(s)*/ }
}
function console_info(s) {
	  try { console.info(s); } catch (e) { /*alert(s)*/ }
}


Ext.Loader.setConfig({
    enabled: true,
    paths: {
    	'Ext.ux': CONTEXT_PATH + '/extjs/ux/'
        
    }
});



function CheckStrLen(obj, maxlen) { 

	var temp; //들어오는 문자값... 
	var msglen; 
	msglen = maxlen*2; 
	var value= obj.value; 
	
	var tmpstr = "" ; 
	
	for(k=0;k<value.length;k++) { 
		temp =value.charAt(k); 
		
		if (escape(temp).length > 4) {
			msglen -= 2; 	
		} else {
			msglen--; 				
		}

		if(msglen < 0) 
		{ 
			alert("Alphabet "+(maxlen*2)+"chars, multi language " + maxlen + "chars is maximum."); 
			obj.value= tmpstr; 
			break; 
		} else 
		{ 
			tmpstr += temp; 
		} 
	}//endoffor 

} 

function checkEmail(obj) {
	var isValid =  isValidEmail( obj);
	if(isValid==false) {
		alert('잘못된 E-Mail 형식입니다.');
		obj.focus();
	}
	
}

function checkNumber(obj) {
	var isValid =  isNum(obj);
	if(isValid==false) {
		obj.focus();
		//obj.select();
		alert("숫자 만 입력할 수 있습니다.");

	}
	
}

function checkPhone(obj) {
	var isValid =  isPhone(obj);
	if(isValid==false) {
		obj.focus();
		//obj.select();
		alert("숫자, +, - 만 입력할 수 있습니다.");

	}
	
}

function getValueSafe(name) {
	var val = '';
	try {
		var obj = document.getElementById(name);
		if(obj !=null) {
			var type = obj['type'];
			//console_log(type);
			if(type=='text' || type=='password' || type=='hidden' || type=='select-one' || type=='textarea' || type=='radio') {
				val = obj.value;
			}else {
				val = obj.innerHTML;
			}
		}
	} catch(e) {
		alert(e);
		return '';
	}
	//console_log(name + ' value is ' + val);
	return val;
	
}

function setValueSafe(name, val) {
		console_log (name + '=' + val);
	
		var obj = null;
		try {
			var obj = document.getElementById(name);
		} catch(e) {
			console_log('exception at setValueSafe for ' + name + ' ' +   e);
		}
	
		if(obj !=null) {
			var type = obj['type'];
			if(type=='text' || type=='password' || type=='hidden' || type=='select-one') {
				obj.value = val;
			}/* else if(type=='select-one' || type=='select') {

				var el =0;
				for (var i=0; i<obj.options.length; i++){
					console_log(obj.options[i].value);
				 if (obj.options[i].value == val){
					 el=i;
				 }
				}
				obj.selectedIndex = el;
			
			} */
			else {
		
				obj.innerHTML = val;
			}
			
		}else{
			console_log('obj is null at setValueSafe for ' + name);
		}

	
}

var LAW_REGIST_NO = '법인등록번호';
var HUM_REGIST_NO = '대표주민번호';

var nation_code ='';
var company_code = '';
var biz_no  = '';
var wa_name = '';
var president_name ='';
var address_10 = '';
var supplier_classification_code = '';
var supplier_classification_name = '';
var wa_name_en ='';
var homepage_url ='';
var establishment_year ='';
var dunsnumber ='';
var company_info ='';
var sourcing_comment ='';
var password1 ='public';
var user_id = '';
var user_name = '';
var email = '';
var hp_no = '';
var tel_no = '';
var fax_no = '';
var arap_user_name = '';
var arap_email = '';
var arap_tel_no = '';
var arap_fax_no = '';
var company_code_type = 'C';
var company_code_name = '법인사업자';

//var CUR_IDX = 0;
var CUR_POS = 0;
var CHK_MSG = '';


var dv = null;

function setPassword1(val) {
	password1 = val;
}
function verify(idx) {
	
	console_log('verify: function(idx)=' + idx);
	var check = true;
	switch(idx) {
    	case 1: //2. 약관 동의
    		var agreeOn = document.getElementById('agreeOn');
    		var agreeOnP = document.getElementById('agreeOnP');
		    check = (agreeOn.checked &&agreeOnP.checked) ? true: false;
		    if(agreeOn.checked==false) {
		    	CHK_MSG= '먼저 약관에 동의해 주시기 바랍니다.';
		    } else if(agreeOnP.checked==false) {
		    	CHK_MSG= '개인정보 취급방침에 동의해 주시기 바랍니다.';
		    }
		    console_log(check);
    		break;
    	case 2: //3. 회사정보
    		CHK_MSG= '입력한 회사정보에 오류가 있습니다. "*" 표시된 필드를 확인하세요';
    		check =  verifyCompanyInfo();
    		console_log(check);
    		break;
    	case 3: //4. 사용자 정보
    		CHK_MSG= '입력한 사용자정보에 오류가 있습니다. "*"  표시된 필드를 확인하세요';
    		check = verifyUserInfo();
    		console_log(check);
    		break;
	}
	
	console_log(check);
	console_log(CHK_MSG);
	return check;
   
}

function fillFinalValue() {
	printValue();
	setValueSafe("res_nation_code", nation_code);
	setValueSafe("res_company_code", company_code);
	setValueSafe("res_biz_no", biz_no);
	setValueSafe("res_wa_name", wa_name);
	setValueSafe("res_president_name", president_name);
	setValueSafe("res_address_10", address_10);
	setValueSafe("res_supplier_classification_code", supplier_classification_code);
	setValueSafe("res_supplier_classification_name", supplier_classification_name);

	setValueSafe("res_wa_name_en", wa_name_en);
	setValueSafe("res_homepage_url", homepage_url);
	setValueSafe("res_establishment_year", establishment_year);
	setValueSafe("res_dunsnumber", dunsnumber);
	setValueSafe("res_company_info", company_info);
	setValueSafe("res_sourcing_comment", sourcing_comment);
	setValueSafe("res_password1", password1);
	
	setValueSafe("res_user_id", user_id);
	setValueSafe("res_user_name", user_name);
	setValueSafe("res_email", email);
	setValueSafe("res_hp_no", hp_no);
	setValueSafe("res_tel_no", tel_no);
	setValueSafe("res_fax_no", fax_no);
	setValueSafe("res_arap_user_name", arap_user_name);
	setValueSafe("res_arap_email", arap_email);
	setValueSafe("res_arap_tel_no", arap_tel_no);
	setValueSafe("res_arap_fax_no", arap_fax_no);
	
	setValueSafe("res_company_code_type", '[' + company_code_type+  '] ' + company_code_name );

}


function printValue() {
	console_log("res_nation_code=" +  nation_code);
	console_log("res_company_code=" +  company_code);
	console_log("res_biz_no=" +  biz_no);
	console_log("res_wa_name=" +  wa_name);
	console_log("res_president_name=" +  president_name);
	console_log("res_address_10=" +  address_10);
	console_log("res_supplier_classification_code=" +  supplier_classification_code);

	console_log("res_wa_name_en=" +  wa_name_en);
	console_log("res_homepage_url=" +  homepage_url);
	console_log("res_establishment_year=" +  establishment_year);
	console_log("res_dunsnumber=" +  dunsnumber);
	console_log("res_company_info=" +  company_info);
	console_log("res_sourcing_comment=" +  sourcing_comment);
	console_log("res_password1=" +  password1);
	
	console_log("res_user_id =" +  user_id);
	console_log("res_user_name=" +  user_name);
	console_log("res_email=" +  email);
	console_log("res_hp_no=" +  hp_no);
	console_log("res_tel_no=" +  tel_no);
	console_log("res_fax_no=" +  fax_no);
	console_log("res_arap_user_name=" +  arap_user_name);
	console_log("res_arap_email=" +  arap_email);
	console_log("res_arap_tel_no=" +  arap_tel_no);
	console_log("res_arap_fax_no=" +  arap_fax_no);

}

function verifyUserInfo() {
	var val = true;

	user_id 		= getValueSafe('user_id');
	user_name 	= getValueSafe('user_name');
	email 			= getValueSafe('email');
	hp_no 		= getValueSafe('hp_no');
	tel_no 		= getValueSafe('tel_no');
	fax_no 		= getValueSafe('fax_no');
	arap_user_name = getValueSafe('arap_user_name');
	arap_email 	= getValueSafe('arap_email');
	arap_tel_no 	= getValueSafe('arap_tel_no');
	arap_fax_no 	= getValueSafe('arap_fax_no');
	
	if(	user_id =='' ) {
		//setValueSafe("user_id_err", '*');
		CHK_MSG = '아이디가 입력되지 않았습니다.';	
		val = false;
	} else {
		//setValueSafe("user_id_err", '<span class="smark">* </span>');
	}
	
	if(	user_name =='' ) {
		CHK_MSG = '이름이 입력되지 않았습니다.';	
		//setValueSafe("user_name_err", '*');
		val = false;
	} else {
		//setValueSafe("user_name_err", '<span class="smark">* </span>');
	}
	
	if(	email =='' ) {
		CHK_MSG = 'email이 입력되지 않았습니다.';	
		//setValueSafe("email_err", '*');
		val = false;
	} else {
		//setValueSafe("email_err", '<span class="smark">* </span>');
	}
	if(	tel_no =='' ) {
		CHK_MSG = '전화번호가 입력되지 않았습니다.';	
		//setValueSafe("email_err", '*');
		val = false;
	} else {
		//setValueSafe("email_err", '<span class="smark">* </span>');
	}
	if(	arap_tel_no =='' ) {
		CHK_MSG = '전화번호가 입력되지 않았습니다.';
		//setValueSafe("email_err", '*');
		val = false;
	} else {
		//setValueSafe("email_err", '<span class="smark">* </span>');
	}
	
	
	if(	arap_user_name =='' ) {
		CHK_MSG = '이름이 입력되지 않았습니다.';
		//setValueSafe("arap_user_name_err", '*');
		val = false;
	} else {
		//setValueSafe("arap_user_name_err", '<span class="smark">* </span>');
	}
	
	if(	arap_email =='' ) {
		CHK_MSG = 'email이 입력되지 않았습니다.';
		//setValueSafe("arap_email_err", '*');
		val = false;
	} else {
		//setValueSafe("arap_email_err", '<span class="smark">* </span>');
	}
	
	return val;
}

var is_dup_company_code = false;


///여기할차례 -- 콘트롤러는 만들고 적용전..
///2013.09.10 k1park
function checkDupCompanyCode(o) {
	var v = o.value;
	
	Ext.Ajax.request({
		url: CONTEXT_PATH + '/newUserMgmt/newUser.do?method=checkCorporationNo',
		params:{
			nation_code: nation_code,
			corporation_no: company_code
		},
		success : function(result, request) {
			var resultText = result.responseText;
			
		},
		failure: extjsUtil.failureMessage
	});	
}

function verifyCompanyInfo() {
	var val = true;
	//console_log('in verifyCompanyInfo ');
	
	company_code = getValueSafe('company_code').toUpperCase();
	if(company_code == '')
	{
		if( company_code_type == 'C') {
			CHK_MSG = LAW_REGIST_NO + '를 입력하지 않았습니다.';	
		} else {
			CHK_MSG = HUM_REGIST_NO + '를 입력하지 않았습니다.';	
		}
		//setValueSafe("company_code_err", '*');
		val = false;
		return val;
	} else {
		//setValueSafe("company_code_err", '<span class="smark">* </span>');
	}
	
	console_log('in company_code ');
	
	biz_no = getValueSafe('biz_no').toUpperCase();
	if(biz_no  == '' )
	{
		CHK_MSG = '사업자번호' + '를 입력하지 않았습니다.';	
		//setValueSafe("biz_no_err", '*');
		val = false;
		return val;
	} else {
		//setValueSafe("biz_no_err", '<span class="smark">* </span>');
	}
	
	nation_code = getValueSafe('nation_code').toUpperCase();
	
	if(nation_code  == '' )
	{
		CHK_MSG = '국가코드가 입력되지 않았습니다.';	
		//setValueSafe("nation_code_err", '*');
		val = false;
	} else {
		//setValueSafe("nation_code_err", '<span class="smark">* </span>');
	}
	
	wa_name = getValueSafe('wa_name');
	if(wa_name  == '' )
	{
		CHK_MSG = '회사명이 입력되지 않았습니다.';	
		//setValueSafe("wa_name_err", '*');
		val = false;
	} else {
		//setValueSafe("wa_name_err", '<span class="smark">* </span>');
	}
	
	president_name = getValueSafe('president_name');

	if(president_name  == '' )
	{
		CHK_MSG = '대표자가 입력되지 않았습니다.';	
		//setValueSafe("president_name_err", '*');
		val = false;
	} else {
		//setValueSafe("president_name_err", '<span class="smark">* </span>');
	}
	
	
	address_10 = getValueSafe('address_10');
	if(address_10  == '' )
	{
		CHK_MSG = '주소가 입력되지 않았습니다.';	
		//setValueSafe("address_10_err", '*');
		val = false;
	} else {
		//setValueSafe("address_10_err", '<span class="smark">* </span>');
	}
	
// 	var supplier_classification_code_cur = getValueSafe('supplier_classification_code');
	if(getValueSafe('supplier_classification_code')  == '' )
	{
		console_log(getValueSafe('supplier_classification_code'));
		//setValueSafe("supplier_classification_code_err", '*');
		CHK_MSG = '회사업종이 입력되지 않았습니다.';	
		val = false;
	} else {
		//setValueSafe("supplier_classification_code_err", '<span class="smark">* </span>');
	}
	
	
	wa_name_en = getValueSafe('wa_name_en');
	homepage_url = getValueSafe('homepage_url');
	establishment_year = getValueSafe('establish_year') +'/'+ getValueSafe('establish_month') +'/'+ getValueSafe('establish_day');
	dunsnumber = getValueSafe('dunsnumber');
	company_info = getValueSafe('company_info');
	sourcing_comment = getValueSafe('sourcing_comment');
		
	
	return val;
}


var store = null;

function goToMain(btn) {
    if(btn == 'yes') {
		var url = CONTEXT_PATH;
		if(url=='') {
			url='/';
		}
		this.location.href=url + '/login.do?method=loginForm&selectedLanguage=' + vLANG;
	
    }
}

function selectCompanyType(o) {
	var v = o.value;
	company_code_type = v;
	var span = document.getElementById('company_code_disp');
	var res_span = document.getElementById('res_company_code_disp_result');
	if(v=='C') {
		company_code_name = '법인사업자';
		span.innerHTML = LAW_REGIST_NO;
		res_span.innerHTML = LAW_REGIST_NO;
	} else if(v=='P') {
		
		company_code_type = 'C';
		company_code_name = '법인사업자';
		span.innerHTML = HUM_REGIST_NO;
		res_span.innerHTML = HUM_REGIST_NO;
	}
}


function selectType2(o) {

	console_log(o);
	var code = o.value;
	var index = o.selectedIndex;
	console_log(index);
	console_log(o.options);
	var option = o.options[index];
	console_log(option);
	
	supplier_classification_code = code;
	supplier_classification_name = option.text;
	
	setValueSafe("supplier_classification_code", supplier_classification_code);
	
}

function selectType1(o) {

	console_log(o);
	var code = o.value;
	var index = o.selectedIndex;
	console_log(index);
	console_log(o.options);
	var option = o.options[index];
	console_log(option);
	var defValue = option.text + ' (All)';
	console_log( defValue);
	
	supplier_classification_code = o.value;
	supplier_classification_name = defValue;
	
	
	setValueSafe("supplier_classification_code", supplier_classification_code);
	
	store.proxy.extraParams.parent = code.substring(0,2);
    var lo_Sbx = document.getElementById('company_info_type2');
   
    lo_Sbx.options.length = 0;

	store.load( function(records) {
        
       	lo_Sbx.options.add(    new Option(defValue, code)  );
        for (var i=0; i<records.length; i++){ 
          	var o = records[i];
          	var code = o.get('code');
          	var name_ko = o.get('name_ko');	
          	var name_en = o.get('name_en');	
          	var name_zh = o.get('name_zh');	
          	var name_jp = o.get('name_jp');	
          	var name_de = o.get('name_de');	

          	var text =  '[' + code.substring(0,4) + '] ';
          	switch(vLANG) {
          	case 'ko':
          		text = text+name_ko;
          		break;
          	case 'zh':
          		text = text+name_zh;
          		break;
          	case 'jp':
          		text = text+name_jp;
          		break;
          	case 'de':
          		text = text+name_de;
          		break;
          	default:
          		text = text+name_en;
          	}
          	
    	   lo_Sbx.options.add(new Option(text, code));
        }
});


}



Ext.onReady(function() {

	store = 
		
	new Ext.create('Ext.data.Store', {
	
		    fields: [     
		        		{ name: 'code', type: "string" }
		        		,{ name: 'name_ko', type: "string"  }
		        		,{ name: 'name_de', type: "string"  }
		        		,{ name: 'name_zh', type: "string"  }
		        		,{ name: 'name_jp', type: "string"  }
		        		,{ name: 'name_en', type: "string"  }
		        	  	  ],
		     lang: '',
		 	 sorters: [{
		          property: 'code',
		          direction: 'ASC'
		 	     }],
		     proxy: {
		          type: 'ajax',
		          url: CONTEXT_PATH + '/b2b/lounge.do?method=getUnspscSegment',
		          reader: {
		              type: 'json',
		              root: 'datas',
		              totalProperty: 'count',
		              successProperty: 'success'
		          }
		            
		      },
		     autoLoad: true
		});
	
	store.load( function(records) {
	        var lo_Sbx = document.getElementById('company_info_type1');
	        
	       	lo_Sbx.options.add(new Option('', '') );
	        for (var i=0; i<records.length; i++){ 
	          	var o = records[i];
	          	var code = o.get('code');
	          	var name_ko = o.get('name_ko');	
	          	var name_en = o.get('name_en');	
	          	var name_zh = o.get('name_zh');	
	          	var name_jp = o.get('name_jp');	
	          	var name_de = o.get('name_de');	

	          	var text =  '[' + code.substring(0,4) + '] ';
	          	switch(vLANG) {
	          	case 'ko':
	          		text = text+name_ko;
	          		break;
	          	case 'zh':
	          		text = text+name_zh;
	          		break;
	          	case 'jp':
	          		text = text+name_jp;
	          		break;
	          	case 'de':
	          		text = text+name_de;
	          		break;
	          	default:
	          		text = text+name_en;
	          	}
	          	
	    	   lo_Sbx.options.add(new Option(text, code));
	        }
	});
    
	var form = Ext.create('Ext.form.Panel', {
		id: 'window',
        renderTo: 'floatDiv',
        title: 'MagicPLM 회원가입',
		//componentCls: 'myBorder',
        style : 'border-left: 1px solid #99BBE8;' +
		        'border-right: 1px solid #99BBE8;' +
		    	'border-top: 1px solid #99BBE8;' +
		    	'border-bottom: 1px solid #99BBE8;' +
		    	'background: #D8E4F4;' +
		    	'padding-bottom: 7px;',
        width: 800,
        height: 640,

        layout: {
            type: 'hbox',
            align: 'stretch'
        },

        items: [
            {
                xtype: 'dataview',
                border: false,
                width: 0,//160,
                style: 'background-color: #eee',
                itemTpl: '{title}',
                store: Ext.create('Ext.data.ArrayStore', { fields: ['title'] }),

                trackOver: true,
               // overItemCls: 'x-item-hovered',

                listeners: {
                    itemclick: function(view, record, item, index) {
//                    console_log('--------------------- itemclick ---------------------');
//                    console_log(CUR_POS);	
//                    console_log(index);	
//                    console_log(record);	
                    form.navigate(CUR_POS, false);
//						try {
// 	 console_log('CUR_POS=' + CUR_POS);
// 	 var selectionModel = this.getSelectionModel();
// 	 selectionModel.select(store.getAt(CUR_POS) );
// 	 this.refresh();
// 		 					var dv = this.down('dataview');
// 		 					console_log(dv);
		                 	dv.select(CUR_POS);	
// 		                 	console_log(CUR_POS);
//						} catch (e) {}
					
                    return;
//                    	console_log('CUR_POS:' + CUR_POS);
//                       var check= form.verify(CUR_POS);
//                       if(check==false) {
//                     	  alert(CHK_MSG);//Ext.MessageBox.alert('Confirm', CHK_MSG, function() {
// 	           		 	  form.navigate(CUR_POS, false);
// 	           		 		//});
// 	           	 		}else {
// 	           	 			form.navigate(index, true);  
// 	           	 		}
                    },
                    render: function() {
                        var pages = [];
                        this.ownerCt.down('panel').items.each(function(item) {
                            pages.push([item.title]);
                        });
                        this.store.loadData(pages);
                    },
                    viewready: function() {
                        this.ownerCt.navigate(0, true);
                    }
                }
            },
            {
                xtype: 'panel',
                border: false,
                flex: 5,
                layout: 'card',
                style: 'background-color: #fff',
                defaults: {
                    bodyPadding: '10',
                    preventHeader: true
                },
                items: [
                        {
                            title: '<small>1.</small> 준비서류 안내',
                            contentEl: 'prepareDoc'
                        },
                        {
                            title: '<small>2.</small> 약관 동의',
                            contentEl: 'conformAgree'
                        },
                        {
                            title: '<small>3.</small> 회사정보',
                            contentEl: 'companyInfo'
                        },
                        {
                            title: '<small>4.</small> 사용자 정보',
                            contentEl: 'userInfo'
                        },
                        {
                            title: '<small>5.</small> 입력내용 검증',
                            contentEl: 'joinFinal'
                        }
                ]
            }
         ],
        fbar: [
            {
                id: 'btnPrev',
                html: '<font color="#3480F3"><b>앞으로</b></font>',
                scale: 'medium',
//                 style: 'size:13px; font-weight:bold;',
//                 cls: 'middle-btn',
                handler: function(btn) {
                
//                 	 var check= form.verify(CUR_POS);
//                      if(check==false) {
//                     	 alert(CHK_MSG);//Ext.MessageBox.alert('Confirm', CHK_MSG, function() {
// 	           		 	 form.navigate(CUR_POS, false);
// 	           		 		//});
// 	           	 		}else {
	                    	form.navigate('prev', true);
// 	           	 		}
                }
            },
            {
                id: 'btnNext',
                text: '<font color="#3480F3"><b>다음</b></font>',
                scale: 'medium',
                cls: 'middle-btn',
                handler: function(btn) {
	               	 var check= verify(CUR_POS);
	                 if(check==false) {
							Ext.MessageBox.alert('Confirm', CHK_MSG, function() {
									form.navigate(CUR_POS, false);
							});
           	 		}else {
           	 			console_log('check_ok');
                    	form.navigate('next', true);
                    	console_log('moved');
           	 		}
                }
            },
            {
                id: 'btnFinish',
                text: '<font color="#A73329"><b>가입확인</b></font>',
                scale: 'medium',
                cls: 'middle-btn',
                disabled: true,
                handler: function(btn) {
                	form.setLoading(true);
                	
                	Ext.Ajax.request({
                		url: CONTEXT_PATH + '/newUserMgmt/newUser.do?method=cloudUser',
                		params:{
                			nation_code: nation_code,
                			corporation_no: company_code,
                			biz_no: biz_no,
                			wa_name: wa_name,
                			president_name: president_name,
                			address_10: address_10,
                			supplier_classification_code: supplier_classification_code,
                			wa_name_en: wa_name_en,
                			homepage_url: homepage_url,
                			establishment_year: establishment_year,
                			dctr_no: dunsnumber,
                			company_info: company_info,
                			sourcing_comment: sourcing_comment,
                			password1: password1,
                			user_id: user_id,
                			user_name: user_name,
                			email: email,
                			hp_no: hp_no,
                			tel_no: tel_no,
                			fax_no: fax_no,
                			arap_user_name: arap_user_name,
                			arap_email: arap_email,
                			arap_tel_no: arap_tel_no,
                			arap_fax_no: arap_fax_no,
                			company_grade: company_code_type
                		},
                		success : function(result, request) {
                			
                			form.setLoading(false);
                			form.close();
                			
                			Ext.MessageBox.alert('Confirm', '가입 절차가 완료되었습니다.<br /><br />' + email + '에서 내용을 확인하세요.'
                					, function() {
                				var url = 'http://magicplm.com/';
                				this.location.href=url;	
                		});
                		},
                		failure: extjsUtil.failureMessage
                	});	
                }
            },
            {
                id: 'btnClose',
                text: '<font color="#A73329"><b>가입취소</b></font>',
                scale: 'medium',
                cls: 'middle-btn',
                disabled: false,
                handler: function(btn) {
                	Ext.MessageBox.confirm('Confirm', '회원가입을 취소하시겠습니까?'/*'Are you sure you want to quit joinning process?'*/, goToMain);
                }
            }
        ],
        navigate: function(to, v) {
         	console_log('in navifate');
            dv = this.down('dataview');
            var myLayout = this.down('panel').getLayout();
            var items = myLayout.getLayoutItems();
           
            var CUR_IDX = Ext.Array.indexOf(items, myLayout.getActiveItem());

//            console_log('dv=' + dv);
//            console_log('myLayout=' + myLayout);
//            console_log('items=' + items);
//            console_log('CUR_IDX=' + CUR_IDX);

	       
	        if (Ext.isNumber(to)) {
	        	console_log('myLayout number' + to);
                myLayout.setActiveItem(to);
            } else {
            	console_log('myLayout not number:' + to);
                myLayout[to]();
            }

 	        console_log('set btn');
            this.down('#btnPrev').setDisabled(!myLayout.getPrev());
            this.down('#btnNext').setDisabled(!myLayout.getNext());
            this.down('#btnFinish').setDisabled(myLayout.getNext());
            console_log('finished');
            CUR_POS = Ext.Array.indexOf(items, myLayout.getActiveItem());
            console_log('CUR_POS=' + CUR_POS);
            dv.select(CUR_POS);
            
            switch(CUR_POS) {
            case 0:
            	this.setTitle('MagicPLM 가입 - 준비서류 안내');
            	break;
        	case 1: //2. 약관 동의
        		this.setTitle('MagicPLM 가입 - 약관 동의');
        		break;
        	case 2: //3. 회사정보
        		this.setTitle('MagicPLM 가입 - 회사정보');
        		nation_code = vLANG;
        		if(nation_code == 'zh') {
        			nation_code = 'cn';
        		}else if(nation_code=='en') {
        			nation_code = 'us';
        		} else if(nation_code=='ko') {
					nation_code = 'kr';
				}
	        	
        		setValueSafe("nation_code", nation_code);
        		
        		break;
        	case 3: //4. 사용자 정보
        		this.setTitle('MagicPLM 가입 - 사용자 정보');
        		break;
        	case 4:
        		this.setTitle('MagicPLM 가입 - 입력내용 검증');
            	console_log('fillfiname=' + CUR_POS);
            	fillFinalValue();
            	console_log('finished');
            	break;
            }
            

        }
    });
	
	 form.navigate(0, true);
});


function setSameUser(obj) {
	console_log('setSameUser');
	setValueSafe("arap_user_name_err", "*");
	setValueSafe("arap_email_err", "*");
	setValueSafe("arap_tel_no_err", "*");
	setValueSafe("arap_fax_no_err", "");
	console_log('all is reset');
	var check = obj.checked;
	console_log('check='  + check);
	if(check) {
		
		var user_name = getValueSafe("user_name");
		var email = getValueSafe("email");
		var tel_no = getValueSafe("tel_no");
		var fax_no = getValueSafe("fax_no");
		
		console_log('user_name=' + user_name);
		setValueSafe("arap_user_name", user_name);
		setValueSafe("arap_email", email);
		setValueSafe("arap_tel_no", tel_no);
		setValueSafe("arap_fax_no", fax_no);

		
	} else {
		console_log('init');
		setValueSafe("arap_user_name", "");
		setValueSafe("arap_email", "");
		setValueSafe("arap_tel_no", "");
		setValueSafe("arap_fax_no", "");
	}
	
}



function checkNation() {
	var nation_code = getValueSafe('nation_code').toUpperCase();
	if(nation_code=='') {
		Ext.MessageBox.alert('Confirm', '먼저 국가를 선택하세요.', function() {
			setValueSafe("biz_no", '');
  		 });

	}
}