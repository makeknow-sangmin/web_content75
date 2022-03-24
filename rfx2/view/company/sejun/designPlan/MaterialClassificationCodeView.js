Ext.define('Rfx2.view.company.sejun.designPlan.MaterialClassificationCodeView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'material-classification-code-view',
    //items: [{html: 'Rfx.view.criterionInfo.ProductClassificationCodeView'}],
    initComponent: function () {

        //this.initDefValue();

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.setDefComboValue('identification_code', 'valueField', 'MT');

        // this.addSearchField(
        //     {
        //         //type: 'combo',
        //         field_id: 'level1'
        //         , store: 'CommonCodeStore'
        //         , displayField: 'codeName'
        //         , valueField: 'code_name_en'
        //         , params: {parentCode: 'CLAAST_LEVEL_MAT'}
        //         , innerTpl: '{codeName}'
        //     });

        this.addSearchField(
            {
                type: 'combo',
                field_id: 'class_code'
                , store: 'ClaastStore'
                , displayField: 'class_name'
                , valueField: 'class_code'
                , params: {level1: '1', identification_code: 'MT'}
                , innerTpl: '[{class_code}]{class_name}'
            });


		// this.addSearchField (
		// {
		// 	type: 'combo',
		// 	field_id: 'class_code1'
		// 	,store: 'ClaastStorePD' 
		// 	,displayField: 'class_name'
		// 	,valueField: 'class_code'
		// 	,params:{identification_code: 'MT', level1: 1}
		// 	,innerTpl	: '<div data-qtip="{class_code}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>'
		// });

//		this.addSearchField (
//				{
//					type: 'combo',
//					field_id: 'class_code2'
//					,store: 'ClaastStorePD' 
//					,displayField: 'class_name'
//					,valueField: 'class_code'
//					,params:{identification_code: 'MT', level1: 2}
//					,innerTpl	: '<div data-qtip="{class_code}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>'
//				});
//
//		this.addSearchField (
//				{
//					type: 'combo',
//					field_id: 'class_code3'
//					,store: 'ClaastStorePD' 
//					,displayField: 'class_name'
//					,valueField: 'class_code'
//					,params:{identification_code: 'MT', level1: 3, parent_class_code: '0A1'}
//					,innerTpl	: '<div data-qtip="{class_code}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>'
//				});
        //this.addSearchField('class_code');
        this.addSearchField('class_name');


        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.addCallback('CHECK_CODE', function (o) {
           // alert('탔어요');
            var target = gMain.selPanel.getInputTarget('class_code');

            var code = target.getValue();

            var uppercode = code.toUpperCase();

            //if(code == null || code == ""){
            if (code.length < 1) {
                Ext.Msg.alert('안내', '코드는 한자리 이상 영문으로 입력해주세요', function () {
                });
            } else {

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/admin/stdClass.do?method=checkCode',
                    params: {
                        code: code,
                        identification_code: 'MT'
                    },
                    success: function (result, request) {
                        var resultText = result.responseText;
                        console_logs('uppercode', uppercode)
                        if (resultText == '0') {
                            Ext.Msg.alert('안내', '사용가능한 코드입니다', function () {
                            });
//	            				gMain.selPanel.getInputTarget('checkCode').setValue(uppercode);
                            target.setValue(uppercode);
                        } else {
                            Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function () {
                            });
//	        					gMain.selPanel.getInputTarget('checkCode').setValue('');
                            target.setValue('');
                        }
                    },
                    failure: extjsUtil.failureMessage
                }); //end of ajax
            }


        });  // end of addCallback

        switch (vCompanyReserved4) {
            case 'KWLM01KR':
            case 'SKNH01KR':
            case 'KBTC01KR':
            case 'CHMR01KR':
            case 'KMCA01KR':
            case 'SJFB01KR':
                break;
            default:

                this.addFormWidget('입력항목', {
                    tabTitle: "입력항목",
                    id: 'AMC4_SEW2_LV1',
                    xtype: 'combo',
                    text: '대분류코드',
                    name: 'level1',
                    storeClass: 'ClaastStorePD',
                    
                    params: {level1: 1, identification_code: "MT"},
                    displayField: "class_name",
                    valueField: "class_code",
                    innerTpl: "<div>[{class_code}] {class_name}</div>",
                    setNumber: 1,
                    setName: "분류코드",
                    setCols: 2,
                    listeners: {
                        select: function (combo, record) {
                            console_log('Selected Value : ' + combo.getValue());
                            console_logs('record : ', record);
                            var class_code = record.get('class_code');
                            var claastlevel2 = Ext.getCmp('AMC4_SEW2_LV2');
                            var claastlevel3 = Ext.getCmp('AMC4_SEW2_LV3');

                            claastlevel2.clearValue();
                            claastlevel2.store.removeAll();
                            claastlevel3.clearValue();
                            claastlevel3.store.removeAll();

                            claastlevel2.store.getProxy().setExtraParam('parent_class_code', class_code);
                            claastlevel2.store.load();
                            gMain.selPanel.reflashClassCode(class_code);

                        }
                    },
                    canCreate: true,
                    canEdit: true,
                    canView: true,
                    position: 'center'
                });

                this.addFormWidget('입력항목', {
                    tabTitle: "입력항목",
                    id: 'AMC4_SEW2_LV2',
                    xtype: 'combo',
                    text: '중분류코드',
                    name: 'level2',
                    storeClass: 'ClaastStorePD',
                    params: {level1: 2, identification_code: "MT"},
                    displayField: "class_name",
                    valueField: "class_code",
                    innerTpl: "<div>[{class_code}] {class_name}</div>",
                    setNumber: 1,
                    setName: "분류코드",
                    setCols: 2,
                    listeners: {
                        select: function (combo, record) {
                            console_log('Selected Value : ' + combo.getValue());
                            console_logs('record : ', record);
                            var class_code = record.get('class_code');
                            var claastlevel3 = Ext.getCmp('AMC4_SEW2_LV3');

                            claastlevel3.clearValue();
                            claastlevel3.store.removeAll();
                            claastlevel3.store.getProxy().setExtraParam('parent_class_code', class_code);
                            claastlevel3.store.load();

                            gMain.selPanel.reflashClassCode(class_code);

                        }
                    },
                    canCreate: true,
                    canEdit: true,
                    canView: true,
                    position: 'center'

                });
                this.addFormWidget('입력항목', {
                    tabTitle: "입력항목",
                    id: 'AMC4_SEW2_LV3',
                    xtype: 'combo',
                    text: '소분류코드',
                    name: 'level3',
                    storeClass: 'ClaastStorePD',
                    params: {level1: 3, identification_code: "MT"},
                    displayField: "class_name",
                    valueField: "class_code",
                    innerTpl: "<div>[{class_code}] {class_name}</div>",
                    setNumber: 1,
                    setName: "분류코드",
                    setCols: 2,
                    listeners: {
                        select: function (combo, record) {
                            console_log('Selected Value : ' + combo.getValue());
                            console_logs('record : ', record);
                            var class_code = record.get('class_code');


                            gMain.selPanel.reflashClassCode(class_code);

                        }
                    },
                    canCreate: true,
                    canEdit: true,
                    canView: true,
                    position: 'center'
                });
        }

        //모델 정의
        this.createStore('Rfx.model.MaterialClassificationCode', [{
                property: 'level1',
                direction: 'asc'
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
        this.store.getProxy().setExtraParam('orderBy', 'level1');
        this.store.getProxy().setExtraParam('ascDesc', 'ASC');
        this.store.load(function (records) {
        });
    },
    selectedClassCode: '',
    reflashClassCode: function (o) {
        this.selectedClassCode = o;
        var target_class_code = gMain.selPanel.getInputTarget('class_code');
        target_class_code.setValue(o);
        var target_parent_class_code = gMain.selPanel.getInputTarget('parent_class_code');
        target_parent_class_code.setValue(o);

    },
    items: []
});
