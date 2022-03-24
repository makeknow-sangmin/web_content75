//설비현황
Ext.define('Rfx.view.produceMgmt.MachineStateView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'machine-state-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		this.addSearchField (
				{
					field_id: 'pcs_code'
					,store: 'ProcessNameStore'
					,displayField: 'system_code'
					,valueField: 'system_code'
					//,width: 120
					,innerTpl	: '<div data-qtip="{system_code}">[{system_code}] {codeName}</div>'
				});	
/*		this.addSearchField (
				{
					field_id: 'owner_name'
					,store: 'UserStore'
					,displayField: 'user_name'
					,valueField: 'user_name'
					//,width: 120
					,innerTpl	: '<div data-qtip="{user_id}">[{dept_name}] {user_name}</div>'
				});	*/
//		this.setDefComboValue('owner_name', 'valueField', '[영업팀] test01');
		this.addSearchField('operator_name');
		

//		this.addSearchField('pcs_code');
		this.addSearchField('name_ko');


		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
 
        this.createStore('Rfx.model.CatonMgmt', [{
	            property: 'name_ko',
	            direction: 'ASC'
	        }],
	        gMain.pageSize/*pageSize*/
	        ,{}
        	,['pcsmchn']
	        );
        
        
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr, function(){});
        

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
