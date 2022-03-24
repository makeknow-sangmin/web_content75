//설비현황
Ext.define('Rfx2.view.company.dabp01kr.produceMgmt.MachineStateView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'machine-state-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
		//검색툴바 추가
		// this.addSearchField ({
		// 	type: 'date',
		// 	field_id: 'date',
		// 	text: "검색일자",
		// 	date: new Date()
		// });	

		// this.addSearchField (
		// 		{
		// 			field_id: 'pcs_code'
		// 			,store: 'ProcessNameStore'
		// 			,displayField: 'system_code'
		// 			,valueField: 'system_code'
		// 			//,width: 120
		// 			,innerTpl	: '<div data-qtip="{system_code}">[{system_code}] {codeName}</div>'
		// 		});	

		

		
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
// 		this.addSearchField('operator_name');
		

// //		this.addSearchField('pcs_code');
// 		this.addSearchField('name_ko');


		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
		
		(buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
		});

		console_logs('>>>> tooo', this.searchToolbar);

		this.searchToolbar.insert(0, {
            xtype:'label',
            width:50,
            text: '검색일자',
            style: 'color:white;'

        });

		this.searchToolbar.insert(1, {
			name: 'searchDate',
			id:'searchDate',
			format: 'Y-m-d',
			submitFormat: 'Y-m-d',// 'Y/m/d H:i:s',
			dateFormat: 'Y-m-d',// 'Y/m/d H:i:s'
			fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			allowBlank: true,
			xtype: 'datefield',
			value: new Date(),
			width: 120,
			listeners: {
                select: {
                    fn:function(a,b,c){
						var val = Ext.getCmp('searchDate').getValue();
						val = Ext.Date.format(val, 'Y-m-d');
						// val = val.split('T')[0];
						// val = '%' + val + '%';
						gm.me().store.getProxy().setExtraParam('date', "'" + val + "'");

                    }
                }
            }
		});
 
        this.createStore('Rfx.model.MchnManageMgmt', [{
	            // property: 'name_ko',
	            // direction: 'ASC'
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
