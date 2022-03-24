Ext.define('Rfx.view.grid.RemainMatGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
               'Ext.grid.feature.Grouping'
           ],
    cls : 'rfx-panel',
    initComponent: function() {

    	
    	this.callParent();

    },
    
    columns: [{
    	dataIndex: 'id', 
    	text: 'NO.',
    	style: 'text-align:center', 
    	align: 'center',
    	width: 50
    },{
    	text: 'W/O번호',
    	cls:'rfx-grid-header', 
        dataIndex: 'pj_code',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center',
        width: 120
    }, {
		text: '잔재번호',
		cls:'rfx-grid-header', 
        dataIndex: 'vestige_num',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center',
        field: {
            xtype: 'textfield'
        },
        width: 120 
    },{
    	text: '시리얼',
    	cls:'rfx-grid-header', 
        dataIndex: 'serial',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center',
        width: 60
    }, {
    	text: '강종',
    	cls:'rfx-grid-header', 
        dataIndex: 'hard_class',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center',
        width: 70
    }, {
		text: '재질',
		cls:'rfx-grid-header', 
        dataIndex: 'material_name',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center',
        field: {
            xtype: 'textfield'
        },
        width: 100
    }, {
		text: '규격',
		cls:'rfx-grid-header', 
        dataIndex: 'specification',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center',
        field: {
            xtype: 'textfield'
        },
        width: 150
    }, {
		text: '수량',
		cls:'rfx-grid-header', 
        dataIndex: 'bm_quan',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center',
        field: {
            xtype: 'textfield'
        },
        width: 50
    }, {
		text: '중량',
		cls:'rfx-grid-header', 
        dataIndex: 'mass',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center',
        field: {
            xtype: 'textfield'
        },
        width: 60
    }, {
		text: '원재번호',
		cls:'rfx-grid-header', 
        dataIndex: 'spar_num',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center',
        field: {
            xtype: 'textfield'
        },
        width: 130
    }, {
		text: '저장위치',
		cls:'rfx-grid-header', 
        dataIndex: 'storage_place',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center',
        field: {
            xtype: 'textfield'
        },
        width: 80
    }, {
		text: '비고',
		cls:'rfx-grid-header', 
        dataIndex: 'request_comment',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center',
        field: {
            xtype: 'textfield'
        },
        width: 200
    }, {
		text: 'W/O순번',
		cls:'rfx-grid-header', 
        dataIndex: 'pj_code2',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center',
        field: {
            xtype: 'textfield'
        },
        width: 70
    }],
      bbar: getPageToolbar(this.store, true, null, function () {
                    	Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
                    }),
	  listeners: {
	     itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
		   //console_logs('record', record);
		   var title = '[<span style="color:#003471">' + ORG_PARAMS['produceState-Month'] + '</span>] 현황';
				popupUserProjectDetail(title, record, 'gridProduceTable', this, record.get('org4'));
		 }//endof itemdblclick

	  }//endof listeners
});
