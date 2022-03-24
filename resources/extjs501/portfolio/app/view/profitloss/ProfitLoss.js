Ext.define('ExecDashboard.view.profitloss.ProfitLoss', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.profitloss',
    
    itemId: 'profitloss',
    
    cls: 'dynamic-pl-grid',
    
    requires: [
        'Ext.grid.feature.Grouping',
        'ExecDashboard.store.ProfitLoss'
    ],


    controller: 'profitloss',

    viewModel: {
        type: 'profitloss'
    },

    columns: [],
    enableLocking: true,

    store: {
        type: 'profitloss',
        sorters: 'id',
        groupField: 'pj_type'
    },

    features: [{
        ftype: 'grouping',
        id: 'profitLossGrouper',
        groupHeaderTpl: '{[values.groupValue == "P" ? "고객 수주" : ( values.groupValue == "R" ? "연구개발" : "영업 가수주" )]}', //'<b>{name}</b>',
        startCollapsed: false
    }],

    initView: function() {



    },

    tbar: [{
        text: '보기 항목',
        width: 150,
        textAlign: 'left',
        reference: 'quartersButton',
        menu: {
            id: 'quarter-menu',
            cls: 'pl-option-menu',
            items: []
        }
    },{
        text: '프로젝트 유형',
        width: 150,
        textAlign: 'left',
        reference: 'regionsButton',
        menu: {
            id: 'region-menu',
            cls: 'pl-option-menu',
            items: []
        }
    }
    ,'->'
    
    ],//endoftbar

    // These properties are aspects of the view that get used to create dynamic grid
    // columns and menu items.

    regionColumn: {
        text:'프로젝트',
        dataIndex:'region',
        menuDisabled: true,
        sortable: false,
        resizable: false,
        hideable: false,
        groupable: false,
        locked: true,

        plugins: 'responsive',
        responsiveConfig: {
            'width < 600': {
                width: 150
            },
            'width >= 600': {
                width: 320
            }
        }
    },

    menuItemDefaults: {
        checked: true,
        hideOnClick: false
    },

    quarterColumnDefaults: {
        renderer: function(value) {
	    	var val = Ext.util.Format.number(value, '0,00/i');
			if(value<0) {
	    		val = '<font color="red">' + val + '</font>';
	    	}
	    	return val;
	    },
        flex: 1,
        minWidth: 130,
        align: 'right',
        groupable: false,
        menuDisabled: true,
        resizable: false,
        sortable: false,
        summaryType: 'sum'
    },

    viewConfig: {
        listeners: {
            refresh: 'onViewRefresh'
        }
    }
});
