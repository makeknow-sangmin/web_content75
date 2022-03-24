Ext.define('Mplm.model.DocuTreeModel', {
	extend: 'Ext.data.Model',
    alias: 'mplmDocuTreeModel',
    fields:[     
        {
            name: 'unique_id',
            type: 'int'
        }, {
            name: 'class_name',
            type: 'string'
        }, {
            name: 'class_code',
            type: 'string'
        }, {
            name: 'parent_class_code',
            type: 'string'
        }, {
            name: 'level',
            type: 'int'
        }
	  ],
    lang: '',
    proxy: {
		type: 'ajax',
		url: CONTEXT_PATH + '/document/manage.do?method=classTreeRead&identification_code=DC',
		reader: {
		    type: 'json',
			root: 'datas'
		},
		writer: {
		  type: 'json'
		}	  
	}
});