/**
 * This example shows how to create a grid from Array data. The grid is stateful so you
 * can move or hide columns, reload the page, and come back to the grid in the same state
 * you left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('Rfx.view.equipState.AutoMoManage', {
    extend: 'Rfx.base.BaseView',
    xtype: 'carmanage-view',
    initComponent: function(){
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
        // this.addSearchField('system_code');
        // this.addSearchField('code_name_kr');
				
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

        //모델정의
        this.createStore('Rfx.model.CarMgnt', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        ,{}
	        , ['claast']
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
        this.store.load(function(records){
            for (var i = 0; i < records.length; i++) {
                var reserved_varchar5 = records[i].get('reserved_varchar5');

                var date = new Date();

                var year = date.getFullYear();

                var month = (date.getMonth() + 1);

                var day = date.getDate();

                if (month < 10) month = '0' + month;

                if (day < 10) day = '0' + day;

                var monthDay = month + '' + day;

                reserved_varchar5 = reserved_varchar5.replace('-', '').replace('-', '');

                var birthdayy = reserved_varchar5.substr(0, 4);

                var birthdaymd = reserved_varchar5.substr(4, 4);

                var age = monthDay < birthdaymd ? year - birthdayy - 1 : year - birthdayy;

                if(reserved_varchar5.length < 1) {
                    age = 0;
                }

                records[i].set('reserved_double3', age);
            }

            gm.me().store.sync();
        });
    },
    items : []
});
