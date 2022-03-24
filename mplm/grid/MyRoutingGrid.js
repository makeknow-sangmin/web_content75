var win = null;
function doSanction(sancType, uidRtgast, rtg_Type, comment, po_user_uid, win, coord_key3) {

	console_log(comment);
    Ext.Ajax.request({
			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=sanction',
			params:{
			   	sancType : sancType,
		    	comment : comment,
		    	uidRtgast : uidRtgast,
		    	rtg_Type : rtg_Type,
		    	po_user_uid : po_user_uid,
		    	coord_key3 : coord_key3
			},
			success : function(result, request) {
				win.close();
				mainDraw();
				//store.load(function() {});
			},
			failure: extjsUtil.failureMessage
		});
}
function doSanctiob(rec) {

     	var unique_id = rec.get('unique_id'); //rtgast uid
    	var po_no = rec.get('po_no');
    	var name = rec.get('name');
    	var content = rec.get('content');
    	var rtgType = rec.get('rtgType');
    	var rtg_type = rec.get('rtg_type');
    	var submit_date = rec.get('submit_date');
    	var coord_key3 = rec.get('coord_key3');
    	var pj_uid = rec.get('coord_key3');
		
		console_log('unique_id=' + unique_id);
		console_log('po_no=' + po_no);
		console_log('name=' + name);
		console_log('content=' + content);
		console_log('rtg_type=' + rtg_type);
		console_log('coord_key3=' + coord_key3);

		var routingStore = Ext.create('Mplm.store.RoutingStore', {} );
		var projectStore = Ext.create('Mplm.store.cloudProjectStore', {} );
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
	        	obj['comment'] = comment;
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
                              ,'comment'
                              ,'result'
                              ,'role'
                              ],
                    data   : newStoreData
                }),
			    stateId: 'stateGrid-routingGrid-111',
			    layout: 'fit',
			    border: false,
			    frame: false ,
				multiSelect : false,
			    columns: [
			              {text: ppo2_user_id, dataIndex: 'user_id'}
			              ,{text: ppo2_user_name, dataIndex: 'user_name'}
			              ,{text: ppo2_dept_code, dataIndex: 'submit_date'}
			              ,{text: ppo2_dept_name, dataIndex: 'dept_name'}
			              ,{text: ppo2_comment, dataIndex: 'comment'}
			              ,{text: ppo2_result, dataIndex: 'result', flex: 50}
			              ,{text: ppo2_role, dataIndex: 'role', flex: 50}
			              ]
				});
			
			var tabPanel = new Ext.TabPanel({
	            collapsible: false,
	            floatable: false,
	            split: true,
    			frame: false,
    	        border: false,
				xtype: 'tabpanel',
				width:'100%',
		        activeTab: 0,
		        items: [{	            
		        	id: 'simple-form-panel-div',
		            title: '기본',
		            border: false,
		            autoScroll:true
		        }
		        ,{	            
		        	id: 'detail-form-panel-div',
		            title: '상세현황',
		            border: false,
		            autoScroll:true
		        }
		        ]
	    });
			
			
			var form = Ext.create('Ext.form.Panel', {
				id: 'formPanel',
				xtype: 'form',
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
				fieldLabel: 'UID',
				xtype:  'displayfield',
				value: unique_id,
				name: 'unique_id',
				anchor: '100%'
			},{
				fieldLabel: '결재번호',
				xtype:  'displayfield',
				value: po_no,
			    name: 'po_no',
			    anchor: '100%'
			},{
		    	fieldLabel: '제목',
		    	xtype:  'displayfield',
		    	value: name,
		    	name: 'name',
		    	anchor: '100%'
		    },{
		    	fieldLabel: '내용',
		    	xtype:  'displayfield',
		    	value: content,
		    	name: 'content',
		    	anchor: '100%'
		    },{
		    	fieldLabel: '의견',
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
				    	fieldLabel:'수주금액',
				    	xtype:  'displayfield',
				    	value: records[0].get('selling_price'),
				    	name: 'selling_price',
				    	anchor: '100%'
					},{
				    	fieldLabel: '매출액',
				    	xtype:  'displayfield',
				    	value: records[0].get('reserved_double5'),
				    	name: 'reserved_double5',
				    	anchor: '100%'
					},{
				    	fieldLabel: '총금액',
				    	xtype:  'displayfield',
				    	value: records[0].get('total_cost'),
				    	name: 'total_cost',
				    	anchor: '100%'
				    });	
				});
			}
			simplepanel.doLayout();

			var win = Ext.create('widget.window', {
				title: '결재 승인',
				width: 830,
	            height: 520,//480,
	            plain:true,
				items: form,
	         	buttons: [{
		            text: '승인',
	     			handler: function(){
	     				var comment = Ext.getCmp('comment').getValue();
	     				
	     				doSanction('YES',  unique_id, rtgType, comment, po_user_uid, win, coord_key3);
	     			}
		         },{
		            text: '반려',
	     			handler: function(){
	     				var comment = Ext.getCmp('comment').getValue();
	     				doSanction('NO',  unique_id, rtgType, comment, po_user_uid, win,coord_key3);
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
};

		
Ext.define('Mplm.grid.MyRoutingGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'myRoutingGrid',
    uses: [
        'Ext.data.ArrayStore'
    ],
    //height: 300,
	border: false,

    initComponent: function(params){
    	console_log('MyRoutingGrid - initComponent');
    	var myRoutingStore = Ext.create('Mplm.store.MyRoutingStore', {trayType: 'PENDING'} );
		
        Ext.apply(this, {
            //height: 300,
            height: this.height,
            store: myRoutingStore,
            stripeRows: true,
            columnLines: true,
            columns: [{
                text   : '제목',
                width    : 80,
                sortable : true,
                dataIndex: 'name'
            },{
                text   : '내용',
                 flex: 1,
                sortable : true,
                dataIndex: 'content'
            },{
                text   : '기안자',
                width    : 50,
                sortable : true,
                dataIndex: 'requester'
            }],
            viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
			            listeners: {
			                itemdblclick: function( view, rec, node, index, e, options ) {
			                	doSanctiob(rec);	
			                }
			            }
			        }
        });

		myRoutingStore.load(function(records){
			if(records.length==0) {
				try {		Ext.getCmp('portlet-pending').collapse();	} catch(e){}
			}
		});
        
        this.callParent(arguments);
    }
});
