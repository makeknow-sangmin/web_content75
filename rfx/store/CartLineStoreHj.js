/**
 * Process Name Store
 */
Ext.define('Rfx.store.CartLineStoreHj', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        });

    },
	fields : [ {
		name : 'buyer_pj_code',  //자재코드(번호)   srcahd
		type : "string"
		}, {
			name : 'item_code',   //설계자재번호 srcahd
			type : "string"
		}, {
			name : 'item_quan',    //도장외부스펙1 pjdetail
			type : "string"
		},  {
			name : 'reserved_double4',    //납품기준일 project
			type : "string"
		},  {
			name : 'reserved_varchar2',    //납품기준일 project
			type : "string"
		},  {
			name : 'reserved_varcharb',    //납품기준일 project
			type : "string"
		},  {
			name : 'rtgast_uid',    //납품기준일 project
			type : "string"
		},  {
			name : 'unique_id',    
			type : "number"
		}
	],
	hasNull: false,
	sorters: [{
        property: 'unique_id',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
		url: CONTEXT_PATH + '/production/schdule.do?method=cartLineList',
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
			console_logs('store');
			if(this.hasNull) {
				
				var blank ={
						systemCode: '',
						codeName: '[]',
						codeNameEn: ''
					};
					
					this.add(blank);
			}

		},
		beforeload: function(){
		}
}
});