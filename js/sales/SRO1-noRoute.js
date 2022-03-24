/*
SR01 - 성모	수주현황
*/

//global var.

var togIsNew = true;

var grid = null;
var store = null;

var lineGap = 35;

var lastNoStore = null;
var counts = null;
var moldFormTypeStore = null;
var moldAddType = 'ADD'; //ADD/MOD/VER

var selectedMoldUid = '';
var selectedMoldCode = '';
var selectedMoldCodeDash = '';
var selectedWaName ='';
var selectedWaCode ='';
var selectedDescription=''; //제품모델번호', 'description', '机型
var selectedPjName=''; //제품명', 'pj_name', '品名
var selectedPjType=''; //제품유형코드', 'pj_type', '产品代码
var selectedMoldType=''; //'주물/소물', 'mold_type', '主件/小件
var selectedResine_color='';
var selectedSurface_art='';
var selectedCav_no='';
var selectedFile_itemcode='';

var Gtoday = TODAY_GLOBAL;
var this_year = Ext.Date.format(Gtoday,'Y');
var Towlength_year = this_year.substring(2,4);

function Cpj_code(pj_code){
	cpj_code = pj_code.substring(0,13);
	if(cpj_code == ""){
		return cpj_code;
	}else{
		CPj_code = cpj_code+"B";
	}
	return CPj_code;

}

function getLast() {		
	Ext.Ajax.request({
		url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastno',
		params:{
		},
		success : function(result, request) {
			var result = result.responseText;
			var str = result;	
			var num = Number(str); 				
			if(str.length<4){
				num = '0' + num; 
			}else if(str.length<3){
				num = '00' + num;
			}else if(str.length<2){
				num = '000' + num;
			}else{
				num = num%10000;
			}
		},
		failure: extjsUtil.failureMessage
	});	
}

/**
 * 공통콘드롤로 변경
 * 	LoadJs('/js/util/buyerStore.js');
 */
//var buyerStore = new Ext.create('Ext.data.Store', {
// 	fields:[     
// 	       { name: 'unique_id', type: "string" }
// 	      ,{ name: 'wa_code', type: "string"  }
// 	     ,{ name: 'wa_name', type: "string"  }
// 	     
// 	  ],
//     proxy: {
//         type: 'ajax',
//         url: CONTEXT_PATH + '/sales/buyer.do?method=query',
//         reader: {
//         	type:'json',
//             root: 'datas',
//             totalProperty: 'count',
//             successProperty: 'success'
//         }
//         ,autoLoad: false
//     	}
// });

Ext.define('UsrAst.Combo', {
	 extend: 'Ext.data.Model',
	 fields: [     
		{ name: 'unique_id', type: "string" }
		,{ name: 'user_id', type: "string"  }
		,{ name: 'user_name', type: "string"  }
		,{ name: 'dept_name', type: "string"  }
		,{ name: 'dept_code', type: "string"  }
		,{ name: 'email', type: "string"  }
		,{ name: 'hp_no', type: "string"  }
	  	  ],
	    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/userMgmt/user.do?method=query'
	        },
			reader: {
				type: 'json',
				root: 'datas',
				successProperty: 'success'
			},
			writer: {
	            type: 'singlepost',
	            writeAllFields: false,
	            root: 'datas'
	        }
		}
});

//var pj_name_hidden = new Ext.form.Hidden({
//    id: 'pj_name',
//   name: 'pj_name'
//});

var userStore = new Ext.data.Store({  
	pageSize: 5,
	model: 'UsrAst.Combo',
	sorters: [{
         property: 'user_name',
         direction: 'ASC'
     }]
}); 

var productCodeStore = new Ext.create('Ext.data.Store', {
 	fields:[     
  	       { name: 'systemCode', type: "string" }
  	      ,{ name: 'codeName', type: "string"  }
  	     ,{ name: 'codeNameEn', type: "string"  }
  	     
  	  ],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/sales/poreceipt.do?method=productCode',
         reader: {
         	type:'json',
             root: 'datas',
             totalProperty: 'count',
             successProperty: 'success'
         }
         ,autoLoad: false
     	}
 });

//	console_log('in getLast');
//	lastNoStore.load(function(records) {
//		console_log('loading');
//        for(var i = 0; i < records.length; i++) {
//          console_log(records[i].data);
//        } 
//        console_log('loaded');
//    });  

function deleteConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
    	record = selections[0];
    	var parent = record.get('uid_srcahd');
    	var unique_id = record.get('unique_id');
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	Ext.Ajax.request({
        		url: CONTEXT_PATH + '/sales/poreceipt.do?method=destroy', /*delete*/
        		params:{
        			uid_srcahd : parent,
        			unique_id  : unique_id
        		},
        		success : function(result, request) {
        			var result = result.responseText;
					var str = result;	
    				var num = Number(str); 
					if(num == '0'){
						Ext.MessageBox.alert('No','It has children');
					}else{
						for(var i=0; i< selections.length; i++) {
	                		var rec = selections[i];
	                		var unique_id = rec.get('unique_id');
	        	           	 var projectmold = Ext.ModelManager.create({
	        	           		unique_id : unique_id
	        	        	 }, 'ProjectMold');
	                		
//	        	           	projectmold.destroy( {
//	        	           		 success: function() {}
//	        	           	});
	                   	
	                	}
	                	grid.store.remove(selections);
					}
        		}
        	});
        	
        }
    }
};

function completeConfirm(btn){
	
	var selections = grid.getSelectionModel().getSelection();
	if (selections) {
		var result = MessageBox.msg('{0}', btn);
		if(result=='yes') {
		for(var i=0; i< selections.length; i++) {
			var rec = selections[i];
			var unique_id = rec.get('unique_id');
			Ext.Ajax.request({
				url: CONTEXT_PATH + '/sales/poreceipt.do?method=complete',
				params:{
					unique_id  : unique_id
				},
				success : function(result, request) {
						grid.store.remove(selections);
					}
			});
		}
		}
	}
};

//Define Remove Action
var removeAction = Ext.create('Ext.Action', {
	itemId: 'removeButton',
    iconCls: 'remove',
    text: CMD_DELETE,
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: delete_msg_content,
            buttons: Ext.MessageBox.YESNO,
            fn: deleteConfirm,
            //animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    }
});

var completeAction = Ext.create('Ext.Action', {
	itemId: 'completeButton',
	iconCls: 'complete',
	text: GET_MULTILANG('sro1_completeAction'),
	disabled: true,
	handler: function(widget, event) {
		Ext.MessageBox.show({
			title:GET_MULTILANG('sro1_completeAction'),
			msg: sro1_completemsg_content,
			buttons: Ext.MessageBox.YESNO,
			fn: completeConfirm,
			//animateTarget: 'mb4',
			icon: Ext.MessageBox.QUESTION
		});
	}
});

function createViewForm(projectmold) {
	 var unique_id = projectmold.get('unique_id');
	 var order_com_unique = projectmold.get('order_com_unique');
	 var pj_code = projectmold.get('pj_code');
	 var pj_type = projectmold.get('pj_type');
	 var pj_name = projectmold.get('pj_name');
	 var pm_uid = projectmold.get('pm_uid');
	 var pm_name = projectmold.get('pm_name');
	 var regist_date = projectmold.get('regist_date');
	 var delivery_plan = projectmold.get('delivery_plan');
	 var description = projectmold.get('description');		 
	 var selling_price = projectmold.get('selling_price' );
	 var quan = projectmold.get('quan');
	 var resine_color = projectmold.get('resine_color');
	 var surface_art = projectmold.get('surface_art');
	 var customer_code = projectmold.get('customer_code');		
	 var customer_name = projectmold.get('customer_name');			 
	 var project_department = projectmold.get('project_department' );
	 var project_tel = projectmold.get('project_tel');
	 var upload_file = projectmold.get('upload_file');
	 var cav_no = projectmold.get('cav_no');
	 var reserved_varchar4 = projectmold.get('reserved_varchar4');
	 var htmlFileNames = projectmold.get('htmlFileNames' );
	 var fileQty = projectmold.get('fileQty' );
	var lineGap = 30;
    var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
    		defaultType: 'displayfield',
	        border: false,
	        bodyPadding: 15,
	        height: 650,
          //  bodyPadding: 5,
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 100
            },
            items: [{
            	fieldLabel: getColName('pj_code'),
				value: pj_code,
				x: 5,
				y: 0 + 1*lineGap,
				name: 'pj_code'
			},{
				fieldLabel: getColName('order_com_unique'),
				value: customer_name,
				x: 5,
				y: 0 + 2*lineGap,
				 name: 'order_com_unique',
				anchor: '-5'  // anchor width by percentage
			},{
				fieldLabel: getColName('pj_type'),
				value: pj_type,
				x: 5,
				y: 0 + 3*lineGap,
				name: 'pj_type',
				anchor: '-5'  // anchor width by percentage
			},{
				fieldLabel: getColName('description'),
				value: description,
				x: 5,
				y: 0 + 4*lineGap,
				name: 'description',
				id: 'description',
				anchor: '-5'  // anchor width by percentage
			},{
				fieldLabel: getColName('pj_name'),
				value: pj_name,
				x: 5,
				y: 0 + 5*lineGap,
				name: 'pj_name',
				anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('selling_price'),
		    	value: selling_price,
		    	x: 5,
		    	y: 0 + 6*lineGap,
		    	name: 'selling_price',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('pm_name'),
		    	value: pm_name,
		    	x: 5,
		    	y: 0 + 7*lineGap,
		    	name: 'pm_name',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('quan'),
		    	value: quan,
		    	x: 5,
		    	y: 0 + 8*lineGap,
		    	name: 'quan',
		    	anchor: '-5'  // anchor width by percentage
		    },{
			    fieldLabel: getColName('reserved_varchar4'),
			    value: reserved_varchar4,
			    x: 5,
			    y: 0 + 9*lineGap,
			    name: 'reserved_varchar4',
			    anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('htmlFileNames'),
		    	value: htmlFileNames,
		    	x: 5,
		    	y: 0 + 9*lineGap,
		    	name: 'htmlFileNames',
		    	anchor: '-5'  // anchor width by percentage
	    	},
//		    {
//		    	fieldLabel: getColName('project_tel'),
//		    	value: project_tel,
//		    	x: 5,
//		    	y: 0 + 6*lineGap,
//		    	name: 'project_tel',
//		    	anchor: '-5'  // anchor width by percentage
//		    }
  
		    ]
        }); //endof form
    
    return form;
}

function createEditForm(projectmold, attachedFileStore) {
	 	 var unique_id = projectmold.get('unique_id');
	 	 var order_com_unique = projectmold.get('order_com_unique');
	 	 var wa_name = projectmold.get('wa_name');
	 	 var pj_type = projectmold.get('pj_type');
		 var pj_code = projectmold.get('pj_code');
		 var pj_name = projectmold.get('pj_name');
		 var pm_uid = projectmold.get('pm_uid');
		 var pm_name = projectmold.get('pm_name');
		 var pm_id = projectmold.get('pm_id');
		 var regist_date = projectmold.get('regist_date');
		 var delivery_plan = projectmold.get('delivery_plan');
		 var description = projectmold.get('description');		 
		 var selling_price = projectmold.get('selling_price' );
		 var Ocav_no = projectmold.get('cav_no');
		 var cav_no = projectmold.get('cav_no');
		 var quan = projectmold.get('quan');
		 var resine_color = projectmold.get('resine_color');
		 var surface_art = projectmold.get('surface_art');
		 var customer_code = projectmold.get('customer_code');		
		 var customer_name = projectmold.get('customer_name');			 
		 var project_department = projectmold.get('project_department' );
		 var project_tel = projectmold.get('project_tel');
		 var upload_file = projectmold.get('upload_file');
		 var reserved_varchar4 = projectmold.get('reserved_varchar4');
		 var Rev = projectmold.get('Rev');
		 var Cavity = projectmold.get('Cavity');
		 var Family = projectmold.get('Family');
		 var reserved_varchar5 = projectmold.get('reserved_varchar5');
		 var newmodcont = projectmold.get('newmodcont');
		 var mold_type = projectmold.get('mold_type');
//		 var cav_no = null;
//		 if(Ocav_no.length<=5){
//			 cav_no = '['+Ocav_no.substring(0,1) + ']' + '*' + '['+Ocav_no.substring(2,3) + ']'
// 					+ '*' + '['+Ocav_no.substring(4,5) + ']'; 
//     	}else{
//     		cav_no = '['+Ocav_no.substring(0,1) + ']' + '*' + '['+Ocav_no.substring(2,3) + ']'
// 					+ '*' + '['+Ocav_no.substring(4,6) + ']'; 
//     	}
		 function date(date){
			 return date.substring(0,10);
		 }
		 buyerStore['cmpName'] = 'order_com_unique'; //combo name
		 
		 var myItems = [];
		 myItems.push({
			 xtype: 'textfield',
             flex : 1,
             name : 'pj_code',
             id : 'pj_code',
             fieldLabel:    getColName('pj_code'),
             value: pj_code,
             displayField:   "title",
             readOnly : true,
             fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
		 });
		 myItems.push({
			 fieldLabel: getColName('order_com_unique'),
  			xtype: 'textfield',
             flex : 1,
  			value: customer_name,
//  			name: 'order_com_unique',
  			displayField:   "title",
             readOnly : true,
             fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
		 });
		 myItems.push({
			 fieldLabel: getColName('description'),
  			 value: description,
  			 name: 'description',
  			 readOnly : true,
  			 type:  'textfield',
  			 fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
		 });
		 myItems.push({
			 fieldLabel: getColName('regist_date'),
          	 name: 'regist_date',
          	 value: date(regist_date),
		     dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
		     readOnly : true,
             fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
		 });
		 myItems.push({
			 fieldLabel: getColName('selling_price'),
  			 value: selling_price,
  			 name: 'selling_price',
  			 allowBlank: false,
  			 minValue:0,
  			 type:  'numberfield'
		 });
		 myItems.push({
			 fieldLabel: getColName('resine_color'),
          	 value: resine_color,
          	 name: 'resine_color',
          	 type:  'textfield'
		 });
		 myItems.push({
			 fieldLabel: getColName('surface_art'),
          	 value: surface_art,
          	 name: 'surface_art',
          	 type:  'textfield'  
		 });
		 myItems.push({
			 xtype:          'combo',
             mode:           'local',
             value:          'JS0000CN',
             triggerAction:  'all',
             forceSelection: true,
             editable:       false,
             allowBlank: false,
             fieldLabel:     getColName('reserved_varchar4'),
             name:           'reserved_varchar4',
             displayField:   'name',
             valueField:     'value',
             queryMode: 'local',
             store:          Ext.create('Ext.data.Store', {
                 fields : ['name', 'value'],
                 data   : [
                     {name : pp_firstBu,   value: 'JS0000CN'}
                     //,{name : pp_secondBu,   value: 'BBBB'}
                     //,{name : pp_thirdBu,   value: 'CCCC'}
                 ]
             })
		 });
		 myItems.push({
			 xtype     : 'textfield',
        	 fieldLabel: getColName('newmodcont'),
        	 name: 'newmodcont',
	    	 id:'newmodcont',
        	 value: newmodcont,
        	 readOnly : true,
             fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
		 });
		 
		 var checkboxItem =[];
			attachedFileStore.each(function(record){
				console_log(record);
				console_log('----------------------------------------------');
				console_log(record.get('object_name'));
				console_log(record.get('id'));
				console_log(record.get('group_code'));
				console_log(record.get('file_path'));
				console_log(record.get('file_size'));
				console_log(record.get('fileobject_uid'));
				console_log(record.get('file_ext'));
				
				checkboxItem.push({
		            xtype: 'checkboxfield',
		            name: 'deleteFiles',
		            boxLabel: record.get('object_name') + '(' + record.get('file_size') +')',
		            checked: false,
		            inputValue: record.get('id')
				});
			});
			
			if(checkboxItem.length > 0) {
			
				myItems.push({
			        xtype: 'checkboxgroup',
			        allowBlank: true,
			        fieldLabel: 'Check to Delete',
			        //cls: 'x-check-group-alt',
			        items:checkboxItem
			    });
			}
			
			myItems.push({
				 xtype: 'filefield',
	             emptyText: panelSRO1149,
	             buttonText: 'upload',
	             fieldLabel:     getColName('file_itemcode'),
	             allowBlank: true,
	             buttonConfig: {
	                 iconCls: 'upload-icon'
	             }
			 });
		 
		var form = Ext.create('Ext.form.Panel', {
 		id: 'formPanel',
 		xtype: 'form',
//         closable: true,
         frame: false ,
         //closeAction: 'close',
         bodyPadding: '3 3 0',
         width: 800,
         fieldDefaults: {
             labelAlign: 'middle',
             msgTarget: 'side'
         },
         defaults: {
             anchor: '100%'
         },
			items: [
//		        new Ext.form.Hidden({
//	            id: 'pj_name',
//		           name: 'pj_name'
//		        }), //pj_name_hidden, 화면 두번띄우면 에러
		        new Ext.form.Hidden({
		            id: 'srch_type',
			           name: 'srch_type',
			           value:  'update'
		        }),
		        new Ext.form.Hidden({
		            id: 'order_com_unique',
			        name: 'order_com_unique',
			        value: order_com_unique
		        }), 
		        {
				xtype:'fieldset',
	            title: panelSRO1002,
	            collapsible: true,
	            defaultType: 'textfield',
	            layout: 'anchor',
	            defaults: {
	                anchor: '100%'
	            },
	            items :[{
	                xtype: 'container',
	                layout:'hbox',
         	items: [{
         		 xtype: 'container',
                 flex: 1,
                 border:false,
                 layout: 'anchor',
                 defaultType: 'textfield',
                 defaults: { labelWidth: 90, labelAlign: 'right',  anchor:'95%'  },
                 items: myItems
//                	 [{
//	                 	xtype: 'textfield',
//	                    flex : 1,
//	                    name : 'pj_code',
//	                    id : 'pj_code',
//	                    fieldLabel:    getColName('pj_code'),
//	                    value: pj_code,
//	                    displayField:   "title",
//	                    readOnly : true,
//	                    fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
//             		},{
//             			fieldLabel: getColName('order_com_unique'),
//             			xtype: 'textfield',
//                        flex : 1,
//             			value: customer_name,
////             			name: 'order_com_unique',
//             			displayField:   "title",
//                        readOnly : true,
//                        fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
////             			 fieldLabel:    getColName('order_com_unique'),
////              		    id:          'order_com_unique',
////              		    name:          'order_com_unique',
////                      	xtype:          'combo',
////                      	value:	customer_name,
////	                    mode: 'local',
////	                    queryMode: 'remote',
////	                    displayField:   'wa_name',
////	                    valueField:     'unique_id',
////	                    store: buyerStore,
////	                    editable:false,
//////	                    readOnly: true,
////			            allowBlank: false,
////      	                listConfig:{
////      	                	getInnerTpl: function(){
////      	                		return '<div data-qtip="{wa_name}">[{wa_code}] {wa_name} </div>';
////      	                	}
////      	                }
//         		},{
//         			fieldLabel: getColName('description'),
//         			value: description,
//         			name: 'description',
//         			readOnly : true,
//         			type:  'textfield',
//         			fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
//         		},{
//                 	fieldLabel: getColName('regist_date'),
//                 	name: 'regist_date',
//                 	value: date(regist_date),
////                 	format: 'Y-m-d',
//// 			    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
// 			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
// 			    	readOnly : true,
//                    fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
// 			    		
//// 			    	xtype: 'datefield'
//         		},{
//         			fieldLabel: getColName('selling_price'),
//         			value: selling_price,
//         			name: 'selling_price',
//         			allowBlank: false,
//         			minValue:0,
//         			type:  'numberfield'
//         		},{	
//                 	fieldLabel: getColName('resine_color'),
//                 	value: resine_color,
//                 	name: 'resine_color',
//                 	type:  'textfield'
//                 },{	
//                 	fieldLabel: getColName('surface_art'),
//                 	value: surface_art,
//                 	name: 'surface_art',
//                 	type:  'textfield'  
//                 },{
//                 	xtype:          'combo',
//	                mode:           'local',
//	                value:          'JS0000CN',
//	                triggerAction:  'all',
//	                forceSelection: true,
//	                editable:       false,
//	                allowBlank: false,
//	                fieldLabel:     getColName('reserved_varchar4'),
//	                name:           'reserved_varchar4',
//	                displayField:   'name',
//	                valueField:     'value',
//	                queryMode: 'local',
//	                store:          Ext.create('Ext.data.Store', {
//	                    fields : ['name', 'value'],
//	                    data   : [
//	                        {name : pp_firstBu,   value: 'JS0000CN'}
//	                        //,{name : pp_secondBu,   value: 'BBBB'}
//	                        //,{name : pp_thirdBu,   value: 'CCCC'}
//	                    ]
//	                })
//                 },{
//              	   xtype     : 'textfield',
//              	   fieldLabel: getColName('newmodcont'),
//              	   name: 'newmodcont',
//  		    	   id:'newmodcont',
//              	   value: newmodcont,
//              	   readOnly : true,
//                   fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
//                 }]
         	},{ //---------------------------------------------------두번째 컬럼
     		xtype: 'container',
             flex: 1,
             layout: 'anchor',
             defaultType: 'textfield',
             defaults: { labelWidth: 90, labelAlign: 'right', anchor:'95%'  },  
     		 items:[{ 
            		
            		xtype: 'textfield',
                    flex : 1,
                    name : 'unique_id',
                    id : 'unique_id',
                    fieldLabel: 'UID',
                    value: unique_id,
                    displayField:   "title",
                    readOnly : true,
                    fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
     			 },{
         		    fieldLabel:    getColName('pj_type'),
         		    id:          'pj_type',
         		    name:          'pj_type',
                 	xtype:          'combo',
                 	value:	pj_type,
                    mode: 'local',
                    editable:false,
                    queryMode: 'remote',
                    displayField:   'codeName',
                    valueField:     'systemCode',
                    store: productCodeStore,
 	                listConfig:{
 	                	getInnerTpl: function(){
 	                		return '<div data-qtip="{codeName}">[{systemCode}] {codeName} / {codeNameEn}</div>';
 	                	}			                	
 	                }
//     		 	pageSize: 5
     			},{ 
     				/*fieldLabel: getColName('pj_name'),
                	name: 'pj_name',
                	allowBlank: false,
                	xtype:  'textfield'*/
        	    	fieldLabel:    getColName('pj_name'),
        		    id:          'pj_name',
        		    name:          'pj_name',
        	    	value: 			pj_name,
                	xtype:          'combo',
                    mode: 'local',
                    editable:false,
                    allowBlank: false,
//                    queryMode: 'remote',
                    displayField:   'item_name',
                    valueField:     'unique_id',
                    store: itemStore,
	                listConfig:{
	                	getInnerTpl: function(){
	                		return '<div data-qtip="{unique_id}">{item_name} / {cavity} / {model_size}</div>';
	                	}			                	
	                },
	                listeners: {
	   	                    select: function (combo, record) {
                        	var model_size = record[0].get('model_size');
                        	var cavity = record[0].get('cavity');
                        	var item_name = record[0].get('item_name');
                        	var Rev   = cavity.substring(0,1);
                        	var Cavity = cavity.substring(2,3);     
                        	var Family  = cavity.substring(4,6);
                        	Ext.getCmp('mold_type').setValue(model_size);
                        	Ext.getCmp('Rev').setValue(Rev);
                        	Ext.getCmp('Cavity').setValue(Cavity);
                        	Ext.getCmp('Family').setValue(Family);
                        	Ext.getCmp('pj_name').setValue(item_name); 
	   	                    }
					}
                 },{	
	                	fieldLabel: getColName('delivery_plan'),
	                    name: 'delivery_plan',
	                    id:'delivery_plan',
	                    format: 'Y-m-d',
	    		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
//	 			    	submitFormat: 'Y-m-d H:i:s',// 'Y-m-d H:i:s',
//	 			    	dateFormat: 'Y-m-d H:i:s',// 'Y-m-d H:i:s'
	 			    	allowBlank: false,
	 			    	value: date(delivery_plan),
	 			    	xtype: 'datefield'
         		},{
         			fieldLabel: getColName('pm_id'),
         			xtype: 'textfield',
                    flex : 1,
         			value: pm_id,
         			name: 'pm_id',
         			displayField:   "title",
                    readOnly : true,
                    fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
		       },{
		    	   xtype: 'fieldcontainer',
                   fieldLabel: getColName('cav_no'),
                   combineErrors: true,
                   msgTarget : 'side',
                   layout: 'hbox',
                   defaults: {
                       flex: 1,
                       hideLabel: true
                   },
                   items: [{
                       	xtype     : 'numberfield',
                           name      : 'Rev',
                           id		  : 'Rev',
                           fieldLabel: 'Rev',
                           minValue:1,
                           margin: '0 5 0 0'
//                           allowBlank: false
                       },{
                           xtype     : 'numberfield',
                           name      : 'Cavity',
                           id		  : 'Cavity',
                           fieldLabel: 'Cavity',
                           minValue:0
//                           allowBlank: false
                       },{
	                       	xtype     : 'numberfield',
	                       	name      : 'Family',
	                       	id		  : 'Family',
	                       	fieldLabel: 'Family',
	                       	minValue:1
//	                       	maxValue:2
//	                       	allowBlank: false
                       },{
                    	   xtype     : 'textfield',
                    	   name: 'cav_no',
        		    	   id:'cav_no',
                    	   value:cav_no,
                    	   readOnly : true,
                           fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
                       },{
                    	   	xtype: 'button',
                    	   	name: 'button',
                    	   	style: 'background-color: green',
                    	    width: 5,
         		            height: 5,
         		            minWidth: 20,
         		            minHeight: 20,
         		            text: CMD_OK,
         		            readyOnly: true,
                    	    handler: function() {
                    	    	var rev = Ext.getCmp('Rev').getValue();
                            	var cavity = Ext.getCmp('Cavity').getValue();
                            	var family = Ext.getCmp('Family').getValue();
                            	Ext.getCmp('cav_no').setValue(rev+"*"+cavity+"*"+family);
//                            	var cav_no = Ext.getCmp('cav_no').getValue();
//                            	Ext.MessageBox.alert('Check',cav_no);
                            	if(rev == null || cavity == null || family == null){
                            		Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                            	}
                    	    }
                       }]
		       },{ 
		    	   xtype:          'combo',
                   mode:           'local',
                   triggerAction:  'all',
//                   forceSelection: true,
                   editable:       false,
                   allowBlank: false,
                   fieldLabel:     getColName('mold_type'),
                   name:           'mold_type',
                   id:				'mold_type',
                   value:			mold_type,
                   displayField:   'value',
                   valueField:     'name',
                   queryMode: 'local',
                   store:          Ext.create('Ext.data.Store', {
                       fields : ['name', 'value'],
                       data   : [
                           {name : small_size,   value: panelSRO1202}
                          ,{name : medium_size,   value: panelSRO1203}
                           //,{name : pp_thirdBu,   value: 'CCCC'}
                       ]
                   })
		       },{
            	   xtype     : 'textarea',
            	   fieldLabel: getColName('reserved_varchar5'),
            	   name: 'reserved_varchar5',
		    	   id:'reserved_varchar5',
            	   value:reserved_varchar5,
            	   readOnly : false
//                   fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
        		}]     	
     		}] 
     	}]
    }      
			]		
 	});
	return form;
}

var viewHandler = function() {
 	var rec = grid.getSelectionModel().getSelection()[0];
 	
 	var unique_id = rec.get('unique_id');
 	//alert(unique_id);
 	ProjectMold.load(unique_id ,{
 		 success: function(projectmold) {
 			uploadStore = getUploadStore(unique_id);
			uploadStore.load(function() {
				console_log('uploadStore.load ok');
				console_log(uploadStore);
				uploadStore.each(function(record){
					console_log(record.get('object_name'));
				});

 		        var win = Ext.create('ModalWindow', {
 		            title: CMD_VIEW  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
 		            width: 500,
 		            height: 380,
 		            minWidth: 250,
 		            minHeight: 180,
 		            layout: 'absolute',
 		            plain:true,
 		            items: createViewForm(projectmold),
 		            buttons: [{
 		                text: CMD_OK,
 		            	handler: function(){
 		                       	if(win) 
 		                       	{
 		                       		win.close();
 		                       	} 
 		                  }
 		            }]
 		        });
 		        //store.load(function() {});
 				//win.show(this, function() {
 		       win.show();

			});
 		 }//endofsuccess
 	 });//emdofload

 };
 
 var editHandler = function() {
	 /*(G)*/vFILE_ITEM_CODE = RandomString(10);
	 
		var rec = grid.getSelectionModel().getSelection()[0];
		var unique_id = rec.get('unique_id');
		
		var attachedFileStore = Ext.create('Mplm.store.AttachedFileStore', {group_code: unique_id} );
		attachedFileStore.load(function() {
			console_log('attachedFileStore.load ok');
			
			ProjectMold.load(unique_id ,{
				 success: function(projectmold) {
//					uploadStore = getUploadStore(unique_id);
//					uploadStore.load(function() {
//						console_log('uploadStore.load ok');
//						console_log(uploadStore);
//						uploadStore.each(function(record){
//							console_log(record.get('object_name'));
//						});

		 		   var win = Ext.create('ModalWindow', {
		 	            title: CMD_MODIFY  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
		 	            width: 800,
		 	            height: 400,
		 	            minWidth: 250,
		 	            minHeight: 180,
		 	            layout: 'fit',
		 	            plain:true,
		 	            items: createEditForm(projectmold, attachedFileStore),
		 	            buttons: [{
		 	                text: CMD_OK,
		 	            	handler: function(){
		 	                    var form = Ext.getCmp('formPanel').getForm();
		 	                    if(form.isValid())
		 	                    {
		 	                	var val = form.getValues(false);
		 	                	
		 	                   	var projectmold = Ext.ModelManager.create(val, 'ProjectMold');
		 	                    projectmold.set('file_itemcode', vFILE_ITEM_CODE);
		 	                   	
		 	                    form.submit({
			                        url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +/*(G)*/vFILE_ITEM_CODE,
			                        waitMsg: 'Uploading Files...',
			                        success: function(fp, o) {
						            		//저장 수정
			                        	//저장 수정
				 	                   	projectmold.save({
				 	                		success : function() {
				 	                			//console_log('updated');
				 	                           	if(win) 
				 	                           	{
				 	                           		win.close();
				 	                           	store.load(function() {});

				 	                           	} 
				 	                		} 
				 	                	 });
			 	                	 
			 	                       	if(win) 
			 	                       	{
			 	                       		win.close();
			 	                       	}
			                        },
			                    	failure : function(){
			                    		console_log('failure');
			                    		Ext.MessageBox.alert(error_msg_prompt,'Failed');
			                    	}
		 	                    });
		 	                    } else {
		 	                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
		 	                    }

		 	                  }
		 	            },{
		 	                text: CMD_CANCEL,
		 	            	handler: function(){
		 	            		if(win) {
			            			win.close();
			            			 } }
		 	            }]
		 	        });
		 			//win.show(this, function() {
		 		  win.show();
//					});
				}
			 });//emdofload
		});
		

	};

//Define Add Action - New Mold
var addActionNew =	 Ext.create('Ext.Action', {
    text: sro1_newmold,//'Major Fields | Current Rows',
    iconCls:'brick_add',
    disabled: fPERM_DISABLING(),
    handler: function(widget, event) {
    	buyerStore['cmpName'] = 'order_com_unique'; //combo name
    	//check select.
    	var order_com_unique = getSearchObject_('order_com_unique').getValue();
    	var pj_type = getSearchObject('pj_type').getValue();
    	var model_uid = getSearchObject('model_uid').getValue();
    	var from_type = getSearchObject('from_type').getValue();
    	var description = getSearchObject('description').getValue();
    	
    	if(order_com_unique==null || order_com_unique=='') {
    		Ext.MessageBox.alert(sro1_warning_msg, sro1_company_msg, callBack);  
            function callBack(id){  
                return
            } 
            return;
    	}
    	
    	
    	if(pj_type==null || pj_type=='') {
    		Ext.MessageBox.alert(sro1_warning_msg, sro1_select_product, callBack);  
            function callBack(id){  
                return
            } 
            return;
    	}
    	
    	if(model_uid==null || model_uid=='' || model_uid =='-1') {
    		Ext.MessageBox.alert(sro1_warning_msg, sro1_select_model, callBack);  
            function callBack(id){  
                return
            } 
            return;
    	}
    	
    	if(from_type==null || from_type=='') {
    		Ext.MessageBox.alert(sro1_warning_msg, sro1_select_moldtype, callBack);  
            function callBack(id){  
                return
            } 
            return;
    	}
    	
    	console_log('-----------add action---------');
    	console_log(order_com_unique);
    	console_log(pj_type);
    	console_log(from_type);
    	console_log(description);
    	
    	
    	buyerStore['cmpName'] = 'order_com_unique'; //combo name
//   	 var formPjcode = new Ext.form.Hidden({
//		    id: 'pj_code',
//		   name: 'formPjcode'
//		}); ???k1park
    	var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
    		xtype: 'form',
//            closable: true,
            frame: false ,
            //closeAction: 'close',
            bodyPadding: '3 3 0',
            width: 800,
            autoHeight: true,
            fieldDefaults: {
                labelAlign: 'middle',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 100
            },
			items: [/*pj_name_hidden,화면두번띄우면 에러*/
			        new Ext.form.Hidden({
			            id: 'pj_name',
			           name: 'pj_name'
			        }),
			        {
				 xtype: 'fieldset',
		            title: panelSRO1045,
		            collapsible: true,
		            defaults: {
		                labelWidth: 89,
		                anchor: '100%',
		                labelAlign: 'right',
		                layout: {
		                    type: 'hbox',
		                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
		                }
		            },		            
		            items: [{
	                    xtype: 'fieldcontainer',
	                    //fieldLabel: '模房',
	                    combineErrors: false,
	                    defaults: {
	                        hideLabel: true
	                    },
	                    items:[{
	                                xtype: 'displayfield',
	                                value: panelSRO1195+':'
	                            },{
		                            	//the width of this field in the HBox layout is set directly
		                            //the other 2 items are given flex: 1, so will share the rest of the space
		                            width:          50,
		                            xtype:          'combo',
		                            mode:           'local',
		                            id: 			'choice_one',
		                            value:          'A',
		                            triggerAction:  'all',
		                            forceSelection: true,
		                            editable:       false,
		                            name:           'choice_one',
		                            displayField:   'name',
		                            valueField:     'value',
		                            width: 70,
		                            queryMode: 'local',
		                            handler:function() {
		        						Ext.getCmp("choice_one");
		        					},
		        					listeners: {
			   	   	                    select: function (combo, record) {
			                            	var obj = Ext.getCmp('pj_code');
			                            	obj.reset();
			   	   	                    }
		        					},
		                            store:          Ext.create('Ext.data.Store', {
		                                fields : ['name', 'value'],
		                                data   : [
		                                    {name : 'A:上角',   value: 'A'},
		                                    {name : 'B:上沙',  value: 'B'},
		                                    {name : 'C:乌沙', value: 'C'}
		                                ]
		                            })
	                            },{
		                            xtype: 'displayfield',
		                            value: panelSRO1196
	                            },{
		                           name : 'year',
		                           xtype: 'numberfield',
		                           id: 	'year',
		                           width: 48,
		                           value: Towlength_year,
		                           minValue:0,
		                           allowBlank: false
	                            },{
		                           xtype: 'displayfield',
		                           value: panelSRO1197
	                            },{
			                           xtype: 'textfield',
			                           name : 'from_type',
			                           id : 'from_type',
			                           fieldLabel: panelSRO1172,
			                           width:         30,
			                           value: from_type,
			   	                	readOnly: true,
				                	fieldStyle: 'background-color: #E7EEF6; background-image: none;',
			                           allowBlank: false
	                            },{
		                           xtype: 'displayfield',
		                           value: panelSRO1198
	                            },{
		                           xtype: 'textfield',
		                           name : 'version',
		                           fieldLabel: panelSRO1172,
		                           width:         30,
		                           id: 	'version',
		                           value: '00',
		   	                	readOnly: true,
			                	fieldStyle: 'background-color: #E7EEF6; background-image: none;',
		                           allowBlank: false
	                            },{
		                           xtype: 'displayfield',
		                           value: panelSRO1199
	                            },{
		                    	   xtype: 		   'checkbox',
		                    	   handler: function(checkbox, checked) {
		                    		   if(checked) {
		                    			   var pj_code = Ext.getCmp('pj_code').getValue();
		                    			   Ext.getCmp('pj_code1').setValue(Cpj_code(pj_code));
		                    		   }else{
		                    			   Ext.getCmp('pj_code1').setValue("");
		                    		   }
		                    	   }
		                       },{
	                           items: [{
	                        	   xtype: 'container',
	                                width: 265,
	                                layout: 'hbox',
	                                margin: '5 5 5 0',
	                             items: [{
	                                xtype:'button',
	                                text: CMD_OK,
	                                width:   40,
	                                handler : function(){
	                                	var ChoiceOne = Ext.getCmp('choice_one').getValue();    		                        	  
 		                        	    var Year = Ext.getCmp('year').getValue();
 		                        	    var from_type = Ext.getCmp('from_type').getValue();
 		                        	    
 		                        	   Ext.Ajax.request({
	                             			url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastno',
	                             			params:{
	                             				ChoiceOne:ChoiceOne,
	                             				Year:Year,
	                             				from_type:from_type
	                             			},
	                             			success : function(result, request) {   
//	                             				var ChoiceOne = Ext.getCmp('choice_one').getValue();    		                        	  
//	     		                        	    var Year = Ext.getCmp('year').getValue();    		                        	  
	     		                        	    var from_type = Ext.getCmp('from_type').getValue();    		                        	  
	     		                        	    var Version = Ext.getCmp('version').getValue();    		                        	  
	                             				var result = result.responseText;
	                             				var str = result;	
	                             				var num = Number(str); 	

                             					if(str.length==3){
     	                        					num = '0' + num; 
     	                        				}else if(str.length==2){
     	                        					num = '00' + num;
     	                        				}else if(str.length==1){
     	                        					num = '000' + num;
     	                        				}else{
     	                        					num = num%10000;
     	                        				}
     	                        				Ext.getCmp('pj_code').setValue("J"+ChoiceOne+Year+from_type+"-"+num+"-"+Version+"A");
	                             				
	                             			},
	                             			failure: extjsUtil.failureMessage
	                             		});
	                                }
	                             },{
	                                xtype: 'textfield',
	                                anchor: '100%',
	                                name : 'pj_code',
	                                id : 'pj_code',
	                                width:110,
	                                readOnly : true,
	                                allowBlank: false,
	                                fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
	                             },{
	                            	 xtype: 'textfield',
	                            	 anchor: '100%',
	                            	 name : 'pj_code1',
	                            	 id : 'pj_code1',
	                            	 width:110,
	                            	 readOnly : true,
	                            	 fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
	                             }]
	                           }]
		                }]
	                    
                	}]	            
			},{
				xtype:'fieldset',
	            title: panelSRO1002,
	            collapsible: true,
	            defaultType: 'textfield',
	            layout: 'anchor',
	            defaults: {
	                anchor: '100%'
	            },
	            items :[{
	                xtype: 'container',
	                layout:'hbox',
            	items: [{
            		xtype: 'container',
                    flex: 1,
                    border:false,
                    layout: 'anchor',
                    defaultType: 'textfield',
                    defaults: { labelWidth: 90, labelAlign: 'right',  anchor:'95%'  },
                    items: //inputItem1
                    	[	            			
                       new Ext.form.Hidden({
        		    	id: 'order_com_unique',
         		       name: 'order_com_unique',
         		       value: order_com_unique
         		    }),
         		    {
		                fieldLabel: getColName('order_com_unique'),
                        readOnly : true,
                        value: '[' + selectedWaCode + ']' + selectedWaName,
                        fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
            		},{
            			fieldLabel: getColName('description'),
            			name: 'description',
                        readOnly : true,
                        value: description,
                        fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
            		},{	
                    	fieldLabel: getColName('resine_color'),
                    	name: 'resine_color',
                    	allowBlank: false,
                    	minValue:0,
                    	xtype:  'textfield'
                    },{	
                    	fieldLabel: getColName('surface_art'),
                    	name: 'surface_art',
                    	allowBlank: false,
                    	xtype:  'textfield'  
                    
                	},{
                    	fieldLabel: getColName('regist_date'),
                    	name: 'regist_date',
                    	format: 'Y-m-d',
    			    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                    	allowBlank: false,
//                    	vtype: 'daterange',
                        value : new Date(),
//                        endDateField: 'todate'
                    	xtype: 'datefield'     		
            		},{
            			fieldLabel: getColName('selling_price'),
            			name: 'selling_price',
            			allowBlank: false,
//            			minValue:0,
            			xtype:  'textfield'
            		},{ 
                		xtype:          'combo',
                        mode:           'local',
                        value:          'JS0000CN',
                        triggerAction:  'all',
                        forceSelection: true,
                        editable:       false,
                        allowBlank: false,
                        fieldLabel:     getColName('reserved_varchar4'),
                        name:           'reserved_varchar4',
                        displayField:   'name',
                        valueField:     'value',
                        queryMode: 'local',
                        store:          Ext.create('Ext.data.Store', {
                            fields : ['name', 'value'],
                            data   : [
                                {name : pp_firstBu,   value: 'JS0000CN'}
                            ]
                        })
            		},{ 
				    	    xtype: 'filefield',
				            emptyText: panelSRO1149,
				            fieldLabel:     getColName('file_itemcode'),
				            buttonText: 'upload',
				            allowBlank: true,
				            buttonConfig: {
				                iconCls: 'upload-icon'
				            }
                	}]
            	},{ //두번째 컬럼
        		xtype: 'container',
                flex: 1,
                layout: 'anchor',
                defaultType: 'textfield',
                defaults: { labelWidth: 90, labelAlign: 'right', anchor:'95%'  },  
        		items://inputItem2
        			[{ 
            		    fieldLabel:    getColName('pj_type'),
            		    id:          'pj_type',
            		    name:          'pj_type',
                        readOnly : true,
                        value: pj_type,
                        fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
            	    },{ 
            	    	fieldLabel:    getColName('pj_name'),
                    	xtype:          'combo',
                        mode: 'local',
                        editable:false,
                        allowBlank: false,
                        queryMode: 'remote',
                        displayField:   'item_name',
                        valueField:     'unique_id',
                        store: itemStore,
    	                listConfig:{
    	                	getInnerTpl: function(){
    	                		return '<div data-qtip="{unique_id}">{item_name} / {cavity} / {model_size}</div>';
    	                	}			                	
    	                },
    	                listeners: {
   	   	                    select: function (combo, record) {
                            	var model_size = record[0].get('model_size');
                            	var cavity = record[0].get('cavity');
                            	var item_name = record[0].get('item_name');
                            	
                            	Ext.getCmp('mold_type').setValue(model_size);
                            	Ext.getCmp('pj_name').setValue(item_name); 
                            	Ext.getCmp('cav_no').setValue(cavity);
//                            	if(cavity.length<=5){
//                            		Ext.getCmp('cav_no').setValue('['+cavity.substring(0,1) + ']' + '*' + '['+cavity.substring(2,3) + ']'
//                        					+ '*' + '['+cavity.substring(4,5) + ']'); 
//                            	}else{
//                            		Ext.getCmp('cav_no').setValue('['+cavity.substring(0,1) + ']' + '*' + '['+cavity.substring(2,3) + ']'
//                        					+ '*' + '['+cavity.substring(4,6) + ']'); 
//                            	}
                            	
   	   	                    }
    					}
                    },{
                            xtype: 'fieldcontainer',
                            fieldLabel: getColName('cav_no'),
                     	   xtype: 'textfield',
                           flex : 1,
                           name: 'cav_no',
                           id:'cav_no'
				       },{ 
				    	   xtype:          'combo',
	                       mode:           'local',
	                       triggerAction:  'all',
	                       editable:       false,
	                       allowBlank: false,
	                       fieldLabel:     getColName('mold_type'),
	                       name:           'mold_type',
	                       id:				'mold_type',
	                       displayField:   'value',
	                       valueField:     'name',
	                       queryMode: 'local',
	                       store:          Ext.create('Ext.data.Store', {
	                           fields : ['name', 'value'],
	                           data   : [
	                               {name : small_size,   value: panelSRO1202}
	                              ,{name : medium_size,   value: panelSRO1203}
	                           ]
	                       })
				       },{	
		                	fieldLabel: getColName('delivery_plan'),
		                    name: 'delivery_plan',
		                    format: 'Y-m-d',
	    			    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
	    			    	value: Ext.Date.add (new Date(),Ext.Date.DAY,15),
		                    allowBlank: false,
		                    xtype: 'datefield'
	                    },{ 
	                        
	                                     	fieldLabel: getColName('pm_uid'),
	                         				name : 'pm_uid',
	                         	            xtype: 'combo',
	                         	            store: userStore,
	                         	            displayField: 'user_name',
	                         	            valueField:     'unique_id',
	                         	            typeAhead: false,
//	                 	                    editable:false,
	                 	                    allowBlank: false,
	                         	            //hideLabel: true,
	                         	            //hideTrigger:true,
	                         	            listConfig: {
	                         	                loadingText: 'Searching...',
	                         	                emptyText: 'No matching posts found.',
	                         	                // Custom rendering template for each item
	                         	                getInnerTpl: function() {
	                         	                    return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
	                         	                }
	                         	            }
					       },{ 
		                		xtype:          'combo',
		                        mode:           'local',
		                        value:          'N',
		                        triggerAction:  'all',
		                        forceSelection: true,
	
		                        editable:       false,
		                        allowBlank: false,
		                        fieldLabel:     getColName('newmodcont'),
		                        name:           'newmodcont',
		                        displayField:   'name',
		                        valueField:     'value',
		                        queryMode: 'local',
		                        store:          Ext.create('Ext.data.Store', {
		                            fields : ['name', 'value'],
		                            data   : [
		                                {name : panelSRO1200,   value: 'N'}
		                            ]
		                        })
		                }]   
            		}] 
            	}]
	        }

	        
			]		
    	});
    	
    	console_log(model_uid);
    	var win = Ext.create('ModalWindow', {
            title:CMD_ADD  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
            width: 800,
            height: 430,//480,
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
                	var val = form.getValues(false);
                   	var projectmold = Ext.ModelManager.create(val, 'ProjectMold');
//                   	val["file_itemcode"] = /*(G)*/vFILE_ITEM_CODE;
                 	console_log(projectmold);

                   	 console_log('model_uid: ' +model_uid);
                   	//projectmold.setValue('model_uid', model_uid);
                 	//projectmold['model_uid'] = model_uid;
                 	projectmold.set('model_uid', model_uid);
                 	projectmold.set('file_itemcode', vFILE_ITEM_CODE);
                	console_log('projectmold -------------------');
                 	console_log(projectmold);
                   	
                   	var pj_code = Ext.getCmp('pj_code').getValue();
                   	var pj_code1 = Ext.getCmp('pj_code1').getValue();
                   //중복 코드 체크
                   	Ext.Ajax.request({
   						url: CONTEXT_PATH + '/sales/poreceipt.do?method=checkCode',				
        				params:{
        					pj_code : pj_code,
        					pj_code1 : pj_code1
        				},
   						
   						success : function(result, request) {
   							form.submit({
   		                        url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +/*(G)*/vFILE_ITEM_CODE,
   		                        waitMsg: 'Uploading Files...',
   		                        success: function(fp, o) {
   		                        	console_log('success');
   		                        	var ret = result.responseText;
   		   							if(ret == 0 ||  ret  == '0') {
   		   							//저장 수정
   		   			                   	projectmold.save({
   		   			                		success : function() {
   		   			                			//console_log('updated');
   		   			                           	if(win) 
   		   			                           	{
   		   			                           		win.close();
   		   			                           		store.load(function() {});
   		   			                           	} 
   		   			                		} 
   		   			                	 });   
   		   								
   		   			                 if(win) 
   		   	                       	{
   		   	                       		win.close();
   		   	                       	}   					
   		   							} else {
   		   								Ext.MessageBox.alert('Duplicated Code', 'check ' + getColName('pj_code') + ' value.'); 
   		   							}
		                        },
		                    	failure : function(){
		                    		console_log('failure');
		                    		Ext.MessageBox.alert(error_msg_prompt,'Failed');
		                    	}
   			                 });
   							console_log('requested ajax...');
   						},
   						failure: extjsUtil.failureMessage
   					}); 
                    } else {
                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                    	/*
                    	      Ext.MessageBox.alert('提示', '请单击我 确定', callBack);
				               function callBack(id) {
				                   alert('单击的按钮id是：'+id);
				               }
				           });
                    	 */
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
		//win.show(this, function() {
    	win.show();
    	//button.dom.disabled = false;
//    	});
     }
});

//Define Edit Action

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});


var detailAction  = Ext.create('Ext.Action', {
	itemId: 'detailButton',
    iconCls: 'application_view_detail',
    text: detail_text,
    disabled: true,
    handler: viewHandler
});

var editAction = Ext.create('Ext.Action', {
	itemId: 'editButton',
    iconCls: 'pencil',
    text: edit_text,
    disabled: true ,
    handler: editHandler
});


//Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ detailAction, editAction, removeAction  ]
});

var searchField = [];

Ext.onReady(function() {  
	
	console_log('now starting...');
	
	LoadJs('/js/util/buyerStore.js');
	LoadJs('/js/util/itemStore.js');
	//LoadJs('/js/util/moldFormTypeStore.js');
	moldFormTypeStore = Ext.create('Mplm.store.MoldFormTypeStore', {hasNull: false} );
	IsComplishedStore  = Ext.create('Mplm.store.IsComplishedStore', {hasNull: false} );
	searchField.push(
	{
		field_id :'order_com_unique',
        store: 'BuyerStore',
        displayField:   'wa_name',
        valueField:     'unique_id',
        innerTpl	: '<div data-qtip="{unique_id}">[{wa_code}] {wa_name}</div>'
	});
	searchField.push(
	{
		width: 160,
		field_id :'pj_type',
		store: 'ProcuctCodeStore',
		displayField:   'codeName',
		valueField:     'systemCode',
		innerTpl	: '<div data-qtip="{unique_id}">[{systemCode}] {codeName}'// / {codeNameEn}</div>'
	});
	searchField.push(
	{
		type: 'hidden',
		field_id :'model_uid'
	});
	searchField.push(
	{
		width: 160,
		field_id :'description',
		//store: 'BuyerModelStore',  --> 따로정의되어 있음.
		fields : ['model_name'],
		displayField:   'model_name',
		valueField:     'model_name',
		innerTpl	: '<div data-qtip="{model_name}">{model_name}</div>'
	});
	
	searchField.push(
	{
		width: 120,
		field_id :'from_type',
		store: 'MoldFormTypeStore',
		displayField:   'codeName',
		valueField:     'systemCode',
		innerTpl	: '<div data-qtip="{systemCode}">[{systemCode}]{codeName}</div>'
	});

	searchField.push(
	{
		type: 'radio',
		field_id :'newmodcont',
		items: [
		    	{ 
		    		pressed: togIsNew,
		    	 	text :  'New',
		    	 	value: 'N',
		    	 	iconCls:'brick_add'
		    	},
		        { 
		    		pressed: !togIsNew,
		    	 	text :  'Mod',
		    	 	value: 'M',
		    	 	iconCls:'brick_edit'
		    	}
		        ]
	});
	
	makeSrchToolbar(searchField);
	console_log('makeSrchToolbar OK');
	
//	vSRCH_TOOLBAR.splice(7,0, { 
//		toggleGroup: 'moldNewMod',
//		pressed: !togIsNew,
//
//	 	xtype : "button", 
//	 	text :  'Mod',
//	 	iconCls:'brick_edit',
//		handler: function(){},
//		listeners: {}
//	});
//	vSRCH_TOOLBAR.splice(7,0, { 
//		toggleGroup: 'moldNewMod',
//		pressed: togIsNew,
//	 	xtype : "button", 
//	 	text :  'New',
//	 	iconCls:'brick_add',
//		handler: function(){},
//		listeners: {}
//	});
//	vSRCH_TOOLBAR.splice(7,0, '-');

	//ProjectMold Store 정의
	Ext.define('ProjectMold', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/sales/poreceipt.do?method=read', /*1recoed, search by cond, search */
		            create: CONTEXT_PATH + '/sales/poreceipt.do?method=create', /*create record, update*/
		            update: CONTEXT_PATH + '/sales/poreceipt.do?method=update',
		            destroy: CONTEXT_PATH + '/sales/poreceipt.do?method=destroy' /*delete*/
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
	
	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'ProjectMold',
		//remoteSort: true,
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	
//	
//	Ext.define('LastNo', {
//	   	 extend: 'Ext.data.Model',
//	   	 fields: ['last_no'],
//	   	    proxy: {
//					type: 'ajax',
//			        api: {
//			            read: CONTEXT_PATH + '/sales/poreceipt.do?method=lastno'
//			        },
//					reader: {
//						type: 'json',
//						root: 'datas'
//					}
//				}
//		});
//		
//	lastNoStore =new Ext.data.Store({  
//		model: 'LastNo',
//	});


 	store.load(function() {

 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
 		/*
			var selModel = Ext.create('Ext.selection.CheckboxModel', {
			    listeners: {
			        selectionchange: function(sm, selections) {
			        	grid.down('#removeButton').setDisabled(selections.length == 0);
			        }
			    }
			});
			*/
			grid = Ext.create('Ext.grid.Panel', {
			        store: store,
			        ///COOKIE//stateful: true,
			        collapsible: true,
			        multiSelect: true,
			        stateId: 'stateGrid',
			        selModel: selModel,
			        autoScroll : true,
			        autoHeight: true,
			        //layout: 'fit',
			        height: getCenterPanelHeight(),
			     // paging bar on the bottom
			        
			        bbar: getPageToolbar(store),
			        
			        dockedItems: [{
			            dock: 'top',
			            xtype: 'toolbar',
			            items: [
			                    searchAction
			                    , '-'//, addActionNew
			                    
			                    
			                    ,{
			                    	iconCls:'add',
			                        text: CMD_ADD,
			                        disabled: fPERM_DISABLING(),
			    			        menu: {
			    			            items: [
			    			                    addActionNew,
			    			                    addActionMod
			    			                    ,addActionVer
			    			                
			    			            ]
			    			        }
			    			    }
			                    ,  '-', removeAction,  '-', completeAction
			                    ,
	      				        '->'
	      				          ]
			        },
			        
			        {
			            xtype: 'toolbar',
			            items: /*(G)*/vSRCH_TOOLBAR
			            
			        },
      				{
      		        	xtype: 'toolbar',
      		        	items: [{
      						id :'isComplished',
      		                name:           'isComplished',
      						xtype:          'combo',
      		                mode:           'local',
      		                triggerAction:  'all',
      		                forceSelection: true,
      		                editable:       false,
      		                allowBlank: false,
      		                emptyText:  sro1_complete,
      		                displayField:   'codeName',
      		                valueField:     'systemCode',
      		                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
      		                queryMode: 'remote',
//      		                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
      		                store: IsComplishedStore,
      		                listConfig:{
      		                	getInnerTpl: function(){
      		                		return '<div data-qtip="{systemCode}">{codeName}</div>';
      		                	}			                	
      		                },
      		                	listeners: {
      		                		select: function (combo, record) {
      		                			var isComplished = Ext.getCmp('isComplished').getValue();
      		                			store.getProxy().setExtraParam('is_complished', isComplished);
      				     				store.load({});
      		                		}//endofselect
      		                	}
      		        	}]
      		        }
			        
			        ],
			        columns: /*(G)*/vCENTER_COLUMNS,
			        viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
// 			            getRowClass: function(record) { 
//   			              return record.get('creator_uid')  == vCUR_USER_UID ? 'my-row' : ''; 
//			            } ,
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
			                }/*,
			                itemdblclick: viewHandler */
			            }
			        },
			        title: getMenuTitle()
//			        renderTo: 'MAIN_DIV_TARGET'
			    });
			fLAYOUT_CONTENT(grid);
			
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		        	var rec = grid.getSelectionModel().getSelection()[0];
		            if (selections.length) {
						//grid info 켜기
						displayProperty(selections[0]);
						
						if(fPERM_DISABLING()==true) {
			            	editAction.disable();
			            	removeAction.disable();	
			            	addActionMod.disable();	
			            	addActionVer.disable();	
			            	completeAction.disable();	
						}else{
							if(rec.get('creator_uid')!=vCUR_USER_UID){
				            	removeAction.enable(); 
				            	editAction.disable();
				            	completeAction.enable();
				            }else{
				            	removeAction.enable();	
				            	editAction.enable();
				            	completeAction.enable();
				            }
			            	addActionMod.enable();	
			            	addActionVer.enable();	
						}
						detailAction.enable();
		            } else {
		            	if(fPERM_DISABLING()==true) {
			            	collapseProperty();//uncheck no displayProperty
			            	editAction.disable();
			            	removeAction.disable(); 
			            	addActionMod.disable();	
			            	addActionVer.disable();	
			            	completeAction.disable();	
		            	}else{
		            		collapseProperty();//uncheck no displayProperty
			            	editAction.disable();
			            	removeAction.disable(); 
			            	addActionMod.disable();	
			            	addActionVer.disable();	
			            	completeAction.disable();	
		            	}
		            	detailAction.enable();
		            }
		           
		        }
		    });

		    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
		        Ext.create('Ext.tip.ToolTip', config);
		    });
		cenerFinishCallback();//Load Ok Finish Callback
	}); //store load
 	 	
});	//OnReady

var modelStore = Ext.create('Mplm.store.BuyerModelStore', {hasNull: true} );
//refill BuyerModel
function refillBModelCombo() {
	
	console_log('in refillBModelCombo');
	var order_com_unique = getSearchValue_('order_com_unique');
	console_log('*********************' + order_com_unique + '***********************');
	var pj_type = getSearchValue('pj_type');
	if(Number(order_com_unique) > 0) {
		modelStore.proxy.extraParams.combst_uid = order_com_unique;	
	}
	
	modelStore.proxy.extraParams.pj_type = pj_type;
	
	console_log('clearSrchCombo');
	clearSrchCombo('description');
	
	var oBModel = getSearchObject('description');
	oBModel.setLoading(true);
	
	modelStore.load( function(modelRecords) {
		console_log('loaded modelStore.load: qty=' + modelRecords.length);
		//Model Combo Object
		oBModel.setLoading(false);
		console_log(oBModel);
	    for (var i=0; i<modelRecords.length; i++){
	    	  console_log(modelRecords[i]);
	          oBModel.store.add(modelRecords[i]);
	          
	    }
	});
}

//Define Add Action - Modification Mold
var addActionMod =	 Ext.create('Ext.Action', {
	    text: sro1_modmold,//'Major Fields | Current Rows',
	    iconCls:'brick_edit',
	    disabled: true,
	    handler: function(widget, event) {
var selections = grid.getSelectionModel().getSelection();
	        
	        if (selections) {
	        	record = selections[0];
	        	selectedMoldUid = record.get('unique_id');
	        	selectedMoldCode = record.get('pj_code');
	        	selectedMoldCodeDash = record.get('pj_code_dash');
	        	
	        	selectedWaName = record.get('wa_name');
	        	selectedWaCode = record.get('wa_code');
	        	selectedDescription = record.get('description'); //제품모델번호', 'description', '机型
	        	selectedPjName = record.get('pj_name'); //제품명', 'pj_name', '品名
	        	selectedPjType = record.get('pj_type'); //제품유형코드', 'pj_type', '产品代码
	        	selectedMoldType = record.get('mold_type'); //'주물/소물', 'mold_type', '主件/小件
	        	selectedResine_color = record.get('resine_color');
	        	selectedSurface_art = record.get('surface_art');
	        	selectedCav_no = record.get('cav_no');
	        	selectedFile_itemcode = record.get('file_itemcode');
	        	
	        	order_com_unique = record.get('order_com_unique');
	        	moldAddType = 'MOD';
	        	
	        	
//	        	var curVer = Number (selectedMoldCode.substring(9, 11) );
//	        	newVer = '' + (curVer+1);
//	        	if(newVer.length==1) {
//	        		newVer = '0' + newVer;
//	        	}
//	        	newMoldNo = selectedMoldCodeDash.substring(0, 11) + newVer + selectedMoldCode.substring(11, 12);
	        	
	        } else {
	        	return;
	        }
	    	var attachedFileStore = Ext.create('Mplm.store.AttachedFileStore', {group_code: selectedMoldUid} );
	    	attachedFileStore.load(function() {
	    	var newVer = '';
	    	var newMoldNo = '';
	    	
     	    Ext.Ajax.request({
     			url: CONTEXT_PATH + '/sales/poreceipt.do?method=nextMoldNo',
     			params:{
     				pj_code: selectedMoldCode
     			},
     			success : function(result, request) {
     				var newVer = result.responseText;
     				//var curVer = Number(result); 	
     				//newVer = '' + (curVer+1);
     				if(newVer.length==1) {
     					newVer = '0' + newVer;
     				}
     				newMoldNo = selectedMoldCodeDash.substring(0, 11) + newVer + selectedMoldCode.substring(11, 12);
     				var myItems = [];

 	    			myItems.push({
     	    				fieldLabel: getColName('order_com_unique'),
		                value: '[' + selectedWaCode + ']' + selectedWaName,
                        readOnly : true,
                        fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
 	    			});
 	    			myItems.push({
 	    				fieldLabel: getColName('description'),
		                value: selectedDescription,
                        readOnly : true,
                        fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
 	    			});
 	    			myItems.push({
 	    				fieldLabel: getColName('regist_date'),
                    	name: 'regist_date',
                    	format: 'Y-m-d',
    			    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                    	allowBlank: false,
//	                    	vtype: 'daterange',
                        value : new Date(),
//	                        endDateField: 'todate'
                    	xtype: 'datefield'     	
 	    			});
 	    			myItems.push({
 	    				fieldLabel: getColName('selling_price'),
            			name: 'selling_price',
            			allowBlank: false,
            			minValue:0,
            			xtype:  'numberfield'
 	    			});
 	    			myItems.push({
 	    				fieldLabel: getColName('resine_color'),
                    	name: 'resine_color',
		                value: selectedResine_color,
                        readOnly : true,
                        fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
 	    			});
 	    			myItems.push({
 	    				fieldLabel: getColName('surface_art'),
                    	name: 'surface_art',
		                value: selectedSurface_art,
                        readOnly : true,
                        fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
 	    			});
 	    			myItems.push({
 	    				xtype:          'combo',
                        mode:           'local',
                        value:          'JS0000CN',
                        triggerAction:  'all',
                        forceSelection: true,
                        editable:       false,
                        allowBlank: false,
                        fieldLabel:     getColName('reserved_varchar4'),
                        name:           'reserved_varchar4',
                        displayField:   'name',
                        valueField:     'value',
                        queryMode: 'local',
                        store:          Ext.create('Ext.data.Store', {
                            fields : ['name', 'value'],
                            data   : [
                                {name : pp_firstBu,   value: 'JS0000CN'}
                            ]
                        })
 	    			});
 	    			myItems.push({
 	    				xtype:          'combo',
                        mode:           'local',
                        triggerAction:  'all',
                        forceSelection: true,
                        editable:       false,
                        allowBlank: false,
                        fieldLabel:     getColName('newmodcont'),
                        name:           'newmodcont',
                        displayField:   'name',
                        valueField:     'value',
                        queryMode: 'local',
                        value: 'M',
                        store:          Ext.create('Ext.data.Store', {
                            fields : ['name', 'value'],
                            data   : [
                               {name : panelSRO1201,   value: 'M'}
                            ]
                        })
 	    			});
 	    			
 	    			var checkboxItem =[];
 	    			attachedFileStore.each(function(record){
 		    			console_log(record);
 		    			console_log('----------------------------------------------');
 		    			console_log(record.get('object_name'));
 		    			console_log(record.get('id'));
 		    			console_log(record.get('group_code'));
 		    			console_log(record.get('file_path'));
 		    			console_log(record.get('file_size'));
 		    			console_log(record.get('fileobject_uid'));
 		    			console_log(record.get('file_ext'));
 		    			checkboxItem.push({
 		    	          xtype: 'checkboxfield',
 		    	          name: 'deleteFiles',
 		    	          boxLabel: record.get('object_name') + '(' + record.get('file_size') +')',
 		    	          checked: false,
 		    	          inputValue: record.get('id')
 		    			});
 	    			});
 	    			
     				if(checkboxItem.length > 0) {
     					myItems.push({
     				        xtype: 'checkboxgroup',
     				        allowBlank: true,
     				        fieldLabel: 'Check to Delete',
     				        //cls: 'x-check-group-alt',
     				        items:checkboxItem
     				    });
     				}
     				
     				myItems.push({
     					 xtype: 'filefield',
     		             emptyText: panelSRO1149,
     		             buttonText: 'upload',
     		             fieldLabel:     getColName('file_itemcode'),
     		             allowBlank: true,
     		             buttonConfig: {
     		                 iconCls: 'upload-icon'
     		             }
     				 });
			    	var form = Ext.create('Ext.form.Panel', {
			    		id: 'formPanel',
			    		xtype: 'form',
		//	            closable: true,
			            frame: false ,
			            //closeAction: 'close',
			            bodyPadding: '3 3 0',
			            width: 800,
			            autoHeight: true,
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
						        	id: 'unique_id',
							       name: 'unique_id',
							       value:  selectedMoldUid
							    }),
						        new Ext.form.Hidden({
						        	id: 'Pj_uid',
						        	name: 'Pj_uid',
						        	value: selectedMoldUid
						        }),
						        new Ext.form.Hidden({
						            id: 'pj_name',
						           name: 'pj_name'
						        }),
						        new Ext.form.Hidden({
						        	id: 'order_com_unique',
						        	name: 'order_com_unique',
						        	value: order_com_unique
						        }),
						        {
							 xtype: 'fieldset',
					            title: panelSRO1045,
					            collapsible: true,
					            defaults: {
					                labelWidth: 89,
					                anchor: '100%',
					                labelAlign: 'right',
					                layout: {
					                    type: 'hbox',
					                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
					                }
					            },		            
					            items: [{
				                    xtype: 'fieldcontainer',
				                    //fieldLabel: '模房',
				                    combineErrors: false,
				                    defaults: {
				                        hideLabel: true
				                    },
				                    items: [
				                            {
						                           xtype: 'displayfield',
						                           value: sro1_old_mold
					                            },
				                            {
				                                xtype: 'textfield',
				                                anchor: '100%',
				                                value: selectedMoldCodeDash,
				                                width:110,
				                                readOnly : true,
				                                allowBlank: false,
				                                fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
				                             },
				                            {
					                           xtype: 'displayfield',
					                           value: panelSRO1198
				                            },{
					                           xtype: 'textfield',
					                           name : 'version',
					                           fieldLabel: panelSRO1172,
					                           width:         30,
					                           value: newVer,
				                                readOnly : true,
				                                fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
				                            },
				                            {
						                           xtype: 'displayfield',
						                           value: '&nbsp; '+sro1_new_mold
					                            },
				                            {
				                                xtype: 'textfield',
				                                anchor: '100%',
				                                name : 'pj_code',
				                                id : 'pj_code',
				                                width:200,
				                                value: newMoldNo,
				                                readOnly : true,
				                                allowBlank: false,
				                                fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 15px;'
				                             }]
				                    
			                	}]	            
						},{
							xtype:'fieldset',
				            title: panelSRO1002,
				            collapsible: true,
				            defaultType: 'textfield',
				            layout: 'anchor',
				            defaults: {
				                anchor: '100%'
				            },
				            items :[{
				                xtype: 'container',
				                layout:'hbox',
			            	items: [{
			            		xtype: 'container',
			                    flex: 1,
			                    border:false,
			                    layout: 'anchor',
			                    defaultType: 'textfield',
			                    defaults: { labelWidth: 90, labelAlign: 'right',  anchor:'95%'  },
			                    items: myItems
//			                    	[{
//					                fieldLabel: getColName('order_com_unique'),
//					                value: '[' + selectedWaCode + ']' + selectedWaName,
//		                            readOnly : true,
//		                            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
//			            		},{
//			            			fieldLabel: getColName('description'),
//					                value: selectedDescription,
//		                            readOnly : true,
//		                            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
//		
//			            		},{
//			                    	fieldLabel: getColName('regist_date'),
//			                    	name: 'regist_date',
//			                    	format: 'Y-m-d',
//			    			    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
//			    			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
//			                    	allowBlank: false,
//		//	                    	vtype: 'daterange',
//			                        value : new Date(),
//		//	                        endDateField: 'todate'
//			                    	xtype: 'datefield'     		
//			            		},{
//			            			fieldLabel: getColName('selling_price'),
//			            			name: 'selling_price',
//			            			allowBlank: false,
//			            			minValue:0,
//			            			xtype:  'numberfield'
//			            		},{	
//			                    	fieldLabel: getColName('resine_color'),
//			                    	name: 'resine_color',
//					                value: selectedResine_color,
//		                            readOnly : true,
//		                            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
//		
//			                    },{	
//			                    	fieldLabel: getColName('surface_art'),
//			                    	name: 'surface_art',
//					                value: selectedSurface_art,
//		                            readOnly : true,
//		                            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
//		
//			                    
//			                	},{ 
//			                		xtype:          'combo',
//			                        mode:           'local',
//			                        value:          'JS0000CN',
//			                        triggerAction:  'all',
//			                        forceSelection: true,
//			                        editable:       false,
//			                        allowBlank: false,
//			                        fieldLabel:     getColName('reserved_varchar4'),
//			                        name:           'reserved_varchar4',
//			                        displayField:   'name',
//			                        valueField:     'value',
//			                        queryMode: 'local',
//			                        store:          Ext.create('Ext.data.Store', {
//			                            fields : ['name', 'value'],
//			                            data   : [
//			                                {name : pp_firstBu,   value: 'JS0000CN'}
//			                            ]
//			                        })
//			                	},{ 
//			                		xtype:          'combo',
//			                        mode:           'local',
//			                        triggerAction:  'all',
//			                        forceSelection: true,
//			                        editable:       false,
//			                        allowBlank: false,
//			                        fieldLabel:     getColName('newmodcont'),
//			                        name:           'newmodcont',
//			                        displayField:   'name',
//			                        valueField:     'value',
//			                        queryMode: 'local',
//			                        value: 'M',
//			                        store:          Ext.create('Ext.data.Store', {
//			                            fields : ['name', 'value'],
//			                            data   : [
//			                               {name : panelSRO1201,   value: 'M'}
//			                            ]
//			                        })
//				                }]
			            	},{ //두번째 컬럼
			        		xtype: 'container',
			                flex: 1,
			                layout: 'anchor',
			                defaultType: 'textfield',
			                defaults: { labelWidth: 90, labelAlign: 'right', anchor:'95%'  },  
			        		items:[{ 
			            		    fieldLabel:    getColName('pj_type'),
					                value: selectedPjType,
		                            readOnly : true,
		                            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
			            	    },{ 
			            	    	fieldLabel:    getColName('pj_name'),
					                value: selectedPjName,
		                            readOnly : true,
		                            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
		
			                    },{	
				                	fieldLabel: getColName('delivery_plan'),
				                    name: 'delivery_plan',
				                    format: 'Y-m-d',
			    			    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
			    			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
			    			    	value: Ext.Date.add (new Date(),Ext.Date.DAY,15),
				                    allowBlank: false,
				                    xtype: 'datefield'
			                    },{ 
			                                     	fieldLabel: getColName('pm_uid'),
			                         				name : 'pm_uid',
			                         	            xtype: 'combo',
			                         	            store: userStore,
			                         	            displayField: 'user_name',
			                         	            valueField:     'unique_id',
			                         	            typeAhead: false,
		//	                 	                    editable:false,
			                 	                    allowBlank: false,
			                         	            //hideLabel: true,
			                         	            //hideTrigger:true,
			                         	            listConfig: {
			                         	                loadingText: 'Searching...',
			                         	                emptyText: 'No matching posts found.',
			                         	                getInnerTpl: function() {
			                         	                    return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
			                         	                }
			                         	            }
							       },{
			                            fieldLabel: getColName('cav_no'),
			                            name: 'cav_no',
						                value: selectedCav_no,
			                            readOnly : true,
			                            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
		
							       },{ 
				                       fieldLabel:     getColName('mold_type'),
						                value: selectedMoldType,
			                            readOnly : true,
			                            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
							       },{
					                 	xtype: 'textarea',
					                 	fieldLabel: getColName('reserved_varchar5'),
					                    hideLabel: false,
					                    name: 'reserved_varchar5'
		//			                    style: 'margin:0', // Remove default margin
		//			                    flex: 1  // Take up all *remaining* vertical space
							       },{ 
							    	   xtype: 'checkboxfield',
								       id: 'checkMold',
								       fieldLabel:     sro1_revmold,
								       checked: true,
								       listeners:{
							                  change:function(checkbox, checked){
							                	  console_log(checked);
								               	  if(checked == false){
								               		  Ext.getCmp('checkMold').setValue(false);
								               	  }else{
								               		 Ext.getCmp('checkMold').setValue(true);
								               	  }
							                  }
							           }
							       }]   
			            		}] 
			            	}]
				        }
		
				        
						]		
			    	});
		
			    	var win = Ext.create('ModalWindow', {
			            title:CMD_ADD  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
			            width: 800,
			            height: 450,//480,
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
			                    	var checkMold=Ext.getCmp('checkMold').getValue();
			                    	if(checkMold==true){
			                    		var waring =Ext.Msg.confirm('Confirm Box', sro1_comment_true, function(
				                    	         buttonText) {
			                    			if (buttonText == "yes"){
			                    				var val = form.getValues(false);
				           	                   	var projectmold = Ext.ModelManager.create(val, 'ProjectMold');
				           	                   	var pj_code = Ext.getCmp('pj_code').getValue();
				           	                   	projectmold.set('file_itemcode', vFILE_ITEM_CODE);
				           	                   	projectmold.set('checkMold', 'yes');
				           	                   	//중복 코드 체크
				           	                   	Ext.Ajax.request({
				           	                   		url: CONTEXT_PATH + '/sales/poreceipt.do?method=checkCode',				
				           	                   		params:{
				           	                   			pj_code : pj_code
				           	                   		},
				           	                   		success : function(result, request) {
				           	                   			form.submit({
				           	                   				url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +/*(G)*/vFILE_ITEM_CODE,
				           	                   				waitMsg: 'Uploading Files...',
				           	                   				success: function(fp, o) {
				           	                   					var ret = result.responseText;
				           	                   					if(ret == 0 ||  ret  == '0') {
				           	                   						//저장 수정
			           	   		   			                   		projectmold.save({
			           	   		   			                   			success : function() {
			           	   		   			                   				//console_log('updated');
			           	   		   			                   				if(win) 
			           	   		   			                   				{
			           	   		   			                   					win.close();
			           	   		   			                   					store.load(function() {});
			           	   		   			                   				} 
			           	   		   			                   			} 
			           	   		   			                   		});   
				           	   		   			                     if(win) 
				           	   		   			                     {
				           	   		   			                    	 win.close();
				           	   		   			                     }   					
				           	                   					} else {
				           	                   						Ext.MessageBox.alert('Duplicated Code', 'check ' + getColName('pj_code') + ' value.'); 
				           	                   					}
				           	                   				},
				           	                   				failure : function(){
				           	                   					console_log('failure');
				           	                   					Ext.MessageBox.alert(error_msg_prompt,'Failed');
				           	                   				}
				           	                   			});
				           	                   			console_log('requested ajax...');
				           	                   		},
				           	                   		failure: extjsUtil.failureMessage
				           	                   	}); 
			                    			}
				                    	    if (buttonText == "no"){
				                    	    	waring.close();
				                    	    }
				                    	});
			                    	}else{
			                    		Ext.Msg.confirm('Confirm Box', sro1_comment_false, function(
				                    	         buttonText) {
			                    			if (buttonText == "yes"){
			                    				var val = form.getValues(false);
				           	                   	var projectmold = Ext.ModelManager.create(val, 'ProjectMold');
				           	                   	var pj_code = Ext.getCmp('pj_code').getValue();
				           	                   	projectmold.set('file_itemcode', vFILE_ITEM_CODE);
				           	                   	projectmold.set('checkMold', 'no');
				           	                   	//중복 코드 체크
				           	                   	Ext.Ajax.request({
				           	                   		url: CONTEXT_PATH + '/sales/poreceipt.do?method=checkCode',				
				           	                   		params:{
				           	                   			pj_code : pj_code
				           	                   		},
				           	                   		success : function(result, request) {
				           	                   			form.submit({
				           	                   				url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +/*(G)*/vFILE_ITEM_CODE,
				           	                   				waitMsg: 'Uploading Files...',
				           	                   				success: function(fp, o) {
				           	                   					var ret = result.responseText;
				           	                   					if(ret == 0 ||  ret  == '0') {
				           	                   						//저장 수정
			           	   		   			                   		projectmold.save({
			           	   		   			                   			success : function() {
			           	   		   			                   				//console_log('updated');
			           	   		   			                   				if(win) 
			           	   		   			                   				{
			           	   		   			                   					win.close();
			           	   		   			                   					store.load(function() {});
			           	   		   			                   				} 
			           	   		   			                   			} 
			           	   		   			                   		});   
				           	   		   			                     if(win) 
				           	   		   			                     {
				           	   		   			                    	 win.close();
				           	   		   			                     }   					
				           	                   					} else {
				           	                   						Ext.MessageBox.alert('Duplicated Code', 'check ' + getColName('pj_code') + ' value.'); 
				           	                   					}
				           	                   				},
				           	                   				failure : function(){
				           	                   					console_log('failure');
				           	                   					Ext.MessageBox.alert(error_msg_prompt,'Failed');
				           	                   				}
				           	                   			});
				           	                   			console_log('requested ajax...');
				           	                   		},
				           	                   		failure: extjsUtil.failureMessage
				           	                   	}); 
			                    			}
				                    	    if (buttonText == "no"){
				                    	    	waring.close();
				                    	    }
				                    	});
			                    	}
			                    } else {
			                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
			                    }
			                  }//endof handler
			            },{
			                text: CMD_CANCEL,
			            	handler: function(){
			            		if(win) {
			            			win.close();
			            		}
		
			            		}
			            }]
			        });
			    	win.show();

     			},
     			failure: extjsUtil.failureMessage
     		});
	    	});
	    }//endofhandler



});

//Define Add Action - Modification Mold
var addActionVer =	 Ext.create('Ext.Action', {
	    text: sro1_revmold,//'Major Fields | Current Rows',
	    iconCls:'brick_go',
	    disabled: true,
	    handler: function(widget, event) {
	    	var selections = grid.getSelectionModel().getSelection();//pj_code: "JA13P002006B"
	    	var record = selections[0];
	    	var Pj_uid = record.get('unique_id');
	    	var pj_code = record.get('pj_code');
	    	var choice_one = pj_code.substring(1,2);
	    	var year =  pj_code.substring(2,4);
	    	var from_type = pj_code.substring(4,5);
	    	var comment = null;
        	selectedMoldCodeDash = record.get('pj_code_dash');
        	
        	wa_name = record.get('wa_name');
        	wa_code = record.get('wa_code');
        	description = record.get('description'); //제품모델번호', 'description', '机型
        	pj_name = record.get('pj_name'); //제품명', 'pj_name', '品名
        	pj_type = record.get('pj_type'); //제품유형코드', 'pj_type', '产品代码
        	mold_type = record.get('mold_type'); //'주물/소물', 'mold_type', '主件/小件
        	resine_color = record.get('resine_color');
        	surface_art = record.get('surface_art');
        	cav_no = record.get('cav_no');
        	file_itemcode = record.get('file_itemcode');
        	customer_name = record.get('customer_name');
        	selling_price = record.get('selling_price');
        	reserved_varchar4 = record.get('reserved_varchar4');
        	mold_type = record.get('mold_type');
        	
        	order_com_unique = record.get('order_com_unique');
	    	buyerStore['cmpName'] = 'order_com_unique'; //combo name
	    	
	    	var myItems = [];
	    	var attachedFileStore = Ext.create('Mplm.store.AttachedFileStore', {group_code: Pj_uid} );
	    	attachedFileStore.load(function() {
	    		myItems.push({
    				fieldLabel: getColName('order_com_unique'),
		            value: '[' + wa_code + ']' + wa_name,
		            readOnly : true,
		            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
				});
				myItems.push({
					fieldLabel: getColName('description'),
		            value: description,
		            readOnly : true,
		            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
				});
				myItems.push({
					fieldLabel: getColName('regist_date'),
		        	name: 'regist_date',
		        	format: 'Y-m-d',
			    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
		        	allowBlank: false,
		//            	vtype: 'daterange',
		            value : new Date(),
		//                endDateField: 'todate'
		        	xtype: 'datefield'     	
				});
				myItems.push({
					fieldLabel: getColName('selling_price'),
					name: 'selling_price',
					allowBlank: false,
					value: selling_price,
					minValue:0,
					xtype:  'numberfield'
				});
				myItems.push({
					fieldLabel: getColName('resine_color'),
		        	name: 'resine_color',
		            value: resine_color,
		            readOnly : true,
		            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
				});
				myItems.push({
					fieldLabel: getColName('surface_art'),
		        	name: 'surface_art',
		            value: surface_art,
		            readOnly : true,
		            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
				});
				myItems.push({
					xtype:          'combo',
		            mode:           'local',
		            value:          'JS0000CN',
		            triggerAction:  'all',
		            forceSelection: true,
		            editable:       false,
		            allowBlank: false,
		            fieldLabel:     getColName('reserved_varchar4'),
		            name:           'reserved_varchar4',
		            displayField:   'name',
		            valueField:     'value',
		            queryMode: 'local',
		            store:          Ext.create('Ext.data.Store', {
		                fields : ['name', 'value'],
		                data   : [
		                    {name : pp_firstBu,   value: 'JS0000CN'}
		                ]
		            })
				});
				myItems.push({
					xtype:          'combo',
		            mode:           'local',
		            triggerAction:  'all',
		            forceSelection: true,
		            editable:       false,
		            allowBlank: false,
		            fieldLabel:     getColName('newmodcont'),
		            name:           'newmodcont',
		            displayField:   'name',
		            valueField:     'value',
		            queryMode: 'local',
		            value: 'N',
		            store:          Ext.create('Ext.data.Store', {
		                fields : ['name', 'value'],
		                data   : [
		                   {name : panelSRO1200,   value: 'N'}
		                ]
		            })
				});
				
				var checkboxItem =[];
				attachedFileStore.each(function(record){
	    			console_log(record);
	    			console_log('----------------------------------------------');
	    			console_log(record.get('object_name'));
	    			console_log(record.get('id'));
	    			console_log(record.get('group_code'));
	    			console_log(record.get('file_path'));
	    			console_log(record.get('file_size'));
	    			console_log(record.get('fileobject_uid'));
	    			console_log(record.get('file_ext'));
	    			checkboxItem.push({
	    	          xtype: 'checkboxfield',
	    	          name: 'deleteFiles',
	    	          boxLabel: record.get('object_name') + '(' + record.get('file_size') +')',
	    	          checked: false,
	    	          inputValue: record.get('id')
	    			});
				});
				
				if(checkboxItem.length > 0) {
					myItems.push({
				        xtype: 'checkboxgroup',
				        allowBlank: true,
				        fieldLabel: 'Check to Delete',
				        //cls: 'x-check-group-alt',
				        items:checkboxItem
				    });
				}
				
				myItems.push({
					 xtype: 'filefield',
		             emptyText: panelSRO1149,
		             buttonText: 'upload',
		             fieldLabel:     getColName('file_itemcode'),
		             allowBlank: true,
		             buttonConfig: {
		                 iconCls: 'upload-icon'
		             }
				 });
	    	

 			
	    	var form = Ext.create('Ext.form.Panel', {
	    		id: 'formPanel',
	    		xtype: 'form',
//	            closable: true,
	            frame: false ,
	            //closeAction: 'close',
	            bodyPadding: '3 3 0',
	            width: 800,
	            autoHeight: true,
	            fieldDefaults: {
	                labelAlign: 'middle',
	                msgTarget: 'side'
	            },
	            defaults: {
	                anchor: '100%',
	                labelWidth: 100
	            },
				items: [/*pj_name_hidden,화면두번띄우면 에러*/
				        new Ext.form.Hidden({
				        	id: 'unique_id',
					       name: 'unique_id',
					       value:  Pj_uid
					    }),
				        new Ext.form.Hidden({
				        	id: 'Pj_uid',
				        	name: 'Pj_uid',
				        	value: Pj_uid
				        }),
				        new Ext.form.Hidden({
				        	id: 'order_com_unique',
				        	name: 'order_com_unique',
				        	value: order_com_unique
				        }),
				        {
					 xtype: 'fieldset',
			            title: panelSRO1045,
			            collapsible: true,
			            defaults: {
			                labelWidth: 89,
			                anchor: '100%',
			                labelAlign: 'right',
			                layout: {
			                    type: 'hbox',
			                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
			                }
			            },		            
			            items: [{
		                    xtype: 'fieldcontainer',
		                    //fieldLabel: '模房',
		                    combineErrors: false,
		                    defaults: {
		                        hideLabel: true
		                    },
		                    items:[{
		                                xtype: 'displayfield',
		                                value: panelSRO1195+':'
		                            },{
			                            	//the width of this field in the HBox layout is set directly
			                            //the other 2 items are given flex: 1, so will share the rest of the space
			                            width:          50,
			                            xtype:          'combo',
			                            mode:           'local',
			                            id: 			'choice_one',
			                            value:          'A',
			                            readOnly: true,
			                            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;',
			                            triggerAction:  'all',
			                            forceSelection: true,
			                            editable:       false,
			                            value: 			choice_one,
			                            name:           'choice_one',
			                            displayField:   'name',
			                            valueField:     'value',
			                            width: 70,
			                            queryMode: 'local',
			                            handler:function() {
			        						Ext.getCmp("choice_one");
			        					},
			        					listeners: {
				   	   	                    select: function (combo, record) {
				                            	var obj = Ext.getCmp('pj_code');
				                            	obj.reset();
				   	   	                    }
			        					},
			                            store:          Ext.create('Ext.data.Store', {
			                                fields : ['name', 'value'],
			                                data   : [
			                                    {name : 'A:上角',   value: 'A'},
			                                    {name : 'B:上沙',  value: 'B'},
			                                    {name : 'C:乌沙', value: 'C'}
			                                ]
			                            })
		                            },{
			                            xtype: 'displayfield',
			                            value: panelSRO1196
		                            },{
			                           name : 'year',
			                           xtype: 'numberfield',
			                           id: 	'year',
			                           value: year,
			                           readOnly: true,
			                           fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;',
			                           width: 48,
			                           value: '13',
			                           minValue:0
		                            },{
			                           xtype: 'displayfield',
			                           value: panelSRO1197
		                            },{
		                            	width: 30,
		                            	xtype: 'textfield',
			                            id:  'from_type',
			                            name:  'from_type',
			                            value: from_type,
			                            readOnly: true,
			                            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
		                            },{
			                           xtype: 'displayfield',
			                           value: panelSRO1198
		                            },{
			                           xtype: 'textfield',
			                           name : 'version',
			                           fieldLabel: panelSRO1172,
			                           width:         30,
			                           id: 	'version',
			                           value: '00',
				   	                   readOnly: true,
				   	                fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
		                            },{
			                           xtype: 'displayfield',
			                           value: panelSRO1199
		                            },{
		                                xtype:'button',
		                                text: CMD_OK,
		                                width:   40,
		                                handler : function(){
		                                	var from_type = Ext.getCmp('from_type');
		                                	if(from_type.isValid())
		            	                    {
		                                		var ChoiceOne = Ext.getCmp('choice_one').getValue();    		                        	  
		 		                        	    var Year = Ext.getCmp('year').getValue();
		 		                        	    var from_type = Ext.getCmp('from_type').getValue();
		 		                        	   
			                             	    Ext.Ajax.request({
			                             			url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastno',
			                             			params:{
			                             				ChoiceOne:ChoiceOne,
			                             				Year:Year,
			                             				from_type:from_type
			                             			},
			                             			success : function(result, request) {   
//			                             				var ChoiceOne = Ext.getCmp('choice_one').getValue();    		                        	  
//			     		                        	    var Year = Ext.getCmp('year').getValue();    		                        	  
			     		                        	    var from_type = Ext.getCmp('from_type').getValue();    		                        	  
			     		                        	    var Version = Ext.getCmp('version').getValue();    		                        	  
			                             				var result = result.responseText;
			                             				var str = result;	
			                             				var num = Number(str); 	

		                             					if(str.length==3){
		     	                        					num = '0' + num; 
		     	                        				}else if(str.length==2){
		     	                        					num = '00' + num;
		     	                        				}else if(str.length==1){
		     	                        					num = '000' + num;
		     	                        				}else{
		     	                        					num = num%10000;
		     	                        				}
		     	                        				Ext.getCmp('pj_code').setValue("J"+ChoiceOne+Year+from_type+"-"+num+"-"+Version+"A");
			                             				
			                             			},
			                             			failure: extjsUtil.failureMessage
			                             		});
		            	                    }else {
		             	                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
		             	                    }
		                                }
		                             },{
		                                xtype: 'textfield',
		                                anchor: '100%',
		                                name : 'pj_code',
		                                id : 'pj_code',
		                                width:110,
		                                readOnly : true,
		                                allowBlank: false
		                             }]
	                	}]          
				},{
					xtype:'fieldset',
		            title: panelSRO1002,
		            collapsible: true,
		            defaultType: 'textfield',
		            layout: 'anchor',
		            defaults: {
		                anchor: '100%'
		            },
		            items :[{
		                xtype: 'container',
		                layout:'hbox',
	            	items: [{
	            		xtype: 'container',
	                    flex: 1,
	                    border:false,
	                    layout: 'anchor',
	                    defaultType: 'textfield',
	                    defaults: { labelWidth: 90, labelAlign: 'right',  anchor:'95%'  },
	                    items: myItems
	                    	/*[{
	                    	fieldLabel: getColName('order_com_unique'),
	            			readOnly : true,
	            			fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;',
	            			value:  '[' + wa_code + ']' + wa_name,
	            			xtype:  'textfield'
	            		},{
	            			fieldLabel: getColName('description'),
	            			name: 'description',
	            			readOnly : true,
	            			fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;',
	            			value: description,
	            			xtype:  'textfield'
	            		},{
	                    	fieldLabel: getColName('regist_date'),
	                    	name: 'regist_date',
	                    	format: 'Y-m-d',
	    			    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
	                    	allowBlank: false,
//	                    	vtype: 'daterange',
	                        value : new Date(),
//	                        endDateField: 'todate'
	                    	xtype: 'datefield'     		
	            		},{
	            			fieldLabel: getColName('selling_price'),
	            			name: 'selling_price',
	            			allowBlank: false,
	            			minValue:0,
	            			value: selling_price,
	            			xtype:  'numberfield'
	            		},{	
	                    	fieldLabel: getColName('resine_color'),
	                    	name: 'resine_color',
	                    	fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;',
	                    	allowBlank: false,
	                    	value: resine_color,
	                    	xtype:  'textfield'
	                    },{	
	                    	fieldLabel: getColName('surface_art'),
	                    	name: 'surface_art',
	                    	value: surface_art,
	                    	fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;',
	                    	allowBlank: false,
	                    	xtype:  'textfield'  
	                    
	                	},{ 
	                		xtype:          'combo',
	                        mode:           'local',
	                        value:          'JS0000CN',
	                        triggerAction:  'all',
	                        forceSelection: true,
	                        editable:       false,
	                        allowBlank: false,
	                        fieldLabel:     getColName('reserved_varchar4'),
	                        name:           'reserved_varchar4',
	                        displayField:   'name',
	                        valueField:     'value',
	                        value: reserved_varchar4,
	                        queryMode: 'local',
	                        store:          Ext.create('Ext.data.Store', {
	                            fields : ['name', 'value'],
	                            data   : [
	                                {name : pp_firstBu,   value: 'JS0000CN'}
	                            ]
	                        })
	                	},{ 
	                		xtype: 'filefield',
	                		emptyText: panelSRO1149,
	                		fieldLabel:     getColName('file_itemcode'),
	                		buttonText: 'upload',
	                		buttonConfig: {
	                			iconCls: 'upload-icon'
	                		}
		                }]*/
	            	},{ //두번째 컬럼
	        		xtype: 'container',
	                flex: 1,
	                layout: 'anchor',
	                defaultType: 'textfield',
	                defaults: { labelWidth: 90, labelAlign: 'right', anchor:'95%'  },  
	        		items:[{ 
			        		fieldLabel: getColName('pj_type'),
		                	name: 'pj_type',
		                	readOnly : true,
		                	fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;',
		                	value: pj_type,
		                	xtype:  'textfield'
	            	    },{ 
	            	    	fieldLabel: getColName('pj_name'),
		                	name: 'pj_name',
		                	readOnly : true,
		                	fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;',
		                	value: pj_name,
		                	xtype:  'textfield'
	                    },{	
		                	fieldLabel: getColName('delivery_plan'),
		                    name: 'delivery_plan',
		                    format: 'Y-m-d',
	    			    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
	    			    	value: Ext.Date.add (new Date(),Ext.Date.DAY,15),
		                    allowBlank: false,
		                    xtype: 'datefield'
	                    },{ 
                         	fieldLabel: getColName('pm_uid'),
             				name : 'pm_uid',
             	            xtype: 'combo',
             	            store: userStore,
             	            displayField: 'user_name',
             	            valueField:     'unique_id',
             	            typeAhead: false,
     	                    allowBlank: false,
             	            listConfig: {
             	                loadingText: 'Searching...',
             	                emptyText: 'No matching posts found.',
             	                getInnerTpl: function() {
             	                    return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
             	                }
             	            }
					       },{
					    	   fieldLabel: getColName('cav_no'),
	                           name: 'cav_no',
				               value: cav_no,
	                           readOnly : true,
	                           fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
					       },{ 
					    	   fieldLabel: getColName('mold_type'),
	                           name: 'mold_type',
				               value: mold_type,
	                           readOnly : true,
	                           fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
					       },{ 
		                		xtype:          'combo',
		                        mode:           'local',
		                        triggerAction:  'all',
		                        forceSelection: true,
		                        editable:       false,
		                        readOnly : true,
		                        fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;',
		                        fieldLabel:     getColName('newmodcont'),
		                        name:           'newmodcont',
		                        displayField:   'name',
		                        valueField:     'value',
		                        queryMode: 'local',
		                        value: 'N',
		                        store:          Ext.create('Ext.data.Store', {
		                            fields : ['name', 'value'],
		                            data   : [
		                               {name : panelSRO1200,   value: 'N'}
		                            ]
		                        })
					       },{ 
					    	   xtype: 'checkboxfield',
						       id: 'checkMold',
						       fieldLabel:     sro1_revmold,
						       checked: true,
						       listeners:{
					                  change:function(checkbox, checked){
					                	  console_log(checked);
						               	  if(checked == false){
						               		  Ext.getCmp('checkMold').setValue(false);
						               	  }else{
						               		 Ext.getCmp('checkMold').setValue(true);
						               	  }
					                  }
					           }
					       }]   
	            		}] 
	            	}]
		        }

		        
				]		
	    	});
	    	

	    	var win = Ext.create('ModalWindow', {
	            title:CMD_ADD  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
	            width: 800,
	            height: 450,//480,
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
	                    	var checkMold=Ext.getCmp('checkMold').getValue();
	                    	if(checkMold==true){
	                    		var waring =Ext.Msg.confirm('Confirm Box', sro1_comment_true, function(
		                    	         buttonText) {
	                    			if (buttonText == "yes"){
	                    				var val = form.getValues(false);
		           	                   	var projectmold = Ext.ModelManager.create(val, 'ProjectMold');
		           	                   	var pj_code = Ext.getCmp('pj_code').getValue();
		           	                   	projectmold.set('file_itemcode', vFILE_ITEM_CODE);
		           	                   	projectmold.set('checkMold', 'yes');
		           	                   	//중복 코드 체크
		           	                   	Ext.Ajax.request({
		           	                   		url: CONTEXT_PATH + '/sales/poreceipt.do?method=checkCode',				
		           	                   		params:{
		           	                   			pj_code : pj_code
		           	                   		},
		           	                   		success : function(result, request) {
		           	                   			form.submit({
		           	                   				url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +/*(G)*/vFILE_ITEM_CODE,
		           	                   				waitMsg: 'Uploading Files...',
		           	                   				success: function(fp, o) {
		           	                   					var ret = result.responseText;
		           	                   					if(ret == 0 ||  ret  == '0') {
		           	                   						//저장 수정
	           	   		   			                   		projectmold.save({
	           	   		   			                   			success : function() {
	           	   		   			                   				//console_log('updated');
	           	   		   			                   				if(win) 
	           	   		   			                   				{
	           	   		   			                   					win.close();
	           	   		   			                   					store.load(function() {});
	           	   		   			                   				} 
	           	   		   			                   			} 
	           	   		   			                   		});   
		           	   		   			                     if(win) 
		           	   		   			                     {
		           	   		   			                    	 win.close();
		           	   		   			                     }   					
		           	                   					} else {
		           	                   						Ext.MessageBox.alert('Duplicated Code', 'check ' + getColName('pj_code') + ' value.'); 
		           	                   					}
		           	                   				},
		           	                   				failure : function(){
		           	                   					console_log('failure');
		           	                   					Ext.MessageBox.alert(error_msg_prompt,'Failed');
		           	                   				}
		           	                   			});
		           	                   			console_log('requested ajax...');
		           	                   		},
		           	                   		failure: extjsUtil.failureMessage
		           	                   	}); 
	                    			}
		                    	    if (buttonText == "no"){
		                    	    	waring.close();
		                    	    }
		                    	});
	                    	}else{
	                    		Ext.Msg.confirm('Confirm Box', sro1_comment_false, function(
		                    	         buttonText) {
	                    			if (buttonText == "yes"){
	                    				var val = form.getValues(false);
		           	                   	var projectmold = Ext.ModelManager.create(val, 'ProjectMold');
		           	                   	var pj_code = Ext.getCmp('pj_code').getValue();
		           	                   	projectmold.set('file_itemcode', vFILE_ITEM_CODE);
		           	                   	projectmold.set('checkMold', 'no');
		           	                   	//중복 코드 체크
		           	                   	Ext.Ajax.request({
		           	                   		url: CONTEXT_PATH + '/sales/poreceipt.do?method=checkCode',				
		           	                   		params:{
		           	                   			pj_code : pj_code
		           	                   		},
		           	                   		success : function(result, request) {
		           	                   			form.submit({
		           	                   				url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +/*(G)*/vFILE_ITEM_CODE,
		           	                   				waitMsg: 'Uploading Files...',
		           	                   				success: function(fp, o) {
		           	                   					var ret = result.responseText;
		           	                   					if(ret == 0 ||  ret  == '0') {
		           	                   						//저장 수정
	           	   		   			                   		projectmold.save({
	           	   		   			                   			success : function() {
	           	   		   			                   				//console_log('updated');
	           	   		   			                   				if(win) 
	           	   		   			                   				{
	           	   		   			                   					win.close();
	           	   		   			                   					store.load(function() {});
	           	   		   			                   				} 
	           	   		   			                   			} 
	           	   		   			                   		});   
		           	   		   			                     if(win) 
		           	   		   			                     {
		           	   		   			                    	 win.close();
		           	   		   			                     }   					
		           	                   					} else {
		           	                   						Ext.MessageBox.alert('Duplicated Code', 'check ' + getColName('pj_code') + ' value.'); 
		           	                   					}
		           	                   				},
		           	                   				failure : function(){
		           	                   					console_log('failure');
		           	                   					Ext.MessageBox.alert(error_msg_prompt,'Failed');
		           	                   				}
		           	                   			});
		           	                   			console_log('requested ajax...');
		           	                   		},
		           	                   		failure: extjsUtil.failureMessage
		           	                   	}); 
	                    			}
		                    	    if (buttonText == "no"){
		                    	    	waring.close();
		                    	    }
		                    	});
	                    	}
	                    	
	                	/*var val = form.getValues(false);
	                   	 var projectmold = Ext.ModelManager.create(val, 'ProjectMold');
	                   	 var pj_code = Ext.getCmp('pj_code').getValue();
	                   	projectmold.set('file_itemcode', vFILE_ITEM_CODE);
	                   //중복 코드 체크
	                   	Ext.Ajax.request({
	   						url: CONTEXT_PATH + '/sales/poreceipt.do?method=checkCode',				
	        				params:{
	        					pj_code : pj_code
	        				},
	   						
	        				success : function(result, request) {
	   							form.submit({
	   		                        url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +(G)vFILE_ITEM_CODE,
	   		                        waitMsg: 'Uploading Files...',
	   		                        success: function(fp, o) {
	   		                        	console_log('success');
	   		                        	var ret = result.responseText;
	   		   							if(ret == 0 ||  ret  == '0') {
	   		   							//저장 수정
	   		   			                   	projectmold.save({
	   		   			                		success : function() {
	   		   			                			//console_log('updated');
	   		   			                           	if(win) 
	   		   			                           	{
	   		   			                           		win.close();
	   		   			                           		store.load(function() {});
	   		   			                           	} 
	   		   			                		} 
	   		   			                	 });   
	   		   								
	   		   			                 if(win) 
	   		   	                       	{
	   		   	                       		win.close();
	   		   	                       	}   					
	   		   							} else {
	   		   								Ext.MessageBox.alert('Duplicated Code', 'check ' + getColName('pj_code') + ' value.'); 
	   		   							}
			                        },
			                    	failure : function(){
			                    		console_log('failure');
			                    		Ext.MessageBox.alert(error_msg_prompt,'Failed');
			                    	}
	   			                 });
	   							console_log('requested ajax...');
	   						},
	   						failure: extjsUtil.failureMessage
	   					}); */
	                    } else {
	                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
	                    	/*
	                    	      Ext.MessageBox.alert('提示', '请单击我 确定', callBack);
					               function callBack(id) {
					                   alert('单击的按钮id是：'+id);
					               }
					           });
	                    	 */
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
	    	win.show();
	    	});
			//win.show(this, function() {
	    	//button.dom.disabled = false;
//	    	});
	     }
	});
