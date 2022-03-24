/*
EPJ2 - 프로젝트 현황
*/


var grid = null;
var store = null;
var rtgapp_store = null;
var agrid = null;
var lineGap = 30;

var regist_date_check = true;
var end_date_check = true;
var delivery_plan_check = true;

var routeGubunTypeStore = Ext.create('Mplm.store.RouteGubunTypeStore', {} );
var divisionStore = Ext.create('Mplm.store.DivisionStore2', {} );
divisionStore.load();
var deptStore = null;
var userStore = null;
var memberTab = null;

var humanUnit = 'DAY';

var ahid_userlist = new Array();
var ahid_userlist_role = new Array();

var this_year = Ext.Date.format(TODAY_GLOBAL,'Y');
var Towlength_year = this_year.substring(2,4);

var combst_uid = '';

var gTabState = 'REGIST';
var selectTedProject = null;

function setTabState(state, rec) {
	gTabState = state;
	selectTedProject = rec;

	var gridquotation = Ext.getCmp('gridquotation');
	switch(state) {
		case 'REGIST':
			//Ext.getCmp('projectadd-form-panel-div').setTitle('수주 등록');
			//gridquotation.getEl().show();
			break;
		case 'MODIFY':
			//Ext.getCmp('projectadd-form-panel-div').setTitle('수주 수정');
			//gridquotation.getEl().hide();
			break;
	}
	console_log(selectTedProject);
}

function getLastPjCode() {
   Ext.Ajax.request({
		url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoCloud',
		params:{

		},
		success : function(result, request) {   	                        	  
			var result = result.responseText;
			var str = result;	//var str = '293';
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
			Ext.getCmp('pj_code').setValue("P"+num);
			add_pj_code = "P"+num;
			
		},//endofsuccess
		failure: extjsUtil.failureMessage
	});//endofajax
}


var add_user_unique_id = '';
var add_dept_code = '';
var add_dept_name = '';
var add_user_name = '';
var add_user_id = '';
var add_member_type = '';
var add_pj_code = '';


//var projectTypeStore = Ext.create('Mplm.store.ProjectTypeStore', {} );
var srchUserStore = Ext.create('Mplm.store.SrchUserStore', {hasNull:true} );
var projectNewModcontStore = Ext.create('Mplm.store.ProjectNewModcont', {} );
var cellEditing_user = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});

// Define Add Action - New Mold
function addActionNew ()
{
	            		
	if(worker_store.data.items.length==0){// 여기입니다
		Ext.MessageBox.alert('Error','프로젝트 멤버 추가해 주세요.', callBack);  
		function callBack(id){
			console_log(id);
			Ext.getCmp('prject-detail-tab').setActiveTab(4);
			return;
		}
		return;
	}
	
	
    var form = Ext.getCmp('innerTabsForm').getForm();
    if(form.isValid())
    {
    	agrid.getSelectionModel().selectAll();
    	var aselections = agrid.getSelectionModel().getSelection();
        if (aselections) {
        	for(var i=0; i< aselections.length; i++) {
        		var rec = agrid.getSelectionModel().getSelection()[i];
        		
        		ahid_userlist[i] = rec.get('usrast_unique_id');
        		ahid_userlist_role[i] = rec.get('gubun');
        		
        	}
        	Ext.getCmp('hid_userlist').setValue(ahid_userlist);
        	Ext.getCmp('hid_userlist_role').setValue(ahid_userlist_role);
        }
    	
    	var val = form.getValues(false);
       	var projectmold = Ext.ModelManager.create(val, 'ProjectMold');
     	console_log(projectmold);

     	projectmold.set('file_itemcode', vFILE_ITEM_CODE);
//    	console_log('projectmold -------------------');
//     	console_log(projectmold);
     	
     	innerTabsForm = Ext.getCmp('innerTabsForm')
     	innerTabsForm.setLoading(true);
     	
       	var pj_code = Ext.getCmp('pj_code').getValue();
       	add_pj_code = pj_code;
       //중복 코드 체크
       	Ext.Ajax.request({
			url: CONTEXT_PATH + '/sales/poreceipt.do?method=checkCode',				
			params:{
				pj_code : pj_code
			},
			
			success : function(result, request) {
               	projectmold.save({
            		success : function(result, request) {		                			
	                  	for (var i = 0; i <worker_store.data.items.length; i++)
   			          	{
   			          		var record2 = worker_store.data.items [i];
							record2.set('pj_code',add_pj_code);
		          			//저장 수정
		          			record2.save({
		          					success : function() {		
		          						innerTabsForm.setLoading(false);
		        	          			Ext.MessageBox.show({
		      		                      title:'등록완료',
		      		                      msg: '수주등록 상신이 완료되었습니다. 결재승인이 된 후 최종 등록됩니다.',
		      		                      buttons: Ext.MessageBox.OK,
		      		                      fn: okConfirm,
		      		                      icon: Ext.MessageBox.QUESTION
			      		                });
		          						
		          				}//endofsuccess
		          			});//endofsave
   			          		
   			          	}

            		}//success
            	 });//save    					
				console_log('requested ajax...');
			},//Ajax success
			failure: extjsUtil.failureMessage
		}); 
    } else {
    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
    }//if form valid
}


var pcsMemberdelete = Ext.create('Ext.Action', {
	itemId: 'removeButton',
    iconCls: 'remove',
    text: CMD_DELETE,
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: delete_msg_content,
            buttons: Ext.MessageBox.YESNO,
            fn: pcsMemberdeleteConfirm,
            //animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    }
});


function okConfirm(btn){

	   var selections = grid.getSelectionModel().getSelection();
	   if (selections) {
	       var result = MessageBox.msg('{0}', btn);
	       if(result=='yes') {
	    	   lfn_gotoHome();
	       }else{
	    	   lfn_gotoHome();
	       }

	   }
	};

function pcsMemberdeleteConfirm(btn){
    var selections = userGrid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = userGrid.getSelectionModel().getSelection()[i];
        		var unique_id = rec.get('unique_id');
        		console_log(rec);
        	}
        	userGrid.store.remove(selections);
        }

    }
};


var excel_sample = Ext.create('Ext.Action', {
	iconCls:'MSExcelTemplateX',
    text: GET_MULTILANG('dbm1_template'),
    handler: function(widget, event) {
    	window.location = CONTEXT_PATH + '/filedown.do?method=fileobject&fileobject_uid=6800000804';
    }
});

var searchBuyerStore = Ext.create('Mplm.store.cloudbuyerStore', {} );
var registBuyerStore = Ext.create('Mplm.store.cloudbuyerStore', {} );

function getBuyerPjToolbar() {
	var arrBuyerPjToolbar = [];
	
	arrBuyerPjToolbar.push(
			{
				id:'buyercombo',
		        	xtype: 'combo',
		        	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	                   mode: 'local',
	                   editable:false,
	                   //allowBlank: false,
	                   queryMode: 'remote',
	                   emptyText:'고객사',
	                   displayField:   'wa_name',
	                   valueField:     'unique_id',
	                   store: searchBuyerStore,
		                listConfig:{
		                	
		                	getInnerTpl: function(){
		                		return '<div data-qtip="{unique_id}">[{wa_code}] {wa_name}</div>';
		                	}			                	
		                },
		               triggerAction: 'all',
	 	               listeners: {
	 	                    select: function (combo, record) {
	 	                    	
	 	                    	console_log('Selected Value : ' + combo.getValue());
	 	                    	var buyeruid = record[0].get('unique_id');
	 	                    	var buyername  = record[0].get('wa_name');
	 	                    	var buyercode  = record[0].get('wa_code');
	 	                    	console_log('systemCode : ' + buyeruid 
	 	                    			+ ', codeNameEn=' + buyername
	 	                    			+ ', codeName=' + buyercode	);
	 	     
	 	        				
	 	                    	combst_uid=combo.getValue();
	 	                    	combst_name=buyername;
	 	                    	combst_code=buyercode;
	 	                    	//alert("combst_uid"+combst_uid+'/'+combst_name+'/'+combst_code);
	 	                    	
	 	                    }
	 	               }
		            }
	);
	arrBuyerPjToolbar.push('-');
	arrBuyerPjToolbar.push(
	{
          xtype: 'triggerfield',
          emptyText: '프로젝트코드',
          id: 'srch_pj_code',
      	listeners : {
          		specialkey : function(field, e) {
          		if (e.getKey() == Ext.EventObject.ENTER) {
          		}
          	}
      	},
          trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
          'onTrigger1Click': function() {
          	Ext.getCmp('srch_pj_code').setValue('');
      	}

		});
	arrBuyerPjToolbar.push('-');
	arrBuyerPjToolbar.push(
			{
		          xtype: 'triggerfield',
		          emptyText: '프로젝트명',
		          id: 'srch_pj_name',
		      	listeners : {
		          		specialkey : function(field, e) {
		          		if (e.getKey() == Ext.EventObject.ENTER) {
		          		}
		          	}
		      	},
		          trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
		          'onTrigger1Click': function() {
		          	Ext.getCmp('srch_pj_name').setValue('');
		          	//srchSingleHandler (productStore,'srchUnique_id', 'item_code', false);
//		          	productStore.getProxy().setExtraParam('item_code', Ext.getCmp('srchUnique_id').getValue());
//		          	productStore.load(function() {});
		      	}

				});
	arrBuyerPjToolbar.push('-');
	arrBuyerPjToolbar.push(
			{ 
             	//fieldLabel: getColName('pm_uid'),
				id:'srch_pm_uid',
				emptyText: getColName('pm_uid'),
 				name : 'pm_uid',
 	            xtype: 'combo',
 	            store: srchUserStore,
 	            displayField: 'user_name',
 	            valueField:     'unique_id',
 	            typeAhead: false,
                editable:false,
               // allowBlank: false,
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
		    });
	arrBuyerPjToolbar.push('-');
	arrBuyerPjToolbar.push(
			{ 
             	//fieldLabel: getColName('pm_uid'),
				id:'srch_pl_uid',
				emptyText: getColName('pl_uid'),
 				name : 'pl_uid',
 	            xtype: 'combo',
 	            store: srchUserStore,
 	            displayField: 'user_name',
 	            valueField:     'unique_id',
 	            typeAhead: false,
                editable:false,
                //allowBlank: false,
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
		    });

	
	return arrBuyerPjToolbar;
}

Ext.define('RtgAst', {
	 extend: 'Ext.data.Model',
	 fields: /*(G)*/vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
	            create: CONTEXT_PATH + '/sales/poreceipt.do?method=cloudcreateComplete'
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

var editHandler = function() {

    	var selections = grid.getSelectionModel().getSelection();
    	var rec = selections[0];
    	var pj_code = rec.get('pj_code');
		var pj_name = rec.get('pj_name');
		var unique_id = rec.get('unique_id');
		
        var win = Ext.create('ModalWindow', {
        	title: CMD_MODIFY  + ' :: ' + /* (G) */vCUR_MENU_NAME,
            width: 400,
            height: 300,
            minWidth: 250,
            minHeight: 180,
            layout: 'fit',
            plain:true,
            items: Ext.create('Ext.form.Panel', {
		        defaultType: 'textfield',
		        border: false,
		        bodyPadding: 15,
		        id : 'formPanel',
	            defaults: {
	                anchor: '100%',
	                allowBlank: false,
	                msgTarget: 'side',
	                labelWidth: 100
	            },
		        items: [{
                            xtype: 'textfield',
                            flex : 1,
                            name : 'unique_id',
                            readOnly : true,
                            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
                            value:unique_id,
                            fieldLabel: 'UID'
                        },{
                            xtype: 'textfield',
                            flex : 1,
                            name : 'pj_code',
                            readOnly : true,
                            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
                            value:pj_code,
                            fieldLabel: getColName('pj_code')
                        },
                        {
                            xtype: 'textfield',
                            flex : 1,
                            name : 'pj_name',
                            value:pj_name,
                            fieldLabel: getColName('pj_name')
                        }
                        
                        ]
            }),
            buttons: [{
                text: CMD_OK,
            	handler: function(){
                    var form = Ext.getCmp('formPanel').getForm();
                    if(form.isValid())
                    {
                	var val = form.getValues(false);
                	       //중복 코드 체크
       	Ext.Ajax.request({
			url: CONTEXT_PATH + '/sales/poreceipt.do?method=changePjName',				
			params:{
				pj_name : val['pj_name'],
				unique_id: val['unique_id']
			},
			
			success : function(result, request) {
  					store.load();
			},//Ajax success
			failure: extjsUtil.failureMessage
		}); 
                	
                       	if(win) 
                       	{
                       		win.close();
                       		// lfn_gotoHome();
                       	} 
                    } else {
                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                    }
                  }
            },{
                text: CMD_CANCEL,
            	handler: function(){
            		if(win) {
            			win.close();}
            			// lfn_gotoHome();
            		}
            }]
        });
        win.show();

};

var editAction = Ext.create('Ext.Action', {
	itemId: 'editButton',
    iconCls: 'pencil',
    text: edit_text,
    disabled: true ,
    handler: editHandler
});

var unique_id = new Array();


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

function simpleProperty(record, fields) {
	console_log('simpleProperty');
	console_log(record);
	var source = {};
	var propertyNames = {};
	var sourceD = {};
	var propertyNamesD = {};
	var sourceP = {};
	var propertyNamesP = {};
	
	//console_log(/*(G)*/vCENTER_FIELDS)
	if(fields==null) {
		fields = vCENTER_FIELDS;
	};
	
	Ext.each(/*(G)*/fields, function(column, index) {
		//console_log(index);
		var columnName = column['text'];
		var dataIndex = column['name'];
		var sortable = column['sort'];
		if(
			     dataIndex != 'srch_type' 
			&& dataIndex != 'file_itemcode'
			&& dataIndex != 'htmlFileNames'
			&& dataIndex != 'fileQty'
			&& dataIndex != 'htmlUser_type'
				&& (dataIndex != 'board_name') //예외
				&& (dataIndex != 'board_content')//예외
		) {
			if(dataIndex == 'regist_date' || 
					dataIndex == 'delivery_plan' ||
					dataIndex == 'start_plan' ||
					dataIndex == 'reserved_timestamp1' ||
					dataIndex == 'end_plan' ||
					dataIndex == 'end_date' ||
//					dataIndex == 'start_date' ||
					dataIndex == 'delivery_date'
				){

//				if(dataIndex == 'dataIndex'){
					//console_log('columnName:dataIndex=' + columnName + ":" + dataIndex);
					var columnValue = 'not-found';
					//try {
						columnValue = record.get(dataIndex);
					//} catch(e){ console_log(e); }
					//console_log('columnValue='+columnValue);
					if(columnValue=='1111/11/11'){
						columnValue = '';
					}
					sourceD[dataIndex] = columnValue;
					propertyNamesD[dataIndex] = columnName;

			
			}
			
			
			if(dataIndex == 'selling_price' || 
					dataIndex == 'reserved_double1' ||
					dataIndex == 'human_plan' ||
					dataIndex == 'total_mhplan' ||
					dataIndex == 'total_resource' ||
					dataIndex == 'left_mh' ||
					dataIndex == 'purchase_plan' ||
					dataIndex == 'purchase_cost' ||
					dataIndex == 'left_cost' ||
					dataIndex == 'human_cost' ||
					dataIndex == 'reserved_double3' ||
					dataIndex == 'reserved_double5' ||
					dataIndex == 'total_cost'
				){

//				if(dataIndex == 'dataIndex'){
					//console_log('columnName:dataIndex=' + columnName + ":" + dataIndex);
					var columnValue = 'not-found';
					//try {
						columnValue = record.get(dataIndex);
					//} catch(e){ console_log(e); }
					//console_log('columnValue='+columnValue);

					sourceP[dataIndex] = columnValue;
					if(dataIndex=='reserved_double3'){
						sourceP[dataIndex] = columnValue+'%';
					}
					propertyNamesP[dataIndex] = columnName;
					

			}
			if(dataIndex == 'order_com_unique' || 
					dataIndex == 'creator' ||
					dataIndex == 'create_date' ||
					dataIndex == 'changer' ||
					dataIndex == 'change_date' ||
					dataIndex == 'pj_code_dash' ||
					dataIndex == 'description' ||
					dataIndex == 'pj_name' ||
					dataIndex == 'pj_type' ||
					dataIndex == 'pl_id' ||
					dataIndex == 'reserved_varchar2' ||
					dataIndex == 'pm_name' ||
					dataIndex == 'pl_name' ||
					dataIndex == 'reserved_varchar3' ||
					dataIndex == 'wa_code' ||
					dataIndex == 'wa_name' ||
					dataIndex == 'is_complished' ||
					dataIndex == 'newmodcont'
				){
					var columnValue = 'not-found';
						columnValue = record.get(dataIndex);

					source[dataIndex] = columnValue;
					propertyNames[dataIndex] = columnName;

					
					if(dataIndex=='unique_id') {
						vSELECTED_UNIQUE_ID = columnValue;

					}
				}
		}

	});


   var propGrid = Ext.create('Ext.grid.property.Grid', {
	   title: '기본정보',
       propertyNames: propertyNames,
       source: source
   });
   var propGridD = Ext.create('Ext.grid.property.Grid', {
	   title: '일정현황',
	   propertyNames: propertyNamesD,
	   source: sourceD
   });
   var propGridP = Ext.create('Ext.grid.property.Grid', {
	   title: '정산현황',
	   propertyNames: propertyNamesP,
	   source: sourceP
   });
   
	var myTab =  Ext.widget('tabpanel', {
	    layout:'border',
	    layoutConfig: {columns: 3, rows:1},
	    items: [propGrid, propGridP, propGridD]
	});
	
	var ptarget = Ext.getCmp('mainview-property-panel-div');
	ptarget.setDisabled(false);
	ptarget.removeAll();
	ptarget.add(myTab);
	ptarget.doLayout();
	

    var w = Ext.getCmp("mainview-property-panel");
    w.expand();
    w.setActiveTab(ptarget);
}


function simplecollapseProperty() {
    //Property를 가린다.
    var w = Ext.getCmp("mainview-property-panel");

//    //Ext.get('mainview-property-panel').set({tabIndex:0});
//    setActiveTabByTitle('mainview-property-panel-div');
//    Ext.get('propertyDiv').update('Not Selected.');
    w.collapse();
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
};

var removeRtgapp = Ext.create('Ext.Action', {
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
        handler: function(agrid, rowIndex, colIndex) {

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







var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchToolBarTap
});


//Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [  removeAction, editAction  ]
});

var searchField = 
	[
		'unique_id',
		'pj_code',
		'pj_name'
		];
var fieldHuman = [];
var columnHuman = [];
var tooltipHuman = [];

Ext.onReady(function() {  
	deptStore = Ext.create('Mplm.store.DeptStore', {hasNull: false} );
    userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
    var pjMemberTypeStore = Ext.create('Mplm.store.PjMemberTypeStore', {hasNull: false} );
	console_log('now starting...');
	
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
	rtgapp_store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'RtgApp'});
	
	Ext.define('PjMember', {
		extend: 'Ext.data.Model',
		fields: [
		         {name: 'unique_id', type: "string"}
		         ,{name: 'user_unique_id', type: "string"}
		         ,{name: 'user_id', type: "string"}
		         ,{name: 'user_name', type: "string"}
		         ,{name: 'dept_name', type: "string"}
		         ,{name: 'dept_code', type: "string"}
		         ,{name: 'pj_code', type: "string"}
		         ,{name: 'role_type', type: "string"}
		],
		proxy: {
			type: 'ajax',
			api: {
				read: CONTEXT_PATH + '/production/schdule.do?method=readPjMember', /*1recoed, search by cond, search */
				create: CONTEXT_PATH + '/production/schdule.do?method=createPJMemeberCLD',
				destroy: CONTEXT_PATH + '/production/schdule.do?method=pjdestroy'
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
	
	
	worker_store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'PjMember',
		sorters: [{
			property: 'create_date',
			direction: 'ASC'
		}]
	});
	
	
	LoadJs('/js/util/buyerStore.js');
	LoadJs('/js/util/itemStore.js');

	IsComplishedStore  = Ext.create('Mplm.store.IsComplishedStore', {hasNull: false} );
	searchField.push(
	{
		type:'combo',
		field_id :'order_com_unique',
        store: 'BuyerStore',
        displayField:   'wa_name',
        valueField:     'unique_id',
        innerTpl	: '<div data-qtip="{unique_id}">[{wa_code}] {wa_name}</div>',
        listeners: {
        	select: function (combo, record) {
        		combst_uid = record[0].get('unique_id');
        	}
        }
	});

	
	makeSrchToolbar(searchField);
	console_log('makeSrchToolbar OK');
	

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
	
	//ProjectMold Store 정의
	Ext.define('ProjectMold', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/sales/poreceipt.do?method=cloudread&menu_code=EPJ2', /*1recoed, search by cond, search */
//    				create: CONTEXT_PATH + '/sales/poreceipt.do?method=create', /*create record, update*/
		            create: CONTEXT_PATH + '/sales/poreceipt.do?method=cloudcreateroute', 
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
	
 	store.load(function() {

 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );

 		var tabProjectDetail = Ext.widget({
        //title: 'Inner Tabs',
        xtype: 'form',
        id: 'innerTabsForm',
        collapsible: false,
        border: false,
        bodyPadding: 5,
        width: 700,
        fieldDefaults: {
            labelAlign: 'middle',
            msgTarget: 'side'
        },
        defaults: {
            anchor: '100%',
            width: 270
        },
        items: [
        {
            xtype: 'container',
            layout:'hbox',
            items:[  	
            {
                xtype: 'container',
                width: '50%',
                margin: '10 10 0 20',
                border:true,
                layout: 'anchor',
                defaultType: 'textfield',
                defaults: {
                    width: 300
                },
                items: [
                
        	        {
                 	   xtype: 'container',
                       layout: 'hbox',
//                       margin: '5 5 5 0',
                    	items: [{//프로젝트코드
                    		xtype: 'textfield',
                    		labelWidth: 90, 
//                    		labelAlign: 'right',
                    		flex:3,
//                    		anchor:'95%',
                			fieldLabel: getColName('pj_code'),
                			name: 'pj_code',
                			id:'pj_code',
                            //readOnly : true,
                            allowBlank: false//,
                            //fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
                            //readOnly : true,
//                            value: description,
                            //fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
                		},{
                       xtype:'button',
                       text: '중복'+CMD_CONFIRM,
                       flex:1,
                       handler : function(){
                       		//마지막코드 가져오기
                       		//getLastPjCode();
                    	   var pj_code = Ext.getCmp('pj_code').getValue();
                          	
                           //중복 코드 체크
                           	Ext.Ajax.request({
                    			url: CONTEXT_PATH + '/sales/poreceipt.do?method=checkCode',				
                    			params:{
                    				pj_code : pj_code
                    			},
                    			
                    			success : function(result, request) {
                    				var resultText = result.responseText;
                    				if(resultText=='0') {
                    					Ext.MessageBox.alert('정상', '사용가능합니다.');
                    					//alert('사용가능합니다.');
                    				}else {
                    					Ext.MessageBox.alert('사용불가', '이미 사용중인 코드입니다.');
                    					//alert('코드를 확인하세요.');
                    				}
                    				//console_log('resultText', resultText);
            
                    			},//Ajax success
                    			failure: extjsUtil.failureMessage
                    		}); 
                       }//endofhandler
                    }//endofbutton
                    ]
                  }//endof hboxcontainer for pjcode
                ,{
                        fieldLabel: getColName('newmodcont'),
                        name: 'newmodcont',
                        id: 'newmodcont',
         	            xtype: 'combo',
         	            store: projectNewModcontStore,
         	            labelWidth: 90, 
                        displayField:   'codeName',
                        valueField:     'systemCode',
         	            fiex:1,
         	            typeAhead: false,
         	            editable:       false,
                        allowBlank: false,
        	            listConfig:{
        		                	getInnerTpl: function(){
        		                		return '<div data-qtip="{systemCode}">[{systemCode}]{codeName}</divsystemCode>';
        		                	}	
        	                }
		                    ,listeners: {
		 	                    select: function (combo, record) {
		 	                    	console_log('Selected Value : ' + combo.getValue());
		 	                    	var systemCode = record[0].get('systemCode');
    	 	                    	var codeNameEn  = record[0].get('codeNameEn');
    	 	                    	var codeName  = record[0].get('codeName');
    	 	                    	
    	 	                    	console_log('systemCode : ' + systemCode 
    	 	                    			+ ', codeNameEn=' + codeNameEn
    	 	                    			+ ', codeName=' + codeName	);
    	 	                    	
    	 	                    	var oNewmodcont = Ext.getCmp('newmodcont');
    	 	                    	var oSelfdevelopment = Ext.getCmp('selfdevelopment');
    	 	                    	
    	 	                    	if(systemCode == 'P') {
    	 	                    		oNewmodcont.setDisabled(false);
    	 	                    		oSelfdevelopment.setDisabled(true);
    	 	                    	}else if(systemCode == 'R'){
    	 	                    		oNewmodcont.setDisabled(true);
    	 	                    		oSelfdevelopment.setDisabled(false);
    	 	                    	}
		 	                    	
		 	                    	
		 	                    }//endofselect
		 	               }//endoflisteners
        	        }//endofnewmodcont
                ,{
                    	fieldLabel: getColName('regist_date'),
                    	name: 'regist_date',
                    	labelWidth: 90,
                    	format: 'Y-m-d',
    			    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                    	allowBlank: false,
//                    	vtype: 'daterange',
                        value : new Date(),
//                        endDateField: 'todate'
                    	xtype: 'datefield'     		
            		}, 
            		{// 제작댓수
            			fieldLabel: getColName('quan'),
            			name: 'quan',
            			id: 'quan',
            			allowBlank: false,
            			editable:true,
            			minValue:1,
            			labelWidth: 90,
            			xtype:  'numberfield',
            			useThousandSeparator: true,
            			baseChars: '0123456789,.' ,
            			thousandSeparator:',',
            			value: 1
            			
            		}
                ]
            },//endofcontainer
            
             {
                xtype: 'container',
                border:false,
                layout: 'anchor',
                width: '50%',
                margin: '10 10 0 20',
                defaultType: 'textfield',
                defaults: {
                    width: 300
                },
                items: [
                new Ext.form.Hidden({
        		    	id: 'wa_code',
         		       name: 'wa_code'
         		    }),
         		    new Ext.form.Hidden({
         		    	id: 'wa_name',
         		    	name: 'wa_name'
         		    }),
         		   new Ext.form.Hidden({
         			   id: 'order_com_unique',
        		       name: 'order_com_unique'
        		       //value: gate_name
        		    })
        		    ,
         		   new Ext.form.Hidden({
         			   id: 'irrigate_name',
        		       name: 'irrigate_name'
        		       //value: gate_name
        		    })
        		    ,
         		   new Ext.form.Hidden({
         			   id: 'pj_type',
        		       name: 'pj_type',
        		       value: 'P'
        		    })
        		    ,
        		    
         		    {//고객사
                    	   fieldLabel: getColName('order_com_unique'),
                    	   id:'buyer_name',
                    	   xtype: 'combo',
                    	   fieldStyle: 'background-color: #FBF8E6; background-image: none;',
    	                   mode: 'local',
    	                   editable:false,
    	                   allowBlank: false,
    	                   queryMode: 'remote',
    	                   emptyText:'고객사',
    	                   displayField:   'wa_name',
    	                   valueField:     'wa_name',
    	                   labelWidth: 90,
    	                   store: registBuyerStore,
    		                listConfig:{
    		                	getInnerTpl: function(){
    		                		return '<div data-qtip="{unique_id}">[{wa_code}] {wa_name}</div>';
    		                	}			                	
    		                },
    		               triggerAction: 'all',
    	 	               listeners: {
    	 	                    select: function (combo, record) {
    	 	                    	console_log('seleced');
    	 	                    	console_log(record);
    	 	                    	console_log('Selected Value : ' + combo.getValue());
    	 	                    	var buyeruid = record[0].get('unique_id');
    	 	                    	var buyername  = record[0].get('wa_name');
    	 	                    	var buyercode  = record[0].get('wa_code');
    	 	                    	console_log('systemCode : ' + buyeruid 
    	 	                    			+ ', codeNameEn=' + buyername
    	 	                    			+ ', codeName=' + buyercode	);
    	 	                    	Ext.getCmp('wa_code').setValue(buyercode);
    	 	                    	Ext.getCmp('wa_name').setValue(buyername);
    	 	                    	Ext.getCmp('order_com_unique').setValue(buyeruid);
    	 	                    	//alert("combst_uid"+combst_uid+'/'+combst_name+'/'+combst_code);
    	 	                    	
    	 	                    }
    	 	               }
    		         }//endofbuyer
    		        ,{ xtype: 'textfield',
            	    	fieldLabel:    getColName('pj_name'),
            	    	id:          'pj_name',
            		    name:          'pj_name',
            		    //margin: '0 0 0 20',
            		    labelWidth: 90,
            		    allowBlank: false
                    }//endof pjname
//                    ,{
//                        fieldLabel: getColName('selfdevelopment'),
//                        name: 'selfdevelopment',
//                        id: 'selfdevelopment',
//         	            xtype: 'combo',
//         	           labelWidth: 90,
//         	            store: projectTypeStore,
//         	           //margin: '0 0 5 60',
//                        displayField:   'codeName',
//                        valueField:     'systemCode',
//         	            typeAhead: false,
//                         allowBlank: false,
//        	                listConfig:{
//        		                	getInnerTpl: function(){
//        		                		return '<div data-qtip="{systemCode}">[{systemCode}]{codeName}</divsystemCode>';
//        		                	}	
//        	                }
//        	        }//endofselfdevelopment
        	        ,{
            			fieldLabel: getColName('selling_price'),
            			name: 'selling_price',
            			id: 'selling_price',
            			allowBlank: false,
            			editable:true,
            			minValue:0,
            			labelWidth: 90,
            			xtype:  'numberfield',
            			useThousandSeparator: true,
            			baseChars: '0123456789,.' ,
            			thousandSeparator:','
            		}//endof수주금액
        	        ,new Ext.form.Hidden({ id: 'CRFORM_reserved_number8',	name: 'reserved_number8' }),//사업부 UID
	            	,{
	                    fieldLabel: getColName('reserved_varchar8'),
	                    name: 'reserved_varchar8',
	     	            xtype: 'combo',
	     	            flex : 1,
	     	            store: divisionStore,
	                    displayField:   'division_name',
	                    valueField:     'division_code',
	     	            typeAhead: false,
	     	           labelWidth: 90,
	                    allowBlank: false,
	    	                listConfig:{
	    		                	getInnerTpl: function(){
	    		                		return '<div data-qtip="{unique_id}">[{division_code}]{division_name}</div>';
	    		                	}	
	    	                }
		                    ,listeners: {
		 	                    select: function (combo, record) {
	
		 	                    	var reserved_number8 = record[0].get('unique_id');
		 	                    	Ext.getCmp('CRFORM_reserved_number8').setValue(reserved_number8);   
		 	                    	
		 	                    }
		 	               }
	    	        }//endof division combo
            		
                ]
            }//endofcontainer
            ]}

        ,{ 
    			xtype: 'textarea',
    			margin: '5 20 0 15',
    			width: 600,
    	    	fieldLabel:    '*'+getColName('description'),
    	    	id:          'description',
    		    name:          'description',
    		    rows: 6,
				labelAlign: 'top',
    		    allowBlank: true
			}
			
		,new Ext.form.Hidden({ id: 'hid_userlist_role',	name: 'hid_userlist_role'   }),
		new Ext.form.Hidden({ id: 'hid_userlist',	  	name: 'hid_userlist'	    }),
		new Ext.form.Hidden({ id: 'unique_id',    		name: 'unique_id',    		value: unique_id  }),
		new Ext.form.Hidden({ id: 'req_date',    		name: 'req_date'			}),
		new Ext.form.Hidden({ id: 'reserved_number1',   	name: 'reserved_number1'   		}),//견적번호
		new Ext.form.Hidden({ id: 'supplier_uid',   	name: 'supplier_uid'   		}),
		new Ext.form.Hidden({ id: 'supplier_name', 		name: 'supplier_name'		})
		,{
			id: 'prject-detail-tab',
            xtype:'tabpanel',
            plain:true,
            activeTab: 0,
            height:200,
            margin: '15 20 0 15',
            tabPosition: 'top',
            defaults:{
                bodyPadding: 0
            },
            items:[{
                title:'일정계획',
                defaults: {
                   //width: 250
                },
                defaultType: 'textfield',
				width: 560,
                items: [
		{
            xtype: 'container',
            layout:'hbox',
            items:[  	
            {
                xtype: 'container',
                defaults: {
                    width: 270,
                    labelWidth: 120
                },
                margin: '10 10 10 10',
                border:true,
                layout: 'anchor',
                defaultType: 'textfield',
                items: [
                	{
                    	fieldLabel: getColName('start_plan'),
                    	name: 'start_plan',
                    	id: 'start_plan',
                    	format: 'Y-m-d',
    			    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                    	allowBlank: false,
//	                    	vtype: 'daterange',
                        value : new Date(),
//	                        endDateField: 'todate'
                    	xtype: 'datefield',
				    	listeners: {
			                 select: function () {
			                	var start_plan_date = Ext.getCmp('start_plan').getValue();
			                	var reserved_timestamp8_date = Ext.getCmp('reserved_timestamp8').getValue();
			                	var totalarr = [];
				                var totaldate = reserved_timestamp8_date - start_plan_date;
				                totaldate = totaldate/3600000/24+1 +'';
				                totalarr = totaldate.split('.');
				               	console_log('Now today : ' + reserved_timestamp8_date + '+'+start_plan_date);
				               	Ext.getCmp('reserved_double7').setValue(totalarr[0]);
			                 }
				    	}
	            		},{
	                    	fieldLabel: getColName('reserved_timestamp1'),
	                    	name: 'reserved_timestamp1',
	                    	id:'reserved_timestamp1',
	                    	format: 'Y-m-d',
	    			    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
	                    	allowBlank: false,
//	                    	vtype: 'daterange',
	                        value : new Date(),
//	                        endDateField: 'todate'
	                    	xtype: 'datefield'     		
	            		},{
	                    	fieldLabel: getColName('end_plan'),
	                    	name: 'end_plan',
	                    	id: 'end_plan',
	                    	format: 'Y-m-d',
	    			    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
	                    	allowBlank: false,
//	                    	vtype: 'daterange',
	                        value : new Date(),
//	                        endDateField: 'todate'
	                    	xtype: 'datefield'     		
	            		},{
	                    	fieldLabel: getColName('reserved_timestamp4'),
	                    	name: 'reserved_timestamp4',
	                    	id: 'reserved_timestamp4',
	                    	format: 'Y-m-d',
	    			    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
	                    	allowBlank: false,
//	                    	vtype: 'daterange',
	                        value : new Date(),
//	                        endDateField: 'todate'
	                    	xtype: 'datefield'     		
	            		},{
	                    	fieldLabel: getColName('reserved_timestamp5'),
	                    	name: 'reserved_timestamp5',
	                    	id: 'reserved_timestamp5',
	                    	format: 'Y-m-d',
	    			    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
	                    	allowBlank: false,
//	                    	vtype: 'daterange',
	                        value : new Date(),
//	                        endDateField: 'todate'
	                    	xtype: 'datefield'     		
	            		},{
	                    	fieldLabel: getColName('delivery_plan'),
	                    	name: 'delivery_plan',
	                    	id: 'delivery_plan',
	                    	format: 'Y-m-d',
	    			    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
	                    	allowBlank: false,
//	                    	vtype: 'daterange',
	                        value : new Date(),
//	                        endDateField: 'todate'
	                    	xtype: 'datefield'     		
	            		}
            		]//endofcontainer
            		}
            		,{
                xtype: 'container',
                defaults: {
                    width: 300,
                    labelWidth: 140
                },
                margin: '10 10 10 10',
                border:true,
                layout: 'anchor',
                defaultType: 'textfield',
                items: [
                
                {
	                    	fieldLabel: getColName('reserved_timestamp7'),
	                    	name: 'reserved_timestamp7',
	                    	id: 'reserved_timestamp7',
	                    	format: 'Y-m-d',
	    			    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
	                    	allowBlank: false,
//	                    	vtype: 'daterange',
	                        value : new Date(),
//	                        endDateField: 'todate'
	                    	xtype: 'datefield'     		
	            		},{
	                    	fieldLabel: getColName('reserved_timestamp8'),
	                    	name: 'reserved_timestamp8',
	                    	id: 'reserved_timestamp8',
	                    	format: 'Y-m-d',
	    			    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    			    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
	                    	allowBlank: false,
//	                    	vtype: 'daterange',
	                        value : new Date(),
//	                        endDateField: 'todate'
	                    	xtype: 'datefield',
  					    	listeners: {
				                 select: function () {
					                	var start_plan_date = Ext.getCmp('start_plan').getValue();
					                	var reserved_timestamp8_date = Ext.getCmp('reserved_timestamp8').getValue();
					                	var totalarr = [];
						                var totaldate = reserved_timestamp8_date - start_plan_date;
						                totaldate = totaldate/3600000/24+1 +'';
						                totalarr = totaldate.split('.');
						               	console_log('Now today : ' + reserved_timestamp8_date + '+'+start_plan_date);
						               	Ext.getCmp('reserved_double7').setValue(totalarr[0]);
				                	
				                 }
 					    	}
	            		},{
	                    	fieldLabel: getColName('reserved_double7'),
	                    	name: 'reserved_double7',
	                    	id: 'reserved_double7',
	                    	readOnly : true,
	                    	value:1
	                    	,fieldStyle : 'background-color: #EAEAEA; background-image: none; text-align:right;'
	            		}
                ]
            		}
            	]}
                ]
            },{
                title:'원가계획',
                defaults: {
                    //width: 230
                },
                defaultType: 'textfield',
				width: 560,
                items: [
                		
          {
            xtype: 'container',
            layout:'hbox',
            items:[  	
            {
                xtype: 'container',
                defaults: {
                	 labelWidth: 120,
                  width: 260
                },
                margin: '10 10 10 10',
                border:true,
                layout: 'anchor',
                defaultType: 'textfield',
                items: [  			
              			{
	            			fieldLabel: getColName('reserved_double1'),
	           				name: 'reserved_double1',
	            			id: 'reserved_double1',
	            			allowBlank: false,
	            			minValue:0,
//	            			value:0,
	            			editable:true,
	            			xtype:  'numberfield',
	            			useThousandSeparator: true,
	            			baseChars: '0123456789,.' ,
	            			thousandSeparator:',',
	            			listeners: {
	            				specialkey: function(f,e){					                     
	            					if (e.getKey() == e.ENTER) {		

	            						var cost = '';							           					                   
//	            						cost = Ext.getCmp('reserved_double1').getValue();							         
//	            						cost = cost*25000*8;								    
//	            						Ext.getCmp('reserved_double8').setValue(cost);
	            						if(humanUnit == 'DAY') {
		            						cost = Ext.getCmp('reserved_double1').getValue();							         
		            						cost = cost*25000*8;							    
		            						Ext.getCmp('reserved_double8').setValue(cost);
		            						}else{
		            							cost = Ext.getCmp('reserved_double1').getValue();							         
			            						cost = cost*25000;							    
			            						Ext.getCmp('reserved_double8').setValue(cost);
		            						}
	            					}					                    
	            				} ,
	            				 change : function (f, e){

	            						var cost = '';							           					                   
//	            						cost = Ext.getCmp('reserved_double1').getValue();							         
//	            						cost = cost*25000*8;						    
//	            						Ext.getCmp('reserved_double8').setValue(cost);	
	            						if(humanUnit == 'DAY') {
		            						cost = Ext.getCmp('reserved_double1').getValue();							         
		            						cost = cost*25000*8;							    
		            						Ext.getCmp('reserved_double8').setValue(cost);
		            						}else{
		            							cost = Ext.getCmp('reserved_double1').getValue();							         
			            						cost = cost*25000;							    
			            						Ext.getCmp('reserved_double8').setValue(cost);
		            						}
						        }
					    	}
	            		},{
	            			fieldLabel: getColName('human_plan'),
	           				name: 'human_plan',
	            			id: 'human_plan',
	            			allowBlank: false,
	            			minValue:0,
//	            			value:0,
	            			editable:true,
	            			currencySymbol: null,
	            			useThousandSeparator: true,
							thousandSeparator: ',',
							alwaysDisplayDecimals: false,
							fieldStyle: 'text-align: right;',
	            			xtype:  'numberfield',
	            			baseChars: '0123456789,.' ,
	            			listeners: {
	            				specialkey: function(f,e){					                     
	            					if (e.getKey() == e.ENTER) {		

	            						var cost = '';							           					                   
//	            						cost = Ext.getCmp('human_plan').getValue();							         
//	            						cost = cost*25000*8;							    
//	            						Ext.getCmp('reserved_double9').setValue(cost);
	            						if(humanUnit == 'DAY') {
		            						cost = Ext.getCmp('human_plan').getValue();							         
		            						cost = cost*25000*8;							    
		            						Ext.getCmp('reserved_double9').setValue(cost);
		            						}else{
		            							cost = Ext.getCmp('human_plan').getValue();							         
			            						cost = cost*25000;							    
			            						Ext.getCmp('reserved_double9').setValue(cost);
		            						}
	            					}					                    r
	            				},
	            				change : function (f, e){
	            						var cost = '';

//	            						cost = Ext.getCmp('human_plan').getValue();							         
//	            						cost = cost*25000*8;							    
//	            						Ext.getCmp('reserved_double9').setValue(cost);
	            						if(humanUnit == 'DAY') {
		            						cost = Ext.getCmp('human_plan').getValue();							         
		            						cost = cost*25000*8;							    
		            						Ext.getCmp('reserved_double9').setValue(cost);
		            						}else{
		            							cost = Ext.getCmp('human_plan').getValue();							         
			            						cost = cost*25000;							    
			            						Ext.getCmp('reserved_double9').setValue(cost);
		            						}
	            				}
					    	}
	            		},{
	            			fieldLabel: '인건비 기준',
	            			id: 'labelHumanUnit',
				        	value: '', //'￦25,000/H',
				        	fieldStyle : 'background-color: #FFFFFF; background-image: none;text-align:left;border:#FFFFFF'
				        }
				   ]}
              ,
            {
                xtype: 'container',
                defaults: {
                   width: 300
                },
                margin: '10 10 10 10',
                border:true,
                layout: 'anchor',
                defaultType: 'textfield',
                items: [
                	{
                			xtype:  'numberfield',
	                    	fieldLabel: getColName('reserved_double8'),
	                    	name: 'reserved_double8',
	                    	id: 'reserved_double8',
	                    	readOnly : true,
	                    	allowBlank: false,
	    					fieldStyle : 'background-color: #EAEAEA; background-image: none;text-align:right;'
	            		},{
	            			xtype:  'numberfield',
	                    	fieldLabel: getColName('reserved_double9'),
	                    	name: 'reserved_double9',
	                    	id: 'reserved_double9',
	                    	readOnly : true,
	                    	allowBlank: false,
	    					fieldStyle : 'background-color: #EAEAEA; background-image: none;text-align:right;'
	            		},

                	{
	            			fieldLabel: getColName('purchase_plan'),
	           				name: 'purchase_plan',
	            			id: 'purchase_plan',
	            			allowBlank: false,
	            			minValue:0,
//	            			value:0,
	            			editable:true,
	            			xtype:  'numberfield',
	            			useThousandSeparator: true,
	            			baseChars: '0123456789,.' ,
	            			thousandSeparator:','
	            		}

	            		,{
	            			fieldLabel: getColName('reserved_doublec'),
	           				name: 'reserved_doublec',
	            			id: 'reserved_doublec',
	            			allowBlank: false,
	            			minValue:0,
//	            			value:0,
	            			editable:true,
	            			xtype:  'numberfield',
	            			useThousandSeparator: true,
	            			baseChars: '0123456789,.' ,
	            			thousandSeparator:','
	            		},{
	            			fieldLabel: getColName('reserved_doubled'),
	           				name: 'reserved_doubled',
	            			id: 'reserved_doubled',
	            			allowBlank: false,
	            			minValue:0,
//	            			value:0,
	            			editable:true,
	            			xtype:  'numberfield',
	            			useThousandSeparator: true,
	            			fieldStyle: 'text-align: right;',
	            			decimalPrecision: 0
	            		}

              ]
            }
]}
              
				]
            },{
                cls: 'x-plain',
                title: '첨부파일',
                 margin: '0 0 0 0',
                layout: 'anchor',
                   defaults: {
                   width: 500
                },
                items: [
                    {
						id : 'tempport2',
						 margin: '0 0 0 0',
						//region: 'east',
				        //width: '30%',
					    height: '100%',
					    width: '100%',
				        xtype : "component",
				        autoEl : {
				            tag : "iframe",
				            height: '100%',
				    	    width: '100%',
				    	    margin: '0 0 0 0',
				    	    border: 0,
				    	    width: '100%',
				            src : CONTEXT_PATH + '/test/multiFileUpload.jsp',
				            //src : CONTEXT_PATH + '/test/uploadpanel.jsp',
					        frameBorder: 0
					     }
					}
                ]
            },
		         {	            
			        	id: 'projectadd-routing-panel-div',
			            title: '결재경로',
			            border: false,
			            autoScroll:true
		         },
		        {	            
		        	id: 'projectadd-pjmember-panel-div',
		            title: '수행 자원',
		            border: false,
		            autoScroll:true
		        }]
        }
        ,{
            xtype: 'container',
                                        type: 'hbox',
                                        padding:'5',
                                        pack:'end',
                                        align:'middle',
            defaults: {
            },
            margin: '10 10 10 10',
            border:false,
            items: [
		        {
                    xtype:'button',
                    text: CMD_OK,
		            handler: function() {
		               if(this.up('form').getForm().isValid()) {
		                	addActionNew();
		               }else {
		               		Ext.MessageBox.alert('입력 오류', '필수 입력 필드를 확인하세요.');
		               }
		            }
		        },{
		            xtype:'button',
		            text: '초기화',
		            handler: function() {
		                this.up('form').getForm().reset();
		            }
		        }
    		]
         }

        ]

    });
 		
 		
 		//인건비 기준
 		Ext.Ajax.request({
 			url: CONTEXT_PATH + '/purchase/request.do?method=getPoCondition',				
 			success : function(result) {
 				var text = result.responseText;
 				var o = JSON.parse(text, function (key, value) {
 						    return value;
 						});
 				
// 				humanUnit = o['humanUnit'];
// 		 		if(humanUnit == 'HOUR') {
// 		 	 		Ext.getCmp('labelHumanUnit').setValue('￦25,000/H');	
// 		 		} else {
// 		 	 		Ext.getCmp('labelHumanUnit').setValue('￦200,000/DAY'); 			
// 		 		}
 				humanUnit = o['humanUnit'];
 				console_logs('humanUnit', humanUnit);
 		 		if(humanUnit == 'DAY') {
 		 			Ext.getCmp('labelHumanUnit').setValue('￦200,000/DAY'); 
 		 		} else {
 		 			Ext.getCmp('labelHumanUnit').setValue('￦25,000/H');	
 		 		}
 		 		
 			},
 			failure: extjsUtil.failureMessage
 		});
 		
 		
 	
 		
			var tabPanelListAdd = new Ext.TabPanel({
	    		id:'project-tab-panel',
	    	    collapsible: true,
				xtype: 'tabpanel',
				title:getMenuTitle(),
		        activeTab: 0,
		        tabPosition: 'top',
		        items: [{	            
		        	id: 'projectview-grid-panel-div',
		            title: '수주 현황',
		            border: false,
		            autoScroll:true
		        },{	            
		        	id: 'projectadd-form-panel-div',
		            title: '수주 등록',
		            disabled : fPERM_DISABLING(),
		            border: false,
		            autoScroll:true
		        }]
	    });
			
			
			
			grid = Ext.create('Ext.grid.Panel', {
			        store: store,
			        multiSelect: true,
			        stateId: 'stateGrid',
			        selModel: selModel,
			        autoScroll : true,
			        height: getCenterPanelHeight()-53,
			        border: false,
			        bbar: getPageToolbar(store),
			        dockedItems: [{
			            dock: 'top',
			            xtype: 'toolbar',
			            items: [
			                    searchAction
			                    ,  '-', removeAction, '-', editAction
			                    ,
	      				        '->'//,excel_sample
	      				          ]
			        },
			        
			        {
			            xtype: 'toolbar',
			            items: getBuyerPjToolbar()
			            
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
      		        	}, '-',{
								xtype: 'checkboxfield',
								    id: 'regist_date_switch',
								    checked: false,
								    inputValue: '-1',
								    listeners:{
								           change:function(checkbox, checked){
								        	   console_log(checked);
								        	   if(checked == false){
								        		    regist_date_check = false;
								        		    console_log('regist_date_false=' + Ext.getCmp('regist_date_switch').getValue());
								        	   }else{
								        		    regist_date_check = true;
								        		    console_log('regist_date_true=' + Ext.getCmp('regist_date_switch').getValue());
								        	   }
								           }
								       }
								},{
      					    xtype:'label',
      					    text: '수주일자',
      					    name: 'label1'
      					 },
      					{ 
      		                name: 'regist_date_start',
      		                id:'regist_date_start',
      		                format: 'Y-m-d',
      				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
      				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
      					    	allowBlank: true,
      					    	xtype: 'datefield',
      					    	value: new Date(),
      					    	width: 100,
      						handler: function(){
      						}
      					},
      					{
      					    xtype:'label',
      					    text: " ~ ",
      					    name: 'label2'
      					 },
      					{ 
      		                name: 'regist_date_end',
      		                id:'regist_date_end',
      		                format: 'Y-m-d',
      				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
      				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
      					    	allowBlank: true,
      					    	xtype: 'datefield',
      					    	value: new Date(),
      					    	width: 100,
      						handler: function(){
      						}
      					},'-',
      					{
							xtype: 'checkboxfield',
						    id: 'delivery_plan_switch',
						    checked: false,
						    inputValue: '-1',
						    listeners:{
						           change:function(checkbox, checked){
						        	   console_log(checked);
						        	   if(checked == false){
						        		   delivery_plan_check = false;
						        	   }else{
						        		   delivery_plan_check = true;
						        	   }
						           }
						       }
						},
      					{
      					    xtype:'label',
      					    text: '납품예정일',
      					    name: 'label1'
      					 },
      					{ 
      		                name: 'delivery_plan_start',
      		                id:'delivery_plan_start',
      		                format: 'Y-m-d',
      				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
      				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
      					    	allowBlank: true,
      					    	xtype: 'datefield',
      					    	value: new Date(),
      					    	width: 100,
      						handler: function(){
      						}
      					},
      					{
      					    xtype:'label',
      					    text: " ~ ",
      					    name: 'label2'
      					 },
      					{ 
      		                name: 'delivery_plan_end',
      		                id:'delivery_plan_end',
      		                format: 'Y-m-d',
      				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
      				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
      					    	allowBlank: true,
      					    	xtype: 'datefield',
      					    	value: new Date(),
      					    	width: 100,
      						handler: function(){
      						}
      					}, '-',
      					{
							xtype: 'checkboxfield',
						    id: 'end_date_switch',
						    checked: false,
						    inputValue: '-1',
						    listeners:{
						           change:function(checkbox, checked){
						        	   console_log(checked);
						        	   if(checked == false){
						        		   end_date_check = false;
						        		   
						        	   }else{
						        		   end_date_check = true;
						        	   }
						           }
						       }
						},
      					{
      					    xtype:'label',
      					    text: '완료일자',
      					    name: 'label1'
      					 },
      					{ 
      		                name: 'end_date_start',
      		                id:'end_date_start',
      		                format: 'Y-m-d',
      				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
      				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
      					    	allowBlank: true,
      					    	xtype: 'datefield',
      					    	value: new Date(),
      					    	width: 100,
      						handler: function(){
      						}
      					},
      					{
      					    xtype:'label',
      					    text: " ~ ",
      					    name: 'label2'
      					 },
      					{ 
      		                name: 'end_date_end',
      		                id:'end_date_end',
      		                format: 'Y-m-d',
      				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
      				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
      					    	allowBlank: true,
      					    	xtype: 'datefield',
      					    	value: new Date(),
      					    	width: 100,
      						handler: function(){
      						}
      					}

      		        	]
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
			        }
//			,
//			        title: getMenuTitle()
//			        renderTo: 'MAIN_DIV_TARGET'
			    });
	
			
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		        	var rec = grid.getSelectionModel().getSelection()[0];
		            if (selections.length) {
		            	
		            	setTabState('MODIFY', selections[0]);
						//grid info 켜기
		            	simpleProperty(selections[0]);
												
						if(fPERM_DISABLING()==true) {
			            	removeAction.disable();	
			            	editAction.disable();

						}else{
							if(rec.get('creator_uid')!=vCUR_USER_UID){
				            	removeAction.enable(); 
				            	editAction.enable();
				            }else{
				            	removeAction.enable();	
				            	editAction.enable();
				            }

						}

		            } else {
		            	setTabState('REGIST', null);
		            	if(fPERM_DISABLING()==true) {
		            		simplecollapseProperty();//uncheck no displayProperty
			            	removeAction.disable(); 
			            	editAction.disable(); 
		            	}else{
		            		simplecollapseProperty();//uncheck no displayProperty
			            	removeAction.disable(); 
			            	editAction.disable(); 
		            	}

		            }
		           
		        }
		    });
		    
		    //결재화면
		    
		    var tempColumn = [];
	    	
	    	tempColumn.push(updown);
	    	for(var i=0; i<vCENTER_COLUMN_SUB.length; i++) {
	    		tempColumn.push(vCENTER_COLUMN_SUB[i]);
	    	}
	    	
	    	rtgapp_store.load(function() {
	    		Ext.each( /*(G)*/tempColumn, function (columnObj, index,value) {
	                var dataIndex = columnObj["dataIndex" ];
	               columnObj[ "flex" ] =1;
	               
	                if (value!="W"  && value!='기안') {
	                       if ('gubun' == dataIndex) {
	                              var combo = null ;
	                              var comboBoxRenderer = function (value, p, record) {
	                                     if (value=='W' || value=='기안') {
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
		                         store: routeGubunTypeStore,
	                             listClass: 'x-combo-list-small' ,
	                             listeners: {  }
	                       });
	                       columnObj[ "editor" ] = combo;
	                      }
	               }
	         });
				agrid = Ext.create('Ext.grid.Panel', {
					//title: routing_path,
				    store: rtgapp_store,
				    layout: 'fit',
				    width:  '100%',
				    columns : tempColumn,
				    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
	    		    	clicksToEdit: 1
	    		    })],
	    		    border: false,
				    multiSelect: true,
				    frame: false,
	    		    dockedItems: [{
	    				xtype: 'toolbar',
	    				items: [{
	    					fieldLabel: dbm1_array_add,
	    					labelWidth: 42,
	    					id :'user_name_addproject',
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
	                          for (var i = 0; i <agrid.store.data.items.length; i++)
	                          {
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
	                     				modifyIno: str,
	                     				srcahd_uid:unique_id
	                     			},
	                     			success : function(result, request) {   
	                     				rtgapp_store.load(function() {});
	                     			}
	                       	    });
	                          }
	                        }
	                    }]//endofitems
	    			}] //endofdockeditems
	    		}); //endof Ext.create('Ext.grid.Panel', 
	    	
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
			        }
	    		}); //endof Ext.create('Ext.grid.Panel', 
				
		    
		    
			memberTab  = Ext.widget('tabpanel', {
    			id : 'tempport',
    	        activeTab: 0,
		        multiSelect: true,
		        stateId: 'stateGrid1' + /*(G)*/vCUR_MENU_CODE,
		        autoScroll: true,
		        split: true,
		        border: false,
//                region: 'east',
//                width: '55%',
//                height: '100%',
    	        items: [{
	            	  
	                title: '프로젝트 멤버',
	                id: 'user-tab-div',
	                border: false,
	                dockedItems: [
							{
							  	xtype: 'toolbar',
							  	items: [{
									  id :'dept_combo_member',
							          name:           'dept_combo',
									  xtype:          'combo',
							          mode:           'local',
							          triggerAction:  'all',
							          editable:       false,
							          disabled: false,
							          allowBlank: false,
							          store: deptStore,
							          displayField:   'dept_name',
							          valueField:     'unique_id',
									  emptyText:   '부서',
							          fieldStyle: 'background-color: #FBF8E6; background-image: none;',
							          queryMode: 'remote',
							          listConfig:{
							          	getInnerTpl: function(){
							          		return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
							          	}			                	
							          },
							          	listeners: {
											'afterrender' : function(grid) {
												dept_name_combo=this;
												var elments = Ext.select(".x-column-header",true);//.x-grid3-hd
												elments.each(function(el) {
															}, this);
													
												}
							            		,
							          		select: function (combo, record) {
							          			var name_combo = Ext.getCmp('user_name_member');
							          			var deptUid = record[0].get('unique_id');
							          			name_combo.store.getProxy().setExtraParam('comdst_uid', deptUid);
							          			name_combo.setValue('');
							          			add_user_unique_id = '';
							          			name_combo.store.load(function(records) {
							          				console_log(records);
							          			});
							          		}//endofselect
							          	}
							  	},
							  	 {
			    					id :'user_name_member',
			    			        xtype: 'combo',
			    			        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			    			        store: userStore,
			    			        displayField:   'user_name',
			    			        emptyText:   '멤버',
			    			        valueField:   'unique_id',
			    			        disabled: false,
			    			        queryMode: 'local',
			    			        triggerAction: 'all',
			    			        mode: 'local',
			    			        editable:false,	
			    			        minChars: 2,
			    			        width: 80,
			    			        listConfig:{
			    			            loadingText: 'Searching...',
			    			            emptyText: 'No matching posts found.',
			    			            getInnerTpl: function() {
			    			                return '<div data-qtip="{unique_id}">{user_name}</div>';
			    			            }			                	
			    			        },
			    			        listeners: {
			    			        	'afterRender': function () {
			    			        		user_name_combo=this;
						                },
			    			        	select: function (combo, record) {
			    			        		console_log(record[0]);
			    			        		var user_unique_id = record[0].get('unique_id');
			    			        		var dept_code = record[0].get('dept_code');
			    			        		var dept_name = record[0].get('dept_name');
			    			        		var user_name = record[0].get('user_name');
			    			        		var user_id = record[0].get('user_id');
			    			        		
			    			        		add_user_unique_id = user_unique_id;
			    			        		add_dept_code = dept_code;
			    			        		add_dept_name = dept_name;
			    			        		add_user_name = user_name;
			    			        		add_user_id = user_id;
			    			        		

			    			        	},
			    			        	afterrender: function (cb) {
			    			        		Ext.Ajax.request({
			    			        			url: CONTEXT_PATH + '/userMgmt/user.do?method=query',
			    			        			params:{
			    			        				comdst_uid : vCUR_DEPT_UID
			    			        			},
			    			        			success : function(result, request) {
			    			        				var obj =Ext.decode(result.responseText);
			    			        				var name_combo = Ext.getCmp('user_name_member');
			    			        				name_combo.clearValue();
			    			        				name_combo.store.removeAll();
			    			        				/*var user_query_name = obj.datas[2].user_name;
			    			        				console_log(user_query_name);
			    			        				*/
			    			        				for(var i=0; i<obj.count; i++){
			    			        					var user_name = obj.datas[i].user_name;
			    			        					var unique_id = obj.datas[i].unique_id;
			    			        					name_combo.store.add({
			    			        						user_name: user_name,
			    			        						unique_id: unique_id
													 });
			    			        				}
			    			        			},
			    			        			failure: extjsUtil.failureMessage
			    			        		});	
			    			             }
			    			        }
			    				},'-',{
			    					id :'membertype',
			    			        xtype: 'combo',
			    			        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			    			        store: pjMemberTypeStore,
			    			        displayField:   'codeName',
			    			        valueField:   'systemCode',
			    			        emptyText:   '역할',
			    			        disabled: false,
//			    			        queryMode: 'local',
			    			        triggerAction: 'all',
//			    			        mode: 'local',
			    			        editable:false,	
//			    			        minChars: 2,
			    			        width: 80,
			    			        listConfig:{
			    			            loadingText: 'Searching...',
			    			            emptyText: 'No matching posts found.',
			    			            getInnerTpl: function() {
			    			                return '<div data-qtip="{systemCode}">{codeName}</div>';
			    			            }			                	
			    			        },
			    			        listeners: {
			    			        	'afterRender': function () {
			    			        		membertype_combo=this;
						                },
			    			        	select: function (combo, record) {
			    			        		console_log('Selected Value : ' + combo.getValue());
			    	                    	var systemCode = record[0].get('systemCode');
			    	                    	var codeNameEn  = record[0].get('codeNameEn');
			    	                    	var codeName  = record[0].get('codeName');
			    	                    	
//			    	                    	Ext.getCmp('gate_name').setValue(codeName); 
			    	                    	console_log('systemCode : ' + systemCode 
			    	                    			+ ', codeNameEn=' + codeNameEn
			    	                    			+ ', codeName=' + codeName	);
			    	                    	add_member_type = systemCode;
			    	                    	
			    			        	}

			    			        }
			    				},'-',{
			                        xtype:'button',
			                        text: CMD_ADD,
			                        iconCls:'add',
//			                        flex:1,
			                        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			                        width:   60,
			                        handler : function(){

			                        	if(add_user_unique_id==null || add_user_unique_id==''){
			                        		Ext.MessageBox.alert('Error','사용자를 선택하여주십시오', callBack);  
			                        		function callBack(id){  
			                        			return
			                        		} 
			                        		return;
			                        	}
			                        	if(add_member_type==null || add_member_type==''){
			                        		Ext.MessageBox.alert('Error','업무타입을 선택하여주십시오', callBack);  
			                        		function callBack(id){  
			                        			return
			                        		} 
			                        		return;
			                        	}

			                        	var unique_id = '-1';
	
		    				           	var pjmember = Ext.ModelManager.create({
		    				           		unique_id : unique_id,
		    				           		dept_code : add_dept_code,
		    				           		dept_name : add_dept_name,
		    				           		user_name : add_user_name,
		    				           		user_id : add_user_id,
		    				           		user_unique_id : add_user_unique_id,
		    				           		role_type : add_member_type
		    				        	}, 'PjMember');
	    				           	 
		    				           	var check = false;
		    				           	for (var i = 0; i <userGrid.store.data.items.length; i++)
				                        {
		    				           		var record = userGrid.store.data.items [i];
		    				           		var cheke_user_unique_id = record.get('user_unique_id');
		    				           		var cheke_dept_code = record.get('dept_code');
		    				           		var cheke_role_type = record.get('role_type');
		    				           		console_log(i+":"+cheke_user_unique_id);
		    				           		console_log(i+":"+cheke_dept_code);
		    				           		console_log(i+":"+cheke_role_type);
		    				           		if(cheke_user_unique_id == add_user_unique_id 
		    				           				&& cheke_dept_code == add_dept_code 
		    				           				&& cheke_role_type == add_member_type)
		    				           		{				                                	
					                        check = true;
					                                	
					                        }
					                    }
		    				           	console_log(check);
		    				           	if(check==false){
		    				           		worker_store.add(pjmember);
		    				           	}	
			                        }
			                     },'->',pcsMemberdelete

			    				]//endof itemsoftoolbar
							  }
							 
	                ],
	                listeners: {
	                    activate: function(tab){
	                        setTimeout(function() {

	                        }, 1);
	                    }
	                }
	            }
    	              

    	            
    	        ]
    	    });
			
			(new Ext.data.Store({ model: 'ExtFieldColumn'})).load({
			    params: {
			    	menuCode: 'AUS4_HUMAN'
			    },
			    callback: function(records, operation, success) {
			    	if(success ==true) {
			    		for (var i=0; i<records.length; i++){
			    			inRec2Col(records[i], fieldHuman, columnHuman, tooltipHuman);
				        }//endoffor
		    		 	
			    		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
			    		Ext.each(/*(G)*/columnHuman, function(columnObj, index) {
			    			var dataIndex = columnObj["dataIndex"];
			    			if(dataIndex!='no') {
			    				if('day_capa' == dataIndex) {
			    					columnObj["editor"] = {
			    	                };	
			    				}
			    			}
			    		}); 
			    		userGrid  = Ext.create('Ext.grid.Panel', {
			    			store: worker_store,
			    			selModel: selModel,
					        collapsible: false,
					        multiSelect: false,
					        stateId: 'userGrid' + /*(G)*/vCUR_MENU_CODE,
					        autoScroll: true,
					        autoHeight: true,
					        //height: getCenterTapPanelHeight(),
					        columns: columnHuman,
					        border: false,
					        plugins: [cellEditing_user]//,
					        //bbar: getPageToolbar(worker_store)
					    });
			    		userGrid.getSelectionModel().on({
			    			selectionchange: function(sm, selections) {
			    				if (selections.length) {
			    					if(fPERM_DISABLING()==true) {
						            	pcsMemberdelete.disable();
					            	}else{
						            	pcsMemberdelete.enable();
					            	}
			    				}else {
					            	if(fPERM_DISABLING()==true) {
						            	pcsMemberdelete.disable();
					            	}else{
						            	pcsMemberdelete.disable();
					            	}
			    				}
			    			}
			    		});
			    		var ptargetmembergrid = Ext.getCmp('user-tab-div');
			    		ptargetmembergrid.removeAll();
			    		ptargetmembergrid.add(userGrid);
			    		ptargetmembergrid.doLayout();
			    	}//endof if(success..
			    },//callback
			    scope: this
			});	


	    	});
 	

			/**
			 * 견적요청목록 받기
			 */
			var fieldItem = [], columnItem = [], tooltipItem = [];
			//아이템 필드 로드
		   (new Ext.data.Store({ model: 'ExtFieldColumn'})).load({
			    params: {
			    	menuCode: 'SQT1_CLD'
			    },
			    callback: function(records, operation, success) {
			    	console_log('come IN SQT1_CLD');
			    	if(success ==true) {
			    		for (var i=0; i<records.length; i++){
			    			inRec2Col(records[i], fieldItem, columnItem, tooltipItem);
				        }//endoffor
		    		 	
			    		//var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
			    		Ext.each(/*(G)*/columnItem, function(columnObj, index) {
			    			var dataIndex = columnObj["dataIndex"];
			    		});//endifeach
			    		
			    		
						Ext.define('RtgAst', {
							 extend: 'Ext.data.Model',
							 fields: /*(G)*/fieldItem,
							    proxy: {
									type: 'ajax',
							        api: {
								            read: CONTEXT_PATH + '/sales/quota.do?method=readQuota'
							        },
							        reader: {
										type: 'json',
										root: 'datas',
										totalProperty: 'count',
										successProperty: 'success'
									}
								}
						});
						
						var quotaStore = new Ext.data.Store({  
							pageSize: getPageSize(),
							model: 'RtgAst',
							sorters: [{
					            property: 'unique_id',
					            direction: 'DESC'
					        }]
						});
						    		
 						quotaStore.load(function(a, b, c) {
 							
 							var quotaGrid = Ext.create('Ext.grid.Panel', {
						        store: quotaStore,
									id: 'gridquotation',
							   		title: '견적목록',
							   		border: true,
							   		height: '100%',
							   		flex: 1,
						        multiSelect: false,
						        stateId: 'stateGridQuota',
						        autoScroll : true,
						        columns: /*(G)*/columnItem,
						        viewConfig: {
						            stripeRows: true,
						            enableTextSelection: true,
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
						            }
						        }
						    });
	
			
						    quotaGrid.getSelectionModel().on({
						        selectionchange: function(sm, selections) {
						        	
						            if (selections.length) {
						            	
						            	var rec = selections[0];
						          		console_log(rec);
        								var unique_id = rec.get('unique_id');
						            	
						            	Ext.Ajax.request({
											url: CONTEXT_PATH + '/sales/quota.do?method=readQuota',			
											params:{
												id : unique_id
											},
											
											success : function(result, request) {
												var strJson = result.responseText;
												//console_log(strJson);
												var obj = Ext.JSON.decode(strJson);
												var rtgast = obj['datas'][0];
												
												console_log(rtgast);
												
												var reserved_number1 = rtgast['id'];
												var ac_condition = rtgast['ac_condition']; //: "30일 현금"
												var content = rtgast['content']; //: "HJK-345670"
												var name = rtgast['name']; //: "RGXFGRT-23"
												var po_no = rtgast['po_no']; //: "SQ00000000"
												var po_type = rtgast['po_type']; //: "PY"
												var reserved_number1 = rtgast['reserved_number1']; //: 3070002739
												var reserved_number3 = rtgast['reserved_number3'];
												var reserved_varchar1 = rtgast['reserved_varchar1']; //: "3070002739"
												var reserved_varchar2 = rtgast['reserved_varchar2']; //: "(주)전진엔텍 / Pusan"
												var reserved_varchar3 = rtgast['reserved_varchar3']; //: "RFQNO"
												var reserved_varchar4 = rtgast['reserved_varchar4']; //: "NONE"
												var reserved_varchar5 = rtgast['reserved_varchar5']; //: "서울|납품일로부터 1년|빨리."
												var total_price = rtgast['total_price']; //: 70000
												var ref_email = rtgast['ref_email']; //: ""
												var ref_fax = rtgast['ref_fax']; //: ""
												var ref_hp = rtgast['ref_hp']; //: ""
												var ref_name = rtgast['ref_name']; //: ""
												console_log('reserved_number1');
												console_log(reserved_number1);
												var info = 
													'==== 견적요약 ====\n[견적번호] ' + po_no + 
													'\n' + content
													;
												
												Ext.getCmp('description').setValue(info);
												Ext.getCmp('selling_price').setValue(total_price);
												Ext.getCmp('reserved_number1').setValue(reserved_number1);//reserved_number1은 PROJECT의 견적UID
												
												var combo = Ext.getCmp('buyer_name');
												console_log(combo);
												
												console_log(reserved_number1);

												//combo.setValue(reserved_number1);
												Ext.getCmp('wa_code').setValue(reserved_varchar1);
												Ext.getCmp('wa_name').setValue(reserved_varchar2);
												Ext.getCmp('order_com_unique').setValue(reserved_number1);
												Ext.getCmp('buyer_name').setValue(reserved_varchar2);
												Ext.getCmp('pj_name').setValue(name);
												
//												//combo.setValue(reserved_number1);
//												console_log('-----');
//												
//												registBuyerStore.data.each(function(rec, index, totalItems ) {
//														console_log(rec);
//														console.log('rec.data:', rec.data);
//														var uid = rec.data.unique_id;
//														console.log('uid:', uid);
//										                
//										                if(Number(uid)==Number(reserved_number1) ) {
//										                	console.log('found:', uid);
//										                	var record = [];
////										                	var o = {};
////										                	o['unique_id'] = uid;
////										                	o['wa_code'] = reserved_varchar1;
////										                	o['wa_name'] = reserved_varchar2;
//															record[0] = rec;
//															combo.fireEvent('select', combo, record);
//															combo['forceSelection'] = true;	
//										                }
//											    });
												
											}//endofsuccess
						            	});//endofrequest
				
						            } else {
						            	
						            }
						           
						        }
						    });
				 							
							var main =  Ext.create('Ext.panel.Panel', {
								id : 'tempmainport',
					            width: '100%',
					            height: getCenterPanelHeight()-53,
							    layout:'hbox',
						        border: false,
							   	items: [
								   	tabProjectDetail,
								   	quotaGrid
							   	]
							});
						    
						    fLAYOUT_CONTENT(tabPanelListAdd);
							cenerFinishCallback();//Load Ok Finish Callback
						    var ptarget = Ext.getCmp('projectview-grid-panel-div');
							ptarget.removeAll();
							ptarget.add(grid);
							ptarget.doLayout();

							
							var ptargetroutingadd = Ext.getCmp('projectadd-routing-panel-div');
							ptargetroutingadd.removeAll();
							ptargetroutingadd.add(agrid);
							ptargetroutingadd.doLayout();

					    	
					    	var ptargetpjmember = Ext.getCmp('projectadd-pjmember-panel-div');
					    	ptargetpjmember.removeAll();
					    	ptargetpjmember.add(memberTab);
					    	ptargetpjmember.doLayout();
					    	
							var ptargetbasicadd = Ext.getCmp('projectadd-form-panel-div');
							ptargetbasicadd.removeAll();
							ptargetbasicadd.add(main /*tabProjectDetail*/);
							ptargetbasicadd.doLayout();	
						
				    		
							registBuyerStore.load({});
							//getLastPjCode();//프로젝트 코드 설정
 						});//endofquoyaStore.load
							
			    		
			    	}//endof successtrue
			
				},//callback
			    scope: this
			});//endofload	
			


	    	
	}); //store load
 	 	
});	//OnReady
