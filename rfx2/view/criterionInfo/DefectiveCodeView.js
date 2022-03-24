Ext.define('Rfx2.view.criterionInfo.DefectiveCodeView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'defectiveCode-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		this.addSearchField('system_code');
        this.addSearchField('code_name_kr');
        if (this.useCodeZh()) this.addSearchField('code_name_zh');
		this.addSearchField('modify_ep_id');
		this.setDefValue('use_yn','Y');
		
		//Readonly Field 정의
		this.initReadonlyField();
		this.addReadonlyField('unique_id');
		this.addReadonlyField('create_date');
		this.addReadonlyField('creator');
		this.addReadonlyField('creator_uid');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		// 탭1 > 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //gMain.pageSize = 9999;
        this.localSize = 9999;
        // 탭1 > 메인스토어 생성
        this.createStore('Rfx.model.DefectiveCode', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
            this.localSize
	        ,{}
	        , ['code']
        );

        // 탭1 > 메인그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.createGrid(arr);

        // 탭1 > 메인그리드 하단 스크롤 생성
        this.grid.flex = 1;
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [
                this.grid, this.crudTab
            ]
        })


        // 탭1 > 메인그리드 선택 했을 시 콜백
        this.setGridOnCallback(function(selections){
            if (selections.length) {
            } else {

            }
        })

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){});
    },
    items : [],


    // 팝업창에서 호출되는 함수들
    // 제품군 추가
    addDefectiveSg: function (selections, val, win) {
        Ext.MessageBox.show({
            title:'등록',
            msg: '등록하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function(btn) {
                if(btn=='yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/quality/pcsQuality.do?method=addDefItemCls',
                        params:{
                            unique_id: selections.get('unique_id'),
                            old_role_code : selections.get('role_code'),
                            role_code : val['role_code'],
                            parent_system_code: selections.get('parent_system_code'),
                            system_code: selections.get('system_code'),
                            code_name_kr: selections.get('code_name_kr'),
                            code_name_en: selections.get('code_name_en'),
                            code_name_zh: selections.get('code_name_zh'),
                            description: selections.get('description'),
                            create_ep_id: selections.get('create_ep_id'),
                            use_yn: selections.get('use_yn'),
                            code_order: selections.get('code_order'),
                        },
                        success : function(result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gm.me().store.load();
                            gm.me().defectiveItemListStore.load();
                            if(win) {
                                win.close();
                            }
                        },
                        failure : extjsUtil.failureMessage
                    });//endof ajax request
                }
            },
            icon: Ext.MessageBox.QUESTION
        })
    },
    // 제품군 제거
    removeDefectiveSg: function (selections, val, win) {
        Ext.MessageBox.show({
            title:'제거',
            msg: '제거하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function(btn) {
                if(btn=='yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/quality/pcsQuality.do?method=removeDefItemCls',
                        params:{
                            unique_id: selections.get('unique_id'),
                            old_role_code : selections.get('role_code'),
                            role_code : val['role_code'],
                            parent_system_code: selections.get('parent_system_code'),
                            system_code: selections.get('system_code'),
                            code_name_kr: selections.get('code_name_kr'),
                            code_name_en: selections.get('code_name_en'),
                            code_name_zh: selections.get('code_name_zh'),
                            description: selections.get('description'),
                            create_ep_id: selections.get('create_ep_id'),
                            use_yn: selections.get('use_yn'),
                            code_order: selections.get('code_order'),
                        },
                        success : function(result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gm.me().store.load();
                            gm.me().defectiveItemListStore.load();
                            if(win) {
                                win.close();
                            }
                        },
                        failure : extjsUtil.failureMessage
                    });//endof ajax request
                }
            },
            icon: Ext.MessageBox.QUESTION
        })
    },

    useCodeZh: function() {
        switch (vCompanyReserved4) {
            case 'BIOT01KR':
                return true;
            default:
                return false;
        }
    }
});