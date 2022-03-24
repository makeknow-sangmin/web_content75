Ext.define('Rfx.store.DeliveryListStore', {
	extend: 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        });
    },
	fields : [ {
		name : 'unique_id',  //자재코드(번호)   srcahd
		type : "string"
		}, {
			name : 'pj_code',   //설계자재번호 srcahd
			type : "string"
		}, {
			name : 'item_code',    //도장외부스펙1 pjdetail
			type : "string"
		},  {
			name : 'regist_date',    //납품기준일 project
			type : "string"
		},  {
			name : 'bm_quan',    //납품기준일 project
			type : "string"
		}
		,  {
			name : 'end_date',    //납품기준일 project
			type : "string"
		}
		,  {
			name : 'outpcs_qty',    //납품기준일 project
			type : "string"
		}
		,  {
			name : 'delivery_plan',    //납품기준일 project
			type : "string"
		}
		,  {
			name : 'reserved_double1',    //납품기준일 project
			type : "string"
		}


	],
	hasNull: false,
	sorters: [{
        property: 'end_date',
        direction: 'DESC'
    }],
	proxy : {
		type : 'ajax',
        //url: CONTEXT_PATH + '/production/pcsstd.do?method=pcsastdetailread&pcs_code=CUT',
		url: CONTEXT_PATH + '/design/project.do?method=deliveryList',
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
