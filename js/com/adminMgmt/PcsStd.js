Ext.require([
    'Ext.grid.*',
    'Ext.data.*'
]);

var pcsstdFields = [
                 {name:	'unique_id',type:"string"}
               	,{name:	'creator',type:"string"}
               	,{name:	'changer',type:"string"}
               	,{name:	'create_date',type:"string"}
               	,{name:	'change_date',type:"string"}
               	,{name:	'srcahd_uid',type:"string"}
               	,{name:	'serial_no',type:"string"}
               	,{name:	'pcs_name',type:"string"}
               	,{name:	'pcs_code',type:"string"}
               	,{name:	'std_mh',type:"string"}
               	,{name:	'process_price',type:"string"}
               	,{name:	'price_type',type:"string"}
               	,{name:	'price_origin',type:"string"}
               	,{name: 'uid_comast',type:"string"}
                  //검색옵션
                ,{name: 'srch_type',type:"string"}//multi, single
                   
                ];

var pcsstdColumn =  [
                    { text     : 'unique_id', 		width : 80,  sortable : true, dataIndex: 'unique_id' },
                    { text     : 'pcs_name',  	width : 80,  sortable : true, dataIndex: 'pcs_name'   },
                    { text     : 'pcs_code',  	width : 80,  sortable : true, dataIndex: 'pcs_code'   },
                    { text     : 'serial_no',  	width : 80,  sortable : true, dataIndex: 'serial_no'   },
                    { text     : 'std_mh',  	width : 80,  sortable : true, dataIndex: 'std_mh'   },
                    { text     : 'creator',  		width : 80,  sortable : true, dataIndex: 'creator'  },
                    { text     : 'changer', 	width : 80,  sortable : true, dataIndex: 'changer'  },
                    { text     : 'create_date',  	width : 80,  sortable : true, dataIndex: 'create_date'    },
                    { text     : 'change_date',  	width : 80,  sortable : true, dataIndex: 'change_date'   },
                    { text     : 'srcahd_uid',width : 80,  sortable : true, dataIndex: 'srcahd_uid'   },
                    { text     : 'process_price',  	width : 80,  sortable : true, dataIndex: 'process_price'   },
                    { text     : 'price_type',  	width : 80,  sortable : true, dataIndex: 'price_type'   },
                    { text     : 'price_origin',  	width : 80,  sortable : true, dataIndex: 'price_origin'   },
                    { text     : 'uid_comast',  	width : 80,  sortable : true, dataIndex: 'uid_comast'   }
                    ];

var pcs_code_field = Ext.create('Ext.data.Store', {
	fields : ['name', 'code'],
	data : [
	        {name : 'MILL', code : 'MILL'},
	        {name : 'GRINDER', code : 'GRINDER'},
	        {name : 'CNC', code : 'CNC'},
	        {name : 'EDM', code : 'EDM'},
	        {name : 'W/C', code : 'W/C'}
	        ]
});

//global var.
var grid = null;
var store = null;

MessageBox = function(){
    return {
        msg : function(format){
            return Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 0));
        }
    };
}();

function resetParam() {
	store.getProxy().setExtraParam('pcs_name','');
	store.getProxy().setExtraParam('pcs_code','');
	store.getProxy().setExtraParam('serial_no','');
}

function srchSingleHandler (widName, parmName, isWild) {
	
	resetParam();
	var val = Ext.getCmp(widName).getValue();
	store.getProxy().setExtraParam("srch_type", 'single');
	if(isWild) {
		val = '%' + val + '%';
	}
	store.getProxy().setExtraParam(parmName, val);
	store.load(function() {});
};

var searchHandler = function() {
	
	resetParam();
	
		var unique_id = Ext.getCmp('srchUnique_id').getValue();
 		var	pcs_name = Ext.getCmp('srchpcs_name').getValue();
 		var	pcs_code = Ext.getCmp('srchPcs_code').getValue();
 		var	serial_no = Ext.getCmp('srchSerial_no').getValue();

	store.getProxy().setExtraParam("srch_type", 'multi');
	
	if(pcs_name!=null && pcs_name!='') {
		store.getProxy().setExtraParam('pcs_name', '%' + pcs_name + '%');
	}
	if(pcs_code!=null && pcs_code!='') {
		store.getProxy().setExtraParam('pcs_code', '%' + pcs_code + '%');
	}
	if(serial_no!=null && serial_no!='') {
		store.getProxy().setExtraParam('serial_no', '%' + serial_no + '%');
	}

	store.load(function() {});
};

var viewHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');

	PcsStd.load(unique_id ,{
		 success: function(pcsstd) {
			 
			 
			 var unique_id = pcsstd.get('unique_id');
			 var creator = pcsstd.get('creator');
			 var changer = pcsstd.get('changer');
			 var create_date = pcsstd.get('create_date');
			 var change_date = pcsstd.get('change_date');
			 var srcahd_uid	= pcsstd.get('srcahd_uid');
			 var serial_no = pcsstd.get('serial_no');
			 var pcs_name	= pcsstd.get('pcs_name');
			 var pcs_code = pcsstd.get('pcs_code');
			 var std_mh	= pcsstd.get('std_mh');
			 var process_price = pcsstd.get('process_price');
			 var price_type	= pcsstd.get('price_type');
			 var price_origin =	pcsstd.get('price_origin');
			 var uid_comast = pcsstd.get('uid_comast');

				var lineGap = 35;
		    	var form = Ext.create('Ext.form.Panel', {
		    		id: 'formPanel',
		            layout: 'absolute',
		            url: 'aaaa',
		            defaultType: 'displayfield',
		            border: false,
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
			y: -15 + 1*lineGap,
			name: 'unique_id',
			anchor: '-5'  // anchor width by percentage
			},{
			fieldLabel: 'mold_no',
			value: '3380000100',
			x: 5,
			y: -15 + 2*lineGap,
			 name: 'mold_no',
			anchor: '-5'  // anchor width by percentage
			},{
				fieldLabel: 'part_no',
				value: '3660010250',
				x: 5,
				y: -15 + 3*lineGap,
				name: 'part_no',
				anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'pcs_name',
		    	value: pcs_name,
		    	x: 5,
		    	y: -15 + 4*lineGap,
		    	name: 'pcs_name',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'pcs_code',
		    	value: pcs_code,
		    	x: 5,
		    	y: -15 + 5*lineGap,
		    	name: 'pcs_code',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'std_mh',
		    	value: std_mh,
		    	x: 5,
		    	y: -15 + 6*lineGap,
		    	name: 'std_mh',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'serial_no',
		    	value: serial_no,
		    	x: 5,
		    	y: -15 + 7*lineGap,
		    	name: 'serial_no',
		    	anchor: '-5'  // anchor width by percentage
		    }/*,{
		    	fieldLabel: 'cartmap_uid',
		    	value: cartmap_uid,
		    	x: 5,
		    	y: 0 + 8*lineGap,
		    	name: 'cartmap_uid',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'rtgast_uid',
		    	value: rtgast_uid,
		    	x: 5,
		    	y: 0 + 9*lineGap,
		    	name: 'rtgast_uid',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'pcsstd_uid',
		    	value: pcsstd_uid,
		    	x: 5,
		    	y: 0 + 10*lineGap,
		    	name: 'pcsstd_uid',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'serial_no',
		    	value: serial_no,
		    	x: 5,
		    	y: 0 + 11*lineGap,
		    	name: 'serial_no',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'pcs_name',
		    	value: pcs_name,
		    	x: 5,
		    	y: 0 + 12*lineGap,
		    	name: 'pcs_name',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'pcs_code',
		    	value: pcs_code,
		    	x: 5,
		    	y: 0 + 13*lineGap,
		    	name: 'pcs_code',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'work_step',
		    	value: work_step,
		    	x: 5,
		    	y: 0 + 14*lineGap,
		    	name: 'work_step',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'std_mh',
		    	value: std_mh,
		    	x: 5,
		    	y: 0 + 15*lineGap,
		    	name: 'std_mh',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'real_mh',
		    	value: real_mh,
		    	x: 5,
		    	y: 0 + 16*lineGap,
		    	name: 'real_mh',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'process_qty',
		    	value: process_qty,
		    	x: 5,
		    	y: 0 + 17*lineGap,
		    	name: 'process_qty',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'inout_type',
		    	value: inout_type,
		    	x: 5,
		    	y: 0 + 18*lineGap,
		    	name: 'inout_type',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'process_price',
		    	value: process_price,
		    	x: 5,
		    	y: 0 + 19*lineGap,
		    	name: 'process_price',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'price_type',
		    	value: price_type,
		    	x: 5,
		    	y: 0 + 20*lineGap,
		    	name: 'price_type',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'outpcs_qty',
		    	value: outpcs_qty,
		    	x: 5,
		    	y: 0 + 21*lineGap,
		    	name: 'outpcs_qty',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'outpcs_state',
		    	value: outpcs_state,
		    	x: 5,
		    	y: 0 + 22*lineGap,
		    	name: 'outpcs_state',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'error_no',
		    	value: error_no,
		    	x: 5,
		    	y: 0 + 23*lineGap,
		    	name: 'error_no',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'error_reason',
		    	value: error_reason,
		    	x: 5,
		    	y: 0 + 24*lineGap,
		    	name: 'error_reason',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'price_origin',
		    	value: price_origin,
		    	x: 5,
		    	y: 0 + 25*lineGap,
		    	name: 'price_origin',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'uid_comast',
		    	value: uid_comast,
		    	x: 5,
		    	y: 0 + 27*lineGap,
		    	name: 'uid_comast',
		    	anchor: '-5'  // anchor width by percentage
		    }*/
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
		        //store.load(function() {});
				win.show(this, function() {
				    //button.dom.disabled = false;
				});
				//endofwin
		 }//endofsuccess
	 });//emdofload

};


var editHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');
	

	PcsStd.load(unique_id ,{
		 success: function(pcsstd) {
			 
			 	var unique_id = pcsstd.get('unique_id');
			 	var creator = pcsstd.get('creator');
			 	var changer = pcsstd.get('changer');
			 	var create_date = pcsstd.get('create_date');
			 	var change_date = pcsstd.get('change_date');
			 	var srcahd_uid	= pcsstd.get('srcahd_uid');
			 	var serial_no = pcsstd.get('serial_no');
			 	var pcs_name	= pcsstd.get('pcs_name');
			 	var pcs_code = pcsstd.get('pcs_code');
			 	var std_mh	= pcsstd.get('std_mh');
			 	var process_price = pcsstd.get('process_price');
			 	var price_type	= pcsstd.get('price_type');
			 	var price_origin =	pcsstd.get('price_origin');
			 	var uid_comast = pcsstd.get('uid_comast');
				
				var lineGap = 35;
				
				
		    	var form = Ext.create('Ext.form.Panel', {
		    		id: 'formPanel',
		            layout: 'absolute',
		            url: 'aaaa',
		            defaultType:  'textfield',
		            border: false,
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
		    			y: -15 + 1*lineGap,
		    			name: 'unique_id',
		    			anchor: '-5'  // anchor width by percentage
		    			},{
			    		fieldLabel: 'mold_no',
			    		value: '3380000100',
			    		x: 5,
			    		y: -15 + 2*lineGap,
			    		name: 'mold_no',
			    		anchor: '-5'  // anchor width by percentage
			    		},{
		    			fieldLabel: 'part_no',
		    			value: '3660010250',
		    			x: 5,
		    			y: -15 + 3*lineGap,
		    			 name: 'part_no',
		    			anchor: '-5'  // anchor width by percentage
		    			},{
		    			fieldLabel: 'pcs_name',
		    			value: pcs_name,
		    			x: 5,
		    			y: -15 + 4*lineGap,
		    			name: 'pcs_name',
		    			anchor: '-5'  // anchor width by percentage
		    		    },{
		    		    	fieldLabel: 'pcs_code',
			                xtype:'combo',
			                store: pcs_code_field,
			                queryMode: 'local',
			                displayField: 'name',
			                valueField: 'code',
			                listConfig:{
			                	getInnerTpl: function(){
			                		return '<div data-qtip="{name}.{name}">{name}</div>';
			                	}
			                },
		    		    value: pcs_code,
		    		    x: 5,
		    		    y: -15 + 5*lineGap,
		    		    name: 'pcs_code',
		    		    anchor: '-5'  // anchor width by percentage
		    		    },{
		    		    fieldLabel: 'std_mh',
		    		    value: std_mh,
		    		    x: 5,
		    		    y: -15 + 6*lineGap,
		    		    name: 'std_mh',
		    		    anchor: '-5'  // anchor width by percentage
		    		    },{
			    		fieldLabel: 'serial_no',
			    		value: serial_no,
			    		x: 5,
			    		y: -15 + 7*lineGap,
			    		name: 'serial_no',
			    		anchor: '-5'  // anchor width by percentage
			    		}
		    		    ]
		        }); //endof form
		    	
		    	//Ext.getCmp('unique_id').setStyle('background', 'red');

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
		                	var pcsstd = Ext.ModelManager.create(val, 'PcsStd');
		                	
		            		//저장 수정
		                	pcsstd.save({
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
				//endofwin
		 }//endofsuccess
	 });//emdofload

};


//writer define
Ext.define('PcsStd.writer.SinglePost', {
    extend: 'Ext.data.writer.Writer',
    alternateClassName: 'Ext.data.SinglePostWriter',
    alias: 'writer.singlepost',

    writeRecords: function(request, data) {
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
	           	 var pcsstd = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'PcsStd');
        		
	           	pcsstd.destroy( {
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

		var lineGap = 35;
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
            items: [{
    			fieldLabel: 'mold_no',
    			x: 5,
    			y: -15 + 1*lineGap,
    			value: '3380000100',
    			name: 'mold_no',
    			readOnly: true,
    			anchor: '-5'  // anchor width by percentage
    			},{
				fieldLabel: 'part_no',
        		x: 5,
        		y: -15 + 2*lineGap,
        		value: '3660010250',
        		name: 'part_no',
        		readOnly: true,
        		anchor: '-5'  // anchor width by percentage
        		},{
    			fieldLabel: 'pcs_name',
            	x: 5,
            	y: -15 + 3*lineGap,
            	name: 'pcs_name',
            	anchor: '-5'  // anchor width by percentage
            	},{
    			fieldLabel: 'pcs_code',
                xtype:'combo',
                store: pcs_code_field,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'code',
                listConfig:{
                	getInnerTpl: function(){
                		return '<div data-qtip="{name}.{name}">{name}</div>';
                	}
                },
    			x: 5,
    			y: -15 + 4*lineGap,
    			name: 'pcs_code',
    			anchor: '-5'  // anchor width by percentage
    		    },{
            	fieldLabel: 'std_mh',
            	x: 5,
            	y: -15 + 5*lineGap,
            	name: 'std_mh',
            	anchor: '-5'  // anchor width by percentage
        		},{
                fieldLabel: 'serial_no',
                x: 5,
                y: -15 + 6*lineGap,
                name: 'serial_no',
                anchor: '-5'  // anchor width by percentage
            	}
    		    ]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD + ' :: ' + /*(G)*/vCUR_MENU_NAME,
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
                   	 var pcsstd = Ext.ModelManager.create(val, 'PcsStd');
            		//저장 수정
                   	pcsstd.save({
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

Ext.define('PcsStd', {
	 extend: 'Ext.data.Model',
	 fields: pcsstdFields,
	    proxy: {
			type: 'ajax',
			//url: CONTEXT_PATH + '/production/machine.do?method=getUserList',
	        api: {
	            read: CONTEXT_PATH + '/production/pcsstd.do?method=read',
	            create: CONTEXT_PATH + '/production/pcsstd.do?method=create',
	            update: CONTEXT_PATH + '/production/pcsstd.do?method=update',
	            destroy: CONTEXT_PATH + '/production/pcsstd.do?method=destroy'
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

	 //PcsStd Store 정의
	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'PcsStd',
		//remoteSort: true,
		sorters: [{
           property: 'unique_id',
           direction: 'DESC'
       }]
	});
	
	store.load(function() {
		//Ext.get('MAIN_DIV_TARGET').update('');
		if(store.getCount()==0) {
			//Ext.MessageBox.alert("Check!!!!", "Check your login state. (로그인 했나요?)");
		} else {
			
			var selModel = Ext.create('Ext.selection.CheckboxModel', {
			    listeners: {
			        selectionchange: function(sm, selections) {
			        	grid.down('#removeButton').setDisabled(selections.length == 0);
			        }
			    }
			});

			grid = Ext.create('Ext.grid.Panel', {
			        store: store,
			        ///COOKIE//stateful: true,
			        collapsible: true,
			        multiSelect: true,
			        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
			        selModel: selModel,
			        autoScroll: true,
			        autoHeight: true,
			        //layout: 'fit',
			        height: getCenterPanelHeight(),
			     // paging bar on the bottom
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
			                        	/*
			                        	var unique_id = Ext.getCmp('srchUnique_id').getValue();
			                        	store.getProxy().setExtraParam("srch_type", 'single');
			                        	store.getProxy().setExtraParam("unique_id", unique_id);
			                        	store.load(function() {});
			                        	*/
			                    	}

								},
								'-',
			                    {
			                        xtype: 'triggerfield',
			                        emptyText: 'pcs_name',
			                        id: 'srchpcs_name',
			                    	listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchpcs_name', 'pcs_name', true);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchpcs_name').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchpcs_name', 'pcs_name', true);
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
			                        emptyText: 'pcs_code',
			                        id: 'srchPcs_code',
			                        listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchPcs_code', 'pcs_code', true);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchPcs_code').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchPcs_code', 'pcs_code', true);
			                        	/*
			                        	var board_content = Ext.getCmp('srchContents').getValue();
			                        	store.getProxy().setExtraParam("srch_type", 'single');
			                        	store.getProxy().setExtraParam("board_content", '%' +board_content + '%');
			                            //store.reload();
			                        	store.load(function() {});
			                        	*/
			                    	}
			                    },
			                    '-',
			                    {
			                        xtype: 'triggerfield',
			                        emptyText: 'serial_no',
			                        id: 'srchSerial_no',
			                        listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchSerial_no', 'serial_no', true);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchSerial_no').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchSerial_no', 'serial_no', true);
			                        	/*
			                        	var board_content = Ext.getCmp('srchContents').getValue();
			                        	store.getProxy().setExtraParam("srch_type", 'single');
			                        	store.getProxy().setExtraParam("board_content", '%' +board_content + '%');
			                            //store.reload();
			                        	store.load(function() {});
			                        	*/
			                    	}
			                    },
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
			                                }
			                            ]
			                        }
			                    }

			                 ]
			        }
			        
			        ],
			        columns: pcsstdColumn,
			        viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
			            listeners: {
			                itemcontextmenu: function(view, rec, node, index, e) {
			                    e.stopEvent();
			                    contextMenu.showAt(e.getXY());
			                    return false;
			                },
			                itemdblclick: viewHandler 

			            }
			        },
			        title: 'PcsStd',
			        renderTo: 'MAIN_DIV_TARGET'
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

		}
	});
	 	
    });

