/**
 * CMM_CODE Store
 */
Ext.define('Rfx.store.CmmTreeStore', {
	extend : 'Ext.data.TreeStore',
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/xdview/tree.do?method=getData'
	},
	folderSort: true,
    sorters: [{
        property: 'text',
        direction: 'ASC'
    }]
});
