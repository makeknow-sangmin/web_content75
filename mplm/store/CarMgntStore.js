Ext.define('Mplm.store.CarMgntStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        
        });
    },
	fields:[  
		{
		name : 'class_code',
		type : "string"
		}, {
			name : 'reserved_varchar1',
			type : "string"
		}, {
			name : 'reserved_varchar2',
			type : "string"
		}, {
			name : 'reserved_varchar3',
			type : "string"
		}, {
			name : 'reserved_varchar4',
			type : "string"
		}, {
			name : 'reserved_double1',
			type : "number"
		}, {
			name : 'reserved_double2',
			type : "number"
		}, {
			name : 'reserved_double3',
			type : "number"
		}, {
			name : 'reserved_double4',
			type : "number"
		}, {
			name: "unique_id",
			type: "int"
		}, {
			name : 'class_name',
			type: 'string'
		}
	 	  ],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/admin/stdClass.do?method=readGenClaast&identification_code=CR&limit=1000',
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