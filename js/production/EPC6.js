/**
 * EMC1: Machine
 */
// global var.
var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});
var grid = null;
var store = null;

var dt = new Date();

var month = dt.getMonth()+1;
//	var day = dt.getDate();
//	var year = dt.getFullYear();

console_log('오늘날짜 : '+ dt);
console_log('오늘날짜 : '+ month);
console_log('오늘날짜 : '+ dt.getDate());
console_log('오늘날짜 : '+ dt.getFullYear());

var year_combo = dt.getFullYear();
var month_combo = month;
var systemCode = null;


var workGroupStore = Ext.create('Mplm.store.WorkGroupStore', {} );


var addAction = Ext.create('Ext.Action', {
	itemId: 'saveButton',
	iconCls:'Save',
    text: panelSRO1133,
    disabled: fPERM_DISABLING(),
    handler: function(widget, event) {
    	

    	
    	var group_code ='';
    	var member_uid ='';
    	var machine_uid ='';

    	var yyyymm = year_combo+''+month_combo;
    	console_log('yyyymm = ' + yyyymm);

        for (var j = 0; j < store.data.items.length; j++)
        {
        	var modifiend = [];
              var record = store.data.items [j];
              if (record.dirty) {
            	  
            	  group_code = record.get('group_code');
            	  member_uid = record.get('member_uid');
            	  machine_uid = record.get('machine_uid'); 
 		    						    	
		            	  var obj = {};                
		            	  obj['group_code'] = record.get('group_code');// //pcs_code, pcs_name...                
		            	  obj['member_uid'] = record.get('member_uid');
		            	  obj['machine_uid'] = record.get('machine_uid');
				          for(var i=0; i<31; i++) {		    			
		            		  var str = '' + (i+1);		    			
		            		  if(str.length<2) {		    			
		            			  str = '0' + str;		    			
		            		  }
		            	  obj['c'+str] = record.get('c'+str);
		            	  obj['r'+str] = record.get('r'+str);
		            	  }
		            	  obj['yyyymm'] = yyyymm;

		            	  modifiend.push(obj);	    			

	        }
              if(modifiend.length>0) {
                	
            	  console_log(modifiend);
            	  var strmod =  Ext.encode(modifiend);
            	  console_log(strmod);
            	  
           	    Ext.Ajax.request({
         			url: CONTEXT_PATH + '/production/schdule.do?method=savecapamap',
         			params:{
         				modifyIno: strmod,
         				group_code: group_code,
         				member_uid:member_uid,
         				machine_uid:machine_uid,
         				yyyymm:yyyymm
         				
         			},
         			success : function(result, request) {   
         				store.load(function() {});
         			}
           	    });
              }
        }
        
        

		    		   	
    	
    }//endof handlwe
});//endof define action






/**
 * 1:월, 2: 화... 6:토, 0:일
 */
//function getDay(yyyy, mm, day) {
//	var a = new Date(yyyy, Number(mm)-1, dayStr);
//	return a.getDay();
//}

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
var userStore = new Ext.data.Store({  
	pageSize: 5,
	model: 'UsrAst.Combo',
	sorters: [{
         property: 'user_name',
         direction: 'ASC'
     }]
});   



function deleteConfirm(btn) {

	var selections = grid.getSelectionModel().getSelection();
	if (selections) {
		var result = MessageBox.msg('{0}', btn);
		if (result == 'yes') {
			for ( var i = 0; i < selections.length; i++) {
				var rec = selections[i];
				var unique_id = rec.get('unique_id');
				var pcsmchn = Ext.ModelManager.create({
					unique_id : unique_id
				}, 'CapaMap');

				pcsmchn.destroy({
					success : function() {
					}
				});

			}
			grid.store.remove(selections);
		}

	}
};

// Define Remove Action
var removeAction = Ext.create('Ext.Action', {
	itemId : 'removeButton',
	iconCls : 'remove',
	text : CMD_DELETE,
	disabled : fPERM_DISABLING(),
	handler : function(widget, event) {
		Ext.MessageBox.show({
			title : delete_msg_title,
			msg : delete_msg_content,
			buttons : Ext.MessageBox.YESNO,
			fn : deleteConfirm,
			// animateTarget: 'mb4',
			icon : Ext.MessageBox.QUESTION
		});
	}
});


//작업자 지정
var searchAction = Ext.create('Ext.Action', {
	itemId : 'searchButton',
	iconCls : 'search',
	text: CMD_SEARCH,
	disabled : false,
	handler : function(widget, event) {
		
		var lastDayRaw = new Date(year_combo,month_combo,0);
		var dLast = '';
		
		dLast=lastDayRaw.getDate().toString();
		console_log('dLast : '+year_combo);
		console_log('dLast : '+month_combo);
		console_log('dLast : '+dLast);
		changeDateFields(dLast);
		if(systemCode==null || systemCode=='') {
    		Ext.MessageBox.alert(sro1_warning_msg, epc6_select_group, callBack);  
            function callBack(id){  
                return
            } 
            return;
    	}
		if(year_combo==null || year_combo=='') {
    		Ext.MessageBox.alert(sro1_warning_msg, epc6_select_year, callBack);  
            function callBack(id){  
                return
            } 
            return;
    	}
		if(month_combo==null || month_combo=='') {
    		Ext.MessageBox.alert(sro1_warning_msg, epc6_select_month, callBack);  
            function callBack(id){  
                return
            } 
            return;
    	}
		
		store.getProxy().setExtraParam('group_code',systemCode);
		store.getProxy().setExtraParam('yyyy',year_combo);
		store.getProxy().setExtraParam('mm',month_combo);
		store.load(function() {});
//		Ext.Ajax.request({
// 			url: CONTEXT_PATH + '/production/schdule.do?method=readCapa',
// 			params:{
// 				group_code: systemCode,
// 				yyyy:year_combo,
// 				mm:month_combo
// 			},
// 			success : function(result, request) {
// 				console_log('lastDay1111:'+lastDay+year_combo+month_combo);
// 				store.load(function() {});
// 			}
//   	    });
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

Ext.define('CapaMap', {
	extend: 'Ext.data.Model',
	fields: /*(G)*/vCENTER_FIELDS,

	proxy: {
		type : 'ajax',
		api : {
			read : CONTEXT_PATH + '/production/schdule.do?method=readCapa',
			create : CONTEXT_PATH + '/production/schdule.do?method=updateCapa',
			update : CONTEXT_PATH + '/production/schdule.do?method=updateCapa'
		},
		reader : {
			type : 'json',
			root : 'datas',
			 totalProperty: 'count',
			successProperty : 'success'
		},
		writer : {
			type : 'singlepost',
			writeAllFields : false,
			root : 'datas'
		}

	}
});

Ext.onReady(function() {

	makeDateFields(lastDay);

	
	
	// CapaMap Store 정의
	store = new Ext.data.Store({
		pageSize : getPageSize(),
		model : 'CapaMap',
		sorters : [ {
			property : 'member_uid',
			direction : 'DESC'
		} ]
	});

	store.load(function(records) {

		var processteemnamestore = Ext.create('Mplm.store.ProcessTeamNameStore', {hasNull: false} );
		
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
	    var storeYear = new Ext.data.SimpleStore({
	        fields: [ 'year' ],        
	        data: years
	    });
	    var storeMonth = new Ext.data.SimpleStore({
	        fields: [ 'month' ],        
	        data: months
	    });
		
		grid = Ext.create('Ext.grid.Panel', {
			store : store,
			stateful : true,
			collapsible : true,
			multiSelect : true,
			height : getCenterPanelHeight(),
			stateId : 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
			autoScroll : true,
			autoHeight : true,
	        bbar: getPageToolbar(store),

			dockedItems : [
               {
            	   dock : 'top',
            	   xtype : 'toolbar',
            	   items : [ searchAction, '-',
            	             addAction, '->', {
            		   iconCls : 'tasks-show-all',
            		   tooltip : 'All',
            		   toggleGroup : 'status'
            	   }, {
            		   iconCls : 'tasks-show-active',
            		   tooltip : 'Current',
            		   toggleGroup : 'status'
            	   }, {
            		   iconCls : 'tasks-show-complete',
            		   tooltip : 'Past',
            		   toggleGroup : 'status'
            	   }

            	   ]
               }
               , {
            	   xtype : 'toolbar',
            	   items :
            		   [
						{
							id :'systemCode',
						    name : 'systemCode',
						    xtype: 'combo',
						    emptyText: epc6_work_group,
						    store: processteemnamestore,
						    mode:           'local',
						    triggerAction:  'all',
						    displayField:   'systemCode',
						    valueField:     'systemCode',
						    typeAhead: false,
					        hideLabel: true,
						    fieldStyle: 'background-color: #FBF8E6; background-image: none;',
						    listConfig:{
					          	getInnerTpl: function(){
					          		return '<div data-qtip="{systemCode}">{systemCode}</div>';
					          	}			                	
						    },	
	   	   	               	listeners: {
	   	   	                    select: function (combo, record) {	
	   	   	                    	systemCode = this.getValue();
	   	   	                    	store.getProxy().setExtraParam('group_code',systemCode);
	   	   	                    	console_log(systemCode);
	   	   	                    }
	   	   	               	}
						},
						'-',
							{
								id :'yyyy',
							    name : 'srchYyyy',
							    xtype: 'combo',
							    emptyText: epc6_year,
				                typeAhead: false,
				                selectOnFocus: true,
				                triggerAction: 'all',
				                lazyRender: true,
				                allowBlank: false,
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
		   	   	                    	store.getProxy().setExtraParam('mm',month_combo);
		   	   	                    	store.getProxy().setExtraParam('yyyy',year_combo);
		   	   	                    	if((systemCode!=null && systemCode!='')&&(month_combo!=null && month_combo!='')){
		   	   	                    		var lastDayRaw = new Date(year_combo,month_combo,0);
		   	   	                    		var dLast = '';
		   	   	                    		dLast=lastDayRaw.getDate().toString();
		   	   	                    		changeDateFields(dLast);
		   	   	                    		store.load(function() {});
		   	   	                    	}
		   	   	                    }
		   	   	               	}
							},
							'-',
							{
								id :'mm',
							    name : 'srchMm',
							    xtype: 'combo',
							    emptyText: monthText,
							    typeAhead: false,
				                selectOnFocus: true,
				                triggerAction: 'all',
				                lazyRender: true,
				                allowBlank: false,
				                editable: false,
				                value:month+'월',
				                store: storeMonth,
				                displayField: 'month',
				                valueField: 'month',
				                forceSelection: true,
//				                anchor: '-15 40%',
				                width: 80,
				                mode: 'local',
				                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
		   	   	               	listeners: {
		   	   	                    select: function (combo, record) {	
		   	   	                    	var selected = this.getValue();
		   	   	                    	if(selected.length==2){
		   	   	                    		month_combo= '0'+selected.substring(0,1);
		   	   	                    	}else{
		   	   	                    		month_combo= selected.substring(0,2);
		   	   	                    	}
		   	   	                    	store.getProxy().setExtraParam('mm',month_combo);
		   	   	                    	store.getProxy().setExtraParam('yyyy',year_combo);
		   	   	                    	console_log(month_combo);
		   	   	                    	if((systemCode!=null && systemCode!='')&&(year_combo!=null && year_combo!='')){
		   	   	                    		var lastDayRaw = new Date(year_combo,month_combo,0);
		   	   	                    		var dLast = '';
		   	   	                    		dLast=lastDayRaw.getDate().toString();
		   	   	                    		changeDateFields(dLast);
		   	   	                    		store.load(function() {});
		   	   	                    	}
		   	   	                    }
		   	   	               	}
							}
            		    ]
               }

			],

			columns : tempColumn,
			plugins: [cellEditing],

			viewConfig : {
				stripeRows : true,
				enableTextSelection : true,
				listeners : {
					'afterrender' : function(grid) {
						var elments = Ext.select(".x-column-header",true);//.x-grid3-hd
						elments.each(function(el) {

				
									}, this);
							
						}
	            		,
					itemcontextmenu : function(view, rec, node, index, e) {
						e.stopEvent();
						contextMenu.showAt(e.getXY());
						return false;
					}


				}
			},
			title : getMenuTitle()//,

		});
		fLAYOUT_CONTENT(grid);
		
		grid.getSelectionModel().on({
			selectionchange : function(sm, selections) {
				if (selections.length) {
					
					//grid info 켜기
//					displayProperty(selections[0]);
					
					if(fPERM_DISABLING()==true) {
						addAction.disable();
						removeAction.disable();

						
					}else{
						addAction.enable();
						removeAction.enable();

					}

				} else {
					if(fPERM_DISABLING()==true) {
						collapseProperty();//uncheck no displayProperty
						addAction.disable();
						removeAction.disable();

						
					}else{
						collapseProperty();//uncheck no displayProperty
						addAction.disable();
						removeAction.disable();

						
					}

				}
			}
		});
		
	    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
	        Ext.create('Ext.tip.ToolTip', config);
	    });
		// callback for finishing.
		cenerFinishCallback();
			
		}); //store load

});//OnReady
