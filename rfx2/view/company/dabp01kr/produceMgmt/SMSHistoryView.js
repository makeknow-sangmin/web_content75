Ext.define('Rfx2.view.company.dabp01kr.produceMgmt.SMSHistoryView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'sms-history-view',
    //items: [{html: '준비중인 페이지입니다.'}]
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
    	//검색툴바 추가
		this.addSearchField ('mail_to');

		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        //모델 정의
        this.createStore('Rfx.model.SMSHistory', [{
 	       	property: 'crate_date',
 	       	direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        );
        
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==2||index==3||index==4||index==5) {
            	buttonToolbar.items.remove(item);
      	  }
        });
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
        
        //디폴트 로딩
        gMain.setCenterLoading(false);
        this.store.load();

        

    }
});