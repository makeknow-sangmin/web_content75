Ext.define('Rfx.view.equipState.AutoMoDrivingDaily', {
    extend: 'Rfx.base.BaseView',
    xtype: 'car-driving-daily-view',
    initComponent: function(){

		//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
        this.addSearchField ({
            type: 'dateRange',
            field_id: 'run_date',
            text: "일자" ,
            sdate: Ext.Date.getFirstDateOfMonth(new Date()),
            edate: Ext.Date.getLastDateOfMonth(new Date())
        });

        this.addSearchField('req_name');
        this.addSearchField('shipping_car');
        this.addSearchField('shipping_place');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //모델 정의
        this.createStore('Rfx.model.AutoMoDrivingDaily', [{
                property: 'user_name',
                direction: 'ASC'
            }],
            gm.pageSize
            ,{}
            , ['carrun']
        );

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        arr.push(this.buttonToolbar3);
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
        gm.setCenterLoading(false);

		this.storeLoad(function(selections) {
            var total_price_sum = 0;
            for(var i=0; i<selections.length; i++) {
                var rec = selections[i];
                var shipping_price = rec.get('shipping_price');
                total_price_sum = total_price_sum + shipping_price;
            }
            
            gm.me().buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(total_price_sum));
        });

        this.grid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections != null && selections.length > 0) {
                    var total_price_sum = 0;
                    for(var i=0; i<selections.length; i++) {
                        var rec = selections[i];
                        var shipping_price = rec.get('shipping_price');
                        total_price_sum = total_price_sum + shipping_price;
                    }
                    
                    gm.me().buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(total_price_sum));
                } else {
                    var store = this.store;
                    var total_price_sum = 0;
                    for(var i=0; i<store.data.items.length; i++) {
                        var rec = store.data.items[i];
                        total_price_sum += rec.get('shipping_price');
                    }

                    gm.me().buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(total_price_sum));
                }
            }
        })

    },

    buttonToolbar3 : Ext.create('widget.toolbar', {
        items: [{
            xtype: 'tbfill'
        },{
            xtype: 'label',
            style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
            text: '총 금액 : 0'
        }]
    }),
});
