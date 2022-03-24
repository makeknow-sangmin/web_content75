/**
 * This example shows how to create a grid from Array data. The grid is stateful so you
 * can move or hide columns, reload the page, and come back to the grid in the same state
 * you left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('Rfx2.view.company.dabp01kr.criterionInfo.CarHistoryView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'car-history-view',
    initComponent: function(){
    	
    	//this.initDefValue();
		
    	//생성시 디폴트 값.
//		this.setDefValue('board_email', /*GLOBAL*/vCUR_EMAIL);
//		this.setDefValue('user_id', /*GLOBAL*/vCUR_USER_ID);
//		this.setDefValue('board_name', /*GLOBAL*/vCUR_USER_NAME);
//		this.setDefValue('board_count', 0); //Hidden Value임.
//		
//		this.setDefComboValue('gubun', 'valueField', '0');//ComboBOX의 ValueField 기준으로 디폴트 설정.

		//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		this.addSearchField (
		{
				field_id: 'gubun'
				,store: 'BoardGubunStore'
				,displayField: 'codeName'
				,valueField: 'systemCode'
				,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}] {codeName}</div>'
		});	
		this.addSearchField('unique_id');
		this.addSearchField('board_title');
		this.addSearchField('board_content');
		
		this.addSearchField('board_name');
		this.addSearchField('user_id');
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //모델 정의
        this.createStore('Rfx.model.Board', [{
	            property: 'create_date',
	            direction: 'DESC'
	        }],
	        /*pageSize*/
	        gMain.pageSize
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	//Orderby list key change
        	// ordery create_date -> p.create로 변경.
	        ,{
	        	board_content: 'b.board_content',
	        	board_count: 'b.board_count',
	        	board_email: 'b.board_email',
	        	board_title: 'b.board_title',
	        	create_date: 'b.create_date',
	        	creator: 'b.creator',
	        	gubun: 'b.gubun',
	        	unique_id: 'b.unique_id',
	        	user_id: 'b.user_id'
	        }
        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, ['board']
	        );

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        
        //입력/상세 창 생성.
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
