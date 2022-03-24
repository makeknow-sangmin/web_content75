Ext.define('Rfx2.view.grid.ComBstGrid', {
    extend: 'Ext.grid.Panel',
    cls: 'rfx-panel',

    autoScroll: true,
    columns: [{
        text: '고객코드',
        cls: 'rfx-grid-header',
        dataIndex: 'wa_code',
        style: 'text-align:center',
        align: 'center'
    }, {
        text: '고객사명',
        cls: 'rfx-grid-header',
        dataIndex: 'wa_name',
        width: 200,
        style: 'text-align:center',
        align: 'center'
    }, {
        text: '업체코드',
        cls: 'rfx-grid-header',
        dataIndex: 'company_name',
        style: 'text-align:center',
        align: 'center'
    }, {
        text: '국가',
        cls: 'rfx-grid-header',
        dataIndex: 'nation_code',
        style: 'text-align:center',
        align: 'center'
    }]

});
