/**
 * Process Name Store
 */

Ext.define('Mplm.store.ConditionStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {

    },
	fields : [ {
		name : 'label',
		type : "string"
		},{
			name : 'value',
			type : "string"
			},{
				name : 'order',
				type : "int"
				}
		
	],
	sorters: [{
        property: 'order',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/index/generalData.do?method=getDistinctCombo',
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
            if(records == null) {
                for(var i = 0; i < 4; i++) {
                    this.removeAt(i);
                }
			}
            this.add({
                label: '<button style="width:100%">필드값 없음</button>',
                value: '-',
                order: -3
            });
            this.add({
                label: '<button style="width:100%">모두 지우기</button>',
                value: null,
                order: -2
            });
            this.add({
                label: '<button style="width:100%">모두 선택</button>',
                value: '*',
                order: -1
            });
            this.add({
                label: '',
                value: '<NULL>',
                order: -4
            });
		},
		beforeload: function(){
			
		}
}
});