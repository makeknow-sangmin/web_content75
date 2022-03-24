Ext.require([
    'Ext.grid.*',
    'Ext.data.*'
]);


var rtgAstFields = [
              	    { name: 'unique_id', type: "string"    }           
                    ,{ name: 'user_id', type: "string"    }                    
                    ,{ name: 'user_name', type: "string"    }                    
                    ,{ name: 'name', type: "string"    }
                    ,{ name: 'content', type: "string"    }
                    ,{ name: 'state', type: "string"    }
                    ,{ name: 'item_quan', type: "string"    }
                    ,{ name: 'item_abst', type: "string"    }
                    ,{ name: 'rtg_type', type: "string"    }
                    ,{ name: 'aprv_date', type: "string"    }
                    ,{ name: 'req_date', type: "string"    }
                    ,{ name: 'po_user_uid', type: "string"    }
                    ,{ name: 'unique_id_long', type: "int"    }
                    ,{ name: 'hid_userlist_role', type: "auto"    }
                    ,{ name: 'hid_userlist', type: "auto"    }
                    ,{ name: 'create_date_str', type: "string"    } 
                   //검색옵션
                   ,{ name: 'srch_type', type: "string"    }//multi, single
];

var rtgAstColumn =  [
                    { text     : 'unique_id', 		width : 80,  sortable : true, dataIndex: 'unique_id' },
                    { text     : 'user_id',  		width : 80,  sortable : true, dataIndex: 'user_id'  },
                    { text     : 'user_name',  	width : 80,  sortable : true, dataIndex: 'user_name'    },
                    { text     : 'rtg_type', 	width : 80,  sortable : true, dataIndex: 'rtg_type'  },
                    { text     : 'name',  	width : 80,  sortable : true, dataIndex: 'name'   },
                    { text     : 'content',width : 80,  sortable : true, dataIndex: 'content'   },
                    { text     : 'state',  width : 80,  sortable : true, dataIndex: 'state'  },
                    { text     : 'item_quan', 	width : 80,  sortable : true, dataIndex: 'item_quan'   },
                    { text     : 'item_abst',   width : 80,  sortable : true, dataIndex: 'item_abst'  },
                    { text     : 'aprv_date',   width : 80,  sortable : true, dataIndex: 'aprv_date'  },
                    { text     : 'create_date',  	width : 80,  sortable : true, dataIndex: 'create_date'   }		            
];


var rtgRouteFields = [
              	    { name: 'unique_id', type: "string"    }
            	    ,{ name: 'usrast_unique_id', type: "string"    }
            	    ,{ name: 'user_id', type: "string"    }            	    
            	    ,{ name: 'user_name', type: "string"    }
            	    ,{ name: 'position', type: "string"    }
            	    ,{ name: 'user_role', type: "string"    } 
            	    ,{ name: 'seq', type: "int"    }
                  ,{ name: 'owner', type: "string"    }                    
];

var rtgRouteColumns =  [
                           { text     : 'no', 		width : 80,  sortable : true, dataIndex: 'unique_id' },
                           { text     : 'usrast_unique_id', 		width : 80,  sortable : true, dataIndex: 'usrast_unique_id' },
                           { text     : 'user_id',  	width : 80,  sortable : true, dataIndex: 'user_id'    },
                           { text     : 'user_name',  	width : 80,  sortable : true, dataIndex: 'user_name'    },
                           { text     : 'position',  	width : 80,  sortable : true, dataIndex: 'position'   },
                           { text     : 'user_role', 	width : 80,  sortable : true, dataIndex: 'user_role'  },
                           { text     : 'seq',  	width : 80,  sortable : true, dataIndex: 'seq'   },
                           { text     : 'owner',  	width : 80,  sortable : true, dataIndex: 'owner'   }

];

var crtReceiverData =  [
                        [1,'3480000099','root' ,'ROOT',  '대리','W',1,''],
       		            [2,'3480000098','jnds00' ,'채용기', '과장','D',2,'']
       		           ];


// create the data store
/*var agridStore = new Ext.create('Ext.data.ArrayStore', {
	  id : 'agridStore',
    model  : 'DataObject',
    data   : crtReceiverData
});*/

// declare the source Grid
var agrid = Ext.create('Ext.grid.Panel', {
	//  layout: 'form',
    store: Ext.create('Ext.data.ArrayStore', {
	        fields: rtgRouteFields,
		    data:crtReceiverData
		}),
    columns          : rtgRouteColumns,
    columnLines: true,
    split: true,
    floatable: false,
    multiSelect: true,
    stripeRows       : true,
    width: 200,
    margins          : '0 2 0 0',
    //title: '批准路径',//panelSRO1156
   // selModel         : Ext.create('Ext.selection.RowModel', {singleSelect : true}),
    
    dockedItems: [{
  		      			xtype: 'toolbar',
  		      			items: [{
  									iconCls:'add',
  									text: CMD_ADD},
  		      				        '-',
  		      				        {
                                      iconCls:'remove',
  									text: 'remove'}]
  		      				}]      
});  



var /*(G)*/vSRCH_TOOLTIP = [{
    target: 'srchUnique_id',
    html: 'unique_id'
	,anchor: 'bottom',
	trackMouse: true,
    anchorOffset: 10
}, {
    target: 'srchName',
    html: 'user_name'
	,anchor: 'bottom',
	trackMouse: true,
    anchorOffset: 10
}, {
    target: 'srchAprvDate',
    html: 'aprv_date'
	,anchor: 'bottom',
	trackMouse: true,
    anchorOffset: 10
}
 
];

//global var.
var grid = null;
var store = null;
var selModel =null;
//var agrid = null ;
var astore = null ;
var aselModel =null;

var ahid_userlist = new Array();
var ahid_userlist_role = new Array();



MessageBox = function(){
    return {
        msg : function(format){
            return Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 0));
        }
    };
}();


function resetParam() {
	store.getProxy().setExtraParam('unique_id', '');
	store.getProxy().setExtraParam('user_name', '');
	store.getProxy().setExtraParam('aprv_date', '');
	//store.getProxy().setExtraParam('user_id', '');//직급 검색 추가 예정
}


function srchSingleHandler (widName, parmName, isWild) {
	
	resetParam();
	var val = Ext.getCmp(widName).getValue();
	var enValue = Ext.JSON.encode(val);
	store.getProxy().setExtraParam("srch_type", 'single');
	if(isWild) {
		val = '%' + enValue + '%';
	}
	store.getProxy().setExtraParam(parmName, val);
	store.load(function() {});
};


var searchHandler = function() {
	
	resetParam();
	
	var unique_id = Ext.getCmp('srchUnique_id').getValue();
	var user_name = Ext.getCmp('srchName').getValue();
	var aprv_date = Ext.getCmp('srchAprvDate').getValue();
	//var user_id = Ext.getCmp('srchUsr').getValue();//직급 추가 예정
	
	
	store.getProxy().setExtraParam("srch_type", 'multi');
	
	if(unique_id!=null && unique_id!='') {
		store.getProxy().setExtraParam('unique_id', unique_id);
	}
	
	if(user_name!=null && user_name!='') {
		var enValue = Ext.JSON.encode('%' + user_name+ '%');
		store.getProxy().setExtraParam('user_name', enValue);
	}

	if(aprv_date!=null && aprv_date!='') {
		var enValue = Ext.JSON.encode('%' + aprv_date+ '%');
		store.getProxy().setExtraParam('aprv_date',  enValue);
	}

/*	if(user_id!=null && user_id!='') {
		store.getProxy().setExtraParam('user_id', '%' + user_id + '%');
	}*///직급 추가 예정

	store.load(function() {});
};



var viewHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	
	var unique_id = rec.get('unique_id');
	//alert(unique_id);
	RtgAst.load(unique_id ,{
		 success: function(rtgAst) {
			 	
			 //UniqueId
			 var unique_id = rtgAst.get('unique_id');
			 var user_id = rtgAst.get('user_id');
			 var user_name = rtgAst.get('user_name');
			 var state = rtgAst.get('state');		
			 var item_quan = rtgAst.get('item_quan');			 
			 var item_abst = rtgAst.get('item_abst' );
			 var rtg_type = rtgAst.get('rtg_type');
			 var aprv_date = rtgAst.get('aprv_date');
			 var req_date = rtgAst.get('req_date');
			 var create_date = rtgAst.get('create_date');
		        
			 
			var lineGap = 30;
		    var form = Ext.create('Ext.form.Panel', {
		    		id: 'formPanel',
		            layout: 'absolute',
		            url: 'save-form.php',
		            defaultType: 'displayfield',
		            border: false,
		            autoScroll:true,
		            bodyPadding: 15,
		            defaults: {
		                anchor: '100%',
		                allowBlank: false,
		                msgTarget: 'side',
		                labelWidth: 100
		            },
		            items: [{
			fieldLabel: 'unique_id',
			value: unique_id,
			x: 5,
			y: 0 + 1*lineGap,
			name: 'unique_id',
			allowBlank: false,
			anchor: '-5'  // anchor width by percentage
			},{
			fieldLabel: 'user_id',
			value: user_id,
			x: 5,
			y: 0 + 2*lineGap,
			 name: 'user_id',
			anchor: '-5'  // anchor width by percentage
			},{
				fieldLabel: 'user_name',
				value: user_name,
				x: 5,
				y: 0 + 3*lineGap,
				name: 'user_name',
				anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'state.',
		    	value: state,
		    	x: 5,
		    	y: 0 + 4*lineGap,
		    	name: 'state',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'item_quan',
		    	value: item_quan,
		    	x: 5,
		    	y: 0 + 5*lineGap,
		    	name: 'item_quan',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'item_abst.',
		    	value: item_abst,
		    	x: 5,
		    	y: 0 + 6*lineGap,
		    	name: 'item_abst',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'rtg_type',
		    	value: rtg_type,
		    	x: 5,
		    	y: 0 + 7*lineGap,
		    	name: 'rtg_type',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'aprv_date',
		    	value: aprv_date,
		    	x: 5,
		    	y: 0 + 8*lineGap,
		    	name: 'aprv_date',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'req_date.',
		    	value: req_date,
		    	x: 5,
		    	y: 0 + 9*lineGap,
		    	name: 'req_date',
		    	anchor: '-5'  // anchor width by percentage
		    }
		    ]
		        }); //endof form

		        var win = Ext.create('ModalWindow', {
		            title: CMD_VIEW,
		            width: 500,
		            height: 350,
		            minWidth: 250,
		            minHeight: 180,
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
		        win.show();
				//endofwin
		 }//endofsuccess
	 });//emdofload

};

Ext.define('DataObject', {
    extend: 'Ext.data.Model',
    fields:rtgRouteFields
});

Ext.define('RtgAst.writer.SinglePost', {
    extend: 'Ext.data.writer.Writer',
    alternateClassName: 'Ext.data.SinglePostWriter',
    alias: 'writer.singlepost',

    writeRecords: function(request, data) {
    	 console_info(data);
    	 console_info(data[0]);
    	data[0].cmdType = 'update';
        request.params = data[0];
        return request;
    }
});


var editHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');

	RtgAst.load(unique_id ,{
		 success: function(RtgAst) {
			 //Ext.MessageBox.alert('Find Board', "unique_id : " + board.get('unique_id'));
			 //console_log("user: " + user.get('user_id'));
			 var unique_id = rtgAst.get('unique_id');
			 var user_id = rtgAst.get('user_id');
			 var user_name = rtgAst.get('user_name');
			 var state = rtgAst.get('state');		
			 var item_quan = rtgAst.get('item_quan');			 
			 var item_abst = rtgAst.get('item_abst' );
			 var rtg_type = rtgAst.get('rtg_type');
			 var aprv_date = rtgAst.get('aprv_date');
			 var req_date = rtgAst.get('req_date');
			 var create_date = rtgAst.get('create_date');
		        
				var lineGap = 30;
				
				
		    	var form = Ext.create('Ext.form.Panel', {
		    		id: 'formPanel',
		            layout: 'absolute',
		            url: 'save-form.php',
		            defaultType:  'textfield',
		            border: false,
		            autoScroll:true,
		            bodyPadding: 15,
		            defaults: {
		                anchor: '100%',
		                msgTarget: 'side',
		                labelWidth: 100
		            },
		            items: [{
 		    			fieldLabel: 'unique_id',
		    			value: unique_id,
		    			x: 5,
		    			y: 0 + 1*lineGap,
		    			name: 'unique_id',
			             readOnly: true,
			    		 fieldStyle: 'background-color: #E7EEF6; background-image: none;',
		    			anchor: '-5'  // anchor width by percentage
		    			},{
		    			fieldLabel: 'user_id',
		    			value: user_id,
		    			x: 5,
		    			y: 0 + 2*lineGap,
		    			 name: 'user_id',
		    			anchor: '-5'  // anchor width by percentage
		    			},{
		    				fieldLabel: 'user_name',
		    				value: user_name,
		    				x: 5,
		    				y: 0 + 3*lineGap,
		    				name: 'user_name',
		    				anchor: '-5'  // anchor width by percentage
		    		    },{
		    		    	fieldLabel: 'state.',
		    		    	value: state,
		    		    	x: 5,
		    		    	y: 0 + 4*lineGap,
		    		    	name: 'state',
		    		    	anchor: '-5'  // anchor width by percentage
		    		    },{
		    		    	fieldLabel: 'item_quan',
		    		    	value: item_quan,
		    		    	x: 5,
		    		    	y: 0 + 5*lineGap,
		    		    	name: 'item_quan',
		    		    	anchor: '-5'  // anchor width by percentage
		    		    },{
		    		    	fieldLabel: 'item_abst.',
		    		    	value: item_abst,
		    		    	x: 5,
		    		    	y: 0 + 6*lineGap,
		    		    	name: 'item_abst',
		    		    	anchor: '-5'  // anchor width by percentage
		    		    },{
		    		    	fieldLabel: 'rtg_type',
		    		    	value: rtg_type,
		    		    	x: 5,
		    		    	y: 0 + 7*lineGap,
		    		    	name: 'rtg_type',
		    		    	anchor: '-5'  // anchor width by percentage
		    		    },{
		    		    	fieldLabel: 'aprv_date',
		    		    	value: aprv_date,
		    		    	x: 5,
		    		    	y: 0 + 8*lineGap,
		    		    	name: 'aprv_date',
		    		    	anchor: '-5'  // anchor width by percentage
		    		    },{
		    		    	fieldLabel: 'req_date.',
		    		    	value: req_date,
		    		    	x: 5,
		    		    	y: 0 + 9*lineGap,
		    		    	name: 'req_date',
		    		    	anchor: '-5'  // anchor width by percentage
		    		    }		
		            ]
		        }); //endof form

		        var win = Ext.create('ModalWindow', {
		            title: CMD_MODIFY,
		            width: 500,
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

		                	var rtgAst = Ext.ModelManager.create(val,'RtgAst'
		                			);
		                	
		            		//저장 수정
		                	rtgAst.save({
		                		success : function() {
		                			//console_log('updated');
		                           	if(win) 
		                           	{
		                           	//	win.close();
		                           		store.load(function() {});
		                           	} 
		                		} 
		                	 });
		                	
		                       	if(win) 
		                       	{
		                       	//	win.close();
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

function deleteConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_id = rec.get('unique_id');
	           	 var rtgAst = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'RtgAst');
        		
	           	rtgAst.destroy( {
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


//Define Remove Action
var addAction =	 Ext.create('Ext.Action', {
	iconCls:'add',
    text: CMD_ADD,
    disabled: fPERM_DISABLING(),
    handler: function(widget, event) {

		var lineGap = 30;

		var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
    		url: 'save-form.php',
			layout: 'form',
	        defaultType: 'textfield',
            autoScroll : true,
	        border: false,
	        defaults: {
	            anchor: '100%',
	            msgTarget: 'side',
	            labelWidth: 50,
	            labelAlign: 'right'
	        },
	        items: [
	     {
	            fieldLabel: 'rtg_type',//결재구분---> 데이타가 안 넘어감 우선 배제 
	            name: 'rtg_type',
	            value: 'G', //일반결재 G 결재타입 G:일반, R:PR, O:PO, W:GR, Q:FQ
	            xtype: 'combo',
                mode: 'local',
                editable:false,
	            allowBlank: false,
                queryMode: 'local',
                displayField:   'name',
                valueField:     'value',
                store:          Ext.create('Ext.data.Store', {
                    fields : ['name', 'value'],
                    data   : [
                        {name : '일반결재',   value: 'G'}
                    ]
                }),                
	            anchor: '-5'  // anchor width by percentage
	        },{
	            fieldLabel: 'state',//panelSRO1053
	            name: 'state',
	            xtype: 'hiddenfield',
	            value : 'P',
	            allowBlank: false,
	            anchor: '-5'  // anchor width by percentage
	        },{
	            fieldLabel: 'hid_userlist',//panelSRO1053
	            name: 'hid_userlist',
	            xtype: 'hiddenfield',
	            allowBlank: false,
	            anchor: '-5'  // anchor width by percentage
	     },{
	            fieldLabel: 'hid_userlist_role',//panelSRO1053
	            name: 'hid_userlist_role',
	            xtype: 'hiddenfield',
	            allowBlank: false,
	            anchor: '-5'  // anchor width by percentage
	        },{
	            fieldLabel: 'subject',//panelSRO1053
	            name: 'name',
	            allowBlank: false,
	            anchor: '-5'  // anchor width by percentage
	        },{
	        	fieldLabel: '内容' ,// panelSRO1155,//
	            xtype: 'textarea',
	            style: 'margin:0',
	            hideLabel: false,
	            allowBlank: false,
	            name: 'content',
	            height: 300,
	            anchor: '-5 -5'  // anchor width and height
	        },{
	            xtype: 'filefield',
	            id: 'form-file',
	            emptyText:'选择文件',// panelSRO1149,
	            fieldLabel: '附加', //panelSRO1150,
	            name: 'photo-path',
	            buttonText: '',
	            buttonConfig: {
	                iconCls: 'upload-icon'
	            },
	            anchor: '-5'  // anchor width by percentage
	        }
	        ] 
	    });		

        var win = Ext.create('ModalWindow', {
        	title: CMD_ADD + ' :: ' + /*(G)*/vCUR_MENU_NAME,
            width: 800,
            height: 500,
            minWidth: 500,
            minHeight: 500,
            closable: true,
            closeAction: 'hide',
            plain:true,
            layout: {
                type: 'border',
                padding: 5
            },

            items: [{
            	region: 'west',
            	id : 'userlist',
                title: '批准路径',//panelSRO1156
                items:[agrid]
            }, {
            	title: '상신 내용',//panelSRO1157
                region: 'center',
                xtype: 'tabpanel',
                tabPosition: 'bottom',
                items: [{
                    title: 'Content',
                    items: [form]
                }]
            }],
            buttons: [{
                text: CMD_OK,
            	handler: function(){
                    var form = Ext.getCmp('formPanel').getForm();

                	agrid.getSelectionModel().selectAll();
                	
                    var selections = agrid.getSelectionModel().getSelection();
                    
                    if (selections) {
                    	alert(selections.length);
                        	for(var i=0; i< selections.length; i++) {
                        		var rec = agrid.getSelectionModel().getSelection()[i];
                        		ahid_userlist[i] = rec.get('usrast_unique_id');
                        		ahid_userlist_role[i] = rec.get('user_role');
                        	}
                    }//end if 

                    
                    if(form.isValid())
                    {
                    	var val = form.getValues(false);
                    	var s = '';
                    	alert(ahid_userlist.length);
                    	
                    	form.findField('hid_userlist').setValue(ahid_userlist);                    	
                    	form.findField('hid_userlist_role').setValue(ahid_userlist_role);
                    	
/*                    	Ext.iterate(form.getValues(), function(key, value) {
                            s += Ext.util.Format.format("{0} = {1}<br />", key, value);
                            
                        }, this);
            Ext.Msg.alert('Form Values', s);
*/

                    	
                    	
///                	 var rtgAst = Ext.ModelManager.create(val, 'RtgAst');
            
    	           	 var rtgAst = Ext.ModelManager.create({
    	           		hid_userlist : ahid_userlist,
    	           		hid_userlist_role:ahid_userlist_role,
    	           		rtg_type : form.findField('rtg_type').getValue(),
    	           		name : form.findField('name').getValue(),
    	           		content : form.findField('content').getValue(),
    	           		state : form.findField('state').getValue()
    		        	 }, 'RtgAst');
                     
                     
                     
                	 
            		//저장 수정
                   	rtgAst.save({
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
		win.show(this, function() {
		    //button.dom.disabled = false;
		});
     }
});


//Define Delete Action
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
    items: [ detailAction, editAction, removeAction  ]
});


//writer define
Ext.define('UsrAst.writer.SinglePost', {
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



Ext.define('RtgAst', {
    	 extend: 'Ext.data.Model',
    	 fields: rtgAstFields,
    	    proxy: {
				type: 'ajax',
				//url: CONTEXT_PATH + '/userMgmt/user.do?method=getUserList',
		        api: {
		            read: CONTEXT_PATH + '/rtgMgmt/routing.do?method=read',
		            create: CONTEXT_PATH + '/rtgMgmt/routing.do?method=create',
		            update: CONTEXT_PATH + '/rtgMgmt/routing.do?method=update',
		            destroy: CONTEXT_PATH + '/rtgMgmt/routing.do?method=destroy'
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
		        } /* ,
		        actionMethods: {
		            create: 'POST', read: 'POST', update: 'POST', destroy: 'POST'
		        }*/
			}
});

Ext.onReady(function() {  

	 //RtgAst Store 정의
	store = new Ext.data.Store({  
		pageSize: 5,
		model: 'RtgAst',
		//remoteSort: true,
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	

 	store.load(function(user) {
 		
		/*if(store.getCount()==0) {
			//Ext.MessageBox.alert("Check!!!!", "Check your login state. (로그인 했나요?)");
			addAction;
		} else {
			*/
			selModel = Ext.create('Ext.selection.CheckboxModel', {
			    listeners: {
			        selectionchange: function(sm, selections) {
			        	grid.down('#removeButton').setDisabled(selections.length == 0);
			        }
			    }
			});
	
			grid =Ext.create('Ext.grid.Panel', {
			        store: store,
			        ///COOKIE//stateful: true,
			        collapsible: true,
			        multiSelect: true,
			        selModel: selModel,
			        height: 500,
			        width: 800,
			        
			        bbar: Ext.create('Ext.PagingToolbar', {
			            store: store,
			            displayInfo: true,
			            displayMsg: 'Displaying topics {0} - {1} of {2}',
			            emptyMsg: "No topics to display"
			         
			        }),

			        dockedItems: [{
			            dock: 'top',
			            xtype: 'toolbar',
			            items: [
			                    searchAction
			                    , '-',  addAction,  '-', removeAction,
	      				        '->', 
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
			        {
			            xtype: 'toolbar',
			            items: [
								{
			                        xtype: 'triggerfield',
			                        emptyText: 'unique_id',
			                        id: 'srchUnique_id',
			                    	listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchUnique_id', 'unique_id', false);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchUnique_id').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchUnique_id', 'unique_id', false);
			                    	}

								},
								'-',
			                    {
			                        xtype: 'triggerfield',
			                        emptyText: 'user_name',
			                        id: 'srchName',
			                    	listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchName', 'user_name', true);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchName').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchName', 'user_name', true);
			                        	/*
			                        	var board_name = Ext.getCmp('srchName').getValue();
			                        	store.getProxy().setExtraParam("srch_type", 'single');
			                        	store.getProxy().setExtraParam("board_name", '%' + board_name + '%');
			                        	store.load(function() {});
			                        	*/
			                    	}
			                    },
			                    '-',
			                    {
			                        xtype: 'triggerfield',
			                        emptyText: 'dept_name',
			                        id: 'srchDeptName',
			                        listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchContents', 'dept_name', true);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchContents').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchContents', 'dept_name', true);
			                        
			                    	}
			                    	
			                    }
			                    ,
			                    '->', 

			                    {
			                        text: 'First Division',
			                        iconCls: 'number01',
			                        menu: {
			                            items: [
			                                {
			                                    text: 'First Division',
			                                    iconCls: 'number01'
			                                },
			                                {
			                                    text:  'Second Division',
			                                    iconCls: 'number02'
			                                },
			                                {
			                                    text:  'Third Division',
			                                   iconCls: 'number03'
			                                },
			                                {
			                                    text:  'Fourth Division',
			                                   iconCls: 'number04'
			                                }
			                            ]
			                        }
			                    }

			                 ]
			        }
			        
			        ],
			        columns: rtgAstColumn,
			        viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
			            listeners: {
			                itemcontextmenu: function(view, rec, node, index, e) {
			                    e.stopEvent();
			                    contextMenu.showAt(e.getXY());
			                    return false;
			                },
			                itemdblclick: viewHandler /* function(dv, record, item, index, e) {
			                    alert('working');
			                }*/

			            }
			        },
			        title: 'RtgAst',
			        renderTo: 'rtgdiv'
			    });
			
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		            if (selections.length) {
		            	//grid info 켜기
						displayProperty(selections[0]);
						
						if(fPERM_DISABLING()==true) {
			            	removeAction.enable();
			            	editAction.enable();
						}else{
							removeAction.enable();
			            	editAction.enable();
						}
						detailAction.enable();
		            } else {
		            	if(fPERM_DISABLING()==true) {
			            	removeAction.disable();
			            	editAction.disable();
		            	}else{
		            		removeAction.disable();
			            	editAction.disable();
		            	}
		            	detailAction.enable();
		            }
		        }
		    });

		    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
		        Ext.create('Ext.tip.ToolTip', config);
		    });
			
	});

 	 	
});
     

