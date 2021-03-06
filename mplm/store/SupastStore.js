/**
 * Supast Store
 */
//console_log('loading Mplm.store.SupastStore....');
Ext.define('Mplm.store.SupastStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	hasNull: params.hasNull,
        	hasOwn: params.hasOwn,
        	comboType: params.comboType,
        	supplierType: params.supplierType,
			pcs_code: params.pcs_code,
			pageSize: params.pageSize,
        });

    },
    fields: [     
     		{ name: 'unique_id', type: "string" }
     		,{ name: 'address', type: "string"  }
     		,{ name: 'sales_person1_name', type: "string"  }
     		,{ name: 'sales_person1_telephone_no', type: "string"  }
     		,{ name: 'sales_person1_fax_no', type: "string"  }
     		,{ name: 'sales_person1_mobilephone_no', type: "string"  }
     		,{ name: 'sales_person1_email_address', type: "string"  }
     		,{ name: 'address_1', type: "string"  }
     		,{ name: 'president_name', type: "string"  }
     		,{ name: 'supplier_name', type: "string"  }
     		,{ name: 'supplier_code', type: "string"  }
     		,{ name: 'maker_code', type: "string"  }
     		,{ name: 'maker_name', type: "string"  }
     		,{ name: 'area_code', type: "string"  }
     		,{ name: 'pcs_code01', type: "string"  }
     		,{ name: 'pcs_code02', type: "string"  }
     		,{ name: 'pcs_code03', type: "string"  }
     		,{ name: 'pcs_code04', type: "string"  }
			,{ name: 'pcs_code05', type: "string"  }
			,{ name: 'seller_code', type: "string"}			 
			,{ name: 'sms_cnt', type: "number"}
			,{ name: 'telephone_no', type: "string"}		
     	  	  ],
 	sorters: [{
         property: 'supplier_name',
         direction: 'ASC'
     }],
     cmpName: 'supUid',
     queryMode: 'remote',
     pageSize: 200,
     hasNull: false,
     hasOwn: false,
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/purchase/request.do?method=simpleSupplier',
         reader: {
         	type:'json',
             root: 'datas',
             totalProperty: 'count',
             successProperty: 'success'
         }
         ,autoLoad: true
     },
     listeners: {
			
			load: function(store, records, successful,operation, options) {
				//console_logs("supast records  ", records);
				if(this.hasNull) {
					
					var blank ={
							//unique_id: -1,
							supplier_name: 'DABP',
							sales_person1_name: '',
							sales_person1_mobilephone_no: '',
							sales_person1_email_address: '',
							address_1: '',
							supplier_code: ''
					};
						
						this.add(blank);
				} else if(this.hasOwn) {
					
					var blank ={
							//unique_id: -1,
							supplier_name: '(-??????-)',
							sales_person1_name: '',
							sales_person1_mobilephone_no: '',
							sales_person1_email_address: '',
							address_1: '',
							supplier_code: '' 
						};
						
					try {
						this.add(blank);
					} catch(e) {
						console_logs('supast load this.hasOwn', e);
					}
						
				}

			},//endofload
			beforeload: function(){

				/**
				 * !!! ?????? ????????? ????????? ?????? ????????? ????????? view ???????????? store ?????? ??? ???????????? ?????????.
				 * 
				 */

				//this.getProxy().setExtraParam('pcs_code', this.pcs_code);

	// 			if(this.comboType == 'outstore'){
	// 				// P : ??????????????????, V : ???????????????
	// 				// ???????????? ?????? ??????????????? supplier_type ??? O??? ??????.
	// 				this.getProxy().setExtraParam('supplier_type', 'P');
					
	// 				var obj = Ext.getCmp('delivery_address_1'); 
					
	// 				if(obj!=null) {
	// 					var val = obj.getValue();
						
	// 					if(val!=null) {
	// 						var enValue = Ext.JSON.encode(val);
							
	// 						this.getProxy().setExtraParam('queryUtf8', enValue);
	// 					}else {
	// 						this.getProxy().setExtraParam('queryUtf8', '');
	// 					}
	// 				}
	// 			}else if(this.comboType == 'standard'){
	// 				if(this.supplierType == 'O'){
	// 					this.getProxy().setExtraParam('supplier_type', 'O');
	// 				}else if(this.supplierType == 'K'){
	// 					this.getProxy().setExtraParam('supplier_type', 'K');
	// 				}else{
	// 					this.getProxy().setExtraParam('supplier_type', 'R');
	// 				}
						
					
					
	// 				var obj = Ext.getCmp('supplier_information'); 
	// 				console_logs(obj);
	// 				if(obj!=null) {
	// 					var val = obj.getValue();
	// 					console_log(val);
	// 					if(val!=null) {
	// 						var enValue = Ext.JSON.encode(val);
	// 						console_log("queryUtf8:"+enValue);
	// 						this.getProxy().setExtraParam('queryUtf8', enValue);
	// 					}else {
	// 						this.getProxy().setExtraParam('queryUtf8', '');
	// 					}
	// 				}
					
					
					
	// 			}else{
	// 				console_logs('Mplm.store.SupastStore beforeload');
	// //				console_log(this.cmpName);
	// 				var obj = Ext.getCmp('supplier_information'); 
	// 				console_log('else???', obj);
	// 				if(obj!=null) {
	// 					console_logs('supast beforeload', obj);
	// 					var val = obj.getValue();
	// 					console_log(val);
	// 					if(val!=null) {
	// 						var enValue = Ext.JSON.encode(val);
	// 						console_log("queryUtf8:"+enValue);
	// 						this.getProxy().setExtraParam('queryUtf8', enValue);
	// 					}else {
	// 						this.getProxy().setExtraParam('queryUtf8', '');
	// 					}
	// 				} else {
	// 					console_logs('supast beforeload', 'obj is null');
	// 				}
										
	// 				if(this.supplierType!=null){
	// 					this.getProxy().setExtraParam('supplier_type', this.supplierType);
	// 				}
	// 			}
			}
		}//endoflistner
});