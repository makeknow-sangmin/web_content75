Ext.define('Rfx.view.projectTotal.ProjectTotalKwlm', {
    extend: 'Rfx.view.projectTotal.ProjectTotalBase224',
    alias: 'widget.projectTotal',

    
    initComponent: function(){
    	
    	var yyyy = (new Date()).getFullYear();
       	var title1 = yyyy + '년도 회사별<span> 매출 현황</span>(천원)';
       	
    	this.titles = [
    		title1,
            '월간 작업조별 <span>생산지표</span>',
            '<div class="title02"><span>' + '고객사별 매출' + '</span> 종합추이 (일) ' + '</div>',
            '<div class="title02"><span>' + '불량발생' + '</span> 종합추이 (일) ' + '</div>',
            '생산성(생산량 Kg)',
            '품질(불량건수)',
            'L/T(일)',
            '--',
    	];
    	
    	this.titleTable1_fields = [
            '주간합계',
            '월간합계',
            '분기합계',
            '반기합계',
            '계'
        ];
        
    	this.titleTable2_fields = [
            'No.',
            '작업조',
            '리드타임',
            '생산수량',
            '불량율'
        ];
    	
        
    	this.callParent(arguments);
    }
});