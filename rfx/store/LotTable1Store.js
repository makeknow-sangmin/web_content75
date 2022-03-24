Ext.define('Rfx.store.LotTable1Store', {
	extend: 'Ext.data.Store',
    autoDestroy: true,
    groupField: 'plan_date',
    sorters: ['plan_date','regist_date']//,
//    model: Ext.ModelManager.getModel('Rfx.model.LotTable1')

});
