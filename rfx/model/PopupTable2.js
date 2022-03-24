Ext.define('Rfx.model.PopupTable2', {
    extend: 'Rfx.model.Base',
    fields: [ 
             'id',
			  'pre_mass', 
              'pj_code',
              'pj_name',
              'car', 
              'product',
              'tech',
              'task',
              {    name: 'v1',   type: 'float' },
              {    name: 'v2',   type: 'float' },
              {    name: 'v3',   type: 'float' }
     ],
        proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/xdview/popup.do?method=getTable'
	        },
			reader: {
				type: 'json',
				root: 'records',
				totalProperty: 'count',
				successProperty: 'success'
			}
		}
});