Ext.define('Rfx2.view.company.dabp01kr.criterionInfo.UserAuthorityConfigView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'userAuthorityconfig-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		this.addSearchField('child');
		this.addSearchField('display_name_ko');
		
		this.setDefValue('menu_perm', '*');
		
		//Readonly Field 정의
//		this.initReadonlyField();
//		this.addReadonlyField('unique_id');
//		this.addReadonlyField('create_date');
//		this.addReadonlyField('creator');
//		this.addReadonlyField('creator_uid');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        switch(vCompanyReserved4){
        case 'DOOS01KR':
	        (buttonToolbar.items).each(function(item,index,length){
	      	  if(index==1||/*index==2 ||*/index==3 ||index==4 ||index==5) {
	            	buttonToolbar.items.remove(item);
	      	  }
	        });
	        break;
	    default :  	
	        break;
        }

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.UserAuthorityConfig', [{
            property: 'display_name_ko',
            direction: 'ASC'
	        }],
	        gMain.pageSize/*pageSize*/,
	        {child: 'o.child',},
	        ['menuline']
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
