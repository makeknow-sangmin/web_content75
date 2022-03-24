var group_code = null;

var dept_name_combo = null;
var user_name_combo = null;
var membertype_combo = null;

//수주관리 메뉴
Ext.define('Rfx.view.produceMgmt.ProduceWeldMemberView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'produce-weld-member-view',
    inputBuyer : null,
    initComponent: function(){
    	
    	
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
		this.addSearchField('pj_name');
		

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.ProduceWeldMember', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	//Orderby list key change
        	// ordery create_date -> p.create로 변경.
	        ,{
	        	creator: 'project.creator',
	        	unique_id: 'project.unique_id'
	        }
//        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, ['pjmember']
	        );
        
        
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.createGrid(arr);
        
        //grid 생성.
        // this.createGrid(searchToolbar, dateToolbar,buttonToolbar);

 //remove the items, 신규등록과 삭제 버튼 활성화
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==3) {
            	buttonToolbar.items.remove(item);
      	  }
        });
        
        buttonToolbar.insert(7, '-');
        buttonToolbar.insert(7, this.setMisMatView);
        buttonToolbar.insert(7, this.setSubMatView);
        

        
        this.propDisplayProp = false;
        
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        
        
        });
        this.callParent(arguments);
        
        gMain.setCenterLoading(false);
        this.store.load(function(records){});
        

    },
    items: []
});

