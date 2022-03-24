//설비현황
Ext.define('Rfx2.view.company.dabp01kr.equipState.MachineView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'machine-view',
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

		this.addFormWidget('입력항목', {
	     	   tabTitle:"입력항목", 
	     	   	id:	'owner_uid',
	            xtype: 'combo',
	            text: '책임자',
	            name: 'owner_uid',
	            storeClass: 'UserDeptStoreOnly',
	            params:{dept_code: '06'},
	            displayField: "user_name",
	            valueField: "unique_id", 
	            innerTpl: "<div>[{dept_name}] {user_name}</div>", 
	            listeners: {
			           select: function (combo, record) {
//			        	   var owner_uid	= gm.me().getInputJust('pcsmchn|owner_uid');
//			        	   owner_uid.setValue(record.get('unique_id'));
			        	   var owner_name	= gm.me().getInputJust('pcsmchn|owner_name');
			        	   owner_name.setValue(record.get('user_name'));
//			        	   var owner_id	= gm.me().getInputJust('pcsmchn|owner_id');
//			        	   owner_id.setValue(record.get('user_id'));
			           }
		        },
	            canCreate:   true,
	            canEdit:     true,
	            canView:     true,
	            position: 'center',
	            tableName: 'pcsmchn',
	            code_order:	160
	        }); 
		
		this.addFormWidget('입력항목', {
	     	   tabTitle:"입력항목", 
	     	   	id:	'operator_uid',
	            xtype: 'combo',
	            text: '현재조작자',
	            name: 'operator_uid',
	            storeClass: 'UserDeptStoreOnly',
	            params:{dept_code: '06'},
	            displayField: "user_name",
	            valueField: "unique_id", 
	            innerTpl: "<div>[{dept_name}] {user_name}</div>", 
	            listeners: {
			           select: function (combo, record) {
//			        	   var operator_uid	= gm.me().getInputJust('pcsmchn|operator_uid');
//			        	   operator_uid.setValue(record.get('unique_id'));
			        	   var operator_name	= gm.me().getInputJust('pcsmchn|operator_name');
			        	   operator_name.setValue(record.get('user_name'));
			        	   var operator_id	= gm.me().getInputJust('pcsmchn|operator_id');
			        	   operator_id.setValue(record.get('user_id'));
			           }
		        },
	            canCreate:   true,
	            canEdit:     true,
	            canView:     true,
	            position: 'center',
	            tableName: 'pcsmchn',
	            code_order:	160
	        }); 
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
 
        this.createStore('Rfx.model.Machine', [{
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
