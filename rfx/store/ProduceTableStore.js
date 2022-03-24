Ext.define('Rfx.store.ProduceTableStore', {
	extend: 'Ext.data.Store',
    autoDestroy: true,
    groupField: 'class_name',
    sorters: ['plan_date','regist_date']//,
 //   model: Ext.ModelManager.getModel('Rfx.model.ProduceTable')
});
