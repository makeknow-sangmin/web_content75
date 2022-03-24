//설비현황
Ext.define('Rfx2.view.gongbang.equipState.MachineView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'machine-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            type: 'combo'
            , field_id: 'mchn_type'
            , emptyText: '라인유형'
            , store: "PcsLineTypeStore"
            , displayField: 'codeName'
            , valueField: 'systemCode'
            , value: 'mchn_type'
            , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
        });

        this.addSearchField('mchn_code');
        //this.addSearchField('name_ko');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStore('Rfx.model.Machine', [{
                property: 'name_ko',
                direction: 'ASC'
            }],
            gMain.pageSize
            , {}
            , ['pcsmchn']
        );

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr, function () {
        });


        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });

        this.counterResetActtion = Ext.create('Ext.Action', {
            itemId: 'counterResetActtion',
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '초기화',
            handler: function () {
                Ext.MessageBox.show({
                    title: '초기화',
                    msg: '카운터 초기화 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,

                    fn: function (btn) {
                        if (btn == 'yes') {
                            var select = gm.me().grid.getSelectionModel().getSelection()[0];
                            var reserved_varchar4 = select.get('reserved_varchar4');

                            var aggrs =
                                {
                                    "Ch": 0,
                                    "ClrCnt": 1
                                };
                            var aggrsJson = JSON.stringify(aggrs);

                            var url;
                            switch (reserved_varchar4) {
                                case '74-FE-48-56-1E-3E':
                                    url = 'http://112.170.204.50:6100';
                                    break;
                                case '74-FE-48-54-93-9F':
                                    url = 'http://112.170.204.50:6200';
                                    break;
                                case '74-FE-48-54-93-AB':
                                    url = 'http://112.170.204.50:6300';
                                    break;
                                case '74-FE-48-56-1E-72':
                                    url = 'http://112.170.204.50:6400';
                                    break;
                                case '74-FE-48-54-93-C0':
                                    url = 'http://112.170.204.50:6500';
                                    break;
                                case '74-FE-48-54-93-B6':
                                    url = 'http://112.170.204.50:6600';
                                    break;
                            }
                            url += '/di_value/slot_0/ch_0';

                            var name = 'root',
                                pass = '00000000'
                            token = "Basic " + window.btoa(name + ":" + pass);

                            var xhr = new XMLHttpRequest();
                            xhr.open('PATCH', url);
                            xhr.setRequestHeader('Authorization', token);
                            xhr.onload = function () {
                                if (this.status == 200) {
                                    Ext.MessageBox.show({
                                        title: '초가화',
                                        msg: '카운터 초기화가 완료되었습니다.'
                                    });
                                } else {
                                    Ext.MessageBox.show({
                                        title: '초가화',
                                        msg: '카운터 초기화가 실패하였습니다.'
                                    });
                                }
                            };
                            xhr.send(aggrsJson);
                            return false;
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                })
            }
        })

        buttonToolbar.insert(2, this.counterResetActtion);
    },
    items: []
});
