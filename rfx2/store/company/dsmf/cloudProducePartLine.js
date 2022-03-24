/**
 * Process Name Store
 */
Ext.define('Rfx2.store.company.dsmf.cloudProducePartLine', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        });
    },
	fields : [ 
        {
            name : 'unique_id',
            type : "string"
		},{
            name : 'reserved_integer1',
            type : "string"
		},{
            name : 'reserved_integer3',
            type : "string"
		},{
            name : 'item_code',
            type : "string"
		},{
            name : 'item_name',
            type : "string"
		},{
            name : 'specification',
            type : "string"
		},{
            name : 'bm_quan',
            type : "string"
		}

	],
	hasNull: false,
	sorters: [{
      //   property: 'unique_id',
      //   direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/design/bom.do?method=cloudread&BOM=T',
		reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success',
            excelPath: 'excelPath'
        },
		autoLoad : false
	}
});
