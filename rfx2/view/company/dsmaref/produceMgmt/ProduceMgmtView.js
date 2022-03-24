Ext.define('Rfx2.view.company.dsmaref.produceMgmt.ProduceMgmtView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'produce-mgmt-view',
    initComponent: function() {

        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 추가
        this.addSearchField (
            {
                type: 'combo'
                ,field_id: 'status'
                ,store: "RecevedStateStore"
                ,displayField: 'codeName'
                ,valueField: 'systemCode'
                ,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
            });

        this.addSearchField ({
            type: 'dateRange',
            field_id: 'regist_date',
            text: gm.getMC('CMD_Order_Date', '등록일자'),
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -3),
            edate: new Date()
        });

        this.addSearchField('reserved_varchar6');

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS : ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });

        //모델을 통한 스토어 생성
        this.createStore('Rfx2.model.ProduceMgmt', [{
                property: 'create_date',
                direction: 'ASC'
            }],
            /*pageSize*/
            gMain.pageSize
            ,{}
            , ['cartmap']
        );

        this.prEstablishAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Production_Order', '계획수립'),
            tooltip: '생산 계획을 수립합니다',
            disabled: true,
            handler: function() {
                gm.me().producePlanOp();
            }
        });

        this.prExcelAction = Ext.create('Ext.Action', {
            iconCls: 'af-download',
            text: '엑셀생산계획표',
            tooltip: '엑셀생산계획표',
            disabled: true,
            handler: function() {

            }
        });

        buttonToolbar.insert(1, this.prEstablishAction);

        //그리드 생성
        Ext.each(this.columns, function(columnObj, index) {

            var o = columnObj;

            var dataIndex = o['dataIndex'];

            if(o['dataType'] === 'number') {
                o['summaryRenderer'] = function(value, summaryData, dataIndex) {
                    if(gm.me().store.data.items.length > 0) {
                        var summary = gm.me().store.data.items[0].get('summary');
                        if(summary.length > 0) {
                            var objSummary = Ext.decode(summary);
                            return Ext.util.Format.number(objSummary[dataIndex], '0,00/i');
                        } else {
                            return 0;
                        }
                    } else {
                        return 0;
                    }
                };
            }

        });

        var option = {
            features: [{
                ftype: 'summary',
                dock: 'top'
            }]
        };

        //그리드 생성
        this.createGrid(searchToolbar, buttonToolbar, option);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        this.grid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections.length == 1) {
                    gm.me().prEstablishAction.enable();
                } else {
                    gm.me().prEstablishAction.disable();
                }
            }
        });

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.store.load(function(records) {});
    },

    producePlanOp: function() {

        var arr = [];

        for(var i = 0; i < gUtil.mesTplProcessBig.length; i++) {

            var o = gUtil.mesTplProcessBig[i];
            console_logs('o', o);

            var pcsCode = o['code'];

            console_logs('pcsCode=', pcsCode);
            var o1 = gUtil.mesTplProcessAll;
            console_logs('o1=', o1);
            var subArr = o1[pcsCode];
            console_logs('subArr=', subArr);

            var pcsnames = '';

            for(var j = 0; j < subArr.length; j++) {
                var o2 = subArr[j];

                if(pcsnames!='') {
                    pcsnames = pcsnames + ' -> ';
                }
                pcsnames = pcsnames + o2['name'];
            }

            arr.push({
                inputValue: pcsCode,
                boxLabel: o['name'] /*+ '  (' + pcsnames +')'*/,
                name:'big_pcs_code',
                cls: 'font-gray',
                checked: (i == 0) ? true : false,
                listeners: {

                }
            });
        }

        var aStore = Ext.create('Mplm.store.DeptStore', {dept_group: 'PCO'});

        gm.me().requestform = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            // title:'공정 선택',
            frame: false ,
            border: false,
            bodyPadding: 10,
            region: 'center',
            layout: 'form',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '공정별 담당사(라인)와 작업지시일을 기재하시기 바랍니다.',
                    items: [
                        {
                            xtype: 'hiddenfield',
                            name: 'big_pcs_code',
                            value: this.grid.getSelectionModel().getSelection()[0].get('sp_code')
                        },
                        {
                            fieldLabel: '인서트',
                            xtype: 'combo',
                            anchor: '97%',
                            name: 'out_maker',
                            allowBlank: false,
                            id: gu.id('out_maker'),
                            mode: 'local',
                            displayField: 'dept_name',
                            store: aStore,
                            sortInfo: {field: 'create_date', direction: 'DESC'},
                            valueField: 'unique_id_long',
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
                                }
                            }
                        },
                        {
                            fieldLabel: '리터치',
                            xtype: 'combo',
                            anchor: '97%',
                            name: 'out_maker2',
                            allowBlank: false,
                            id: gu.id('out_maker2'),
                            mode: 'local',
                            displayField: 'dept_name',
                            store: aStore,
                            sortInfo: {field: 'create_date', direction: 'DESC'},
                            valueField: 'unique_id_long',
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
                                }
                            }
                        },
                        {
                            fieldLabel: '조립검사',
                            xtype: 'combo',
                            anchor: '97%',
                            name: 'out_maker3',
                            allowBlank: false,
                            id: gu.id('out_maker3'),
                            mode: 'local',
                            displayField: 'dept_name',
                            store: aStore,
                            sortInfo: {field: 'create_date', direction: 'DESC'},
                            valueField: 'unique_id_long',
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
                                }
                            }
                        },
                        {
                            xtype: 'datefield',
                            anchor: '97%',
                            name: 'aprv_date',
                            fieldLabel: '작업지시일',
                            format: 'Y-m-d',
                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            dateFormat: 'Y-m-d'// 'Y-m-d H:i:s'
                        },
                        {
                            xtype: 'textfield',
                            anchor: '97%',
                            name: 'specialNote',
                            fieldLabel: '특이사항'
                        }
                    ]
                }
            ]
        });

        var prWin =	Ext.create('Ext.Window', {
            modal : true,
            title: gm.getMC('CMD_Production_Order', '계획수립'),
            width: 450,
            height: 270,
            items: gm.me().requestform,
            buttons: [
                {text: CMD_OK,
                    scope:this,
                    handler:function(){

                        prWin.setLoading(true);

                        var form = gm.me().requestform.getForm();

                        console_logs('form value', form.getValues());

                        var val = form.getValues();

                        var selectedgrid = gm.me().grid.getSelectionModel().getSelection();
                        var lot_value = gm.me().grid.getSelectionModel().getSelection()[0].get('reserved_varchar6');

                        var cartmaparr =[];
                        var po_quan = 0;
                        var reserved_double4 = 0;
                        var selections = selectedgrid;

                        for(var i = 0; i< selections.length; i++) {
                            var rec = selections[i];
                            var uid =  rec.get('unique_id_long');  //CARTMAP unique_id
                            cartmaparr.push(uid);
                            var po_quan_unit = rec.get('quan');  // 소그룹 po 수량
                            console_logs('unit 수량', po_quan_unit);
                            po_quan = po_quan + po_quan_unit;
                            console_logs('po_quan 수량', po_quan);
                            var tmp_weight = rec.get('mass');   //  소그룹 po 중량
                            reserved_double4 = reserved_double4 + tmp_weight;
                            console_logs('중량', reserved_double4);
                        }
                        var order_com_unique = selections[0].get('order_com_unique');

                        console_logs('cartmaparr', cartmaparr);

                        var ac_uid = selections[0].get('ac_uid');

                        var out_makers = [];

                        out_makers.push(val['out_maker']);
                        out_makers.push(val['out_maker2']);
                        out_makers.push(val['out_maker3']);

                        Ext.Ajax.request({
                            url : CONTEXT_PATH + '/index/process.do?method=addProcessPlanWithOutMaker',
                            params:{
                                po_no: lot_value,
                                cartmap_uids: cartmaparr,
                                ac_uid: ac_uid,
                                reserved_varchar3 : val['big_pcs_code'],
                                bigPcsCodes : val['big_pcs_code'],
                                po_quan: po_quan,
                                reserved_double4 : reserved_double4,
                                order_com_unique : order_com_unique,
                                aprv_date: val['aprv_date'],
                                out_makers: out_makers,
                                reserved_varchar2: val['specialNote']
                            },
                            success: function(val, action){
                                if(prWin){
                                    prWin.setLoading(false);
                                    prWin.close();
                                }
                                gm.me().store.getProxy().setExtraParam('reserved_varchar3', gMain.selPanel.reserved_varchar3);
                                gm.me().store.load();
                            },
                            failure: function(val, action) {
                                if(prWin){
                                    prWin.setLoading(false);
                                    prWin.close();
                                }
                                gMain.selPanel.store.getProxy().setExtraParam('reserved_varchar3', gMain.selPanel.reserved_varchar3);
                                gMain.selPanel.store.load();
                            }
                        });

                    }},

                {text: CMD_CANCEL,
                    scope:this,
                    handler:function(){
                        if(prWin){
                            prWin.close();
                        }
                    }}
            ]
        });

        prWin.show();
    }
});