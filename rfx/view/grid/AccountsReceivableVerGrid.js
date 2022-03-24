Ext.define('Rfx.view.grid.AccountsReceivableVerGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
               'Ext.grid.feature.Grouping'
           ],
    cls : 'rfx-panel',
    initComponent: function() {
    	this.callParent();
    },
    autoScroll: true,
    columns: [{
    	text: '고객사명',
    	cls:'rfx-grid-header', 
        dataIndex: 'wa_name',
        width: 150,
        style: 'text-align:center',     
        align:'left'
    },{
    	text: '사업자등록번호',
    	cls:'rfx-grid-header', 
        dataIndex: 'biz_no',
        width: 100,
        style: 'text-align:center',     
        align:'left'
    },{
    	text: '대표자명',
    	cls:'rfx-grid-header', 
        dataIndex: 'president_name',
        width: 100,
        style: 'text-align:center',     
        align:'left'
    },{
    	text: '주소',
    	cls:'rfx-grid-header', 
        dataIndex: 'address_1',
        width: 100,
        style: 'text-align:center',     
        align:'left'
    },{
    	text: '업태',
    	cls:'rfx-grid-header', 
        dataIndex: 'biz_condition',
        width: 90,
        style: 'text-align:center',     
        align:'left'
    },{
    	text: '종목',
    	cls:'rfx-grid-header', 
        dataIndex: 'biz_category',
        width: 90,
        style: 'text-align:center',     
        align:'left'
    },{
    	text: '대표전화번호',
    	cls:'rfx-grid-header', 
        dataIndex: 'site_manager_tel_no',
        width: 100,
        style: 'text-align:center',     
        align:'left'
    }]
});
