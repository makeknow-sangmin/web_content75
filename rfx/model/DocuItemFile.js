Ext.define('Rfx.model.DocuItemFile', {
	extend: 'Rfx.model.Base',
		proxy: {
			type: 'ajax',
			api: {
		     	read: CONTEXT_PATH + '/design/bom.do?method=readDocuItem' 					/*1recoed, search by cond, search */
			},
			reader: {
				type: 'json',
				root: 'datas',
				totalProperty: 'count',
				successProperty: 'success',
				metaProperty: 'metaData'
			},
			writer: {
		         type: 'singlepost',
		         writeAllFields: false,
		         root: 'datas'
	     } 
	}
});