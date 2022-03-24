Ext.define('Rfx.view.ProduceMgmt', {
    extend: (vSYSTEM_TYPE == 'HANARO') ? 'Hanaro.base.HanaroBasePanel' : 'Rfx.base.BasePanel',
    alias: 'widget.produceMgmt',
    centerId: 'produceMgmtMain',
    initComponent: function(){
//    	var listMenu = null;
//    	switch(vSYSTEM_TYPE_SUB){
//    		case 'HEAVY4' :
//    			switch(vCompanyReserved4){
//    				case 'DDNG01KR' :
//    					listMenu = [
//    			    	    		{ id: 1, name: '생산계획 수립', 	link: 'EPC5',		classId: 'productplan-view', 	className: 'HEAVY4_ProducePlanView'},
//    			                    { id: 2, name: '생산작업지시',  		link: 'EPJ1',	classId: 'workorder-view', 		className: 'HEAVY4_WorkOrderView'},
//    			                    //{ id: 3, name: '조립계획 수립',  		link: 'EPC5_MES',	classId: 'paintplan-view', 		className: 'HEAVY4_PaintPlanView'},
//    			                    //{ id: 4, name: '조립작업지시',  		link: 'EPJ1_MES',	classId: 'paintorder-view', 		className: 'HEAVY4_PaintOrderView'},
//    			                    { id: 3, name: '생산현황 입력', 	link: 'EPC3',		classId: 'produceadjust-view',  className: 'HEAVY4_ProduceAdjustView'},
//    			                    { id: 4, name: '생산현황 조회', 	link: 'EPC7',		classId: 'completestate-view',  className: 'CompleteStateView'},
//    			                    { id: 5, name: '공정별현황', 	link: 'EPC4',		classId: 'produceadjust1-view',  className: 'HEAVY4_ProduceAdjustPcsView'},
//    			                    { id: 6, name: '외주별현황', 	link: 'EOC1',		classId: 'outproduce-view',     className: 'OutProduceView'},
//    			                    { id: 7, name: '제품검사',  		link: 'QTT4_MES',	classId: 'inspect-view', 		className: 'HEAVY4_InspectView'},
//    			                    { id: 8, name: '작업일지 입력',  		link: 'ESC1',			classId: 'work-resource-input', 		className: 'WorkResourceInputView'},
//    			                    { id: 9, name: '작업입력 실적',  		link: 'ESC2',			classId: 'work-resource', 		className: 'WorkResourceView'}
//    		                    ];
//    				break;
//    				case 'SWON01KR' :
//    					listMenu = [
//    			    	    		{ id: 1, name: '제품생산계획', 	link: 'EPC5_SEW',		classId: 'productplan-view', 	className: 'HEAVY4_SEW_ProducePlanView'},
//    			                    { id: 2, name: '제품작업지시',  		link: 'EPJ1',	classId: 'workorder-view', 		className: 'HEAVY4_WorkOrderView'},
//    			                    { id: 3, name: '자재생산계획',  		link: 'EPC5_SEW1',	classId: 'paintplan-view', 		className: 'HEAVY4_SEW_PaintPlanView'},
//    			                    { id: 4, name: '자재작업지시',  		link: 'EPJ1_MES',	classId: 'paintorder-view', 		className: 'HEAVY4_PaintOrderView'},
//    			                    { id: 5, name: '수주별 생산현황', 	link: 'EPC3',		classId: 'produceadjust-view',  className: 'HEAVY4_ProduceAdjustView'},
//    			                    { id: 6, name: '공정별 생산현황', 	link: 'EPC4',		classId: 'produceadjust1-view',  className: 'HEAVY4_ProduceAdjustPcsView'},
//    			                    { id: 7, name: '외주별 생산현황', 	link: 'EOC1',		classId: 'outproduce-view',     className: 'OutProduceView'},
//    			                    { id: 8, name: '생산 현황조회', 	link: 'EPC7',		classId: 'completestate-view',  className: 'CompleteStateView'},
//    			                    { id: 9, name: '제품검사',  		link: 'QTT4_MES',	classId: 'inspect-view', 		className: 'HEAVY4_InspectView'}
//    		                    ];
//    				break;
//    				case 'PNLC01KR' :
//    					listMenu = [
//    			    	    		{ id: 1, name: '제작계획수립', 	link: 'EPC5',		classId: 'productplan-view', 	className: 'HEAVY4_SEW_ProducePlanView'},
//    			                    { id: 2, name: '제작작업지시',  		link: 'EPJ1',	classId: 'workorder-view', 		className: 'HEAVY4_WorkOrderView'},
//    			                    { id: 5, name: '수주별 생산현황', 	link: 'EPC3',		classId: 'produceadjust-view',  className: 'HEAVY4_ProduceAdjustView'},
//    			                    { id: 6, name: '공정별 생산현황', 	link: 'EPC4',		classId: 'produceadjust1-view',  className: 'HEAVY4_ProduceAdjustPcsView'},
//    			                    { id: 7, name: '외주별 생산현황', 	link: 'EOC1',		classId: 'outproduce-view',     className: 'OutProduceView'},
//    			                    { id: 8, name: '생산 현황조회', 	link: 'EPC7',		classId: 'completestate-view',  className: 'CompleteStateView'},
//    			                    { id: 9, name: '제품검사',  		link: 'QTT4_MES',	classId: 'inspect-view', 		className: 'HEAVY4_InspectView'}
//    		                    ];
//    				break;
//    				case 'SHNH01KR' :
//    					listMenu = [
//        		                    { id: 1, name: '제작계획 수립', 	link: 'EPC5',		classId: 'productplan-view', 	className: 'HEAVY4_ProducePlanView'},
//        		                    { id: 2, name: '제작작업지시',  		link: 'EPJ1',	classId: 'workorder-view', 		className: 'HEAVY4_WorkOrderView'},
//        		                    //{ id: 3, name: '도장계획 수립',  		link: 'EPC5_MES',	classId: 'paintplan-view', 		className: 'HEAVY4_PaintPlanView'},
//        		                    //{ id: 4, name: '도장작업지시',  		link: 'EPJ1_MES',	classId: 'paintorder-view', 		className: 'HEAVY4_PaintOrderView'},
//        		                    { id: 5, name: '생산현황 입력', 	link: 'EPC3',		classId: 'produceadjust-view',  className: 'HEAVY4_ProduceAdjustView'},
//        		                    { id: 6, name: '생산현황 조회', 	link: 'EPC7',		classId: 'completestate-view',  className: 'CompleteStateView'},
//        		                    { id: 7, name: '공정별현황', 	link: 'EPC4',		classId: 'produceadjust1-view',  className: 'HEAVY4_ProduceAdjustPcsView'},
//        		                    { id: 8, name: '외주별현황', 	link: 'EOC1',		classId: 'outproduce-view',     className: 'OutProduceView'},
//        		                    { id: 9, name: '제품검사',  		link: 'QTT4_MES',	classId: 'inspect-view', 		className: 'HEAVY4_InspectView'}
//      								];
//    				break;
//    				default:
//    					listMenu = [
//    			    	    		{ id: 1, name: '제품생산계획', 	link: 'EPC5_SEW',		classId: 'productplan-view', 	className: 'HEAVY4_SEW_ProducePlanView'},
//    			                    { id: 2, name: '제품작업지시',  		link: 'EPJ1',	classId: 'workorder-view', 		className: 'HEAVY4_WorkOrderView'},
//    			                    { id: 3, name: '자재생산계획',  		link: 'EPC5_SEW1',	classId: 'paintplan-view', 		className: 'HEAVY4_SEW_PaintPlanView'},
//    			                    { id: 4, name: '자재작업지시',  		link: 'EPJ1_MES',	classId: 'paintorder-view', 		className: 'HEAVY4_PaintOrderView'},
//    			                    { id: 5, name: '수주별 생산현황', 	link: 'EPC3',		classId: 'produceadjust-view',  className: 'HEAVY4_ProduceAdjustView'},
//    			                    { id: 6, name: '공정별 생산현황', 	link: 'EPC4',		classId: 'produceadjust1-view',  className: 'HEAVY4_ProduceAdjustPcsView'},
//    			                    { id: 7, name: '외주별 생산현황', 	link: 'EOC1',		classId: 'outproduce-view',     className: 'OutProduceView'},
//    			                    { id: 8, name: '생산 현황조회', 	link: 'EPC7',		classId: 'completestate-view',  className: 'CompleteStateView'},
//    			                    { id: 9, name: '제품검사',  		link: 'QTT4_MES',	classId: 'inspect-view', 		className: 'HEAVY4_InspectView'}
//    		                    ];
//    					break;
//    			}
//    			break;
//    		default: //dabp
//				listMenu =[
//		                    //{ id: 1, name: '공정설계', 		link: 'EPC1_SUB', 	classId: 'processplan-view', 	className: 'ProcessPlanView'},
//		                    { id: 2, name: '생산계획 수립', 	link: 'EPC5',		classId: 'productplan-view', 	className: 'ProducePlanView'},
//		                    { id: 3, name: '작업지시',  		link: 'EPJ1',	classId: 'workorder-view', 		className: 'WorkOrderView'},
//		                    { id: 4, name: '수주별 생산현황', 	link: 'EPC3',		classId: 'produceadjust-view',  className: 'ProduceAdjustView'},
//		                    { id: 5, name: '공정별 생산현황', 	link: 'EPC4',		classId: 'produceadjust1-view',  className: 'ProduceAdjustPcsView'},
//		                    { id: 6, name: '외주별 생산현황', 	link: 'EOC1',		classId: 'outproduce-view',     className: 'OutProduceView'},
//		                    { id: 7, name: '생산 완료현황', 	link: 'EPC7',		classId: 'completestate-view',  className: 'CompleteStateView'},
//		                    { id: 8, name: 'SMS 송신', 		link: 'CML1',		classId: 'sms-history-view',     className: 'SMSHistoryView'}
//	                ];
//    	}
    	

    	    	var arr = [Ext.create('Ext.panel.Panel', {
					title: this.title, 
					region: 'center',
					////hidden: (vExtVersion > 5),
    	    		html: (vExtVersion > 5) ? this.getTopHtml(this.centerId) : ''
    	    	})];
    	    	
    	        Ext.apply(this, {
    	            layout: 'border',
    	            items: [
    	                    this.createPaneMenu(this.title, this.listMenu, this.onSelect), 
    	                    this.createCenter(this.centerId, arr)
    	                    ]
    	        });
				this.callParent(arguments);
				this.drawChart('container' + this.centerId);
    	    },
    	    

    	    onSelect: function(rec) {
    	    	
    	    	console_logs('onSelect rec', rec);
    	    	
    	    }
    	});