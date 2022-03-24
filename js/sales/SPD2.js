var togIsNew = true;
var gSelectedTab = '1';
//not finished mold
var grid = null;
var store = null;

//Finished mold
var grid_sub = null;
var store_sub = null;

var dt = new Date();

var month = dt.getMonth()+1;
//	var day = dt.getDate();
//	var year = dt.getFullYear();


var year_combo = dt.getFullYear();
var month_combo = month;

var storeYear = null;
var storeMonth = null;

var moldFormTypeStore = null;


var Gtoday = TODAY_GLOBAL;
var this_year = Ext.Date.format(Gtoday,'Y');
var Towlength_year = this_year.substring(2,4);


function changeTab(selectedTab){

	console_log('selectedTab:' +selectedTab);
	gSelectedTab = selectedTab;
	if(gSelectedTab=='1') {
		searchHandler();
	} else {
		store2.getProxy().setExtraParam('year_combo', year_combo);
		searchHandlerParam(store2);
	}
}


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


 function cancelConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        var count = 0;
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var parent = rec.get('uid_srcahd');
            	var unique_id = rec.get('unique_id');
    			var projectmold = Ext.ModelManager.create({
    				unique_id : unique_id,
    				uid_srcahd : parent
	        	 }, 'ProjectMold');
        		
    			//projectmold.destroy( {
	           	//	 success: function() {}
	           	//}); 
	           	count++;
//            	Ext.Ajax.request({
//            		url: CONTEXT_PATH + '/sales/poreceipt.do?method=destroy', /*delete*/
//            		params:{
//            			uid_srcahd : parent,
//            			unique_id  : unique_id
//            		},
//            		success : function(result, request) {
//            			var result = result.responseText;
//            			var str = result;	
//            			var num = Number(str); 
//            			if(num == '0'){
//            				Ext.MessageBox.alert('No','It has children');
//            			}else{
////            				for(var i=0; i< selections.length; i++) {
////            					var rec = selections[i];
////            					var unique_id = rec.get('unique_id');
////            					var projectmold = Ext.ModelManager.create({
////            						unique_id : unique_id
////            					}, 'ProjectMold');
////            				}
//            				grid.store.remove(selections);
//            			}
//            		}
//            	});
        	}
        	Ext.MessageBox.alert('Check','Delete count : '+count);
        	grid.store.remove(selections);
        }
    }
};


function restoreConfirm(btn){

    var selections = grid2.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        var count = 0;
        if(result=='yes') {
        	
        	var arrUid = [];
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
            	var unique_id = rec.get('unique_id');
            	arrUid.push(unique_id);
        	}
        	if(arrUid.length>0) {
        		Ext.Ajax.request({
            		url: CONTEXT_PATH + '/sales/poreceipt.do?method=restoreMunufact',
            		params:{
            			unique_id_arr  : arrUid
            		},
            		success : function(result, request) {
				        	Ext.MessageBox.alert('Check','Completed Cancel count : '+arrUid.length);
				        	grid2.store.remove(selections);
            		}
            	});
        	}
        	

        }
    }
};

function completConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        var count = 0;
        if(result=='yes') {
        	
        	var arrUid = [];
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
            	var unique_id = rec.get('unique_id');
            	arrUid.push(unique_id);
        	}
        	if(arrUid.length>0) {
        		Ext.Ajax.request({
            		url: CONTEXT_PATH + '/sales/poreceipt.do?method=completeMunufact',
            		params:{
            			unique_id_arr  : arrUid
            		},
            		success : function(result, request) {
				        	Ext.MessageBox.alert('Check','Completed count : '+arrUid.length);
				        	grid.store.remove(selections);
            		}
            	});
        	}
        	

        }
    }
};

function resetFitActionConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        var count = 0;
        if(result=='yes') {
        	
        	var arrUid = [];
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
            	var unique_id = rec.get('unique_id');
            	arrUid.push(unique_id);
        	}
        	if(arrUid.length>0) {
        		Ext.Ajax.request({
            		url: CONTEXT_PATH + '/production/pcsline.do?method=resetFitActionConfirm',
            		params:{
            			unique_id_arr  : arrUid
            		},
            		success : function(result, request) {
            			var ret = result.responseText;
            			var msg = '';
            			if(ret=='OK') {
				        	msg = 'Completed count : '+arrUid.length;
            			} else {     
            				 msg = 'Request count : '+arrUid.length + 'Failed ==> ' + ret;
            			}
            			Ext.MessageBox.alert('Check',msg);
            			grid.store.remove(selections);
            		}
            	});
        	}
        	

        }
    } 
};


//completionn manufact
var completeAction = Ext.create('Ext.Action', {
	itemId: 'completeButton',
	iconCls: 'complete',
    text: GET_MULTILANG('sro1_completeAction'),
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:'COMPLETE',
            msg: '你确定该项目已完成?',
            buttons: Ext.MessageBox.YESNO,
            fn: completConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    }
});

//cancel completionn manufact
var restoreAction = Ext.create('Ext.Action', {
	itemId: 'completeCancelButton',
	iconCls: 'complete',
    text: GET_MULTILANG('sro1_completeAction') + ' CANCEL',
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title: '取消已完成的订单',
            msg: '你确定取消已完成的订单?',
            buttons: Ext.MessageBox.YESNO,
            fn: restoreConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    }
});

var assignFitAction = Ext.create('Ext.Action', {
	itemId: 'assignFitAction',
	//iconCls: 'complete',
    text: '分配FIT Group',
    disabled: true,
    handler: function(widget, event) {
    	var rec = grid.getSelectionModel().getSelection()[0];
    	var unique_id = rec.get('unique_id');
    	var pj_code = rec.get('pj_code');
		var reserved_varchar6 = rec.get('reserved_varchar6');
		if(reserved_varchar6!=null && reserved_varchar6!='') {
			alert('该项目已经分配Group...');
			return;
		}
		var user_id = '';
    	var fitGroupStore = Ext.create('Mplm.store.FitGroupStore', {} );
    	var workgroupGrid = Ext.create('Ext.grid.Panel', {
		        store: fitGroupStore,
		        stateId: 'stateGrid-workgroupGrid',
		        layout: 'fit',
		        height: 350,
		        width:300,
				multiSelect : false,
		        columns: [
		            {
		                text     : 'user_id',
		                flex     : 1,
		                sortable : false,
		                dataIndex: 'user_id'
		            }],
		        viewConfig: {
		            stripeRows: true,
		            enableTextSelection: false,
		            getRowClass: function(record) {
		            	user_id = record.get('user_id');
	            		return reserved_varchar6==user_id ? 'selected-row' : ''; 

		            } ,
		            listeners: {
		                itemdblclick:  function(dv, record, item, index, e) {
		                    alert('working');
		                }

		            }
		        }
     	});
     			    
    	fitGroupStore.load(function(records) {});
		win = Ext.create('widget.window', {
				title: 'FIT Group',
				modal:true,
				plain:true,
				closable: true,
				closeAction: 'hide',
				width: 300,
				minWidth: 100,
				height: 500,
				layout: {
				type: 'border',
				padding: 5
				},
				items: [workgroupGrid],
	             buttons: [{
	                 text: CMD_OK,
	             	handler: function(){
			     		Ext.Ajax.request({                           

							url: CONTEXT_PATH + '/production/pcsline.do?method=updateFitGroup',			
	         				params:{
	         					pj_uid : unique_id,
	          	           		reserved_varchar6 : user_id,
	          	           		pj_code : pj_code
	         				},
	    						
							success : function(result, request) {
								var ret = result.responseText;
								console_log(ret);
								
								store.load(function() {});
								console_log('requested ajax...');
							},
							failure: extjsUtil.failureMessage
						});  
	         		
	                	if(win) 
	                	{
	                		win.close();
	                	} 
                   }
             },{
                 text: CMD_CANCEL,
             	handler: function(){
             		if(win) {win.close();} }
             }]
         });

         win.show();
    	
    	
    	
    	
    }//endofhandler
});//endofassignaction

var resetFitAction = Ext.create('Ext.Action', {
	itemId: 'resetFitAction',
	//iconCls: 'complete',
    text: '删除 Fit Group',
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:'删除 Group',
            msg: '你确定删除已分配的Group吗?',
            buttons: Ext.MessageBox.YESNO,
            fn: resetFitActionConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    }
});


//Define Edit Action
var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: function(){
    	if(gSelectedTab=='1') {
    		searchHandler();
    	} else {
    		searchHandlerParam(store2);
    	}
    }
});



var toYear = null;//2013
var toMonth = null;//07
var dateFields =[];
var dateColumns =[];



if( toYear == null || toMonth==null ) {
	toYear = TODAY_GLOBAL.getFullYear();
	toMonth = TODAY_GLOBAL.getMonth();
	console_log('toYear : '+ year_combo);
	console_log('toMonth : '+ month_combo);
	

	
}

var lastDay = getLAstDayOfMonth(year_combo, month_combo);


for(var i=0; i<31; i++) {
	console_log(dayText);
	var key = ''+ (i+1);
	var text = key + dayText;
	if(key.length<2) {
		key = '0' + key;
	}
	vCENTER_FIELDS.push({ name: 'c' + key, type: 'string'});
	vCENTER_FIELDS.push({ name: 'r' + key, type: 'string'});
}
var tempColumn =[];

function makeDateFields(lastDay) {
	console_log('makeDateFields : '+ lastDay);
   	for(var i=0; i<vCENTER_COLUMNS.length; i++) {
		tempColumn.push(vCENTER_COLUMNS[i]);
	}
	for(var i=0; i<31; i++) {
		
		var key = ''+ (i+1);
		var text = key + dayText;
		if(key.length<2) {
			key = '0' + key;
		}
		tempColumn.push(
				{ header: text,
					columns: [
						{ header:epc6_plan_hour, dataIndex: 'c' + key, width : 60,  align: 'center',resizable:false,sortable : false,
							field: {
 			                    xtype: 'numberfield',minValue:0,maxValue:24
 			                }},
						{ header:epc6_real_hour, dataIndex: 'r' + key, width : 60,  align: 'center',resizable:false,sortable : false,
							field: {
 			                    xtype: 'numberfield',
 			                    minValue:0,
 			                   maxValue:24
 			                }}
					]
				}
		);

		
		
	}
	
}

function changeDateFields(lastDay) {
	var tempColumn2 = [];
	console_log('changeDateFields : '+ lastDay);
   	for(var i=0; i<vCENTER_COLUMNS.length; i++) {
		tempColumn2.push(vCENTER_COLUMNS[i]);
	}
	for(var i=0; i<lastDay; i++) {
		
		var key = ''+ (i+1);
		var text = key + dayText;
		if(key.length<2) {
			key = '0' + key;
		}
		tempColumn2.push(
				{ header: text,
					columns: [
						{ header:epc6_plan_hour, dataIndex: 'c' + key, width : 60,  align: 'center',resizable:false,sortable : false,
							field: {
 			                    xtype: 'numberfield',minValue:0,maxValue:24
 			                }},
						{ header:epc6_real_hour, dataIndex: 'r' + key, width : 60,  align: 'center',resizable:false,sortable : false,
							field: {
 			                    xtype: 'numberfield',minValue:0,maxValue:24
 			                }}
					]
				}
		);

		
	}
	grid.reconfigure(undefined, tempColumn2);

}

var searchField = [];


var field2 = [];
var column2 = [];
var tooltip2 = [];

Ext.onReady(function() {
	
	
	makeDateFields(lastDay);
	
	var currentTime = new Date();
    var now = currentTime.getFullYear();
    var years = [];
    var months = [];
    
    var y = 2013;
    var m = 1;
    while(y<=now+4){
        years.push([y+epc6_year]);
        y++;
    }
    while(m<=12){
    	months.push([m+monthText]);
    	m++;
    }
    storeYear = new Ext.data.SimpleStore({
        fields: [ 'year' ],        
        data: years
    });
    storeMonth = new Ext.data.SimpleStore({
        fields: [ 'month' ],        
        data: months
    });

	    

	LoadJs('/js/util/buyerStore.js');
	LoadJs('/js/util/itemStore.js');
	moldFormTypeStore = Ext.create('Mplm.store.MoldFormTypeStore', {hasNull: false} );
	IsComplishedStore  = Ext.create('Mplm.store.IsComplishedStore', {hasNull: false} );
	userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
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
		    	 	text :  GET_MULTILANG('new_mold'),
		    	 	value: 'N',
		    	 	iconCls:'brick_add'
		    	},
		        { 
		    		pressed: !togIsNew,
		    	 	text :  GET_MULTILANG('mod_mold'),
		    	 	value: 'M',
		    	 	iconCls:'brick_edit'
		    	}
		        ]
	});
	
	makeSrchToolbar(searchField);
	console_log('makeSrchToolbar OK');
	
	//newmodcont radio setting
    var hiddenFrm = Ext.getCmp(getSearchField('newmodcont'));
    if(togIsNew) {
    	hiddenFrm.setValue('N');
    }else {
    	hiddenFrm.setValue('M');
    }

    vSRCH_TOOLBAR.splice(0,0, '-');
    vSRCH_TOOLBAR.splice(0,0, searchAction);
	
				                    
	
	
	//ProjectMold Store 정의
	Ext.define('ProjectMold', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/sales/poreceipt.do?method=read&reserved_timestampb=N', /*1recoed, search by cond, search */
		            create: CONTEXT_PATH + '/sales/poreceipt.do?method=createreadroute', 
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
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});

 //	store.load(function() {

 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );

			grid = Ext.create('Ext.grid.Panel', {
			        store: store,
			        collapsible: true,
			        multiSelect: true,
			        stateId: 'stateGrid',
			        selModel: selModel,
			        autoScroll : true,
			        region: 'center',
			        autoHeight: true,
			        height: getCenterPanelHeight(),
			     // paging bar on the bottom
			        
			        bbar: getPageToolbar(store),
			        
			        dockedItems: [
      				{
      		        	xtype: 'toolbar',
      		        	items: [
      		        		completeAction, '-',
      		        		assignFitAction,'-',
      		        		resetFitAction
						]}
			        
			        ],
			        columns: /*(G)*/vCENTER_COLUMNS,
			        title: GET_MULTILANG('spd11_making'),
	                listeners: {
	                    activate: function(tab){
	                        setTimeout(function() {
	                        	selectedTab = '1';
	                        	console_log(selectedTab);
	                        	changeTab(selectedTab);
	                        }, 1);
	                    }
	                }
			    });
			
		grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		        	var rec = grid.getSelectionModel().getSelection()[0];
		            if (selections.length) {
						//grid info 켜기
						//displayProperty(selections[0]);
						
						if(fPERM_DISABLING()==true) {
			            	completeAction.disable();	
			            	assignFitAction.disable();
			            	resetFitAction.disable();
						}else{
							if(rec.get('creator_uid')!=vCUR_USER_UID){
				            	completeAction.enable();
								assignFitAction.enable();
			            		resetFitAction.enable();
				            }else{
				            	completeAction.enable();
								assignFitAction.enable();
			            		resetFitAction.enable();
				            }
						}
		            } else {
		            	if(fPERM_DISABLING()==true) {
			            	completeAction.disable();	
			            	assignFitAction.disable();
			            	resetFitAction.disable();
		            	}else{
			            	completeAction.disable();	
			            	assignFitAction.disable();
			            	resetFitAction.disable();
		            	}
		            }
		           
		        }
		    });
		    
		    
		    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
		        Ext.create('Ext.tip.ToolTip', config);
		    });
			    
			//Sub Field Load
		   (new Ext.data.Store({ model: 'ExtFieldColumn'})).load({
			    params: {
			    	menuCode: 'SPD2_SUB'
			    },
			    callback: function(records, operation, success) {

			    	if(success ==true) {
			    		
			    		for (var i=0; i<records.length; i++){
			    			inRec2Col(records[i], field2, column2, tooltip2);
				        }//endoffor
		    		 	
			    		var selModel1 = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );

			    			//ProjectMold Store 정의
						Ext.define('ProjectMold2', {
						   	 extend: 'Ext.data.Model',
						   	 fields: field2,
						   	    proxy: {
										type: 'ajax',
								        api: {
								            read: CONTEXT_PATH + '/sales/poreceipt.do?method=read&reserved_timestampb=Y', /*1recoed, search by cond, search */
								            create: CONTEXT_PATH + '/sales/poreceipt.do?method=createreadroute', 
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
	
							store2 = new Ext.data.Store({  
								pageSize: getPageSize(),
								model: 'ProjectMold2',
								sorters: [{
						            property: 'unique_id',
						            direction: 'DESC'
						        }]
							});

			    		grid2 =  Ext.create('Ext.grid.Panel', {
			    			
							store: store2,
			    			selModel: selModel1,
					        collapsible: false,
					        multiSelect: false,
					        stateId: 'store2' + /*(G)*/vCUR_MENU_CODE,
					        autoScroll: true,
					        autoHeight: true,
					        height: getCenterTapPanelHeight(),
					        columns: column2,
					        bbar: getPageToolbar(store2),
							id : 'grid2',
							title: GET_MULTILANG('spd11_complished'),
			    	                listeners: {
			    	                    activate: function(tab){
			    	                        setTimeout(function() {
			    	                        	selectedTab = '2';
			    	                        	console_log(selectedTab);
			    	                        	changeTab(selectedTab);
			    	                        }, 1);
			    	                    }
			    	                },
							dockedItems: [
			      				{
			      		        	xtype: 'toolbar',
			      		        	items: [
				      		        	restoreAction,
				      		        	'-',
			      		        		{
										    xtype:'label',
										    text: GET_MULTILANG('spd11_complished')
										 },
										{
											id :'yyyy',
										    name : 'srchYyyy',
										    xtype: 'combo',
										    emptyText: epc6_year,
							                typeAhead: false,
							                selectOnFocus: true,
							                triggerAction: 'all',
							                lazyRender: true,
							                allowBlank: true,
							                editable: false,
							                value:dt.getFullYear()+'년',
							                store: storeYear,
							                displayField: 'year',
							                valueField: 'year',
							                forceSelection: true,
			//				                anchor: '-15 40%',
							                width: 80,
							                mode: 'local',
							                listClass: 'x-combo-list-small',
							                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
					   	   	               	listeners: {
					   	   	                    select: function (combo, record) {	
					   	   	                    	var selected = this.getValue();
					   	   	                    	year_combo = selected.substring(0,4);
					   	   	                    	console_log(year_combo);
					   	   	                    	store2.getProxy().setExtraParam('year_combo', year_combo);
					   	   	                    	//store.getProxy().setExtraParam('mm',month_combo);
			//		   	   	                    	store.getProxy().setExtraParam('yyyy',year_combo);
			//		   	   	                    	if((systemCode!=null && systemCode!='')&&(month_combo!=null && month_combo!='')){
			//		   	   	                    		var lastDayRaw = new Date(year_combo,month_combo,0);
			//		   	   	                    		var dLast = '';
			//		   	   	                    		dLast=lastDayRaw.getDate().toString();
			//		   	   	                    		changeDateFields(dLast);
			//		   	   	                    		store.load(function() {});
			//		   	   	                    	}
					   	   	                    }
					   	   	               	}
										}
			
								]}
						        
						        ]
						});
					    
						
						store2.load({});
						
						var tabPanel = {
								title:getMenuTitle(),
					            collapsible: false,
					            floatable: false,
					            split: true,
								xtype: 'tabpanel',
						        activeTab: 0,
						        tabPosition: 'top',
						        dockedItems: [
						        {
						            xtype: 'toolbar',
						            items: /*(G)*/vSRCH_TOOLBAR
						        }],
						        items: [ grid, grid2 ]
					    };
				
			
						fLAYOUT_CONTENT(tabPanel);
					    
					    
						
					cenerFinishCallback();//Load Ok Finish Callback
			    		
			    		
			    		
			    		grid2.getSelectionModel().on({
			    			selectionchange: function(sm, selections) {
			    				if (selections.length) {
			    					if(fPERM_DISABLING()==true) {
						            	restoreAction.disable();
					            	}else{
						            	restoreAction.enable();
					            	}
			    				}else {
					            	if(fPERM_DISABLING()==true) {
						            	restoreAction.disable();
					            	}else{
						            	restoreAction.disable();
					            	}
			    				}
			    			}
			    		});

			    	}//endof if(success..
			    },//callback
			    scope: this
			});	
			
		    
		
		
//	}); //store load
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
		//Model Combo Object
		oBModel.setLoading(false);
		console_log(oBModel);
	    for (var i=0; i<modelRecords.length; i++){
	          oBModel.store.add(modelRecords[i]);
	          
	    }
	});
}
