Ext.define('Rfx2.view.company.dabp01kr.purStock.WearingCancleStateView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'wearingcancle-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
        switch(vCompanyReserved4) {
            case 'KYNL01KR':
                this.addSearchField({
                    type: 'condition',
                    width: 150,
                    sqlName: 'wgrast-gr-cancel',
                    tableName: 'a',
                    field_id: 'seller_name',
                    fieldName: 'seller_name',
                    params: {
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 150,
                    sqlName: 'wgrast-gr-cancel',
                    tableName: 'a',
                    field_id: 'account_code',
                    fieldName: 'account_code',
                    params: {
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 200,
                    sqlName: 'wgrast-gr-cancel',
                    tableName: 'a',
                    field_id: 'item_name',
                    fieldName: 'item_name',
                    params: {
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 150,
                    sqlName: 'wgrast-gr-cancel',
                    tableName: 'a',
                    field_id: 'gr_no',
                    fieldName: 'gr_no',
                    params: {
                    }
                });
                break;
            default:
                this.addSearchField('seller_name');
                this.addSearchField('account_code');
                this.addSearchField('item_name');
                this.addSearchField('gr_no');
        }

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.WarehousingCancelState', [{
	            property: 'unique_id',
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
