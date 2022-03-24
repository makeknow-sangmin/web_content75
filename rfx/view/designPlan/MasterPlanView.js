Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.tree.*',
    'Ext.tip.*',
    'Ext.ux.CheckColumn'
]);

//자재 관리
Ext.define('Rfx.view.designPlan.MasterPlanView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'master-plan-view',
    
    
    initComponent: function(){
    	 var sdate = Ext.Date.add(new Date(), Ext.Date.MONTH, -1);
         var edte = new Date();
         
     	//order by 에서 자동 테이블명 붙이기 켜기. 
     	this.orderbyAutoTable = true;
     	useMultitoolbar = false;
     	//검색툴바 필드 초기화
     	this.initSearchField();
     	//검색툴바 추가
     	

        this.addSearchField ({
            type: 'combo',
            emptyText:'월 선택',
            field_id: 'year_month'
            ,store: "YearMonthStore"
            ,displayField: 'second'
            ,valueField: 'first'
            ,innerTpl	: '<div data-qtip="{first}">{second}</div>'
        });

        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');

 		//명령툴바 생성
         var buttonToolbar = this.createCommandToolbar();
         
         //console_logs('this.fields', this.fields);
         this.createStore('Rfx.model.InnOutMonth', [{
	            property: 'item_code',
	            direction: 'ASC'
	        }],
	        gMain.pageSize/*pageSize*/
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
	        ,{
	        	item_code_dash: 's.item_code',
	        	comment: 's.comment1'
	        },
	        ['srcahd']
	        );
     
        
        //검색툴바 생성
       	var searchToolbar =  this.createSearchToolbar();
       	
        (buttonToolbar.items).each(function(item,index,length){
        	  if(index==1||index==2||index==3||index==4||index==5) {
              	buttonToolbar.items.remove(item);
        	  }
          });
        
        var columns = [];
        for(var i=0;i < this.columns.length; i++) {
            var o = this.columns[i];
            o['locked'] = true;
        	columns.push(o);
        }

        //column 셋팅
        var target = new Date();

        console_logs("Year  : ", target);
        console_logs("Month  : ", target.getMonth(-6));

        var months = [];

        for(var i=0; i< 12; i++){
            
            var month = {
                text : (i+1) + '월',
            }
            months.push(month);
        };

        columns.push({
            text: target.getFullYear() + '년',
            columns: months
        });

        columns.push({
            text: target.getFullYear()+1 + '년',
            columns: [{
                text :  '1월',
            },{
                text :  '2월',
            }]
        });
        //console_logs('----------------columns', columns);

        this.grid = Ext.create('Rfx.base.BaseGrid', {
            columns: columns,
            scroll:true,
            store: this.store,
            //layout: 'fit',
            //forceFit: true,
            dockedItems: [buttonToolbar, searchToolbar],
            viewConfig: {
                markDirty:false,
                stripeRows: true,
                enableTextSelection: false,
                preserveScrollOnReload: true,
                getRowClass: function(record, index) {
                    var recv_flag = record.get('recv_flag');
                    switch(recv_flag) {
                        case 'EM' :
                            return 'yellow-row';
                            break;
                        case 'SE':
                            return 'red-row';
                            break;
                    }

                }
            },
            listeners: {
                afterrender : function(grid) {
                    var elments = Ext.select(".x-column-header",true);
                    elments.each(function(el) {

                    }, this);

                }
            }

        });

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid]
        });

       //버튼 추가.
       buttonToolbar.insert(2, '-');

        this.callParent(arguments);
        
      //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            
             })

    },
    items : []
});



