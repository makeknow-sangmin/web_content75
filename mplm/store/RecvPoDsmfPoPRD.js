/**
 * Combst Store
 */
//console_logs('loading Mplm.store.BuyerStore....');

Ext.define('Mplm.store.RecvPoDsmfPoPRD', {
    extend: 'Ext.data.Store',

	initComponent: function(params) {
		
        Ext.apply(this, {
        	//검색조건에 필요한 조건값 여기에 추가 
        	wa_code: params.wa_code
            
        });

    },
	fields:[     
			 { name: 'unique_id', type: "string" }
			,{ name: 'id', type: "int" }
			,{ name: 'unique_id_long', type: "int" }
			,{ name: 'item_name', type: "string"  }
			,{ name: 'status', type: "string"  }
			,{ name: 'item_code', type: "string"  }
			,{ name: 'specification', type: "string"  }
			,{ name: 'sales_price', type: "string"  }
			,{ name: 'quan', type: "string"  }
			,{ name: 'stock_qty_useful', type: "string"  }
			,{ name: 'bm_quan', type: "string"  }
			,{ name: 'comment', type: "string"  }
			,{ name: 'pr_quan', type: "int"  }
			,{ name: 'rc_quan', type: "int"  }
		],
	 	sorters: [{
	        property: 'item_code',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/production/schdule.do?method=readProductByAssyTop',
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
							unique_id: '-1',
							wa_code: '',
							wa_name: '[전체]'
					};
					
					this.add(blank);
				}
				
			},
			beforeload: function(){
				
				if(this.wa_code!=null){
					this.getProxy().setExtraParam('wa_code', this.wa_code);
				}
				
			}//endofbeforeload
		}//endoflistener
});