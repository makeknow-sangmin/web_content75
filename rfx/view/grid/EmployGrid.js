/**
 * This example shows how to create a grid from Array data. The grid is stateful so you
 * can move or hide columns, reload the page, and come back to the grid in the same state
 * you left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('Rfx.view.grid.EmployGrid', {
    extend: 'Ext.grid.Panel',
//    requires: [
//        'Ext.grid.column.Action'
//    ],
    xtype: 'employ-grid',
//    constructor: function(cfg) {
//    	console.log('cfg', cfg);
//        //this.initConfig(cfg);
//		Ext.applyIf(this, {
//			store: cfg.store,
//			columns: cfg.columns,
//			width: cfg.width,
//			height: cfg.height,
//			title: cfg.title,
//			frame: cfg.frame
//			
//        });
//		
//		this.themeInfo = this.themes['classic'];
//    },
    store: Ext.StoreMgr.lookup('Rfx.store.EmployeeStore') ,
    stateful: true,
    collapsible: true,
    multiSelect: true,
    stateId: 'stateGrid',
    height: 350,
    title: 'Array Grid',
    viewConfig: {
        enableTextSelection: true
    },
//    //<example>
//    otherContent: [{
//        type: 'Store',
//        path: 'app/store/Companies.js'
//    },{
//        type: 'Model',
//        path: 'app/model/Company.js'
//    }],
    themes: {
        classic: {
            width: 600,
            priceWidth: 75,
            percentChangeColumnWidth: 75,
            lastUpdatedColumnWidth: 85,
            green: 'green',
            red: 'red'
        },
        neptune: {
            width: 750,
            priceWidth: 95,
            percentChangeColumnWidth: 100,
            lastUpdatedColumnWidth: 115,
            green: '#73b51e',
            red: '#cf4c35'
        }
    },
    //</example>
    columns: [{
        header: 'Name',
        dataIndex: 'name',
        flex: 1,
        editor: {
            // defaults to textfield if no xtype is supplied
            allowBlank: false
        }
    }, {
        header: 'Email',
        dataIndex: 'email',
        width: 160,
        editor: {
            allowBlank: false,
            vtype: 'email'
        }
    }, {
        xtype: 'datecolumn',
        header: 'Start Date',
        dataIndex: 'start',
        width: 135,
        editor: {
            xtype: 'datefield',
            allowBlank: false,
            format: 'm/d/Y',
            minValue: '01/01/2006',
            minText: 'Cannot have a start date before the company existed!',
            maxValue: Ext.Date.format(new Date(), 'm/d/Y')
        }
    }, {
        xtype: 'numbercolumn',
        header: 'Salary',
        dataIndex: 'salary',
        format: '$0,0',
        width: 130,
        editor: {
            xtype: 'numberfield',
            allowBlank: false,
            minValue: 1,
            maxValue: 150000
        }
    }, {
        xtype: 'checkcolumn',
        header: 'Active?',
        dataIndex: 'active',
        width: 60,
        editor: {
            xtype: 'checkbox',
            cls: 'x-grid-checkheader-editor'
        }
    }]/*,
    initComponent: function (params) {
    	console_logs('initComponent params', params);
    }*/
});
