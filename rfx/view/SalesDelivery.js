Ext.define('Rfx.view.SalesDelivery', {
    extend: (vSYSTEM_TYPE == 'HANARO') ? 'Hanaro.base.HanaroBasePanel' : 'Rfx.base.BasePanel',
    alias: 'widget.salesDelivery',
    centerId: 'salesDeliveryMain',
    initComponent: function(){
    	
//    	var relationSro1 = {
//            order: ['project', 'srcahd', 'assymap', 'rtgast', 'cartmap'],
//            copy: [{
//            	fromTable: 'srcahd',
//            	fromField: 'item_name',
//            	fromPos: [0],
//            	
//            	toTable: 'project',
//            	toField: 'pj_name',
//            	toPos: [0]
//    		}],
//            relation:[{
//            	primeTable: "project",
//            	primeField: "unique_id",
//            	primePos: [0],
//            	
//            	forienTable: "assymap",
//            	forienField: "ac_uid",
//            	foreinPos: [-1]//전체
//            },{
//            	primeTable: "project",
//            	primeField: "unique_id",
//            	primePos: [0],
//            	
//            	forienTable: "assymap",
//            	forienField: "parent",
//            	foreinPos: [0]//첫번째만
//            },{
//            	primeTable: "srcahd",
//            	primeField: "unique_id",
//            	primePos: [-1],//전체
//            	
//            	forienTable: "assymap",
//            	forienField: "child",
//            	foreinPos: [-1]//전체
//            	
//            },{
//            	primeTable: "srcahd",
//            	primeField: "unique_id",
//            	primePos: [0], //첫째
//            	
//            	forienTable: "assymap",
//            	forienField: "parent",
//            	foreinPos: [1,-1]//0을 제외한 전체 전체
//            }]
//    	};
//    	
//    	var classname = 'RecvPoView';
//    	var listMenu = null;
//    	switch(vSYSTEM_TYPE_SUB){
//	    	case 'HEAVY4' :
//	    		switch(vCompanyReserved4){
//		    		case 'SHNH01KR' :
//				        listMenu = [
//				                	{ id: 1, name: '고객사 관리',	link: 'SCS2_CLD',		classId: 'buyer-list-view', 		className: 'BuyerListView' },
//    								{ id: 2, name: '수주엑셀등록',    link: 'SRO4',			classId: 'received-mgmt-excel-view',	className: 'HEAVY4_RecvPoExcelView'},	//신화, 대동
//    								{ id: 3, name: '수주 관리',		link: 'SRO5',		classId: 'heavy4-recvPo-view', 		className: 'HEAVY4_RecvPoView'},
//    								{ id: 4, name: '수주 현황',		link: 'SRO5_SUB_MES',		classId: 'heavy4-recvPoSub-view', 		className: 'HEAVY4_RecvPoSubView'},
//    								{ id: 5, name: '제품재고 현황', link: 'SPS1_MES',		classId: 'product-stock-view', 		className: 'ProductStockView'},
//    								//{ id: 5, name: '출하 캘린더',	link: 'calendar',		classId: 'delivery-calendar-view',	className: 'DeliveryCalendarView'},
//    								{ id: 6, name: '출하대기',		link: 'SDL2',		classId: 'delivery-pending-view',	className: 'HEAVY4_DeliveryPendingView'},
//    								{ id: 7, name: '납품서출력', 	link: 'SDL1',			classId: 'delivery-mgmt-view', 		className: 'DeliveryMgmtView'},
//    								//{ id: 8, name: '차량관리', 		link: 'CAR1',		classId: 'carmgnt-view', 			className: 'CarMgntView'}
//							
//								];		        	
//				        break;
//		    		case 'SWON01KR' :
//		    			listMenu = [
//    								{ id: 1, name: '고객사 관리',	link: 'SCS2_CLD',		classId: 'buyer-list-view', 		className: 'BuyerListView' },
//    								/*{ id: 2, name: '수주 관리',		link: 'SRO1_CLD',		classId: 'received-mgmt-view', 		className: 'RecvPoView',       relationship: relationSro1},*/
//    								{ id: 2, name: '수주엑셀등록',    link: 'SRO4_SEW',			classId: 'received-mgmt-excel-view',	className: 'HEAVY4_RecvPoExcelView'},	//신화, 대동
//    								//{ id: 8, name: '수주 관리(DABP)',		link: 'SRO1_CLD',		classId: 'received-mgmt-view', 		className: 'RecvPoView',       relationship: relationSro1},
//    								{ id: 3, name: '수주 관리',		link: 'SRO5_SEW',		classId: 'heavy4-recvPo-view', 		className: 'HEAVY4_RecvPoView'},
//    								{ id: 4, name: '제품재고 현황', link: 'SPS1_MES',		classId: 'product-stock-view', 		className: 'ProductStockView'},
//    								//{ id: 5, name: '출하 캘린더',	link: 'calendar',		classId: 'delivery-calendar-view',	className: 'DeliveryCalendarView'},
//    								{ id: 6, name: '출하대기',		link: 'SDL2',		classId: 'delivery-pending-view',	className: 'HEAVY4_DeliveryPendingView'},
//    								{ id: 7, name: '납품서출력', 	link: 'SDL1',			classId: 'delivery-mgmt-view', 		className: 'DeliveryMgmtView'},
//    								//{ id: 8, name: '차량관리', 		link: 'CAR1',		classId: 'carmgnt-view', 			className: 'CarMgntView'}
//    							];
//		    			break;
//		    		case 'DDNG01KR' :
//		    			listMenu = [
//    								{ id: 1, name: '고객사 관리',	link: 'SCS2_CLD',		classId: 'buyer-list-view', 		className: 'BuyerListView' },
//    								{ id: 2, name: '수주엑셀등록',    link: 'SRO4_DDG',			classId: 'received-mgmt-excel-view',	className: 'HEAVY4_RecvPoExcelView'},	//대동
//    								{ id: 3, name: '수주엑셀(현대)',  link: 'SRO4_DD1',			classId: 'received-mgmt-excel-view',	className: 'HEAVY4_RecvPoExcelView'},	//대동 현대
//    								{ id: 4, name: '수주 관리',		link: 'SRO5_DDG',		classId: 'heavy4-recvPo-view', 		className: 'HEAVY4_RecvPoView'},
//    								{ id: 5, name: '제품재고 현황',   link: 'SPS1_MES',		classId: 'product-stock-view', 		className: 'ProductStockView'},
//    								//{ id: 5, name: '출하 캘린더',	link: 'calendar',		classId: 'delivery-calendar-view',	className: 'DeliveryCalendarView'},
//    								{ id: 6, name: '출하대기',		link: 'SDL2',		classId: 'delivery-pending-view',	className: 'HEAVY4_DeliveryPendingView'},
//    								{ id: 7, name: '납품서출력', 	link: 'SDL1',			classId: 'delivery-mgmt-view', 		className: 'DeliveryMgmtView'},
//    								//{ id: 8, name: '차량관리', 		link: 'CAR1',		classId: 'carmgnt-view', 			className: 'CarMgntView'}
//    							];
//		    			break;
//		    		case 'PNLC01KR' :
//		    			listMenu = [
//									{ id: 1, name: '고객사 관리',	link: 'SCS2_CLD',		classId: 'buyer-list-view', 		className: 'BuyerListView' },
//									{ id: 2, name: '수주엑셀등록',    link: 'SRO4_PNL',			classId: 'received-mgmt-excel-view',	className: 'HEAVY4_RecvPoExcelView'},	//신화, 대동
//									{ id: 3, name: '수주 관리',		link: 'SRO5_PNL',		classId: 'heavy4-recvPo-view', 		className: 'HEAVY4_RecvPoView'},
//									{ id: 4, name: '제품재고 현황', link: 'SPS1_MES',		classId: 'product-stock-view', 		className: 'ProductStockView'},
//									//{ id: 5, name: '출하 캘린더',	link: 'calendar',		classId: 'delivery-calendar-view',	className: 'DeliveryCalendarView'},
//									{ id: 5, name: '출하대기',		link: 'SDL2',		classId: 'delivery-pending-view',	className: 'DeliveryPendingView'},
//									{ id: 6, name: '납품서출력', 	link: 'SDL1',			classId: 'delivery-mgmt-view', 		className: 'DeliveryMgmtView'},
//									{ id: 7, name: '검사기준엑셀등록',    link: 'QQL4_PNL',			classId: 'test-standard-excel-view',	className: 'HEAVY4_TestStandardExcelView'},
//									{ id: 8, name: '검사기준보기',    link: 'QQL5_PNL',			classId: 'test-standard-view',	className: 'HEAVY4_TestStandardView'}
//									//{ id: 8, name: '차량관리', 		link: 'CAR1',		classId: 'carmgnt-view', 			className: 'CarMgntView'}
//								];
//		    			break;
//		    		default:
//		    			listMenu = [
//    								{ id: 1, name: '고객사 관리',	link: 'SCS2_CLD',		classId: 'buyer-list-view', 		className: 'BuyerListView' },
//    								/*{ id: 2, name: '수주 관리',		link: 'SRO1_CLD',		classId: 'received-mgmt-view', 		className: 'RecvPoView',       relationship: relationSro1},*/
//    								{ id: 2, name: '수주엑셀등록',    link: 'SRO4_SEW',			classId: 'received-mgmt-excel-view',	className: 'HEAVY4_RecvPoExcelView'},	//신화, 대동
//    								//{ id: 8, name: '수주 관리(DABP)',		link: 'SRO1_CLD',		classId: 'received-mgmt-view', 		className: 'RecvPoView',       relationship: relationSro1},
//    								{ id: 3, name: '수주 관리',		link: 'SRO5_SEW',		classId: 'heavy4-recvPo-view', 		className: 'HEAVY4_RecvPoView'},
//    								{ id: 4, name: '제품재고 현황', link: 'SPS1_MES',		classId: 'product-stock-view', 		className: 'ProductStockView'},
//    								//{ id: 5, name: '출하 캘린더',	link: 'calendar',		classId: 'delivery-calendar-view',	className: 'DeliveryCalendarView'},
//    								{ id: 6, name: '출하대기',		link: 'SDL2',		classId: 'delivery-pending-view',	className: 'HEAVY4_DeliveryPendingView'},
//    								{ id: 7, name: '납품서출력', 	link: 'SDL1',			classId: 'delivery-mgmt-view', 		className: 'DeliveryMgmtView'},
//    								//{ id: 8, name: '차량관리', 		link: 'CAR1',		classId: 'carmgnt-view', 			className: 'CarMgntView'}
//    							]; 
//	    		}
//	    		break;
//	    	default://dabp
//	    		listMenu = [
//							{ id: 1, name: '고객사 관리',	link: 'SCS2_CLD',		classId: 'buyer-list-view', 		className: 'BuyerListView' },
//							{ id: 2, name: '수주 관리',		link: 'SRO1_CLD',		classId: 'received-mgmt-view', 		className: 'RecvPoView',       relationship: relationSro1},
//							{ id: 3, name: '제품재고 현황', link: 'SPS1_MES',		classId: 'product-stock-view', 		className: 'ProductStockView'},
//							{ id: 4, name: '출하 캘린더',	link: 'calendar',		classId: 'delivery-calendar-view',	className: 'DeliveryCalendarView'},
//							{ id: 5, name: '출하대기',		link: 'SDL2',		classId: 'delivery-pending-view',	className: 'DeliveryPendingView'},
//							{ id: 6, name: '납품서출력', 	link: 'SDL1',			classId: 'delivery-mgmt-view', 		className: 'DeliveryMgmtView'},
//							{ id: 7, name: '차량관리', 		link: 'CAR1',		classId: 'carmgnt-view', 			className: 'CarMgntView'}
//								
//						];
//
//    	}
    	
    	var salesDeliveryName = '영업.출하';
    	
    	switch(vCompanyReserved4){
    	case "DOOS01KR":
    		salesDeliveryName = '영업';
    		break;
    	}
    	
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
    	
    	//console_logs('onSelect rec', rec);
    	
    }
});