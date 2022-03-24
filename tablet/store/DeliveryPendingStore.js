Ext.define('Tablet.store.DeliveryPendingStore', {
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
            name: 'wa_name',
            type: "string"
        }, {
            name: 'item_code',
            type: "string"
        }, {
            name: 'item_name',
            type: "string"
        }, {
            name: 'description',
            type: "string"
        }, {
            name: 'delivery_qty',
            type: "string"
        }, {
            name: 'reserved_double1',
            type: "string"
        }, {
            name: 'pj_code',
            type: "string"
        }, {
            name: 'reserved_varchar2',
            type: "string"
        }
	 	  ],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/tablet.do?method=readPending',
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