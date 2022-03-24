/**
 * Process Name Store
 */

Ext.define('Mplm.store.CarTypeStore', {
	extend : 'Ext.data.Store',
	
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });
    },
	fields : [ {
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
			name: "unique_id",
			type: "int"
		}

	],
	hasNull: false,
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/admin/stdClass.do?method=readGenClaast&identification_code=CR',
		reader : {
			type : 'json',
			root : 'datas',
			totalProperty : 'count',
			successProperty : 'success'
		},
		autoLoad : false
	},
	listeners: {
		load: function(store, records, successful,operation, options) {
		},
		beforeload: function(){
		}
	},
	// getCalData : function() {
	// 	console_logs('this.data.items', this.data.items);
	// 	var calDatas = [];
	// 	for(var i=0; i<this.data.items.length; i++) {
	// 		var o = this.data.items[i];
	// 		console_logs('getCalData o', o);
	// 		calDatas.push({
	// 			id: o.get('unique_id'),
	// 			title: o.get('systemCode'),
	// 			desc: o.get('codeName'),
	// 			color: i+1,
	// 			hidden: false
	// 		});
	// 	}
	// 	console_logs('getCalData calDatas', calDatas);
		
		
	// 	var o1 = { calendars: calDatas };
	// 	console_logs('getCalData o1', o1);
		
	// 	return o1;
	// }
});