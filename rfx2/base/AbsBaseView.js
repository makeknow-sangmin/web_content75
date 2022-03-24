Ext.define('Rfx2.base.AbsBaseView', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Rfx.app.MainViewModel',
        'Rfx.util.SinglePost'
    ],
    frame: false,
    border: false,
    split: true,
    pageflag: false,
    localSize: 0,
    blockExpand: false,
    layout: 'border',
    layoutConfig: {columns: 2, rows: 1},
    defaults: {
        split: true,
        cmargins: '2 0 0 0',
        margins: '0 0 0 0'
    },
    viewModel: {
        type: 'mainViewModel'
    },
    vSELECTED_UNIQUE_ID: -1,
    setDeleteFieldName: function (name) {
        this.DEL_FIELD_NAME = name;
    },
    DEL_FIELD_NAME: 'unique_id',
    setUpdateFieldName: function (name) {
        this.UPDATE_FIELD_NAME = name;
    },
    UPDATE_FIELD_NAME: 'unique_id',
    userType: vCUR_USERTYPE_STR.split(','),
    vSELECTED_RECORD: null,
    mtr_type: null,
    big_pcs_code: null,
    current_big_pcs_code: null,
    orderbyAutoTable: true,
    //tab grid 정보
    tab_info: [],
    //선택된 탭
    selected_tab: undefined,
    selected_record: null,
    //Tab의 store
    store_map: {},
    columns_map: {},
    fields_map: {},
    column_group_map: {},
    subTabGridEach: false,
    dept_code: null,
    excelTop: vCompanyReserved4 === 'DSMF01KR',
    // menu_check: true,
    getStore: function () {
        return this.selected_tab === undefined ? this.store : this.store_map[this.selected_tab];
    },
    getGrid: function () {
        //console_logs('this.selected_tab', this.selected_tab);
        return this.selected_tab === undefined ? this.grid : this.getTabGrid(this.selected_tab);
    },
    setMultisortCond: function () {

        if (this.selectedSortComboCount === 0) {

        } else {
            var sortCond = '';
            for (var i = 0; i < this.selectedSortComboCount; i++) {

                var mulCombo = gu.getCmp('multisort' + (i + 1) + 'combo');

                if (mulCombo === undefined || mulCombo === null) {
                    return;
                }

                var v = mulCombo.getValue();

                if (gm.me().orderbyAutoTable) {

                    var n = gm.me().getRplaceCond(v);
                    v = (n == null) ? v : n;
                }

                if (v != null && v !== '') {
                    var a = gu.getCmp('multisort' + (i + 1) + 'ascdesc').getValue();
                    if (a == null || a === '') {
                        a = 'asc';
                    }
                    var line = v + ' ' + a;

                    sortCond = (sortCond === '') ? line : sortCond + ':' + line;

                    console_logs('=================================================> sortCond', sortCond);
                    if (gu.getCmp('sortCond-multisort') !== undefined && gu.getCmp('sortCond-multisort') !== null) {
                        gu.getCmp('sortCond-multisort').setValue(sortCond);
                    }

                } else {

                    if (gu.getCmp('sortCond-multisort') !== undefined && gu.getCmp('sortCond-multisort') !== null) {
                        gu.getCmp('sortCond-multisort').setValue(sortCond);
                    }
                    return;
                }
            }
        }

    },
    initComponent: function () {

        this.callParent(arguments);

        switch (vCompanyReserved4) {
            case 'DSMF01KR':
                this.callSocket();
                break;
        }
    },
    getPageSize: function () {

        if (this.localSize > 0) {
            return this.localSize;
        } else {
            return gMain.pageSize;
        }
    },
    socket: null,
    callSocket: function () {
        var npm_server = 'http://106.240.76.30:3000';
        try {
            this.socket = io.connect(npm_server);
            this.socket.emit("joinRoom", {
                user_uid: vCUR_USER_UID,
                user_id: vCUR_USER_ID,
                user_name: vCUR_USER_NAME,
                room_uid: 1,
                room_name: 2,
                // create_date : now
            });
        } catch (error) {
            this.socket = null;
        }
    },

    //Widget Component.
    grid: null,
    store: null,
    propStore: null,
    model: null,
    crudTab: null,
    buttonToolbar: null,
    searchToolbar: null,
    searchToolbar1: null,
    searchToolbar2: null,
    searchField: [],
    defValues: {}, // 생성시 Default Values...
    defComboValues: {}, // 생성시 Default Values For Combo
    searchCondition: {},
    inputFcmap: {}, //복합입력폼버튼의 함수맵
    inputKeyFcmap: {}, //복합입력폼버튼의 함수맵(키 입력 한정)
    crudMode: 'VIEW', ///   VIEW,CREATE,EDIT,COPY
    selectedUid: null, //선택한 unique_id 값.
    selectedUidFrom: null, //Form의 unique_id widget
    vFILE_ITEM_CODE: null, //파일첨부 코드
    vMESSAGE: {
        VIEW: '상세보기',
        CREATE: '신규등록',
        EDIT: '기존 데이터 수정',
        COPY: '복사하여 등록'
    },
    vButtonLabel: {
        VIEW: '확인',
        CREATE: '저장 확인',
        EDIT: '수정 확인',
        COPY: '저장 확인'
    },
    vFORM_FIELD_LIST: [
        'form',
        'checkbox',
        'checkboxgroup',
        'combo',
        'datefield',
        'displayfield',
        'field',
        'fieldset',
        'hidden',
        'htmleditor',
        'label',
        'numberfield',
        'radio',
        'radiogroup',
        'textarea',
        'textfield',
        'timefield',
        'trigger',
        'triggerfield'
    ],

    crudViewSize: -1,
    crudEditSize: -1,
    sortBy: null,
    setSortBy: function (o) {
        this.sortBy = o;
    },
    relationship: null,
    setRelationship: function (r) {
        this.relationship = r;
        //console_logs('this.relationship', this.relationship);
    },
    getCrudviewSize: function () {
        if (this.crudViewSize > 0) {
            return this.crudViewSize;
        }

        if (gMain.checkPcHeight()) {
            return this.crudViewSize < 0 ? 400 : this.crudViewSize;
        } else {
            return 200;
        }
    },
    getCrudeditSize: function () {
        if (this.crudEditSize > 0) {
            return this.crudEditSize;
        }

        if (gMain.checkPcHeight()) {
            //console_logs('getCrudeditSize', this.getCrudeditSize);
            return this.crudEditSize < 0 ? 650 : this.crudEditSize;
        } else {
            return 200;
        }
    },
    setCrudpanelWidth: function (width) {

        if (this.crudMode === 'VIEW') {
            this.crudViewSize = width;
        } else {
            this.crudEditSize = width;
        }
    },
    setCreatePanelTitle: function (t) {
        //this.vCREATE_PANEL_TITLE = t;
        this.vMESSAGE['CREATE'] = t;
    },
    setEditPanelTitle: function (t) {
        //this.vEDIT_PANEL_TITLE = t;
        this.vMESSAGE['EDIT'] = t;
    },

    selectRow: function () {

        this.grid.getSelectionModel().select(this.getStore().getById(this.selectedUid));
    },

    initDefValue: function () {
        this.defComboValues = {};
        this.searchCondition = {};
    },
    //Search Field 초기화
    initSearchField: function () {
        this.searchField = [];
    },
    searchComboNames: [],
    //Search Eield 추가
    addSearchField: function (o) {

        //Combo search field의 경우 이름을 searchComboNames 에 저장해둔다.
        if (typeof o == 'object') {
            if (typeof o['store'] == 'string') {
                this.searchComboNames.push(o['field_id']);
            }
        }
        this.searchField.push(o);
    },

    setDefValue: function (key, value) {
        this.defValues[key + this.link] = value;
    },
    defOnlyCreate: false,

    setDefComboValue: function (key, c, v) {
        this.defValues[key + this.link] = v;
        this.defComboValues[key + this.link] = {code: c, value: v};
    },
    getDefValue: function (key) {
        return this.defValues[key + this.link];
    },
    getDefComboValue: function (key) {//Object return
        return this.defValues[key + this.link];
    },
    setSearchCondition: function (key, value) {
        this.searchCondition[key] = value;
    },
    getSearchCondition: function (key) {

        return this.searchCondition[key];

    },
    //Search Field 초기화
    initReadonlyField: function () {
        //console_logs('경고!', 'initReadonlyField Methos는 Deprecated 되었습니다. J2_CODE 테이블의 member_type 필드를 이용하세요');
    },
    //Search Eield 추가
    addReadonlyField: function (o) {
        //console_logs('경고!', 'initReadonlyField Methos는 Deprecated 되었습니다. J2_CODE 테이블의 member_type 필드를 이용하세요');
    },


    //Search Toolbar 만들기
    createSearchToolbar: function () {

        var tb = this.makeSrchToolbar(this.link, this.searchField);

        for (var i = 0; i < tb.length; i++) {
            if (tb[i].xtype !== 'label') {
                if (tb[i].style !== undefined) {
                    tb[i].style += 'margin-top: 1px; margin-bottom: 1px;';
                } else {
                    tb[i].style = 'margin-top: 1px; margin-bottom: 1px;';
                }
            } else {
                tb[i].style += 'margin-top: 5px;';
            }
        }

        this.searchToolbar = Ext.create('widget.toolbar', {
            items: tb,
            layout: 'column',
            cls: 'my-x-toolbar-default1'
        });

        return this.searchToolbar;
    },

    //복수개
    createMultiSearchToolbar: function (opt) {

        this.searchToolbar = null;
        this.searchToolbar1 = null;
        this.searchToolbar2 = null;
        this.searchToolbar3 = null;
        var l = this.searchField.length;
        var t1 = null;
        var t2 = null;
        var t3 = null;
        var t4 = null;

        //console_logs('createMultiSearchToolbar l=', l);

        var first = 8;
        var m = 8;// 합줄에 8개
        if (opt !== undefined && opt !== null) {
            first = opt['first'] === undefined ? 8 : opt['first'];
            m = opt['length'] === undefined ? 8 : opt['length'];
        }

        if (vCompanyReserved4 === 'HAEW01KR') {
            first = 6;
            m = 7;
        }

        t1 = this.searchField.splice(0, first);
        this.searchToolbar = Ext.create('widget.toolbar', {
            items: this.makeSrchToolbar(this.link, t1),
            cls: 'my-x-toolbar-default1'
        });
        //console_logs('this.searchToolbar', this.searchToolbar);

        if (l > m) {
            t2 = this.searchField.splice(0, m);

            this.searchToolbar1 = Ext.create('widget.toolbar', {
                items: this.makeSrchToolbar(this.link, t2),
                cls: 'my-x-toolbar-default1'
            });
            //console_logs('createMultiSearchToolbar this.searchToolbar1', this.searchToolbar1);
        }

        if (l > m * 2) {

            t3 = this.searchField.splice(0, m);
            this.searchToolbar2 = Ext.create('widget.toolbar', {
                items: this.makeSrchToolbar(this.link, t3),
                cls: 'my-x-toolbar-default1'
            });
            //console_logs('createMultiSearchToolbar this.searchToolbar2', this.searchToolbar2);
        }

        if (l > m * 3) {

            t4 = this.searchField.splice(0, m);
            this.searchToolbar3 = Ext.create('widget.toolbar', {
                items: this.makeSrchToolbar(this.link, t4),
                cls: 'my-x-toolbar-default1'
            });
            //console_logs('createMultiSearchToolbar this.searchToolbar3', this.searchToolbar3);
        }

        if (t1 != null) {
            this.searchField = t1;
            //console_logs('field t1 :', this.searchField);

            if (t2 != null) {
                this.searchField = t1.concat(t2);
                //console_logs('field t2 :', this.searchField);

                if (t3 != null) {
                    this.searchField = t1.concat(t2).concat(t3);
                    //console_logs('this.searchField :', this.searchField);

                    if (t4 != null) {
                        this.searchField = t1.concat(t2).concat(t3).concat(t4);
                        //console_logs('this.searchField :', this.searchField);
                    }
                }
            }
        }
//		//console_logs('fieldddd :', this.searchField);
//		if(t2!=null) {
//			this.searchField = t1.concat(t2);
//			//console_logs('field t2 :', this.searchField);
//		}
//		if(t3!=null) {
//			this.searchField = t1.concat(t2).concat(t3);
//			//console_logs('field t3 :', this.searchField);
//		}
//		//console_logs('concat :', this.searchField);


        var arr = [];
        if (this.searchToolbar != null) {
            arr.push(this.searchToolbar);
        }
        if (this.searchToolbar1 != null) {
            arr.push(this.searchToolbar1);
        }
        if (this.searchToolbar2 != null) {
            arr.push(this.searchToolbar2);
        }
        if (this.searchToolbar3 != null) {
            arr.push(this.searchToolbar3);
        }
        //console_logs('createMultiSearchToolbar arr', arr);

        return arr;

    },

    refreshActiveCrudPanel: function (source, selectOn, unique_id) {

        //console_logs('source', source);
        if (selectOn === true) {
            if (this.propertyPane != null) {
                this.propertyPane.setSource(source); // Now load data
            }
            this.selectedUid = unique_id;
            gUtil.enable(this.removeAction);
            gUtil.enable(this.editAction);
            gUtil.enable(this.copyAction);
            gUtil.enable(this.viewAction);
            gUtil.enable(this.initialAction);
            gUtil.enable(this.userTypeAction);

        } else {
            if (this.propertyPane != null) {
                this.propertyPane.setSource(source);
            }

            this.selectedUid = '-1';
            gUtil.disable(this.removeAction);
            gUtil.disable(this.editAction);
            gUtil.disable(this.copyAction);
            gUtil.disable(this.viewAction);
            gUtil.enable(this.registAction);
            gUtil.disable(this.initialAction);
            gUtil.disable(this.userTypeAction);
        }

        //console_logs('this.crudMode', this.crudMode);
        switch (vCompanyReserved4) {
            case 'SKNH01KR':
                switch (this.link) {
                    case 'QGR6_RPT':
                    case 'QGR6_SKN':
                        break;
                    default:
                        this.setActiveCrudPanel(this.crudMode);
                }
                break;
            case 'BIOT01KR':
            case 'CHMR01KR':
            case 'YNJU01KR':
            case 'MJCM01KR':
            case 'WOWT01KR':
            case 'KMCA01KR':
            case 'HSST01KR':
            case 'DABP01KR':
            case 'SJFB01KR':
            case 'SSCC01KR':
            case 'DMEC01KR':
            case 'SCON01KR':
            case 'DJEP01KR':
                break;
            default:
                this.setActiveCrudPanel(this.crudMode);
        }
    },

    crudOpened: false,
    toggleExpand: function () {
        this.crudTab.collapsed ? this.crudTab.expand() : this.crudTab.collapse();
    },
    propDisplayProp: true,
    setActiveCrudPanel: function (mode) {

        this.crudMode = mode;
        var crudTab = Ext.getCmp(gMain.geViewCrudId());
        if (crudTab != null) {
            crudTab.setTitle(this.vMESSAGE[this.crudMode]);
            this.createAction.setText(this.vButtonLabel[this.crudMode]);
            if (this.propDisplayProp === true) {
                switch (this.crudMode) {
                    case "VIEW":
                        crudTab.setSize(this.getCrudviewSize());
                        crudTab.setActiveItem(1);
                        if (gMain.getOpenCrudWindow() === true) {
                            crudTab.expand();
                        }
                        break;
                    case "CREATE":
                        crudTab.setSize(this.getCrudeditSize());
                        crudTab.setActiveItem(0);
                        //crudTab.expand();
                        break;
                    case "EDIT":
                    case "COPY":
                        crudTab.setSize(this.getCrudeditSize());
                        crudTab.setActiveItem(0);
                        crudTab.expand();
                        break;
                }
                this.fillEditForm(this.selected_records, this.crudMode);
            } else {
                switch (this.crudMode) {
                    case "CREATE":
                        crudTab.setSize(this.getCrudeditSize());
                        crudTab.setActiveItem(0);
                        crudTab.expand();
                        break;
                    case "VIEW":
                    case "EDIT":
                    case "COPY":
                        crudTab.setSize(this.getCrudeditSize());
                        crudTab.setActiveItem(0);
                        crudTab.expand();
                        break;
                }
            }

        }


    },
    getFieldList: function () {
        //console_logs('>>this.formItems', this.formItems);
        var items = [];
        if (this.formItems != null) {
            for (var i = 0; i < this.formItems.length; i++) {
                var form = this.formItems[i];
                //console_logs('this.form',form);
                //console_logs('this.vFORM_FIELD_LIST',this.vFORM_FIELD_LIST);
                //일반  Form 찾기
                for (var j = 0; j < this.vFORM_FIELD_LIST.length; j++) {
                    var arr = Ext.ComponentQuery.query('[xtype=' + this.vFORM_FIELD_LIST[j] + ']', form);
                    if (arr != null && arr.length > 0) {
                        items = items.concat(arr);
                        //console_logs('this.vFORM_FIELD_LIST arr',arr);
                    }
                }

//				 //숨겨진 Form 찾기
//				 var containers = Ext.ComponentQuery.query('[xtype=container]', form);
//				 //console_logs('containers', containers);
//				 if(containers!=null && containers.length>0) {
//
//					 for(var k=0; k<containers.length; k++) {
//						 var cform = containers[k];
//						 //console_logs('cform', cform);
//						 if(cform!=null) {
//							 var inner = Ext.ComponentQuery.query('cform[xtype=container]')[0];
//							 var citems = cfrom.items;
//							 //console_logs('citems', citems);
//						 }
//
//					 }
                //
//				 }


            }
        }

        return items;
    },
    //생성/수정 판넬 채우기
    fillEditForms: function (selections) {
        if(this.crudMode != 'VIEW'){
            if (selections != null && selections.length > 0) {
                var rec = selections[0];
                this.selected_records = selections[0];
                this.fillEditForm(rec, this.crudMode);
            } else {
                this.fillEditForm(null, this.crudMode);
            }

            this.toggleSelectedUidForm();
    }
    },
    /*선택한 unique_id fomm의 커기/끄기*/
    toggleSelectedUidForm: function () {
        //console_logs('toggleSelectedUidForm', this.crudMode);
        switch (this.crudMode) {
            case 'EDIT':
                try {
                    this.selectedUidFrom.setVisible(true);
                } catch (e) {
                }

                //console_logs('this.selectedUidFrom true', this.selectedUidFrom);
                break;
            default:
                try {
                    this.selectedUidFrom.setVisible(false);
                } catch (e) {
                }

            //console_logs('this.selectedUidFrom false', this.selectedUidFrom);
        }
    },
    fillEditForm: function (rec, crudMode) {
        //console_logs('------------------- fillEditForm rec', rec);

        var items = this.getFieldList();

        if (rec != null && crudMode !== 'CREATE') {
            Ext.each(items, function (o) { //Editable

                var id = o['id'];
                var compName = o['name'];
                var xtype = o['xtype'];
                var arr = compName.split('|');

                if (arr.length > 1) {
                    var name = arr[1];
                    if (arr.length === 3) {
                        name = name + '|' + arr[2];
                    }
                    var val = rec.get(name);

                    if (val != null && typeof val == 'string') {
                        val = gUtil.stripHighlight(val);
                        val = gUtil.stripQuotRecover(val);
                    }

                    switch (xtype) {
                        case 'combo':
                            try {

                                var combo = Ext.getCmp(id);

                                if (combo != null) {

                                    if (combo.multiSelect) {
                                        combo.setValue(val.split(','));

                                    } else {
                                        var record = combo.findRecordByValue(val);

                                        if (record != null) {
                                            combo.select(record);
                                            if (compName == 'project|order_com_unique') {
                                                gm.me().inputBuyer = record;
                                            } else if (compName == 'partline|class_code') {
                                                gm.me().inputClassCode = record;
                                            }
                                        } else {
                                            combo.store.load(function (records) {
                                                if (records != null) {
                                                    for (var i = 0; i < records.length; i++) {
                                                        var obj = records[i];
                                                        try {
                                                            if (obj.get(combo.valueField) == val) {
                                                                combo.select(obj);
                                                                if (compName == 'project|order_com_unique') {
                                                                    gm.me().inputBuyer = record;
                                                                }
                                                                if (compName == 'partline|class_code') {
                                                                    gm.me().inputClassCode = record;
                                                                }
                                                            }
                                                        } catch (e) {
                                                        }
                                                    }
                                                }//endofif

                                            });
                                        }
                                    }

                                }//endof if(combo!=null) {
                            } catch (e) {
                                console_logs('catch e', e)
                            }
                            break;
                        case 'datefield':
                            var a = Ext.getCmp(id);
                            if (a != null) {
                                console_logs('date val', val);
                                //2017-09-13 07:11:49.000
                                if (val != null && val.length > 9) {
                                    var parts = val.substring(0, 10).split('-');
                                    console_logs('parts', parts);
                                    //please put attention to the month (parts[0]), Javascript counts months from 0:
                                    // January - 0, February - 1, etc
                                    var mydate = new Date(parts[0], parts[1] - 1, parts[2]);
                                    a.setValue(mydate);
                                } else {
                                    a.setValue(null);
                                }

                            }
                            break;
                        default:
                            //console_logs('arr', arr);
                            //console_logs('val', val);

                            var a = Ext.getCmp(id);
                            if (a != null) {
                                a.setValue(val);
                            }
                    }
                    //}
                    if (name == 'unique_id') {
                        if (gm.me().crudMode == 'EDIT') {
                            Ext.getCmp(id).setVisible(true);
                        } else {
                            Ext.getCmp(id).setVisible(false);
                        }
                    }

                    var target = Ext.getCmp(id);

                    if (gm.me().crudMode == 'EDIT' && target != null) {

                        if (!o['canEdit'] || !target.editable) {
                            target.setFieldStyle('background-color: #FBF8E6; background-image: none;');
                            target.readOnly = true;
                        } else {
                            target.setFieldStyle('background-color: #FFFFFF; background-image: none;');
                            target.readOnly = false;
                        }
                    } else {
                        if (!target.editable) {
                            target.setFieldStyle('background-color: #FBF8E6; background-image: none;');
                            //console_logs('else', id);
                            target.readOnly = true;
                        } else {
                            target.setFieldStyle('background-color: #FFFFFF; background-image: none;');
                            //console_logs('canEdit ==true', id);
                            target.readOnly = false;
                        }
                    }


                }//endof if arr.length>1
                // gm.me().checkCompany();
            });
        } else {
            this.doReset();
            Ext.each(items, function (o, index) { //Editable
                var compName = o['name'];
                var id = o['id'];
                var arr = compName.split('|');
                if (arr.length > 1) {
                    var name = arr[1];
                    if (name == 'unique_id') {
                        Ext.getCmp(id).setVisible(false);
                    }
                }
            });
        }

    },

    companySetValue: function () {
        switch (vCompanyReserved4) {
            case 'MKEE01KR':
                if (gm.me().link != null && gm.me().link == 'SRO3_CLD') {
                    var pj_code = gm.me().getInputJust('project|pj_code');
                    pj_code.setValue(null);
                }
                break;
        }
    },

    deleteConfirm: function (result) {
        if (result == 'yes') {

            var arr = gm.me().selectionedUids;
            //console_logs('deleteConfirm arr', arr);
            if (arr.length > 0) {
                var CLASS_ALIAS = gm.me().deleteClass;
                //console_logs('deleteConfirm CLASS_ALIAS', CLASS_ALIAS);
                //삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
                if (CLASS_ALIAS == null) {
                    CLASS_ALIAS = [];

                    for (var i = 0; i < gm.me().fields.length; i++) {
                        var tableName = o['tableName'] == undefined ? 'map' : o['tableName'];
                        if (tableName != 'map') {
                            CLASS_ALIAS.push(tableName);
                        }

                    }
                    CLASS_ALIAS = extjsUtil.mergeDuplicateArray(CLASS_ALIAS);
                }
                //console_logs('deleteConfirm CLASS_ALIAS 2', CLASS_ALIAS);
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/index/generalData.do?method=delete',
                    params: {
                        DELETE_CLASS: CLASS_ALIAS,
                        uids: arr,
                        menuCode: gm.me().link
                    },
                    method: 'POST',
                    success: function (rec, op) {
                        //console_logs('success rec', rec);
                        //console_logs('success op', op);
                        gm.me().redrawStore();

                    },
                    failure: function (rec, op) {
                        Ext.Msg.alert('안내', '삭제에 실패하였습니다.');

                    }/*,
                     callback: function(record, operation, success){	// #3
                     //console_logs('record', record);
                     //console_logs('operation', operation);
                     //console_logs('success', success);
                     }*/
                });

            }
        }

        // }
    },

    resetConfirm: function (result) {
        if (result == 'yes') {
            var selections = gm.me().grid.getSelectionModel().getSelection();
            record = selections[0];
            var unique_id = record.get('unique_id');
            if (selections) {
//   		 var result = Ext.Msg.alert('{0}', result);
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/userMgmt/user.do?method=changeMyPassword',
                    params: {
                        unique_id: unique_id
                    },
                    method: 'POST',
                    success: function (result, request) {
                        Ext.Msg.alert('비밀번호 초기화', '비밀번호가 "0000" 으로 초기화되었습니다.');
                        gm.me().redrawStore();
                    },
                    failure: function (rec, request) {
                        Ext.Msg.alert('안내', '초기화에 실패했습니다.');
                    }
                });
            }
        }
    },

    getCheckVal: function (arrUserType, value) {
        for (var i = 0; i < arrUserType.length; i++) {
            if (value == arrUserType[i]) {
                return true;
            }
        }

        return false;
    },

    userTypeMod: function () {
        console_logs('====>ok', 'ok');

        var selections = gm.me().grid.getSelectionModel().getSelection();
        if (selections.length) {
            var rec = selections[0];
            console_logs('=====>>>>>>', rec);
            var unique_id = rec.get('unique_id');
            var roleItems = [];

            var roleFields = [
                {name: 'role_code', type: "string"}
                , {name: 'role_name', type: "string"}
            ];

            var roleStore = new Ext.create('Ext.data.Store', {
                fields: roleFields,
                proxy: {
                    type: 'ajax',
                    url: CONTEXT_PATH + '/userMgmt/user.do?method=readRole',
                    reader: {
                        type: 'json',
                        root: 'comboRole',
                        totalProperty: 'count',
                        successProperty: 'success'
                    },
                    autoLoad: false
                }
            });
            var lineGap = 30;
            var user_type = rec.get('user_type');
            var arrUserType = user_type.split(',');

            roleStore.load(function (records) {
                for (var i = 0; i < records.length; i++) {
                    roleItems.push({
                        checked: gm.me().getCheckVal(arrUserType, records[i].data.role_code),
                        boxLabel: records[i].data.role_name,
                        name: 'user_type',
                        inputValue: records[i].data.role_code
                    });
                }//enof for

                var form = Ext.create('Ext.form.Panel', {
                    id: 'userTypePanel',
                    layout: 'anchor',
                    border: false,
                    bodyPadding: 10,
                    autoScroll: true,
                    defaults: {
                        msgTarget: 'side',
                        labelWidth: 100
                    },
                    items: [
                        {
                            xtype: 'container',
                            margin: '0 0 0',
                            x: 3,
                            y: 0 + 1 * lineGap,
                            anchor: '-5',  // anchor width by percentage
                            items: [{
                                xtype: 'fieldset',
                                flex: 1,
                                title: 'User Type',
                                defaultType: 'checkbox', // each item will be a checkbox
                                layout: 'anchor',
                                collapsible: true,
                                defaults: {
                                    hideEmptyLabel: false
                                },
                                items: [{
                                    xtype: 'checkboxgroup',
                                    columns: 2,
                                    items: roleItems
                                }]
                            }]
                        }
                    ]
                });

                var win = Ext.create('ModalWindow', {
                    title: '권한 ' + CMD_MODIFY,
                    width: 600,
                    height: 400,
                    minWidth: 250,
                    minHeight: 180,
                    layout: 'fit',
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function () {
                            var form = Ext.getCmp('userTypePanel').getForm();
                            if (form.isValid()) {
                                var val = form.getValues(false);

                                var user_type = val['user_type'];

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/userMgmt/user.do?method=updateType',
                                    params: {
                                        unique_id: unique_id,
                                        user_type: user_type
                                    },
                                    success: function () {
                                        if (win) {
                                            win.close();
                                        }
                                        gm.me().store.load(function () {
                                        });
                                    }
                                })
                            } else {
                                Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function () {
                            if (win) {
                                win.close();
                            }
                        }
                    }]
                }); //win define

                win.show();

            })
        }

    },
    searchAction: null,
    registAction: null,
    editAction: null,
    copyAction: null,
    removeAction: null,
    viewAction: null,
    initialAction: null,
    userTypeAction: null,

    TOOLBAR_MAIN_BUTTON_NAMES: [
        {key: 'SEARCH', text: CMD_SEARCH/*'검색'*/},
        {key: 'REGIST', text: CMD_REGIST/*'신규등록'*/},
        {key: 'EDIT', text: CMD_MODIFY/*'수정'*/},
        {key: 'COPY', text: CMD_COPY_CREATE/*'복사등록'*/},
        {key: 'REMOVE', text: CMD_DELETE/*'삭제'*/},
        {key: 'VIEW', text: CMD_VIEW},
        {key: 'INITIAL', text: '비밀번호 초기화'},
        {key: 'UTYPE', text: '권한 설정'},
        {key: 'EXCEL', text: 'Excel'},

    ],

    renameButtonText: function (arr, o) {
        var key = o['key'];
        var text = o['text'];
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (key == item['key']) {
                item['text'] = text;
            }
        }
    },

    removeButton: function (arr, key) {
        //console_logs('removeButton arr', arr);
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (key == item['key']) {
                arr.splice(i, 1);
            }
        }
    },
    createCommandToolbarInner: function (option, sub_key, buttons) {

        var names = gUtil.copyObjArr(this.TOOLBAR_MAIN_BUTTON_NAMES);

        //console_logs('createCommandToolbar names', names);

        if (option != undefined && option != null) {
            var remove_arr = option['REMOVE_BUTTONS'];
            var rename_arr = option['RENAME_BUTTONS'];

            if (remove_arr != undefined && remove_arr != null) {
                for (var i = 0; i < remove_arr.length; i++) {
                    this.removeButton(names, remove_arr[i]);
                }
            }
            if (rename_arr != undefined && rename_arr != null) {
                for (var i = 0; i < rename_arr.length; i++) {
                    this.renameButtonText(names, rename_arr[i]);
                }
            }
        }

        for (var i = 0; i < names.length; i++) {
            var o = names[i];
            var key = o['key'];
            var text = o['text'];
            var action = null;
            switch (key) {
                case 'SEARCH':
                    action/*this.searchAction*/ = Ext.create('Ext.Action', {
                        iconCls: 'af-search',
                        text: text,
                        tooltip: CMD_SEARCH,
                        hidden: false,
                        handler: function () {
                            gm.me().redrawStore(true);
                        }
                    });
                    break;
                case 'REGIST':
                    action/*this.registAction*/ = Ext.create('Ext.Action', {
                        iconCls: 'af-plus-circle',
                        text: text,
                        tooltip: '신규 등록하기',
                        hidden: gu.setBtnHiddenProp(2),
                        //toggleGroup: 'toolbarcmd',
                        handler: function () {
                            gm.me().grid.getSelectionModel().deselectAll();
                            gm.me().setActiveCrudPanel('CREATE');
                            gm.me().crudTab.expand();
                            switch (gm.me().link) {
                                case 'EMC1_DS':
                                case 'EMC1_DS2':
                                    gMain.loadFileAttach(vCUR_USER_UID + 1000 * gMain.selNode.id, gMain.selectedMenuId + 'designFileAttach');
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    break;
                case 'EDIT':
                    action/*this.editAction*/ = Ext.create('Ext.Action', {
                        iconCls: 'af-edit',
                        text: text,
                        tooltip: '수정하기',
                        hidden: gu.setBtnHiddenProp(2),
                        toggleGroup: 'toolbarcmd',
                        disabled: true,
                        handler: function () {
                            gm.me().setActiveCrudPanel('EDIT');
                            gm.me().toggleSelectedUidForm();
                            switch (gm.me().link) {
                                case 'SRO3_CLD':
                                    switch (vCompanyReserved4) {
                                        case 'MKEE01KR':
                                            gm.me().setMkeRecvPoAdditionalInfo();
                                            break;
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    break;
                case 'COPY':
                    action/*this.copyAction*/ = Ext.create('Ext.Action', {
                        iconCls: 'af-copy',
                        text: text,
                        tooltip: '복사하여 등록하기',
                        hidden: gu.setBtnHiddenProp(2),
                        toggleGroup: 'toolbarcmd',
                        disabled: true,
                        handler: function () {
                            gm.me().setActiveCrudPanel('COPY');
                            gm.me().toggleSelectedUidForm();
                            gm.me().copyCallback();
                            switch (gm.me().link) {
                                case 'EMC1_DS':
                                case 'EMC1_DS2':
                                    gMain.loadFileAttach(vCUR_USER_UID + 1000 * gMain.selNode.id, gMain.selectedMenuId + 'designFileAttach');
                                    break;
                                case 'SRO3_CLD':
                                    switch (vCompanyReserved4) {
                                        case 'MKEE01KR':
                                            gm.me().setMkeRecvPoAdditionalInfo();
                                            break;
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    break;
                case 'REMOVE':
                    action/*this.removeAction*/ = Ext.create('Ext.Action', {
                        iconCls: 'af-remove',
                        text: CMD_DELETE,
                        tooltip: CMD_DELETE,
                        hidden: gu.setBtnHiddenProp(4),
                        disabled: true,
                        handler: function (widget, event) {
                            Ext.MessageBox.show({
                                title: CMD_DELETE,
                                msg: gm.me().getMC('vst1_delete', '선택한 항목을 삭제하시겠습니까?'),
                                //msg: '선택한 항목을 삭제하시겠습니까?',
                                buttons: Ext.MessageBox.YESNO,
                                fn: gm.me().deleteConfirm,
                                icon: Ext.MessageBox.QUESTION
                            });
                        }
                    });
                    break;
                case 'VIEW':
                    action/*this.viewAction*/ = Ext.create('Ext.Action', {
                        iconCls: 'fa-typcn-th-list-outline_14_0_5395c4_none',
                        text: text,
                        disabled: true,
                        handler: function () {
                            gm.me().crudTab.setSize(gm.me().getCrudviewSize());
                            gm.me().crudTab.setActiveItem(1);
                            gm.me().toggleExpand();
                            //gm.me().setActiveCrudPanel('VIEW');
                        }
                    });
                    break;
                case 'EXCEL':
                    action = Ext.create('Ext.Action', {
                        iconCls: 'af-excel',
                        text: text,
                        disabled: false,
                        handler: function () {
                            switch (vCompanyReserved4) {
                                case 'KBTC01KR':
                                case 'BIOT01KR':
                                case 'HJSV01KR':
                                case 'CHMR01KR':
                                case 'SJFB01KR':
                                case 'SSCC01KR':
                                case 'DMEC01KR':
                                case 'DJEP01KR':
                                case 'SCON01KR':
                                    gu.popUpExcelHandler();
                                    break;
                                case 'MSTP01KR':
                                case 'WOWT01KR':
                                case 'KMCA01KR':
                                case 'YNJU01KR':
                                case 'HSST01KR':
                                    gu.HanaroPopUpExcelHandler();
                                    break;
                                default:
                                    gu.printExcelHandler();
                            }
                        }
                    });
                    break;
                default:
            }
            if (action != null) {
                //console_logs(key, action);
                buttons[key] = action;
            }
        }

        var sortColumns = [];
        var clipColumns = [];
        Ext.each(this.columns, function (o, index) { //Editable
            sortColumns.push({
                text: o['text'],
                dataIndex: o['dataIndex'],
                handler: function () {
                    gm.me().getCommandWidget('splitbutton' + gm.me().link + sub_key).setText(this['text']);
                    gm.me().getCommandWidget(gm.me().link + sub_key + '-' + 'orderBy').setValue(this['dataIndex']);
                    gm.me().redrawStore();
                }
            });
            clipColumns.push({
                text: o['text'],
                dataIndex: o['dataIndex'],
                handler: function (r, l) {
                    console_logs('r.text', r.text);
                    console_logs('r.dataIndex', r.dataIndex);
                    var o = gm.me().getCommandWidget('clipboard' + gm.me().link + sub_key);
                    console_logs('o', o);
                    o.setText(r.text + ' 값복사');
                    o.value = r.dataIndex;
                    gm.me().popupClip(r.dataIndex, r.text, 300, 500);
                }
            });
        });


        var searchAction = buttons['SEARCH'];
        var registAction = buttons['REGIST'];
        var editAction = buttons['EDIT'];
        var copyAction = buttons['COPY'];
        var removeAction = buttons['REMOVE'];
        var viewAction = buttons['VIEW'];
        var excelAction = buttons['EXCEL'];

        var buttonItems = [];
        if (searchAction != null) {
            buttonItems.push(searchAction);
        }
        if (registAction != null) {
            buttonItems.push(registAction);
        }
        if (editAction != null) {
            buttonItems.push(editAction);
        }
        if (copyAction != null) {
            buttonItems.push(copyAction);
        }
        if (removeAction != null) {
            buttonItems.push({xtype: 'tbspacer'});
            buttonItems.push(removeAction);
        }

        //console_logs('buttonItems', buttonItems);

        //console_logs('sortCond-multisort', buttonItems);
        buttonItems.push('->');
        //console_logs("'splitbutton' + this.link+sub_key", 'splitbutton' + this.link+sub_key);
        buttonItems.push(new Ext.form.Hidden({
            cmpId: this.link + sub_key + '-' + 'orderBy'
        }));
        buttonItems.push(new Ext.form.Hidden({
            cmpId: this.link + sub_key + '-' + 'ascDesc'
        }));

        if (viewAction != null) {
            buttonItems.push({xtype: 'tbspacer'});
            buttonItems.push(viewAction);
        }
        switch (vCompanyReserved4) {
            case 'KBTC01KR':
            case 'BIOT01KR':
            case 'HJSV01KR':
            case 'CHMR01KR':
            case 'YNJU01KR':
            case 'MSTP01KR':
            case 'WOWT01KR':
            case 'KMCA01KR':
            case 'DJEP01KR':
            case 'HSST01KR':
            case 'SJFB01KR':
            case 'SSCC01KR':
            case 'DMEC01KR':
            case 'SCON01KR':
                if (excelAction != null) {
                    buttonItems.push(excelAction);
                }
                break;
            default:
                break;
        }

        //console_logs('buttonItems', buttonItems);
        var buttonToolbar = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: buttonItems
        });
        return buttonToolbar;
    },
    createCommandToolbarInner2: function (option, sub_key, buttons) {

        var names = gUtil.copyObjArr(this.TOOLBAR_MAIN_BUTTON_NAMES);

        //console_logs('createCommandToolbar names', names);

        if (option != undefined && option != null) {
            var remove_arr = option['REMOVE_BUTTONS'];
            var rename_arr = option['RENAME_BUTTONS'];

            if (remove_arr != undefined && remove_arr != null) {
                for (var i = 0; i < remove_arr.length; i++) {
                    this.removeButton(names, remove_arr[i]);
                }
            }
            if (rename_arr != undefined && rename_arr != null) {
                for (var i = 0; i < rename_arr.length; i++) {
                    this.renameButtonText(names, rename_arr[i]);
                }
            }
        }

        for (var i = 0; i < names.length; i++) {
            var o = names[i];
            var key = o['key'];
            var text = o['text'];
            var action = null;
            switch (key) {
                case 'SEARCH':
                    action/*this.searchAction*/ = Ext.create('Ext.Action', {
                        iconCls: 'af-search',
                        text: text,
                        tooltip: '조건 검색',
                        handler: function () {
                            gm.me().redrawStore();
                        }
                    });
                    break;
                case 'REGIST':
                    action/*this.registAction*/ = Ext.create('Ext.Action', {
                        iconCls: 'af-plus-circle',
                        text: text,
                        tooltip: '신규 등록하기',
                        //toggleGroup: 'toolbarcmd',
                        handler: function () {
                            gm.me().grid.getSelectionModel().deselectAll();
                            gm.me().setActiveCrudPanel('CREATE');
                            gm.me().crudTab.expand();
                        }
                    });
                    break;
                case 'EDIT':
                    action/*this.editAction*/ = Ext.create('Ext.Action', {
                        iconCls: 'af-edit',
                        text: text,
                        tooltip: '수정하기',
                        toggleGroup: 'toolbarcmd',
                        disabled: true,
                        handler: function () {
                            gm.me().setActiveCrudPanel('EDIT');
                            gm.me().toggleSelectedUidForm();
                        }
                    });
                    break;
                case 'COPY':
                    action/*this.copyAction*/ = Ext.create('Ext.Action', {
                        iconCls: 'af-copy',
                        text: text,
                        tooltip: '복사하여 등록하기',
                        toggleGroup: 'toolbarcmd',
                        disabled: true,
                        handler: function () {
                            gm.me().setActiveCrudPanel('COPY');
                            gm.me().toggleSelectedUidForm();
                            gm.me().copyCallback();
                        }
                    });
                    break;
                case 'REMOVE':
                    action/*this.removeAction*/ = Ext.create('Ext.Action', {
                        iconCls: 'af-remove',
                        text: text,
                        tooltip: '삭제하기',
                        disabled: true,
                        handler: function (widget, event) {
                            Ext.MessageBox.show({
                                title: '삭제하기',
                                msg: '선택한 항목을 삭제하시겠습니까?',
                                buttons: Ext.MessageBox.YESNO,
                                fn: gm.me().deleteConfirm,
                                icon: Ext.MessageBox.QUESTION
                            });
                        }
                    });
                    break;
                case 'VIEW':
                    action/*this.viewAction*/ = Ext.create('Ext.Action', {
                        iconCls: 'fa-typcn-th-list-outline_14_0_5395c4_none',
                        text: text,
                        //toggleGroup: 'toolbarcmd',
                        //pressed: true,
                        disabled: true,
                        handler: function () {
                            gm.me().crudTab.setSize(gm.me().getCrudviewSize());
                            gm.me().crudTab.setActiveItem(1);
                            //gm.me().setActiveCrudPanel('VIEW');
                        }
                    });
                    break;
                case 'INITIAL':
                    action = Ext.create('Ext.Action', {
                        itemId: 'resetButton',
                        iconCls: 'fa-retweet_14_0_5395c4_none',
                        hidden: gu.setBtnHiddenProp(3),
                        text: text,
                        //toggleGroup: 'toolbarcmd',
                        //pressed: true,
                        disabled: true,
                        handler: function (widget, event) {
                            Ext.MessageBox.show({
                                title: '비밀번호 초기화',
                                msg: '선택한 대상의 비밀번호를 <br/> 초기화 하시겠습니까?',
                                buttons: Ext.MessageBox.YESNO,
                                fn: gm.me().resetConfirm,
                                icon: Ext.MessageBox.QUESTION
                            });
                        }
                    });
                    break;
                case 'UTYPE':
                    action = Ext.create('Ext.Action', {
                        itemId: 'userTypeButton',
                        iconCls: 'fa-retweet_14_0_5395c4_none',
                        hidden: gu.setBtnHiddenProp(3),
                        text: text,
                        disabled: true,
                        handler: function (widget, event) {
                            gm.me().userTypeMod();
                        }
                    });
                    break;
                default:
            }
            if (action != null) {
                //console_logs(key, action);
                buttons[key] = action;
            }
        }

        var sortColumns = [];
        var clipColumns = [];
//		Ext.each(this.columns, function(o, index) { //Editable
//			sortColumns.push({
//				text:o['text'],
//				dataIndex:o['dataIndex'],
//				handler: function() {
//					gm.me().getCommandWidget('splitbutton' + gm.me().link+sub_key).setText(this['text']);
//					gm.me().getCommandWidget(gm.me().link+sub_key + '-'+ 'orderBy').setValue(this['dataIndex']);
//					gm.me().redrawStore();
//				}
//			});
//			clipColumns.push({
//				text:o['text'],
//				dataIndex:o['dataIndex'],
//				handler: function(r,l) {
//					//console_logs('r.text',r.text);
//					//console_logs('r.dataIndex',r.dataIndex);
//					var o = gm.me().getCommandWidget('clipboard' + gm.me().link+sub_key);
//					//console_logs('o', o);
//					o.setText(r.text + ' 값복사');
//					o.value = r.dataIndex;
//					gm.me().popupClip(r.dataIndex, r.text, 300, 500);
//				}
//			});
//		});


        var searchAction = buttons['SEARCH'];
        var registAction = buttons['REGIST'];
        var editAction = buttons['EDIT'];
        var copyAction = buttons['COPY'];
        var removeAction = buttons['REMOVE'];
        var viewAction = buttons['VIEW'];
        var initialAction = buttons['INITIAL'];
        var userTypeAction = buttons['UTYPE'];

//		//console_logs('searchAction', searchAction);
//		//console_logs('registAction', registAction);
//		//console_logs('editAction', editAction);
//		//console_logs('copyAction', copyAction);
//		//console_logs('removeAction', removeAction);
//		//console_logs('viewAction', viewAction);

        var buttonItems = [];
        if (searchAction != null) {
            buttonItems.push(searchAction);
        }
        if (registAction != null) {
            buttonItems.push(registAction);
        }
        if (editAction != null) {
            buttonItems.push(editAction);
        }
        if (copyAction != null) {
            buttonItems.push(copyAction);
        }
        if (removeAction != null) {
            buttonItems.push({xtype: 'tbspacer'});
            buttonItems.push(removeAction);
        }
        if (initialAction != null) {
            buttonItems.push(initialAction);
        }
        if (userTypeAction != null) {
            buttonItems.push(userTypeAction);
        }

        buttonItems.push('->');

        buttonItems.push({
            cmpId: 'splitbutton' + this.link + sub_key,
            xtype: 'splitbutton',
            text: '정렬',
            hidden: true,
            tooltip: '검색시 정렬기준',
            handler: function () {
            }, // handle a click on the button itself
            menu: new Ext.menu.Menu({
                items: sortColumns
            })
        });

        //console_logs("'splitbutton' + this.link+sub_key", 'splitbutton' + this.link+sub_key);
        buttonItems.push(
            new Ext.form.Hidden({
                cmpId: this.link + sub_key + '-' + 'orderBy'
            }));
        buttonItems.push(new Ext.form.Hidden({
            cmpId: this.link + sub_key + '-' + 'ascDesc',
            hidden: true,
            value: ''
        }));
        buttonItems.push({
            cmpId: this.link + sub_key + '-' + 'direction-asc',
            iconCls: 'fa-sort-alpha-asc',
            tooltip: '오름차순',
            hidden: true,
            toggleGroup: 'orderBy',
            listeners: {
                click: function () {
                    gm.me().getCommandWidget(gm.me().link + sub_key + '-' + 'ascDesc').setValue('ASC');
                    gm.me().redrawStore();
                }
            }

        });
        buttonItems.push({
            cmpId: this.link + sub_key + '-' + 'direction-desc',
            iconCls: 'fa-sort-alpha-desc_14_0_5395c4_none',
            tooltip: '내림차순',
            toggleGroup: 'orderBy'
            , pressed: true,
            hidden: true,
            listeners: {
                click: function () {
                    gm.me().getCommandWidget(gm.me().link + sub_key + '-' + 'ascDesc').setValue('DESC');
                    gm.me().redrawStore();
                }
            }
        });
        if (viewAction != null) {
            buttonItems.push({xtype: 'tbspacer'});
            buttonItems.push(viewAction);
        }

        //console_logs('buttonItems', buttonItems);
        var buttonToolbar = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: buttonItems
        });
        return buttonToolbar;
    },
    createCommandToolbar: function (option) {

        var buttons = [];
        this.buttonToolbar = this.createCommandToolbarInner(option, '', buttons);

        this.searchAction = buttons['SEARCH'];
        this.registAction = buttons['REGIST'];
        this.editAction = buttons['EDIT'];
        this.copyAction = buttons['COPY'];
        this.removeAction = buttons['REMOVE'];
        this.viewAction = buttons['VIEW'];

        return this.buttonToolbar;
    },
    createCommandToolbar2: function (option) {

        var buttons = [];
        this.buttonToolbar = this.createCommandToolbarInner2(option, '', buttons);

        this.searchAction = buttons['SEARCH'];
        this.registAction = buttons['REGIST'];
        this.editAction = buttons['EDIT'];
        this.copyAction = buttons['COPY'];
        this.removeAction = buttons['REMOVE'];
        this.viewAction = buttons['VIEW'];
        this.initialAction = buttons['INITIAL'];
        this.userTypeAction = buttons['UTYPE'];

        return this.buttonToolbar;
    },
    createReset: function (option) {

        var buttons = [];
        this.buttonToolbar = this.createCommandToolbarInner(option, '', buttons);

        this.resetAction = buttons['RESET'];

        return this.buttonToolbar;
    },
    createCrudTab: function () {

        const myId = gMain.geViewCrudId(); //viewId +'-'+ 'crudTab';

        this.crudTab = Ext.create('Ext.panel.Panel', {
            frame: true,
            activeTab: 1,
            region: 'east',
            width: this.getCrudviewSize(),
            collapsed: true,
            title: this.getMC('CMD_VIEW_DTL', '상세보기'),
            layout: 'card',
            cmpId: myId,
            id: myId,
            items: [
                this.createFormPane('REGIST'), this.createPropertyPane()
            ],
            listeners: {
                'resize': function (win, width, height, opt) {
                    //console_logs('getCrudviewSize', width);
                    switch (vCompanyReserved4) {
                        case 'BIOT01KR':
                        case 'CHMR01KR':
                        case 'SJFB01KR':
                        case 'YNJU01KR':
                        case 'WOWT01KR':
                        case 'KMCA01KR':
                        case 'HHST01KR':
                        case 'SSCC01KR':
                        case 'DMEC01KR':
                        case 'SCON01KR':
                        case 'DJEP01KR':
                            break;
                        default:
                            gm.me().setCrudpanelWidth(width);
                    }
                },
                collapse: function () {
                    if (gm.me().blockExpand) {
                        gm.me().crudMode = 'VIEW';
                    }
                }
            },
            tools: [
                {
                    xtype: 'tool',
                    type: 'right',
                    qtip: "접기",
                    handler: function (e, target, header, tool) {
                        gm.me().crudTab.collapsed ? gm.me().crudTab.expand() : gm.me().crudTab.collapse();
                    }
                }
            ]
        });
        this.crudTab.setActiveItem(1);
    },
    getObjFromfields: function (inTabTitle) {

        var arr = [];

        for (var i = 0; i < this.fields.length; i++) {


            var o = this.fields[i];

            var name = o['name'];
            var fieldLabel = o['text'] == undefined ? '' : o['text'];
            var create = o['canCreate'] == undefined ? false : o['canCreate'];
            var xtype = o['xtype'] == undefined ? false : o['xtype'];
            var codeName_o = o['codeName'];
            var height = o['height'] == undefined ? 10 : o['height'];
            var allowBlank = o['allowBlank'] == undefined ? true : o['allowBlank'];

            var maxLength = o['maxLength'] == undefined ? 100 : o['maxLength'];
            var enforceMaxLength = o['enforceMaxLength'] == undefined ? true : o['enforceMaxLength'];

            var editable = o['editable'] == undefined ? true : o['editable'];
            var tabTitle = o['tabTitle'] == undefined ? '입력항목' : o['tabTitle'];
            var position = o['position'] == undefined ? 'center' : o['position'];

            var tableName = o['tableName'] == undefined ? 'map' : o['tableName'];
            var hidden = o['hidden'] == undefined ? false : o['hidden'];

            var setNumber = o['setNumber'] == undefined ? -1 : o['setNumber'];
            var setName = o['setName'] == undefined ? '' : o['setName'];
            var setCols = o['setCols'] == undefined ? 1 : o['setCols'];

            var innerTpl = o['innerTpl'] == undefined ? null : o['innerTpl'];

            var format = o['format'] == undefined ? 'Y-m-d' : o['format'];
            var submitFormat = o['submitFormat'] == undefined ? 'Y-m-d' : o['submitFormat'];
            var dateFormat = o['dateFormat'] == undefined ? 'Y-m-d' : o['dateFormat'];
            var value = o['value'] == undefined ? null : o['value'];
            var minValue = o['minValue'] == undefined ? 0 : o['minValue'];
            //var rows = o['rows']==undefined ? 5: o['rows'];

            var readOnly = o['readOnly'] == undefined ? false : o['readOnly'];
            var fieldStyle = o['fieldStyle'] == undefined ? null : o['fieldStyle'];
            var buttonText = o['buttonText'] == undefined ? null : o['buttonText'];

            var handleKey = o['handleKey'] == undefined ? null : o['handleKey'];
            var triggerKey = o['triggerKey'] == undefined ? null : o['triggerKey'];
            var supessTrigger = o['supessTrigger'] == undefined ? false : o['supessTrigger'];
            var buttonKey = o['buttonKey'] == undefined ? null : o['buttonKey'];

            var emptyText = o['emptyText'] == undefined ? null : o['emptyText'];

            var step = o['step'] == undefined ? 1 : o['step'];

            var canEdit = o['canEdit'] == undefined ? false : o['canEdit'];
            var canCreate = o['canCreate'] == undefined ? false : o['canCreate'];
            var canView = o['canView'] == undefined ? false : o['canView'];
            var canCellEdit = o['canCellEdit'] == undefined ? false : o['canCellEdit'];

            var labelWidth = o['labelWidth'] == undefined ? 110 : o['labelWidth'];

            var inputType = o['inputType'] == undefined ? null : o['inputType'];
            var copyValue = o['copyValue'] == undefined ? null : o['copyValue'];

            var decimalPrecision = o['decimalPrecision'] == undefined ? 0 : o['decimalPrecision'];

            if (/*fieldLabel.length>0 && */create && tabTitle == inTabTitle && name != 'unique_id'/*unique_id는 별도처리*/) {

                if (allowBlank == false) {
                    fieldLabel = '<font color=red>*</font>' + fieldLabel;
                }

                var o1 = {};

                o1['setNumber'] = setNumber;
                o1['setName'] = setName;
                o1['setCols'] = setCols;
                o1['position'] = position;
                o1['readOnly'] = readOnly;

                //console_logs('===================================>', '반영됨');
                o1['canEdit'] = canEdit;
                o1['canCreate'] = canCreate;
                o1['canView'] = canView;
                o1['canCellEdit'] = canCellEdit;

                o1['labelWidth'] = labelWidth;


                if (value != null) {
                    o1['value'] = value;
                }
                if (fieldStyle != null) {
                    o1['fieldStyle'] = fieldStyle;
                }
                if (emptyText != null) {
                    o1['emptyText'] = emptyText;
                }

                var val = this.getDefValue(name/* + this.link*/);
                if (val != undefined) {
                    //console_logs('getDefValue ' + name, val);
                    o1['value'] = val;
                }

                o1['xtype'] = xtype;
                o1['name'] = tableName + '|' + name;
                o1['fieldLabel'] = fieldLabel;
                o1['allowBlank'] = allowBlank;
                o1['editable'] = editable;
                o1['hidden'] = hidden;
                o1['copyValue'] = copyValue;

                if (editable == false || readOnly == true) {
                    if (fieldStyle != null) {
                        o1['fieldStyle'] = fieldStyle + ';' + 'background-color: #FBF8E6;  background-image: none;';
                    } else {
                        o1['fieldStyle'] = 'background-color: #FBF8E6; background-image: none;';
                    }

                }

                if (xtype == 'datefield') {
                    o1['format'] = format;
                    o1['submitFormat'] = submitFormat;
                    o1['dateFormat'] = dateFormat;
                }
                if (xtype == 'textfield') {
                    if (inputType != null) {
                        o1['inputType'] = inputType;
                    }
                    o1['maxLength'] = maxLength;
                    o1['enforceMaxLength'] = enforceMaxLength;
                }
                if (xtype == 'numberfield') {
                    console_logs("테스트상민",o1);
                    o1['minValue'] = minValue;
                    o1['step'] = step;
                    o1['decimalPrecision'] = decimalPrecision;
                }
                if (xtype == 'textarea') {
                    //o1['rows'] = rows;
                    if (maxLength < 1000) {
                        o1['maxLength'] = maxLength;
                        o1['enforceMaxLength'] = enforceMaxLength;

                    }
                    /*	o1['maxLength'] = maxLength;
                     o1['enforceMaxLength'] = enforceMaxLength;*/
                }

                if (handleKey != null) {
                    o1['handleKey'] = handleKey;
                }

                switch (xtype) {
                    case 'htmleditor':
                    case 'textarea':
                        o1['height'] = height;
                        var s = o1['fieldStyle'];
                        if (s == undefined || s == null) {
                            o1['fieldStyle'] = 'overflow:scroll ;overflow-x:hidden;';
                        } else {
                            o1['fieldStyle'] = s + 'overflow:scroll ;overflow-x:hidden;';
                        }

                        if (xtype == 'htmleditor') {
                            o1['listeners'] = {
                                initialize: function (editor) {
                                    //console_logs('html init....', editor);
                                    var styles = {
                                        color: "red",
                                        background: 'black',
                                        readOnly: readOnly
                                    };
                                    Ext.DomHelper.applyStyles(editor.getEditorBody(), styles);
                                }
                            };
                        } else {//textarea
                            o1['listeners'] = {
                                'change': function (combo, record) {
                                    gUtil.enable(gm.me().createAction);
                                    gUtil.enable(gm.me().resetAction);
                                    gMain.handlInputFc(combo.handleKey, combo, record);
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.name
                                    });
                                }
                            };
                        }
                        break;
                    case 'filefield':
                        o1['emptyText'] = '파일을 선택하세요.';
                        o1['buttonText'] = '첨부',
                            //o1['allowBlank'] = true;
                            o1['buttonConfig'] = {
                                iconCls: 'af-upload'
                            };
                        o1['allowBlank'] = allowBlank;
                        o1['editable'] = editable;
                        o1['anchor'] = '100%';
                        o1['listeners'] = {
                            'change': function () {
                                gUtil.enable(gm.me().createAction);
                                gUtil.enable(gm.me().resetAction);
                            },
                            render: function (c) {
                                Ext.create('Ext.tip.ToolTip', {
                                    target: c.getEl(),
                                    html: c.name
                                });
                            }
                        };
                        break;
                    case 'combo':
                        //console_logs('>>>>combo', o);

                        var storeClass = o['storeClass'] == undefined ? 'Ext.data.Store' : o['storeClass'];
                        var multiSelect = o['multiSelect'] == undefined ? false : true;

                        var storeName = ((storeClass.indexOf("Mplm.store.") > -1
                                || storeClass.indexOf("Ext.data.Store")) > -1
                            || storeClass.indexOf("Rfx2.store.") > -1)
                            ? storeClass : 'Mplm.store.' + storeClass;

                        var mode = o['mode'] == undefined ? 'local' : o['mode'];
                        var triggerAction = o['triggerAction'] == undefined ? 'all' : o['triggerAction'];
                        var forceSelection = o['forceSelection'] == undefined ? false : o['forceSelection'];
                        var displayField = o['displayField'] == undefined ? 'codeName' : o['displayField'];
                        var valueField = o['valueField'] == undefined ? 'systemCode' : o['valueField'];
                        var queryMode = o['queryMode'] == undefined ? 'remote' : o['queryMode'];
                        var editable = o['editable'] == undefined ? true : o['editable'];
                        var preLoad = o['preLoad'] == undefined ? null : o['preLoad'];

                        var params = o['params'] == undefined ? null : o['params'];

                        var listeners = o['listeners'] == undefined ? null : o['listeners'];

                        var id = o['id'] == undefined ? null : o['id'];

                        if (id == null) {
                            o1['id'] = gMain.selectedMenuId + '-' + name;
                        } else {
                            o1['id'] = id;
                        }

                        o1['mode'] = mode;
                        o1['triggerAction'] = triggerAction;
                        o1['forceSelection'] = forceSelection;
                        o1['displayField'] = displayField;
                        o1['valueField'] = valueField;
                        o1['queryMode'] = queryMode;
                        o1['multiSelect'] = multiSelect;

                        var storeParam = {cmpName: gMain.selectedMenuId + '-' + name};
                        if (params != null) {
                            for (var key in params) {
                                //console_logs('>>>>paaa key' + ' ' + key, params);
                                storeParam[key] = params[key];
                            }
                        }

                        o1['store'] = Ext.create(storeName, storeParam);

                        if (preLoad != null) {
                            o1['listConfig'] = {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{' + preLoad + '}</div>';
                                }
                            };
                            o1['minChars'] = 1;
                            o1['editable'] = true;

                        } else {
                            o1['autoSelect'] = true;
                            o1['editable'] = editable;
                        }

                        (o1['store']).load();


                        if (listeners == null) {
                            o1['listeners'] = {
                                select: function (combo, record) {
                                    //console_logs('combo', combo);
                                    gMain.handlInputFc(combo.handleKey, combo, record);
                                },
                                change: function (combo, newValue, oldValue) {

                                    switch (vCompanyReserved4) {
                                        case 'KBTC01KR':
                                        case 'BIOT01KR':
                                        case 'CHMR01KR':
                                        case 'HJSV01KR':
                                        case 'YNJU01KR':
                                        case 'SJFB01KR':
                                        case 'KMCA01KR':
                                        case 'WOWT01KR':
                                        case 'HSST01KR':
                                        case 'SSCC01KR':
                                        case 'DMEC01KR':
                                        case 'SCON01KR':
                                        case 'DJEP01KR':
                                            if (newValue == null) {
                                                gMain.handlInputFc(combo.handleKey, combo);
                                            }
                                            break;
                                        default:
                                            break;
                                    }
                                    gUtil.enable(gm.me().createAction);
                                    gUtil.enable(gm.me().resetAction);
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.name
                                    });
                                },
                                load: function (a, b) {
                                    console_logs('>>> before a', a);
                                    console_logs('>>> before b', b);
                                }
                            };
                        } else {
                            o1['listeners'] = listeners;
                        }


                        if (innerTpl != null) {
                            o1['listConfig'] = {
                                innerTpl: innerTpl,
                                getInnerTpl: function () {
                                    return this.innerTpl;
                                }
                            };
                        }

                        //console_logs('--------- combo ', o1);
                        break;
                    default:
                        var id = o['id'] == undefined ? null : o['id'];

                        if (id != null) {
                            o1['id'] = id;
                        }

                        o1.enableKeyEvents = true;
                        o1['listeners'] = {
                            change: function (a, b, c) {
                                gMain.handlInputFc(this.handleKey, a, b, c);
                                gUtil.enable(gm.me().createAction);
                                gUtil.enable(gm.me().resetAction);
                            },
                            keyup: function (combo, e, eOpts) {
                                gMain.handleKeyInputFc(this.handleKey, combo, e, eOpts);
                            },
                            render: function (c) {
                                Ext.create('Ext.tip.ToolTip', {
                                    target: c.getEl(),
                                    html: c.name
                                });
                            }
                        };

                }

                if (buttonText != null) {
                    o1['flex'] = 1;
                    if (supessTrigger == false) {
                        o1['xtype'] = 'triggerfield';
                    }
                    if (triggerKey != null) {
                        o1['triggerKey'] = triggerKey;
                    }
                    if (supessTrigger == false) {
                        o1['trigger1Cls'] = Ext.baseCSSPrefix + 'form-clear-trigger';
                        o1['onTrigger1Click'] = function (a, b, c) {
                            Ext.getCmp(this.id).setValue('');
                            gMain.handlInputFc(this.triggerKey, a, b, c);
                        };
                    }


                    var hitems = [];
                    hitems.push(o1);
                    hitems.push({
                        xtype: 'button',
                        text: buttonText,
                        style: 'margin-left: 3px;',
                        width: 80,
                        buttonKey: buttonKey,
                        handler: function () {
                            gMain.handlInputFc(this.buttonKey, this);
                        }
                    });
                    var o2 = {
                        xtype: 'container',
                        layout: 'hbox',
                        setNumber: o1['setNumber'],
                        setName: o1['setName'],
                        setCols: o1['setCols'],
                        style: 'margin-bottom: 5px;margin-left:1px;',
                        items: hitems
                    };
                    arr.push(o2);
                } else {
                    arr.push(o1);
                }

            }//endof if
        }//endoffor

        return arr;
    },
    //FieldSet이 없는 경우 Form 가져오기
    getFormPaneNoSet: function (arrObjects, checkFileAttach, inTabTitle) {

        //console_logs('>>>>>arrObjects', arrObjects);
        var formItemsTop = []; //top
        var formItemsHidden = []; //top
        var formItemsLeft = []; //left
        var formItemsRight = []; //right
        var formItemsBottom = []; //bottom
        var formItemsHtml = []; //bottom
        var formItmesTotal = []; // total

        var ran = Math.random() * 10000000;

        var index = 0;
        var hasFileAttach = false;

        for (var i = 0; i < arrObjects.length; i++) {
            var o1 = arrObjects[i];

            var xtype = o1['xtype'];
            var hidden = o1['hidden'];
            var position = o1['position'];

            if (xtype == 'filefield') {
                hasFileAttach = true;
                checkFileAttach[0] = hasFileAttach;
            }

            if (hidden) {
                formItemsHidden.push(o1);
            } else {
                if (xtype == 'htmleditor') {
                    var htmlEditor = Ext.create('Ext.form.HtmlEditor', o1);
                    formItemsHtml.push(htmlEditor);
                } else {
                    switch (position) {
                        case 'top':
                            formItemsTop.push(o1);

                            if (vInputFieldDirection === 'horizontal' && o1.xtype !== 'container') {
                                o1.enableKeyEvents = true;
                                o1.listeners['keydown'] = function (e, t, eOpts) {
                                    if (t.keyCode === 9) {
                                        window.event.returnValue = false;
                                        var ownerCt = e.ownerCt.id;
                                        var keyIndex = e.ownerCt.items.keys.indexOf(e.getId());
                                        if (keyIndex >= e.ownerCt.items.keys.length - 1) {
                                            gm.me().tabNextFieldWithNoSet(e, 1);
                                        } else {
                                            e.ownerCt.items.items[keyIndex + 1].focus();
                                        }
                                    }
                                };
                            }
                            break;
                        case 'bottom':
                            formItemsBottom.push(o1);
                            if (vInputFieldDirection === 'horizontal' && o1.xtype !== 'container') {
                                o1.enableKeyEvents = true;
                                o1.listeners['keydown'] = function (e, t, eOpts) {
                                    if (t.keyCode === 9) {
                                        window.event.returnValue = false;
                                        var ownerCt = e.ownerCt.id;
                                        var keyIndex = e.ownerCt.items.keys.indexOf(e.getId());
                                        if (keyIndex >= e.ownerCt.items.keys.length - 1) {
                                            gm.me().tabNextFieldWithNoSet(e, 1);
                                        } else {
                                            e.ownerCt.items.items[keyIndex + 1].focus();
                                        }
                                    }
                                };
                            }
                            break;
                        default:
                            switch (this.link) {
                                case 'SRO2':
                                case 'SRO3':
                                case 'SRO3_CLD':
                                case 'SRO4_CLD':
                                case 'SRO6':
                                case 'SRO7':
                                    if (vCompanyReserved4 == 'MKEE01KR' && (inTabTitle == '기술' || inTabTitle == '영업' || inTabTitle == '품질')) {
                                        formItmesTotal.push(o1);
                                    }
                                    break;
                            }

                            if (vInputFieldDirection === 'horizontal' && o1.xtype !== 'container') {
                                o1.enableKeyEvents = true;
                                var o2 = o1;

                                if (o1.xtype === 'container') {
                                    o2 = o1.items[0];
                                    o2.enableKeyEvents = true;
                                }

                                o2.listeners['keydown'] = function (e, t, eOpts) {

                                    if (t.keyCode === 9) {
                                        window.event.returnValue = false;
                                        var ownerCt = e.ownerCt.id;
                                        var keyIndex = e.ownerCt.items.keys.indexOf(e.getId());
                                        var formItemLeft = gu.getCmp('formItemLeft' + ran).items;
                                        var formItemRight = gu.getCmp('formItemRight' + ran).items;

                                        if (ownerCt.includes('Left')) {

                                            var rightItem = formItemRight.items[keyIndex];

                                            if (keyIndex > formItemRight.length - 1) {
                                                gm.me().tabNextFieldWithNoSet(e, 2);
                                            } else {
                                                if (rightItem.xtype === 'container') {
                                                    rightItem = rightItem.items.items[0];
                                                }
                                                rightItem.focus();
                                            }
                                        } else {

                                            var leftItem = formItemLeft.items[keyIndex + 1];

                                            if (keyIndex >= formItemLeft.length - 1) {
                                                gm.me().tabNextFieldWithNoSet(e, 2, false);
                                            } else {
                                                if (leftItem.xtype === 'container') {
                                                    leftItem = leftItem.items.items[0];
                                                }
                                                leftItem.focus();
                                            }
                                        }
                                    }
                                };
                            }
                            if (!o1.hidden) {
                                if (index % 2 == 0) {
                                    formItemsLeft.push(o1);
                                } else {
                                    formItemsRight.push(o1);
                                }
                                index++;
                            }

                    }
                }

            }

        }//endoffor

        if (hasFileAttach) {
            //console_logs('gUtil', gUtil);
            this.vFILE_ITEM_CODE = gUtil.RandomString(10);

            formItemsTop.push(new Ext.form.Hidden({
                name: 'file_itemcode',
                value: this.vFILE_ITEM_CODE
            }));
        } else {
            this.vFILE_ITEM_CODE = null;
        }

        var items = [];
        if (formItemsTop.length > 0) {
            items.push({
                xtype: 'container',
                layout: 'vbox',
                width: '100%',
                margin: '0 10 0 0',
                border: true,
                layout: 'anchor',
                items: formItemsTop
            });
        }

        if (formItemsHidden.length > 0) {
            items.push({
                xtype: 'container',
                layout: 'vbox',
                width: '100%',
                margin: '0 10 0 0',
                border: true,
                layout: 'anchor',
                id: gu.id('formItemHidden' + ran),
                items: formItemsHidden
            });
        }

        if (formItmesTotal.length > 0) {
            items.push({
                xtype: 'container',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'container',
                        width: '100%',
                        margin: '0 0 0 1',
                        border: true,
                        layout: 'anchor',
                        items: formItmesTotal
                    }
                ]
            });
        } else if (formItemsLeft.length > 0) {
            items.push({
                xtype: 'container',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'container',
                        width: '50%',
                        margin: '0 0 0 1',
                        border: true,
                        layout: 'anchor',
                        id: gu.id('formItemLeft' + ran),
                        items: formItemsLeft
                    }, {
                        xtype: 'container',
                        width: '50%',
                        margin: '0 9 0 0',
                        border: true,
                        layout: 'anchor',
                        id: gu.id('formItemRight' + ran),
                        items: formItemsRight
                    }]
            });
        }

        if (formItemsBottom.length > 0) {
            items.push({
                xtype: 'container',
                layout: 'vbox',
                width: '100%',
                margin: '0 10 0 0',
                border: true,
                layout: 'anchor',
                items: formItemsBottom
            });
        }

        for (var i = 0; i < formItemsHtml.length; i++) {
            items.push(formItemsHtml[i]);
        }

        return items;
    },
    //FieldSet이 있는 경우 Form 가져오기
    getFormPaneWithset: function (arrField, arrObjects, checkFileAttach) {

        var hasFileAttach = false;

        //setNumber 순서로정렬
        arrField.sort(function (item1, item2) {
            if (item1.setNumber === undefined) {
                item1.setNumber = 999;
            }
            if (item2.setNumber === undefined) {
                item2.setNumber = 999;
            }
            return item1.setNumber < item2.setNumber ? -1 : 1;
        });

        var arrFieldset = [];

        for (var i = 0; i < arrField.length; i++) {

            var o = arrField[i];

            arrFieldset.push({
                setNumber: o['setNumber'],
                setCols: o['setCols'],
                xtype: 'fieldset',
                name: 'fieldset' + i,
                title: o['setName'],
                defaultType: 'textfield',
                defaults: {
                    anchor: '100%'
                },
                items: []
            });
        }

        var getArrField = function (setNumber, arr) {
            for (var i = 0; i < arr.length; i++) {
                var o = arr[i];
                if (o['setNumber'] == setNumber) {
                    return o;
                }
            }
            return o;
        };


        for (var i = 0; i < arrObjects.length; i++) {
            var o1 = arrObjects[i];

            var xtype = o1['xtype'];
            var hidden = o1['hidden'];
            var setNumber = o1['setNumber'];
            var setName = o1['setName'];

            var oSet = getArrField(setNumber, arrFieldset);
            var setItems = oSet['items'];

            if (xtype == 'filefield') {
                hasFileAttach = true;
                checkFileAttach[0] = hasFileAttach;
            }

            if (xtype == 'htmleditor') {
                setItems.push(Ext.create('Ext.form.HtmlEditor', o1));
            } else {
                setItems.push(o1);
            }

        }//endoffor

        if (hasFileAttach) {
            //console_logs('gUtil', gUtil);
            this.vFILE_ITEM_CODE = gUtil.RandomString(10);
            var oSet = getArrField(-1, arrFieldset);
            oSet['items'].push(new Ext.form.Hidden({
                name: 'file_itemcode',
                value: this.vFILE_ITEM_CODE
            }));
        } else {
            this.vFILE_ITEM_CODE = null;
        }

        //console_logs('arrFieldset', arrFieldset);

        //setcols 2인 경우 처리
        Ext.each(arrFieldset, function (o, index) {

            var setCols = this['setCols'];
            var ran = Math.random() * 10000000;

            if (setCols > 1) {
                var items = this['items'];

                var formItemsLeft = [];
                var formItemsRight = [];
                var formItemsHidden = [];

                var index = 0;

                for (var i = 0; i < items.length; i++) {
                    var o1 = items[i];

                    if (vInputFieldDirection === 'horizontal' && o1.xtype !== 'container') {

                        o1.enableKeyEvents = true;
                        o1.listeners['keydown'] = function (e, t, eOpts) {
                            if (t.keyCode === 9) {
                                window.event.returnValue = false;
                                var ownerCt = e.ownerCt.id;
                                var keyIndex = e.ownerCt.items.keys.indexOf(e.getId());
                                var formItemLeft = gu.getCmp('formItemLeft' + ran).items;
                                var formItemRight = gu.getCmp('formItemRight' + ran).items;

                                if (ownerCt.includes('Left')) {
                                    if (keyIndex > formItemRight.length - 1) {
                                        gm.me().tabNextFieldWithSet(e, 2);
                                    } else {
                                        formItemRight.items[keyIndex].focus();
                                    }
                                } else {
                                    if (keyIndex >= formItemLeft.length - 1) {
                                        gm.me().tabNextFieldWithSet(e, 2);
                                    } else {
                                        formItemLeft.items[keyIndex + 1].focus();
                                    }
                                }
                            }
                        };
                    }

                    if (o1.hidden) {
                        formItemsHidden.push(o1);
                    } else {
                        if (index % 2 == 0) {
                            formItemsLeft.push(o1);
                        } else {
                            formItemsRight.push(o1);
                        }
                        index++;
                    }
                }

                this['items'] = [{
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'container',
                            id: gu.id('formItemLeft' + ran),
                            width: '50%',
                            margin: '0 0 0 1',
                            border: true,
                            layout: 'anchor',
                            items: formItemsLeft
                        }, {
                            xtype: 'container',
                            width: '50%',
                            id: gu.id('formItemRight' + ran),
                            margin: '0 9 0 0',
                            border: true,
                            layout: 'anchor',
                            items: formItemsRight
                        }, {
                            xtype: 'container',
                            width: '0%',
                            id: gu.id('formItemHidden' + ran),
                            margin: '0 9 0 0',
                            border: true,
                            layout: 'anchor',
                            hidden: true,
                            items: formItemsHidden
                        }
                    ]
                }];

            } else {

                if (vInputFieldDirection === 'horizontal') {
                    var items = this['items'];

                    for (var i = 0; i < items.length; i++) {
                        var o1 = items[i];

                        if (o1.xtype === 'container') {
                            for (var j = 0; j < o1.items.length; j++) {
                                o2 = o1.items[j];
                                o2.enableKeyEvents = true;

                                if (o2.listeners !== undefined) {
                                    o2.listeners['keydown'] = function (e, t, eOpts) {
                                        if (t.keyCode === 9) {
                                            window.event.returnValue = false;
                                            var ownerCt = e.ownerCt.id;
                                            var keyIndex = e.ownerCt.items.keys.indexOf(e.getId());
                                            if (keyIndex >= e.ownerCt.items.keys.length - 1) {
                                                gm.me().tabNextFieldWithSet(e, 1);
                                            } else {
                                                e.ownerCt.items.items[keyIndex + 1].focus();
                                            }
                                        }
                                    };
                                }
                            }
                        } else {
                            o1.enableKeyEvents = true;
                            o1.listeners['keydown'] = function (e, t, eOpts) {
                                if (t.keyCode === 9) {
                                    window.event.returnValue = false;
                                    var ownerCt = e.ownerCt.id;
                                    var keyIndex = e.ownerCt.items.keys.indexOf(e.getId());
                                    if (keyIndex >= e.ownerCt.items.keys.length - 1) {
                                        gm.me().tabNextFieldWithSet(e, 1);
                                    } else {
                                        e.ownerCt.items.items[keyIndex + 1].focus();
                                    }
                                }
                            };
                        }
                    }
                }
            }

        });

        return arrFieldset;
    },
    getFormPane: function (inTabTitle) {

        var checkFileAttach = [false];

        var arrObjects = this.getObjFromfields(inTabTitle);

        var items = null;
        var arrField = [];

        //console_logs('getFormPane '+ inTabTitle +' arrObjects', arrObjects);

        //fieldSet을 이용하는 경우
        var isSetField = false;

        //console_logs(inTabTitle +' arrField 0', arrField);
        for (var i = 0; i < arrObjects.length; i++) {
            var o = arrObjects[i];
            //console_logs(inTabTitle+ ' o', o);
            var setNumber = o['setNumber'];
            var setName = o['setName'];
            var setCols = o['setCols'];
            arrField.push({
                setNumber: setNumber,
                setName: setName,
                setCols: setCols
            });
            console_logs('>>setNumber', setNumber);
            if (setNumber > -1) {
                isSetField = true;
            }
        }
        // console_logs(inTabTitle + ' arrField 1', arrObjects);
        if (isSetField == true) { //FieldSet이 정의되어있으면 FieldSet처리를 한다.
            //중복제거.
            arrField = arrField.filter(function (item, pos) {
                var check = function (arrField, item) {
                    for (var i = 0; i < arrField.length; i++) {
                        var o = arrField[i];
                        if (o['setNumber'] == item['setNumber']) {
                            return i;
                        }
                    }
                    return -1;
                };
                return check(arrField, item) == pos;

            });
            items = this.getFormPaneWithset(arrField, arrObjects, checkFileAttach);
        } else {
            items = this.getFormPaneNoSet(arrObjects, checkFileAttach, inTabTitle);
        }

        //console_logs('hasFileAttach', checkFileAttach[0]);
        var formPanel = Ext.create('Rfx.base.BaseInputForm', {
            title: inTabTitle,
            scroll: true,
            autoScroll: true,
            hasFileAttach: checkFileAttach[0],
            items: items
        });

        return formPanel;

    },
    doReset: function () {
        //console_logs('reset', gm.me().formItems);
        if (gm.me().formItems != null) {
            for (var i = 0; i < gm.me().formItems.length; i++) {
                var form = gm.me().formItems[i];
                //console_logs('reset', form);
                form.reset();
            }
        }
        gUtil.disable(gm.me().createAction);
        gUtil.disable(gm.me().resetAction);

    },
    doMyReset: function (targetTitle) {

        if (gm.me().formItems != null) {
            for (var i = 0; i < gm.me().formItems.length; i++) {
                var form = gm.me().formItems[i];
                //console_logs('doMyReset form', form);
                var title = form['title'];
                //console_logs('doMyReset title', title);
                if (title == targetTitle) {
                    form.reset();
                }

            }
        }
        gUtil.disable(gm.me().createAction);
        gUtil.disable(gm.me().resetAction);

    },

    preCreateCallback: function () {
        this.doCreateCore();
    },
    postCreateCallback: function (rec) {
        //console_logs('postCreateCallback 울 재정의 해서 사용합니다.');
    },
    doCreateSKN: function () {

    },
    doCreate: function () {
        this.preCreateCallback();
        //		if( this.preCreateCallback() == true) {
        //			this.doCreateCore();
        //		}
    },
    doCreateCore: function () {
        //console_logs('doCreateCore', 'in');

        if (gm.me().createAction != undefined) {
            gm.me().createAction.disable();
            Ext.getBody().mask('잠시만 기다려주세요.');
        }

        var sendValue = {};
        var CLASS_ALIAS = [];
        var fileForm = null;

        if (gm.me().formItems != null) {

            for (var i = 0; i < this.formItems.length; i++) {
                var form = this.formItems[i];
                //console_logs('form', form);
                var b = form['hasFileAttach'];
                if (b == true) {
                    fileForm = form;
                }
                //console_logs('doCreate form', form);
                if (form.isValid()) {

                    var value = form.getValues(false);

                    value = this.replaceComma(form.getForm().getFields(), value);

                    //console_logs('doCreate form value', value);
                    for (var key in value) {
                        //console_logs('key', key);
                        var aliasArr = key.split('|');
                        //console_logs('aliasArr', aliasArr);
                        var readOnly = false;
                        if (aliasArr.length > 1) {
                            CLASS_ALIAS.push(aliasArr[0]);

                            var o = (aliasArr.length == 2) ? this.getFieldObj(aliasArr[1]) : this.getFieldObj(aliasArr[1] + '|' + aliasArr[2]);
                            //console_logs('key obj', o);
                            if (o != null) {
                                readOnly = o['readOnly'] == null ? false : o['readOnly'];
                            }
                        }

                        if (key == 'default|unique_id') {
                            var rec = this.vSELECTED_RECORD;
                            sendValue[key] = rec == null ? -1 : rec.get(this.UPDATE_FIELD_NAME);
                        } else {
                            if (readOnly == false) {
                                sendValue[key] = gUtil.stripQuot(value[key]);
                            }
                        }
                    }
                } else {
                    Ext.Msg.alert('안내', '필수입력 항목을 확인하세요.', function () {
                    });
                    gm.me().createAction.enable();
                    Ext.getBody().unmask();
                    return;
                }


            }
        }

        //console_logs('CLASS_ALIAS', CLASS_ALIAS);
        CLASS_ALIAS = extjsUtil.mergeDuplicateArray(CLASS_ALIAS);
        //console_logs('CLASS_ALIAS', CLASS_ALIAS);

        sendValue['CLASS_ALIAS'] = CLASS_ALIAS;

        //console_logs('sendValue 1', sendValue);
        if(this.crudMode == 'VIEW'){
            this.crudMode = 'CREATE';
        }
        sendValue['CRUD_MODE'] = this.crudMode;
        gm.me().crudMode = this.crudMode;
        sendValue['MENU_LINK'] = this.link;

        if (this.link == 'EMC1_DS' || this.link == 'EMC1_DS2') {
            sendValue['fileobject_pjuid'] = vCUR_USER_UID + 1000 * gMain.selNode.id;
        }

        // 품명 규격 확인
        if (this.link == 'PMT1_PNL' && vCompanyReserved4 == 'KWLM01KR') {
            console_logs('==sendValue', sendValue);

            var item_name = sendValue['srcahd|item_name'];
            var specification = sendValue['srcahd|specification'];
            var model_no = sendValue['srcahd|model_no'];

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/index/generalData.do?method=preCheckNameSpec',
                method: 'POST',
                params: {
                    item_name: item_name,
                    specification: specification,
                    model_no: model_no
                },
                success: function (result, request) {
                    var jsonData = Ext.decode(result.responseText);
                    console_logs('====jsonData', jsonData);
                    if (jsonData.count > 0) {
                        Ext.MessageBox.alert('검사 확인', '동일한 품명/규격의 자재가 있습니다.');
                        return;
                    } else {
                        if (fileForm == null) {
                            if (Ext.isDefined(gMain.extFieldColumnStore2)
                                && gMain.extFieldColumnStore2.data.items.length > 0 && (this.crudMode == 'CREATE' || this.crudMode == 'COPY')) {

                                //gMain.extFieldColumnStore2.each(function(record) {
                                for (var i = 0; i < gMain.extFieldColumnStore2.data.items.length; i++) {

                                    var r = gMain.extFieldColumnStore2.getAt(i);
                                    //console_logs('gMain.extFieldColumnStore2 r', r);

                                    sendValue['srcahd|item_name' + i] = r.get('item_name');
                                    sendValue['srcahd|class_code' + i] = r.get('class_code');
                                    sendValue['assymap|bm_quan' + i] = r.get('bm_quan');
                                    sendValue['mycart|pl_no' + i] = r.get('pl_no');
                                    sendValue['assymap|pl_no' + i] = r.get('pl_no');
                                }

                                sendValue['extStore2_length'] = gMain.extFieldColumnStore2.data.items.length;

                                //});

                                sendValue['CLASS_ALIAS'] = ['project', 'srcahd', 'assymap'];
                            }

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/index/generalData.do?method=create',
                                params: sendValue,
                                method: 'POST',
                                success: function (rec, op) {
                                    //console_logs('success rec', rec);
                                    //console_logs('success op', op);

                                    //console_logs('this.crudMode op', gm.me().crudMode);

                                    if (gm.me().crudMode == 'EDIT') {
                                        gMain.setCrPaneToolbarMsg('수정되었습니다.');
                                    } else {
                                        gMain.setCrPaneToolbarMsg('등록되었습니다.');
                                        gm.me().doReset();
                                    }

                                    gm.me().redrawStore(sendValue);
                                    gm.me().postCreateCallback(sendValue);

                                    switch (gm.me().link) {
                                        case 'PPO2':
                                            Ext.getCmp(gMain.geViewCrudId()).collapse();
                                            break;
                                        default:
                                            break;
                                    }
                                },
                                failure: function (result, op) {
                                    var jsonData = Ext.util.JSON.decode(result.responseText);
                                    var resultMessage = jsonData.data.result;

                                    gMain.setCrPaneToolbarMsg('저장에 실패하였습니다.');
                                    Ext.Msg.alert('안내', '저장에 실패하였습니다.' + " : " + resultMessage, function () {
                                    });

                                }
                            });
                        } else {//File 첨부있을 때..
                            console_log('>>>>>>>>>>>>>>>> extStore2_length_2', gMain.extFieldColumnStore2.data.items.length);
                            fileForm.submit({
                                url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' + this.vFILE_ITEM_CODE,
                                waitMsg: 'Uploading Files...',
                                success: function (fp, o) {
                                    if (Ext.isDefined(gMain.extFieldColumnStore2) && gMain.extFieldColumnStore2.data.items.length > 0) {

                                        //gMain.extFieldColumnStore2.each(function(record) {
                                        for (var i = 0; i < gMain.extFieldColumnStore2.data.items.length; i++) {

                                            var r = gMain.extFieldColumnStore2.getAt(i);
                                            //console_logs('gMain.extFieldColumnStore2 r', r);

                                            sendValue['srcahd|item_name' + i] = r.get('item_name');
                                            sendValue['srcahd|class_code' + i] = r.get('class_code');
                                            sendValue['assymap|bm_quan' + i] = r.get('bm_quan');
                                            sendValue['mycart|pl_no' + i] = r.get('pl_no');
                                            sendValue['assymap|pl_no' + i] = r.get('pl_no');
                                        }
                                        sendValue['extStore2_length'] = gMain.extFieldColumnStore2.data.items.length;
                                        //});

                                        sendValue['CLASS_ALIAS'] = ['project', 'srcahd', 'assymap'];
                                    }
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/index/generalData.do?method=create',
                                        params: sendValue,
                                        method: 'POST',
                                        success: function (rec, op) {
                                            //console_logs('success rec', rec);
                                            //console_logs('success op', op);
                                            gMain.setCrPaneToolbarMsg('등록되었습니다.');
                                            //console_logs('this.crudMode op', gm.me().crudMode);

                                            if (gm.me().crudMode == 'EDIT') {

                                            } else {
                                                gm.me().doReset();
                                            }

                                            gm.me().redrawStore();


                                        },
                                        failure: function (result, op) {
                                            var jsonData = Ext.util.JSON.decode(result.responseText);
                                            var resultMessage = jsonData.data.result;

                                            gMain.setCrPaneToolbarMsg('저장에 실패하였습니다.');
                                            Ext.Msg.alert('안내', '저장에 실패하였습니다.' + " : " + resultMessage, function () {
                                            });

                                        }
                                    });
                                }
                            });
                        }
                    }
                },
                failure: extjsUtil.failureMessage
            });
        } else {
            if (fileForm == null) {
                if (Ext.isDefined(gMain.extFieldColumnStore2)
                    && gMain.extFieldColumnStore2.data.items.length > 0 && (this.crudMode == 'CREATE' || this.crudMode == 'COPY')) {
                    console_log('>>>>>>extStore2_length_3>>>>>>>>>>', gMain.extFieldColumnStore2.data.items.length);
                    //gMain.extFieldColumnStore2.each(function(record) {
                    for (var i = 0; i < gMain.extFieldColumnStore2.data.items.length; i++) {

                        var r = gMain.extFieldColumnStore2.getAt(i);
                        //console_logs('gMain.extFieldColumnStore2 r', r);

                        sendValue['srcahd|item_name' + i] = r.get('item_name');
                        sendValue['srcahd|class_code' + i] = r.get('class_code');
                        sendValue['assymap|bm_quan' + i] = r.get('bm_quan');
                        sendValue['mycart|pl_no' + i] = r.get('pl_no');
                        sendValue['assymap|pl_no' + i] = r.get('pl_no');
                    }
                    console_log('>>>>>> ffffffffff');
                    sendValue['extStore2_length'] = gMain.extFieldColumnStore2.data.items.length;
                    console_logs('>>>>>> bbbbbbb', gMain.extFieldColumnStore2);
                    //});

                    sendValue['CLASS_ALIAS'] = ['project', 'srcahd', 'assymap'];
                }

                if (vCompanyReserved4 == 'MKEE01KR' && (this.link == 'SRO3' || this.link == 'SRO2' || this.link == 'SRO3_CLD' || this.link == 'SRO7')) {
                    switch (this.link) {
                        case 'SRO3_CLD':
                            var pj_code = gm.me().getInputJust('project|pj_code').getValue();
                            if (pj_code == null || pj_code == '' || pj_code.length < 4) {
                                Ext.Msg.alert("알림", "SO#의 자동생성을 눌러주세요.");
                                return;
                            }

                            var item_code = gm.me().getInputJust('partline|item_code').getValue();
                            if (item_code == null || item_code == undefined || item_code.length < 1 || item_code == '') {
                                Ext.Msg.alert("알림", "품목코드를 확인해주세요.");
                                return;
                            }

                            var pj_code = gm.me().getInputJust('project|pj_code').getValue();
                            if (pj_code != null && pj_code.length < 4) {
                                Ext.Msg.alert("알림", "SO# 을 확인해주세요. (4자리 이상)");
                                return;
                            }

                            var sg_code = gm.me().getInputJust('partline|sg_code').getValue();
                            console_logs('>>>>sg_code', sg_code);
                            var target_size = gm.me().getInputTarget('h_reserved12').getValue();
                            switch (sg_code) {
                                case 'AA':
                                    if (target_size != null && (0.7 > target_size || 0.8 < target_size)) {
                                        Ext.Msg.alert('경고', '범위를 벗어났습니다.', function () {
                                        });
                                        gm.me().getInputJust('itemdetail|h_reserved12').setValue('');
                                        return;
                                    }
                                    break;
                                case 'AD':
                                    if (target_size != null && (0.9 > target_size || 1.0 < target_size)) {
                                        Ext.Msg.alert('경고', '범위를 벗어났습니다.', function () {
                                        });
                                        gm.me().getInputJust('itemdetail|h_reserved12').setValue('');
                                        return;
                                    }
                                    break;
                                case 'AI':
                                    if (target_size != null && (1.1 > target_size || 1.2 < target_size)) {
                                        Ext.Msg.alert('경고', '범위를 벗어났습니다.', function () {
                                        });
                                        gm.me().getInputJust('itemdetail|h_reserved12').setValue('');
                                        return;
                                    }
                                    break;
                                case 'AJ':
                                    if (target_size != null && (target_size != 1.3)) {
                                        Ext.Msg.alert('경고', '범위를 벗어났습니다.', function () {
                                        });
                                        gm.me().getInputJust('itemdetail|h_reserved12').setValue('');
                                        return;
                                    }
                                    break;
                                case 'AO':
                                    if (target_size != null && (target_size != 1.5)) {
                                        Ext.Msg.alert('경고', '범위를 벗어났습니다.', function () {
                                        });
                                        gm.me().getInputJust('itemdetail|h_reserved12').setValue('');
                                        return;
                                    }
                                    break;
                                case 'AR':
                                    if (target_size != null && (target_size != 2.0 || target_size != 2)) {
                                        Ext.Msg.alert('경고', '범위를 벗어났습니다.', function () {
                                        });
                                        gm.me().getInputJust('itemdetail|h_reserved12').setValue('');
                                        return;
                                    }
                                    break;
                            }
                            break;
                        case 'SRO2':
                        case 'SRO3':
                            var h_reserved31 = gm.me().getInputJust('itemdetail|h_reserved31').getValue();
                            var h_reserved34 = gm.me().getInputJust('itemdetail|h_reserved34').getValue();

                            var tol_unit = gm.me().getInputTarget('h_reserved14').getValue(); //tol. 단위
                            var min = gm.me().getInputTarget('reserved_double1').getValue(); //tol(-)
                            var max = gm.me().getInputTarget('reserved_double2').getValue(); //tol(+)
                            var target_size = gm.me().getInputTarget('h_reserved11').getValue(); //tol(+)
                            var val = '';
                            switch (tol_unit) {
                                case 'UM':
                                    // gm.me().getInputTarget('h_reserved22').setValue(Number(Number(target_size)-Number(min))+'um'+'~'+Number(Number(target_size)+Number(max))+'um');
                                    val = Number(Number(target_size) - Number(min)) + '~' + Number(Number(target_size) + Number(max))
                                    break;
                                case '%':
                                    // gm.me().getInputTarget('h_reserved22').setValue(Number(Number(target_size)-(Number(target_size)*(Number(min)*0.01)))+'um'+'~'+Number(Number(target_size)+Number(Number(target_size)*(Number(max)*0.01)))+'um');
                                    val = Number(Number(target_size) - (Number(target_size) * (Number(min) * 0.01))) + '~' + Number(Number(target_size) + Number(Number(target_size) * (Number(max) * 0.01)))
                                    break;
                            }

                            var check = val.split('~')[1];
                            if (h_reserved31 >= check) {
                                Ext.Msg.alert("알림", "Size spec 상한 값이 범위를 벗어났습니다. <br>" + '상한 값: ' + check);
                                return;
                            }

                            var check2 = val.split('~')[0];
                            if (h_reserved34 <= check2) {
                                Ext.Msg.alert("알림", "Size spec 하한 값이 범위를 벗어났습니다. <br>" + '하한 값: ' + check2);
                                return;
                            }

                            // 숫자 값으로 변경
                            h_reserved31 = h_reserved31 * 1;
                            h_reserved34 = h_reserved34 * 1

                            if (h_reserved31 < h_reserved34) {
                                Ext.Msg.alert("알림", 'Size spec 하한 값이 상한 값 보다 큽니다.');
                                return;
                            }

                            break;

                    }

                    switch (this.link) {
                        case 'SRO3':

                            var h_reserved31 = gm.me().getInputJust('itemdetail|h_reserved31').getValue();
                            var h_reserved34 = gm.me().getInputJust('itemdetail|h_reserved34').getValue();

                            var tol_unit = gm.me().getInputTarget('h_reserved14').getValue(); //tol. 단위
                            var min = gm.me().getInputTarget('reserved_double1').getValue(); //tol(-)
                            var max = gm.me().getInputTarget('reserved_double2').getValue(); //tol(+)
                            var target_size = gm.me().getInputTarget('h_reserved11').getValue(); //tol(+)
                            var val = '';

                            switch (tol_unit) {
                                case 'UM':
                                    // gm.me().getInputTarget('h_reserved22').setValue(Number(Number(target_size)-Number(min))+'um'+'~'+Number(Number(target_size)+Number(max))+'um');
                                    val = Number(Number(target_size) - Number(min)) + '~' + Number(Number(target_size) + Number(max))
                                    break;
                                case '%':
                                    // gm.me().getInputTarget('h_reserved22').setValue(Number(Number(target_size)-(Number(target_size)*(Number(min)*0.01)))+'um'+'~'+Number(Number(target_size)+Number(Number(target_size)*(Number(max)*0.01)))+'um');
                                    val = Number(Number(target_size) - (Number(target_size) * (Number(min) * 0.01))) + '~' + Number(Number(target_size) + Number(Number(target_size) * (Number(max) * 0.01)))
                                    break;
                            }

                            var check = val.split('~')[1];
                            if (h_reserved31 > check) {
                                Ext.Msg.alert("알림", "Size spec 상한 값이 범위를 벗어났습니다. <br>" + '상한 값: ' + check);
                                return;
                            }

                            var check2 = val.split('~')[0];
                            if (h_reserved34 < check2) {
                                Ext.Msg.alert("알림", "Size spec 하한 값이 범위를 벗어났습니다. <br>" + '하한 값: ' + check2);
                                return;
                            }

                            // 숫자 값으로 변경
                            h_reserved31 = h_reserved31 * 1;
                            h_reserved34 = h_reserved34 * 1

                            if (h_reserved31 < h_reserved34) {
                                Ext.Msg.alert("알림", 'Size spec 하한 값이 상한 값 보다 큽니다.');
                                return;
                            }

                            var check_val = gm.me().getInputTarget('h_reserved27').getValue();
                            if (check_val == null || check_val == undefined) {
                                return;
                            }
                            var val_1 = check_val.split('±')[0];
                            var val_2 = check_val.split('±')[1];

                            if (val_2 != null && val_2 != undefined && val_2.length > 0) {
                                val_2 = val_2.split('%')[0]
                            }

                            var max_val = Number(val_1) + Number(val_2);  // 4.8
                            var min_val = Number(val_1) - Number(val_2);  // 4.2

                            var el_min = sendValue['itemdetail|h_reserved53'];  // 4.2
                            var el_max = sendValue['itemdetail|h_reserved44'];  // 4.7

                            if (el_min != null && el_min != undefined && el_min.length > 0 &&
                                el_max != null && el_max != undefined && el_max.length > 0) {
                                if (el_min >= min_val) {
                                    Ext.Msg.alert("알림", "지정된 E/L(기술) 값 범위에서 벗어났습니다.");
                                    return;
                                }
                                if (el_max <= max_val) {
                                    Ext.Msg.alert("알림", "지정된 E/L(기술) 값 범위에서 벗어났습니다.");
                                    return;
                                }
                            } else if (el_min != null && el_min != undefined && el_min.length > 0 &&
                                (el_max == null || el_max == undefined || el_max.length < 1)) {
                                if (el_min >= max_val) {
                                    Ext.Msg.alert("알림", "지정된 E/L(기술) 값 범위에서 벗어났습니다.");
                                    return;
                                }
                            } else if (el_max != null && el_max != undefined && el_max.length > 0 &&
                                (el_min == null || el_min == undefined || el_min.length < 1)) {
                                if (el_max <= min_val) {
                                    Ext.Msg.alert("알림", "지정된 E/L(기술) 값 범위에서 벗어났습니다.");
                                    return;
                                }
                            }
                            break;
                    }

                }

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/index/generalData.do?method=create',
                    params: sendValue,
                    method: 'POST',
                    success: function (rec, op) {
                        //console_logs('success rec', rec);
                        //console_logs('success op', op);

                        //console_logs('this.crudMode op', gm.me().crudMode);

                        if (gm.me().crudMode == 'EDIT') {
                            gMain.setCrPaneToolbarMsg('수정되었습니다.');
                        } else {
                            gMain.setCrPaneToolbarMsg('등록되었습니다.');
                            gm.me().doReset();
                        }

                        gm.me().redrawStore(sendValue);
                        gm.me().postCreateCallback(sendValue);

                        switch (gm.me().link) {
                            case 'PPO2':
                                Ext.getCmp(gMain.geViewCrudId()).collapse();
                                break;
                            default:
                                break;
                        }
                    },
                    failure: function (result, op) {
                        var jsonData = Ext.util.JSON.decode(result.responseText);
                        var resultMessage = jsonData.data.result;

                        Ext.getBody().unmask();
                        gm.me().createAction.enable();
                        gMain.setCrPaneToolbarMsg('저장에 실패하였습니다.');
                        Ext.Msg.alert('안내', '저장에 실패하였습니다.' + " : " + resultMessage, function () {
                        });

                    }
                });
            } else {//File 첨부있을 때..
                fileForm.submit({
                    url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' + this.vFILE_ITEM_CODE,
                    waitMsg: 'Uploading Files...',
                    success: function (fp, o) {
                        if (Ext.isDefined(gMain.extFieldColumnStore2) && gMain.extFieldColumnStore2.data.items.length > 0) {
                            console_log('>>>>>>>>>>>>extStore2_length4>>>>>>>>>>>>>>>', gMain.extFieldColumnStore2);
                            //gMain.extFieldColumnStore2.each(function(record) {
                            for (var i = 0; i < gMain.extFieldColumnStore2.data.items.length; i++) {

                                var r = gMain.extFieldColumnStore2.getAt(i);
                                //console_logs('gMain.extFieldColumnStore2 r', r);

                                sendValue['srcahd|item_name' + i] = r.get('item_name');
                                sendValue['srcahd|class_code' + i] = r.get('class_code');
                                sendValue['assymap|bm_quan' + i] = r.get('bm_quan');
                                sendValue['mycart|pl_no' + i] = r.get('pl_no');
                                sendValue['assymap|pl_no' + i] = r.get('pl_no');
                            }
                            sendValue['extStore2_length'] = gMain.extFieldColumnStore2.data.items.length;
                            //});

                            sendValue['CLASS_ALIAS'] = ['project', 'srcahd', 'assymap'];
                        }
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/index/generalData.do?method=create',
                            params: sendValue,
                            method: 'POST',
                            success: function (rec, op) {
                                //console_logs('success rec', rec);
                                //console_logs('success op', op);
                                gMain.setCrPaneToolbarMsg('등록되었습니다.');
                                //console_logs('this.crudMode op', gm.me().crudMode);

                                if (gm.me().crudMode == 'EDIT') {

                                } else {
                                    gm.me().doReset();
                                }

                                gm.me().redrawStore();


                            },
                            failure: function (result, op) {
                                var jsonData = Ext.util.JSON.decode(result.responseText);
                                var resultMessage = jsonData.data.result;

                                gMain.setCrPaneToolbarMsg('저장에 실패하였습니다.');
                                Ext.Msg.alert('안내', '저장에 실패하였습니다.' + " : " + resultMessage, function () {
                                });

                            }
                        });
                    }
                });
            }
        }

    },

    getFieldPos: function (title, name) {
        for (var i = 0; i < this.fields.length; i++) {
            var o = this.fields[i];
            //console_logs('o', o);
            if (o['tabTitle'] == title && (o['name'] == name)) {
                return i;
            }
        }

        return -1;
    },
    getFieldObj: function (key) {
        for (var i = 0; i < this.fields.length; i++) {
            var o = this.fields[i];
            //console_logs('o', o);
            if ((o['name'] == key)) {
                return o;
            }
        }

        return null;
    },
    addFormWidget: function (to, o) {
        var pos = -1;

        if (typeof to == 'string') {
            var title = o['tabTitle'];
            pos = this.getFieldPos(title, to);
        } else if (to == 'number') {
            pos = to;
        }
        //console_logs('>>>>>>>>>>>>>> addFormWidget pos=', pos);
        if (pos > -1) {
            this.fields = gUtil.insert(this.fields, pos + 1, o);
            //console_logs('addFormWidget this.field length2=', this.fields.length);
        } else {
            this.fields.push(o);
        }

    },
    createFormPane: function (mode) {

        var tabTitleArr = [/*'입력항목'*/];
        for (var i = 0; i < this.fields.length; i++) {
            var o = this.fields[i];
            //console_logs('createFormPane o', o);
            //console_logs('createFormPane o', o);
            var tabTitle = o['tabTitle'];
            if ((tabTitle != undefined) && (tabTitle != null) && (tabTitle.length > 0)) {
                tabTitleArr.push(tabTitle);
            }
        }
        //중복제거
        tabTitleArr = extjsUtil.mergeDuplicateArray(tabTitleArr);

        this.formItems = [];
        for (var i = 0; i < tabTitleArr.length; i++) {

            var forms = this.getFormPane(tabTitleArr[i]);

            //console_logs('------> forms', forms);
            //첫번째 탭에 UID 추가.
            if (i == 0) {
                forms.insert({
                    cmpId: this.link + '-' + 'selectedUidFrom',
                    xtype: 'hiddenfield',
                    name: 'default' + '|' + 'unique_id'
                });

            }
            console_logs('>>forms', forms);
            this.formItems.push(forms);
        }
        this.resetAction = Ext.create('Ext.Action', {
            iconCls: 'af-rotate-left',
            text: '초기화',
            disabled: true,
            handler: function () {

                gm.me().doReset();
            }
        });
        this.cancelAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '취소',
            disabled: false,
            hidden: vCompanyReserved4 == 'BIOT01KR' ? false : true,
            handler: function () {
                gm.me().doReset();
                gm.me().crudMode = 'VIEW';
                gm.me().crudTab.setActiveItem(1);
                gm.me().crudTab.setSize(gm.me().getCrudviewSize());
                gm.me().crudTab.setTitle(gm.me().vMESSAGE[gm.me().crudMode]);
                gm.me().toggleExpand();
                gm.me().crudTab
            }
        });
        this.createAction = Ext.create('Ext.Action', {
            iconCls: 'af-save',
            text: '저장 확인',
            disabled: true,
            handler: function () {
                gm.me().doCreate();
            }
        });
        var toolbar = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default1',
            dock: 'bottom',
            items: [{
                xtype: 'displayfield',
                name: gMain.selectedMenuId + 'create-msg',
                cmpId: gMain.selectedMenuId + 'create-msg',
                value: gMain.DEF_CRUD_TOOLBAR_MSG
            }, '->',
                this.cancelAction, this.resetAction, this.createAction]
        });

        var myId = gMain.geTabPanelId(); //viewId +'-'+ 'tabpanel';

        this.formPane = new Ext.TabPanel({
            id: myId,
            cmpId: myId,
            collapsible: false,
            xtype: 'tabpanel',
            activeTab: 0,
            tabPosition: 'top',

            items: this.formItems,
            dockedItems: [toolbar],
            listeners: {
                tabchange: function (tabPanel, newTab, oldTab, eOpts) {
                    if (gm.me().tabchangeHandler != null) {
                        gm.me().tabchangeHandler(tabPanel, newTab, oldTab, eOpts);
                    }
                }
            },
        });

        this.selectedUidFrom = Ext.getCmp(this.link + '-' + 'selectedUidFrom');


        //console_logs('*****************this.defOnlyCreate*******************', this.defOnlyCreate);

        if (this.defOnlyCreate == false || this.crudMode == 'CREATE') {

            for (var key in this.defComboValues) {
                //console_logs('this.defComboValues**************************************************************');
                //console_logs('defComboValues key', key);
                var o = this.defComboValues[key];
                var combo = Ext.getCmp(gMain.selectedMenuId + '-' + key);

                if (combo != null) {
                    combo.store.load(function (records) {
                        for (var i = 0; i < records.length; i++) {
                            var obj = records[i];
                            try {
                                if (obj.get(combo.valueField) == o['value']) {
                                    combo.select(obj);
                                }
                            } catch (e) {
                            }
                        }
                    });
                    //combo.setValue(o['value']);

                }
            }
        }


        return this.formPane;
    },

    doUpdate: function (gridvalues) {
        //console_logs('doUpdate', gridvalues);


        var CLASS_ALIAS = [];

        var getTableName = function (index, fields) {
            for (var j = 0; j < fields.length; j++) {
                o = fields[j];
                //console_logs('------- getTableName this.fields o', o);

                var tableName = o['tableName'];
                var name = o['name'];
                if (name == index) {
                    CLASS_ALIAS.push(tableName);
                    return tableName + '|' + index;
                }
            }
            return index;
        };


        for (var key in gridvalues) {
            //console_logs('key', key);
            var value = gridvalues[key];
            //console_logs('value', value);
            if (typeof value == 'string') {
                value = value.split('"').join("&quot;");
            }

            //console_logs('value', value);
            gridvalues[getTableName(key, this.fields)] = value;
            delete gridvalues[key];
        }

        CLASS_ALIAS = extjsUtil.mergeDuplicateArray(CLASS_ALIAS);

        gridvalues['CLASS_ALIAS'] = CLASS_ALIAS;

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/generalData.do?method=update',
            params: gridvalues,
            method: 'POST',
            success: function () {
                gm.me().getStore().load(function () {
                    gUtil.disable(gm.me().savePropertyAction);
                    gm.me().selectRow();
                    gMain.setCrudToolbarMsg('저장되었습니다.');
                });
            },
            failure: function (rec, op) {
                Ext.Msg.alert('안내', '저장에 실패하였습니다.', function () {
                });
            }
        });


    },
    createPropertyPane: function () {

        var propertyNames = {};
        if (this.fields != null) {
            for (var j = 0; j < this.fields.length; j++) {
                o = this.fields[j];
                //console_logs('------- createPropertyPane this.fields o', o);
                var dataIndex = o['name'];
                var text = o['text'];
                var type = o['type'];
                var edit = o['canEdit'];
                var view = o['canView'];

                if (gm.getUseNewPropertyPanel()) {
                    if (o['useYn']) {
                        propertyNames[dataIndex] = text;
                    }
                } else {
                    if (view) {
                        propertyNames[dataIndex] = edit ? text + '<span class=can-edit-property-cell title="수정가능"></span>' : text;
                    }
                }

            }
        }

        this.savePropertyAction = Ext.create('Ext.Action', {
            iconCls: 'af-save',
            text: '저장',
            disabled: true,
            handler: function () {
                var gridvalues = gm.me().propertyPane.getSource();

                //console_logs('savePropertyAction gridvalues', gridvalues);


                var removeGridValue = function (id) {
                    for (var key in gridvalues) {
                        var arr = key.split('|');
                        var gridId = arr[arr.length - 1];
                        if (gridId == id) {
                            delete gridvalues[key];
                            return;
                        }
                    }
                };


                for (var j = 0; j < gm.me().fields.length; j++) {
                    var o = gm.me().fields[j];
                    var edit = o['canEdit'];
                    var id = o['name'];
                    if (edit == false && id != 'unique_id' && id != 'id') {
                        removeGridValue(id);
                        //delete gridvalues[id];
                    }
                }
                //console_logs('savePropertyAction gridvalues after remove', gridvalues);
                gm.me().doUpdate(gridvalues);

            }
        });

        //console_logs('gMain', gMain);
        if (gm.getUseNewPropertyPanel()) {
            this.propertyPane = Ext.create('Ext.grid.property.Grid', {
                cls: 'rfx-panel',
                border: true,
                autoHeight: true,
                enableKeyEvents: true,
                viewConfig: {
                    markDirty: false,
                    stripeRows: false,
                    getRowClass: function (record) {
                        return '';
                    }
                },
                propertyNames: propertyNames,
                listeners: {
                    beforeedit: function (editor, e, opts) {
                        return false;
                    },
                    itemkeydown: function (record, item, index, e, eOpts) {

                        if (eOpts.ctrlKey && eOpts.keyCode === 67) {
                            var tempTextArea = document.createElement("textarea");
                            document.body.appendChild(tempTextArea);
                            tempTextArea.value = item.get('value');
                            tempTextArea.select();
                            document.execCommand('copy');
                            document.body.removeChild(tempTextArea);
                        }
                    }
                }//listener
                , dockedItems: [{}]
            });//create
        } else {
            this.propertyPane = Ext.create('Ext.grid.property.Grid', {
                cls: 'rfx-panel',
                border: true,
                autoHeight: true,
                viewConfig: {
                    markDirty: true,
                    stripeRows: false,
                    getRowClass: function (record) {
                        //console_logs('propertyPane viewConfig record', record);
                        var cls = '';

                        for (var j = 0; j < gm.me().fields.length; j++) {
                            var o = gm.me().fields[j];
                            var edit = o['canEdit'];
                            if (edit == false && (record['id'] == o['name'])) {
                                cls = 'readonly-property-cell';
                            }
                        }


                        return cls;
                    }
                },
                propertyNames: propertyNames,
                listeners: {
                    beforeedit: function (editor, e, opts) {
                        for (var j = 0; j < gm.me().fields.length; j++) {
                            var o = gm.me().fields[j];
                            var edit = o['canEdit'];
                            if (edit == false && (e.record.get('name') == o['name'])) {
                                return false;
                            }
                        }
                        return true;
                    }//beforeedit
                }//listener
                , dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [{
                        xtype: 'displayfield',
                        name: gMain.selectedMenuId + 'state-msg',
                        cmpId: gMain.selectedMenuId + 'state-msg',
                        value: gMain.DEF_CRUD_TOOLBAR_MSG
                    },
                        '->',
                        this.savePropertyAction
                    ]
                }]
            });//create
        }

        delete this.propertyPane.getStore().sorters; // Remove default sorting

        var propStore = this.propertyPane.getStore();
//		//console_logs('propStore', propStore);
//		//console_logs('propStore fields', propStore.getFields());
//		//console_logs('propStore fields', propStore.fields);


        propStore.addListener('update', function (store, record, operation, fields) {
            //console_logs('operation', operation);
            //console_logs('record', record);
            if (operation == 'edit') {
                gUtil.enable(gm.me().savePropertyAction);
            }
        });


        return this.propertyPane;
    },
    getRplaceCond: function (property) {
        if (this.byReplacer == null) {
            return null;
        } else {
            return this.byReplacer[property];
        }
    },
    byReplacer: null,//order by 명
    deleteClass: null,//삭제 테이블 alias명
    groupField: null,//groupField

    createStoreSimple: function (o, option) {
        this.modelClass = o['modelClass'];
        this.model = Ext.create(this.modelClass, {
            fields: this.fields
        });

        var byReplacer = o['byReplacer'];


        if (byReplacer != undefined && byReplacer != null) {
            this.byReplacer = byReplacer;
        }

        var deleteClass = o['deleteClass'];

        if (deleteClass != undefined && deleteClass != null) {
            this.deleteClass = deleteClass;
        }

        var groupField = o['groupField'];

        if (groupField != undefined && groupField != null) {
            this.groupField = groupField;
        }

        var sorters = o['sorters'];
        var property = 'unique_id';
        var direction = 'DESC';

        var groupDir = o['groupDir'];

        if (groupDir != undefined && groupDir != null) {
            this.groupDir = groupDir;
        } else {
            groupDir:'ASC';
        }

        if (sorters != undefined && sorters != null) {
            direction = sorters[0]['direction'];
            property = sorters[0]['property'];
            if (direction == undefined || direction == null) {
                direction = "DESC";
            }
            if (property == undefined || property == null) {
                property = "unique_id";
            }
        }

        this.setSortCond(property, direction, null);

        var pageSize = o['pageSize'];

        this.createStoreCore(pageSize, option);
    },

    //복사등록의 child callback
    copyCallback: function () {
        //console_logs('copyCallback', 'NOT DEFINED');
    },
    createStoreCore: function (pageSize, option) {
        this.store = this.createStoreCoreInner(pageSize, option, this.model);
    },
    createStoreCoreInner: function (pageSize, option, model) {

        var o = {
            pageSize: pageSize,
            model: model,
            sortOnLoad: true,
            /* remortSort를 true로 둘 경우 서버에서 정렬한 것을 기준으로 소팅이 되는데, 이렇게 하면 그룹화를 할 수 없다 */
            remoteSort: false,
            listeners: {

                beforeload: function (store, operation, eOpts) {
                    var sorters = store.sorters;
                    var property = null;
                    var direction = null;
                    if (sorters != undefined && sorters != null) {
                        for (var i = 0; i < sorters.length; i++) {
                            var sorter = store.sorters.getAt(0);

                            property = sorter['_property'];
                            direction = sorter['_direction'];

                            break;
                        }
                    }

                    if (property != null) {

                        gm.me().setSortCond(property, direction, null);


                        if (gm.me().orderbyAutoTable) {
                            var n = gm.me().getRplaceCond(property);

                            property = (n == null) ? property : n;
                        }

                        store.getProxy().setExtraParam('orderBy', property);
                        store.getProxy().setExtraParam('ascDesc', direction);

                    }

                },
                //Store의 Load 이벤트 콜백
                load: function (store, records, successful, operation, options) {

                    if (records != null) {
                        //콜백함수를 부른다.
//							if(gm.me().storeLoadCallback!=null) {
//								gm.me().storeLoadCallback(records, store);
//							}

                        //console_logs('스토어 로드 이벤트 콜백 레코드', records);
                        var highlightResult = function (records, key, val) {

                            for (i = 0; i < gm.me().searchComboNames.length; i++) {
                                if (key == gm.me().searchComboNames[i]) {
                                    return;
                                }
                            }

                            if (val != null && typeof val == 'string') {
                                val = val.replace(/[%]/gi, '');

                                for (var i = 0; i < records.length; i++) {
                                    var rec = records[i];
                                    //console_logs('rec', rec);
                                    var d = rec.get(key);
                                    if (d != undefined && d != null && typeof d == 'string') {
                                        var nv = d.replace(new RegExp(val, "g"), '<sPan style="background:#FFEF9D;">' + val + '</sPan>');
                                        rec.set(key, nv);
                                    }
                                }
                            }
                        };

                        var searchParams = store.getProxy().getExtraParams();
                        for (var key in searchParams) {
                            var v = searchParams[key];
                            if (v != null) {
                                var dcode = v;
                                try {
                                    dcode = Ext.JSON.decode(v);
                                } catch (e) {
                                }
                                //highlightResult(records, key, dcode);
                            }
                        }
                    }//recors is not null


                }
            }
        };

        if (option != undefined && option != null) {
            for (var attrname in option) {
                o[attrname] = option[attrname];
            }
        }

        if (this.bufferingStore == true) {
            o['autoLoad'] = true;
            return Ext.create('Ext.data.BufferedStore', o);
        } else {
            return new Ext.data.Store(o);
        }


    },

    createStore: function (modelClass, sorters, pageSize, byReplacer, deleteClass) {

        this.modelClass = modelClass;
        this.model = Ext.create(modelClass, {
            fields: this.fields
        });

        if (byReplacer != undefined && byReplacer != null) {
            this.byReplacer = byReplacer;
        }

        if (deleteClass != undefined && deleteClass != null) {
            this.deleteClass = deleteClass;
        }

        var property = 'unique_id';
        var direction = 'DESC';


        if (sorters != undefined && sorters != null) {
            direction = sorters[0]['direction'];
            property = sorters[0]['property'];
            if (direction == undefined || direction == null) {
                direction = "DESC";
            }
            if (property == undefined || property == null) {
                property = "unique_id";
            }
        }

        this.setSortCond(property, direction, null);

        this.createStoreCore(pageSize);
    },
    createTabGrid: function (model_name, items, param_name, toolbars, activateFc, storeOption, groupingFeature) {

        for (var i = 0; i < this.tab_info.length; i++) {

            var o = this.tab_info[i];
            console_logs('>>>>>> aaaaa', o);
            var code = o['code'];
            var name = o['name'];
            var title = o['title'];
            var pcsToolbars = o['toolbars'];
            //console_logs('createTabGrid code', code);
            //console_logs('createTabGrid pcsToolbars', pcsToolbars);
            this.createStoreSub(
                model_name,
                [{}],
                gMain.pageSize,
                {},
                {},
                param_name,
                code,
                storeOption
            );

            var option = {
                title: title,
                cmpId: multi_grid_id,
                multi_grid_id: code,
                tabConfig: {
                    tooltip: title + ' [' + multi_grid_id + ']'
                },
                features: groupingFeature
            };

            var multi_grid_id = this.link + '#' + code;
            //console_logs('===============> multi_grid_id', multi_grid_id);
            var grid = this.createSubGrid(code, name, option, pcsToolbars);

            if (grid != null) {
                grid.getSelectionModel().on({
                    selectionchange: function (sm, selections) {
                        gm.me().vSELECTED_RECORD = (selections != null && selections.length > 0) ? selections[0] : null;
                        gm.me().vSELECTED_UNIQUE_ID = gm.me().vSELECTED_RECORD == null ? -1 : gm.me().vSELECTED_RECORD.get('id');
                        gMain.doSelectGrid(selections);
                    }
                });
                items.push(grid);
                //하위 js에서 탭 그리드를 생성하는 함수에서 스토어를 로드 하기 때문에 이 곳에서 로드 할 필요 없음.
                //this.store_map[code].load();
            } else {
                Ext.Msg.alert('오류', code + ' 그리드 생성실패.J2_CODE정의가 정확하지 않습니다. \r\n ' + this.link + '#' + code + '를 확인하세요.', function () {
                });
            }

        }//endoffor

        this.tabGenPanel = Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
            layout: 'border',
            border: true,
            dockedItems: toolbars,
            width: "100%",
            minWidth: 200,
            height: "100%",
            region: 'center',
            border: false,
            resizable: true,
            scroll: false,
            tabPosition: 'top',
            collapsible: false,
            items: items,
            defaults: {
                listeners: {
                    activate: function (curTab, prevtab) {
                        gm.me().selected_tab = curTab.multi_grid_id;
                        activateFc(curTab, prevtab);
                    }
                }
            }
        });

        return this.tabGenPanel;
    },

    getTabGrid: function (multi_grid_id) {
        var key = this.link + '#' + multi_grid_id;
        //console_logs('getTabGrid multi_grid_id key', key);
        //console_logs('getTabGrid this.tabGenPanel', this.tabGenPanel);
        var items = this.tabGenPanel.items.items;
        //console_logs('items', items);

        for (var i = 0; i < items.length; i++) {
            var myGrid = items[i];
            //console_logs('myGrid', myGrid);
            //console_logs('cmpId', myGrid.cmpId);

            if (myGrid.cmpId == key) {
                return myGrid;
            }
        }

        return this.grid;
    },
    createStoreSub: function (modelClass, sorters, pageSize, byReplacer, deleteClass, param_name, tab_code, option) {
        //this.modelClass = modelClass;
        var model = Ext.create(modelClass, {
            fields: this.fields_map[tab_code]
        });

        var property = 'unique_id';
        var direction = 'DESC';
        if (sorters != undefined && sorters != null) {
            direction = sorters[0]['direction'];
            property = sorters[0]['property'];
            if (direction == undefined || direction == null) {
                direction = "DESC";
            }
            if (property == undefined || property == null) {
                property = "unique_id";
            }
        }
        this.setSortCond(property, direction, tab_code);

        this.store_map[tab_code] = this.createStoreCoreInner(pageSize, option, model);
        this.store_map[tab_code].getProxy().setExtraParam(param_name, tab_code);
        this.store_map[tab_code].getProxy().setExtraParam('status', null);

        return this.store_map[tab_code];

    },
    sort_cond: {},
    setSortCond: function (property, direction, tab_code) {

        this.sort_cond[tab_code == null ? 'default' : tab_code] = {
            property: property,
            direction: direction
        };

        this.redrawSortCond(tab_code);

    },
    getFields: function () {
        return (this.fields_map[this.selected_tab] == null) ? this.fields : this.fields_map[this.selected_tab];
    },
    redrawSortCond: function (tab_code) {

        var curTab = (tab_code == null) ? this.selected_tab : tab_code;
        if (curTab == undefined || curTab == null) {
            curTab = 'default';
        }
        //console_logs('redrawSortCond: ', curTab);

        var property = this.sort_cond[curTab].property;
        var direction = this.sort_cond[curTab].direction;

        var fields = curTab == 'default' ? this.fields : this.fields_map[curTab];
        if (fields != null) {
            for (var i = 0; i < fields.length; i++) {
                var o = fields[i];
                var name = o['name'];
                var text = o['text'];

                if (name == property) {
                    try {
                        gm.me().getCommandWidget('splitbutton' + gm.me().link).setText(text);
                        gm.me().getCommandWidget(gm.me() + '-' + 'orderBy').setValue(name);
                        gm.me().getCommandWidget(gm.me() + '-' + 'ascDesc').setValue(direction);

                        if (direction.toLowerCase() == 'desc') {
                            gm.me()(gm.me() + '-' + 'direction-desc').toggle(true);
                        } else {
                            gm.me()(gm.me() + '-' + 'direction-asc').toggle(true);
                        }
                    } catch (e) {
                    }


                    break;
                }
            }
        }

    },

    setGridOnCallback: function (fc) {
        this.callGridOnCallback = fc;
    },
    selectionedUids: [],
    callGridOnCallback: function (selections) {
        if (selections != null) {
            //console_logs('callGridOnCallback', selections);
        } else {
            //console_logs('callGridOnCallback', 'selections is null');
        }

    },
    rowClassFc: null,
    setRowClass: function (fc) {
        this.rowClassFc = fc;
    },
    checkDistinctKey: function (dataIndex) {
        //console_logs('checkDistinctKey dataIndex', dataIndex);
        //console_logs('checkDistinctKey link', this.link);
        for (var i = 0; i < gUtil.getDistinctFilters(this.link).length; i++) {
            var key = gUtil.getDistinctFilters(this.link)[i];
            if (dataIndex == key) {
                //	//console_logs('---- checkDistinctKey dataIndex', dataIndex);
                //	//console_logs('---- checkDistinctKey link', this.link);
                return true;
            }
        }
        return false;
    },

    renderBom: function (wa_name, pj_name, pj_code, pj_uid, parent_uid, child) {
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',
            params: {
                paramName: 'CommonProjectAssy',
                paramValue: pj_uid + ';' + '-1'
            },

            success: function (result, request) {
                console_log('success defaultSet');
                // var url = CONTEXT_PATH + '/index/main.do?&pj_uid=' + pj_uid
                //   + '#design^DBM7';

                // location.href=url;
            },
            failure: function (result, request) {
                console_log('fail defaultSet');
            }
        });

        var url = CONTEXT_PATH + '/index/main.do?&wa_name=' + wa_name
            + '&pj_name=' + pj_name + '&pj_code=' + pj_code + '&child=' + child
            + '&pj_uid=' + pj_uid
            + '&parent_uid=' + parent_uid + '#design-plan:DBM7_PLM'
        ;
        location.href = url;
    },

    checkColumnEdit: function (columns) {

        Ext.each(columns, function (o, index) {
            //console_logs('baseview index@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', o);
            var dataIndex = o['dataIndex'];
            var canEdit = o['canEdit'];
            var canCellEdit = o['canCellEdit'];
            var useYn = o['useYn'];
            var dataType = o['dataType'];
            var important = o['important'];
            var width = o['width'];

            if (canCellEdit == true && useYn == true) {
                o["style"] = 'background-color:#0271BC;text-align:center';
                o["tdCls"] = 'custom-column';
                o["width"] = width;

                switch (dataType) {
                    case 'decimal':
                        o["editor"] = {
                            xtype: 'textfield',
                            selectOnFocus: true,
                            listeners: {
                                specialkey: function (f, e) {
                                    // 다음 row의 cell editing
                                    if (e.getKey() == Ext.EventObject.ENTER && gm.me().nextRow == true) {
                                        var grid = gm.me().grid;
                                        var code = e.getCharCode();

                                        var maxRows = grid.store.data.length;
                                        var maxColumns = grid.columns.length;
                                        var rowSelected = f.column.field.container.component.context.rowIdx;
                                        var colSelected = f.column.field.container.component.context.colIdx;
                                        if (maxRows > rowSelected) {
                                            grid.editingPlugin.startEditByPosition({
                                                row: rowSelected + 1,
                                                column: colSelected
                                            });
                                            grid.selModel.doSelect(grid.store.data.items[rowSelected + 1]);
                                            grid.editingPlugin.edit();
                                        }
                                    }
                                }
                            },
                        };
                        o["renderer"] = function (value, meta) {
                            meta.css = important == true ? 'custom-column-orange' : 'custom-column';

                            if (vCompanyReserved4 == 'KWLM01KR') {
                                return Ext.util.Format.number(value, '0.0');
                            } else if (vCompanyReserved4 == 'KBTC01KR' || vCompanyReserved4 == 'HJSV01KR') {
                                return Ext.util.Format.number(value, '0,00.##');
                            } else if (vCompanyReserved4 == 'BIOT01KR') {
                                return Ext.util.Format.number(value, '0,00.#####');
                            }
                            return Ext.util.Format.number(value, '0,00.00/i');
                        };
                        break;
                    case 'number':
                    case 'int':
                    case 'long':
                        o["editor"] = {
                            xtype: 'numberfield',
                            selectOnFocus: true,
                            listeners: {
                                specialkey: function (f, e) {
                                    // 다음 row의 cell editing
                                    if (e.getKey() == Ext.EventObject.ENTER && gm.me().nextRow == true) {
                                        var grid = gm.me().grid;
                                        var code = e.getCharCode();

                                        var maxRows = grid.store.data.length;
                                        var maxColumns = grid.columns.length;
                                        var rowSelected = f.column.field.container.component.context.rowIdx;
                                        var colSelected = f.column.field.container.component.context.colIdx;
                                        // gm.me().nextRowCell(e.getKey(),f);
                                        if (maxRows > rowSelected) {
                                            grid.editingPlugin.startEditByPosition({
                                                row: rowSelected + 1,
                                                column: colSelected
                                            });
                                            grid.selModel.doSelect(grid.store.data.items[rowSelected + 1]);
                                            grid.editingPlugin.edit();

                                            console_logs('==>>>>nextcelledit', '>>>>>>>');
                                        }
                                    }
                                }
                            },
                            // focus: function(a,b) {
                            //     return true;
                            // }
                        };
                        o["renderer"] = function (value, meta) {
                            meta.css = important == true ? 'custom-column-orange' : 'custom-column';
                            return Ext.util.Format.number(value, '0,00/i');
                        };
                        break;
                    case 'combo':
                        o["editor"] = {
                            xtype: 'combo',
                            store: Ext.create('Mplm.store.' + o['codeName']),
                            displayField: o['dataIndex'],
                            editable: false,
                            listeners: {
                                expand: function () {
                                    this.store.load();
                                }
                            }
                        };
                        break;
                    case 'gcombo':
                        o["editor"] = {
                            xtype: 'combo',
                            store: Ext.create('Mplm.store.' + o['codeName']),
                            displayField: 'codeName',
                            valueField: 'systemCode',
                            innerTpl: '<div data-qtip="{codeNameEn}">[{systemCode}]{codeName}</div>',
                            editable: false,
                            selectOnFocus: true,
                            listeners: {
                                focus: function () {
                                    var combo = this;
                                    this.store.load(function () {
                                        combo.expand();
                                    });
                                }
                            }
                        };
                        break;
                    case 'rcombo':
                        o["editor"] = {
                            xtype: 'combo',
                            store: Ext.create('Mplm.store.CommonCodeExStore', {parentCode: o['codeName']}),
                            displayField: 'codeName',
                            valueField: 'systemCode',
                            innerTpl: '<div data-qtip="{codeNameEn}">[{systemCode}]{codeName}</div>',
                            editable: false,
                            selectOnFocus: true,
                            listeners: {
                                focus: function () {
                                    var combo = this;
                                    combo.expand();
                                    this.store.load(function () {
                                    });
                                },
                                select: function () {
                                    this.blur();
                                }
                            }
                        };
                        break;
                    case 'date':
                    case 'sdate':
                        o['editor'] = {
                            xtype: 'datefield',
                            submitFormat: 'Y-m-d',
                            dateFormat: 'Y-m-d',
                            format: 'Y-m-d',
                            altFormats: 'm/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|n-j|n/j|c',
                            renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                            allowBlank: true,
                            listeners: {
                                specialkey: function (f, e) {
                                    // 다음 row의 cell editing
                                    if (e.getKey() == Ext.EventObject.ENTER && gm.me().nextRow == true) {
                                        var grid = gm.me().grid;
                                        var code = e.getCharCode();

                                        var maxRows = grid.store.data.length;
                                        var maxColumns = grid.columns.length;
                                        var rowSelected = f.column.field.container.component.context.rowIdx;
                                        var colSelected = f.column.field.container.component.context.colIdx;

                                        if (maxRows > rowSelected) {
                                            grid.editingPlugin.startEditByPosition({
                                                row: rowSelected + 1,
                                                column: colSelected
                                            });
                                            grid.selModel.doSelect(grid.store.data.items[rowSelected + 1]);
                                            grid.editingPlugin.edit();
                                        }
                                    }
                                }
                            }
                        };
                        o['renderer'] = function (value, meta, aaa, bbb, ccc) { // = Ext.util.Format.dateRenderer('Y-m-d');

                            if (value == null) {
                                return "";
                            } else {
                                if (value.length > 9) {
                                    var s = value.substr(0, 10);
                                    return s;
                                } else {
                                    if (Ext.isIE) {
                                        return value;
                                    } else {
                                        return Ext.util.Format.date(value, 'Y-m-d');//Ext.util.Format.date(value, 'Y-m-d');
                                    }

                                }
                            }
                        };
                        o['dateFormat'] = 'Y-m-d';
                        o['type'] = 'date';
                        break;
                    case 'mdate':
                        o['editor'] = {
                            xtype: 'datefield',
                            submitFormat: 'Y-m-d',
                            dateFormat: 'Y-m-d',
                            format: 'Y-m-d',
                            renderer: Ext.util.Format.dateRenderer('m-d') //Ext.util.Format.dateRenderer('Y-m-d')
                        };
                        o['renderer'] = function (value, meta, aaa, bbb, ccc) { // = Ext.util.Format.dateRenderer('Y-m-d');
                            //console_logs('renderer value', value);
                            if (value == null) {
                                return "";

                            } else {
                                if (value.length > 9) {
                                    var s = value.substr(0, 10);
                                    return s.substr(5);
                                } else {
                                    if (Ext.isIE) {
                                        return value;
                                    } else {
                                        return Ext.util.Format.date(value, 'm-d');//Ext.util.Format.date(value, 'Y-m-d');
                                    }

                                }
                            }

                            //
                        };
                        o['dateFormat'] = 'Y-m-d';
                        o['type'] = 'date';
                        break;
                    case 'string':
                        o["renderer"] = function (value, meta) {
                            meta.css = important == true ? 'custom-column-orange' : 'custom-column';
                            return value;
                        };
                        o["editor"] = {
                            selectOnFocus: true,
                            listeners: {
                                specialkey: function (f, e) {
                                    // 다음 row의 cell editing
                                    if (e.getKey() == Ext.EventObject.ENTER && gm.me().nextRow == true) {
                                        var grid = gm.me().grid;
                                        var code = e.getCharCode();

                                        var maxRows = grid.store.data.length;
                                        var maxColumns = grid.columns.length;
                                        var rowSelected = f.column.field.container.component.context.rowIdx;
                                        var colSelected = f.column.field.container.component.context.colIdx;

                                        if (maxRows > rowSelected) {
                                            grid.editingPlugin.startEditByPosition({
                                                row: rowSelected + 1,
                                                column: colSelected
                                            });
                                            grid.selModel.doSelect(grid.store.data.items[rowSelected + 1]);
                                            grid.editingPlugin.edit();
                                        }
                                    }
                                }
                            },
                        };
                        break;
                    default:
                        o["renderer"] = function (value, meta) {
                            meta.css = important == true ? 'custom-column-orange' : 'custom-column';
                            return value;
                        };
                        o["editor"] = {};
                }

                o["css"] = important == true ? 'edit-cell-important' : 'edit-cell';
            }
        });

        //console_logs('-----> columns', columns);

    },

    getComboCommon: function () {
        var buttonItems = [];

        if (this.useValueCopyCombo == true) {
            var data1 = [];
            data1.push({
                name: '<미지정>',
                code: ''
            });
            var clipColumns = [];
            clipColumns.push({
                text: '<전체복사>',
                handler: function (r, l) {
                    gm.me().popupClip(null, r.text, 800, 600);
                }
            });
            Ext.each(this.columns, function (o, index) { //Editable

                //console_logs('o', o);
                var name = o['text'];
                var code = o['dataIndex'];
                //console_logs('name', name);
                //console_logs('code', code);

                data1.push({
                    name: name,
                    code: code
                });

                clipColumns.push({
                    text: o['text'],
                    dataIndex: o['dataIndex'],
                    handler: function (r, l) {
                        console_logs('-- r.text', r.text);
                        console_logs('-- r.dataIndex', r.dataIndex);
                        var o = gu.getCmp('clipboard');
                        console_logs('-- o', o);
                        if (o != null) {
                            o.setText(r.text + ' 값복사');
                            o.value = r.dataIndex;
                        }

                        gm.me().popupClip(r.dataIndex, r.text, 300, 500);
                    }
                });
            });

            buttonItems.push({
                id: gu.id('clipboard'),
                cmpId: 'clipboard' + this.link + '',
                xtype: 'splitbutton',
                //text: '값복사',
                text: this.getMC('CMD_VAL_COPY', '값복사'),
                value: null,
                //hidden: (vSYSTEM_TYPE!='HANARO'),
                //tooltip: '값복사 할 필드 선택',
                tooltip: this.getMC('CMD_VAL_COPY', '값복사 필드 선택'),
                handler: function (o, o1) {

                    var dataIndex = this.value;
                    if (dataIndex == null) {
                        Ext.Msg.alert('안내', '먼저 값복사 할 필드를 선택하세요.', function () {
                        });
                    } else {
                        gm.me().popupClip(dataIndex, o.text, 300, 500);
                    }
                }, // handle a click on the button itself
                menu: new Ext.menu.Menu({
                    items: clipColumns
                })
            });
        }

        buttonItems.push('->');

        for (var i = 0; i < this.selectedSortComboCount; i++) {
            var store = Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'code', type: 'string'},
                    {name: 'name', type: 'string'}
                ],
                proxy: {
                    type: 'memory',
                    data: data1,
                    reader: {
                        type: 'json'
                    }
                },
                sorters: [{
                    property: 'name',
                    direction: 'ASC'
                }]
            });

            buttonItems.push({
                xtype: 'combobox',
                store: store,
                seq: i,
                id: gu.id('multisort' + (i + 1) + 'combo'),
                width: 90,
                //emptyText: '정렬 ' + (i + 1),
                emptyText: this.getMC('CMD_SORT ', '정렬 ') + (i + 1),
                displayField: 'name',
                valueField: 'code',
                forceSelection: false,
                editable: true,
                triggerAction: 'all',
                enableKeyEvents: true,
                autoLoad: true,
                autoSync: true,
                listConfig: {
                    getInnerTpl: function () {
                        return '<div data-qtip="{code}"><small>{name}</small></div>';
                    }
                },
                listeners: {
                    select: function (combo, records) {

                    },
                    focus: function (combo) {
                        gm.me().selectedSortCombo = combo.seq;
                    }
                }
            });

            buttonItems.push(new Ext.form.Hidden({
                id: gu.id('multisort' + (i + 1) + 'ascdesc'),
                value: ''
            }));

            buttonItems.push({
                xtype: 'button',
                iconCls: 'fa-sort-alpha-asc',
                tooltip: '오름차순',
                index: i,
                value: 'asc',
                style: {
                    background: '#EAEAEA'
                },
                listeners: {
                    click: function () {
                        var v = this.value;
                        var index = this.index;

                        this.value = (v == 'asc') ? 'desc' : 'asc';
                        if (this.value == 'asc') {
                            this.setIconCls('fa-sort-alpha-asc');
                            this.setTooltip('오름차순');
                        } else {
                            this.setIconCls('font-awesome_4-7-0_sort-alpha-desc_14_0_f39c12_none');
                            this.setTooltip('내림차순');
                        }

                        gu.getCmp('multisort' + (index + 1) + 'ascdesc').setValue(this.value);
                    }
                }
            });
        }

        return Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default-common',
            items: buttonItems
        });

    },

    createGridCoreInner: function (toolbars, option, store, columns, columnGroup) {

        if (toolbars != undefined && this.useValueCopyCombo == true && this.useDivisionCombo == true
            && this.selectedSortComboCount > 0) {
            toolbars.splice(1, 0, this.getComboCommon());
        }

        var target = this;
        Ext.each(columns, function (columnObj, index) {
//            //console_logs('columnObj', columnObj);
            var dataIndex = columnObj['dataIndex'];
            if (target.checkDistinctKey(dataIndex) == true) {
                //console_logs('distinct key', dataIndex);
                var optionsStore = Ext.create('Ext.data.Store', {
                    fields: ['id', 'text'],
                    proxy: {
                        type: 'ajax',
                        url: dataIndex,
                        reader: 'array'
                    }
                });
                columnObj["filter"] = {
                    type: 'list',
                    store: optionsStore
                    //,phpMode: true
                };
            } else {
                columnObj["filter"] = {
                    type: 'string',
                    itemDefaults: {
                        emptyText: '필터링...'
                    }
                };
            }

        });
        // //console_logs('-----> this.columns', this.columns);
        // //console_logs('-----> gm.getCell_edit(this)', gm.getCell_edit(this));

        if (gm.getCell_edit(this) == 'Y') {
            this.checkColumnEdit(columns);
            //console_logs(N-----> columns', columns);
        }

        var lock_cnt = gm.getLock_cnt(this);

        var useColumn = [];

        if (this.alwaysShowRowNumber()) {
            useColumn.push({xtype: 'rownumberer', width: 40});
        }

        for (var i = 0; i < columns.length; i++) {
            var o = columns[i];
            var dataIndex = o['dataIndex'];
            // console_logs('-----> columns o', o);
            o['listeners'] = {
                headerclick: function (header, column, e, t, eOpts) {
                    console_logs('column ', column);
                    console_logs('column dataIndex', column.dataIndex);
                    gm.me().selectSortcond(column.dataIndex, column.text);
                    //Ext.Msg.alert('Event', column.text + ':' +  column.dataIndex +  ' clicked!');
                }
            };

            if (dataIndex == 'num') {
                //o["style"] ='background-color:#EAEAEA;text-align:center';
                o["tdCls"] = 'custom-column-grey';
            }

            if (o['useYn'] == true) {
                if (lock_cnt > 0) {
                    o['locked'] = true;
                    lock_cnt--;
                }
                useColumn.push(o);
            }
        }

        var viewConfig = {
            stripeRows: true,
            markDirty: false,
            enableTextSelection: true,
            preserveScrollOnReload: this.isUsePreservedScrollOnReload()
        };

        if (this.rowClassFc != null) {
            viewConfig['getRowClass'] = this.rowClassFc;
        }

        var c = null;
        var max = useColumn.length;
        if (columnGroup != null && columnGroup.length) {
            c = [];
            var pos = 0;
            for (var n = 0; n < columnGroup.length; n++) {
                var o = columnGroup[n];
                o['columns'] = [];
                var arr = o['arr'];
                if (o['text'] != null) {
                    for (var m = 0; m < arr.length; m++) {
                        if (pos < max) {
                            pos = arr[m];
                            o['columns'].push(useColumn[pos]);
                            //pos++;
                        } else {
                            break;
                        }
                    }
                    c.push(o);
                } else {
                    for (var m = 0; m < arr.length; m++) {
                        pos = arr[m];
                        c.push(useColumn[pos]);
                    }
                }
            }

        } else {
            c = useColumn;
        }

        //this.usePagingToolbar = true;

        if (vSYSTEM_TYPE == "HANARO") {
            switch (this.link) {
                case 'PPO1_PNL':
                    this.selCheckOnly = true;
                    break;
                default:
                    break;
            }
        } else {
            switch (vCompanyReserved4) {
                case 'SKNH01KR':
                    switch (this.link) {
                        case 'PPO1_PNL':
                            this.selCheckOnly = true;
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        }

        var selModel = {
            selType: 'checkboxmodel',
            mode: this.selMode == 'SINGLE' ? 'SINGLE' : 'multi',
            checkOnly: this.selCheckOnly,
            allowDeselect: this.selAllowDeselect
        };

        if (this.link == 'XDT3' || this.link == 'XDT6' || this.link == 'EPJ2_PLM2') {
            selModel = null;
        }

        if (this.usePagingToolbar == true) {

            var paging = Ext.create('Ext.PagingToolbar', {
                store: store,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다."
                , listeners: {
                    beforechange: function (page, currentPage) {
                        this.getStore().getProxy().setExtraParam('start', (currentPage - 1) * /*gMain.pageSize*/gm.me().getPageSize());
                        this.getStore().getProxy().setExtraParam('page', currentPage);
                        this.getStore().getProxy().setExtraParam('limit', /*gMain.pageSize*/ gm.me().getPageSize());
                        // 페이지 넘겼을때 맨 윗줄로 이동.
                        if (gm.me().link != null && gm.me().link == 'SRO5_DGN' && vCompanyReserved4 == 'KWLM01KR') {
                            gm.me().grid.view.bufferedRenderer.scrollTo(1, true);
                        }
                        console_logs('>>base grid', gm.me().grid.getSelectionModel().getSelection());
                        if (gm.me().link != null && gm.me().link == 'EPC5' && vCompanyReserved4 == 'KWLM01KR') {
                            console_logs('>>>qqq', gm.me().grid.getView().saveScrollState());
                            this.selectedRecords = gm.me().grid.getSelectionModel().getSelection();
                            gm.me().grid.getView().saveScrollState();
                            // gm.me().page_select.push(gm.me().grid.getSelectionModel().getSelection());
                        }
                        gm.me().pageflag = true;
                    },
                    change: function () {
                        if (gm.me().pageflag == true) {
                            if (gm.me().link == 'SRO5_SUB' || gm.me().link == 'SRO5_SUB1' || gm.me().link == 'SRO5_SUB2') {
                                if (vCompanyReserved4 == 'DOOS01KR') {
                                    grid.setLoading(true);
                                    store.load(function (records) {
                                        gm.me().storeLoadCallbackSub(records);
                                        grid.setLoading(false);
                                    });
                                }
                            }
                        }
                        gm.me().pageflag = false;
                    }
                }

            });

            //console_logs('paging', paging);
            var o1 = paging['items'];
            //console_logs('o1', o1);
            var o2 = o1['items'];
            //console_logs('o2', o2);

//			o2[10] = {text: '이동',
//		            handler: function() {
//		            	gm.me().jumpToRow();
//		            }};

            //console_logs('this.gridSumArr', this.gridSumArr);
            var pageArr = [paging];


            switch (vCompanyReserved4) {
                case 'KYNL01KR':
                    this.gridSumArr = [];

                    switch (this.link) {
                        case 'SRO5_KM':
                        case 'SRO5_KM2':
                        case 'SRO5_KM3':
                        case 'SRO5_KM4':
                        case 'SRO5_SUB':
                        case 'SRO5_SUB1':
                        case 'SRO5_SUB2':
                        case 'SRO5_SUB3':
                        case 'EPC5_T':
                        case 'EPJ1':
                        case 'SPS1_MES':
                        case 'SPS2_MES':
                        case 'QTT4_MES':
                        case 'QTT4_HIS':
                            while (this.gridSumArr.length > 0) {
                                this.gridSumArr.pop();
                            }

                            this.gridSumArr.push(
                                {
                                    xtype: 'label',
                                    text: 'BOM 총 수량 : 0',
                                    id: gu.id('targetSumbom1' + (option != null ? option.multi_grid_id : ''))

                                });
                            this.gridSumArr.push(
                                {
                                    xtype: 'label',
                                    text: 'BOM 총 중량 : 0',
                                    id: gu.id('targetSumbom2' + (option != null ? option.multi_grid_id : ''))

                                });
                            this.gridSumArr.push(
                                {
                                    xtype: 'label',
                                    text: 'PO 총 수량 : 0',
                                    id: gu.id('targetSumPo1' + (option != null ? option.multi_grid_id : ''))

                                });
                            this.gridSumArr.push(
                                {
                                    xtype: 'label',
                                    text: 'PO 총 중량 : 0',
                                    id: gu.id('targetSumPo2' + (option != null ? option.multi_grid_id : ''))

                                });
                            break;
                        default:
                            break;
                    }
                    break;
                case 'HSGC01KR':
                    this.gridSumArr = [];
                    switch (this.link) {
                        case 'SRO5_SUB':
                        case 'SRO5_SUB1':
                            while (this.gridSumArr.length > 0) {
                                this.gridSumArr.pop();
                            }

                            this.gridSumArr.push(
                                {
                                    xtype: 'label',
                                    text: 'P/O 총 수량 : 0 ',
                                    id: gu.id('targetSumbom1' + (option != null ? option.multi_grid_id : ''))

                                });
                            this.gridSumArr.push(
                                {
                                    xtype: 'label',
                                    text: 'P/O 총 금액 : 0원',
                                    id: gu.id('targetSumbom2' + (option != null ? option.multi_grid_id : ''))

                                });
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }


            if (this.gridSumArr.length > 1) {

                for (var i = 0; i < this.gridSumArr.length; i++) {

                    if (i == 0) {
                        pageArr.push('->');
                    }
                    pageArr.push(this.gridSumArr[i]);
                }
                var o = {
                    store: store,
                    dockedItems: toolbars,
                    columns: c,
                    viewConfig: viewConfig,
                    selModel: selModel,
                    bbar: pageArr
                };
                this.loadedGridSumArr = true;

            } else {

                var o = {
                    store: store,
                    dockedItems: toolbars,
                    columns: c,
                    viewConfig: viewConfig,
                    selModel: selModel,
                    bbar: paging
                };
            }

        } else {
            //console_logs('usePagingToolbar false', this.usePagingToolbar);
            var o = {
                store: store,
                selModel: selModel,
                dockedItems: toolbars,
                columns: useColumn,
                viewConfig: viewConfig
            };
        }

        if (this.useGotoToolbar == true) {
            o['bbar'] = [
                {
                    labelWidth: 90,
                    fieldLabel: '이동 라인 위치',
                    xtype: 'numberfield',
                    minValue: 1,
                    maxValue: max,
                    allowDecimals: false,
                    itemId: 'gotoLine',
                    enableKeyEvents: true,
                    width: 200,
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() === e.ENTER) {
                                gm.me().jumpToRow();
                            }
                        }
                    }
                }, {
                    text: '이동',
                    handler: function () {
                        gm.me().jumpToRow();
                    }
                }, '->',
                {xtype: 'tbtext', itemId: 'maxNo', text: '레코드 갯수: 0'}
            ];
        }

        if (option != null) {
            for (var attrname in option) {
                //console_logs('attrname', attrname);
                o[attrname] = option[attrname];
            }
        }

        if (this.bufferingStore == true) {
            o['plugins'] = ['gridfilters',
                Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})
                , {
                    ptype: 'bufferedrenderer',
                    trailingBufferZone: 20,  // Keep 20 rows rendered in the table behind scroll
                    leadingBufferZone: 50   // Keep 50 rows rendered in the table ahead of scroll
                }
                /*, {ptype:"gridFilter"}*/];
        } else {

            var clicksToEditNum = 1;

            switch (vCompanyReserved4) {
                case 'KBTC01KR':
                    clicksToEditNum = 2;
                    break;
                default:
                    break;
            }

            switch (this.link) {
                case 'XDT3':
                case 'SPC12':
                    clicksToEditNum = 2;
                    break;
                default:
                    break;
            }

            o['plugins'] = ['gridfilters',
                Ext.create('Ext.grid.plugin.CellEditing',
                    {clicksToEdit: clicksToEditNum})];
        }

        if (o['rowEdit']) {
            o['plugins'] = [
                'gridfilters',
                Ext.create('Ext.grid.plugin.RowEditing', {
                    clicksToMoveEditor: 1,
                    autoCancel: false
                })
            ]
        }


        //console_logs('Rfx.base.BaseGrid option', o);
        //o['multi_grid_id'] = this.link+'#';
        o['loadMask'] = true;


        if (vExtVersion > 5) {
            var toolbars = o['dockedItems'];

            if (toolbars != null && toolbars != undefined) {
                if (this.excelTop) {
                    if (this.link != 'SRO5_SUB') {
                        this.buttonToolbar = gu.getExcelToolbarTop(this.buttonToolbar);
                    }
                } else {
                    toolbars.splice(0, 0, gu.getExcelToolbar(this.id));
                }
            }
        }

        if (!gm.useRefreshOnlyCenterPanel()) {
            var token = window.location.hash.substr(1);
            o['stateId'] = 'token';
            o['stateful'] = true;
        }

        var grouper = o.store.grouper;
        var grid = Ext.create('Rfx.base.BaseGrid', o);
        grid.getStore().group(grouper);

        //grid.set('multi_grid_id', this.link+'#');
        grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                gm.me().vSELECTED_RECORD = (selections != null && selections.length > 0) ? selections[0] : null;
                gm.me().vSELECTED_UNIQUE_ID = gm.me().vSELECTED_RECORD == null ? -1 : gm.me().vSELECTED_RECORD.get('id');
                gMain.doSelectGrid(selections);
            }
        });

        return grid;
    },
    createGridCore: function (toolbars, option, columnGroup) {
        console_logs('AbsBaseView createGridCore', this.columns);

        this.grid = this.createGridCoreInner(toolbars, option, this.store, this.columns, columnGroup);

        this.simManager =
            Ext.ux.ajax.SimManager.init({
                delay: 300,
                defaultSimlet: null
            })

        return this.grid;
    },
    createGrid: function (searchToolbar, buttonToolbar, option, columnGroup) {

        var toolbars = [];
        if (searchToolbar instanceof Array) {
            //console_logs('searchToolbar', 'is array');
            toolbars = searchToolbar;
        } else {
            //console_logs('searchToolbar', 'not array');
            toolbars.push(buttonToolbar);
            toolbars.push(searchToolbar);
        }

        return this.createGridCore(toolbars, option, columnGroup);
    },

    createSubGrid: function (tab_code, tab_title_name, option, toolbars, columnGroup) {

        var title = option['title'];

        var myStore = this.store_map[tab_code];
        var myColumn = this.columns_map[tab_code];
        var columnGroup = this.column_group_map[tab_code];

        if (myColumn != null) {
            console_logs('>>> subTabGridEach', this.subTabGridEach);
            if (this.subTabGridEach) {
                Ext.each(myColumn, function (columnObj, index) {
                    var dataIndex = columnObj["dataIndex"];
                    console_logs('>>dataIndex', columnObj);
                    switch (dataIndex) {
                        case 'plan_date':
                            columnObj['renderer'] = function (value) {
                                // value = parseFloat(value);
                                console_logs('===222type', typeof (value));
                                return value;
                            };
                            break;
                    }
                });
            }


            /*var lock_cnt = gm.getLock_cnt(this);

             for(var i=0; i<myColumn.length; i++) {
             if(lock_cnt>0) {

             var o = 	myColumn[i];

             if(o['useYn'] ==true) {
             o['locked'] = true;
             lock_cnt--;
             }
             }
             }
             if(columnGroup!=null) {

             var lock_cnt = gm.getLock_cnt(this);

             for(var i=0; i<columnGroup.length; i++) {
             if(lock_cnt>0) {

             var o = 	columnGroup[i];

             if(o['useYn'] ==true) {
             o['locked'] = true;
             lock_cnt--;
             }
             }
             }
             }*/


            return this.createGridCoreInner(toolbars, option, myStore, myColumn, columnGroup);
        } //endof myColunn if

    },

    insertAreaField: function (srchToolbar, field_id, fieldObj) {

        var srchId = gMain.getSearchField(field_id); // 'srch' + fieldObj.substring(0,1).toUpperCase()+ fieldObj.substring(1);

        var emptyText = fieldObj['emptyText'];
        var myEmptyText = (emptyText == undefined) ? gMain.getColNameByField(this.fields, field_id) : emptyText;

        //console_logs('this.link - srchId', this.link + '-'+ srchId);
        srchToolbar.push(
            {
                xtype: 'triggerfield',
                width: 180,
                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                emptyText: myEmptyText,
                tooltip: myEmptyText,
                cmpId: this.link + '-' + srchId,
                listeners: {
                    specialkey: function (fieldObj, e) {
                        if (e.getKey() == Ext.EventObject.ENTER) {
                            gm.me().redrawStore();
                            //srchSingleHandler (store, srchId, fieldObj, isWild);
                        }
                    },
                    render: function (c) {
                        Ext.create('Ext.tip.ToolTip', {
                            target: c.getEl(),
                            html: c.emptyText
                        });
                    }
                },
                allowBlank: true,
                trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger',
                trigger2Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                win: null,
                closeWin: function () {
                    if (this.win != null) {
                        this.win.close();
                        this.win = null;
                    }
                },
                getXpos: function () {
                    return 100;
                },
                getYpos: function () {
                    return 100;
                },
                'onTrigger2Click': function () {
                    var o1 = Ext.getCmp(this.getId());
                    o1.setValue('');

                },
                'onTrigger1Click': function () {
                    var o = Ext.get(this.getId());
                    var o1 = Ext.getCmp(this.getId());
                    var val = o1.getValue();

                    if (val != null && val != '') {
                        val = val.replace(/;/gi, '\n');
                    } else {
                        val = '';
                    }

                    if (this.win != null) {
                        this.closeWin();
                    }

                    this.win = new Ext.Window({
                        layout: 'fit',
                        closable: true,
                        position: 'absolute',
                        header: true,
                        headerPosition: 'bottom',
                        plain: true,
                        draggable: false,
                        resizable: false,
                        x: o.getLeft(),
                        y: o.getTop(),
                        height: 200,
                        target: o1,
                        width: o.getWidth(),
                        items: [
                            {
                                xtype: 'textarea',
                                style: 'border: none;',
                                hideBorders: true,
                                value: val
                            }
                        ],
                        listeners: {
                            'close': function (win) {
                                var s = this.items.getAt(0).getValue();
                                //console_logs('s', s);

                                var s1 = s.replace(/\r\n/gi, ';');
                                s1 = s1.replace(/\n/gi, ';');
                                //console_logs('s1', s1);
                                //console_logs('win.target', win.target);
                                win.target.setValue(s1);


                            },
                            'hide': function (win) {
                                console.info('just hidden');
                            }
                        }
                    });


                    this.win.show();
                }
            });
    },

    insertTextField: function (srchToolbar, field_id, field_obj) {
        var srchId = gMain.getSearchField(field_id); // 'srch' + fieldObj.substring(0,1).toUpperCase()+ fieldObj.substring(1);

        var myEmptyText = field_id;
        //console_logs('myEmptyText', myEmptyText);
        if (field_obj !== undefined && field_obj !== null) {
            var emptyText = field_obj['emptyText'];
            myEmptyText = (emptyText == undefined) ? gMain.getColNameByField(this.fields, field_id) : emptyText;
        } else {
            myEmptyText = gMain.getColNameByField(this.fields, field_id);
        }
        //console_logs('myEmptyText', myEmptyText);

        //console_logs('this.link - srchId', this.link + '-'+ srchId);
        srchToolbar.push(
            {
                xtype: 'triggerfield',
                width: 130,
                fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                emptyText: myEmptyText,
                tooltip: myEmptyText,
                cmpId: this.link + '-' + srchId,
                listeners: {
                    specialkey: function (fieldObj, e) {
                        if (e.getKey() == Ext.EventObject.ENTER) {

                            gm.me().redrawStore(true);
                            //srchSingleHandler (store, srchId, fieldObj, isWild);
                        }
                    },
                    render: function (c) {
                        Ext.create('Ext.tip.ToolTip', {
                            target: c.getEl(),
                            html: c.emptyText
                        });
                    }
                },
                trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                'onTrigger1Click': function () {
                    Ext.getCmp(this.id).setValue('');
                    gm.me().redrawStore();
                }

            }
        );
    },
    insertHiddenField: function (srchToolbar, field_id) {
        var srchId = gMain.getSearchField(field_id);
        srchToolbar.push(
            new Ext.form.Hidden({
                cmpId: this.link + '-' + srchId,
                name: srchId
            })
        );
    },
    insertRadioField: function (srchToolbar, field_id, childObjs) {
        var srchId = gMain.getSearchField(field_id);
        var srchId_link = this.link + '-' + srchId;
        //hidden field.
        srchToolbar.push(new Ext.form.Hidden({cmpId: srchId_link, name: srchId}));

        var togGroup = 'tog' + field_id;
        //combo buttons.
        Ext.each(childObjs['items'], function (fieldObj, index) {

            var pressed = fieldObj['pressed'];
            var text = fieldObj['text'];
            var iconCls = fieldObj['iconCls'];
            var value = fieldObj['value'];
            var width = fieldObj['width'];
            var name = fieldObj['name'];
            var checked = fieldObj['checked'];

            srchToolbar.push(
                {
                    xtype: 'radio',
                    cls: 'searchLabel',
                    toggleGroup: togGroup,
                    pressed: pressed,
                    text: text,
                    name: name,
                    checked: checked,
                    boxLabel: text,
                    value: value,
                    width: width,
                    style: 'color: white',
                    handler: function () {
                        var hiddenFrm = gm.me().getSearchWidget(srchId_link);//Ext.getCmp(srchId_link);
                        if (this.checked) {
                            if (hiddenFrm == null) {
                                console_logs('NOT-FOUND ', srchId_link);
                            } else {
                                hiddenFrm.setValue(value);
                                console_logs('OK', 'set to ' + srchId_link + ':' + value);
                            }
                            gm.me().redrawStore(true);
                        }
                    }
                });
        });
    },
    getSearchWidget: function (cmpId) {
        //console_logs('getSearchWidget(srchId_link)', cmpId);
        //console_logs('this.searchToolbar', this.searchToolbar);
        //console_logs('this.searchField', this.searchField);

        if (this.searchToolbar != null) {
            var items = this.searchToolbar['items'];
            for (var i = 0; i < items['items'].length; i++) {
                var o = items['items'][i];
                if (o['cmpId'] == cmpId) {
                    return o;
                }
            }
        }

        if (this.searchToolbar1 != null) {
            var items1 = this.searchToolbar1['items'];
            for (var i = 0; i < items1['items'].length; i++) {
                var o = items1['items'][i];
                if (o['cmpId'] == cmpId) {
                    return o;
                }
                //console_logs('cmpId', items['items'][i]['cmpId']);
            }
        }

        if (this.searchToolbar2 != null) {
            var items2 = this.searchToolbar2['items'];
            for (var i = 0; i < items2['items'].length; i++) {
                var o = items2['items'][i];
                if (o['cmpId'] == cmpId) {
                    return o;
                }
                //console_logs('cmpId', items['items'][i]['cmpId']);
            }
        }

        if (this.searchToolbar3 != null) {
            var items3 = this.searchToolbar3['items'];
            for (var i = 0; i < items3['items'].length; i++) {
                var o = items3['items'][i];
                if (o['cmpId'] == cmpId) {
                    return o;
                }
                //console_logs('cmpId', items['items'][i]['cmpId']);
            }
        }

        //console_logs('NOT-FOUND', 'getSearchWidget:' + cmpId);
        return null;
    },

    getCommandWidget: function (cmpId) {
        //console_logs('getCommandWidget(srchId_link)', cmpId);
        //console_logs('this.buttonToolbar', this.buttonToolbar);
        if (this.buttonToolbar != null && this.buttonToolbar.length > 0) {
            var items = this.buttonToolbar['items'];
            for (var i = 0; i < items['items'].length; i++) {
                var o = items['items'][i];
                if (o['cmpId'] == cmpId) {
                    return o;
                }
                //console_logs('cmpId', items['items'][i]['cmpId']);
            }
        }

        //console_logs('NOT-FOUND', 'getCommandWidget:' + cmpId);
        return null;
    },


    insertDategangeField: function (srchToolbar, field_id, fieldObj) {
        var srchId = gMain.getSearchField(field_id);
        var srchId_link = this.link + '-' + srchId;

        var valSdate = fieldObj['sdate'];
        var valEdate = fieldObj['edate'];

        var labelWidth = fieldObj['labelWidth'] == undefined ? 48 : fieldObj['labelWidth'];

        var yyyymmdd = gUtil.yyyymmdd(valSdate) + ':' + gUtil.yyyymmdd(valEdate);

        srchToolbar.push(new Ext.form.Hidden({cmpId: srchId_link, name: srchId, value: yyyymmdd}));

        var s_date = srchId_link + '-s';
        var e_date = srchId_link + '-e';

        srchToolbar.push({
            xtype: 'label',
            width: labelWidth,
            text: fieldObj['text'],
            style: 'color:white;'
        });

        var disabled = fieldObj['disabled'] == null ? false : fieldObj['disabled'];
        var editable = fieldObj['editable'] == null ? true : fieldObj['editable'];

        srchToolbar.push({
            cmpId: s_date,
            name: s_date,
            format: 'Y-m-d',
            disabled: disabled,
            editable: editable,
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
            xtype: 'datefield',
            value: valSdate,
            width: 98,
            listeners: {
                select: {
                    fn: function (a, b, c) {
                        if (a.focusTask != undefined) {
                            gMain.changeDatespan(this['cmpId']);
                        }
                    }
                },
                change: function (field, newVal, oldVal) {
                    gMain.changeDatespan(this['cmpId']);
                },
                specialkey: function (fieldObj, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        gm.me().redrawStore(true);
                    }
                }
            }

        });

        srchToolbar.push({
            xtype: 'label',
            text: "~",
            style: 'color:white;'
        });

        srchToolbar.push({
            cmpId: e_date,
            name: e_date,
            format: 'Y-m-d',
            disabled: disabled,
            editable: editable,
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
            allowBlank: true,
            xtype: 'datefield',
            value: valEdate,
            width: 98,
            listeners: {
                select: {
                    fn: function (a, b, c) {
//								//console_logs('a', a);
//								//console_logs('b', b);
//								//console_logs('c', a);
//								//console_logs('this', this);
                        if (a.focusTask != undefined) {
                            gMain.changeDatespan(this['cmpId']);
                        }
                    }
                },
                change: function (field, newVal, oldVal) {
                    gMain.changeDatespan(this['cmpId']);
                },
                specialkey: function (fieldObj, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        gm.me().redrawStore(true);
                        //srchSingleHandler (store, srchId, fieldObj, isWild);
                    }
                }
            }
        });


    },
    insertDateField: function (srchToolbar, field_id, fieldObj) {
        var srchId = gMain.getSearchField(field_id);
        var srchId_link = this.link + '-' + srchId;

        var valdate = fieldObj['date'];

        var labelWidth = fieldObj['labelWidth'] == undefined ? 48 : fieldObj['labelWidth'];
        var yyyymmdd = gUtil.yyyymmdd(valdate);

        srchToolbar.push(new Ext.form.Hidden({cmpId: srchId_link, name: srchId, value: yyyymmdd}));

        var date = srchId_link + '-s';
        //console_logs('====>date', date);
        srchToolbar.push({
            xtype: 'label',
            width: labelWidth,
            text: fieldObj['text'],
            style: 'color:white;'
        });

        //console_logs('==>valdate', valdate);
        srchToolbar.push({
            cmpId: date,
            name: date,
            format: 'Y-m-d',
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
            xtype: 'datefield',
            value: valdate,
            width: 98,
            listeners: {
                change: {
                    fn: function (a, b, c) {
                        //console_logs('a', a);
                        //console_logs('b', b);
                        //console_logs('c', c);
                        //console_logs('this', this);
                        gMain.changeDate(this['cmpId']);
                    }
                }
            }
        });
    },

    insertMonthField: function (srchToolbar, field_id, fieldObj) {
        var srchId = gMain.getSearchField(field_id);
        var srchId_link = this.link + '-' + srchId;

        var valdate = fieldObj['date'];

        var labelWidth = fieldObj['labelWidth'] == undefined ? 48 : fieldObj['labelWidth'];
        var yyyymm = gUtil.yyyymm(valdate);

        srchToolbar.push(new Ext.form.Hidden({cmpId: srchId_link, name: srchId, value: yyyymm}));

        var date = srchId_link + '-s';
        //console_logs('====>date', date);
        srchToolbar.push({
            xtype: 'label',
            width: labelWidth,
            text: fieldObj['text'],
            style: 'color:white;'
        });

        //console_logs('==>valdate', valdate);
        srchToolbar.push({
            cmpId: date,
            name: date,
            format: 'Y-m',
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            submitFormat: 'Y-m',// 'Y-m-d H:i:s',
            dateFormat: 'Y-m',// 'Y-m-d H:i:s'
            xtype: 'datefield',
            value: valdate,
            width: 80,
            listeners: {
                select: {
                    fn: function (a, b, c) {
                        gMain.changeDate(this['cmpId']);
                    }
                }
            }
        });
    },

    insertDistinctField: function (srchToolbar, field_id, fieldObj) {


        //console_logs('--------- insertComboField field_id', field_id);

        var srchId = gMain.getSearchField(field_id); // 'srch' + fieldObj.substring(0,1).toUpperCase()+ fieldObj.substring(1);
        //console_logs('--------- srchId', srchId);

        var storeId = 'DistinctStore';
        var arrField = null;
        var displayField = 'label';
        var valueField = 'value';
        var innerTpl = '<div data-qtip="{value}">{label}</div>';
        var minChars = 1;

        //console_logs('insertComboField', fieldObj);
        var width = 130;
        var widthIn = fieldObj['width'];
        if (widthIn != undefined && widthIn != null) {
            width = widthIn;
        }
        var limit = fieldObj['limit'] == undefined ? 100 : limit;

        var mode = null;
        var queryMode = null;

        var storeName = 'Mplm.store.' + storeId;


        var opt = {hasNull: true};
        var params = fieldObj['params'];
        if (params != undefined && params != null) {
            for (var key in params) {
                opt[key] = params[key];
            }
        }

        var tableName = fieldObj['tableName'];
        var fieldName = fieldObj['fieldName'];

        var storeSrch = Ext.create(storeName, opt);
        storeSrch.getProxy().setExtraParam('parentCode', this.link);
        storeSrch.getProxy().setExtraParam('tableName', tableName);
        storeSrch.getProxy().setExtraParam('fieldName', fieldName);
        storeSrch.getProxy().setExtraParam('limit', limit);

        if (arrField != undefined && arrField != null) {

            storeSrch = Ext.create('Ext.data.Store', {
                fields: arrField,
                data: []
            });
            queryMode = 'local';
            mode = 'local';
        }
        storeSrch.getProxy().setExtraParam('tableName', tableName);
        storeSrch.getProxy().setExtraParam('fieldName', fieldName);

        srchToolbar.push(
            new Ext.form.Hidden({
                cmpId: this.link + '-' + srchId + '_',
                name: this.link + '-' + srchId + '_'
            })
        );

        var myId = this.link + '-' + srchId;
        //console_logs('myId', myId);

        var emptyText = fieldObj['emptyText'];
        var myEmptyText = (emptyText == undefined) ? gMain.getColNameByField(this.fields, field_id) : emptyText;

        var myCombo = {
            cmpId: myId,
            storeId: storeId,
            width: width,
            name: srchId,
            xtype: 'combo',
            store: storeSrch,
            mode: mode,
            queryMode: queryMode,
            emptyText: myEmptyText,
            tooltip: myEmptyText,
            displayField: valueField,
            valueField: valueField,
            minChars: minChars,
            scroll: true,
            collapsible: false,
            layout: 'fit',
            forceSelection: false,
            enableKeyEvents: true,
            editable: true,
            multiSelect: fieldObj['multiSelect'] == null ? true : fieldObj['multiSelect'],
            //loading: true,
            //autoLoad: true,
            fieldStyle: 'background-color: #EFFDDE; background-image: none;',
            //  triggerAction: 'all',
            listeners: {
                keyup: function (combo, e, eOpts) {

                    combo.store.removeAll();
                    combo.queryMode = 'local';
                    var selected = '';

                    if (combo.getRawValue().length > 0) {
                        selected = '%' + combo.getRawValue() + '%';
                    } else {
                        selected = '';
                    }

                    var o = gm.me().getSearchWidget(combo['cmpId'] + '_');
                    if (o == null) {
                        //console_logs('myCombo', combo['cmpId'] + '_'  + ' 을 찾을 수 없어 값을 저장하지 않음.');
                    } else {
                        o.setValue(selected);
                    }

                    gm.me().setSearchCondition(combo['cmpId'], combo.getValue());

                    if (e.getKey() === e.ENTER) {
                        combo.queryMode = null;
                        combo.blur();
                        gm.me().redrawStore(true);
                    }
                },
                expand: function (combo, eOpts) {
                    combo.queryMode = null;
                    combo.store.load();
                },
                beforeselect: function (combo, record, index) {
                    console_logs('beforeselect', record);
                    var order = record.get('order');
                    switch (order) {
                        case -3://필드값 없음.
                            //console_logs('필드값 없음', order);
                            this.picker.getSelectionModel().deselectAll();
                            var val = combo.getValue();
                            //console_logs('val', val);
                            if (val != '<NULL>') {
                                combo.setValue('<NULL>');
                            }
                            break;

                        case -2://모두 지우기
                            //console_logs('모두 지우기', order);
                            this.picker.getSelectionModel().deselectAll();
                            combo.setValue(null);
                            break;
                        case -1://모두 선택
                            //console_logs('모두 선택', order);
                            this.picker.getSelectionModel().deselectAll();
                            var values = [];
                            combo.store.each(function (rec) {
                                var order = rec.get('order');
                                var value = rec.get('value');
                                //console_logs('order', order);
                                if (order > 0 && value != null && value != '' && value != '<NULL>') {
                                    values.push(rec.get('value'));
                                }
                            });
                            combo.setValue(values);
                            break;

                    }
                    // prevent collapsing if the same value is selected
                    //if (record.data.label == combo.getRawValue()) return false;
                },
                afterrender: function (combo) {
                    console_logs('afterrender', combo);
                },
                select: function (combo, records) {

                    //console_logs('combo', combo);
                    //console_logs('records', records);
                    var selected = combo.getValue();

                    if (selected instanceof Array) {
                        //console_logs('value is Array!', selected);
                        var values = [];

                        var canAdd = false;
                        for (var i = 0; i < records.length; i++) {
                            var rec = records[i];
                            var value = rec.get('value');
                            //console_logs('value', value);
                            if (value != null && value != '-' && value != '*' && value != '<NULL>') {
                                canAdd = true;
                            }
                            if (value == '<NULL>') {
                                values.push(rec);
                            }

                        }

                        if (canAdd == true) {
                            values = [];
                            for (var i = 0; i < records.length; i++) {

                                var rec = records[i];
                                var value = rec.get('value');
                                //console_logs('value', value);
                                if (value != null && value != '-' && value != '*' && value != '<NULL>' && value != '') {
                                    values.push(rec);
                                }
                            }
                        }

                        //console_logs('combo.values', values);
                        combo.setValue(values);


                        var o = gm.me().getSearchWidget(combo['cmpId'] + '_');
                        if (o == null) {
                            //console_logs('myCombo', combo['cmpId'] + '_'  + ' 을 찾을 수 없어 값을 저장하지 않음.');
                        } else {
                            o.setValue(combo.getValue());
                        }

                        gm.me().setSearchCondition(combo['cmpId'], combo.getValue());

                    } else { //multi select가 아닌경우
                        //console_logs('Not an array', selected);

                        var o = gm.me().getSearchWidget(combo['cmpId'] + '_');
                        if (o == null) {
                            //console_logs('myCombo', combo['cmpId'] + '_'  + ' 을 찾을 수 없어 값을 저장하지 않음.');
                        } else {
                            o.setValue(selected);
                        }


                        gm.me().setSearchCondition(combo['cmpId'], combo.getValue());

                    }

                    //console_logs('this.searchCondition', gm.me().searchCondition);
                },

                render: function (c) {
                    Ext.create('Ext.tip.ToolTip', {
                        target: c.getEl(),
                        html: c.emptyText
                    });
                }

            },
            listConfig: {
                getInnerTpl: function () {

                    return innerTpl; // '<div class="x-combo-list-item" style="background: red;" data-qtip="{unique_id}">[{wa_code}] {wa_name}</div>';
                }
            }
        };


        srchToolbar.push(myCombo);


    },
    insertConditionField: function (srchToolbar, field_id, fieldObj) {

        //console_logs('--------- insertComboField field_id', field_id);

        var srchId = gMain.getSearchField(field_id); // 'srch' + fieldObj.substring(0,1).toUpperCase()+ fieldObj.substring(1);
        //console_logs('--------- srchId', srchId);

        var storeId = 'ConditionStore';

        var arrField = null;
        var displayField = 'label';
        var valueField = 'value';
        var innerTpl = '<div data-qtip="{value}">{label}</div>';
        var minChars = 1;

        //console_logs('insertComboField', fieldObj);
        var width = 130;
        var widthIn = fieldObj['width'];
        if (widthIn != undefined && widthIn != null) {
            width = widthIn;
        }
        var limit = fieldObj['limit'] == undefined ? 100 : limit;

        var mode = null;
        var queryMode = null;

        var storeName = 'Mplm.store.' + storeId;

        var opt = {hasNull: true};
        var params = fieldObj['params'];
        var wherelist = '';
        var counter = Object.keys(params).length;

        if (params != undefined && params != null) {
            for (var key in params) {
                opt[key] = params[key];
                wherelist += --counter > 0 ? key + ':' + params[key] + '|' : key + ':' + params[key];
            }
        }

        var tableName = fieldObj['tableName'];
        var fieldName = fieldObj['fieldName'];
        var sqlName = fieldObj['sqlName'];
        var emptyText = fieldObj['emptyText'];

        var storeSrch = Ext.create(storeName, opt);

        storeSrch.getProxy().setExtraParam('parentCode', this.link);
        storeSrch.getProxy().setExtraParam('tableName', tableName);
        storeSrch.getProxy().setExtraParam('fieldName', fieldName);
        storeSrch.getProxy().setExtraParam('limit', limit);
        storeSrch.getProxy().setExtraParam('sqlName', sqlName);
        storeSrch.getProxy().setExtraParam('wherelist', wherelist);

        if (arrField != undefined && arrField != null) {

            storeSrch = Ext.create('Ext.data.Store', {
                fields: arrField,
                data: []
            });
            queryMode = 'local';
            mode = 'local';
        }
        storeSrch.getProxy().setExtraParam('tableName', tableName);
        storeSrch.getProxy().setExtraParam('fieldName', fieldName);

        srchToolbar.push(
            new Ext.form.Hidden({
                cmpId: this.link + '-' + srchId + '_',
                name: this.link + '-' + srchId + '_'
            })
        );

        var myId = this.link + '-' + srchId;
        //console_logs('myId', myId);

        var emptyText = fieldObj['emptyText'];
        var myEmptyText = (emptyText == undefined) ? gMain.getColNameByField(this.fields, emptyText != null ? emptyText : field_id) : emptyText;

        var myCombo = {
            cmpId: myId,
            storeId: storeId,
            width: width,
            name: srchId,
            xtype: 'combo',
            store: storeSrch,
            mode: mode,
            queryMode: queryMode,
            emptyText: myEmptyText,
            tooltip: myEmptyText,
            displayField: valueField,
            valueField: valueField,
            minChars: minChars,
            scroll: true,
            collapsible: false,
            layout: 'fit',
            forceSelection: false,
            enableKeyEvents: true,
            editable: true,
            multiSelect: fieldObj['multiSelect'] == null ? true : fieldObj['multiSelect'],
            //loading: true,
            //autoLoad: true,
            fieldStyle: 'background-color: #EFFDDE; background-image: none;',
            //  triggerAction: 'all',
            listeners: {
                keyup: function (combo, e, eOpts) {

                    combo.store.removeAll();
                    combo.queryMode = 'local';
                    var selected = '';

                    if (combo.getRawValue().length > 0) {
                        selected = '%' + combo.getRawValue() + '%';
                    } else {
                        selected = '';
                    }

                    var o = gm.me().getSearchWidget(combo['cmpId'] + '_');
                    if (o == null) {
                        //console_logs('myCombo', combo['cmpId'] + '_'  + ' 을 찾을 수 없어 값을 저장하지 않음.');
                    } else {
                        o.setValue(selected);
                    }

                    gm.me().setSearchCondition(combo['cmpId'], combo.getValue());

                    if (e.getKey() === e.ENTER) {
                        combo.queryMode = null;
                        combo.blur();
                        gm.me().redrawStore(true);
                    }
                },
                expand: function (combo, eOpts) {
                    combo.queryMode = null;
                    combo.store.load();
                },
                beforeselect: function (combo, record, index) {
                    console_logs('beforeselect', record);
                    var order = record.get('order');
                    switch (order) {
                        case -3://필드값 없음.
                            //console_logs('필드값 없음', order);
                            this.picker.getSelectionModel().deselectAll();
                            var val = combo.getValue();
                            //console_logs('val', val);
                            if (val != '<NULL>') {
                                combo.setValue('<NULL>');
                            }
                            break;

                        case -2://모두 지우기
                            //console_logs('모두 지우기', order);
                            this.picker.getSelectionModel().deselectAll();
                            combo.setValue(null);
                            break;
                        case -1://모두 선택
                            //console_logs('모두 선택', order);
                            this.picker.getSelectionModel().deselectAll();
                            var values = [];
                            combo.store.each(function (rec) {
                                var order = rec.get('order');
                                var value = rec.get('value');
                                //console_logs('order', order);
                                if (order > 0 && value != null && value != '' && value != '<NULL>') {
                                    values.push(rec.get('value'));
                                }
                            });
                            combo.setValue(values);
                            break;

                    }
                    // prevent collapsing if the same value is selected
                    //if (record.data.label == combo.getRawValue()) return false;
                },
                afterrender: function (combo) {
                    console_logs('이벤트', 'afterrender');
                },
                select: function (combo, records) {
                    console_logs('이벤트', 'select');
                    var selected = combo.getValue();

                    if (selected instanceof Array) {
                        //console_logs('value is Array!', selected);

                        var values = [];

                        var canAdd = false;
                        for (var i = 0; i < records.length; i++) {
                            var rec = records[i];
                            var value = rec.get('value');
                            //console_logs('value', value);
                            if (value != null && value != '-' && value != '*' && value != '<NULL>') {
                                canAdd = true;
                            }
                            if (value == '<NULL>') {
                                values.push(rec);
                            }

                        }

                        if (canAdd == true) {
                            values = [];
                            for (var i = 0; i < records.length; i++) {

                                var rec = records[i];
                                var value = rec.get('value');
                                //console_logs('value', value);
                                if (value != null && value != '-' && value != '*' && value != '<NULL>' && value != '') {
                                    values.push(rec);
                                }
                            }
                        }

                        //console_logs('combo.values', values);
                        combo.setValue(values);


                        var o = gm.me().getSearchWidget(combo['cmpId'] + '_');
                        if (o == null) {
                            //console_logs('myCombo', combo['cmpId'] + '_'  + ' 을 찾을 수 없어 값을 저장하지 않음.');
                        } else {
                            o.setValue(combo.getValue());
                        }

                        gm.me().setSearchCondition(combo['cmpId'], combo.getValue());

                    } else { //multi select가 아닌경우
                        //console_logs('Not an array', selected);

                        var o = gm.me().getSearchWidget(combo['cmpId'] + '_');
                        if (o == null) {
                            //console_logs('myCombo', combo['cmpId'] + '_'  + ' 을 찾을 수 없어 값을 저장하지 않음.');
                        } else {
                            o.setValue(selected);
                        }


                        gm.me().setSearchCondition(combo['cmpId'], combo.getValue());

                    }

                    //console_logs('this.searchCondition', gm.me().searchCondition);
                },
                activate: function (c) {
                    console_logs('이벤트', 'activiate');

                },
                render: function (c) {
                    console_logs('이벤트', 'render');
                    Ext.create('Ext.tip.ToolTip', {
                        target: c.getEl(),
                        html: c.emptyText
                    });
                }

            },
            listConfig: {
                getInnerTpl: function () {

                    return innerTpl; // '<div class="x-combo-list-item" style="background: red;" data-qtip="{unique_id}">[{wa_code}] {wa_name}</div>';
                }
            }
        };


        srchToolbar.push(myCombo);
    },


    insertComboField: function (srchToolbar, field_id, fieldObj) {


        //console_logs('--------- insertComboField field_id', field_id);

        var srchId = gMain.getSearchField(field_id); // 'srch' + fieldObj.substring(0,1).toUpperCase()+ fieldObj.substring(1);

        var storeId = fieldObj['store'];
        var arrField = fieldObj['fields'];
        var displayField = fieldObj['displayField'];
        var valueField = fieldObj['valueField'];
        var innerTpl = fieldObj['innerTpl'];
        var minChars = fieldObj['minChars'];
        var params = fieldObj['params'];
        var defaultValue = fieldObj['defaultValue'];
        var autoLoad = fieldObj['autoLoad'];
        var chainCombo = fieldObj['chainCombo'];

        if (minChars == undefined && minChars == null) {
            minChars = 1;
        }

        //console_logs('insertComboField', fieldObj);
        var width = 130;
        var widthIn = fieldObj['width'];
        if (widthIn != undefined && widthIn != null) {
            width = widthIn;
        }
        //console_logs('widthIn', widthIn);
        //onsole_logs('width', width);

        var storeSrch = null;
        var mode = null;
        var queryMode = null;
        if (storeId != undefined && storeId != null) {

            storeName = ((storeId.indexOf("Mplm.store.") > -1
                    || storeId.indexOf("Ext.data.Store")) > -1
                || storeId.indexOf("Rfx2.store.") > -1)
                ? storeId : 'Mplm.store.' + storeId;


            var opt = {hasNull: true};

            if (params !== undefined && params !== null) {
                Object.assign(params, opt);
            }

            var params = fieldObj['params'];
            if (params != undefined && params != null) {
                for (var key in params) {
                    opt[key] = params[key];
                }
            }

            storeSrch = Ext.create(storeName, opt);
            if (storeId == 'BuyerStore') {
                storeSrch['cmpName'] = field_id;
                storeSrch['minChars'] = 1;
            }
            queryMode = 'remote';
            mode = 'remote';
        } else if (arrField != undefined && arrField != null) {

            storeSrch = Ext.create('Ext.data.Store', {
                fields: arrField,
                data: []
            });
            queryMode = 'local';
            mode = 'local';
        }

        if (storeSrch != null) {

            srchToolbar.push(
                new Ext.form.Hidden({
                    cmpId: this.link + '-' + srchId + '_',
                    name: this.link + '-' + srchId + '_'
                })
            );

            var myId = this.link + '-' + srchId;
            //console_logs('myId', myId);

            var emptyText = fieldObj['emptyText'];
            var myEmptyText = (emptyText == undefined) ? gMain.getColNameByField(this.fields, field_id) : emptyText;

            var myCombo = {
                cmpId: myId,
                storeId: storeId,
                width: width,
                name: srchId,
                xtype: 'combo',
                store: storeSrch,
                mode: mode,
                queryMode: queryMode,
                emptyText: myEmptyText,
                tooltip: myEmptyText,
                displayField: displayField,
                valueField: valueField,
                minChars: minChars,
                forceSelection: false,
                editable: false,
                value: defaultValue,
                multiSelect: fieldObj['multiSelect'] == null ? false : fieldObj['multiSelect'],
                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                triggerAction: 'all',
                listeners: {
                    select: function (combo, record) {

                        var selected = combo.getValue();

                        var o = gm.me().getSearchWidget(combo['cmpId'] + '_');

                        if (o != null) {
                            o.setValue(selected);
                        }

                        gm.me().setSearchCondition(combo['cmpId'], combo.getValue());

                        if (chainCombo != null) {
                            var cb = gm.me().getSearchWidget(gm.me().link + '-' + gMain.getSearchField(chainCombo));

                            var cStore = cb.getStore();

                            cStore.getProxy().setExtraParam(field_id, selected);
                            cStore.load();
                        }
                    },
                    afterrender: function (combo) {

                    },
                    render: function (c) {
                        Ext.create('Ext.tip.ToolTip', {
                            target: c.getEl(),
                            html: c.emptyText
                        });
                    }

                },
                listConfig: {
                    getInnerTpl: function () {

                        return innerTpl; // '<div class="x-combo-list-item" style="background: red;" data-qtip="{unique_id}">[{wa_code}] {wa_name}</div>';
                    }
                }
            };

            if (autoLoad) {
                storeSrch.load();
            }

            srchToolbar.push(myCombo);

        }//endofif storeSrch notnull
    },
    /*
     * 체크박스 필드
     */
    insertCheckboxField: function (srchToolbar, field_id, childObjs) {

        var srchId = gMain.getSearchField(field_id);
        var srchId_link = this.link + '-' + srchId;
        //hidden field.
        srchToolbar.push(new Ext.form.Hidden({cmpId: srchId_link, name: srchId}));

        var togGroup = 'tog' + field_id;

        Ext.each(childObjs['items'], function (fieldObj, index) {

            var checked = fieldObj['checked'];
            var id = fieldObj['id'];
            var name = fieldObj['name'];
            var inputValue = fieldObj['inputValue'];
            var boxLabel = fieldObj['boxLabel'];

            srchToolbar.push(
                {
                    xtype: "checkbox",
                    toggleGroup: togGroup,
                    checked: checked,
                    boxLabel: boxLabel,
                    inputValue: inputValue,
                    cls: 'searchLabel',
                    handler: function (field, value) {
                        var hiddenFrm = gm.me().getSearchWidget(srchId_link);
                        hiddenFrm.setValue(value);
                        gm.me().redrawStore(true);
                    },
                    listeners: {
                        afterrender: function (combo) {
                            var value = combo.value;
                            var hiddenFrm = gm.me().getSearchWidget(srchId_link);
                            hiddenFrm.setValue(value);
                        }
                    }
                });
        });
    },

    parseFields: function (srchToolbar, fieldObj) {
        //console_logs('parseFields', fieldObj);
        //종전코드호환성
        //console_logs('typeof fieldObj', typeof fieldObj);
        if (typeof fieldObj == 'string') { //text search
            this.insertTextField(srchToolbar, fieldObj);
            srchToolbar.push({xtype: 'tbspacer'});

        } else if (typeof fieldObj == 'object') { //combo search

            if (fieldObj['xtype'] == 'component') {
                srchToolbar.push(fieldObj);
            } else {
                var type = fieldObj['type'];

                if (type == undefined || type == null) {
                    type = 'combo';
                }

                var field_id = fieldObj['field_id'];
                switch (type) {
                    case 'text':
                        this.insertTextField(srchToolbar, field_id, fieldObj);
                        break;
                    case 'hidden':
                        this.insertHiddenField(srchToolbar, field_id);
                        break;
                    case 'dateRange':
                        this.insertDategangeField(srchToolbar, field_id, fieldObj);
                        break;
                    case 'combo':
                        this.insertComboField(srchToolbar, field_id, fieldObj);
                        break;
                    case 'radio':
                        this.insertRadioField(srchToolbar, field_id, fieldObj);
                        break;
                    case 'checkbox':
                        this.insertCheckboxField(srchToolbar, field_id, fieldObj);
                        break;
                    case 'area':
                        this.insertAreaField(srchToolbar, field_id, fieldObj);
                        break;
                    case 'distinct': //기존에 있던 Distinct
                        this.insertDistinctField(srchToolbar, field_id, fieldObj);
                        break;
                    case 'condition': //새로 만든 Distinct
                        this.insertConditionField(srchToolbar, field_id, fieldObj);
                        break;
                    case 'date':
                        this.insertDateField(srchToolbar, field_id, fieldObj);
                        break;
                    case 'month':
                        this.insertMonthField(srchToolbar, field_id, fieldObj);
                        break;

                }//endof switch
                if (type != 'hidden') {
                    srchToolbar.push({xtype: 'tbspacer'});
                }

            }


        }//endof else if (typeof fieldObj == 'object')


    },
    gSearchField: null,
    makeSrchToolbar: function (menuName, arrField) {

        this.gSearchField = arrField;

        var srchToolbar = [];//초기화

        if (arrField != null && arrField.length > 0) {
            for (var i = 0; i < arrField.length; i++) {
                this.parseFields(srchToolbar, arrField[i]);
            }

        }//endofif

        return srchToolbar;
    },
//	distinctFilters: ['pj_name', 'specification'],

    highlightCellBase: function (o, system_code) {
        var reserved6 = o.get(system_code);
        var now_reserved6 = o.get('now_' + system_code);
        try {
            gm.me().highlightCell(o, now_reserved6, reserved6, system_code);
        } catch (e) {

        }

    },
    redrawCell: function (records) {
        Ext.each(records, function (o, index) {
            //console_logs(index, o);
            var arr = gm.me().highlightCodes;
            for (var i = 0; i < arr.length; i++) {
                gm.me().highlightCellBase(o, arr[i]);
            }

        });
    },
    highlightCodes: null,
    storeLoadCallbackSub: function (records, store, model) {

    },
    storeLoadCallback: function (records, store, sum1, sum2, sum3, sum4, sum5) {

        if (records == null) {
            return;
        }
        if (this.highlightCodes != null) {
            this.redrawCell(records);
        }

        var map = {};

        for (var i = 0; i < gUtil.getDistinctFilters().length; i++) {
            map[gUtil.getDistinctFilters()[i]] = [];
        }

        for (var i = 0; i < records.length; i++) {
            var rec = records[i];
            for (var j = 0; j < gUtil.getDistinctFilters().length; j++) {
                var key = gUtil.getDistinctFilters()[j];
                map[key].push(rec.get(key));
            }
        }

        var reqKey = 0;

        if (store.getProxy().getReader().rawData != undefined) {
            reqKey = store.getProxy().getReader().rawData.reqKey;
        }

        //console_logs('reqKey', reqKey);
        gm.me().reqKey = reqKey;


        if (gm.me().useGotoToolbar == true) {

            var count = store.getProxy().getReader().rawData.count;

            gm.me().setMaxNo(count);

            //console_logs('count', count);

            gm.me().refreshMaxNo();
        }

        //중복제거
        for (var i = 0; i < gUtil.getDistinctFilters().length; i++) {
            var key = gUtil.getDistinctFilters()[i];
            map[key] = gUtil.setUniqueArray(map[key]);
        }

        for (var j = 0; j < gUtil.getDistinctFilters().length; j++) {
            var key = gUtil.getDistinctFilters()[j];
            //console_logs('key', key);

            var datas = [];
            var arr = map[key];
            //console_logs('arr', arr);

            for (var i = 0; i < arr.length; i++) {
                var a = [];
                var val = arr[i];
                a.push(val);
                a.push(val);
                datas.push(a);

            }
            //console_logs('datas', datas);

            var simData = {};
            simData[key] = {
                data: datas,
                stype: 'json'
            };

            //console_logs('simData', simData);
            try {
                this.simManager.register(simData);
            } catch (e) {
                //console_logs('Error', e);
            }
        }

        this.storeLoadCallbackSub(records);

    },
    storeLoad: function (fc) {
        var start_time = new Date();
        console.log('===>>>>>>>>>>>>>>>>>>>>>>>>  START TIME', start_time);

        var store = this.getStore();
        store.load({
            callback: function (records, operation, success) {

                if (gm.me().link == 'SRO5_SUB' || gm.me().link == 'SRO5_SUB1' || gm.me().link == 'SRO5_SUB2') {
                    if (vCompanyReserved4 == 'DOOS01KR' || vCompanyReserved4 == 'SKNH01KR' || vSYSTEM_TYPE == 'HANARO') {
                        gm.me().storeLoadCallbackSub(records);
                    }
                }

                if (gm.me().createAction != undefined) {
                    Ext.getBody().unmask();
                    gm.me().createAction.enable();
                }

                switch (vCompanyReserved4) {
                    case 'KYNL01KR':
                        switch (gm.me().link) {
                            case 'SRO5_KM':
                            case 'SRO5_KM2':
                            case 'SRO5_KM3':
                            case 'SRO5_KM4':
                            case 'SRO5_SUB':
                            case 'SRO5_SUB1':
                            case 'SRO5_SUB2':
                            case 'SRO5_SUB3':
                            case 'EPC5_T':
                            case 'EPJ1':
                            case 'SPS1_MES':
                            case 'SPS2_MES':
                            case 'QTT4_MES':
                            case 'QTT4_HIS':
                                gm.me().redrawQuanMass(records);
                                break;
                            default:
                                break;
                        }
                        break;
                    case 'HSGC01KR':
                        switch (gm.me().link) {
                            case 'SRO5_SUB':
                            case 'SRO5_SUB1':
                                gm.me().redrawQuanMass(records);
                                break;
                            default:
                                break;
                        }
                        break;
                    case 'MKEE01KR':
                        switch (gm.me().link) {
                            case 'SRO2':
                                gm.me().settingValueSample(records);
                                break;
                        }
                        break;
                    default:
                        break;
                }

                var sum1 = store.proxy.reader.sum1;
                var sum2 = store.proxy.reader.sum2;
                var sum3 = store.proxy.reader.sum3;
                var sum4 = store.proxy.reader.sum4;
                var sum5 = store.proxy.reader.sum5;

                try {
                    gm.me().storeLoadCallback(records, this,
                        sum1, sum2, sum3, sum4, sum5
                    );

                } catch (e) {
                    console_logs('gm.me().storeLoadCallback e', e);
                }

                if (fc != null) {
                    fc(records);
                }

                var end_time = new Date();
                console.log('===>>>>>>>>>>>>>>>>>>>>>>>>  END TIME', end_time);
                var elapsedTime = end_time - start_time;
                console.log('===>>>>>>>>>>>>>>>>>>>>>>>>  elapsedTime(ms)', elapsedTime);
            }
        });
    },

    settingValueSample: function (records) {
        console_logs('>>>settingValueSample', records);
        if (records == null || records.length < 1) {
            return;
        }
        for (var i = 0; i < records.length; i++) {
            var rec = records[i];
            var h_reserved11 = rec.get('h_reserved11');
            var h_reserved12 = rec.get('h_reserved12');
            var type = rec.get('sg_code');
            switch (type) {
                case 'L':
                    type = 'LL';
                    break;
                case 'R':
                    type = 'RR';
                    break;
                case 'T':
                    type = 'TT';
                    break;
            }
            rec.set('h_reserved104', h_reserved11);
            rec.set('h_reserved33', h_reserved12);
            rec.set('h_reserved28', type);
        }
    },

    redrawQuanMass: function (records) {
        if (records != null && records.length > 0) {

            var sumbomqty = 0;
            var sumbommass = 0;
            var sumpoqty = 0;
            var sumpomass = 0;
            var totalprice = 0;


            for (var i = 0; i < records.length; i++) {
                sumbomqty += records[i].get('bm_quan');
                sumbommass += records[i].get('reserved_double1');
                sumpoqty += records[i].get('quan');
                sumpomass += records[i].get('mass');
                if (records[i].get('h_reserved85') != undefined && records[i].get('h_reserved85') != null) {
                    totalprice += records[i].get('h_reserved85').replace(/\,/g, '') * 1;
                }
            }

            totalprice = Ext.util.Format.number(totalprice, '0,00/i');

            console_logs('sumbomqty', sumbomqty);
            console_logs('sumbommass', sumbommass);
            console_logs('sumpoqty', sumpoqty);
            console_logs('sumpomass', sumpomass);

            switch (vCompanyReserved4) {
                case 'HSGC01KR':
                    Ext.get(gu.id('targetSumbom1' + (gm.me().multi_grid_id != null ? gm.me().multi_grid_id : ''))).update('P/O 총 수량 : ' + sumbomqty + ' ');
                    Ext.get(gu.id('targetSumbom2' + (gm.me().multi_grid_id != null ? gm.me().multi_grid_id : ''))).update('P/O 총 금액 : ' + totalprice + '원');
                    break;
                default:
                    Ext.get(gu.id('targetSumbom1' + (gm.me().multi_grid_id != null ? gm.me().multi_grid_id : ''))).update('BOM총수량 : ' + sumbomqty);
                    Ext.get(gu.id('targetSumbom2' + (gm.me().multi_grid_id != null ? gm.me().multi_grid_id : ''))).update('BOM총중량 : ' + sumbommass.toFixed(2));
                    Ext.get(gu.id('targetSumPo1' + (gm.me().multi_grid_id != null ? gm.me().multi_grid_id : ''))).update('PO총수량 : ' + sumpoqty);
                    Ext.get(gu.id('targetSumPo2' + (gm.me().multi_grid_id != null ? gm.me().multi_grid_id : ''))).update('PO총중량 : ' + sumpomass.toFixed(2));
                    break;
            }
        } else {
            switch (vCompanyReserved4) {
                case 'HSGC01KR':
                    Ext.get(gu.id('targetSumbom1' + (gm.me().multi_grid_id != null ? gm.me().multi_grid_id : ''))).update('P/O 총 수량 : 0 ');
                    Ext.get(gu.id('targetSumbom2' + (gm.me().multi_grid_id != null ? gm.me().multi_grid_id : ''))).update('P/O 총 금액 : 0원');
                    break;
                default:
                    Ext.get(gu.id('targetSumbom1' + (gm.me().multi_grid_id != null ? gm.me().multi_grid_id : ''))).update('BOM총수량 : 0');
                    Ext.get(gu.id('targetSumbom2' + (gm.me().multi_grid_id != null ? gm.me().multi_grid_id : ''))).update('BOM총중량 : 0');
                    Ext.get(gu.id('targetSumPo1' + (gm.me().multi_grid_id != null ? gm.me().multi_grid_id : ''))).update('PO총수량 : 0');
                    Ext.get(gu.id('targetSumPo2' + (gm.me().multi_grid_id != null ? gm.me().multi_grid_id : ''))).update('PO총중량 : 0');
                    break;
            }
        }
    },

    redrawStore: function (reset) {

        if (reset) {
            gm.me().getStore().getProxy().setExtraParam('start', 0);
            gm.me().getStore().getProxy().setExtraParam('page', 1);

            gm.me().getStore().getProxy().setExtraParam('limit', /*gMain.pageSize*/this.getPageSize());
            gm.me().getStore().currentPage = 1;
        }

        this.setMultisortCond();
        var multisort = gu.getCmp('sortCond-multisort');
        var sortCond = multisort == null ? '' : multisort.getValue();

        gm.me().getStore().getProxy().setExtraParam('sortCond', sortCond);

        try {
            var store = gm.me().getStore();
            // Remove default sorting
            store.sorters.clear();

            try {

                if (sortCond != null && sortCond != '') {

                    var sorters = [];
                    var arr = sortCond.split(':');
                    for (var i = 0; i < arr.length; i++) {

                        var cond = arr[i];
                        var arr1 = cond.split(' ');
                        sorters.push({
                            property: arr1[0],
                            direction: arr1[1]
                        })

                    }

                    store.setSorters(sorters);

                }
            } catch (e) {

            }

            for (var i = 0; i < this.searchField.length; i++) {
                var type = 'text';
                var key = this.searchField[i];
                //console_logs('==>key', key);
                if (typeof key == 'string') {

                } else if (typeof key == 'object') {
                    var myO = key;
                    //console_logs('keytype', typeof key);
                    key = myO['field_id'];
                    //console_logs('keytype2', key);
                    type = myO['type'];
                }

                var srchId = this.link + '-' + gMain.getSearchField(key);
                //console_logs('srchId22', srchId);
                if (type == 'date' && vCompanyReserved4 == 'DAEH01KR') {
                    srchId = srchId + '-s';
                }
                var value = null;
                var value1 = null;
                try {
                    var o = this.getSearchWidget(srchId);
                    if (o == null) {
                        //console_logs('redrawStore', srchId + ' 을 찾을 수 없음.');
                    } else {
                        value = o.getValue(); //Ext.getCmp(srchId).getValue();
                    }
                    //console_logs('value', value);
                    var o1 = this.getSearchWidget(srchId + '_')
                    //console_logs('o1', o1);
                    if (o1 == null) {
                        //console_logs('redrawStore', srchId + '_' + ' 을 찾을 수 없음.');
                    } else {
                        value1 = o1.getValue();
                    }
                } catch (e) {
                }

                if (value1 != null && value1 != '') {//콤보박스 히든밸류
                    this.getStore().getProxy().setExtraParam(key, value1);
                } else {
                    if (key != null && key != '' && value != null && value.length > 0) {
                        if (type == 'area' || key == 'unique_id' || key == 'barcode' || typeof key == 'object') {
                            this.getStore().getProxy().setExtraParam(key, value);
                        } else {
                            var enValue = Ext.JSON.encode('%' + value + '%');
                            this.getStore().getProxy().setExtraParam(key, enValue);
                        }//endofelse

                    } else {//endofif
                        this.getStore().getProxy().setExtraParam(key, null);
                    }

                }
            }
            if (vCompanyReserved4 == 'DABP01KR' && gm.me().link == 'SDL2') {
                this.deliveryLoad();
            } else if (vCompanyReserved4 == 'BIOT01KR' && gm.me().link == 'SRO5_DS1') {
                this.storeLoad();
                this.prdDetailLoad();
            } else {
                this.storeLoad();
            }
        } catch (e) {
            Ext.MessageBox.show({
                title: '연결 종료',
                msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.<br>그래도 해결되지 않으면 관리자에게 문의하세요.<hr>' + e,
                buttons: Ext.MessageBox.OK,
                //animateTarget: btn,
                scope: this,
                icon: Ext.MessageBox['ERROR']
            });
        }

    },
    addCallback: function (key, fc) {
        this.inputFcmap[key] = fc;
    },
    handlInputFc: function (handleKey, o, o1, o2, o3) {
        try {
            console_logs('>>>>handleKey', handleKey);
            this.inputFcmap[handleKey](o, o1, o2, o3);
        } catch (noError) {
        }

    },
    addKeyCallback: function (key, fc) {
        this.inputKeyFcmap[key] = fc;
    },
    handleKeyInputFc: function (handleKey, o, o1, o2, o3) {
        try {
            console_logs('>>>>handleKey', handleKey);
            this.inputKeyFcmap[handleKey](o, o1, o2, o3);
        } catch (noError) {
        }
    },
    //필드이름으로 검색
    getInputJust: function (key) {

        var items = this.getFieldList();

        console_logs('getInputTarget itens', items);

        for (var i = 0; i < items.length; i++) {
            var o = items[i];
            var compName = o['name'];
            if (compName == key) {
                return o;
            }
        }
        return null;

    },
    getInputTarget: function (key, subKey) {
        var keyLen = (subKey == null || subKey == undefined) ? 2 : 3;

        var items = this.getFieldList();

        for (var i = 0; i < items.length; i++) {
            var name = items[i]['name'];
            name = name.split('|')[1];
            // if(name == key) {
            //     console_logs('>>>name | key', name + ' : ' + key + ' //' + i);
            // }
        }

        for (var i = 0; i < items.length; i++) {
            var o = items[i];
            var id = o['id'];
            var compName = o['name'];
            var xtype = o['xtype'];
            var arr = compName.split('|');
            var curLen = arr.length;
            if (curLen < 2) {
                return null;
            } else {
                var name = arr[1];
                if (keyLen == curLen) {
                    if (keyLen == 2) {
                        if (name == key) {
                            return o;
                        }
                    } else { //keyLen == 3
                        var order = arr[2];
                        if (name == key && order == subKey) {
                            return o;
                        }
                    }
                }

            }
        }
        return null;

    },
    tabchangeHandler: null,
    printExcelHandler: function () {

        var store = gm.me().getStore();
        var selections = gm.me().grid.getSelectionModel().getSelection();
        var unique_ids = [];
        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('unique_id');
            console_logs('=====>uid', uid);
            unique_ids.push(uid);
            console_logs('=====>unique_ids', unique_ids);
        }
        //console_logs('===store===', store);

        store.getProxy().setExtraParam("srch_type", 'excelPrint');
        store.getProxy().setExtraParam("srch_fields", 'major');
        store.getProxy().setExtraParam("srch_rows", 'all');
        store.getProxy().setExtraParam("menuCode", gm.me().link);
        store.getProxy().setExtraParam("unique_ids", unique_ids);

        switch (vCompanyReserved4) {
            case 'HAEW01KR':
                var count = Number(store.getProxy().getReader().rawData.count);
                gm.me().excelPrintFc();
                break;
            default:
                try {
                    var count = Number(store.getProxy().getReader().rawData.count);
//			if(count > 255) {
//			    Ext.MessageBox.alert('Info', 'Record quantity is Limited to 255.', callBack);
//			    function callBack(id) {
//			    	gm.me().excelPrintFc ();
//				}
//			} else {
                    gm.me().excelPrintFc();
//			}
                } catch (e) {
                }
                break;
        }

    },
    excelPrintFc: function () {

        var arrField = this.gSearchField;
        var store = this.grid.getStore();

        try {
            Ext.each(arrField, function (fieldObj, index) {

                console_log(typeof fieldObj);

                var dataIndex = '';

                if (typeof fieldObj == 'string') { //text search
                    dataIndex = fieldObj;
                } else {
                    dataIndex = fieldObj['field_id'];
                }

                var srchId = gMain.getSearchField(dataIndex);
                ; //'srch' + dataIndex.substring(0,1).toUpperCase()+ dataIndex.substring(1);
                var value = Ext.getCmp(srchId).getValue();

                if (value != null && value != '') {
                    if (dataIndex == 'unique_id' || typeof fieldObj == 'object') {
                        store.getProxy().setExtraParam(dataIndex, value);
                    } else {
                        var enValue = Ext.JSON.encode('%' + value + '%');
                        console_info(enValue);
                        store.getProxy().setExtraParam(dataIndex, enValue);
                    }//endofelse
                }//endofif

            });
        } catch (noError) {
        }


        store.load({
            scope: this,
            callback: function (records, operation, success) {
                //console_logs("store.load>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",records);
                var excelPath = store.getProxy().getReader().rawData.excelPath;
                if (excelPath != null && excelPath.length > 0) {
                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                    top.location.href = url;
                } else {
                    alert('다운로드 경로를 찾을 수 없습니다.');
                }
            }
        });
    },
    editRedord: function (field, rec) {
        gm.editRedord(field, rec);
    },

    togToast: true,

    showToast: function (title, html) {
        if (this.togToast == true) {
            Ext.toast({

                title: title,
                html: html,
                closable: true,
                align: 't',
                slideInDuration: 400,
                minWidth: 400
            });
        }
    },


    fileNolink: true,

    checkCheckbox: function (records, checked) {
        //console_logs('records', records);
        //console_logs('checked', checked);
        records.forEach(function (rec, index) {

            if (checked == true) {
                gm.me().grid.getSelectionModel().select(rec, true);
            } else {
                gm.me().grid.getSelectionModel().deselect(rec, true);
            }

        });
    },
    //다중선택인지. 단일선택인지
    selMode: 'multi',
    //선택만한것인지.
    selCheckOnly: false,
    //deselect도 가능한지.
    selAllowDeselect: true,

    getRecordLine: function (rec) {

        var line = '';
        for (var i = 0; i < this.fields.length; i++) {
            var o = this.fields[i];
            var dataIndex = o['name'];

            var value = rec.get(dataIndex);
            if (value != undefined) {
                if (line == '') {
                    line = '"' + value + '"';
                } else {
                    line = line + '\t' + '"' + value + '"';
                }
            }

        }
        return line;
    },
    //값복사
    popupClip: function (dataIndex, subject, width, height) {
        var title = subject == null ? '전체' : subject;
        var g = this.getGrid();
        var selections = g.getSelectionModel().getSelection();
        var txt = '<값 없음>';
        var num = 0;
        if (selections != null && selections.length > 0) {
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                var v = dataIndex == null ? this.getRecordLine(rec) : rec.get(dataIndex);
                if (v != null && v != '') {
                    if (txt == '<값 없음>') {
                        txt = v;
                    } else {
                        txt = txt + '\r\n' + v;
                    }
                    num++;
                }

            }

            title = title + ' (' + num + '개)';


            Ext.create('Ext.window.MessageBox', {
                resizable: true
            }).show({
                title: '선택한 값 목록',
                modal: true,
                msg: title,
                width: width,
                resizable: true,
                height: height,
                buttons: Ext.MessageBox.OK,
                multiline: true,
                defaultTextHeight: 390,
                maxWidth: 1000,
                scope: this,
                value: txt,
                initComponent: function () {
                },
                fn: function (btn, text, c) {

                    if (btn == 'yes' && text != '<값 없음>') {

                    }
                }//,
                //animateTarget: btn
            });
        } else {
            Ext.Msg.alert('안내', '먼저 값복사 할 레코드를 선택하세요.');
            return;
        }


    },
    //editAjax count
    recCount: 0,

    itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
        //console_logs('itemdblclick record', record);
        gm.me().dblclickedRecord = record;
    },
    jumpToRow: function () {
        var grid = this.getGrid();
        var fld = grid.down('#gotoLine');
        var pos = fld.getValue() - 1;

        grid.view.bufferedRenderer.scrollTo(pos, true);
    },

    //Page toolbar 사용
    usePagingToolbar: true,
    //goto page
    useGotoToolbar: false,
    maxNo: 0,
    //FullPage Buffering
    bufferingStore: false,

    setMaxNo: function (no) {
        this.maxNo = no;//(no > this.maxNo) ? no : this.maxNo;
    },
    reqKey: '',

    refreshMaxNo: function () {

        var grid = this.getGrid();
        var fld = grid.down('#maxNo');
        var value = '레코드 갯수: ' + this.maxNo;

        fld.setText(value);
    },

    getColName: function (key) {
        return gm.getColNameByField(this.fields, key);
    },

    getTextName: function (key) {
        return gm.getColNameByField(this.fields, key);
    },
    multiGrid: false,
    multiSortHidden: false,
    gridSumArr: [],
    loadedGridSumArr: false,
    loadStoreAlways: false,
    callbackLoadCenterPanel: function (cebterPanel, panel, menuCode) {

        if (this.loadStoreAlways) {
            if (panel != null) {
                try {
                    panel.storeLoad();
                } catch (e) {
                    console.logs('panel.storeLoad() error', e)
                }
            }
        }

    },
    replaceComma: function (fields, value) {

        try {
            for (var i = 0; i < fields.items.length; i++) {
                var item = fields.items[i];
                switch (item.xtype) {
                    case 'numberfield':
                        value[item.name] = value[item.name].replace(/,/g, "");
                        break;
                    default:
                        break;
                }
            }
        } catch (e) {
            console.logs('error', e)
        }

        return value;
    },

    checkCompany: function () {
        if (vCompanyReserved4 == 'MKEE01KR') {
            if (this.link != null && this.link == 'SRO3_CLD') {
                gm.me().getInputTarget('item_code').setValue(null);
            }
        } else {
            return null;
        }
    },

    tabNextFieldWithSet: function (e, cols) {

        var curFieldSetNum = null;
        var tabFieldSet = null;
        var newTabFieldSet = [];

        if (cols === 1) {
            tabFieldSet = e.ownerCt.ownerCt.items.items;
            curFieldSetNum = e.ownerCt.name;
        } else {
            tabFieldSet = e.ownerCt.ownerCt.ownerCt.ownerCt.items.items;
            curFieldSetNum = e.ownerCt.ownerCt.ownerCt.name;
        }

        for (var k = 0; k < tabFieldSet.length; k++) {
            if (tabFieldSet[k].xtype === 'fieldset') {
                newTabFieldSet.push(tabFieldSet[k]);
            }
        }

        for (var k = 0; k < newTabFieldSet.length; k++) {

            var arrFieldSet = newTabFieldSet[k];
            if (curFieldSetNum === arrFieldSet.name) {

                var nextFieldSetNum = null;

                if (k === newTabFieldSet.length - 1) {
                    nextFieldSetNum = newTabFieldSet[0].items.items;
                } else {
                    nextFieldSetNum = newTabFieldSet[k + 1].items.items;
                }

                var firstItem = nextFieldSetNum[0];
                if (firstItem.xtype === 'container') {

                    var innerFirstItem = firstItem.items.items[0];

                    if (innerFirstItem.xtype === 'container') {
                        innerFirstItem = innerFirstItem.items.items[0];
                    }

                    innerFirstItem.focus();
                } else {
                    firstItem.focus();
                }
            }
        }
    },

    tabNextFieldWithNoSet: function (e, cols) {

        var curFieldSetNum = null;
        var tabFieldSet = null;
        var newTabFieldSet = [];

        if (cols === 1) {
            tabFieldSet = e.ownerCt.ownerCt.items.items;
            curFieldSetNum = e.ownerCt.id;
        } else {
            tabFieldSet = e.ownerCt.ownerCt.ownerCt.items.items;
            curFieldSetNum = e.ownerCt.ownerCt.id;
        }

        for (var k = 0; k < tabFieldSet.length; k++) {
            if (tabFieldSet[k].xtype !== 'hiddenfield' && !tabFieldSet[k].id.includes("formItemHidden")) {
                newTabFieldSet.push(tabFieldSet[k]);
            }
        }

        for (var k = 0; k < newTabFieldSet.length; k++) {

            var arrFieldSet = newTabFieldSet[k];

            if (curFieldSetNum === arrFieldSet.id) {

                var nextFieldSetNum = null;

                if (k === newTabFieldSet.length - 1) {
                    nextFieldSetNum = newTabFieldSet[0].items.items;
                } else {
                    nextFieldSetNum = newTabFieldSet[k + 1].items.items;
                }

                var firstItem = nextFieldSetNum[0];
                if (firstItem.xtype === 'container') {
                    var innerFirstItem = firstItem.items.items[0];

                    if (innerFirstItem.xtype === 'container') {
                        innerFirstItem = innerFirstItem.items.items[0];
                    }
                    innerFirstItem.focus();
                } else {
                    firstItem.focus();
                }
            }
        }
    },
    isUsePreservedScrollOnReload: function () {
        switch (this.link) {
            case 'SDL3':
            case 'AMC12':
                return true;
            default:
                return false;
        }
    },

    setMkeRecvPoAdditionalInfo: function () {
        var select = this.grid.getSelectionModel().getSelection()[0];
        var nation = select.get('egci_code');
        var SO_TYPE = select.get('class_code');
        var PRD_TYPE = select.get('prd_code');
        Ext.getCmp('nation').setValue(nation);
        Ext.getCmp('SO_TYPE').setValue(SO_TYPE);
        Ext.getCmp('PRD_TYPE').setValue(PRD_TYPE);
    },

    sortGrid: null,
    gridContextMenu: function (grid) {
        gm.me().sortGrid = grid;
        var menu = Ext.create('Ext.menu.Menu', {
            items: [
                this.listSortAction
            ]
        });

        return menu;
    },

    listSortAction: Ext.create('Ext.Action', {
        xtype: 'button',
        text: '정렬설정',
        iconCls: 'fa-typcn-th-list-outline_14_0_5395c4_none',
        handler: function (grid) {
            var sortWin = Ext.create('ModalWindow', {
                title: vCUR_MENU_CODE + '::' + /*(G)*/' 정렬기준',
                width: 800,
                height: 500,
                minWidth: 250,
                minHeight: 180,
                // autoScroll: true,
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                xtype: 'container',
                plain: true,
                items: [
                    {
                        xtype: 'panel',
                        id: 'leftGrid',
                        // autoScroll: true,
                        autoWidth: true,
                        flex: 1,
                        // padding: '5',
                        items: gm.me().sortLeftForm(grid)
                    }, {
                        xtype: 'container',
                        verticalAlign: 'center',
                        layout: {
                            type: 'vbox',
                            pack: 'center',
                            align: 'stretch'
                        },
                        items: [
                            gm.me().addArrowAction(),
                            gm.me().removeArrowAction()
                        ]
                    }, {
                        xtype: 'panel',
                        id: 'rightGrid',
                        // autoScroll: true,
                        autoWidth: true,
                        flex: 2,
                        // padding: '5',
                        items: gm.me().sortRightForm()
                    }
                ],
                buttons: [{
                    text: CMD_OK,
                    handler: function () {
                        if (sortWin) {
                            sortWin.close();
                        }
                    }
                }, {
                    text: CMD_CANCELCANCEL,
                    handler: function (btn) {
                        sortWin.close();
                    }
                }]
            });
            sortWin.show();
        }
    }),

    leftSortStore: null,
    rightSortStore: Ext.create('Ext.data.Store', {
        fields: ['no', 'fields', 'dataIndex', 'sortGubun']
    }),

    sortLeftForm: function (grid) {
        var LEFT_FORM_COLUMN = [
            {
                header: '컬럼명',
                dataIndex: 'fields',
                width: '80%',
                align: 'left',
                resizable: true,
                sortable: true,
                style: 'text-align:center;'
            }
        ];

        gm.me().leftSortStore = Ext.create('Ext.data.Store', {
            fields: ['fields', 'dataIndex']
        });

        var columns = gm.me().sortGrid.columns;
        console_logs('>>>>>????', columns);
        for (var i = 0; i < columns.length; i++) {
            var col = columns[i];
            var new_col = {fields: col.text, dataIndex: col.dataIndex};

            gm.me().leftSortStore.add(new_col);
        }

        var leftGrid = Ext.create('Ext.grid.Panel', {
            id: vCUR_MENU_CODE + gu.id('left_form'),
            store: gm.me().leftSortStore,
            multiSelect: true,
            stateId: vCUR_MENU_CODE + gu.id('left_form'),
            selModel: Ext.create("Ext.selection.CheckboxModel", {mode: 'multi'}),
            // autoScroll : true,
            autoHeight: true,
            filterable: true,
            height: 500,  // (getCenterPanelHeight()/5) * 4
            region: 'center',
            columns: /*(G)*/LEFT_FORM_COLUMN,
            // plugins:[cellEditing],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
            },
            // dockedItems: [
            //     {
            //         dock : 'top',
            //         xtype : 'toolbar',
            //         items : [
            //             this.addPRDAction, this.removePRDAction
            //         ]
            //     }
            // ]
        });

        return leftGrid;
    },

    sortRightForm: function (grid) {
        var RIGHT_FORM_COLUMN = [
            {
                header: '순서',
                dataIndex: 'no',
                width: '15%',
                align: 'center',
                resizable: true,
                sortable: true,
                style: 'text-align:center;'
            },
            {
                header: '컬럼명',
                dataIndex: 'fields',
                width: '50%',
                align: 'left',
                resizable: true,
                sortable: true,
                style: 'text-align:center;'
            },
            {
                header: '정렬방식',
                dataIndex: 'sortGubun',
                width: '15%',
                align: 'center',
                resizable: true,
                sortable: true,
                style: 'text-align:center;',
                renderer: function (value, meta) {
                    meta.css = 'custom-column';
                    switch (value) {
                        case 'asc':
                            return '오름차순';
                        case 'desc':
                            return '내림차순';
                        default:
                            return value;
                    }
                }
            }
        ];

        var rightGrid = Ext.create('Ext.grid.Panel', {
            id: vCUR_MENU_CODE + gu.id('right_form'),
            store: gm.me().rightSortStore,
            multiSelect: true,
            stateId: vCUR_MENU_CODE + gu.id('right_form'),
            selModel: Ext.create("Ext.selection.CheckboxModel", {mode: 'multi'}),
            autoHeight: true,
            filterable: true,
            height: 650,  // (getCenterPanelHeight()/5) * 4
            region: 'center',
            plugins: Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            }),
            columns: /*(G)*/RIGHT_FORM_COLUMN,
            // plugins:[cellEditing],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
            },
            listeners: {
                cellClick: function (ctx, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    var row = rightGrid.getSelectionModel().getSelection()[0];
                    var dataIndex = RIGHT_FORM_COLUMN[cellIndex - 1].dataIndex;
                    var cell = row.data[dataIndex];
                    switch (cell) {
                        case 'asc':
                            row.set(dataIndex, 'desc');
                            break;
                        case 'desc':
                            row.set(dataIndex, 'asc');
                            break;
                    }
                    row.commit();
                }
            }
        });

        return rightGrid;
    },

    addArrowAction: function () {
        var arrow = {
            xtype: 'image',
            src: 'http://hosu.io/web_content75/images/default/button/soft_arrow_add.png',
            width: 50,
            height: 50,
            listeners: {
                el: {
                    click: function () {
                        var selects = Ext.getCmp(vCUR_MENU_CODE + gu.id('left_form')).getView().getSelectionModel().getSelection();

                        gm.me().leftSortStore.remove(selects);
                        var deault_len = gm.me().rightSortStore.data.items.length;
                        deault_len = deault_len * 10;
                        for (var i = 0; i < selects.length; i++) {
                            var select = selects[i];
                            deault_len = deault_len + 10;
                            var new_col = {
                                no: deault_len,
                                fields: select.get('fields'),
                                dataIndex: select.get('dataIndex'),
                                sortGubun: 'asc'
                            };
                            gm.me().rightSortStore.insert(deault_len, new_col);
                        }
                    }
                }
            }
        };
        return arrow;
    },

    removeArrowAction: function () {
        return {
            xtype: 'image',
            src: 'http://hosu.io/web_content75/images/default/button/soft_arrow_remove.png',
            width: 50,
            height: 50,
            listeners: {
                el: {
                    click: function () {
                        var selects = Ext.getCmp(vCUR_MENU_CODE + gu.id('right_form')).getView().getSelectionModel().getSelection();

                        gm.me().rightSortStore.remove(selects);
                        var deault_len = gm.me().leftSortStore.data.items.length;
                        for (var i = 0; i < selects.length; i++) {
                            var select = selects[i];
                            deault_len++;
                            var new_col = {fields: select.get('fields'), dataIndex: select.get('dataIndex')};
                            gm.me().leftSortStore.insert(deault_len, new_col);
                        }

                    }
                }
            }
        };
    },

    getAssyStatus: function (value, meta, route_type) {
        if (value == null || value.length < 1) {
            return '수주등록';
        }

        switch (value) {
            case 'GY':
                meta.css = 'custom-column-working-complete';
                return '불출완료';
            case 'GC':
                meta.css = 'custom-column-working-stop';
                return '불출취소';
            case 'BM':
                return '수주등록';
            case 'CR':
                switch (route_type) {
                    case 'G':
                        meta.css = 'custom-column-purchase-wait';
                        return '불출대기';
                    case 'P':
                        meta.css = 'custom-column-purchase-wait';
                        return '구매요청';
                }
                return '수주확정';
            case 'PR':
                meta.css = 'custom-column-purchase-wait';
                return '구매요청';
            case 'PO':
                meta.css = 'custom-column-purchase-wait';
                return '입고대기';
            case 'GR':
                meta.css = 'custom-column-working-indication';
                return '입고확인';
            case 'BR':
                meta.css = 'custom-column-working';
                return 'BOM확정';
            case 'DL':
                meta.css = 'custom-column-delivery';
                return '출고완료';
            case 'P':
                meta.css = 'custom-column-working-indication';
                return '계획수립';
            case 'N':
                meta.css = 'custom-column-working-wait';
                return '생산대기';
            case 'W':
                meta.css = 'custom-column-working-start';
                return '생산중';
            case 'S':
                meta.css = 'custom-column-working-stop';
                return '작업중지';
            case 'A':
                switch (route_type) {
                    case 'DL':
                        meta.css = 'custom-column-delivery-finish';
                        return '배송완료';
                    default:
                        meta.css = 'custom-column-working-pause';
                        return '접수완료';
                }
            case 'I':
                switch (route_type) {
                    case 'DL':
                        meta.css = 'custom-column-delivery';
                        return '배송중';
                    default:
                        meta.css = 'custom-column-working-pause';
                        return '작업정지';
                }
            case 'Y':
                meta.css = 'custom-column-working-complete';
                return '생산완료';
            case 'G':
                switch (route_type) {
                    case 'G':
                        meta.css = 'custom-column-working-complete';
                        return '불출완료';
                    case 'P':
                        meta.css = 'custom-column-working-complete';
                        return '입고완료';
                }
            default:
                return value;
        }
    },

    getMC: function (variableCode, falseMsg) {

        gMain.getMC(variableCode, falseMsg);
    },

    getFieldName: function (code) {
        var output = code;

        for (var i = 0; i < this.columns.length; i++) {
            var o = this.columns[i];

            var dataIndex = o['dataIndex'];
            if (dataIndex == code) {
                console_logs('-----> o', o);
                output = o['text'];
            }
        }
        return output;
    },

    comboSetter: function (comboBox, value) {
        var record = comboBox.findRecordByValue(value);
        if (record != null) {
            comboBox.select(record);
        }
    },

    useValueCopyCombo: true, //값복사 사용
    useDivisionCombo: true,  //사업부 콤보 시용
    selectedSortComboCount: 3, //정렬 콤보 갯수

    selectedSortCombo: 0, //사용자가 선택한 정렬 콤보

    selectSortcond: function (dataIndex, text) {
        var combo = gu.getCmp('multisort' + (this.selectedSortCombo + 1) + 'combo');
        var v = combo.getValue();
        console_logs('v', v);
        if (v == null) {
            combo.getStore().load();
        }
        this.comboSetter(combo, dataIndex);
    },

    alwaysShowRowNumber: function () {
        if (vCompanyReserved4 === 'DJEP01KR') {
            switch(this.link) {
                case 'AMI1':
                case 'AMY2':
                    return false;
                default:
                    return true;
            }
        } else {
            return false;
        }
    }
});