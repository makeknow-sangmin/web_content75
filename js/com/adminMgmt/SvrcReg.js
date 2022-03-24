Ext.require([
    'Ext.form.*',
    'Ext.data.*',
    'Ext.tip.QuickTipManager'
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
                    ,{ name: 'hid_userlist_role', type: "string"    }
                    ,{ name: 'hid_userlist', type: "string"    }
                    ,{ name: 'create_date_str', type: "string"    } 
                    
                   //검색옵션
                   ,{ name: 'srch_type', type: "string"    }//multi, single
];

var rtgRouteFields = [
                	    { name: 'unique_id', type: "string"    }
                	    ,{ name: 'usrast_unique_id', type: "string"    }
                	    ,{ name: 'user_name', type: "string"    }
                	    ,{ name: 'position', type: "string"    }
                	    ,{ name: 'user_role', type: "string"    } 
                	    ,{ name: 'seq', type: "int"    }
                      ,{ name: 'owner', type: "string"    }                    
  ];

  var rtgRouteColumns =  [
                      { text     : 'no', 		width : 80,  sortable : true, dataIndex: 'unique_id' },
                      { text     : 'usrast_unique_id', 		width : 80,  sortable : true, dataIndex: 'usrast_unique_id' },
                      { text     : 'user_name',  	width : 80,  sortable : true, dataIndex: 'user_name'    },
                      { text     : 'position',  	width : 80,  sortable : true, dataIndex: 'position'   },
                      { text     : 'user_role', 	width : 80,  sortable : true, dataIndex: 'user_role'  },
                      { text     : 'seq',  	width : 80,  sortable : true, dataIndex: 'seq'   },
                      { text     : 'owner',  	width : 80,  sortable : true, dataIndex: 'owner'   }
  ];

  var crtReceiverData =  [
                          [1,'root' ,'ROOT',  '대리','W',1,''],
       		            [2,'jnds00' ,'채용기', '과장','D',2,''],
       		            [3,'root', '유역비', '부장','A',3,'']
       		           ];
  
  Ext.define('RtgAst', {
      extend: 'Ext.data.Model',
      fields:rtgAstFields,
	    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/rtgMgmt/routing.do?method=read',
	            create: CONTEXT_PATH + '/rtgMgmt/routing.do?method=create',
	            update: CONTEXT_PATH + '/rtgMgmt/routing.do?method=update',
	            destroy: CONTEXT_PATH + '/rtgMgmt/routing.do?method=destroy'
	        },
			writer: {
				model:'RtgAst',
				type: 'json',
	//            type: 'singlepost',
	            writeAllFields: false,
	            root: 'datas'
	        } 
		}      
  });
  
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


  
  // create the data store
  var gridStore = Ext.create('Ext.data.Store', {
	  id : 'gridStore',
      model  : 'DataObject',
      data   : crtReceiverData
  });
  
  // declare the source Grid
  var grid = Ext.create('Ext.grid.Panel', {
	  layout: 'form',
      store      : Ext.data.StoreManager.lookup('gridStore'),
      columns          : rtgRouteColumns,
      columnLines: true,
      split: true,
      floatable: false,
      multiSelect: true,
      stripeRows       : true,
      width            : 325,
      margins          : '0 2 0 0',
      region           : 'west',
      title: '批准路径',//panelSRO1156
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
  
	var cform = Ext.create('Ext.form.Panel', {
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
        items: [ {
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
                    {name : '일반',   value: 'G'}
                ]
            }),                
            anchor: '-5'  // anchor width by percentage
        },{
            fieldLabel: 'hid_userlist',//panelSRO1053
            name: 'hid_userlist',
            xtype: 'hidden',
            //value : 'P',
            allowBlank: false,
            anchor: '-5'  // anchor width by percentage
        },{
            fieldLabel: 'hid_userlist_role',//panelSRO1053
            name: 'hid_userlist_role',
            xtype: 'hidden',
            //value : 'P',
            allowBlank: false,
            anchor: '-5'  // anchor width by percentage

        },{
            fieldLabel: 'state',//panelSRO1053
            name: 'state',
            xtype: 'hiddenfield',
            value : 'P',
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
    
	
	//store.load();	
  
Ext.onReady(function() {
    Ext.QuickTips.init();

    Ext.define('Employee', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'email',     type: 'string'},
            {name: 'title',     type: 'string'},
            {name: 'firstName', type: 'string'},
            {name: 'lastName',  type: 'string'},
            {name: 'phone-1',   type: 'string'},
            {name: 'phone-2',   type: 'string'},
            {name: 'phone-3',   type: 'string'},
            {name: 'hours',     type: 'number'},
            {name: 'minutes',   type: 'number'},
            {name: 'startDate', type: 'date'},
            {name: 'endDate',   type: 'date'}
        ]
    });

    var form = Ext.create('Ext.form.Panel', {
		id: 'formPanel',
        renderTo: 'rtgdiv',
        title   : 'FieldContainers',
        autoHeight: true,
        width   : 600,
        bodyPadding: 10,
        defaults: {
            anchor: '100%',
            type: 'border',
            padding: 5
        },
        items   : [
                    grid,
                    {
                    title: '상신 내용',//panelSRO1157
                    xtype: 'tabpanel',
                    region: 'center',
                    tabPosition: 'bottom',
                    items: [{
                        title: 'Content',
                        items: [cform]    
                    }]
        }],
               
        
        buttons: [
            {
                text   : 'Save',
                handler: function() {
                	//grid.getSelectionModel().selectAll();
                	var rtgAst = null;
                	var ahid_userlist ;
                	var ahid_userlist_role ;
                	grid.getSelectionModel().selectAll();
                	
                    var selections = grid.getSelectionModel().getSelection();
                    
                    if (selections) {
                    	alert(selections.length);
                        	for(var i=0; i< selections.length; i++) {
                        		var rec = selections[i];
                        		ahid_userlist = rec.get('usrast_unique_id');
                        		ahid_userlist_role = rec.get('user_role');
                        		alert("hid_userlist--->"+ahid_userlist);
                        		alert("hid_userlist_role-->"+hid_userlist_role);
                        	}
                    }//end if 

                    var form = this.up('form').getForm(),                        		
                       s = '';
                        		
                    var vform = Ext.getCmp('formPanel').getForm();

                    if(vform.isValid()){

                    	/*vform.submit({
                            params: {
                            	hid_userlist: ahid_userlist,
                	            hid_userlist_role : ahid_userlist_role
                            }
                        });
                        */      	
                        Ext.iterate(vform.getValues(), function(key, value) {
                                        s += Ext.util.Format.format("{0} = {1}<br />", key, value);
                                    }, this);
                        Ext.Msg.alert('Form Values', s);

                        var val = vform.getValues(false);
                  		rtgAst = Ext.ModelManager.create(val, 'RtgAst');   
                       	rtgAst.save({
                                		success : function() {
                                		} 
                         });

                                	
               //alert(RtgAst.get('hid_userlist_role'));
               alert(rtgAst.get('rtg_type'));
               alert(rtgAst.get('hid_userlist'));
               alert(rtgAst.get('hid_userlist_role'));
               alert(rtgAst.get('name'));
               alert(rtgAst.get('content'));
                    }//end if v is valid
                }//end handle
                },
            {
                text   : 'Reset',
                handler: function() {
                    this.up('form').getForm().reset();
                }
            }
        ]
    });
});