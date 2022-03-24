/**
 * Gubun Store J2_CODE 부터 읽는 방법 - 사용안함.
 */

Ext.define('Mplm.store.DivisionStore2', {
	extend : 'Ext.data.Store',
	autoLoad: true,
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields : [ {

		name : 'id',
		type : "int"
	},
	{
		name : 'unique_id',
		type : "string"
	}, {
		name : 'division_code',
		type : "string"
	}, {
		name : 'division_name',
		type : "string"
	}, {
		name : 'president_name',
		type : "string"
	}, {
		name : 'biz_no',
		type : "string"
	}, {
		name : 'address_1',
		type : "string"
	}, {
		name : 'biz_category',
		type : "string"
	}, {
		name : 'biz_condition',
		type : "string"
	}, {
		name : 'wa_name',
		type : "string"
	}, {
		name : 'wa_code',
		type : "string"
	}

	],
	queryMode: 'remote',
	hasNull: false,
	sorters: [{
        property: 'sort_seq',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/admin/comcst.do?method=read',
		reader : {
			type : 'json',
			root : 'datas',
			totalProperty : 'count',
			successProperty : 'success'
		},
		autoLoad : true
	},
	listeners: {
		load: function(store, records, successful,operation, options) {
			
			if(this.hasNull) {
				
				var blank ={
						id: '',
						unique_id: '',
						division_code: ' ',
						division_name: ''
					};
					
					this.add(blank);
			}

		},
		beforeload: function(){
		}
}
});