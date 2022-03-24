console_log('loading eleGubunToolbar in util....');
function ELEGubunToolbar() {
	var store_name = '';
	if(vCUR_MENU_CODE== 'EPJ1'){
		store_name = storeCartLine;
	}else{
		store_name = store;
	}
	var arreleGubunCombo = [];
	if(vCUR_MENU_CODE== 'EPJ1'){
		var IsEPJ1ComplishedStore  = Ext.create('Mplm.store.IsEPJ1ComplishedStore', {hasNull: false} );
		arreleGubunCombo.push(
				{
					id :'status',
					name:           'status',
					xtype:          'combo',
					mode:           'local',
					triggerAction:  'all',
					forceSelection: true,
//					editable:       false,
//					allowBlank: false,
					emptyText:  sro1_order_status,
					displayField:   'codeName',
					valueField:     'systemCode',
					fieldStyle: 'background-color: #FBF8E6; background-image: none;',
					queryMode: 'remote',
					store: IsEPJ1ComplishedStore,
					listConfig:{
						getInnerTpl: function(){
							return '<div data-qtip="{systemCode}">{codeName}</div>';
						}			                	
					},
					listeners: {
						select: function (combo, record) {
							var isComplished = Ext.getCmp('status').getValue();
							storeCartLine.getProxy().setExtraParam('status', isComplished);
							storeCartLine.load({});
						}//endofselect
					}
				}
		);
		arreleGubunCombo.push('-');
	}
	
	
	arreleGubunCombo.push(
			{
				xtype:          'combo',
                mode:           'local',
                triggerAction:  'all',
//                editable:       false,
//                allowBlank: false,1
                name:           'gubun',
                id:				'gubun',
                displayField:   'name',
                valueField:     'value',
                queryMode: 'local',
                emptyText: pms1_gubun,
                width: 120,
                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                store:          Ext.create('Ext.data.Store', {
                    fields : ['name', 'value'],
                    data   : [
                        {name : '*',   value: '%'}
                        ,{name : pms1_process,   value: 'N'}
                        ,{name : pms1_electrode,   value: 'E'}
                    ]
                }),
            	listeners: {
            		select: function (combo, record) {
            			var standard_flag = Ext.getCmp('gubun').getValue();
            			if(standard_flag == 'N'){
            				if(vCUR_MENU_CODE== 'EPJ1'){
            					store_name.getProxy().setExtraParam('not_standard_flag', 'E');
            				}else{
            					store_name.getProxy().setExtraParam('not_standard_flag', 'A');
            					store_name.getProxy().setExtraParam('ele_standard_flag', 'E');
            				}
            				store_name.getProxy().setExtraParam('standard_flag', '');
            			}else{
            				store_name.getProxy().setExtraParam('standard_flag', standard_flag);
            				store_name.getProxy().setExtraParam('not_standard_flag', 'A');
            				store_name.getProxy().setExtraParam('ele_standard_flag', '');
            			}
        				store_name.load({});
            		}//endofselect
            	}
			}
	);
	
	if(vCUR_MENU_CODE== 'EPC1'){
		arreleGubunCombo.push('-');
		arreleGubunCombo.push(
				{
				        	xtype:          'combo',
			                mode:           'local',
			                triggerAction:  'all',
	//		                editable:       false,
	//		                allowBlank: false,1
			                name:           'status_full',
			                id:				'status_full',
			                displayField:   'name',
			                valueField:     'value',
			                queryMode: 'local',
			                emptyText: '零件状态',
			                width: 120,
			                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			                store:          Ext.create('Ext.data.Store', {
			                    fields : ['name', 'value'],
			                    data   : [
			                        {name : '*',   value: '%'}
			                        ,{name : epc1_wait_create_workorder,   value: 'OCR'}
			                        ,{name : epc1_wait_purcahse,   value: 'PCR'}
			                        ,{name : epc1_created_workorder,   value: 'OPO'}
			                    ]
			                }),
			               	listeners: {
			            		select: function (combo, record) {
			            			var status_full = Ext.getCmp('status_full').getValue();
			            			store_name.getProxy().setExtraParam('status_full', status_full);
			        				store_name.load({});
			            		}//endofselect
			            	}
				        }
		);
		
		arreleGubunCombo.push('-'); 
		arreleGubunCombo.push(
	         {
            	fieldLabel: epc1_doc_name,
              	labelWidth: 70,
            	width: 180,
            	labelSeparator: ':',
            	xtype: 'textfield',
            	id : 'pl_no',
            	name : 'pl_no',
             	listeners : {
					specialkey : function(field, e) {
                      var pl_no =	Ext.getCmp('pl_no').value;
                      store.getProxy().setExtraParam('pl_no', pl_no);
                      if (e.getKey() == Ext.EventObject.ENTER) {
		        			store.load(function(){});
                      } 
             		}
             	}
            });

		arreleGubunCombo.push('-'); 
//		arreleGubunCombo.push(
//            {
//            	fieldLabel: epc1_bom_type,
//              	labelWidth: 70,
//            	width: 180,
//            	labelSeparator: ':',
//            	xtype: 'textfield',
//            	id : 'standard_flag',
//            	name : 'standard_flag',
//             	listeners : {
//					specialkey : function(field, e) {
//                      var standard_flag =	Ext.getCmp('standard_flag').value;
//                      store.getProxy().setExtraParam('standard_flag', standard_flag);
//                      if (e.getKey() == Ext.EventObject.ENTER) {
//		        			store.load(function(){});
//                      } 
//             		}
//             	}
//            });
		    arreleGubunCombo.push(
				{
				        	xtype:          'combo',
			                mode:           'local',
			                triggerAction:  'all',
	//		                editable:       false,
	//		                allowBlank: false,1
			                name:           'standard_flag',
			                id:				'standard_flag',
			                displayField:   'name',
			                valueField:     'value',
			                queryMode: 'local',
			                emptyText: handler_part_status,
			                width: 120,
			                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			                store:          Ext.create('Ext.data.Store', {
			                    fields : ['name', 'value'],
			                    data   : [
			                        {name : '*',   value: '%'}
			                        ,{name : '订料下图',   value: 'R'}
			                        ,{name : '直接下图',   value: 'M'}
			                        ,{name : '内部标准',   value: 'S'}
			                        ,{name : '外部标准',   value: 'K'}
			                    ]
			                }),
			               	listeners: {
			            		select: function (combo, record) {
			            			var standard_flag = Ext.getCmp('standard_flag').getValue();
			            			 store.getProxy().setExtraParam('standard_flag', standard_flag);
			            			 store.load({});
			            		}//endofselect
			            	}
				        });
				
        
	}
	return arreleGubunCombo;
}