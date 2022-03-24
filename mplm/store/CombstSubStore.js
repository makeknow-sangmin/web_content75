/**
 * Combst Store
 */
//console_logs('loading Mplm.store.BuyerStore....');

Ext.define('Mplm.store.CombstSubStore', {
    extend: 'Ext.data.Store',

	initComponent: function(params) {
		
        Ext.apply(this, {
        	//검색조건에 필요한 조건값 여기에 추가 
        	wa_code: params.wa_code,
            wa_group_only:params.wa_group_only
        });

    },
	fields:[     
	 	     { name: 'unique_id', type: "string" }
	 	     ,{ name: 'id', type: "int" }
	 	     ,{ name: 'unique_id_long', type: "int" }
	 	     ,{ name: 'wa_code', type: "string"  }
	 	     ,{ name: 'wa_name', type: "string"  }
	 	     ,{ name: 'nation_code', type: "string"  }
	 	     ,{ name: 'company_name', type: "string"  }
	 	  ],
	 	sorters: [{
	        property: 'wa_name',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/sales/buyer.do?method=read',
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