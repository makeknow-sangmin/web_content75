//Ext.require([
//    'Ext.window.MessageBox',
//    'Ext.tip.*'
//]);

var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});
var cellEditing1 = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});
var cellEditing2 = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});
// *****************************GLOBAL VARIABLE**************************/
var grid = null;
var gridMycart = null;
var gridStock = null;
var store = null;
var myCartStore = null;
var stockStore = null;
var gItemGubunType = null;
var itemGubunType = null;

var agrid = null;
var inpuArea = null;
var ahid_userlist = new Array();
var ahid_userlist_role = new Array();

var sales_price = '';
var quan = '';
var selectedAssyRecord = null;
var lineGap = 35;

var selectedPjUid = '';
var selectedAssyUid = '';

var toPjUidAssy = '';	// parent
var toPjUid = '';	// ac_uid
var selectionLength = 0;

var commonUnitStore = null;
var commonCurrencyStore = null;
var commonModelStore = null;

var assy_pj_code='';
var assy_code='';
var selectedPjCode='';
var selectedPjName='';
var selectedAssyCode = '';
var selectedAssyDepth=0;
var selectedAssyName ='';
var selectedparent ='';
var ac_uid = '';

var selectedPjQuan= 1;
var selectedAssyQuan= 1;
var selectedMakingQuan = 1;

var addpj_code = '';
var is_complished = false;

var routeTitlename = '';
var puchaseReqTitle = '';

var CHECK_DUP = '-copied-';

var gGridSelects=[];
function copyArrayGrid(from) {

	gGridSelects = [];
	if(from!=null && from.length>0) {	
		for(var i=0; i<from.length; i++) {
			gGridSelects[i] = from[i];
		}
	}
}

var gGridMycartSelects=[];
function copyArrayMycartGrid(from) {

	gGridMycartSelects = [];
	if(from!=null && from.length>0) {	
		for(var i=0; i<from.length; i++) {
			gGridMycartSelects[i] = from[i];
		}
	}
}

var gGridStockSelects=[];
function copyArrayStockGrid(from) {

	gGridStockSelects = [];
	if(from!=null && from.length>0) {	
		for(var i=0; i<from.length; i++) {
			gGridStockSelects[i] = from[i];
		}
	}
}


var initTableInfo = '';
function INIT_TABLE_HEAD(){
var a =
	'<style>'+
	' .xl65 {padding-left:2px;padding-right:2px;  font-size:11px; }'+
	' .xl66 {padding-left:2px;padding-right:2px; background: #FFFF99;  font-size:11px;}' +
	' .xl67 {padding-left:2px;padding-right:2px; background:#F0F0F0; font-size:9px;}' +
	' </style>' +
	'<table border="1" cellpadding="1" cellspacing="1" style="border-collapse: collapse;">' +
'<colgroup>'+
	'<col width="80px">' +
	'<col width="90px">' +
	'<col width="*">' +
	
	'<col width="90px">' +
	'<col width="90px">' +
	'<col width="50px">' +
	'<col width="90px">' +
	
	'<col width="60px">' +
	'<col width="60px">' +
	'<col width="40px">' +
	
	'<col width="110px">' +
	'<col width="90px">' +
'</colgroup>' +
	'<tbody>' +
	'<tr  height="30" >' +
	'	  <td class="xl66" align=center>프로젝트코드</td>' +
	'	  <td class="xl67" align=center>' + selectedPjCode + '</td>' +
	'	  <td class="xl66" align=center>프로젝트이름</td>' +
	'	  <td class="xl67" align=center>'+ selectedPjName + '</td>' +
	'<td colspan="8" rowspan="2">'+
	'</td>' +
	'	 </tr>' + 
	'<tr  height="30" >' +
	'	  <td class="xl66" align=center>Assy코드</td>' +
	'	  <td class="xl67" align=center>'+ assy_code + '</td>' +
	'	  <td class="xl66" align=center>Assy이름</td>' +
	'	  <td class="xl67" align=center>'+ selectedAssyName + '</td>' +
	'	 </tr>' + 
	'<tr  height="25" >' +
	'	  <td class="xl66" align=center>품번</td>' +
	'	  <td class="xl66" align=center>품명</td>' +
	'	  <td class="xl66" align=center>규격</td>' +
	
	'	  <td class="xl66" align=center>재질</td>' +
	'	  <td class="xl66" align=center>후처리</td>' +
	'	  <td class="xl66" align=center>열처리</td>' +
	'	  <td class="xl66" align=center>제조원</td>' +
	
	'	  <td class="xl66" align=center>예상가격</td>' +
	'	  <td class="xl66" align=center>수량</td>' +
	'	  <td class="xl66" align=center>구분</td>' +
	'	  <td class="xl66" align=center>품목코드</td>' +
	'	  <td class="xl66" align=center>UID</td>' +
'	 </tr>';
	
	return a;
}

var INIT_TABLE_TAIL =  	
	'</tbody></table><br><br>' +
	'<div style="color:blue;font-size:11px;position:relative; "><ul>'+
	'<li>Excel Form에서는 엑셀프로그램과 Copy/Paste(복사/붙여넣기)하여 BOM을 생성,수정할 수 있습니다.</li>'+
	'<li>위 영역의 모든 셀을 선택하여 복사(Ctrl+C)하여 엑셀에 붙여넣기(Ctrl+P) 해보세요.</li>'+
	'<li>엑셀 작업 후 작업한 내용을 복사 한 후 다시 이곳에 붙여넣기 하고 [디플로이] 버튼을 눌러 저장하세요.</li>'+
	'</ul></div>'
	;

function makeInitTable() {

	var initTableLine = 
	'	 <tr height="25" style="height:12.75pt">' +
	'	  <td class="xl65">&nbsp;</td>' +
	'	  <td class="xl65">&nbsp;</td>' +
	'	  <td class="xl65">&nbsp;</td>' +
	'	  <td class="xl65">&nbsp;</td>' +
	'	  <td class="xl65">&nbsp;</td>' +
	'	  <td class="xl65">&nbsp;</td>' +
	'	  <td class="xl65">&nbsp;</td>' +
	'	  <td class="xl65">&nbsp;</td>' +
	'	  <td class="xl65">&nbsp;</td>' +
	'	  <td class="xl65">&nbsp;</td>' +
	'	  <td class="xl67">&nbsp;</td>' +
	'	  <td class="xl67">&nbsp;</td>' +
	'	 </tr>';

	initTableInfo = INIT_TABLE_HEAD();

//	for(iTable=0; iTable<10;iTable++) {
//		initTableInfo = initTableInfo + initTableLine;
//	}
	initTableInfo = initTableInfo + INIT_TABLE_TAIL;

}

var bomTableInfo='';

function createLine(val, align, background, style) {
	return '<td height="25" class="' + style + '" style="background:' + background + '" align=' + align + '>'+ val + '</td>' ;
}

function setChildQuan(n) {
	var o = Ext.getCmp('childCount-DBM7');
	if(o!=null) {
		o.update(''+ n);	
	}
}
function setAssyQuan(n) {
	var o = Ext.getCmp('assy_quan');
	if(o!=null) {
		o.update(''+ n);	
	}
}
function setProjectQuan(n) {
	var o = Ext.getCmp('pj_quan-DBM7');
	if(o!=null) {
		o.update(''+ n);	
	}
}

function setMaking_quan(n) {
	var o = Ext.getCmp('making_quan-DBM7');
	if(o!=null) {
		o.update(''+ n);	
	}
	
}

var createHtml = function(route_type, rqstType, catmapObj) {
	var htmlItems =
		'<style>'+
		' .xl65 {padding-left:2px;padding-right:2px;  font-size:11px; }'+
		' .xl66 {padding-left:2px;padding-right:2px; background: #FFFF99;  font-size:11px;}' +
		' .xl67 {padding-left:2px;padding-right:2px; background:#F0F0F0; font-size:9px;}' +
		' </style><hr />' + '<div style="overflow-y:scroll;overflow-x: hidden;height:140px;">' +
	'<table border="1" cellpadding="1" cellspacing="1" style="border-collapse: collapse;width:790px;">' +
	'<colgroup>'+
		'<col width="10%">' +
		'<col width="10%">' +
		'<col width="10%">' +
		'<col width="20%">' +
		'<col width="40%">' +
	'</colgroup>' +
		'<tbody>' +
		'<tr  height="25" >' +
		'	  <td class="xl67" align=center>품목코드</td>' +
		'	  <td class="xl67" align=center>필요수량</td>' +
		'	  <td class="xl67" align=center>' + rqstType + '수량</td>' +
		'	  <td class="xl67" align=center>품명</td>' +
		'	  <td class="xl67" align=center>규격</td>' +
		'	 </tr>' ;
	for(var i=0; i< catmapObj.length; i++) {
		var rec = catmapObj[i];//grid.getSelectionModel().getSelection()[i];
		var item_code = rec.get('item_code');
		var quan = route_type=='P' ? rec.get('reserved_double1') : rec.get('goodsout_quan');
		var new_pr_quan = rec.get('new_pr_quan');
		var item_name = rec.get('item_name');
		var specification = rec.get('specification');
		
		htmlItems = htmlItems + '	 <tr height="20" style="height:12.75pt">';
		htmlItems = htmlItems + createLine(item_code, 'center', '#FFFFFF', 'xl65');//품번
		htmlItems = htmlItems + createLine(new_pr_quan, 'right', '#FFFFFF', 'xl65');//품번
		htmlItems = htmlItems + createLine(quan, 'right', '#FFFFFF', 'xl65');//품번
		htmlItems = htmlItems + createLine(item_name, 'left', '#FFFFFF', 'xl65');//품번
		htmlItems = htmlItems + createLine(specification, 'left', '#FFFFFF', 'xl65');//품번
		htmlItems = htmlItems + '</tr>';

	}
	htmlItems = htmlItems + '</tbody></table></div>';
	return htmlItems;
};

function setMakeTable(records) {
	bomTableInfo = INIT_TABLE_HEAD();
	if(records==null || records.length==0) {
		//bomTableInfo = initTableInfo;
	} else {
		
		for( var i=0; i<records.length; i++) {
          	var rec = records[i];
        	var unique_id =  rec.get('unique_id');
        	var unique_uid =  rec.get('unique_uid');
        	var item_code =  rec.get('item_code');
        	var item_name =  rec.get('item_name');
        	var specification =  rec.get('specification');
        	var standard_flag =  rec.get('standard_flag');
        	var sp_code =  rec.get('sp_code'); //표시는 고객사 선책톧로
        	
        	var model_no =  rec.get('model_no');	
        	var description =  rec.get('description');
        	var pl_no =  rec.get('pl_no');
        	var comment =  rec.get('comment');
        	var maker_name =  rec.get('maker_name');
        	var bm_quan =  rec.get('bm_quan');
        	var unit_code =  rec.get('unit_code');
        	var sales_price =  rec.get('sales_price');
        	
        	bomTableInfo = bomTableInfo + '	 <tr height="25" style="height:12.75pt">';
        	bomTableInfo = bomTableInfo + createLine(pl_no, 'center', '#FFFFFF', 'xl65');//품번
        	bomTableInfo = bomTableInfo + createLine(item_name, 'left', '#FFFFFF', 'xl65');//품명
        	bomTableInfo = bomTableInfo + createLine(specification, 'left', '#FFFFFF', 'xl65');//규격
        	bomTableInfo = bomTableInfo + createLine(model_no, 'left', '#FFFFFF', 'xl65');//재질/모델
        	bomTableInfo = bomTableInfo + createLine(description, 'left', '#FFFFFF', 'xl65');//후처리
        	bomTableInfo = bomTableInfo + createLine(comment, 'left', '#FFFFFF', 'xl65');//열처리
        	bomTableInfo = bomTableInfo + createLine(maker_name, 'left', '#FFFFFF', 'xl65');//제조원
        	bomTableInfo = bomTableInfo + createLine(sales_price, 'right', '#FFFFFF', 'xl65');//예상가(숫자)
        	bomTableInfo = bomTableInfo + createLine(bm_quan, 'right', '#FFFFFF', 'xl65');//수량(숫자)
        	bomTableInfo = bomTableInfo + createLine(sp_code, 'center', '#FFFFFF', 'xl65');//구분기호
        	bomTableInfo = bomTableInfo + createLine(item_code, 'center', '#F0F0F0', 'xl67');//품목코드
        	bomTableInfo = bomTableInfo + createLine(unique_uid, 'center', '#F0F0F0', 'xl67');//UID
        	bomTableInfo = bomTableInfo + '	 </tr>';
		}
	}
	bomTableInfo = bomTableInfo + INIT_TABLE_TAIL;
	var o = Ext.getCmp('bom_content');
	o.setValue(bomTableInfo);
}

function insertStockStoreRecord(records) {
	/*
	stockStore.removeAll();
	for(var i=0; i<records.length; i++) {
		console_logs('records['+ i + '].data', records[i].data);
		var data = records[i].data;
		if(data['stock_qty_useful'] >0) {//유효수량이 있을 때만 표시
			var partLine = Ext.ModelManager.create( data, 'PartLine');
			console_logs('partLine', partLine);
			stockStore.add(partLine);			
		}

	}
	*/
}

var cloudprojectStore = Ext.create('Mplm.store.cloudProjectStore', {} );
var cloudProjectTreeStore = Ext.create('Mplm.store.cloudProjectTreeStore', {});
var routeGubunTypeStore = Ext.create('Mplm.store.RouteGubunTypeStore', {} );
var routeGubunTypeStore_W = Ext.create('Mplm.store.RouteGubunTypeStore_W', {} );

var standard_flag_datas = [];
var commonStandardStore  = Ext.create('Mplm.store.CommonStandardStore', {hasNull: true} );
commonStandardStore.load(function(records) {
	for (var i=0; i<records.length; i++){ 
       	var obj = records[i];
       	//console_logs('commonStandardStore2['+i+']=', obj);
       	standard_flag_datas.push(obj);
	}
});


function renderCarthistoryPlno(value, p, record) {
	var unique_uid = record.get('unique_uid');
	
    return Ext.String.format(
            '<a href="#" onclick="popupCarthistoryPlno(\'{0}\', \'{1}\')" >{1}</a>',
           unique_uid, value
        );
}


function getPosStandard(id){
	//console_logs('id=', id);
	for (var i=0; i<standard_flag_datas.length; i++){
		//console_logs('standard_flag_datas[i].get(' + id + ')', standard_flag_datas[i].get('systemCode'));
		if(standard_flag_datas[i].get('systemCode') == id){
			return standard_flag_datas[i];
		}
	}
	return null;
}

function selectAssy(routeTitlename, depth) {
	//addAction.enable();
	addAssyAction.enable();
	inpuArea.enable();
	Ext.getCmp('addPartForm').enable();
	Ext.getCmp('main2').setTitle(routeTitlename); 
	if(depth==1) {
		editAssyAction.disable();
		removeAssyAction.disable();
	} else {
		editAssyAction.enable();
		removeAssyAction.enable();		
	}


}

function unselectAssy() {
	//addAction.disable();
	addAssyAction.disable();
	editAssyAction.disable();
	removeAssyAction.disable();
	inpuArea.disable();
	Ext.getCmp('bom_content').setValue(initTableInfo);
	Ext.getCmp('addPartForm').disable();
	Ext.getCmp('main2').setTitle('-'); 
}


function item_code_dash(item_code){
	if(item_code==null || item_code.length<13) {
		return item_code;
	}else {
		return item_code.substring(0,12);
	}
}

function setReadOnlyName(name, readonly) {
	setReadOnly(Ext.getCmp(name), readonly);
}

function setReadOnly(o, readonly) {
    o.setReadOnly(readonly);
    if (readonly) {
        o.setFieldStyle('background-color: #E7EEF6; background-image: none;');
    } else {
        o.setFieldStyle('background-color: #FFFFFF; background-image: none;');
    }

}

function getPl_no(systemCode) {
 	var prefix = systemCode;
 	if(systemCode=='S') {
 		prefix = 'K';
 	} else if(systemCode=='O') {
 		prefix = 'A';
 	}
	   Ext.Ajax.request({
		url: CONTEXT_PATH + '/design/bom.do?method=lastnoCloud',
		params:{
			first:prefix,
			parent_uid:selectedparent
		},
		success : function(result, request) {   
			var result = result.responseText;
			var str = result;	// var str = '293';
			Ext.getCmp('pl_no').setValue(str);

			
		},
		failure: extjsUtil.failureMessage
	});
}



function fPERM_DISABLING_Complished() {
	// 1. 권한있음.
	if (fPERM_DISABLING() == false && is_complished == false) {
		return false;
	} else { // 2.권한 없음.
		return true;
	}
}

//Define reset Action
var resetAction = Ext.create('Ext.Action', {
	 itemId: 'resetButton',
	 iconCls: 'search',
	 text: CMD_INIT,
	 handler: function(widget, event) {
		 resetPartForm();
		 Ext.getCmp('addPartForm').getForm().reset();
		 //console_logs('getForm().reset()', 'ok');
	 }
});
//
//function pasteConfirm(btn){
//
//    var selections = gridMycart.getSelectionModel().getSelection();
//    if (selections) {
//        var result = MessageBox.msg('{0}', btn);
//        if(result=='yes') {
//        	var uids = [];
//        	for(var i=0; i< selections.length; i++) {
//        		var rec = selections[i];
//        		var unique_id = rec.get('unique_id');
//        		uids.push(unique_id);
//        	}
//           //console_logs('uids', uids);
//        	
//      	   Ext.Ajax.request({
//      			url: CONTEXT_PATH + '/design/bom.do?method=addBomcopyAssymap',
//      			params:{
//      				project_uid: selectedPjUid,
//      				parent_uid:  selectedparent,
//      				uids: uids
//      			},
//      			success : function(result, request) {   
//      				var result = result.responseText;
//      				Ext.MessageBox.alert('결과','총 ' + result + '건을 복사하였습니다.');
//     				store.load( function(records) {
//     					insertStockStoreRecord(records);
//     					setChildQuan(records.length);
////     					var childCount = Ext.getCmp('childCount-DBM7');
////     					if(childCount!=null) {
////     						childCount.update(''+ );	
////     					}
//	     					
//	     				});
//      			},
//      			failure: extjsUtil.failureMessage
//      		});
//        }
//
//    }
//};
var pasteAction = Ext.create('Ext.Action', {
	 itemId: 'pasteActionButton',
	 iconCls: 'paste_plain',
	 text: '현재 Assy에 붙여넣기',
	 disabled: true,
	 handler: function(widget, event) {
	    	if(selectedparent==null || selectedparent=='' || selectedPjUid==null || selectedPjUid=='') {
	    		Ext.MessageBox.alert('오류','먼저 BOM을 붙여넣을 \r\n대상 Assembly를선택하세요.');
	    	} else {

	    	    var fp = Ext.create('Ext.FormPanel', {
	    	    	id: 'formPanelSelect',
	    	    	frame:true,
	    	        border: false,
	    	        fieldDefaults: {
	    	            labelWidth: 80
	    	        },
	    	        width: 300,
	    	        height: 220,
	    	        bodyPadding: 10,
	    	        items: [
						{
							xtype: 'component',
							html:'복사 수행시 수량을 1로 초기화하거나<br> 품번을 대상 Assy에 맞게 재 부여할 수 있습니다.<br>아래에서 선택하세요.'
						},
	    	            {
			    	        xtype: 'container',
			    	        layout: 'hbox',
			    	        margin: '10 10 10',
			    	        items: [{
					    	            xtype: 'fieldset',
					    	            flex: 1,
					    	            border: false,
					    	            //title: '복사 수행시 수량을 1로 초기화하거나 품번을 대상 Assy에 맞게 재 부여할 수 있습니다.',
					    	            defaultType: 'checkbox', // each item will be a checkbox
					    	            layout: 'anchor',
					    	            defaults: {
				    	                anchor: '100%',
				    	                hideEmptyLabel: false
				    	            },
				    	            items: [
			    	                {
				    	                fieldLabel: '복사 옵션',
				    	                boxLabel: '수량을 1로 초기화',
				    	                name: 'resetQty',
				    	                checked: true,
				    	                inputValue: 'true'
				    	            }, {
				    	                boxLabel: '품번 재부여',
				    	                name: 'resetPlno',
				    	                checked: true,
				    	                inputValue: 'true'
				    	            },  new Ext.form.Hidden({
				        	            name: 'hid_null_value'
				        		        })]
			    	        }]
			    	    }]
		    	    });
	    	    
	    	    w = Ext.create('ModalWindow', {
		            title:CMD_ADD  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
		            width: 300,
		            height: 220,
		            plain:true,
		            items: fp,
		            buttons: [{
		            	//id: 'windowOkBtn',
		                text: '복사 실행',
		                disabled: false,
		            	handler: function(btn){
		            		var form = Ext.getCmp('formPanelSelect').getForm();
	            			var val = form.getValues(false);
	            		    var selections = gridMycart.getSelectionModel().getSelection();
	            		    if (selections) {
	            		        	var uids = [];
	            		        	for(var i=0; i< selections.length; i++) {
	            		        		var rec = selections[i];
	            		        		var unique_uid = rec.get('unique_uid');
	            		        		uids.push(unique_uid);
	            		        	}
	            		      	   Ext.Ajax.request({
	            		      			url: CONTEXT_PATH + '/design/bom.do?method=addBomcopyAssymap',
	            		      			params:{
	            		      				project_uid: selectedPjUid,
	            		      				parent_uid:  selectedparent,
	            		      				unique_uids: uids,
	            		      				resetQty: val['resetQty'],
	            		      				resetPlno: val['resetPlno']
	            		      			},
	            		      			success : function(result, request) {   
	            		            		if(w) {
	            		            			w.close();
	            		            		}
	            		      				var result = result.responseText;
            		     					myCartStore.load(function() {});
	            		      				//Ext.MessageBox.alert('결과','총 ' + result + '건을 복사하였습니다.');
	            		     				store.load( function(records) {
	            		     					insertStockStoreRecord(records);
	            		     					setChildQuan(records.length);
//		            		     					var childCount = Ext.getCmp('childCount-DBM7');
//		            		     					if(childCount!=null) {
//		            		     						childCount.update(''+ );	
//		            		     					}
	            			     					
	            			     				});
	            		      			},
	            		      			failure: extjsUtil.failureMessage
	            		      		});

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
	    		
	    		/*
	    		Ext.MessageBox.show({
	                title:'BOM 복사',
	                msg: '선택한 자재를 현 Assembly로 붙여넣으시겠습니까?',
	                buttons: Ext.MessageBox.YESNO,
	                fn: pasteConfirm,
	                icon: Ext.MessageBox.QUESTION
	            });    	
	    		*/
	    		
	    		
	    		
	    	}
	 }
});



//수정등록
var modRegAction = Ext.create('Ext.Action', {
	 itemId: 'modRegAction',
	 iconCls: 'page_copy',
	 text: '값 복사',
	 disabled: true,
	 handler: function(widget, event) {
		 unselectForm();
		 grid.getSelectionModel().deselectAll();
	 }
});
//var copyRevAction = Ext.create('Ext.Action', {
//	 itemId: 'copyRevAction',
//	 iconCls: 'application_form_edit',
//	 text: '버전생성',
//	 disabled: true,
//	 handler: function(widget, event) {
//		 //unselectForm();
//	 }
//});

function cleanComboStore(cmpName)
{
    var component = Ext.getCmp(cmpName); 
    
    component.setValue('');
    component.setDisabled(false);
	component.getStore().removeAll();
	component.setValue(null)
	component.getStore().commitChanges();
	component.getStore().totalLength = 0;
}

function resetParam() {
	store.getProxy().setExtraParam('unique_id', '');
	store.getProxy().setExtraParam('item_code', '');
	store.getProxy().setExtraParam('item_name', '');
	store.getProxy().setExtraParam('specification', '');
}

function srchTreeHandler (my_treepanel, cloudProjectTreeStore, widName, parmName) {
	
	//console_info("srchSingleHandler");
	my_treepanel.setLoading(true);
	
	resetParam(cloudProjectTreeStore, searchField);
	var val = Ext.getCmp(widName).getValue();
	console_log('val'+val);

	cloudProjectTreeStore.getProxy().setExtraParam(parmName, val);
	cloudProjectTreeStore.load( {
				
		callback: function(records, operation, success) {
			my_treepanel.setLoading(false);
		}
	});

};

function setBomData(id) {
	//console_logs('setBomData(id)', id);
	modRegAction.enable();
	//copyRevAction.enable();
	resetPartForm();
	
	Ext.Ajax.request({
		url: CONTEXT_PATH + '/purchase/material.do?method=read',
		params:{
			id :id
		},
		success : function(result, request) {   
       		
			var jsonData = Ext.decode(result.responseText);
			//console_logs('jsonData', jsonData);
			var records = jsonData.datas;
			//console_logs('records', records);
			//console_logs('records[0]', records[0]);
			setPartFormObj(records[0]);
		},
		failure: extjsUtil.failureMessage
	});
	
}
function setPartFormObj(o) {
	//console_logs('setPartFormObj:o', o);

//	Ext.getCmp('unique_id').setValue( o['unique_id']);
//	Ext.getCmp('unique_uid').setValue( o['unique_uid']);
//	Ext.getCmp('item_code').setValue( o['item_code']);
//	Ext.getCmp('item_name').setValue( o['item_name']);
//	Ext.getCmp('specification').setValue( o['specification']);

	//규격 검색시 standard_flag를 sp_code로 사용하기
	Ext.Ajax.request({
		url: CONTEXT_PATH + '/purchase/request.do?method=getPoCondition',				
		success : function(result) {
			var text = result.responseText;
			console_logs('text', text);
			var o2 = JSON.parse(text, function (key, value) {
					    return value;
					});
			
		   //console_logs('o2', o2);
 		   gItemGubunType = o2['itemGubunType'];
			//console_logs('itemGubun', itemGubunType);
			//console_logs('itemGubun1', gItemGubunType);

			
			var standard_flag = null;
			if(gItemGubunType=='standard_flag') {
				standard_flag =  o['standard_flag'];
			} else {
				standard_flag =  o['sp_code'];
			}
			//console_logs('gItemGubunType', gItemGubunType);
			//console_logs('standard_flag', standard_flag);
			
			Ext.getCmp('unique_id').setValue( o['unique_id']);
			Ext.getCmp('unique_uid').setValue( o['unique_uid']);
			Ext.getCmp('item_code').setValue( o['item_code']);
			Ext.getCmp('item_name').setValue( o['item_name']);
			Ext.getCmp('specification').setValue( o['specification']);

			//console_logs('standard_flag', standard_flag);
			Ext.getCmp('standard_flag').setValue(standard_flag);
			Ext.getCmp('standard_flag_disp').select(getPosStandard(standard_flag));
			Ext.getCmp('model_no').setValue( o['model_no']);	
			Ext.getCmp('description').setValue( o['description']);
			
			Ext.getCmp('comment').setValue( o['comment']);
			Ext.getCmp('maker_name').setValue( o['maker_name']);
			Ext.getCmp('bm_quan').setValue('1');
			Ext.getCmp('unit_code').setValue( o['unit_code']);
			Ext.getCmp('sales_price').setValue( o['sales_price']);
			
			console_logs('sales_price', sales_price);
			
			getPl_no(standard_flag);
			
			var currency =  o['currency'];
			if(currency==null || currency=='') {
				currency = 'KRW';
			}
			Ext.getCmp('currency').setValue(currency);
			readOnlyPartForm(true);
			
			
			
		},
		failure: extjsUtil.failureMessage
	});
	
	
	
	
	
	
}
function setPartForm(record) {
	//console_logs('record:', record);

	Ext.getCmp('unique_id').setValue( record.get('unique_id'));
	Ext.getCmp('unique_uid').setValue( record.get('unique_uid'));
	Ext.getCmp('item_code').setValue( record.get('item_code'));
	Ext.getCmp('item_name').setValue( record.get('item_name'));
	Ext.getCmp('specification').setValue( record.get('specification'));
	
	var standard_flag =  record.get('standard_flag');
	//console_logs('standard_flag', standard_flag);
	Ext.getCmp('standard_flag').setValue(standard_flag);
	
	//Ext.getCmp('standard_flag_disp').setValue( record.get('standard_flag'));
	
	Ext.getCmp('standard_flag_disp').select(getPosStandard(standard_flag));
	Ext.getCmp('model_no').setValue( record.get('model_no'));	
	Ext.getCmp('description').setValue( record.get('description'));
	Ext.getCmp('pl_no').setValue( record.get('pl_no'));
	Ext.getCmp('comment').setValue( record.get('comment'));
	Ext.getCmp('maker_name').setValue( record.get('maker_name'));
	Ext.getCmp('bm_quan').setValue( record.get('bm_quan'));
	Ext.getCmp('unit_code').setValue( record.get('unit_code'));
	Ext.getCmp('sales_price').setValue( record.get('sales_price'));
	
	
	var currency =  record.get('currency');
	if(currency==null || currency=='') {
		currency = 'KRW';
	}
	Ext.getCmp('currency').setValue(currency);
	
	var ref_quan = record.get('ref_quan');
	//console_logs('ref_quan', ref_quan);
	if(ref_quan>1) {
		readOnlyPartForm(true);
		Ext.getCmp('isUpdateSpec').setValue('false');
	} else {
		readOnlyPartForm(false);
		setReadOnlyName('item_code', true);
		setReadOnlyName('standard_flag_disp', true);
		Ext.getCmp('isUpdateSpec').setValue('true');
	}

}

function resetPartForm() {

	Ext.getCmp('unique_id').setValue( '');
	Ext.getCmp('unique_uid').setValue( '');
	Ext.getCmp('item_code').setValue( '');
	Ext.getCmp('item_name').setValue( '');
	Ext.getCmp('specification').setValue('');
	Ext.getCmp('standard_flag').setValue('');
	Ext.getCmp('standard_flag_disp').setValue('');

	Ext.getCmp('model_no').setValue('');
	Ext.getCmp('description').setValue('');
	Ext.getCmp('pl_no').setValue('');
	Ext.getCmp('comment').setValue('');
	Ext.getCmp('maker_name').setValue('');
	Ext.getCmp('bm_quan').setValue('1');
	Ext.getCmp('unit_code').setValue('');
	Ext.getCmp('sales_price').setValue( '0');

	Ext.getCmp('currency').setValue('KRW');
	Ext.getCmp('unit_code').setValue('PC');
	readOnlyPartForm(false);
}

function unselectForm() {

	Ext.getCmp('unique_id').setValue('');
	Ext.getCmp('unique_uid').setValue('');
	Ext.getCmp('item_code').setValue('');
	
	var cur_val = Ext.getCmp('specification').getValue();
	var cur_standard_flag = Ext.getCmp('standard_flag').getValue();
	
	if(cur_standard_flag!='O') {
		Ext.getCmp('specification').setValue(cur_val + ' ' + CHECK_DUP);		
	}
	
	Ext.getCmp('currency').setValue('KRW');
	
	getPl_no(Ext.getCmp('standard_flag').getValue());
	readOnlyPartForm(false);
}

function readOnlyPartForm(b) {

	setReadOnlyName('item_code', b);
	setReadOnlyName('item_name', b);
	setReadOnlyName('specification', b);
	setReadOnlyName('standard_flag', b);
	setReadOnlyName('standard_flag_disp', b);

	setReadOnlyName('model_no', b);
	setReadOnlyName('description', b);
	//setReadOnlyName('pl_no', b);
	setReadOnlyName('comment', b);
	setReadOnlyName('maker_name', b);

	setReadOnlyName('currency', b);
	setReadOnlyName('unit_code', b);
	
	Ext.getCmp('search_information').setValue('');
	
}

function addNewAction() {

	var form = Ext.getCmp('addPartForm').getForm();
    if(form.isValid()) {
    	var val = form.getValues(false);
    	var partline = Ext.ModelManager.create( val,  'PartLine');

    	//console_logs('partline', partline);

       	partline.save({
               success: function() {
	           		store.load( function(records) {
	           			insertStockStoreRecord(records);
	           			setChildQuan(records.length);
//	           			var childCount = Ext.getCmp('childCount-DBM7');
//	           			if(childCount!=null) {
//	           				childCount.update(''+ records.length);	
//	           			}
	    				unselectForm();
	    				
	    			});
//                  store.load(function() {
//                	  unselectForm();
//                  });
              },
                failure: extjsUtil.failureMessage
           });   	

    }
}



var excel_sample = Ext.create('Ext.Action', {
	iconCls : 'MSExcelTemplateX',
	text : '템플리트',
	disabled : fPERM_DISABLING_Complished(),
	// disabled: true,
	handler : function(widget, event) {
		var lang = vLANG;
		switch (lang) {
		case 'ko':
			path = 'cab/BOM_ExcelWithProject_Format_ko.xlsx'; // 상대경로 사용
			break;
		case 'zh':
			path = 'cab/BOM_ExcelWithProject_Format_ko.xlsx';
			break;
		case 'en':
			path = 'cab/BOM_ExcelWithProject_Format_ko.xlsx';
			break;
		}
		window.location = CONTEXT_PATH + '/filedown.do?method=direct&path=' + path;
	}
});

var addElecHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_uid = rec.get('unique_uid');
	var standard_flag = rec.get('standard_flag');
	if(standard_flag=='E') {
		Ext.MessageBox.alert(error_msg_prompt,'Electrod can not be a parent of a Electrod.');
		return;
	}
	
	PartLine.load(unique_uid ,{
		 success: function(partline) {
			 
			var unique_uid =  partline.get('unique_uid');
			Ext.Ajax.request({
				url: CONTEXT_PATH + '/design/bom.do?method=addElectrod',				
				params:{
					unique_uid : unique_uid
				},
				success : function(result, request) {
	           		store.load( function(records) {
	           			insertStockStoreRecord(records);
	           			setChildQuan(records.length);
//	           			var childCount = Ext.getCmp('childCount-DBM7');
//	           			if(childCount!=null) {
//	           				childCount.update(''+ records.length);	
//	           			}
	    			});
				},// endof success for ajax
				failure: extjsUtil.failureMessage
			}); // endof Ajax
            	
		 }// endofsuccess
	 });// emdofload
};


var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: '새로 고침',
    disabled: false ,
    handler: function ()
    {
    	myCartStore.load(function() {});
    }
});


function Item_code_dash(item_code){
		return item_code.substring(0,5) + "-" + item_code.substring(5, 9) + "-" +
				item_code.substring(9, 12);
}

var materialClassStore = new Ext.create('Ext.data.Store', {

	fields:[     
	        { name: 'class_code', type: "string"  }
	        ,{ name: 'class_name', type: "string" }
	        ,{ name: 'level', type: "string"  } 
    ],
	sorters: [{
        property: 'display_order',
        direction: 'ASC'
    }],
    proxy: {
    	type: 'ajax',
    	url: CONTEXT_PATH + '/design/class.do?method=read',
    	reader: {
    		type:'json',
    		root: 'datas',
    		totalProperty: 'count',
    		successProperty: 'success'
    	},
    	extraParams : {
    		level: '2',
    		parent_class_code: ''
    	}
    	,autoLoad: true
    }
});





// *****************************MODEL**************************/


Ext.define('AssyLine', {
	 extend: 'Ext.data.Model',
	 fields: /* (G) */vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
	            // read: CONTEXT_PATH + '/design/bom.do?method=read', /*1recoed,
				// search by cond, search */
	            create: CONTEXT_PATH + '/design/bom.do?method=cloudAssycreate' 			/*
																						 * create
																						 * record,
																						 * update
																						 */
// update: CONTEXT_PATH + '/design/bom.do?method=update',
// destroy: CONTEXT_PATH + '/design/bom.do?method=destroy' /*delete*/
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

Ext.define('PartLine', {
	 extend: 'Ext.data.Model',
	 fields: /* (G) */vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/design/bom.do?method=cloudread', //&with_parent=T', 
	            create: CONTEXT_PATH + '/design/bom.do?method=createNew', 
	            update: CONTEXT_PATH + '/design/bom.do?method=createNew',
	            destroy: CONTEXT_PATH + '/design/bom.do?method=destroy'
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

Ext.define('PartLineStock', {
	 extend: 'Ext.data.Model',
	 fields: /* (G) */vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/design/bom.do?method=cloudread&stock_qty_useful_not_zero=true&only_goodsout_quan=true',
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

Ext.define('MyCartLine', {
	 extend: 'Ext.data.Model',
	 fields: /* (G) */vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/design/bom.do?method=readMycart', //&with_parent=T', 
	            destroy: CONTEXT_PATH + '/design/bom.do?method=destroyMycart'
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

Ext.define('Processing', {
	 extend: 'Ext.data.Model',
	 fields: /* (G) */vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
	            create: CONTEXT_PATH + '/production/pcsrequest.do?method=reqMake'			/*
																							 * create
																							 * record,
																							 * update
																							 */
	        },
			writer: {
	            type: 'singlepost',
	            writeAllFields: false,
	            root: 'datas'
	        } 
		}
});

Ext.define('RtgAst', {
	 extend: 'Ext.data.Model',
	 fields: /* (G) */vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
	            create: CONTEXT_PATH + '/design/bom.do?method=createPurchasing'
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


Ext.define('ExcelWithProject', {
	 extend: 'Ext.data.Model',
	 fields:  [ { name: 'file_itemcode', 	type: "string"    }     ],
	    proxy: {
			type: 'ajax',
	        api: {
	        	create: CONTEXT_PATH + '/design/upload.do?method=excelBomWithProject' /*
																			 * 1recoed,
																			 * search
																			 * by
																			 * cond,
																			 * search
																			 */
	        },
			writer: {
	            type: 'singlepost',
	            writeAllFields: false,
	            root: 'datas'
	        } 
		}
});



function deleteConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_uid = rec.get('unique_uid');
	           	 var partline = Ext.ModelManager.create({
	           		unique_uid : unique_uid
	        	 }, 'PartLine');
        		
	           	partline.destroy( {
	           		 success: function() {}
	           	});  	
        	}
        	grid.store.remove(selections);
        }
    }
};


function deleteCartConfirm(btn){

    var selections = gridMycart.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	
        	var targetUid = [];
        	for(var i=0; i< selections.length; i++) {
        		var unique_uid = selections[i].get('unique_uid');
        		targetUid.push(unique_uid);
        	}
        	
        	gridMycart.setLoading(true);
        	Ext.Ajax.request({
     			url: CONTEXT_PATH + '/design/bom.do?method=deleteMyCart',
     			params:{
     				assymap_uids : targetUid
     			},
     			success : function(result, request) {   
     				myCartStore.load(function() {
     					
     					gridMycart.setLoading(false);
     				});
     			}
       	    });
        	
        	
        }
    }
};


function deleteAssyConfirm(btn){

        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	if(selectedAssyRecord==null) {
    			Ext.MessageBox.alert('선택 확인', '선택한 Assy가 없습니다.');
    			return;
        	} else {
        		//console_logs('selectedAssyRecord', selectedAssyRecord);
		    	var name = selectedAssyRecord.data.text;
		    	var id = selectedAssyRecord.data.id;
		    	var depth = selectedAssyRecord.data.depth;
		    	
		    	if(depth<2) {
	    			Ext.MessageBox.alert('선택 확인', '최상위 Assy는 삭제할 수 없습니다.');
	    			return;
		    	} else {
		    		
		    		console_logs('target id', id);
		    		Ext.Ajax.request({
		     			url: CONTEXT_PATH + '/design/bom.do?method=getChildQuan',
		     			params:{
		     				parent : id
		     			},
		     			success : function(result, request) {   
		     				console_logs('result', result);
	        				var jsonData = Ext.decode(result.responseText);
	        				console_logs('jsonData', jsonData);
	        				var quan = jsonData['result'];
	        				if(quan>0) {
	        					Ext.MessageBox.alert('오류', '하위 Assy 또는 BOM이 존재하여 삭제할 수 없습니다.');
	        				} else {
	        					var unique_uid = selectedAssyRecord.data.unique_uid;
	        					
	        		    		Ext.Ajax.request({
	        		     			url: CONTEXT_PATH + '/design/bom.do?method=deleteAssy',
	        		     			params:{
	        		     				assymap_uid : unique_uid
	        		     			},
	        		     			success : function(result, request) {   
	        		     				console_logs('result', result);
	        	        				var jsonData = Ext.decode(result.responseText);
	        	        				console_logs('jsonData', jsonData);
		                           		cloudProjectTreeStore.load({
		                           		    callback: function(records, operation, success) {
		                           		    	console_log('load tree store');
		                           		    	console_log('ok');
		                           		    	//pjTreeGrid.setLoading(false);
		                           		        // treepanel.expandAll();
		                           		    }                               
		                           		});
	        		     			}
	        		       	    });
	        				}
		     			}
		       	    });
		    	}
        	}
        }
};


function process_requestConfirm(btn){

    var selections = gridMycart.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	
        	var unique_ids = [];
        	
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_uid = rec.get('unique_uid');
        		unique_ids.push(unique_uid);
	           	 
        	}// enoffor
        	
        	console_log(unique_ids);
        	var process = Ext.ModelManager.create({
           		unique_uid : unique_ids
        	 }, 'Processing');
           	 
           	process.save( {
           		 success: function() {
// alert('process');
           		 }// endofsuccess
           	});// endofsave
        	
        	
        }// endofif yes
    }// endofselection
};

// Define Remove Action
var removeAction = Ext.create('Ext.Action', {
	itemId: 'removeAction',
    iconCls: 'remove',
    text: CMD_DELETE,
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: delete_msg_content,
            buttons: Ext.MessageBox.YESNO,
            fn: deleteConfirm,
            // animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    }
});

var removeCartAction = Ext.create('Ext.Action', {
	itemId: 'removeCartAction',
    iconCls: 'remove',
    text: 'Cart' + CMD_DELETE,
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: delete_msg_content,
            buttons: Ext.MessageBox.YESNO,
            fn: deleteCartConfirm,
            // animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    }
});

var removeAssyAction = Ext.create('Ext.Action', {
	itemId: 'removeAssyAction',
    iconCls: 'remove',
    text: 'Assy' + CMD_DELETE,
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: delete_msg_content,
            buttons: Ext.MessageBox.YESNO,
            fn: deleteAssyConfirm,
            // animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    }
});
// Define process_request Action 
var process_requestAction = Ext.create('Ext.Action', {
	itemId: 'process_requestButton',
    iconCls: 'production',
    text: '제작요청',
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title: '제작요청',
            msg: '제작요청 하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: process_requestConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    }
});



var prWin = null;
var unique_uids = null
var new_pr_quans = null;


function deleteRtgappConfirm(btn){

    var selections = agrid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
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
};

function isExistMyCart(inId) {
	var bEx = false;//Not Exist
	myCartStore.data.each(function(item, index, totalItems) {
        console_logs('item', item);
        var uid = item.data['unique_uid'];
        console_logs('uid', uid);
        console_logs('inId', inId);
        if(inId == uid) {
        	bEx = true;//Found
        }
    });
	
	return bEx;
}
//Mycart
var addMyCartAction = Ext.create('Ext.Action', {
	
	itemId: 'addMyCartAction',
	iconCls:'my_purchase',
    text: '카트 담기',
    disabled: true,
    handler: function(widget, event) {
    	var my_child = new Array();
    	var my_assymap_uid = new Array();
    	var my_pl_no = new Array();
    	var my_pr_quan = new Array();
    	var my_item_code = new Array();
    	
    	var arrExist = [];
    	
    	var selections = grid.getSelectionModel().getSelection();
    	for(var i=0; i< selections.length; i++) {
    		var rec = selections[i];
    		var unique_uid = rec.get('unique_uid');
    		var item_code = rec.get('item_code');
    		var item_name = rec.get('item_name');
    		var pl_no = rec.get('pl_no');
    		var bEx = isExistMyCart(unique_uid) ;
    		console_logs('bEx', bEx)
    		if(bEx == false ) {
        		my_child.push( rec.get('unique_id'));
        		my_assymap_uid.push( unique_uid );
        		my_pl_no.push( pl_no );
        		my_pr_quan.push( rec.get('new_pr_quan'));
        		my_item_code.push( item_code);	
    		} else {
    			arrExist.push('[' +pl_no + '] \''+ item_name + '\'');
    		}
    		
    	}
    	
    	if(arrExist.length>0) {
        	Ext.MessageBox.alert('경고', arrExist[0] + ' 파트 포함 ' + arrExist.length + '건은 이미 카트에 담겨져 있습니다.<br/>추가구매가 필요한 경우 요청수량을 조정하세요.');    		
    	}

    	
    	if(my_assymap_uid.length>0) {
        	var tab = Ext.getCmp("main2");
        	tab.setLoading(true);
        	Ext.Ajax.request({
     			url: CONTEXT_PATH + '/design/bom.do?method=addMyCart',
     			params:{
     				childs : my_child,
     				assymap_uids : my_assymap_uid,
     				pl_nos : my_pl_no,
     				pr_quans : my_pr_quan,
     				item_codes: my_item_code
     			},
     			success : function(result, request) {   
     				myCartStore.load(function() {
     					var tab = Ext.getCmp("main2");
     					tab.setActiveTab(Ext.getCmp("gridMycart"));
     					tab.setLoading(false);
     				});
     			}
       	    });    		
    	}

        	
	}//endofhandler

});

var doRequestAction = function(isGoodsin) {
	
	
	var selections = null;
	var rqstType = null;
	if(isGoodsin) {
		selections = gridStock.getSelectionModel().getSelection();
		rqstType = '반출요청';
		console_logs(rqstType, selections);
	} else {
		selections = gridMycart.getSelectionModel().getSelection();
		rqstType = '구매요청';
		console_logs(rqstType, selections);
	}
	
	console_logs('selections', selections);
	if(selections==null || selections.length==0) {
		Ext.MessageBox.alert(error_msg_prompt, '선택한 자재가 없습니다.');
	}
	
	unique_uids = new Array();
	new_pr_quans = new Array();
	
	var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
	
	var route_type = isGoodsin==true ? 'G' : 'P';

	puchaseReqTitle = '[' + selectedPjCode + '] ' + selectedPjName + ' : ' + rqstType;
	
	unique_uids = [];
	catmapObj = [];
	for(var i=0; i< selections.length; i++) {
		var rec = selections[i];

		if(isGoodsin==false) {
			var ac_uid = rec.get('ac_uid');
			if(ac_uid+'' != selectedPjUid+'') {
				Ext.MessageBox.alert(error_msg_prompt, '작업중인 [' + selectedPjName + '] 프로젝트에 속한 자재만 ' + rqstType + '할 수 있습니다.');
				return;
			}			
			
			if(rec.get('goodsout_quan') > 0 ) {
				Ext.MessageBox.alert('입력 확인', '"'+ rec.get('item_name') + '" 아이템에 가용재고가 있습니다. 먼저 창고반출요청을 진행하세요.');
				return;
			}
			
			new_pr_quans[i] = rec.get('reserved_double1');
			
			
		} else {
			if(rec.get('goodsout_quan') > rec.get('new_pr_quan')) {
				Ext.MessageBox.alert('입력 확인', '"'+ rec.get('item_name') + '"의 반출요청 수량이 필요수량보다 큽니다.');
				return;
			}else if(rec.get('goodsout_quan') > rec.get('stock_qty_useful')) {
				Ext.MessageBox.alert('입력 확인', '"'+ rec.get('item_name') + '"의 반출요청 수량이 재고수량보다 큽니다.');
				return;
			}
			new_pr_quans[i] = rec.get('goodsout_quan');
		}
		
		unique_uids[i] = rec.get('unique_uid');
		if(new_pr_quans[i]<0.00000001) {
			Ext.MessageBox.alert('입력 확인', '"'+ rec.get('item_name') + '"의 요청 수량이 0입니다.');
			return;
		}

		catmapObj[i] = rec;
		
	}


	
	var item_name = rec.get('item_name');
	var item_code = rec.get('item_code');
	var item_qty = selections.length;

	var rtgapp_store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'RtgApp'});
	
	var removeRtgapp = Ext.create('Ext.Action', {
		itemId: 'removeRtgapp',
	    iconCls: 'remove',
	    text: CMD_DELETE,
	    disabled: true,
	    handler: function(widget, event) {
	    	Ext.MessageBox.show({
	            title:delete_msg_title,
	            msg: delete_msg_content,
	            buttons: Ext.MessageBox.YESNO,
	            fn: deleteRtgappConfirm,
	            // animateTarget: 'mb4',
	            icon: Ext.MessageBox.QUESTION
	        });
	    }
	});
	
	var updown =
	{
		text: Position,
	    menuDisabled: true,
	    sortable: false,
	    xtype: 'actioncolumn',
	    width: 60,
	    items: [{
	        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_up.png',
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
         				unique_id:unique_id
         			},
         			success : function(result, request) {   
         				rtgapp_store.load(function() {});
         			}
           	    });
	            	
				}


	    },{
	        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_down.png',
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
         				unique_id:unique_id
         			},
         			success : function(result, request) {   
         				rtgapp_store.load(function() {});
         			}
           	    });
	        }

	    }]
	};
	
	var tempColumn = [];
	
	tempColumn.push(updown);
	
	for(var i=0; i<vCENTER_COLUMN_SUB.length; i++) {
		tempColumn.push(vCENTER_COLUMN_SUB[i]);
	}

//	
//if(upno == true){
///*(G)*/vCENTER_COLUMN_SUB.splice(0, 0, updown);
//upno=false;
//}
	
	rtgapp_store.load(function() {
		
		
		Ext.each( /* (G) */tempColumn, function (columnObj, index,value) {
            
            var dataIndex = columnObj["dataIndex" ];
//console_log(dataIndex);
//         
//var columnObj = {};
//columnObj["header"] = inColumn["text"];
//// columnObj["width"] = inColumn["width"];
//// columnObj["sortable"] = inColumn["sortable"];
//columnObj["dataIndex"] = dataIndex;
           columnObj[ "flex" ] =1;
           
            if (value!="W"  && value!='기안') {
                  
                   if ('gubun' == dataIndex) {
                         
                          var combo = null ;
                          // the renderer. You should define it within a
							// namespace
                          var comboBoxRenderer = function (value, p, record) {
                                
//console_log('##########3' + value);
//console_log(p);
//console_log(record);
//console_log(combo);
                                
                                 if (value=='W' || value=='기안' ) {

                                } else {
                                   console_log('combo.valueField = ' + combo.valueField + ', value=' + value);
                                   console_log(combo.store);
                                   var idx = combo.store.find(combo.valueField, value);
                                   console_log(idx);
                                   var rec = combo.store.getAt(idx);
                                   console_log(rec);
                                   return (rec === null ? '' :  rec.get(combo.displayField) );
                                }

                         };
                         
                         combo = new Ext.form.field.ComboBox({
                       typeAhead: true ,
                       triggerAction: 'all',
                       selectOnTab: true ,
                       mode: 'local',
                       queryMode: 'remote',
            editable: false ,
            allowBlank: false ,
                     displayField:   'codeName' ,
                     valueField:     'codeName' ,
                     store: routeGubunTypeStore_W,
                       listClass: 'x-combo-list-small' ,
                          listeners: {  }
                   });
                   columnObj[ "editor" ] = combo;
//columnObj["renderer"] = comboBoxRenderer;
                   columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
			        	p.tdAttr = 'style="background-color: #FFE4E4;"';
			        	return value;
		        	};
                  
            
                  }
                  
           }

     });

		
		// grid create
		agrid = Ext.create('Ext.grid.Panel', {
			title: routing_path,
			// layout: 'form',
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
                     				useruid : unique_id,
                     				userid : user_id
                     				,gubun    : 'D'
                     			},
                     			success : function(result, request) {   
                     				var result = result.responseText;
            						console_log('result:' + result);
            						if(result == 'false'){
            							Ext.MessageBox.alert(error_msg_prompt, 'Dupliced User');
            						}else{
            							rtgapp_store.load(function() {});
            						}
                     			},
                     			failure: extjsUtil.failureMessage
                     		});
			        	}// endofselect
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
	                      for (var i = 0; i <agrid.store.data.items.length; i++)
	                      {
	                            var record = agrid.store.data.items [i];
	                            
	                            if (record.dirty) {
	                            	rtgapp_store.getProxy().setExtraParam('unique_id', vSELECTED_UNIQUE_ID);
	                               	console_log(record);
	                               	var obj = {};
	                               	
	                               	obj['unique_id'] = record.get('unique_id');// //pcs_code,
																				// pcs_name...
	                               	obj['gubun'] = record.get('gubun');
	                               	obj['owner'] = record.get('owner');
	                               	obj['change_type'] = record.get('change_type');
	                               	obj['app_type'] = record.get('app_type');
	                               	obj['usrast_unique_id'] = record.get('usrast_unique_id');
	                               	obj['seq'] = record.get('seq_no');
	                               	obj['updown'] = 0;
	                               	modifiend.push(obj);
	                            }
	                      }
	                      
	                      if(modifiend.length>0) {
	                    	
	                    	  console_log(modifiend);
	                    	  var str =  Ext.encode(modifiend);
	                    	  console_log(str);
	                    	  
	                   	    Ext.Ajax.request({
	                 			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=modifyRtgapp',
	                 			params:{
	                 				modifyIno: str
	                 			},
	                 			success : function(result, request) {   
	                 				rtgapp_store.load(function() {});
	                 			}
	                   	    });
	                      }
                    }
                }
		        ]// endofitems
			}] // endofdockeditems
		}); // endof Ext.create('Ext.grid.Panel',
		
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
	            		collapseProperty();// uncheck no displayProperty
	            		removeRtgapp.disable();
	            	}else{
	            		collapseProperty();// uncheck no displayProperty
	            		removeRtgapp.disable();
	            	}
	            }
	        }
		});
		
		var htmlItems = createHtml(route_type, rqstType, catmapObj);

		// form create
    	var form = Ext.create('Ext.form.Panel', {
			id : 'formPanel',
			xtype: 'form',
			frame: false,
	        border: false,
            bodyPadding: 3,
            region: 'center',
	        defaults: {
	            anchor: '100%',
	            allowBlank: false,
	            msgTarget: 'side',
	            labelWidth: 60
	        },
	        items: [
		            new Ext.form.Hidden({
			            name: 'route_type',
			            value: route_type
				        }),
				    new Ext.form.Hidden({
				            name: 'ac_uid',
				            value: selectedPjUid
					        }),
					      
	            new Ext.form.Hidden({
	            id: 'hid_userlist_role',
	            name: 'hid_userlist_role'
		        }),
		        new Ext.form.Hidden({
		        	id: 'hid_userlist',
		        	name: 'hid_userlist'
		        }),
		        new Ext.form.Hidden({
	        	id: 'new_pr_quans',
	        	name: 'new_pr_quans',
	        	value: new_pr_quans
		        }),
		        new Ext.form.Hidden({
		        	id: 'unique_uids',
		        	name: 'unique_uids',
		        	value: unique_uids
		        }),
		        new Ext.form.Hidden({
		        	id: 'req_date',
		        	name: 'req_date'
		        }),
            	agrid,
            	
            	{
                	xtype: 'component',
                	html: '<br/><hr/><br/>',
                	anchor: '100%'
                },
                
            	{
	                	xtype: 'textfield',
	                	fieldLabel: dbm1_txt_name,
	                	id: 'txt_name',
	                	name: 'txt_name',
	                	value: puchaseReqTitle,
	                	anchor: '100%'
	                },{
	                	xtype: 'textarea',
	                	fieldLabel: dbm1_txt_content,
	                	id: 'txt_content',
	                	name: 'txt_content',
	                	value:  item_name+' 外 ' + (item_qty-1) + '건\r\n' + rqstType + ' 상신합니다.',
	                	anchor: '100%'  
	                },{
	                	xtype: 'textarea',
	                	fieldLabel: dbm1_req_info,
	                	id: 'req_info',
	                	name: 'req_info',
	                	 allowBlank: true,
	                	anchor: '100%'  
	                },{
	                	xtype: 'datefield',
	                	id: 'request_date',
	                	name: 'request_date',
		            	fieldLabel: toolbar_pj_req_date,
		            	format: 'Y-m-d',
				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
		            	value: Ext.Date.add (new Date(),Ext.Date.DAY,14),
	            		anchor: '100%'
		            },{
	                	xtype: 'component',
	                	html: htmlItems,
	                	anchor: '100%'
	            	}
	                ]
    	});// endof createform
    	
    	// window create

    	prWin = Ext.create('ModalWindow', {
    		title: '결재 상신' + ' :: ' + rqstType,
            width: 830,
            height: 600,
            plain:true,
            items: [ form
     ],
            buttons: [{
            	text: CMD_OK,
            	handler: function(btn){
            		var form = Ext.getCmp('formPanel').getForm();
            		agrid.getSelectionModel().selectAll();
            		var aselections = agrid.getSelectionModel().getSelection();
            		
            		if (aselections) {
                    	for(var i=0; i< aselections.length; i++) {
                    		var rec = agrid.getSelectionModel().getSelection()[i];
                    		ahid_userlist[i] = rec.get('usrast_unique_id');
                    		console_log("ahid_userlist   :  "+ahid_userlist);
                    		console_log("ahid_userlist_role   :  "+ahid_userlist);
                    		ahid_userlist_role[i] = rec.get('gubun');
                    		console_log("ahid_userlist_role"+ahid_userlist_role);
                    	}
                    	Ext.getCmp('hid_userlist').setValue(ahid_userlist);                    	
            			Ext.getCmp('hid_userlist_role').setValue(ahid_userlist_role);
                    }
            		if(form.isValid()){
            			var val = form.getValues(false);
            		    
            		    var rtgast = Ext.ModelManager.create(val, 'RtgAst');
            		    
            			rtgast.save({
	                		success : function() {
	                			console_log('updated');
	                           	if(prWin) 
	                           	{
	                           		prWin.close();
	                           		myCartStore.load(function() {});
	                           		stockStore.load(function() {});
	                           	} 
	                		} 
	                	 });

            		}else {
            			Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
            		}
            	}
            },{
            	text: CMD_CANCEL,
            	handler: function(){
            		if(prWin) {prWin.close();} }            	
            }]
    	});
    	prWin.show();
	});// enof load
};
// 구매요청
var purchase_requestAction = Ext.create('Ext.Action', {
	
	itemId: 'purchaseButton',
	iconCls:'cart_go',
    text: PURCHASE_REQUEST,
    disabled: true,
    handler: function(widget, event) {
    	doRequestAction(false);
    
    }// endof handler
});// endof define action

var goodsout_requestAction = Ext.create('Ext.Action', {
	
	itemId: 'goodsoutButton',
	iconCls:'nxsession',
    text: '반출요청',
    disabled: true,
    handler: function(widget, event) {
    	doRequestAction(true);
    
    }// endof handler
});// endof define action

// Define Add Action
var comboClass1= [];
var comboClass2= [];
var Class_code=[];

var isAssFromMyPart = false;

var editAssyAction = Ext.create('Ext.Action', {
	itemId:'editAssyAction',
    iconCls: 'pencil',
	disabled: true,
    text: 'Assy 수정',
    handler: function(widget, event) {
    	
    	
    	if(selectedAssyCode==null || selectedAssyCode=='') {
    		Ext.MessageBox.alert('Error','수정할 Assembly를 선택하세요.', callBack);  
            function callBack(id){  
                return
            } 
            return;
    	}

    	
    	
				var lineGap = 30;
				var bHeight = 250;
				
		    	var inputItem= [];
		    	inputItem.push(
		    	{
					xtype: 'textfield',
					name: 'unique_uid',
					fieldLabel: 'AssyUiD',
					allowBlank:false,
					value: selectedAssyRecord.data.unique_uid,
					anchor: '-5',
					readOnly : true,
					fieldStyle : 'background-color: #ddd; background-image: none;'
				});
		    	inputItem.push(
				    	{
							xtype: 'textfield',
							name: 'unique_id',
							fieldLabel: 'Child Uid',
							allowBlank:false,
							value: selectedparent,
							anchor: '-5',
							readOnly : true,
							fieldStyle : 'background-color: #ddd; background-image: none;'
						});
		    	inputItem.push(
		    	{
					xtype: 'textfield',
					fieldLabel: 'Assembly 코드',
					allowBlank:false,
					value: selectedAssyCode,
					anchor: '-5',
					readOnly : true,
					fieldStyle : 'background-color: #ddd; background-image: none;'
				});
		    	
		    	inputItem.push(
		    			{
		                    fieldLabel: 'Assembly 명',
		                    x: 5,
		                    y: 0 + 3*lineGap,
		                    name: 'item_name',
		                    value: selectedAssyName,
		                    anchor: '-5'  // anchor width by percentage
		                },{
                            xtype: 'numberfield',
                            minValue: 0,
                            width : 365,
                            name : 'bm_quan',
                            editable:true,
                            fieldLabel: '제작 대수',
                            allowBlank: true,
                            value: selectedAssyQuan,
                            margins: '0'
                        });
		
		    	
		    	var form = Ext.create('Ext.form.Panel', {
		    		id: 'formPanel',
		            defaultType: 'textfield',
		            border: false,
		            bodyPadding: 15,
		            width: 400,
		            height: bHeight,
		            defaults: {
		                // anchor: '100%',
		                editable:false,
		                allowBlank: false,
		                msgTarget: 'side',
		                labelWidth: 100
		            },
		             items: inputItem
		        });
		
		        var win = Ext.create('ModalWindow', {
		            title: 'Assy 수정',
		            width: 400,
		            height: bHeight,
		            minWidth: 250,
		            minHeight: 180,
		            items: form,
		            buttons: [{
		                text: CMD_OK,
		            	handler: function(){
		                    var form = Ext.getCmp('formPanel').getForm();
		                    if(form.isValid())
		                    {
		                	var val = form.getValues(false);

		                	Ext.Ajax.request({
		            			url: CONTEXT_PATH + '/design/bom.do?method=updateAssyName',
		            			params:{
		            				unique_id : val['unique_id'],
		            				item_name : val['item_name'],
		            				bm_quan : val['bm_quan'],
		            				unique_uid : val['unique_uid']
		            			},
		            			success : function(result, request) {   
		            				cloudProjectTreeStore.load({
	                           		    callback: function(records, operation, success) {
	                           		    	console_log('load tree store');
	                           		    	console_log('ok');
	                           		    	pjTreeGrid.setLoading(false);
	                           		        // treepanel.expandAll();
	                           		    }                               
	                           		});
		            			},
		            			failure: extjsUtil.failureMessage
		            		});
		                	 
	                       	if(win) 
	                       	{
	                       		win.close();
	                       	} 
		                    } else {
		                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
		                    }

		                  }
		            },{
		                text: CMD_CANCEL,
		            	handler: function(){
		            		if(win) {
		            			win.close();
		            		}
		            	}
		            }]
		        });
		        win.show(/* this, function(){} */);
    } //endofhandler
});

var addAssyAction =	 Ext.create('Ext.Action', {
	itemId:'addAssyAction',
	iconCls:'add',
	disabled: true,
    text: 'Assy등록',
    handler: function(widget, event) {
    	
    	console_log('assy_pj_code Value : '+ assy_pj_code);
    	
    	if(assy_pj_code==null || assy_pj_code=='') {
    		Ext.MessageBox.alert('Error','추가할 모 Assembly를 선택하세요.', callBack);  
            function callBack(id){  
                return
            } 
            return;
    	}

    	Ext.Ajax.request({
			url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoCloudAssy',
			params:{
				pj_code:assy_pj_code
				// pj_first:assy_pj_code.substring(0,1)
			},
			success : function(result, request) {   
// var from_type = Ext.getCmp('from_type').getValue();
// var Version = Ext.getCmp('version').getValue();
				var result = result.responseText;
				var str = result;	// var str = '293';
				var num = Number(str); 	

				if(str.length==3){
					num = num; 
				}else if(str.length==2){
					num = '0' + num;
				}else if(str.length==1){
					num = '00' + num;
				}else{
					num = num%1000;
				}
					Ext.getCmp('assy_pl_no').setValue("A"+num);
			},
			failure: extjsUtil.failureMessage
		});
    	
    	
    	
				var lineGap = 30;
				var bHeight = 300;
				
		    	var inputItem= [];
		    	
		    	inputItem.push(new Ext.form.Hidden({
      		       name: 'parent',
      		       value: selectedparent
      		    }));
		    	
		    	inputItem.push(new Ext.form.Hidden({
      		       name: 'ac_uid',
      		       value: selectedPjUid
      		    }));
		    	
		    	inputItem.push({
				    xtype : 'container',
				    combineErrors: true,
				    layout:{
				    	type:'hbox',
				    	defaultMargins: {top: 0, right: 5, bottom: 5, left: 0}
				},
				    msgTarget: 'side',
				    fieldLabel: panelSRO1144,
				    defaults: {
				    	// anchor:'100%'
				        // hideLabel: true
				    },
				    items : [
				{
					xtype: 'textfield',
					fieldLabel: '프로젝트',
					allowBlank:false,
					value:assy_pj_code,
					flex : 1,
					readOnly : true,
					fieldStyle : 'background-color: #ddd; background-image: none;',
					name:'pj_code'
					},
					{
						xtype: 'textfield',
						allowBlank:false,
						value:selectedPjName,
						readOnly : true,
						fieldStyle : 'background-color: #ddd; background-image: none;',
						flex : 1,
						name: 'pj_name'
					}
					]
				});
		    	
		    	
		    	inputItem.push({
				    xtype : 'container',
				    combineErrors: true,
				    layout:{
				    	type:'hbox',
				    	defaultMargins: {top: 0, right: 5, bottom: 5, left: 0}
				},
				    msgTarget: 'side',
				    fieldLabel: panelSRO1144,
				    defaults: {
				    	// anchor:'100%'
				        // hideLabel: true
				    },
				    items : [
						{
							xtype: 'textfield',
							fieldLabel: 'Assembly 코드',
							allowBlank:false,
							value:assy_pj_code+ '-',
							flex : 1,
							readOnly : true,
							fieldStyle : 'background-color: #ddd; background-image: none;'
						},
						{
							xtype: 'textfield',
							allowBlank:false,
							flex : 1,
							name: 'pl_no',
							id:'assy_pl_no'
						}
					]
				});
		    	
		    	inputItem.push(
		    			{
		                    fieldLabel: 'Assembly 명',
		                    x: 5,
		                    y: 0 + 3*lineGap,
		                    name: 'item_name',
		                    anchor: '-5'  // anchor width by percentage
		                },{
                            xtype: 'numberfield',
                            minValue: 0,
                            width : 365,
                            name : 'bm_quan',
                            editable:true,
                            fieldLabel: '제작 대수',
                            allowBlank: true,
                            value: '1',
                            margins: '0'
                        });
		
		    	
		    	var form = Ext.create('Ext.form.Panel', {
		    		id: 'formPanel',
		            defaultType: 'textfield',
		            border: false,
		            bodyPadding: 15,
		            width: 400,
		            height: bHeight,
		            defaults: {
		                // anchor: '100%',
		                editable:false,
		                allowBlank: false,
		                msgTarget: 'side',
		                labelWidth: 100
		            },
		             items: inputItem
		        });
		
		        var win = Ext.create('ModalWindow', {
		            title: CMD_ADD  + ' :: ' + /* (G) */vCUR_MENU_NAME,
		            width: 400,
		            height: bHeight,
		            minWidth: 250,
		            minHeight: 180,
		            items: form,
		            buttons: [{
		                text: CMD_OK,
		            	handler: function(){
		                    var form = Ext.getCmp('formPanel').getForm();
		                    if(form.isValid())
		                    {
		                	var val = form.getValues(false);
		                	var assyline = Ext.ModelManager.create(val, 'AssyLine');
		            		// 저장 수정
		                	assyline.save({
		                		success : function() {
		                           	if(win) 
		                           	{
		                           		win.close();
		                           		// pjTreeGrid.setLoading(true);
		                           		cloudProjectTreeStore.load({
		                           		    callback: function(records, operation, success) {
		                           		    	console_log('load tree store');
		                           		    	console_log('ok');
		                           		    	//pjTreeGrid.setLoading(false);
		                           		        // treepanel.expandAll();
		                           		    }                               
		                           		});
		                           	}   	
		                		} 
		                	 });
		                	 
		                       	if(win) 
		                       	{
		                       		win.close();
		                       	} 
		                    } else {
		                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
		                    }

		                  }
		            },{
		                text: CMD_CANCEL,
		            	handler: function(){
		            		if(win) {
		            			win.close();
		            		}
		            	}
		            }]
		        });
		        win.show(/* this, function(){} */);
     }
});



// Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ editAssyAction, removeAssyAction ]
});

var contextMenuCart = Ext.create('Ext.menu.Menu', {
    items: [ /* addElecAction, editAction, */ removeCartAction  ]
});


// Excel Upload from NX
var addExcelWithProject = Ext.create('Ext.Action', {
	itemId: 'addExcelWithProject',
    iconCls: 'MSExcelTemplateX',
    text: '업로드',
    disabled: false,
    handler: function(widget, event) {
    	var uploadPanel = getCommonFilePanel('CREATE', 10, 10, '100%', 140, 50, '');

    	var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
            layout: 'absolute',
            defaultType: 'textfield',
            border: false,
            bodyPadding: 15,
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 100
            },
             items: [ uploadPanel
            
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: 'Upload ' + 'NX Excel',
            width: 600,
            height: 230,
            minWidth: 250,
            minHeight: 180,
            layout: 'fit',
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
            	handler: function(){
                    var form = Ext.getCmp('formPanel').getForm();
                    if(form.isValid())
                    {   	
                           	if(win) 
                           	{
                           		
                           		var val = form.getValues(false);
           	                	val["file_itemcode"] = /* (G) */vFILE_ITEM_CODE;
           	                	var ExcelWithProject = Ext.ModelManager.create(val, 'ExcelWithProject');
           	                	ExcelWithProject.save( {	             	                	
	           	           		 success: function() {
	           	           			 lfn_gotoHome();
		           	           		 }
		           	           	});
                           		win.close();
                           	}                           
                    }
                    
                  }
            },{
                text: CMD_CANCEL,
            	handler: function(){
            		if(win) {win.close();} 
                    lfn_gotoHome();
            	}
            		
            }]
        });
		win.show(this, function() {
	
			
			
		});
    }
});

searchField = [];

var fieldPohistory = [];
var columnPohistory = [];
var tooltipPohistory = [];

function treeSelectHandler(record) {
	// rec.get('leaf'); // 이렇게 데이터 가져올 수 있음
	selectedAssyRecord = record;
//	console_logs('record', record);
	//Pat Form 초기화
	resetPartForm();
	Ext.getCmp('addPartForm').getForm().reset();
	var name = record.data.text;
	var id = record.data.id;
	var depth = record.data.depth;
//	var leaf = record.data.leaf;
	
	selectedPjQuan= record.raw.pj_quan;
	selectedAssyQuan= record.raw.bm_quan;
	selectedMakingQuan = selectedPjQuan*selectedAssyQuan;

	setProjectQuan(selectedPjQuan);
	setAssyQuan(selectedAssyQuan);
	setMaking_quan(selectedMakingQuan);
	
	var context = record.data.context;
	//selectedAssyhier_posfull = context;
//	assy_code = name.substring(0,5).trim();
	assy_code = gfn_trim(name.substring(0,5) );
	//console_logs("assy_code", "(" +assy_code + ")");
	var sname = name.split('>');
	console_log(sname[1]);
	sname = sname[1].split('<');
	console_log(sname[0]);
	selectedAssyName = sname[0];
	selectedAssyDepth = depth;
	
	if(depth>0) {
		selectedparent = id;
		//selectedAssyhier_pos = '';
		console_log('selectedparent='+selectedparent);

		assy_pj_code = selectedPjCode;
		
		selectedAssyCode = selectedPjCode + '-' + assy_code;			    		
		store.getProxy().setExtraParam('parent', selectedparent);
		store.getProxy().setExtraParam('ac_uid', selectedPjUid);
		
		
		if(selectedAssyDepth==1) {
			editAssyAction.disable();
			removeAssyAction.disable();
		} else {
			editAssyAction.enable();
			removeAssyAction.enable();		
		}
		
		
    	store.load(function(records){
    		insertStockStoreRecord(records);
    		routeTitlename = '[' + selectedAssyCode  + '] ' + selectedAssyName;
    		selectAssy(routeTitlename, selectedAssyDepth);
    		setChildQuan(records.length);
//    		var childCount = Ext.getCmp('childCount-DBM7');
//    		if(childCount!=null) {
//    			childCount.update(''+ records.length);	
//    		}
    		
    		setMakeTable(records);
        	//tab select
			var tab = Ext.getCmp("main2");
			tab.setActiveTab(Ext.getCmp("bomTab"));
			
    		
    	});

	} else {
		
	}//endof depth
		
}

Ext.onReady(function() {  
	
//	//인건비 기준
//		Ext.Ajax.request({
//			url: CONTEXT_PATH + '/purchase/request.do?method=getPoCondition',				
//			success : function(result) {
//				var text = result.responseText;
//				var o = JSON.parse(text, function (key, value) {
//						    return value;
//						});
//				
////				humanUnit = o['humanUnit'];
////				console_logs('humanUnit', humanUnit);
////		 		if(humanUnit == 'HOUR') {
////		 	 		Ext.getCmp('labelHumanUnit').setValue('￦25,000/H');	
////		 		} else {
////		 	 		Ext.getCmp('labelHumanUnit').setValue('￦200,000/DAY'); 			
////		 		}
//		 		
//				gItemGubunType = o['itemGubunType'];
//				console_logs('itemGubunType', itemGubunType);
//			},
//			failure: extjsUtil.failureMessage
//		});
//
//	console_logs('gubun', gItemGubunType);
	makeInitTable();
	
//	 Ext.MessageBox.show({
//          msg: 'Excel Form를 이용하면 엑셀 프로그램과 <br> Copy/Paste(복사/붙여넣기)하여<br> BOM을 작성 및 수정할 수 있습니다.',
//          width:200
//      });
//       setTimeout(function(){
//           //This simulates a long-running operation like a database save or XHR call.
//           //In real code, this would be in a callback function.
//           Ext.MessageBox.hide();
//       }, 3000);
       
	// LoadJsMessage(); --> main으로 이동
	Ext.define('RtgApp', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /* (G) */vCENTER_FIELDS_SUB,
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
	
	
	commonUnitStore = Ext.create('Mplm.store.CommonUnitStore', {hasNull: false} );
	commonCurrencyStore = Ext.create('Mplm.store.CommonCurrencyStore', {hasNull: false} );
	commonModelStore = Ext.create('Mplm.store.CommonModelStore', {hasNull: false} );
	commonDescriptionStore = Ext.create('Mplm.store.CommonDescriptionStore', {hasNull: false} );
	commonStandardStore2  = Ext.create('Mplm.store.CommonStandardStore', {hasNull: false} );
	GubunStore  = Ext.create('Mplm.store.GubunStore', {hasNull: false} );

	LoadJs('/js/util/myPartStore.js');
	LoadJs('/js/util/projectpaneltree.js');
	LoadJs('/js/util/PartHistory.js');
	LoadJs('/js/util/CartHistory.js');
	//LoadJs('/js/util/DomHelper.js');
	
	
	var pjTreeGrid =
    	Ext.create('Ext.tree.Panel', {
		// border: false,
		 title: 'Assembly',// cloud_product_class,
		 //region: 'center',
		 listeners: {
             activate: function(tab){
                 setTimeout(function() {
                 	// Ext.getCmp('main-panel-center').setActiveTab(0);
                     // alert(tab.title + ' was activated.');
                 }, 1);
             }
         },

         viewConfig: {
		    	listeners: {
					 itemcontextmenu: function(view, rec, node, index, e) {
						 console_logs('itemcontextmenu rec', rec);
						 selectedNodeId = rec.getId();
						 treeSelectHandler(rec);
						
						 e.stopEvent();
						 contextMenu.showAt(e.getXY());							 
						 
						 return false;
					 },
				    itemclick: function(view, record, item, index, e, eOpts) {                      
				    	treeSelectHandler(record);
				    }// end itemclick
		    	}// end listeners
			},
	        // border: 0,
            dockedItems: [
            {
			    dock: 'top',
			    xtype: 'toolbar',
				items: [addAssyAction, '-', editAssyAction, '-', removeAssyAction]
			},       
            {
                dock: 'top',
                xtype: 'toolbar',
                items: [
							{
								id:'projectcombo',
							    	xtype: 'combo',
							    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
							           mode: 'local',
							           editable:false,
							           // allowBlank: false,
							           width: '100%',
							           queryMode: 'remote',
							           emptyText:'프로젝트',
							           displayField:   'pj_name',
							           valueField:     'unique_id',
							           store: cloudprojectStore,
							           listConfig:{
							            	getInnerTpl: function(){
							            		return '<div data-qtip="{pj_name}">{pj_code} <small><font color=blue>{pj_name}</font></small></div>';
							            	}			                	
							           },
							           triggerAction: 'all',
							           listeners: {
							           select: function (combo, record) {
						                 	console_log('Selected Value : ' + combo.getValue());
						                 	var pjuid = record[0].get('unique_id');
						                 	ac_uid = pjuid;
						                 	var pj_name  = record[0].get('pj_name');
						                 	var pj_code  = record[0].get('pj_code');

						                 	assy_pj_code ='';
						                 	selectedAssyCode = '';
						                 	selectedPjCode = pj_code;
						                 	selectedPjName = pj_name;
						                 	selectedPjUid = pjuid;
						                 	
						                 	puchaseReqTitle = '[' + pj_code + '] ' + pj_name;
						            	 
						                 	srchTreeHandler (pjTreeGrid, cloudProjectTreeStore, 'projectcombo', 'pjuid', true);
						                 	store.removeAll();
						                 	unselectAssy();
						                 	//Default Set
							 				Ext.Ajax.request({
							 					url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',			
							 					params:{
							 						paramName : 'CommonProjectAssy',
							 						paramValue : pjuid + ';' + '-1'
							 					},
							 					
							 					success : function(result, request) {
							 						console_log('success defaultSet');
							 					},
							   	 				failure: function(result, request){
							   	 					console_log('fail defaultSet');
							   	 				}
							 				});
							 				
							 				
							 				stockStore.getProxy().setExtraParam('ac_uid', selectedPjUid);
							 				stockStore.load();

						                 }
						            }
					    }
                ]
            }]
		 ,
		 
		 rootVisible: false,
		// cls: 'examples-list',
		 lines: true,
		 useArrows: true,
		 // margins: '0 0 0 5',
		 store: cloudProjectTreeStore
		} );
	
	var projectStore = Ext.create('Mplm.store.ProjectStore', {hasNull: false} );
	var projectCombo  =
	{
			id :'toPjUidAssy',
	        name : 'toPjUidAssy',
	        xtype: 'combo',
	        fieldStyle: 'background-color: #E7EEF6; background-image: none;',
	        store: projectStore,
	        emptyText:   dbm1_mold_no,
	        displayField:   'pj_code',
	        valueField:     'uid_srcahd',
	        sortInfo: { field: 'create_date', direction: 'DESC' },
	        typeAhead: false,
	        hideLabel: true,
	        minChars: 2,
	        // hideTrigger:true,
	        // width: 200,
	        listConfig:{
	            loadingText: 'Searching...',
	            emptyText: 'No matching posts found.',
	            // Custom rendering template for each item
	            getInnerTpl: function() {
	                return '<div data-qtip="{unique_id}">{pj_code}</div>';
	            }			                	
	        },
	        listeners: {
	        	select: function (combo, record) {
	        	}
	        }
		};
		    
		    // ************************ BOM *********
		     
		    	// PartLine Store 정의
		    	store = new Ext.data.Store({  
		    		pageSize: getPageSize(),
		    		model: 'PartLine',
		    		groupField: 'standard_flag',
		    		// remoteSort: true,
		    		sorters: [{
		                property: 'standard_flag',
		                direction: 'ASC'
		            },
		            {
		                property: 'pl_no',
		                direction: 'ASC'
		            }
		            
		            ]
		    	});
		    	// PartLine Store 정의
		    	myCartStore = new Ext.data.Store({  
		    		pageSize: getPageSize(),
		    		model: 'MyCartLine',
		    		// remoteSort: true,
		    		sorters: [
		            {
		                property: 'create_date',
		                direction: 'desc'
		            }
		            
		            ]
		    	});
		    	
		    	//StockStore		    	// PartLine Store 정의
		    	stockStore = new Ext.data.Store({  
		    		pageSize: getPageSize(),
		    		model: 'PartLineStock'
		    	});
		    	
		    	store.load(function(records) {
		    		insertStockStoreRecord(records);
		    		
		    		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );

		    		Ext.each(/*(G)*/vCENTER_COLUMNS, function(columnObj, index) {
		    			var dataIndex = columnObj["dataIndex"];
		    			
		    			switch(dataIndex) {
		    			case 'req_info':
		    			case 'goodsout_quan':
		    			case 'reserved_double1':
		    				columnObj["editor"] = {}; columnObj["css"] = 'edit-cell';
		    				columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
		    		        	p.tdAttr = 'style="background-color: #FFE4E4;"';
		    		        	return value;
		    	        	};		    				
		    				break;
		    			case 'statusHangul':
		    				columnObj["tdCls"] =  'x-change-cell';
		    				break;
						case 'item_code':
							columnObj["renderer"] = renderPohistoryItemCode;
							break;
						case 'pl_no':
							columnObj["renderer"] = renderCarthistoryPlno;
							break;
		    			}
		    			
//		    			
//		    			if('req_info' == dataIndex) {
//
//		    			}

		    		});
		    		
/*********************************************************************************
 * Grid Start
 */
		    		 var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
		    		        groupHeaderTpl: '{name} ({rows.length} 종{[values.rows.length > 1 ? "" : ""]})'
		    		    });
		    		 
			    	var bomGridColumn = [];
			    	var stockGridColumn = [];
			    	
			    	for(var i=0; i<vCENTER_COLUMNS.length; i++) {
			    		
			    		switch(vCENTER_COLUMNS[i]['dataIndex']) {
			    			case 'parent_item_code':
			    			case 'reserved_double1': //mycart의 pr_quan이다
			    			case 'goodsout_quan':
			    				break;
			    			default:
			    				bomGridColumn.push(vCENTER_COLUMNS[i]);
			    		}
			    		switch(vCENTER_COLUMNS[i]['dataIndex']) {
			    			//case 'new_pr_quan':
			    			//case 'parent_item_code':
			    			case 'reserved_double1':
			    			case 'standard_flag':	
			    			case 'sp_code':
			    			case 'req_info':
			    			case 'route_type':
			    			case 'statusHangul':
			    				break;
			    			default:
			    				stockGridColumn.push(vCENTER_COLUMNS[i]);
			    		}

			    	}
			    	
				    grid = Ext.create('Ext.grid.Panel', {
			    		id: "gridBom",
			    		title: 'List',
				        store: store,
				        // /COOKIE//stateful: true,
				        collapsible: true,
				        multiSelect: true,
				        border: false,
				        selModel: selModel,
				        stateId: 'stateGridBom'+ /* (G) */vCUR_MENU_CODE,
				        height: getCenterPanelHeight(),
				        bbar: getPageToolbar(store),
				        dockedItems: [
				        				{
				        					dock: 'top',
				        				    xtype: 'toolbar',
				        				    items: [
				        				           removeAction, '-', addMyCartAction, '-',
				        				           {
				        				        	   xtype: 'component',
					  	      				           style: 'margin:5px;color:#1549A7;',
					  	      					 	   html: 'BOM 수량:'
				        				           },
				        				           {
				        				        	   xtype: 'component',
					  	      				           style: 'margin:5px;width:18px;text-align:right',
					  	      				           id: 'childCount-DBM7',
					  	      					 	   html: ''
				        				           },
				        				           '-', '->',
				        				           {
				        				        	   xtype: 'component',
					  	      				           style: 'margin:5px;color:#1549A7;',
					  	      					 	   html: '제작대수:'
				        				           },
				        				           {
				        				        	   xtype: 'component',
					  	      				           style: 'margin:5px;width:10px;text-align:right',
					  	      				           id: 'making_quan-DBM7',
					  	      					 	   html: ''
				        				           },'-',
				        				           {
				        				        	   xtype: 'component',
					  	      				           style: 'margin:1px;color:#1549A7;',
					  	      					 	   html: '프로젝트:'
				        				           },
				        				           {
				        				        	   xtype: 'component',
					  	      				           style: 'margin:1px;width:3px;text-align:right',
					  	      				           id: 'pj_quan-DBM7',
					  	      					 	   html: '0'
				        				           },
				        				           {
				        				        	   xtype: 'component',
					  	      				           style: 'margin:5px;color:#1549A7;',
					  	      					 	   html: 'x'
				        				           },
				        				           {
				        				        	   xtype: 'component',
					  	      				           style: 'margin:1px;color:#1549A7;',
					  	      					 	   html: 'Assy 대수:'
				        				           },
				        				           {
				        				        	   xtype: 'component',
					  	      				           style: 'margin:1px;width:3px;text-align:right',
					  	      				           id: 'assy_quan',
					  	      					 	   html: '0'
				        				           },
				        				           {
				        				        	   xtype: 'component',
					  	      				           style: 'margin:3px;color:#1549A7;',
					  	      					 	   html: '&nbsp;&nbsp;'
				        				           }
				        				         ]
				        				}],
		    		    features: [groupingFeature],
				        columns: /* (G) */bomGridColumn,
				        plugins: [cellEditing],
				        viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
//			            getRowClass: function(record) {
//			            	console_logs('record', record);
//	   			              return record.get('statusHangul')  == '대기' ? 'important-row' : ''; 
//			            } ,
			            getRowClass: function(record, index) {
			                var c = record.get('statusHangul');
			                
			                switch(c) {
			                case '대기':
			                	return 'yellow-row';
			                	break;
			                case '입고':
			                	return 'green-row';
			                	break;
			                case '주문':
			                	return 'orange-row';
			                	break;
			                case '반려':
			                	return 'red-row';
			                	break;
			                }
			                
			                
//			                if (c == '대기') {
//			                    return 'yellow-row';
//			                }/* else {
//			                    return 'normal-row';
//			                }*/
			            },
			            listeners: {
			        		'afterrender' : function(grid) {
								var elments = Ext.select(".x-column-header",true);
								elments.each(function(el) {
												
											}, this);
									
								}
			            		,
			                itemcontextmenu: function(view, rec, node, index, e) {
			                    e.stopEvent();
			                    contextMenu.showAt(e.getXY());
			                    return false;
			                }
			            }
			        }
			    });
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		        	selectionLength = selections.length;
		            if (selections.length) {
		            	// grid info 켜기
		            	displayProperty(selections[0]);
		            	setPartForm(selections[0]);
		            	if(fPERM_DISABLING()==true) {
			            	removeAction.disable();
			            	addMyCartAction.disable();
			            	modRegAction.enable();
		            	}else{
		            		removeAction.enable();
			            	addMyCartAction.enable();
			            	
			            	//copyRevAction.enable();
			            	modRegAction.enable();
		            	}
		            } else {
		            	if(gGridSelects.length>1) {
		            		grid.getView().select(gGridSelects);
		            	}
		            	collapseProperty();
		            	removeAction.disable();
		            	addMyCartAction.disable();

		            }
		            
		            copyArrayGrid(selections);		            		
	            	
		        }
		    });
		    
		    
		    grid.on('edit', function(editor, e) {     
			  // commit the changes right after editing finished
		    	
	          var rec = e.record;
	         //console_logs('rec', rec);
	          var unique_uid = rec.get('unique_uid');
	          var req_info = rec.get('req_info');
	          
		      	Ext.Ajax.request({
					url: CONTEXT_PATH + '/design/bom.do?method=updateDesinComment',
					params:{
						id: unique_uid,
						req_info:req_info
					},
					success : function(result, request) {   

						var result = result.responseText;
						//console_logs("", result);

					},
					failure: extjsUtil.failureMessage
				});
		      	
			  rec.commit();
			});
		    
/**
 * grid End
 *******************************************************************************/
		
		    inpuArea = Ext.widget({
	 	      title: 'Excel Form',
	 	      xtype: 'form',
	 	      id: 'inputAreaForm',
	 	      disabled: true,
	 	      collapsible: false,
	 	      border: false,
	 	      layout: 'fit',
	 	      //fieldStyle: 'height:320; overflow:scroll ;overflow-x:hidden; background-color: #EAEAEA; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
	 	      dockedItems: [{
	            dock: 'top',
	            xtype: 'toolbar',
	            items: [
	 	         {
		 	       	 iconCls: 'search',
			 	   	 text: CMD_INIT,
			 	   	 handler: function() {
				 	   	 Ext.MessageBox.show({
		                     title:'초기화 확인',
		                     msg: '초기화하면 현재 작업한 내용은 지워지고 서버에 저장된 현재 BOM으로 대체됩니다.<br />계속하시겠습니까?',
		                     buttons: Ext.MessageBox.YESNO,
		                     icon: Ext.MessageBox.QUESTION,
		                     fn: function(btn) {
		                         var result = MessageBox.msg('{0}', btn);
		                         if(result=='yes') {
		                        	 var o = Ext.getCmp('bom_content');
		                        	 o.setValue(bomTableInfo);
		                         }
		                     }
		                 });
	            	 
		             }
	 	         },'-',
	 	        {
		 	       	 iconCls: 'textfield',
			 	   	 text: '모두 지우기',
			 	   	 handler: function() {
				 	   	 Ext.MessageBox.show({
		                     title:'모두 지우기',
		                     msg: '모두 지우시겠습니까?',
		                     buttons: Ext.MessageBox.YESNO,
		                     icon: Ext.MessageBox.QUESTION,
		                     fn: function(btn) {
		                         var result = MessageBox.msg('{0}', btn);
		                         if(result=='yes') {
		                        	 var o = Ext.getCmp('bom_content');
		                        	 o.setValue('');
		                         }
		                     }
		                 });
	            	 
		             }
	 	         },'-', {
		 	       	 iconCls: 'application_view_tile',
			 	   	 text: '사전검증',
			 	   	 handler: function() {
			 	   		 var bom_content = Ext.getCmp('bom_content');
			 	   		 
			 	   		 var htmlContent = bom_content.getValue();
			 	   		 
					  	Ext.Ajax.request({
							url: CONTEXT_PATH + '/design/upload.do?method=validateBom',
							params:{
								pj_code: selectedPjCode,
								assy_code: assy_code,
								pj_uid: selectedPjUid,
								parent: selectedparent,
								parent_uid: selectedAssyUid,
								pj_name: Ext.JSON.encode(selectedPjName),
								assy_name: Ext.JSON.encode(selectedAssyName),
								htmlContent: htmlContent
							},
							success : function(result, request) {   
								var val = result.responseText;
								//console_logs("val", val);
								//var htmlData = Ext.decode(val);
								//console_logs("htmlData", val);
								
					 	   		//htmlContent=func_replaceall(htmlContent,'<table border="0"','<table border="1"');
					 	   		
					 	   		bom_content.setValue(val);
					
							},
							failure: extjsUtil.failureMessage
						});
			 	   		 
	            	 
		             }
	 	         },'-', {
		             text: '디플로이',
		             iconCls: 'save',
		             handler: function() {
			 	   		 var bom_content = Ext.getCmp('bom_content');
			 	   		 
			 	   		 var htmlContent = bom_content.getValue();
			 	   		 
			 	   		Ext.getCmp('bom_content').setLoading(true);
			 	   		 
					  	Ext.Ajax.request({
							url: CONTEXT_PATH + '/design/upload.do?method=deployHtmlBom',
							params:{
								pj_code: selectedPjCode,
								assy_code: assy_code,
								pj_uid: selectedPjUid,
								parentUid: selectedparent,
								pj_name: Ext.JSON.encode(selectedPjName),
								assy_name: Ext.JSON.encode(selectedAssyName),
								htmlContent: htmlContent
							},
							success : function(result, request) { 
			     				
		        				var jsonData = Ext.decode(result.responseText);
		        				console_logs('jsonData', jsonData);
		        				
		        				var result = jsonData['result'];
		        				
		        				if(result == 'true' || result  == true) {//정상이면 Reload.
						    		if(selectedAssyDepth==1) {
						    			editAssyAction.disable();
						    			removeAssyAction.disable();
						    		} else {
						    			editAssyAction.enable();
						    			removeAssyAction.enable();		
						    		}
		        					store.getProxy().setExtraParam('parent', selectedparent);
						    		store.getProxy().setExtraParam('ac_uid', selectedPjUid);
					            	store.load(function(records){
					            		insertStockStoreRecord(records);
					            		routeTitlename = '[' + selectedAssyCode  + '] ' + selectedAssyName;
					            		selectAssy(routeTitlename, selectedAssyDepth);
					            		setChildQuan(records.length);
//					            		var childCount = Ext.getCmp('childCount-DBM7');
//					            		if(childCount!=null) {
//					            			childCount.update(''+ records.length);	
//					            		}
					            		
					            		setMakeTable(records);
					            		
					            	});
					            	
		        				} else {
		        					Ext.MessageBox.alert('오류','입력한 Excel Form에 오류가 있습니다.<br> 먼저 \'사전검증\'을 실시하세요.');
		        				}
		        				Ext.getCmp('bom_content').setLoading(false);
							},
							failure: extjsUtil.failureMessage
						});
//		            	 var form = Ext.getCmp('inputAreaForm').getForm();
//		            	 var val = form.getValues(false);
//		            	 console_logs('val', val);
		             }
	 	         }, '-',
		         '->', addExcelWithProject,
		           '-',excel_sample]
	 	      }],
	 	      items: [
	 	      {
		             //fieldLabel: 'board_content.',
		             //x: 5,
		             //y: 0 + 2*lineGap,
	 	    	     id: 'bom_content',
		             name: 'bom_content',
		             xtype: 'htmleditor',
		             width: '100%',
		             height: '100%',
		             border: false,
		             enableColors: false,
		             enableAlignments: false,
		             anchor: '100%',
		             listeners: {
		                 initialize: function(editor) {
		                	 console_logs('editor', editor);
		                     var styles = {
//                                 backgroundColor : '#193568'
                                //,border          : '1px dashed yellow'
//                                ,color           : '#fff'
//                                ,cursor          : 'default'
//                                ,font            : 'bold '+ 10 +'px Trebuchet MS'
//                                ,height          : '10px'
//                                ,left            : '10'
//                                ,overflow        : 'hidden'
//                                ,position        : 'absolute'
//                                ,textAlign       : 'center'
//                                ,top             : '10'
//                                ,verticalAlign   : 'middle'
//                                ,width           : '10'
//                                ,zIndex          : 60
                            };
	
		                     
		                     Ext.DomHelper.applyStyles(editor.getEditorBody(), styles);
		                 }/*,
		                 afterrender: function() {
		     				this.wrap.setStyle('border', '0');
		     			}*/
		             },
		             value: initTableInfo
		            	
		             
		    	 }]
	 		});
    		
			    	var myCartColumn = [];
			    	
			    	for(var i=0; i<vCENTER_COLUMNS.length; i++) {
			    		
			    		switch(vCENTER_COLUMNS[i]['dataIndex']) {
			    			case 'req_info':
			    			case 'statusHangul':
			    			//case 'standard_flag':
			    			case 'sales_price':
			    			case 'goodsout_quan':
			    				break;
			    			default:
			    				myCartColumn.push(vCENTER_COLUMNS[i]);
			    		}
			    	}
		
			    	
			    	var selModelMycart = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
			    	
				    gridMycart = Ext.create('Ext.grid.Panel', {
			    		id: 'gridMycart',
			    		title: 'My Cart',
				        store: myCartStore,
				        // /COOKIE//stateful: true,
				        collapsible: true,
				        multiSelect: true,
				        selModel: selModelMycart,
				        stateId: 'gridMycart'+ /* (G) */vCUR_MENU_CODE,
				        height: getCenterPanelHeight(),       
				        
				        dockedItems: [
			      				{
			      					dock: 'top',
			      				    xtype: 'toolbar',
			      				    items: [
			      				           searchAction, '-', removeCartAction, '-', pasteAction, '-', purchase_requestAction, 
			      				           '-',
			      				           //process_requestAction,'-', 
			      				         '->'
			      				         ]
			      				}
			              
			              ],
		        columns: /* (G) */myCartColumn
		        ,
		        plugins: [cellEditing1]
		        ,
		        viewConfig: {
		            stripeRows: true,
		            enableTextSelection: true,
		            getRowClass: function(record) { 
				              return record.get('creator_uid')  == vCUR_USER_UID ? 'my-row' : ''; 
		            } ,
		            listeners: {
		        		'afterrender' : function(gridMycart) {
							var elments = Ext.select(".x-column-header",true);
							elments.each(function(el) {
											
										}, this);
								
							}
		            		,
		                itemcontextmenu: function(view, rec, node, index, e) {
		                    e.stopEvent();
		                    contextMenuCart.showAt(e.getXY());
		                    return false;
		                }
		            }
		        }
		    });
			gridMycart.getSelectionModel().on({
			    selectionchange: function(sm, selections) {
			    	selectionLength = selections.length;
			        if (selections.length) {
			        	// gridMycart info 켜기
			        	displayProperty(selections[0]);
			        	if(fPERM_DISABLING()==true) {
			        		removeCartAction.disable();
			        		pasteAction.disable();
			            	process_requestAction.disable();
			            	purchase_requestAction.disable();
			        	}else{
			        		removeCartAction.enable();
			        		pasteAction.enable();
			            	process_requestAction.enable();
			            	purchase_requestAction.enable();

			        	}
			        } else {
		            	if(gGridMycartSelects.length>1) {
		            		gridMycart.getView().select(gGridMycartSelects);
		            	}
		            	
			        	collapseProperty();
			        	removeCartAction.disable();
			        	pasteAction.disable();
			        	process_requestAction.disable();
			        	purchase_requestAction.disable();
			
			        }
			     
			        copyArrayMycartGrid(selections);	
			    }
			});
			
			
			gridMycart.on('edit', function(editor, e) {     
			  // commit the changes right after editing finished
				
			  var rec = e.record;
			  //console_logs('rec', rec);
			  var unique_uid = rec.get('unique_uid');
			  var reserved_double1 = rec.get('reserved_double1');
			  
			  	Ext.Ajax.request({
					url: CONTEXT_PATH + '/design/bom.do?method=updateMyCartQty',
					params:{
						assymap_uid: unique_uid,
						pr_qty: reserved_double1
					},
					success : function(result, request) {   
			
						var result = result.responseText;
						//console_logs("", result);
			
					},
					failure: extjsUtil.failureMessage
				});
			  	
			  rec.commit();
			});
	    		
	    	myCartStore.load(function() { });
/*****************************************************************************
 * Mycart Grid End
 */
	    	
	    	var selModelStock = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
	    	gridStock = Ext.create('Ext.grid.Panel', {
	    		id: 'gridStock',
	    		title: '반출요청',
		        store: stockStore,
		        // /COOKIE//stateful: true,
		        collapsible: false,
		        multiSelect: true,
		        boder: false,
		        selModel: selModelStock,
		        stateId: 'gridStock'+ /* (G) */vCUR_MENU_CODE,
		        height: getCenterPanelHeight(),       
		        
		        dockedItems: [
	      				{
	      					dock: 'top',
	      				    xtype: 'toolbar',
	      				    items: [
	      				            goodsout_requestAction
	      				           ]
	      				}
	              
	              ],
			        columns: stockGridColumn,
			        plugins: [cellEditing2],		
			        viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
			            getRowClass: function(record) { 
					              return record.get('creator_uid')  == vCUR_USER_UID ? 'my-row' : ''; 
			            } ,
			            listeners: {
			        		'afterrender' : function(gridMycart) {
								var elments = Ext.select(".x-column-header",true);
								elments.each(function(el) {
												
											}, this);
									
								}
			            		,
			                itemcontextmenu: function(view, rec, node, index, e) {
			                    e.stopEvent();
			                    contextMenuCart.showAt(e.getXY());
			                    return false;
			                }
			            }
			        }
			    });
				    	
	    	gridStock.getSelectionModel().on({
			    selectionchange: function(sm, selections) {
			    	selectionLength = selections.length;
			        if (selections.length) {
			        	goodsout_requestAction.enable();
			        } else {
		            	if(gGridStockSelects.length>1) {
		            		gridStock.getView().select(gGridStockSelects);
		            	}
			        	goodsout_requestAction.disable();
			        }
			        
			        copyArrayStockGrid(selections);	
			    }
			});
	    	
	    	
	    	
		    Ext.define('SrcAhd', {
		   	 extend: 'Ext.data.Model',
		   	 fields: [     
		       		 { name: 'unique_id', type: "string" }
		     		,{ name: 'item_code', type: "string"  }
		     		,{ name: 'item_name', type: "string"  }
		     		,{ name: 'specification', type: "string"  }
		     		,{ name: 'maker_name', type: "string"  }
		     		,{ name: 'description', type: "string"  }
		     		,{ name: 'specification_query', type: "string"  }
		     	  	  ],
		   	    proxy: {
		   			type: 'ajax',
		   	        api: {
		   	            read: CONTEXT_PATH + '/purchase/material.do?method=searchPart'
		   	        },
		   			reader: {
		   				type: 'json',
		   				root: 'datas',
		   				totalProperty: 'count',
		   				successProperty: 'success'
		   			}
		   		}
		   });
		    
	    	var searchStore = new Ext.data.Store({  
	    		pageSize: 16,
	    		model: 'SrcAhd',
	    		// remoteSort: true,
	    		sorters: [{
	                property: 'specification',
	                direction: 'ASC'
	            },
	            {
	                property: 'item_name',
	                direction: 'ASC'
	            }]

	    	});
	    	
			var myFormPanel = Ext.create('Ext.form.Panel', {
				id: 'addPartForm',
				title: 'Part',
				xtype: 'form',
				frame: false,
		        border: false,
	            bodyPadding: 10,
	            autoScroll: true,
	            disabled: true,
		        defaults: {
		            anchor: '100%',
		            allowBlank: true,
		            msgTarget: 'side',
		            labelWidth: 60
		        },
		        // border: 0,
	            dockedItems: [
	              {
				      dock: 'top',
				    xtype: 'toolbar',
					items: [resetAction, '-', modRegAction/*, '-', copyRevAction*/]
				  }],
		        items: [{
					id :'search_information',
					field_id :'search_information',
			        name : 'search_information',
		            xtype: 'combo',
		            emptyText: '규격으로 검색',
		            store: searchStore,
		            displayField: 'specification',
		            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
		            sortInfo: { field: 'specification', direction: 'ASC' },
		            minChars: 1,
		            typeAhead: false,
		            hideLabel: true,
		            hideTrigger:true,
		            anchor: '100%',

		            listConfig: {
		                loadingText: '검색중...',
		                emptyText: '일치하는 결과가 없습니다.',

		                // Custom rendering template for each item
		                getInnerTpl: function() {
		                    return '<div><a class="search-item" href="javascript:setBomData({id});">' +
		                        '<span style="color:#999;"><small>{item_code}</small></span> <span style="color:#999;">{item_name}</span><br />{specification_query} <span style="color:#999;"><small>{maker_name}</small></span>' +
		                    '</a></div>';
		                }
		            },
		            pageSize: 10
		        }, {
		            xtype: 'component',
		            style: 'margin-top:10px',
		            html: '먼저, 등록된 자재인지 검색하세요.<hr>'
		        }
		        ,
		        new Ext.form.Hidden({
            		id: 'parent',
            		name: 'parent'
	        	}),
	        	new Ext.form.Hidden({
	        		id: 'ac_uid',
	        		name: 'ac_uid'
	        	}),
	        	new Ext.form.Hidden({
	        		id: 'pj_code',
	        		name: 'pj_code'
	        	}),
	        	new Ext.form.Hidden({
	        		id: 'coord_key2',
	        		name: 'coord_key2'
	        	}),
	        	new Ext.form.Hidden({
	        		id: 'standard_flag',
	        		name: 'standard_flag'
	        	}),
	        	new Ext.form.Hidden({
	        		id: 'child',
	        		name: 'child'
	        	}),
	        	new Ext.form.Hidden({
	        		id: 'sg_code',
	        		name: 'sg_code',
	        		value:'NSD'
	        	}),
	        	new Ext.form.Hidden({
	        		id: 'hier_pos',
	        		name: 'hier_pos'
	        	}),
				new Ext.form.Hidden({
					id: 'assy_name',
					name: 'assy_name',
					value:selectedAssyName
					
				}),
				new Ext.form.Hidden({
					id: 'pj_name',
					name: 'pj_name',
					value:selectedPjName
				}),
				new Ext.form.Hidden({
					id: 'isUpdateSpec',
					name: 'isUpdateSpec',
					value: 'false'
				}),
    	        {
              	   xtype: 'container',
              	   layout: 'hbox',
              	   margin: '10 0 5 0',
	   		        defaults: {
			            allowBlank: true,
			            msgTarget: 'side',
			            labelWidth: 60
			        },
                   items: [
            				{	
            					fieldLabel:    getColName('unique_id'),
            		   			xtype:  'textfield', 
            					id:   'unique_id',
            					name: 'unique_id',
            					emptyText: '자재 UID', 
            					flex:1,
            					readOnly: true,
            					width: 300,
            					fieldStyle: 'background-color: #EAEAEA; background-image: none;'
            		        },
            				{	
            		   			xtype:  'textfield',
            					id:   'unique_uid',
            					name: 'unique_uid',
            					emptyText: 'BOM UID', 
            					flex:1,
            					readOnly: true,
            					fieldStyle: 'background-color: #EAEAEA; background-image: none;'
            		        }
                   ]
    	        },
		        {	
		        	xtype:  'triggerfield',
					fieldLabel:    getColName('item_code'),
					id:  'item_code',
					name: 'item_code',
					emptyText: '자동 생성',
					listeners : {
		          		specialkey : function(field, e) {
		          		if (e.getKey() == Ext.EventObject.ENTER) {
		          		}
		          	}
			      	},
			          trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger', 'onTrigger1Click': function() {
			          	
			        	  
			        	  var val = Ext.getCmp('item_code').getValue();
			        	  if(val!=null && val!='') {
			        	  

			        		Ext.Ajax.request({
			        			url: CONTEXT_PATH + '/design/bom.do?method=getMaterialByItemcode',
			        			params:{
			        				item_code :val
			        			},
			        			success : function(result, request) {  
			        				var jsonData = Ext.decode(result.responseText);
			        				var records = jsonData.datas;
			        				if(records!=null && records.length>0) {
						        		modRegAction.enable();
						        		resetPartForm();
				        				setPartFormObj(records[0]);
			        				} else {
			        					Ext.MessageBox.alert('알림','알 수없는 자재번호입니다.');
			        				}

			        			},
			        			failure: extjsUtil.failureMessage
			        		});  
			        	  
			        	  
			        	  
			        	  
			        	  
			        	  }//endofif
			        	  
			        	  
			        	  
			        	  
			        	  
			        	  
			        	  
			        	  
			      	}
					//readOnly: true,
					//fieldStyle: 'background-color: #EAEAEA; background-image: none;'
		        },
		        {

	                id:           'standard_flag_disp',
	                name:           'standard_flag_disp',
	                xtype:          'combo',
	                mode:           'local',
	                editable:       false,
	                allowBlank: false,
	                queryMode: 'remote',
	                displayField:   'codeName',
	                value:          '',
	                triggerAction:  'all',
	                fieldLabel: getColName('sp_code')+'*',
	                store: commonStandardStore2,
	                listConfig:{
	                	getInnerTpl: function(){
	                		return '<div data-qtip="{systemCode}">{codeName}</div>';
	                	}			                	
	                },
	 	               listeners: {
	     	                    select: function (combo, record) {
	     	                    	console_log('Selected Value : ' + combo.getValue());
	     	                    	var systemCode = record[0].get('systemCode');
	     	                    	var codeNameEn  = record[0].get('codeNameEn');
	     	                    	var codeName  = record[0].get('codeName');
	     	                    	console_log('systemCode : ' + systemCode 
	     	                    			+ ', codeNameEn=' + codeNameEn
	     	                    			+ ', codeName=' + codeName	);
	     	                    	Ext.getCmp('standard_flag').setValue(systemCode);
	     	                    	
	     	                    	getPl_no(systemCode);
//								 	var prefix = systemCode;
	     	                    	var oClass_code1 = Ext.getCmp('class_code1');
								 	if(systemCode=='S') {
								 		oClass_code1.setDisabled(false);
								 	} else {
								 		oClass_code1.setDisabled(true);
								 	}
								 	//								 		prefix = 'K';
//								 	} else if(systemCode=='O') {
//								 		prefix = 'A';
//								 	}
//	     	                    	
//	                         	   Ext.Ajax.request({
//	                       			url: CONTEXT_PATH + '/design/bom.do?method=lastnoCloud',
//	                       			params:{
//	                       				first:prefix,
//	                       				parent_uid:selectedparent
//	                       			},
//	                       			success : function(result, request) {   
//	                       				var result = result.responseText;
//	                       				var str = result;	// var str = '293';
//	                       				Ext.getCmp('pl_no').setValue(str);
//
//	                       				
//	                       			},
//	                       			failure: extjsUtil.failureMessage
//	                       		});
	     	                    	
	     	                    	
	     	                    	
	     	                    	
	     	                    }
	     	               }
	            },
	            {
                    fieldLabel: getColName('class_code'),
                    id: 'class_code1',
                    name: 'class_code1',
                    emptyText: dbm1_class_code1,
                    xtype: 'combo',
                    mode: 'local',
                    editable: false,
                    allowBlank: false,
                    disabled: true,
                    queryMode: 'remote',
                    displayField: 'class_name',
                    valueField: 'class_code',
                    store: materialClassStore,
	                listConfig:{
	                	getInnerTpl: function(){
	                		return '<div data-qtip="{class_code}">[{class_code}] {class_name}</div>';
	                	}			                	
	                },
 	                listeners: {
 	                    select: function (combo, record) {
 	                    	console_log('Selected Value : ' + combo.getValue());
 	                    	var class_code = record[0].get('class_code');
 	                    	var class_name = record[0].get('class_name');
 	                    	var rand = RandomString(10);
 	                    	var item_code = class_code.substring(0,4) + '-' + rand.substring(0,7);
 	                    	Ext.getCmp('item_code').setValue(item_code);
 	                    }
     	            }
                },
	            {
		            xtype: 'fieldset',
		            title: '품번* | 품명*', //panelSRO1139,
		            collapsible: false,
		            defaults: {
		                labelWidth: 40,
		                anchor: '100%',
		                layout: {
		                    type: 'hbox',
		                    defaultMargins: {top: 0, right: 3, bottom: 0, left: 0}
		                }
		            },
		            items: [

		                {
		                    xtype : 'fieldcontainer',
		                    combineErrors: true,
		                    msgTarget: 'side',
		                    defaults: {
		                        hideLabel: true
		                    },
		                    items : [     
			                {
			                    xtype: 'textfield',
			                    width:      50,
			                    emptyText: '품번*', 
			                    name : 'pl_no',
			                    id : 'pl_no',
			                    fieldLabel: '품번',
			                    readOnly : false,
			                    allowBlank: false
			                },
			                {
			                    xtype: 'textfield',
			                    flex : 1,
			                    emptyText: '품명'+'*', 
			                    name : 'item_name',
			                    id : 'item_name',
			                    fieldLabel: getColName('item_name'),
			                    readOnly : false,
			                    allowBlank: false
			                }
			            ]
				        }
				    ]
				},
	        {
	        	xtype:  'textfield',
	       	 	fieldLabel: getColName('specification')+'*',
	       	 	id: 'specification',
	       	 	name: 'specification',
	            allowBlank: false
	       }
            ,{
            	xtype:  'textfield', 
            	fieldLabel: getColName('maker_name'),
                id: 'maker_name',
                name: 'maker_name',
                allowBlank: true
			},{
			    id:           'model_no',
			    name:           'model_no',
			    xtype:          'combo',
			    mode:           'local',
			    editable:       true,
			    allowBlank: true,
			    queryMode: 'remote',
			    displayField:   'codeName',
			    valueField:     'codeName',
			    triggerAction:  'all',
			    fieldLabel: getColName('model_no'),
			    store: commonModelStore,
			    listConfig:{
			    	getInnerTpl: function(){
			    		return '<div data-qtip="{systemCode}">{codeName}</div>';
			    	}			                	
			    },
			    listeners: {			load: function(store, records, successful,operation, options) {
					if(this.hasNull) {
						var blank ={
								systemCode:'',
								codeNameEn: '',
								codeName: ''
						};
						this.add(blank);
					}
				    },
			            select: function (combo, record) {
			            	console_log('Selected Value : ' + combo.getValue());
			            	var systemCode = record[0].get('systemCode');
			            	var codeNameEn  = record[0].get('codeNameEn');
			            	var codeName  = record[0].get('codeName');
			            	console_log('systemCode : ' + systemCode 
			            			+ ', codeNameEn=' + codeNameEn
			            			+ ', codeName=' + codeName	);
			            }
			       }
            }
			,{
			    id:           'description',
			    name:           'description',
			    xtype:          'combo',
			    mode:           'local',
			    editable:       true,
			    allowBlank: true,
			    queryMode: 'remote',
			    displayField:   'codeName',
			    valueField:     'codeName',
			    triggerAction:  'all',
			    fieldLabel: getColName('description'),
			    store: commonDescriptionStore,
			    listConfig:{
			    	getInnerTpl: function(){
			    		return '<div data-qtip="{systemCode}">{codeName}</div>';
			    	}			                	
			    },
			    listeners: {			load: function(store, records, successful,operation, options) {
					if(this.hasNull) {
						var blank ={
								systemCode:'',
								codeNameEn: '',
								codeName: ''
						};
						
						this.add(blank);
					}
				    },
			            select: function (combo, record) {
			            	console_log('Selected Value : ' + combo.getValue());
			            	var systemCode = record[0].get('systemCode');
			            	var codeNameEn  = record[0].get('codeNameEn');
			            	var codeName  = record[0].get('codeName');
			            	console_log('systemCode : ' + systemCode 
			            			+ ', codeNameEn=' + codeNameEn
			            			+ ', codeName=' + codeName	);
			            }
			       }
            }
            ,{
				xtype:  'textfield', 
				fieldLabel: getColName('comment'),
			    id: 'comment',
			    name: 'comment',
			    allowBlank: true
			}
			,{
			    xtype: 'fieldset',
			    border: true,
			    // style: 'border-width: 0px',
			    title: panelSRO1186+' | '+panelSRO1187+' | '+panelSRO1188+' | 통화',//panelSRO1174,
			    collapsible: false,
			    defaults: {
			        labelWidth: 40,
			        anchor: '100%',
			        layout: {
			            type: 'hbox',
			            defaultMargins: {top: 0, right: 0, bottom: 0, left: 0}
			        }
			    },
			    items: [
			
			        {
			            xtype : 'fieldcontainer',
			            combineErrors: true,
			            msgTarget: 'side',
			            defaults: {
			                hideLabel: true
			            },
			            items : [
                     {
                         xtype: 'numberfield',
                         minValue: 0,
                         width : 50,
                         id: 'bm_quan',
                         name : 'bm_quan',
                         fieldLabel: getColName('bm_quan'),
                         allowBlank: true,
                         value: '1',
                         margins: '0'
                     },{
                        width:          50,
                        id:           'unit_code',
                        name:           'unit_code',
                        xtype:          'combo',
                        mode:           'local',
                        editable:       false,
                        allowBlank: false,
                        queryMode: 'remote',
		                displayField:   'codeName',
		                valueField:     'codeName',
                        value:          'PC',
                        triggerAction:  'all',
                        fieldLabel: getColName('unit_code'),
	                   store: commonUnitStore,
		                listConfig:{
		                	getInnerTpl: function(){
		                		return '<div data-qtip="{systemCode}">{codeName}</div>';
		                	}			                	
		                },
         	               listeners: {
         	                    select: function (combo, record) {
         	                    	console_log('Selected Value : ' + combo.getValue());
         	                    	var systemCode = record[0].get('systemCode');
         	                    	var codeNameEn  = record[0].get('codeNameEn');
         	                    	var codeName  = record[0].get('codeName');
         	                    	console_log('systemCode : ' + systemCode 
         	                    			+ ', codeNameEn=' + codeNameEn
         	                    			+ ', codeName=' + codeName	);
         	                    }
         	               }
                },
                {
                    xtype: 'numberfield',
                    minValue: 0,
                    flex: 1,
                    id : 'sales_price',
                    name : 'sales_price',
                    fieldLabel: getColName('sales_price'),
                    allowBlank: true,
                    value: '0',
                    margins: '0'
                }, {
                    width:         50,
                    id:           'currency',
                    name:           'currency',
                    xtype:          'combo',
                    mode:           'local',
                    editable:       false,
                    allowBlank: false,
                    queryMode: 'remote',
	                displayField:   'codeName',
	                valueField:     'codeName',
                    value:          'KRW',
                    triggerAction:  'all',
                    fieldLabel: getColName('currency'),
                    store: commonCurrencyStore,
	                listConfig:{
	                	getInnerTpl: function(){
	                		return '<div data-qtip="{systemCode}">{codeName}</div>';
	                	}			                	
	                },
	                listeners: {
 	                    select: function (combo, record) {
 	                    	console_log('Selected Value : ' + combo.getValue());
 	                    	var systemCode = record[0].get('systemCode');
 	                    	var codeNameEn  = record[0].get('codeNameEn');
 	                    	var codeName  = record[0].get('codeName');
 	                    	console_log('systemCode : ' + systemCode 
 	                    			+ ', codeNameEn=' + codeNameEn
 	                    			+ ', codeName=' + codeName	);
 	                    }
 	               }
            }
            ]
	        }
		    ]
		}
			,{
	            xtype: 'container',
	                                        type: 'hbox',
	                                        padding:'5',
	                                        pack:'end',
	                                        align:'left',
	            defaults: {
	            },
	            margin: '0 0 0 0',
	            border:false,
	            items: [
			        {
	                    xtype:'button',
	                    id: 'ok_btn_id',
	                    text: CMD_OK,
			            handler: function() {
			            	
			            	var item_code = Ext.getCmp('item_code').getValue();
				    		if(item_code==null || item_code.length==0) {
				    			item_code = selectedPjCode + assy_code + Ext.getCmp('pl_no').getValue();
				    			Ext.getCmp('item_code').setValue(item_code);
				    		}/*else if(item_code.length != 12) {
	             				Ext.MessageBox.alert('경고','입력한 품목코드의 길이가 12가 아닙니다. 입력하지 않으면 자동으로 생성됩니다.');
	             				return;
				    		}*/
				    		
				    		Ext.getCmp('parent').setValue(selectedparent);
				    		Ext.getCmp('ac_uid').setValue(selectedPjUid);
				    		Ext.getCmp('pj_code').setValue(selectedPjCode);
			            	
			                this.up('form').getForm().isValid();


			            	var isUpdateSpec = Ext.getCmp('isUpdateSpec').getValue();
			            	var specification = Ext.getCmp('specification').getValue();
			            	var unique_id = Ext.getCmp('unique_id').getValue();
			            	var standard_flag = Ext.getCmp('standard_flag').getValue();
			            	var idx = specification.search(CHECK_DUP);
			            	if(idx>-1) {
			            		Ext.MessageBox.alert('경고','가공품이 아니면 규격 수정이 필요합니다. 다시 한번 확인하세요.');
			            	} else {
				            	if( (isUpdateSpec=='true' || unique_id.length < 3)
				            			
				            			&& standard_flag !='O'
				            	
				            	) {//중복체크 필요.
				            		Ext.Ajax.request({
				            			url: CONTEXT_PATH + '/design/bom.do?method=getMaterialBySpecification',				
				            			params:{
				            				specification : specification
				            			},
				            			success : function(result, request) {
				            				var jsonData = Ext.decode(result.responseText);
				             				var found = jsonData['result'];
				             				var exist = Ext.getCmp('unique_id').getValue();
				             				
				             				if(found.length>2 && exist != found ) {// 다른 중목자재 있음.
				             					Ext.MessageBox.alert('경고','표준 또는 메이커 자재에 이미 동일한 규격이 등록되어 있습니다.');
				             				} else {
				             					addNewAction();
				    			                //resetPartForm();
				    			                //this.up('form').getForm().reset();
				             				}
				            			},// endof success for ajax
				            			failure: extjsUtil.failureMessage
				            		}); // endof Ajax
				            	} else {
				            		addNewAction();
					                //resetPartForm();
					                //this.up('form').getForm().reset();	
				            	}
			            	}
			            }
			        },{
			            xtype:'button',
			            id: 'init_btn_id',
			            text: '초기화',
			            handler: function() {
			            	resetPartForm();
			                this.up('form').getForm().reset();
			            }
			        }
	    		]
	         }
//		,
//		{
//        	id: 'partSaveBtn',
//            text: CMD_OK,
//            xtype: 'button',
//            //disabled: true,
//            width:50,
//            handler: function(btn){
//    			
//            }//endofhandler
//        } //endofbutton
			
		//		{xtype: 'container',flex: 1,                                     
//				layout: {
//	                type:'vbox',
//	                align:'stretch'
//	            },  
//	            items: [
//		            {
//		            	id: 'partSaveBtn',
//		                text: CMD_OK,
//		                xtype: 'button',
//		                disabled: true,
//		                handler: function(btn){
//			    			
//		                }//endofhandler
//		            } //endofbutton
//		  ]}       
		        ]
			});
			
		var bomTab =  Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
					id: "bomTab",
				    layout:'border',
				    title: 'BOM',
				    border: false,
				    tabPosition: 'bottom',
				    layoutConfig: {columns: 2, rows:1},
				    items: [grid, inpuArea]
				});
			 
		 var main1 =  Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
			 	id: "main1",
			    layout:'border',
			    title: getMenuTitle(),
			    border: true,
			    region: 'west',
	            width: '30%',
			    layoutConfig: {columns: 2, rows:1},

			    items: [pjTreeGrid, myFormPanel]
			});
			
		 var main2 =  Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
				//height: getCenterPanelHeight(),
			    layout:'border',
			    id: "main2",
			    title: '-',
			    border: true,
			    region: 'center',
	            width: '70%',

			    items: [bomTab, gridMycart, gridStock]
			});
			
			var main =  Ext.create('Ext.panel.Panel', {
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
			    items: [  main1, main2  ]
			});
			
		
		main2.setLoading(true);
			
		Ext.Ajax.request({
		url: CONTEXT_PATH + '/admin/menu.do?method=defaultGet',			
		params:{
			paramName : 'CommonProjectAssy'
		},
		success : function(result, request) {
			console_log('success defaultGet');
			var id = result.responseText;
			
			console_log('id:'+id);
			var arr = id.split(';');
			var ac_uid = arr[0];

			cloudprojectStore.load(function(records) { 
				
				var rec = null;
				for(var i=0; i<records.length; i++) {
					var id = records[i].get('id');
					console_log('ac_uid=' + ac_uid);
					console_log('id=' + id);
					if(Number(ac_uid) == Number(id)) {
						rec = records[i];
					}
				}
				
	     		if(rec!=null) {
		     		var pj_code = rec.get('pj_code');
					var pj_name = rec.get('pj_name');
		     		var projectcombo = Ext.getCmp('projectcombo');
		     		projectcombo.setValue('[' + pj_code + '] ' + pj_name);
					var record = [];
					record[0] = rec;
		     		projectcombo.fireEvent('select', projectcombo, record);
					projectcombo['forceSelection'] = true;
					console_log('-------------------------------------------srchTreeHandler');
					
					
					cloudProjectTreeStore.getProxy().setExtraParam('pjuid', ac_uid);
					
					
					cloudProjectTreeStore.load({
					    callback: function(records, operation, success) {
				
					    	main2.setLoading(false);
							console_log('ok');
					    }                               
					});
					
	     		}
			});
    		
		},
		failure: function(result, request){
			console_log('fail defaultGet');
		} /*extjsUtil.failureMessage*/
	});
		
		setChildQuan(records.length);
//		var childCount = Ext.getCmp('childCount-DBM7');
//		if(childCount!=null) {
//			childCount.update(''+ records.length);	
//		}

		
		fLAYOUT_CONTENT(main);
		
//		//데이타타입 추가
//		vCENTER_FIELDS.push({ name: 'isUpdateSpec', type: 'string'});
		
		cenerFinishCallback();// Load Ok Finish Callback
 	});
});	// OnReady

