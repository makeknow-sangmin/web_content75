/**
 * CMM_CODE Store
 */
Ext.define('Mplm.store.ComCstSalerStore', {
	extend: 'Ext.data.Store',
	autoLoad: true,
	initComponent: function (params) {
		Ext.apply(this, {
			parentCode: params.parentCode,
			hasNull: params.hasNull
		});

	},
	fields: [
		{
			name: 'unique_id',
			type: 'string'
		},
		{
			name: 'company_name',
			type: "string"
		}, 
		{
			name: 'wa_code',
			type: "string"
		}

	],
	parentCode: '',
	hasNull: true,
	sorters: [{
		property: 'company_name',
		direction: 'ASC'
	}],
	proxy: {
		type: 'ajax',
		url: CONTEXT_PATH + '/admin/comcst.do?method=readCompany&wa_code=SLP',
		reader: {
			type: 'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success'
		},
		autoLoad: false
	},
	listeners: {
		beforeload: function () {
			this.getProxy().setExtraParam('class_code2', this.class_code);
			console_logs('Mplm.store.ComcstHjStore beforeload');
			console_logs(this.cmpName);
			var obj = Ext.getCmp(this.cmpName);
			console_logs(obj);
			if (obj != null) {
				var val = obj.getValue();
				console_logs(val);
				if (val != null) {
					var enValue = Ext.JSON.encode(val);
					console_logs("queryUtf8:" + enValue);
					this.getProxy().setExtraParam('queryUtf8', enValue);
				} else {
					this.getProxy().setExtraParam('queryUtf8', '');
				}
			}
		}
	}
});
