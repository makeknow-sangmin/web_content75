/**
 * ProjectStore Store
 */
Ext.define('Mplm.store.cloudProjectStorePrev', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		
		console_log('cloudProjectStore.initComponent');
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields:[     
	        { name: 'id', type: "int" },
	 	     { name: 'unique_id', type: "string" }
	 	     ,{ name: 'pj_code', type: "string"  }
	 	     ,{ name: 'pj_name', type: "string"  }
	 	     ,{ name: 'uid_srcahd', type: "string"  }
	 	     ,{ name: 'order_com_unique', type: "string"  }
	 	     ,{ name: 'description', type: "string"  }
	 	     ,{ name: 'total_cost', type: "string"  }
	 	     ,{ name: 'reserved_double5', type: "string"  }
	 	     //등록서
	 	     ,{ name: 'newmodcont', type: "string"  }
	 	     ,{ name: 'previouscont', type: "string"  }
	 	     ,{ name: 'selfdevelopment', type: "string"  }
	 	     ,{ name: 'wa_name', type: "string"  }
	 	     ,{ name: 'regist_date', type: "string"  }
	 	     ,{ name: 'selling_price', type: "string"  }
	 	     ,{ name: 'delivery_plan', type: "string"  }
	 	     ,{ name: 'reserved_timestamp1', type: "string"  }
	 	     ,{ name: 'end_plan', type: "string"  }
	 	     ,{ name: 'reserved_timestamp4', type: "string"  }
	 	     ,{ name: 'reserved_timestamp5', type: "string"  }
	 	     ,{ name: 'delivery_plan', type: "string"  }
	 	     ,{ name: 'reserved_timestamp7', type: "string"  }
	 	     ,{ name: 'reserved_timestamp8', type: "string"  }
	 	     ,{ name: 'reserved_double7', type: "string"  }
	 	     ,{ name: 'reserved_double8', type: "string"  }
	 	     ,{ name: 'reserved_double1', type: "string"  }
	 	     ,{ name: 'human_plan', type: "string"  }
	 	     ,{ name: 'reserved_double9', type: "string"  }
	 	     ,{ name: 'purchase_plan', type: "string"  }
	 	     ,{ name: 'reserved_doublec', type: "string"  }
	 	     ,{ name: 'reserved_doubled', type: "string"  }
	 	     ,{ name: 'total_cost_add', type: "string"  }
	 	     
	 	     //완료
	 	    ,{ name: 'total_cost_end', type: "string"  }
	 	    ,{ name: 'reserved_doublee', type: "string"  }
	 	    ,{ name: 'reserved_doubleb', type: "string"  }
	 	    ,{ name: 'reserved_doublea', type: "string"  }
	 	    ,{ name: 'purchase_cost', type: "string"  }
	 	    ,{ name: 'reserved_doublef', type: "string"  }
	 	    ,{ name: 'reserved_timestampa', type: "string"  }
	 	    ,{ name: 'reserved_timestamp9', type: "string"  }
	 	    ,{ name: 'delivery_date', type: "string"  }
	 	    ,{ name: 'reserved_timestamp3', type: "string"  }
	 	    ,{ name: 'reserved_timestamp6', type: "string"  }
	 	    ,{ name: 'reserved_timestampb', type: "string"  }
			,{ name: 'reserved_timestamp2', type: "string"  }
			,{ name: 'item_name', type: "string"  }
			,{ name: 'alter_item_code', type: "string"  }
	 	  ],
	 	 hasNull: false,
	 	sorters: [{
	        property: 'create_date',
	        direction: 'DESC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/sales/poreceipt.do?method=cloudbomquerySknh', /*1recoed, search by cond, search */
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: false
	     },
		listeners: {
	           select: function (combo, record) {
                	console_logs('Selected Value : ' + combo.getValue());
                	var pjuid = record[0].get('unique_id');
                	ac_uid = pjuid;
                	var pj_name  = record[0].get('pj_name');
                	var pj_code  = record[0].get('pj_code');

                	assy_pj_code ='';
                	selectedAssyCode = '';
                	selectedPjCode = pj_code;
                	selectedPjName = pj_name;
                	selectedPjUid = pjuid;
                	
                	puchaseReqTitle = '[' + pj_code + '] ' + pj_name;
           	 
                	srchTreeHandler (pjTreeGrid, cloudProjectTreeStore, 'projectcombo', 'pjuid', true);
                	store.removeAll();
                	unselectAssy();
                	//Default Set
	 				Ext.Ajax.request({
	 					url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',			
	 					params:{
	 						paramName : 'CommonProjectAssy',
	 						paramValue : pjuid + ';' + '-1'
	 					},
	 					
	 					success : function(result, request) {
	 						console_log('success defaultSet');
	 					},
	   	 				failure: function(result, request){
	   	 					console_log('fail defaultSet');
	   	 				}
	 				});
	 				
	 				
	 				stockStore.getProxy().setExtraParam('ac_uid', selectedPjUid);
	 				stockStore.load();

                }
           }
});