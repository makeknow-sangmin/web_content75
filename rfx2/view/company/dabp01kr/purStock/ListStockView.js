//재고현황
Ext.define('Rfx2.view.company.dabp01kr.purStock.ListStockView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'list-stock-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가

		this.addSearchField('standard_flag');
		this.addSearchField('item_code');
		this.addSearchField('item_name');
		this.addSearchField('specification');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //모델 정의
        this.createStore('Rfx.model.ListStock', [{
	            property: 'create_date',
	            direction: 'DESC'
	        }],
	        /*pageSize*/
	        gMain.pageSize
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	//Orderby list key change
        	// ordery create_date -> p.create로 변경.
	        ,{
	        }
        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, ['']
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

        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==3||index==4||index==5) {
            	buttonToolbar.items.remove(item);
      	  }
        });
        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){});
    },
    items : []
});
