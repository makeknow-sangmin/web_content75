Ext.define('Rfx2.view.company.kbtech.produceMgmt.PackageClassificationCodeView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'package-classification-code-view',
    initComponent: function () {

        //this.initDefValue();

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.setDefComboValue('identification_code', 'valueField', 'PK');

        this.addSearchField('class_name');


        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.addCallback('CHECK_NAME', function (o) {

            var target = gm.me().getInputTarget('class_name');

            var className = target.getValue();

            var uppercode = className.toUpperCase();

            if (className.length < 1) {
                Ext.Msg.alert('안내', '코드는 한자리 이상 영문으로 입력해주세요', function () {
                });
            } else {

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/admin/stdClass.do?method=checkName',
                    params: {
                        className: className,
                        identification_code: 'PK'
                    },
                    success: function (result, request) {
                        var resultText = result.responseText;
                        console_logs('uppercode', uppercode)
                        if (resultText == '0') {
                            Ext.Msg.alert('안내', '사용가능한 코드입니다', function () {
                            });
                            target.setValue(uppercode);
                        } else {
                            Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function () {
                            });
                            target.setValue('');
                        }
                    },
                    failure: extjsUtil.failureMessage
                }); //end of ajax
            }


        });  // end of addCallback


        //모델 정의
        this.createStore('Rfx2.model.company.kbtech.PackageClassificationCode', [{
                property: 'unique_id',
                direction: 'desc'
            }],
            gMain.pageSize/*pageSize*/
            , {}
            , ['claast']
        );

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.callParent(arguments);
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('identification_code', 'PK');
        this.store.load(function (records) {
        });
    },
    selectedClassCode: '',
    reflashClassCode: function (o) {
        this.selectedClassCode = o;
        var target_class_code = gm.me().getInputTarget('class_code');
        target_class_code.setValue(o);
        var target_parent_class_code = gm.me().getInputTarget('parent_class_code');
        target_parent_class_code.setValue(o);

    },
    items: []
});
