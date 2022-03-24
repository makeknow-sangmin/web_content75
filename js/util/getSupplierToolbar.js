console_log('loading getSupplierToolbar in util....');
function getSupplierToolbar() {

	var SupastStore = Ext.create('Mplm.store.SupastStore', {hasNull: false, hasOwn:true} );
	
	var arrSupastToolbar = [];
	var arrSupastCombo = [];
	var arrStautsCombo = [];
	var GenCodeStore  = Ext.create('Mplm.store.GenCodeStore', {hasNull: true, gubunType: 'PPO1_STATUS'} );
	arrStautsCombo.push(
			{
				id :'status',
				name:           'status',
				xtype:          'combo',
				mode:           'local',
				triggerAction:  'all',
				editable:       false,
				width: 80,
//                emptyText:  pms1_gubun,
				//value: ppo1_CTstatus,
				displayField:   'codeName',
				valueField:     'systemCode',
				fieldStyle: 'background-color: #FBF8E6; background-image: none;',
				queryMode: 'remote',
				value: '-미지정-',
				store:GenCodeStore,
				listConfig:{
					getInnerTpl: function(){
						return '<div data-qtip="{systemCode}">{codeName}</div>';
					}			                	
				},
				listeners: {
					select: function (combo, record) {
						var status = Ext.getCmp('status').getValue();
						var supplier_combo = Ext.getCmp('supplier_information');
						var supplier_name_combo = Ext.getCmp('sp_srchSupplier_name');
						if(status == '-1'){
							status = null;
						}
						if(status != 'CT'){
							//supplier_combo.setDisabled(false);
							isCTStatus = false;
						}else{
							//supplier_combo.setDisabled(true);
							supplier_combo.clearValue();//text필드에 있는 name 삭제
							supplier_name_combo.reset();//text필드에 있는 name 삭제
							isCTStatus = true;
						}
						
						store.getProxy().setExtraParam('status', status);
						store.load(function(){
						});
					}//endofselect
				}
			}
	);
	arrSupastCombo.push(
			{
				id :'supplier_information',
				field_id :'supplier_information',
		        name : 'supplier_information',
		        xtype: 'combo',
		        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
		        store: SupastStore,
//		        emptyText:   'Supplier Name', //getColName('buyer_name'),
		        displayField:   'supplier_name',
		        valueField:   'supplier_name',
		        sortInfo: { field: 'create_date', direction: 'DESC' },
		        typeAhead: false,
		        hideLabel: true,
		        //disabled: true,
		        minChars: 1,
		        //hideTrigger:true,
		        width: 200,
		        minChars: 1,
		        listConfig:{
		            loadingText: '검색중...',
		            emptyText: '일치하는 항목 없음.',
		            // Custom rendering template for each item
		            getInnerTpl: function() {
		                return '<div data-qtip="{unique_id}">{supplier_name}</div>';
		            }			                	
		        },
		        listeners: {
		        	select: function (combo, record) {
		        		console_logs('Selected Value : ' + combo.getValue());
		        		
		        		var unique_id = record[0].get('unique_id');
	        			var supplier_name = record[0].get('supplier_name');
	        			var sales_person1_name = record[0].get('sales_person1_name');
	        			var sales_person1_telephone_no = record[0].get('sales_person1_telephone_no');
	        			var sales_person1_fax_no = record[0].get('sales_person1_fax_no');
	        			var sales_person1_mobilephone_no = record[0].get('sales_person1_mobilephone_no');
	        			var sales_person1_email_address = record[0].get('sales_person1_email_address');
	        			var address_1 = record[0].get('address_1');
		 				
	        			selectedSupast = record[0];
	        			
	        			selectedSupplierHandler(selectedSupast);

		 				Ext.getCmp('sp_srchSupplier_uid').setValue(unique_id);
		 				Ext.getCmp('sp_srchSupplier_name').setValue(supplier_name+' : '+sales_person1_name+' : '+sales_person1_mobilephone_no+' : '+sales_person1_email_address);
		 				
		 				checkAction();
		        }//endofselect
				,afterrender: function(combo) {
			    	callbackToolbarRenderrer('CommonSupplier', 'not-use', combo);
			    }
		        }
			});
	
	arrSupastToolbar.push(
			{
				xtype: 'buttongroup',
				title: pms1_gubun,
	            columns: 2,
	            defaults: {
	                scale: 'small'
	            },
	            items: arrStautsCombo
	        }
	);
	
	arrSupastToolbar.push(
			{
				xtype: 'buttongroup',
				title: ppo1_supplier,
	            columns: 2,
	            defaults: {
	                scale: 'small'
	            },
	            items: arrSupastCombo
	        }
	);
			
	arrSupastToolbar.push(
			{
        xtype: 'hiddenfield',
		id :'sp_srchSupplier_uid',
        name : 'sp_srchSupplier_uid'
			}
	);
	
	arrSupastToolbar.push(
			{
				xtype: 'buttongroup',
		        title: ppo1_supplier_information,
		        columns: 2,
		        defaults: {
		            scale: 'small'
		        },
		        items: [{
					fieldLabel: '',
			        //labelWidth: 70,
			        width: 420,
			        xtype: 'textfield',
					id :'sp_srchSupplier_name',
			        name : 'sp_srchSupplier_name',
//			        emptyText:  disSupplier_name,
			        labelSeparator: '',
			        readOnly: true,
			 		fieldStyle: 'background-color: #E7EEF6; background-image: none;',
			        //enableKeyEvents: true,
			        listeners: {
			            expand: function(){
			               // fromPicker = true;
			            },
			            collapse: function(){
			             //   fromPicker = false;  
			            },
			            change: function(d, newVal, oldVal) {
			//                if (fromPicker || !d.isVisible()) {
			//                    showDate(d, newVal);
			//                }
			            },
			            keypress: {
			                buffer: 500,
			                fn: function(field){
			                    var value = field.getValue();
			                    if (value !== null && field.isValid()) {
			                       // showDate(field, value);
			                    }
			                }
			            }
			        }
		        }
			]}
	);
	
	return arrSupastToolbar;
}