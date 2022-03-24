Ext.define('Rfx.app.Main', {
    //extend: 'Ext.app.Application',
    name: 'MagicMES',
    DEF_CRUD_TOOLBAR_MSG: '대기중입니다.',
    checkPcHeight: function () {
        return (this.windowHeight > this.minHeight);
    },
    checkPcWidth: function () {
        return (this.windowWidth > this.minWidth);
    },
    windowHeight: 0,
    minHeight: 580,
    windowWidth: 0,
    minWidth: 1110,
    pageSize: (vCompanyReserved4 == 'KYNL01KR' /*|| vCompanyReserved4 == 'SKNH01KR'*/) ? 1000000 : 100,
    // 선택된 메뉴그룹
    selectedMenuGroup: null,
    selectedMenuGroupName: '',
    // 선택한 메뉴
    selectedMenuId: null,
    // 선택된 메인판넬
    selMainPanel: null,
    selMainPanelName: '',
    // 선택된 메인 판넬센터
    selMainPanelCenter: null,
    // 선택한 메뉴 Object
    selNode: null,
    // 선택한 메뉴 panel
    selPanel: null,
    serverTime: null,
    dateFields: [],
    selLink: '',
    me: function () {
        return this.selPanel;
    },
    // 선택한 그룹 클래스
    groupClass: null,
    values: null,
    // 화면유지
    // saveAutoRefresh: true,
    getSaveAutoRefresh: function () {

        var v = this.myenv['autoRefresh'];

        if (v === undefined) {
            return true;
        } else {
            if (typeof(v) === 'string') {
                return v === 'true';
            } else {
                return v;
            }
        }
        // return this.myenv['autoRefresh'] == undefined ? true
        // 		: this.myenv['autoRefresh'];
    },

    setSaveAutoRefresh: function (b) {
        this.myenv['autoRefresh'] = b;
    },
    setValues: function (o) {
        //console_logs('<Rfx1Main>gMain+++++++++++++++++++++++++', o);
        this.values = o;
        //console_logs('<Rfx1Main>gMain+++++++++++++++++++++++++',this.values);

    },
    returnValues: function () {
        //console_logs('<Rfx1Main>returnValues+++++++++++++++++++++++++',this.values);
        return this.values;

    },

    //메모뷰타입
    getMemoviewType: function () {
        var v = this.myenv['memoviewType'];
        return (v == undefined) ? 'menuItem_cur_only' : v;
    },
    setMemoviewType: function (val) {
        this.setEnv('memoviewType', val);
    },
    getMemoviewTypename: function () {
        var type = this.getMemoviewType();
        //console_logs('<Rfx1Main>memoviewType', type);
        switch (type) {
            case 'menuItem_view_all':
                return '모두 보기';
            case 'menuItem_cur_only':
                return '현재 메모';
            case 'menuItem_hide_all':
                return '모두 끄기';
            default:
                return '----';
        }
    },

    // 자동 창열기
    // openCrudWindow: true,
    getOpenCrudWindow: function () {
        var v = this.myenv['openCrudWindow'];
        // console_logs('<Rfx1Main>getOpenCrudWindow v', v);
        var val = v;
        if (v == undefined || v == null) {
            val = true;
        } else if (v == 'true') {
            val = true;
        } else if (v == 'false') {
            val = false;
        }
        // console_logs('<Rfx1Main>getOpenCrudWindow val', val);
        return val;
    },

    setOpenCrudWindow: function (v) {
        var val = v;
        // console_logs('<Rfx1Main>setOpenCrudWindow v', v);
        if (v == undefined || v == null) {
            val = true;
        } else if (v == 'true') {
            val = true;
        } else if (v == 'false') {
            val = false;
        }
        // console_logs('<Rfx1Main>setOpenCrudWindow val', val);
        this.myenv['openCrudWindow'] = val;
    },

    defToken: 'project-total',

    myenv: {},

    setDefalultEnv: function (o) {

        for (var key in o) {
            var v = o[key];
            var val = v;
            if (v == undefined || v == null) {
                val = true;
            } else if (v == 'true') {
                val = true;
            } else if (v == 'false') {
                val = false;
            }
            this.myenv[key] = val;
        }
    },

    constructor: function (config) {

        this.defToken = config['defToken'];

        this.setDefalultEnv(config);

        this.carTypeStore = Ext.create('Mplm.store.CarTypeStore', {});

        if (vSYSTEM_TYPE_SUB != "HEAVY4") {
            this.carTypeStore.load(function (records) {
                //console_logs('<Rfx1Main>carTypeStore', records);
            });
        } else {
            // this.rackTypeStore =
            // Ext.create('Rfx.store.RackTabStore', {} );
        }


    },
    refreshToolbarPathCore8: function (myClass) {

        var oMain = Ext.getCmp('main-toolbarPath');

        var menuPath = this.selectedMenuGroupName;
        var menuPath2 = '';
        if (this.selMainPanelName != '') {
            menuPath2 = this.selMainPanelName;
            if (myClass != null) {
                menuPath2 = menuPath2 + ' :: ' + myClass;
            }
        }
        console_logs('Main.js refreshToolbarPathCore8', 'setToolbarPath');
        gu.setToolbarPath(this.selectedMenuGroup, menuPath2);

        if (oMain != null) {
            oMain.setHtml(menuPath);
        }
    },

    refreshToolbarPath8: function (myClass) {

        this.refreshToolbarPathCore8(myClass);
        var newTitle = (this.selMainPanelName == null || this.selMainPanelName == '') ? this.selectedMenuGroupName : this.selMainPanelName + '(' + this.selLink + ')';
        if (document.title != newTitle) {
            document.title = newTitle;
        }

    },

    refreshToolbarPathCore: function (myClass) {

        var menuPath = this.selectedMenuGroupName;
        if (this.selMainPanelName != '') {
            menuPath = menuPath + ' :: '
                + this.selMainPanelName;
            if (myClass != null) {
                menuPath = menuPath + ' ' + myClass;
            }
        }
        console_logs('Main.js refreshToolbarPathCore', 'setToolbarPath');
        gu.setToolbarPath(this.selectedMenuGroup, menuPath);

    },
    refreshToolbarPath: function (myClass) {

        this.refreshToolbarPathCore(myClass);
        var newTitle = (this.selMainPanelName == null || this.selMainPanelName == '') ? this.selectedMenuGroupName : this.selMainPanelName + '(' + this.selLink + ')';
        if (document.title != newTitle) {
            document.title = newTitle;
        }

    },
    lastMenu: {
        'equip-state': 'EMC1',
        'sales-delivery': 'calendar',
        'design-plan': 'DDW6',
        'produce-mgmt': 'EPC5',
        'pur-stock': 'PPR3',
        'criterion-info': 'CBB1'
    },
    lastMenuHeavy: {
        'equip-state': 'EMC1',
        'sales-delivery': 'SRO1_SKN',
        'delivery': 'SPS1_MES',
        'design-plan': (vCompanyReserved4 == 'KWLM01KR') ? 'DBM7_PLM' : 'DBM7',
        'produce-mgmt': 'EPC5',
        'pur-stock': 'PPR3',
        'criterion-info': 'AMY2'
    },
    directLinkTo: function (link) {
        this.location.href = url;
    },
    hashTo: function (link) {
        console_logs('<Rfx1Main>############## hashTo link : ', link);
        var pre = link.substring(0, 1);
        if (pre == '#') {
            link = link.substring(1);
        }

        Ext.Ajax.request({
            url: CONTEXT_PATH
            + '/userMgmt/user.do?method=log',
            params: {
                link: link
            },
            success: function (result, request) {
                //console_logs('<Rfx1Main>log inserted', link);
            }
        });

//		if (link == 'project-total'/* || link=='produce-state' */) {
//			Ext.getBody().mask('그래프를 생성중입니다.');
//		}

        //메뉴하일라이트
        var menu = 'menu-' + link;
        var menuOn = menu + 'on';
        try {
            $('.' + menu).removeClass(menu).addClass(menuOn);
        } catch (e) {
            console_logs('<Rfx1Main>메뉴하일라이트', '오류');
            console.info(e);
        }

        // 디포트 서브메뉴만들기
        var arr = link.split(':');

        if (arr.length == 1) {
            var subMenu = null;

            if (vSYSTEM_TYPE_SUB == "HEAVY4") {
                subMenu = this.lastMenuHeavy[arr[0]];
            } else {
                subMenu = this.lastMenu[arr[0]];
            }

            if (subMenu != undefined && subMenu != null) {
                link = arr[0] + ':' + subMenu;
            }
        } else {
            // console_logs('<Rfx1Main>############' + arr[0], arr[1]);
            if (vSYSTEM_TYPE_SUB == "HEAVY4") {
                this.lastMenuHeavy[arr[0]] = arr[1];
            } else {
                this.lastMenu[arr[0]] = arr[1];
            }

            // console_logs('<Rfx1Main>this.lastMenu', this.lastMenu);
        }

        // this.setEnv(/*"MY_ENV", JSON.stringify(myEnv)*/);
        this.setEnv('link', link);

        if (this.getSaveAutoRefresh() == false) {
            var url = CONTEXT_PATH + '/index/main.do' + '#'
                + link;
            window.location = url;
            // window.location.reload();

            return;
        }

        window.location.hash = '#' + link;
        // if(link=='project-total' || link=='produce-state') {
        // Ext.getBody().unmask();
        // }
        // if (gMain.checkPcWidth() == false) {
        // 	//console_logs('<Rfx1Main>gMain.checkPcWidth()==false','close menu');
        // 	gMain.closeMenu();
        // }
        try {
            if (mm != null) {
                mm.redrawAll();
            }
        } catch (e) {
            console_logs('<Rfx1Main>mm.redrawAll(); e', e);
        }
    },

    hashTo8: function (link, linkPath, rec) {
        console_logs('<Rfx1Main>############## hashTo link : ', link);
        var pre = link.substring(0, 1);
        if (pre == '#') {
            link = link.substring(1);
        }

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/userMgmt/user.do?method=log',
            params: {link: link},
            success: function (result, request) {
                console_logs('<Rfx1Main>rfx hashTo8 log inserted', link);
            }
        });

        // 디포트 서브메뉴만들기
        var arr = link.split(':');
        this.setEnv('link', link);

        if (this.getSaveAutoRefresh() == false) {
            var url = CONTEXT_PATH + '/index/main.do' + '#' + link;
            window.location = url;
            return;
        }

        window.location.hash = '#' + link;
        try {
            if (mm != null) {
                mm.redrawAll();
            }
        } catch (e) {
            console_logs('<Rfx1Main>mm.redrawAll(); e', e);
        }
    },
    gotoMenu: function (selMainPanel, menu_link) {
        //console_logs('<Rfx1Main>>>>>>>> gotoMenu menu_link', menu_link);

        if (vExtVersion > 5) {
            Ext.define('MenuModel', {
                extend: 'Ext.data.Model',
                fields: [
                    {name: 'name'},
                    {name: 'link'}
                ]
            });

            var store = Ext.create('Ext.data.Store', {
                model: 'MenuModel',
                data: gu.leftMenuAll
            });

            store.each(function (rec) {
                //console_logs('<Rfx1Main>gotoMenu rec', rec);
                if (menu_link == rec.get('link')) {
                    console_logs('<Rfx1Main>change menu rec  ==>  ', rec);
                    gMain.selChangeMenu(rec);
                    return;
                }
            });

        } else {
            // console_logs('<Rfx1Main>gotoMenu selMainPanel.store ', selMainPanel.store );
            if (selMainPanel.store != null) {
                selMainPanel.store.each(function (rec) {
                    //console_logs('<Rfx1Main>gotoMenu rec', rec);
                    if (menu_link == rec.get('link')) {
                        //console_logs('<Rfx1Main>change menu rec', rec);
                        gMain.selChangeMenu(rec);
                        return;
                    }
                });
            }
        }


    },
    // 그리드 election
    doSelectGrid: function (selections) {
        //console_logs('<Rfx1Main>main===>selections', selections);
        //console_logs('<Rfx1Main>main===>selections.length', selections.length);
        var source = {};
        if (selections.length) {
            var rec = selections[0];
            console_logs('<Rfx1Main>===rec', rec);

            var isPanel = this.getUseNewPropertyPanel();

            if (this.getUseNewPropertyPanel()) {
                //편집이 불가능한 읽기 전용으로 사용

                Ext.each(this.selPanel.fields, function (o, index) {

                    var dataIndex = o['name'];
                    var text = o['text'];
                    var edit = o['canEdit'];
                    var type = o['type'];

                    var v = rec.get(dataIndex);
                    if (v != null && v != undefined) {
                        if (typeof v == 'string') {
                            v = v.replace(new RegExp('<span style="background:#FFEF9D;">', "g"), '')
                                .replace(new RegExp('</span>', "g"), '');
                        }

                        var columns = gm.me().columns;

                        for (var k = 0; k < columns.length; k++) {
                            var column = columns[k];
                            if (column.dataIndex === dataIndex) {
                                var fn = column.renderer;
                                var metadata = {};
                                try {
                                    if (fn !== undefined) {
                                        v = fn(v, metadata, null, null, k + 1, null);
                                    }
                                } catch (e) {
                                    console_logs("main.js  doSelectGrid Error!!")
                                }

                            }
                        }


                        if (gm.getUseNewPropertyPanel()) {
                            if (o['useYn'] === 'Y') {
                                source[dataIndex] = v;
                            }
                        } else {
                            source[dataIndex] = v;
                        }
                    }
                });

            } else {
                Ext.each(this.selPanel.fields, function (o, index) {

                    var dataIndex = o['name'];
                    var text = o['text'];
                    var edit = o['canEdit'];
                    if (edit) {
                        var v = rec.get(dataIndex);
                        if (v != null && v != undefined) {
                            if (typeof v == 'string') {
                                v = v.replace(new RegExp('<span style="background:#FFEF9D;">', "g"), '')
                                    .replace(new RegExp('</span>', "g"), '');
                            }

                            source[dataIndex] = v;
                        }
                    }
                });

                Ext.each(this.selPanel.fields, function (o, index) { // Readonly
                    // console_logs('<Rfx2 AbsMainBase> this.selPanel.fields
                    // o', o);
                    var dataIndex = o['name'];
                    var text = o['text'];
                    var edit = o['canEdit'];
                    if (edit == false) {
                        var v = rec.get(dataIndex);
                        if (v != null && v != undefined) {
                            if (typeof v == 'string') {
                                v = v.replace(new RegExp('<span style="background:#FFEF9D;">', "g"), '')
                                    .replace(new RegExp('</span>', "g"), '');
                            }

                            source[dataIndex] = v;
                        }
                    }
                });
            }

            if (this.selPanel.crudMode == 'CREATE') {
                this.selPanel.crudMode = 'VIEW';
            }
            this.setCrudToolbarMsg('선택되었습니다.');
            this.selPanel.refreshActiveCrudPanel(source, true,
                rec.get('unique_id'), rec);

        } else {
            // console_logs('<Rfx1Main>set', 'VIEW');
            this.selPanel.crudMode = 'VIEW';

            this.setCrudToolbarMsg();
            this.selPanel.refreshActiveCrudPanel(source, false,
                '-1', null);

            // this.openMenu();

        }

        // Edit Form 채우기
        this.selPanel.fillEditForms(selections);

        // Default Selected uid 설정
        if (selections != null) {
            // console_logs('<Rfx1Main>callGridOnCallback', selections);
            if (selections.length) {
                var rec = selections[0];
                gMain.selPanel.vSELECTED_RECORD = rec;
                gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('id');
            } else {
                gMain.selPanel.vSELECTED_RECORD = null;
                gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
            }
            //console_logs('<Rfx1Main>vSELECTED_UNIQUE_ID',
            //		gMain.selPanel.vSELECTED_UNIQUE_ID);

        }
        this.selPanel.callGridOnCallback(selections);

        this.selPanel.selectionedUids = [];
        if (selections != null) {
            for (var i = 0; i < selections.length; i++) {
                try {
                    var rec = selections[i];
                    console_logs('<Rfx1Main>callGridOnCallback rec', rec);
                    this.selPanel.selectionedUids.push(rec.get('id'));
                } catch (e) {
                    console_logs('<Rfx1Main>callback e', e);
                }
                // console_logs('<Rfx1Main>gMain.selPanel.selectionedUids',
                // gMain.selPanel.selectionedUids);

            }
        } else {
            console_logs('<Rfx1Main>callGridOnCallback',
                'selections is null');
        }

    },
    checkMenuCollapsed: function () {
        try {
            return Ext.getCmp(this.selectedMenuGroup + '-menulist').collapsed;
        } catch (e) {
        }

    },
    closeMenu: function () {
        try {
            Ext.getCmp(this.selectedMenuGroup + '-menulist').collapse();
        } catch (e) {
        }


    },
    openMenu: function () {
        try {
            Ext.getCmp(this.selectedMenuGroup + '-menulist').expand();
        } catch (e) {
        }


    },
    getGridId: function () {
        return this.selectedMenuId + '-grid';
    },
    STD_NAME_ARR: [],
    checkPcsName: function (inStr) {

        for (var i = 0; i < this.STD_NAME_ARR.length; i++) {
            if (inStr.toUpperCase() == this.STD_NAME_ARR[i].toUpperCase()) {
                return true;
            }
        }

        return false;
    },


    callBackPcsStep: function (title, records, arg, fc, id) {

        var gridId = id == null ? this.getGridId() : id;

        var o = this.parseGridRecord(records, gridId);
        var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];
        // 소팅기준
        var sortBy = o['sortBy'];

        var modelClass = arg['model'];
        var pageSize = arg['pageSize'];
        var sorters = arg['sorters'];
        var dockedItems = arg['dockedItems'];
        var model = Ext.create(modelClass, {
            fields: fields
        });
        var store = new Ext.data.Store({
            pageSize: pageSize,
            model: model,
            sorters: sorters
        });


        var mySorters = [{
            property: 'p.serial_no',
            direction: 'ASC'
        }];

        store.getProxy().setExtraParam('sort',
            JSON.stringify(mySorters));

        // console_logs('<Rfx1Main>gridId', gridId);

        var cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1
        });

        var pcsNameStore = Ext.create(
            'Rfx.store.ProcessNameStore', {
                hasNull: true
            });
        var supplierStore = Ext.create(
            'Mplm.store.SupastStore', {
                hasOwn: true
            });
        var machineStore = Ext.create(
            'Mplm.store.MachineStore', {
                hasNull: true
            });
        var pcsCodeStore = Ext.create(
            'Rfx.store.PcsCodeStore', {
                hasOwn: true
            });

        pcsCodeStore.load(function () {
        });

        pcsNameStore.load(function (records) {
            console_log(records);
            if (records != undefined) {

                for (var i = 0; i < records.length; i++) {
                    var obj = records[i];

                    var system_code = obj.get('systemCode');
                    console_log("system_code>>>>>>>>>>>>" + system_code);
                    gMain.STD_NAME_ARR.push(system_code);
                }
            }
        });

        Ext.each(
            columns,
            function (o, index) {
                o['sortable'] = false;

                switch (o['dataIndex']) {
                    case 'serial_no':
                    case 'std_mh':
                        o['editor'] = {
                            allowBlank: false
                        };
                        break;
                    case 'plan_date':
                        o['xtype'] = 'datecolumn';
                        o['format'] = 'Y-m-d',
                            o['dateFormat'] = 'Y-m-d',
                            o['submitFormat'] = 'Y-m-d',
                            o['editor'] = {
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                dateFormat: 'Y-m-d',
                                submitFormat: 'Y-m-d',
                                minValue: '2016-01-01',
                                editable: false
                                // disabledDays: [0, 6],
                                // disabledDaysText:
                                // 'Plants are not
                                // available on the
                                // weekends'
                            };
                        break;
                    case 'plan_qty':
                        o['style'] = 'text-align:right';
                        o['align'] = 'right';
                        o['editor'] = {
                            allowBlank: false,
                            xtype: 'numberfield',
                            allowBlank: false,
                            minValue: 0
                        };
                        break;
                    case 'pcs_name':
                        o['editor'] = new Ext.form.field.ComboBox(
                            {
                                typeAhead: true,
                                triggerAction: 'all',
                                displayField: 'codeName',
                                valueField: 'codeName',
                                editable: false,
                                store: pcsNameStore,
                                listConfig: {
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                                    }
                                },
                                listeners: {
                                    select: function (combo,
                                                      record) {
                                        var systemCode = record.get('systemCode');
                                        var code_order2 = record.get('code_order2');
                                        gMain.selPanel.selectPcsRecord.set(
                                            'pcs_code',
                                            systemCode);
                                        gMain.selPanel.selectPcsRecord.set(
                                            'std_mh',
                                            code_order2);
                                        //console_logs(	'selectPcsRecord',	gMain.selPanel.selectPcsRecord);
                                    }
                                }
                            });
                        break;
                    case 'seller_name':
//								o['editor'] = new Ext.form.field.ComboBox(
//										{
//											typeAhead : true,
//											triggerAction : 'all',
//											displayField : 'supplier_name',
//											valueField : 'supplier_name',
//											editable : false,
//											store : supplierStore,
//											listConfig : {
//												getInnerTpl : function() {
//													return '<div data-qtip="{supplier_code}">{supplier_name}</div>';
//												}
//											},
//											listeners : {
//												select : function(
//														combo,
//														record) {
//													var seller_uid = record.get('unique_id');
//													gMain.selPanel.selectPcsRecord.set(
//																	'seller_uid',
//																	seller_uid);
//
//												}
//											}
//										});
//								break;
                    case 'machine_name':
//								o['editor'] = new Ext.form.field.ComboBox(
//										{
//											typeAhead : true,
//											triggerAction : 'all',
//											displayField : 'name_ko',
//											valueField : 'name_ko',
//											editable : false,
//											store : machineStore,
//											listConfig : {
//												getInnerTpl : function() {
//													return '<div data-qtip="{mchn_code}">{name_ko}</div>';
//												}
//											},
//											listeners : {
//												select : function(
//														combo,
//														record) {
//													var machine_uid = record.get('unique_id');
////																	console_logs(
////																			'machine_uid',
////																			machine_uid);
//													gMain.selPanel.selectPcsRecord.set(
//																	'machine_uid',
//																	machine_uid);
//
//												}
//											}
//										});
                        break;

                    case 'description':
                    case 'comment':
                        o['editor'] = {
                            allowBlank: true
                        };
                }
            });


        var grid = null;
        if (this.addRowActionBoolean == true) {
            //console_logs(this.addRowActionBoolean);

            var addRowAction = Ext.create(
                'Ext.Action',
                {
                    iconCls: 'af-plus-circle',
                    text: '추가',
                    disabled: false,
                    handler: function () {

                        Ext.Ajax.request({

                            url: CONTEXT_PATH
                            + '/index/process.do?method=insertPcsStdRow',
                            params: {
                                assymapUid: gMain.selPanel.vSELECTED_UNIQUE_ID
                            },
                            success: function (result,
                                               request) {
                                var processGrid = Ext.getCmp(id);
                                processGrid.getStore().load();
                            },
                            failure: extjsUtil.failureMessage
                        });


                    }
                });


        } else {
            var addRowAction = Ext.create(
                'Ext.Action',
                {
                    iconCls: 'af-plus-circle',
                    text: '추가',
                    disabled: false,
                    handler: function () {
                        var rec = grid.getSelectionModel().getSelection()[0];
                        // console_logs('<Rfx1Main>rec', rec);
                        Ext.Ajax.request({
                            url: CONTEXT_PATH
                            + '/index/process.do?method=copyPcsStdRow',
                            params: {
                                fromUid: rec.get('id'),
                                assymapUid: gMain.selPanel.vSELECTED_UNIQUE_ID
                            },
                            success: function (result,
                                               request) {
                                var processGrid = Ext.getCmp(id);
                                processGrid.getStore().load();
                            },
                            failure: extjsUtil.failureMessage
                        });
                    }
                });
        }
        var removeRowAction = Ext.create(
            'Ext.Action',
            {
                iconCls: 'af-remove',
                text: gm.getMC('CMD_DELETE', '삭제'),
                tooltip: '삭제하기',
                disabled: false,
                handler: function (widget, event) {

                    var rec = grid
                        .getSelectionModel()
                        .getSelection()[0];
                    // /console_logs('<Rfx1Main>rec', rec);
                    Ext.Ajax.request({
                        url: CONTEXT_PATH
                        + '/index/process.do?method=deletePcsStdRow',
                        params: {
                            targetUid: rec
                                .get('id'),
                            assymapUid: gMain.selPanel.vSELECTED_UNIQUE_ID
                        },
                        success: function (result,
                                           request) {
                            var processGrid = Ext
                                .getCmp(id);
                            processGrid
                                .getStore()
                                .load();
                        },
                        failure: extjsUtil.failureMessage
                    });

                }
            });
        var supastcombo = {
            id: gu.id('supastcombo'),
            xtype: 'combo',
            mode: 'local',
            editable: false,
            width: 160,
            queryMode: 'remote',
            emptyText: '외주업체',
            displayField: 'supplier_name',
            valueField: 'unique_id',
            editable: false,
            forceSelection: true,
            store: gm.supastPcsStore,
            triggerAction: 'all',
            listConfig: {
                getInnerTpl: function () {
                    return '<div data-qtip="{supplier_code} : {supplier_name}"><small>{supplier_name}</small></div>';
                }
            },
            triggerAction: 'all',
            listeners: {
                select: function (combo, record) {
                    var seller_uid = record.get('unique_id');
                    var supplier_name = record.get('supplier_name');
                    console_logs('<Rfx1Main>supastcombo/seller_uid', seller_uid);

                    if (gm.me().selectPcsRecord == null) {
                        Ext.MessageBox.alert('선택 확인', '선택한 공정레코드가 없습니다.');
                        return;
                    } else {
                        var rec = gm.me().selectPcsRecord
                        console_logs('<Rfx1Main>파아아ㅏ아아 rec', rec);
                        rec.set('seller_name', supplier_name);
                        rec.set('seller_uid', seller_uid);
                        rec.commit();


                        console_logs('<Rfx1Main>rec commit', rec);

                        var unique_id = gm.me().selectPcsRecord.data.unique_id;
                        console_logs('<Rfx1Main>target unique_uid', unique_id);
                        //tells the Proxy to save the Model. In this case it will perform a PUT request to /users/123 as this Model already has an id
                        var gridStore = Ext.create('Rfx.store.PcsStdStore');
                        gridStore.getProxy().setExtraParam("srch_type", "updatePcsastSeller");
                        gridStore.getProxy().setExtraParam("seller_uid", seller_uid);
                        gridStore.getProxy().setExtraParam("unique_id", unique_id);
                        gridStore.load(function (records) {
                        });
                        rec.save({
                            success: function () {
                                console_logs('<Rfx1Main>success', '??');
                                gridStore.getProxy().setExtraParam("srch_type", null);
                                gridStore.getProxy().setExtraParam("seller_uid", null);
                                gridStore.getProxy().setExtraParam("unique_id", null);
                            }
                        });

                    }
                }
            }
        };
        var mchncombo = {
            id: gu.id('mchncombo'),
            xtype: 'combo',
            mode: 'local',
            editable: false,
            width: 160,
            queryMode: 'remote',
            emptyText: '설비명',
            displayField: 'name_ko',
            valueField: 'unique_id',
            editable: false,
            forceSelection: true,
            store: gm.mchnPcsStore,
            triggerAction: 'all',
            listConfig: {
                getInnerTpl: function () {
                    return '<div data-qtip="{mchn_code} : {name_ko}"><small>{name_ko}</small></div>';
                }
            },
            triggerAction: 'all',
            listeners: {
                select: function (combo, record) {
                    var mchn_uid = record.get('unique_id');
                    var machine_name = record.get('name_ko');
                    console_logs('<Rfx1Main>supastcombo/mchn_uid', mchn_uid);

                    if (gm.me().selectPcsRecord == null) {
                        Ext.MessageBox.alert('선택 확인', '선택한 공정레코드가 없습니다.');
                        return;
                    } else {
                        var rec = gm.me().selectPcsRecord
                        console_logs('<Rfx1Main>카아아ㅏ아아 rec', rec);
                        rec.set('machine_name', machine_name);
                        rec.set('mchn_uid', mchn_uid);
                        rec.commit();


                        console_logs('<Rfx1Main>rec commit', rec);

                        var unique_id = gm.me().selectPcsRecord.data.unique_id;
                        console_logs('<Rfx1Main>target unique_uid', unique_id);
                        //tells the Proxy to save the Model. In this case it will perform a PUT request to /users/123 as this Model already has an id
                        var gridStore1 = Ext.create('Rfx.store.PcsStdStore');
                        gridStore1.getProxy().setExtraParam("srch_type", "updatePcsastMchn");
                        gridStore1.getProxy().setExtraParam("mchn_uid", mchn_uid);
                        gridStore1.getProxy().setExtraParam("unique_id", unique_id);
                        gridStore1.load(function (records) {
                        });
                        rec.save({
                            success: function () {
                                gridStore1.getProxy().setExtraParam("srch_type", null);
                                gridStore1.getProxy().setExtraParam("mchn_uid", null);
                                gridStore1.getProxy().setExtraParam("unique_id", null);
                            }
                        });

                    }
                }
            }
        };
        dockedItems.push(
            {
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default3',
                items: ['-', addRowAction, removeRowAction, '->', supastcombo, mchncombo
                    //,
                ]
            });

        var contextMenu = Ext.create('Ext.menu.Menu', {
            items: [addRowAction, removeRowAction]
        });
        Ext.FocusManager.enable({
            focusFrame: true
        });
        grid = Ext
            .create(
                'Ext.grid.Panel',
                {
                    id: gridId,
                    store: store,
                    title: title,
                    cls: 'rfx-panel',
                    border: true,
                    resizable: true,
                    scroll: true,
                    multiSelect: true,
                    collapsible: false,
                    layout: 'fit',
                    //forceFit : true,
                    dockedItems: dockedItems,
                    plugins: [cellEditing],
                    listeners: {
                        itemcontextmenu: function (view, rec, node, index,
                                                   e) {
                            e.stopEvent();
                            contextMenu.showAt(e
                                .getXY());
                            return false;
                        },
                        select: function (selModel,
                                          record, index, options) {
                            console_logs('<Rfx1Main>index:', index);
                            console_logs('<Rfx1Main>record:', record);

                            // var pcs_code =
                            // record.get('pcs_code');

                            // supplierStore.getProxy().setExtraParam('pcs_code',
                            // pcs_code);
                            // supplierStore.load();

                            try {
                                Ext
                                    .getCmp('recvPoPcsGrid').editingPlugin
                                    .startEdit(
                                        record,
                                        1);

                            } catch (e) {
                            }

                        },
                        itemdblclick: function (view,
                                                record, htmlItem,
                                                index, eventObject,
                                                opts) {

                        }, // endof itemdblclick
                        cellkeydown: function (gridPcsStd, td,
                                               cellIndex, record, tr,
                                               rowIndex, e, eOpts) {
                            console_logs(
                                '++++++++++++++++++++ e.getKey()',
                                e.getKey());

                            if (e.getKey() == Ext.EventObject.ENTER) {

                                //console_logs("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!cellIndex-------------",	cellIndex);
                                //console_logs("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!rowIndex-------------",	rowIndex);


                                // Ext.getCmp('pcs_code').focus(true,100);
                                // addPcsStd();
                                // var pcs_name =
                                // record.get('pcs_name');
                                // if(checkPcsName(pcs_name)){
                                // savePcsStd();
                                // } else {
                                // alert(pcs_name+'
                                // don\'t exist!');

                                // }

                                // save

                            }

                        }
                    },// endof listeners
                    columns: columns
                });
        grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                fc(selections);
            }
        });

        var view = grid.getView();

        var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
            down: function (e) {
                var selectionModel = grid.getSelectionModel();
                var select = 0; // select first if no record is
                                // selected
                if (selectionModel.hasSelection()) {
                    select = grid.getSelectionModel()
                            .getSelection()[0].index + 1;
                }
                view.select(select);
                // quickSearch.focus(); // to get focus back to
                // the input
            },
            up: function (e) {
                var selectionModel = grid.getSelectionModel();
                var select = grid.store.totalCount - 1; // select
                                                        // last
                                                        // element
                                                        // if no
                                                        // record
                                                        // is
                                                        // selected
                if (selectionModel.hasSelection()) {
                    select = grid.getSelectionModel()
                            .getSelection()[0].index - 1;
                }
                view.select(select);
                // quickSearch.focus(); // to get focus back to
                // the input
            }
        });

        grid.on('keypress',
            function (t, e) {
                // if (e.getKey() == Ext.EventObject.TAB) {
                console_logs(
                    "grid.on('keypress', function(k) ",
                    k);
                console_logs(
                    "grid.on('keypress', function(e) ",
                    e);
                // }
            }, this);

        var tabPanel = Ext.getCmp(this.geTabPanelId());

        tabPanel.add(grid);

    }, callBackAssy: function (title, records, arg, fc, id) {

        var gridId = id == null ? this.getGridId() : id;

        var o = this.parseGridRecord(records, gridId);
        var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];
        // 소팅기준
        var sortBy = o['sortBy'];

        var modelClass = arg['model'];
        var pageSize = arg['pageSize'];
        var sorters = arg['sorters'];
        var dockedItems = arg['dockedItems'];
        var model = Ext.create(modelClass, {
            fields: fields
        });
        var store = new Ext.data.Store({
            pageSize: pageSize,
            model: model,
            sorters: sorters
        });

        var mySorters = [{
            property: 'p.serial_no',
            direction: 'ASC'
        }];

        store.getProxy().setExtraParam('sort',
            JSON.stringify(mySorters));

        // console_logs('<Rfx1Main>gridId', gridId);

        var cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1
        });

        var pcsNameStore = Ext.create(
            'Rfx.store.ProcessNameStore', {
                hasNull: true
            });
        var supplierStore = Ext.create(
            'Mplm.store.SupastStore', {
                hasOwn: true
            });
        var machineStore = Ext.create(
            'Mplm.store.MachineStore', {
                hasNull: true
            });

        var standardFlagStore = Ext.create(
            'Mplm.store.StandardFlagStore', {});

        var pcsCodeStore = Ext.create(
            'Rfx.store.PcsCodeStore', {
                hasOwn: true
            });

        pcsCodeStore.load(function () {
        });

        pcsNameStore.load(function (records) {
            console_log(records);
            if (records != undefined) {

                for (var i = 0; i < records.length; i++) {
                    var obj = records[i];

                    var system_code = obj.get('systemCode');
                    console_log("system_code>>>>>>>>>>>>" + system_code);
                    gMain.STD_NAME_ARR.push(system_code);
                }
            }
        });

        Ext.each(
            columns,
            function (o, index) {
                o['sortable'] = false;

                switch (o['dataIndex']) {
                    case 'serial_no':
                    case 'pl_no':
                        o['editor'] = {
                            allowBlank: false
                        };
                        break;
                    case 'plan_date':
                        o['xtype'] = 'datecolumn';
                        o['format'] = 'Y-m-d',
                            o['dateFormat'] = 'Y-m-d',
                            o['submitFormat'] = 'Y-m-d',
                            o['editor'] = {
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                dateFormat: 'Y-m-d',
                                submitFormat: 'Y-m-d',
                                minValue: '2016-01-01',
                                editable: false
                                // disabledDays: [0, 6],
                                // disabledDaysText:
                                // 'Plants are not
                                // available on the
                                // weekends'
                            };
                        break;
                    case 'plan_qty':
                    case 'bm_quan':
                        o['style'] = 'text-align:right';
                        o['align'] = 'right';
                        o['editor'] = {
                            allowBlank: false,
                            xtype: 'numberfield',
                            allowBlank: false,
                            minValue: 0
                        };
                        break;
                    case 'pcs_name':
                        o['editor'] = new Ext.form.field.ComboBox(
                            {
                                typeAhead: true,
                                triggerAction: 'all',
                                displayField: 'codeName',
                                valueField: 'codeName',
                                editable: false,
                                store: pcsNameStore,
                                listConfig: {
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                                    }
                                },
                                listeners: {
                                    select: function (combo,
                                                      record) {
                                        var systemCode = record.get('systemCode');
                                        gMain.selPanel.selectPcsRecord.set(
                                            'pcs_code',
                                            systemCode);
                                        //console_logs(	'selectPcsRecord',	gMain.selPanel.selectPcsRecord);
                                    }
                                }
                            });
                        break;
                    case 'sp_code':
                        o['editor'] = new Ext.form.field.ComboBox(
                            {
                                typeAhead: true,
                                triggerAction: 'all',
                                displayField: 'code_name_kr',
                                valueField: 'system_code',
                                editable: false,
                                store: standardFlagStore,
                                listConfig: {
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                                    }
                                },
//											listeners : {
//												select : function(
//														combo,
//														record) {
//													var systemCode = record.get('systemCode');
//													gMain.selPanel.selectPcsRecord.set(
//																	'pcs_code',
//																	systemCode);
//													//console_logs(	'selectPcsRecord',	gMain.selPanel.selectPcsRecord);
//												}
//											}
                            });
                        break;
                    case 'seller_name':
                        o['editor'] = new Ext.form.field.ComboBox(
                            {
                                typeAhead: true,
                                triggerAction: 'all',
                                displayField: 'supplier_name',
                                valueField: 'supplier_name',
                                editable: false,
                                store: supplierStore,
                                listConfig: {
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{supplier_code}">{supplier_name}</div>';
                                    }
                                },
                                listeners: {
                                    select: function (combo,
                                                      record) {
                                        var seller_uid = record.get('unique_id');
                                        gMain.selPanel.selectPcsRecord.set(
                                            'seller_uid',
                                            seller_uid);

                                    }
                                }
                            });
                        break;
                    case 'machine_name':
                        o['editor'] = new Ext.form.field.ComboBox(
                            {
                                typeAhead: true,
                                triggerAction: 'all',
                                displayField: 'name_ko',
                                valueField: 'name_ko',
                                editable: false,
                                store: machineStore,
                                listConfig: {
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{mchn_code}">{name_ko}</div>';
                                    }
                                },
                                listeners: {
                                    select: function (combo,
                                                      record) {
                                        var machine_uid = record.get('unique_id');
//																	console_logs(
//																			'machine_uid',
//																			machine_uid);
                                        gMain.selPanel.selectPcsRecord.set(
                                            'machine_uid',
                                            machine_uid);

                                    }
                                }
                            });
                        break;

                    case 'description_src':
                    case 'remark_src':
                    case 'comment':
                    case 'item_name':
                    case 'specification':
                        o['editor'] = {
                            allowBlank: true
                        };
                }
            });

        // columns.push({
        // xtype: 'actioncolumn',
        // width: 30,
        // sortable: false,
        // menuDisabled: true,
        // items: [{
        // icon:
        // '/extjs5/module/shared/icons/font-awesome16/lsf-remove_12_0_ba4459_none.png',
        // tooltip: 'Delete Plant',
        // scope: this,
        // handler: this.onRemoveClick
        // }]
        // });

        var grid = null;
        if (this.addRowActionBoolean == true) {
            //console_logs(this.addRowActionBoolean);
            var addRowAction = Ext.create(
                'Ext.Action',
                {
                    iconCls: 'af-plus-circle',
                    text: '추가',
                    disabled: false,
                    handler: function () {
//											var rec = grid
//													.getSelectionModel()
//													.getSelection()[0];
                        // console_logs('<Rfx1Main>rec', rec);
                        console_logs("gMain.selPanel.link2>>>>>>>>>" + gMain.selPanel.link);

                        Ext.Ajax.request({

                            url: CONTEXT_PATH
                            + '/index/process.do?method=insertAssembly',
                            params: {
                                parent_uid: gMain.selPanel.vSELECTED_UNIQUE_ID
                            },
                            success: function (result,
                                               request) {
                                var processGrid = Ext.getCmp(id);
                                processGrid.getStore().load();
                            },
                            failure: extjsUtil.failureMessage
                        });


                    }
                });


        } else {
            var addRowAction = Ext.create('Ext.Action', {
                iconCls: 'af-plus-circle',
                text: '추가',
                disabled: false,
                handler: function () {
                    var rec = grid.getSelectionModel().getSelection()[0];
                    // console_logs('<Rfx1Main>rec', rec);
                    Ext.Ajax.request({
                        url: CONTEXT_PATH
                        + '/index/process.do?method=copyAssemblyRow',
                        params: {
                            fromUid: rec.get('id'),
                            assymapUid: gMain.selPanel.vSELECTED_UNIQUE_ID
                        },
                        success: function (result,
                                           request) {
                            var processGrid = Ext.getCmp(id);
                            processGrid.getStore().load();
                        },
                        failure: extjsUtil.failureMessage
                    });
                }
            });
        }
        var removeRowAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: '삭제하기',
            disabled: false,
            handler: function (widget, event) {

                var rec = grid
                    .getSelectionModel()
                    .getSelection()[0];
                // /console_logs('<Rfx1Main>rec', rec);
                Ext.Ajax.request({
                    url: CONTEXT_PATH
                    + '/index/process.do?method=deletePcsStdRow',
                    params: {
                        targetUid: rec
                            .get('id'),
                        assymapUid: gMain.selPanel.vSELECTED_UNIQUE_ID
                    },
                    success: function (result,
                                       request) {
                        var processGrid = Ext
                            .getCmp(id);
                        processGrid
                            .getStore()
                            .load();
                    },
                    failure: extjsUtil.failureMessage
                });

            }
        });

        dockedItems.push(
            {
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default3',
                items: ['-', addRowAction, removeRowAction]
            });

        var contextMenu = Ext.create('Ext.menu.Menu', {
            items: [addRowAction, removeRowAction]
        });
        Ext.FocusManager.enable({
            focusFrame: true
        });
        grid = Ext.create(
            'Ext.grid.Panel',
            {
                id: gridId,
                store: store,
                title: title,
                cls: 'rfx-panel',
                border: true,
                resizable: true,
                scroll: true,
                multiSelect: true,
                collapsible: false,
                layout: 'fit',
                //forceFit : true,
                dockedItems: dockedItems,
                plugins: [cellEditing],
                listeners: {
                    itemcontextmenu: function (view, rec, node, index,
                                               e) {
                        e.stopEvent();
                        contextMenu.showAt(e
                            .getXY());
                        return false;
                    },
                    select: function (selModel,
                                      record, index, options) {
                        console_logs('<Rfx1Main>index:',
                            index);
                        console_logs('<Rfx1Main>record:',
                            record);

                        try {
                            Ext
                                .getCmp('recvPoPcsGrid').editingPlugin
                                .startEdit(
                                    record,
                                    1);

                        } catch (e) {
                        }

                    },
                    itemdblclick: function (view,
                                            record, htmlItem,
                                            index, eventObject,
                                            opts) {

                    }, // endof itemdblclick
                    cellkeydown: function (gridPcsStd, td,
                                           cellIndex, record, tr,
                                           rowIndex, e, eOpts) {
                        console_logs(
                            '++++++++++++++++++++ e.getKey()',
                            e.getKey());

                        if (e.getKey() == Ext.EventObject.ENTER) {

                        }

                    }
                },// endof listeners
                columns: columns
            });
        grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                fc(selections);
            }
        });

        var view = grid.getView();

        var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
            down: function (e) {
                var selectionModel = grid.getSelectionModel();
                var select = 0; // select first if no record is
                                // selected
                if (selectionModel.hasSelection()) {
                    select = grid.getSelectionModel()
                            .getSelection()[0].index + 1;
                }
                view.select(select);
                // quickSearch.focus(); // to get focus back to
                // the input
            },
            up: function (e) {
                var selectionModel = grid.getSelectionModel();
                var select = grid.store.totalCount - 1; // select
                                                        // last
                                                        // element
                                                        // if no
                                                        // record
                                                        // is
                                                        // selected
                if (selectionModel.hasSelection()) {
                    select = grid.getSelectionModel()
                            .getSelection()[0].index - 1;
                }
                view.select(select);
                // quickSearch.focus(); // to get focus back to
                // the input
            }
        });

        grid.on('keypress',
            function (t, e) {
                // if (e.getKey() == Ext.EventObject.TAB) {
                console_logs(
                    "grid.on('keypress', function(k) ",
                    k);
                console_logs(
                    "grid.on('keypress', function(e) ",
                    e);
                // }
            }, this);

        var tabPanel = Ext.getCmp(this.geTabPanelId());

        tabPanel.add(grid);
    },
    callBackPcsTpl: function (title, records, arg, fc, id) {

        var gridId = id == null ? this.getGridId() : id;

        var o = this.parseGridRecord(records, gridId);
        var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];
        // 소팅기준
        var sortBy = o['sortBy'];

        var modelClass = arg['model'];
        var pageSize = arg['pageSize'];
        var sorters = arg['sorters'];
        var dockedItems = arg['dockedItems'];
        var model = Ext.create(modelClass, {
            fields: fields
        });
        var store = new Ext.data.Store({
            pageSize: pageSize,
            model: model,
            sorters: sorters
        });

        var mySorters = [{
            property: 'pcstpl.serial_no',
            direction: 'ASC'
        }];

        store.getProxy().setExtraParam('sort',
            JSON.stringify(mySorters));

        // console_logs('<Rfx1Main>gridId', gridId);

        var cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1
        });

        var pcsNameStore = Ext.create('Rfx.store.ProcessNameStore', {
            hasNull: true
        });
        var pcsTypeStore = Ext.create('Mplm.store.CommonCodeStore', {
            hasNull: true,
            parentCode: 'PcsType'
        });
        var pcsCodeStore = Ext.create(
            'Rfx.store.PcsCodeStore', {
                hasOwn: true
            });

        pcsCodeStore.load(function () {
        });

        pcsNameStore.load(function (records) {
            console_log(records);
            if (records != undefined) {

                for (var i = 0; i < records.length; i++) {
                    var obj = records[i];

                    var system_code = obj.get('systemCode');
                    console_log("system_code>>>>>>>>>>>>" + system_code);
                    gMain.STD_NAME_ARR.push(system_code);
                }
            }
        });

        Ext.each(
            columns,
            function (o, index) {
                o['sortable'] = false;

                switch (o['dataIndex']) {
                    case 'serial_no':
                        o['editor'] = {
                            allowBlank: false
                        };
                        break;
                    case 'plan_date':
                        o['xtype'] = 'datecolumn';
                        o['format'] = 'Y-m-d',
                            o['dateFormat'] = 'Y-m-d',
                            o['submitFormat'] = 'Y-m-d',
                            o['editor'] = {
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                dateFormat: 'Y-m-d',
                                submitFormat: 'Y-m-d',
                                minValue: '2016-01-01',
                                editable: false
                                // disabledDays: [0, 6],
                                // disabledDaysText:
                                // 'Plants are not
                                // available on the
                                // weekends'
                            };
                        break;
                    case 'sub_qty':
//							case 'plan_qty':
                        o['style'] = 'text-align:right';
                        o['align'] = 'right';
                        o['editor'] = {
                            allowBlank: false,
                            xtype: 'numberfield',
                            allowBlank: false,
                            minValue: 0
                        };
                        break;
                    case 'pcs_code':
                        o['editor'] = new Ext.form.field.ComboBox(
                            {
                                typeAhead: true,
                                triggerAction: 'all',
                                displayField: 'codeName',
                                valueField: 'systemCode',
                                editable: false,
                                store: pcsCodeStore,
                                listConfig: {
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{systemCode}">[{systemCode}]{codeName}</div>';
                                    }
                                },
                                listeners: {
                                    select: function (combo,
                                                      record) {
                                        var systemCode = record.get('systemCode');
                                        var codeName = record.get('codeName');
                                        gMain.selPanel.selectPcsRecord.set('pcs_code', systemCode);
                                        gMain.selPanel.selectPcsRecord.set('pcs_name', codeName);
                                        //console_logs(	'selectPcsRecord',	gMain.selPanel.selectPcsRecord);
                                    }
                                }
                            });
                        break;
                    case 'pcs_name':
                        o['editor'] = new Ext.form.field.ComboBox(
                            {
                                typeAhead: true,
                                triggerAction: 'all',
                                displayField: 'codeName',
                                valueField: 'codeName',
                                editable: false,
                                store: pcsNameStore,
                                listConfig: {
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                                    }
                                },
                                listeners: {
                                    select: function (combo,
                                                      record) {
                                        var systemCode = record.get('systemCode');
                                        var codeName = record.get('codeName');
                                        gMain.selPanel.selectPcsRecord.set('pcs_code', systemCode);
                                        gMain.selPanel.selectPcsRecord.set('pcs_name', codeName);
                                        //console_logs(	'selectPcsRecord',	gMain.selPanel.selectPcsRecord);
                                    }
                                }
                            });
                        break;
                    case 'pcs_type':
                        o['editor'] = new Ext.form.field.ComboBox(
                            {
                                typeAhead: true,
                                triggerAction: 'all',
                                displayField: 'codeName',
                                valueField: 'codeName',
                                editable: false,
                                store: pcsTypeStore,
                                listConfig: {
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                                    }
                                },
                                listeners: {
                                    select: function (combo, record) {
                                        var systemCode = record.get('systemCode');
                                        gMain.selPanel.selectPcsRecord.set('pcs_type', systemCode);
                                        //console_logs(	'selectPcsRecord',	gMain.selPanel.selectPcsRecord);
                                    }
                                }
                            });
                        break;
                    case 'prev_stock_reduce':
                    case 'is_replace':
                        o['editor'] = new Ext.form.field.ComboBox(
                            {
                                typeAhead: true,
                                triggerAction: 'all',
                                displayField: 'codeName',
                                valueField: 'codeName',
                                editable: false,
                                store: Ext.create('Mplm.store.CommonCodeStore', {
                                    hasNull: true,
                                    parentCode: 'YN'
                                }),
                                listConfig: {
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                                    }
                                },
                                listeners: {
                                    select: function (combo, record) {
                                        var systemCode = record.get('systemCode');
                                        gMain.selPanel.selectPcsRecord.set('is_replace', systemCode);
                                        //console_logs(	'selectPcsRecord',	gMain.selPanel.selectPcsRecord);
                                    }
                                }
                            });
                        break;
                    case 'seller_name':
//								o['editor'] = new Ext.form.field.ComboBox(
//										{
//											typeAhead : true,
//											triggerAction : 'all',
//											displayField : 'supplier_name',
//											valueField : 'supplier_name',
//											editable : false,
//											store : supplierStore,
//											listConfig : {
//												getInnerTpl : function() {
//													return '<div data-qtip="{supplier_code}">{supplier_name}</div>';
//												}
//											},
//											listeners : {
//												select : function(
//														combo,
//														record) {
//													var seller_uid = record.get('unique_id');
//													gMain.selPanel.selectPcsRecord.set(
//																	'seller_uid',
//																	seller_uid);
//
//												}
//											}
//										});
//								break;
                    case 'sub_qty':
                    case 'plan_qty':
                    case 'std_mh':
                    case 'process_price':
                    case 'price_type':
                    case 'description':
                    case 'comment':
                        o['editor'] = {
                            allowBlank: true
                        };
                }
            });

        // columns.push({
        // xtype: 'actioncolumn',
        // width: 30,
        // sortable: false,
        // menuDisabled: true,
        // items: [{
        // icon:
        // '/extjs5/module/shared/icons/font-awesome16/lsf-remove_12_0_ba4459_none.png',
        // tooltip: 'Delete Plant',
        // scope: this,
        // handler: this.onRemoveClick
        // }]
        // });

        var grid = null;
        var addRowAction = Ext.create(
            'Ext.Action',
            {
                iconCls: 'af-plus-circle',
                text: '추가',
                disabled: false,
                handler: function () {
                    console_logs("gMain.selPanel.link3>>>>>>>>>" + gMain.selPanel.link);

                    Ext.Ajax.request({

                        url: CONTEXT_PATH
                        + '/index/process.do?method=insertPcsTplRow',
                        params: {
//												assymapUid : gMain.selPanel.vSELECTED_UNIQUE_ID
                            parent_code: gMain.selPanel.vSELECTED_PARENT_CODE,
                            pcs_level: gMain.selPanel.vSELECTED_PCS_LEVEL
                        },
                        success: function (result,
                                           request) {
                            var processGrid = Ext.getCmp(id);
                            processGrid.getStore().load();
                        },
                        failure: extjsUtil.failureMessage
                    });


                }
            });

        var removeRowAction = Ext.create(
            'Ext.Action',
            {
                iconCls: 'af-remove',
                text: gm.getMC('CMD_DELETE', '삭제'),
                tooltip: '삭제하기',
                disabled: false,
                handler: function (widget, event) {

                    var rec = grid
                        .getSelectionModel()
                        .getSelection()[0];
                    // /console_logs('<Rfx1Main>rec', rec);
                    Ext.Ajax.request({
                        url: CONTEXT_PATH
                        + '/index/process.do?method=deletePcsTplRow',
                        params: {
                            targetUid: rec.get('id'),
//												assymapUid : gMain.selPanel.vSELECTED_UNIQUE_ID
                        },
                        success: function (result,
                                           request) {
                            var processGrid = Ext.getCmp(id);
                            processGrid.getStore().load();
                        },
                        failure: extjsUtil.failureMessage
                    });

                }
            });

        dockedItems.push(
            {
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default3',
                items: ['-', addRowAction, removeRowAction]
            });

        var contextMenu = Ext.create('Ext.menu.Menu', {
            items: [addRowAction, removeRowAction]
        });
        Ext.FocusManager.enable({
            focusFrame: true
        });
        grid = Ext.create('Ext.grid.Panel', {
            id: gridId,
            store: store,
            title: title,
            cls: 'rfx-panel',
            border: true,
            resizable: true,
            scroll: true,
            multiSelect: true,
            collapsible: false,
            layout: 'fit',
            //forceFit : true,
            dockedItems: dockedItems,
            plugins: [cellEditing],
            listeners: {
                itemcontextmenu: function (view, rec, node, index,
                                           e) {
                    e.stopEvent();
                    contextMenu.showAt(e
                        .getXY());
                    return false;
                },
                select: function (selModel,
                                  record, index, options) {
                    console_logs('<Rfx1Main>index:', index);
                    console_logs('<Rfx1Main>record:', record);

                    try {
                        Ext.getCmp('recvPoPcsGrid').editingPlugin.startEdit(record, 1);

                    } catch (e) {
                    }

                },
                itemdblclick: function (view,
                                        record, htmlItem,
                                        index, eventObject,
                                        opts) {

                }, // endof itemdblclick
                cellkeydown: function (gridPcsStd, td,
                                       cellIndex, record, tr,
                                       rowIndex, e, eOpts) {
                    console_logs(
                        '++++++++++++++++++++ e.getKey()',
                        e.getKey());

                    if (e.getKey() == Ext.EventObject.ENTER) {

                    }

                }
            },// endof listeners
            columns: columns
        });
        grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                fc(selections);
            }
        });

        var view = grid.getView();

        var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
            down: function (e) {
                var selectionModel = grid.getSelectionModel();
                var select = 0; // select first if no record is
                                // selected
                if (selectionModel.hasSelection()) {
                    select = grid.getSelectionModel()
                            .getSelection()[0].index + 1;
                }
                view.select(select);
                // quickSearch.focus(); // to get focus back to
                // the input
            },
            up: function (e) {
                var selectionModel = grid.getSelectionModel();
                var select = grid.store.totalCount - 1; // select
                                                        // last
                                                        // element
                                                        // if no
                                                        // record
                                                        // is
                                                        // selected
                if (selectionModel.hasSelection()) {
                    select = grid.getSelectionModel()
                            .getSelection()[0].index - 1;
                }
                view.select(select);
                // quickSearch.focus(); // to get focus back to
                // the input
            }
        });

        // grid.on('edit', function(editor, e, a,b,c,d)
        // {
        // //console_logs("grid.on('edit', function(editor) ",
        // editor);
        // console_logs("grid.on('beforeedit', function(e) ",
        // e);
        //
        // var record = e['record'];
        //
        // var pcs_no = record.get('pcs_no');
        // var pcs_code = record.get('pcs_code');
        // var serial_no = Number(pcs_no) / 10;
        // var plan_qty = record.get('plan_qty');
        //
        // var modifiend =[];
        //
        //
        // this.store.getProxy().setExtraParam('unique_id',
        // gMain.selPanel.vSELECTED_UNIQUE_ID);
        // console_logs('<Rfx1Main>edit record', record);
        // var pcs_code = record.get('pcs_code').toUpperCase();
        // var pcs_name = record.get('pcs_name');
        // var plan_date = record.get('plan_date');
        // var yyyymmdd ='';
        // if(plan_date!=null) {
        // yyyymmdd =gUtil.yyyymmdd(plan_date, '/');
        // }
        // var obj = {};
        // obj['unique_id'] = record.get('unique_id');//
        // //pcs_code, pcs_name...
        // obj['serial_no'] = serial_no;
        // obj['pcs_code'] = record.get('pcs_code');
        // obj['pcs_name'] = record.get('pcs_name');
        //
        // obj['description'] = record.get('description');
        // obj['comment'] = record.get('comment');
        // obj['machine_uid'] = record.get('machine_uid');
        // obj['seller_uid'] = record.get('seller_uid');
        //
        // obj['std_mh'] = record.get('std_mh');
        // obj['plan_date'] = yyyymmdd;
        // obj['plan_qty'] = plan_qty;
        //
        //
        // modifiend.push(obj);
        // var str = Ext.encode(modifiend);
        // console_logs('<Rfx1Main>str', str);
        // console_logs('<Rfx1Main>modify>>>>>>>>', pcs_name);
        // Ext.Ajax.request({
        // url: CONTEXT_PATH +
        // '/production/pcsstd.do?method=modifyStdList',
        // params:{
        // modifyIno: str,
        // srcahd_uid:gMain.selPanel.vSELECTED_UNIQUE_ID
        // },
        // success : function(result, request) {
        // console_logs('<Rfx1Main>save', 'OK');
        //
        // }
        // });
        //
        //
        // });
        //
        grid.on('keypress',
            function (t, e) {
                // if (e.getKey() == Ext.EventObject.TAB) {
                console_logs(
                    "grid.on('keypress', function(k) ",
                    k);
                console_logs(
                    "grid.on('keypress', function(e) ",
                    e);
                // }
            }, this);

        var tabPanel = Ext.getCmp(this.geTabPanelId());

        tabPanel.add(grid);

    },// callback

    // tempObj : null,
    /*calcAge :function(qty,price) {
     return qty*price;


     },*/

    /**
     * 공정설계 그리드 판넬 탭 추가
     */
    addTabGridPanel: function (title, menuCode, arg, fc, id) {

        this.extFieldColumnStore.load({
            params: {
                menuCode: menuCode
            },
            callback: function (records, operation, success) {
                if (success == true) {
                    switch (menuCode) {
                        case 'AMC6_SUB' :
                            gMain.callBackPcsTpl(title, records, arg,
                                fc, id);
                            break;
                        case 'SRO1_PUR' :
                            gMain.callBackAssy(title, records, arg,
                                fc, id);
                            break;
                        default:
                            gMain.callBackPcsStep(title, records, arg,
                                fc, id);
                    }


                } else {// endof if(success..
                    Ext.MessageBox.show({
                        title: '연결 종료',
                        msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
                        buttons: Ext.MessageBox.OK,
                        // animateTarget: btn,
                        scope: this,
                        icon: Ext.MessageBox['ERROR'],
                        fn: function () {

                        }
                    });
                }
            },
            scope: this
        });

    },

    /**
     * 스카나 srcahd와 assymap 업데이트
     */
    addTabGridPanelSKN: function (title, arg, fc, id) {

        Ext.define('scana', {
            extend: 'Ext.data.Model',
            fields: ['name', 'quantity']
        });

        this.extFieldColumnStore2 = Ext.create(
            'Ext.data.Store', {
                storeId: 'scanaStore',
                model: 'scana',
                fields: ['name', 'quantity'],
                /* data:{'items':[
                 { 'name': 'ACTUATOR',  'quantity': '1'},
                 { 'name': 'HYDRAURIC POWER UNIT',  'quantity': '1'},
                 { 'name': 'SOL. VALVE CABINET',  'quantity': '1'},
                 { 'name': 'CONTROL CONSOLE',  'quantity': '1'},
                 { 'name': 'SPARE PARTS',  'quantity': '1'},
                 { 'name': 'LOOSE PARTS',  'quantity': '1'}
                 ]},*/
                proxy: {
                    type: 'memory',
                    reader: {
                        type: 'json',
                        rootProperty: 'items'
                    }
                }
            }
        );

        this.extFieldColumnStore2.load({
            /*params : {
             menuCode : menuCode
             }, */
            callback: function (records, operation, success) {
                if (success == true) {
                    //gMain.callBackSKN(title, records, arg, fc, id);
                    var gridId = id == null ? this.getGridId() : id;

                    //var o = this.parseGridRecord(records, gridId);
                    var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];
                    // 소팅기준
                    var sortBy = o['sortBy'];

                    var modelClass = arg['model'];
                    var pageSize = arg['pageSize'];
                    var sorters = arg['sorters'];
                    var dockedItems = arg['dockedItems'];
                    var model = Ext.create(modelClass, {
                        fields: fields
                    });
                    /*var store = new Ext.data.Store({
                     pageSize : pageSize,
                     model : model,
                     sorters : sorters
                     });

                     var mySorters = [ {
                     property : 'p.serial_no',
                     direction : 'ASC'
                     } ];

                     store.getProxy().setExtraParam('sort', JSON.stringify(mySorters)); */

                    // console_logs('<Rfx1Main>gridId', gridId);

                    var cellEditing = new Ext.grid.plugin.CellEditing({
                        clicksToEdit: 1
                    });

                    gm.scanagrid = null;
                    var addRowAction = Ext.create('Ext.Action',
                        {
                            iconCls: 'af-plus-circle',
                            text: '자재추가하기',
                            disabled: true,
                            handler: function () {
                                rowEditing.cancelEdit();

                                // Create a model instance

                                var r = Ext.create('scana', {
                                    name: '자재명',
                                    quantity: '0'
                                });
                                gMain.extFieldColumnStore2.insert(0, r);
                                rowEditing.startEdit(0, 0);
                                /*var rec = grid
                                 .getSelectionModel()
                                 .getSelection()[0];
                                 // console_logs('<Rfx1Main>rec', rec);
                                 Ext.Ajax.request({
                                 url : CONTEXT_PATH
                                 + '/index/process.do?method=copyPcsStdRow',
                                 params : {
                                 fromUid : rec.get('id'),
                                 assymapUid : gMain.selPanel.vSELECTED_UNIQUE_ID
                                 },
                                 success : function(result, request) {
                                 var processGrid = Ext.getCmp(id);
                                 processGrid.getStore().load();
                                 },
                                 failure : extjsUtil.failureMessage
                                 }); */
                            }
                        });
                    // 영업,출하 > 수주관리 > 수정 > 상세정보의 삭제 버튼
                    gm.pcsRemoveRowAction = Ext.create('Ext.Action',
                        {
                            iconCls: 'af-remove',
                            text: gm.getMC('CMD_DELETE', '삭제'),
                            disabled: true,
                            handler: function (widget, event) {
                                var rec = gm.scanagrid.getSelectionModel().getSelection()[0];
                                console_logs('<Rfx1Main>gm.pcsRemoveRowAction rec', rec);

                                var unique_uid = rec.get('unique_uid');
                                console_logs('<Rfx1Main>unique_uid', unique_uid);

                                if (unique_uid == undefined && unique_uid == null) { //값이없으면 -> 신규등록
                                    console_logs('<Rfx1Main>if>>>>>>>>>>>>>>>>>>>');
                                    gMain.extFieldColumnStore2.remove(rec);
                                } else { //수정.
                                    console_logs('<Rfx1Main>else>>>>>>>>>>>>>>>>>>>');
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/index/generalData.do?method=delete',
                                        params: {
                                            DELETE_CLASS: 'assymap',
                                            uids: unique_uid
                                        },
                                        method: 'POST',
                                        success: function (rec) {
                                            console_logs('<Rfx1Main>load>>>>>>>>>>>>>>>>>>>');

                                            gMain.extFieldColumnStore2.remove(rec);


                                            console_logs('<Rfx1Main>fisish>>>>>>>>>>>>>>>>>>>');
                                        },
                                        failure: function (rec, op) {
                                            Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function () {
                                            });

                                        }
                                    });
                                }


                            }
                        });

                    dockedItems.push(
                        {
                            dock: 'top',
                            xtype: 'toolbar',
                            cls: 'my-x-toolbar-default3',
                            items: [/*'-', addRowAction, */ gm.pcsRemoveRowAction]
                        });

                    var contextMenu = Ext.create('Ext.menu.Menu', {
                        items: [/*addRowAction,*/ gm.pcsRemoveRowAction]
                    });
                    Ext.FocusManager.enable({
                        focusFrame: true
                    });

                    var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
                        clicksToMoveEditor: 1,
                        autoCancel: false
                    });


                    var sm = Ext.create("Ext.selection.CheckboxModel", {
                        mode: 'SINGLE',
                        checkOnly: true,
                        allowDeselect: false
                    });

                    gm.scanagrid = Ext.create('Ext.grid.Panel',
                        {
                            store: Ext.data.StoreManager.lookup('scanaStore'),
                            selModel: sm,
                            columns: [
                                {
                                    text: '순번',
                                    dataIndex: 'pl_no',
                                    width: 50,
                                    editor: {
                                        // defaults to textfield if no xtype is supplied
                                        allowBlank: false
                                    }
                                },
                                {
                                    text: '공정',
                                    dataIndex: 'class_code',
                                    width: 50,
                                    editor: {
                                        // defaults to textfield if no xtype is supplied
                                        allowBlank: false
                                    }
                                },
                                {
                                    text: '최상위 유닛',
                                    dataIndex: 'item_name',
                                    flex: 1,
                                    editor: {
                                        // defaults to textfield if no xtype is supplied
                                        allowBlank: false
                                    }
                                },
                                {
                                    text: '수량',
                                    width: 50,
                                    align: 'right',
                                    dataIndex: 'bm_quan',
                                    editor: {
                                        // defaults to textfield if no xtype is supplied
                                        allowBlank: false
                                    }
                                }
                            ],
                            //	id : gridId,
                            //	store : store,
                            title: title,
                            cls: 'rfx-panel',
                            border: true,
                            resizable: true,
                            scroll: true,
                            multiSelect: true,
                            collapsible: false,
                            layout: 'fit',
                            forceFit: true,
                            dockedItems: dockedItems,
//							plugins : [ cellEditing ],
                            listeners: {
//												itemcontextmenu : function(view, rec, node, index, e) {
//													e.stopEvent();
//													contextMenu.showAt(e.getXY());
//													return false;
//												},
                                select: function (selModel, record, index, options) {


                                    gUtil.enable(gm.pcsRemoveRowAction);

                                    //console_logs('<Rfx1Main>index:', index);
                                    //console_logs('<Rfx1Main>record:', record);

                                    // var pcs_code =
                                    // record.get('pcs_code');

                                    // supplierStore.getProxy().setExtraParam('pcs_code',
                                    // pcs_code);
                                    // supplierStore.load();

//									try {
//										Ext.getCmp('recvPoPcsGrid').editingPlugin.startEdit(record, 1);
//
//									} catch (e) {
//
//									}
                                },
                                itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {

                                }, // endof itemdblclick
                                cellkeydown: function (gridPcsStd, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                                    //console_logs('<Rfx1Main>++++++++++++++++++++ e.getKey()', e.getKey());

                                    if (e.getKey() == Ext.EventObject.ENTER) {

                                        //console_logs("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!cellIndex-------------", cellIndex);
                                        //console_logs("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!rowIndex-------------", rowIndex);
                                    }
                                }
                            }//, // endof listeners
//							plugins: [rowEditing],
                            /*&listeners: {
                             'selectionchange': function(view, records) {
                             grid.down('#removeEmployee').setDisabled(!records.length);
                             }
                             }*/
                        });
                    gm.scanagrid.getSelectionModel().on({
                        selectionchange: function (sm, selections) {
                            fc(selections);
                        }
                    });

                    var view = gm.scanagrid.getView();

                    var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
                        down: function (e) {
                            var selectionModel = gm.scanagrid.getSelectionModel();
                            var select = 0; // select first if no record is
                                            // selected
                            if (selectionModel.hasSelection()) {
                                select = gm.scanagrid.getSelectionModel()
                                        .getSelection()[0].index + 1;
                            }
                            view.select(select);
                            // quickSearch.focus(); // to get focus back to
                            // the input
                        },
                        up: function (e) {
                            var selectionModel = gm.scanagrid.getSelectionModel();
                            var select = gm.scanagrid.store.totalCount - 1; // select
                            // last
                            // element
                            // if no
                            // record
                            // is
                            // selected
                            if (selectionModel.hasSelection()) {
                                select = gm.scanagrid.getSelectionModel()
                                        .getSelection()[0].index - 1;
                            }
                            view.select(select);
                            // quickSearch.focus(); // to get focus back to
                            // the input
                        }
                    });

                    gm.scanagrid.on('keypress',
                        function (t, e) {
                            // if (e.getKey() == Ext.EventObject.TAB) {
                            console_logs(
                                "grid.on('keypress', function(k) ",
                                k);
                            console_logs(
                                "grid.on('keypress', function(e) ",
                                e);
                            // }
                        }, this);

                    var tabPanel = Ext.getCmp(this.geTabPanelId());
                    tabPanel.add(gm.scanagrid);
                } else {// endof if(success..
                    Ext.MessageBox.show({
                        title: '연결 종료',
                        msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
                        buttons: Ext.MessageBox.OK,
                        // animateTarget: btn,
                        scope: this,
                        icon: Ext.MessageBox['ERROR'],
                        fn: function () {

                        }
                    });
                }
            },
            scope: this
        });

    },

    // 사용자가 소메뉴 선택시 발생하는 이벤트
    selChangeMenu: function (rec) {
        //console_logs('<Rfx1Main>======>>>>>>>>> selChangeMenu', rec);
        this.selectedMenuRecord = rec;
        this.selMainPanelCenter = this.selMainPanel.center;
        this.setSelNode(rec);

        var id = rec.get('id');
        var name = rec.get('name');
        var link = rec.get('link');
        this.selLink = link;
        var className = rec.get('className');
        var classId = rec.get('classId');
        var obj = Ext.getCmp(this.selectedMenuId);

        this.selMainPanelName = name;
        if (vExtVersion > 5) {
            this.refreshToolbarPath8();
        } else {
            this.refreshToolbarPath();
        }

        this.setCenterLoading(true);

        if (obj == undefined || obj == 'undefined' || obj == null) {

            var myLink = '';
            console.log('테스트 : ',link);
            if (this.getMulti_grid(link) == 'N') {
                myLink = link;
            } else {
                myLink = link + '#%';
            }
            //console_logs('<Rfx1Main>myLink', myLink);
            this.extFieldColumnStore.load({
                params: {
                    menuCode: myLink
                },
                callback: function (in_records, operation, success) {
                    var records = [];
                    var records_map = {};
                    if (in_records != null && in_records.length > 0) {
                        for (var i = 0; i < in_records.length; i++) {
                            var o = in_records[i];

                            var menu_code = o.get('menu_code');
                            if (menu_code == link) {
                                records.push(o);
                            }
                            var arr = menu_code.split('#');
                            if (arr.length > 0) {
                                var key = arr[1];
                                if (key != undefined) {
                                    records_map[arr[1]] = [];
                                }

                            }

                        }
                        for (var i = 0; i < in_records.length; i++) {
                            var o = in_records[i];
                            //console_logs('<Rfx1Main>in_records o ', o);
                            var menu_code = o.get('menu_code');
                            var arr = menu_code.split('#');
                            if (arr.length > 0) {
                                var key = arr[1];
                                if (key != undefined) {
                                    records_map[key].push(o);
                                }

                            }

                        }
                        //console_logs('<Rfx1Main>records_map', records_map);
                    }

                    if (success == true) {
                        console_logs('<Rfx1Main>selChangeMenu ', link);
                        switch (link) {
                            case 'SRO4':
                            case 'SRO4_PNL':
                            case 'SRO4_DDG': // 대동 삼성
                            case 'SRO4_DD1': // 대동 현대
                            case 'SRO4_SEW':
                            case 'SRO4_DS' : // 두성 삼성
                            case 'SRO4_DS1': // 두성 BOM
                            case 'SRO4_HSG':
                            case 'SRO4_HSG2':
                            case 'SRO4_HSG3':
                            case 'SRO4_HSG4':
                            case 'SRO4_KM':
                            case 'SRO4_KM3':
                            case 'QQL4_PNL':
                            case 'SRO4_CHNG':	//청룡(기타)
                            case 'SRO4_CHNS':	//청룡(삼성)
                            case 'EPC5_SUB':
                            case 'SRO4_HAEW1':	//해원-SPOOL
                            case 'SRO4_HAEW2':	//해원-철의장
                            case 'SRO4_DAEH':	//대흥
                            case 'QQL4_CUT':	//대흥-컷팅플랜
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH
                                    + '/sales/excelRecvPo.do?method=readBufferPo',
                                    params: {
                                        onlyFirst: 'true',
                                        parentCode: link,
                                        group_uid: vCUR_USER_UID
                                        + 1000
                                        * gMain.selNode.id
                                    },
                                    success: function (result, request) {
                                        var s = result.responseText;
                                        var jsonData = Ext.JSON.decode(s);
                                        var firstRec = jsonData.datas[0];
                                        var parentCode = jsonData.parentCode;
                                        if (firstRec != undefined) {
                                            for (var i = 0; i < records.length; i++) {
                                                var column = records[i];
                                                var fieldText = gUtil.trim(column.get('text'));
                                                column.set(
                                                    'text',
                                                    fieldText);
                                                var dataIndex = column.get('dataIndex');
                                                var rcdText = gUtil.trim(firstRec[dataIndex]);
                                                firstRec[dataIndex] = rcdText;

                                                if (fieldText == '사전검증') {
                                                    var color = '#C1DDF1';
                                                    var color1 = 'custom-column-cyan';
                                                    column.set('style', 'background-color:' + color + ';text-align:center');
                                                    column.set('tdCls', color1);
                                                    column.set("renderer", function (value, meta) {
                                                        meta.css = 'custom-column';
                                                        return value;
                                                    });
                                                } else if (fieldText == undefined
                                                    || rcdText == undefined
                                                    || (fieldText != rcdText)) {
                                                    console_logs('<Rfx1Main>필드불일치 ', rcdText + ':' + fieldText);
                                                    var color = '#0271BC';
                                                    var color1 = 'custom-column-orange';
                                                    if (fieldText != undefined
                                                        && rcdText != undefined) {
                                                        fieldText1 = gUtil.removeSpace(fieldText);
                                                        rcdText1 = gUtil.removeSpace(rcdText);

                                                        if (fieldText1 == rcdText1) {
                                                            color1 = 'custom-column-yellow';
                                                        }
                                                    }

                                                    column.set('style', 'background-color:' + color + ';text-align:center');
                                                    column.set('tdCls', color1);
                                                    column.set("renderer", function (value, meta) {
                                                        meta.css = 'custom-column';
                                                        return value;
                                                    });
                                                }
                                            }
                                        }
                                        console_logs('------$$$$$$$$$$$$$$$$$$$$$');
                                        gMain.addToCenterTab(records, records_map);
                                    }
                                });
                                break;
                            default:
                                console_logs('#####$$$$$$$$$$$$$$$$$$$$$');
                                gMain.addToCenterTab(records, records_map);
                        }

                    } else {// endof if(success..
                        Ext.MessageBox
                            .show({
                                title: '연결 종료',
                                msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
                                buttons: Ext.MessageBox.OK,
                                // animateTarget:
                                // btn,
                                scope: this,
                                icon: Ext.MessageBox['ERROR'],
                                fn: function () {

                                }
                            });
                    }
                    this.setCenterLoading(false);
                },// callback
                scope: this
            });
        } else { // endofif
            this.selPanel = obj;
            try {
                this.selMainPanelCenter.setActiveItem((vEDIT_MODE == true) ? this.selectedMenuId + '-editMode' : this.selectedMenuId);
            } catch (error) {
                this.selMainPanelCenter.setActiveItem(this.selectedMenuId);
            }
            // this.selMainPanelCenter.setActiveItem((vEDIT_MODE==true)? this.selectedMenuId + '-editMode' : this.selectedMenuId);
            this.setCenterLoading(false);

            try {
                this.selPanel.callbackLoadCenterPanel(this, obj, this.selectedMenuId);
            } catch (e) {
                console_log('this.callbackLoadCenterPanel callDefLoad', e);
            }


        }
    },

    refreshCheckBoxAll: function () {
        // console_logs('<Rfx1Main>this.menuArr', this.menuArr);
        for (var i = 0; i < this.menuArr.length; i++) {
            var url = this.menuArr[i]['url'];
            var code = url['code'];
            // console_logs('<Rfx1Main>chkAuto', 'chkAuto-' + code);
            var o = Ext.getCmp('chkAuto-' + code);
            // console_logs('<Rfx1Main>o', o);
            if (o != null && o != undefined) {
                o.setRawValue(this.getSaveAutoRefresh());
            }
        }

    },

    refreshCheckBoxCrudAll: function () {
        // console_logs('<Rfx1Main>this.menuArr', this.menuArr);
        for (var i = 0; i < this.menuArr.length; i++) {
            var url = this.menuArr[i]['url'];
            var code = url['code'];
            // console_logs('<Rfx1Main>chkOpenCrud', 'chkOpenCrud-' +
            // code);
            var o = Ext.getCmp('chkOpenCrud-' + code);
            // console_logs('<Rfx1Main>o', o);
            if (o != null && o != undefined) {
                o.setRawValue(this.getOpenCrudWindow());
            }
        }

    },

    checkRefresh: function (b) {

        this.setSaveAutoRefresh(b);
        this.setEnv('autoRefresh', '' + b);
        this.refreshCheckBoxAll();

    },

    checkOpenCrudWindow: function (b) {

        this.setOpenCrudWindow(b);
        this.setEnv('openCrudWindow', '' + b);
        this.refreshCheckBoxCrudAll();

        if (b == false) {
            this.selPanel.crudTab.collapse();
        }

    },

    setCrudToolbarMsg: function (msg) {
        var sel_msg_id = this.selectedMenuId + 'state-msg';
        try {
            Ext.getCmp(sel_msg_id).setValue(
                msg == null ? this.DEF_CRUD_TOOLBAR_MSG
                    : msg);
        } catch (e) {
        }

    },
    setCrPaneToolbarMsg: function (msg) {
        var sel_msg_id = this.selectedMenuId + 'create-msg';
        try {
            Ext.getCmp(sel_msg_id).setValue(
                msg == null ? this.DEF_CRUD_TOOLBAR_MSG
                    : msg);
        } catch (e) {
        }
    },
    // 노드 할당.
    setSelNode: function (node) {
        console_logs('<Rfx1Main>node', node);
        this.selNode = node;
        this.setMenuId(node.get('link'));
    },
    setCenterLoading: function (b) {
        this.selMainPanelCenter.setLoading(b);
    },
    extFieldColumnStore: Ext.create(
        'Rfx.store.ExtFieldColumnStore', {
            fields: [{
                name: 'name'
            }]
        }),

    /**
     * J2_CODE로 부터 데이터를 읽어 각종 기준정보를 생성
     */
    parseGridRecord: function (records, linkId) {

        var fields = [], columns = [], tooltips = [], sortBy = {};

        var colNum = 0;
        for (var i = 0; i < records.length; i++) {

            var rec = records[i];
            var recSub = {};

            var member_type = rec.get('member_type');
            if (member_type != null && member_type.length > 0) {
                var o = Ext.util.JSON.decode(member_type);
                if (o != null && o instanceof Object) {
                    for (var key in o) {
                        recSub[key] = o[key];
                    }
                }
            }
            var input_type = rec.get('input_type');

            //console_logs('<Rfx1Main>input_type', input_type);
            if (input_type != null && input_type.length > 0) {
                try {
                    var o = Ext.util.JSON.decode(input_type);

                    if (o != null && o instanceof Object) {
                        for (var key in o) {
                            recSub[key] = o[key];
                        }
                    }
                } catch (e) {
                }

            }
            var create_ep_id = rec.get('create_ep_id');
            // console_logs('<Rfx1Main>create_ep_id', create_ep_id);

            if (create_ep_id != null && create_ep_id.length > 0) {
                var o = Ext.util.JSON.decode(create_ep_id);
                if (o != null && o instanceof Object) {
                    for (var key in o) {
                        // console_logs('<Rfx1Main>fields recSub key',
                        // key);
                        // console_logs('<Rfx1Main>fields recSub o', o);
                        // console_logs('<Rfx1Main>fields recSub o[key]',
                        // o[key]);
                        var val = o[key];
                        recSub[key] = val;

                        if (key == 'tableName'
                            && val != undefined
                            && val != null && val != '') {
                            var byReplacer = rec.get("name")
                                .toLowerCase();
                            sortBy[byReplacer] = val + '.'
                                + byReplacer;

                        }
                    }
                }
            }

            var modify_ep_id = rec.get('modify_ep_id');
            if (modify_ep_id != null && modify_ep_id.length > 0) {
                recSub['setCols'] = 1;
                var o = Ext.util.JSON.decode(modify_ep_id);
                if (o != null && o instanceof Object) {
                    for (var key in o) {
                        // console_logs('<Rfx1Main>fields recSub key',
                        // key);
                        // console_logs('<Rfx1Main>fields recSub o', o);
                        // console_logs('<Rfx1Main>fields recSub o[key]',
                        // o[key]);
                        recSub[key] = o[key];
                    }
                }
            } else {
                recSub['setNumber'] = -1;
                recSub['setName'] = '';
            }

            //console_logs('<Rfx1Main>>>>>recSub', recSub);
            //var lock_cnt = this.getLock_cnt(linkId);
            colNum = this.inRec2Col(rec, recSub, fields,
                columns, tooltips, colNum, linkId);

            fields[i]['useYn'] = rec.get('useYn');
            fields[i]['code_order'] = rec.get('code_order');

        }// endoffor

        return {
            fields: fields,
            columns: columns,
            tooltips: tooltips,
            sortBy: sortBy
        };

    },

    // CenterTab에 메뉴추가.
    addToCenterTab: function (records, records_map) {

        console_logs('<Rfx1Main>addToCenterTab records', records);
        console_logs('<Rfx1Main>addToCenterTab records_map', records_map);

        var o = this.parseGridRecord(records, this.selectedMenuId);

        var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];
        //console_logs('<Rfx1Main>>>>>center fields', fields);

        // 소팅기준
        var sortBy = o['sortBy'];
        var fields_map = {};
        var columns_map = {};
        var tooltips_map = {};
        var sortBy_map = {};

        for (var key in records_map) {
            var r = records_map[key];
            var o1 = this.parseGridRecord(r, key);

            var f = o1['fields'];
            var c = o1['columns'];
            var t = o1['tooltips'];
            var s = o1['sortBy'];

            fields_map[key] = f;
            columns_map[key] = c;
            tooltips_map[key] = t;
            sortBy_map[key] = s;

        }
        columns_map['width'] = 100;
        var name = this.selNode.get('name');
        var link = this.selNode.get('link');
        var className = this.selNode.get('className');
        var linkPath = this.selNode.get('linkPath');

        var flag1 = this.selNode.get('flag1');
        var flag2 = this.selNode.get('flag2');
        var flag3 = this.selNode.get('flag3');
        var flag4 = this.selNode.get('flag4');
        var flag5 = this.selNode.get('flag5');

        var relationship = this.selNode.get('relationship') == undefined ? null : this.selNode.get('relationship');

        this.selMainPanelCenter.addTab(className, this.selectedMenuId, link, name, fields, columns, tooltips, relationship, sortBy,
            fields_map, columns_map, tooltips_map, sortBy_map, linkPath, flag1, flag2, flag3, flag4, flag5
        );
        console_logs('<Rfx1Main>-------------- addToCenterTab --------', 'setActiveItem');
        try {
            this.selMainPanelCenter.setActiveItem((vEDIT_MODE == true) ? this.selectedMenuId + '-editMode' : this.selectedMenuId);
        } catch (error) {
            this.selMainPanelCenter.setActiveItem(this.selectedMenuId);
        }
        console_logs('<Rfx1Main>---------------addToCenterTab', 'setActiveItem');
    },

    getMainPanelCenterId: function () {
        return this.selectedMenuGroup + '-center';
    },
    geViewCrudId: function () {
        return this.selectedMenuId + '-' + 'crudTab';
    },
    geTabPanelId: function () {
        return this.selectedMenuId + '-' + 'tabpanel';
    },
    setMenuId: function (link) {
        this.selectedMenuId = this.selectedMenuGroup + '-'
            + link;
    },
    launch: function () {
        this.defToken = gMain.myenv['link'];

        if (this.defToken == undefined || this.defToken == null
            || this.defToken == '') {

            if (vSYSTEM_TYPE = 'PLACE') {
                this.defToken = 'criterion-info:AMY2';
            } else {
                this.defToken = 'produce-state';
            }

        }

        if (vSYSTEM_TYPE_SUB == "HEAVY4") {

            for (var i = 0; i < gUtil.menuStruct.length; i++) {
                var o = gUtil.menuStruct[i];

                //console_logs('<Rfx1Main>gUtil.menuStruct[' + i + '] =', o);

                this.menuArr.push({
                    title: o['display_name'],
                    url: {
                        name: o['display_name'],
                        xtype: o['service_name'],
                        code: o['menu_key']
                    }
                });
            }

        } else {

            for (var i = 0; i < gUtil.menuStruct.length; i++) {
                var o = gUtil.menuStruct[i];

                //console_logs('<Rfx1Main>gUtil.menuStruct[' + i + '] =', o);

                this.menuArr.push({
                    title: o['display_name'],
                    url: {
                        name: o['display_name'],
                        xtype: o['service_name'],
                        code: o['menu_key']
                    }
                });
            }
        }

        //console_logs('<Rfx1Main>메뉴 데이터 생성');
        this.createLeftMenuAll();
        this.mainTabs = new Ext.TabPanel({
            region: 'center',
            id: 'main-tabs',
            flex: 1,
            activeTab: 0,
            deferredRender: false,
            defaults: {
                autoHeight: true,
                bodyPadding: (vExtVersion > 5) ? 5 : 10
            },
            items: [],
            addTab: function (className, id, title) {

                var obj = Ext.getCmp(id);
                if (obj == undefined || obj == 'undefined' || obj == null) {
                    createLeftMenu(className);
                    var listMenu = gUtil.leftMenus;

                    var classPath = 'Rfx.view.';

                    var active = Ext.create(classPath + className, {
                        title: title,
                        id: id,
                        menu_key: id,
                        itemId: id,
                        link: id,
                        closable: false,
                        listMenu: listMenu
                    });
                    this.add(active);
                    this.selMainPanel = active;
                    this.selMainPanelName = title;
                }
                this.setActiveTab(id);
            },

            listeners: {
                resize: function (win, width, height, opt) {
                },
                tabchange: this.onTabChange,
                afterrender: this.onAfterRender
            }
        });

        function createLeftMenu(className) {
            var listLmenu = gUtil.lmenuStruct;
            gUtil.leftMenus = [];

            if (listLmenu != null && Array.isArray(listLmenu)) {
                for (var i = 0; i < listLmenu.length; i++) {
                    var o = listLmenu[i];
                    if (o['parentName'] == className) {
                        var linkPath = o['linkPath'];
                        if (gu.checkLinkPath(linkPath) == false) {
                            linkPath = null;
                        }

                        
                        var o = {
                            id: i + 1,
                            name: o['display_name'],
                            link: o['menu_key'],
                            classId: o['classId'],
                            className: o['service_name'],
                            linkPath: linkPath,
                            flag1 : o['flag1'],
                            flag2 : o['flag2'],
                            flag3 : o['flag3'],
                            flag4 : o['flag4'],
                            flag5 : o['flag5']

                        }
                        gUtil.leftMenus.push(o);
                    }
                }
            }

        }

        var token = window.location.hash.substr(1);
        // console_logs('<Rfx1Main>hash tokenen', token);
        var menu_link = null;
        if (token == null || token == '') {
            window.location.hash = '#' + this.defToken;
            token = window.location.hash.substr(1);
        } else {
            gMain.redrawForce = true;
        }

        var arr = token.split(':');
        if (arr.length > 1) {
            if (arr[0] == 'undefined') {
                token = arr[1];
                menu_link = '';
            } else {
                token = arr[0];
                menu_link = arr[1];
            }

        } else {
            menu_link = '';
        }

        // console_logs('<Rfx1Main>add Tab');
        var active = null;
        // console_logs('<Rfx1Main>token', token);
        for (var i = 0; i < this.menuArr.length; i++) {

            var o = this.menuArr[i];

            var url = o['url'];
            var title = o['title'];
            var xtype = url['xtype'];
            var code = url['code'];
            var flag1 = url['flag1'];
            var flag2 = url['flag2'];
            var flag3 = url['flag3'];
            var flag4 = url['flag4'];
            var flag5 = url['flag5'];
            var active = (code == token) ? true : false;
            if (active == true) {
//				 console_logs('<Rfx1Main>===========================>xtype',				 xtype);
//				 console_logs('<Rfx1Main>===========================>code',				 code);
//				 console_logs('<Rfx1Main>===========================>title',				 title);
//				 console_logs('<Rfx1Main>===========================>token',  token);

                var menu = 'menu-' + token;
                var menuOn = menu + 'on';
                $('.' + menu).removeClass(menu).addClass(menuOn);

                this.gotoMyTab(xtype, code, title, menu_link, false, flag1, flag2, flag3, flag4, flag5);

            }

        }

        if (vExtVersion > 5) {
            this.main = Ext.create("Ext.panel.Panel", {
                layout: 'border',
                defaults: {
                    split: true,
                    bodyPadding: 0,
                },
                region: 'center',
                items: [
                    this.createTreeMenu(gUtil.leftMenus, function (rec) {

                        console_logs('<Rfx1Main>onSelect rec', rec);

                    }),

                    this.mainTabs]
            });
        } else {
            this.main = Ext.create("Ext.panel.Panel", {
                layout: 'border',
                region: 'center',
                items: [this.mainTabs]
            });
        }

        //if(vEDIT_MODE==false) {
        this.mainTabs.getTabBar().hide();
        //}


        // console_logs('<Rfx1Main>create view port');
        this.viewport = new Ext.Viewport({
            layout: 'border',
            bodyBorder: false,
            border: false,
            defaults: {
                collapsible: false,
                split: false,
                bodyPadding: 0
            },
            getItem: function (region) {
                var items = this.items['items'];
                // console_logs('<Rfx1Main>viewport items', items);
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    // console_logs('<Rfx1Main>viewport item', item);
                    if (region == item['region']) {
                        return item;
                    }
                }
                return null;
            },

            resizeRegion: function (region, size) {
                var r = this.getItem(region);
                r.setHeight(size);
            },

            hideRegion: function (region) {
                var r = this.getItem(region);
                r.hide();
            },
            showRegion: function (region) {
                var r = this.getItem(region);
                r.show();
            },
            items: [{
                padding: 0,
                height: 84,
                region: 'north',
                contentEl: 'header'
            }, {
                width: 18,
                padding: 0,
                bodyStyle: 'background: #29598B; ',
                region: 'east'
            }, this.main, {
                width: 18,
                padding: 0,
                bodyStyle: 'background: #29598B; ',
                region: 'west'
            }, {
                padding: 0,
                height: 20,
                region: 'south',
                contentEl: 'footer'
            }],
            listeners: {
                afterrender: function () {
                    // console_logs('<Rfx1Main>Ext.getBody().unmask()');
                    // Ext.getBody().unmask();
                    // console_logs('<Rfx1Main>done.');
                }
            }
        });


        onWindowSize();

        // console_logs('<Rfx1Main>launch ok.');
    },
    onMainResize: function (w, h) {

        this.windowHeight = h;
        this.windowWidth = w;


        var northHeight = (vExtVersion > 5) ? 48 : 84;

        // var miniPane =
        // document.getElementById('absolute_manupane');

        if (gMain.checkPcWidth() == false) {
            // console_logs('<Rfx1Main>windowHeight', 'too small');
            this.viewport.resizeRegion('north', northHeight);
            this.viewport.hideRegion('south');
            // miniPane.style.visibility = "visible";
            this.viewport.hideRegion('east');
            this.viewport.hideRegion('west');
            gMain.closeMenu();

            document.getElementById("logo_display_id").style.display = "none";
            // gMain.selPanel.crudTab.collpse();
            // Ext.getCmp('app-west').hide();
        } else {
            // console_logs('<Rfx1Main>windowHeight', 'OK');
            this.viewport.resizeRegion('north', northHeight);
            this.viewport.showRegion('south');
            // miniPane.style.visibility = "hidden";
            this.viewport.showRegion('east');
            this.viewport.showRegion('west');
            gMain.openMenu();

            document.getElementById("logo_display_id").style.display = "block";
        }

    },

    menuArr: [],
    main: null,
    viewport: null,
    mainTabs: null,
    onTabChange: function (tabPanel, tab) {
        // console_logs('<Rfx1Main>tabPanel', tabPanel);
        // console_logs('<Rfx1Main>tab', tab);
        //console_logs('<Rfx1Main>selected tab.itemId', tab.itemId);
        // window.location.hash = '#'+ tab.itemId;
        if (tab.itemId != 'project-total') {
            Ext.getBody().unmask();
        }

    },
    getGroupClassId: function () {
        return this.groupClass.substring(0, 1).toLowerCase()
            + this.groupClass.substring(1);
    },
    changeProject: function (className, id, title, menu_link, flag1, flag2, flag3, flag4, flag5) {

        if (this.getSaveAutoRefresh() == false) {
            Ext.getBody().mask('잠시만 기다려주세요.');
            var url = CONTEXT_PATH + '/index/main.do' + '#'
                + id;
            if (menu_link != null) {
                url = url + ':' + menu_link;
            }
            window.location = url;
            window.location.reload();
        } else {
            if (this.redrawForce == true) {
                this.gotoMyTab(className, id, title, menu_link, flag1, flag2, flag3, flag4, flag5);

            } else {

            }

        }

        this.redrawForce = true;

    },
    gotoMyTab: function (className, id, title, menu_link, flag1, flag2, flag3, flag4, flag5) {
        gu.link = menu_link;

        this.groupClass = className;
        var obj = Ext.getCmp(id);

        if (obj == undefined || obj == 'undefined'
            || obj == null) {
            this.mainTabs.addTab(className, id, title, flag1, flag2, flag3, flag4, flag5)
            this.selMainPanel = this.mainTabs.selMainPanel;
        } else {
            this.selMainPanel = obj;
            this.mainTabs.selMainPanel = obj;
        }

        this.mainTabs.setActiveTab(id);
        this.selectedMenuGroup = id;
        this.selectedMenuGroupName = title;
        this.selMainPanelName = '';
        if (vExtVersion > 5) {
            this.refreshToolbarPath8();
        } else {
            this.refreshToolbarPath();
        }
        if (menu_link != null) {
            this.gotoMenu(this.selMainPanel, menu_link);
        }

    },
    // Handle this change event in order to restore the UI to
    // the appropriate history state
    onAfterRender: function () {

    },
    inRec2Col : function (rec, recSub, fields, columns, tooltips, colNum, linkId) {

        //var id = 'uid-' + rec.get("unique_id_long");
        var rName = rec.get("name").toLowerCase();
        var rType = rec.get("type").toLowerCase();
        var rTypeSplit = rec.get("type").split(":");
        var rText = rec.get("text");
        var rWidth = rec.get("width");
        var rSortable = rec.get("sortable");
        var rDataIndex = rec.get("dataIndex");
        var rUseYn = rec.get("useYn");
        var rExcelSet = rec.get("excel_set");
        var fieldObj = {};
        var isRenderCodeName = false;
        var isRenderPartUid = false;
        var isTypeUserInfo = false;
        var combo = false;
        var codeName = '';
        var partUid = '';
        var userUid = '';
        var rTypeSplitLower = rType.split(":");

        if (rTypeSplitLower.length > 1 && rTypeSplit[0] == "combo") {
            isRenderCodeName = true;
            codeName = rTypeSplit[1];
            rType = "combo";
            fieldObj["codeName"] = codeName;
        }
        if (rTypeSplitLower.length > 1 && rTypeSplit[0] == "gcombo") {
            isRenderCodeName = true;
            codeName = rTypeSplit[1];
            rType = "gcombo";
            fieldObj["codeName"] = codeName;
        }
        if (rTypeSplitLower.length > 1 && rTypeSplitLower[0] == "code") {
            isRenderCodeName = true;
            codeName = rTypeSplitLower[1];
            rType = "string";
            fieldObj["codeName"] = codeName;
        }
        if (rTypeSplitLower.length > 1 && rTypeSplitLower[0] == "PART_INFO") {
            isRenderPartUid = true;
            partUid = rTypeSplitLower[1];
            rType = "string"
        }
        if (rTypeSplitLower.length > 1 && rTypeSplitLower[0] == "USER_INFO") {
            isTypeUserInfo = true;
            userUid = rTypeSplitLower[1];
            rType = "string"
        }
        fieldObj["name"] = rName;
        fieldObj["type"] = rType;
        fieldObj["text"] = rText;

        if (recSub != null) {
            for (var key in recSub) {
                fieldObj[key] = recSub[key];
            }
        }

        fields.push(fieldObj);

        var style = rec.get("style");
        var tdCls = rec.get("tdCls");
        var renderer = rec.get("renderer");

        var canCreate = fieldObj['canCreate'];
        var canEdit = fieldObj['canEdit'];
        var canCellEdit = fieldObj['canCellEdit'];
        var canView = fieldObj['canView'];

        if (rUseYn == "Y") {
            colNum++;
            var colObj = {};
            if (rUseYn == "Y") {
                colObj["useYn"] = true;
            }
            if (style != undefined && style != null) {
                colObj["style"] = style;
            }
            if (tdCls != undefined && tdCls != null) {
                colObj["tdCls"] = tdCls;
            }
            if (renderer != undefined && renderer != null) {
                colObj["renderer"] = renderer;
            }

            colObj["text"] = rText;
            colObj["width"] = rWidth;
            colObj["sortable"] = rSortable;
            colObj["canEdit"] = canEdit;
            colObj["canCellEdit"] = canCellEdit;
            colObj["dataType"] = rType;
            colObj["dataIndex"] = rDataIndex;
            colObj["style"] = 'text-align:center';
            colObj["align"] = 'left';
            colObj["stateId"] = rDataIndex;
            //colObj["id"] = id;
            columns.push(colObj);

            var tooltipObj = {};
            var tooltipTarget = this.getSearchField(rDataIndex);

            tooltipObj["target"] = tooltipTarget;
            tooltipObj["html"] = rText;
            tooltipObj["anchor"] = "bottom";
            tooltipObj["trackMouse"] = true;
            tooltipObj["anchorOffset"] = 10;
            tooltips.push(tooltipObj);

            if (!isTypeUserInfo) {
                if (rDataIndex == "creator" || rDataIndex == "changer") {
                    colObj["renderer"] = this.renderUser
                } else if (rDataIndex == "pm_id"
                    && vCUR_MENU_CODE == "SRO1") {
                    colObj["renderer"] = this.renderUser
                } else if (rDataIndex == "worker"
                    && vCUR_MENU_CODE == "EPC3") {
                    colObj["renderer"] = this.renderUser
                }
            } else {
                colObj["renderer"] = renderUseruid({
                    Useruid: userUid
                })
            }
            switch (rType) {
                case 'checkbox':
                    colObj['align'] = 'center';
                    colObj['xtype'] = 'checkcolumn';
                    colObj['tableName'] = Ext.decode(rec.data.create_ep_id).tableName;
                    colObj['listeners'] = {
                        checkchange: function (comp, rowIndex, checked, eOpts) {
                            var record = this.up('grid').getStore().getAt(rowIndex);
                            gm.editAjax(comp.config.tableName, comp.config.dataIndex, checked ? 1 : 0, 'unique_id', record.id, {type: ''});
                        }
                    }
                    break;
                case 'number':
                    colObj["align"] = "right";
                    colObj["renderer"] = renderNumber;
                    break;
                case 'digit':
                    colObj["align"] = "right";
                    break;
                case 'sdate':
                    this.dateFields.push(rDataIndex);
                    colObj["renderer"] = renderSimpleDate({
                        dataIndex: rDataIndex
                    })
                    break;
                case 'tdate':
                    colObj["renderer"] = renderDetailDate({
                        dataIndex: rDataIndex
                    })
                    break;
                case 'hmdate':
                    this.dateFields.push(rDataIndex);
                    colObj["renderer"] = renderHMDate({
                        dataIndex: rDataIndex
                    })
                    break;
                case 'decimal':
                    colObj["align"] = "right";
                    colObj["renderer"] = renderDecimalNumber;
                    break;
                default:
                    colObj["renderer"] = function (value, p, record) {
                        if (value == null) {
                            return null;
                        } else {
                            try {
                                return value == null ? null :
                                    value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/</g, '&lt;');
                            } catch (e) {
                                return value;
                            }
                        }
                    };
                    break;
            }
            if (isRenderCodeName) {
                colObj["renderer"] = gUtil.renderCodeName({
                    codeName: codeName.toUpperCase(),
                    storeId: linkId + '-' + 'codeRender'
                    + codeName.toUpperCase()
                });
                colObj["codeName"] = codeName;
            }
            if (isRenderPartUid) {
                colObj["renderer"] = renderPartuid({
                    Partuid: partUid
                })
            }
            if (rType == "fddate") {
                colObj["xtype"] = "datecolumn";
                colObj["format"] = "Y-m-d H:i:s"
            }
            if (rType == "fbdate") {
                colObj["xtype"] = "datecolumn";
                colObj["format"] = "Y-m-d"
            }

            colObj["rExcelSet"] = rExcelSet;
        }
        return colNum;
    },

    LoadJsMessage: function () {
        Ext.Ajax.request({
            url: CONTEXT_PATH
            + "/dispField.do?method=loadJsScript",
            success: function (result, request) {
        
                eval(result.responseText)
            },
            failure: extjsUtil.failureMessage
        })
    },
    
    // load javascript
    LoadJs: function (url) {
        if (url != null && url.length > 0) {
            var js = document.createElement('script');

            js.type = "text/javascript";
            js.src = CONTEXT_PATH + url;

            // console_log('js.src=' + js.src);
            try {
                document.body.appendChild(js);
            } catch (e) {
                console_log("script in page exception in appendChild: "
                    + utl + e);
                lfn_gotoHome();
            }

            // console_log('LoadJs OK.');
        }

    },
    getTextName: function (e, t) {
        var value = t;
        Ext.each(e, function (o, n) {
            //console_logs('<Rfx1Main>getTextName o', o);
            var r = o["name"];
            var i = o["text"];
            if (t == r) {
                value = i;
            }
        });
        return value;
    },
    getTextType: function (e, t) {
        var value = t;
        Ext.each(e, function (o, n) {
            //console_logs('<Rfx1Main>getTextName o', o);
            var r = o["name"];
            var i = o["type"];
            if (t == r) {
                value = i;
            }
        });
        return value;
    },
    getColNameByField: function (fields, key) {
        return this.getTextName(fields, key);
    },
    getSearchField: function (field) {
        return 'srch' + field.substring(0, 1).toUpperCase()
            + field.substring(1);
    },
    getSearchField_: function (field) {
        return this.getSearchField(field) + '_';
    },
    getSearchObject: function (field) {
        return Ext.getCmp(getSearchField(field));
    },
    getSearchObject_: function (field) {
        return Ext.getCmp(getSearchField_(field));
    },
    getSearchValue_: function (field) {
        var o = getSearchObject_(field);
        return o.getValue();
    },
    getSearchValue: function (field) {
        var o = getSearchObject(field);
        return o.getValue();
    },
    clearSrchCombo: function (field) {
        var o = getSearchObject(field);
        o.clearValue();
        o.store.removeAll();
    },

    getMC: function(variableCode, falseMsg) {
        try {
            return eval(variableCode);
        } catch (e) {
            return falseMsg;
        }
    },
    vCENTER_FIELDS: function () {
        //console_logs('<Rfx1Main>gm.fields', gm.me().fields);
        return gm.me().fields;
    },
    vCENTER_FIELDS_SUB: function () {
        return gm.fields;
    },
    getColName: function (key) {
        return this.getTextName(this.vCENTER_FIELDS(), key);
    },
    getColType: function (key) {
        return this.getTextType(this.vCENTER_FIELDS(), key);
    },
    getColNameSub: function (key) {
        return this.getTextName(this.vCENTER_FIELDS_SUB(), key);
    },

//					getColNameByField : function(fields, key) {
//						return this.getTextName(fields, key);
//					},

    getUniqueIdSelected: function (value, p, record) {
        var uid = record.get('unique_id');
        // console_log('getUniqueIdSelected=' +uid);
        return uid;
    },
    // pluggable renders
    renderUser: function (value, p, record) {
        return Ext.String
            .format(
                '<a href="javascript:gUtil.popupUserByUserId(\'{0}\')" onclick="gUtil.popupUserByUserId(\'{0}\')" ><font color=#163F69>{0}</font></a>',
                value);

    },
    getCenterPanelHeight: function () {
        return this.selMainPanelCenter.getEl().getHeight();
    },
    getCenterPanelWidth: function () {
        return this.selMainPanelCenter.getEl().getWidth();
    },
    handlInputFc: function (handleKey, o, o1, o2, o3) {
        // console_logs('<Rfx1Main>gMain handlInputFc handleKey',
        // handleKey);
        this.selPanel.handlInputFc(handleKey, o, o1, o2, o3);
    },
    getBladeInfo: function () {

        console_logs('<Rfx1Main>getBladeInfo', 'IN');
        console_logs('<Rfx1Main>getBladeInfo selPanel', this.selPanel);

        var size = this.selPanel.getInputTarget(
            'reserved_varcharb').getValue();
        if (size == null || size == '') {
            size = '000 * 000';
        }
        var qty = this.selPanel.getInputTarget(
            'reserved_double3').getValue();
        var unit = this.selPanel.getInputTarget(
            'reserved_varcharc').getValue();
        return '칼 ' + size + " " + qty + unit;
    },

    getBladeInfoAll: function () {

        console_logs('<Rfx1Main>getBladeInfoAll', 'IN');

        var bladeInfo = this.getBladeInfo();

        var target_item_name = this.selPanel
            .getInputTarget('item_name');
        var target_bm_quan = this.selPanel
            .getInputTarget('bm_quan');
        var item_name = target_item_name.getValue();
        var bm_quan = target_bm_quan.getValue();
        var wa_name = '';
        var target_item_name = this.selPanel
            .getInputTarget('wa_name');
        console_logs('<Rfx1Main>bladeInfoAll', bladeInfoAll);
        console_logs('<Rfx1Main>wa_name**********************',
            this.inputBuyer);
        if (this.inputBuyer != null) {
            wa_name = this.inputBuyer.get('wa_name');
            // 고객사 품명 생산수량
        }

        var bladeInfoAll = bladeInfo + ', ' + wa_name + ' / '
            + item_name + ' , 생산수량: ' + bm_quan;

        console_logs('<Rfx1Main>bladeInfoAll', bladeInfoAll);

        return bladeInfoAll;
    },

    loadFc: function (o) {
        console_logs('<Rfx1Main>loadFc is DEPRECATED',
            'moved to Rfx.app.Util');
    },
    createRandData: function () {
        console_logs('<Rfx1Main>createRandData is DEPRECATED',
            'moved to Rfx.app.Util');
    },

    // Ajax 또는 Store 호출 체크
    AJAX_TTRACT: {
        'Ext.calendar.data.EventModel': 0
    },
    checkAjaxTrack: function (key, val) {
        this.AJAX_TTRACT[key] = val ? this.getAjaxTrack(key) + 1
            : this.getAjaxTrack(key) - 1;
    },
    getAjaxTrack: function (key) {
        return this.AJAX_TTRACT[key];
    },

    // Date span 검색 툴바에서 날짜 선택하면 값을 지정
    changeDatespan: function (dateId1) {
        var dateId = dateId1.substring(0, dateId1.length - 2);
        var dateId_s = dateId + '-s';
        var dateId_e = dateId + '-e';
        var yyyymmdd_s = gUtil.yyyymmdd(gm.me().getSearchWidget(dateId_s)
            .getValue(), '-');
        var yyyymmdd_e = gUtil.yyyymmdd(gm.me().getSearchWidget(dateId_e)
            .getValue(), '-');
        console_logs('<Rfx1Main>dateId_s', typeof (gm.me().getSearchWidget(dateId_s)
            .getValue()));
        var yyyymmdd = yyyymmdd_s + ':' + yyyymmdd_e;
        gm.me().getSearchWidget(dateId).setValue(yyyymmdd);

        console_logs('<Rfx1Main>yyyymmdd', yyyymmdd);
    },

    // Date 검색 툴바에서 날짜 선택하면 값을 지정
    changeDate: function (dateId1) {
        var dateId = dateId1;
        var dateIds = dateId;
        console_logs('<Rfx1Main>//dateIds', dateIds);
        var yyyymmdd = gUtil.yyyymmdd(gm.me().getSearchWidget(dateIds)
            .getValue(), '-');
        gm.me().getSearchWidget(dateId).setValue(yyyymmdd);

        console_logs('<Rfx1Main>changeDate yyyymmdd', yyyymmdd);
    },

    // DB에 영구저장
    setEnv: function (paramName, paramValue) {

        if (paramName != null && paramValue != null) {
            gMain.myenv[paramName] = paramValue;
        }

        var v = JSON.stringify(this.myenv);

        Ext.Ajax.request({
            url: CONTEXT_PATH
            + '/index/generalData.do?method=setEnv',
            params: {
                paramName: "MY_ENV",
                paramValue: v
            },
            success: function (response, request) {
                // console_logs('<Rfx1Main>response.responseText',
                // response.responseText);
                // var val =
                // Ext.JSON.decode(response.responseText);
                // console_logs('<Rfx1Main>val', val);
            }
        });
    },
    // 사용자 환경 읽기
    getEnv: function (paramName) {
        Ext.Ajax.request({
            url: CONTEXT_PATH
            + '/index/generalData.do?method=getEnv',
            scope: this,
            callback: myCallback,
            params: {
                paramName: "MY_ENV"
            },
            success: function (response, request) {
                console_logs(response.responseText);
                gMain.myenv = Ext.JSON.decode(response.responseText);
            }
        });
    },

    callBackFileAttach: function (title, records, arg, fc, id,
                                  onGrid) {

        var gridId = id == null ? this.getGridId() : id;

        var o = this.parseGridRecord(records, gridId);
        var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];
        var sortBy = o['sortBy'];

        var modelClass = 'Rfx.model.AttachFile'; // arg['model'];
        var pageSize = 100; // arg['pageSize'];
        var sorters = [{
            property: 'object_name',
            direction: 'ASC'
        }];// arg['sorters'];

        var model = Ext.create(modelClass, {
            fields: fields
        });
        var store = new Ext.data.Store({
            pageSize: pageSize,
            model: model,
            sorters: sorters
        });

        var mySorters = [{
            property: 'p.serial_no',
            direction: 'ASC'
        }];

        store.getProxy().setExtraParam('sort',
            JSON.stringify(mySorters));

        //다운로드링크 없애기.
        switch (vCompanyReserved4) {

            case 'DABP01KR' :
                store.getProxy().setExtraParam('noLink', 'false');
                break;
            default:
                store.getProxy().setExtraParam('noLink', 'true');
        }


        store.load(function () {
            var grid = Ext.create('Ext.grid.Panel', {
                id: gridId,
                store: store,
                title: title,
                // cls : 'rfx-panel',
                border: true,
                resizable: true,
                scroll: false,
                multiSelect: true,
                collapsible: false,
                layout: 'fit',
                // forceFit: true,
                region: 'center',
                // dockedItems:
                // dockedItems,
                selModel: Ext.create("Ext.selection.CheckboxModel",
                    {}),
                listeners: {
                    itemdblclick: function (view,
                                            record,
                                            htmlItem,
                                            index,
                                            eventObject,
                                            opts) {

                    }, // endof
                    // itemdblclick
                    cellkeydown: function (gridPcsStd,
                                           td,
                                           cellIndex,
                                           record, tr,
                                           rowIndex,
                                           e, eOpts) {
                        // console_logs('<Rfx1Main>record',
                        // record);
                        if (e.getKey() == Ext.EventObject.ENTER
                            && record
                                .get('pcs_name').length > 0
                            && record
                                .get('std_mh') >= 0) {

                            //console_log("cellIndex-------------" + cellIndex);
                            //console_log("rowIndex-------------"	+ rowIndex);


                            // Ext.getCmp('pcs_code').focus(true,100);
                            // addPcsStd();
                            // var
                            // pcs_name
                            // =
                            // record.get('pcs_name');
                            // if(checkPcsName(pcs_name)){
                            savePcsStd();
                            // } else {
                            // alert(pcs_name+'
                            // don\'t
                            // exist!');

                            // }

                            // save

                        }

                    }
                },// endof listeners
                columns: columns
            });
            grid.getSelectionModel().on(
                {
                    selectionchange: function (sm,
                                               selections) {
                        fc(selections);
                    }
                });


            var gridTitle = grid.getTitle();
            grid.setTitle('');

            grid.getSelectionModel().on(onGrid);

            var tabPanel = Ext.getCmp(gMain
                .geTabPanelId());

            gMain.selPanel.attachform = Ext
                .create(
                    'Ext.form.Panel',
                    {
                        region: 'north',
                        cls: 'background-FFFFFF',
                        items: [{
                            xtype: 'container',
                            layout: 'hbox',
                            pack: 'start',
                            align: 'stretch',
                            items: [

                                {
                                    xtype: 'filefield',
                                    width: 60,
                                    reference: 'basicFile',
                                    name: 'uploadFile',
                                    fieldLabel: '파일첨부',
                                    labelAlign: 'right',
                                    labelWidth: 60,
                                    buttonOnly: true,
                                    buttonConfig: {
                                        iconCls: 'af-upload'
                                    },
                                    buttonText: '찾아보기',
                                    listeners: {
                                        'change': function () {
                                            console_logs('<Rfx1Main>vSELECTED_RECORD', gMain.selPanel.vSELECTED_RECORD);
                                            var pj_code = '';
                                            if (gMain.selPanel.attachform != null) {
                                                var form = gMain.selPanel.attachform.getForm();

                                                if (form.isValid()) {
                                                    var val = form.getValues(false);
                                                    val["file_itemcode"] = gMain.selPanel.vFILE_ITEM_CODE;

                                                    switch (gMain.selPanel.link) {
                                                        case 'EMC1_DS':
                                                        case 'EMC1_DS2':
                                                        case 'EPJ1':
                                                        case 'EPJ1_T':
                                                        case 'DBM7_PLM':
                                                        case 'EMC6':
                                                        case 'LAB1':
                                                            pj_code = 'html';
                                                            break;
                                                        default:
                                                            pj_code = 'PHANTOM';
                                                            break;
                                                    }

                                                    if (gMain.selPanel.link == 'EMC6') {
                                                        pj_code = 'html';
                                                    }

                                                    var pj_uid = vCUR_USER_UID + 1000 * gMain.selNode.id;
                                                    var menuLink = gMain.selPanel.link;

                                                    console_logs('<Rfx1Main>pj_uid', pj_uid);
                                                    console_logs('<Rfx1Main>menuLink', menuLink);

                                                    if (gMain.selPanel.vSELECTED_RECORD != null) {
                                                        console_logs('<Rfx1Main>gMain.selPanel.vSELECTED_RECORD>>>>>>>>>>>>>>>>Main.js', gMain.selPanel.vSELECTED_RECORD);
                                                        if (gMain.selPanel.link != 'EMC1_DS'
                                                            || gMain.selPanel.link != 'EMC1_DS2' || gMain.selPanel.link != 'EPJ1'
                                                            || gMain.selPanel.link != 'DBM7_PLM' || gMain.selPanel.link != 'EPJ1_T') {
                                                            pj_code = gMain.selPanel.vSELECTED_RECORD.get('pj_code');
                                                        }
                                                        menuLink = gMain.selPanel.vSELECTED_RECORD.get('menuLink');
                                                        //청룡 자재별 이미지파일 첨부 분기
                                                        switch (gMain.selPanel.link) {
                                                            case "DDW6_MES":
                                                                pj_uid = gMain.selPanel.vSELECTED_RECORD.get('unique_id');
                                                                break;
                                                            case "EMC6":
                                                                pj_uid = gMain.selPanel.vSELECTED_RECORD.get('unique_id');
                                                                pj_code = 'html';
                                                                break;
                                                            case "DDW6"://dabp
                                                                pj_uid = gMain.selPanel.vSELECTED_RECORD.get('srcahd_uid');
                                                                break;
                                                            case "EMC1_DS"://두성 설비
                                                            case "EMC1_DS2":
                                                                pj_uid = gMain.selPanel.vSELECTED_RECORD.get('unique_id');
                                                                break;
                                                            case "EPJ1":
                                                            case "EPJ1_T":
                                                                pj_uid = gMain.selPanel.vSELECTED_RECORD.get('unique_id');
                                                                break;
                                                            case "DBM7_PLM":
                                                                pj_uid = gMain.selPanel.vSELECTED_RECORD.get('id');
                                                                break;
                                                            case "LAB1":
                                                                pj_uid = gMain.selPanel.vSELECTED_RECORD.get('id');
                                                                break;
                                                            default:
                                                                pj_uid = gMain.selPanel.vSELECTED_RECORD.get('ac_uid');
                                                                console_logs('<Rfx1Main>ac_uid>>>>>>>>>>>>', pj_code);
                                                                break;
                                                        }

                                                    }

                                                    form.submit({
                                                        url: CONTEXT_PATH + '/uploader.do?method=uploadprpject&pj_code=' + pj_code + '&pj_uid=' + pj_uid,
                                                        waitMsg: '파일 업로드 중입니다.',
                                                        success: function (fp, o) {
                                                            console_logs('<Rfx1Main>submit fp', fp);
                                                            console_logs('<Rfx1Main>submit o', o);

                                                            if (vSYSTEM_TYPE_SUB == "HEAVY4") {


                                                                console_logs('<Rfx1Main>this.menu_link_switch_before>>>>>>>>>>>', gMain.selPanel.link);

                                                                switch (gMain.selPanel.link) {
                                                                    case "EMC1_DS":
                                                                    case "EMC1_DS2":
                                                                    case "EPJ1":
                                                                    case "EPJ1_T":
                                                                        //case "DBM7_PLM":
                                                                        if (gMain.selPanel.vSELECTED_RECORD != undefined
                                                                            && gMain.selPanel.vSELECTED_RECORD != null) {
                                                                            var pj_uid = gMain.selPanel.vSELECTED_RECORD.get('unique_id');
                                                                        } else {
                                                                            var pj_uid = vCUR_USER_UID + 1000 * gMain.selNode.id;
                                                                        }
                                                                        break;
                                                                    case "DBM7_PLM":
                                                                        if (gMain.selPanel.vSELECTED_RECORD != undefined
                                                                            && gMain.selPanel.vSELECTED_RECORD != null) {
                                                                            var pj_uid = gMain.selPanel.vSELECTED_RECORD.get('id');
                                                                        } else {
                                                                            var pj_uid = vCUR_USER_UID + 1000 * gMain.selNode.id;
                                                                        }
                                                                        break;
                                                                    case "DDW6_MES":
                                                                        console_logs('<Rfx1Main>this.menu_link_switch_after>>>>>>>>>>>', gMain.selPanel.link);
                                                                        var pj_uid = gMain.selPanel.vSELECTED_RECORD.get('unique_id');
                                                                        //console_logs('<Rfx1Main>unique_id',pj_uid);
                                                                        break;
                                                                    default:
                                                                        var pj_uid = vCUR_USER_UID + 1000 * gMain.selNode.id;
                                                                        break;
                                                                }

                                                            } else {
                                                                switch (gMain.selPanel.link) {
                                                                    case "DDW6":
                                                                        var pj_uid = gMain.selPanel.vSELECTED_RECORD.get('srcahd_uid');
                                                                        break;
                                                                    case "EMC6":
                                                                        var pj_uid = gMain.selPanel.vSELECTED_RECORD.get('unique_id');
                                                                        break;
                                                                    default:
                                                                        var pj_uid = gMain.selPanel.vSELECTED_RECORD.get('ac_uid');
                                                                        break;
                                                                }
                                                            }
                                                            gMain.loadFileAttach(pj_uid, gMain.selectedMenuId + 'designFileAttach');
                                                        },
                                                        failure: function () {
                                                            console_log('failure');
                                                            Ext.MessageBox.alert('파일업로드', 'Failed');
                                                        }
                                                    });
                                                }
                                            }
                                            // gUtil.enable(fileRegistAction);
                                        }
                                    },
                                    render: function (c) {
                                        Ext.create('Ext.tip.ToolTip',
                                            {
                                                target: c.getEl(),
                                                html: c.name
                                            });
                                    }
                                },
                                {
                                    id: id
                                    + 'delButton',
                                    xtype: 'button',
                                    style: 'margin-left:100px;',
                                    iconCls: 'af-remove',
                                    text: '파일삭제',
                                    tooltip: '삭제할 파일을 선택하세요.',
                                    disabled: true,
                                    handler: function (widget,
                                                       event) {
                                        Ext.MessageBox
                                            .show({
                                                title: '삭제하기',
                                                msg: '선택한 항목을 삭제하시겠습니까?',
                                                buttons: Ext.MessageBox.YESNO,
                                                fn: gMain.deleteFileConfirm,
                                                icon: Ext.MessageBox.QUESTION
                                            });
                                    }
                                }

                            ]

                        }

                        ]
                    });

            var panel = new Ext.Panel({
                title: gridTitle,
                items: [gMain.selPanel.attachform,
                    grid]
            });

            try {
                tabPanel.add(panel);
            } catch (e) {
                console_logs(
                    'tabPanel.add(panel) error', e);
            }

            var pj_uid = vCUR_USER_UID + 1000
                * gMain.selNode.id;
            console_logs('<Rfx1Main>pj_uid', pj_uid);
            gMain.loadFileAttach(pj_uid, gMain.selectedMenuId + 'designFileAttach');
        });

    },// callback
    deleteFileConfirm: function (result) {
        if (result == 'yes') {
            var fileGrid = Ext.getCmp(gMain.selectedMenuId
                + 'designFileAttach');
            var selections = fileGrid.getSelectionModel()
                .getSelection();
            var selectedAttFileRecords = [];
            var record = null;
            var records = [];
            var uids = [];

            if (selections) {
                // console_logs('<Rfx1Main>fileGrid selections',
                // selections);
                for (var i = 0; i < selections.length; i++) {
                    record = selections[i];
                    records.push(selections[i]);
                    // console_logs('<Rfx1Main>record id',
                    // record.get('id'));
                    uids.push(record.get('id'));

                    if (gMain.selectedMenuId == 'sales-delivery-SRO4') {
                        // this.selePanel.selectedAttFileRecords.push(record);
                    }
                }

                Ext.Ajax
                    .request({
                        url: CONTEXT_PATH
                        + '/fileObject.do?method=deleteAll',
                        params: {
                            unique_uids: uids
                        },
                        method: 'POST',
                        success: function (rec, op) {
                            console_logs(
                                'gMain.selectedMenuId',
                                gMain.selectedMenuId);
                            // 중공업인지 아닌지 구분
                            var heavy4YN = 'N';
                            var selMenuId = gMain.selectedMenuId;
                            switch (selMenuId) {
                                case 'sales-delivery-SRO4':
                                case 'sales-delivery-SRO4_SEW':
                                case 'sales-delivery-SRO4_DDG':
                                case 'sales-delivery-SRO4_DD1':
                                case 'sales-delivery-SRO4_PNL':
                                case 'sales-delivery-QQL4_PNL':
                                case 'sales-delivery-SRO4_DS':
                                case 'sales-delivery-SRO4_HSG':
                                case 'sales-delivery-SRO4_HSG2':
                                case 'sales-delivery-SRO4_HSG3':
                                case 'sales-delivery-SRO4_HSG4':
                                case 'sales-delivery-SRO4_KM':
                                case 'sales-delivery-SRO4_KM3':
                                case 'sales-delivery-SRO4_CHNS':
                                case 'sales-delivery-SRO4_CHNG':
                                case 'design-plan-SRO4_DS1':
                                case 'design-plan-DDW6_MES':
                                case 'equip-state-EMC1_DS':
                                case 'equip-state-EMC1_DS2':
                                case 'produce-mgmt-EPJ1':
                                case 'produce-mgmt-EPJ1_T':
                                case 'design-plan-DBM7_PLM':
                                    heavy4YN = 'Y';
                                    break;
                            }
                            if (heavy4YN == 'N') {
                                if (gMain.selPanel.vSELECTED_RECORD != null) {
                                    gMain.loadFileAttach(
                                        //Ext.Msg.alert('Status', gMain.selPanel.vSELECTED_RECORD),
                                        gMain.selPanel.vSELECTED_RECORD.get('ac_uid'),
                                        gMain.selectedMenuId + 'designFileAttach');
                                }

                            } else {
                                var fileGrid = Ext
                                    .getCmp(gMain.selectedMenuId
                                        + 'designFileAttach');
                                /*
                                 * for(var i=0; i<this.selePanel.selectedAttFileRecords.length;
                                 * i++) { var record =
                                 * this.selePanel.selectedAttFileRecords[i]; }
                                 */
                                for (var j = 0; j < records.length; j++) {

                                    fileGrid
                                        .getStore()
                                        .remove(
                                            records[j]);
                                }
                                // fileGrid.getView().refresh();

                            }

                        },
                        failure: function (rec, op) {
                            Ext.Msg.alert('안내',
                                '삭제에 실패하였습니다.',
                                function () {
                                });

                        }
                    });

            }

        }
    },
    // 파일첨부 판넬추가
    addTabFileAttachGridPanel: function (title, menuCode, arg,
                                         fc, id, onGrid) {

        this.extFieldColumnStore.load({
            params: {
                menuCode: menuCode

            },
            callback: function (records, operation, success) {
                if (success == true) {
                    gMain.callBackFileAttach(title, records,
                        arg, fc, id, onGrid);
                } else {// endof if(success..
                    Ext.MessageBox.show({
                        title: '연결 종료',
                        msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
                        buttons: Ext.MessageBox.OK,
                        // animateTarget: btn,
                        scope: this,
                        icon: Ext.MessageBox['ERROR'],
                        fn: function () {

                        }
                    });
                }
            },
            scope: this
        });

    },
    loadFileAttach: function (targetUid, id) {
        console_logs('<Rfx1Main>loadFileAttach targetUid', targetUid);

        var fileGrid = Ext.getCmp(id);
        fileGrid.getStore().getProxy().setExtraParam('unique_id', targetUid);
        fileGrid.getStore().getProxy().setExtraParam('menuLink', gMain.selPanel.link);
        fileGrid.getStore().getProxy().setExtraParam('noLink', gMain.selPanel.fileNolink);
        console_logs('<Rfx1Main>loadFileAttach menuLink', gMain.selPanel.link);
        fileGrid.getStore().load();

        try {
            var fileGrid = Ext.getCmp(id);
            fileGrid.getStore().getProxy().setExtraParam('unique_id', targetUid);
            fileGrid.getStore().getProxy().setExtraParam('menuLink', gMain.selPanel.link);
            console_logs('<Rfx1Main>loadFileAttach menuLink', gMain.selPanel.link);
            fileGrid.getStore().load();
        } catch (e) {
            console_logs('<Rfx1Main>loadFileAttach'.e);
        }

    },
    returnPath: function (targetUid, id, fnCallback) {
        console_logs('<Rfx1Main>loadFileAttach targetUid', targetUid);
        var fileGrid = Ext.getCmp(id);
        console_logs('<Rfx1Main>===>file', fileGrid);
        fileGrid.getStore().getProxy().setExtraParam('unique_id', targetUid);
        fileGrid.getStore().getProxy().setExtraParam('menuLink', gMain.selPanel.link);
        console_logs('<Rfx1Main>loadFileAttach menuLink', gMain.selPanel.link);
        console_logs('<Rfx1Main>==>targetUid', targetUid);
        var emc_file = fileGrid.getStore().getData().items[0].get('file_name');

        fileGrid.getStore().load({
            callback: function (records, operation, success) {
                if (fileGrid.getStore().totalCount > 0) {
                    for (var i = 0; i < fileGrid.getStore().totalCount; i++) {
                        var emc_file = fileGrid.getStore().getData().items[i].get('file_name');
                        var file_extension = emc_file.substring(emc_file.lastIndexOf('.') + 1, emc_file.length);
                        switch (file_extension) {
                            case 'jpg':
                            case 'gif':
                            case 'bmp':
                            case 'png':
                                fnCallback(emc_file);
                                break;
                            default:
                                if (i == fileGrid.getStore().totalCount - 1) {
                                    fnCallback("default.png");
                                }
                                break;
                        }
                    }
                } else {
                    fnCallback("default.png");
                }
            }
        });
        //스토어는 async이므로 callback 함수에서 바로 return값을 넘길 수 없다.
    },
    loadGeneralgrid: function (targetUid, gridId) {
        console_logs('<Rfx1Main>loadGeneralgrid targetUid', targetUid);
        var grid = Ext.getCmp(gridId);
        grid.getStore().getProxy().setExtraParam('uid_srcahd',
            targetUid);
        grid.getStore().load();
    },
    callBackGeneralGrid: function (title, records, arg, fc, id,
                                   onGrid) {

        var gridId = id == null ? this.getGridId() : id;

        var o = this.parseGridRecord(records, gridId);
        var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];
        // 소팅기준
        var sortBy = o['sortBy'];

        var modelClass = arg['model'];
        var pageSize = arg['pageSize'];
        var sorters = arg['sorters'];
        var checkbox = arg['checkbox'];

        var model = Ext.create(modelClass, {
            fields: fields
        });
        var store = new Ext.data.Store({
            pageSize: pageSize,
            model: model,
            sorters: sorters
        });

        store.getProxy().setExtraParam('sort',
            JSON.stringify(sorters));

        var tabPanel = Ext.getCmp(this.geTabPanelId());

        var grid = Ext
            .create(
                'Ext.grid.Panel',
                {
                    id: gridId,
                    store: store,
                    title: title,
                    border: true,
                    resizable: true,
                    scroll: false,
                    multiSelect: true,
                    collapsible: false,
                    layout: 'fit',
                    // forceFit: true,
                    region: 'center',
                    // dockedItems: dockedItems,
                    selModel: checkbox ? Ext
                        .create(
                            "Ext.selection.CheckboxModel",
                            {})
                        : null,
                    listeners: {
                        itemdblclick: function (view,
                                                record, htmlItem,
                                                index, eventObject,
                                                opts) {

                        }, // endof itemdblclick
                        cellkeydown: function (gridPcsStd, td,
                                               cellIndex, record, tr,
                                               rowIndex, e, eOpts) {
                            // console_logs('<Rfx1Main>record',
                            // record);
                            if (e.getKey() == Ext.EventObject.ENTER
                                && record
                                    .get('pcs_name').length > 0
                                && record
                                    .get('std_mh') >= 0) {

                                //console_log("cellIndex-------------"	+ cellIndex);
                                //console_log("rowIndex-------------"	+ rowIndex);


                                // Ext.getCmp('pcs_code').focus(true,100);
                                // addPcsStd();
                                // var pcs_name =
                                // record.get('pcs_name');
                                // if(checkPcsName(pcs_name)){
                                savePcsStd();
                                // } else {
                                // alert(pcs_name+'
                                // don\'t exist!');

                                // }

                                // save

                            }

                        }
                    },// endof listeners
                    columns: columns
                });

        if (checkbox == true) {
            grid.getSelectionModel().on({
                selectionchange: function (sm, selections) {
                    fc(selections);
                }
            });

        }

        tabPanel.add(grid);

    },// callback
    // General 판넬추가
    addTabGeneralGridPanel: function (title, menuCode, arg, fc, id, onGrid) {

        this.extFieldColumnStore.load({
            params: {
                menuCode: menuCode
            },
            callback: function (records, operation, success) {
                if (success == true) {
                    gMain.callBackGeneralGrid(title, records,
                        arg, fc, id, onGrid);
                } else {// endof if(success..
                    Ext.MessageBox.show({
                        title: '연결 종료',
                        msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
                        buttons: Ext.MessageBox.OK,
                        // animateTarget: btn,
                        scope: this,
                        icon: Ext.MessageBox['ERROR'],
                        fn: function () {

                        }
                    });
                }
            },
            scope: this
        });

    },

    carTypeStore: null,
    // rackTypeStore : null
    loadJs: function (url) {
        if (url != null && url.length > 0) {
            var js = document.createElement('script');

            js.type = "text/javascript";
            js.src = CONTEXT_PATH + url;

            // console_log('js.src=' + js.src);
            try {
                document.body.appendChild(js);
            } catch (e) {
                console_log("script in page exception in appendChild: "
                    + utl + e);
                lfn_gotoHome();
            }

            // console_log('LoadJs OK.');

        }

    },
    getTableName: function (field_name) {
//						console_logs('<Rfx1Main>getTableName field_name', field_name);
        var fields = this.me().getFields();
        for (var i = 0; i < fields.length; i++) {
            var o = fields[i];
//							console_logs('<Rfx1Main>getTableName o', o);
            if (field_name == o['name']) {
                return o['tableName'];
            }
        }
        return null;
    },
    getCell_edit: function (me) {
        //console_logs('<Rfx1Main>==me2==', me);
        var listLmenu = gUtil.lmenuStruct;
        var cell_edit = 'N';
        for (var i = 0; i < listLmenu.length; i++) {
            var o = listLmenu[i];

            //console_logs('<Rfx1Main>getCell_edit o', o);

            if (o['menu_key'] == me.link) {
                return o['cell_edit']
            }
        }
        return cell_edit;
    },
    getLock_cnt: function (me) {
        var listLmenu = gUtil.lmenuStruct;
        var lock_cnt = 0;
        for (var i = 0; i < listLmenu.length; i++) {
            var o = listLmenu[i];
            if (o['menu_key'] == me.link) {
                return o['lock_cnt']
            }
        }
        return lock_cnt;
    },
    getCell_type: function (me) {
        //console_logs('<Rfx1Main>==me==', me);
        var listType = gm.me().fieldObj;
        //console_logs('<Rfx1Main>==listType==', listType);
        var cell_type = 'string';
        for (var i = 0; i < listType.length; i++) {
            var o = listType[i];

//				console_logs('<Rfx1Main>getCell_edit o', o);

            if (o['menu_key'] == me.link) {
                return o['cell_type']
            }
        }
        return cell_type;
    },
    getMulti_grid: function (link) {
        var listLmenu = gUtil.lmenuStruct;
        var multi_grid = 'N';
        for (var i = 0; i < listLmenu.length; i++) {
            var o = listLmenu[i];
            if (o['menu_key'] == link) {
                return o['multi_grid']
            }
        }
        return multi_grid;
    },
    getColumnType: function (key, tab_code) {
        var type = 'string';

        var fields = tab_code == null ? this.selPanel.fields : this.selPanel.fields_map[tab_code];

        for (var i = 0; i < fields.length; i++) {
            var o = fields[i];
//			console_logs('<Rfx1Main>getColumnType o', o);
            if (o['name'] == key) {
                type = o['type'] == null ? 'string' : o['type'];
                return type;
            }
        }

        return type;
    },

    editAjax: function (tableName, field, value, whereField, in_whereValue, in_params, sync_mode) {

        console_logs('<Rfx1Main>tableName', tableName);
        console_logs('<Rfx1Main>sync_mode', sync_mode);
        if (tableName == null || tableName == '') {
            //gm.me().showToast('오류', '수정할 테이블 이름이 J2_CODE에 정의되지 않았습니다.');
            return;
        }
        gm.me().recCount++;

        var params = {};
        if (in_params != null) {
            for (var key in in_params) {
                params[key] = in_params[key];
            }
        }
        console_logs('<Rfx1Main>params>>>>>>>>>>>>>>>>>', params);
        var whereValue = [];
        whereValue.push(in_whereValue);
        //console_logs('<Rfx1Main>in_whereValue', whereValue);
        params['tableName'] = tableName;
        params['setField'] = field;
        params['setValue'] = value;
        params['whereField'] = whereField;
        params['whereValue'] = whereValue;
        switch (vCompanyReserved4) {
            case 'KYNL01KR':
                break;
            default:
                params['valueType'] = gm.getColType(field);
                break;
        }

        gm.me().sync_mode = sync_mode;

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/generalData.do?method=updateGeneralOne',
            params: params,
            success: function (result, request) {

                //console_logs('<Rfx1Main>editRedord result', result);
                var result = result.responseText;
                if (result != null) {
                    var o = Ext.util.JSON.decode(result);
                    if (o != null) {
                        var field_name = gm.getColName(o['setField']);
                        switch (vCompanyReserved4) {
                            case 'KYNL01KR':
                                break;
                            default:
                                var field_type = gm.getColType(o['setField']);
                                break;
                        }
                        var value = o['setValue'];
                        var id = o['whereValue'];

                        if (gm.useEditAjaxToast()) {
                            switch (gMain.selPanel.link) {
                                case 'QTT4_MES':
                                    break;
                                case 'PMS1':
                                    break;
                                case 'DBM7_PLM':
                                    break;
                                case 'PPO1_PNL':
                                    gm.me().storeLoad();
                                    break;
                                case 'BCO':
                                    gm.me().storeLoad();
                                    break;
                                case 'SRO5_DS1':
                                    break;
                                case 'EPJ1':
                                case 'MC_REPORT':
                                    gm.me().storeLoad();
                                    break;
                                default:
                                    var msg = '';
                                    if (value == '') {
                                        switch (vCompanyReserved4) {
                                            case 'KYNL01KR':
                                                msg = 'UID ' + id[0] + '외 ' + (id.length - 1) + '건의 <' + field_name + '> 값이 ' + ' 초기화 되었습니다.'
                                                break;
                                            default:
                                                msg = 'UID ' + id + '의 <' + field_name + '> 값이 ' + ' 초기화 되었습니다.'
                                                break;
                                        }
                                    } else {
                                        switch (vCompanyReserved4) {
                                            case 'KYNL01KR':
                                                msg = 'UID ' + id[0] + '외 ' + (id.length - 1) + '건의 <' + field_name + '> 값이 ' + '"' + value + '" (으)로 수정되었습니다.'
                                                break;
                                            default:
                                                msg = 'UID ' + id + '의 <' + field_name + '> 값이 ' + '"' + value + '" (으)로 수정되었습니다.'
                                                break;
                                        }

                                    }
                                    if (vCompanyReserved4 == 'SWON01KR' || vCompanyReserved4 == 'BIOT01KR'
                                        || vCompanyReserved4 == 'CHMR01KR' || vCompanyReserved4 == 'WOWT01KR') {
                                        gm.me().storeLoad();
                                    }
                                    gm.me().showToast('셀수정 결과', msg);
                                    break;
                            }
                        } else {
                            gm.me().storeLoad();
                        }


                        gm.me().recCount--;
                        gm.setCenterLoading(false);
                        console_logs('<Rfx1Main>gm.me().sync_mode', gm.me().sync_mode);
                        if (gm.me().sync_mode == false || gm.me().sync_mode == undefined) {
                            gm.me().sync_mode = null;
                        } else {
                            try {
                                gm.me().getStore().sync();
                            } catch (e) {
                            }
                        }
                    }
                }

            }
        });
    },
    editRedord: function (field, rec, columnType, sync_mode) {

        console_logs('<Rfx1Main>gm ====> edited field', field);
        console_logs('<Rfx1Main>gm ====> edited record', rec);
        console_logs('<Rfx1Main>gm ====> edited columnType', columnType);

        var cell_edit = this.getCell_edit(this.me());

        console_logs('<Rfx1Main>gm ====>  cell_edit', cell_edit);

        if (cell_edit == 'Y') {
            var update_pcsstep = rec.get('update_pcsstep'); //공정 졀로 PCSSTEP 수정

            console_logs('<Rfx1Main>update_pcsstep = ', update_pcsstep);

            //Ext.Msg.alert(value);

            var arr = field.split('|');

            // ONLY_STEP : 단순한 PCSSTEP 수정
            // FULL_MAKE : FULL 동정처리
            //var columnType = this.getColumnType(field);
            var value = rec.get(field);
            var tableName = this.getTableName(field);
            var whereField = "unique_id";

            if (tableName == null) {
                tableName = rec.get('tableName');
            }

            var whereValue = rec.get(tableName + '_uid');

            if (whereValue == null) {
                whereValue = rec.get('id');
            }

            console_logs('<Rfx1Main>value = ', value);
            console_logs('<Rfx1Main>whereValue = ', whereValue);
            console_logs('<Rfx1Main>arr = ', arr);
            console_logs('<Rfx1Main>arr.length = ', arr.length);

            if (update_pcsstep != null && arr.length > 1) {
                var vo = rec.data;

                value = vo[field];

                var uidKey = arr[0] + '|' + 'step_uid';
                console_logs('<Rfx1Main>uidKey', uidKey);
                console_logs('<Rfx1Main>vo', vo);
                whereValue = vo[uidKey];
                console_logs('<Rfx1Main>whereValue', whereValue);
                if (value == null) {
                    switch (vCompanyReserved4) {
                        case 'SKNH01KR':
                            var type = (update_pcsstep == 'FULL_MAKE') ? 'update_pcsstep' : '';
                            this.editAjax('pcsstep', arr[1], value, whereField, whereValue, {type: type}, sync_mode);
                            break;
                        default:
                            gm.me().showToast('셀수정 결과', '지정된 값을 확인할 수 없습니다.');
                            break;
                    }
                } else if (whereValue == null) {
                    //Ext.MessageBox.alert('오류','작업지시 항목(PCSSTEP UID)를 확인할 수 없습니다.');
                    gm.me().showToast('셀수정 결과', '작업지시 항목(PCSSTEP UID)를 확인할 수 없습니다.');
                } else {
                    var type = (update_pcsstep == 'FULL_MAKE') ? 'update_pcsstep' : '';
                    this.editAjax('pcsstep', arr[1], value, whereField, whereValue, {type: type}, sync_mode);

                }
            } else {
                if (value != null) {
                    this.editAjax(tableName, field, value, whereField, whereValue, {type: ''}, sync_mode);
                }
            }
        }//endof cell_edit=='Y'

    },

    GetServerTime: function () {

        var url = CONTEXT_PATH + 'login.do?method=getTime'

        if (url == undefined) {
            url = window.location.href.toString();
        }
        if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
        } else {
            return null;
        }

        xmlHttp.open('HEAD', url, false);

        xmlHttp.setRequestHeader("Content-Type", "text/html");

        xmlHttp.send('');

        return xmlHttp.getResponseHeader("Date");
    },

    supastPcsStore: Ext.create('Mplm.store.SupastStore', {hasOwn: true}),
    mchnPcsStore: Ext.create('Mplm.store.MachineStore', {hasNull: true}),

    treeMenu: null,
    treeMenuStore: null,
    createTreeMenu: function (listMenu, onSelect) {
        if (this.treeMenu != null) {
            return this.treeMenu;
        }

        Ext.define('MenuModel', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'name'},
                {name: 'link'}
            ]
        });

        this.treeMenuStore = Ext.create('Ext.data.Store', {
            model: 'MenuModel',
            data: listMenu
        });

        var treePanel = this.getMenuTreePanel(listMenu);

        this.treeMenu = vEDIT_MODE ? Ext.create('Ext.panel.Panel', {
            title: '',
            region: 'west',
            frame: false,
            width: vEDIT_MODE ? 400 : 200,
            layout: 'border',
            defaults: {
                split: true,
                bodyPadding: 3,
            },
            border: false,
            layoutConfig: {
                columns: 1,
                rows: 2
            },
            items: [
                treePanel,
                {
                    id: 'menuEdit-tab',
                    xtype: 'tabpanel',
                    title: '메뉴 수정',
                    //closable: true,
                    collapsible: true,
                    frame: true,
                    region: 'south',
                    height: '50%',
                    // padding: '0 0 0 0',
                    // margin: '0 0 0 0',
                    items: [gu.propGrid,
                        gu.authFormpanel
                    ],
                    header: {
                        itemPosition: 1, // after title before collapse tool
                        items: [{
                            ui: 'default-toolbar',
                            id: 'authSaveBtn',
                            xtype: 'button',
                            text: '저장',
                            iconCls: null,
                            glyph: 'f0c7@FontAwesome',
                            disabled: true
                        }]
                    },
                    listeners: {
                        tabchange: function (tabPanel, newTab, oldTab, eOpts) {
                            console_logs('<Rfx1Main>tabpanel', tabPanel);
                            console_logs('<Rfx1Main>gu roleCodes', gu.roleCodes);
                            console_logs('<Rfx1Main>tabpanel newTab newTab.title', newTab.title);
                            if (newTab.title == '권한') {
                                //panel.doLayout();
                            }


                        }
                    }
                }


            ]
        })
            : treePanel;

        //treePanel.expandAll();
        return this.treeMenu;
    },
    leftTreeMenu: null,
    getMenuTreePanel: function (listMenu) {

        var listStruct = [];

        for (var i = 0; i < gu.menuStruct.length; i++) {
            var o = gu.menuStruct[i];
            //console_logs('<Rfx1Main>==========> o', o);
            var struct = {
                unique_id: '' + o.unique_id,
                menumap_uid: '' + o.menumap_uid,
                text: o.display_name,
                display_name: o.display_name,
                linkPath: o.linkPath,
                menu_key: o.menu_key,
                parentName: o.parentName,
                menuPerm: o.menuPerm,
                permType: o.permType,
                service_name: o.service_name,
                expanded: false,
                id: o.menu_key,
                flag1 : o.flag1,
                flag2 : o.flag2,
                flag3 : o.flag3,
                flag4 : o.flag4,
                flag5 : o.flag5,
                children: []
            };

            //console_logs('<Rfx1Main>struct', struct);
            listStruct.push(struct);
        }

        //child 찾기
        for (var j = 0; j < gu.lmenuStruct.length; j++) {
            var o1 = gu.lmenuStruct[j];
            //console_logs('<Rfx1Main>==========> o1', o1);
            var struct = null;

            for (var i = 0; i < listStruct.length; i++) {
                var o = listStruct[i];
                if (o.service_name == o1.parentName) {
                    struct = o;
                }
            }

            if (struct != null) {
                struct.children.push({
                    leaf: true,
                    text: o1.display_name,
                    cell_edit: o1.cell_edit,
                    classId: o1.classId,
                    display_name: o1.display_name,
                    linkPath: o1.linkPath,
                    lock_cnt: o1.lock_cnt,
                    menu_key: o1.menu_key,
                    multi_grid: o1.multi_grid,
                    parentName: o1.parentName,
                    menuPerm: o1.menuPerm,
                    permType: o1.permType,
                    service_name: o1.service_name,
                    selectedMenuGroup: struct.menu_key,
                    unique_id: '' + o1.unique_id,
                    menumap_uid: '' + o1.menumap_uid,
                    flag1 : o1.flag1,
                    flag2 : o1.flag2,
                    flag3 : o1.flag3,
                    flag4 : o1.flag4,
                    flag5 : o1.flag5,
                    id: o1.menu_key
                })

            }


        }

        lastFilterValue = "";
        var me = this.leftTreeMenu ||

            Ext.create('Ext.tree.Panel', {
                region: vEDIT_MODE ? 'center' : 'west',
                fields: ['name', 'link'],
                width: vEDIT_MODE ? 400 : 200,
                useArrows: true,
                rootVisible: false,
                multiSelect: false,
                singleExpand: false,
                frame: false,
                border: false,
                style: 'border-right: 1px solid #F5F5F5; border-bottom: 1px solid #F5F5F5;',
                collapsible: false,
                filterStore: function (value) {
                    var me = this,
                        store = me.store,
                        searchString = value.toLowerCase(),
                        filterFn = function (node) {
                            var children = node.childNodes,
                                len = children && children.length,
                                visible = v.test(node.get('text')),
                                i;

                            // If the current node does NOT match the search condition
                            // specified by the user...
                            if (!visible) {

                                // Check to see if any of the child nodes of this node
                                // match the search condition.  If they do then we will
                                // mark the current node as visible as well.
                                for (i = 0; i < len; i++) {
                                    if (children[i].isLeaf()) {
                                        visible = children[i].get('visible');
                                    } else {
                                        visible = filterFn(children[i]);
                                    }
                                    if (visible) {
                                        break;
                                    }
                                }

                            } else { // Current node matches the search condition...

                                // Force all of its child nodes to be visible as well so
                                // that the user is able to select an example to display.
                                for (i = 0; i < len; i++) {
                                    children[i].set('visible', true);
                                }

                            }

                            return visible;
                        },
                        v;

                    if (searchString.length < 1) {
                        store.clearFilter();
                    } else {
                        v = new RegExp(searchString, 'i');
                        store.getFilters().replaceAll({
                            filterFn: filterFn
                        });
                    }
                },

                strMarkRedPlus: function (search, subject) {
                    return subject.replace(
                        new RegExp('(' + search + ')', "gi"), "<span style='color: red;'><b>$1</b></span>");
                },
                dockedItems: [

                    Ext.create('widget.toolbar', {
                            // style: 'margin-right: 0',
                            items: [
                                {
                                    id: 'main-toolbarPath',
                                    xtype: 'component',
                                    html: '-'
                                },
                                '->',
                                {
                                    iconCls: 'arrow_left',
                                    scale: 'small',
                                    //text: '<',
                                    cls: 'my-menu-item',
                                    handler: function (btn) {
                                        console_logs('<Rfx1Main>btn', btn);
                                        gm.treeMenu.collapse();
                                    }
                                },
                            ],
                            height: 30,
                            cls: 'my-x-toolbar-default1-4'
                        }
                    ),
                    {
                        xtype: 'textfield',
                        dock: 'top',
                        emptyText: '메뉴검색',
                        enableKeyEvents: true,
                        padding: '9 9 9 9',
                        triggers: {
                            clear: {
                                cls: 'x-form-clear-trigger',
                                handler: 'onClearTriggerClick',
                                hidden: true,
                                scope: 'this'
                            },
                            search: {
                                cls: 'x-form-search-trigger',
                                weight: 1,
                                handler: 'onSearchTriggerClick',
                                scope: 'this'
                            }
                        },

                        onClearTriggerClick: function () {
                            this.setValue();
                            me.store.clearFilter();
                            this.getTrigger('clear').hide();
                        },

                        onSearchTriggerClick: function () {
                            me.filterStore(this.getValue());
                        },

                        listeners: {
                            keyup: {
                                fn: function (field, event, eOpts) {
                                    var value = field.getValue();

                                    // Only filter if they actually changed the field value.
                                    // Otherwise the view refreshes and scrolls to top.
                                    if (value == '') {
                                        field.getTrigger('clear').hide();
                                        me.filterStore(value);
                                        lastFilterValue = value;
                                    } else if (value && value !== lastFilterValue) {
                                        field.getTrigger('clear')[(value.length > 0) ? 'show' : 'hide']();
                                        me.filterStore(value);
                                        lastFilterValue = value;
                                    }
                                },
                                buffer: 300
                            },

                            render: function (field) {
                                this.searchField = field;
                            },

                            scope: me
                        }
                    }],
                columns: [{
                    xtype: 'treecolumn',
                    text: '메뉴',
                    dataIndex: 'text',
                    flex: 1,
                    sortable: false,
                    cls: vEDIT_MODE ? '' : 'x-column-header-hide'
                }, {
                    text: '메뉴코드',
                    dataIndex: 'menu_key',
                    width: vEDIT_MODE ? 100 : 0,
                    cls: vEDIT_MODE ? '' : 'x-column-header-hide',
                    sortable: true
                }, {
                    text: '서비스',
                    dataIndex: 'service_name',
                    width: vEDIT_MODE ? 100 : 0,
                    cls: vEDIT_MODE ? '' : 'x-column-header-hide',
                    sortable: true
                }],
                root: {
                    name: '메뉴',
                    link: 'Root 메뉴',
                    expanded: true,
                    children: listStruct
                }
            });

        // me.on('append', function(tree, p, node){
        // 	console_logs('<Rfx1Main>append node', node);
        // 	if(node.id == 9){ // select node
        // 		node.select.defer(100, node);
        // 	}
        //  });


        var pNode = me.getStore().getNodeById(this.selectedMenuGroup);
        if (pNode != null) {
            pNode.expand();
        }
        var node = me.getStore().getNodeById(this.selLink);
        if (node != null) {
            me.getSelectionModel().select(node);
            console_logs('<Rfx1Main>======> gu', gu);
            if (vEDIT_MODE != null && vEDIT_MODE != undefined && vEDIT_MODE == true) {
                gu.setMenuProps(node);
            }
        }


        me.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                var rec = selections[0];
                if (rec != null) {
                    console_logs('<Rfx1Main>rec', rec);
                    var linkPath = rec.get('linkPath');
                    var selectedMenuGroup = rec.get('selectedMenuGroup');
                    var menu_key = rec.get('menu_key');
                    var hashTo = (selectedMenuGroup == undefined) ? '#' + menu_key : '#' + selectedMenuGroup + ':' + menu_key;
                    gm.hashTo8(hashTo, linkPath, rec);

                    if (vEDIT_MODE != null && vEDIT_MODE != undefined && vEDIT_MODE == true) {
                        gu.setMenuProps(rec);
                    }
                }

            }
        });
        return me;
    },

    createLeftMenuAll: function () {
        var listLmenu = gUtil.lmenuStruct;
        gu.leftMenuAll = [];

        if (listLmenu != null && Array.isArray(listLmenu)) {
            for (var i = 0; i < listLmenu.length; i++) {
                var o = listLmenu[i];
                var linkPath = o['linkPath'];
                if (gu.checkLinkPath(linkPath) == false) {
                    linkPath = null;
                }
                var o = {
                    id: i + 1,
                    name: o['display_name'],
                    link: o['menu_key'],
                    classId: o['classId'],
                    className: o['service_name'],
                    flag1 : o['flag1'],
                    flag2 : o['flag2'],
                    flag3 : o['flag3'],
                    flag4 : o['flag4'],
                    flag5 : o['flag5'],
                    linkPath: linkPath
                }
                gu.leftMenuAll.push(o);

            }
        }

    },

    getUseNewPropertyPanel: function () {
        switch (vSYSTEM_TYPE) {
            case 'HANARO':
                return false;
            default:
                return true;
        }
    },

    useEditAjaxToast: function() {
        switch(vCompanyReserved4) {
            case 'BIOT01KR':
            case 'SSCC01KR':
            case 'DMEC01KR':
            case 'SCON01KR':
            case 'CHMR01KR':
                return false;
            default:
                return true;
        }
    },

    useRefreshOnlyCenterPanel: function() {

        switch(vCompanyReserved4.substring(0, 4)) {
            case 'KBTC':
            case 'BIOT':
            case 'CHMR':
            case 'WOWT':
            case 'HJSV':
            case 'YNJU':
            case 'KMCA':
            case 'MJCM':
            case 'SSCC':
            case 'DMEC':
            case 'DJEP':
            case 'SCON':
                return true;
            default:
                return false;
        }
    },
    getMC: function (variableCode, falseMsg) {

        // gm.getMC(variableCode, falseMsg);
        try {
            return eval(variableCode);
        } catch (e) {
            return falseMsg;
        }
    }
});