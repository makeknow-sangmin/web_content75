/*
 * CRT00 결재함
 */

/*
 * CRT3 미결함
 */

searchField = 
	[
	'unique_id',
	'name',
	'content',
	'state'
	];


//global var.
var grid = null;
var store = null;
var gPr_uid = '';
var gStatus = '';

var trayType = "PENDING";
switch(vCUR_MENU_CODE) {
case "CRT00":
	trayType = "PENDING";
	break;

}
//
//MessageBox = function(){
//    return {
//        msg : function(format){
//            return Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 0));
//        }
//    };
//}();
//

function getName(value, code) {
	var lang = vLANG;
	switch(code) {
		case 'state':
		{
			switch(lang) {
			case 'ko':
//				return '한글';
				switch(value){
					case 'R':
						return '접수';
					break;
					case 'P':
						return '작성중';
					break;
					case 'I':
						return '결재중';
					break;
					case 'A':
						return '승인완료';
					break;
					case 'D':
						return '반려';
					break;
					case 'C':
						return '복합';
					break;
					case 'G':
						return '입고완료';
					break;
					case 'S':
						return '시스템삭제';
					break;
					case 'E':
						return '주문완료';
					break;
				}
				break;
			case 'zh':
//				return '중국어';
				switch(value){
				case 'R':
					return '挂号';
				break;
				case 'P':
					return '开具中';
				break;
				case 'I':
					return '批准中';
				break;
				case 'A':
					return '承认完成';
				break;
				case 'D':
					return '返回';
				break;
				case 'C':
					return '复合';
				break;
				case 'G':
					return '入库完成';
				break;
				case 'S':
					return '系统删除';
				break;
				case 'E':
					return '订单完成';
				break;
			}
				break;
			case 'en':
//				return '영어';
				switch(value){
				case 'R':
					return 'Receipt';
				break;
				case 'P':
					return 'Drawing';
				break;
				case 'I':
					return 'Sanction';
				break;
				case 'A':
					return 'Recognition';
				break;
				case 'D':
					return 'Return';
				break;
				case 'C':
					return 'Compositeness';
				break;
				case 'G':
					return 'EnterFinish';
				break;
				case 'S':
					return 'System Delete';
				break;
				case 'E':
					return 'RequestFinish';
				break;
			}
				break;
			}
		}
		break;
		case 'result':
		{
			switch(lang) {
			case 'ko':
//				return '한글';
				switch(value){
					case 'Y':
						return '승인';
					break;
					case 'N':
						return '반려';
					break;
					case 'P':
						return '대기';
					break;
				}
			case 'zh':
				switch(value){
				case 'Y':
					return '承认';
				break;
				case 'N':
					return '返回';
				break;
				case 'P':
					return '等待';
				break;
			}
			case 'en':
				switch(value){
				case 'Y':
					return 'Acknowledgment';
				break;
				case 'N':
					return 'Return';
				break;
				case 'P':
					return 'Ready';
				break;
			}
			}
		}
		break;
		case 'role':
		{
			switch(lang) {
			case 'ko':
//				return '한글';
				switch(value){
					case 'D':
						return '결재';
					break;
					case 'I':
						return '통보';
					break;
					case 'W':
						return '상신';
					break;
				}
			case 'zh':
				switch(value){
				case 'D':
					return '批准';
				break;
				case 'I':
					return '通知';
				break;
				case 'W':
					return '提交';
				break;
			}
			case 'en':
				switch(value){
				case 'D':
					return 'Sanction';
				break;
				case 'I':
					return 'Notify';
				break;
				case 'W':
					return 'Submit';
				break;
			}
			}
		}
		break;
	}

	return '';
}

var viewHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');

	Routing.load(unique_id ,{
		 success: function(routing) {
			 var rec = grid.getSelectionModel().getSelection()[0];
		     	var unique_id = rec.get('unique_id'); //rtgast uid
		    	var po_no = rec.get('po_no');
		    	var name = rec.get('name');
		    	var content = rec.get('content');
//		    	var item_quan = rtgast.get('item_quan' );
		    	var rtgType = rec.get('rtgType');
		    	var submit_date = rec.get('submit_date');
		    	var req_date = rec.get('req_date');
		    	var pj_uid = rec.get('coord_key3');
		    	var rtg_type = rec.get('rtg_type');
		    	
		    	console_log('req_date=' + req_date);
				console_log('unique_id=' + unique_id);
				console_log('po_no=' + po_no);
				console_log('name=' + name);
				console_log('content=' + content);

				var routingStore = Ext.create('Mplm.store.RoutingStore', {} );
				var projectStore = Ext.create('Mplm.store.ProjectStore', {} );
				routingStore.getProxy().setExtraParam('unique_id',unique_id);
				projectStore.getProxy().setExtraParam('id',pj_uid);

				var newStoreData = [];
				routingStore.load(  function(records) {
			        for (var i=0; i<records.length; i++){
			        	var rtgwrk_unique_id = records[i].get('rtgwrk_unique_id');
			        	var user_id = records[i].get('user_id');
			        	var user_name = records[i].get('user_name');
			        	var submit_date = records[i].get('submit_date');
			        	var dept_name = records[i].get('dept_name');
			        	var serial = records[i].get('serial');
			        	var comment = records[i].get('comment');
			        	var state = records[i].get('state');
			        	var result = records[i].get('result');
			        	var role = records[i].get('role');
			        	po_user_uid = records[i].get('po_user_uid');
			        	var obj = {};
			        	var states = getName(state, 'state');
			        	var results = getName(result, 'result');
			        	var roles = getName(role, 'role');
			        	obj['rtgwrk_unique_id'] = rtgwrk_unique_id;
			        	obj['user_id'] = user_id;
			        	obj['user_name'] = user_name;
			        	obj['submit_date'] = submit_date.substring(0,16);
			        	obj['dept_name'] = dept_name;
//			        	obj['serial'] = serial;
			        	obj['comment'] = comment;
//			        	obj['state'] = states;
			        	obj['result'] = results;
			        	obj['role'] = roles;
			        	newStoreData.push(obj);
			        }
					
					var RoutingGrid = Ext.create('Ext.grid.Panel', {
					    store: Ext.create('Ext.data.Store', {
		                    fields : ['rtgwrk_unique_id'
		                              ,'user_id'
		                              ,'user_name'
		                              ,'submit_date'
		                              ,'dept_name'
//		                              ,'serial'
		                              ,'comment'
//		                              ,'state'
		                              ,'result'
		                              ,'role'
		                              ],
		                    data   : newStoreData
		                }),
//		                routingStore,
					    stateId: 'stateGrid-routingGrid-111',
					    layout: 'fit',
					    border: false,
					    frame: false ,
//				        height: 200,
						multiSelect : false,
					    columns: [
//					              {text: getColName('unique_id'), dataIndex: 'rtgwrk_unique_id'}
					              {text: ppo2_user_id, dataIndex: 'user_id'}
					              ,{text: ppo2_user_name, dataIndex: 'user_name'}
					              ,{text: ppo2_submit_date, dataIndex: 'submit_date'}
					              ,{text: ppo2_dept_name, dataIndex: 'dept_name'}
					              ,{text: ppo2_comment, dataIndex: 'comment'}
//					              ,{text: ppo2_serial, dataIndex: 'serial', flex: 50}
//					              ,{text: ppo2_state, dataIndex: 'state', flex: 50}
					              ,{text: ppo2_result, dataIndex: 'result', flex: 50}
					              ,{text: ppo2_role, dataIndex: 'role', flex: 50}
					              ]
						});
					
					
					var tabPanel = new Ext.TabPanel({
//			    		id:'project-property-panel',
			            collapsible: false,
			            floatable: false,
			            split: true,
		    			frame: false,
		    	        border: false,
						xtype: 'tabpanel',
//						title: '',
						width:'25%',
//				        region: 'east',
				        activeTab: 0,
//				        tabPosition: 'bottom',
				        items: [{	            
				        	id: 'simple-form-panel-div',
				            title:panelSRO1213,
				            border: false,
				            autoScroll:true
				        }
				        ,{	            
				        	id: 'detail-form-panel-div',
				            title: panelSRO1216,
				            border: false,
				            autoScroll:true
				        }
//				        ,{	            
//				        	id: 'projectP-property-panel-div',
//				            title: '정산현황',
//				            border: false,
//				            autoScroll:true
//				        }
				        ]
			    });
					
					var form = Ext.create('Ext.form.Panel', {
						id: 'formPanel',
						xtype: 'form',
//		    	        layout: 'absolute',
		    			frame: false,
		    	        border: false,
		                bodyPadding: 15,
		                region: 'center',
		    	        defaults: {
		    	            anchor: '100%',
		    	            allowBlank: false,
		    	            msgTarget: 'side',
		    	            labelWidth: 60
		    	        },
				        items: [
									RoutingGrid,
									{
										xtype: 'component',
										html: '<br/><hr/><br/>',
										anchor: '100%'
									},tabPanel]
								});
								
								var simplepanel = Ext.getCmp('simple-form-panel-div');
								simplepanel.removeAll();
								simplepanel.add({
									fieldLabel: getColName('unique_id'),
									xtype:  'displayfield',
									value: unique_id,
									name: 'unique_id',
									anchor: '100%'
								},{
									fieldLabel: crt3_name,
									xtype:  'displayfield',
									value: name,
									name: 'name',
									anchor: '100%'
								},{
									fieldLabel: crt3_content,
									xtype:  'displayfield',
									value: content,
									name: 'content',
									anchor: '100%'
								},{
									fieldLabel: toolbar_pj_req_date,
									xtype:  'displayfield',
									value: req_date.substring(0,10),
									name: 'req_date',
									anchor: '100%'
								});
								simplepanel.doLayout();
								var detailpanel = Ext.getCmp('detail-form-panel-div');
								detailpanel.removeAll();
								if(rtg_type=='FN'){
									
									projectStore.load(  function(records) {
										
										console_log('total_cost=' + records[0].get('total_cost'));
										
										detailpanel.add({
									    	fieldLabel: getColName('selling_price'),
									    	xtype:  'displayfield',
									    	value: records[0].get('selling_price'),
									    	name: 'selling_price',
									    	anchor: '100%'
										},{
									    	fieldLabel: panelSRO1217,
									    	xtype:  'displayfield',
									    	value: records[0].get('reserved_double5'),
									    	name: 'reserved_double5',
									    	anchor: '100%'
										}
//										,{
//									    	fieldLabel: panelSRO1218,
//									    	xtype:  'displayfield',
//									    	value: records[0].get('total_cost'),
//									    	name: 'total_cost',
//									    	anchor: '100%'
//									    }
										);	
									});
								}
								simplepanel.doLayout();
		        var win = Ext.create('ModalWindow', {
		            title: CMD_VIEW,
		            width: 830,
		            height: 520,
		            layout: 'fit',
		            plain:true,
		            items: form,
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
		        win.show();
				});//endofwin
		 }//endofsuccess
	 });//emdofload

};

var editHandler = function() {
                			var rec = grid.getSelectionModel().getSelection()[0];
                			var unique_id = rec.get('unique_id');

                			Routing.load(unique_id ,{
                				 success: function(routing) {
                					 	var unique_id = routing.get('unique_id');
                						var name = routing.get('name');
                						var content = routing.get('content');
                						var state = routing.get('state');
                						var create_date = routing.get('create_date');
                				        
                						var lineGap = 30;
                						
                						
                				    	var form = Ext.create('Ext.form.Panel', {
                				    		id: 'formPanel',
                				            layout: 'absolute',
                				            url: 'save-form.php',
                				            defaultType:  'textfield',
                				            border: false,
                				            bodyPadding: 15,
                				            defaults: {
                				                anchor: '100%',
                				                allowBlank: false,
                				                msgTarget: 'side',
                				                labelWidth: 100
                				            },
                				            items: [ 
											{
											    fieldLabel: getColName('unique_id'),
											    value: unique_id,
											    x: 5,
											    y: 0 + 1*lineGap,
											    name: 'unique_id',
								                readOnly: true,
								    			fieldStyle: 'background-color: #ddd; background-image: none;',
											    anchor: '-5'  // anchor width by percentage
											},{
            				                fieldLabel: getColName('name'),
            				                value: name,
            				                x: 5,
            				                y: 0 + 2*lineGap,
            				                name: 'name',
            				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: getColName('content'),
                				                value: content,
                				                x: 5,
                				                y: 0 + 3*lineGap,
                				                name: 'content',
                				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: getColName('state'),
                				                value: state,
                				                x: 5,
                				                y: 0 + 4*lineGap,
                				                name: 'state',
                				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: getColName('create_date'),
                				                value: create_date,
                				                x: 5,
                				                y: 0 + 5*lineGap,
                				                name: 'create_date',
                				                anchor: '-5'  // anchor width by percentage
                				            }
                				            ]
                				        }); //endof form

                				        var win = Ext.create('ModalWindow', {
                				            title: CMD_MODIFY,
                				            width: 700,
                				            height: 350,
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
	                				                	var routing = Ext.ModelManager.create(val, 'Routing');
	                				                	
	                				            		//저장 수정
	                				                	routing.save({
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
                				                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                				                    }
                				                    


                				                  }
                				            },{
                				                text: CMD_CANCEL,
                				            	handler: function(){
                				            		if(win) {win.close();} }
                				            }]
                				        });
                				        win.show();
                						//endofwin
                				 }//endofsuccess
                			 });//emdofload
                	
                };

//writer define
Ext.define('Routing.writer.SinglePost', {
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



function deleteConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_id = rec.get('unique_id');
	           	 var routing = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'Routing');
        		
	           	routing.destroy( {
	           		 success: function() {}
	           	});
           	
        	}
        	grid.store.remove(selections);
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

function doSanction(sancType, uidRtgast, rtgType, comment, po_user_uid, win) {

	console_log(comment);

    Ext.Ajax.request({
			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=sanction',
			params:{
			   	sancType : sancType,
		    	comment : comment,
		    	uidRtgast : uidRtgast,
		    	rtgType : rtgType,
		    	po_user_uid : po_user_uid
		 
			},
			success : function(result, request) {
				win.close();
				store.load(function() {});
			},
			failure: extjsUtil.failureMessage
		});
}

var win;
var po_user_uid = null;
//Define sancAction
var sancAction = Ext.create('Ext.Action', {
	iconCls:'EPMPerformSignoffTask',
    text: crt_saction,
    disabled: true,
    handler: function(widget, event) {
		var rec = grid.getSelectionModel().getSelection()[0];
     	var unique_id = rec.get('unique_id'); //rtgast uid
    	var po_no = rec.get('po_no');
    	var name = rec.get('name');
    	var content = rec.get('content');
//    	var item_quan = rtgast.get('item_quan' );
    	var rtgType = rec.get('rtgType');
    	var submit_date = rec.get('submit_date');
    	var rtg_type = rec.get('rtg_type');
    	var coord_key3 = rec.get('coord_key3');
    	var pj_uid = rec.get('coord_key3');
		
		console_log('unique_id=' + unique_id);
		console_log('po_no=' + po_no);
		console_log('name=' + name);
		console_log('content=' + content);

		var routingStore = Ext.create('Mplm.store.RoutingStore', {} );
		var projectStore = Ext.create('Mplm.store.ProjectStore', {} );
		routingStore.getProxy().setExtraParam('unique_id',unique_id);
		projectStore.getProxy().setExtraParam('id',pj_uid);

		var newStoreData = [];
		routingStore.load(  function(records) {
	        for (var i=0; i<records.length; i++){
	        	var rtgwrk_unique_id = records[i].get('rtgwrk_unique_id');
	        	var user_id = records[i].get('user_id');
	        	var user_name = records[i].get('user_name');
	        	var submit_date = records[i].get('submit_date');
	        	var dept_name = records[i].get('dept_name');
	        	var serial = records[i].get('serial');
	        	var comment = records[i].get('comment');
	        	var state = records[i].get('state');
	        	var result = records[i].get('result');
	        	var role = records[i].get('role');
	        	po_user_uid = records[i].get('po_user_uid');
	        	var obj = {};
	        	obj['rtgwrk_unique_id'] = rtgwrk_unique_id;
	        	obj['user_id'] = user_id;
	        	obj['user_name'] = user_name;
	        	obj['submit_date'] = submit_date.substring(0,16);
	        	obj['dept_name'] = dept_name;
//	        	obj['serial'] = serial;
	        	obj['comment'] = comment;
//	        	obj['state'] = state;
	        	obj['result'] = result;
	        	obj['role'] = role;
	        	newStoreData.push(obj);
	        }
			
			var RoutingGrid = Ext.create('Ext.grid.Panel', {
			    store: Ext.create('Ext.data.Store', {
                    fields : ['rtgwrk_unique_id'
                              ,'user_id'
                              ,'user_name'
                              ,'submit_date'
                              ,'dept_name'
//                              ,'serial'
                              ,'comment'
//                              ,'state'
                              ,'result'
                              ,'role'
                              ],
                    data   : newStoreData
                }),
//                routingStore,
			    stateId: 'stateGrid-routingGrid-111',
			    layout: 'fit',
			    border: false,
			    frame: false ,
//		        height: 200,
				multiSelect : false,
			    columns: [
//			              {text: getColName('unique_id'), dataIndex: 'rtgwrk_unique_id'}
			              {text: ppo2_user_id, dataIndex: 'user_id'}
			              ,{text: ppo2_user_name, dataIndex: 'user_name'}
			              ,{text: ppo2_dept_code, dataIndex: 'submit_date'}
			              ,{text: ppo2_dept_name, dataIndex: 'dept_name'}
			              ,{text: ppo2_comment, dataIndex: 'comment'}
//			              ,{text: ppo2_serial, dataIndex: 'serial', flex: 50}
//			              ,{text: ppo2_state, dataIndex: 'state', flex: 50}
			              ,{text: ppo2_result, dataIndex: 'result', flex: 50}
			              ,{text: ppo2_role, dataIndex: 'role', flex: 50}
			              ]
				});
			
			
			var tabPanel = new Ext.TabPanel({
//	    		id:'project-property-panel',
	            collapsible: false,
	            floatable: false,
	            split: true,
    			frame: false,
    	        border: false,
				xtype: 'tabpanel',
//				title: '',
				width:'100%',
//		        region: 'east',
		        activeTab: 0,
//		        tabPosition: 'bottom',
		        items: [{	            
		        	id: 'simple-form-panel-div',
		            title: panelSRO1213,
		            border: false,
		            autoScroll:true
		        }
		        ,{	            
		        	id: 'detail-form-panel-div',
		            title: panelSRO1216,
		            border: false,
		            autoScroll:true
		        }
//		        ,{	            
//		        	id: 'projectP-property-panel-div',
//		            title: '정산현황',
//		            border: false,
//		            autoScroll:true
//		        }
		        ]
	    });
			
			var form = Ext.create('Ext.form.Panel', {
				id: 'formPanel',
				xtype: 'form',
//    	        layout: 'absolute',
    			frame: false,
    	        border: false,
                bodyPadding: 15,
                region: 'center',
    	        defaults: {
    	            anchor: '100%',
    	            allowBlank: false,
    	            msgTarget: 'side',
    	            labelWidth: 60
    	        },
		        items: [
		                RoutingGrid,
                {
                	xtype: 'component',
                	html: '<br/><hr/><br/>',
                	anchor: '100%'
                },tabPanel]
			});
			
			
			
			var simplepanel = Ext.getCmp('simple-form-panel-div');
			simplepanel.removeAll();
			simplepanel.add({
				fieldLabel: getColName('unique_id'),
				xtype:  'displayfield',
				value: unique_id,
				name: 'unique_id',
				anchor: '100%'
			},{
				fieldLabel: crt3_po_no,
				xtype:  'displayfield',
				value: po_no,
			    name: 'po_no',
			    anchor: '100%'
			},{
		    	fieldLabel: crt3_name,
		    	xtype:  'displayfield',
		    	value: name,
		    	name: 'name',
		    	anchor: '100%'
		    },{
		    	fieldLabel: crt3_content,
		    	xtype:  'displayfield',
		    	value: content,
		    	name: 'content',
		    	anchor: '100%'
		    },{
		    	fieldLabel: crt3_comment,
		    	xtype: 'textarea',
		    	height: 200,
		    	width:700,
		    	name: 'comment',
		    	id: 'comment'
		    });
			simplepanel.doLayout();
			var detailpanel = Ext.getCmp('detail-form-panel-div');
			detailpanel.removeAll();
			if(rtg_type=='FN'){
				
				projectStore.load(  function(records) {
					
					console_log('total_cost=' + records[0].get('total_cost'));
					
					detailpanel.add({
				    	fieldLabel:getColName('selling_price'),
				    	xtype:  'displayfield',
				    	value: records[0].get('selling_price'),
				    	name: 'selling_price',
				    	anchor: '100%'
					},{
				    	fieldLabel: panelSRO1217,
				    	xtype:  'displayfield',
				    	value: records[0].get('reserved_double5'),
				    	name: 'reserved_double5',
				    	anchor: '100%'
					}
//					,{
//				    	fieldLabel: '총금액',
//				    	xtype:  'displayfield',
//				    	value: records[0].get('total_cost'),
//				    	name: 'total_cost',
//				    	anchor: '100%'
//				    }
					);	
				});
			}
			simplepanel.doLayout();

			var win = Ext.create('widget.window', {
				title: CMD_VIEW  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
//				modal:true,
//				plain:true,
//				closable: true,
//				closeAction: 'hide',
//				width: 750,
//				minWidth: 750,
//				height: 500,
//				layout:{
//					type: 'border',
//					padding: 5
//				},
				width: 830,
	            height: 520,//480,
	            plain:true,
				items: form,
	         	buttons: [{
		            text: '승인',
	     			handler: function(){
	     				var comment = Ext.getCmp('comment').getValue();
	     				
	     				doSanction('YES',  unique_id, rtgType, comment, po_user_uid, win);
//	     				if(win) 
//	     				{
//	     					win.close();
//	     				} 
	     			}
		         },{
		            text: '반려',
	     			handler: function(){
	     				var comment = Ext.getCmp('comment').getValue();
	     				doSanction('NO',  unique_id, rtgType, comment, po_user_uid, win);
//	     				if(win) 
//	     				{
//	     					win.close();
//	     				} 
	     			}
		         },{
			            text: '취소',
		     			handler: function(){
		     				if(win) 
		     				{
		     					win.close();
		     				} 
		     			}
			         }]
			});
			win.show();
		}); 
  }
});


//Define Add Action
var addAction =	 Ext.create('Ext.Action', {
	iconCls:'EPMPerformSignoffTask',
    text: crt_saction,
    disabled: true,
    handler: function(widget, event) {

		var lineGap = 30;
    	var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
            layout: 'absolute',
            url: 'save-form.php',
            defaultType: 'textfield',
            border: false,
            bodyPadding: 15,
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 100
            },
            items: [
		        {
				xtype:'fieldset',
				x: 5,
	            title: '상신내역',
	            collapsible: true,
	            defaults: {
	                anchor: '100%',
	                layout: {
	                    type: 'hbox'
//	                defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
	                }
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
//                 defaults: { labelWidth: 90, labelAlign: 'right',  anchor:'95%'  },
                 items: [{
                 	xtype: 'textfield',
//                    flex : 1,
                    name : '',
                    id : '',
                    fieldLabel:    '主题',
                    displayField:   "title",
                    readOnly : true,
                    fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
             		}]
         	},{ //---------------------------------------------------두번째 컬럼
     		xtype: 'container',
             flex: 1,
             layout: 'anchor',
             defaultType: 'textfield',
//             defaults: { labelWidth: 90, labelAlign: 'right', anchor:'95%'  },  
     		 items:[{ 
            		
            		xtype: 'textfield',
                    flex : 1,
                    name : 'unique_id',
                    id : 'unique_id',
                    fieldLabel: '批准数量',
                    displayField:   "title",
                    readOnly : true,
                    fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
     			 }]
     		}] 
     	}]
    },{
    	xtype: 'fieldset',
        x: 5,
        y: 3 + 6*lineGap,
        title: '订单',
        collapsible: true,
        defaults: {
            anchor: '100%',
            layout: {
                type: 'hbox'
//                defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
            }
        },
        items: [
                {
                	xtype : 'container',
                	layout:'hbox',
                items : [
                             {
                            	 xtype: 'container',
//                                 flex: 1,
                                 border:false,
                                 layout: 'anchor',
                                 defaultType: 'textfield',
//                                 defaults: { labelWidth: 90, labelAlign: 'right',  anchor:'95%'  },
                                 items: [{
                                 	xtype: 'textfield',
//                                    flex : 1,
                                    name : '',
                                    id : '',
                                    fieldLabel:    '订单总额',
                                    displayField:   "title",
                                    readOnly : true,
                                    fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
                             		}]
                         	}
                            ]
                },{
             		xtype: 'textarea',
             		id: '',
             		name: '',
             		readOnly: true,
             		fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
             	}
                ]
    }
			]
        		});	//end form

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD + ' :: ' + ' ',
            width: 700,
            height: 450,
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
                   	 var routing = Ext.ModelManager.create(val, 'Routing');
                   	 var wa_code = Ext.getCmp('wa_code').getValue();
                   	console_log('wa_code=' + wa_code);
                   //중복 코드 체크
 					Ext.Ajax.request({
    						url: CONTEXT_PATH + '/sales/buyer.do?method=checkCode',				
         				params:{
         					wa_code : wa_code
         				},
    						
    						success : function(result, request) {
    							
    							var ret = result.responseText;
    							console_log(ret);
    							
    							if(ret == 0 ||  ret  == '0') {
    								//저장 수정
    								routing.save({
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
    								Ext.MessageBox.alert(crt00_duplicate_msg, crt00_check_msg + getColName('wa_code') + ' '+crt00_check_value); 
    							}
    							console_log('requested ajax...');
    						},
    						failure: extjsUtil.failureMessage
    					});  
                    } else {
                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                    }

                  }
            },{
                text: CMD_CANCEL,
            	handler: function(){
            		if(win) {win.close();} }
            }]	//end button
        });	//end var win
		win.show(this, function() {
		    //button.dom.disabled = false;
		});
     }	//end handler
});	//end addAction

//Define Edit Action
var editAction = Ext.create('Ext.Action', {
	itemId: 'editButton',
    iconCls: 'pencil',
    text: edit_text,
    disabled: true ,
    handler: editHandler
});

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});

/******** move to handler**********
var printExcel = Ext.create('Ext.Action', {
	itemId: 'printExcelButton',
    iconCls: 'MSExcelX',
    text: 'Excel Print',
    disabled: false ,
    handler: printExcelHandler
});
**********************************/

//Define Detail Action
var detailAction  = Ext.create('Ext.Action', {
	itemId: 'detailButton',
    iconCls: 'application_view_detail',
    text: detail_text,
    disabled: true,
    handler: viewHandler
});
//Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ detailAction, /*editAction, removeAction*/  ]
});

Ext.onReady(function() {  
	makeSrchToolbar(searchField);
	 //Routing Store 정의
	Ext.define('Routing', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/rtgMgmt/routing.do?method=read',
		            create: CONTEXT_PATH + '/rtgMgmt/routing.do?method=create',
		            update: CONTEXT_PATH + '/rtgMgmt/routing.do?method=update',
		            destroy: CONTEXT_PATH + '/rtgMgmt/routing.do?method=destroy'
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
		model: 'Routing',
		//remoteSort: true,
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	
	store.getProxy().setExtraParam('trayType', trayType);
	
 	store.load(function() {
 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
			
 			grid = Ext.create('Ext.grid.Panel', {
			        store: store,
			        //COOKIE//stateful: true,
			        collapsible: true,
			        multiSelect: true,
			        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
			        selModel: selModel,
			        //layout: 'fit',
			        height: getCenterPanelHeight()/2,
			     // paging bar on the bottom
			        
			        bbar: getPageToolbar(store),
			        region: 'center',
			        dockedItems: [{
			            dock: 'top',
			            xtype: 'toolbar',
			            items: [
			                    /*searchAction
			                    , '-',*/  sancAction,  /*'-', removeAction,*/
	      				        '->'
//			                    ,printExcel
			                    ,
	      				            {
	      				                iconCls: 'tasks-show-all',
	      				                tooltip: 'All',
	      				                toggleGroup: 'status'
	      				            },
	      				            {
	      				                iconCls: 'tasks-show-active',
	      				                tooltip: 'Current',
	      				                toggleGroup: 'status'
	      				            },
	      				            {
	      				                iconCls: 'tasks-show-complete',
	      				                tooltip: 'Past',
	      				                toggleGroup: 'status'
	      				            }
	      				          
	      				          ]
			        },
//			        {
//			            xtype: 'toolbar',
//			            items: /*(G)*/vSRCH_TOOLBAR
//			        }
			        
			        ],
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
			                },
			                itemdblclick: viewHandler /* function(dv, record, item, index, e) {
//			                    alert('working');
//			                }*/

			            }
			        },
			        title: getMenuTitle()//,
			        //renderTo: 'MAIN_DIV_TARGET'
			    });
//			fLAYOUT_CONTENT(grid);
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		            if (selections.length) {
						//grid info 켜기
						displayProperty(selections[0]);
						
						if(fPERM_DISABLING()==true) {
							collapseProperty();
							sancAction.disable();
			            	removeAction.disable();
			            	editAction.disable();
						}else{
							removeAction.enable();
			            	editAction.enable();
			            	sancAction.enable();
						}
						detailAction.enable();
						sancAction.enable();
						
						var rec = grid.getSelectionModel().getSelection()[0];
		        		
		        		gPr_uid = rec.get('unique_id');
		        		gStatus = rec.get('rtg_type');
		        		cartstore.getProxy().setExtraParam('unique_id', gPr_uid);
		        		cartstore.getProxy().setExtraParam('rtg_type', gStatus);
						cartstore.load(function(){});
		            } else {
		            	if(fPERM_DISABLING()==true) {
		            		collapseProperty();//uncheck no displayProperty
			            	removeAction.disable();
			            	editAction.disable();
			            	sancAction.disable();
		            	}else{
		            		collapseProperty();//uncheck no displayProperty
		            		removeAction.disable();
			            	editAction.disable();
			            	sancAction.disable();
		            	}
		            	detailAction.enable();
		            }
		        }
		    });
		    Ext.define('Cartmap', {
			   	 extend: 'Ext.data.Model',
			   	 fields: /*(G)*/vCENTER_FIELDS_SUB,
			   	    proxy: {
							type: 'ajax',
					        api: {
					            read: CONTEXT_PATH + '/rtgMgmt/routing.do?method=readCartmap'
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
			var cartstore = new Ext.data.Store({  
				pageSize: /*getPageSize()*/1000,
				model: 'Cartmap',
				//remoteSort: true,
				sorters: [{
		            property: 'unique_id',
		            direction: 'DESC'
		        }]
			});
		    var myGrid = Ext.create('Ext.grid.Panel', {
		        region: 'south',
		        height: getCenterPanelHeight()/2, 
		        store: cartstore,
		        
		        dockedItems: [{
		            dock: 'top',
		            xtype: 'toolbar',
		            items: [
      				     ]
		        	}
		        
		        ],
		        columns: /*(G)*/vCENTER_COLUMN_SUB,
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
		            		,
		                itemcontextmenu: function(view, rec, node, index, e) {
		                    e.stopEvent();
		                    contextMenu.showAt(e.getXY());
		                    return false;
		                }
//		                itemdblclick: viewHandler 
		            }
		        }
		    });
		    myGrid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		        	
		        	console_log("selections.length =" + selections.length);
		        	if (selections.length) {
						collapseProperty();//uncheck no displayProperty
		        		////grid info 켜기
		        		displayProperty(selections[0], vCENTER_FIELDS_SUB);
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
			    items: [grid, myGrid]
			});

//		    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
//		        Ext.create('Ext.tip.ToolTip', config);
//		    });
		    
//		}//endof else
		    fLAYOUT_CONTENT(main);
		cenerFinishCallback();//Load Ok Finish Callback
	}); //store load
 	 	
});	//OnReady



