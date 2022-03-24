/**
 * PRF3: select RFQ
 */
//global var.

var grid = null;
var store = null;
var storeQuota = null;
var agrid = null;
var myGrid = null;
var receivedTab = null;
var gRf_uid ='';// regastUid
var ac_uid = '';
var gSelectedSupplier = '';
var gPay_condition ='';//xpoadt pay_condition
var txt_name =''; 
var txt_content='';
var partStore = null;
var cood_del_info='';

var supast_uid = '';
var sales_amount = 0;
var supName = '';
var selectSupName = '';
var mainTab = null;

var unique_uid = new Array();

var selectionLength = 0;
var prWin = null;

var supastList = null;
var gSelectedRfq = null;
var gQuotas = null;
var gSelectedQuotaUid = null;
var gSelectedQuota = null;
var gMinimumPriceSupplierCode = null;

//var the_iframe = null;

function setLoadingFilePanel(flag){
	var frame = Ext.getCmp('iframeFileUploadHistory');
	frame.setLoading(flag);
	grid.setLoading(flag)
}

function callHistoryPanel(gRf_uid, o) {
	
	var frame = Ext.getCmp('iframeFileUploadHistory');

	frame.getEl().dom.contentWindow.setGroupUid(gRf_uid, o);
	
	if(gRf_uid>-1) {

		console_logs('setWorkQuota', gSelectedQuotaUid);
		//Session에 선택한 SQ 저장
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + '/sales/quota.do?method=setWorkRfq',
    		params:{
    			rfq_uid : gRf_uid
    		},
    		success : function(result, request) {

    		},
    		failure: extjsUtil.failureMessage
    	});//ajaxrequest
	} else {

	}

}
function setFileUploadHistory(url) {

		var frame = Ext.getCmp('iframeFileUploadHistory');
		if(frame && frame.rendered ){
			setLoadingFilePanel(true)
		    frame.getEl().dom.src = url;
		}

}


function getSupplierFromBuf(gSelectedSupplier) {
	
	for(var i=0; i<supastList.length; i++) {
		
		var supCode = supastList[i]['supplier_code'];
		var supName = supastList[i]['supplier_name'];
		var supast_uid = supastList[i]['supast_uid'];
		if(supast_uid+''== gSelectedSupplier+'') {
	    	return supName;
		}
		
	}
	return '';
}

function INIT_TABLE_HEAD(quota){

	var aprv_date= quota.get('aprv_date');
	var content= quota.get('content');
	var create_date= quota.get('create_date');
	var creator= quota.get('creator');
	var creator_uid= quota.get('creator_uid');
	var delivery_address_1= quota.get('delivery_address_1');
	var id= quota.get('id');
	var item_quan= quota.get('item_quan');
	var name= quota.get('name');
	var pay_condition= quota.get('pay_condition');
	var po_date= quota.get('po_date');
	var po_no= quota.get('po_no');
	var req_date= quota.get('req_date');
	if(req_date!=null && req_date.length>10) {
		req_date = req_date.substring(0,10);
	}
	var request_date= quota.get('request_date');
	var request_info= quota.get('request_info');
	var sales_amount_str= quota.get('sales_amount_str');
	var state= quota.get('state');
	var supplier_code = quota.get('supplier_code');
	var supplier_name = quota.get('supplier_name');
	var buyer_name = quota.get('division_name');//quota.get('buyer_name');
	var reserved_varchar4 = quota.get('reserved_varchar4');
	
//	console_logs(getColName('aprv_date'),aprv_date);
//	console_logs(getColName('content'),content);
//	console_logs(getColName('create_date'),create_date);
//	console_logs(getColName('creator'),creator);
//	console_logs(getColName('creator_uid'),creator_uid);
//	console_logs(getColName('delivery_address_1'),delivery_address_1);
//	console_logs(getColName('id'),id);
//	console_logs(getColName('item_quan'),item_quan);
//	console_logs(getColName('name'),name);
//	console_logs(getColName('pay_condition'),pay_condition);
//	console_logs(getColName('po_date'),po_date);
//	console_logs(getColName('po_no'),po_no);
//	console_logs(getColName('req_date'),req_date);
//	console_logs(getColName('request_date'),request_date);
//	console_logs(getColName('request_info'),request_info);
//	console_logs(getColName('sales_amount_str'),sales_amount_str);
//	console_logs(getColName('state'),state);
//	console_logs(getColName('supplier_code'),supplier_code);
//	console_logs(getColName('supplier_name'),supplier_name);
	

var a =
	'<style>'+
	' .xl65 {padding-left:2px;padding-right:2px;  font-size:11px; }'+
	' .xl66 {padding-left:2px;padding-right:2px; background: #FFFF99;  font-size:11px; color:black;}' +
	' .xl67 {padding-left:2px;padding-right:2px; background:#F0F0F0; font-size:9px;}' +
	' </style>' +
	'<table border="1" cellpadding="1" cellspacing="1" style="border-collapse: collapse;">' +
'<colgroup>'+
'<col width="70px">' +
'<col width="100px">' +
'<col width="70px">' +
'<col width="130px">' +
'<col width="70px">' +
'<col width="120px">' +
'<col width="60px">' +
'<col width="140px">' +
'<col width="60px">' +
'<col width="140px">' +

'</colgroup>' +
	'<tbody>' +
	'<tr  height="40" >' +
	'	  <td class="xl66" align=center>'+ '견적번호' + '</td>' +
	'	  <td class="xl67" align=center>'+po_no+'</td>' +
	'	  <td class="xl66" align=center>'+getColName("supplier_code")+'</td>' +
	'	  <td class="xl67" align=center>'+supplier_code+'</td>' +
	'	  <td class="xl66" align=center>'+getColName("supplier_name")+'</td>' +
	'	  <td class="xl67" align=center>'+supplier_name+'</td>' +
	'	  <td class="xl66" align=center>'+'견적수신사'+'</td>' +
	'	  <td class="xl67" align=center>'+buyer_name+'</td>' +
	'	  <td class="xl66" align=center>'+getColName("reserved_varchar4")+'</td>' +
	'	  <td class="xl67" align=center>'+reserved_varchar4+'</td>' +
	'	 </tr>' +
	'<tr  height="40" >' +
	'	  <td class="xl66" align=center>'+ getColName("po_no") + '</td>' +
	'	  <td class="xl67" align=center>'+gSelectedRfq.get('po_no')+'</td>' +
	'	  <td class="xl66" align=center>'+getColName("req_date") + '</td>' +
	'	  <td class="xl67" align=center>'+req_date+'</td>' +
	'	  <td class="xl66" align=center>'+getColName("name")+'</td>' +
	'	  <td class="xl67" align=center>'+name+'</td>' +
	'	  <td class="xl66" align=center>'+getColName("content")+'</td>' +
	'	  <td class="xl67" align=center>'+content+'</td>' +
	'	  <td class="xl66" align=center>'+getColName("delivery_address_1")+'</td>' +
	'	  <td class="xl67" align=center>'+delivery_address_1+'</td>' +
	'	 </tr>' +
'</tbody></table>' +
'<table border="1" cellpadding="1" cellspacing="1" style="border-collapse: collapse;">' +
'<colgroup>'+
	'<col width="70px">' +
	'<col width="100px">' +
	'<col width="200px">' +
	'<col width="50px">' +
	'<col width="100px">' +
	'<col width="100px">' +
	'<col width="50px">' +
	'<col width="90px">' +
	'<col width="100px">' +
	'<col width="100px">' +
'</colgroup>' +
	'<tbody>' +
	'<tr  height="25" >' +
	'	  <td class="xl66" align=center>구분</td>' +
	'	  <td class="xl66" align=center>품목코드</td>' +
	'	  <td class="xl66" align=center>규격</td>' +
	
	'	  <td class="xl66" align=center>수량</td>' +
	'	  <td class="xl66" align=center>단가</td>' +
	'	  <td class="xl66" align=center>공급가액</td>' +
	
	'	  <td class="xl66" align=center>세액</td>' +
	'	  <td class="xl66" align=center>납기</td>' +
	'	  <td class="xl66" align=center>비고</td>' +
	'	  <td class="xl66" align=center>시스템UID</td>' +
'	 </tr>'
	
	;
	
	return a;
}

var INIT_TABLE_TAIL =  	
	'</tbody></table><br>' +
	'<div style="color:blue;font-size:11px;position:relative; "><ul>'+
	'<li>본 엑셀파일 포맷은 시스템으로 처리하는 양식이오니 임의로 수정하면 안됩니다.</li>'+
	'<li>임의 수정 시 시스템 오류를 일으킬 수 있습니다. 특히 시스템UID를 훼손하지 마세요.</li>'+
	'<li>노란색 및 회색 셀을 변경하지 말고 <b>흰색 셀만 수정하세요</b>.</li>'+
	'<li>통화 - KRW:원, USD:달러, JPY:엔, EUR:유로, CNY:위안</li>'+
	'</ul></div>'
	;

function createLine(val, align, background, style) {
	
	if(typeof val == "number") {
		val = Ext.util.Format.number(val, '0,00/i')
	}
	
	return '<td height="25" class="' + style + '" style="background:' + background + '" align=' + align + '>'+ val + '</td>' ;
}


function makeHtmlEachSupplier(num, quota, records) {
	
	var supCode = 	quota.get('supplier_code');
	var o = Ext.getCmp('quota_content'+ supCode);

//	console_logs('supCode', supCode);
//	console_logs('o', o);
	
	//위치 찾기
	for(var i=0; i<supastList.length; i++) {
		var code = supastList[i]['supplier_code'];
		if(supCode==code) {
			num = i;
		}
	}
	
	var htmlContent = INIT_TABLE_HEAD(quota);
	
	var qtySum = 0;
	var amountSum = 0;
	var taxSum = 0;
	for(var i=0; i<records.length; i++) {
		//console_logs('record', records[i]);
		var rec = records[i];
		var ac_uid= rec.get('ac_uid');
		
		var item_code= rec.get('item_code');
		var full_spec= rec.get('full_spec');
		var pj_code= rec.get('pj_code');
		var quan= rec.get('quan'); qtySum = qtySum + Number(quan);
		var rfqast_uid= rec.get('rfqast_uid');
		var srcahd_sales_price= rec.get('srcahd_sales_price');
		var delivery_date= rec.get('delivery_date' +num);
		var sales_amount= rec.get('sales_amount' +num); amountSum = amountSum + Number(sales_amount);
		var sales_price= rec.get('sales_price' +num);
		var tax= Number(sales_amount)*0.1; taxSum = taxSum + tax;

		var back_white = '#FFFFFF';
		var full_spec_align = 'left';
		if(item_code==null || item_code =='') {
			full_spec = '합계';
			rfqast_uid = '';
			full_spec_align = 'right';
			tax = '';
			sales_price = '';
			sales_amount = '';
			delivery_date = '';
			back_white = '#F0F0F0';
		}
		

		if(delivery_date==null) {
			var toYear = TODAY_GLOBAL.getFullYear();
			var toMonth = TODAY_GLOBAL.getMonth()+1;
			var sMonth = ''+toMonth;
			if(sMonth.length<2) {
				sMonth = '0' + sMonth;
			}
			delivery_date = toYear + '/' +  sMonth + '/00';
		}

    	
    	htmlContent = htmlContent + '	 <tr height="25" style="height:12.75pt">';
    	htmlContent = htmlContent + createLine(pj_code, 'center', '#F0F0F0', 'xl67');//프로젝트
    	htmlContent = htmlContent + createLine(item_code, 'center', '#F0F0F0', 'xl67');//자재번호
    	htmlContent = htmlContent + createLine(full_spec, full_spec_align, '#F0F0F0', 'xl67');//설명
    	htmlContent = htmlContent + createLine(quan, 'right', '#F0F0F0', 'xl67');//수량
    	htmlContent = htmlContent + createLine(sales_price, 'right', back_white, 'xl65');//단가
    	htmlContent = htmlContent + createLine(sales_amount, 'right', back_white, 'xl65');//합계금액
    	htmlContent = htmlContent + createLine(tax, 'right', back_white, 'xl65');//부가세
    	htmlContent = htmlContent + createLine(delivery_date, 'center', back_white, 'xl65');//납기
    	htmlContent = htmlContent + createLine('', 'center', back_white, 'xl65');//비고
    	htmlContent = htmlContent + createLine(rfqast_uid+'', 'center', '#F0F0F0', 'xl67');//UID
    	htmlContent = htmlContent + '	 </tr>';
	}
	htmlContent = htmlContent + '	 <tr height="25" style="height:12.75pt">';
	htmlContent = htmlContent + createLine('', 'center', '#F0F0F0', 'xl67');//프로젝트
	htmlContent = htmlContent + createLine('', 'center', '#F0F0F0', 'xl67');//자재번호
	htmlContent = htmlContent + createLine('합계', 'right', '#F0F0F0', 'xl67');//설명
	htmlContent = htmlContent + createLine(qtySum, 'right', '#F0F0F0', 'xl67');//수량
	htmlContent = htmlContent + createLine('', 'right', '#F0F0F0', 'xl65');//단가
	htmlContent = htmlContent + createLine(amountSum, 'right', '#F0F0F0', 'xl65');//합계금액
	htmlContent = htmlContent + createLine(taxSum, 'right', '#F0F0F0', 'xl65');//부가세
	htmlContent = htmlContent + createLine('부가세포함 총계', 'center', '#F0F0F0', 'xl65');//납기
	htmlContent = htmlContent + createLine(amountSum+taxSum , 'right', '#F0F0F0', 'xl65');//비고
	htmlContent = htmlContent + createLine('KRW', 'center', back_white, 'xl67');//UID
	htmlContent = htmlContent + '	 </tr>';
	//Summary
	
	
	htmlContent = htmlContent + INIT_TABLE_TAIL;  	
	o.setValue(htmlContent);
	
	return amountSum;
}

var excel_down = Ext.create('Ext.Action', {
	iconCls : 'MSExcelTemplateX',
	text : '다운로드',
	handler : function(widget, event) {

		if(gSelectedQuota==null) {
			Ext.MessageBox.alert('오류', 'gSelectedQuota를 찾을 수 없습니다.');
		} else {
	    	Ext.Ajax.request({
	    		url: CONTEXT_PATH + '/purchase/rfq.do?method=makeQuota',
	    		params:{
	    			rfq_no : gSelectedRfq.get('po_no'),
	    			quota_uid : gSelectedQuotaUid,
	    			quota_no : gSelectedQuota.get('po_no')
	    		},
	    		success : function(result, request) {
	    			var ret = result.responseText;
	    			if(ret!=null && ret!='') {
	    	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ ret;
	    	    		top.location.href=url;	
	    			}
	    		},
	    		failure: extjsUtil.failureMessage
	    	});//ajaxrequest			
		}

	}
});

var sendMailAction = Ext.create('Ext.Action',{
    iconCls: 'email_go',
    text: '메일전송',
    disabled: true,
    handler: function(widget, event) {
    	
    	console_logs('gQuotas', gQuotas);
	
		var arrCheckBoxSup = [];
		
		console_logs('gQuotas length', gQuotas.length);
		for(var i=0; i<gQuotas.length; i++) {
			
			console_logs('gQuotas[' + i + ']', gQuotas[i]);
			
			var supplier_code = gQuotas[i].get('supplier_code');
			var supplier_name = gQuotas[i].get('supplier_name');
	    	var quota_uid = 	gQuotas[i].get('unique_id');
	    	var quota_no = 	gQuotas[i].get('po_no');
	    	var company = 		gQuotas[i].get('division_name');
			var o = {
                boxLabel  : supplier_name,
                name      : 'supReceiver',
                inputValue: quota_uid + ":" + quota_no +":" + supplier_code,
                id        : 'chk_' + supplier_code,
                flex: 1,
                checked: true
            }
			arrCheckBoxSup.push(o);

		}
		console_logs('arrCheckBoxSup', arrCheckBoxSup);
    	//console_logs('gSelectedRfq', gSelectedRfq);

     	var rtgast_uid = gSelectedRfq.get('unique_id');//rtgast_uid
    	var po_no = gSelectedRfq.get('po_no');//po_no
    	var po_detail = gSelectedRfq.get('content');
    	var name = gSelectedRfq.get('name');
    	po_detail = po_detail.replace(/(?:\r\n|\r|\n)/g, '<br />');
    	
    	po_detail = po_detail + "<br /><br /><br />본 메일은 발신전용이오니 아래의 연락처에 문의하세요.<br /><br />";
    	po_detail = po_detail + "문의처: " + vCUR_DEPT_NAME + ', ' + vCUR_USER_NAME + ' (' + vCUR_EMAIL + ')<br /><br />발신: ';
    	po_detail = po_detail + company + "<br /><br />별첨: 견적요청서";
    	//po_detail = po_detail + vCompanyBrand + "<br /><br />별첨: 견적요청서";
    	
    	//console_logs('gSelectedRfq', gSelectedRfq);
    	//console_logs('po_no', po_no);
    	var mailForm = Ext.create('Ext.form.Panel', {
    		id: 'formPanelSendmail',
            defaultType: 'textfield',
            border: false,
            bodyPadding: 15,
            region: 'center',
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 50
            },
             items: [
				new Ext.form.Hidden({
					name: 'rtgast_uid',
					value: rtgast_uid
				    }),
				new Ext.form.Hidden({
					name: 'po_no',
					value: po_no
				    }),
		    		 {
	    	            xtype      : 'fieldcontainer',
	    	            layout: 'hbox',
	    	            fieldLabel : '수신처',
	    	            defaultType: 'checkboxfield',
	    	            items : arrCheckBoxSup
		    		 },
    	    	 {
    	        	 //fieldLabel: '제목',
    	             name: 'mailSubject',
    	             allowBlank: false,
    	             value: '[견적요청] ' + po_no + ' / ' + name,
    	             anchor: '100%'  // anchor width by percentage
    	         },
    	    	 {
    	             name: 'mailContents',
    	             allowBlank: false,
    	             xtype: 'htmleditor',
    	             value: po_detail,
    	             height: 240,
    	             anchor: '100%'
    	    	 }
             ]
        });
    	
    	var win = Ext.create('ModalWindow', {
            title: '견적요청 메일 전송',
            width: 600,
            height: 400,
            items: mailForm,
            buttons: [{
                text: '메일전송 ' + CMD_OK,
            	handler: function(){
                    var form = Ext.getCmp('formPanelSendmail').getForm();
                    if(form.isValid())
                    {
                    	var val = form.getValues(false);
                    	//console_logs('val', val);

                    	Ext.Ajax.request({
                    		url: CONTEXT_PATH + '/purchase/rfq.do?method=sendmailRfq',
                    		params:{
                    			rfq_uid : val['rtgast_uid'],
                    			rfq_no : val['po_no'],
                    			mailSubject : val['mailSubject'],
                    			mailContents : val['mailContents'],
                    			suppliers : val['supReceiver']
                    		},
                    		success : function(result, request) {
        	            		if(win) {
        	            			win.close();
        	            		}//
                            	Ext.MessageBox.alert('전송확인', '전송되었습니다.');
                    		},
                    		failure: extjsUtil.failureMessage
                    	});//ajaxrequest

                    } else {
                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                    }

                  }//endofhandler
            	},{
	                text: CMD_CANCEL,
	            	handler: function(){
	            		if(win) {
	            			win.close();
	            		}//endofwin
	            	}//endofhandler
            	}//CMD_CANCEL
            ]//buttons
        });
        win.show();

    	
    }//endofhandler
});

var routeGubunTypeStore = Ext.create('Mplm.store.RouteGubunTypeStore', {} );
var routeGubunTypeStore_W = Ext.create('Mplm.store.RouteGubunTypeStore_W', {} );
//function myRenderNumber(value, p, record) {
//	var val = Ext.util.Format.number(value, '0,00/i');
//	var total = record.get('total') ;
//	//console_log(total);
//	if(total + '' == '1') {
//		val = '<b>' + val + '</b>';
//	}
//	//console_log(val);
//	return val;
//}

var addAction =	 Ext.create('Ext.Action', {
	iconCls:'add',
    text: CMD_ADD,
    disabled: fPERM_DISABLING(),
    handler: function(widget, event) {
    	
    }
});

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});



function selectConfirm(btn){

	    	console_log('gRf_uid:' + gRf_uid);
	      	console_log('gSelectedSupplier:' + gSelectedSupplier);
	      	
	      	
    var result = MessageBox.msg('{0}', btn);
    if(result=='yes') {
        //중복 코드 체크
		Ext.Ajax.request({
				url: CONTEXT_PATH + '/purchase/rfq.do?method=selectSupplier',				
			params:{
				supast_uid : gSelectedSupplier,
				rf_uid : gRf_uid
			},
				success : function(result, request) {
					//var ret = result.responseText;
					//console_log('requested ajax...' + ret);
					store.load(function() {});
                	partStore.getProxy().setExtraParam('rf_uid', -1000);
                	partStore.load(function(){});
				},
				failure: extjsUtil.failureMessage
			}); 
    }

};



function cancelRfqConfirm(btn){
	var result = MessageBox.msg('{0}', btn);
	if(result=='yes') {


		Ext.Ajax.request({
			url: CONTEXT_PATH + '/purchase/rfq.do?method=destroy',				
			params:{
				rf_uid : gRf_uid
			},
	    	success : function(result, request) {
	    		store.load(function() {});	
	    	},
			failure: extjsUtil.failureMessage
		}); 
		
	}//endofif
}
var removeAction = Ext.create('Ext.Action', {
	itemId: 'removeButton',
    iconCls: 'remove',
    text: CMD_CANCEL,
    disabled: true,
    handler: function(widget, event) {
    	
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: 'cancel RFQ: uid=' + gRf_uid + ')',
            buttons: Ext.MessageBox.YESNO,
            fn: cancelRfqConfirm,
            icon: Ext.MessageBox.QUESTION
        });

	}

});

var selectAction = Ext.create('Ext.Action', {
	  itemId: 'sendAction',
      text: GET_MULTILANG('prf3_SELECTQUOTA', vLANG) ,
      iconCls: 'accept',
      //disabled: true,
      handler: function ()
      {
    	  if(gMinimumPriceSupplierCode==null) {
    		  Ext.MessageBox.alert('알림', '접수된 견적이 없습니다.');
    		  return;
    	  }
      	
    	  	var select_items = [];
    		select_items.push({
                xtype: 'component',
                html: 
                	'<ul>' +
	                	'<li>채택한 견적의 주문은 [주문작성] 메뉴의 [견적채택 완료] 탭에서 진행할 수 있습니다.</li>'+
	                	'<li>업체를 선택한 후 [채택 확인] 버튼을 누르세요. </li>' +
	                	'<li>이 작업은 취소할 수 없습니다..</li>' +
                	'</ul>'
    		});
    		select_items.push({
                xtype: 'component',
                html: '<hr />'
    		});
    		for(var i=0; i<supastList.length; i++) {
    			
    			var supCode = supastList[i]['supplier_code'];
    	    	var supName = supastList[i]['supplier_name'];
    	    	var supast_uid = supastList[i]['supast_uid'];
    	    	var check = false;
    	    	if(gMinimumPriceSupplierCode==supCode) {
    	    		supName = supName + '&nbsp;&nbsp;<font color=red><i>[최저가]</i></font>';
    	    		check = true;
    	    	}
    	    	
    	    	var o = {
                        boxLabel: supName,
                        name: 'selected_supplier',
                        inputValue: supast_uid,
                        //checked: check,
    	            	handler: function(){
    	            		var okBtn = Ext.getCmp('windowOkBtn');
    	            		okBtn.enable();
    	            	}
                        
                    };
    	    	if(i==0) {
        	    	o['fieldLabel'] = '채택 공급사';
    	    	}
    	    	
    	    	select_items.push(o);
    		}
    		
    		select_items.push({
                xtype: 'component',
                html: '<hr />'
    		});
    	  	select_items.push({
                xtype: 'textarea',
                rows: 2,
                name: 'select_reason',
                fieldLabel: '선정 사유',
                value: '가격 우선'
            });
    	  	
    	    var fp = Ext.create('Ext.FormPanel', {
    	    	id: 'formPanelSelect',
    	    	frame: true,
    	        border: false,
    	        fieldDefaults: {
    	            labelWidth: 80
    	        },
    	        width: 500,
    	        bodyPadding: 0,
    	        items: [
    	            {
		    	        xtype: 'container',
		    	        layout: 'hbox',
		    	        margin: '0 0 10',
		    	        items: [{
		    	            xtype: 'fieldset',
		    	            flex: 1,
		    	            border: false,
		    	            defaultType: 'radio', // each item will be a radio button
		    	            layout: 'anchor',
		    	            defaults: {
		    	                anchor: '100%',
		    	                hideEmptyLabel: false
		    	            },
		    	            items: select_items
		    	        }]
		    	    }]
	    	    });
    	    

    	    w = Ext.create('ModalWindow', {
	            title:CMD_ADD  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
	            width: 512,
	            height: 300,
	            plain:true,
	            items: fp,
	            buttons: [{
	            	id: 'windowOkBtn',
	                text: '채택 확인',
	                disabled: true,
	            	handler: function(btn){
	            		var form = Ext.getCmp('formPanelSelect').getForm();
	            		if(form.isValid()) {
	            			var val = form.getValues(false);
	            			var gSelectedSupplier = val['selected_supplier'];
	            			
		            			Ext.Ajax.request({
			          				url: CONTEXT_PATH + '/purchase/rfq.do?method=selectSupplier',				
			          			params:{
			          				supast_uid : gSelectedSupplier,
			          				rf_uid : gRf_uid
			          			},
			          				success : function(result, request) {
			          					//var ret = result.responseText;
			          					//console_log('requested ajax...' + ret);
			          					store.load(function() {
			          						 mainTab.setActiveTab(0);
			        	            		if(w) {
			        	            			w.close();
			        	            		}
			          					});

			          				},
			          				failure: extjsUtil.failureMessage
			          			}); 
	            			
//	            			var supplier_name = getSupplierFromBuf(gSelectedSupplier);
//	            			
//		                	Ext.MessageBox.show({
//				                  title:'업체 선정',
//				                  msg: "'" + supplier_name + '\'를 단가계약 업체로 채택하시겠습니까?',
////				                  buttonText: {
////				                      yes: '확인',
////				                      no: '취소'
////				                  },
//				                  buttons: Ext.MessageBox.YESNO,
//				                  fn: function (btn){
//
//				          	    	console_log('gRf_uid:' + gRf_uid);
//				          	      	console_log('gSelectedSupplier:' + gSelectedSupplier);
//				          	      	
//				          	      	
//						              var result = MessageBox.msg('{0}', btn);
//						              if(result=='yes') {
//						                  //중복 코드 체크
//						          		
//						              }
//		
//						          },
//				                  icon: Ext.MessageBox.QUESTION
//				              });	            			
	            		}

	            	}
				},{
	                text: CMD_CANCEL,
	            	handler: function(){
	            		if(w) {
	            			w.close();
	            		}
	            	}
				}]
	        }); w.show();
      }
  });


function getRtgapp_store() {
	return new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'RtgApp'});
}

function deleteRtgappConfirm(btn){
	
    var selections = agrid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = agrid.getSelectionModel().getSelection()[i];
        		var unique_id = rec.get('unique_id');
	           	 var rtgapp = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'RtgApp');
        		
	           	rtgapp.destroy( {
	           		 success: function() {}
	           	});  	
        	}
        	agrid.store.remove(selections);
        }
    }
}

function getRemoveRtgapp() {
	return Ext.create('Ext.Action', {
		itemId: 'removeButton',
	    iconCls: 'remove',
	    text: CMD_DELETE,
	    disabled: true,
	    handler: function(widget, event) {
	    	Ext.MessageBox.show({
	            title:delete_msg_title,
	            msg: delete_msg_content,
	            buttons: Ext.MessageBox.YESNO,
	            fn: deleteRtgappConfirm,
	            //animateTarget: 'mb4',
	            icon: Ext.MessageBox.QUESTION
	        });
	    }
	});
}

var updown =
{
	text: Position,
    menuDisabled: true,
    sortable: false,
    xtype: 'actioncolumn',
    width: 60,
    items: [{
        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_up.png',  // Use a URL in the icon config
        tooltip: 'Up',
        handler: function(agridV, rowIndex, colIndex) {


        	var record = agrid.getStore().getAt(rowIndex);
        	console_log(record);
        	var unique_id = record.get('unique_id');
        	console_log(unique_id);
        	var direcition = -15;	
        	Ext.Ajax.request({
     			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
     			params:{
     				direcition:direcition,
//     				modifyIno: str,
     				unique_id:unique_id
     			},
     			success : function(result, request) {   
     				rtgapp_store.load(function() {});
     			}
       	    });

			}
    },{
        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_down.png',   // Use a URL in the icon config
        tooltip: 'Down',
        handler: function(agridV, rowIndex, colIndex) {

        	var record = agrid.getStore().getAt(rowIndex);
        	console_log(record);
        	var unique_id = record.get('unique_id');
        	console_log(unique_id);
        	var direcition = 15;
        	Ext.Ajax.request({
     			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
     			params:{
     				direcition:direcition,
//     				modifyIno: str,
     				unique_id:unique_id
     			},
     			success : function(result, request) {   
     				rtgapp_store.load(function() {});
     			}
       	    });


        }

    }]
};

function getComboBox() {
	return
		new Ext.form.field.ComboBox({
	        typeAhead: true ,
	        triggerAction: 'all',
	        selectOnTab: true ,
	        mode: 'local',
	        queryMode: 'remote',
	     editable: false ,
	     allowBlank: false ,
	      displayField:   'codeName' ,
	      valueField:     'systemCode' ,
	      store: routeGubunTypeStore_W,
	        listClass: 'x-combo-list-small' ,
	           listeners: {  }
	    });
}
var selectRouteAction = Ext.create('Ext.Action', {
	itemId: 'createButton',	
	iconCls:'add',
    text: GET_MULTILANG('prf3_SELECTQUOTA', vLANG) + '+ 주문상신',
    //disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: selectSupName+SELECT_COMPANY,
            buttons: Ext.MessageBox.YESNO,
            fn: supNameConfirm,//animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    	
    	function supNameConfirm(btn){
    		var supNameYes = MessageBox.msg('{0}', btn);
    		if(supNameYes=='yes') {
		    	myGrid.getSelectionModel().selectAll();
		    	var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
				var rtgapp_store = getRtgapp_store();
				var removeRtgapp = getRemoveRtgapp();
				var tempColumn = [];
	
				tempColumn.push(updown);
				for(var i=0; i<vCENTER_COLUMN_SUB.length; i++) {
					tempColumn.push(vCENTER_COLUMN_SUB[i]);
				}
				
				rtgapp_store.load(function() {
					
					Ext.each( /*(G)*/tempColumn, function (columnObj, index,value) {
			            
			            var dataIndex = columnObj["dataIndex" ];
			            //console_log(dataIndex);
			           columnObj[ "flex" ] =1;
			            if (value!="W" && value!='기안') {
			                  
			                   if ('gubun' == dataIndex) {
			                          var combo =  getComboBox();
			                          // the renderer. You should define it  within a namespace
//			                          var comboBoxRenderer = function (value, p, record) {
//			                                 if (value=='W' ) {
//			
//			                                } else {
//			                                   console_log('combo.valueField = ' + combo.valueField + ', value=' + value);
//			                                   console_log(combo.store);
//			                                   var idx = combo.store.find(combo.valueField, value);
//			                                   console_log(idx);
//			                                   var rec = combo.store.getAt(idx);
//			                                   console_log(rec);
//			                                   return (rec === null ? '' :  rec.get(combo.displayField) );
//			                                }
//			
//			                         };
//			         				//                 columnObj["renderer"] = comboBoxRenderer;
				                   columnObj[ "editor" ] = combo;
				                   columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
							        	p.tdAttr = 'style="background-color: #FFE4E4;"';
							        	return value;
						        	};
			            
			                  }//endof if gubun
			                  
			           }// endof calue W

			     }); //Ext.each( 
			
			//결재 그리드 생성
			agrid = Ext.create('Ext.grid.Panel', {
				title: routing_path,
			    store: rtgapp_store,
			    layout: 'fit',
			    columns : tempColumn,
			    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
    		    	clicksToEdit: 1
    		    })],
    		    border: false,
			    multiSelect: true,
			    frame: false
			    ,
			    dockedItems: [{
    				xtype: 'toolbar',
    				items: [{
    					fieldLabel: dbm1_array_add,
    					labelWidth: 42,
    					id :'user_name',
    			        name : 'user_name',
    			        xtype: 'combo',
    			        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
    			        store: userStore,
    			        labelSeparator: ':',
    			        emptyText:   dbm1_name_input,
    			        displayField:   'user_name',
    			        valueField:   'unique_id',
    			        sortInfo: { field: 'user_name', direction: 'ASC' },
    			        typeAhead: false,
    		            hideLabel: true,
    			        minChars: 2,
    			        width: 230,
    			        listConfig:{
    			            loadingText: 'Searching...',
    			            emptyText: 'No matching posts found.',
    			            getInnerTpl: function() {
    			                return '<div data-qtip="{unique_id}">{user_name}|{dept_name}</div>';
    			            }			                	
    			        },
    			        listeners: {
    			        	select: function (combo, record) {
    			        		console_log('Selected Value : ' + record[0].get('unique_id'));
    			        		var unique_id = record[0].get('unique_id');
    			        		var user_id = record[0].get('user_id');
    			        		Ext.Ajax.request({
                         			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappDyna',
                         			params:{
                         				useruid : unique_id
                         				,userid : user_id
                         				,gubun    : 'D'
                         			},
                         			success : function(result, request) {   
                         				var result = result.responseText;
                						console_log('result:' + result);
                						if(result == 'false'){
                							Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                						}else{
                							rtgapp_store.load(function() {});
                						}
                         			},
                         			failure: extjsUtil.failureMessage
                         		});
    			        	}//endofselect
    			        }
    				},
			        '->',removeRtgapp,
			        
			        {
                        text: panelSRO1133,
                        iconCls: 'save',
                        disabled: false,
                        handler: function ()
                        {
                        	var modifiend =[];
                        	var rec = grid.getSelectionModel().getSelection()[0];
                        	var unique_id = rec.get('unique_id');
                        	var seq_no = rec.get('seq_no');
	                        for (var i = 0; i <agrid.store.data.items.length; i++) {
	                                var record = agrid.store.data.items [i];
	                                
	                                if (record.dirty) {
	                                	rtgapp_store.getProxy().setExtraParam('unique_id', vSELECTED_UNIQUE_ID);
	                                   	console_log(record);
	                                   	var obj = {};
	                                   	obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
	                                   	obj['gubun'] = record.get('gubun');
	                                   	obj['owner'] = record.get('owner');
	                                   	obj['change_type'] = record.get('change_type');
	                                   	obj['app_type'] = record.get('app_type');
	                                   	obj['usrast_unique_id'] = record.get('usrast_unique_id');
	                                   	obj['seq'] = record.get('seq');
	                                   	obj['updown'] = 0;
	//	                                   	obj['dept_name'] = record.get('description');
	//	                                   	obj['email'] = record.get('description');
		                                   	modifiend.push(obj);
		                                }
	  
		                      } //endof for
                              
                              if(modifiend.length>0) {
                            	
	                            	console_log(modifiend);
	                            	var str =  Ext.encode(modifiend);
	                            	console_log(str);
	                           	    Ext.Ajax.request({
	                         			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=modifyRtgapp',
	                         			params:{
	                         				modifyIno: str,
	                         				srcahd_uid:unique_id
	                         			},
	                         			success : function(result, request) {   
	                         				rtgapp_store.load(function() {});
	                         			}
	                           	    });
	                          } //endof modified
                              

                        }//endof handler

                    }//emdof save Action
			        ]//endofitems
    			}] //endofdockeditems
    		}); //endof Ext.create('Ext.grid.Panel', 
			//결재 그리드 생성완료
    		
    		agrid.getSelectionModel().on({
    			selectionchange: function(sm, selections) {
		            if (selections.length) {
						if(fPERM_DISABLING()==true) {
							removeRtgapp.disable();
						}else{
							removeRtgapp.enable();
						}
		            } else {
		            	if(fPERM_DISABLING()==true) {
		            		collapseProperty();//uncheck no displayProperty
		            		removeRtgapp.disable();
		            	}else{
		            		collapseProperty();//uncheck no displayProperty
		            		removeRtgapp.disable();
		            	}
		            }
		        }//endof sselectionchange
    		}); //endof agrid.getSelectionModel().on
    		
    		
    		console_log(unique_uid);
    		var DeliveryAddressStore  = Ext.create('Mplm.store.DeliveryAddressStore', {hasNull: false} );
    		var form = Ext.create('Ext.form.Panel', {
	    		id: 'formPanel',
	    		xtype: 'form',
	    		frame: false ,
	    		border: false,
	    		bodyPadding: '3 3 0',
	    		region: 'center',
//	            width: 500,
//	            autoHeight: true,
	            fieldDefaults: {
	                labelAlign: 'middle',
	                msgTarget: 'side'
	            },
	            defaults: {
	                anchor: '100%',
	                labelWidth: 100
	            },
	            items: [
	                new Ext.form.Hidden({
		            id: 'hid_userlist_role',
		            name: 'hid_userlist_role'
			        }),
			        new Ext.form.Hidden({
			        	id: 'hid_userlist',
			        	name: 'hid_userlist'
			        }),
//			        new Ext.form.Hidden({
//			        	id: 'sales_price',
//			        	name: 'sales_price',
//			        	value: sales_price
//			        }),
			        new Ext.form.Hidden({
			        	id: 'unique_uid',
			        	name: 'unique_uid',
			        	value: unique_uid
			        }),
//			        new Ext.form.Hidden({
//			        	id: 'quan',
//			        	name: 'quan',
//			        	value: quan
//			        }),
			        new Ext.form.Hidden({
			        	id: 'supplier_uid',
			        	name: 'supplier_uid',
		        		value: gSelectedSupplier
			        }),
	            	new Ext.form.Hidden({
	            		id: 'supplier_name',
	            		name: 'supplier_name',
	            		value: supName
            			
	            	}),
	            	new Ext.form.Hidden({
	            		id: 'sales_amount',
	            		name: 'sales_amount',
	            		value: sales_amount
	            			
	            	}),
	            	agrid,
	            	{
	                	xtype: 'component',
	                	html: '<br/><hr/><br/>',
	                	anchor: '100%'
	            	},{
	            		fieldLabel: ppo1_request_date,
	            		value : new Date(),
                        endDateField: 'todate',
                    	xtype: 'datefield',    
	            		anchor: '100%',
	            		id: 'request_date',
	            		name: 'request_date'
	                },
//	                {
//	                	fieldLabel: ppo1_address, //회사주소 입력받기
//		            	xtype: 'textarea',
//		            	anchor: '100%',
////		            	value: '',
//		            	emptyText:'회사주소를 입력하세요',
//		            	id: 'delivery_address_1',
//		            	name: 'delivery_address_1'
//	                },
	                
	 	        	{
    	            	fieldLabel:ppo1_address,
    					id :'DELIVERY_ADDRESS',
    					name:           'DELIVERY_ADDRESS',
    					xtype:          'combo',
    					mode:           'local',
    					triggerAction:  'all',
    					forceSelection: true,
//    					editable:       false,
//    					allowBlank: false,
    					anchor:'100%',
    					emptyText:  prf1_warehouse_address,
    					displayField:   'codeName',
    					valueField:     'systemCode',
    					fieldStyle: 'background-color: #FBF8E6; background-image: none;',
    					queryMode: 'remote',
    					store: DeliveryAddressStore,
    					listConfig:{
    						getInnerTpl: function(){
    							return '<div data-qtip="{systemCode}">{codeName}</div>';
    						}			                	
    					},
    					listeners: {
    						select: function (combo, record) {
    							var DELIVERY_ADDRESS = Ext.getCmp('DELIVERY_ADDRESS').getValue();
//    							storeCartLine.getProxy().setExtraParam('DELIVERY_ADDRESS', DELIVERY_ADDRESS);
//    							storeCartLine.load({});
    						}//endofselect
    					}
    				},  
	                {
			            	fieldLabel: ppo1_request,
			             	xtype: 'textarea',
			            	hideLabel: false,
//			            	allowBlank: false,
			            	anchor: '100%',
			            	id: 'cood_del_info',
			            	name: 'cood_del_info'
		            },{
		            		fieldLabel: dbm1_txt_name,
			            	xtype: 'textfield',
			            	anchor: '100%',
			            	//value: item_code,
//			            	value: mold_no,
			            	id: 'txt_name',
			            	name: 'txt_name'
		            },{
		            		fieldLabel: dbm1_txt_content,
		            		xtype: 'textarea',
		            		hideLabel: false,
//		            		allowBlank: false,
		            		//value: item_name+' 외',
		            		anchor: '100%',
//		            		value: item,
		            		id: 'txt_content',
		            		name: 'txt_content'
	                }]//item end..
			});//Panel end...
	 	

			prWin = Ext.create('ModalWindow', {
            title:CMD_ADD  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
            width: 830,
            height: 530,//480,
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
            	handler: function(btn){

                    var form = Ext.getCmp('formPanel').getForm();
                    agrid.getSelectionModel().selectAll();
                    var aselections = agrid.getSelectionModel().getSelection();
                    
                    
                    var ahid_userlist = [];
                    var ahid_userlist_role = [];

                    if (aselections) {

                    	for(var i=0; i< aselections.length; i++) {
                    		var rec = agrid.getSelectionModel().getSelection()[i];
                    		ahid_userlist[i] = rec.get('usrast_unique_id');
                    		ahid_userlist_role[i] = rec.get('gubun');
                    		
                    	}
                    	
                    	cood_del_info=Ext.getCmp('cood_del_info').getValue();
                    	txt_name=Ext.getCmp('txt_name').getValue();
                    	txt_content=Ext.getCmp('txt_content').getValue();
//                    	Ext.getCmp('hid_userlist').setValue(ahid_userlist);                    	
//                    	Ext.getCmp('hid_userlist_role').setValue(ahid_userlist_role);
                    	
                    }//end if 
//                    var userstr =  Ext.encode(ahid_userlist);
//                    var userrolestr =  Ext.encode(ahid_userlist_role);
                    
                    console_log(ahid_userlist);
                    console_log(ahid_userlist_role);
                    
                    if(form.isValid())
                    {
                    	
//                    	var val = form.getValues(false);
//	                	var cartLine = Ext.ModelManager.create(val, 'CartLine');
//							cartLine.save({
//		                		success : function() {
//		                			//console_log('updated');
//		                           	if(prWin) 
//		                           	{
//		                           		prWin.close();
//		                           		store.load(function() {});
//		                           	} 
//		                		} 
//	                	 });
                    Ext.Ajax.request({
                		url: CONTEXT_PATH + '/purchase/rfq.do?method=selectSupplierRoute',				
                	params:{
                		supast_uid : gSelectedSupplier,
                		rf_uid : gRf_uid,
                		pay_condition : gPay_condition,
                		hid_userlist : ahid_userlist,
                		hid_userlist_role : ahid_userlist_role,
                		cood_del_info : cood_del_info,
                		txt_name : txt_name,
                		txt_content : txt_content
                		
                	},
                    	success : function(result, request) {
                			//var ret = result.responseText;
                			if(prWin) 
                           	{
                           		
                           	 //console_log('requested ajax...' + ret);
                			prWin.close();
                			store.load(function() {});

                        	partStore.getProxy().setExtraParam('rf_uid', -1000);
                        	partStore.load(function(){});
                           	}
                		},
                		failure: extjsUtil.failureMessage
                	}); 
                    }
                    else{
                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                    }
            	}
			},{
                text: CMD_CANCEL,
            	handler: function(){
            		if(prWin) {
            			prWin.close();
            		}
            	}
			}]
        });
    	  prWin.show();
		});
    	}
    	}
    }//handler end...
});


Ext.define('RtgAstRfq', {
	extend: 'Ext.data.Model',
	fields: /*(G)*/vCENTER_FIELDS,
    proxy: {
		type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/purchase/rfq.do?method=read',
            create: CONTEXT_PATH + '/purchase/rfq.do?method=create',
            update: CONTEXT_PATH + '/purchase/rfq.do?method=create',
            destroy: CONTEXT_PATH + '/purchase/rfq.do?method=destroy'
        },
		reader: {
			type: 'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success',
			excelPath: 'excelPath'
		},
		writer: {
            type: 'singlepost',
            writeAllFields: false,
            root: 'datas'
        }
	}
});

Ext.define('RtgAstQuota', {
	extend: 'Ext.data.Model',
	fields: /*(G)*/vCENTER_FIELDS,
    proxy: {
		type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/sales/quota.do?method=read'
        },
		reader: {
			type: 'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success',
			excelPath: 'excelPath'
		},
		writer: {
            type: 'singlepost',
            writeAllFields: false,
            root: 'datas'
        }
	}
});


Ext.define('RfqMapPartLineSimul', {
  	 extend: 'Ext.data.Model',
  	 fields:  [
  	        {name: 'ac_uid', type: 'int',id:ac_uid},
  	        {name: 'pj_code', type: 'string'},
  	        {name: 'item_code', type: 'string'},
  	        {name: 'full_spec', type: 'string'},
  	        {name: 'quan', type: 'float'},
  	        {name: 'srcahd_sales_price', type: 'float'},
  	        
  	        {name: 'rfqast_uid', type: 'int'},
  	        
  	        {name: 'sales_price0', style: 'background:yellow;',  type: 'float'},
  	        {name: 'tax_ratio0', style: 'background:yellow;',  type: 'float'},
  	        {name: 'sales_amount0', style: 'background:yellow;',  type: 'float'},
  	        {name: 'delivery_date0', style: 'background:yellow;',  type: 'string'},
  	        
  	        {name: 'sales_price1', type: 'float'},
  	        {name: 'tax_ratio1', type: 'float'},
  	      {name: 'sales_amount1', style: 'background:yellow;',  type: 'float'},
  	        {name: 'delivery_date1', type: 'string'},
  	        
  	        {name: 'sales_price2', type: 'float'},
  	        {name: 'tax_ratio2', type: 'float'},
  	      {name: 'sales_amount2', style: 'background:yellow;',  type: 'float'},
  	        {name: 'delivery_date2', type: 'string'},
  	        
  	        {name: 'sales_price3', type: 'float'},
  	        {name: 'tax_ratio3', type: 'float'},
  	      {name: 'sales_amount3', style: 'background:yellow;',  type: 'float'},
  	        {name: 'delivery_date3', type: 'string'},
  	        
  	        {name: 'sales_price4', type: 'float'},
  	        {name: 'tax_ratio4', type: 'float'},
  	      {name: 'sales_amount4', style: 'background:yellow;',  type: 'float'},
  	        {name: 'delivery_date4', type: 'string'},
  	      {name: 'total', type: 'int'}
  	    ],
  	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/purchase/rfq.do?method=readRfqSimul', /*1recoed, search by cond, search */
		            create: CONTEXT_PATH + '/purchase/rfq.do?method=readRfqSimul', /*create record, update*/
		            update: CONTEXT_PATH + '/purchase/rfq.do?method=readRfqSimul'
		        },
				reader: {
					type: 'json',
					root: 'datas',
					totalProperty: 'count',
					success: 'success',
					excelPath: 'excelPath',
					supplierList: "supast"
				},
	            listeners: {
	                exception: function(proxy, response, operation, eOpts ){
	                			alert(response);
	                        }

	            }    
			}
//			,
//	        afterRequest: function(req, res) {
//	        	alert(1);
//	            console_log("Ahoy!", req.operation.response);    
//	        }
//			,
//		    listeners: {
//		        metachange: function(store, meta) {
//		            console_log("success: " + meta.success);     
//		        }
//		    }
});

var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );		

Ext.onReady(function() {  

	var searchField = [];
	
	searchField.push('unique_id');
	searchField.push('po_no');
	searchField.push('name');
	searchField.push('content');
	
	makeSrchToolbar(searchField);
	
	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'RtgAstRfq',
		//remoteSort: true,
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	
	storeQuota = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'RtgAstQuota',
		//remoteSort: true,
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	
	
    partStore = new Ext.data.Store({  
		pageSize: 1000,
		groupField :'pj_code',
		model: 'RfqMapPartLineSimul'
	});
    
    Ext.define('RtgApp', {
     	 extend: 'Ext.data.Model',
     	 fields: /*(G)*/vCENTER_FIELDS_SUB,
     	    proxy: {
   				type: 'ajax',
   		        api: {
   		        	read: CONTEXT_PATH + '/rtgMgmt/routing.do?method=readRtgappDyna&change_type=D',
   		            create: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappDyna',
   		            destroy: CONTEXT_PATH + '/rtgMgmt/routing.do?method=destroyRtgapp'
   		        },
   				reader: {
   					type: 'json',
   					root: 'datas',
   					totalProperty: 'count',
   					successProperty: 'success'
   				},
   				writer: {
   		            type: 'singlepost',
   		            writeAllFields: false,
   		            root: 'datas'
   		        } 
   			}
   	});
    
    

    var myColumns = [];
    myColumns.push({
        header: prf3_mold_no,
        width: 85,
        tdCls: 'task',
        sortable: false,
        dataIndex: 'pj_code',
        locked: true,
        hideable: false,
        summaryType: 'count',
        summaryRenderer: function(value, summaryData, dataIndex) {
            return ((value === 0 || value > 1) ? '(' + value + ' Items)' : '(1 Items)');
        },
        field: {
            xtype: 'textfield'
        }
    });
    myColumns.push({
        header: '품목코드',
        width: 85,
        tdCls: 'task',
        sortable: false,
        dataIndex: 'item_code',
        locked: true,
        hideable: false,
        summaryType: 'count',
        summaryRenderer: function(value, summaryData, dataIndex) {
            return '합계';
        },
        field: {
            xtype: 'textfield'
        }
    });
    
    myColumns.push({
        text: '규격',
        width: 140,
        tdCls: 'task',
        sortable: false,
        dataIndex: 'full_spec',
        locked: true,
        hideable: false,
        summaryType: 'count',
        summaryRenderer: function(value, summaryData, dataIndex) {
            return ((value === 0 || value > 1) ? + value + ' 종' : '1 종');
        },
        field: {
            xtype: 'textfield'
        }
    });
    
    myColumns.push({
        header: prf3_standard_price,
        align : 'right',
        width: 100,
        sortable: false,
        dataIndex: 'srcahd_sales_price',
        locked: true,
        hideable: false,
        summaryType: 'average',
        field: {
            xtype: 'numberfield'
        },
        renderer: renderNumberBlank,
        summaryRenderer: function(value, summaryData, dataIndex) { return '';/* return '평균:' + Ext.util.Format.number(value, '0,00/i');  */ }
    });
    
    myColumns.push({
        header: prf3_quantity,
        align : 'right',
        width: 40,
        sortable: false,
        dataIndex: 'quan',
        locked: true,
        hideable: false,
        summaryType: 'sum',
        field: {
            xtype: 'numberfield'
        },
        renderer: renderNumberBlank
    });

    for(var i=0; i<5; i++) {
    	myColumns.push({
	            header: '<div id=divSupplier' + i + '>' +'</div>',
	            sortable: false,
	            columns: [{
	                header: prf3_unit_cost,
	                align : 'right',
	                width: 90,
	                sortable: false,
	                dataIndex: 'sales_price' + i,
	                summaryType: 'average',
	                field: {
	                    xtype: 'numberfield'
	                },
	                renderer: renderNumberBlank,
	                summaryRenderer: renderNumberBlank
	            }, {
	                header: prf3_total_cost,
	                width: 90,
	                align : 'right',
	                flex: true,
	                sortable: false,
	                groupable: false,
	                dataIndex: 'sales_amount' + i,
	                summaryType: 'sum',
	                renderer: renderNumberBlank,
	                summaryRenderer: renderNumberBlank
	            },
	            {
	                header: prf3_due_date,
	                width: 80,
	                align : 'center',
	                sortable: false,
	                dataIndex: 'delivery_date' + i,
	                summaryType: 'max',
	                renderer: renderDate,
	                summaryRenderer: renderDate,
	                field: {
	                    xtype: 'datefield'
	                }
	            }]
	        });
    }//endoffor

    //loading 순서는 on --> loading 이다.
    partStore.on({ 'load': function (store, records, successful)  {

    	console_logs('records', records);
		var data = store.getProxy().getReader().rawData;
		supastList = data.supast;    		
		receivedTab.removeAll();    		

		for(var i=0; i<supastList.length; i++) {

			var supCode = supastList[i]['supplier_code'];
	    	supName = supastList[i]['supplier_name'];
	    	supast_uid = supastList[i]['supast_uid'];
	    	var rendName = 'divSupplier' + i;
	    	
			var range = Ext.get(rendName);
			range.update('');
	    	
			var html = supName;//'<div><button><small>선택</small></button>&nbsp;' + supName + '</div>';

			var obj = {
				id: 'div_' + supCode,
				html : html,
				disabled: false,
				border: false,
	            renderTo: rendName,
	            handler : function (){ }
            };

		    Ext.widget( 'component', Ext.apply(obj)	  );
		    
		    var p = {	            
	        	id: 'tab-' + supCode,
	            title: html,
	            xtype: 'form',
	            border: false,
	            //autoScroll:true,
	            layout: 'vbox',
		        dockedItems: [{
		        	xtype: 'toolbar',
		            items:[excel_down, '-' ,{ 
		                	fieldLabel: '',
		 			    	xtype: 'textfield',
		 			    	
		 			    	value: supCode,
		 			    	readOnly: true,
		 			    	width: 70,
		 			    	fieldStyle: 'background-color: #E7EEF6; background-image: none;text-align:center;',
						},'-',{ 
		                	fieldLabel: '',
		 			    	xtype: 'textfield',
		 			    	value: supName,
		 			    	readOnly: true,
		 			    	fieldStyle: 'background-color: #E7EEF6; background-image: none;',
		 			    	
						}] 
		        }],
		 	      items: [{
	 	    	     id: 'quota_content'+ supCode,
		             name: 'quota_content'+ supCode,
		             xtype: 'displayfield',
		             width: '100%',
		             height: '100%',
		             border: false,
		             enableColors: false,
		             enableAlignments: false,
		             anchor: '100%',
		             listeners: {
		                 initialize: function(editor) {
		                	 //console_logs('editor', editor);
		                     var styles = {           };
		                     Ext.DomHelper.applyStyles(editor.getEditorBody(), styles);
		                 }
		             },
		             value: ''//initTableInfo
		    	 }]
	        };
		    receivedTab.add(p);
		    receivedTab.doLayout();
		    
		}//endoffor
		
		for(var i=0; i< records.length; i++) {
    		var rec = records[i];
    		//console_logs('rec', rec);
    		var rfqast_uid  = rec.get('rfqast_uid');
    		if(rfqast_uid !=0 ){
    			var sales_prices = rec.get('srcahd_sales_price');
        		unique_uid[i]=rfqast_uid;
        		sales_amount += sales_prices;
    		}
    	}
		
		storeQuota.getProxy().setExtraParam('reserved_number4', gRf_uid);
		storeQuota.getProxy().setExtraParam('buyer_view', 'true');
		gQuotas = [];
		
		
		storeQuota.load(function(quotas){
		
			gMinimumPriceSupplierCode = null;
			var curAmountSum=0;
			var supName = '';
			//최저가 견적
			for(var j=0; j<quotas.length; j++) {
				if(j==0) {
					gSelectedQuota = quotas[j];
					gSelectedQuotaUid = gSelectedQuota.get('unique_id');
				}
				//console_logs('j', j);
				//console_logs('quotas[' + j + ']', quotas[j]);
				gQuotas.push(quotas[j]);
        		var amountSum = makeHtmlEachSupplier(j, quotas[j], records);
        		//console_logs('amountSum', amountSum);
        		if(amountSum>0) { //견적있는 경우
        			//console_logs('견적 있는 amountSum', amountSum);
            		if(gMinimumPriceSupplierCode==null || amountSum<curAmountSum ) {
            			//console_logs('공급사 선택된 amountSum', amountSum);
            			supName = quotas[j].get('supplier_name');
            			gMinimumPriceSupplierCode = quotas[j].get('supplier_code');
            			curAmountSum = amountSum;
            		}        			
        		} else { //견적없는 경우
        			//console_logs('견적없는 amountSum', amountSum);
        		}

			}
    		//console_logs('curAmountSum', curAmountSum);
    		//console_logs('gMinimumPriceSupplierCode', gMinimumPriceSupplierCode);

    		if(gMinimumPriceSupplierCode!=null) {
    			var rendName = 'div_' + gMinimumPriceSupplierCode;
    			Ext.get(rendName).update('');
    			var obj = {
					html : supName + '<font color=red><b>*</b></font>',
					disabled: false,
					border: false,
		            renderTo: rendName,
		            handler : function (){ }
	            };

			    Ext.widget( 'component', Ext.apply(obj)	  );  			
    		}

    		receivedTab.doLayout();
    		receivedTab.setActiveTab(0);
		});    		
		
    } }); //endofpartstoreon
    
    
	store.load(function() {

		grid = Ext.create('Ext.grid.Panel', {
		        store: store,
		        height: getCenterPanelHeight(), 
		        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
		        selModel: selModel,
		        autoScroll : true,
		        autoScroll : true,
				autoHeight: true,
		        bbar: getPageToolbar(store),
		        region: 'center',
		        width: '75%',
		        border: false,
		        dockedItems: [{
		            dock: 'top',
		            xtype: 'toolbar',
		            items: [searchAction, '-', sendMailAction]
		        },
		        {
		            xtype: 'toolbar',
		            items: /*(G)*/vSRCH_TOOLBAR/*vSRCH_TOOLBAR*/
		        }
		        ], //end ofdockedItems
		        columns: /*(G)*/vCENTER_COLUMNS,
		        viewConfig: {
		            stripeRows: true,
		            enableTextSelection: true,
		            getRowClass: function(record) { 
 			              return record.get('creator_uid')  == vCUR_USER_UID ? 'my-row' : ''; 
		            } ,
		            listeners: {
		            	'afterrender' : function(grid) {
							var elments = Ext.select(".x-column-header",true);//.x-grid3-hd
							elments.each(function(el) {
											//el.setStyle("color", 'black');
											//el.setStyle("background", '#ff0000');
											//el.setStyle("font-size", '12px');
											//el.setStyle("font-weight", 'bold');
					
										}, this);
								
							}
		            		,
		                itemcontextmenu: function(view, rec, node, index, e) {
		                    e.stopEvent();
		                    contextMenu.showAt(e.getXY());
		                    return false;
		                }
		            	//,itemdblclick: viewHandler
		            }//endoflistener
		        }//endofviewconfig
		       

		    });//endof grid create
		
		
	    var filePanel =  Ext.create('Ext.panel.Panel', {	
		   layout:'border',
		   hideCollapseTool: true,
	       region: 'east',
	       width: '25%',
	       height: getCenterPanelHeight(), 
	       border: false,
	       listeners: {
	           beforerender: function(panel) {
	               var borderLayout = panel.getLayout();

	               borderLayout.onPlaceHolderToolClick = function(e, target, owner, tool) {
	                   this.floatCollapsedPanel({
	                       getTarget: function() {
	                           return false;
	                       }
	                   }, tool.client);
	               };
	           }
	       },
		   items: [{
		       border: false,
		       autoScroll:true,
		       height: getCenterPanelHeight(), 
		       items:[{
						xtype : "component",
						id: 'iframeFileUploadHistory',
						autoEl : {
							tag : "iframe",
							height: '100%',
							width: '100%',
							border: 0,
						    //src : CONTEXT_PATH + '/uploader.do?method=fileUploadHistory',
						    frameBorder: 0
						}
			       }]
			   }]
		});
	    
		
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		        	console_logs('selections', selections);
		        	if (selections.length) {
		        		
		        		var rec = grid.getSelectionModel().getSelection()[0];
		        		displayProperty(rec);
		        		
		        		gRf_uid = rec.get('unique_id');
		        		gPay_condition = rec.get('pay_condition');
		        		partStore.getProxy().setExtraParam('rf_uid', gRf_uid);
	                	partStore.getProxy().setExtraParam('pay_condition', gPay_condition);
	                	partStore.load(function(header){});
	                	
                		myGrid.setDisabled(false);
                		receivedTab.setDisabled(false);
                		removeAction.enable();
                		sendMailAction.enable();
                		gSelectedRfq = rec;
		        	
		        	} else {//endofelection
		        		collapseProperty();
		        		myGrid.setDisabled(true);
		        		receivedTab.setDisabled(true);
		        		removeAction.disable();
		        		sendMailAction.disable();
		        		gSelectedRfq = null;
		        		gRf_uid = -1;
		        		
		        	}
		        	//setFileUploadHistory(CONTEXT_PATH + '/uploader.do?method=fileUploadHistory&rf_uid=' + gRf_uid);
		        	console_logs('gRf_uid', gRf_uid);
		        	console_logs('gSelectedRfq', gSelectedRfq);
		        	callHistoryPanel(gRf_uid, gSelectedRfq);
		        	
		        }//endofselectionchange
		    });//endofgridon
 
	     //견적채택 grid 정의
		 myGrid = Ext.create('Ext.grid.Panel', {
	        //region: 'south',
			stateId: 'stateMyGrid' + /*(G)*/vCUR_MENU_CODE,
	        title: '견적채택',
	        height: getCenterPanelHeight(), 
	        store: partStore,
	        disabled : true,
	        listeners: {
	            beforeshowtip: function(grid, tip, data) {
	                var cellNode = tip.triggerEvent.getTarget(tip.view.getCellSelector());
	                if (cellNode) {
	                    data.colName = tip.view.headerCt.getHeaderAtIndex(cellNode.cellIndex).text;
	                }
	            }
	        },
	        viewConfig : {            
	        	stripeRows : true,            
	        	enableTextSelection : false       
	       	},
	        features: [ {
	            id: 'group',
	            ftype: 'groupingsummary',
	            groupHeaderTpl: '{name}',
	            hideGroupedHeader: true,
	            enableGroupingMenu: true
	        }],
	        dockedItems: [{
	            dock: 'top',
	            xtype: 'toolbar',
	            items: [
	                    removeAction, selectAction,'-'//,selectRouteAction,
  				        //'->'
  				     ]
	        	}
	        
	        ],
	        columns: myColumns
	    });//endofmygrid

	 
	   receivedTab = new Ext.TabPanel({
	    		id:'rfq-received-tab-panel',
	    		//region: 'center',
	    		//width: '80%',
	    	    collapsible: true,
	    	    border: false,
	    	    disabled : true,
				xtype: 'tabpanel',
				title:'견적서',
		        activeTab: 0,
		        listeners: {
		            'tabchange': function(tabPanel, tab) {
		            	
		                //console_logs('tab.id', tab.id);
		               // console_logs('gQuotas', gQuotas);

		                for(var num=0; num<gQuotas.length; num++) {
			                var quota = gQuotas[num];
			                if(quota!=null) {
				                var supplier_code = quota.get('supplier_code');
				                
				                //console_logs(quota);
				                if(supplier_code == (tab.id).substring(4)) {
				                	gSelectedQuota = quota;
					                gSelectedQuotaUid = gSelectedQuota.get('unique_id');
					                console_logs('gSelectedQuotaUid', gSelectedQuotaUid);		             
					                console_logs('gSelectedQuota', gSelectedQuota);		  
				                } else {
				                	//console_logs('오류', tab.id + ":" + supplier_code);		 
				                }	                	
			                }

		                }
		                	            	
		            }
		        },
		        tabPosition: 'bottom'
	    });
   

	    
		var  historyTab = Ext.create('Ext.panel.Panel', {
			height: getCenterPanelHeight(),
		    layout:'border',
		    border: false,
		    layoutConfig: {columns: 2, rows:1},
		    defaults: {
		        collapsible: true,
		        split: true,
		        cmargins: '5 0 0 0',
		        margins: '0 0 0 0'
		    },
		    title: '견적요청 이력',
		    items: [  grid, filePanel  ]
		});
	    
	    
	    
		mainTab = new Ext.TabPanel({
	    		id:'rfq-tab-panel',
	    		//region: 'center',
	    		//width: '80%',
	    	    collapsible: true,
				xtype: 'tabpanel',
				title:getMenuTitle(),
		        activeTab: 2,
		        tabPosition: 'top',
		        items: [historyTab, receivedTab, myGrid]
		});
	    
		
	  	fLAYOUT_CONTENT(mainTab);
	    //callback for finishing.
	    cenerFinishCallback();
	    
	    for(var i=0; i<5; i++) {
	    
	    	var supName = i+1 + '';
	    	var rendName = 'divSupplier' + i;
	    	
	    	var obj = {
    				html : '&nbsp;&nbsp;',
    				disabled: true,
    	            renderTo: rendName,
    	            handler : function (){ 
    	            }};
		    	Ext.widget( 'component', Ext.apply(obj)	     );
	    }//endoffor
	    //mainTab.setActiveTab(1);
	    mainTab.setActiveTab(0);
	    
	    var fileUploadLink = CONTEXT_PATH + '/uploader.do?method=fileUploadHistory&rf_uid=' + -1 + '&height=' + (getCenterPanelHeight() -54 );
	    console_logs('fileUploadLink', fileUploadLink);
	    setFileUploadHistory(fileUploadLink);

	}); //store load

		 	

});//OnReady





