var grid = null;
var store = null;
var myGrid = null;
var Fgrid = null;
var FrowIndex = null;
var cloudprojectStore = Ext.create('Mplm.store.cloudProjectStore', {} );
var cloudjobCodeStore = Ext.create('Mplm.store.cloudJobCodeStore', {} );
var cloudjobCodeStoreX = Ext.create('Mplm.store.cloudJobCodeStoreX', {} );
var gongsuOvertimeTypeStore = Ext.create('Mplm.store.GongsuOvertimeTypeStore', {} );
var gongsuWorkTypeStore = Ext.create('Mplm.store.GongsuWorkTypeStore', {hasNull: true} );
var srchUserStore = Ext.create('Mplm.store.SrchUserStore', {hasNull: true} );
var selectuser = null;
var selectdate = null;
var selectdate_start = null;
var selectdate_end = null;
var selectwork = 'A';
var selectovertime = 'X';
//var real_end_date = '';
//var real_due_date = '';
var defaultDesign= [
                      '1. 실동공수',
                      'Mold Concept Design'
//                      'Mold Detail Design(CAD)',
//                      'Process Design'
                      ];

//var defaultPurchase= [
//                    '2. Purchase',
//                    'Mold Base & Main Insert',
//                    'General Component & Parts',
//                    'Processing OutSourcing'
//                    ];
//var defaultProcessing= [
//                    '3. Processing',
//                    'Mold Base',
//                    'Heat Treatment',
//                    'CNC Programming',
//                    'CNC',
//                    'Electrode',
//                    'EDM',
//                    'W/C',
//                    'Component'
//                    ];
//var defaultDelivery= [
//                    '4. Test & Delivery',
//                    'Assembly',
//                    'Test',
//                    'Delivery'
//                    ];
var defaultTaskArray=[defaultDesign/*, defaultPurchase, defaultProcessing, defaultDelivery*/];


var Task_columns = {
		header: 'Project',
		columns: [{
		text: '프로젝트명',
        width: 100,
//        locked: true,
        tdCls: 'task',
        sortable: true,
        dataIndex: 'pj_name',
        renderer: function (value, p) {
        	p.tdAttr = 'style="background-color: #FBF8E6;"';
            return value;
        },
//        style: 'background-color: #FBF8E6; background-image: none;',
        hideable: false,
//        summaryType: 'count',
//        summaryRenderer: function(value, summaryData, dataIndex) {
//        },
//        },
//            return ((value === 0 || value > 1) ? '(' + value + ' Tasks)' : '(1 Task)');
        field: {
            xtype: 'combo',
            store: cloudprojectStore,
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	            displayField: 'pj_name',
	            valueField:     'pj_name',
	            listConfig: {
	                loadingText: 'Searching...',
	                emptyText: 'No matching posts found.',
	                // Custom rendering template for each item
	                getInnerTpl: function() {
	                	return '<div data-qtip="{unique_id}">[{pj_code}] {pj_name}</div>';
	                }
	            },
	            listeners: {
	                 select: function (combo, record,rowIndex) {
	                 	
	                 	console_log('Selected Value : ' + combo.getValue());
	                 	var pjuid = record[0].get('unique_id');
	                 	var pjcode = record[0].get('pj_code');
	                 	console_log('Selected unique_id : ' + record[0].get('unique_id'));
	                 	console_log('Selected rowIndex : ' + rowIndex);
//	                 	var oPj_uid = Ext.getCmp('project_uid');
//	                 	Ext.getCmp('project_uid').setValue(pjuid);
	                 	
//	                 	var record1 = grid.getStore().getAt(rowIndex);
	                 	var sel_model = grid.getSelectionModel();
	                 	var record1 = sel_model.getSelection()[0];
//	                 	var project_uid = record.get('project_uid');
	                 	record1.set('project_uid',pjuid);
	                 	record1.set('pj_code',pjcode);
	                	console_log(record1);
	                	
	                 	
//	                 	oPj_uid.setValue(pjuid);
	                 	
                }
           }
        }
},{
	text: 'Project_uid',
    width: 100,
//    locked: true,
    tdCls: 'task2',
    sortable: true,
    dataIndex: 'project_uid',
    hidden:true,
    field: {
    	id:'project_uid',
    	name:'project_uid',
    	xtype: 'textfield',
    	readOnly : true
    }
},{
	text: '프로젝트코드',
    width: 100,
//    locked: true,
    tdCls: 'task2',
    sortable: true,
    dataIndex: 'pj_code'
}
		]
};
//var Task_columns2={
//		text: 'Project_uid',
//        width: 100,
////        locked: true,
//        tdCls: 'task2',
//        sortable: true,
//        dataIndex: 'project_uid',
//        hidden:true,
//        field: {
//        	id:'project_uid',
//        	name:'project_uid',
//        	xtype: 'textfield',
//        	readOnly : true
//        }
//}

//var Task_columns3={
//		text: 'pj_code',
//        width: 100,
////        locked: true,
//        tdCls: 'task2',
//        sortable: true,
//        dataIndex: 'project_uid',
//        hidden:true,
//        field: {
//        	id:'project_uid',
//        	name:'project_uid',
//        	xtype: 'textfield',
//        	readOnly : true
//        }
//}

var Task_Title = {
		
};

var Project_columns = {
		header: 'TaskTitle',
        width: 180,
        sortable: true,
        dataIndex: 'task_title',
        hideable: false,
        field: {
            xtype: 'textfield'
        }
};

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});

var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );

var Schedule_columns2 = {
		header: 'Schedule',
        columns: [

		{
            header: '유실코드',
            width: 125,
            sortable: true,
            dataIndex: 'job_code',
            renderer: function (value, p) {
            	p.tdAttr = 'style="background-color: #FBF8E6;"';
                return value;
            },
//            style: 'background-color: #FBF8E6; background-image: none;',
            field: {
                xtype: 'combo',
                store: cloudjobCodeStoreX,
                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
    	            displayField: 'job_code',
    	            valueField:     'job_code',
    	            listConfig: {
    	                loadingText: 'Searching...',
    	                emptyText: 'No matching posts found.',
    	                // Custom rendering template for each item
    	                getInnerTpl: function() {
    	                	return '<div data-qtip="{unique_id}">[{job_code}] {job_name}</div>';
    	                }
    	            },
    	            listeners: {
    	                 select: function (combo, record,rowIndex) {
    	                 	
    	                 	console_log('Selected Value : ' + combo.getValue());
    	                 	var job_uid = record[0].get('unique_id');
    	                 	var job_name = record[0].get('job_name');
    	                 	console_log('Selected unique_id : ' + record[0].get('unique_id'));
    	                 	console_log('Selected rowIndex : ' + rowIndex);
//    	                 	var oPj_uid = Ext.getCmp('project_uid');
//    	                 	Ext.getCmp('project_uid').setValue(pjuid);
    	                 	
//    	                 	var record1 = grid.getStore().getAt(rowIndex);
    	                 	var sel_model = grid.getSelectionModel();
    	                 	var record1 = sel_model.getSelection()[0];
//    	                 	var project_uid = record.get('project_uid');
    	                 	record1.set('job_uid',job_uid);
    	                 	record1.set('job_name',job_name);
    	                	console_log(record1);
    	                	
    	                 	
//    	                 	oPj_uid.setValue(pjuid);
    	                 	
                    }
               }
            }
        }, 
        {
        	header: '유실코드명',
        	width: 125,
        	sortable: true,
        	dataIndex: 'job_name'
        }, 
        {
        	header: '유실코드_uid',
        	width: 125,
        	sortable: true,
        	dataIndex: 'job_uid',
        	hidden:true
        }, 
        {
        	header: '출근형태',
        	width: 125,
        	sortable: true,
        	dataIndex: 'work_type',
        	hidden:true
        }, 
        {
        	header: '잔특형태',
        	width: 125,
        	sortable: true,
        	dataIndex: 'overtime_type',
        	hidden:true
        }, 
        {
            header: '유실시간',
            width: 114,
            sortable: true,
            dataIndex: 'turnaround_time',
            renderer: function (value, p) {
            	p.tdAttr = 'style="background-color: #FBF8E6;"';
                return value;
            },
//            style: 'background-color: #FBF8E6; background-image: none;',
            field: {
                xtype: 'numberfield',
                fieldStyle: 'background-color: #FBF8E6; background-image: none;'
            }
        },
        {
    		header: '유실내용',
            width: 180,
            sortable: true,
            dataIndex: 'jobtoday_detail',
            hideable: false,
            renderer: function (value, p) {
            	p.tdAttr = 'style="background-color: #FBF8E6;"';
                return value;
            },
            field: {
                xtype: 'textfield'
            }
        }
//        ,{
//        	xtype: 'actioncolumn',
//        	width: 55, 
//        	sortable: false,
//        	header: 'REMOVE',
////        	icon: 'remove',
////    		iconCls: 'save',
//        	items: [{
//        		itemId: 'removeButton',
//        		icon:CONTEXT_PATH +  '/extjs/shared/icons/fam/delete.png',
//        		handler: function(grid, rowIndex, colindex) {
//        			var record = grid.getStore().getAt(rowIndex);
//        			console_log(record);
//        			Fgrid = grid;
//        			FrowIndex = rowIndex;
//        			var position = record.get('position');
////        			if(position%100==0){
////        				Ext.MessageBox.confirm(panelSRO1137, vst1_group_delete, destoryConfirm);
////        			}else{
//            			Ext.MessageBox.confirm(panelSRO1137, vst1_delete, destoryConfirm2);
////        			}
//        		} // eo handler
//        	}]
//        }
//        , {
//        	xtype: 'actioncolumn',
//        	width: 40, 
//        	sortable: false,
//        	header: 'ADD',
////        	icon: 'brick_add',
////    		iconCls: 'save',
//        	items: [{
//        		itemId: 'createButton',
//        		icon: CONTEXT_PATH +  '/extjs/shared/icons/fam/add.png',
//        		handler: function(grid, rowIndex, colindex) {
//        			Fgrid = grid;
//        			FrowIndex = rowIndex;
//            		Ext.MessageBox.confirm(panelSRO1136, vst1_add, createConfirm);
//            	} // eo handler
//        	}]
//        	
//        }
        ]
};




var Schedule_columns = {
		header: 'Schedule',
        columns: [

		{
            header: '근무코드',
            width: 125,
            sortable: true,
            dataIndex: 'job_code',
            renderer: function (value, p) {
            	p.tdAttr = 'style="background-color: #FBF8E6;"';
                return value;
            },
//            style: 'background-color: #FBF8E6; background-image: none;',
            field: {
                xtype: 'combo',
                store: cloudjobCodeStore,
                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
    	            displayField: 'job_code',
    	            valueField:     'job_code',
    	            listConfig: {
    	                loadingText: 'Searching...',
    	                emptyText: 'No matching posts found.',
    	                // Custom rendering template for each item
    	                getInnerTpl: function() {
    	                	return '<div data-qtip="{unique_id}">[{job_code}] {job_name}</div>';
    	                }
    	            },
    	            listeners: {
    	                 select: function (combo, record,rowIndex) {
    	                 	
    	                 	console_log('Selected Value : ' + combo.getValue());
    	                 	var job_uid = record[0].get('unique_id');
    	                 	var job_name = record[0].get('job_name');
    	                 	console_log('Selected unique_id : ' + record[0].get('unique_id'));
    	                 	console_log('Selected rowIndex : ' + rowIndex);
//    	                 	var oPj_uid = Ext.getCmp('project_uid');
//    	                 	Ext.getCmp('project_uid').setValue(pjuid);
    	                 	
//    	                 	var record1 = grid.getStore().getAt(rowIndex);
    	                 	var sel_model = grid.getSelectionModel();
    	                 	var record1 = sel_model.getSelection()[0];
//    	                 	var project_uid = record.get('project_uid');
    	                 	record1.set('job_uid',job_uid);
    	                 	record1.set('job_name',job_name);
    	                	console_log(record1);
    	                	
    	                 	
//    	                 	oPj_uid.setValue(pjuid);
    	                 	
                    }
               }
            }
        }, 
        {
        	header: '근무코드명',
        	width: 125,
        	sortable: true,
        	dataIndex: 'job_name'
        }, 
        {
        	header: '근무코드_uid',
        	width: 125,
        	sortable: true,
        	dataIndex: 'job_uid',
        	hidden:true
        },
        {
        	header: '출근형태',
        	width: 125,
        	sortable: true,
        	dataIndex: 'work_type'/*,
        	renderer: function (value, p) {
        		columnObj['renderer'] =  renderCodeName({ codeName: GONGSU_WORK_TYPE });
        	}*/
//        	hidden:true
        }, 
        {
        	header: '잔특형태',
        	width: 125,
        	sortable: true,
        	dataIndex: 'overtime_type',
        	hidden:true
        }, 
        {
            header: '근무시간',
            width: 114,
            sortable: true,
            dataIndex: 'turnaround_time',
            renderer: function (value, p) {
            	p.tdAttr = 'style="background-color: #FBF8E6;"';
                return value;
            },
//            style: 'background-color: #FBF8E6; background-image: none;',
            field: {
                xtype: 'numberfield',
                fieldStyle: 'background-color: #FBF8E6; background-image: none;'
            }
        } 
//        ,{
//        	xtype: 'actioncolumn',
//        	width: 55, 
//        	sortable: false,
//        	header: 'REMOVE',
////        	icon: 'remove',
////    		iconCls: 'save',
//        	items: [{
//        		itemId: 'removeButton',
//        		icon:CONTEXT_PATH +  '/extjs/shared/icons/fam/delete.png',
//        		handler: function(grid, rowIndex, colindex) {
//        			var record = grid.getStore().getAt(rowIndex);
//        			console_log(record);
//        			Fgrid = grid;
//        			FrowIndex = rowIndex;
//        			var position = record.get('position');
////        			if(position%100==0){
////        				Ext.MessageBox.confirm(panelSRO1137, vst1_group_delete, destoryConfirm);
////        			}else{
//            			Ext.MessageBox.confirm(panelSRO1137, vst1_delete, destoryConfirm);
////        			}
//        		} // eo handler
//        	}]
//        }
//        , {
//        	xtype: 'actioncolumn',
//        	width: 40, 
//        	sortable: false,
//        	header: 'ADD',
////        	icon: 'brick_add',
////    		iconCls: 'save',
//        	items: [{
//        		itemId: 'createButton',
//        		icon: CONTEXT_PATH +  '/extjs/shared/icons/fam/add.png',
//        		handler: function(grid, rowIndex, colindex) {
//        			Fgrid = grid;
//        			FrowIndex = rowIndex;
//            		Ext.MessageBox.confirm(panelSRO1136, vst1_add, createConfirm);
//            	} // eo handler
//        	}]
//        	
//        }
        ]
};

//var updown =
//{
//	text: Position,
//    menuDisabled: true,
//    sortable: false,
//    xtype: 'actioncolumn',
//    width: 60,
//    items: [{
//        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_up.png',  // Use a URL in the icon config
//        tooltip: 'Up',
//        handler: function(agridV, rowIndex, colIndex) {
//        	var record = grid.getStore().getAt(rowIndex);
//        	console_log(record);
//        	var position = record.get('position');
//        	var unique_id = record.get('id');
//        	var pj_unique = record.get('pj_unique');
//        	var task_title = record.get('task_title');
//        	var direction = -15;
//
////        	if(position.substring(2,4)==10){
////        		Ext.MessageBox.alert(error_msg_prompt,vst1_not_move);
////        	}else{
//        		Ext.Ajax.request({
//         			url: CONTEXT_PATH + '/statistics/task.do?method=movePosition',
//         			params:{
//         				position:position,
//         				unique_id:unique_id,
//         				direction:direction,
//         				pj_unique:pj_unique,
//         				task_title:task_title
//         			},
//         			success : function(result, request) {  
//     					store.load(function() {});
//         			}
//           	    });
////        	}
//        	
//		}
//    },{
//        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_down.png',   // Use a URL in the icon config
//        tooltip: 'Down',
//        handler: function(agridV, rowIndex, colIndex) {
//
//        	var record = grid.getStore().getAt(rowIndex);
//        	console_log(record);
//        	var position = record.get('position');
//        	var unique_id = record.get('id');
//        	var pj_unique = record.get('pj_unique');
//        	var task_title = record.get('task_title');
//        	var direction = 15;
//
////        	if(position.substring(1,4)==000){
////        		Ext.MessageBox.alert(error_msg_prompt,vst1_not_move);
////        	}else{
//        		Ext.Ajax.request({
//        			url: CONTEXT_PATH + '/statistics/task.do?method=movePosition',
//        			params:{
//        				position:position,
//        				unique_id:unique_id,
//        				direction:direction,
//        				pj_unique:pj_unique,
//        				task_title:task_title
//        			},
//        			success : function(result, request) {
//        				store.load(function() {});
//        			}
//        		});	
////        	}
//        }
//    }]
//};

var addNxExcel = Ext.create('Ext.Action', {
	itemId: 'addNxExcel',
    iconCls: 'MSExcelTemplateX',
    text: '근태현황출력',
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
            title: CMD_ADD + ' :: ' + 'NX Excel',
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
           	                	var nxExcel = Ext.ModelManager.create(val, 'NxExcel');
           	                	nxExcel.save( {	             	                	
	           	           		 success: function() {
		           	           		 }
		           	           	});
                           		win.close();
                           	}                           
                    }
                    lfn_gotoHome();
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
// console_log('win.show');
// LoadJs('/js/util/multiupload/app.js');
// console_log('end');
// console_log(/*(G)*/vFILE_ITEM_CODE);
			
			
			
		});
    }
});

var saveAction = Ext.create('Ext.Action', {
	text: panelSRO1133,
    iconCls: 'save',
    disabled: false,
    handler: function (){
    	
    	
    	for (var i = 0; i <store.data.items.length; i++)
        {
              var record = store.data.items [i];
//              store.getProxy().setExtraParam('overtime_type', 'A');
//          	  store.getProxy().setExtraParam('work_type', selectwork);
//              if (record.dirty) {
//            	  console_log(real_end_date);
//            	  console_log(real_due_date);
//              	record.set('id',unique_uid);
//              	record.set('end_date',real_end_date);
//              	record.set('due_date',real_due_date);
              	console_log(record);
          		//저장 수정
              	record.set('overtime_type',selectovertime);
              	record.set('work_type',selectwork);
              	
              	record.save({
              		success : function() {
              			 store.load(function() {});
              		}
              	 });
//              }
             
        }
    	for (var i = 0; i <mystore.data.items.length; i++)
    	{
    		var record2 = mystore.data.items [i];
//    		mystore.getProxy().setExtraParam('overtime_type', selectovertime);
//        	mystore.getProxy().setExtraParam('work_type', selectwork);
//    		if (record2.dirty) {
//            	  console_log(real_end_date);
//            	  console_log(real_due_date);
//              	record.set('id',unique_uid);
//              	record.set('end_date',real_end_date);
//              	record.set('due_date',real_due_date);
    			console_log(record2);
              	record2.set('overtime_type',selectovertime);
              	record2.set('work_type',selectwork);	
    			//저장 수정
    			record2.save({
    				success : function() {
    					mystore.load(function() {});
    				}
    			});
//    		}
    		
    	}
    }
});

function createConfirm(btn){
	if(btn == 'yes'){
		var record = Fgrid.getStore().getAt(FrowIndex);
		console_log(record);
		var task_title = record.get('task_title');
		var parent = record.get('parent');
		var pj_unique = record.get('pj_unique');
		var position = record.get('position');
		Ext.Ajax.request({
			url: CONTEXT_PATH + '/statistics/task.do?method=createcolumn',
			params:{
				task_title : task_title
				,parent : parent
				,pj_unique : pj_unique
				,position : position
			},
			success : function(result, request) {
				store.load(function() {});
			},
			failure: extjsUtil.failureMessage
		});	
	}
}

function destoryConfirm(btn){
	if(btn == 'yes'){
		var record = Fgrid.getStore().getAt(FrowIndex);
		console_log(record);
		var unique_id = record.get('id');
//		var position = record.get('position');
//		var task_title = record.get('task_title');
		var pjttsk = Ext.ModelManager.create({
       		unique_id : unique_id
//       		position : position,
//       		task_title : task_title
    	 }, 'PjtTsk');
		pjttsk.destroy( {
      		 success: function() {
      			store.load(function() {});
      		 }
      	});
//		grid.store.remove(record);
	}
}

function destoryConfirm2(btn){
	if(btn == 'yes'){
		var record = Fgrid.getStore().getAt(FrowIndex);
		console_log(record);
		var unique_id = record.get('id');
//		var position = record.get('position');
//		var task_title = record.get('task_title');
		var pjtgongsu = Ext.ModelManager.create({
			unique_id : unique_id
//       		position : position,
//       		task_title : task_title
		}, 'Pjtgongsu');
		pjtgongsu.destroy( {
			success: function() {
				mystore.load(function() {});
			}
		});
//		grid.store.remove(record);
	}
}
var addGroup = Ext.create('Ext.Action', {
	id:'add',
	iconCls:'add',
	disabled: fPERM_DISABLING(),
    text: '실동공수추가',
    handler: function(widget, event) {
    	Ext.MessageBox.show({
    				title:panelSRO1136,
    				msg:'실동공수를 추가하시겠습니까?',
    				buttons: Ext.MessageBox.YESNO,
    				fn:addGroupConfirm,
    				icon: Ext.MessageBox.QUESTION
    				});
    			}
});

var addGroup2 = Ext.create('Ext.Action', {
	id:'add2',
	iconCls:'add',
	disabled: fPERM_DISABLING(),
    text: '유실공수추가',
    handler: function(widget, event) {
    	Ext.MessageBox.show({
    				title:panelSRO1136,
    				msg:'유실공수를 추가하시겠습니까?',
    				buttons: Ext.MessageBox.YESNO,
    				fn:addGroupConfirm2,
    				icon: Ext.MessageBox.QUESTION
    				});
    			}
});

function addGroupConfirm(btn){
	if(btn == 'yes'){
//		console_log(selectedAssyUid);
		Ext.Ajax.request({
			url: CONTEXT_PATH + '/design/pjtgongsu.do?method=create',
			params:{
				owner_unique : selectuser,
				base_date:selectdate,
				overtime_type:selectovertime,
				work_type:selectwork
			},
			success : function(result, request) {
				store.load(function() {});
			},
			failure: extjsUtil.failureMessage
		});	
	}
}
function addGroupConfirm2(btn){
	if(btn == 'yes'){
//		console_log(selectedAssyUid);
		Ext.Ajax.request({
			url: CONTEXT_PATH + '/design/pjtgongsu.do?method=createX',
			params:{
				owner_unique : selectuser,
				base_date:selectdate,
				overtime_type:selectovertime,
				work_type:selectwork
			},
			success : function(result, request) {
				mystore.load(function() {});
			},
			failure: extjsUtil.failureMessage
		});	
	}
}

Ext.onReady(function() {  
	    Ext.tip.QuickTipManager.init();
	    
	    var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	        clicksToEdit: 1
	    });
	    var cellEditingsub = Ext.create('Ext.grid.plugin.CellEditing', {
	        clicksToEdit: 1
	    });
	    
	    var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
	    
//	    var projectToolBar = getProjectToolbar(false/*hasPaste*/, false/*excelPrint*/) ;
	    
//	    var usertoolbar = 

	    Ext.define('PjtTsk', {
	        extend: 'Ext.data.Model',
	      	 fields: /*(G)*/vCENTER_FIELDS,
	      	    proxy: {
	    				type: 'ajax',
	    		        api: {
	    		            read: CONTEXT_PATH + '/design/pjtgongsu.do?method=readall' /*1recoed, search by cond, search */
//	    		            create: CONTEXT_PATH + '/sales/buyer.do?method=create', /*create record, update*/
//	    		            update: CONTEXT_PATH + '/design/pjtgongsu.do?method=update',//&overtime_type='+selectovertime+'&work_type='+selectwork,
//	    		            destroy: CONTEXT_PATH + '/design/pjtgongsu.do?method=destroy' /*delete*/
	    		        },
//	    		        extraParams:{
//	    					overtime_type:selectovertime,
//	    					work_type:selectwork
//	    				},
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
	    
	    Ext.define('Pjtgongsu', {
	        extend: 'Ext.data.Model',
	      	 fields: /*(G)*/vCENTER_FIELDS,
	      	    proxy: {
	    				type: 'ajax',
	    		        api: {
	    		            read: CONTEXT_PATH + '/design/pjtgongsu.do?method=read', /*1recoed, search by cond, search */
//	    		            create: CONTEXT_PATH + '/sales/buyer.do?method=create', /*create record, update*/
	    		            update: CONTEXT_PATH + '/design/pjtgongsu.do?method=update',//&overtime_type='+selectovertime+'&work_type='+selectwork,
	    		            destroy: CONTEXT_PATH + '/design/pjtgongsu.do?method=destroy' /*delete*/
	    		        },extraParams:{
	    					overtime_type:selectovertime,
	    					work_type:selectwork
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
	    
	    var tempColumn = [];
	    		
//	    tempColumn.push(updown);
//	    tempColumn.push(Project_columns);
		tempColumn.push(Task_columns);
//		tempColumn.push(Task_columns2);
		tempColumn.push(Schedule_columns);
		
		
		var tempColumn2 = [];
		
//	    tempColumn.push(updown);
//	    tempColumn.push(decription_columns);
//		tempColumn2.push(Task_columns);
//		tempColumn.push(Task_columns2);
		tempColumn2.push(Schedule_columns2);
//	    tempColumn2.push(decription_columns);
		
		
		
		
	    store = Ext.create('Ext.data.Store', {
	    	pageSize: getPageSize(),
	        model: 'PjtTsk',
	        sorters: [{
	        	property: 'base_date', 
	        	direction: 'ASC'
    		}]
//	    ,
//	        groupField: 'job_type'
	    });
	    
	    mystore = Ext.create('Ext.data.Store', {
	    	pageSize: getPageSize(),
	        model: 'Pjtgongsu',
	        sorters: [{
	        	property: 'position', 
	        	direction: 'ASC'
    		}],
	        groupField: 'job_type'
	    });
	    
//	    store.getProxy().setExtraParam('defaultTaskArray', defaultTaskArray);
	    store.load(function() {
		    grid = Ext.create('Ext.grid.Panel', {
		        //frame: true,
		        selModel: selModel,
		        title:getMenuTitle(),
		        //iconCls: 'icon-grid',
		        store: store,
		        region: 'center',
		        plugins: [cellEditing],
		        height: getCenterPanelHeight()/2,
		        bbar: getPageToolbar(store),
		        listeners: {
		            beforeshowtip: function(grid, tip, data) {
		                var cellNode = tip.triggerEvent.getTarget(tip.view.getCellSelector());
		                if (cellNode) {
		                    data.colName = tip.view.headerCt.getHeaderAtIndex(cellNode.cellIndex).text;
		                }
		            }
		        },
		        selModel: {
		            selType: 'cellmodel'
		        },
		        dockedItems: [{
		 			            xtype: 'toolbar',
		 			            items: [
		 			                    searchAction, '-',
		 			                    {
		 			            	//fieldLabel:getColName('user_name'),
									id:'usercombo',
								// name:'fix_mchn',
								    	xtype: 'combo',
								    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
//								           mode: 'local',
								           editable:false,
								           typeAhead: false,
								           // allowBlank: false,
								           width: 230,
								           labelWidth:30,
//								           queryMode: 'remote',
								           emptyText:'[부서명] 임직원 이름',
								           displayField:   'user_name',
//								           valueField:     'unique_id',
//								           value:vCUR_USER_NAME,
								           store: srchUserStore,
								            listConfig:{
							 	                loadingText: 'Searching...',
							 	                emptyText: 'No matching posts found.',								            	
								            	getInnerTpl: function(){
								            		return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
								            	}			                	
								            },
//								           triggerAction: 'all',
								            listeners: {
								                 select: function (combo, record) {
								                	 
								                	 selectuser = record[0].get('unique_id');
								                	 console_log('Selected selectuser : ' + selectuser);
								                	store.getProxy().setExtraParam('owner_unique',record[0].get('unique_id'));
								             		//store.load(function() {});
								             		mystore.getProxy().setExtraParam('owner_unique',record[0].get('unique_id'));
								             		//mystore.load(function() {});
								                 	
//								                 	console_log('Selected Value : ' + combo.getValue());
//								                 	var pjuid = record[0].get('unique_id');
//								                 	ac_uid = pjuid;
//								                 	var pj_name  = record[0].get('pj_name');
//								                 	var pj_code  = record[0].get('pj_code');
//// cloudProjectTreeStore.getProxy().setExtraParam('pjuid', pjuid);
//								                 	assy_pj_code ='';
//								                 	combo_pj_code = pj_code;
//								                 	combo_pj_name = pj_name;
//								                 	selectedPjUid = pjuid;
//								                 	console_log('assy_pj_code:' +assy_pj_code);
//								                 	srchTreeHandler (pjTreeGrid, cloudProjectTreeStore, 'projectcombo', 'pjuid', true);
//								                 	console_log('systemCode : ' + pjuid 
//								                 			+ ', codeNameEn=' + pj_name
//								                 			+ ', codeName=' + pj_code	);						  

							                 }
							            }
						        },'-',{ 
						        	fieldLabel:getColName('base_date'),
		      		                name: 'base_date_start',
		      		                id:'base_date_start',
		      		                format: 'Y-m-d',
		      				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
		      				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
		      					    	allowBlank: true,
		      					    	editable:false,
		      					    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
		      					    	xtype: 'datefield',
		      					    	value: new Date(),
		      					    	width: 150,
								        labelWidth:50,
		      					    	listeners: {
							                 select: function () {
							                	console_log('Selected base_date_start : ' + Ext.getCmp('base_date_start').getValue());
							                	selectdate = Ext.getCmp('base_date_start').getValue();
					      						store.getProxy().setExtraParam('base_date_start',Ext.getCmp('base_date_start').getValue());
								             	//store.load(function() {});
//								             	mystore.getProxy().setExtraParam('base_date_start',Ext.getCmp('base_date_start').getValue());
//								             	mystore.load(function() {});
							                 }
		      					    	}
//		      						handler: function(){
//		      							console_log('Selected selectuser : ' + Ext.getCmp('base_date').getValue());
//		      							store.getProxy().setExtraParam('base_date',Ext.getCmp('base_date').getValue());
//					             		store.load(function() {});
//		      							
//		      						}
		      					},'~',{ 
		      		                name: 'base_date_end',
		      		                id:'base_date_end',
		      		                format: 'Y-m-d',
		      				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
		      				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
		      					    	allowBlank: true,
		      					    	editable:false,
		      					    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
		      					    	xtype: 'datefield',
		      					    	value: new Date(),
		      					    	width: 100,
		      					    	listeners: {
							                 select: function () {
							                	console_log('Selected base_date_end : ' + Ext.getCmp('base_date_end').getValue());
							                	selectdate = Ext.getCmp('base_date_end').getValue();
					      						store.getProxy().setExtraParam('base_date_end',Ext.getCmp('base_date_end').getValue());
								             	//store.load(function() {});
//								             	mystore.getProxy().setExtraParam('base_date',Ext.getCmp('base_date').getValue());
//								             	mystore.load(function() {});
							                 }
		      					    	}
//		      						handler: function(){
//		      							console_log('Selected selectuser : ' + Ext.getCmp('base_date').getValue());
//		      							store.getProxy().setExtraParam('base_date',Ext.getCmp('base_date').getValue());
//					             		store.load(function() {});
//		      							
//		      						}
		      					},'-',{
	      						//fieldLabel:getColName('work_type'),
									id:'workcombo',
									// name:'fix_mchn',
							    	xtype: 'combo',
							    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
//								           mode: 'local',
							        editable:false,
							        typeAhead: false,
							           // allowBlank: false,
							        width: 137,
							        labelWidth:56,
							        queryMode: 'remote',
							        emptyText: '출근형태',
							        displayField:   'codeName',
//								           valueField:     'unique_id',
//								           value:'출근',
							        store: gongsuWorkTypeStore,
							        listConfig:{
						 	                loadingText: 'Searching...',
						 	                emptyText: 'No matching posts found.',								            	
							            	getInnerTpl: function(){
							            		return '<div data-qtip="{systemCode}">{codeName}</div>';
							            	}			                	
							        },
//								           triggerAction: 'all',
							        listeners: {
							                 select: function (combo, record) {
							                	 
							                	var systemCode = record[0].get('systemCode');
					     	                    var codeNameEn  = record[0].get('codeNameEn');
					     	                    var codeName  = record[0].get('codeName');
							                	 
							                	selectwork = record[0].get('systemCode');
							                	console_log('Selected selectwork : ' + selectwork);
							                	store.getProxy().setExtraParam('work_type',record[0].get('systemCode'));
						                 }
						            }
						        }

		      					]
		        }
		        ,{
		        	xtype: 'toolbar',
		            items: [/*saveAction,addGroup,addGroup2*/
		                    {
		                        xtype: 'triggerfield',
		                        emptyText: '프로젝트코드',
		                        id: 'srch_pj_code',
		                        width: 145,
		                        fieldStyle: 'text-transform:uppercase',
		                    	listeners : {
		                        	specialkey : function(field, e) {
		                        		if (e.getKey() == Ext.EventObject.ENTER) {
		              	    				store.getProxy().setExtraParam('pj_code', Ext.getCmp('srch_pj_code').getValue());
		              	    				store.load(function() {});
		                        		}
		                        	},
		                        	change: function(){
								      store.getProxy().setExtraParam('pj_code', Ext.getCmp('srch_pj_code').getValue());
								    }
		                    	},
		                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
		                        'onTrigger1Click': function() {
		                        	Ext.getCmp('srch_pj_code').setValue('');
		                        	store.getProxy().setExtraParam('pj_code', Ext.getCmp('srch_pj_code').getValue());
              	    				//store.load(function() {});
		                        	//srchSingleHandler (productStore,'srchUnique_id', 'item_code', false);
//		                        	productStore.getProxy().setExtraParam('item_code', Ext.getCmp('srchUnique_id').getValue());
//		                        	productStore.load(function() {});
		                    	}

		              		},'-'
		                    ,{

		      		          xtype: 'triggerfield',
		      		          emptyText: '프로젝트명',
		      		          id: 'srch_pj_name',
		      		      	  listeners : {
		      		          		specialkey : function(field, e) {
			      		          		if (e.getKey() == Ext.EventObject.ENTER) {
			      		          			store.getProxy().setExtraParam('pj_name', Ext.getCmp('srch_pj_name').getValue());
			      		          			store.load(function() {});
	//		      			    				productStore.getProxy().setExtraParam('item_code', Ext.getCmp('srchUnique_id').getValue());
	//		      			    				console_log(Ext.getCmp('srchUnique_id').getValue());
	//		      			    				productStore.load(function() {});
			      		          			//srchSingleHandler (productStore,'srchUnique_id', 'item_code', false);
			      		          		}
			      		          	},
		                        	change: function(){
								      store.getProxy().setExtraParam('pj_name', Ext.getCmp('srch_pj_name').getValue());
								    }
		      		      	  },
		      		          trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
		      		            'onTrigger1Click': function() {
		      		          	Ext.getCmp('srch_pj_name').setValue('');
		      		          	store.getProxy().setExtraParam('pj_name', Ext.getCmp('srch_pj_name').getValue());
    		          			//store.load(function() {});
		      		      	}				                    	
		                },'-'
		                ,{
		      		          xtype: 'triggerfield',
		      		          emptyText: '부서명',
		      		          id: 'srch_dept_name',
		      		      	  listeners : {
		      		          		specialkey : function(field, e) {
			      		          		if (e.getKey() == Ext.EventObject.ENTER) {
			      		          			var enValue = Ext.JSON.encode(Ext.getCmp('srch_dept_name').getValue());
			      		          			store.getProxy().setExtraParam('dept_name', enValue);
			      		          			store.load(function() {});
			      		          		}
			      		          	},
		                        	change: function(){
			      		          			var enValue = Ext.JSON.encode(Ext.getCmp('srch_dept_name').getValue());
			      		          			store.getProxy().setExtraParam('dept_name', enValue);
								    }
		      		      	  },
		      		          trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
		      		            'onTrigger1Click': function() {
		      		          	Ext.getCmp('srch_dept_name').setValue('');
		      		          	store.getProxy().setExtraParam('dept_name', Ext.getCmp('srch_dept_name').getValue());
    		          			//store.load(function() {});
		      		      	}				                    	
		                }
		            ]
		        }
		        
		        ],
		        features: [{
		            id: 'group',
		            ftype: 'groupingsummary',
		            groupHeaderTpl: '{name}',
		            hideGroupedHeader: true,
		            enableGroupingMenu: false	
		        }, {
		            ftype: 'summary',
		            dock: 'bottom'
		        }],
//		        columns: tempColumn
		        columns: /*(G)*/vCENTER_COLUMNS
		    });
		    
		    mystore.load(function() {});
		    myGrid = Ext.create('Ext.grid.Panel', {
		        region: 'south',
		        height: getCenterPanelHeight()/2, 
		        store: mystore,
		        selModel: selModel,
		        plugins: [cellEditingsub],
		        selModel: {
		            selType: 'cellmodel'
		        },
		        
		        dockedItems: [{
		            dock: 'top',
		            xtype: 'toolbar',
		            items: [
      				     ]
		        	}
		        
		        ],
		        features: [{
		            id: 'group',
		            ftype: 'groupingsummary',
		            groupHeaderTpl: '{name}',
		            hideGroupedHeader: true,
		            enableGroupingMenu: false	
		        }, {
		            ftype: 'summary',
		            dock: 'bottom'
		        }],
		        columns: /*(G)*/tempColumn2,
		        viewConfig: {
		            stripeRows: true,
		            enableTextSelection: true,
		            listeners: {
		                itemcontextmenu: function(view, rec, node, index, e) {
		                    e.stopEvent();
		                    contextMenu.showAt(e.getXY());
		                    return false;
		                }
		            }
		        }
		    });

		    
		    
		    var main =  Ext.create('Ext.panel.Panel', {
			    layout:'border',
		        border: false,
		        layoutConfig: {columns: 1, rows:2},
			    defaults: {
			        collapsible: true,
			        split: true,
			        cmargins: '5 0 0 0',
			        margins: '0 0 0 0'
			    },
			    items: [grid,/* myGrid*/]
			});
		    
		    
		    
		    
	    fLAYOUT_CONTENT(main);
	    cenerFinishCallback();
	    });
	 });