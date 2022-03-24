Ext.define('Mplm.store.innoutHistoryStore', {

    extend: 'Ext.data.Store',

    initComponent: function(params) {
       
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
    fields:[     
        { name: 'unique_id', type: "string" }
       ,{ name: 'give_name', type: "string"  }
       ,{ name: 'take_name', type: "string"  }
       ,{ name: 'house_from_name', type: "string"  }
       ,{ name: 'house_to_name', type: "string"  }
       ,{ name: 'move_date', type: "date"  }
       ,{ name: 'in_qty', type: "number"  }
       ,{ name: 'description', type: "string"  }
       
    ],
	hasNull: false,
	sorters: [{
        property: 'unique_id',
        direction: 'DESC'
    }],
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/quality/warehoused.do?method=readHistoryBySrcahd'
        },
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success',
            excelPath: 'excelPath'
        },
        writer: {
            type: 'singlepost',
            writeAllFields: false,
            root: 'datas'
        }
    },
    listeners: {
		load: function(store, records, successful,operation, options) {
			console_logs("Store Load.....", records);
			

		},
		beforeload: function(){
		}
}
}

);
