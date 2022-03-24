Ext.define('Rfx.view.criterionInfo.DeptView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'dept-view',
    initComponent: function(){
    	
    	this.initDefValue();
		
    	//생성시 디폴트 값.
		this.setDefValue('user_id', /*GLOBAL*/vCUR_USER_ID);

    	//**생성시 디폴트값
		// - 등록자
		// - 등록일
		// - 
		// 무조건 들어가야할 값 ***부서코드 ,부서명***
		
		
		//검색툴바 필드 초기화
    	this.initSearchField();
		this.addSearchField('dept_code');
		this.addSearchField('dept_name');
		if(vCompanyReserved4 === 'BIOT01KR') {
			this.addSearchField (
				{
					type: 'combo'
					,field_id: 'dept_class'
					,store: "Mplm.store.CodeYnStore"
					,displayField: 'codeName'
					,valueField: 'system_code'
					,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
				});
			// this.addSearchField('dept_class');
		}

		
		this.addCallback('CHECK_DIVISION_NAME', function(o, cur, prev){
			console_logs('CHECK_DIVISION_NAME', cur);
			console_logs('CHECK_o', o);
			console_logs('CHECK_prev', prev);
			
			var division_code = gMain.selPanel.getInputTarget('division_code');
			var division_name = gMain.selPanel.getInputTarget('division_name');
			
			console_logs('division_code', division_code);
			console_logs('division_name', division_name);
			division_name.setValue(cur.get('division_name'));
		});
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        //모델 정의
        this.createStore('Rfx.model.Dept', [{
	            property: 'dept_name',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        ,{
	        	unique_id: 'comdst.unique_id',
	        	company_code: 'comdst.company_code',
	        	dept_code: 'comdst.dept_code',
	        	dept_name: 'comdst.dept_name',
	        	dept_group: 'comdst.dept_group',
	        	create_date: 'comdst.create_date',
	        	creator: 'comdst.creator',
	        	change_date: 'comdst.change_date',
	        	changer: 'comdst.changer',
	        	change_reason: 'comdst.change_reason',
				dept_group_name: 'pcstpl.pcs_name'
	        }
        	,['comdst']
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