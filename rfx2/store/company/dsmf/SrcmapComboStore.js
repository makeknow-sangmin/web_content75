/**
 * SrcmapComboStore Store
 */
//console_log('loading Mplm.store.SupastStore....');
Ext.define('Rfx2.store.company.dsmf.SrcmapComboStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
            srcahd_uid: params.srcahd_uid
        });

    },
    fields: [     
     		{ name: 'unique_id', type: "string" }
     		,{ name: 'address', type: "string"  }
     		,{name: 'sales_price', type: "string"}
     		,{ name: 'address_1', type: "string"  }
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
     	  	  ],
 	sorters: [{
         property: 'supplier_name',
         direction: 'ASC'
     }],
     //cmpName: 'supUid',
     //queryMode: 'remote',
     pageSize: 200,
     hasNull: false,
     hasOwn: false,
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/purchase/request.do?method=readSrcmapCombo',
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
				

			},//endofload
			beforeload: function(){// 			}
			}
		}//endoflistner
});