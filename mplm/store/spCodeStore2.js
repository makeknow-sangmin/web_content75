/**
 * Process Name Store
 */

 Ext.define('Mplm.store.spCodeStore2', {
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
			name:'unique_id',
			type: 'string'
		}, {
			name : 'system_code',
			type : "string"
		}, {
			name : 'code_name_kr',
			type : "string"
		}

	],
	hasNull: false,
	sorters: [{
        property: 'system_code',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/code.do?method=read&parentCode=PMT1_PNL_STATE',
		reader : {
			type : 'json',
			root : 'datas',
			totalProperty : 'count',
			successProperty : 'success'
		},
		autoLoad : false
	},
	listeners: {
        load: function (store, records, successful, operation, options) {

            if (this.hasNull) {

                var blank = {
                    systemCode: '',
                    codeName: '전체',
                    codeNameEn: 'ALL'
                };

                this.insert(0, blank);
            }

        },
        beforeload: function () {
        }
    }
});