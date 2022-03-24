
var g = null;
function modifyConfirm(btn){
	var unique_id  = g.getSource()["unique_id"];
	var uid_comast  = g.getSource()["uid_comast"];
	var wa_code  = g.getSource()["wa_code"];
	var company_code  = g.getSource()["company_code"];
	var biz_no  = g.getSource()["biz_no"];
	var wa_name  = g.getSource()["wa_name"];
	var president_name  = g.getSource()["president_name"];
	var zip_code  = g.getSource()["zip_code"];
	var biz_condition  = g.getSource()["biz_condition"];
	var biz_category  = g.getSource()["biz_category"];
	var abudget_av_flag  = g.getSource()["abudget_av_flag"];
	var bs_approval_type  = g.getSource()["bs_approval_type"];
	var payment_request_type  = g.getSource()["payment_request_type"];
	var agreement_flag  = g.getSource()["agreement_flag"];
	var address_1 = g.getSource()["address_1"];
	
	var result = MessageBox.msg('{0}', btn);
	if(result=='yes') {	         
	        var comBst = Ext.create('ComBst', {
	     		 unique_id: unique_id,
	     		uid_comast: uid_comast,
	     		wa_code: wa_code,
	     		company_code: company_code,
	     		biz_no: biz_no,
	     		wa_name: wa_name,
	     		president_name: president_name,
	     		zip_code: zip_code,
	     		biz_condition: biz_condition,
	     		biz_category: biz_category,
	     		abudget_av_flag: abudget_av_flag,
	     		bs_approval_type: bs_approval_type,
	     		payment_request_type: payment_request_type,
	     		agreement_flag: agreement_flag,
	     		address_1: address_1
	     	});
	    		
	        comBst.save( {
	             success: function(){ 
	            	 lfn_gotoHome();
	           	 }
	        });
	        
	 }

};

var addAction = Ext.create('Ext.Action', {
	iconCls:'save',
	text: CMD_OK,
	disabled: fPERM_DISABLING(),
    handler: function(widget, event){
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: GET_MULTILANG('areyousuremsgmod', vLANG),
            buttons: Ext.MessageBox.YESNO,
            fn: modifyConfirm,
            icon: Ext.MessageBox.QUESTION
        });
 	 }//end handler
});


function createGrid(comBst) {
	var unique_id = comBst.get('unique_id');//
	 var uid_comast = comBst.get('uid_comast');
	 var wa_code = comBst.get('wa_code');//회사코드
	 var company_code = comBst.get('company_code');//회사식별
	 var biz_no = comBst.get('biz_no');//사업자등록
	 var wa_name = comBst.get('wa_name');//회사명		 
	 var president_name = comBst.get('president_name' );//대표자		 
	 var zip_code = comBst.get('zip_code');//소재지
	 var biz_condition = comBst.get('biz_condition');//업태
	 var biz_category = comBst.get('biz_category');//종목		
	 var abudget_av_flag = comBst.get('abudget_av_flag');//검색수정			 
	 var bs_approval_type = comBst.get('bs_approval_type' );//부서추가권한
	 var payment_request_type = comBst.get('payment_request_type');//견적서 결재
	 var agreement_flag = comBst.get('agreement_flag');//기타주문
	 var address_1 = comBst.get('address_1');

	 var source = {};
	 source['unique_id'] = unique_id;
	 source['uid_comast'] = uid_comast;
	 source['wa_code'] = wa_code;
	 source['company_code'] = company_code;
	 source['biz_no'] = biz_no;
	 source['wa_name'] = wa_name;
	 source['president_name'] = president_name;
	 source['zip_code'] = zip_code;
	 source['biz_condition'] = biz_condition;
	 source['biz_category'] = biz_category;
	 source['abudget_av_flag'] = abudget_av_flag;
	 source['bs_approval_type'] = bs_approval_type;
	 source['payment_request_type'] = payment_request_type;
	 source['agreement_flag'] = agreement_flag;
	 source['address_1'] = address_1;
	
	 
	 
	 g =
	Ext.create('Ext.grid.property.Grid', {
		title: getMenuTitle(),
       collapsible: true,
       multiSelect: true,
       stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
       autoScroll: true,
       autoHeight: true,
       height: getCenterPanelHeight(),
       propertyNames: {
          	unique_id: getTextName(gCombstFields, 'unique_id'),
          	uid_comast: getTextName(gCombstFields, 'uid_comast'),
          	wa_code: getTextName(gCombstFields, 'wa_code'),
          	company_code: getTextName(gCombstFields, 'company_code'),
          	biz_no: getTextName(gCombstFields, 'biz_no'),
          	wa_name: getTextName(gCombstFields, 'wa_name'),
          	president_name: getTextName(gCombstFields, 'president_name'),
          	zip_code: getTextName(gCombstFields, 'zip_code'),
          	biz_condition: getTextName(gCombstFields, 'biz_condition'),
          	biz_category: getTextName(gCombstFields, 'biz_category'),
          	abudget_av_flag: getTextName(gCombstFields, 'abudget_av_flag'),
          	bs_approval_type: getTextName(gCombstFields, 'bs_approval_type'),
          	payment_request_type: getTextName(gCombstFields, 'payment_request_type'),
          	agreement_flag: getTextName(gCombstFields, 'agreement_flag'),
          	address_1: getTextName(gCombstFields, 'address_1')
          },//propnames
          source: source,
          listeners : {
          	beforeedit : function(editor, e, opts) {
          		if( e.record.get( 'name' )=='unique_id') {
	                return false;            
	            }
          		if( e.record.get( 'name' )=='uid_comast') {
	                return false;            
	            }
          		if( e.record.get( 'name' )=='unique_id_long') {
	                return false;            
	            }
          		if( e.record.get( 'name' )=='wa_code') {
	                return false;            
	            }
          	}//beforeedit
          }//listener
          ,
	         dockedItems: [{
	     		dock: 'top',
	             xtype: 'toolbar',
	     		items: [
	     		        addAction,'->',
	     		        {		        	
	     		        }
	     		        ]
	     	}]
	});//create
	fLAYOUT_CONTENT(g);
	cenerFinishCallback();
}


Ext.onReady(function() {  
	
	
	Ext.define('ComBst', {
		extend : 'Ext.data.Model',
		fields: gCombstFields,
		proxy : {
			type : 'ajax',
			api : {
				read : CONTEXT_PATH + '/userMgmt/combst.do?method=read',
				create: CONTEXT_PATH + '/userMgmt/combst.do?method=change'
				},
			reader : {
				type : 'json',
				root : 'datas',
				successProperty : 'success'
			},
			writer: {
		            type: 'singlepost',
		            writeAllFields: false,
		            root: 'datas'
		        } 
		}
	});

	ComBst.load('', {
		success : function(comBst) {
			createGrid(comBst);
		}// endofsuccess
	});// load
	
	
	cenerFinishCallback();
});