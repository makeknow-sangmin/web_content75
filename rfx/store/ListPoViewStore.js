/**
 * PjMemberStore Store
 */
Ext.define('Rfx.store.ListPoViewStore', {
    extend: 'Ext.data.Store',
    initComponent: function(params) {
        Ext.apply(this, {
        });
    },
    fields: [     
     		{ name: 'unique_id', type: "string" }
     		,{ name: 'rtgastuid', type: "string" }
     		,{ name: 'item_abst', type: "string"  }
     		,{ name: 'item_name', type: "string"  }
     		,{ name: 'specification', type: "string"  }
     		,{ name: 'po_qty', type: "string"  }
     		,{ name: 'gr_qty', type: "string" }
     		,{ name: 'po_blocking_qty', type: "string"  }
     		,{ name: 'sales_price', type: "string"  }
        	,{ name: 'req_date', type: "string"}
     		,{ name: 'req_delivery_date', type: "string"}
     	  	  ],
 	// sorters: [{
    //      property: 'unique_id',
    //      direction: 'ASC'
    //  }],
         hasNull: false,
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/purchase/prch.do?method=ListPoViewDetail',
//	         url: CONTEXT_PATH + '/purchase/request.do?method=getPodetail',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: false
	     },
		listeners: {
			
			load: function(store, records, successful,operation, options) {
				if(this.hasNull) {
					
					var blank ={
							systemCode: '',
							codeName: '[]',
							codeNameEn: ''
						};
						
						this.add(blank);
				}//endofif

			},//endofload
			beforeload: function(){
			}
		}//endoflistner
});