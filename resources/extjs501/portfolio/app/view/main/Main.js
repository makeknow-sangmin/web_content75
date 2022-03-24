/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 */
Ext.define('ExecDashboard.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',

    requires: [
        //<debug>
        'Ext.app.bindinspector.Inspector',
        //</debug>
        'ExecDashboard.view.*'
    ],

    controller: 'main',

    viewModel: {
        type: 'main'
    },

    ui: 'navigation',
    cls: 'exec-menu-navigation',

    tabBarHeaderPosition: 1,
    titleRotation: 0,
    tabRotation: 0,

    header: {
        layout: {
            align: 'stretchmax'
        },
        iconCls: 'exec-header-icon',
        title: {
            text: '<small>CEO<font color="#D0D0D0">View<font></small>',
            textAlign: 'center',
            flex: 0
            //,  minWidth: 160
        },
        tools: [{
            type: 'gear',
            plugins: 'responsive',
            width: 100,
            margin: '0 0 0 0',
            handler: 'onSwitchTool',
            responsiveConfig: {
                'width < 768 && tall': {
                    visible: true
                },
                'width >= 768': {
                    visible: false
                }
            }
        }]
    },

    tabBar: {
        flex: 1,
        layout: {
            align: 'stretch',
            overflowHandler: 'none'
        }
    },

    responsiveConfig: {
        tall: {
            headerPosition: 'top'
        },
        wide: {
            headerPosition: 'left'
        }
    },

    listeners: {
        tabchange: 'onTabChange'
    },

    defaults: {
        tabConfig: {
            plugins: 'responsive',
            responsiveConfig: {
                wide: {
                    iconAlign: 'left',
                    textAlign: 'left',
                    flex: 0
                },
                tall: {
                    iconAlign: 'top',
                    textAlign: 'center',
                    flex: 1
                },
                'width < 768 && tall': {
                    visible: false
                },
                'width >= 768': {
                    visible: true
                }
            }
        }
    },

    items: [{
        // This page has a hidden tab so we can only get here during initialization. This
        // allows us to avoid rendering an initial activeTab only to change it immediately
        // by routing
        xtype: 'component',
        tabConfig: {
            hidden: true
        }
    },{
        xtype: 'kpi',
        title: '영업 현황',
        iconCls: 'exec-kpi-icon'
    },{
    	xtype: 'schedule',
    	title: '프로젝트 일정',
    	iconCls: 'exec-pl-icon'
    },{
        xtype: 'profitloss',
        title: '프로젝트 원가',
        iconCls: 'exec-pl-icon'
    },{
        xtype: 'news',
        title: '주요 이슈',
        iconCls: 'exec-news-icon'
    },{
        xtype: 'quarterly',
        title: '경영지표',
        iconCls: 'exec-quarterly-icon'
    }
    , {
    	xtype: 'goto',
    	title: '<div onmousedown="javascript:lfn_gotoMain();"> >> go to Main</div>'
    	//html: '<img src="/jman32/media/bowtech-logo.png" style="cursor: pointer;" />'
    }
    ],

    // This object is a config for the popup menu we present on very small form factors.
    // It is used by our controller (MainController).
    assistiveMenu: {
        items: [{
            text: 'KPI Overview',
            height: 50,
            iconCls: 'exec-kpi-icon'
        },{
            text: 'Performance',
            height: 50,
            iconCls: 'exec-quarterly-icon'
        },{
            text: 'Profit & Loss',
            height: 50,
            iconCls: 'exec-pl-icon'
        },{
            text: 'Company News',
            height: 50,
            iconCls: 'exec-news-icon'
        }],
        listeners: {
            click: 'onMenuClick'
        }
    }
});
