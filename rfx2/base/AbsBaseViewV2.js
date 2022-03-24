Ext.define('Rfx2.base.AbsBaseViewV2', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Rfx.app.MainViewModel',
        'Rfx.util.SinglePost',
           
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
    tab_info: [],
    selected_tab: undefined,
    selected_record: null,
    store_map: {},
    columns_map: {},
    column_group_map: {},
    subTabGridEach: false,
    dept_code: null,
    getStore: function () {
        return this.selected_tab === undefined ? this.store : this.store_map[this.selected_tab];
    },
    getGrid: function () {
        return this.selected_tab === undefined ? this.grid : this.getTabGrid(this.selected_tab);
    },
    setMultisortCond: function () {

        if (this.selectedSortComboCount !== 0) {
            let sortCond = '';
            for (let i = 0; i < this.selectedSortComboCount; i++) {

                let mulCombo = gu.getCmp('multisort' + (i + 1) + 'combo');

                if (mulCombo === undefined || mulCombo == null) {
                    return;
                }

                let v = mulCombo.getValue();

                if (gm.me().orderbyAutoTable) {

                    let n = gm.me().getRplaceCond(v);
                    v = (n == null) ? v : n;
                }

                if (v != null && v !== '') {
                    let a = gu.getCmp('multisort' + (i + 1) + 'ascdesc').getValue();
                    if (a == null || a === '') {
                        a = 'asc';
                    }
                    let line = v + ' ' + a;

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
        let npm_server = 'http://106.240.76.30:3000';
        try {
            this.socket = io.connect(npm_server);
            this.socket.emit("joinRoom", {
                user_uid: vCUR_USER_UID,
                user_id: vCUR_USER_ID,
                user_name: vCUR_USER_NAME,
                room_uid: 1,
                room_name: 2
            });
        } catch (error) {
            this.socket = null;
        }
    },
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
        this.vMESSAGE['CREATE'] = t;
    },
    setEditPanelTitle: function (t) {
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

    //Search Toolbar 만들기
    createSearchToolbar: function () {

        let tb = this.makeSrchToolbar(this.link, this.searchField);

        for (let tbValue of tb) {
            if (tbValue.xtype !== 'label') {
                if (tbValue.style !== undefined) {
                    tbValue.style += 'margin-top: 1px; margin-bottom: 1px;';
                } else {
                    tbValue.style = 'margin-top: 1px; margin-bottom: 1px;';
                }
            } else {
                tbValue.style += 'margin-top: 5px;';
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
        let l = this.searchField.length;
        let t1;
        let t2 = null;
        let t3 = null;
        let t4 = null;

        let first = 8;
        let m = 8;
        if (opt !== undefined && opt !== null) {
            first = opt['first'] === undefined ? 8 : opt['first'];
            m = opt['length'] === undefined ? 8 : opt['length'];
        }

        t1 = this.searchField.splice(0, first);
        this.searchToolbar = Ext.create('widget.toolbar', {
            items: this.makeSrchToolbar(this.link, t1),
            cls: 'my-x-toolbar-default1'
        });

        if (l > m) {
            t2 = this.searchField.splice(0, m);

            this.searchToolbar1 = Ext.create('widget.toolbar', {
                items: this.makeSrchToolbar(this.link, t2),
                cls: 'my-x-toolbar-default1'
            });
        }

        if (l > m * 2) {

            t3 = this.searchField.splice(0, m);
            this.searchToolbar2 = Ext.create('widget.toolbar', {
                items: this.makeSrchToolbar(this.link, t3),
                cls: 'my-x-toolbar-default1'
            });
        }

        if (l > m * 3) {

            t4 = this.searchField.splice(0, m);
            this.searchToolbar3 = Ext.create('widget.toolbar', {
                items: this.makeSrchToolbar(this.link, t4),
                cls: 'my-x-toolbar-default1'
            });
        }

        if (t1 != null) {
            this.searchField = t1;

            if (t2 != null) {
                this.searchField = t1.concat(t2);

                if (t3 != null) {
                    this.searchField = t1.concat(t2).concat(t3);

                    if (t4 != null) {
                        this.searchField = t1.concat(t2).concat(t3).concat(t4);
                    }
                }
            }
        }

        let arr = [];
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

        return arr;

    },

    refreshActiveCrudPanel: function (source, selectOn, unique_id) {

        if (selectOn) {
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

        } else {//not selected
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
    },

    crudOpened: false,
    toggleExpand: function () {
        this.crudTab.collapsed ? this.crudTab.expand() : this.crudTab.collapse();
    },
    propDisplayProp: true,
    setActiveCrudPanel: function (mode) {
        this.crudMode = mode;
        let crudTab = Ext.getCmp(gMain.geViewCrudId());
        if (crudTab != null) {
            crudTab.setTitle(this.vMESSAGE[this.crudMode]);
            this.createAction.setText(this.vButtonLabel[this.crudMode]);
            if (this.propDisplayProp) {
                switch (this.crudMode) {
                    case "VIEW":
                        crudTab.setSize(this.getCrudviewSize());
                        crudTab.setActiveItem(1);
                        if (gMain.getOpenCrudWindow()) {
                            crudTab.expand();
                        }
                        break;
                    case "CREATE":
                        crudTab.setSize(this.getCrudeditSize());
                        crudTab.setActiveItem(0);
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
                crudTab.setSize(this.getCrudeditSize());
                crudTab.setActiveItem(0);
                crudTab.expand();
            }

        }


    },
    getFieldList: function () {
        let items = [];
        if (this.formItems != null) {
            for (let form of this.formItems) {
                for (let formField of this.vFORM_FIELD_LIST) {
                    let arr = Ext.ComponentQuery.query('[xtype=' + formField + ']', form);
                    if (arr != null && arr.length > 0) {
                        items = items.concat(arr);
                    }
                }
            }
        }

        return items;
    },
    //생성/수정 판넬 채우기
    fillEditForms: function (selections) {

        if (selections != null && selections.length > 0) {
            let rec = selections[0];
            this.selected_records = selections[0];
            this.fillEditForm(rec, this.crudMode);
        } else {
            this.fillEditForm(null, this.crudMode);
        }

        this.toggleSelectedUidForm();
    },
    toggleSelectedUidForm: function () {
        try {
            if (this.crudMode === 'EDIT') {
                this.selectedUidFrom.setVisible(true);
            } else {
                this.selectedUidFrom.setVisible(false);
            }
        } catch (e) {
        }
    },
    fillEditForm: function (rec, crudMode) {

        let items = this.getFieldList();

        if (rec != null && crudMode !== 'CREATE') {
            Ext.each(items, function (o) { //Editable

                let id = o['id'];
                let compName = o['name'];
                let xtype = o['xtype'];
                let arr = compName.split('|');

                if (arr.length > 1) {
                    let name = arr[1];
                    if (arr.length === 3) {
                        name = name + '|' + arr[2];
                    }
                    let val = rec.get(name);

                    if (val != null && typeof val == 'string') {
                        val = gUtil.stripHighlight(val);
                        val = gUtil.stripQuotRecover(val);
                    }

                    switch (xtype) {
                        case 'combo':
                            try {
                                let combo = Ext.getCmp(id);

                                if (combo != null) {
                                    if (combo.multiSelect) {
                                        if (val !== undefined && val !== null) {
                                            combo.setValue(val.split(','));
                                        }
                                    } else {
                                        let record = combo.findRecordByValue(val);

                                        if (record != null) {
                                            combo.select(record);
                                            if (compName === 'project|order_com_unique') {
                                                gm.me().inputBuyer = record;
                                            } else if (compName === 'partline|class_code') {
                                                gm.me().inputClassCode = record;
                                            }
                                        } else {
                                            combo.store.load(function (records) {
                                                if (records != null) {
                                                    for (let obj of records) {
                                                        try {
                                                            if (obj.get(combo.valueField) === val) {
                                                                combo.select(obj);
                                                                if (compName === 'project|order_com_unique') {
                                                                    gm.me().inputBuyer = record;
                                                                }
                                                                if (compName === 'partline|class_code') {
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
                            let dateValue = Ext.getCmp(id);
                            if (dateValue != null) {
                                console_logs('date val', val);
                                //2017-09-13 07:11:49.000
                                if (val != null && val.length > 9) {
                                    let parts = val.substring(0, 10).split('-');
                                    console_logs('parts', parts);
                                    //please put attention to the month (parts[0]), Javascript counts months from 0:
                                    // January - 0, February - 1, etc
                                    let mydate = new Date(parts[0], parts[1] - 1, parts[2]);
                                    a.setValue(mydate);
                                } else {
                                    a.setValue(null);
                                }

                            }
                            break;
                        default:
                            let otherValue = Ext.getCmp(id);
                            if (otherValue != null) {
                                otherValue.setValue(val);
                            }
                    }
                    //}
                    if (name === 'unique_id') {
                        if (gm.me().crudMode === 'EDIT') {
                            Ext.getCmp(id).setVisible(true);
                        } else {
                            Ext.getCmp(id).setVisible(false);
                        }
                    }

                    let target = Ext.getCmp(id);

                    if (gm.me().crudMode === 'EDIT' && target != null) {

                        if (!o['canEdit'] || !target.editable) {
                            target.setFieldStyle('background-color: #FBF8E6; background-image: none;');
                            target.readOnly = true;
                        } else {
                            target.setFieldStyle('background-color: #FFFFFF; background-image: none;');
                            target.readOnly = false;
                        }
                    } else {
                        if (target !== undefined && target !== null) {
                            if (!target.editable) {
                                target.setFieldStyle('background-color: #FBF8E6; background-image: none;');
                                target.readOnly = true;
                            } else {
                                target.setFieldStyle('background-color: #FFFFFF; background-image: none;');
                                target.readOnly = false;
                            }
                        }
                    }
                }
            });
        } else {
            this.doReset();
            Ext.each(items, function (o) { //Editable
                let compName = o['name'];
                let id = o['id'];
                let arr = compName.split('|');
                if (arr.length > 1) {
                    let name = arr[1];
                    if (name === 'unique_id') {
                        Ext.getCmp(id).setVisible(false);
                    }
                }
            });
        }

    },

    deleteConfirm: function (result) {
        if (result === 'yes') {
            let arr = gm.me().selectionedUids;
            if (arr.length > 0) {
                let CLASS_ALIAS = gm.me().deleteClass;
                //console_logs('deleteConfirm CLASS_ALIAS', CLASS_ALIAS);
                //삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
                if (CLASS_ALIAS == null) {
                    CLASS_ALIAS = [];

                    let fieldPos = 0;

                    while (fieldPos <= gm.me().fields.length) {
                        let tableName = o['tableName'] === undefined ? 'map' : o['tableName'];
                        if (tableName !== 'map') {
                            CLASS_ALIAS.push(tableName);
                        }
                    }

                    CLASS_ALIAS = extjsUtil.mergeDuplicateArray(CLASS_ALIAS);
                }
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/index/generalData.do?method=delete',
                    params: {
                        DELETE_CLASS: CLASS_ALIAS,
                        uids: arr,
                        menuCode: gm.me().link
                    },
                    method: 'POST',
                    success: function () {
                        gm.me().redrawStore();
                    },
                    failure: function () {
                        Ext.Msg.alert('안내', '삭제에 실패하였습니다.');
                    }
                });

            }
        }
    },

    resetConfirm: function (result) {
        if (result === 'yes') {
            let selections = gm.me().grid.getSelectionModel().getSelection();
            let record = selections[0];
            let unique_id = record.get('unique_id');
            if (selections) {
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/userMgmt/user.do?method=changeMyPassword',
                    params: {
                        unique_id: unique_id
                    },
                    method: 'POST',
                    success: function () {
                        Ext.Msg.alert('비밀번호 초기화', '비밀번호가 "0000" 으로 초기화되었습니다.');
                        gm.me().redrawStore();
                    },
                    failure: function () {
                        Ext.Msg.alert('안내', '초기화에 실패했습니다.');
                    }
                });
            }
        }
    },

    getCheckVal: function (arrUserType, value) {
        for (let userType in arrUserType) {
            if (value === userType) {
                return true;
            }
        }

        return false;
    },

    userTypeMod: function () {
        console_logs('====>ok', 'ok');

        let selections = gm.me().grid.getSelectionModel().getSelection();
        if (selections.length) {
            let rec = selections[0];
            console_logs('=====>>>>>>', rec);
            let unique_id = rec.get('unique_id');
            let roleItems = [];

            let roleFields = [
                {name: 'role_code', type: "string"}
                , {name: 'role_name', type: "string"}
            ];

            let roleStore = new Ext.create('Ext.data.Store', {
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
            let lineGap = 30;
            let user_type = rec.get('user_type');
            let arrUserType = user_type.split(',');

            roleStore.load(function (records) {
                for (let record in records) {
                    roleItems.push({
                        checked: gm.me().getCheckVal(arrUserType, record.data.role_code),
                        boxLabel: record.data.role_name,
                        name: 'user_type',
                        inputValue: record.data.role_code
                    });
                }

                let form = Ext.create('Ext.form.Panel', {
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
                            y: lineGap,
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

                let win = Ext.create('ModalWindow', {
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
                            let innerForm = Ext.getCmp('userTypePanel').getForm();
                            if (innerForm.isValid()) {
                                let val = innerForm.getValues(false);

                                let userTypeInner = val['user_type'];

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/userMgmt/user.do?method=updateType',
                                    params: {
                                        unique_id: unique_id,
                                        user_type: userTypeInner
                                    },
                                    success: function () {
                                        if (win) {
                                            win.close();
                                        }
                                        gm.me().store.load();
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
        let key = o['key'];
        let text = o['text'];

        for (let item in arr) {
            if (key === item['key']) {
                item['text'] = text;
            }
        }
    },

    removeButton: function (arr, key) {
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            if (key === item['key']) {
                arr.splice(i, 1);
            }
        }
    },
    createCommandToolbarInner: function (option, sub_key, buttons) {

        let names = gUtil.copyObjArr(this.TOOLBAR_MAIN_BUTTON_NAMES);

        if (option !== undefined && option !== null) {
            let remove_arr = option['REMOVE_BUTTONS'];
            let rename_arr = option['RENAME_BUTTONS'];

            if (remove_arr !== undefined && remove_arr !== null) {
                for (let remove in remove_arr) {
                    this.removeButton(names, remove);
                }
            }
            if (rename_arr !== undefined && rename_arr !== null) {
                for (let remane in rename_arr) {
                    this.renameButtonText(names, remane);
                }
            }
        }

        for (let obj in names) {
            let key = obj['key'];
            let text = obj['text'];
            let action = null;
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
                        handler: function () {
                            Ext.MessageBox.show({
                                title: CMD_DELETE,
                                msg: gm.me().getMC('vst1_delete', '선택한 항목을 삭제하시겠습니까?'),
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
                        }
                    });
                    break;
                case 'EXCEL':
                    action = Ext.create('Ext.Action', {
                        iconCls: 'af-excel',
                        text: text,
                        disabled: false,
                        handler: function () {
                            gu.popUpExcelHandler();
                        }
                    });
                    break;
                default:
            }
            if (action != null) {
                buttons[key] = action;
            }
        }

        let searchAction = buttons['SEARCH'];
        let registAction = buttons['REGIST'];
        let editAction = buttons['EDIT'];
        let copyAction = buttons['COPY'];
        let removeAction = buttons['REMOVE'];
        let viewAction = buttons['VIEW'];
        let excelAction = buttons['EXCEL'];

        let buttonItems = [];
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
        buttonItems.push('->');
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
        if (excelAction != null) {
            buttonItems.push(excelAction);
        }

        return Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: buttonItems
        });
    },
    createCommandToolbarInner2: function (option, sub_key, buttons) {

        let names = gUtil.copyObjArr(this.TOOLBAR_MAIN_BUTTON_NAMES);

        if (option !== undefined) {
            let remove_arr = option['REMOVE_BUTTONS'];

            if (remove_arr !== undefined) {
                for (let remove in remove_arr) {
                    this.removeButton(names, remove);
                }
            }
        }

        for (let obj in names) {
            let key = obj['key'];
            let text = obj['text'];
            let action = null;
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
                        handler: function () {
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
                        disabled: true,
                        handler: function () {
                            gm.me().crudTab.setSize(gm.me().getCrudviewSize());
                            gm.me().crudTab.setActiveItem(1);
                        }
                    });
                    break;
                case 'INITIAL':
                    action = Ext.create('Ext.Action', {
                        itemId: 'resetButton',
                        iconCls: 'fa-retweet_14_0_5395c4_none',
                        hidden: gu.setBtnHiddenProp(3),
                        text: text,
                        disabled: true,
                        handler: function () {
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
                        handler: function () {
                            gm.me().userTypeMod();
                        }
                    });
                    break;
                default:
            }
            if (action != null) {
                buttons[key] = action;
            }
        }

        let sortColumns = [];

        let searchAction = buttons['SEARCH'];
        let registAction = buttons['REGIST'];
        let editAction = buttons['EDIT'];
        let copyAction = buttons['COPY'];
        let removeAction = buttons['REMOVE'];
        let viewAction = buttons['VIEW'];
        let initialAction = buttons['INITIAL'];
        let userTypeAction = buttons['UTYPE'];

        let buttonItems = [];
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
            tooltip: '검색시 정렬기준',// handle a click on the button itself
            menu: new Ext.menu.Menu({
                items: sortColumns
            })
        });

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

        return Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: buttonItems
        });
    },
    createCommandToolbar: function (option) {

        let buttons = [];
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

        let buttons = [];
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

        let buttons = [];
        this.buttonToolbar = this.createCommandToolbarInner(option, '', buttons);

        this.resetAction = buttons['RESET'];

        return this.buttonToolbar;
    },
    createCrudTab: function () {
        let myId = gMain.geViewCrudId();

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
                    handler: function () {
                        gm.me().crudTab.collapsed ? gm.me().crudTab.expand() : gm.me().crudTab.collapse();
                    }
                }
            ]
        });
        this.crudTab.setActiveItem(1);
    },
    getObjFromfields: function (inTabTitle) {

        let arr = [];

        for (let obj in this.fields) {

            let name = obj['name'];
            let fieldLabel = obj['text'] === undefined ? '' : obj['text'];
            let create = obj['canCreate'] === undefined ? false : obj['canCreate'];
            let xtype = obj['xtype'] === undefined ? false : obj['xtype'];
            let height = obj['height'] === undefined ? 10 : obj['height'];
            let allowBlank = obj['allowBlank'] === undefined ? true : obj['allowBlank'];

            let maxLength = obj['maxLength'] === undefined ? 100 : obj['maxLength'];
            let enforceMaxLength = obj['enforceMaxLength'] === undefined ? true : obj['enforceMaxLength'];

            let editable = obj['editable'] === undefined ? true : obj['editable'];
            let tabTitle = obj['tabTitle'] === undefined ? '입력항목' : obj['tabTitle'];
            let position = obj['position'] === undefined ? 'center' : obj['position'];

            let tableName = obj['tableName'] === undefined ? 'map' : obj['tableName'];
            let hidden = obj['hidden'] === undefined ? false : obj['hidden'];

            let setNumber = obj['setNumber'] === undefined ? -1 : obj['setNumber'];
            let setName = obj['setName'] === undefined ? '' : obj['setName'];
            let setCols = obj['setCols'] === undefined ? 1 : obj['setCols'];

            let innerTpl = obj['innerTpl'] === undefined ? null : obj['innerTpl'];

            let format = obj['format'] === undefined ? 'Y-m-d' : obj['format'];
            let submitFormat = obj['submitFormat'] === undefined ? 'Y-m-d' : obj['submitFormat'];
            let dateFormat = obj['dateFormat'] === undefined ? 'Y-m-d' : obj['dateFormat'];
            let value = obj['value'] === undefined ? null : obj['value'];
            let minValue = obj['minValue'] === undefined ? 0 : obj['minValue'];

            let readOnly = obj['readOnly'] === undefined ? false : obj['readOnly'];
            let fieldStyle = obj['fieldStyle'] === undefined ? null : obj['fieldStyle'];
            let buttonText = obj['buttonText'] === undefined ? null : obj['buttonText'];

            let handleKey = obj['handleKey'] === undefined ? null : obj['handleKey'];
            let triggerKey = obj['triggerKey'] === undefined ? null : obj['triggerKey'];
            let supessTrigger = obj['supessTrigger'] === undefined ? false : obj['supessTrigger'];
            let buttonKey = obj['buttonKey'] === undefined ? null : obj['buttonKey'];

            let emptyText = obj['emptyText'] === undefined ? null : obj['emptyText'];

            let step = obj['step'] === undefined ? 1 : obj['step'];

            let canEdit = obj['canEdit'] === undefined ? false : obj['canEdit'];
            let canCreate = obj['canCreate'] === undefined ? false : obj['canCreate'];
            let canView = obj['canView'] === undefined ? false : obj['canView'];
            let canCellEdit = obj['canCellEdit'] === undefined ? false : obj['canCellEdit'];

            let labelWidth = obj['labelWidth'] === undefined ? 110 : obj['labelWidth'];

            let inputType = obj['inputType'] === undefined ? null : obj['inputType'];
            let copyValue = obj['copyValue'] === undefined ? null : obj['copyValue'];

            let decimalPrecision = obj['decimalPrecision'] === undefined ? 0 : obj['decimalPrecision'];

            if (create && tabTitle === inTabTitle && name !== 'unique_id') {

                if (!allowBlank) {
                    fieldLabel = '<span style="color: red; ">*</span>' + fieldLabel;
                }

                let objSub = {};

                objSub['setNumber'] = setNumber;
                objSub['setName'] = setName;
                objSub['setCols'] = setCols;
                objSub['position'] = position;
                objSub['readOnly'] = readOnly;

                objSub['canEdit'] = canEdit;
                objSub['canCreate'] = canCreate;
                objSub['canView'] = canView;
                objSub['canCellEdit'] = canCellEdit;
                objSub['labelWidth'] = labelWidth;

                if (value != null) {
                    objSub['value'] = value;
                }
                if (fieldStyle != null) {
                    objSub['fieldStyle'] = fieldStyle;
                }
                if (emptyText != null) {
                    objSub['emptyText'] = emptyText;
                }

                let val = this.getDefValue(name);
                if (val !== undefined) {
                    objSub['value'] = val;
                }

                objSub['xtype'] = xtype;
                objSub['name'] = tableName + '|' + name;
                objSub['fieldLabel'] = fieldLabel;
                objSub['allowBlank'] = allowBlank;
                objSub['editable'] = editable;
                objSub['hidden'] = hidden;
                objSub['copyValue'] = copyValue;

                if (!editable || readOnly) {
                    if (fieldStyle != null) {
                        objSub['fieldStyle'] = fieldStyle + ';' + 'background-color: #FBF8E6;  background-image: none;';
                    } else {
                        objSub['fieldStyle'] = 'background-color: #FBF8E6; background-image: none;';
                    }

                }

                if (xtype === 'datefield') {
                    objSub['format'] = format;
                    objSub['submitFormat'] = submitFormat;
                    objSub['dateFormat'] = dateFormat;
                }
                if (xtype === 'textfield') {
                    if (inputType != null) {
                        objSub['inputType'] = inputType;
                    }
                    objSub['maxLength'] = maxLength;
                    objSub['enforceMaxLength'] = enforceMaxLength;
                }
                if (xtype === 'numberfield') {
                    objSub['minValue'] = minValue;
                    objSub['step'] = step;
                    objSub['decimalPrecision'] = decimalPrecision;
                }
                if (xtype === 'textarea') {
                    if (maxLength < 1000) {
                        objSub['maxLength'] = maxLength;
                        objSub['enforceMaxLength'] = enforceMaxLength;

                    }
                }

                if (handleKey != null) {
                    objSub['handleKey'] = handleKey;
                }

                switch (xtype) {
                    case 'htmleditor':
                    case 'textarea':
                        objSub['height'] = height;
                        let fieldStyleSub = objSub['fieldStyle'];
                        if (fieldStyleSub === undefined || fieldStyleSub === null) {
                            objSub['fieldStyle'] = 'overflow:scroll ;overflow-x:hidden;';
                        } else {
                            objSub['fieldStyle'] = fieldStyleSub + 'overflow:scroll ;overflow-x:hidden;';
                        }

                        if (xtype === 'textarea') {
                            objSub['listeners'] = {
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
                        objSub['emptyText'] = '파일을 선택하세요.';
                        objSub['buttonText'] = '첨부';
                        objSub['buttonConfig'] = {
                            iconCls: 'af-upload'
                        };
                        objSub['allowBlank'] = allowBlank;
                        objSub['editable'] = editable;
                        objSub['anchor'] = '100%';
                        objSub['listeners'] = {
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

                        let storeClass = obj['storeClass'] === undefined ? 'Ext.data.Store' : obj['storeClass'];
                        let multiSelect = obj['multiSelect'] !== undefined;

                        let storeName = ((storeClass.indexOf("Mplm.store.") > -1
                                || storeClass.indexOf("Ext.data.Store")) > -1
                            || storeClass.indexOf("Rfx2.store.") > -1)
                            ? storeClass : 'Mplm.store.' + storeClass;

                        let mode = obj['mode'] === undefined ? 'local' : obj['mode'];
                        let triggerAction = obj['triggerAction'] === undefined ? 'all' : obj['triggerAction'];
                        let forceSelection = obj['forceSelection'] === undefined ? false : obj['forceSelection'];
                        let displayField = obj['displayField'] === undefined ? 'codeName' : obj['displayField'];
                        let valueField = obj['valueField'] === undefined ? 'systemCode' : obj['valueField'];
                        let queryMode = obj['queryMode'] === undefined ? 'remote' : obj['queryMode'];
                        let editableSub = obj['editable'] === undefined ? true : obj['editable'];
                        let preLoad = obj['preLoad'] === undefined ? null : obj['preLoad'];

                        let params = obj['params'] === undefined ? null : obj['params'];

                        let listeners = obj['listeners'] === undefined ? null : obj['listeners'];

                        let id = obj['id'] === undefined ? null : obj['id'];

                        if (id == null) {
                            objSub['id'] = gMain.selectedMenuId + '-' + name;
                        } else {
                            objSub['id'] = id;
                        }

                        objSub['mode'] = mode;
                        objSub['triggerAction'] = triggerAction;
                        objSub['forceSelection'] = forceSelection;
                        objSub['displayField'] = displayField;
                        objSub['valueField'] = valueField;
                        objSub['queryMode'] = queryMode;
                        objSub['multiSelect'] = multiSelect;

                        let storeParam = {cmpName: gMain.selectedMenuId + '-' + name};
                        if (params != null) {
                            for (let key in params) {
                                storeParam[key] = params[key];
                            }
                        }

                        objSub['store'] = Ext.create(storeName, storeParam);

                        if (preLoad != null) {
                            objSub['listConfig'] = {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{' + preLoad + '}</div>';
                                }
                            };
                            objSub['minChars'] = 1;
                            objSub['editable'] = true;

                        } else {
                            objSub['autoSelect'] = true;
                            objSub['editable'] = editableSub;
                        }

                        (objSub['store']).load();


                        if (listeners == null) {
                            objSub['listeners'] = {
                                select: function (combo, record) {
                                    gMain.handlInputFc(combo.handleKey, combo, record);
                                },
                                change: function (combo, newValue) {

                                    if (newValue == null) {
                                        gMain.handlInputFc(combo.handleKey, combo);
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
                            objSub['listeners'] = listeners;
                        }


                        if (innerTpl != null) {
                            objSub['listConfig'] = {
                                innerTpl: innerTpl,
                                getInnerTpl: function () {
                                    return this.innerTpl;
                                }
                            };
                        }

                        break;
                    default:
                        let idSub = obj['id'] === undefined ? null : obj['id'];

                        if (idSub != null) {
                            objSub['id'] = idSub;
                        }

                        objSub['enableKeyEvents'] = true;
                        objSub['listeners'] = {
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
                    objSub['flex'] = 1;
                    if (!supessTrigger) {
                        objSub['xtype'] = 'triggerfield';
                    }
                    if (triggerKey != null) {
                        objSub['triggerKey'] = triggerKey;
                    }
                    if (!supessTrigger) {
                        objSub['trigger1Cls'] = Ext.baseCSSPrefix + 'form-clear-trigger';
                        objSub['onTrigger1Click'] = function (a, b, c) {
                            Ext.getCmp(this.id).setValue('');
                            gMain.handlInputFc(this.triggerKey, a, b, c);
                        };
                    }


                    let hitems = [];
                    hitems.push(objSub);
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
                    let o2 = {
                        xtype: 'container',
                        layout: 'hbox',
                        setNumber: objSub['setNumber'],
                        setName: objSub['setName'],
                        setCols: objSub['setCols'],
                        style: 'margin-bottom: 5px;margin-left:1px;',
                        items: hitems
                    };
                    arr.push(o2);
                } else {
                    arr.push(objSub);
                }

            }//endof if
        }

        return arr;
    },
    //FieldSet이 없는 경우 Form 가져오기
    getFormPaneNoSet: function (arrObjects, checkFileAttach, inTabTitle) {

        let formItemsTop = []; //top
        let formItemsHidden = []; //top
        let formItemsLeft = []; //left
        let formItemsRight = []; //right
        let formItemsBottom = []; //bottom
        let formItemsHtml = []; //bottom
        let formItmesTotal = []; // total

        let ran = Math.random() * 10000000;
        let hasFileAttach = false;

        for (let objSub in arrObjects) {

            let xtype = objSub['xtype'];
            let hidden = objSub['hidden'];
            let position = objSub['position'];

            if (xtype === 'filefield') {
                hasFileAttach = true;
                checkFileAttach[0] = hasFileAttach;
            }

            if (hidden) {
                formItemsHidden.push(objSub);
            } else {
                if (xtype === 'htmleditor') {
                    let htmlEditor = Ext.create('Ext.form.HtmlEditor', objSub);
                    formItemsHtml.push(htmlEditor);
                } else {
                    switch (position) {
                        case 'top':
                            formItemsTop.push(objSub);

                            if (vInputFieldDirection === 'horizontal' && objSub.xtype !== 'container') {
                                objSub['enableKeyEvents'] = true;
                                objSub.listeners['keydown'] = function (e, t) {
                                    if (t.keyCode === 9) {
                                        window.event.returnValue = false;
                                        let keyIndex = e.ownerCt.items.keys.indexOf(e.getId());
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
                            formItemsBottom.push(objSub);
                            if (vInputFieldDirection === 'horizontal' && objSub.xtype !== 'container') {
                                objSub['enableKeyEvents'] = true;
                                objSub.listeners['keydown'] = function (e, t) {
                                    if (t.keyCode === 9) {
                                        window.event.returnValue = false;
                                        let keyIndex = e.ownerCt.items.keys.indexOf(e.getId());
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

                            if (vInputFieldDirection === 'horizontal' && objSub.xtype !== 'container') {
                                objSub['enableKeyEvents'] = true;
                                let o2 = objSub;

                                if (objSub.xtype === 'container') {
                                    o2 = objSub.items[0];
                                    o2['enableKeyEvents'] = true;
                                }

                                o2.listeners['keydown'] = function (e, t) {

                                    if (t.keyCode === 9) {
                                        window.event.returnValue = false;
                                        let ownerCt = e.ownerCt.id;
                                        let keyIndex = e.ownerCt.items.keys.indexOf(e.getId());
                                        let formItemLeft = gu.getCmp('formItemLeft' + ran).items;
                                        let formItemRight = gu.getCmp('formItemRight' + ran).items;

                                        if (ownerCt.includes('Left')) {

                                            let rightItem = formItemRight.items[keyIndex];

                                            if (keyIndex > formItemRight.length - 1) {
                                                gm.me().tabNextFieldWithNoSet(e, 2);
                                            } else {
                                                if (rightItem.xtype === 'container') {
                                                    rightItem = rightItem.items.items[0];
                                                }
                                                rightItem.focus();
                                            }
                                        } else {

                                            let leftItem = formItemLeft.items[keyIndex + 1];

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
                            if (!objSub.hidden) {
                                if (index % 2 === 0) {
                                    formItemsLeft.push(objSub);
                                } else {
                                    formItemsRight.push(objSub);
                                }
                                index++;
                            }

                    }
                }

            }
        }

        if (hasFileAttach) {
            this.vFILE_ITEM_CODE = gUtil.RandomString(10);

            formItemsTop.push(new Ext.form.Hidden({
                name: 'file_itemcode',
                value: this.vFILE_ITEM_CODE
            }));
        } else {
            this.vFILE_ITEM_CODE = null;
        }

        let items = [];
        if (formItemsTop.length > 0) {
            items.push({
                xtype: 'container',
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
                width: '100%',
                margin: '0 10 0 0',
                border: true,
                layout: 'anchor',
                items: formItemsBottom
            });
        }

        for (let formItemHtml in formItemsHtml) {
            items.push(formItemHtml);
        }

        return items;
    },
    //FieldSet이 있는 경우 Form 가져오기
    getFormPaneWithset: function (arrField, arrObjects, checkFileAttach) {

        let hasFileAttach = false;

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

        let arrFieldset = [];

        let pos = 0;

        for (let field in arrField) {

            arrFieldset.push({
                setNumber: field['setNumber'],
                setCols: field['setCols'],
                xtype: 'fieldset',
                name: 'fieldset' + pos,
                title: field['setName'],
                defaultType: 'textfield',
                defaults: {
                    anchor: '100%'
                },
                items: []
            });

            pos++;
        }

        let getArrField = function (sNumber, arr) {

            let lastObj = null;

            for (let obj in arr) {
                if (obj['setNumber'] === sNumber) {
                    return obj;
                }
                lastObj = obj;
            }

            return lastObj;
        };

        for (let arrObj in arrObjects) {

            let xtype = arrObj['xtype'];
            let setNumber = arrObj['setNumber'];

            let oSet = getArrField(setNumber, arrFieldset);
            let setItems = oSet['items'];

            if (xtype === 'filefield') {
                hasFileAttach = true;
                checkFileAttach[0] = hasFileAttach;
            }

            if (xtype === 'htmleditor') {
                setItems.push(Ext.create('Ext.form.HtmlEditor', arrObj));
            } else {
                setItems.push(arrObj);
            }
        }

        if (hasFileAttach) {
            this.vFILE_ITEM_CODE = gUtil.RandomString(10);
            let oSetFileAttach = getArrField(-1, arrFieldset);
            oSetFileAttach['items'].push(new Ext.form.Hidden({
                name: 'file_itemcode',
                value: this.vFILE_ITEM_CODE
            }));
        } else {
            this.vFILE_ITEM_CODE = null;
        }

        //setcols 2인 경우 처리
        Ext.each(arrFieldset, function () {

            let setCols = this['setCols'];
            let ran = Math.random() * 10000000;

            if (setCols > 1) {
                let items = this['items'];

                let formItemsLeft = [];
                let formItemsRight = [];
                let formItemsHidden = [];

                let index = 0;

                for (let item in items) {

                    if (vInputFieldDirection === 'horizontal' && item.xtype !== 'container') {

                        item['enableKeyEvents'] = true;
                        item.listeners['keydown'] = function (e, t) {
                            if (t.keyCode === 9) {
                                window.event.returnValue = false;
                                let ownerCt = e.ownerCt.id;
                                let keyIndex = e.ownerCt.items.keys.indexOf(e.getId());
                                let formItemLeft = gu.getCmp('formItemLeft' + ran).items;
                                let formItemRight = gu.getCmp('formItemRight' + ran).items;

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

                    if (item.hidden) {
                        formItemsHidden.push(item);
                    } else {
                        if (index % 2 === 0) {
                            formItemsLeft.push(item);
                        } else {
                            formItemsRight.push(item);
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
                    let itemsSub = this['items'];

                    for (let itemSub in itemsSub) {

                        if (itemSub.xtype === 'container') {

                            for (let item in itemSub) {
                                item['enableKeyEvents'] = true;

                                if (item.listeners !== undefined) {
                                    item.listeners['keydown'] = function (e, t) {
                                        if (t.keyCode === 9) {
                                            window.event.returnValue = false;
                                            let keyIndex = e.ownerCt.items.keys.indexOf(e.getId());
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
                            itemSub['enableKeyEvents'] = true;
                            itemSub.listeners['keydown'] = function (e, t) {
                                if (t.keyCode === 9) {
                                    window.event.returnValue = false;
                                    let keyIndex = e.ownerCt.items.keys.indexOf(e.getId());
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

        let checkFileAttach = [false];

        let arrObjects = this.getObjFromfields(inTabTitle);

        let items;
        let arrField = [];

        //fieldSet을 이용하는 경우
        let isSetField = false;

        for (let arrObj in arrObjects) {
            let setNumber = arrObj['setNumber'];
            let setName = arrObj['setName'];
            let setCols = arrObj['setCols'];
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

        if (isSetField) { //FieldSet이 정의되어있으면 FieldSet처리를 한다.
            //중복제거.
            arrField = arrField.filter(function (item, pos) {
                let check = function (arrField, item) {
                    for (let i = 0; i < arrField.length; i++) {
                        let o = arrField[i];
                        if (o['setNumber'] === item['setNumber']) {
                            return i;
                        }
                    }
                    return -1;
                };
                return check(arrField, item) === pos;
            });
            items = this.getFormPaneWithset(arrField, arrObjects, checkFileAttach);
        } else {
            items = this.getFormPaneNoSet(arrObjects, checkFileAttach, inTabTitle);
        }

        return Ext.create('Rfx.base.BaseInputForm', {
            title: inTabTitle,
            scroll: true,
            autoScroll: true,
            hasFileAttach: checkFileAttach[0],
            items: items
        });

    },
    doReset: function () {
        if (gm.me().formItems != null) {
            for (let form in gm.me().formItems) {
                form.reset();
            }
        }
        gUtil.disable(gm.me().createAction);
        gUtil.disable(gm.me().resetAction);

    },
    doMyReset: function (targetTitle) {

        if (gm.me().formItems != null) {

            for (let form in gm.me().formItems) {
                let title = form['title'];
                if (title === targetTitle) {
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
    doCreate: function () {
        this.preCreateCallback();
    },
    doCreateCore: function () {

        if (gm.me().createAction !== undefined) {
            gm.me().createAction.disable();
            Ext.getBody().mask('잠시만 기다려주세요.');
        }

        let sendValue = {};
        let CLASS_ALIAS = [];
        let fileForm = null;

        if (gm.me().formItems != null) {

            for (let form in this.formItems) {
                let hasFileAttach = form['hasFileAttach'];
                if (hasFileAttach) {
                    fileForm = form;
                }
                if (form.isValid()) {
                    let value = form.getValues(false);

                    value = this.replaceComma(form.getForm().getFields(), value);

                    for (let key in value) {
                        let aliasArr = key.split('|');
                        let readOnly = false;
                        if (aliasArr.length > 1) {
                            CLASS_ALIAS.push(aliasArr[0]);

                            let o = (aliasArr.length === 2) ? this.getFieldObj(aliasArr[1]) : this.getFieldObj(aliasArr[1] + '|' + aliasArr[2]);
                            if (o != null) {
                                readOnly = o['readOnly'] == null ? false : o['readOnly'];
                            }
                        }

                        if (key === 'default|unique_id') {
                            let rec = this.vSELECTED_RECORD;
                            sendValue[key] = rec == null ? -1 : rec.get(this.UPDATE_FIELD_NAME);
                        } else {
                            if (!readOnly) {
                                sendValue[key] = gUtil.stripQuot(value[key]);
                            }
                        }
                    }
                } else {
                    Ext.Msg.alert('안내', '필수입력 항목을 확인하세요.');
                    gm.me().createAction.enable();
                    Ext.getBody().unmask();
                    return;
                }
            }
        }

        CLASS_ALIAS = extjsUtil.mergeDuplicateArray(CLASS_ALIAS);

        sendValue['CLASS_ALIAS'] = CLASS_ALIAS;

        sendValue['CRUD_MODE'] = this.crudMode;
        gm.me().crudMode = this.crudMode;
        sendValue['MENU_LINK'] = this.link;

        if (fileForm == null) {
            if (Ext.isDefined(gMain.extFieldColumnStore2)
                && gMain.extFieldColumnStore2.data.items.length > 0
                && (gm.me().crudMode === 'CREATE' || gm.me().crudMode === 'COPY')) {

                for (let i = 0; i < gMain.extFieldColumnStore2.data.items.length; i++) {

                    let r = gMain.extFieldColumnStore2.getAt(i);

                    sendValue['srcahd|item_name' + i] = r.get('item_name');
                    sendValue['srcahd|class_code' + i] = r.get('class_code');
                    sendValue['assymap|bm_quan' + i] = r.get('bm_quan');
                    sendValue['mycart|pl_no' + i] = r.get('pl_no');
                    sendValue['assymap|pl_no' + i] = r.get('pl_no');
                }
                sendValue['extStore2_length'] = gMain.extFieldColumnStore2.data.items.length;
                sendValue['CLASS_ALIAS'] = ['project', 'srcahd', 'assymap'];
            }

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/index/generalData.do?method=create',
                params: sendValue,
                method: 'POST',
                success: function () {

                    if (gm.me().crudMode === 'EDIT') {
                        gMain.setCrPaneToolbarMsg('수정되었습니다.');
                    } else {
                        gMain.setCrPaneToolbarMsg('등록되었습니다.');
                        gm.me().doReset();
                    }

                    gm.me().redrawStore(sendValue);

                    if (gm.me().link === 'PPO2') {
                        Ext.getCmp(gMain.geViewCrudId()).collapse();
                    }
                },
                failure: function (result) {
                    let jsonData = Ext.util.JSON.decode(result.responseText);
                    let resultMessage = jsonData.data.result;

                    Ext.getBody().unmask();
                    gm.me().createAction.enable();
                    gMain.setCrPaneToolbarMsg('저장에 실패하였습니다.');
                    Ext.Msg.alert('안내', '저장에 실패하였습니다.' + " : " + resultMessage);

                }
            });
        } else {//File 첨부있을 때..
            fileForm.submit({
                url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' + this.vFILE_ITEM_CODE,
                waitMsg: 'Uploading Files...',
                success: function () {
                    if (Ext.isDefined(gMain.extFieldColumnStore2) && gMain.extFieldColumnStore2.data.items.length > 0) {

                        for (let extFieldPos = 0; extFieldPos < gMain.extFieldColumnStore2.data.items.length; extFieldPos++) {

                            let extFieldItem = gMain.extFieldColumnStore2.getAt(extFieldPos);

                            sendValue['srcahd|item_name' + extFieldPos] = extFieldItem.get('item_name');
                            sendValue['srcahd|class_code' + extFieldPos] = extFieldItem.get('class_code');
                            sendValue['assymap|bm_quan' + extFieldPos] = extFieldItem.get('bm_quan');
                            sendValue['mycart|pl_no' + extFieldPos] = extFieldItem.get('pl_no');
                            sendValue['assymap|pl_no' + extFieldPos] = extFieldItem.get('pl_no');
                        }
                        sendValue['extStore2_length'] = gMain.extFieldColumnStore2.data.items.length;

                        sendValue['CLASS_ALIAS'] = ['project', 'srcahd', 'assymap'];
                    }
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/index/generalData.do?method=create',
                        params: sendValue,
                        method: 'POST',
                        success: function () {
                            gMain.setCrPaneToolbarMsg('등록되었습니다.');

                            if (gm.me().crudMode !== 'EDIT') {
                                gm.me().doReset();
                            }

                            gm.me().redrawStore();
                        },
                        failure: function (result) {
                            let jsonData = Ext.util.JSON.decode(result.responseText);
                            let resultMessage = jsonData.data.result;

                            gMain.setCrPaneToolbarMsg('저장에 실패하였습니다.');
                            Ext.Msg.alert('안내', '저장에 실패하였습니다.' + " : " + resultMessage);
                        }
                    });
                }
            });
        }
    },

    getFieldPos: function (title, name) {
        for (let i = 0; i < this.fields.length; i++) {
            let o = this.fields[i];
            if (o['tabTitle'] === title && (o['name'] === name)) {
                return i;
            }
        }

        return -1;
    },
    getFieldObj: function (key) {

        for (let obj in fields) {
            if ((obj['name'] === key)) {
                return o;
            }
        }

        return null;
    },
    addFormWidget: function (to, o) {
        let pos = -1;

        if (typeof to == 'string') {
            let title = o['tabTitle'];
            pos = this.getFieldPos(title, to);
        } else if (to === 'number') {
            pos = to;
        }
        if (pos > -1) {
            this.fields = gUtil.insert(this.fields, pos + 1, o);
        } else {
            this.fields.push(o);
        }

    },
    createFormPane: function () {

        let tabTitleArr = [];

        for (let obj in this.fields) {
            let tabTitle = obj['tabTitle'];
            if ((tabTitle !== undefined) && (tabTitle !== null) && (tabTitle.length > 0)) {
                tabTitleArr.push(tabTitle);
            }
        }

        //중복제거
        tabTitleArr = extjsUtil.mergeDuplicateArray(tabTitleArr);

        this.formItems = [];
        for (let tabTitlePos = 0; tabTitlePos < tabTitleArr.length; tabTitlePos++) {

            let forms = this.getFormPane(tabTitleArr[tabTitlePos]);

            //console_logs('------> forms', forms);
            //첫번째 탭에 UID 추가.
            if (tabTitlePos === 0) {
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
            hidden: true,
            handler: function () {
                gm.me().doReset();
                gm.me().crudMode = 'VIEW';
                gm.me().crudTab.setActiveItem(1);
                gm.me().crudTab.setSize(gm.me().getCrudviewSize());
                gm.me().crudTab.setTitle(gm.me().vMESSAGE[gm.me().crudMode]);
                gm.me().toggleExpand();
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
        let toolbar = Ext.create('widget.toolbar', {
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

        let myId = gMain.geTabPanelId();

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

        if (!this.defOnlyCreate || this.crudMode === 'CREATE') {

            for (let key in this.defComboValues) {
                let o = this.defComboValues[key];
                let combo = Ext.getCmp(gMain.selectedMenuId + '-' + key);

                if (combo != null) {
                    combo.store.load(function (records) {

                        for (let obj in records) {
                            try {
                                if (obj.get(combo.valueField) === o['value']) {
                                    combo.select(obj);
                                }
                            } catch (e) {
                            }
                        }
                    });
                }
            }
        }

        return this.formPane;
    },

    doUpdate: function (gridvalues) {

        let CLASS_ALIAS = [];

        let getTableName = function (index, fields) {
            for (let obj in fields) {
                let tableName = obj['tableName'];
                let name = obj['name'];
                if (name === index) {
                    CLASS_ALIAS.push(tableName);
                    return tableName + '|' + index;
                }
            }
            return index;
        };


        for (let key in gridvalues) {
            let value = gridvalues[key];
            if (typeof value == 'string') {
                value = value.split('"').join("&quot;");
            }
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
            failure: function () {
                Ext.Msg.alert('안내', '저장에 실패하였습니다.');
            }
        });


    },
    createPropertyPane: function () {

        let propertyNames = {};
        if (this.fields != null) {

            for (let obj in this.fields) {
                let dataIndex = obj['name'];
                let text = obj['text'];
                let edit = obj['canEdit'];
                let view = obj['canView'];

                if (gm.getUseNewPropertyPanel()) {
                    if (obj['useYn']) {
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
                let gridvalues = gm.me().propertyPane.getSource();

                let removeGridValue = function (id) {
                    for (let key in gridvalues) {
                        let arr = key.split('|');
                        let gridId = arr[arr.length - 1];
                        if (gridId === id) {
                            delete gridvalues[key];
                            return;
                        }
                    }
                };

                for (let obj in gm.me().fields) {
                    let fieldEdit = obj['canEdit'];
                    let id = obj['name'];
                    if (!fieldEdit && id !== 'unique_id' && id !== 'id') {
                        removeGridValue(id);
                    }
                }

                gm.me().doUpdate(gridvalues);
            }
        });

        if (gm.getUseNewPropertyPanel()) {
            this.propertyPane = Ext.create('Ext.grid.property.Grid', {
                cls: 'rfx-panel',
                border: true,
                autoHeight: true,
                enableKeyEvents: true,
                viewConfig: {
                    markDirty: false,
                    stripeRows: false,
                    getRowClass: function () {
                        return '';
                    }
                },
                propertyNames: propertyNames,
                listeners: {
                    beforeedit: function () {
                        return false;
                    },
                    itemkeydown: function (record, item, index, e, eOpts) {

                        if (eOpts.ctrlKey && eOpts.keyCode === 67) {
                            let tempTextArea = document.createElement("textarea");
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
                        let cls = '';

                        for (let obj in gm.me().fields) {
                            let fieldEdit = obj['canEdit'];
                            if (!fieldEdit && (record['id'] === obj['name'])) {
                                cls = 'readonly-property-cell';
                            }
                        }

                        return cls;
                    }
                },
                propertyNames: propertyNames,
                listeners: {
                    beforeedit: function (editor, e) {

                        for (let obj in gm.me().fields) {
                            let fieldEdit = obj['canEdit'];
                            if (!fieldEdit && (e.record.get('name') === obj['name'])) {
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

        let propStore = this.propertyPane.getStore();
//		//console_logs('propStore', propStore);
//		//console_logs('propStore fields', propStore.getFields());
//		//console_logs('propStore fields', propStore.fields);


        propStore.addListener('update', function (store, record, operation) {
            if (operation === 'edit') {
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

        let byReplacer = o['byReplacer'];


        if (byReplacer !== undefined && byReplacer !== null) {
            this.byReplacer = byReplacer;
        }

        let deleteClass = o['deleteClass'];

        if (deleteClass !== undefined && deleteClass !== null) {
            this.deleteClass = deleteClass;
        }

        let groupField = o['groupField'];

        if (groupField !== undefined && groupField !== null) {
            this.groupField = groupField;
        }

        let sorters = o['sorters'];
        let property = 'unique_id';
        let direction = 'DESC';

        let groupDir = o['groupDir'];

        if (groupDir !== undefined && groupDir !== null) {
            this.groupDir = groupDir;
        } else {
        }

        if (sorters !== undefined && sorters !== null) {
            direction = sorters[0]['direction'];
            property = sorters[0]['property'];
            if (direction === undefined || direction === null) {
                direction = "DESC";
            }
            if (property === undefined || property === null) {
                property = "unique_id";
            }
        }

        this.setSortCond(property, direction, null);

        let pageSize = o['pageSize'];

        this.createStoreCore(pageSize, option);
    },

    //복사등록의 child callback
    copyCallback: function () {
    },
    createStoreCore: function (pageSize, option) {
        this.store = this.createStoreCoreInner(pageSize, option, this.model);
    },
    createStoreCoreInner: function (pageSize, option, model) {
        let o = {
            pageSize: pageSize,
            model: model,
            sortOnLoad: true,
            /* remortSort를 true로 둘 경우 서버에서 정렬한 것을 기준으로 소팅이 되는데, 이렇게 하면 그룹화를 할 수 없다 */
            remoteSort: false,
            listeners: {

                beforeload: function (store) {
                    let sorters = store.sorters;
                    let property = null;
                    let direction = null;
                    if (sorters !== undefined && sorters !== null) {

                        for (let pos in sorters) {
                            let sorter = store.sorters.getAt(0);

                            property = sorter['_property'];
                            direction = sorter['_direction'];
                        }
                    }

                    if (property !== null) {

                        gm.me().setSortCond(property, direction, null);

                        if (gm.me().orderbyAutoTable) {
                            let n = gm.me().getRplaceCond(property);

                            property = (n == null) ? property : n;
                        }

                        store.getProxy().setExtraParam('orderBy', property);
                        store.getProxy().setExtraParam('ascDesc', direction);

                    }
                },
                //Store의 Load 이벤트 콜백
                load: function (store, records) {

                    if (records !== null) {
                        let searchParams = store.getProxy().getExtraParams();
                        for (let key in searchParams) {
                            let v = searchParams[key];
                            if (v != null) {
                                let dcode = v;
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

        if (option !== undefined && option !== null) {
            for (let attrname in option) {
                o[attrname] = option[attrname];
            }
        }

        if (this.bufferingStore) {
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

        if (byReplacer !== undefined && byReplacer !== null) {
            this.byReplacer = byReplacer;
        }

        if (deleteClass !== undefined && deleteClass !== null) {
            this.deleteClass = deleteClass;
        }

        let property = 'unique_id';
        let direction = 'DESC';

        if (sorters !== undefined && sorters !== null) {
            direction = sorters[0]['direction'];
            property = sorters[0]['property'];
            if (direction === undefined || direction === null) {
                direction = "DESC";
            }
            if (property === undefined || property === null) {
                property = "unique_id";
            }
        }

        this.setSortCond(property, direction, null);

        this.createStoreCore(pageSize);
    },
    createTabGrid: function (model_name, items, param_name, toolbars, activateFc, storeOption, groupingFeature) {

        for (let obj in this.tab_info) {

            let code = obj['code'];
            let name = obj['name'];
            let title = obj['title'];
            let pcsToolbars = obj['toolbars'];
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

            let option = {
                title: title,
                cmpId: multi_grid_id,
                multi_grid_id: code,
                tabConfig: {
                    tooltip: title + ' [' + multi_grid_id + ']'
                },
                features: groupingFeature
            };
            let grid = this.createSubGrid(code, name, option, pcsToolbars);

            if (grid != null) {
                grid.getSelectionModel().on({
                    selectionchange: function (sm, selections) {
                        gm.me().vSELECTED_RECORD = (selections != null && selections.length > 0) ? selections[0] : null;
                        gm.me().vSELECTED_UNIQUE_ID = gm.me().vSELECTED_RECORD == null ? -1 : gm.me().vSELECTED_RECORD.get('id');
                        gMain.doSelectGrid(selections);
                    }
                });
                items.push(grid);
            } else {
                Ext.Msg.alert('오류', code + ' 그리드 생성실패.J2_CODE정의가 정확하지 않습니다. \r\n ' + this.link + '#' + code + '를 확인하세요.');
            }
        }

        this.tabGenPanel = Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
            layout: 'border',
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
        let key = this.link + '#' + multi_grid_id;
        let items = this.tabGenPanel.items.items;

        for (let i = 0; i < items.length; i++) {
            let myGrid = items[i];
            //console_logs('myGrid', myGrid);
            //console_logs('cmpId', myGrid.cmpId);

            if (myGrid.cmpId === key) {
                return myGrid;
            }
        }

        return this.grid;
    },
    createStoreSub: function (modelClass, sorters, pageSize, byReplacer, deleteClass, param_name, tab_code, option) {
        //this.modelClass = modelClass;
        let model = Ext.create(modelClass, {
            fields: this.fields_map[tab_code]
        });

        let property = 'unique_id';
        let direction = 'DESC';
        if (sorters !== undefined) {
            direction = sorters[0]['direction'];
            property = sorters[0]['property'];
            if (direction === undefined) {
                direction = "DESC";
            }
            if (property === undefined || property == null) {
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

        let curTab = (tab_code == null) ? this.selected_tab : tab_code;
        if (curTab === undefined || curTab == null) {
            curTab = 'default';
        }
        //console_logs('redrawSortCond: ', curTab);

        let property = this.sort_cond[curTab].property;
        let direction = this.sort_cond[curTab].direction;

        let fields = curTab === 'default' ? this.fields : this.fields_map[curTab];
        if (fields != null) {
            for (let i = 0; i < fields.length; i++) {
                let o = fields[i];
                let name = o['name'];
                let text = o['text'];

                if (name === property) {
                    try {
                        gm.me().getCommandWidget('splitbutton' + gm.me().link).setText(text);
                        gm.me().getCommandWidget(gm.me() + '-' + 'orderBy').setValue(name);
                        gm.me().getCommandWidget(gm.me() + '-' + 'ascDesc').setValue(direction);

                        if (direction.toLowerCase() === 'desc') {
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
        for (let i = 0; i < gUtil.getDistinctFilters(this.link).length; i++) {
            let key = gUtil.getDistinctFilters(this.link)[i];
            if (dataIndex === key) {
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

            success: function () {
                console_log('success defaultSet');
            },
            failure: function () {
                console_log('fail defaultSet');
            }
        });

        location.href = CONTEXT_PATH + '/index/main.do?&wa_name=' + wa_name
            + '&pj_name=' + pj_name + '&pj_code=' + pj_code + '&child=' + child
            + '&pj_uid=' + pj_uid
            + '&parent_uid=' + parent_uid + '#design-plan:DBM7_PLM';
    },

    checkColumnEdit: function (columns) {

        Ext.each(columns, function (o) {
            let canCellEdit = o['canCellEdit'];
            let useYn = o['useYn'];
            let dataType = o['dataType'];
            let important = o['important'];
            let width = o['width'];

            if (canCellEdit === true && useYn === true) {
                //console_logs('-----> found', o);
                o["style"] = 'background-color:#0271BC;text-align:center';
                o["tdCls"] = 'custom-column';
                o["width"] = width;

                switch (dataType) {
                    //case 'digit':
                    case 'decimal':
                        o["editor"] = {
                            xtype: 'textfield',
                            selectOnFocus: true,
                            listeners: {
                                specialkey: function (f, e) {

                                    // 다음 row의 cell editing
                                    if (e.getKey() === Ext.EventObject.ENTER && gm.me().nextRow === true) {
                                        let grid = gm.me().grid;

                                        let maxRows = grid.store.data.length;
                                        let rowSelected = f.column.field.container.component.context.rowIdx;
                                        let colSelected = f.column.field.container.component.context.colIdx;
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
                            meta.css = important === true ? 'custom-column-orange' : 'custom-column';

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
                                    if (e.getKey() === Ext.EventObject.ENTER && gm.me().nextRow === true) {
                                        let grid = gm.me().grid;

                                        let maxRows = grid.store.data.length;
                                        let rowSelected = f.column.field.container.component.context.rowIdx;
                                        let colSelected = f.column.field.container.component.context.colIdx;
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
                        o["renderer"] = function (value, meta) {
                            meta.css = important === true ? 'custom-column-orange' : 'custom-column';
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
                                    let combo = this;
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
                                    let combo = this;
                                    combo.expand();
                                    this.store.load();
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
                                    if (e.getKey() === Ext.EventObject.ENTER && gm.me().nextRow === true) {
                                        let grid = gm.me().grid;

                                        let maxRows = grid.store.data.length;
                                        let rowSelected = f.column.field.container.component.context.rowIdx;
                                        let colSelected = f.column.field.container.component.context.colIdx;

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
                        o['renderer'] = function (value) {

                            if (value == null) {
                                return "";
                            } else {
                                if (value.length > 9) {
                                    return value.substr(0, 10);
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
                            renderer: Ext.util.Format.dateRenderer('m-d')
                        };
                        o['renderer'] = function (value) {
                            if (value == null) {
                                return "";

                            } else {
                                if (value.length > 9) {
                                    let s = value.substr(0, 10);
                                    return s.substr(5);
                                } else {
                                    if (Ext.isIE) {
                                        return value;
                                    } else {
                                        return Ext.util.Format.date(value, 'm-d');
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
                            meta.css = important === true ? 'custom-column-orange' : 'custom-column';
                            return value;
                        };
                        o["editor"] = {
                            selectOnFocus: true,
                            listeners: {
                                specialkey: function (f, e) {
                                    // 다음 row의 cell editing
                                    if (e.getKey() === Ext.EventObject.ENTER && gm.me().nextRow === true) {
                                        let grid = gm.me().grid;
                                        let maxRows = grid.store.data.length;
                                        let rowSelected = f.column.field.container.component.context.rowIdx;
                                        let colSelected = f.column.field.container.component.context.colIdx;

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
                            meta.css = important ? 'custom-column-orange' : 'custom-column';
                            return value;
                        };
                        o["editor"] = {};
                }

                o["css"] = important ? 'edit-cell-important' : 'edit-cell';
            }
        });

    },

    getComboCommon: function () {
        let buttonItems = [];
        let data1 = [];

        if (this.useValueCopyCombo === true) {
            data1.push({
                name: '<미지정>',
                code: ''
            });
            let clipColumns = [];
            clipColumns.push({
                text: '<전체복사>',
                handler: function (r) {
                    gm.me().popupClip(null, r.text, 800, 600);
                }
            });
            Ext.each(this.columns, function (o) { //Editable
                let name = o['text'];
                let code = o['dataIndex'];

                data1.push({
                    name: name,
                    code: code
                });

                clipColumns.push({
                    text: o['text'],
                    dataIndex: o['dataIndex'],
                    handler: function (r) {
                        console_logs('-- r.text', r.text);
                        console_logs('-- r.dataIndex', r.dataIndex);
                        let o = gu.getCmp('clipboard');
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
                text: this.getMC('CMD_VAL_COPY', '값복사'),
                value: null,
                tooltip: this.getMC('CMD_VAL_COPY', '값복사 필드 선택'),
                handler: function (o) {

                    let dataIndex = this.value;
                    if (dataIndex == null) {
                        Ext.Msg.alert('안내', '먼저 값복사 할 필드를 선택하세요.');
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

        for (let i = 0; i < this.selectedSortComboCount; i++) {
            let store = Ext.create('Ext.data.Store', {
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
                        let v = this.value;
                        let index = this.index;

                        this.value = (v === 'asc') ? 'desc' : 'asc';
                        if (this.value === 'asc') {
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

        if (toolbars !== undefined && this.useValueCopyCombo === true && this.useDivisionCombo === true
            && this.selectedSortComboCount > 0) {
            toolbars.splice(1, 0, this.getComboCommon());
        }

        let target = this;
        Ext.each(columns, function (columnObj) {
            let dataIndex = columnObj['dataIndex'];
            if (target.checkDistinctKey(dataIndex) === true) {
                let optionsStore = Ext.create('Ext.data.Store', {
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

        if (gm.getCell_edit(this) === 'Y') {
            this.checkColumnEdit(columns);
        }

        let lock_cnt = gm.getLock_cnt(this);

        let useColumn = [];
        for (let i = 0; i < columns.length; i++) {
            let o = columns[i];
            let dataIndex = o['dataIndex'];
            o['listeners'] = {
                headerclick: function (header, column) {
                    console_logs('column ', column);
                    console_logs('column dataIndex', column.dataIndex);
                    gm.me().selectSortcond(column.dataIndex, column.text);
                }
            };

            if (dataIndex === 'num') {
                o["tdCls"] = 'custom-column-grey';
            }

            if (o['useYn'] === true) {
                if (lock_cnt > 0) {
                    o['locked'] = true;
                    lock_cnt--;
                }
                useColumn.push(o);
            }
        }

        let viewConfig = {
            stripeRows: true,
            markDirty: false,
            enableTextSelection: true,
            preserveScrollOnReload: this.isUsePreservedScrollOnReload()
        };

        if (this.rowClassFc != null) {
            viewConfig['getRowClass'] = this.rowClassFc;
        }

        let c;
        let max = useColumn.length;
        if (columnGroup != null && columnGroup.length) {
            c = [];
            let pos = 0;
            for (let n = 0; n < columnGroup.length; n++) {
                let o = columnGroup[n];
                o['columns'] = [];
                let arr = o['arr'];
                if (o['text'] != null) {
                    for (let m = 0; m < arr.length; m++) {
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
                    for (let m = 0; m < arr.length; m++) {
                        pos = arr[m];
                        c.push(useColumn[pos]);
                    }
                }
            }

        } else {
            c = useColumn;
        }

        if (vSYSTEM_TYPE === "HANARO") {
            switch (this.link) {
                case 'PPO1_PNL':
                    this.selCheckOnly = true;
                    break;
                default:
                    break;
            }
        }

        let selModel = {
            selType: 'checkboxmodel',
            mode: this.selMode === 'SINGLE' ? 'SINGLE' : 'multi',
            checkOnly: this.selCheckOnly,
            allowDeselect: this.selAllowDeselect
        };

        if (this.link === 'XDT3' || this.link === 'XDT6' || this.link === 'EPJ2_PLM2') {
            selModel = null;
        }

        let obj;

        if (this.usePagingToolbar === true) {

            let paging = Ext.create('Ext.PagingToolbar', {
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
                        gm.me().pageflag = true;
                    },
                    change: function () {
                        gm.me().pageflag = false;
                    }
                }

            });

            let pageArr = [paging];

            if (this.gridSumArr.length > 1) {

                for (let i = 0; i < this.gridSumArr.length; i++) {

                    if (i === 0) {
                        pageArr.push('->');
                    }
                    pageArr.push(this.gridSumArr[i]);
                }
                obj = {
                    store: store,
                    dockedItems: toolbars,
                    columns: c,
                    viewConfig: viewConfig,
                    selModel: selModel,
                    bbar: pageArr
                };
                this.loadedGridSumArr = true;

            } else {

                obj = {
                    store: store,
                    dockedItems: toolbars,
                    columns: c,
                    viewConfig: viewConfig,
                    selModel: selModel,
                    bbar: paging
                };
            }

        } else {
            obj = {
                store: store,
                selModel: selModel,
                dockedItems: toolbars,
                columns: useColumn,
                viewConfig: viewConfig
            };
        }

        if (this.useGotoToolbar === true) {
            obj['bbar'] = [
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
            for (let attrname in option) {
                obj[attrname] = option[attrname];
            }
        }

        if (this.bufferingStore === true) {
            obj['plugins'] = ['gridfilters',
                Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})
                , {
                    ptype: 'bufferedrenderer',
                    trailingBufferZone: 20,  // Keep 20 rows rendered in the table behind scroll
                    leadingBufferZone: 50   // Keep 50 rows rendered in the table ahead of scroll
                }];
        } else {

            let clicksToEditNum = 1;

            switch (this.link) {
                case 'XDT3':
                case 'SPC12':
                    clicksToEditNum = 2;
                    break;
                default:
                    break;
            }

            obj['plugins'] = ['gridfilters',
                Ext.create('Ext.grid.plugin.CellEditing',
                    {clicksToEdit: clicksToEditNum})];
        }

        if (obj['rowEdit']) {
            obj['plugins'] = [
                'gridfilters',
                Ext.create('Ext.grid.plugin.RowEditing', {
                    clicksToMoveEditor: 1,
                    autoCancel: false
                })
            ]
        }
        obj['loadMask'] = true;

        if (vExtVersion > 5) {
            let toolbars = obj['dockedItems'];

            if (toolbars !== null && toolbars !== undefined) {
                toolbars.splice(0, 0, gu.getExcelToolbar(this.id));
            }
        }

        if (!gm.useRefreshOnlyCenterPanel()) {
            window.location.hash.substr(1);
            obj['stateId'] = 'token';
            obj['stateful'] = true;
        }

        let grouper = obj.store.grouper;
        let grid = Ext.create('Rfx.base.BaseGrid', obj);
        grid.getStore().group(grouper);

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

        let toolbars = [];
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

    createSubGrid: function (tab_code, tab_title_name, option, toolbars) {

        let myStore = this.store_map[tab_code];
        let myColumn = this.columns_map[tab_code];
        let columnGroup = this.column_group_map[tab_code];

        if (myColumn != null) {
            console_logs('>>> subTabGridEach', this.subTabGridEach);
            if (this.subTabGridEach) {
                Ext.each(myColumn, function (columnObj) {
                    let dataIndex = columnObj["dataIndex"];
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

            return this.createGridCoreInner(toolbars, option, myStore, myColumn, columnGroup);
        } //endof myColunn if

    },

    insertAreaField: function (srchToolbar, field_id, fieldObj) {

        let srchId = gMain.getSearchField(field_id); // 'srch' + fieldObj.substring(0,1).toUpperCase()+ fieldObj.substring(1);

        let emptyText = fieldObj['emptyText'];
        let myEmptyText = (emptyText === undefined) ? gMain.getColNameByField(this.fields, field_id) : emptyText;

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
                        if (e.getKey() === Ext.EventObject.ENTER) {
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
                    let o1 = Ext.getCmp(this.getId());
                    o1.setValue('');

                },
                'onTrigger1Click': function () {
                    let o = Ext.get(this.getId());
                    let o1 = Ext.getCmp(this.getId());
                    let val = o1.getValue();

                    if (val != null && val !== '') {
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
                                let s = this.items.getAt(0).getValue();

                                let s1 = s.replace(/\r\n/gi, ';');
                                s1 = s1.replace(/\n/gi, ';');
                                win.target.setValue(s1);


                            },
                            'hide': function () {
                                console.info('just hidden');
                            }
                        }
                    });


                    this.win.show();
                }
            });
    },

    insertTextField: function (srchToolbar, field_id, field_obj) {
        let srchId = gMain.getSearchField(field_id);

        let myEmptyText;
        if (field_obj !== undefined && field_obj !== null) {
            let emptyText = field_obj['emptyText'];
            myEmptyText = (emptyText === undefined) ? gMain.getColNameByField(this.fields, field_id) : emptyText;
        } else {
            myEmptyText = gMain.getColNameByField(this.fields, field_id);
        }
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
                        if (e.getKey() === Ext.EventObject.ENTER) {

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
        let srchId = gMain.getSearchField(field_id);
        srchToolbar.push(
            new Ext.form.Hidden({
                cmpId: this.link + '-' + srchId,
                name: srchId
            })
        );
    },
    insertRadioField: function (srchToolbar, field_id, childObjs) {
        let srchId = gMain.getSearchField(field_id);
        let srchId_link = this.link + '-' + srchId;
        //hidden field.
        srchToolbar.push(new Ext.form.Hidden({cmpId: srchId_link, name: srchId}));

        let togGroup = 'tog' + field_id;
        //combo buttons.
        Ext.each(childObjs['items'], function (fieldObj) {

            let pressed = fieldObj['pressed'];
            let text = fieldObj['text'];
            let value = fieldObj['value'];
            let width = fieldObj['width'];
            let name = fieldObj['name'];
            let checked = fieldObj['checked'];

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
                        let hiddenFrm = gm.me().getSearchWidget(srchId_link);//Ext.getCmp(srchId_link);
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
            let items = this.searchToolbar['items'];
            for (let i = 0; i < items['items'].length; i++) {
                let o = items['items'][i];
                if (o['cmpId'] === cmpId) {
                    return o;
                }
            }
        }

        if (this.searchToolbar1 != null) {
            let items1 = this.searchToolbar1['items'];
            for (let i = 0; i < items1['items'].length; i++) {
                let o = items1['items'][i];
                if (o['cmpId'] === cmpId) {
                    return o;
                }
                //console_logs('cmpId', items['items'][i]['cmpId']);
            }
        }

        if (this.searchToolbar2 != null) {
            let items2 = this.searchToolbar2['items'];
            for (let i = 0; i < items2['items'].length; i++) {
                let o = items2['items'][i];
                if (o['cmpId'] === cmpId) {
                    return o;
                }
                //console_logs('cmpId', items['items'][i]['cmpId']);
            }
        }

        if (this.searchToolbar3 != null) {
            let items3 = this.searchToolbar3['items'];
            for (let i = 0; i < items3['items'].length; i++) {
                let o = items3['items'][i];
                if (o['cmpId'] === cmpId) {
                    return o;
                }
            }
        }

        return null;
    },

    getCommandWidget: function (cmpId) {
        if (this.buttonToolbar != null && this.buttonToolbar.length > 0) {
            let items = this.buttonToolbar['items'];
            for (let i = 0; i < items['items'].length; i++) {
                let o = items['items'][i];
                if (o['cmpId'] === cmpId) {
                    return o;
                }
            }
        }
        return null;
    },


    insertDategangeField: function (srchToolbar, field_id, fieldObj) {
        let srchId = gMain.getSearchField(field_id);
        let srchId_link = this.link + '-' + srchId;

        let valSdate = fieldObj['sdate'];
        let valEdate = fieldObj['edate'];

        let labelWidth = fieldObj['labelWidth'] === undefined ? 48 : fieldObj['labelWidth'];

        let yyyymmdd = gUtil.yyyymmdd(valSdate) + ':' + gUtil.yyyymmdd(valEdate);

        srchToolbar.push(new Ext.form.Hidden({cmpId: srchId_link, name: srchId, value: yyyymmdd}));

        let s_date = srchId_link + '-s';
        let e_date = srchId_link + '-e';

        srchToolbar.push({
            xtype: 'label',
            width: labelWidth,
            text: fieldObj['text'],
            style: 'color:white;'
        });

        let disabled = fieldObj['disabled'] == null ? false : fieldObj['disabled'];
        let editable = fieldObj['editable'] == null ? true : fieldObj['editable'];

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
                    fn: function (a) {
                        if (a.focusTask !== undefined) {
                            gMain.changeDatespan(this['cmpId']);
                        }
                    }
                },
                change: function () {
                    gMain.changeDatespan(this['cmpId']);
                },
                specialkey: function (fieldObj, e) {
                    if (e.getKey() === Ext.EventObject.ENTER) {
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
                    fn: function (a) {
                        if (a.focusTask !== undefined) {
                            gMain.changeDatespan(this['cmpId']);
                        }
                    }
                },
                change: function () {
                    gMain.changeDatespan(this['cmpId']);
                },
                specialkey: function (fieldObj, e) {
                    if (e.getKey() === Ext.EventObject.ENTER) {
                        gm.me().redrawStore(true);
                    }
                }
            }
        });


    },
    insertDateField: function (srchToolbar, field_id, fieldObj) {
        let srchId = gMain.getSearchField(field_id);
        let srchId_link = this.link + '-' + srchId;

        let valdate = fieldObj['date'];

        let labelWidth = fieldObj['labelWidth'] === undefined ? 48 : fieldObj['labelWidth'];
        let yyyymmdd = gUtil.yyyymmdd(valdate);

        srchToolbar.push(new Ext.form.Hidden({cmpId: srchId_link, name: srchId, value: yyyymmdd}));

        let date = srchId_link + '-s';
        srchToolbar.push({
            xtype: 'label',
            width: labelWidth,
            text: fieldObj['text'],
            style: 'color:white;'
        });

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
                    fn: function () {
                        gMain.changeDate(this['cmpId']);
                    }
                }
            }
        });
    },

    insertMonthField: function (srchToolbar, field_id, fieldObj) {
        let srchId = gMain.getSearchField(field_id);
        let srchId_link = this.link + '-' + srchId;

        let valdate = fieldObj['date'];

        let labelWidth = fieldObj['labelWidth'] === undefined ? 48 : fieldObj['labelWidth'];
        let yyyymm = gUtil.yyyymm(valdate);

        srchToolbar.push(new Ext.form.Hidden({cmpId: srchId_link, name: srchId, value: yyyymm}));

        let date = srchId_link + '-s';
        srchToolbar.push({
            xtype: 'label',
            width: labelWidth,
            text: fieldObj['text'],
            style: 'color:white;'
        });

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
                    fn: function () {
                        gMain.changeDate(this['cmpId']);
                    }
                }
            }
        });
    },

    insertDistinctField: function (srchToolbar, field_id, fieldObj) {

        let srchId = gMain.getSearchField(field_id);

        let storeId = 'DistinctStore';
        let valueField = 'value';
        let innerTpl = '<div data-qtip="{value}">{label}</div>';
        let minChars = 1;

        let width = 130;
        let widthIn = fieldObj['width'];
        if (widthIn !== undefined && widthIn !== null) {
            width = widthIn;
        }
        let limit = fieldObj['limit'] === undefined ? 100 : limit;

        let mode = null;
        let queryMode = null;

        let storeName = 'Mplm.store.' + storeId;


        let opt = {hasNull: true};
        let params = fieldObj['params'];
        if (params !== undefined && params !== null) {
            for (let key in params) {
                opt[key] = params[key];
            }
        }

        let tableName = fieldObj['tableName'];
        let fieldName = fieldObj['fieldName'];

        let storeSrch = Ext.create(storeName, opt);
        storeSrch.getProxy().setExtraParam('parentCode', this.link);
        storeSrch.getProxy().setExtraParam('tableName', tableName);
        storeSrch.getProxy().setExtraParam('fieldName', fieldName);
        storeSrch.getProxy().setExtraParam('limit', limit);
        storeSrch.getProxy().setExtraParam('tableName', tableName);
        storeSrch.getProxy().setExtraParam('fieldName', fieldName);

        srchToolbar.push(
            new Ext.form.Hidden({
                cmpId: this.link + '-' + srchId + '_',
                name: this.link + '-' + srchId + '_'
            })
        );

        let myId = this.link + '-' + srchId;

        let emptyText = fieldObj['emptyText'];
        let myEmptyText = (emptyText === undefined) ? gMain.getColNameByField(this.fields, field_id) : emptyText;

        let myCombo = {
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
            fieldStyle: 'background-color: #EFFDDE; background-image: none;',
            listeners: {
                keyup: function (combo, e) {

                    combo.store.removeAll();
                    combo.queryMode = 'local';
                    let selected;

                    if (combo.getRawValue().length > 0) {
                        selected = '%' + combo.getRawValue() + '%';
                    } else {
                        selected = '';
                    }

                    let o = gm.me().getSearchWidget(combo['cmpId'] + '_');
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
                expand: function (combo) {
                    combo.queryMode = null;
                    combo.store.load();
                },
                beforeselect: function (combo, record) {
                    console_logs('beforeselect', record);
                    let order = record.get('order');
                    switch (order) {
                        case -3://필드값 없음.
                            this.picker.getSelectionModel().deselectAll();
                            let val = combo.getValue();
                            if (val !== '<NULL>') {
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
                            let values = [];
                            combo.store.each(function (rec) {
                                let order = rec.get('order');
                                let value = rec.get('value');
                                if (order > 0 && value != null && value !== '' && value !== '<NULL>') {
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

                    let selected = combo.getValue();

                    if (selected instanceof Array) {
                        let values = [];

                        let canAdd = false;
                        for (let i = 0; i < records.length; i++) {
                            let rec = records[i];
                            let value = rec.get('value');
                            //console_logs('value', value);
                            if (value != null && value !== '-' && value !== '*' && value !== '<NULL>') {
                                canAdd = true;
                            }
                            if (value === '<NULL>') {
                                values.push(rec);
                            }

                        }

                        if (canAdd) {
                            values = [];
                            for (let i = 0; i < records.length; i++) {

                                let rec = records[i];
                                let value = rec.get('value');
                                if (value != null && value !== '-' && value !== '*' && value !== '<NULL>' && value !== '') {
                                    values.push(rec);
                                }
                            }
                        }

                        combo.setValue(values);


                        let o = gm.me().getSearchWidget(combo['cmpId'] + '_');
                        if (o == null) {
                            //console_logs('myCombo', combo['cmpId'] + '_'  + ' 을 찾을 수 없어 값을 저장하지 않음.');
                        } else {
                            o.setValue(combo.getValue());
                        }

                        gm.me().setSearchCondition(combo['cmpId'], combo.getValue());

                    } else { //multi select가 아닌경우
                        //console_logs('Not an array', selected);

                        let o = gm.me().getSearchWidget(combo['cmpId'] + '_');
                        if (o == null) {
                            //console_logs('myCombo', combo['cmpId'] + '_'  + ' 을 찾을 수 없어 값을 저장하지 않음.');
                        } else {
                            o.setValue(selected);
                        }


                        gm.me().setSearchCondition(combo['cmpId'], combo.getValue());

                    }
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

        let srchId = gMain.getSearchField(field_id);

        let storeId = 'ConditionStore';

        let valueField = 'value';
        let innerTpl = '<div data-qtip="{value}">{label}</div>';
        let minChars = 1;
        let width = 130;
        let widthIn = fieldObj['width'];
        if (widthIn !== undefined && widthIn !== null) {
            width = widthIn;
        }
        let limit = fieldObj['limit'] === undefined ? 100 : limit;

        let mode = null;
        let queryMode = null;

        let storeName = 'Mplm.store.' + storeId;

        let opt = {hasNull: true};
        let params = fieldObj['params'];
        let wherelist = '';
        let counter = Object.keys(params).length;

        if (params !== undefined && params !== null) {
            for (let key in params) {
                opt[key] = params[key];
                wherelist += --counter > 0 ? key + ':' + params[key] + '|' : key + ':' + params[key];
            }
        }

        let tableName = fieldObj['tableName'];
        let fieldName = fieldObj['fieldName'];
        let sqlName = fieldObj['sqlName'];
        let emptyText = fieldObj['emptyText'];

        let storeSrch = Ext.create(storeName, opt);

        storeSrch.getProxy().setExtraParam('parentCode', this.link);
        storeSrch.getProxy().setExtraParam('tableName', tableName);
        storeSrch.getProxy().setExtraParam('fieldName', fieldName);
        storeSrch.getProxy().setExtraParam('limit', limit);
        storeSrch.getProxy().setExtraParam('sqlName', sqlName);
        storeSrch.getProxy().setExtraParam('wherelist', wherelist);
        storeSrch.getProxy().setExtraParam('tableName', tableName);
        storeSrch.getProxy().setExtraParam('fieldName', fieldName);

        srchToolbar.push(
            new Ext.form.Hidden({
                cmpId: this.link + '-' + srchId + '_',
                name: this.link + '-' + srchId + '_'
            })
        );

        let myId = this.link + '-' + srchId;
        let myEmptyText = (emptyText === undefined) ? gMain.getColNameByField(this.fields, field_id) : emptyText;

        let myCombo = {
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
            fieldStyle: 'background-color: #EFFDDE; background-image: none;',
            listeners: {
                keyup: function (combo, e) {

                    combo.store.removeAll();
                    combo.queryMode = 'local';
                    let selected;

                    if (combo.getRawValue().length > 0) {
                        selected = '%' + combo.getRawValue() + '%';
                    } else {
                        selected = '';
                    }

                    let o = gm.me().getSearchWidget(combo['cmpId'] + '_');
                    if (o != null) {
                        o.setValue(selected);
                    }

                    gm.me().setSearchCondition(combo['cmpId'], combo.getValue());

                    if (e.getKey() === e.ENTER) {
                        combo.queryMode = null;
                        combo.blur();
                        gm.me().redrawStore(true);
                    }
                },
                expand: function (combo) {
                    combo.queryMode = null;
                    combo.store.load();
                },
                beforeselect: function (combo, record) {
                    console_logs('beforeselect', record);
                    let order = record.get('order');
                    switch (order) {
                        case -3://필드값 없음.
                            //console_logs('필드값 없음', order);
                            this.picker.getSelectionModel().deselectAll();
                            let val = combo.getValue();
                            if (val !== '<NULL>') {
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
                            let values = [];
                            combo.store.each(function (rec) {
                                let order = rec.get('order');
                                let value = rec.get('value');
                                if (order > 0 && value != null && value !== '' && value !== '<NULL>') {
                                    values.push(rec.get('value'));
                                }
                            });
                            combo.setValue(values);
                            break;

                    }
                },
                afterrender: function () {
                    console_logs('이벤트', 'afterrender');
                },
                select: function (combo, records) {
                    console_logs('이벤트', 'select');
                    let selected = combo.getValue();

                    if (selected instanceof Array) {

                        let values = [];

                        let canAdd = false;
                        for (let i = 0; i < records.length; i++) {
                            let rec = records[i];
                            let value = rec.get('value');
                            if (value != null && value !== '-' && value !== '*' && value !== '<NULL>') {
                                canAdd = true;
                            }
                            if (value === '<NULL>') {
                                values.push(rec);
                            }

                        }

                        if (canAdd) {
                            values = [];
                            for (let i = 0; i < records.length; i++) {

                                let rec = records[i];
                                let value = rec.get('value');
                                if (value != null && value !== '-' && value !== '*' && value !== '<NULL>' && value !== '') {
                                    values.push(rec);
                                }
                            }
                        }
                        combo.setValue(values);


                        let o = gm.me().getSearchWidget(combo['cmpId'] + '_');
                        if (o != null) {
                            o.setValue(combo.getValue());
                        }

                        gm.me().setSearchCondition(combo['cmpId'], combo.getValue());

                    } else { //multi select가 아닌경우
                        let o = gm.me().getSearchWidget(combo['cmpId'] + '_');
                        if (o != null) {
                            o.setValue(selected);
                        }
                        gm.me().setSearchCondition(combo['cmpId'], combo.getValue());
                    }
                },
                activate: function () {
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

        let srchId = gMain.getSearchField(field_id);

        let storeId = fieldObj['store'];
        let arrField = fieldObj['fields'];
        let displayField = fieldObj['displayField'];
        let valueField = fieldObj['valueField'];
        let innerTpl = fieldObj['innerTpl'];
        let minChars = fieldObj['minChars'];
        let params = fieldObj['params'];
        let defaultValue = fieldObj['defaultValue'];
        let autoLoad = fieldObj['autoLoad'];
        let chainCombo = fieldObj['chainCombo'];

        if (minChars === undefined) {
            minChars = 1;
        }
        let width = 130;
        let widthIn = fieldObj['width'];
        if (widthIn !== undefined) {
            width = widthIn;
        }

        let storeSrch = null;
        let mode = null;
        let queryMode = null;
        if (storeId !== undefined && storeId !== null) {

            storeName = ((storeId.indexOf("Mplm.store.") > -1
                    || storeId.indexOf("Ext.data.Store")) > -1
                || storeId.indexOf("Rfx2.store.") > -1)
                ? storeId : 'Mplm.store.' + storeId;


            let opt = {hasNull: true};

            if (params !== undefined && params !== null) {
                Object.assign(params, opt);
            }

            let params = fieldObj['params'];
            if (params !== undefined && params !== null) {
                for (let key in params) {
                    opt[key] = params[key];
                }
            }

            storeSrch = Ext.create(storeName, opt);
            if (storeId === 'BuyerStore') {
                storeSrch['cmpName'] = field_id;
                storeSrch['minChars'] = 1;
            }
            queryMode = 'remote';
            mode = 'remote';
        } else if (arrField !== undefined && arrField !== null) {

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

            let myId = this.link + '-' + srchId;

            let emptyText = fieldObj['emptyText'];
            let myEmptyText = (emptyText === undefined) ? gMain.getColNameByField(this.fields, field_id) : emptyText;

            let myCombo = {
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
                    select: function (combo) {

                        let selected = combo.getValue();

                        let o = gm.me().getSearchWidget(combo['cmpId'] + '_');

                        if (o != null) {
                            o.setValue(selected);
                        }

                        gm.me().setSearchCondition(combo['cmpId'], combo.getValue());

                        if (chainCombo != null) {
                            let cb = gm.me().getSearchWidget(gm.me().link + '-' + gMain.getSearchField(chainCombo));

                            let cStore = cb.getStore();

                            cStore.getProxy().setExtraParam(field_id, selected);
                            cStore.load();
                        }
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

        let srchId = gMain.getSearchField(field_id);
        let srchId_link = this.link + '-' + srchId;
        //hidden field.
        srchToolbar.push(new Ext.form.Hidden({cmpId: srchId_link, name: srchId}));

        let togGroup = 'tog' + field_id;

        Ext.each(childObjs['items'], function (fieldObj) {

            let checked = fieldObj['checked'];
            let inputValue = fieldObj['inputValue'];
            let boxLabel = fieldObj['boxLabel'];

            srchToolbar.push(
                {
                    xtype: "checkbox",
                    toggleGroup: togGroup,
                    checked: checked,
                    boxLabel: boxLabel,
                    inputValue: inputValue,
                    cls: 'searchLabel',
                    handler: function (field, value) {
                        let hiddenFrm = gm.me().getSearchWidget(srchId_link);
                        hiddenFrm.setValue(value);
                        gm.me().redrawStore(true);
                    },
                    listeners: {
                        afterrender: function (combo) {
                            let value = combo.value;
                            let hiddenFrm = gm.me().getSearchWidget(srchId_link);
                            hiddenFrm.setValue(value);
                        }
                    }
                });
        });
    },

    parseFields: function (srchToolbar, fieldObj) {
        if (typeof fieldObj == 'string') { //text search
            this.insertTextField(srchToolbar, fieldObj);
            srchToolbar.push({xtype: 'tbspacer'});

        } else if (typeof fieldObj == 'object') { //combo search

            if (fieldObj['xtype'] === 'component') {
                srchToolbar.push(fieldObj);
            } else {
                let type = fieldObj['type'];

                if (type === undefined || type === null) {
                    type = 'combo';
                }

                let field_id = fieldObj['field_id'];
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
                if (type !== 'hidden') {
                    srchToolbar.push({xtype: 'tbspacer'});
                }

            }


        }//endof else if (typeof fieldObj == 'object')


    },
    gSearchField: null,
    makeSrchToolbar: function (menuName, arrField) {

        this.gSearchField = arrField;

        let srchToolbar = [];//초기화

        if (arrField != null && arrField.length > 0) {
            for (let i = 0; i < arrField.length; i++) {
                this.parseFields(srchToolbar, arrField[i]);
            }

        }//endofif

        return srchToolbar;
    },
//	distinctFilters: ['pj_name', 'specification'],

    highlightCellBase: function (o, system_code) {
        let reserved6 = o.get(system_code);
        let now_reserved6 = o.get('now_' + system_code);
        try {
            gm.me().highlightCell(o, now_reserved6, reserved6, system_code);
        } catch (e) {

        }

    },
    redrawCell: function (records) {
        Ext.each(records, function (o) {
            let arr = gm.me().highlightCodes;
            for (let i = 0; i < arr.length; i++) {
                gm.me().highlightCellBase(o, arr[i]);
            }

        });
    },
    highlightCodes: null,
    storeLoadCallback: function (records, store) {

        if (records == null) {
            return;
        }
        if (this.highlightCodes != null) {
            this.redrawCell(records);
        }

        let map = {};

        for (let i = 0; i < gUtil.getDistinctFilters().length; i++) {
            map[gUtil.getDistinctFilters()[i]] = [];
        }

        for (let i = 0; i < records.length; i++) {
            let rec = records[i];
            for (let j = 0; j < gUtil.getDistinctFilters().length; j++) {
                let key = gUtil.getDistinctFilters()[j];
                map[key].push(rec.get(key));
            }
        }

        let reqKey = 0;

        if (store.getProxy().getReader().rawData !== undefined) {
            reqKey = store.getProxy().getReader().rawData.reqKey;
        }

        gm.me().reqKey = reqKey;


        if (gm.me().useGotoToolbar === true) {

            let count = store.getProxy().getReader().rawData.count;

            gm.me().setMaxNo(count);

            //console_logs('count', count);

            gm.me().refreshMaxNo();
        }

        //중복제거
        for (let i = 0; i < gUtil.getDistinctFilters().length; i++) {
            let key = gUtil.getDistinctFilters()[i];
            map[key] = gUtil.setUniqueArray(map[key]);
        }

        for (let j = 0; j < gUtil.getDistinctFilters().length; j++) {
            let key = gUtil.getDistinctFilters()[j];

            let datas = [];
            let arr = map[key];

            for (let i = 0; i < arr.length; i++) {
                let a = [];
                let val = arr[i];
                a.push(val);
                a.push(val);
                datas.push(a);

            }

            let simData = {};
            simData[key] = {
                data: datas,
                stype: 'json'
            };

            try {
                this.simManager.register(simData);
            } catch (e) {
            }
        }

        this.storeLoadCallbackSub(records);

    },
    storeLoad: function (fc) {
        let start_time = new Date();

        let store = this.getStore();
        store.load({
            callback: function (records) {

                if (gm.me().createAction !== undefined) {
                    Ext.getBody().unmask();
                    gm.me().createAction.enable();
                }

                if (fc != null) {
                    fc(records);
                }
            }
        });
    },

    settingValueSample: function (records) {
        console_logs('>>>settingValueSample', records);
        if (records == null || records.length < 1) {
            return;
        }
        for (let i = 0; i < records.length; i++) {
            let rec = records[i];
            let h_reserved11 = rec.get('h_reserved11');
            let h_reserved12 = rec.get('h_reserved12');
            let type = rec.get('sg_code');
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

            let sumbomqty = 0;
            let sumbommass = 0;
            let sumpoqty = 0;
            let sumpomass = 0;
            let totalprice = 0;


            for (let i = 0; i < records.length; i++) {
                sumbomqty += records[i].get('bm_quan');
                sumbommass += records[i].get('reserved_double1');
                sumpoqty += records[i].get('quan');
                sumpomass += records[i].get('mass');
                if (records[i].get('h_reserved85') !== undefined && records[i].get('h_reserved85') != null) {
                    totalprice += records[i].get('h_reserved85').replace(/,/g, '') * 1;
                }
            }

            console_logs('sumbomqty', sumbomqty);
            console_logs('sumbommass', sumbommass);
            console_logs('sumpoqty', sumpoqty);
            console_logs('sumpomass', sumpomass);

            Ext.get(gu.id('targetSumbom1' + (gm.me().multi_grid_id != null ? gm.me().multi_grid_id : ''))).update('BOM총수량 : ' + sumbomqty);
            Ext.get(gu.id('targetSumbom2' + (gm.me().multi_grid_id != null ? gm.me().multi_grid_id : ''))).update('BOM총중량 : ' + sumbommass.toFixed(2));
            Ext.get(gu.id('targetSumPo1' + (gm.me().multi_grid_id != null ? gm.me().multi_grid_id : ''))).update('PO총수량 : ' + sumpoqty);
            Ext.get(gu.id('targetSumPo2' + (gm.me().multi_grid_id != null ? gm.me().multi_grid_id : ''))).update('PO총중량 : ' + sumpomass.toFixed(2));
        } else {
            Ext.get(gu.id('targetSumbom1' + (gm.me().multi_grid_id != null ? gm.me().multi_grid_id : ''))).update('BOM총수량 : 0');
            Ext.get(gu.id('targetSumbom2' + (gm.me().multi_grid_id != null ? gm.me().multi_grid_id : ''))).update('BOM총중량 : 0');
            Ext.get(gu.id('targetSumPo1' + (gm.me().multi_grid_id != null ? gm.me().multi_grid_id : ''))).update('PO총수량 : 0');
            Ext.get(gu.id('targetSumPo2' + (gm.me().multi_grid_id != null ? gm.me().multi_grid_id : ''))).update('PO총중량 : 0');
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
        let multisort = gu.getCmp('sortCond-multisort');
        let sortCond = multisort == null ? '' : multisort.getValue();

        gm.me().getStore().getProxy().setExtraParam('sortCond', sortCond);

        try {
            let store = gm.me().getStore();
            // Remove default sorting
            store.sorters.clear();

            try {

                if (sortCond != null && sortCond !== '') {

                    let sorters = [];
                    let arr = sortCond.split(':');
                    for (let i = 0; i < arr.length; i++) {

                        let cond = arr[i];
                        let arr1 = cond.split(' ');
                        sorters.push({
                            property: arr1[0],
                            direction: arr1[1]
                        })

                    }

                    store.setSorters(sorters);

                }
            } catch (e) {

            }

            for (let i = 0; i < this.searchField.length; i++) {
                let type = 'text';
                let key = this.searchField[i];
                if (typeof key == 'object') {
                    let myO = key;
                    key = myO['field_id'];
                    type = myO['type'];
                }

                let srchId = this.link + '-' + gMain.getSearchField(key);
                let value = null;
                let value1 = null;
                try {
                    let o = this.getSearchWidget(srchId);
                    if (o != null) {
                        value = o.getValue();
                    }
                    let o1 = this.getSearchWidget(srchId + '_')
                    if (o1 != null) {
                        value1 = o1.getValue();
                    }
                } catch (e) {
                }

                if (value1 != null && value1 !== '') {//콤보박스 히든밸류
                    this.getStore().getProxy().setExtraParam(key, value1);
                } else {
                    if (key != null && key !== '' && value != null && value.length > 0) {
                        if (type === 'area' || key === 'unique_id' || key === 'barcode' || typeof key == 'object') {
                            this.getStore().getProxy().setExtraParam(key, value);
                        } else {
                            let enValue = Ext.JSON.encode('%' + value + '%');
                            this.getStore().getProxy().setExtraParam(key, enValue);
                        }//endofelse

                    } else {//endofif
                        this.getStore().getProxy().setExtraParam(key, null);
                    }

                }
            }
            this.storeLoad();
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

        let items = this.getFieldList();

        console_logs('getInputTarget itens', items);

        for (let i = 0; i < items.length; i++) {
            let o = items[i];
            let compName = o['name'];
            if (compName === key) {
                return o;
            }
        }
        return null;

    },
    getInputTarget: function (key, subKey) {
        let keyLen = (subKey === null || subKey === undefined) ? 2 : 3;

        let items = this.getFieldList();

        for (let i = 0; i < items.length; i++) {
            let name = items[i]['name'];
            name = name.split('|')[1];
        }

        for (let i = 0; i < items.length; i++) {
            let o = items[i];
            let compName = o['name'];
            let arr = compName.split('|');
            let curLen = arr.length;
            if (curLen < 2) {
                return null;
            } else {
                let name = arr[1];
                if (keyLen === curLen) {
                    if (keyLen === 2) {
                        if (name === key) {
                            return o;
                        }
                    } else { //keyLen == 3
                        let order = arr[2];
                        if (name === key && order === subKey) {
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

        let store = gm.me().getStore();
        let selections = gm.me().grid.getSelectionModel().getSelection();
        let unique_ids = [];
        for (let i = 0; i < selections.length; i++) {
            let rec = selections[i];
            let uid = rec.get('unique_id');
            console_logs('=====>uid', uid);
            unique_ids.push(uid);
            console_logs('=====>unique_ids', unique_ids);
        }

        store.getProxy().setExtraParam("srch_type", 'excelPrint');
        store.getProxy().setExtraParam("srch_fields", 'major');
        store.getProxy().setExtraParam("srch_rows", 'all');
        store.getProxy().setExtraParam("menuCode", gm.me().link);
        store.getProxy().setExtraParam("unique_ids", unique_ids);

        try {
            gm.me().excelPrintFc();
        } catch (e) {
        }

    },
    excelPrintFc: function () {

        let arrField = this.gSearchField;
        let store = this.grid.getStore();

        try {
            Ext.each(arrField, function (fieldObj) {

                console_log(typeof fieldObj);

                let dataIndex;

                if (typeof fieldObj == 'string') { //text search
                    dataIndex = fieldObj;
                } else {
                    dataIndex = fieldObj['field_id'];
                }

                let srchId = gMain.getSearchField(dataIndex);
                let value = Ext.getCmp(srchId).getValue();

                if (value != null && value !== '') {
                    if (dataIndex === 'unique_id' || typeof fieldObj == 'object') {
                        store.getProxy().setExtraParam(dataIndex, value);
                    } else {
                        let enValue = Ext.JSON.encode('%' + value + '%');
                        console_info(enValue);
                        store.getProxy().setExtraParam(dataIndex, enValue);
                    }//endofelse
                }//endofif

            });
        } catch (noError) {
        }


        store.load({
            scope: this,
            callback: function () {
                let excelPath = store.getProxy().getReader().rawData.excelPath;
                if (excelPath != null && excelPath.length > 0) {
                    top.location.href = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
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
        if (this.togToast) {
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
        records.forEach(function (rec) {

            if (checked === true) {
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

        let line = '';
        for (let i = 0; i < this.fields.length; i++) {
            let o = this.fields[i];
            let dataIndex = o['name'];

            let value = rec.get(dataIndex);
            if (value !== undefined) {
                if (line === '') {
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
        let title = subject == null ? '전체' : subject;
        let g = this.getGrid();
        let selections = g.getSelectionModel().getSelection();
        let txt = '<값 없음>';
        let num = 0;
        if (selections != null && selections.length > 0) {
            for (let i = 0; i < selections.length; i++) {
                let rec = selections[i];
                let v = dataIndex == null ? this.getRecordLine(rec) : rec.get(dataIndex);
                if (v != null && v !== '') {
                    if (txt === '<값 없음>') {
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
                value: txt
            });
        } else {
            Ext.Msg.alert('안내', '먼저 값복사 할 레코드를 선택하세요.');

        }


    },
    //editAjax count
    recCount: 0,

    itemdblclick: function (view, record) {
        gm.me().dblclickedRecord = record;
    },
    jumpToRow: function () {
        let grid = this.getGrid();
        let fld = grid.down('#gotoLine');
        let pos = fld.getValue() - 1;

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

        let grid = this.getGrid();
        let fld = grid.down('#maxNo');
        let value = '레코드 갯수: ' + this.maxNo;

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
    callbackLoadCenterPanel: function (cebterPanel, panel) {

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
            for (let i = 0; i < fields.items.length; i++) {
                let item = fields.items[i];
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

    tabNextFieldWithSet: function (e, cols) {

        let curFieldSetNum;
        let tabFieldSet;
        let newTabFieldSet = [];

        if (cols === 1) {
            tabFieldSet = e.ownerCt.ownerCt.items.items;
            curFieldSetNum = e.ownerCt.name;
        } else {
            tabFieldSet = e.ownerCt.ownerCt.ownerCt.ownerCt.items.items;
            curFieldSetNum = e.ownerCt.ownerCt.ownerCt.name;
        }

        for (let k = 0; k < tabFieldSet.length; k++) {
            if (tabFieldSet[k].xtype === 'fieldset') {
                newTabFieldSet.push(tabFieldSet[k]);
            }
        }

        for (let k = 0; k < newTabFieldSet.length; k++) {

            let arrFieldSet = newTabFieldSet[k];
            if (curFieldSetNum === arrFieldSet.name) {

                let nextFieldSetNum = null;

                if (k === newTabFieldSet.length - 1) {
                    nextFieldSetNum = newTabFieldSet[0].items.items;
                } else {
                    nextFieldSetNum = newTabFieldSet[k + 1].items.items;
                }

                let firstItem = nextFieldSetNum[0];
                if (firstItem.xtype === 'container') {

                    let innerFirstItem = firstItem.items.items[0];

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

        let curFieldSetNum;
        let tabFieldSet;
        let newTabFieldSet = [];

        if (cols === 1) {
            tabFieldSet = e.ownerCt.ownerCt.items.items;
            curFieldSetNum = e.ownerCt.id;
        } else {
            tabFieldSet = e.ownerCt.ownerCt.ownerCt.items.items;
            curFieldSetNum = e.ownerCt.ownerCt.id;
        }

        for (let k = 0; k < tabFieldSet.length; k++) {
            if (tabFieldSet[k].xtype !== 'hiddenfield' && !tabFieldSet[k].id.includes("formItemHidden")) {
                newTabFieldSet.push(tabFieldSet[k]);
            }
        }

        for (let k = 0; k < newTabFieldSet.length; k++) {

            let arrFieldSet = newTabFieldSet[k];

            if (curFieldSetNum === arrFieldSet.id) {

                let nextFieldSetNum = null;

                if (k === newTabFieldSet.length - 1) {
                    nextFieldSetNum = newTabFieldSet[0].items.items;
                } else {
                    nextFieldSetNum = newTabFieldSet[k + 1].items.items;
                }

                let firstItem = nextFieldSetNum[0];
                if (firstItem.xtype === 'container') {
                    let innerFirstItem = firstItem.items.items[0];

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
        let select = this.grid.getSelectionModel().getSelection()[0];
        let nation = select.get('egci_code');
        let SO_TYPE = select.get('class_code');
        let PRD_TYPE = select.get('prd_code');
        Ext.getCmp('nation').setValue(nation);
        Ext.getCmp('SO_TYPE').setValue(SO_TYPE);
        Ext.getCmp('PRD_TYPE').setValue(PRD_TYPE);
    },

    sortGrid: null,
    gridContextMenu: function (grid) {
        gm.me().sortGrid = grid;

        return Ext.create('Ext.menu.Menu', {
            items: [
                this.listSortAction
            ]
        });
    },

    listSortAction: Ext.create('Ext.Action', {
        xtype: 'button',
        text: '정렬설정',
        iconCls: 'fa-typcn-th-list-outline_14_0_5395c4_none',
        handler: function (grid) {
            let sortWin = Ext.create('ModalWindow', {
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
                    handler: function () {
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

    sortLeftForm: function () {
        let LEFT_FORM_COLUMN = [
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

        let columns = gm.me().sortGrid.columns;

        for (let i = 0; i < columns.length; i++) {
            let col = columns[i];
            let new_col = {fields: col.text, dataIndex: col.dataIndex};

            gm.me().leftSortStore.add(new_col);
        }

        return Ext.create('Ext.grid.Panel', {
            id: vCUR_MENU_CODE + gu.id('left_form'),
            store: gm.me().leftSortStore,
            multiSelect: true,
            stateId: vCUR_MENU_CODE + gu.id('left_form'),
            selModel: Ext.create("Ext.selection.CheckboxModel", {mode: 'multi'}),
            autoHeight: true,
            filterable: true,
            height: 500,
            region: 'center',
            columns: /*(G)*/LEFT_FORM_COLUMN,
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
            }
        });
    },

    sortRightForm: function () {
        let RIGHT_FORM_COLUMN = [
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

        let rightGrid = Ext.create('Ext.grid.Panel', {
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
                cellClick: function (ctx, td, cellIndex) {
                    let row = rightGrid.getSelectionModel().getSelection()[0];
                    let dataIndex = RIGHT_FORM_COLUMN[cellIndex - 1].dataIndex;
                    let cell = row.data[dataIndex];
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

        return {
            xtype: 'image',
            src: 'http://hosu.io/web_content75/images/default/button/soft_arrow_add.png',
            width: 50,
            height: 50,
            listeners: {
                el: {
                    click: function () {
                        let selects = Ext.getCmp(vCUR_MENU_CODE + gu.id('left_form')).getView().getSelectionModel().getSelection();

                        gm.me().leftSortStore.remove(selects);
                        let deault_len = gm.me().rightSortStore.data.items.length;
                        deault_len = deault_len * 10;
                        for (let i = 0; i < selects.length; i++) {
                            let select = selects[i];
                            deault_len = deault_len + 10;
                            let new_col = {
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
                        let selects = Ext.getCmp(vCUR_MENU_CODE + gu.id('right_form')).getView().getSelectionModel().getSelection();

                        gm.me().rightSortStore.remove(selects);
                        let deault_len = gm.me().leftSortStore.data.items.length;
                        for (let i = 0; i < selects.length; i++) {
                            let select = selects[i];
                            deault_len++;
                            let new_col = {fields: select.get('fields'), dataIndex: select.get('dataIndex')};
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
                    default:
                        return value;
                }
            default:
                return value;
        }
    },

    getMC: function (variableCode, falseMsg) {

        gMain.getMC(variableCode, falseMsg);
    },

    comboSetter: function (comboBox, value) {
        let record = comboBox.findRecordByValue(value);
        if (record != null) {
            comboBox.select(record);
        }
    },

    useValueCopyCombo: true, //값복사 사용
    useDivisionCombo: true,  //사업부 콤보 시용
    selectedSortComboCount: 3, //정렬 콤보 갯수
    selectedSortCombo: 0, //사용자가 선택한 정렬 콤보

    selectSortcond: function (dataIndex) {
        let combo = gu.getCmp('multisort' + (this.selectedSortCombo + 1) + 'combo');
        let v = combo.getValue();
        console_logs('v', v);
        if (v == null) {
            combo.getStore().load();
        }
        this.comboSetter(combo, dataIndex);
    }
});