Ext.define('ExecDashboard.store.ProfitLoss', {
    extend: 'Ext.data.Store',
    alias: 'store.profitloss',

    model: 'ExecDashboard.model.FullProfitloss',

    proxy: {
        type: 'ajax',
        url: CONTEXT_PATH + '/statistics/task.do?method=getProjectList',//'resources/data/full_data.json',
        reader: {
        	type: 'json',
        	rootProperty: 'datas'
        }
    }
});
