Ext.define('Mplm.store.WhouseMgmt', {

    extend: 'Ext.data.Store',

    initComponent: function(params) {
       
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },    
    fields : [ {
		name : 'systemCode',
		type : "string"
		}, {
			name : 'codeName',
			type : "string"
		}, {
			name : 'codeNameEn',
			type : "string"
		}

	],
	hasNull: false,
	sorters: [{
        property: 'code_order',
        direction: 'ASC'
    }],
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/quality/warehoused.do?method=read'
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
			//if(this.hasNull) {
				
				var blank ={
						wh_Code: 'ALL',
						codeName: 'codename',
						codeNameEn: '',
						wh_name: '전체'
						//codeOrder: -1
					};
					
                    //this.add(blank);
                    this.insert(0, blank);
			//}

		},
		beforeload: function(){
		}
}
}

);
