/**
 * 견적정보 상태구분 Store
 */
Ext.define('Mplm.store.MaterialTypeStore', {
	extend: 'Ext.data.Store',
	initComponent: function (params) {
		// !! here may be some calculations and params alteration !!
		Ext.apply(this, {
			hasNull: params.hasNull
			// some else customization
		});

	},
	fields: [{
		name: 'systemCode',
		type: "string"
	}, {
		name: 'codeName',
		type: "string"
	}, {
		name: 'codeNameEn',
		type: "string"
	}, {
		name: 'codeOrder',
		type: "int"
	}

	],
	hasNull: false,
	sorters: [{
		property: 'codeOrder',
		direction: 'ASC'
	}],
	proxy: {
		type: 'ajax',
		url: CONTEXT_PATH + '/code.do?method=read&parentCode=MATERIAL_TYPE',
		reader: {
			type: 'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success'
		},
		autoLoad: false
	},
	listeners: {
		load: function (store, records, successful, operation, options) {
			var blank = {
				unique_id: -1,
				systemCode: 'A',
				codeName: '전체',
				codeNameEn: ''
			};
			this.add(blank);
		},
		beforeload: function () {

		}
	}
});