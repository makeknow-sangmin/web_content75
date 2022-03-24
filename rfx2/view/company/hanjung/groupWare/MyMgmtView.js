Ext.define('Rfx2.view.company.hanjung.groupWare.MyMgmtView', {
    extend: 'Rfx2.base.BaseView',
	xtype: 'inspect-category-def-view',
	n: 1,
	mySet: function(myN) {
		this.n = myN;
	},
    initComponent: function () {
		this.mySet(9);
		console_logs('my test this', this.n);
			//검색툴바 필드 초기화
	    	this.initSearchField();
            this.addSearchField('unique_id');
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
		        ,{  }
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
	       // this.createCrudTab();

	        Ext.apply(this, {
	            layout: 'border',
	            items: [this.grid,  this.crudTab]
            });
            this.callParent(arguments);
    }
});