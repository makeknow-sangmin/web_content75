Ext.define('Rfx.base.BasePanel', {
    extend: 'Ext.panel.Panel',
    frame: false,
    border: false,
    split: true,
    bodyPadding: '1 0 0 0',
    groupId: '',
    createToolbar: function (groupId) {
        console_logs('Rfx.base.BasePanel groupId', groupId);
        console_logs('Rfx.base.BasePanel id', this.id);
        this.groupId = groupId;
        var items = [],
            config = {};
        if (!this.inTab) {
            items.push({
                id: gu.getToolbarId(groupId), //'toolbarPath-' + groupId,
                xtype: 'label',
                width: 650,
                style: 'color:white;',
                html: ''
            });
            items.push('->');

            // if(vSYSTEM_TYPE == 'HANARO') {
            // 	items.push({
            // 		xtype: 'component',
            // 		html: '<span style="font-size:9px; color:white;">' + vCompanySlogan + '</span>'
            // 	});
            // }


            var systemName = (vSYSTEM_TYPE == 'HANARO') ? '하나로MES' : 'RFxMES';
            var version = (vSYSTEM_TYPE == 'HANARO') ? 'v' + vMajor + '.' + vMinor : 'v85';
            var color = (vSYSTEM_TYPE == 'HANARO') ? '#AAA' : '#5C98CD';
            switch (vCompanyReserved4) {
                case 'SKNH01KR':
                    break;
                default:
                    items.push({
                        xtype: 'component',
                        html: '<span style="font-size:9px; font-weight:normal;color:' + color + ';"><i>' + systemName + '</i> on ' + version + '</span>'
                    });
            }

            items.push('-');

            if (vSYSTEM_TYPE != 'HANARO') {
                items.push({
                    xtype: 'checkbox',
                    id: 'chkAuto-' + groupId,
                    boxLabel: '<font color=white>화면유지</font>',
                    css: 'white-font', //style : 'color: #fafafa !important',
                    tip: '작업화면을 유지하면 편리하지만 메모리를 많이 소모합니다.',
                    checked: gMain.getSaveAutoRefresh(),
                    listeners: {
                        change: function (field, newValue, oldValue, eOpts) {
                            console_logs('field', field);
                            console_logs('oldValue', oldValue);
                            console_logs('newValue', newValue);
                            console_logs('eOpts', eOpts);

                            gMain.checkRefresh(newValue);
                        },
                        render: function (c) {
                            Ext.create('Ext.tip.ToolTip', {
                                target: c.getEl(),
                                html: c.tip
                            });
                        }
                    }
                }/*, '-'*/);
            }

            items.push({
                xtype: 'checkbox',
                id: 'chkOpenCrud-' + groupId,
                boxLabel: '<font color=white>자동 창열기</font>',
                style: 'color: #fafafa',
                tip: '상세보기 창을 자동으로 엽니다.',
                hidden: true,
                checked: gMain.getOpenCrudWindow(),
                listeners: {
                    change: function (field, newValue, oldValue, eOpts) {
                        console_logs('field', field);
                        console_logs('oldValue', oldValue);
                        console_logs('newValue', newValue);
                        console_logs('eOpts', eOpts);

                        gMain.checkOpenCrudWindow(newValue);
                    },
                    render: function (c) {
                        Ext.create('Ext.tip.ToolTip', {
                            target: c.getEl(),
                            html: c.tip
                        });
                    }
                }
            }, '-');

            items.push({
                xtype: 'component',
                html: '<div class="searchcon" onClick="openNewWindow();" title="새로운 탭화면 열기"><span class="newwinBT"></span></div>'
                //html: '<div class="inputBT"><button type="button" onClick="openNewWindow();"><span class="search">새창으로 보기</span></button></div>'
            });

            var divStyle = gu.getDivisionStyle();

            if (vSYSTEM_TYPE_SUB == 'RESERVED_SUB03' && EN_USE_ALL_COMCST == true && gUtil.divisions != null && gUtil.divisions.length > 1) {
                items.push('-');
                var divItems = [];

                for (var i = 0; i < gUtil.divisions.length; i++) {
                    var o = gUtil.divisions[i];
                    divItems.push({
                        text: '[' + o.division_code + ']' + o.division_name,
                        value: o.division_code,
                        iconCls: 'division0' + (i + 1),
                        handler: function (r, l) {
                            console_logs('r.value', r.value);
                            top.location.href = vCONTEXT_PATH + '/index/main.do?division_code=' + r.value;
                        }
                    });

                }


                items.push({
                    xtype: 'splitbutton',
                    text: vCUR_DIVISION_CODE,
                    //cls: divStyle,
                    style: 'background: #E6EFEF;',
                    tooltip: '사업부 선택',
                    // handler: function(o, o1) {
                    // 	console_logs('o',o);
                    // 	console_logs('o1', o1);

                    // }, // handle a click on the button itself
                    menu: new Ext.menu.Menu({
                        items: divItems
                    })
                });

                items.push('-');
            }

            var language = '';
            switch (vLANG) {
                case 'ko':
                    language = '한국어';
                    break;
                case 'en':
                    language = 'English';
                    break;
                case 'jp':
                    language = '日本語';
                    break;
                case 'zh':
                    language = '简体中国';
                    break;
                case 'tw':
                    language = '繁體中文';
                    break;
            }

            items.push({
                xtype: 'splitbutton',
                text: language,
                tooltip: 'Language',
                handler: function () {
                }, // handle a click on the button itself
                menu: new Ext.menu.Menu({
                    items: [
                        {
                            text: '한국어', dataIndex: 0, handler: function () {
                            top.location.href = vCONTEXT_PATH + '/index/main.do?selectedLanguage=' + 'ko';
                        }
                        },
                        {
                            text: 'English', dataIndex: 2, handler: function () {
                            top.location.href = vCONTEXT_PATH + '/index/main.do?selectedLanguage=' + 'en';
                        }
                        },
                        {
                            text: '日本語', dataIndex: 3, handler: function () {
                            top.location.href = vCONTEXT_PATH + '/index/main.do?selectedLanguage=' + 'jp';
                        }
                        },
                        {
                            text: '简体中国', dataIndex: 4, handler: function () {
                            top.location.href = vCONTEXT_PATH + '/index/main.do?selectedLanguage=' + 'zh';
                        }
                        },
                        {
                            text: '繁體中文', dataIndex: 5, handler: function () {
                            top.location.href = vCONTEXT_PATH + '/index/main.do?selectedLanguage=' + 'tw';
                        }
                        }
                    ]
                })
            });


            config.items = items;

        } else {
            config.cls = 'x-docked-border-bottom';
        }

        if (gMain.useRefreshOnlyCenterPanel()) {
            config.cls = divStyle;
        } else {
            config.cls = vExtVersion > 5 ? 'my-x-toolbar-default1-3' : 'my-x-toolbar-default';
        }

        return Ext.create('widget.toolbar', config);
    },

    layoutConfig: {columns: 1, rows: 1},
    defaults: {
        collapsible: false,
        split: true,
        cmargins: '2 0 0 0',
        margins: '0 0 0 0'
    },
    bodyPadding: 10,
    initComponent: function () {
//    	console_logs('initComponent', this);
        var myId = this.id;

        this.dockedItems = [this.createToolbar(myId)];

        if (vSYSTEM_TYPE == 'HANARO') {
            //Default Search Value Setting
            //setChartCond 및 getChartCond는 글로벌 함수임.
            // setChartCond(myId, 'TIME_UNIT', 'day');
            // var today = new Date();
            // var prev = new Date();
            // prev.setMonth(prev.getMonth()-1);
            // prev.setDate(prev.getDate() + 1);

            // setChartCond(myId, 'START_DATE', prev);
            // setChartCond(myId, 'END_DATE', today);

            var dayUnitStore = Ext.create('Ext.data.Store', {
                fields: ['codeName', 'codeValue'],
                data: [{
                    codeName: '일', codeValue: 'day'
                }, {
                    codeName: '주', codeValue: 'week'
                }, {
                    codeName: '월', codeValue: 'month'
                }]
            });

            var combobox = Ext.create('Ext.form.ComboBox', {
                fieldStyle: 'background-color: #F5F5F5; background-image: none;',
                mode: 'local',
                editable: false,
                allowBlank: false,
                queryMode: 'remote',
                displayField: 'codeName',
                triggerAction: 'all',
                store: dayUnitStore,
                width: 60,
                cls: 'newCSS',
                disabled: true,
                listConfig: {
                    getInnerTpl: function () {
                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                    }
                },
                listeners: {
                    select: function (combo, record) {
                        console_logs('record select', record);

                        //var codeName = record.get('codeName');
                        var codeValue = record.get('codeValue');
                        //console_logs(codeName, codeValue);
                        //TOTAL_PARAMS[myId] = combo.getValue();
                        setChartCond(myId, 'TIME_UNIT', codeValue);
                    },
                    change: function (sender, newValue, oldValue, opts) {
                        //console_logs('newValue', newValue);
                        //this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
                        //output.setBodyStyle('font-family', "Malgun Gothic, Tahoma");
                    }
                }
            });

            //Default Value Select
            dayUnitStore.each(function (record) {
                // console_logs('dayUnitStore this', this);
                // console_logs('dayUnitStore record', record);
                // console_logs('dayUnitStore myId', myId);

                var codeValue = record.get('codeValue');
                var unit = getChartCond(myId, 'TIME_UNIT');
                // console_logs('codeValue', codeValue);
                // console_logs('unit', unit);
                if (codeValue == unit) {
                    combobox.select(record);
                }
            }, this);

            var srchItems = [];
            //검색 조건
            srchItems.push(
                {
                    xtype: 'tbtext',
                    text: "조회기간:",
                    style: 'color:black;'
                },
                {
                    name: 's_date',
                    value: getChartCond(myId, 'START_DATE'),
                    format: 'Y-m-d',
                    fieldStyle: 'background-color: #F5F5F5; background-image: none;',
                    submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                    dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                    allowBlank: true,
                    xtype: 'datefield',
                    width: 100,
                    listeners: {
                        change: {
                            fn: function (field, newValue, oldValue) {
                                //console_logs('change v', field);
                                //console_logs('change newValue', newValue);
                                //console_logs('change oldValue', oldValue);
                                setChartCond(myId, 'START_DATE', newValue);
                            }
                        }
                    }
                },
                {
                    xtype: 'label',
                    text: "~",
                    style: 'color:black;'
                },
                {
                    name: 'e_date',
                    value: getChartCond(myId, 'END_DATE'),
                    format: 'Y-m-d',
                    fieldStyle: 'background-color: #F5F5F5; background-image: none;',
                    submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                    dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                    allowBlank: true,
                    xtype: 'datefield',
                    width: 99,
                    listeners: {
                        change: {
                            fn: function (field, newValue, oldValue) {
                                // console_logs('change v', field);
                                // console_logs('change newValue', newValue);
                                // console_logs('change oldValue', oldValue);
                                setChartCond(myId, 'END_DATE', newValue);
                            }
                        }
                    }
                },
                '-');

            //var myHtml = '<div class="searchcon"><span class="searchBT"><button type="button" onClick="redrawTotalChartAll(' + "'" + myId + "'" + ');"></button></span></div>';
            var myHtml = '<div class="searchcon"><span class="searchBT"><button type="button" onClick="gm.printEchart(' + "'" + myId + "'" + ');"></button></span></div>';

            srchItems.push({
                xtype: 'component',
                html: myHtml
            });
            srchItems.push('->', '-', {
                xtype: 'tbtext',
                text: "기간단위:"
            }, combobox);

            var id = 'subToolbar-' + this.id;
            console_logs('BasePanel toolbar id', id);
            var subConfig = {
                id: id
            };
            subConfig.items = srchItems;
            subConfig.cls = (vExtVersion > 5) ? 'my-x-toolbar-default1-3-green' : 'my-x-toolbar-default';
            var toolbarSub = Ext.create('widget.toolbar', subConfig);
            toolbarSub.setVisible(false);

            this.dockedItems.push(toolbarSub);

        }

        this.callParent(arguments);
    },
    createPaneMenu: function (paneName, listMenu, onSelect) {
        if (vExtVersion > 5) {
            console_logs('skipped...', 'createPaneMenu');
            return;
            // Ext.create('Ext.panel.Panel', {
            // 	region: 'west',
            // 	width: 0,
            // 	border:0
            // });
        }
        Ext.define('MenuModel', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'name'},
                {name: 'link'}
            ]
        });

        this.store = Ext.create('Ext.data.Store', {
            model: 'MenuModel',
            data: listMenu
        });

        this.west = Ext.create('Ext.Panel', {
            id: this.id + '-menulist',
            frame: true,
            collapsible: true,
            region: 'west',
            width: 160,
            title: paneName,
            items: Ext.create('Ext.view.View', {
                store: this.store,
                tpl: '<tpl for="."><div class="feed-list-item">{name}</div></tpl>', //<span style="font-size:9px;color:#C1493B;font-weight:normal;">({link})</span>
                multiSelect: false,
                //height: 310,
                trackOver: true,
                itemSelector: '.feed-list-item',
                overItemCls: 'feed-list-item-hover',
                emptyText: 'No images to display',
                prepareData: function (data) {
                    Ext.apply(data, {
                        shortName: Ext.util.Format.ellipsis(data.name, 15),
                        sizeString: Ext.util.Format.fileSize(data.size),
                        dateString: Ext.util.Format.date(data.lastmod, "m/d/Y g:i a")
                    });
                    return data;
                },
                listeners: {
                    selectionchange: function (dv, nodes) {
                        //console_logs('nodes', nodes);
                        if (nodes.length > 0) {
                            var rec = nodes[0];
                            gMain.hashTo('#' + gMain.selectedMenuGroup + ':' + rec.get('link'));
                            onSelect(rec);
                        }//endof if
                    }//endof selchange
                }
            })
        });
        return this.west;
    },
    createCenter: function (centerId, arr) {
        // console_logs('createCenter centerId', centerId);
        // console_logs('createCenter arr', arr);
        this.center = Ext.create(
            (vExtVersion > 5) ? 'Rfx.base.CenterPanelTree' : 'Rfx.base.CenterPanel', {
                id: centerId,
                items: arr
            });

        gMain.selMainPanelCenter = this.center;
        return this.center;
    },
    listMenu: null,

    drawChart: function (target) {
        // console_logs('drawChart this.groupId', this.groupId);
        // console_logs('drawChart this.id', this.id);
        //console_logs('drawChart', target);

        // var oDiv = document.getElementById('container'+ this.id);

        // console_logs('oDiv', oDiv);

        // Highcharts.chart(oDiv, {
        // 	chart: {
        // 		type: 'line'
        // 	},
        // 	title: {
        // 		text: '목표대비 생산'
        // 	},
        // 	data: {
        // 		csvURL: 'https://demo-live-data.highcharts.com/time-data.csv',
        // 		enablePolling: true,
        // 		dataRefreshRate: 2
        // 	}
        // });

    },

    getTopHtml: function (id) {
        // alert('Rfx.base.BasePanel: '+vCompanyReserved4);
        // alert('Rfx.base.BasePanel: '+vSYSTEM_TYPE);
        // console_logs('getTopHtml this.groupId', this.groupId);
        // console_logs('getTopHtml id', this.id);
        var ret = '';
        if (vSYSTEM_TYPE == 'HANARO') {
            ret = '<div id="container' + this.id + '" style="min-width: 310px; height: 90%; margin: 0 auto">' + '' + '</div>'
        } else /* if( vCompanyReserved4 != 'KBTC01KR') */{
            ret = '<div style="'
                + 'height:100%;width:100%;background-image: url(' + vContent_full_path + '/company_logo/'
                + vCompanyReserved4 + '.png);'
                + 'background-size: 100px;'
                + 'background-repeat:	no-repeat;'
                + 'background-position: 99% 99%;'
                + 'background-color:#F0F0F0;'
                + 'padding: 10px;'
                + '">';


            for (var i = 0; i < this.listMenu.length; i++) {
                var o = this.listMenu[i];
                var link = o.link;
                var h = window.location.hash;
                var arr = h.split(':');
                // console_logs('link', link);
                // console_logs('h', h);
                //console_logs('window.location.hash', window.location.hash);

                var hashTo = arr[0] + ':' + link;
                console_logs('hashTo', hashTo);

                ret = ret + '<div class="modules-thumb-wrap" role="option" tabindex="-1" data-recordindex="0" data-recordid="25" data-boundview="modulethumbs-1026"><a href="' + hashTo + '" target="" data-tabindex-value="none" tabindex="-1" data-tabindex-counter="1"><div class="modules-thumb-label">' + o.link + '</div><div style="height:100px;">' + o.name + '</div></a><div class="modules-thumb-ear"></div></div>';
            }
            ret = ret + '</div>';
        }

        return ret;
    }
    ,
    createSouth: function () {
        console.log('createSouth', true);
        this.south = Ext.create('Ext.Panel', {
            id: this.id + '-southPain',
            frame: false,
            collapsible: false,
            region: 'south',
            height: 25,
            border: false,
            html: '<div style="width:100%">' +
            '<div style="width:50%; float:left;"><img style="height:20px;" src="' +
            vContent_full_path + '/company_logo/' + vCompanyReserved4 + '.png"></div>' +
            '<div style="width:50%; float:left; font-size:12px; color:#999;text-align:right;">' + vCompanySlogan + '</div>' +
            '</div>'
        });
        return this.south;
    }

});
