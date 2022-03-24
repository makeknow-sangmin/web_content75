
var viewport = null;
var win = null;
var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
var grid = null;

function lfn_viewExplore(){

	var winName = "popupExplorer";
	var url = CONTEXT_PATH + "/popup.do?method=explorer";
	var style = "scrollbars=no,resizable=yes, width=800,height=500";
	popupInfoWnd(url,winName,style);
}

/**
 * Customnction used for column renderer
 * @param {Object} val
 */
function change(val) {
    if (val > 0) {
        return '<span style="color:green;">' + val + '</span>';
    } else if (val < 0) {
        return '<span style="color:red;">' + val + '</span>';
    }
    return val;
}

/**
 * Custom function used for column renderer
 * @param {Object} val
 */
function pctChange(val) {
    if (val > 0) {
        return '<span style="color:green;">' + val + '%</span>';
    } else if (val < 0) {
        return '<span style="color:red;">' + val + '%</span>';
    }
    return val;
}



function getColNameSub(key) {
	return getTextName(/*(G)*/vCENTER_FIELDS_SUB, key);
}

function createSearchAction(menuCode)
{
	var action =
	Ext.create('Ext.Action', {
    	iconCls:'search',
        text: panelSRO1135,
        //disabled: true,
        handler: function(widget, event) {
        	Ext.MessageBox.alert(panelSRO1135, 'search: ' + menuCode);
        }
	 });
	return action;
	
}

var win = null;
function createAddAction(menuText, menuCode)
{
	var action =
	Ext.create('Ext.Action', {
		iconCls:'add',
	    text: panelSRO1136,
	    //disabled: true,
        handler: function(widget, event) {
        	//if (!win) {
                win = getMenuObject(menuText, menuCode);
            //}

        	if(win==null) {
        		alert('not defined window for ' + menuCode );        		
        	} else {
            	
            	//button.dom.disabled = true;
                if (win.isVisible()) {
                    win.hide(this, function() {
                        //button.dom.disabled = false;
                    });
                } else {
                    win.show(this, function() {
                        //button.dom.disabled = false;
                    });
                }
                
        	}

            
         }
	});
	return action;
}

function createRemoveAction(menuCode)
{
	var action =
	Ext.create('Ext.Action', {
		itemId: 'removeButton',
	    iconCls: 'remove',
	    text: panelSRO1137,
	    disabled: true,
	    handler: function(widget, event) {
	        var rec = grid.getSelectionModel().getSelection()[0];
	        if (rec) {
	            Ext.MessageBox.alert(panelSRO1137, panelSRO1137 + rec.get('company'));
	        }
	    }
	});
	return action;
}

function createContextMenu(menuCode, addAction, removeAction)
{
	var menu =
	Ext.create('Ext.menu.Menu', {
	    items: [
	        addAction,
	        removeAction
	    ]
	});
	return menu;
}

// create the data store
function createStore(menuCode, fields, data)
{
	var store =
	Ext.create('Ext.data.ArrayStore', {
	    fields: fields,
	    data: data
	});
	return store;
}

var menuHandler = function(menuItem) {

	var linkPath = menuItem.linkPath;
	var menu_key = menuItem.menu_key;
	var service_name = menuItem.service_name;
	var displayName = menuItem.displayName;
	var permType = menuItem.permType;
	var flag1 = menuItem.flag1;
	var flag2 = menuItem.flag2;
	var flag3 = menuItem.flag3;
	var flag4 = menuItem.flag4;
	var flag5 = menuItem.flag4;
	console_log(
		'@@@@@ menuHandler menu_key:'+menu_key 
		+ ', permType=' + permType 
		+ ', linkPath=[' + linkPath +']'
		+ ', flag1=[' + flag1 +']'
		+ ', flag2=[' + flag2 +']'
		+ ', flag3=[' + flag3 +']'
		+ ', flag4=[' + flag4 +']'
		+ ', flag5=[' + flag5 +']'
		
		
		) ;
	if(linkPath!=null && linkPath.length> 0) {
		menuAction(menu_key, service_name, displayName, linkPath, permType
			, flag1, flag2, flag3, flag4, flag5);
	} else {
	}
};

/*(G)*/vSRCH_TOOLBAR = [];
///*(G)*/vSRCH_COMBO = [];

function getFiledInfo(menuKey) {
	
}

function getPageToolbar(store) {
 	// add a paging toolbar to the grid's footer
	   var paging = Ext.create('Ext.PagingToolbar', {
         store: store,
         displayInfo: true,
         displayMsg: display_page_msg,
         emptyMsg: empty_page_msg
     });
     
	    // add the detailed view button
	    paging.add('-', {
	        text: download_text,
	        iconCls: 'MSExcelX',
	        menu: {
	            items: [
	                {
	                    text: current_view_text,//'Major Fields | Current Rows',
	    		        handler: printExcelHandler
	                },
	                {
	                    text: all_rows_text,//'Major Fields | All Rows',
	    		        handler: printExcelHandlerAll
	                }
	            ]
	        }
	    });
	    return paging;
}

function getProjectToolbar(hasPaste, haseExcelPrint, hasBlank) {
	var disCav_no = cav_text;

	hasNull = false;
	if(hasBlank==true) {
		hasNull = true;
	}
	
	var projectStore = Ext.create('Mplm.store.ProjectStore', {hasNull: hasNull} );
	
	var arrProjectToolbar = [];
	
	if(hasPaste==true) {
		var actionBomCopy = Ext.create('Ext.Action', {
			iconCls:'PSBOMView',
		    text: copy_to_text,
		    disabled: true,
		    handler: function(widget, event) {
		    	switch(vCUR_MENU_CODE) {
		    	case 'PMT1_CLD':
		    	case 'PMT1':
		    		{
		    		//make uidlist
			    	var uidList = '';
			        var selections = grid.getSelectionModel().getSelection();
			        if (selections) {
			            	for(var i=0; i< selections.length; i++) {
			            		var rec = selections[i];
			            		var unique_id = rec.get('unique_id');
			            		if(uidList=='') {
			            			uidList = unique_id;
			            		}else {
			            			uidList = uidList + ';' + unique_id;
			            		}
			            	}
			        }
		           	Ext.Ajax.request({
							url: CONTEXT_PATH + '/design/bom.do?method=exportBom',				
						params:{
			        		toPjUidAssy: selectedMoldCoord,		//order_com_unique
			        		toPjUid: selectedMoldUid,		//ac_uid
			        		uidSrcahd : selectedAssyUid,
			        		uidList: uidList
						},
						success : function(result, request) {
							Ext.MessageBox.alert('Info','Bom Copy is done.');
						},//endof success for ajax
						failure: extjsUtil.failureMessage
		           	}); //endof Ajax
		    		}
		    		break;
		    	}
		    }
		});
		pasteAction = actionBomCopy;
		arrProjectToolbar.push(actionBomCopy);
	}
	
	arrProjectToolbar.push(
			{
				id :'uid_srcahd_in_pjUid',
		        name : 'uid_srcahd_in_pjUid',
		        xtype: 'combo',
		        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
		        store: projectStore,
		        displayField:   'pj_code',
		        valueField:     'uid_srcahd',
		        sortInfo: { field: 'create_date', direction: 'DESC' },
		        typeAhead: false,
		        hideLabel: true,
		        minChars: 2,
		        width: 182,
		        listConfig:{
		            loadingText: 'Searching...',
		            emptyText: 'No matching posts found.',
		            getInnerTpl: function() {
		                return '<div data-qtip="{unique_id}"><small>{pj_code} <font color=blue>{description}</font></small></div>';
		            }			                	
		        },
		        listeners: {
		        	select: function (combo, record) {
		 				var pj_code = record[0].get('pj_code');
		 				var ac_uid = record[0].get('unique_id');
		 				var order_com_unique = record[0].get('order_com_unique');
		 				var description = record[0].get('description');
		 				var pj_name = record[0].get('pj_name');
		 				var cav_no = record[0].get('cav_no');
		 				var regist_date = record[0].get('regist_date');
		 				var delivery_plan = record[0].get('delivery_plan');
		 				var pm_id = record[0].get('pm_id');
		 				if(regist_date.length>10) {
		 					regist_date = regist_date.substring(0,10);
		 				}
		 				if(delivery_plan.length>10) {
		 					delivery_plan = delivery_plan.substring(0,10);
		 				}
		 				if(vCUR_MENU_CODE != 'PPO2' ){
			 				Ext.getCmp('pj_srchDescription').setValue(description);
			 				//Ext.getCmp('pj_srchPj_name').setValue(pj_type);
			 				Ext.getCmp('pj_srchCav_no').setValue(cav_no);
			 				Ext.getCmp('pj_srchRegist_date').setValue(regist_date);
			 				Ext.getCmp('pj_srchDelivery_plan').setValue(delivery_plan);
			 				CommonUsrAst.load(pm_id ,{
			 					 success: function(usrAst) {
			 						 try{
			 							var user_name = usrAst.get('user_name');
			 							Ext.getCmp('pj_srchPm_id').setValue(user_name);
			 						 }catch(e){}
			 			 		 }//endofsuccess
			 				 });//emdofload
		 				}
		        		switch(vCUR_MENU_CODE) {
		        		case 'PMT1':
		        		case 'PMT1_CLD':
		        		case 'DBM1':
		        		case 'EPC3':
		        		case 'EPC1':
		        		case 'EPC8':
		               		selectedAssyUid = combo.getValue();
		               		selectedMoldUid = ac_uid;
		               		selectedMoldCode = pj_code;
		               		selectedMoldCoord = order_com_unique;
		               		selectedMoldName = pj_name;
		     				addAction.enable();
		     				store.getProxy().setExtraParam('uid_srcahd', selectedAssyUid);
		     				store.load({});
		        			break;
		        		case 'PPO1':
		        			selectedAssyUid = ac_uid;
		               		store.getProxy().setExtraParam('ac_uid', selectedAssyUid);
		     				store.load({});
		        		case 'DBM8':
		        			selectedAssyUid = combo.getValue();
		     				store.getProxy().setExtraParam('uid_srcahd', selectedAssyUid);
//		     				store.getProxy().setExtraParam('reserved_varchar2', 'N');
		     				store.load({});
		        		case 'VST1':
		        			selectedAssyUid = ac_uid;
		               		store.getProxy().setExtraParam('ac_uid', selectedAssyUid);
		        		default:
		        			store.load({});
		               		break;
		        		}
		        		var paramValue = ac_uid + ';' + selectedAssyUid; //+ //pj_code + ';' + ac_uid + ';' + selectedAssyUid
		        		if(vCUR_MENU_CODE=='EPC1' || vCUR_MENU_CODE=='EPJ1' || vCUR_MENU_CODE=='EPC3' || vCUR_MENU_CODE=='EPC8') {
		        			paramValue = paramValue + ';' + 'O';
		        		}
		 				Ext.Ajax.request({
		 					url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',			
		 					params:{
		 						paramName : 'CommonProjectAssy',
		 						paramValue : paramValue
		 					},
		 					
		 					success : function(result, request) {
		 						console_log('success defaultSet');
		 					},
		   	 				failure: function(result, request){
		   	 					console_log('fail defaultSet');
		   	 				}
		 				});
		 				}//endofselect
				,afterrender: function(combo) {
					callbackToolbarRenderrer('CommonProjectAssy', 'not-use', combo, 'mold');
			    }
				
		        }
			}
	);
	if(vCUR_MENU_CODE != 'PPO2'){
		arrProjectToolbar.push('-');
		arrProjectToolbar.push(
				{
			fieldLabel: toolbar_pj_model,
	        labelWidth: 42,
	        width: 160,
	        xtype: 'textfield',
			id :'pj_srchDescription',
	        name : 'pj_srchDescription',
	        labelSeparator: ':',
	        readOnly: true,
	 		fieldStyle: 'background-color: #E7EEF6; background-image: none;',
	        listeners: {
	            expand: function(){
	            },
	            collapse: function(){
	            },
	            change: function(d, newVal, oldVal) {
	            },
	            keypress: {
	                buffer: 500,
	                fn: function(field){
	                    var value = field.getValue();
	                    if (value !== null && field.isValid()) {
	                    }
	                }
	            }
	        }
		 });
		arrProjectToolbar.push('-');
		
		arrProjectToolbar.push(
		{
			fieldLabel: disCav_no,
	        labelWidth: 30,
	        width: 80,
	        xtype: 'textfield',
			id :'pj_srchCav_no',
	        name : 'pj_srchCav_no',
	        labelSeparator: ':',
	        readOnly: true,
	 		fieldStyle: 'background-color: #E7EEF6; background-image: none;'
		});
		arrProjectToolbar.push('-');
		arrProjectToolbar.push(
			{
			fieldLabel: toolbar_pj_spo_date,
	        labelWidth: 42,
	        width: 120,
	        xtype: 'textfield',
			id :'pj_srchRegist_date',
	        name : 'pj_srchRegist_date',
	        labelSeparator: ':',
	        readOnly: true,
	 		fieldStyle: 'background-color: #E7EEF6; background-image: none;text-align:center;'
			}
		);
		arrProjectToolbar.push('-');
		arrProjectToolbar.push(
	       
			{
				fieldLabel: toolbar_pj_req_date,
		        labelWidth: 42,
		        width: 120,
		        xtype: 'textfield',
				id :'pj_srchDelivery_plan',
		        name : 'pj_srchDelivery_plan',
		        labelSeparator: ':',
		        readOnly: true,
		 		fieldStyle: 'background-color: #E7EEF6; background-image: none;text-align:center;'
	 		}
		);
		arrProjectToolbar.push('-');
		arrProjectToolbar.push(  
				{
					fieldLabel: toolbar_pj_rep,
			        labelWidth: 42,
			        width: 100,
			        xtype: 'textfield',
					id :'pj_srchPm_id',
			        name : 'pj_srchPm_id',
			        labelSeparator: ':',
			        readOnly: true,
			 		fieldStyle: 'background-color: #E7EEF6; background-image: none;text-align:center;'
		 		}
			);
		
		
		if(haseExcelPrint==true) {
			arrProjectToolbar.push('->'); 
			arrProjectToolbar.push(
				    {
				        text: excel_download_text,
				        iconCls: 'MSExcelX',
				        menu: {
				            items: [
				                {
				                    text: current_view_text,//'Major Fields | Current Rows',
				    		        handler: printExcelHandler
				                },
				                {
				                    text: all_rows_text,//'Major Fields | All Rows',
				    		        handler: printExcelHandlerAll
				                }
				            ]
				        }
				    }
		    );
		}
	}
	return arrProjectToolbar;
	
}

function getProjectToolbarCloud(hasPaste, haseExcelPrint, hasBlank) {
	var disCav_no = cav_text;

	hasNull = false;
	if(hasBlank==true) {
		hasNull = true;
	}
	
	var projectStore = Ext.create('Mplm.store.ProjectStore', {hasNull: hasNull} );
	
	var arrProjectToolbar = [];
	
	if(hasPaste==true) {
		var actionBomCopy = Ext.create('Ext.Action', {
			iconCls:'PSBOMView',
		    text: copy_to_text,
		    disabled: true,
		    handler: function(widget, event) {
		    	switch(vCUR_MENU_CODE) {
		    	case 'PMT1_CLD':
		    	case 'PMT1':
		    		{
		    		//make uidlist
			    	var uidList = '';
			        var selections = grid.getSelectionModel().getSelection();
			        if (selections) {
			            	for(var i=0; i< selections.length; i++) {
			            		var rec = selections[i];
			            		var unique_id = rec.get('unique_id');
			            		if(uidList=='') {
			            			uidList = unique_id;
			            		}else {
			            			uidList = uidList + ';' + unique_id;
			            		}
			            	}
			        }
		           	Ext.Ajax.request({
							url: CONTEXT_PATH + '/design/bom.do?method=exportBom',				
						params:{
			        		toPjUidAssy: selectedMoldCoord,		//order_com_unique
			        		toPjUid: selectedMoldUid,		//ac_uid
			        		uidSrcahd : selectedAssyUid,
			        		uidList: uidList
						},
						success : function(result, request) {
							Ext.MessageBox.alert('Info','Bom Copy is done.');
						},//endof success for ajax
						failure: extjsUtil.failureMessage
		           	}); //endof Ajax
		    		}
		    		break;
		    	}
		    }
		});
		pasteAction = actionBomCopy;
		arrProjectToolbar.push(actionBomCopy);
	}
	
	// Custom rendering Template
	var codeTpl = '<tpl for=".">[{pj_code}] {pj_name}</tpl>';
	var resultTpl = new Ext.XTemplate(
	    codeTpl
	);
	arrProjectToolbar.push(
			{
				id :'uid_srcahd_in_pjUid',
		        name : 'uid_srcahd_in_pjUid',
		        xtype: 'combo',
		        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
		        store: projectStore,
		        displayField: 'pj_code',
		        //tpl: resultTpl,
		        valueField:     'uid_srcahd',
		        sortInfo: { field: 'create_date', direction: 'DESC' },
		        typeAhead: false,
		        hideLabel: true,
		        minChars: 2,
		        width: 170,
		        listConfig:{
		            loadingText: 'Searching...',
		            emptyText: 'No matching posts found.',
		            getInnerTpl: function() {
		                return '<div data-qtip="{unique_id}">[{pj_code}] <small>{pj_name}</small></div>';
		            }			                	
		        },
		        listeners: {
		        	select: function (combo, record) {
		        		console_log(record[0]);
		 				var pj_code = record[0].get('pj_code');
		 				var ac_uid = record[0].get('unique_id');
		 				var order_com_unique = record[0].get('order_com_unique');
		 				var description = record[0].get('description');
		 				var pj_name = record[0].get('pj_name');
		 				var cav_no = record[0].get('cav_no');
		 				var regist_date = record[0].get('regist_date');
		 				var delivery_plan = record[0].get('delivery_plan');
		 				var pm_id = record[0].get('pm_id');
		 				if(regist_date.length>10) {
		 					regist_date = regist_date.substring(0,10);
		 				}
		 				if(delivery_plan.length>10) {
		 					delivery_plan = delivery_plan.substring(0,10);
		 				}
		 				if(vCUR_MENU_CODE != 'PPO2' ){
			 				Ext.getCmp('pj_srchRegist_date').setValue(regist_date);
			 				Ext.getCmp('pj_srchDelivery_plan').setValue(delivery_plan);
			 				Ext.getCmp('pj_srchPj_name').setValue(pj_name);
			 				CommonUsrAst.load(pm_id ,{
			 					 success: function(usrAst) {
			 						 try{
			 							var user_name = usrAst.get('user_name');
			 							Ext.getCmp('pj_srchPm_id').setValue(user_name);
			 						 }catch(e){}
			 			 		 }//endofsuccess
			 				 });//emdofload
		 				}
		        		switch(vCUR_MENU_CODE) {
		        		case 'PMT1':
		        		case 'PMT1_CLD':
		        		case 'DBM1':
		        		case 'EPC3':
		        		case 'EPC1':
		        		case 'EPC8':
		               		selectedAssyUid = combo.getValue();
		               		selectedMoldUid = ac_uid;
		               		selectedMoldCode = pj_code;
		               		selectedMoldCoord = order_com_unique;
		               		selectedMoldName = pj_name;
		     				addAction.enable();
		     				store.getProxy().setExtraParam('uid_srcahd', selectedAssyUid);
		     				store.load({});
		        			break;
		        		case 'VST4':
		        			callGantt(ac_uid);
		        			break;
		        		case 'PPO1':
		        			selectedAssyUid = ac_uid;
		               		store.getProxy().setExtraParam('ac_uid', selectedAssyUid);
		     				store.load({});
		        		case 'DBM8':
		        			selectedAssyUid = combo.getValue();
		     				store.getProxy().setExtraParam('uid_srcahd', selectedAssyUid);
//		     				store.getProxy().setExtraParam('reserved_varchar2', 'N');
		     				store.load({});
		        		case 'VST1':
		        			selectedAssyUid = ac_uid;
		               		store.getProxy().setExtraParam('ac_uid', selectedAssyUid);
		        		default:
		        			store.load({});
		               		break;
		        		}
		        		var paramValue = ac_uid + ';' + selectedAssyUid; //+ //pj_code + ';' + ac_uid + ';' + selectedAssyUid
		        		if(vCUR_MENU_CODE=='EPC1' || vCUR_MENU_CODE=='EPJ1' || vCUR_MENU_CODE=='EPC3' || vCUR_MENU_CODE=='EPC8') {
		        			paramValue = paramValue + ';' + 'O';
		        		}
		 				Ext.Ajax.request({
		 					url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',			
		 					params:{
		 						paramName : 'CommonProjectAssy',
		 						paramValue : paramValue
		 					},
		 					
		 					success : function(result, request) {
		 						console_log('success defaultSet');
		 					},
		   	 				failure: function(result, request){
		   	 					console_log('fail defaultSet');
		   	 				}
		 				});
		 				}//endofselect
				,afterrender: function(combo) {
					callbackToolbarRenderrer('CommonProjectAssy', 'not-use', combo, 'cloud');
			    }
				
		        }
			}
	);
	if(vCUR_MENU_CODE != 'PPO2'){
		arrProjectToolbar.push('-');
		
		arrProjectToolbar.push(
			{
			fieldLabel: '',//toolbar_pj_spo_date,
	        labelWidth: 0,
	        width: 200,
	        xtype: 'textfield',
			id :'pj_srchPj_name',
	        name : 'pj_srchPj_name',
	        labelSeparator: ':',
	        readOnly: true,
	 		fieldStyle: 'background-color: #E7EEF6; background-image: none;text-align:left;'
			}
		);
		arrProjectToolbar.push('-');
		arrProjectToolbar.push(
			{
			fieldLabel: '등록일',//toolbar_pj_spo_date,
	        labelWidth: 42,
	        width: 120,
	        xtype: 'textfield',
			id :'pj_srchRegist_date',
	        name : 'pj_srchRegist_date',
	        labelSeparator: ':',
	        readOnly: true,
	 		fieldStyle: 'background-color: #E7EEF6; background-image: none;text-align:center;'
			}
		);
		arrProjectToolbar.push('-');
		arrProjectToolbar.push(
	       
			{
				fieldLabel: toolbar_pj_req_date,
		        labelWidth: 42,
		        width: 120,
		        xtype: 'textfield',
				id :'pj_srchDelivery_plan',
		        name : 'pj_srchDelivery_plan',
		        labelSeparator: ':',
		        readOnly: true,
		 		fieldStyle: 'background-color: #E7EEF6; background-image: none;text-align:center;'
	 		}
		);
		arrProjectToolbar.push('-');
		arrProjectToolbar.push(  
				{
					fieldLabel: toolbar_pj_rep,
			        labelWidth: 42,
			        width: 100,
			        xtype: 'textfield',
					id :'pj_srchPm_id',
			        name : 'pj_srchPm_id',
			        labelSeparator: ':',
			        readOnly: true,
			 		fieldStyle: 'background-color: #E7EEF6; background-image: none;text-align:center;'
		 		}
			);
		
		
		if(haseExcelPrint==true) {
			arrProjectToolbar.push('->'); 
			arrProjectToolbar.push(
				    {
				        text: excel_download_text,
				        iconCls: 'MSExcelX',
				        menu: {
				            items: [
				                {
				                    text: current_view_text,//'Major Fields | Current Rows',
				    		        handler: printExcelHandler
				                },
				                {
				                    text: all_rows_text,//'Major Fields | All Rows',
				    		        handler: printExcelHandlerAll
				                }
				            ]
				        }
				    }
		    );
		}
	}
	return arrProjectToolbar;
	
}
var SELECTED_PJ_UID_BY_COMBO = -1; 

function getProjectToolbarSimple(hasNull) {

	var projectStore = Ext.create('Mplm.store.ProjectStore', {hasNull: hasNull} );
  	var processInfoStore = Ext.create('Mplm.store.ProcessInfoStore', {} );  
  	var fitGroupStore = Ext.create('Mplm.store.FitGroupStore', {} );
	var arrProjectToolbar = [];
	var ac_uid = null;
    var pj_code = null;
	arrProjectToolbar.push(
			{
				id :'uid_srcahd_in_pjUid',
		        name : 'uid_srcahd_in_pjUid',
		        xtype: 'combo',
		        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
		        store: projectStore,
		        displayField:   'pj_code',
		        valueField:     'uid_srcahd',
		        sortInfo: { field: 'create_date', direction: 'DESC' },
		        typeAhead: false,
		        hideLabel: true,
		        minChars: 2,
		        width: 182,
		        listConfig:{
		            loadingText: 'Searching...',
		            emptyText: 'No matching posts found.',
		            getInnerTpl: function() {
		                return '<div data-qtip="{unique_id}"><small>{pj_code} <font color=blue>{description}</font></small></div>';
		            }			                	
		        },
		        listeners: {
		        	select: function (combo, record) {
		 			    ac_uid = record[0].get('unique_id');
		 			    pj_code = record[0].get('pj_code');
		 				SELECTED_PJ_UID_BY_COMBO = ac_uid;
		        		switch(vCUR_MENU_CODE) {
			        		case 'EPC3':
	                		    store.proxy.extraParams.ac_uid = ac_uid;
	                		    store.load({});
			        			
			        			break;
			        		default:
			        			
		        		}
		 			}//endofselect
					,afterrender: function(combo) {
					callbackToolbarRenderrer('CommonProjectAssy', 'not-use', combo, 'simple');
			    }
				
		        }
			});
			
			arrProjectToolbar.push('-');
			
			arrProjectToolbar.push(
			{

            	fieldLabel: toolbar_pj_moldno,
            	labelWidth: 40,
            	width: 150,
            	labelSeparator: ':',
            	xtype: 'textfield',
            	id : 'pj_code',
            	name : 'pj_code',
            	listeners : {
            		specialkey : function(field, e) {
                		  var pj_code =	Ext.getCmp('pj_code').value;
                          store.getProxy().setExtraParam('pj_code', pj_code);
                          if (e.getKey() == Ext.EventObject.ENTER) {
			        			store.load(function(){});

                          } 
                	}
            		
        		}
            });
//}
			arrProjectToolbar.push('-'); 
			
			arrProjectToolbar.push(
		    {
          	fieldLabel: handler_part_no,
            	labelWidth: 70,
           	width: 150,
           	labelSeparator: ':',
           	xtype: 'textfield',
           	id : 'pl_no',
           	name : 'pl_no',
           	listeners : {
            		specialkey : function(field, e) {
           			  var pj_code =	Ext.getCmp('pj_code').value;
                        var pl_no =	Ext.getCmp('pl_no').value;
                          store.getProxy().setExtraParam('pj_code', pj_code);
                         store.getProxy().setExtraParam('pl_no', pl_no);
                          if (e.getKey() == Ext.EventObject.ENTER) {
			        			store.load(function(){});
                         } 
                	}
           		
       		}
            }
			);
			
			arrProjectToolbar.push('-'); 
			
			arrProjectToolbar.push(
            {
                text: ppo2_all,
                iconCls: 'search',
                id : 'search',
                disabled: false,
                handler: function (){	
                      var pj_code =	Ext.getCmp('pj_code').value;
                      var pl_no =	Ext.getCmp('pl_no').value;
                      store.getProxy().setExtraParam('pj_code', pj_code);
                      store.getProxy().setExtraParam('pl_no', pl_no);
                      store.load(function(){});  		                        	
                }//endofhandler
            }
			);
	
			arrProjectToolbar.push(
            {
                text: handler_detail,
                iconCls: 'application_view_detail',
                iconAlign: 'left', 
                disabled: false,
                handler: function ()
                {


    	        	var selections = grid.getSelectionModel().getSelection();
		            if (selections.length) {
		            	for(var i=0; i< selections.length; i++) {
    	            		var rec = selections[i];
    	              	    cartmap_uid = rec.get('cartmap_uid');
    	              	    srcahd_uid = rec.get('srcahd_uid');
    	              		pl_no = rec.get('pl_no');
		            	}
		            } else{
    	             	     alert(handler_choose_view);
    	             		 return;
    	  
		            }
		            
		            processInfoStore.proxy.extraParams.cartmap_uid = cartmap_uid;           //给后台传递参数
                   	processInfoStore.proxy.extraParams.srcahd_uid = srcahd_uid;
                   	processInfoStore.proxy.extraParams.pl_no = pl_no;
                       
                	//Grid load data
                	processInfoStore.load( function() {
       	 			
   	 					var partInfoGrid = Ext.create('Ext.grid.Panel', {
   	     			        store: processInfoStore,
   	     			        stateId: 'stateGrid-partGrid',
   	     			    	autoScroll: true,
   	     			    	id: 'formPanel',
   				        	autoHeight: true,
   	     			        layout: 'fit',
   	     			        height:420,
   	     					multiSelect : false,
   	     		        	columns: [ { text     : ppo2_serial,  width : 70,  sortable : true, dataIndex: 'view_serial_no'  },
   	     		                { text     : handler_part_no,  width : 100,  sortable : true, dataIndex: 'pl_no'  },
   	     		                { text     : handler_process_code,  width : 70,  sortable : true, dataIndex: 'pcs_code'  },
   	     		                { text     : handler_process_name,  width : 70,  sortable : true, dataIndex: 'pcs_name'  },
   	     		                { text     : aus4_machine,  width : 70,  sortable : true, dataIndex: 'mchnCode_userName'  },
   	     		            	{ text     : handler_operator,  width : 80,  sortable : true, dataIndex: 'operator_name'  },
   	     		                { text     : handler_part_status,  width : 80,  sortable : true, dataIndex: 'partStatus'  },
   	     		                { text     : ppo2_comment,  width : 150,  sortable : true, dataIndex: 'description'  },
   	     		            	{ text     : handler_start_time,  width : 150,  sortable : true, dataIndex: 'start_date', renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')},
   	     		                { text     : handler_end_time,  width : 150,  sortable : true, dataIndex: 'end_date', renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')},
   	     		           	    { text     : handler_real_time,  width : 70,  sortable : true, dataIndex: 'real_time'}
   	     		                ],		    		           	     			
   	     			        viewConfig: {
   	     			            stripeRows: true,
   	     			            enableTextSelection: false,
   	     			            getRowClass: function(record) { 
   	     			        	//	return record.get('pcs_code')  == selectedPcs_code ? 'selected-row' : ''; 
   	     			            } ,
   	     			            listeners: {
   	     			                itemdblclick:  function(dv, record, item, index, e) {
   	     			                    //alert('working');
   	     			                }

   	     			            }
   	     			        }
   	     			    });
       	 					
   	 				    
   	 					partInfoGrid.getSelectionModel().on({
	       	 		        selectionchange: function(sm, selections) {
	     
	       	 		        }
       	 		    	});
       	 		        
       	 			
  						var win = Ext.create('widget.window', {
  						    	title: handler_detail,
  								modal:true,
  								plain:true,
  								closable: true,
  								closeAction: 'hide',
  								width: 800,
  								minWidth: 350,
  								height: 550,
  								layout: {
  									type: 'border',
  									padding: 5
  								},              
		  	 			   	   items: [{
									region: 'west',
								    title: '&nbsp;&nbsp;',
									width: 780,
									split: true,
									collapsible: false,
									floatable: false,
									items: [partInfoGrid]
								}
		  	                     ],
	       	               		buttons: [
	       	               		          /*{
		       	                 	text: processInput02_msg05,
		       	             		handler: function(){

		       	             			
									}
	       	            		},
	       	            		*/{
	       	             			text: handler_close,
	       	             			handler: function(){
	       	             				if(win) {win.close();} 
	       	             			}
	       	             		}]
					});

       	         win.show();

       	      		//cenerFinishCallback();//Load Ok Finish Callback
       	 					
       	 		});//endofload

                }//endofhandler
            });
			
			arrProjectToolbar.push(
			{
	               text: handler_query_finish,
                   iconCls: 'tasks-mark-complete',
                   iconAlign: 'left', 
                   disabled: false,
                   handler: function ()
                   {
                	   if(typeof mchn_code == 'undefined'){
                		   alert(handler_appoint_process);
                		   return;
                	   }
                    store.getProxy().setExtraParam('pcs_no', mchn_code);
                   	store.getProxy().setExtraParam('is_complished', 'Y'); 
                	store.getProxy().setExtraParam('epc3_finished_flag', '1'); 
                	store.getProxy().setExtraParam('notAssigned', ''); //查询完工数据,工件肯定是已分配给了具体的人/设备
                	
                   	
                   	store.load(function() {});
                 	store.getProxy().setExtraParam('epc3_finished_flag', '');   //清空缓存
                   	store.getProxy().setExtraParam('notAssigned', 'Y'); 
                   }//endofhandler
             });
			
			
			
			arrProjectToolbar.push({
                text: handler_receive_part,
                id: 'haveTextName',
                iconCls: 'EPMPerformSignoffTask',
                disabled: false,
                handler: function ()
                {
               
    	        	var selections = grid.getSelectionModel().getSelection();
		            if (selections.length) {

		            	var uidList =[];
						var cartmap_uid_list = [];
    	        		var pcswork_uid_list = [];
    	        		var serial_no_list = [];
    	        		var pj_code_list = [];
    	        		var pl_no_list = [];
    	        		var item_code_list = [];
    	        	
    	            	for(var i=0; i< selections.length; i++) {
    	            		var rec = selections[i];
    	            		var unique_uid = rec.get('unique_id');
    	            		var cartmap_uid = rec.get('cartmap_uid');
    	            		var pcswork_uid = rec.get('pcswork_uid');
    	            		var serial_no = rec.get('serial_no');
    	            		var pj_code = rec.get('pj_code');
    	            		var pl_no = rec.get('pl_no');
    	            		var item_code = rec.get('item_code');
    	            		var is_complished =  rec.get('is_complished');
    	            		if(is_complished != "R"){  //非接收状态的工件不能接收
    	            			continue;
    	            		}
    	            		uidList.push(unique_uid);
    	            		cartmap_uid_list.push(cartmap_uid);
    	            		pcswork_uid_list.push(pcswork_uid);
    	            		serial_no_list.push(serial_no);
    	            		pj_code_list.push(pj_code);
    	            		pl_no_list.push(pl_no); 	
    	            		item_code_list.push(item_code); 
    	            		    	  
    	            	}	



		    	        URL = CONTEXT_PATH + '/production/pcsline.do?method=updateBatchPcsStepWaitProcess&crit_type=H';		
		    	          	
			    	    if(URL!=null) {
			    	   		 Ext.Ajax.request({                           
	 							 
 	    						url: URL,			
 		         				params:{
		          	           		unique_id_str : uidList,
		          	           		cartmap_uid_str : cartmap_uid_list,
		          	      			pcswork_uid_str : pcswork_uid_list,
		          	      			serial_no_str : serial_no_list,
		          	        		pj_code_str : pj_code_list,
		          	      			pl_no_str : pl_no_list,
		          	      		    item_code_str : item_code_list,
		          	      		    worker_uid : -1,
		          	      			machine_uid : -1
		          	      			
 		         				},
 		    						
 	    						success : function(result, request) {
 	    							var ret = result.responseText;
 	    							console_log(ret);
 	    							
 	    							if(ret == 1 ||  ret  == '1') {    
 	    				  
 	    								 store.load(function(){});  
 	    							} else {
 	    								//Ext.MessageBox.alert(processInput02_msg10, processInput02_msg11); 
 	    								  store.load(function(){});  	
 	    							}
 	    							console_log('requested ajax...');
 	    						},
 	    						failure: extjsUtil.failureMessage
 	    					});
								
			    	    }
		            	displayProperty(selections[0]);
		            	
		            	
		            } else {
		            	
		            }
                	// store.save({}); 
                }//endofhandler
            });
	arrProjectToolbar.push('->');
	
	arrProjectToolbar.push(
			{
				id :'reserved_varchar6',
		        name : 'reserved_varchar6',
		        xtype: 'combo',
		        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
		        store: fitGroupStore,
		        displayField:   'user_id',
		        valueField:     'user_id',
		        sortInfo: { field: 'user_id', direction: 'asc' },
		        typeAhead: false,
		        hideLabel: true,
		        minChars: 2,
		        width: 182,
		        listConfig:{
		            loadingText: 'Searching...',
		            emptyText: 'No matching posts found.',
		            getInnerTpl: function() {
		                return '<div>{user_id} <font color=blue>{description}</font></small></div>';
		            }			                	
		        },
		        listeners: {
		        	select: function (combo, record) {
		        		selectedGroup = combo.getValue();
		 				console_log("select");
		        		
		 			}//endofselect
					,afterrender: function(combo) {

			    }
				
		        }
			});

//			arrProjectToolbar.push('-'); 
	function myAssignActionConfirm(btn) {

			var result = MessageBox.msg('{0}', btn);
			var count = 0;
			if (result == 'yes') {
				Ext.Ajax.request({
					url: CONTEXT_PATH + '/production/pcsline.do?method=updateFitGroup',				
					params:{
						reserved_varchar6 : Ext.getCmp('reserved_varchar6').getValue(),
						pj_uid : ac_uid,
						pj_code : pj_code
					},
					
					success : function(result, request) {
						Ext.MessageBox.alert('Result',result.responseText);
					},
					failure: extjsUtil.failureMessage
				});
			}

	};
	var myAssignAction = Ext.create('Ext.Action', {
		itemId: 'saveButton',
	    iconCls: 'save',
	    text: 'Save',
	    disabled: false,
		handler : function(widget, event) {
			Ext.MessageBox.show({
				title : 'Assign',
				msg : 'Are you Confirm',
				buttons : Ext.MessageBox.YESNO,
				fn : myAssignActionConfirm,
				// animateTarget: 'mb4',
				icon : Ext.MessageBox.QUESTION
			});
		}
	    
	});
	arrProjectToolbar.push(myAssignAction);
			
	return arrProjectToolbar;
	
}


function getProjectTreeToolbar() {
	var disCav_no = cav_text;
	var arrPjTreetoolbar = [];
	var combotree= null;
	if(vCUR_MENU_CODE == 'PPO1' || vCUR_MENU_CODE == 'PPO1_CLD' || vCUR_MENU_CODE == 'PRF3' || vCUR_MENU_CODE == 'PRF1'){
		arrPjTreetoolbar.push(
				{
					xtype: 'checkboxfield',
			        id: 'switch',
			        checked: true,
			        inputValue: '-1',
			        listeners:{
		                   change:function(checkbox, checked){
		                	   console_log(checked);
		                	   if(checked == false){
		                		   combotree.disable();
		                		   store.proxy.extraParams.ac_uid = '-2';
		                		   store.load({});
		                	   }else{
		                		   combotree.enable();
		                		   store.proxy.extraParams.ac_uid = selectedAssyUid;
		                		   store.load({});
		                	   }
		                   }
		               }
				});
	}
	
	if(vCUR_MENU_CODE == 'PMT1' || vCUR_MENU_CODE == 'PMT2'){
		arrPjTreetoolbar.push(
				actionBomCopy
		);
	}
	
	if(vCUR_MENU_CODE == 'PPO2'){
		arrPjTreetoolbar.push(
				{
					xtype: 'checkboxfield',
					id: 'complished',
					fieldLabel: 'All',
					labelWidth: 20,
					listeners:{
						change:function(checkbox, checked){
							if(checked == false){
								storeMenu.proxy.extraParams.is_complished = 'N';
								storeMenu.load({});
							}else{
								storeMenu.proxy.extraParams.is_complished = '%';
								storeMenu.load({});
							}
						}
					}
				}
		);
		arrPjTreetoolbar.push('-');
	}
	
	if(vCUR_MENU_CODE == 'PMT1_CLD' || vCUR_MENU_CODE == 'PMT2_CLD'){
		arrPjTreetoolbar.push(
				actionBomCopy
		);
	}
	
	arrPjTreetoolbar.push(
			combotree = Ext.create('Ext.ux.TreeCombo', {
			    margin:0,
			    width:120,
			    treeWidth: 240,
			    rootVisible: false,
			    id: 'mytree',
			    disabled: false,
			    fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			    store : storeMenu
				})
	);
	if(vCUR_MENU_CODE != 'DBM8' && vCUR_MENU_CODE != 'DDW2'
	&& vCUR_MENU_CODE != 'DDW6'&& vCUR_MENU_CODE != 'DDW8'
	&& vCUR_MENU_CODE != 'DDW9'&& vCUR_MENU_CODE != 'DDW7'){
		arrPjTreetoolbar.push('-');
		arrPjTreetoolbar.push(
				{
					fieldLabel: toolbar_pj_model,
					labelWidth: 42,
					width: 160,
					xtype: 'textfield',
					id :'pj_srchDescription',
					name : 'pj_srchDescription',
					labelSeparator: ':',
					readOnly: true,
					fieldStyle: 'background-color: #E7EEF6; background-image: none;'
				});
		if(vCUR_MENU_CODE != 'DBM1_ELE'){
			arrPjTreetoolbar.push('-');
			arrPjTreetoolbar.push(
					{
						fieldLabel: disCav_no,
						labelWidth: 30,
						width: 80,
						xtype: 'textfield',
						id :'pj_srchCav_no',
						name : 'pj_srchCav_no',
						labelSeparator: ':',
						readOnly: true,
						fieldStyle: 'background-color: #E7EEF6; background-image: none;'
					});
			
			arrPjTreetoolbar.push('-');
			arrPjTreetoolbar.push(
					{
						fieldLabel: toolbar_pj_spo_date,
						labelWidth: 42,
						width: 120,
						xtype: 'textfield',
						id :'pj_srchRegist_date',
						name : 'pj_srchRegist_date',
						labelSeparator: ':',
						readOnly: true,
						fieldStyle: 'background-color: #E7EEF6; background-image: none;text-align:center;'
					}
			);
			
			arrPjTreetoolbar.push('-');
			arrPjTreetoolbar.push(
					
					{
						fieldLabel: toolbar_pj_req_date,
						labelWidth: 42,
						width: 120,
						xtype: 'textfield',
						id :'pj_srchDelivery_plan',
						name : 'pj_srchDelivery_plan',
						labelSeparator: ':',
						readOnly: true,
						fieldStyle: 'background-color: #E7EEF6; background-image: none;text-align:center;'
					}
			);
			arrPjTreetoolbar.push('-');
			arrPjTreetoolbar.push(  
					{
						fieldLabel: toolbar_pj_rep,
						labelWidth: 42,
						width: 100,
						xtype: 'textfield',
						id :'pj_srchPm_id',
						name : 'pj_srchPm_id',
						labelSeparator: ':',
						readOnly: true,
						fieldStyle: 'background-color: #E7EEF6; background-image: none;text-align:center;'
					}
			);
		}
	}
	return arrPjTreetoolbar;
}


function getComboToolBar(){
	var SupastStore = Ext.create('Mplm.store.SupastStore', {hasNull: false} );
	var storeSrch = null;
	storeSrch = Ext.create('Mplm.store.UserStore', {hasNull: true} );
	storeSrch['cmpName'] = 'pr_user_name';
	var arrComboToolBar = [];
	
	arrComboToolBar.push(
			{
				id :'seller_name',
		        name : 'seller_name',
		        xtype: 'combo',
		        width: 250,
		        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
		        store: SupastStore,
		        emptyText:   ppo1_supplier_information,
		        displayField:   'supplier_name',
		        valueField:   'supplier_name',
		        value: '',
		        sortInfo: { field: 'create_date', direction: 'DESC' },
		        typeAhead: false,
		        hideLabel: true,
		        minChars: 2,
		        listConfig:{
		            loadingText: 'Searching...',
		            emptyText: 'No matching posts found.',
		            // Custom rendering template for each item
		            getInnerTpl: function() {
		                return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
		            }			                	
		        },
		        listeners: {
		        	select: function (combo, record) {
		        	}//endofselect
		        }
			}
	);
	if(vCUR_MENU_CODE == 'QGR2' || vCUR_MENU_CODE == 'QGR0' || vCUR_MENU_CODE == 'PPO3' || vCUR_MENU_CODE == 'PPO3_CLD'){
		arrComboToolBar.push(
				{
					id :'pr_user_name',
			        name : 'pr_user_name',
			        xtype: 'combo',
			        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			        store: storeSrch,
			        emptyText:   qgr2_pr_name,
			        displayField: 'user_name',
		            valueField:     'user_name',
			        sortInfo: { field: 'user_name', direction: 'ASC' },
			        typeAhead: false,
			        hideLabel: true,
			        width: 200,
			        minChars: 1,
			        listConfig:{
			            loadingText: 'Searching...',
			            emptyText: 'No matching posts found.',
			            // Custom rendering template for each item
			            getInnerTpl: function() {
			                return '<div data-qtip="{unique_id}">{user_name}</div>';
			            }			                	
			        }
				}
		);
	}
	return arrComboToolBar;
}

function getSearchToolBar(){
	var arrSearchToolBar = [];
	arrSearchToolBar.push(
			{
	        	width: 148,
	        	xtype: 'triggerfield',
	        	id :'var_item_code',
	        	name : 'var_item_code',
	        	emptyText:  pms1_item_code,
	        	labelSeparator: '',
	        	readOnly: false,
	        	listeners: {
	        		expand: function(){
	        		},
	        		collapse: function(){
	        		},
	        		change: function(d, newVal, oldVal) {
	        		},
	        		keypress: {
	        			buffer: 500,
	        			fn: function(field){
	        				var value = field.getValue();
	        				if (value !== null && field.isValid()) {
	        				}
	        			}
	        		},
	        		specialkey : function(fieldObj, e) {
		         		if (e.getKey() == Ext.EventObject.ENTER) {
		         			searchToolBarTap();
		         		}
			        }
	        	},
	        	trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
		         'onTrigger1Click': function() {
		         	Ext.getCmp('var_item_code').setValue('');
		     	}
			}
	);
	
	arrSearchToolBar.push(
			{
				width: 148,
				xtype: 'triggerfield',
				id :'po_no',
				name : 'po_no',
				emptyText:  qgr1_po_no,
				labelSeparator: '',
				readOnly: false,
				listeners: {
					expand: function(){
					},
					collapse: function(){
					},
					change: function(d, newVal, oldVal) {
					},
					keypress: {
						buffer: 500,
						fn: function(field){
							var value = field.getValue();
							if (value !== null && field.isValid()) {
							}
						}
					},
					specialkey : function(fieldObj, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							searchToolBarTap();
						}
					}
				},
				trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
				'onTrigger1Click': function() {
					po_no=Ext.getCmp('po_no').setValue('');
				}
			}
	);
	arrSearchToolBar.push(
			{
				width: 148,
				xtype: 'triggerfield',
				id :'gr_no',
				name : 'gr_no',
				emptyText:  qgr3_gr_no,
				labelSeparator: '',
				readOnly: false,
				listeners: {
					expand: function(){
					},
					collapse: function(){
					},
					change: function(d, newVal, oldVal) {
					},
					keypress: {
						buffer: 500,
						fn: function(field){
							var value = field.getValue();
							if (value !== null && field.isValid()) {
							}
						}
					},
					specialkey : function(fieldObj, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							searchToolBarTap();
						}
					}
				},
				trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
				'onTrigger1Click': function() {
					Ext.getCmp('gr_no').setValue('');
				}
			}
	);
	
	arrSearchToolBar.push(
			{
				width: 148,
				xtype: 'triggerfield',
				id :'item_name',
				name : 'item_name',
				emptyText:  pms1_item_name,
				labelSeparator: '',
				readOnly: false,
				listeners: {
					expand: function(){
					},
					collapse: function(){
					},
					change: function(d, newVal, oldVal) {
					},
					keypress: {
						buffer: 500,
						fn: function(field){
							var value = field.getValue();
							if (value !== null && field.isValid()) {
							}
						}
					},
					specialkey : function(fieldObj, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							searchToolBarTap();
						}
					}
				},
				trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
				'onTrigger1Click': function() {
					Ext.getCmp('item_name').setValue('');
				}
			}
	);
	if(vCUR_MENU_CODE == 'QGR2' || vCUR_MENU_CODE == 'QGR0')
		arrSearchToolBar.push(
				{
					width: 148,
					xtype: 'triggerfield',
					id :'barcode',
					name : 'barcode',
					emptyText:  qgr1_barcode,
					labelSeparator: '',
					readOnly: false,
					listeners: {
						expand: function(){
						},
						collapse: function(){
						},
						change: function(d, newVal, oldVal) {
						},
						keypress: {
							buffer: 500,
							fn: function(field){
								var value = field.getValue();
								if (value !== null && field.isValid()) {
								}
							}
						},
						specialkey : function(fieldObj, e) {
							if (e.getKey() == Ext.EventObject.ENTER) {
								searchToolBarTap();
							}
						}
					},
					trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
					'onTrigger1Click': function() {
						Ext.getCmp('barcode').setValue('');
					}
				}
		);
	if(vCUR_MENU_CODE == 'PPO3')
		arrSearchToolBar.push(
				{
					width: 148,
					xtype: 'triggerfield',
					id :'item_code',
					name : 'item_code',
					emptyText:  toolbar_pj_moldno,
					labelSeparator: '',
					readOnly: false,
					listeners: {
						expand: function(){
						},
						collapse: function(){
						},
						change: function(d, newVal, oldVal) {
						},
						keypress: {
							buffer: 500,
							fn: function(field){
								var value = field.getValue();
								if (value !== null && field.isValid()) {
								}
							}
						},
						specialkey : function(fieldObj, e) {
							if (e.getKey() == Ext.EventObject.ENTER) {
								searchToolBarTap();
							}
						}
					},
					trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
					'onTrigger1Click': function() {
						Ext.getCmp('item_code').setValue('');
					}
				}
		);
	return arrSearchToolBar;
}


function insertTextField(field_id) {
	var srchId = getSearchField(field_id); // 'srch' + fieldObj.substring(0,1).toUpperCase()+ fieldObj.substring(1);
//	
//	alert(srchId);
//	var o = getSearchObject(field_id);
//	if(o!=null) {
//		alert('aleadt exist : ' + srchId);
//	}
	
	/*(G)*/vSRCH_TOOLBAR.push(
	{
         xtype: 'triggerfield',
         emptyText: getTextName(/*(G)*/vCENTER_FIELDS, field_id),
         id: srchId,
	     	listeners : {
	         		specialkey : function(fieldObj, e) {
	         		if (e.getKey() == Ext.EventObject.ENTER) {
	         			searchHandler();
	         			//srchSingleHandler (store, srchId, fieldObj, isWild);
	         		}
	         	}
	     	},
         trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
         'onTrigger1Click': function() {
         	Ext.getCmp(srchId).setValue('');
     	}

		}
	);
}

function insertHiddenField(field_id) {
	var srchId = getSearchField(field_id);
	/*(G)*/vSRCH_TOOLBAR.push(
		new Ext.form.Hidden({
	    	id: srchId,
	       name: srchId
	    })
	);
}

function insertRadioField(field_id, childObjs) {
	var srchId = getSearchField(field_id);
	
	//hidden field.
	/*(G)*/vSRCH_TOOLBAR.push(new Ext.form.Hidden({ id: srchId, name: srchId}));

	var togGroup = 'tog' + field_id;
	//combo buttons.
	Ext.each(childObjs['items'], function(fieldObj, index) {
		
		var pressed = fieldObj['pressed'];
	 	var text = fieldObj['text'];
	 	var iconCls = fieldObj['iconCls'];
	 	var value = fieldObj['value'];
	 	vSRCH_TOOLBAR.push(
        { 
        	xtype : "button", 
    		toggleGroup: togGroup,
    		pressed: pressed,
    	 	text : text,
    	 	value: value,
    	 	iconCls: iconCls,	
    		handler: function(){
    		    var hiddenFrm = Ext.getCmp(srchId); 
    		    hiddenFrm.setValue(this.value);
    		    console_log('set to ' + srchId + ':' + this.value);
    		}
    	});
	});
}

function insertComboField(field_id, fieldObj) {
	var srchId = getSearchField(field_id); // 'srch' + fieldObj.substring(0,1).toUpperCase()+ fieldObj.substring(1);

	var storeId = fieldObj['store'];
	var arrField = fieldObj['fields'];
	var displayField = fieldObj['displayField'];
	var valueField = fieldObj['valueField'];
	var innerTpl =  fieldObj['innerTpl'];
	
	var width = 200;
	var widthIn = fieldObj['width'];
	if(widthIn!=undefined && widthIn!=null) {
		width = widthIn;
	}
	
	var storeSrch = null;
	var mode = null;
	var queryMode = null;
	if(storeId!=undefined && storeId!=null) {
		var storeName = 'Mplm.store.' + storeId;
		storeSrch = Ext.create(storeName, {hasNull: true} );
		if(storeId == 'BuyerStore') {
			storeSrch['cmpName'] = field_id;
			storeSrch['minChars'] = 1;
		}
		queryMode = 'remote';
		mode = 'remote';
	} else if(arrField!=undefined && arrField!=null) {
		
		storeSrch = Ext.create('Ext.data.Store', {
               fields : arrField,
               data   : []
           	});
		queryMode = 'local';
		mode = 'local';
	}
	
	if(storeSrch!=null) {
		
		/*(G)*/vSRCH_TOOLBAR.push(
				new Ext.form.Hidden({
			    	id: srchId+ '_',
			       name: srchId + '_'
			    })
			);
		
		var myCombo = {
				id : srchId,
				storeId: storeId,
			    name : srchId,
			    xtype: 'combo',
			    store: storeSrch,
			    mode: mode,
			    queryMode: queryMode,
			    emptyText: getColName(field_id),
			    displayField:  displayField,
			    valueField:    valueField,
			    width: width,
			    minChars: 1,
			    forceSelection: false,
			    //loading: true,
			    //autoLoad: true,
			    fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                   triggerAction: 'all',
   	               	listeners: {
   	                    select: function (combo, record) {	
   	                    	var selected = (record[0] ).get('unique_id_long');
   	                    	var o = ( Ext.getCmp(srchId + '_') );
   	                    	o.setValue(selected);
   	                    	callbackToolbar(field_id, selected, record[0]);
   	                    	
   	                    	console_log('call ajax default Set');
	   	     				Ext.Ajax.request({
		   	 					url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',			
		   	 					params:{
		   	 						paramName : storeId,
		   	 						paramValue : selected// + ':' + disp
		   	 					},
		   	 					
		   	 					success : function(result, request) {
		   	 						console_log('success defaultSet');
		   	 					},
			   	 				failure: function(result, request){
			   	 				console_log('fail defaultSet');
			   	 				} /*extjsUtil.failureMessage*/
		   	 				});
   	                    }
						,
						
					    afterrender: function(combo) {
					    	callbackToolbarRenderrer(this.storeId, srchId, combo, 'general');
					    }

   	               	},
			    listConfig:{
			        getInnerTpl: function() {
			        	
			        	return  innerTpl; // '<div class="x-combo-list-item" style="background: red;" data-qtip="{unique_id}">[{wa_code}] {wa_name}</div>';
			        }			                	
			    }
			};

		
		/*(G)*/vSRCH_TOOLBAR.push(myCombo);
		
	}//endofif storeSrch notnull
}

function makeSrchToolbar(arrField) {
	var menuName=vCUR_MENU_CODE;
	GsearchField = arrField;
	/*(G)*/vSRCH_TOOLBAR = [];//초기화
	
	if(arrField!=null && arrField.length>0) {
	
		Ext.each(arrField, function(fieldObj, index) {
			//종전코드호환성
			if(typeof fieldObj == 'string') { //text search

				insertTextField(fieldObj);
				/*(G)*/vSRCH_TOOLBAR.push('-');
				
			} else if (typeof fieldObj == 'object') { //combo search
				var type = fieldObj['type'];
				
				if(type==undefined || type==null) {
					type = 'combo';
				}
				
				var field_id = fieldObj['field_id'];
				switch(type) {
				
					case 'text':
						insertTextField(field_id);
						break;
					case 'hidden':
						insertHiddenField(field_id);
						break;
					case 'combo':
						 insertComboField(field_id, fieldObj);
						 break;
					case 'radio':
						insertRadioField(field_id, fieldObj);
						 break;
						
				}//endof switch
				if(type!='hidden') {
					/*(G)*/vSRCH_TOOLBAR.push('-');
				}
			}//endof else if (typeof fieldObj == 'object')

		});

	}//endofif

}

function Record2MainColumn(objfieldColumn) {
	inRec2Col(objfieldColumn, vCENTER_FIELDS, vCENTER_COLUMNS, vSRCH_TOOLTIP);
	
}

function Record2SubColumn(objfieldColumn) {
	inRec2Col(objfieldColumn, vCENTER_FIELDS_SUB, vCENTER_COLUMN_SUB, vSRCH_TOOLTIP_SUB);
}


function loadFieldInfoMulti(main_menuKey, sub_menuKey, linkPath, flag1, flag2, flag3, flag4, flag5) {
	
	console_log('sub_menuKey=' + sub_menuKey);
	(new Ext.data.Store({ model: 'ExtFieldColumn'}) ).load({
	    params: {
	    	menuCode: main_menuKey
	    },
	    callback: function(mainRecords, mainOperation, mainSuccess) {  	
	    	if(mainSuccess ==true) {
	    		var codeFieldListMain = getCodeFieldListMain(mainRecords);
//		        for (var i=0; i<mainRecords.length; i++){
//		        	Record2MainColumn( mainRecords[i]);
//		        }//endoffor
		    	(new Ext.data.Store({ model: 'ExtFieldColumn'}) ).load({
		    	    params: {
		    	    	menuCode: sub_menuKey
		    	    },
		    	    callback: function(records, operation, successSub) {
		    	    	if(successSub ==true) {
		    	    		var codeFieldListSub = getCodeFieldListMain(records);
				    	        for (var i=0; i<records.length; i++){
				    	        	Record2SubColumn(records[i]);
				    	        }//endoffor
				    	        //console_log(vCENTER_FIELDS_SUB);
				    	        //console_log(vCENTER_COLUMN_SUB);
				    	        if((codeFieldListMain == undefined || codeFieldListMain==null  || codeFieldListMain.length==0)&&(codeFieldListSub == undefined || codeFieldListSub==null  || codeFieldListSub.length==0)) {
					    			//console_log('옛날....');
							        for (var i=0; i<mainRecords.length; i++){
							        	Record2MainColumn( mainRecords[i]);
							        }						    		
				    	        LoadJs(linkPath);
				    	        } else {
					    			loadCodeGroup(codeFieldListMain, mainRecords, linkPath, flag1, flag2, flag3, flag4, flag5);
					    			loadCodeGroupSub(codeFieldListSub, records, linkPath, flag1, flag2, flag3, flag4, flag5);
					    		}
		    	    	} else {//ifsubSuccess
		    	    		lfn_gotoHome();
		    	    	}
		    	    	
		    	    },//endof subcallback
		    	    scope: this
		    	});//endofload
		        
	    	} else {
	    		lfn_gotoHome();
	    	}
	    	
	    },//endofcallback
	    scope: this
	});//endofload
}//endoffunction

function getCodeFieldListMain(records) {
	
	var fieldList = [];
	
	for (var i=0; i<records.length; i++){
		var rec = records[i];
		var type =  rec.get('type');
		var arr = type.split(':');
		if(arr.length>1 && arr[0] == 'code') {
			fieldList.push( arr[1] );
		}
    }//endoffor
		
	return fieldList;
}

//var EMC5_CAUSE_TYPE = {
//WMT : 'fgwfefwe',
//AFIM: 'dfgdfg',
//NTD: 'fefe'
//};
//var EMC5_CAUSE_TYPE = { 'WMT':'작업자실수' ,'AFIM':'기계고장' ,'NTD':'자연재해'	}; 

function loadCodeGroup(parentList, records, linkPath, flag1, flag2, flag3, flag4, flag5) {
	Ext.Ajax.request({
	//url: CONTEXT_PATH + '/code.do?method=codenameJs',
	url: CONTEXT_PATH + '/code.do?method=codelistJs',
	params:{
		//parentCode : codeName
		parentList : parentList
	},
	success : function(result, request) {
		
		console_log(result.responseText);
		eval(result.responseText);
		for (var i=0; i<records.length; i++){
    	Record2MainColumn(records[i]);
    }//endoffor
	    LoadJs(linkPath);
	},
	failure: extjsUtil.failureMessage
	});
}
function loadCodeGroupSub(parentList, records, linkPath, flag1, flag2, flag3, flag4, flag5) {
	Ext.Ajax.request({
	//url: CONTEXT_PATH + '/code.do?method=codenameJs',
	url: CONTEXT_PATH + '/code.do?method=codelistJs',
	params:{
		//parentCode : codeName
		parentList : parentList
	},
	success : function(result, request) {
		
		console_log(result.responseText);
		eval(result.responseText);

	},
	failure: extjsUtil.failureMessage
	});
}


function loadFieldInfo(menu_key, linkPath, flag1, flag2, flag3, flag4, flag5) {
	(new Ext.data.Store({ model: 'ExtFieldColumn'}) ).load({
	    params: {
	    	menuCode: menu_key
	    },
	    callback: function(records, operation, success) {
	    	
	    	
	    	if(success ==true) {
	    		//Code Field Info 읽기.
	    		//1. 읽을 필드명 가져오기
	    		var codeFieldListMain = getCodeFieldListMain(records);
	    		console_log(codeFieldListMain);
	    		if(codeFieldListMain == undefined || codeFieldListMain==null  || codeFieldListMain.length==0) {

		    		for (var i=0; i<records.length; i++){
			        	Record2MainColumn(records[i]);
			        }//endoffor
			        LoadJs(linkPath, flag1, flag2, flag3, flag4, flag5);
	    		} else {
	    			loadCodeGroup(codeFieldListMain, records, linkPath, flag1, flag2, flag3, flag4, flag5);
	    		}
	    		
	    		//2. 한꺼번에 Ajax로 읽고. 아래 메소드를 hanler로 넣는다.	    	
	    	} else {
	    		lfn_gotoHome();
	    	}
	    },
	    scope: this
	});
}

var cenerLoadingPln = null;
function cenerFinishCallback() {
	if(cenerLoadingPln!=null) {
		cenerLoadingPln.setLoading(false);
	}
}
function menuAction(menu_key, service_name, displayName, linkPath, permType, flag1, flag2, flag3, flag4, flag5) {

	console_log('menuAction:' + menu_key +':'+ service_name +':'+ displayName +':'+ linkPath +':'+ permType);
	//close user info
	closeUserByUserId();
	
	cenerLoadingPln = Ext.getCmp( 'mainview-content-panel' );
	if(cenerLoadingPln!=null) {
		cenerLoadingPln.setLoading(true);
	}
	
	var tempportPnl = Ext.getCmp( 'tempport' );
	if(tempportPnl!=null) {
		tempportPnl.setLoading(true);
	}
	
	/*(G)*/vCUR_MENU_CODE = menu_key;
	/*(G)*/vCUR_MENU_NAME = displayName;
	/*(G)*/vCUR_GROUP_NAME = service_name;
	/*(G)*/vCUR_LINK_PATH = linkPath;
			/*(G)*/vFLAG1 = flag1;
		/*(G)*/vFLAG2 = flag2;
		/*(G)*/vFLAG3 = flag3;
		/*(G)*/vFLAG4 = flag4;
		/*(G)*/vFLAG5 = flag5;
	if(permType=='undefined' || permType== undefined) {
		console_log('menuAction : undefined: ' + vCUR_MENU_NAME);
	}else {
		/*(G)*/vCUR_MENU_PERM = permType;
	}
	

	Ext.each(/*(G)*/vLEFT_MENU_ITEMS, function(struct, index) {
		//var enValue = Ext.JSON.encode(struct);
		//console_log(enValue);
		
		var menuCode = struct['menuCode'];
		var serviceName = struct['serviceName'];
		if(service_name==serviceName) {
			/*(G)*/vCUR_GROUP_CODE = menuCode;
		}
			
	});

	console_log(/*(G)*/vCUR_MENU_CODE+':'+/*(G)*/vCUR_MENU_NAME+':'+/*(G)*/vCUR_GROUP_CODE+':'+/*(G)*/vCUR_GROUP_NAME);
	console_info('linkPath:' + linkPath);
	
	/*(G)*/vFILE_ITEM_CODE = RandomString(10);
	
	/*(G)*/vCENTER_FIELDS = [];
	/*(G)*/vCENTER_COLUMNS = [];
	/*(G)*/vSRCH_TOOLTIP = [];
	
	//second field info for split view
	/*(G)*/vCENTER_FIELDS_SUB = [];
	/*(G)*/vCENTER_COLUMN_SUB = [];
	/*(G)*/vSRCH_TOOLTIP_SUB = [];
	
	//Toolbar 초기화
	/*(G)*/vSRCH_TOOLBAR = [];

	collapseProperty();
	
	switch(menu_key) {
	case 'EPC1': //case for 2 store
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'EPC1_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'EPC8': //case for 2 store
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'EPC8_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'EPJ1': //case for 2 store
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'EPJ1_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'PPO2':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'PPO2_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
//	case 'QGR1':
//		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
//		loadFieldInfoMulti(menu_key, 'QGR1_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
//		break;
	case 'PRF1':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'PRF1_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'SQT1':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'SQT1_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'SQT2':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'SQT2_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'CRT3':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'CRT3_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'CRT00':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'CRT00_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'CRT2':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'CRT2_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'CRT4':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'CRT4_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;

	case 'ESC2':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'ESC2_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'DBM1_ELE':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'DBM1_ELE_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'EPC1_CLD': //case for 2 store
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'EPC1_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'EPC8_CLD': //case for 2 store
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'EPC8_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'EPJ1_CLD': //case for 2 store
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'EPJ1_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'PPO2_CLD':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'PPO2_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'QGR1_CLD':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'QGR1_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'PRF1_CLD':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'PRF1_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'SQT1_CLD':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'SQT1_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'SQT2_CLD':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'SQT2_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
		
	case 'CRT3_CLD':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'CRT3_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'CRT00_CLD':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'CRT00_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'CRT2_CLD':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'CRT2_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'CRT4_CLD':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'CRT4_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
		
	case 'ESC2_CLD':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'ESC2_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'PPR4_CLD':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'PPO1_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'SRO1_CLD':
	case 'PRF3_CLD':
	case 'DBM7_CLD':
	case 'PPR4':
	case 'DBM1':
	case 'PPO5_CLD':
	case 'DBM7':
	case 'DBM7_PLM':
	case 'EPJ2':
	case 'PPO1':
	case 'PRF3':
	case 'SRO1':
	case 'DBM1_CLD':
	case 'PPR2':
	case 'EPJ2_CLD':
	case 'PPO1_CLD':
	case 'CRT1':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'PPO1_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'DBM1_ELE_CLD':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'DBM1_ELE_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'PMS1': //case for 2 store
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'PMS1_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'EQU2': //case for 2 store
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'EQU1', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'QMS1': //case for 2 store
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'QMS1_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'QMS2': //case for 2 store
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'QMS2_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
	case 'VMF8': //case for 2 store
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'VMF8_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'DDW6':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'DDW6_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'DDW7':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'DDW6_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'DDW8':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'DDW6_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	case 'DDW9':
		console_info('multitleloadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfoMulti(menu_key, 'DDW6_SUB', linkPath, flag1, flag2, flag3, flag4, flag5);
		break;
	default:
		console_info('loadFieldInfo:' + menu_key +',' + linkPath);
		loadFieldInfo(menu_key, linkPath, flag1, flag2, flag3, flag4, flag5);
	}
	console_log('menuAction ok');
		
}

//writer define
Ext.define('Board.writer.SinglePost', {
    extend: 'Ext.data.writer.Writer',
    alternateClassName: 'Ext.data.SinglePostWriter',
    alias: 'writer.singlepost',

    writeRecords: function(request, data) {
    	//console_info(data);
    	//console_info(data[0]);
    	data[0].cmdType = 'update';
        request.params = data[0];
        return request;
    }
});

function resetParam(store, searchField) {
	Ext.each(searchField, function(fieldObj, index) {

		if(typeof fieldObj == 'string') { 
			try {
				store.getProxy().setExtraParam(fieldObj, null);	
			} catch(e) {}
			
		} else {//object
			field_id = fieldObj['field_id'];
			try {
				store.getProxy().setExtraParam(field_id, null);	
			} catch(e) {}
			/*
			try {
				store.getProxy().setExtraParam(field_id+ '_', null);	
			} catch(e) {}
			*/
		}

		
	});
}

function srchSingleHandler (store, widName, parmName, isWild) {
	
	console_info("srchSingleHandler");
	console_log(widName + ':' + parmName + ':' + isWild);
	
	resetParam(store, searchField);
	var val = Ext.getCmp(widName).getValue();
	//Ext.MessageBox.alert('val',val);
	var enValue = Ext.JSON.encode(val);
	//Ext.MessageBox.alert('enValue',enValue);
	
	var enValue1 = MyUtf8.encode(val);
	//Ext.MessageBox.alert('enValue1',enValue1);
	console_log(val);
	console_log(enValue);
	console_log(enValue1);
	
	store.getProxy().setExtraParam("srch_type", 'single');
	if(isWild) {
		val = '%' + enValue + '%';
	}
	console_info(val);
	store.getProxy().setExtraParam(parmName, val);
	
	store.load(function() {});
};

var searchToolBarTap = function() {
	console_info('searchToolBarTap');
	switch(vCUR_MENU_CODE){
	case 'PPR3' :
		store.getProxy().setExtraParam('srch_filter',srch_filter);
		break;
	case 'PPO2' :
		po_no=Ext.getCmp('po_no').getValue();
		is_complished=Ext.getCmp('is_complished').getValue();
		store.getProxy().setExtraParam('po_no',po_no);		
		store.getProxy().setExtraParam('is_complished',is_complished);		
		break;
	case 'QGR3' :
		var_item_code=Ext.getCmp('var_item_code').getValue();
		po_no=Ext.getCmp('po_no').getValue();
		gr_no=Ext.getCmp('gr_no').getValue();
		item_name=Ext.getCmp('item_name').getValue();
		seller_name=Ext.getCmp('seller_name').getValue();
		
		if( var_item_code!='' && var_item_code!=null){
			var_item_code=Ext.JSON.encode('%' + var_item_code + '%');
		}
		if( po_no!='' && po_no!=null){
			po_no=Ext.JSON.encode('%' + po_no + '%');
		}
		if( gr_no!='' && gr_no!=null){
			gr_no=Ext.JSON.encode('%' + gr_no + '%');
		}
		if( item_name!='' && item_name!=null){
			item_name=Ext.JSON.encode('%' + item_name + '%');
		}
		if( seller_name!='' && seller_name!=null){
			seller_name=Ext.JSON.encode('%' + seller_name + '%');
		}
		store.getProxy().setExtraParam('var_item_code',var_item_code);
		store.getProxy().setExtraParam('po_no',po_no);
		store.getProxy().setExtraParam('gr_no',gr_no);
		store.getProxy().setExtraParam('item_name',item_name);
		store.getProxy().setExtraParam('seller_name',seller_name);
		break;
	case 'QGR0' : 
	case 'QGR2' :
		var_item_code=Ext.getCmp('var_item_code').getValue();
		po_no=Ext.getCmp('po_no').getValue();
		gr_no=Ext.getCmp('gr_no').getValue();
		item_name=Ext.getCmp('item_name').getValue();
		barcode=Ext.getCmp('barcode').getValue();
		seller_name=Ext.getCmp('seller_name').getValue();
		pr_user_name=Ext.getCmp('pr_user_name').getValue();
		
		if( var_item_code!='' && var_item_code!=null){
			var_item_code=Ext.JSON.encode('%' + var_item_code + '%');
		}
		if( po_no!='' && po_no!=null){
			po_no=Ext.JSON.encode('%' + po_no + '%');
		}
		if( gr_no!='' && gr_no!=null){
			gr_no=Ext.JSON.encode('%' + gr_no + '%');
		}
		if( item_name!='' && item_name!=null){
			item_name=Ext.JSON.encode('%' + item_name + '%');
		}
		if( barcode!='' && barcode!=null){
			barcode=Ext.JSON.encode('%' + barcode + '%');
		}
		if( seller_name!='' && seller_name!=null){
			seller_name=Ext.JSON.encode('%' + seller_name + '%');
		}
		if( pr_user_name!='' && pr_user_name!=null){
			pr_user_name=Ext.JSON.encode('%' + pr_user_name + '%');
		}

		store.getProxy().setExtraParam('item_code',var_item_code);
		store.getProxy().setExtraParam('po_no',po_no);
		store.getProxy().setExtraParam('gr_no',gr_no);
		store.getProxy().setExtraParam('item_name',item_name);
		store.getProxy().setExtraParam('barcode',barcode);
		store.getProxy().setExtraParam('seller_name',seller_name);
		store.getProxy().setExtraParam('pr_user_name',pr_user_name);
		break;
	case 'PPO3_CLD' :
		var_item_code=Ext.getCmp('var_item_code').getValue();
		po_no=Ext.getCmp('po_no').getValue();
		gr_no=Ext.getCmp('gr_no').getValue();
		item_name=Ext.getCmp('item_name').getValue();
		seller_name=Ext.getCmp('seller_name').getValue();
		pr_user_name=Ext.getCmp('pr_user_name').getValue();
		
		if( po_no!='' && po_no!=null){
			po_no=Ext.JSON.encode('%' + po_no + '%');
		}
		if( gr_no!='' && gr_no!=null){
			gr_no=Ext.JSON.encode('%' + gr_no + '%');
		}
		if( item_name!='' && item_name!=null){
			item_name=Ext.JSON.encode('%' + item_name + '%');
		}
		if( seller_name!='' && seller_name!=null){
			seller_name=Ext.JSON.encode('%' + seller_name + '%');
		}
		if( pr_user_name!='' && pr_user_name!=null){
			pr_user_name=Ext.JSON.encode('%' + pr_user_name + '%');
		}
		
		store.getProxy().setExtraParam('var_item_code',var_item_code);
		store.getProxy().setExtraParam('po_no',po_no);
		store.getProxy().setExtraParam('gr_no',gr_no);
		store.getProxy().setExtraParam('item_name',item_name);
		store.getProxy().setExtraParam('seller_name',seller_name);
		store.getProxy().setExtraParam('pr_user_name',pr_user_name);
		break;
	case 'PPO3' :
		var_item_code=Ext.getCmp('var_item_code').getValue();
		po_no=Ext.getCmp('po_no').getValue();
		gr_no=Ext.getCmp('gr_no').getValue();
		item_name=Ext.getCmp('item_name').getValue();
		account_name=Ext.getCmp('item_code').getValue();
		seller_name=Ext.getCmp('seller_name').getValue();
		pr_user_name=Ext.getCmp('pr_user_name').getValue();
		
		if( po_no!='' && po_no!=null){
			po_no=Ext.JSON.encode('%' + po_no + '%');
		}
		if( gr_no!='' && gr_no!=null){
			gr_no=Ext.JSON.encode('%' + gr_no + '%');
		}
		if( item_name!='' && item_name!=null){
			item_name=Ext.JSON.encode('%' + item_name + '%');
		}
		if( account_name!='' && account_name!=null){
			account_name=Ext.JSON.encode('%' + account_name + '%');
		}
		if( seller_name!='' && seller_name!=null){
			seller_name=Ext.JSON.encode('%' + seller_name + '%');
		}
		if( pr_user_name!='' && pr_user_name!=null){
			pr_user_name=Ext.JSON.encode('%' + pr_user_name + '%');
		}
		
		store.getProxy().setExtraParam('var_item_code',var_item_code);
		store.getProxy().setExtraParam('po_no',po_no);
		store.getProxy().setExtraParam('gr_no',gr_no);
		store.getProxy().setExtraParam('item_name',item_name);
		store.getProxy().setExtraParam('account_name',account_name);
		store.getProxy().setExtraParam('seller_name',seller_name);
		store.getProxy().setExtraParam('pr_user_name',pr_user_name);
		break;
	case 'CRT2' :
	case 'CRT2_CLD' :
	case 'CRT4_CLD' :
	case 'CRT4' :
		var start_date=Ext.getCmp('start_date').getValue();
		var end_date=Ext.getCmp('end_date').getValue();
		
		store.getProxy().setExtraParam('srch_filter','');
		store.getProxy().setExtraParam('start_date',Ext.Date.format(start_date, 'Y-m-d'));
		store.getProxy().setExtraParam('end_date',Ext.Date.format(end_date, 'Y-m-d'));
		break;
	case 'EPJ2' :
		var regist_date_start=Ext.getCmp('regist_date_start').getValue();
		var regist_date_end=Ext.getCmp('regist_date_end').getValue();
		var delivery_plan_start=Ext.getCmp('delivery_plan_start').getValue();
		var delivery_plan_end=Ext.getCmp('delivery_plan_end').getValue();
		var end_date_start=Ext.getCmp('end_date_start').getValue();
		var end_date_end=Ext.getCmp('end_date_end').getValue();
		var srch_pj_code=Ext.getCmp('srch_pj_code').getValue();
		var srch_pj_name=Ext.getCmp('srch_pj_name').getValue();
		var srch_pm_uid=Ext.getCmp('srch_pm_uid').getValue();
		var srch_pl_uid=Ext.getCmp('srch_pl_uid').getValue();
		var srch_order_com=Ext.getCmp('buyercombo').getValue();
		var regist_date_switch=Ext.getCmp('regist_date_switch').getValue();
		var delivery_plan_switch=Ext.getCmp('delivery_plan_switch').getValue();
		var end_date_switch=Ext.getCmp('end_date_switch').getValue();
		
		srch_pj_name =  Ext.JSON.encode(srch_pj_name);
		
		store.getProxy().setExtraParam('srch_filter','');
		store.getProxy().setExtraParam('regist_date_start',regist_date_start);
		store.getProxy().setExtraParam('regist_date_end',regist_date_end);
		store.getProxy().setExtraParam('delivery_plan_start',delivery_plan_start);
		store.getProxy().setExtraParam('delivery_plan_end',delivery_plan_end);
		store.getProxy().setExtraParam('end_date_start',end_date_start);
		store.getProxy().setExtraParam('end_date_end',end_date_end);
		store.getProxy().setExtraParam('srch_pj_code',srch_pj_code);
		store.getProxy().setExtraParam('srch_pj_name',srch_pj_name);
		store.getProxy().setExtraParam('srch_pm_uid',srch_pm_uid);
		store.getProxy().setExtraParam('srch_pl_uid',srch_pl_uid);
		store.getProxy().setExtraParam('srch_order_com',srch_order_com);
		store.getProxy().setExtraParam('regist_date_switch',regist_date_switch);
		store.getProxy().setExtraParam('delivery_plan_switch',delivery_plan_switch);
		store.getProxy().setExtraParam('end_date_switch',end_date_switch);
		break;
	case 'EPC6' :
		if(systemCode != null){
			store.getProxy().setExtraParam('systemCode',systemCode);	
		}
		if(year_combo != null){
			store.getProxy().setExtraParam('yyyy',year_combo);		
		}
		if(month_combo != null){
			store.getProxy().setExtraParam('mm',month_combo);		
		}
		break;
	case 'VMF8' :
		console_log(Store_type);
		if(Weeks == null || Model == null){
			Weeks = 'null';
		}
		if(Store_type == 'detail'){
			store = store_detail;
			store.getProxy().setExtraParam('text_type',Weeks);
			store.getProxy().setExtraParam('task_title_x', Mold_name);
		}else{
			store = store_small;
			store.getProxy().setExtraParam('description','#DUE_PLAN_DETAIL');
		}
		store.getProxy().setExtraParam('reminder',Model);
		break;
	case 'VMF10' :
		store.getProxy().setExtraParam('reminder',Model);
		store.getProxy().setExtraParam('description','#DUE_PLAN_OVERAL');
		store.getProxy().setExtraParam('task_title','CAD');
		break;
	case 'VMF11' :
		store.getProxy().setExtraParam('reminder',Model);
		store.getProxy().setExtraParam('task_title_x', Mold_name);
		break;
	}
	console_log(store);
	store.getProxy().setExtraParam("srch_type", 'multi');
	store.load(function(record) {console_log(record);});
};


var searchHandler = function() {
	var myStore = store;
 	searchHandlerParam (myStore)
};


function searchHandlerParam (myStore) {

	if( GsearchField == undefined ||  GsearchField=='undefined' || GsearchField==null) {
		GsearchField = [];
	}
//	console_info('searchHandler');
//	console_log(GsearchField);
	resetParam(myStore, GsearchField);	
	
	myStore.getProxy().setExtraParam("srch_type", 'multi');
	
	var firstWid = null;
	
	try {
		Ext.each(GsearchField, function(fieldObj, index) {
				
			var dataIndex = '';
			
			if(typeof( fieldObj)  == 'string') { //text search
				dataIndex = fieldObj;
			} else {
				dataIndex = fieldObj['field_id'];
			}
			
			//console_log('111111dataIndex in search Handler: ' + dataIndex);
			
			var srchId = getSearchField(dataIndex); //'srch' + dataIndex.substring(0,1).toUpperCase()+ dataIndex.substring(1);
			var value = Ext.getCmp(srchId).getValue();
//			console_log('srchId:' + srchId + '=' + value);
			var value1 = null;
			
			if(firstWid==null) {
				firstWid = srchId;
			}

			try {
				value1 =Ext.getCmp(srchId + '_').getValue();	
			} catch(e){}		
			if(value1 !=null && value1 !='') {//콤보박스 히든밸류
				myStore.getProxy().setExtraParam(dataIndex, value1);
//				console_log('dataIndex:' + dataIndex + '=' + value1);
			} else {
				if(value!=null && value!='') {
					if(dataIndex=='unique_id' || dataIndex=='barcode'  || typeof fieldObj == 'object') {
						myStore.getProxy().setExtraParam(dataIndex, value);
						//console_log('dataIndex:' + dataIndex + '=' + value);
					}else {
						var enValue = Ext.JSON.encode('%' + value+ '%');
						myStore.getProxy().setExtraParam(dataIndex, enValue);
						//console_log('dataIndex:' + dataIndex + '=' + enValue);
					}//endofelse
				}//endofif
			
			}
			
			
		});
	} catch(noError){
		console_log(noError);
	}

	myStore.load(function() {
		if(firstWid!=null) {
			//console_log(firstWid);
			Ext.getCmp(firstWid).focus(false, 200);
			var obj = document.getElementById(firstWid + '-inputEl');
			obj.select();
			//console_log(obj);
		}
		
	});
}


var printExcelHandler = function() {
	
	resetParam(store, GsearchField);	

	store.getProxy().setExtraParam("srch_type", 'excelPrint');
	store.getProxy().setExtraParam("srch_fields", 'major');
	store.getProxy().setExtraParam("srch_rows", 'current');
	store.getProxy().setExtraParam("menuCode", vCUR_MENU_CODE );
	excelPrintFc (GsearchField);
};
var printExcelHandlerAll = function() {
	
	store.getProxy().setExtraParam("srch_type", 'excelPrint');
	store.getProxy().setExtraParam("srch_fields", 'major');
	store.getProxy().setExtraParam("srch_rows", 'all');
	store.getProxy().setExtraParam("menuCode", vCUR_MENU_CODE );  
    
	var count = Number(store.getProxy().getReader().rawData.count);
	if(count > 255) {
	    Ext.MessageBox.alert('Info', 'Record quantity is Limited to 255.', callBack);
	    function callBack(id) {
			excelPrintFc (GsearchField);
		}		
	} else {
		excelPrintFc (GsearchField);
	}
	
};
var printExcelHandlerFull = function() {
	resetParam(store, GsearchField);	

	store.getProxy().setExtraParam("srch_type", 'excelPrint');
	store.getProxy().setExtraParam("srch_fields", 'full');
	store.getProxy().setExtraParam("srch_rows", 'current');
	store.getProxy().setExtraParam("menuCode", vCUR_MENU_CODE );
	excelPrintFc (GsearchField);
};
var printExcelHandlerFullAll = function() {
	
	resetParam(store, GsearchField);	
	
	store.getProxy().setExtraParam("srch_type", 'excelPrint');
	store.getProxy().setExtraParam("srch_fields", 'full');
	store.getProxy().setExtraParam("srch_rows", 'all');
	store.getProxy().setExtraParam("menuCode", vCUR_MENU_CODE );
	
	var count = Number(store.getProxy().getReader().rawData.count);
	if(count > 255) {
	    Ext.MessageBox.alert('Info', 'Record quantity is Limited to 255.', callBack);
	    function callBack(id) {
			excelPrintFc (GsearchField);
		}		
	} else {
		excelPrintFc (GsearchField);
	}

};


function excelPrintFc (arrField) {
	
	try {
		Ext.each(arrField, function(fieldObj, index) {
			
			console_log(typeof fieldObj);
			
			var dataIndex = '';
			
			if(typeof fieldObj == 'string') { //text search
				dataIndex = fieldObj;
			} else {
				dataIndex = fieldObj['field_id'];
			}
			
			var srchId = getSearchField(dataIndex);; //'srch' + dataIndex.substring(0,1).toUpperCase()+ dataIndex.substring(1);
			var value = Ext.getCmp(srchId).getValue();
			
			if(value!=null && value!='') {
				if(dataIndex=='unique_id' || typeof fieldObj == 'object') {
						store.getProxy().setExtraParam(dataIndex, value);
				} else {
					var enValue = Ext.JSON.encode('%' + value+ '%');
					console_info(enValue);
					store.getProxy().setExtraParam(dataIndex, enValue);
				}//endofelse
			}//endofif

		});
	} catch(noError){}

	
	store.load({
	    scope: this,
	    callback: function(records, operation, success) {
	    	var excelPath = store.getProxy().getReader().rawData.excelPath;
	    	if(excelPath.length > 0) {
	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ excelPath;
	    		top.location.href=url;	
	    	}
	    }
	});
}



//내가 생성한 레코드인지 첵크
function getMyRecordFromSel(selections) {
	var records = [];
	
	if(selections==null) {
		return records;
	}
	
	for(var i=0; i< selections.length; i++) {
		var rec = selections[i];
		var creator_uid = rec.get('creator_uid');
		var release_flag = rec.get('release_flag');
		if( creator_uid == vCUR_USER_UID ){    
			records.push(rec);
		}
		if( release_flag == "N" ){    
			records.push(rec);
		}
	}
	return records;
	
}

function callbackToolbar(field_id, value, record) {
	
   	console_log('(makeSrchToolbar) selected ' + field_id + ':' + value);
   	if(record!=null) {
		switch(vCUR_MENU_CODE) {
		case 'SRO1':
		case 'DDP1':
		case 'SPD2':
			switch(field_id) {
				case 'order_com_unique' :
					selectedWaName = record.get('wa_name');
					selectedWaCode = record.get('wa_code');
				case 'pj_type' :
					console_log('call refilBModelCombo();');
					refillBModelCombo();
				break;
				case 'description':
					console_log('description combo set model_uid: ' + record.get('unique_id_long'));
					var oModelUid = getSearchObject('model_uid');
					oModelUid.setValue(record.get('unique_id_long'));
					break;
				default:
			}
			break;
		case 'VMF7':
			switch(field_id) {
				case 'group_code' :
					var selectedCode = record.get('systemCode')
					callReportServer(selectedCode);
				break;
			}
			break;
		}
   	}
}

function treatCommonProjectAssy(id, combo, callType) {
	console_log('id:'+id);
	var arr = id.split(';');
	var ac_uid = arr[0];
	selectedAssyUid = arr[1];
	console_log(ac_uid);
	var num = Number(ac_uid);
	console_log(num);
	var store = combo.store;
	store.load(function() {
 		var rec = store.getById(num);
 		console_log(rec);
 		if(rec!=null) {
			var pj_code = rec.get('pj_code');
				var ac_uid = rec.get('unique_id');
				var order_com_unique = rec.get('order_com_unique');
				var description = rec.get('description');
				var pj_name = rec.get('pj_name');
				var cav_no = rec.get('cav_no');
				var regist_date = rec.get('regist_date');
				var delivery_plan = rec.get('delivery_plan');
				var pm_id = rec.get('pm_id');
				var uid_srcahd = rec.get('uid_srcahd');
				
				if(regist_date.length>10) {
					regist_date = regist_date.substring(0,10);
				}
				if(delivery_plan.length>10) {
					delivery_plan = delivery_plan.substring(0,10);
				}
				
				console_log('description:' + description);
				console_log('pj_name:' + pj_name);
				console_log('cav_no:' + cav_no);
				console_log('regist_date:' + regist_date);
				console_log('delivery_plan:' + delivery_plan);
				if(vCUR_MENU_CODE != 'PPO2'){
					if(callType!='cloud') {
						Ext.getCmp('pj_srchDescription').setValue(description);
						Ext.getCmp('pj_srchCav_no').setValue(cav_no);
					}else {
						Ext.getCmp('pj_srchPj_name').setValue(pj_name);
					}
					Ext.getCmp('pj_srchRegist_date').setValue(regist_date);
					Ext.getCmp('pj_srchDelivery_plan').setValue(delivery_plan);
					
	 				CommonUsrAst.load(pm_id ,{
						 success: function(usrAst) {
							 try{
		 							var user_name = usrAst.get('user_name');
		 							Ext.getCmp('pj_srchPm_id').setValue(user_name);
							 }catch(e){}
				 		 }//endofsuccess
					});//emdofload
				}
				combo.setValue(pj_code);
    		
    		switch(vCUR_MENU_CODE) {
    		case 'PMT1':
    		case 'PMT1_CLD':
    		case 'DBM1':
    		case 'DBM1_ELE':
           		selectedAssyUid = uid_srcahd;
           		selectedMoldUid = ac_uid;
           		selectedMoldCode = pj_code;
           		selectedMoldCoord = order_com_unique;
           		selectedMoldName = pj_name;
 				addAction.enable();
 				store.getProxy().setExtraParam('uid_srcahd', selectedAssyUid);
 				store.load({});
    		case 'VST1':
    			selectedAssyUid = ac_uid;
           		store.getProxy().setExtraParam('ac_uid', selectedAssyUid);
    			break;
    		case 'VST4':
    			console_log('----------------------------------');
    			callGantt(ac_uid);
    			console_log('----------------------------------');
    			break;
    		}
 			
 			
 		}
	});
}


function treatBuyerStore(id, combo, srchId, callType) {
   	var o = ( Ext.getCmp(srchId + '_') );
   	o.setValue(id);
	
	var store = combo.store;
	store.load(function() {

  		console_log('afterrender: id=' + id);
  		if( id!='-1') {
     		var rec = store.getById(Number(id));
     		console_log(rec);
     		if(rec!=null) {
     		console_log(rec);
			selectedWaName = rec.get('wa_name');
			selectedWaCode = rec.get('wa_code');
     		combo.setValue(selectedWaName);
			console_log(selectedWaCode);
			console_log(selectedWaName);
			var record = [];
			record[0] = rec;
     		combo.fireEvent('select', combo, record);
			combo['forceSelection'] = true;								   	     			
     		}

  		}else {
			selectedWaName = '';
			selectedWaCode = '';
			var oModelUid = getSearchObject('model_uid');
			oModelUid.setValue('-1');
			oModelUid.clearValue();//text필드에 있는 name 삭제
			oModelUid.store.removeAll();//ModelUid필드에서 보여지는 값을 삭제					   	   	                
  		}
	});//endofload
}

function callbackToolbarRenderrer(storeId, srchId, combo, callType) {//type: mold, cloud, simple, general

	
	Ext.Ajax.request({
		url: CONTEXT_PATH + '/admin/menu.do?method=defaultGet',			
		params:{
			paramName : storeId
		},
		success : function(result, request) {
			console_log('success defaultGet');
			var id = result.responseText;
			
			switch(storeId) {
			case 'CommonProjectAssy':
				treatCommonProjectAssy(id, combo, callType);
				break;
			case  'BuyerStore':
				treatBuyerStore(id, combo, srchId, callType);
				break;
			}
    		
		},
		failure: function(result, request){
			console_log('fail defaultGet');
		} /*extjsUtil.failureMessage*/
	});
	
}
