/**
 * 출하대기 출고처리 + 배송완료 전 납품서들
 */

Ext.define('Mplm.store.RtgAstDlStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields : [ 
		{
			name : 'unique_id',
			type : "string"
		}, {
			name : 'po_no',
			type : "string"
		}, {
			name : 'wa_name',
			type : "string"
		}

	],
	hasNull: false,
	sorters: [{
        property: 'unique_id',
        direction: 'DESC'
    }],
	proxy : {
		type : 'ajax',
		url : CONTEXT_PATH +  '/sales/delivery.do?method=readDL&state=I',
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
			
			//if(this.hasNull) {
				
				var blank ={
					unique_id:999999999999,
					po_no:null,
					wa_name:'신규'
				};
					
					this.add(blank);
			//}

		},
		beforeload: function(){
		}
}
});