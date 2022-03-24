Ext.require([
    'Ext.grid.*',
    'Ext.data.*'
]);

var pcsstepFields = [
                 {name:	'unique_id',type:"string"}
               	,{name:	'creator',type:"string"}
               	,{name:	'changer',type:"string"}
               	,{name:	'create_date',type:"string"}
               	,{name:	'change_date',type:"string"}
               	,{name:	'srcahd_uid',type:"string"}
               	,{name:	'assymap_uid',type:"string"}
               	,{name:	'cartmap_uid',type:"string"}
               	,{name:	'rtgast_uid',type:"string"}
               	,{name:	'pcsstd_uid',type:"string"}
               	,{name:	'serial_no',type:"string"}
               	,{name:	'pcs_no',type:"string"}
               	,{name:	'pcs_code',type:"string"}
               	,{name:	'work_step',type:"string"}
               	,{name:	'std_mh',type:"string"}
               	,{name:	'real_mh',type:"string"}
               	,{name:	'process_qty',type:"string"}
               	,{name: 'inout_type',type:"string"}
               	,{name:	'process_price',type:"string"}
               	,{name:	'price_type',type:"string"}
               	,{name:	'outpcs_qty',type:"string"}
               	,{name:	'outpcs_state',type:"string"}
               	,{name:	'error_no',type:"string"}
               	,{name:	'error_reason',type:"string"}
               	,{name:	'price_origin',type:"string"}
               	,{name: 'uid_comast',type:"string"}
               	,{name: 'pcsmchn_uid', type:"string"}
                  //검색옵션
                ,{name: 'srch_type',type:"string"}//multi, single
                   
                ];

var pcsstepColumn =  [
                    { text     : 'unique_id', 		width : 80,  sortable : true, dataIndex: 'unique_id' },
                    { text     : 'srcahd_uid',width : 80,  sortable : true, dataIndex: 'srcahd_uid'   },
                    { text     : 'cartmap_uid',   width : 80,  sortable : true, dataIndex: 'cartmap_uid'  },
                    { text     : 'pcsstd_uid',  	width : 80,  sortable : true, dataIndex: 'pcsstd_uid'   },
                    { text     : 'serial_no',  	width : 80,  sortable : true, dataIndex: 'serial_no'   },
                    { text     : 'pcs_no',  	width : 80,  sortable : true, dataIndex: 'pcs_no'   },
                    { text     : 'pcs_code',  	width : 80,  sortable : true, dataIndex: 'pcs_code'   },
                    { text     : 'std_mh',  	width : 80,  sortable : true, dataIndex: 'std_mh'   },
                    { text     : 'real_mh',  	width : 80,  sortable : true, dataIndex: 'real_mh'   },
                    { text	   : 'pcsmchn_uid',		width : 80,  sortable : true, dataIndex: 'pcsmchn_uid'	},
                    { text     : 'creator',  		width : 80,  sortable : true, dataIndex: 'creator'  },
                    { text     : 'changer', 	width : 80,  sortable : true, dataIndex: 'changer'  },
                    { text     : 'create_date',  	width : 80,  sortable : true, dataIndex: 'create_date'    },
                    { text     : 'change_date',  	width : 80,  sortable : true, dataIndex: 'change_date'   },
                    { text     : 'assymap_uid',  width : 80,  sortable : true, dataIndex: 'assymap_uid'  },
                    { text     : 'rtgast_uid',  	width : 80,  sortable : true, dataIndex: 'rtgast_uid'   },
                    { text     : 'work_step',  	width : 80,  sortable : true, dataIndex: 'work_step'   },
                    { text     : 'process_qty',  	width : 80,  sortable : true, dataIndex: 'process_qty'   },
                    { text     : 'inout_type',  	width : 80,  sortable : true, dataIndex: 'inout_type'   },
                    { text     : 'process_price',  	width : 80,  sortable : true, dataIndex: 'process_price'   },
                    { text     : 'price_type',  	width : 80,  sortable : true, dataIndex: 'price_type'   },
                    { text     : 'outpcs_qty',  	width : 80,  sortable : true, dataIndex: 'outpcs_qty'   },
                    { text     : 'outpcs_state',  	width : 80,  sortable : true, dataIndex: 'outpcs_state'   },
                    { text     : 'error_no',  	width : 80,  sortable : true, dataIndex: 'error_no'   },
                    { text     : 'error_reason',  	width : 80,  sortable : true, dataIndex: 'error_reason'   },
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
	store.getProxy().setExtraParam('pcs_no','');
	store.getProxy().setExtraParam('pcs_code','');
	store.getProxy().setExtraParam('pcsstd_uid','');
	store.getProxy().setExtraParam('pcsmchn_uid','');
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
 		var	pcs_no = Ext.getCmp('srchPcs_no').getValue();
 		var	pcs_code = Ext.getCmp('srchPcs_code').getValue();
 		var pcsstd_uid = Ext.getCmp('srchPcsstd_uid').getValue();
 		var pcsmchn_uid = Ext.getCmp('srchPcsmchn_uid').getValue();
 		var serial_no = Ext.getCmp('srchSerial_no').getValue();
 		
// 		var	price_type = Ext.getCmp('srchPrice_type').getValue();
// 		var	outpcs_state = Ext.getCmp('srchOutpcs_state').getValue();
// 		var	error_no = Ext.getCmp('srchError_no').getValue();
// 		var	error_reason = Ext.getCmp('srchError_reason').getValue();
// 		var	price_origin = Ext.getCmp('srchPrice_origin').getValue();

	store.getProxy().setExtraParam("srch_type", 'multi');
	
	if(pcs_no!=null && pcs_no!='') {
		store.getProxy().setExtraParam('pcs_no', '%' + pcs_no + '%');
	}
	if(pcs_code!=null && pcs_code!='') {
		store.getProxy().setExtraParam('pcs_code', '%' + pcs_code + '%');
	}
	if(pcsstd_uid!=null && pcsstd_uid!='') {
		store.getProxy().setExtraParam('pcsstd_uid', '%' + pcsstd_uid + '%');
	}
	if(pcsmchn_uid!=null && pcsmchn_uid!='') {
		store.getProxy().setExtraParam('pcsmchn_uid', '%' + pcsmchn_uid + '%');
	}
	if(serial_no!=null && serial_no!='') {
		store.getProxy().setExtraParam('serial_no', '%' + serial_no + '%');
	}

	store.load(function() {});
};

var viewHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');

	PcsStep.load(unique_id ,{
		 success: function(pcsstep) {
			 
			 
			 var unique_id = pcsstep.get('unique_id');
			 var creator = pcsstep.get('creator');
			 var changer = pcsstep.get('changer');
			 var create_date = pcsstep.get('create_date');
			 var change_date = pcsstep.get('change_date');
			 var srcahd_uid	= pcsstep.get('srcahd_uid');
			 var assymap_uid = pcsstep.get('assymap_uid');
			 var cartmap_uid = pcsstep.get('cartmap_uid');
			 var rtgast_uid	= pcsstep.get('rtgast_uid');
			 var pcsstd_uid	= pcsstep.get('pcsstd_uid');
			 var serial_no = pcsstep.get('serial_no');
			 var pcs_no	= pcsstep.get('pcs_no');
			 var pcs_code = pcsstep.get('pcs_code');
			 var work_step = pcsstep.get('work_step');
			 var std_mh	= pcsstep.get('std_mh');
			 var real_mh = pcsstep.get('real_mh');
			 var process_qty = pcsstep.get('process_qty');
			 var inout_type	= pcsstep.get('inout_type');
			 var process_price = pcsstep.get('process_price');
			 var price_type	= pcsstep.get('price_type');
			 var outpcs_qty	= pcsstep.get('outpcs_qty');
			 var outpcs_state =	pcsstep.get('outpcs_state');
			 var error_no =	pcsstep.get('error_no');
			 var error_reason =	pcsstep.get('error_reason');
			 var price_origin =	pcsstep.get('price_origin');
			 var uid_comast = pcsstep.get('uid_comast');
			 var pcsmchn_uid = pcsstep.get('pcsmchn_uid');

				var lineGap = 30;
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
		    	fieldLabel: 'srcahd_uid',
		    	value: srcahd_uid,
		    	x: 5,
		    	y: -15 + 2*lineGap,
		    	name: 'srcahd_uid',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'pcsmchn_uid',
		    	value: pcsmchn_uid,
		    	x: 5,
		    	y: -15 + 3*lineGap,
		    	name: 'pcsmchn_uid',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'cartmap_uid',
		    	value: cartmap_uid,
		    	x: 5,
		    	y: -15 + 4*lineGap,
		    	name: 'cartmap_uid',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'pcsstd_uid',
		    	value: pcsstd_uid,
		    	x: 5,
		    	y: -15 + 5*lineGap,
		    	name: 'pcsstd_uid',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'serial_no',
		    	value: serial_no,
		    	x: 5,
		    	y: -15 + 6*lineGap,
		    	name: 'serial_no',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'pcs_no',
		    	value: pcs_no,
		    	x: 5,
		    	y: -15 + 7*lineGap,
		    	name: 'pcs_no',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'pcs_code',
		    	value: pcs_code,
		    	x: 5,
		    	y: -15 + 8*lineGap,
		    	name: 'pcs_code',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'std_mh',
		    	value: std_mh,
		    	x: 5,
		    	y: -15 + 9*lineGap,
		    	name: 'std_mh',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: 'real_mh',
		    	value: real_mh,
		    	x: 5,
		    	y: -15 + 10*lineGap,
		    	name: 'real_mh',
		    	anchor: '-5'  // anchor width by percentage
		    }
		    ]
		        }); //endof form

		        var win = Ext.create('ModalWindow', {
		            title: CMD_VIEW,
		            width: 500,
		            height: 450,
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
	

	PcsStep.load(unique_id ,{
		 success: function(pcsstep) {
			 
			 	var unique_id = pcsstep.get('unique_id');
			 	var creator = pcsstep.get('creator');
			 	var changer = pcsstep.get('changer');
			 	var create_date = pcsstep.get('create_date');
			 	var change_date = pcsstep.get('change_date');
			 	var srcahd_uid	= pcsstep.get('srcahd_uid');
			 	var assymap_uid = pcsstep.get('assymap_uid');
			 	var cartmap_uid = pcsstep.get('cartmap_uid');
			 	var rtgast_uid	= pcsstep.get('rtgast_uid');
			 	var pcsstd_uid	= pcsstep.get('pcsstd_uid');
			 	var serial_no = pcsstep.get('serial_no');
			 	var pcs_no	= pcsstep.get('pcs_no');
			 	var pcs_code = pcsstep.get('pcs_code');
			 	var work_step = pcsstep.get('work_step');
			 	var std_mh	= pcsstep.get('std_mh');
			 	var real_mh = pcsstep.get('real_mh');
			 	var process_qty = pcsstep.get('process_qty');
			 	var inout_type	= pcsstep.get('inout_type');
			 	var process_price = pcsstep.get('process_price');
			 	var price_type	= pcsstep.get('price_type');
			 	var outpcs_qty	= pcsstep.get('outpcs_qty');
			 	var outpcs_state =	pcsstep.get('outpcs_state');
			 	var error_no =	pcsstep.get('error_no');
			 	var error_reason =	pcsstep.get('error_reason');
			 	var price_origin =	pcsstep.get('price_origin');
			 	var uid_comast = pcsstep.get('uid_comast');
			 	var pcsmchn_uid = pcsstep.get('pcsmchn_uid');
				
				var lineGap = 30;
				
				
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
		    			y: 0 + 1*lineGap,
		    			name: 'unique_id',
		    			anchor: '-5'  // anchor width by percentage
		    			},{
			    		fieldLabel: 'pcs_no',
			    		value: pcs_no,
			    		x: 5,
			    		y: 0 + 2*lineGap,
			    		name: 'pcs_no',
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
		    			y: 0 + 3*lineGap,
		    			name: 'pcs_code',
		    			anchor: '-5'  // anchor width by percentage
		    			},{
		    			fieldLabel: 'srcahd_uid',
		    			value: srcahd_uid,
		    			x: 5,
		    			y: 0 + 4*lineGap,
		    			name: 'srcahd_uid',
		    			anchor: '-5'  // anchor width by percentage
		    		    },{
		    		    fieldLabel: 'cartmap_uid',
		    		    value: cartmap_uid,
		    		    x: 5,
		    		    y: 0 + 5*lineGap,
		    		    name: 'cartmap_uid',
		    		    anchor: '-5'  // anchor width by percentage
		    		    },{
		    		    fieldLabel: 'pcsstd_uid',
		    		    value: pcsstd_uid,
		    		    x: 5,
		    		    y: 0 + 6*lineGap,
		    		    name: 'pcsstd_uid',
		    		    anchor: '-5'  // anchor width by percentage
		    		    },{
		    		    fieldLabel: 'serial_no',
		    		    value: serial_no,
		    		    x: 5,
		    		    y: 0 + 7*lineGap,
		    		    name: 'serial_no',
		    		    anchor: '-5'  // anchor width by percentage
		    		    },{
			    		fieldLabel: 'pcsmchn_uid',
			    		value: pcsmchn_uid,
			    		x: 5,
			    		y: 0 + 8*lineGap,
			    		name: 'pcsmchn_uid',
			    		anchor: '-5'  // anchor width by percentage
			    		},{
		    		    fieldLabel: 'real_mh',
		    		    value: real_mh,
		    		    x: 5,
		    		    y: 0 + 9*lineGap,
		    		    name: 'real_mh',
		    		    anchor: '-5'  // anchor width by percentage
		    		    }
		    		    ]
		        }); //endof form
		    	
		    	//Ext.getCmp('unique_id').setStyle('background', 'red');

		        var win = Ext.create('ModalWindow', {
		            title: CMD_MODIFY,
		            width: 500,
		            height: 400,
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
		                	var pcsstep = Ext.ModelManager.create(val, 'PcsStep');
		                	
		            		//저장 수정
		                	pcsstep.save({
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
Ext.define('PcsStep.writer.SinglePost', {
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
	           	 var pcsstep = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'PcsStep');
        		
	           	pcsstep.destroy( {
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
    			fieldLabel: 'pcs_no',
    			x: 5,
    			y: 0 + 1*lineGap,
    			name: 'pcs_no',
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
    			y: 0 + 2*lineGap,
    			name: 'pcs_code',
    			anchor: '-5'  // anchor width by percentage
    		    },{
    		    fieldLabel: 'srcahd_uid',
    		    x: 5,
    		    y: 0 + 3*lineGap,
    		    name: 'srcahd_uid',
    		    anchor: '-5'  // anchor width by percentage
    		    },{
    		    fieldLabel: 'cartmap_uid',
    		    x: 5,
    		    y: 0 + 4*lineGap,
    		    name: 'cartmap_uid',
    		    anchor: '-5'  // anchor width by percentage
    		    },{
    		    fieldLabel: 'pcsstd_uid',
    		    x: 5,
    		    y: 0 + 5*lineGap,
    		    name: 'pcsstd_uid',
    		    anchor: '-5'  // anchor width by percentage
    		    },{
    		    fieldLabel: 'pcsmchn_uid',
    		    x: 5,
    		    y: 0 + 6*lineGap,
    		    name: 'pcsmchn_uid',
    		    anchor: '-5'  // anchor width by percentage
    		    },{
        		fieldLabel: 'serial_no',
        		x: 5,
        		y: 0 + 7*lineGap,
        		name: 'serial_no',
        		anchor: '-5'  // anchor width by percentage
        		},{
        		fieldLabel: 'real_mh',
        		x: 5,
        		y: 0 + 8*lineGap,
        		name: 'real_mh',
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
                   	 var pcsstep = Ext.ModelManager.create(val, 'PcsStep');
            		//저장 수정
                   	pcsstep.save({
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

Ext.define('PcsStep', {
	 extend: 'Ext.data.Model',
	 fields: pcsstepFields,
	    proxy: {
			type: 'ajax',
			//url: CONTEXT_PATH + '/production/machine.do?method=getUserList',
	        api: {
	            read: CONTEXT_PATH + '/production/PcsStep.do?method=read',
	            create: CONTEXT_PATH + '/production/PcsStep.do?method=create',
	            update: CONTEXT_PATH + '/production/PcsStep.do?method=update',
	            destroy: CONTEXT_PATH + '/production/PcsStep.do?method=destroy'
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

	 //PcsStep Store 정의
	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'PcsStep',
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
			                        emptyText: 'pcs_no',
			                        id: 'srchPcs_no',
			                    	listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchPcs_no', 'pcs_no', true);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchPcs_no').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchPcs_no', 'pcs_no', true);
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
			                    '-',
			                    {
			                        xtype: 'triggerfield',
			                        emptyText: 'pcsstd_uid',
			                        id: 'srchPcsstd_uid',
			                        listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchPcsstd_uid', 'pcsstd_uid', true);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchPcsstd_uid').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchPcsstd_uid', 'pcsstd_uid', true);
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
			                        emptyText: 'pcsmchn_uid',
			                        id: 'srchPcsmchn_uid',
			                        listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchPcsmchn_uid', 'pcsmchn_uid', true);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchPcsmchn_uid').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchPcsmchn_uid', 'pcsmchn_uid', true);
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
			        columns: pcsstepColumn,
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
			        title: 'PcsStep',
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

