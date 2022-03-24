Ext.define('Hanaro.view.qualityInfo.DefectPDMgmtHanaroView', {
    extend: 'Hanaro.base.HanaroBaseView',
    xtype: 'defect-pd-mgmt',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가

        this.addSearchField('value_key');
        this.addSearchField('data_type');

		//Readonly Field 정의
		this.initReadonlyField();
		this.addReadonlyField('unique_id');
		this.addReadonlyField('create_date');
		this.addReadonlyField('creator');
		this.addReadonlyField('creator_uid');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        (buttonToolbar.items).each(function(item,index,length){
            if(index==1||index==2||index==3||index==4||index==5) {
                buttonToolbar.items.remove(item);
            }
    });
        //모델정의
        this.createStore('Hanaro.model.DefectHistoryHanaro', [{
	            property: 'create_date',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        ,{}
	        , ['docdata']
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
