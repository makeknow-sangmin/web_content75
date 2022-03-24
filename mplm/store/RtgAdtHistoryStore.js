/**
 * Buyer Store
 */

Ext.define('Mplm.store.RtgAdtHistoryStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	group_code: params.group_code
        });

    },
	fields:[     
		 { name: 'id', type: "int" }
		,{ name: 'unique_id', type: "string" }
		,{ name: 'av_no', type: "string"  }
		,{ name: 'complete_date', type: "string"  }
		,{ name: 'user_name', type: "string"  }
		,{ name: 'user_id', type: "string"  }
		,{ name: 'approver_comment', type: "string"  }
		,{ name: 'av_progress', type: "string"  }
	],
	hasNull: false,
	proxy: {
		type: 'ajax',
		url: CONTEXT_PATH + '/production/schdule.do?method=getRtgAdtHistory',
		reader: {
		type:'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success'
		}
		,autoLoad: true
	},
	listeners: {

	}
});