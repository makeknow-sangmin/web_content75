/**
 * Combst Store
 */
//console_logs('loading Mplm.store.BuyerStore....');

Ext.define('Mplm.store.RecvPoDsmfDeliveryPRD', {
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
			url: CONTEXT_PATH + '/production/schdule.do?method=readDeliveryByAssyTop',
			reader: {
			type:'json',
				root: 'datas',
				totalProperty: 'count',
				successProperty: 'success'
			}
			,autoLoad: false
		},
	listeners: {
		
	}//endoflistener
});