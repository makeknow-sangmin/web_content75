Ext.define('Rfx.model.DocuMgmt', {
	extend: 'Rfx.model.Base',
	proxy: {
		type: 'ajax',
       api: {
       	read: CONTEXT_PATH + '/supercom.do?method=projectRepo&repo_type=project', 					/*1recoed, search by cond, search */
           create: CONTEXT_PATH + '/supercom.do?method=createFolder', 			/*create record, update*/
           update: CONTEXT_PATH + '/supercom.do?method=updateFile',
           destroy: CONTEXT_PATH + '/supercom.do?method=destroyFile' 			/*delete*/
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