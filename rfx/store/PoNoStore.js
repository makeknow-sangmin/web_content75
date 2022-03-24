/**
 * Process Name Store
 */

Ext.define('Rfx.store.PoNoStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
//        	hasNull: params.hasNull
            // some else customization
//        	system_code: params.system_code
        });

    },
	fields : [ {
		name : 'po_no',
		type : "string"
		}, {
			name : 'reserved_varchar3',
			type : "string"
		}, {
			name : 'unique_id',
			type : "string"
		},
		{
			name : 'item_abst',
			type : "string"
		},
		{
			name : 'reserved_varchar2',
			type : "string"
		},
		{
			name : 'big_pcs_code',
			type : "string"
		}


	],
	hasNull: false,
	sorters: [{
        property: 'unique_id',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
		url : CONTEXT_PATH + '/sales/excelRecvPo.do?method=getBufferedLotRtgast',
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
			
//			if(this.hasNull) {
//				
//				var blank ={
//						unique_id: '-1',
//						reserved12: '',
//						rtg_poNo: '번호 없음'
//					};
//					
//					this.add(blank);
//			}

		},
		beforeload: function(){
//			this.getProxy().setExtraParam('system_code', this.system_code);
		}
}
});