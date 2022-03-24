Ext.define('Rfx.model.PopupTable1', {
    extend: 'Rfx.model.Base',
    fields: [ 
             'id',
             'no', 
             'bonbu', 
             'center',
             'sil',
             'team',
             'gubun',
             'position', 
             'name', 
             {    name: 'v1',   type: 'float' }
    ],
       proxy: {
			type: 'ajax',
	        api: {  
	            read: CONTEXT_PATH +  '/xdview/popup.do?method=getTable'
	        },
			reader: {
				type: 'json',
				root: 'records',
				totalProperty: 'count',
				successProperty: 'success'
			}
		}
});