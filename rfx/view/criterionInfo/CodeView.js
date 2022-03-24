Ext.define('Rfx.view.criterionInfo.CodeView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'code-view',
    //items: [{html: 'Rfx.view.criterionInfo.CodeView'}],
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
 
    	this.setDefComboValue('parent_system_code', 'valueField', '1');//ComboBOX의 ValueField 기준으로 디폴트 설정.
    	this.setDefComboValue('use_yn', 'valueField', 'Y');
    	this.setDefComboValue('discriptionSortable','displayField','true')
//    	this.setDefComboValue('role_code', 'string');
//    	this.setDefValue('descriptionWidth','100');
//    	this.setDefValue('input_type', '{xtype: "textfield"}');
//    	this.setDefValue('create_ep_id', '{tabTitle:"입력항목", tableName:"", position:"center"}');
//    	this.setDefValue('member_type', '{canEdit:true, canCreate:true, canView:true, size:100}');
//    	this.setDefValue('code_order', '100');

    	
		this.addSearchField({
				field_id:		'parent_system_code',
	            displayField:   'child',
	            valueField:     'child',
	            store: 			'MenuCodeStore',
                innerTpl: 		'<div>{child} - {display_name_ko} [{service_name}]</div>',
                width:500	
        });
	// 	this.addSearchField({
	// 			field_id:		'parent_system_code',
	//             displayField:   'system_code',
	//             valueField:     'system_code',
	//             store: 			'ParentMenuCodeStore',
	//             innerTpl: 		'<div>{parent_system_code} - {code_name_kr} [{systemCode}]</div>',
	//             width: 300
    // });
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();


        //모델 정의
        this.createStore('Rfx.model.Code', [{
            property: 'parent_system_code',
            direction: 'ASC'
	        }],
	        gMain.pageSize/*pageSize*/
	        ,{}
        ,['code']
	        );
				
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        this.callParent(arguments);
        
      //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){});

    },
    items : []
});