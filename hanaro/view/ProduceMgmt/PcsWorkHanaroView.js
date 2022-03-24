Ext.define('Hanaro.view.produceMgmt.PcsWorkHanaroView', {
    extend: 'Hanaro.base.HanaroBaseView',
    xtype: 'pcswork-view',
    initComponent: function(){
    
        this.setDefValue('regist_date', new Date());
        this.setDefValue('user_id', /*GLOBAL*/vCUR_USER_ID);
		//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		this.addSearchField('user_id');
		this.addSearchField('pj_code');
		this.addSearchField('pcs_code');
        
        this.addSearchField({
            type: 'dateRange',
            field_id: 'regist_date',
            text: gm.getMC('CMD_Order_Date', '등록일자'),
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });
        // this.addSearchField('->');
        // this.addSearchField('-');
        this.addSearchField({
            type: 'label',
            field_id: 'elapsed_sum',
            text : '',
            width: 200
        });
        // this.addSearchField('-');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        (buttonToolbar.items).each(function(item,index,length){
            if(index==1||index==2||index==3||index==4||index==5) {
                buttonToolbar.items.remove(item);
            }
        });

        //모델 정의
        this.createStore('Hanaro.model.PcsWorkHanaro', [{
	            property: 'create_date',
	            direction: 'DESC'
	        }],
	        /*pageSize*/
	        gMain.pageSize
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	//Orderby list key change
        	//ordery create_date -> p.create로 변경.
	        ,{
	        }
        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, []
	        );

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        // for(var i=0; i< this.columns.length; i++) {

        //     var o = this.columns[i];
        //     //console_logs('this.columns' + i, o);

        //     var dataIndex = o['dataIndex'];

        //     switch(dataIndex) {
        //         case 'elapsed':
        //             o['summaryType'] = 'sum';
        //             o['summaryRenderer'] = function(value, summaryData, dataIndex) {
        //                 value = Ext.util.Format.number(value, '0,00.000/i');

        //                 value = '<div  style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;">'+value +'</font></div>'
        //                 return value;
        //             };
        //             break;
                
        //         default:

        //     }

        // }

        // var option = {
        //     features: [{
        //         ftype: 'summary'
        //     }]
        // };
        //grid 생성.
        this.createGrid(arr/*, option*/);
        
        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        this.callParent(arguments);
        
        gMain.setCenterLoading(false);
        this.store.load(function(records){ })

    },

    storeLoadCallback : function(records, store) {

        console_logs('===========> records', records);

        var sum = 0;
        if(records!=null) {
            for(var i=0; i<records.length; i++) {
                var rec = records[i];
                sum = sum + rec.get('elapsed');
            }
        }
        console_logs('sum: ', sum);
        var hour = parseInt(sum/3600);
        var min = parseInt((sum%3600)/60);
        var sec = sum%60;

        var srchId = gMain.getSearchField('elapsed_sum');

        var w = gm.me().getSearchWidget(this.link + '-' + srchId);
        w.update('작업시간 합계: <b>'+ hour +'</b>시간<b> ' + min + '</b>분 <b>' + sec + '</b>초'); 
    }
});
