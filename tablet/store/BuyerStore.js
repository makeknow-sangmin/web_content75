Ext.define('Tablet.store.CarMgntStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        
        });
    },
	fields:[  
		{
		    name: 'unique_id',
		    type: "string"
		}, {
            name: 'code_name_kr',
            type: "string"
        }, {
            name: 'code_name_en',
            type: "string"
        }
	 	  ],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/admin/mescode.do?method=readCarMgnt',
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
				console_logs('load records', records);

			},
			beforeload: function(){

//				this.getProxy().setExtraParam('myLink', this.myLink);
//				console_logs('myLink in store>>>>>>>>>>>', this.myLink);
		}
		}
});