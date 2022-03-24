Ext.define('Rfx.view.grid.OutTableGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
               'Ext.grid.feature.Grouping'
           ],
    cls : 'rfx-panel',
    initComponent: function() {

    	
    	this.callParent();

    },
    progressRenderer: function (v, m, r, rowIndex, columnIndex, view) {
//    	console_logs('widget v', v);
//    	console_logs('widget m', m);
//    	console_logs('widget r', r);
//    	console_logs('widget rowIndex', rowIndex);
//    	console_logs('widget columnIndex', columnIndex);
//    	console_logs('widget view', view);

    	var id = Ext.id();
    	if(columnIndex<3) {
    		return '';
    	}
    	if(v==null || v==undefined) {
    		return '';
    	}
    	
    	var pos = columnIndex-2;
    	var poss = ''+pos;
    	if(poss.length==1) {
    		poss = '0' + poss;
    	}
      
    	//console_logs('poss', poss);
    	
        Ext.defer(function () {
        	try {
                Ext.widget('progressbar', {
                    renderTo: id,
                    value: v,
                    width: 100
                });	
        	} catch(e){}
        }, 50);

    	var pcs_name =  r.get('pcs' + poss + 'name')==undefined?'': r.get('pcs' + poss + 'name');
    	var pcs_sup = r.get('pcs' + poss + 'sup')==undefined?'': r.get('pcs' + poss + 'sup');
    	var supplier_name = r.get('supplier_name');

    	if(pcs_name==undefined || pcs_name==null || pcs_sup==undefined || pcs_sup==null ) {
    		return '';
    	}
    	var s = '';
    	
    	if(pcs_sup!='' && supplier_name == pcs_sup ) {
    		s = Ext.String.format('<div id="{0}">{1}:<font color=#B50000><b>{2}</b></font></div>', id, pcs_name, pcs_sup);
    	} else {
        	s = Ext.String.format('<div id="{0}">{1}:{2}</div>', id, pcs_name, pcs_sup);    		
    	}

    	//console_logs('s', s);
        return s;	

    },
    
    columns: [{
    	dataIndex: 'id', 
    	text: 'NO.',
    	style: 'text-align:center', 
    	align: 'center',
    	width: 50
    },
     /* {
    	text: '계획일자',
    	cls:'rfx-grid-header', 
        dataIndex: 'plan_date',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }, */{
    	text: '제품명 | 고객사',
    	cls:'rfx-grid-header', 
        dataIndex: 'wa_name',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }, {
		text: '원지 | 원단',
		cls:'rfx-grid-header', 
        dataIndex: 'full_spec',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center',
        field: {
            xtype: 'textfield'
        }
//    }, {
//		text: '설명',
//		cls:'rfx-grid-header', 
//        dataIndex: 'description',
//        resizable: true,
//        autoSizeColumn : true,
//        style: 'text-align:center',     
//        align:'center',
//        field: {
//            xtype: 'textfield'
//        }
//    }, {
//		text: gm.getMC('CMD_Wearing','입고'),
//		cls:'rfx-grid-header', 
//        dataIndex: 'gr_date_supplier',
//        resizable: true,
//        autoSizeColumn : true,
//        style: 'text-align:center',     
//        align:'center',
//        field: {
//            xtype: 'textfield'
//        }
    }, {
		text: '01',
        renderer: function (v, m, r, rowIndex, columnIndex, view) { return this.progressRenderer(v, m, r, rowIndex, columnIndex, view); },
		cls:'rfx-grid-header', 
        dataIndex: 'pcs01',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }, {
    	text: '02',
        renderer: function (v, m, r, rowIndex, columnIndex, view) { return this.progressRenderer(v, m, r, rowIndex, columnIndex, view); },
		cls:'rfx-grid-header', 
        dataIndex: 'pcs02',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }, {
    	text: '03',
    	renderer: function (v, m, r, rowIndex, columnIndex, view) { return this.progressRenderer(v, m, r, rowIndex, columnIndex, view); },
		cls:'rfx-grid-header', 
        dataIndex: 'pcs03',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }, {
		text: '04',
		renderer: function (v, m, r, rowIndex, columnIndex, view) { return this.progressRenderer(v, m, r, rowIndex, columnIndex, view); },
		cls:'rfx-grid-header', 
        dataIndex: 'pcs04',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }, {
    	text: '05',
    	renderer: function (v, m, r, rowIndex, columnIndex, view) { return this.progressRenderer(v, m, r, rowIndex, columnIndex, view); },
        cls:'rfx-grid-header', 
        dataIndex: 'pcs05',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }, {
    	text: '06',
    	renderer: function (v, m, r, rowIndex, columnIndex, view) { return this.progressRenderer(v, m, r, rowIndex, columnIndex, view); },
        cls:'rfx-grid-header', 
        dataIndex: 'pcs06',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }, {
		text: '07',
		renderer: function (v, m, r, rowIndex, columnIndex, view) { return this.progressRenderer(v, m, r, rowIndex, columnIndex, view); },
		cls:'rfx-grid-header', 
        dataIndex: 'pcs07',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }, {
    	text: '08',
    	renderer: function (v, m, r, rowIndex, columnIndex, view) { return this.progressRenderer(v, m, r, rowIndex, columnIndex, view); },
		cls:'rfx-grid-header', 
        dataIndex: 'pcs08',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }, {
    	text: '09',
    	renderer: function (v, m, r, rowIndex, columnIndex, view) { return this.progressRenderer(v, m, r, rowIndex, columnIndex, view); },
		cls:'rfx-grid-header', 
        dataIndex: 'pcs09',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }, {
    	text: '수주 | 생산',
    	cls:'rfx-grid-header', 
        dataIndex: 'qty',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }, {
    	text: '등록일 | LOT',
    	cls:'rfx-grid-header', 
        dataIndex: 'regist_date',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center'
    }, {
		text: '납기일',
		cls:'rfx-grid-header', 
        dataIndex: 'spo_delivery',
        resizable: true,
        autoSizeColumn : true,
        style: 'text-align:center',     
        align:'center',
        field: {
            xtype: 'textfield'
        }
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
