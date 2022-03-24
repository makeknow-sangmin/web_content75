Ext.define('Rfx.view.grid.PcsStdGrid', {
    extend: 'Ext.grid.Panel',
    
    store: Ext.StoreMgr.lookup('Rfx.store.ProduceTableStore'),
    cls : 'rfx-panel',
	border: true,
	resizable: true,
	scroll: true,
    collapsible: false,
    layout          :'fit',
    forceFit: true
});
