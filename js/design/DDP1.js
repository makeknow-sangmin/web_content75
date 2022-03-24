var grid = null;
var store = null;
var mainspec_store = null;
var unique_id = new Array();
var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>', win;

var irrigateTypeCodeStore = new Ext.create('Ext.data.Store', {
 	fields:[     
  	       { name: 'systemCode', type: "string" }
  	      ,{ name: 'codeName', type: "string"  }
  	     ,{ name: 'codeNameEn', type: "string"  }
  	     
  	  ],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/sales/poreceipt.do?method=irrigateTypeCode',
         reader: {
         	type:'json',
             root: 'datas',
             totalProperty: 'count',
             successProperty: 'success'
         }
         ,autoLoad: false
     	}
});

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


var addAction = Ext.create('Ext.Action', {
	iconCls:'add',
    text: CMD_ADD,
    disabled: true,
    handler: function(widget, event) {
    	var selection = grid.getSelectionModel().getSelection();
    	console_log(selection);
    	if(selection.length>1){
    		Ext.MessageBox.alert(error_msg_prompt,'Just Only one clicks');
    	}else{
    		var record = selection[0];
    		console_log(spec_cnt);
    		var spec_cnt = record.get('spec_cnt');
    		if(spec_cnt==0){
    			var pj_uid = record.get('unique_id');
    			var model_name = record.get('description');
    			var part_name = record.get('pj_name');
    			var cavity = record.get('cav_no');
    			var asset_no = record.get('asset_number');
    			var mold_code = record.get('pj_code');
    			var form = Ext.create('Ext.form.Panel', {
    				id: 			'formPanel',
    				xtype: 			'form',
    				frame: 			false ,
    				autoScroll : true,
    				bodyPadding:	'3 3 0',
    				width: 			800,
    				autoHeight:		true,
    				defaults: {
    					anchor: 	'100%',
    					labelWidth: 100
    				},
    				items :[
    				        new Ext.form.Hidden({
    				        	id: 'pj_uid',
    				        	name: 'pj_uid',
    				        	value: pj_uid
    				        }),{
    				        	xtype: 'container',
    				        	flex: 1,
    				        	layout: 'hbox',
    				        	items: [{
    				        		xtype: 			'container',
    				        		flex: 			1,
    				        		layout: 		'anchor',
    				        		defaultType: 	'textfield',
    				        		defaults: { labelWidth: 110, labelAlign: 'left', anchor:'95%'  },  
    				        		items:[{
    				        			afterLabelTextTpl: 	required,
    				        			readOnly:			true,
    				        			fieldStyle: 		'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
    				        			xtype: 				'textfield',
    				        			fieldLabel: 		'Model Name(机型)',
//    			        			emptyText: 			'Model Name',
    				        			id:         		'model_name',
    				        			name:       		'model_name',
    				        			value:				model_name
    				        		},{
    				        			afterLabelTextTpl: 	required,
    				        			readOnly:			true,
    				        			fieldStyle: 		'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
    				        			xtype: 				'textfield',
    				        			fieldLabel: 		'Part Name(品名)',
//    			        			emptyText: 			'Part Name',
    				        			id:         		'part_name',
    				        			name:       		'part_name',
    				        			value:				part_name
    				        		},{
    				        			afterLabelTextTpl: 	required,
    				        			xtype: 				'textfield',
    				        			fieldLabel: 		getColName('reserved_varchar46'),//'Dition',
//    			        			emptyText: 			getColName('reserved_varchar46'),//'Dition',
    				        			id:         		'reserved_varchar46',
    				        			name:       		'reserved_varchar46'
    				        		}]
    				        	},{
    				        		xtype: 			'container',
    				        		flex: 			1,
    				        		layout: 		'anchor',
    				        		defaultType: 	'textfield',
    				        		defaults: { labelWidth: 110, labelAlign: 'left', anchor:'95%'  },  
    				        		items:[{
    				        			afterLabelTextTpl: 	required,
    				        			readOnly:			true,
    				        			fieldStyle: 		'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
    				        			xtype: 				'textfield',
    				        			fieldLabel: 		'Cavity(穴数)',
    				        			//emptyText: 			'Cavity',
    				        			id:         		'cavity',
    				        			name:       		'cavity',
    				        			value:				cavity
    				        		},{
    				        			afterLabelTextTpl: 	required,
    				        			readOnly:			false,
    				        			//fieldStyle: 		'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
    				        			xtype: 				'textfield',
    				        			fieldLabel: 		'Asset No(资产编号)',
    				        			//emptyText: 			'Asset No',
    				        			id:         		'asset_no',
    				        			name:       		'asset_no',
    				        			value:				asset_no
    				        		},{
    				        			afterLabelTextTpl: 	required,
    				        			readOnly:			true,
    				        			fieldStyle: 		'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
    				        			xtype: 				'textfield',
    				        			fieldLabel: 		'Mold Code(模号)',
    				        			//emptyText: 			'Mold Code',
    				        			id:         		'mold_code',
    				        			name:       		'mold_code',
    				        			value:				mold_code
    				        		}]
    				        	}]
    				        },{
    				        	xtype: 'container',//세로 첫번째
    				        	layout:'hbox',
    				        	items: [{
    				        		xtype: 'fieldset',//왼쪽 첫번째 fieldset
    				        		title: 'Part Information(产品信息)',
    				        		collapsible: false,
    				        		defaults: {
    				        			labelWidth: 50,
    				        			anchor: 	'100%',
    				        			width: 		400,
    				        			labelAlign: 'left'
    				        		},
    				        		items: [{
    				        			xtype: 			'container',//왼쪽 첫번째 container
    				        			flex: 			1,
    				        			layout: 		'anchor',
    				        			defaultType: 	'textfield',
    				        			defaults: { labelWidth: 110, labelAlign: 'left', anchor:'95%'  },  
    				        			items:[{
    				        				afterLabelTextTpl: 	required,
    				        				fieldLabel: 		getColName('reserved_varchar01'),//'Size',
    				        				//emptyText: 			getColName('reserved_varchar01'),//'Size',
    				        				id:         		'reserved_varchar01',
    				        				name:       		'reserved_varchar01'
    				        			},{
    				        				afterLabelTextTpl: 	required,
    				        				xtype:          	'combo',
    				        				editable:      		true,typeAhead: true,
//    				        				forceSelection: false,
//    				        				selectOnFocus: true,
    				        				
    				        				triggerAction: 'all',
    				        				mode:           	'local',
    				        				displayField:   	'codeName' ,
    				        				valueField:     	'codeName' ,
    				        				fieldLabel:     	getColName('reserved_varchar02'),//'Material',
    				        				//emptyText: 			getColName('reserved_varchar02'),//'Material',
    				        				id:          		'reserved_varchar02',
    				        				name:          		'reserved_varchar02',
    				        				store: 				Ext.create('Ext.data.Store', {
    				        					fields:[     
    				        					        { name: 'systemCode', type: "string" }
    				        					        ,{ name: 'codeName', type: "string"  }
    				        					        ,{ name: 'codeNameEn', type: "string"  }
    				        					        
    				        					        ],
    				        					        proxy: {
    				        					        	type: 'ajax',
    				        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=MATERIAL',
    				        					        	reader: {
    				        					        		type:'json',
    				        					        		root: 'datas',
    				        					        		totalProperty: 'count',
    				        					        		successProperty: 'success'
    				        					        	}
    				        				,autoLoad: false
    				        					        }
    				        				}),
    				        				listConfig:{
    				        					getInnerTpl: function(){
    				        						return '<div data-qtip="{codeName}">{codeName}</div>';
    				        					}			                	
    				        				},
    				        				listeners: {
    				        					select: function (combo, record) {
    				        						var value = record[0].get('codeName');
    				        						Ext.getCmp('reserved_varchar02').setValue(value);			
    				        					}
    				        				}
    				        			},{
    				        				afterLabelTextTpl: 	required,
    				        				xtype:          	'combo',
    				        				editable:      		true,typeAhead: true,
    				        				mode:           	'local',
    				        				displayField:   	'codeName' ,
    				        				valueField:     	'codeName' ,
    				        				fieldLabel:     	getColName('reserved_varchar03'),//'Surface Treatment',
    				        				//emptyText: 			getColName('reserved_varchar03'),//'Surface Treatment',
    				        				id:          		'reserved_varchar03',
    				        				name:          		'reserved_varchar03',
    				        				store: 				Ext.create('Ext.data.Store', {
    				        					fields:[     
    				        					        { name: 'systemCode', type: "string" }
    				        					        ,{ name: 'codeName', type: "string"  }
    				        					        ,{ name: 'codeNameEn', type: "string"  }
    				        					        
    				        					        ],
    				        					        proxy: {
    				        					        	type: 'ajax',
    				        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=SURFACE_TREATMENT',
    				        					        	reader: {
    				        					        		type:'json',
    				        					        		root: 'datas',
    				        					        		totalProperty: 'count',
    				        					        		successProperty: 'success'
    				        					        	}
    				        				,autoLoad: false
    				        					        }
    				        				}),
    				        				listConfig:{
    				        					getInnerTpl: function(){
    				        						return '<div data-qtip="{codeName}">{codeName}</div>';
    				        					}			                	
    				        				}
    				        			},{
    				        				xtype:          'combo',
    				        				editable:      	false,
    				        				mode:           'local',
    				        				displayField:   'codeName' ,
    				        				valueField:     'codeName' ,
    				        				fieldLabel:    	getColName('reserved_varchar04'),//'Erosion',
    				        				//emptyText: 		getColName('reserved_varchar04'),//'Erosion',
    				        				id:          	'reserved_varchar04',
    				        				name:          	'reserved_varchar04',
    				        				store: 			Ext.create('Ext.data.Store', {
    				        					fields:[     
    				        					        { name: 'systemCode', type: "string" }
    				        					        ,{ name: 'codeName', type: "string"  }
    				        					        ,{ name: 'codeNameEn', type: "string"  }
    				        					        
    				        					        ],
    				        					        proxy: {
    				        					        	type: 'ajax',
    				        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=EROSION',
    				        					        	reader: {
    				        					        		type:'json',
    				        					        		root: 'datas',
    				        					        		totalProperty: 'count',
    				        					        		successProperty: 'success'
    				        					        	}
    				        				,autoLoad: false
    				        					        }
    				        				}),
    				        				listConfig:{
    				        					getInnerTpl: function(){
    				        						return '<div data-qtip="{codeName}">{codeName}</div>';
    				        					}			                	
    				        				}

    				        			},{
    				        				fieldLabel: getColName('reserved_varchar05'),//'Carving',
    				        				//emptyText: 	getColName('reserved_varchar05'),//'Carving',
    				        				id:         'reserved_varchar05',
    				        				name:       'reserved_varchar05'
    				        			}]
    				        		}]
    				        	},{
    				        		xtype: 			'fieldset',//오른쪽 첫번째 fieldset
    				        		title:	 		'Injection Molding Machine(注塑机)',
    				        		collapsible: 	false,
    				        		margins: 		'0 0 0 6',
    				        		defaults: {
    				        			labelWidth: 50,
    				        			anchor: 	'100%',
    				        			width: 		400,
    				        			labelAlign: 'right'
    				        		},
    				        		items: [{
    				        			xtype: 			'container',//오른쪽 첫번째 container
    				        			flex: 			1,
    				        			layout: 		'anchor',
    				        			defaultType:	'textfield',
    				        			defaults: { labelWidth: 130, labelAlign: 'left', anchor:'95%'  },  
    				        			items:[{
    				        				afterLabelTextTpl: 	required,
    				        				xtype:          	'combo',
    				        				editable:      		true,typeAhead: true,
    				        				mode:           	'local',
//    			        				displayField:   	'codeName' ,
//    			        				valueField:     	'systemCode' ,
    				        				fieldLabel: 		getColName('reserved_varchar06'),//'Clamping Force',
    				        				//emptyText: 			getColName('reserved_varchar06'),//'Clamping Force',
    				        				id:         		'reserved_varchar06',
    				        				name:       		'reserved_varchar06',
    				        				store: 				Ext.create('Ext.data.Store', {
    				        					fields:[     
    				        					        { name: 'systemCode', type: "string" }
    				        					        ,{ name: 'codeName', type: "string"  }
    				        					        ,{ name: 'codeNameEn', type: "string"  }
    				        					        
    				        					        ],
    				        					        proxy: {
    				        					        	type: 'ajax',
    				        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=CLAMPING_FORCE',
    				        					        	reader: {
    				        					        		type:'json',
    				        					        		root: 'datas',
    				        					        		totalProperty: 'count',
    				        					        		successProperty: 'success'
    				        					        	}
    				        				,autoLoad: false
    				        					        }
    				        				}),
    				        				listConfig:{
    				        					getInnerTpl: function(){
    				        						return '<div data-qtip="{codeName}">{codeName}.sub</div>';
    				        					}			                	
    				        				},
    				        				listeners: {
    				        					select: function (combo, record) {
    				        						var value = record[0].get('codeName');
    				        						var split_value=value.split(',');
    				        						Ext.getCmp('reserved_varchar06').setValue(split_value[0]);
    				        						Ext.getCmp('reserved_varchar07').setValue(split_value[1]);
    				        						Ext.getCmp('reserved_varchar08').setValue(split_value[2]);
    				        						Ext.getCmp('reserved_varchar09').setValue(split_value[3]);
    				        						Ext.getCmp('reserved_varchar10').setValue(split_value[4]);
    				        						
    				        					}
    				        				}
    				        			},{
    				        				afterLabelTextTpl: 	required,
    				        				fieldLabel: 		getColName('reserved_varchar07'),//'Tie Bar Distance',
    				        				//emptyText: 			getColName('reserved_varchar07'),//'Tie Bar Distance',
    				        				id:         		'reserved_varchar07',
    				        				name:       		'reserved_varchar07'
    				        			},{
    				        				afterLabelTextTpl: 	required,
    				        				fieldLabel: 		getColName('reserved_varchar08'),//'Max Pressure',
    				        				//emptyText: 			getColName('reserved_varchar08'),//'Max Pressure',
    				        				id:         		'reserved_varchar08',
    				        				name:       		'reserved_varchar08'
    				        			},{
    				        				afterLabelTextTpl: 	required,
    				        				fieldLabel: 		getColName('reserved_varchar09'),//'Max Speed',
    				        				//emptyText: 			getColName('reserved_varchar09'),//'Max Speed',
    				        				id:         		'reserved_varchar09',
    				        				name:       		'reserved_varchar09'
    				        			},{
    				        				afterLabelTextTpl: 	required,
    				        				fieldLabel: 		getColName('reserved_varchar10'),//'Max Daylight',
    				        				//emptyText: 			getColName('reserved_varchar10'),//'Max Daylight',
    				        				id:         		'reserved_varchar10',
    				        				name:       		'reserved_varchar10'
    				        			}]
    				        		}]
    				        	}]
    				        },{
    				        	xtype: 'container',//세로 두번째
    				        	layout:'hbox',
    				        	items: [{
    				        		xtype: 'fieldset',//왼쪽 두번째 fieldset
    				        		title: 'Mold Information(模具信息)',
    				        		collapsible: false,
    				        		defaults: {
    				        			labelWidth: 50,
    				        			anchor: 	'100%',
    				        			width: 		400,
    				        			labelAlign: 'left'
    				        		},
    				        		items: [{
    				        			xtype: 			'container',
    				        			flex: 			1,
    				        			layout: 		'anchor',
    				        			defaultType: 	'textfield',
    				        			defaults: { labelWidth: 110, labelAlign: 'left', anchor:'95%'  },  
    				        			items:[{
    				        				afterLabelTextTpl: 	required,
    				        				fieldLabel: 		getColName('reserved_varchar11'),//'Shout Guarantee',
    				        				//emptyText: 			getColName('reserved_varchar11'),//'Shout Guarantee',
    				        				id:         		'reserved_varchar11',
    				        				name:       		'reserved_varchar11'
    				        			},{
    				        				afterLabelTextTpl: 	required,
    				        				xtype:      		'combo',
    				        				editable:      		true,typeAhead: true,
    				        				mode:       		'local',
    				        				displayField:   	'codeName' ,
    				        				valueField:     	'codeName' ,
    				        				fieldLabel: 		getColName('reserved_varchar12'),//'Molding Type',
    				        				//emptyText: 			getColName('reserved_varchar12'),//'Molding Type',
    				        				id:         		'reserved_varchar12',
    				        				name:       		'reserved_varchar12',
    				        				store: 				Ext.create('Ext.data.Store', {
    				        					fields:[     
    				        					        { name: 'systemCode', type: "string" }
    				        					        ,{ name: 'codeName', type: "string"  }
    				        					        ,{ name: 'codeNameEn', type: "string"  }
    				        					        
    				        					        ],
    				        					        
    				        					        proxy: {
    				        					        	type: 'ajax',
    				        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=MOLDING_TYPE',
    				        					        	reader: {
    				        					        		type:'json',
    				        					        		root: 'datas',
    				        					        		totalProperty: 'count',
    				        					        		successProperty: 'success'
    				        					        	}
    				        				,autoLoad: false
    				        					        }
    				        				}),
    				        				listConfig:{
    				        					getInnerTpl: function(){
    				        						return '<div data-qtip="{codeName}">{codeName}</div>';
    				        					}			                	
    				        				}
    				        			},{
    				        				afterLabelTextTpl: 	required,
    				        				xtype:      		'combo',
    				        				editable:      		true,typeAhead: true,
    				        				mode:       		'local',
    				        				displayField:   	'codeName' ,
    				        				valueField:     	'codeName' ,
    				        				fieldLabel: 		getColName('reserved_varchar13'),//'Division',
    				        				//emptyText: 			getColName('reserved_varchar13'),//'Division',
    				        				id:         		'reserved_varchar13',
    				        				name:       		'reserved_varchar13',
    				        				store: 				Ext.create('Ext.data.Store', {
    				        					fields:[     
    				        					        { name: 'systemCode', type: "string" }
    				        					        ,{ name: 'codeName', type: "string"  }
    				        					        ,{ name: 'codeNameEn', type: "string"  }
    				        					        
    				        					        ],
    				        					        
    				        					        proxy: {
    				        					        	type: 'ajax',
    				        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=DIVISION',
    				        					        	reader: {
    				        					        		type:'json',
    				        					        		root: 'datas',
    				        					        		totalProperty: 'count',
    				        					        		successProperty: 'success'
    				        					        	}
    				        				,autoLoad: false
    				        					        }
    				        				}),
    				        				listConfig:{
    				        					getInnerTpl: function(){
    				        						return '<div data-qtip="{codeName}">{codeName}</div>';
    				        					}			                	
    				        				}
    				        			},{
    				        				afterLabelTextTpl: 	required,
    				        				fieldLabel: 		getColName('reserved_varchar14'),//'Shrinkage Rate',
    				        				//emptyText: 			getColName('reserved_varchar14'),//'Shrinkage Rate',
    				        				id:         		'reserved_varchar14',
    				        				name:       		'reserved_varchar14'
    				        			},{
    				        				afterLabelTextTpl: 	required,
    				        				xtype: 				'fieldcontainer',
    				        				fieldLabel: 		getColName('reserved_varchar15'),//'Mold Base',
//    			        				id:					'reserved_varchar15',
//    			        				name:				'reserved_varchar15',
    				        				layout: 			'hbox',
    				        				combineErrors: 		true,
    				        				defaultType: 		'textfield',
    				        				defaults: {
    				        					hideLabel: 'true'
    				        				},
    				        				items: [{
//    			        					id:			'Size',
//    			        					name: 		'Size',
    				        					id:			'reserved_varchar15',
    				        					name:		'reserved_varchar15',
    				        					flex: 		1
    				        					//emptyText: 	'Size'
    				        				},{
    				        					xtype:     	 	'combo',
    				        					editable:      	false,
    				        					mode:       	'local',
    				        					displayField:   'codeName' ,
    				        					valueField:     'codeName' ,
    				        					id:				'material1',
    				        					name: 			'material1',
    				        					flex: 			1,
    				        					margins: 		'0 0 0 6',
    				        					//emptyText: 		'Material',
    				        					store: Ext.create('Ext.data.Store', {
    				        						fields:[     
    				        						        { name: 'systemCode', type: "string" }
    				        						        ,{ name: 'codeName', type: "string"  }
    				        						        ,{ name: 'codeNameEn', type: "string"  }
    				        						        
    				        						        ],
    				        						        
    				        						        proxy: {
    				        						        	type: 'ajax',
    				        						        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=MOLD_BASE',
    				        						        	reader: {
    				        						        		type:'json',
    				        						        		root: 'datas',
    				        						        		totalProperty: 'count',
    				        						        		successProperty: 'success'
    				        						        	}
    				        					,autoLoad: false
    				        						        }
    				        					}),
    				        					listConfig:{
    				        						getInnerTpl: function(){
    				        							return '<div data-qtip="{codeName}">{codeName}</div>';
    				        						}			                	
    				        					}
    				        				},{
    				        					xtype:      		'combo',
    				        					editable:      		true,typeAhead: true,
    				        					mode:       		'local',
    				        					displayField:   	'codeName' ,
    				        					valueField:     	'codeName',
    				        					id:					'maker1',
    				        					name: 				'maker1',
    				        					flex: 				1,
    				        					margins: 			'0 0 0 6',
    				        					//emptyText: 			'Maker',
    				        					store: Ext.create('Ext.data.Store', {
    				        						fields:[     
    				        						        { name: 'systemCode', type: "string" }
    				        						        ,{ name: 'codeName', type: "string"  }
    				        						        ,{ name: 'codeNameEn', type: "string"  }
    				        						        
    				        						        ],
    				        						        
    				        						        proxy: {
    				        						        	type: 'ajax',
    				        						        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=MAKER',
    				        						        	reader: {
    				        						        		type:'json',
    				        						        		root: 'datas',
    				        						        		totalProperty: 'count',
    				        						        		successProperty: 'success'
    				        						        	}
    				        					,autoLoad: false
    				        						        }
    				        					}),
    				        					listConfig:{
    				        						getInnerTpl: function(){
    				        							return '<div data-qtip="{codeName}">{codeName}</div>';
    				        						}			                	
    				        					}
    				        				}]
    				        			},{
    				        				xtype: 'fieldset',// Main Core fieldset
    				        				title: 'Main Core(主要型芯)',
    				        				collapsible: false,
    				        				defaults: {
    				        					labelWidth: 50,
    				        					anchor: 	'100%',
    				        					width: 		400,
    				        					labelAlign: 'left'
    				        				},
    				        				items: [{
    				        					afterLabelTextTpl: 	required,
    				        					xtype: 				'fieldcontainer',
    				        					fieldLabel: 		getColName('reserved_varchar16'),//'Cavity',
//    			        					id:					'reserved_varchar16',
//    			        					name:				'reserved_varchar16',
    				        					layout: 			'hbox',
    				        					combineErrors: 		true,
    				        					defaultType: 		'textfield',
    				        					defaults: {
    				        						hideLabel: 'true'
    				        					},
    				        					items: [{
    				        						id:					'reserved_varchar16',
    				        						name:				'reserved_varchar16',
//    			        						id:			'Size1',
//    			        						name: 		'Size1',
    				        						flex: 		1
    				        						//emptyText: 	'Size'
    				        					},{
    				        						xtype:      		'combo',
    				        						editable:      		true,typeAhead: true,
    				        						mode:       		'local',
    				        						displayField:   	'codeName' ,
    				        						valueField:     	'codeName' ,
    				        						id:					'material2',	
    				        						name: 				'material2',
    				        						flex: 				1,
    				        						margins: 			'0 0 0 6',
    				        						//emptyText: 			'Material',
    				        						store: Ext.create('Ext.data.Store', {
    				        							fields:[     
    				        							        { name: 'systemCode', type: "string" }
    				        							        ,{ name: 'codeName', type: "string"  }
    				        							        ,{ name: 'codeNameEn', type: "string"  }
    				        							        
    				        							        ],
    				        							        
    				        							        proxy: {
    				        							        	type: 'ajax',
    				        							        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=CAVITY',
    				        							        	reader: {
    				        							        		type:'json',
    				        							        		root: 'datas',
    				        							        		totalProperty: 'count',
    				        							        		successProperty: 'success'
    				        							        	}
    				        						,autoLoad: false
    				        							        }
    				        						}),
    				        						listConfig:{
    				        							getInnerTpl: function(){
    				        								return '<div data-qtip="{codeName}">{codeName}</div>';
    				        							}			                	
    				        						}
    				        					},{
    				        						id:			'hardness',
    				        						name: 		'hardness',
    				        						flex: 		1,
    				        						margins: 	'0 0 0 6'
    				        						//emptyText: 	'Hardness'
    				        					}]
    				        				},{
    				        					afterLabelTextTpl: 	required,
    				        					xtype: 				'fieldcontainer',
    				        					fieldLabel: 		getColName('reserved_varchar17'),//'Core',
//    			        					id:					'reserved_varchar17',
//    			        					name:				'reserved_varchar17',
    				        					layout: 			'hbox',
    				        					combineErrors: 		true,
    				        					defaultType: 		'textfield',
    				        					defaults: {
    				        						hideLabel: 'true'
    				        					},
    				        					items: [{
    				        						id:					'reserved_varchar17',
    				        						name:				'reserved_varchar17',
//    			        						id:			'Size2',
//    			        						name: 		'Size2',
    				        						flex: 		1
    				        						//emptyText: 	'Size'
    				        					},{
    				        						xtype:      		'combo',
    				        						editable:      		true,typeAhead: true,
    				        						mode:       		'local',
    				        						displayField:   	'codeName' ,
    				        						valueField:     	'codeName' ,
    				        						id: 				'material3',
    				        						name: 				'material3',
    				        						flex: 				1,
    				        						margins: 			'0 0 0 6',
    				        						//emptyText: 			'Material',
    				        						store: 		Ext.create('Ext.data.Store', {
    				        							fields:[     
    				        							        { name: 'systemCode', type: "string" }
    				        							        ,{ name: 'codeName', type: "string"  }
    				        							        ,{ name: 'codeNameEn', type: "string"  }
    				        							        
    				        							        ],
    				        							        
    				        							        proxy: {
    				        							        	type: 'ajax',
    				        							        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=CAVITY',
    				        							        	reader: {
    				        							        		type:'json',
    				        							        		root: 'datas',
    				        							        		totalProperty: 'count',
    				        							        		successProperty: 'success'
    				        							        	}
    				        						,autoLoad: false
    				        							        }
    				        						}),
    				        						listConfig:{
    				        							getInnerTpl: function(){
    				        								return '<div data-qtip="{codeName}">{codeName}</div>';
    				        							}			                	
    				        						}
    				        					},{
    				        						id:			'hardness1',
    				        						name: 		'hardness1',
    				        						flex: 		1,
    				        						margins: 	'0 0 0 6'
    				        						//emptyText: 	'Hardness'
    				        					}]
    				        				}]
    				        			},{
    				        				afterLabelTextTpl: 	required,
    				        				fieldLabel: 		getColName('reserved_varchar18'),//'Slide Core',
    				        				//emptyText: 			getColName('reserved_varchar18'),//'Slide Core',
    				        				id:         		'reserved_varchar18',
    				        				name:       		'reserved_varchar18'
    				        			},{
    				        				afterLabelTextTpl: 	required,
    				        				fieldLabel: 		getColName('reserved_varchar19'),//'Angular Ejector Pin',
    				        				//emptyText: 			getColName('reserved_varchar19'),//'Angular Ejector Pin',
    				        				id:         		'reserved_varchar19',
    				        				name:       		'reserved_varchar19'
    				        			},{
    				        				fieldLabel: getColName('reserved_varchar20'),//'Cylinder',
    				        				//emptyText: 	getColName('reserved_varchar20'),//'Cylinder',
    				        				id:         'reserved_varchar20',
    				        				name:       'reserved_varchar20'
    				        			},{
    				        				xtype:      		'combo',
    				        				editable:      		true,typeAhead: true,
    				        				mode:       		'local',
    				        				displayField:   	'codeName' ,
    				        				valueField:     	'codeName' ,
    				        				fieldLabel: 		getColName('reserved_varchar21'),//'Ejecting Hole',
    				        				//emptyText: 			getColName('reserved_varchar21'),//'Ejecting Hole',
    				        				id:         		'reserved_varchar21',
    				        				name:       		'reserved_varchar21',
    				        				store: 		Ext.create('Ext.data.Store', {
    				        					fields:[     
    				        					        { name: 'systemCode', type: "string" }
    				        					        ,{ name: 'codeName', type: "string"  }
    				        					        ,{ name: 'codeNameEn', type: "string"  }
    				        					        
    				        					        ],
    				        					        
    				        					        proxy: {
    				        					        	type: 'ajax',
    				        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=EJECTING_HOLE',
    				        					        	reader: {
    				        					        		type:'json',
    				        					        		root: 'datas',
    				        					        		totalProperty: 'count',
    				        					        		successProperty: 'success'
    				        					        	}
    				        				,autoLoad: false
    				        					        }
    				        				}),
    				        				listConfig:{
    				        					getInnerTpl: function(){
    				        						return '<div data-qtip="{codeName}">{codeName}</div>';
    				        					}			                	
    				        				}
    				        			},{
    				        				fieldLabel: getColName('reserved_varchar22'),//'Sleeve',
    				        				//emptyText: 	getColName('reserved_varchar22'),//'Sleeve',
    				        				id:         'reserved_varchar22',
    				        				name:       'reserved_varchar22'
    				        			}]
    				        		}]
    				        	},{
    				        		xtype: 			'fieldset',//오른쪽 두번째 fieldset
    				        		title:	 		'Cooling System(冷却系统)',
    				        		collapsible: 	false,
    				        		margins: 		'0 0 0 6',
    				        		defaults: {
    				        			labelWidth: 50,
    				        			anchor: 	'100%',
    				        			width: 		400,
    				        			labelAlign: 'right'
    				        		},
    				        		items: [{
    				        			xtype: 			'container',//오른쪽 두번째 container
    				        			flex: 			1,
    				        			layout: 		'anchor',
    				        			defaultType:	'textfield',
    				        			defaults: { labelWidth: 130, labelAlign: 'left', anchor:'95%'  },  
    				        			items:[{
    				        				afterLabelTextTpl: 	required,
    				        				xtype:      		'combo',
    				        				editable:      		true,typeAhead: true,
    				        				mode:       		'local',
    				        				displayField:   	'codeName' ,
    				        				valueField:     	'codeName' ,
    				        				fieldLabel: 		getColName('reserved_varchar23'),//'Coolant',
    				        				//emptyText: 			getColName('reserved_varchar23'),//'Coolant',
    				        				id:         		'reserved_varchar23',
    				        				name:       		'reserved_varchar23',
    				        				store: 				Ext.create('Ext.data.Store', {
    				        					fields:[     
    				        					        { name: 'systemCode', type: "string" }
    				        					        ,{ name: 'codeName', type: "string"  }
    				        					        ,{ name: 'codeNameEn', type: "string"  }
    				        					        
    				        					        ],
    				        					        
    				        					        proxy: {
    				        					        	type: 'ajax',
    				        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=COOLANT',
    				        					        	reader: {
    				        					        		type:'json',
    				        					        		root: 'datas',
    				        					        		totalProperty: 'count',
    				        					        		successProperty: 'success'
    				        					        	}
    				        				,autoLoad: false
    				        					        }
    				        				}),
    				        				listConfig:{
    				        					getInnerTpl: function(){
    				        						return '<div data-qtip="{codeName}">{codeName}</div>';
    				        					}			                	
    				        				}
    				        			},{
    				        				afterLabelTextTpl: 	required,
    				        				xtype:      		'combo',
    				        				editable:      		true,typeAhead: true,
    				        				mode:       		'local',
    				        				displayField:   	'codeName' ,
    				        				valueField:     	'codeName' ,
    				        				fieldLabel: 		getColName('reserved_varchar24'),//'Channel Diamater',
    				        				//emptyText: 			getColName('reserved_varchar24'),//'Channel Diamater',
    				        				id:         		'reserved_varchar24',
    				        				name:       		'reserved_varchar24',
    				        				store: 				Ext.create('Ext.data.Store', {
    				        					fields:[     
    				        					        { name: 'systemCode', type: "string" }
    				        					        ,{ name: 'codeName', type: "string"  }
    				        					        ,{ name: 'codeNameEn', type: "string"  }
    				        					        
    				        					        ],
    				        					        
    				        					        proxy: {
    				        					        	type: 'ajax',
    				        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=CHANNEL_DIAMETER',
    				        					        	reader: {
    				        					        		type:'json',
    				        					        		root: 'datas',
    				        					        		totalProperty: 'count',
    				        					        		successProperty: 'success'
    				        					        	}
    				        				,autoLoad: false
    				        					        }
    				        				}),
    				        				listConfig:{
    				        					getInnerTpl: function(){
    				        						return '<div data-qtip="{codeName}">{codeName}</div>';
    				        					}			                	
    				        				}
    				        			},{
    				        				xtype: 'fieldset',// Mipple fieldset
    				        				title: 'Nipple(接头)',
    				        				collapsible: false,
    				        				defaults: {
    				        					labelWidth: 50,
    				        					anchor: 	'100%',
    				        					labelAlign: 'left'
    				        				},
    				        				items: [{
    				        					afterLabelTextTpl: 	required,
    				        					xtype: 			'fieldcontainer',
    				        					fieldLabel: 	getColName('reserved_varchar25'),//'Type',
//    			        					id:				'reserved_varchar25',
//    			        					name:			'reserved_varchar25',
    				        					layout: 		'hbox',
    				        					combineErrors: 	true,
    				        					defaultType: 	'textfield',
    				        					defaults: {
    				        						hideLabel: 'true'
    				        					},
    				        					items: [{
    				        						xtype:      		'combo',
    				        						editable:      		true,typeAhead: true,
    				        						mode:       		'local',
    				        						displayField:   	'codeName' ,
    				        						valueField:     	'codeName' ,
    				        						width:				'100%',
    				        						//emptyText: 			'Type',
    				        						id:					'reserved_varchar25',
    				        						name:				'reserved_varchar25',
//    			        						id:         		'type',
//    			        						name:       		'type',
    				        						store: 				Ext.create('Ext.data.Store', {
    				        							fields:[     
    				        							        { name: 'systemCode', type: "string" }
    				        							        ,{ name: 'codeName', type: "string"  }
    				        							        ,{ name: 'codeNameEn', type: "string"  }
    				        							        ],
    				        							        proxy: {
    				        							        	type: 'ajax',
    				        							        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=TYPE',
    				        							        	reader: {
    				        							        		type:'json',
    				        							        		root: 'datas',
    				        							        		totalProperty: 'count',
    				        							        		successProperty: 'success'
    				        							        	}
    				        						,autoLoad: false
    				        							        }
    				        						}),
    				        						listConfig:{
    				        							getInnerTpl: function(){
    				        								return '<div data-qtip="{codeName}">{codeName}</div>';
    				        							}			                	
    				        						}
    				        					}]
    				        				},{
    				        					afterLabelTextTpl: 	required,
    				        					xtype: 			'fieldcontainer',
    				        					fieldLabel: 	getColName('reserved_varchar26'),//'PT"',
//    			        					id:				'reserved_varchar26',
//    			        					name:			'reserved_varchar26',
    				        					layout: 		'hbox',
    				        					combineErrors: 	true,
    				        					defaultType: 	'textfield',
    				        					defaults: {
    				        						hideLabel: 'true'
    				        					},
    				        					items: [{
    				        						xtype:      		'combo',
    				        						editable:      		true,typeAhead: true,
    				        						mode:       		'local',
    				        						displayField:   	'codeName' ,
    				        						valueField:     	'codeName' ,
    				        						width:				'100%',
    				        						//emptyText: 			'PT',
    				        						id:					'reserved_varchar26',
    				        						name:				'reserved_varchar26',
//    			        						id:         		'pt',
//    			        						name:       		'pt',
    				        						store: 				Ext.create('Ext.data.Store', {
    				        							fields:[     
    				        							        { name: 'systemCode', type: "string" }
    				        							        ,{ name: 'codeName', type: "string"  }
    				        							        ,{ name: 'codeNameEn', type: "string"  }
    				        							        ],
    				        							        proxy: {
    				        							        	type: 'ajax',
    				        							        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=PT',
    				        							        	reader: {
    				        							        		type:'json',
    				        							        		root: 'datas',
    				        							        		totalProperty: 'count',
    				        							        		successProperty: 'success'
    				        							        	}
    				        						,autoLoad: false
    				        							        }
    				        						}),
    				        						listConfig:{
    				        							getInnerTpl: function(){
    				        								return '<div data-qtip="{codeName}">{codeName}</div>';
    				        							}			                	
    				        						}
    				        					}]
    				        				}]
    				        			},{
    				        				xtype:      		'combo',
    				        				editable:      		true,typeAhead: true,
    				        				mode:       		'local',
    				        				displayField:   	'codeName' ,
    				        				valueField:     	'codeName' ,
    				        				width:				'100%',
    				        				fieldLabel: 		getColName('reserved_varchar27'),//'Mark in out at cooling',
    				        				//emptyText: 			getColName('reserved_varchar27'),//'Mark in out at cooling',
    				        				id:         		'reserved_varchar27',
    				        				name:       		'reserved_varchar27',
    				        				store: 		Ext.create('Ext.data.Store', {
    				        					fields:[     
    				        					        { name: 'systemCode', type: "string" }
    				        					        ,{ name: 'codeName', type: "string"  }
    				        					        ,{ name: 'codeNameEn', type: "string"  }
    				        					        
    				        					        ],
    				        					        
    				        					        proxy: {
    				        					        	type: 'ajax',
    				        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=COOLING_NUMBER',
    				        					        	reader: {
    				        					        		type:'json',
    				        					        		root: 'datas',
    				        					        		totalProperty: 'count',
    				        					        		successProperty: 'success'
    				        					        	}
    				        				,autoLoad: false
    				        					        }
    				        				}),
    				        				listConfig:{
    				        					getInnerTpl: function(){
    				        						return '<div data-qtip="{codeName}">{codeName}</div>';
    				        					}			                	
    				        				}
    				        			}]
    				        		}]
    				        	},{
    				        		xtype: 			'fieldset',//오른쪽 세번째 fieldset
    				        		title:	 		'Gas Vent(排气)',
    				        		collapsible: 	false,
    				        		margins: 		'237 0 0 -421',
    				        		defaults: {
    				        			labelWidth: 50,
    				        			anchor: 	'100%',
    				        			width: 		400,
    				        			labelAlign: 'right'
    				        		},
    				        		items: [{
    				        			xtype: 			'container',//오른쪽 세번째 container
    				        			flex: 			1,
    				        			layout: 		'anchor',
    				        			defaultType:	'textfield',
    				        			defaults: { labelWidth: 130, labelAlign: 'left', anchor:'95%'  },  
    				        			items:[{
    				        				fieldLabel: getColName('reserved_varchar28'),//'Core',
    				        				//emptyText: 	getColName('reserved_varchar28'),//'Core',
    				        				id:         'reserved_varchar28',
    				        				name:       'reserved_varchar28'
    				        			},{
    				        				fieldLabel: getColName('reserved_varchar29'),//'Parting Line',
    				        				//emptyText: 	getColName('reserved_varchar29'),//'Parting Line',
    				        				id:         'reserved_varchar29',
    				        				name:       'reserved_varchar29'
    				        			},{
    				        				fieldLabel: getColName('reserved_varchar30'),//'Hole',
    				        				//emptyText: 	getColName('reserved_varchar30'),//'Hole',
    				        				id:         'reserved_varchar30',
    				        				name:       'reserved_varchar30'
    				        			}]
    				        		}]
    				        	}]
    				        },{
    				        	xtype: 'container',//세로 세번째
    				        	layout:'hbox',
    				        	items: [{
    				        		xtype: 			'fieldset',//세로 세번째 fieldset
    				        		title:	 		'Runner & Gate System(流道与浇口系统)',
    				        		collapsible: 	false,
    				        		defaults: {
    				        			labelWidth: 50,
    				        			anchor: 	'100%',
    				        			width: 		400,
    				        			labelAlign: 'right'
    				        		},
    				        		items: [{
    				        			xtype: 			'container',//세로 세번째 container
    				        			flex: 			1,
    				        			layout: 		'anchor',
    				        			defaultType:	'textfield',
    				        			defaults: { labelWidth: 130, labelAlign: 'left', anchor:'95%'  },  
    				        			items:[{
    				        				afterLabelTextTpl: 	required,
    				        				xtype:          	'combo',
    				        				editable:      		true,typeAhead: true,
    				        				mode:           	'local',
    				        				displayField:   	'codeName' ,
    				        				valueField:     	'codeName' ,
    				        				fieldLabel:     	getColName('reserved_varchar31'),//'Runner Type',
    				        				//emptyText: 			getColName('reserved_varchar31'),//'Ruuner Type',
    				        				id:          		'reserved_varchar31',
    				        				name:          		'reserved_varchar31',
    				        				store: 				Ext.create('Ext.data.Store', {
    				        					fields:[     
    				        					        { name: 'systemCode', type: "string" }
    				        					        ,{ name: 'codeName', type: "string"  }
    				        					        ,{ name: 'codeNameEn', type: "string"  }
    				        					        
    				        					        ],
    				        					        
    				        					        proxy: {
    				        					        	type: 'ajax',
    				        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=RUNNER_TYPE',
    				        					        	reader: {
    				        					        		type:'json',
    				        					        		root: 'datas',
    				        					        		totalProperty: 'count',
    				        					        		successProperty: 'success'
    				        					        	}
    				        				,autoLoad: false
    				        					        }
    				        				}),
    				        				listConfig:{
    				        					getInnerTpl: function(){
    				        						return '<div data-qtip="{codeName}">{codeName}</div>';
    				        					}			                	
    				        				}
    				        			},{
    				        				afterLabelTextTpl: 	required,
    				        				fieldLabel: 		getColName('reserved_varchar32'),//'Sqrue/LocateRing',
    				        				//emptyText: 			getColName('reserved_varchar32'),//'Sqrue/LocateRing',
    				        				id:         		'reserved_varchar32',
    				        				name:       		'reserved_varchar32'
    				        			},{
    				        				xtype: 'fieldset',// Gate fieldset
    				        				title: 'Gate(浇口)',
    				        				collapsible: false,
    				        				defaultType:	'textfield',
    				        				defaults: {
    				        					labelWidth: 70,
    				        					anchor: 	'100%',
    				        					width: 		400,
    				        					labelAlign: 'left'
    				        				},
    				        				items: [{
    				        					afterLabelTextTpl: 	required,
    				        					xtype:          	'combo',
    				        					editable:      		true,typeAhead: true,
    				        					mode:           	'local',
    				        					displayField:   	'codeName' ,
    				        					valueField:     	'codeName' ,
    				        					fieldLabel:     	getColName('reserved_varchar33'),//'Type',
    				        					//emptyText: 			getColName('reserved_varchar33'),//'Type',
    				        					id:          		'reserved_varchar33',
    				        					name:          		'reserved_varchar33',
    				        					store: 				Ext.create('Ext.data.Store', {
    				        						fields:[     
    				        						        { name: 'systemCode', type: "string" }
    				        						        ,{ name: 'codeName', type: "string"  }
    				        						        ,{ name: 'codeNameEn', type: "string"  }
    				        						        
    				        						        ],
    				        						        
    				        						        proxy: {
    				        						        	type: 'ajax',
    				        						        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=GATE',
    				        						        	reader: {
    				        						        		type:'json',
    				        						        		root: 'datas',
    				        						        		totalProperty: 'count',
    				        						        		successProperty: 'success'
    				        						        	}
    				        					,autoLoad: false
    				        						        }
    				        					}),
    				        					listConfig:{
    				        						getInnerTpl: function(){
    				        							return '<div data-qtip="{codeName}">{codeName}</div>';
    				        						}			                	
    				        					}
    				        				},{
    				        					afterLabelTextTpl: 	required,
    				        					fieldLabel: 		getColName('reserved_varchar34'),//'Qty',
    				        					//emptyText: 			getColName('reserved_varchar34'),//'Qty',
    				        					id:         		'reserved_varchar34',
    				        					name:       		'reserved_varchar34'
    				        				}]
    				        			},{
    				        				xtype: 			'fieldset',// Cold Runner fieldset
    				        				title: 			'Cold Runner(冷流道)',
    				        				collapsible:	false,
    				        				defaultType:	'textfield',
    				        				defaults: {
    				        					labelWidth: 70,
    				        					anchor: 	'100%',
    				        					width: 		400,
    				        					labelAlign: 'left'
    				        				},
    				        				items: [{
    				        					xtype:          'combo',
    				        					editable:      	false,
    				        					mode:           'local',
    				        					displayField:   'codeName' ,
    				        					valueField:     'codeName' ,
    				        					fieldLabel:     getColName('reserved_varchar35'),//'Runner Selection',
    				        					//emptyText: 		getColName('reserved_varchar35'),//'Runner Selection',
    				        					id:          	'reserved_varchar35',
    				        					name:          	'reserved_varchar35',
    				        					store: 			Ext.create('Ext.data.Store', {
    				        						fields:[     
    				        						        { name: 'systemCode', type: "string" }
    				        						        ,{ name: 'codeName', type: "string"  }
    				        						        ,{ name: 'codeNameEn', type: "string"  }
    				        						        
    				        						        ],
    				        						        proxy: {
    				        						        	type: 'ajax',
    				        						        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=COLD_RUNNER',
    				        						        	reader: {
    				        						        		type:'json',
    				        						        		root: 'datas',
    				        						        		totalProperty: 'count',
    				        						        		successProperty: 'success'
    				        						        	}
    				        					,autoLoad: false
    				        						        }
    				        					}),
    				        					listConfig:{
    				        						getInnerTpl: function(){
    				        							return '<div data-qtip="{codeName}">{codeName}</div>';
    				        						}			                	
    				        					}
    				        				}]
    				        			},{
    				        				xtype: 			'fieldset',// Hot Runner fieldset
    				        				title: 			'Hot Runner(热流道)',
    				        				collapsible: 	false,
    				        				defaultType:	'textfield',
    				        				defaults: {
    				        					labelWidth: 70,
    				        					anchor: 	'100%',
    				        					width: 		400,
    				        					labelAlign: 'left'
    				        				},
    				        				items: [{
    				        					afterLabelTextTpl: 	required,
    				        					fieldLabel:     	getColName('reserved_varchar36'),//'Maker',
    				        					//emptyText: 			getColName('reserved_varchar36'),//'Maker',
    				        					id:          		'reserved_varchar36',
    				        					name:          		'reserved_varchar36'
    				        				},{
//                				xtype:          	'combo',
//                				mode:           	'local',
    				        					afterLabelTextTpl: 	required,
    				        					fieldLabel:     	getColName('reserved_varchar37'),//'Type',
    				        					//emptyText: 			getColName('reserved_varchar37'),//'Type',
    				        					id:          		'reserved_varchar37',
    				        					name:          		'reserved_varchar37'	 
    				        				},{
//                				xtype:          	'combo',
//                				mode:           	'local',
    				        					fieldLabel:     	getColName('reserved_varchar38'),//'Nozzle Type',
    				        					//emptyText: 			getColName('reserved_varchar38'),//'Nozzle Type',
    				        					id:          		'reserved_varchar38',
    				        					name:          		'reserved_varchar38'	
    				        				},{
    				        					afterLabelTextTpl: 	required,
    				        					fieldLabel: 		getColName('reserved_varchar39'),//'Qty of Value',
    				        					//emptyText: 			getColName('reserved_varchar39'),//'Qty of Value',
    				        					id:         		'reserved_varchar39',
    				        					name:       		'reserved_varchar39'
    				        				},{
    				        					afterLabelTextTpl: 	required,
    				        					fieldLabel: 		getColName('reserved_varchar40'),//'Gate Diameter',
    				        					//emptyText: 			getColName('reserved_varchar40'),//'Gate Diameter',
    				        					id:         		'reserved_varchar40',
    				        					name:       		'reserved_varchar40'
    				        				}]
    				        			}]
    				        		}]
    				        	},{
    				        		xtype: 'container',//세로 두번째
    				        		layout:'hbox',
    				        		items: [{
    				        			xtype: 			'fieldset',//오른쪽 네번째 fieldset
    				        			title:	 		'Etc',
    				        			margins: 		'0 0 0 6',
    				        			collapsible: 	false,
    				        			defaults: {
    				        				labelWidth: 50,
    				        				anchor: 	'100%',
    				        				width: 		400,
    				        				labelAlign: 'right'
    				        			},
    				        			items: [{
    				        				xtype: 			'container',//오른쪽 네번째 container
    				        				flex: 			1,
    				        				layout: 		'anchor',
    				        				defaultType:	'textfield',
    				        				defaults: { labelWidth: 130, labelAlign: 'left', anchor:'95%'  },  
    				        				items:[{
    				        					id:			'reserved_varchar41',
    				        					name: 		'reserved_varchar41',
    				        					//emptyText: 	getColName('reserved_varchar41'),//'Shot Counter',
    				        					fieldLabel: getColName('reserved_varchar41')//'Shot Counter',	
    				        				},{
    				        					xtype:          'combo',
    				        					editable:      	false,
    				        					mode:           'local',
    				        					id:				'reserved_varchar42',
    				        					name: 			'reserved_varchar42',
    				        					displayField:   'codeName' ,
    				        					valueField:     'codeName' ,
    				        					//emptyText: 	getColName('reserved_varchar42'),//'Name Plate(SEC Std.)',
    				        					fieldLabel: getColName('reserved_varchar42'),//'Name Plate(SEC Std.)'
    				        					store: 			Ext.create('Ext.data.Store', {
    				        						fields:[     
    				        						        { name: 'systemCode', type: "string" }
    				        						        ,{ name: 'codeName', type: "string"  }
    				        						        ,{ name: 'codeNameEn', type: "string"  }
    				        						        
    				        						        ],
    				        						        proxy: {
    				        						        	type: 'ajax',
    				        						        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=NAME_PLATE',
    				        						        	reader: {
    				        						        		type:'json',
    				        						        		root: 'datas',
    				        						        		totalProperty: 'count',
    				        						        		successProperty: 'success'
    				        						        	}
    				        					,autoLoad: false
    				        						        }
    				        					}),
    				        					listConfig:{
    				        						getInnerTpl: function(){
    				        							return '<div data-qtip="{codeName}">{codeName}</div>';
    				        						}			                	
    				        					}
    				        				},{
    				        					xtype:          	'combo',
    				        					editable:      		true,typeAhead: true,
    				        					mode:           	'local',
    				        					id:			'reserved_varchar43',
    				        					name: 		'reserved_varchar43',
    				        					displayField:   'codeName' ,
    				        					valueField:     'codeName' ,
    				        					//emptyText: 	getColName('reserved_varchar43'),//'Eject Plate Forced Return',
    				        					fieldLabel: getColName('reserved_varchar43'),//'Eject Plate Forced Return'
    				        					store: 			Ext.create('Ext.data.Store', {
    				        						fields:[     
    				        						        { name: 'systemCode', type: "string" }
    				        						        ,{ name: 'codeName', type: "string"  }
    				        						        ,{ name: 'codeNameEn', type: "string"  }
    				        						        
    				        						        ],
    				        						        proxy: {
    				        						        	type: 'ajax',
    				        						        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=EJECT_PLATE_FORCED_RETURN',
    				        						        	reader: {
    				        						        		type:'json',
    				        						        		root: 'datas',
    				        						        		totalProperty: 'count',
    				        						        		successProperty: 'success'
    				        						        	}
    				        					,autoLoad: false
    				        						        }
    				        					}),
    				        					listConfig:{
    				        						getInnerTpl: function(){
    				        							return '<div data-qtip="{codeName}">{codeName}</div>';
    				        						}			                	
    				        					}
    				        				},{
    				        					id:			'reserved_varchar44',
    				        					name: 		'reserved_varchar44',
    				        					//emptyText: 	getColName('reserved_varchar44'),//'DLC',
    				        					fieldLabel: getColName('reserved_varchar44')//'DLC'
    				        				},{
    				        					id:			'reserved_varchar45',
    				        					name: 		'reserved_varchar45',
    				        					//emptyText: 	getColName('reserved_varchar45'),//'Side Straight&P/L Block',
    				        					fieldLabel: getColName('reserved_varchar45')//'Side Straight&P/L Block'
    				        				}]
    				        			}]
    				        		}]
//                },{
//	                xtype: 			'fieldset',//오른쪽 네번째 fieldset
//	            	title:	 		'Remarks',
//	            	collapsible: 	false,
//	            	margins: 		'200 0 0 -421',
//	            	defaults: {
//	            		labelWidth: 50,
//	            		anchor: 	'100%',
//	            		width: 		400,
//	            		labelAlign: 'right'
//	            	},
//	            	items: [{
//	            		xtype: 			'container',//오른쪽 네번째 container
//	            		flex: 			1,
//	            		layout: 		'anchor',
//	            		defaults: { labelWidth: 130, labelAlign: 'left', anchor:'95%'  },  
//	            		items:[{
//	            			xtype:          'textarea',
//	    					id:          	'remarks',
//	    					name:          	'remarks'
//	            		}]
//	            	}]
    				        	}]
    				        }]
    			});
    			var win = Ext.create('ModalWindow', {
    				title:CMD_ADD  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
    				width: 890,
    				height: 610,//480,
    				minWidth: 250,
    				minHeight: 180,
    				layout: 'fit',
    				plain:true,
    				items: form,
    				buttons: [{
    					text: CMD_OK,
    					handler: function(){
    						var sizeValue = Ext.getCmp('reserved_varchar15').getValue();
    						var materialValue = Ext.getCmp('material1').getValue();
    						var makerValue = Ext.getCmp('maker1').getValue();
    						var sumValue = sizeValue+','+materialValue+','+makerValue;
    						console_log(sumValue);
    						Ext.getCmp('reserved_varchar15').setValue(sumValue);
    						var sizeValue1 = Ext.getCmp('reserved_varchar16').getValue();
    						var materialValue1 =  Ext.getCmp('material2').getValue();
    						var hardnessValue1 =  Ext.getCmp('hardness').getValue();
    						var sumValue1 = sizeValue1+','+materialValue1+','+hardnessValue1;
    						Ext.getCmp('reserved_varchar16').setValue(sumValue1);
    						
    						var sizeValue2 = Ext.getCmp('reserved_varchar17').getValue();
    						var materialValue2 = Ext.getCmp('material3').getValue();
    						var hardnessValue2 = Ext.getCmp('hardness1').getValue();
    						var sumValue2 = sizeValue2+','+materialValue2+','+hardnessValue2;
    						Ext.getCmp('reserved_varchar17').setValue(sumValue2);
    						
    						var form = Ext.getCmp('formPanel').getForm();
    						console_log('form');
    						console_log(form);
    						if(form.isValid())
    						{
    							var val = form.getValues(false);
    							console_log('val: ');
    							console_log(val);
    							var mainspec = Ext.ModelManager.create(val, 'MainSpec');
    							
    							//저장 수정
    							mainspec.save({
    								success : function() {
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
    						if(win) {
    							win.close();
    						}
    					}
    				}]
    			});
    			win.show();
    		}else{
    			Ext.MessageBox.alert(error_msg_prompt,'It have the Mold Specifications already');
    		}
		}
    }
});

//Define Remove Action
//var removeAction = Ext.create('Ext.Action', {
//	itemId: 'removeButton',
//    iconCls: 'remove',
//    text: CMD_DELETE,
//    disabled: true,
//    handler: function(widget, event) {
//    	Ext.MessageBox.show({
//            title:delete_msg_title,
//            msg: delete_msg_content,
//            buttons: Ext.MessageBox.YESNO,
//            fn: deleteConfirm,
//            icon: Ext.MessageBox.QUESTION
//        });
//    }
//});

function createViewForm(mainspec) {
	var selection = grid.getSelectionModel().getSelection();
	var record = selection[0];
	var pj_uid = record.get('unique_id');
	var model_name = record.get('description');
	var part_name = record.get('pj_name');
	var cavity = record.get('cav_no');
	var asset_no = record.get('asset_number');
	var mold_code = record.get('pj_code');
		
	var reserved_varchar01 = mainspec.get('reserved_varchar01');
	var reserved_varchar02 = mainspec.get('reserved_varchar02');
	var reserved_varchar03 = mainspec.get('reserved_varchar03');
	var reserved_varchar04 = mainspec.get('reserved_varchar04');
	var reserved_varchar05 = mainspec.get('reserved_varchar05');
	var reserved_varchar06 = mainspec.get('reserved_varchar06');
	var reserved_varchar07 = mainspec.get('reserved_varchar07');
	var reserved_varchar08 = mainspec.get('reserved_varchar08');
	var reserved_varchar09 = mainspec.get('reserved_varchar09');
	var reserved_varchar10 = mainspec.get('reserved_varchar10');
	var reserved_varchar11 = mainspec.get('reserved_varchar11');
	var reserved_varchar12 = mainspec.get('reserved_varchar12');
	var reserved_varchar13 = mainspec.get('reserved_varchar13');
	var reserved_varchar14 = mainspec.get('reserved_varchar14');
	var reserved_varchar15 = mainspec.get('reserved_varchar15');
	var reserved_varchar16 = mainspec.get('reserved_varchar16');
	var reserved_varchar17 = mainspec.get('reserved_varchar17');
	var reserved_varchar18 = mainspec.get('reserved_varchar18');
	var reserved_varchar19 = mainspec.get('reserved_varchar19');
	var reserved_varchar20 = mainspec.get('reserved_varchar20');
	var reserved_varchar21 = mainspec.get('reserved_varchar21');
	var reserved_varchar22 = mainspec.get('reserved_varchar22');
	var reserved_varchar23 = mainspec.get('reserved_varchar23');
	var reserved_varchar24 = mainspec.get('reserved_varchar24');
	var reserved_varchar25 = mainspec.get('reserved_varchar25');
	var reserved_varchar26 = mainspec.get('reserved_varchar26');
	var reserved_varchar27 = mainspec.get('reserved_varchar27');
	var reserved_varchar28 = mainspec.get('reserved_varchar28');
	var reserved_varchar29 = mainspec.get('reserved_varchar29');
	var reserved_varchar30 = mainspec.get('reserved_varchar30');
	var reserved_varchar31 = mainspec.get('reserved_varchar31');
	var reserved_varchar32 = mainspec.get('reserved_varchar32');
	var reserved_varchar33 = mainspec.get('reserved_varchar33');
	var reserved_varchar34 = mainspec.get('reserved_varchar34');
	var reserved_varchar35 = mainspec.get('reserved_varchar35');
	var reserved_varchar36 = mainspec.get('reserved_varchar36');
	var reserved_varchar37 = mainspec.get('reserved_varchar37');
	var reserved_varchar38 = mainspec.get('reserved_varchar38');
	var reserved_varchar39 = mainspec.get('reserved_varchar39');
	var reserved_varchar40 = mainspec.get('reserved_varchar40');
	var reserved_varchar41 = mainspec.get('reserved_varchar41');
	var reserved_varchar42 = mainspec.get('reserved_varchar42');
	var reserved_varchar43 = mainspec.get('reserved_varchar43');
	var reserved_varchar44 = mainspec.get('reserved_varchar44');
	var reserved_varchar45 = mainspec.get('reserved_varchar45');
	var reserved_varchar46 = mainspec.get('reserved_varchar46');
	console_log('reserved_varchar15');
	console_log(reserved_varchar15);
	console_log(mainspec);
	var split_var15 = reserved_varchar15.split(',');
	var split_var16 = reserved_varchar16.split(',');
	var split_var17 = reserved_varchar17.split(',');
	
    var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
    		defaultType: 'displayfield',
    		frame: 			false ,
			autoScroll : true,
			bodyPadding:	'3 3 0',
			width: 			800,
			autoHeight:		true,
			defaults: {
				anchor: 	'100%',
				labelWidth: 100
			},
            items: [{
			        	xtype: 'container',
			        	flex: 1,
			        	layout: 'hbox',
			        	items: [{
			        		xtype: 			'container',
			        		flex: 			1,
			        		layout: 		'anchor',
			        		defaultType: 'displayfield',
			        		defaults: { labelWidth: 120, labelAlign: 'left', anchor:'95%'  },  
			        		items:[{
			        			fieldLabel: 		'Model Name(机型)',
			        			id:         		'model_name',
			        			name:				'model_name',
			        			value:				model_name
			        		},{
			        			fieldLabel: 		'Part Name(品名)',
			        			id:         		'part_name',
			        			name:       		'part_name',
			        			value:				part_name
			        		},{
			        			fieldLabel: 		getColName('reserved_varchar46'),//'Dition',
			        			id:         		'reserved_varchar46',
			        			name:       		'reserved_varchar46',
			        			value:				reserved_varchar46
			        		}]
			        	},{
			        		xtype: 			'container',
			        		flex: 			1,
			        		layout: 		'anchor',
			        		defaultType: 	'displayfield',
			        		defaults: { labelWidth: 120, labelAlign: 'left', anchor:'95%'  },  
			        		items:[{
			        			fieldLabel: 		'Cavity(穴数)',
			        			id:         		'cavity',
			        			name:       		'cavity',
			        			value:				cavity
			        		},{
			        			fieldLabel: 		'Asset No(资产编号)',
			        			id:         		'asset_no',
			        			name:       		'asset_no',
			        			value:				asset_no
			        		},{
			        			fieldLabel: 		'Mold Code(模号)',
			        			id:         		'mold_code',
			        			name:       		'mold_code',
			        			value:				mold_code
			        		}]
			        	}]
			        },{
			        	xtype: 'container',//세로 첫번째
			        	layout:'hbox',
			        	items: [{
			        		xtype: 'fieldset',//왼쪽 첫번째 fieldset
			        		title: 'Part Information(零件信息)',
			        		collapsible: false,
			        		defaults: {
			        			labelWidth: 50,
			        			anchor: 	'100%',
			        			width: 		400,
			        			labelAlign: 'left'
			        		},
			        		items: [{
			        			xtype: 			'container',//왼쪽 첫번째 container
			        			flex: 			1,
			        			layout: 		'anchor',
			        			defaultType: 	'displayfield',
			        			defaults: { labelWidth: 110, labelAlign: 'left', anchor:'95%'  },  
			        			items:[{
			        				fieldLabel: 		getColName('reserved_varchar01'),//'Size',
			        				id:         		'reserved_varchar01',
			        				name:       		'reserved_varchar01',
			        				value:				reserved_varchar01
			        					
			        			},{
			        				fieldLabel:     	getColName('reserved_varchar02'),//'Material',
			        				id:          		'reserved_varchar02',
			        				name:          		'reserved_varchar02',
			        				value:				reserved_varchar02
			        			},{
			        				fieldLabel:     	getColName('reserved_varchar03'),//'Surface Treatment',
			        				id:          		'reserved_varchar03',
			        				name:          		'reserved_varchar03',
			        				value:				reserved_varchar03
			        			},{
			        				fieldLabel:    	getColName('reserved_varchar04'),//'Erosion',
			        				id:          	'reserved_varchar04',
			        				name:          	'reserved_varchar04',
			        				value:			reserved_varchar04
			        			},{
			        				fieldLabel: getColName('reserved_varchar05'),//'Carving',
			        				id:         'reserved_varchar05',
			        				name:       'reserved_varchar05',
			        				value:		reserved_varchar05
			        			}]
			        		}]
			        	},{
			        		xtype: 			'fieldset',//오른쪽 첫번째 fieldset
			        		title:	 		'Injection Molding Machine(注塑机)',
			        		collapsible: 	false,
			        		margins: 		'0 0 0 6',
			        		defaults: {
			        			labelWidth: 50,
			        			anchor: 	'100%',
			        			width: 		400,
			        			labelAlign: 'right'
			        		},
			        		items: [{
			        			xtype: 			'container',//오른쪽 첫번째 container
			        			flex: 			1,
			        			layout: 		'anchor',
			        			defaultType: 	'displayfield',
			        			defaults: { labelWidth: 130, labelAlign: 'left', anchor:'95%'  },  
			        			items:[{
			        				fieldLabel: 		getColName('reserved_varchar06'),//'Clamping Force',
			        				id:         		'reserved_varchar06',
			        				name:       		'reserved_varchar06',
			        				value:				reserved_varchar06
			        			},{
			        				fieldLabel: 		getColName('reserved_varchar07'),//'Tie Bar Distance',
			        				id:         		'reserved_varchar07',
			        				name:       		'reserved_varchar07',
			        				value:				reserved_varchar07
			        			},{
			        				fieldLabel: 		getColName('reserved_varchar08'),//'Max Pressure',
			        				id:         		'reserved_varchar08',
			        				name:       		'reserved_varchar08',
			        				value:				reserved_varchar08
			        			},{
			        				fieldLabel: 		getColName('reserved_varchar09'),//'Max Speed',
			        				id:         		'reserved_varchar09',
			        				name:       		'reserved_varchar09',
			        				value:				reserved_varchar09
			        			},{
			        				fieldLabel: 		getColName('reserved_varchar10'),//'Max Daylight',
			        				id:         		'reserved_varchar10',
			        				name:       		'reserved_varchar10',
			        				value:				reserved_varchar10
			        			}]
			        		}]
			        	}]
			        },{
			        	xtype: 'container',//세로 두번째
			        	layout:'hbox',
			        	items: [{
			        		xtype: 'fieldset',//왼쪽 두번째 fieldset
			        		title: 'Mold Information(模具信息)',
			        		collapsible: false,
			        		defaults: {
			        			labelWidth: 50,
			        			anchor: 	'100%',
			        			width: 		400,
			        			labelAlign: 'left'
			        		},
			        		items: [{
			        			xtype: 			'container',
			        			flex: 			1,
			        			layout: 		'anchor',
			        			defaultType: 	'displayfield',
			        			defaults: { labelWidth: 110, labelAlign: 'left', anchor:'95%'  },  
			        			items:[{
			        				fieldLabel: 		getColName('reserved_varchar11'),//'Shout Guarantee',
			        				id:         		'reserved_varchar11',
			        				name:       		'reserved_varchar11',
			        				value:				reserved_varchar11
			        			},{
			        				fieldLabel: 		getColName('reserved_varchar12'),//'Molding Type',
			        				id:         		'reserved_varchar12',
			        				name:       		'reserved_varchar12',
			        				value:				reserved_varchar12
			        			},{
			        				fieldLabel: 		getColName('reserved_varchar13'),//'Division',
			        				id:         		'reserved_varchar13',
			        				name:       		'reserved_varchar13',
			        				value:				reserved_varchar13
			        			},{
			        				fieldLabel: 		getColName('reserved_varchar14'),//'Shrinkage Rate',
			        				id:         		'reserved_varchar14',
			        				name:       		'reserved_varchar14',
			        				value:				reserved_varchar14
			        			},{
			        				xtype: 				'fieldcontainer',
			        				fieldLabel: 		getColName('reserved_varchar15'),//'Mold Base',
//			        				id:					'reserved_varchar15',
//			        				name:				'reserved_varchar15',
			        				layout: 			'hbox',
			        				combineErrors: 		true,
			        				defaultType: 		'displayfield',
			        				defaults: {
			        					hideLabel: 'true'
			        				},
			        				items: [{
			        					id:					'reserved_varchar15',
    			        				name:				'reserved_varchar15',
			        					flex: 				1,
			        					value:				split_var15[0]
			        				},{
			        					id:				'material1',
			        					name: 			'material1',
			        					flex: 			1,
			        					margins: 		'0 0 0 6',
			        					value:			split_var15[1]
			        				},{
			        					id:					'maker1',
			        					name: 				'maker1',
			        					flex: 				1,
			        					margins: 			'0 0 0 6',
			        					value:				split_var15[2]
			        				}]
			        			},{
			        				xtype: 'fieldset',// Main Core fieldset
			        				title: 'Main Core(主要型蕊)',
			        				collapsible: false,
			        				defaults: {
			        					labelWidth: 50,
			        					anchor: 	'100%',
			        					width: 		400,
			        					labelAlign: 'left'
			        				},
			        				items: [{
			        					afterLabelTextTpl: 	required,
			        					xtype: 				'fieldcontainer',
			        					fieldLabel: 		getColName('reserved_varchar16'),//'Cavity',
//			        					id:					'reserved_varchar16',
//			        					name:				'reserved_varchar16',
			        					layout: 			'hbox',
			        					combineErrors: 		true,
			        					defaultType: 		'displayfield',
			        					defaults: {
			        						hideLabel: 'true'
			        					},
			        					items: [{
			        						id:					'reserved_varchar16',
    			        					name:				'reserved_varchar16',
			        						flex: 				1,
			        						value:				split_var16[0]
			        					},{
			        						id:					'material2',	
			        						name: 				'material2',
			        						flex: 				1,
			        						margins: 			'0 0 0 6',
			        						value:				split_var16[1]
			        					},{
			        						id:			'hardness',
			        						name: 		'hardness',
			        						flex: 		1,
			        						margins: 	'0 0 0 6',
			        						value:		split_var16[2]
			        					}]
			        				},{
			        					afterLabelTextTpl: 	required,
			        					xtype: 				'fieldcontainer',
			        					fieldLabel: 		getColName('reserved_varchar17'),//'Core',
//			        					id:					'reserved_varchar17',
//			        					name:				'reserved_varchar17',
			        					layout: 			'hbox',
			        					combineErrors: 		true,
			        					defaultType: 		'displayfield',
			        					defaults: {
			        						hideLabel: 'true'
			        					},
			        					items: [{
			        						id:					'reserved_varchar17',
    			        					name:				'reserved_varchar17',
			        						flex: 				1,
			        						value:				split_var17[0]
			        					},{
			        						id: 				'material3',
			        						name: 				'material3',
			        						flex: 				1,
			        						margins: 			'0 0 0 6',
			        						value:				split_var17[1]
			        					},{
			        						id:			'hardness1',
			        						name: 		'hardness1',
			        						flex: 		1,
			        						margins: 	'0 0 0 6',
			        						value:		split_var17[2]
			        					}]
			        				}]
			        			},{
			        				fieldLabel: 		getColName('reserved_varchar18'),//'Slide Core',
			        				id:         		'reserved_varchar18',
			        				name:       		'reserved_varchar18',
			        				value:				reserved_varchar18
			        			},{
			        				fieldLabel: 		getColName('reserved_varchar19'),//'Angular Ejector Pin',
			        				id:         		'reserved_varchar19',
			        				name:       		'reserved_varchar19',
			        				value:				reserved_varchar19
			        			},{
			        				fieldLabel: getColName('reserved_varchar20'),//'Cylinder',
			        				id:         'reserved_varchar20',
			        				name:       'reserved_varchar20',
			        				value:		reserved_varchar20
			        			},{
			        				fieldLabel: 		getColName('reserved_varchar21'),//'Ejecting Hole',
			        				id:         		'reserved_varchar21',
			        				name:       		'reserved_varchar21',
			        				value:				reserved_varchar21
			        			},{
			        				fieldLabel: getColName('reserved_varchar22'),//'Sleeve',
			        				id:         'reserved_varchar22',
			        				name:       'reserved_varchar22',
			        				value:		reserved_varchar22
			        			}]
			        		}]
			        	},{
			        		xtype: 			'fieldset',//오른쪽 두번째 fieldset
			        		title:	 		'Cooling System(冷却系统)',
			        		collapsible: 	false,
			        		margins: 		'0 0 0 6',
			        		defaults: {
			        			labelWidth: 50,
			        			anchor: 	'100%',
			        			width: 		400,
			        			labelAlign: 'right'
			        		},
			        		items: [{
			        			xtype: 			'container',//오른쪽 두번째 container
			        			flex: 			1,
			        			layout: 		'anchor',
			        			defaultType: 	'displayfield',
			        			defaults: { labelWidth: 130, labelAlign: 'left', anchor:'95%'  },  
			        			items:[{
			        				fieldLabel: 		getColName('reserved_varchar23'),//'Coolant',
			        				id:         		'reserved_varchar23',
			        				name:       		'reserved_varchar23',
			        				value:				reserved_varchar23
			        			},{
			        				fieldLabel: 		getColName('reserved_varchar24'),//'Channel Diamater',
			        				id:         		'reserved_varchar24',
			        				name:       		'reserved_varchar24',
			        				value:				reserved_varchar24
			        			},{
			        				xtype: 'fieldset',// Mipple fieldset
			        				title: 'Nipple(接头)',
			        				collapsible: false,
			        				defaults: {
			        					labelWidth: 50,
			        					anchor: 	'100%',
			        					labelAlign: 'left'
			        				},
			        				items: [{
			        					afterLabelTextTpl: 	required,
			        					xtype: 			'fieldcontainer',
			        					fieldLabel: 	getColName('reserved_varchar25'),//'Type',
//			        					id:				'reserved_varchar25',
//			        					name:			'reserved_varchar25',
			        					layout: 		'hbox',
			        					combineErrors: 	true,
			        					defaultType: 	'displayfield',
			        					defaults: {
			        						hideLabel: 'true'
			        					},
			        					items: [{
			        						id:					'reserved_varchar25',
    			        					name:				'reserved_varchar25',
    			        					value:				reserved_varchar25
			        					}]
			        				},{
			        					afterLabelTextTpl: 	required,
			        					xtype: 			'fieldcontainer',
			        					fieldLabel: 	getColName('reserved_varchar26'),//'PT"',
//			        					id:				'reserved_varchar26',
//			        					name:			'reserved_varchar26',
			        					layout: 		'hbox',
			        					combineErrors: 	true,
			        					defaultType: 	'displayfield',
			        					defaults: {
			        						hideLabel: 'true'
			        					},
			        					items: [{
			        						id:					'reserved_varchar26',
    			        					name:				'reserved_varchar26',
    			        					value:				reserved_varchar26
			        					}]
			        				}]
			        			},{
			        				fieldLabel: 		getColName('reserved_varchar27'),//'Mark in out at cooling',
			        				id:         		'reserved_varchar27',
			        				name:       		'reserved_varchar27',
			        				value:				reserved_varchar27
			        			}]
			        		}]
			        	},{
			        		xtype: 			'fieldset',//오른쪽 세번째 fieldset
			        		title:	 		'Gas Vent(排气)',
			        		collapsible: 	false,
			        		margins: 		'237 0 0 -421',
			        		defaults: {
			        			labelWidth: 50,
			        			anchor: 	'100%',
			        			width: 		400,
			        			labelAlign: 'right'
			        		},
			        		items: [{
			        			xtype: 			'container',//오른쪽 세번째 container
			        			flex: 			1,
			        			layout: 		'anchor',
			        			defaultType: 	'displayfield',
			        			defaults: { labelWidth: 130, labelAlign: 'left', anchor:'95%'  },  
			        			items:[{
			        				fieldLabel: getColName('reserved_varchar28'),//'Core',
			        				id:         'reserved_varchar28',
			        				name:       'reserved_varchar28',
			        				value:		reserved_varchar28
			        			},{
			        				fieldLabel: getColName('reserved_varchar29'),//'Parting Line',
			        				id:         'reserved_varchar29',
			        				name:       'reserved_varchar29',
			        				value:		reserved_varchar29
			        			},{
			        				fieldLabel: getColName('reserved_varchar30'),//'Hole',
			        				id:         'reserved_varchar30',
			        				name:       'reserved_varchar30',
			        				value:		reserved_varchar30
			        			}]
			        		}]
			        	}]
			        },{
			        	xtype: 'container',//세로 세번째
			        	layout:'hbox',
			        	items: [{
			        		xtype: 			'fieldset',//세로 세번째 fieldset
			        		title:	 		'Runner & Gate System(流道与浇口系统)',
			        		collapsible: 	false,
			        		defaults: {
			        			labelWidth: 50,
			        			anchor: 	'100%',
			        			width: 		400,
			        			labelAlign: 'right'
			        		},
			        		items: [{
			        			xtype: 			'container',//세로 세번째 container
			        			flex: 			1,
			        			layout: 		'anchor',
			        			defaultType: 	'displayfield',
			        			defaults: { labelWidth: 130, labelAlign: 'left', anchor:'95%'  },  
			        			items:[{
			        				fieldLabel:     	getColName('reserved_varchar31'),//'Runner Type',
			        				id:          		'reserved_varchar31',
			        				name:          		'reserved_varchar31',
			        				value:				reserved_varchar31
			        			},{
			        				fieldLabel: 		getColName('reserved_varchar32'),//'Sqrue/LocateRing',
			        				id:         		'reserved_varchar32',
			        				name:       		'reserved_varchar32',
			        				value:				reserved_varchar32
			        			},{
			        				xtype: 'fieldset',// Gate fieldset
			        				title: 'Gate(浇口)',
			        				collapsible: false,
			        				defaultType: 'displayfield',
			        				defaults: {
			        					labelWidth: 70,
			        					anchor: 	'100%',
			        					width: 		400,
			        					labelAlign: 'left'
			        				},
			        				items: [{
			        					fieldLabel:     	getColName('reserved_varchar33'),//'Type',
			        					id:          		'reserved_varchar33',
			        					name:          		'reserved_varchar33',
			        					value:				reserved_varchar33
			        				},{
			        					fieldLabel: 		getColName('reserved_varchar34'),//'Qty',
			        					id:         		'reserved_varchar34',
			        					name:       		'reserved_varchar34',
			        					value:				reserved_varchar34
			        				}]
			        			},{
			        				xtype: 			'fieldset',// Cold Runner fieldset
			        				title: 			'Cold Runner(冷流道)',
			        				collapsible:	false,
			        				defaultType: 	'displayfield',
			        				defaults: {
			        					labelWidth: 70,
			        					anchor: 	'100%',
			        					width: 		400,
			        					labelAlign: 'left'
			        				},
			        				items: [{
			        					fieldLabel:     getColName('reserved_varchar35'),//'Runner Selection',
			        					id:          	'reserved_varchar35',
			        					name:          	'reserved_varchar35',
			        					value:			reserved_varchar35
			        				}]
			        			},{
			        				xtype: 			'fieldset',// Hot Runner fieldset
			        				title: 			'Hot Runner(热流道)',
			        				collapsible: 	false,
			        				defaultType: 	'displayfield',
			        				defaults: {
			        					labelWidth: 70,
			        					anchor: 	'100%',
			        					width: 		400,
			        					labelAlign: 'left'
			        				},
			        				items: [{
			        					fieldLabel:     	getColName('reserved_varchar36'),//'Maker',
			        					id:          		'reserved_varchar36',
			        					name:          		'reserved_varchar36',
			        					value:				reserved_varchar36
			        				},{
			        					fieldLabel:     	getColName('reserved_varchar37'),//'Type',
			        					id:          		'reserved_varchar37',
			        					name:          		'reserved_varchar37',
			        					value:				reserved_varchar37
			        				},{
			        					fieldLabel:     	getColName('reserved_varchar38'),//'Nozzle Type',
			        					id:          		'reserved_varchar38',
			        					name:          		'reserved_varchar38',
			        					value:				reserved_varchar38
			        				},{
			        					fieldLabel: 		getColName('reserved_varchar39'),//'Qty of Value',
			        					id:         		'reserved_varchar39',
			        					name:       		'reserved_varchar39',
			        					value:				reserved_varchar39
			        				},{
			        					fieldLabel: 		getColName('reserved_varchar40'),//'Gate Diameter',
			        					id:         		'reserved_varchar40',
			        					name:       		'reserved_varchar40',
			        					value:				reserved_varchar40
			        				}]
			        			}]
			        		}]
			        	},{
			        		xtype: 'container',//세로 두번째
			        		layout:'hbox',
			        		items: [{
			        			xtype: 			'fieldset',//오른쪽 네번째 fieldset
			        			title:	 		'Etc',
			        			margins: 		'0 0 0 6',
			        			collapsible: 	false,
			        			defaults: {
			        				labelWidth: 50,
			        				anchor: 	'100%',
			        				width: 		400,
			        				labelAlign: 'right'
			        			},
			        			items: [{
			        				xtype: 			'container',//오른쪽 네번째 container
			        				flex: 			1,
			        				layout: 		'anchor',
			        				defaultType: 	'displayfield',
			        				defaults: { labelWidth: 130, labelAlign: 'left', anchor:'95%'  },  
			        				items:[{
			        					id:			'reserved_varchar41',
			        					name: 		'reserved_varchar41',
			        					fieldLabel: getColName('reserved_varchar41'),//'Shot Counter',	
			        					value:		reserved_varchar41
			        				},{
			        					id:			'reserved_varchar42',
			        					name: 		'reserved_varchar42',
			        					fieldLabel: getColName('reserved_varchar42'),//'Name Plate(SEC Std.)'
			        					value:		reserved_varchar42
			        				},{
			        					id:			'reserved_varchar43',
			        					name: 		'reserved_varchar43',
			        					fieldLabel: getColName('reserved_varchar43'),//'Eject Plate Forced Return'
			        					value:		reserved_varchar43
			        				},{
			        					id:			'reserved_varchar44',
			        					name: 		'reserved_varchar44',
			        					fieldLabel: getColName('reserved_varchar44'),//'DLC'
			        					value:		reserved_varchar44
			        				},{
			        					id:			'reserved_varchar45',
			        					name: 		'reserved_varchar45',
			        					fieldLabel: getColName('reserved_varchar45'),//'Side Straight&P/L Block'
			        					value:		reserved_varchar45
			        				}]
			        			}]
			        		}]
//            },{
//                xtype: 			'fieldset',//오른쪽 네번째 fieldset
//            	title:	 		'Remarks',
//            	collapsible: 	false,
//            	margins: 		'200 0 0 -421',
//            	defaults: {
//            		labelWidth: 50,
//            		anchor: 	'100%',
//            		width: 		400,
//            		labelAlign: 'right'
//            	},
//            	items: [{
//            		xtype: 			'container',//오른쪽 네번째 container
//            		flex: 			1,
//            		layout: 		'anchor',
//            		defaults: { labelWidth: 130, labelAlign: 'left', anchor:'95%'  },  
//            		items:[{
//            			xtype:          'textarea',
//    					id:          	'remarks',
//    					name:          	'remarks'
//            		}]
//            	}]
			        	}]
			        }]
        }); //endof form
    
    return form;
}

function createEditForm(mainspec) {
	var selection = grid.getSelectionModel().getSelection();
	var record = selection[0];
	var pj_uid = record.get('unique_id');
	var model_name = record.get('description');
	var part_name = record.get('pj_name');
	var cavity = record.get('cav_no');
	var asset_no = record.get('asset_number');
	var mold_code = record.get('pj_code');
		
	var reserved_varchar01 = mainspec.get('reserved_varchar01');
	var reserved_varchar02 = mainspec.get('reserved_varchar02');
	var reserved_varchar03 = mainspec.get('reserved_varchar03');
	var reserved_varchar04 = mainspec.get('reserved_varchar04');
	var reserved_varchar05 = mainspec.get('reserved_varchar05');
	var reserved_varchar06 = mainspec.get('reserved_varchar06');
	var reserved_varchar07 = mainspec.get('reserved_varchar07');
	var reserved_varchar08 = mainspec.get('reserved_varchar08');
	var reserved_varchar09 = mainspec.get('reserved_varchar09');
	var reserved_varchar10 = mainspec.get('reserved_varchar10');
	var reserved_varchar11 = mainspec.get('reserved_varchar11');
	var reserved_varchar12 = mainspec.get('reserved_varchar12');
	var reserved_varchar13 = mainspec.get('reserved_varchar13');
	var reserved_varchar14 = mainspec.get('reserved_varchar14');
	var reserved_varchar15 = mainspec.get('reserved_varchar15');
	var reserved_varchar16 = mainspec.get('reserved_varchar16');
	var reserved_varchar17 = mainspec.get('reserved_varchar17');
	var reserved_varchar18 = mainspec.get('reserved_varchar18');
	var reserved_varchar19 = mainspec.get('reserved_varchar19');
	var reserved_varchar20 = mainspec.get('reserved_varchar20');
	var reserved_varchar21 = mainspec.get('reserved_varchar21');
	var reserved_varchar22 = mainspec.get('reserved_varchar22');
	var reserved_varchar23 = mainspec.get('reserved_varchar23');
	var reserved_varchar24 = mainspec.get('reserved_varchar24');
	var reserved_varchar25 = mainspec.get('reserved_varchar25');
	var reserved_varchar26 = mainspec.get('reserved_varchar26');
	var reserved_varchar27 = mainspec.get('reserved_varchar27');
	var reserved_varchar28 = mainspec.get('reserved_varchar28');
	var reserved_varchar29 = mainspec.get('reserved_varchar29');
	var reserved_varchar30 = mainspec.get('reserved_varchar30');
	var reserved_varchar31 = mainspec.get('reserved_varchar31');
	var reserved_varchar32 = mainspec.get('reserved_varchar32');
	var reserved_varchar33 = mainspec.get('reserved_varchar33');
	var reserved_varchar34 = mainspec.get('reserved_varchar34');
	var reserved_varchar35 = mainspec.get('reserved_varchar35');
	var reserved_varchar36 = mainspec.get('reserved_varchar36');
	var reserved_varchar37 = mainspec.get('reserved_varchar37');
	var reserved_varchar38 = mainspec.get('reserved_varchar38');
	var reserved_varchar39 = mainspec.get('reserved_varchar39');
	var reserved_varchar40 = mainspec.get('reserved_varchar40');
	var reserved_varchar41 = mainspec.get('reserved_varchar41');
	var reserved_varchar42 = mainspec.get('reserved_varchar42');
	var reserved_varchar43 = mainspec.get('reserved_varchar43');
	var reserved_varchar44 = mainspec.get('reserved_varchar44');
	var reserved_varchar45 = mainspec.get('reserved_varchar45');
	var reserved_varchar46 = mainspec.get('reserved_varchar46');
	console_log('reserved_varchar15');
	console_log(reserved_varchar15);
	console_log(mainspec);
	var split_var15 = reserved_varchar15.split(',');
	var split_var16 = reserved_varchar16.split(',');
	var split_var17 = reserved_varchar17.split(',');
	
    var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
    		defaultType: 'displayfield',
    		frame: 			false ,
			autoScroll : true,
			bodyPadding:	'3 3 0',
			width: 			800,
			autoHeight:		true,
			defaults: {
				anchor: 	'100%',
				labelWidth: 100
			},
            items: [
			        new Ext.form.Hidden({
			        	id: 'pj_uid',
			        	name: 'pj_uid',
			        	value: pj_uid
			        }),new Ext.form.Hidden({
			        	id: 'srch_type',
			        	name: 'srch_type',
			        	value: 'update'
			        }),{
			        	xtype: 'container',
			        	flex: 1,
			        	layout: 'hbox',
			        	items: [{
			        		xtype: 			'container',
			        		flex: 			1,
			        		layout: 		'anchor',
			        		defaultType: 	'textfield',
			        		defaults: { labelWidth: 110, labelAlign: 'left', anchor:'95%'  },  
			        		items:[{
			        			afterLabelTextTpl: 	required,
			        			readOnly:			true,
			        			fieldStyle: 		'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
			        			xtype: 				'textfield',
			        			fieldLabel: 		'Model Name(机型)',
//		        			emptyText: 			'Model Name',
			        			id:         		'model_name',
			        			name:       		'model_name',
			        			value:				model_name
			        		},{
			        			afterLabelTextTpl: 	required,
			        			readOnly:			true,
			        			fieldStyle: 		'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
			        			xtype: 				'textfield',
			        			fieldLabel: 		'Part Name(品名)',
//		        			emptyText: 			'Part Name',
			        			id:         		'part_name',
			        			name:       		'part_name',
			        			value:				part_name
			        		},{
			        			afterLabelTextTpl: 	required,
			        			xtype: 				'textfield',
			        			fieldLabel: 		getColName('reserved_varchar46'),//'Dition',
//		        			emptyText: 			getColName('reserved_varchar46'),//'Dition',
			        			id:         		'reserved_varchar46',
			        			name:       		'reserved_varchar46',
			        			value:				reserved_varchar46
			        		}]
			        	},{
			        		xtype: 			'container',
			        		flex: 			1,
			        		layout: 		'anchor',
			        		defaultType: 	'textfield',
			        		defaults: { labelWidth: 110, labelAlign: 'left', anchor:'95%'  },  
			        		items:[{
			        			afterLabelTextTpl: 	required,
			        			readOnly:			true,
			        			fieldStyle: 		'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
			        			xtype: 				'textfield',
			        			fieldLabel: 		'Cavity(穴数)',
			        			//emptyText: 			'Cavity',
			        			id:         		'cavity',
			        			name:       		'cavity',
			        			value:				cavity
			        		},{
			        			afterLabelTextTpl: 	required,
			        			readOnly:			true,
			        			fieldStyle: 		'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
			        			xtype: 				'textfield',
			        			fieldLabel: 		'Asset No(资产编号)',
			        			//emptyText: 			'Asset No',
			        			id:         		'asset_no',
			        			name:       		'asset_no',
			        			value:				asset_no
			        		},{
			        			afterLabelTextTpl: 	required,
			        			readOnly:			true,
			        			fieldStyle: 		'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
			        			xtype: 				'textfield',
			        			fieldLabel: 		'Mold Code(模号)',
			        			//emptyText: 			'Mold Code',
			        			id:         		'mold_code',
			        			name:       		'mold_code',
			        			value:				mold_code
			        		}]
			        	}]
			        },{
			        	xtype: 'container',//세로 첫번째
			        	layout:'hbox',
			        	items: [{
			        		xtype: 'fieldset',//왼쪽 첫번째 fieldset
			        		title: 'Part Information(零件信息)',
			        		collapsible: false,
			        		defaults: {
			        			labelWidth: 50,
			        			anchor: 	'100%',
			        			width: 		400,
			        			labelAlign: 'left'
			        		},
			        		items: [{
			        			xtype: 			'container',//왼쪽 첫번째 container
			        			flex: 			1,
			        			layout: 		'anchor',
			        			defaultType: 	'textfield',
			        			defaults: { labelWidth: 110, labelAlign: 'left', anchor:'95%'  },  
			        			items:[{
			        				afterLabelTextTpl: 	required,
			        				fieldLabel: 		getColName('reserved_varchar01'),//'Size',
			        				//emptyText: 			getColName('reserved_varchar01'),//'Size',
			        				id:         		'reserved_varchar01',
			        				name:       		'reserved_varchar01',
			        				value:				reserved_varchar01
			        			},{
			        				afterLabelTextTpl: 	required,
			        				xtype:          	'combo',
			        				editable:      		true,typeAhead: true,
			        				mode:           	'local',
			        				displayField:   	'codeName' ,
			        				valueField:     	'codeName' ,
			        				fieldLabel:     	getColName('reserved_varchar02'),//'Material',
			        				//emptyText: 			getColName('reserved_varchar02'),//'Material',
			        				id:          		'reserved_varchar02',
			        				name:          		'reserved_varchar02',
			        				value:				reserved_varchar02,
			        				store: 				Ext.create('Ext.data.Store', {
			        					fields:[     
			        					        { name: 'systemCode', type: "string" }
			        					        ,{ name: 'codeName', type: "string"  }
			        					        ,{ name: 'codeNameEn', type: "string"  }
			        					        
			        					        ],
			        					        proxy: {
			        					        	type: 'ajax',
			        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=MATERIAL',
			        					        	reader: {
			        					        		type:'json',
			        					        		root: 'datas',
			        					        		totalProperty: 'count',
			        					        		successProperty: 'success'
			        					        	}
			        				,autoLoad: false
			        					        }
			        				}),
			        				listConfig:{
			        					getInnerTpl: function(){
			        						return '<div data-qtip="{codeName}">{codeName}</div>';
			        					}			                	
			        				}
			        			},{
			        				afterLabelTextTpl: 	required,
			        				xtype:          	'combo',
			        				editable:      		true,typeAhead: true,
			        				mode:           	'local',
			        				displayField:   	'codeName' ,
			        				valueField:     	'codeName' ,
			        				fieldLabel:     	getColName('reserved_varchar03'),//'Surface Treatment',
			        				//emptyText: 			getColName('reserved_varchar03'),//'Surface Treatment',
			        				id:          		'reserved_varchar03',
			        				name:          		'reserved_varchar03',
			        				value:				reserved_varchar03,
			        				store: 				Ext.create('Ext.data.Store', {
			        					fields:[     
			        					        { name: 'systemCode', type: "string" }
			        					        ,{ name: 'codeName', type: "string"  }
			        					        ,{ name: 'codeNameEn', type: "string"  }
			        					        
			        					        ],
			        					        proxy: {
			        					        	type: 'ajax',
			        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=SURFACE_TREATMENT',
			        					        	reader: {
			        					        		type:'json',
			        					        		root: 'datas',
			        					        		totalProperty: 'count',
			        					        		successProperty: 'success'
			        					        	}
			        				,autoLoad: false
			        					        }
			        				}),
			        				listConfig:{
			        					getInnerTpl: function(){
			        						return '<div data-qtip="{codeName}">{codeName}</div>';
			        					}			                	
			        				}
			        			},{
			        				xtype:          'combo',
			        				editable:      	false,
			        				mode:           'local',
			        				displayField:   'codeName' ,
			        				valueField:     'codeName' ,
			        				fieldLabel:    	getColName('reserved_varchar04'),//'Erosion',
			        				//emptyText: 		getColName('reserved_varchar04'),//'Erosion',
			        				id:          	'reserved_varchar04',
			        				name:          	'reserved_varchar04',
			        				value:			reserved_varchar04,
			        				store: 			Ext.create('Ext.data.Store', {
			        					fields:[     
			        					        { name: 'systemCode', type: "string" }
			        					        ,{ name: 'codeName', type: "string"  }
			        					        ,{ name: 'codeNameEn', type: "string"  }
			        					        
			        					        ],
			        					        proxy: {
			        					        	type: 'ajax',
			        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=EROSION',
			        					        	reader: {
			        					        		type:'json',
			        					        		root: 'datas',
			        					        		totalProperty: 'count',
			        					        		successProperty: 'success'
			        					        	}
			        				,autoLoad: false
			        					        }
			        				}),
			        				listConfig:{
			        					getInnerTpl: function(){
			        						return '<div data-qtip="{codeName}">{codeName}</div>';
			        					}			                	
			        				}
			        			},{
			        				fieldLabel: getColName('reserved_varchar05'),//'Carving',
			        				//emptyText: 	getColName('reserved_varchar05'),//'Carving',
			        				id:         'reserved_varchar05',
			        				name:       'reserved_varchar05',
			        				value:		reserved_varchar05
			        			}]
			        		}]
			        	},{
			        		xtype: 			'fieldset',//오른쪽 첫번째 fieldset
			        		title:	 		'Injection Molding Machine(注塑机)',
			        		collapsible: 	false,
			        		margins: 		'0 0 0 6',
			        		defaults: {
			        			labelWidth: 50,
			        			anchor: 	'100%',
			        			width: 		400,
			        			labelAlign: 'right'
			        		},
			        		items: [{
			        			xtype: 			'container',//오른쪽 첫번째 container
			        			flex: 			1,
			        			layout: 		'anchor',
			        			defaultType:	'textfield',
			        			defaults: { labelWidth: 130, labelAlign: 'left', anchor:'95%'  },  
			        			items:[{
			        				afterLabelTextTpl: 	required,
			        				xtype:          	'combo',
			        				editable:      		true,typeAhead: true,
			        				mode:           	'local',
//		        				displayField:   	'codeName' ,
//		        				valueField:     	'systemCode' ,
			        				fieldLabel: 		getColName('reserved_varchar06'),//'Clamping Force',
			        				//emptyText: 			getColName('reserved_varchar06'),//'Clamping Force',
			        				id:         		'reserved_varchar06',
			        				name:       		'reserved_varchar06',
			        				value:				reserved_varchar06,
			        				store: 				Ext.create('Ext.data.Store', {
			        					fields:[     
			        					        { name: 'systemCode', type: "string" }
			        					        ,{ name: 'codeName', type: "string"  }
			        					        ,{ name: 'codeNameEn', type: "string"  }
			        					        
			        					        ],
			        					        proxy: {
			        					        	type: 'ajax',
			        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=CLAMPING_FORCE',
			        					        	reader: {
			        					        		type:'json',
			        					        		root: 'datas',
			        					        		totalProperty: 'count',
			        					        		successProperty: 'success'
			        					        	}
			        				,autoLoad: false
			        					        }
			        				}),
			        				listConfig:{
			        					getInnerTpl: function(){
			        						return '<div data-qtip="{codeName}">{codeName}.sub</div>';
			        					}			                	
			        				},
			        				listeners: {
			        					select: function (combo, record) {
			        						var value = record[0].get('codeName');
			        						var split_value=value.split(',');
			        						Ext.getCmp('reserved_varchar06').setValue(split_value[0]);
			        						Ext.getCmp('reserved_varchar07').setValue(split_value[1]);
			        						Ext.getCmp('reserved_varchar08').setValue(split_value[2]);
			        						Ext.getCmp('reserved_varchar09').setValue(split_value[3]);
			        						Ext.getCmp('reserved_varchar10').setValue(split_value[4]);
			        						
			        					}
			        				}
			        			},{
			        				afterLabelTextTpl: 	required,
			        				fieldLabel: 		getColName('reserved_varchar07'),//'Tie Bar Distance',
			        				//emptyText: 			getColName('reserved_varchar07'),//'Tie Bar Distance',
			        				id:         		'reserved_varchar07',
			        				name:       		'reserved_varchar07',
			        				value:				reserved_varchar07
			        			},{
			        				afterLabelTextTpl: 	required,
			        				fieldLabel: 		getColName('reserved_varchar08'),//'Max Pressure',
			        				//emptyText: 			getColName('reserved_varchar08'),//'Max Pressure',
			        				id:         		'reserved_varchar08',
			        				name:       		'reserved_varchar08',
			        				value:				reserved_varchar08
			        			},{
			        				afterLabelTextTpl: 	required,
			        				fieldLabel: 		getColName('reserved_varchar09'),//'Max Speed',
			        				//emptyText: 			getColName('reserved_varchar09'),//'Max Speed',
			        				id:         		'reserved_varchar09',
			        				name:       		'reserved_varchar09',
			        				value:				reserved_varchar09
			        			},{
			        				afterLabelTextTpl: 	required,
			        				fieldLabel: 		getColName('reserved_varchar10'),//'Max Daylight',
			        				//emptyText: 			getColName('reserved_varchar10'),//'Max Daylight',
			        				id:         		'reserved_varchar10',
			        				name:       		'reserved_varchar10',
			        				value:				reserved_varchar10
			        			}]
			        		}]
			        	}]
			        },{
			        	xtype: 'container',//세로 두번째
			        	layout:'hbox',
			        	items: [{
			        		xtype: 'fieldset',//왼쪽 두번째 fieldset
			        		title: 'Mold Information(模具信息)',
			        		collapsible: false,
			        		defaults: {
			        			labelWidth: 50,
			        			anchor: 	'100%',
			        			width: 		400,
			        			labelAlign: 'left'
			        		},
			        		items: [{
			        			xtype: 			'container',
			        			flex: 			1,
			        			layout: 		'anchor',
			        			defaultType: 	'textfield',
			        			defaults: { labelWidth: 110, labelAlign: 'left', anchor:'95%'  },  
			        			items:[{
			        				afterLabelTextTpl: 	required,
			        				fieldLabel: 		getColName('reserved_varchar11'),//'Shout Guarantee',
			        				//emptyText: 			getColName('reserved_varchar11'),//'Shout Guarantee',
			        				id:         		'reserved_varchar11',
			        				name:       		'reserved_varchar11',
			        				value:				reserved_varchar11
			        			},{
			        				afterLabelTextTpl: 	required,
			        				xtype:      		'combo',
			        				editable:      		true,typeAhead: true,
			        				mode:       		'local',
			        				displayField:   	'codeName' ,
			        				valueField:     	'codeName' ,
			        				fieldLabel: 		getColName('reserved_varchar12'),//'Molding Type',
			        				//emptyText: 			getColName('reserved_varchar12'),//'Molding Type',
			        				id:         		'reserved_varchar12',
			        				name:       		'reserved_varchar12',
			        				value:				reserved_varchar12,
			        				store: 				Ext.create('Ext.data.Store', {
			        					fields:[     
			        					        { name: 'systemCode', type: "string" }
			        					        ,{ name: 'codeName', type: "string"  }
			        					        ,{ name: 'codeNameEn', type: "string"  }
			        					        
			        					        ],
			        					        
			        					        proxy: {
			        					        	type: 'ajax',
			        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=MOLDING_TYPE',
			        					        	reader: {
			        					        		type:'json',
			        					        		root: 'datas',
			        					        		totalProperty: 'count',
			        					        		successProperty: 'success'
			        					        	}
			        				,autoLoad: false
			        					        }
			        				}),
			        				listConfig:{
			        					getInnerTpl: function(){
			        						return '<div data-qtip="{codeName}">{codeName}</div>';
			        					}			                	
			        				}
			        			},{
			        				afterLabelTextTpl: 	required,
			        				xtype:      		'combo',
			        				editable:      		true,typeAhead: true,
			        				mode:       		'local',
			        				displayField:   	'codeName' ,
			        				valueField:     	'codeName' ,
			        				fieldLabel: 		getColName('reserved_varchar13'),//'Division',
			        				//emptyText: 			getColName('reserved_varchar13'),//'Division',
			        				id:         		'reserved_varchar13',
			        				name:       		'reserved_varchar13',
			        				value:				reserved_varchar13,
			        				store: 				Ext.create('Ext.data.Store', {
			        					fields:[     
			        					        { name: 'systemCode', type: "string" }
			        					        ,{ name: 'codeName', type: "string"  }
			        					        ,{ name: 'codeNameEn', type: "string"  }
			        					        
			        					        ],
			        					        
			        					        proxy: {
			        					        	type: 'ajax',
			        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=DIVISION',
			        					        	reader: {
			        					        		type:'json',
			        					        		root: 'datas',
			        					        		totalProperty: 'count',
			        					        		successProperty: 'success'
			        					        	}
			        				,autoLoad: false
			        					        }
			        				}),
			        				listConfig:{
			        					getInnerTpl: function(){
			        						return '<div data-qtip="{codeName}">{codeName}</div>';
			        					}			                	
			        				}
			        			},{
			        				afterLabelTextTpl: 	required,
			        				fieldLabel: 		getColName('reserved_varchar14'),//'Shrinkage Rate',
			        				//emptyText: 			getColName('reserved_varchar14'),//'Shrinkage Rate',
			        				id:         		'reserved_varchar14',
			        				name:       		'reserved_varchar14',
			        				value:				reserved_varchar14
			        			},{
			        				afterLabelTextTpl: 	required,
			        				xtype: 				'fieldcontainer',
			        				fieldLabel: 		getColName('reserved_varchar15'),//'Mold Base',
//		        				id:					'reserved_varchar15',
//		        				name:				'reserved_varchar15',
			        				layout: 			'hbox',
			        				combineErrors: 		true,
			        				defaultType: 		'textfield',
			        				defaults: {
			        					hideLabel: 'true'
			        				},
			        				items: [{
//		        					id:			'Size',
//		        					name: 		'Size',
			        					id:			'reserved_varchar15',
			        					name:		'reserved_varchar15',
			        					value:		split_var15[0],
			        					flex: 		1
			        					//emptyText: 	'Size'
			        				},{
			        					xtype:     	 	'combo',
			        					editable:      	false,
			        					mode:       	'local',
			        					displayField:   'codeName' ,
			        					valueField:     'codeName' ,
			        					id:				'material1',
			        					name: 			'material1',
			        					value:			split_var15[1],
			        					flex: 			1,
			        					margins: 		'0 0 0 6',
			        					//emptyText: 		'Material',
			        					store: Ext.create('Ext.data.Store', {
			        						fields:[     
			        						        { name: 'systemCode', type: "string" }
			        						        ,{ name: 'codeName', type: "string"  }
			        						        ,{ name: 'codeNameEn', type: "string"  }
			        						        
			        						        ],
			        						        
			        						        proxy: {
			        						        	type: 'ajax',
			        						        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=MOLD_BASE',
			        						        	reader: {
			        						        		type:'json',
			        						        		root: 'datas',
			        						        		totalProperty: 'count',
			        						        		successProperty: 'success'
			        						        	}
			        					,autoLoad: false
			        						        }
			        					}),
			        					listConfig:{
			        						getInnerTpl: function(){
			        							return '<div data-qtip="{codeName}">{codeName}</div>';
			        						}			                	
			        					}
			        				},{
			        					xtype:      		'combo',
			        					editable:      		true,typeAhead: true,
			        					mode:       		'local',
			        					displayField:   	'codeName' ,
			        					valueField:     	'codeName',
			        					id:					'maker1',
			        					name: 				'maker1',
			        					value:				split_var15[2],
			        					flex: 				1,
			        					margins: 			'0 0 0 6',
			        					//emptyText: 			'Maker',
			        					store: Ext.create('Ext.data.Store', {
			        						fields:[     
			        						        { name: 'systemCode', type: "string" }
			        						        ,{ name: 'codeName', type: "string"  }
			        						        ,{ name: 'codeNameEn', type: "string"  }
			        						        
			        						        ],
			        						        
			        						        proxy: {
			        						        	type: 'ajax',
			        						        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=MAKER',
			        						        	reader: {
			        						        		type:'json',
			        						        		root: 'datas',
			        						        		totalProperty: 'count',
			        						        		successProperty: 'success'
			        						        	}
			        					,autoLoad: false
			        						        }
			        					}),
			        					listConfig:{
			        						getInnerTpl: function(){
			        							return '<div data-qtip="{codeName}">{codeName}</div>';
			        						}			                	
			        					}
			        				}]
			        			},{
			        				xtype: 'fieldset',// Main Core fieldset
			        				title: 'Main Core(主要型蕊)',
			        				collapsible: false,
			        				defaults: {
			        					labelWidth: 50,
			        					anchor: 	'100%',
			        					width: 		400,
			        					labelAlign: 'left'
			        				},
			        				items: [{
			        					afterLabelTextTpl: 	required,
			        					xtype: 				'fieldcontainer',
			        					fieldLabel: 		getColName('reserved_varchar16'),//'Cavity',
//		        					id:					'reserved_varchar16',
//		        					name:				'reserved_varchar16',
			        					layout: 			'hbox',
			        					combineErrors: 		true,
			        					defaultType: 		'textfield',
			        					defaults: {
			        						hideLabel: 'true'
			        					},
			        					items: [{
			        						id:					'reserved_varchar16',
			        						name:				'reserved_varchar16',
			        						value:				split_var16[0],
//		        						id:			'Size1',
//		        						name: 		'Size1',
			        						flex: 		1
			        						//emptyText: 	'Size'
			        					},{
			        						xtype:      		'combo',
			        						editable:      		true,typeAhead: true,
			        						mode:       		'local',
			        						displayField:   	'codeName' ,
			        						valueField:     	'codeName' ,
			        						id:					'material2',	
			        						name: 				'material2',
			        						value:				split_var16[1],
			        						flex: 				1,
			        						margins: 			'0 0 0 6',
			        						//emptyText: 			'Material',
			        						store: Ext.create('Ext.data.Store', {
			        							fields:[     
			        							        { name: 'systemCode', type: "string" }
			        							        ,{ name: 'codeName', type: "string"  }
			        							        ,{ name: 'codeNameEn', type: "string"  }
			        							        
			        							        ],
			        							        
			        							        proxy: {
			        							        	type: 'ajax',
			        							        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=CAVITY',
			        							        	reader: {
			        							        		type:'json',
			        							        		root: 'datas',
			        							        		totalProperty: 'count',
			        							        		successProperty: 'success'
			        							        	}
			        						,autoLoad: false
			        							        }
			        						}),
			        						listConfig:{
			        							getInnerTpl: function(){
			        								return '<div data-qtip="{codeName}">{codeName}</div>';
			        							}			                	
			        						}
			        					},{
			        						id:			'hardness',
			        						name: 		'hardness',
			        						value:		split_var16[2],
			        						flex: 		1,
			        						margins: 	'0 0 0 6'
			        						//emptyText: 	'Hardness'
			        					}]
			        				},{
			        					afterLabelTextTpl: 	required,
			        					xtype: 				'fieldcontainer',
			        					fieldLabel: 		getColName('reserved_varchar17'),//'Core',
//		        					id:					'reserved_varchar17',
//		        					name:				'reserved_varchar17',
			        					layout: 			'hbox',
			        					combineErrors: 		true,
			        					defaultType: 		'textfield',
			        					defaults: {
			        						hideLabel: 'true'
			        					},
			        					items: [{
			        						id:					'reserved_varchar17',
			        						name:				'reserved_varchar17',
			        						value:				split_var17[0],
//		        						id:			'Size2',
//		        						name: 		'Size2',
			        						flex: 		1
			        						//emptyText: 	'Size'
			        					},{
			        						xtype:      		'combo',
			        						editable:      		true,typeAhead: true,
			        						mode:       		'local',
			        						displayField:   	'codeName' ,
			        						valueField:     	'codeName' ,
			        						id: 				'material3',
			        						name: 				'material3',
			        						value:				split_var17[1],
			        						flex: 				1,
			        						margins: 			'0 0 0 6',
			        						//emptyText: 			'Material',
			        						store: 		Ext.create('Ext.data.Store', {
			        							fields:[     
			        							        { name: 'systemCode', type: "string" }
			        							        ,{ name: 'codeName', type: "string"  }
			        							        ,{ name: 'codeNameEn', type: "string"  }
			        							        
			        							        ],
			        							        
			        							        proxy: {
			        							        	type: 'ajax',
			        							        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=CAVITY',
			        							        	reader: {
			        							        		type:'json',
			        							        		root: 'datas',
			        							        		totalProperty: 'count',
			        							        		successProperty: 'success'
			        							        	}
			        						,autoLoad: false
			        							        }
			        						}),
			        						listConfig:{
			        							getInnerTpl: function(){
			        								return '<div data-qtip="{codeName}">{codeName}</div>';
			        							}			                	
			        						}
			        					},{
			        						id:			'hardness1',
			        						name: 		'hardness1',
			        						value:		split_var17[2],
			        						flex: 		1,
			        						margins: 	'0 0 0 6'
			        						//emptyText: 	'Hardness'
			        					}]
			        				}]
			        			},{
			        				afterLabelTextTpl: 	required,
			        				fieldLabel: 		getColName('reserved_varchar18'),//'Slide Core',
			        				//emptyText: 			getColName('reserved_varchar18'),//'Slide Core',
			        				id:         		'reserved_varchar18',
			        				name:       		'reserved_varchar18',
			        				value:				reserved_varchar18
			        			},{
			        				afterLabelTextTpl: 	required,
			        				fieldLabel: 		getColName('reserved_varchar19'),//'Angular Ejector Pin',
			        				//emptyText: 			getColName('reserved_varchar19'),//'Angular Ejector Pin',
			        				id:         		'reserved_varchar19',
			        				name:       		'reserved_varchar19',
			        				value:				reserved_varchar19
			        			},{
			        				fieldLabel: getColName('reserved_varchar20'),//'Cylinder',
			        				//emptyText: 	getColName('reserved_varchar20'),//'Cylinder',
			        				id:         'reserved_varchar20',
			        				name:       'reserved_varchar20',
			        				value:		reserved_varchar20
			        			},{
			        				xtype:      		'combo',
			        				editable:      		true,typeAhead: true,
			        				mode:       		'local',
			        				displayField:   	'codeName' ,
			        				valueField:     	'codeName' ,
			        				fieldLabel: 		getColName('reserved_varchar21'),//'Ejecting Hole',
			        				//emptyText: 			getColName('reserved_varchar21'),//'Ejecting Hole',
			        				id:         		'reserved_varchar21',
			        				name:       		'reserved_varchar21',
			        				value:				reserved_varchar21,
			        				store: 		Ext.create('Ext.data.Store', {
			        					fields:[     
			        					        { name: 'systemCode', type: "string" }
			        					        ,{ name: 'codeName', type: "string"  }
			        					        ,{ name: 'codeNameEn', type: "string"  }
			        					        
			        					        ],
			        					        
			        					        proxy: {
			        					        	type: 'ajax',
			        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=EJECTING_HOLE',
			        					        	reader: {
			        					        		type:'json',
			        					        		root: 'datas',
			        					        		totalProperty: 'count',
			        					        		successProperty: 'success'
			        					        	}
			        				,autoLoad: false
			        					        }
			        				}),
			        				listConfig:{
			        					getInnerTpl: function(){
			        						return '<div data-qtip="{codeName}">{codeName}</div>';
			        					}			                	
			        				}
			        			},{
			        				fieldLabel: getColName('reserved_varchar22'),//'Sleeve',
			        				//emptyText: 	getColName('reserved_varchar22'),//'Sleeve',
			        				id:         'reserved_varchar22',
			        				name:       'reserved_varchar22',
			        				value:		reserved_varchar22
		        				}]
			        		}]
			        	},{
			        		xtype: 			'fieldset',//오른쪽 두번째 fieldset
			        		title:	 		'Cooling System(冷却系统)',
			        		collapsible: 	false,
			        		margins: 		'0 0 0 6',
			        		defaults: {
			        			labelWidth: 50,
			        			anchor: 	'100%',
			        			width: 		400,
			        			labelAlign: 'right'
			        		},
			        		items: [{
			        			xtype: 			'container',//오른쪽 두번째 container
			        			flex: 			1,
			        			layout: 		'anchor',
			        			defaultType:	'textfield',
			        			defaults: { labelWidth: 130, labelAlign: 'left', anchor:'95%'  },  
			        			items:[{
			        				afterLabelTextTpl: 	required,
			        				xtype:      		'combo',
			        				editable:      		true,typeAhead: true,
			        				mode:       		'local',
			        				displayField:   	'codeName' ,
			        				valueField:     	'codeName' ,
			        				fieldLabel: 		getColName('reserved_varchar23'),//'Coolant',
			        				//emptyText: 			getColName('reserved_varchar23'),//'Coolant',
			        				id:         		'reserved_varchar23',
			        				name:       		'reserved_varchar23',
			        				value:				reserved_varchar23,
			        				store: 				Ext.create('Ext.data.Store', {
			        					fields:[     
			        					        { name: 'systemCode', type: "string" }
			        					        ,{ name: 'codeName', type: "string"  }
			        					        ,{ name: 'codeNameEn', type: "string"  }
			        					        
			        					        ],
			        					        
			        					        proxy: {
			        					        	type: 'ajax',
			        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=COOLANT',
			        					        	reader: {
			        					        		type:'json',
			        					        		root: 'datas',
			        					        		totalProperty: 'count',
			        					        		successProperty: 'success'
			        					        	}
			        				,autoLoad: false
			        					        }
			        				}),
			        				listConfig:{
			        					getInnerTpl: function(){
			        						return '<div data-qtip="{codeName}">{codeName}</div>';
			        					}			                	
			        				}
			        			},{
			        				afterLabelTextTpl: 	required,
			        				xtype:      		'combo',
			        				editable:      		true,typeAhead: true,
			        				mode:       		'local',
			        				displayField:   	'codeName' ,
			        				valueField:     	'codeName' ,
			        				fieldLabel: 		getColName('reserved_varchar24'),//'Channel Diamater',
			        				//emptyText: 			getColName('reserved_varchar24'),//'Channel Diamater',
			        				id:         		'reserved_varchar24',
			        				name:       		'reserved_varchar24',
			        				value:				reserved_varchar24,
			        				store: 				Ext.create('Ext.data.Store', {
			        					fields:[     
			        					        { name: 'systemCode', type: "string" }
			        					        ,{ name: 'codeName', type: "string"  }
			        					        ,{ name: 'codeNameEn', type: "string"  }
			        					        
			        					        ],
			        					        
			        					        proxy: {
			        					        	type: 'ajax',
			        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=CHANNEL_DIAMETER',
			        					        	reader: {
			        					        		type:'json',
			        					        		root: 'datas',
			        					        		totalProperty: 'count',
			        					        		successProperty: 'success'
			        					        	}
			        				,autoLoad: false
			        					        }
			        				}),
			        				listConfig:{
			        					getInnerTpl: function(){
			        						return '<div data-qtip="{codeName}">{codeName}</div>';
			        					}			                	
			        				}
			        			},{
			        				xtype: 'fieldset',// Mipple fieldset
			        				title: 'Nipple(接头)',
			        				collapsible: false,
			        				defaults: {
			        					labelWidth: 50,
			        					anchor: 	'100%',
			        					labelAlign: 'left'
			        				},
			        				items: [{
			        					afterLabelTextTpl: 	required,
			        					xtype: 			'fieldcontainer',
			        					fieldLabel: 	getColName('reserved_varchar25'),//'Type',
//		        					id:				'reserved_varchar25',
//		        					name:			'reserved_varchar25',
			        					layout: 		'hbox',
			        					combineErrors: 	true,
			        					defaultType: 	'textfield',
			        					defaults: {
			        						hideLabel: 'true'
			        					},
			        					items: [{
			        						xtype:      		'combo',
			        						editable:      		true,typeAhead: true,
			        						mode:       		'local',
			        						displayField:   	'codeName' ,
			        						valueField:     	'codeName' ,
			        						width:				'100%',
			        						//emptyText: 			'Type',
			        						id:					'reserved_varchar25',
			        						name:				'reserved_varchar25',
			        						value:				reserved_varchar25,
//		        						id:         		'type',
//		        						name:       		'type',
			        						store: 				Ext.create('Ext.data.Store', {
			        							fields:[     
			        							        { name: 'systemCode', type: "string" }
			        							        ,{ name: 'codeName', type: "string"  }
			        							        ,{ name: 'codeNameEn', type: "string"  }
			        							        ],
			        							        proxy: {
			        							        	type: 'ajax',
			        							        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=TYPE',
			        							        	reader: {
			        							        		type:'json',
			        							        		root: 'datas',
			        							        		totalProperty: 'count',
			        							        		successProperty: 'success'
			        							        	}
			        						,autoLoad: false
			        							        }
			        						}),
			        						listConfig:{
			        							getInnerTpl: function(){
			        								return '<div data-qtip="{codeName}">{codeName}</div>';
			        							}			                	
			        						}
			        					}]
			        				},{
			        					afterLabelTextTpl: 	required,
			        					xtype: 			'fieldcontainer',
			        					fieldLabel: 	getColName('reserved_varchar26'),//'PT"',
//		        					id:				'reserved_varchar26',
//		        					name:			'reserved_varchar26',
			        					layout: 		'hbox',
			        					combineErrors: 	true,
			        					defaultType: 	'textfield',
			        					defaults: {
			        						hideLabel: 'true'
			        					},
			        					items: [{
			        						xtype:      		'combo',
			        						editable:      		true,typeAhead: true,
			        						mode:       		'local',
			        						displayField:   	'codeName' ,
			        						valueField:     	'codeName' ,
			        						width:				'100%',
			        						//emptyText: 			'PT',
			        						id:					'reserved_varchar26',
			        						name:				'reserved_varchar26',
			        						value:				reserved_varchar26,
//		        						id:         		'pt',
//		        						name:       		'pt',
			        						store: 				Ext.create('Ext.data.Store', {
			        							fields:[     
			        							        { name: 'systemCode', type: "string" }
			        							        ,{ name: 'codeName', type: "string"  }
			        							        ,{ name: 'codeNameEn', type: "string"  }
			        							        ],
			        							        proxy: {
			        							        	type: 'ajax',
			        							        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=PT',
			        							        	reader: {
			        							        		type:'json',
			        							        		root: 'datas',
			        							        		totalProperty: 'count',
			        							        		successProperty: 'success'
			        							        	}
			        						,autoLoad: false
			        							        }
			        						}),
			        						listConfig:{
			        							getInnerTpl: function(){
			        								return '<div data-qtip="{codeName}">{codeName}</div>';
			        							}			                	
			        						}
			        					}]
			        				}]
			        			},{
			        				xtype:      		'combo',
			        				editable:      		true,typeAhead: true,
			        				mode:       		'local',
			        				displayField:   	'codeName' ,
			        				valueField:     	'codeName' ,
			        				width:				'100%',
			        				fieldLabel: 		getColName('reserved_varchar27'),//'Mark in out at cooling',
			        				//emptyText: 			getColName('reserved_varchar27'),//'Mark in out at cooling',
			        				id:         		'reserved_varchar27',
			        				name:       		'reserved_varchar27',
			        				value:				reserved_varchar27,
			        				store: 		Ext.create('Ext.data.Store', {
			        					fields:[     
			        					        { name: 'systemCode', type: "string" }
			        					        ,{ name: 'codeName', type: "string"  }
			        					        ,{ name: 'codeNameEn', type: "string"  }
			        					        
			        					        ],
			        					        
			        					        proxy: {
			        					        	type: 'ajax',
			        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=COOLING_NUMBER',
			        					        	reader: {
			        					        		type:'json',
			        					        		root: 'datas',
			        					        		totalProperty: 'count',
			        					        		successProperty: 'success'
			        					        	}
			        				,autoLoad: false
			        					        }
			        				}),
			        				listConfig:{
			        					getInnerTpl: function(){
			        						return '<div data-qtip="{codeName}">{codeName}</div>';
			        					}			                	
			        				}
			        			}]
			        		}]
			        	},{
			        		xtype: 			'fieldset',//오른쪽 세번째 fieldset
			        		title:	 		'Gas Vent(排气)',
			        		collapsible: 	false,
			        		margins: 		'237 0 0 -421',
			        		defaults: {
			        			labelWidth: 50,
			        			anchor: 	'100%',
			        			width: 		400,
			        			labelAlign: 'right'
			        		},
			        		items: [{
			        			xtype: 			'container',//오른쪽 세번째 container
			        			flex: 			1,
			        			layout: 		'anchor',
			        			defaultType:	'textfield',
			        			defaults: { labelWidth: 130, labelAlign: 'left', anchor:'95%'  },  
			        			items:[{
			        				fieldLabel: getColName('reserved_varchar28'),//'Core',
			        				//emptyText: 	getColName('reserved_varchar28'),//'Core',
			        				id:         'reserved_varchar28',
			        				name:       'reserved_varchar28',
			        				value:		reserved_varchar28
			        			},{
			        				fieldLabel: getColName('reserved_varchar29'),//'Parting Line',
			        				//emptyText: 	getColName('reserved_varchar29'),//'Parting Line',
			        				id:         'reserved_varchar29',
			        				name:       'reserved_varchar29',
			        				value:		reserved_varchar29
			        			},{
			        				fieldLabel: getColName('reserved_varchar30'),//'Hole',
			        				//emptyText: 	getColName('reserved_varchar30'),//'Hole',
			        				id:         'reserved_varchar30',
			        				name:       'reserved_varchar30',
			        				value:		reserved_varchar30
			        			}]
			        		}]
			        	}]
			        },{
			        	xtype: 'container',//세로 세번째
			        	layout:'hbox',
			        	items: [{
			        		xtype: 			'fieldset',//세로 세번째 fieldset
			        		title:	 		'Runner & Gate System(流道与浇口系统)',
			        		collapsible: 	false,
			        		defaults: {
			        			labelWidth: 50,
			        			anchor: 	'100%',
			        			width: 		400,
			        			labelAlign: 'right'
			        		},
			        		items: [{
			        			xtype: 			'container',//세로 세번째 container
			        			flex: 			1,
			        			layout: 		'anchor',
			        			defaultType:	'textfield',
			        			defaults: { labelWidth: 130, labelAlign: 'left', anchor:'95%'  },  
			        			items:[{
			        				afterLabelTextTpl: 	required,
			        				xtype:          	'combo',
			        				editable:      		true,typeAhead: true,
			        				mode:           	'local',
			        				displayField:   	'codeName' ,
			        				valueField:     	'codeName' ,
			        				fieldLabel:     	getColName('reserved_varchar31'),//'Runner Type',
			        				//emptyText: 			getColName('reserved_varchar31'),//'Ruuner Type',
			        				id:          		'reserved_varchar31',
			        				name:          		'reserved_varchar31',
			        				value:				reserved_varchar31,
			        				store: 				Ext.create('Ext.data.Store', {
			        					fields:[     
			        					        { name: 'systemCode', type: "string" }
			        					        ,{ name: 'codeName', type: "string"  }
			        					        ,{ name: 'codeNameEn', type: "string"  }
			        					        
			        					        ],
			        					        
			        					        proxy: {
			        					        	type: 'ajax',
			        					        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=RUNNER_TYPE',
			        					        	reader: {
			        					        		type:'json',
			        					        		root: 'datas',
			        					        		totalProperty: 'count',
			        					        		successProperty: 'success'
			        					        	}
			        				,autoLoad: false
			        					        }
			        				}),
			        				listConfig:{
			        					getInnerTpl: function(){
			        						return '<div data-qtip="{codeName}">{codeName}</div>';
			        					}			                	
			        				}
			        			},{
			        				afterLabelTextTpl: 	required,
			        				fieldLabel: 		getColName('reserved_varchar32'),//'Sqrue/LocateRing',
			        				//emptyText: 			getColName('reserved_varchar32'),//'Sqrue/LocateRing',
			        				id:         		'reserved_varchar32',
			        				name:       		'reserved_varchar32',
			        				value:				reserved_varchar32
			        			},{
			        				xtype: 'fieldset',// Gate fieldset
			        				title: 'Gate(浇口)',
			        				collapsible: false,
			        				defaultType:	'textfield',
			        				defaults: {
			        					labelWidth: 70,
			        					anchor: 	'100%',
			        					width: 		400,
			        					labelAlign: 'left'
			        				},
			        				items: [{
			        					afterLabelTextTpl: 	required,
			        					xtype:          	'combo',
			        					editable:      		true,typeAhead: true,
			        					mode:           	'local',
			        					displayField:   	'codeName' ,
			        					valueField:     	'codeName' ,
			        					fieldLabel:     	getColName('reserved_varchar33'),//'Type',
			        					//emptyText: 			getColName('reserved_varchar33'),//'Type',
			        					id:          		'reserved_varchar33',
			        					name:          		'reserved_varchar33',
			        					value:				reserved_varchar33,
			        					store: 				Ext.create('Ext.data.Store', {
			        						fields:[     
			        						        { name: 'systemCode', type: "string" }
			        						        ,{ name: 'codeName', type: "string"  }
			        						        ,{ name: 'codeNameEn', type: "string"  }
			        						        
			        						        ],
			        						        
			        						        proxy: {
			        						        	type: 'ajax',
			        						        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=GATE',
			        						        	reader: {
			        						        		type:'json',
			        						        		root: 'datas',
			        						        		totalProperty: 'count',
			        						        		successProperty: 'success'
			        						        	}
			        					,autoLoad: false
			        						        }
			        					}),
			        					listConfig:{
			        						getInnerTpl: function(){
			        							return '<div data-qtip="{codeName}">{codeName}</div>';
			        						}			                	
			        					}
			        				},{
			        					afterLabelTextTpl: 	required,
			        					fieldLabel: 		getColName('reserved_varchar34'),//'Qty',
			        					//emptyText: 			getColName('reserved_varchar34'),//'Qty',
			        					id:         		'reserved_varchar34',
			        					name:       		'reserved_varchar34',
			        					value:				reserved_varchar34
			        				}]
			        			},{
			        				xtype: 			'fieldset',// Cold Runner fieldset
			        				title: 			'Cold Runner(冷流道)',
			        				collapsible:	false,
			        				defaultType:	'textfield',
			        				defaults: {
			        					labelWidth: 70,
			        					anchor: 	'100%',
			        					width: 		400,
			        					labelAlign: 'left'
			        				},
			        				items: [{
			        					xtype:          'combo',
			        					editable:      	false,
			        					mode:           'local',
			        					displayField:   'codeName' ,
			        					valueField:     'codeName' ,
			        					fieldLabel:     getColName('reserved_varchar35'),//'Runner Selection',
			        					//emptyText: 		getColName('reserved_varchar35'),//'Runner Selection',
			        					id:          	'reserved_varchar35',
			        					name:          	'reserved_varchar35',
			        					value:			reserved_varchar35,
			        					store: 			Ext.create('Ext.data.Store', {
			        						fields:[     
			        						        { name: 'systemCode', type: "string" }
			        						        ,{ name: 'codeName', type: "string"  }
			        						        ,{ name: 'codeNameEn', type: "string"  }
			        						        
			        						        ],
			        						        proxy: {
			        						        	type: 'ajax',
			        						        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=COLD_RUNNER',
			        						        	reader: {
			        						        		type:'json',
			        						        		root: 'datas',
			        						        		totalProperty: 'count',
			        						        		successProperty: 'success'
			        						        	}
			        					,autoLoad: false
			        						        }
			        					}),
			        					listConfig:{
			        						getInnerTpl: function(){
			        							return '<div data-qtip="{codeName}">{codeName}</div>';
			        						}			                	
			        					}
			        				}]
			        			},{
			        				xtype: 			'fieldset',// Hot Runner fieldset
			        				title: 			'Hot Runner(热流道)',
			        				collapsible: 	false,
			        				defaultType:	'textfield',
			        				defaults: {
			        					labelWidth: 70,
			        					anchor: 	'100%',
			        					width: 		400,
			        					labelAlign: 'left'
			        				},
			        				items: [{
			        					afterLabelTextTpl: 	required,
			        					fieldLabel:     	getColName('reserved_varchar36'),//'Maker',
			        					//emptyText: 			getColName('reserved_varchar36'),//'Maker',
			        					id:          		'reserved_varchar36',
			        					name:          		'reserved_varchar36',
			        					value:				reserved_varchar36
			        				},{
//        				xtype:          	'combo',
//        				mode:           	'local',
			        					afterLabelTextTpl: 	required,
			        					fieldLabel:     	getColName('reserved_varchar37'),//'Type',
			        					//emptyText: 			getColName('reserved_varchar37'),//'Type',
			        					id:          		'reserved_varchar37',
			        					name:          		'reserved_varchar37',
			        					value:				reserved_varchar37
			        				},{
//        				xtype:          	'combo',
//        				mode:           	'local',
			        					fieldLabel:     	getColName('reserved_varchar38'),//'Nozzle Type',
			        					//emptyText: 			getColName('reserved_varchar38'),//'Nozzle Type',
			        					id:          		'reserved_varchar38',
			        					name:          		'reserved_varchar38',
			        					value:				reserved_varchar38
			        				},{
			        					afterLabelTextTpl: 	required,
			        					fieldLabel: 		getColName('reserved_varchar39'),//'Qty of Value',
			        					//emptyText: 			getColName('reserved_varchar39'),//'Qty of Value',
			        					id:         		'reserved_varchar39',
			        					name:       		'reserved_varchar39',
			        					value:				reserved_varchar39
			        				},{
			        					afterLabelTextTpl: 	required,
			        					fieldLabel: 		getColName('reserved_varchar40'),//'Gate Diameter',
			        					//emptyText: 			getColName('reserved_varchar40'),//'Gate Diameter',
			        					id:         		'reserved_varchar40',
			        					name:       		'reserved_varchar40',
			        					value:				reserved_varchar40
			        				}]
			        			}]
			        		}]
			        	},{
			        		xtype: 'container',//세로 두번째
			        		layout:'hbox',
			        		items: [{
			        			xtype: 			'fieldset',//오른쪽 네번째 fieldset
			        			title:	 		'Etc',
			        			margins: 		'0 0 0 6',
			        			collapsible: 	false,
			        			defaults: {
			        				labelWidth: 50,
			        				anchor: 	'100%',
			        				width: 		400,
			        				labelAlign: 'right'
			        			},
			        			items: [{
			        				xtype: 			'container',//오른쪽 네번째 container
			        				flex: 			1,
			        				layout: 		'anchor',
			        				defaultType:	'textfield',
			        				defaults: { labelWidth: 130, labelAlign: 'left', anchor:'95%'  },  
			        				items:[{
			        					id:			'reserved_varchar41',
			        					name: 		'reserved_varchar41',
			        					value:		reserved_varchar41,
			        					//emptyText: 	getColName('reserved_varchar41'),//'Shot Counter',
			        					fieldLabel: getColName('reserved_varchar41')//'Shot Counter',	
			        				},{
			        					xtype:          'combo',
			        					editable:      	false,
			        					mode:           'local',
			        					id:				'reserved_varchar42',
			        					name: 			'reserved_varchar42',
			        					value:			reserved_varchar42,
			        					displayField:   'codeName' ,
			        					valueField:     'codeName' ,
			        					//emptyText: 	getColName('reserved_varchar42'),//'Name Plate(SEC Std.)',
			        					fieldLabel: getColName('reserved_varchar42'),//'Name Plate(SEC Std.)'
			        					store: 			Ext.create('Ext.data.Store', {
			        						fields:[     
			        						        { name: 'systemCode', type: "string" }
			        						        ,{ name: 'codeName', type: "string"  }
			        						        ,{ name: 'codeNameEn', type: "string"  }
			        						        
			        						        ],
			        						        proxy: {
			        						        	type: 'ajax',
			        						        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=NAME_PLATE',
			        						        	reader: {
			        						        		type:'json',
			        						        		root: 'datas',
			        						        		totalProperty: 'count',
			        						        		successProperty: 'success'
			        						        	}
			        					,autoLoad: false
			        						        }
			        					}),
			        					listConfig:{
			        						getInnerTpl: function(){
			        							return '<div data-qtip="{codeName}">{codeName}</div>';
			        						}			                	
			        					}
			        				},{
			        					xtype:          	'combo',
			        					editable:      		true,typeAhead: true,
			        					mode:           	'local',
			        					id:			'reserved_varchar43',
			        					name: 		'reserved_varchar43',
			        					value:		reserved_varchar43,
			        					displayField:   'codeName' ,
			        					valueField:     'codeName' ,
			        					//emptyText: 	getColName('reserved_varchar43'),//'Eject Plate Forced Return',
			        					fieldLabel: getColName('reserved_varchar43'),//'Eject Plate Forced Return'
			        					store: 			Ext.create('Ext.data.Store', {
			        						fields:[     
			        						        { name: 'systemCode', type: "string" }
			        						        ,{ name: 'codeName', type: "string"  }
			        						        ,{ name: 'codeNameEn', type: "string"  }
			        						        
			        						        ],
			        						        proxy: {
			        						        	type: 'ajax',
			        						        	url: CONTEXT_PATH + '/code.do?method=read&parentCode=EJECT_PLATE_FORCED_RETURN',
			        						        	reader: {
			        						        		type:'json',
			        						        		root: 'datas',
			        						        		totalProperty: 'count',
			        						        		successProperty: 'success'
			        						        	}
			        					,autoLoad: false
			        						        }
			        					}),
			        					listConfig:{
			        						getInnerTpl: function(){
			        							return '<div data-qtip="{codeName}">{codeName}</div>';
			        						}			                	
			        					}
			        				},{
			        					id:			'reserved_varchar44',
			        					name: 		'reserved_varchar44',
			        					value:		reserved_varchar44,
			        					//emptyText: 	getColName('reserved_varchar44'),//'DLC',
			        					fieldLabel: getColName('reserved_varchar44')//'DLC'
			        				},{
			        					id:			'reserved_varchar45',
			        					name: 		'reserved_varchar45',
			        					value:		reserved_varchar45,
			        					//emptyText: 	getColName('reserved_varchar45'),//'Side Straight&P/L Block',
			        					fieldLabel: getColName('reserved_varchar45')//'Side Straight&P/L Block'
			        				}]
			        			}]
			        		}]
//        },{
//            xtype: 			'fieldset',//오른쪽 네번째 fieldset
//        	title:	 		'Remarks',
//        	collapsible: 	false,
//        	margins: 		'200 0 0 -421',
//        	defaults: {
//        		labelWidth: 50,
//        		anchor: 	'100%',
//        		width: 		400,
//        		labelAlign: 'right'
//        	},
//        	items: [{
//        		xtype: 			'container',//오른쪽 네번째 container
//        		flex: 			1,
//        		layout: 		'anchor',
//        		defaults: { labelWidth: 130, labelAlign: 'left', anchor:'95%'  },  
//        		items:[{
//        			xtype:          'textarea',
//					id:          	'remarks',
//					name:          	'remarks'
//        		}]
//        	}]
		        	}]
            }]
    });
	
	
	
	
	return form;
}

var viewHandler = function() {
 	var rec = grid.getSelectionModel().getSelection();
 	var unique_id = rec[0].get('unique_id');
 	var spec_cnt = rec[0].get('spec_cnt');
 	var recSize = rec.length;
 	if(recSize==1){
 		if(spec_cnt<1){
 		Ext.MessageBox.alert(error_msg_prompt, 'Don not have Mold Specifications');
	 	}else{
	 		MainSpec.load(unique_id ,{
	 			success: function(mainspec) {
	 				var win = Ext.create('ModalWindow', {
	 					title: CMD_VIEW  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
	 					width: 890,
	 					height: 610,//480,
	 					minWidth: 250,
	 					minHeight: 180,
	 					layout: 'fit',
	 					plain:true,
	 					items: createViewForm(mainspec),
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
	 			}//endofsuccess
	 		});//emdofload
	 	}
 	}else{
 		Ext.MessageBox.alert(error_msg_prompt,'Just Only one clicks');
 	}
 };
 
 var editHandler = function() {
	 var rec = grid.getSelectionModel().getSelection();
	 	var unique_id = rec[0].get('unique_id');
	 	var spec_cnt = rec[0].get('spec_cnt');
	 	var recSize = rec.length;
	 	if(recSize==1){
	 		if(spec_cnt<1){
	 		Ext.MessageBox.alert(error_msg_prompt, 'Don not have Mold Specifications');
		 	}else{
		 		MainSpec.load(unique_id ,{
		 			success: function(mainspec) {
		 				var win = Ext.create('ModalWindow', {
		 					title: CMD_MODIFY  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
		 					width: 890,
		 					height: 610,//480,
		 					minWidth: 250,
		 					minHeight: 180,
		 					layout: 'fit',
		 					plain:true,
		 					items: createEditForm(mainspec),
		 					buttons: [{
		 						text: CMD_OK,
		 						handler: function(){
		 							var sizeValue = Ext.getCmp('reserved_varchar15').getValue();
		    						var materialValue = Ext.getCmp('material1').getValue();
		    						var makerValue = Ext.getCmp('maker1').getValue();
		    						var sumValue = sizeValue+','+materialValue+','+makerValue;
		    						console_log(sumValue);
		    						Ext.getCmp('reserved_varchar15').setValue(sumValue);
		    						var sizeValue1 = Ext.getCmp('reserved_varchar16').getValue();
		    						var materialValue1 =  Ext.getCmp('material2').getValue();
		    						var hardnessValue1 =  Ext.getCmp('hardness').getValue();
		    						var sumValue1 = sizeValue1+','+materialValue1+','+hardnessValue1;
		    						Ext.getCmp('reserved_varchar16').setValue(sumValue1);
		    						
		    						var sizeValue2 = Ext.getCmp('reserved_varchar17').getValue();
		    						var materialValue2 = Ext.getCmp('material3').getValue();
		    						var hardnessValue2 = Ext.getCmp('hardness1').getValue();
		    						var sumValue2 = sizeValue2+','+materialValue2+','+hardnessValue2;
		    						Ext.getCmp('reserved_varchar17').setValue(sumValue2);
		    						
		 							var form = Ext.getCmp('formPanel').getForm();
		 							if(form.isValid())
		 							{
		 								var val = form.getValues(false);
		 								var mainspec = Ext.ModelManager.create(val, 'MainSpec');
		 								//저장 수정
		 								mainspec.save({
		 									success : function() {
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
		 							if(win) {win.close();} 
		 						}
		 					}]
		 				});
		 				win.show();
		 			}
		 		});//emdofload
		 	}
	 	}
};

//Define Edit Action
var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});

var detailAction  = Ext.create('Ext.Action', {
	itemId: 'detailButton',
    iconCls: 'application_view_detail',
    text: detail_text,
    disabled: true,
    handler: viewHandler
});

var editAction = Ext.create('Ext.Action', {
	itemId: 'editButton',
    iconCls: 'pencil',
    text: edit_text,
    disabled: true ,
    handler: editHandler
});


//Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ detailAction, editAction, addAction]
});

var searchField = [];

Ext.onReady(function() {  
	LoadJs('/js/util/buyerStore.js');
	LoadJs('/js/util/itemStore.js');
	//ProjectMold Store 정의
	Ext.define('ProjectMold', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/sales/poreceipt.do?method=read&menu_code='+vCUR_MENU_CODE, /*1recoed, search by cond, search */
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
	
	Ext.define('MainSpec', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS,
	   	    proxy: {
					type: 'ajax',
			        api: {
			            read: CONTEXT_PATH + '/sales/poreceipt.do?method=readmainspec', 
			            create: CONTEXT_PATH + '/sales/poreceipt.do?method=createmainspec'
//			            update: CONTEXT_PATH + '/sales/poreceipt.do?method=update',
//			            destroy: CONTEXT_PATH + '/sales/poreceipt.do?method=destroy' /*delete*/
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
	
	mainspec_store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'MainSpec',
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});

 	store.load(function() {
 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
			grid = Ext.create('Ext.grid.Panel', {
			        store: store,
			        collapsible: true,
			        multiSelect: true,
			        stateId: 'stateGrid',
			        selModel: selModel,
			        autoScroll : true,
			        autoHeight: true,
			        height: getCenterPanelHeight(),
			     // paging bar on the bottom
			        
			        bbar: getPageToolbar(store),
			        
			        dockedItems: [{
			            dock: 'top',
			            xtype: 'toolbar',
			            items: [detailAction, '-' , editAction,'-', addAction]
			        }],
			        columns: /*(G)*/vCENTER_COLUMNS,
			        viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
			            listeners: {
			            	'afterrender' : function(grid) {
								var elments = Ext.select(".x-column-header",true);//.x-grid3-hd
								elments.each(function(el) {
											}, this);
								},
			                itemcontextmenu: function(view, rec, node, index, e) {
			                    e.stopEvent();
			                    contextMenu.showAt(e.getXY());
			                    return false;
			                },
			                itemdblclick: viewHandler
			            }
			        },
			        title: getMenuTitle()
			    });
			fLAYOUT_CONTENT(grid);
			
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		        	var rec = grid.getSelectionModel().getSelection()[0];
		        	
		            if (selections.length) {
						//grid info 켜기
						displayProperty(selections[0]);
						var spec_cnt = rec.get('spec_cnt');
						if(fPERM_DISABLING()==true) {
			            	addAction.disable();
			            	detailAction.disable();
			            	editAction.disable();
						}else{
							if(spec_cnt==0){
								detailAction.disable();
								editAction.disable();
							}else{
								editAction.enable();
								detailAction.enable();
							}
			            	addAction.enable(); 
						}
						
		            } else {
		            	if(fPERM_DISABLING()==true) {
			            	collapseProperty();//uncheck no displayProperty
			            	addAction.disable(); 
			            	detailAction.disable();
			            	editAction.disable();
		            	}else{
		            		collapseProperty();//uncheck no displayProperty
			            	addAction.disable(); 
			            	detailAction.disable();
			            	editAction.disable();
		            	}
		            }
		           
		        }
		    });
		    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
		        Ext.create('Ext.tip.ToolTip', config);
		    });
		cenerFinishCallback();//Load Ok Finish Callback
	}); //store load
});	//OnReady
