Ext.define('Rfx.view.form.TaskEditor', {
    extend : 'Ext.Window',
    xtype  : 'taskeditor',

    /**
     * @cfg {String} triggerEvent The event that should trigger the editing to start. Set to null to disable the editor from being activated.
     */
    triggerEvent : 'taskdblclick',

    title       : '파레트 지정',
    width       : 320,
    bodyPadding : 10,
    form        : null,
    closeAction : 'hide',
    items : [
             {
                 xtype : 'form',
                 items : [
                          {
                              xtype      : 'textfield',
                              fieldLabel : '파레트 번호',
                              name: 'Name',
                              allowBlank : true
                          }
//                          {
//                        	   xtype: 'container',
//                               layout: 'hbox',
//                               style: 'margin-bottom: 5px;margin-left:1px;',
//                               items: [
//                                       {
//                                           xtype      : 'textfield',
//                                           fieldLabel : '파레트 지정',
////                                           displayField       : 'po_no',
////                                           valueField       : 'po_no',
//                                           name: 'Name',
////                                           store: this.unassignedPalletStore,
//                                           allowBlank : true,
//                            	            typeAhead: true//,
////                           	                listConfig:{
////                           		                	getInnerTpl: function(){
////                           		                		return '<div data-qtip="">{po_no}</divsystemCode>';
////                           		                	}	
////                           	                }
////                   		                    ,listeners: {
////                   		 	                    select: function (combo, record) {
////                   		 	                    	console_log('Selected Value : ' + combo.getValue());
////                       	 	                    	}
////                   		 	                    }
//                                       },
//                                       
//                                       
//                                       {
//                                           xtype:'button',
//                                           text: gm.getMC('CMD_DELETE', '삭제'),
//                                           style: 'margin-left: 3px;',
//                                           width: 50,
//                                           handler: function(){
//                                        	  
//                                           }
//                                       }
//                                       ]
//                          },
//
//                          this.stockGrid
//                     {
//                         xtype        : 'combobox',
//                         store        : 'userstore',
//                         name         : 'ResourceId',
//                         displayField : 'Name',
//                         valueField   : 'Id',
//                         fieldLabel   : 'Assigned to'
//                     },
//                     {
//                         xtype      : 'numberfield',
//                         name       : 'Duration',
//                         fieldLabel : 'Duration (d)'
//                     },
//                     {
//                         xtype      : 'numberfield',
//                         name       : 'PercentDone',
//                         fieldLabel : '% Complete',
//                         allowBlank : false,
//                         minValue   : 0,
//                         maxValue   : 100
//                     }
                 ]
             },
             this.stockGrid
         ],

    buttons : [
        {
            text : '저장',
            handler : function() {
                var win = this.up('window');

                if (win.form.isValid()) {
                    win.form.updateRecord();
                    win.hide();
                }
            }
        },
        {
            text    : '취소',
            handler : function() {
                this.up('window').hide();
            }
        }
    ],

    editRecord : function (record) {
    	
    	console_logs('record', record);

        this.record = record;

        console_logs('this.record', this.record);
        console_logs('this', this);
        this.form.getForm().loadRecord(record);
        this.show();
    },
    initComponent : function() {
    	try {
            this.callParent(arguments);    		
    	} catch(e){}

    	this.form = this.down('form');

    },

    init : function (taskboard) {
    	this.unassignedPalletStore = Ext.create('Rfx.store.UnassignedPalletStore', {});
        this.unassignedPalletStore.load(function(records){
      	   console_logs('unassignedPalletStore', records);
      	   
         });
        
        this.stockGrid = Ext.create('Ext.grid.Panel', {

	        store: this.unassignedPalletStore,
	        height: '200', 
	        border: true,
	        autoScroll : true,
		    autoHeight: true,
	        columns: [{
	        	text: 'Pallet No',
	        	index: 'po_no'
	        }],
	        collapsible: false,
	        viewConfig: {
	            stripeRows: true,
	            enableTextSelection: false
	        }
	    });
        
    	//this.unassignedPalletStore.load();
    	
    	
//    	this.unassignedPalletStore = new Kanban.data.ResourceStore({
//            //sorters: 'floor',
//            autoLoad: true,
//            proxy: {
//                type: 'ajax',
//
//                api: {
//                    //read: CONTEXT_PATH + '/taskboard-2.0.9/taskboard/examples/configurations/users.js',
//                    read: CONTEXT_PATH + '/sales/productStock.do?method=getUnassignedPallet',
//                    update: undefined,
//                    destroy: undefined,
//                    create: undefined
//                }
//            }
//        });
        
    	console_logs('taskboard', taskboard);
        if (this.triggerEvent) {
            taskboard.on(this.triggerEvent, function (pnl, record, node, e) {
            	//this.unassignedPalletStore.load();
            	//console_logs('record', record);
                this.editRecord(record);
            }, this);
        }
    },
    
    stockGrid: null,
    unassignedPalletStore : null
    
    
});