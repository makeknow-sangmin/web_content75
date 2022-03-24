Ext.define('Rfx.view.GoodsManage', {
    extend: (vSYSTEM_TYPE == 'HANARO') ? 'Hanaro.base.HanaroBasePanel' : 'Rfx.base.BasePanel',
    alias: 'widget.goodsManage',
    centerId: 'goodsManageMain',
    initComponent: function(){
    	
//    	var listMenu = null;
// 
//    	switch(vSYSTEM_TYPE_SUB) {
//    	case 'HEAVY4':
//    		switch(vCompanyReserved4) {
//    		
//	    		case 'SHNH01KR':
//	    			listMenu = [
//	            	            { id: 1, name: '프로젝트 관리', link: 'EPJ2',		classId: 'project-mgmt-view', 		className: 'ProjectMgmtView' },
//	                            { id: 2, name: '프로젝트 멤버',  link: 'AUS4_CLD', 	classId: 'project-member-view', 		className: 'ProjectMemberView' },
//	                            { id: 3, name: '설계 BOM',  link: 'DBM7', 	classId: 'design-bom-view', 		className: 'DesignBomView' },
//	                            { id: 4, name: '완료 BOM',  link: 'DBM9', 	classId: 'finished-bom-view', 		className: 'FinishedBomView' },
//	//                          { id: 5, name: '디자인 파일', link: 'DDW6',		classId: 'design-file-view', 		className: 'DesignFileView' },
//	//        		            { id: 5, name: '프로젝트별 문서', link: 'DDW6',		classId: 'projct-docu-view', 		className: 'ProjectDocuView' },
//	        		            { id: 6, name: 'PDF도면 관리', link: 'DDW8',		classId: 'docu-mgmt-view', 		className: 'DocuMgmtView' },
//	        	                { id: 7, name: '승인도면 관리',  link: 'DDW2', 	classId: 'send-docu-view', 		className: 'SendDocuView' }//,
//	        	                //{ id: 8, name: '부서파일 관리',  link: 'DDW6_MES', 	classId: 'dept-docu-view', 		className: 'DeptDocuView' }
//	        		            ];
//	    			break;
//	    		case 'SWON01KR':
//	    			listMenu = [
//	            	            //{ id: 1, name: '프로젝트 관리', link: 'EPJ2',		classId: 'project-mgmt-view', 		className: 'ProjectMgmtView' },
//	            	            { id: 1,	name: '제품분류코드', 		link: 'AMC4_CLD',	classId: 'product-classification-code-view',className: 'ProductClassificationCodeView'},
//	            	            { id: 2,	name: '자재분류코드', 		link: 'AMC4_SEW',	classId: 'material-classification-code-view',className: 'MaterialClassificationCodeView'},
//	            	            { id: 3, name: '제품등록현황', link: 'EPJ2_SEW',		classId: 'product-mgmt-view', 		className: 'ProductMgmtView' },
//	            	            { id: 4, name: '자재등록', link: 'PMT2_SEW',		classId: 'material-mgmt-view1', 		className: 'MaterialMgmtView1' },
//	//                          { id: 2, name: '프로젝트 멤버',  link: 'AUS4_CLD', 	classId: 'project-member-view', 		className: 'ProjectMemberView' },
//	                            { id: 5, name: 'BOM등록',  link: 'DBM7', 	classId: 'design-bom-view', 		className: 'DesignBomView' },
//	                            { id: 6, name: '완료 BOM',  link: 'DBM9', 	classId: 'finished-bom-view', 		className: 'FinishedBomView' },
//	//                          { id: 5, name: '디자인 파일', link: 'DDW6',		classId: 'design-file-view', 		className: 'DesignFileView' },
//	//        		            { id: 5, name: '프로젝트별 문서', link: 'DDW6',		classId: 'projct-docu-view', 		className: 'ProjectDocuView' },
//	        		            { id: 7, name: '도면 관리', link: 'DDW8',		classId: 'docu-mgmt-view', 		className: 'DocuMgmtView' },
//	        	                { id: 8, name: '승인도면 관리',  link: 'DDW2', 	classId: 'send-docu-view', 		className: 'SendDocuView' }//,
//	        	                //{ id: 8, name: '부서파일 관리',  link: 'DDW6_MES', 	classId: 'dept-docu-view', 		className: 'DeptDocuView' }
//	        							
//	        							];
//	    			break;
//	    		case 'DDNG01KR':
//	    			listMenu = [
//	            	            { id: 1, name: '프로젝트 관리', link: 'EPJ2',		classId: 'project-mgmt-view', 		className: 'ProjectMgmtView' },
//	                            { id: 2, name: '프로젝트 멤버',  link: 'AUS4_CLD', 	classId: 'project-member-view', 		className: 'ProjectMemberView' },
//	                            { id: 3, name: '설계 BOM',  link: 'DBM7', 	classId: 'design-bom-view', 		className: 'DesignBomView' },
//	                            { id: 4, name: '완료 BOM',  link: 'DBM9', 	classId: 'finished-bom-view', 		className: 'FinishedBomView' }//,
//	//                          { id: 5, name: '디자인 파일', link: 'DDW6',		classId: 'design-file-view', 		className: 'DesignFileView' },
//	//        		            { id: 5, name: '프로젝트별 문서', link: 'DDW6',		classId: 'projct-docu-view', 		className: 'ProjectDocuView' },
//	//        		            { id: 6, name: 'CAD도면 관리', link: 'DDW8',		classId: 'docu-mgmt-view', 		className: 'DocuMgmtView' },
//	//        	                { id: 7, name: '승인도면 관리',  link: 'DDW2', 	classId: 'send-docu-view', 		className: 'SendDocuView' },
//	//        	                { id: 8, name: '부서파일 관리',  link: 'DDW6_MES', 	classId: 'dept-docu-view', 		className: 'DeptDocuView' }
//	        							
//	        							];
//
//	    			break;
//	    		default:
//	    			listMenu = [
//	            	            { id: 1, name: '프로젝트 관리', link: 'EPJ2',		classId: 'project-mgmt-view', 		className: 'ProjectMgmtView' },
//	                            { id: 2, name: '프로젝트 멤버',  link: 'AUS4_CLD', 	classId: 'project-member-view', 		className: 'ProjectMemberView' },
//	                            { id: 3, name: '설계 BOM',  link: 'DBM7', 	classId: 'design-bom-view', 		className: 'DesignBomView' },
//	                            { id: 4, name: '완료 BOM',  link: 'DBM9', 	classId: 'finished-bom-view', 		className: 'FinishedBomView' },
//	//                          { id: 5, name: '디자인 파일', link: 'DDW6',		classId: 'design-file-view', 		className: 'DesignFileView' },
//	//        		            { id: 5, name: '프로젝트별 문서', link: 'DDW6',		classId: 'projct-docu-view', 		className: 'ProjectDocuView' },
//	        		            { id: 6, name: 'PDF도면 관리', link: 'DDW8',		classId: 'docu-mgmt-view', 		className: 'DocuMgmtView' },
//	        	                { id: 7, name: '승인도면 관리',  link: 'DDW2', 	classId: 'send-docu-view', 		className: 'SendDocuView' }//,
//	        	                //{ id: 8, name: '부서파일 관리',  link: 'DDW6_MES', 	classId: 'dept-docu-view', 		className: 'DeptDocuView' }
//        							
//        							];
//    		}    		
//    		break;
//    		default://DABP
//    			listMenu = [
//    	                	{ id: 1, name: '디자인 파일', link: 'DDW6',		classId: 'design-file-view', 		className: 'DesignFileView' }//,
////    	                    { id: 2, name: '설계 BOM',  link: 'DBM7', 	classId: 'design-bom-view', 		className: 'DesignBomView' }
//
//        	];
//    	}
//    	
//    	
////
////    	
////       	if(vSYSTEM_TYPE_SUB == 'HEAVY4'){
////           	var listMenu = [
////            	            { id: 1, name: '프로젝트 관리', link: 'EPJ2',		classId: 'project-mgmt-view', 		className: 'ProjectMgmtView' },
////                            { id: 2, name: '프로젝트 멤버',  link: 'AUS4_CLD', 	classId: 'project-member-view', 		className: 'ProjectMemberView' },
////                            { id: 3, name: '설계 BOM',  link: 'DBM7', 	classId: 'design-bom-view', 		className: 'DesignBomView' },
////                            { id: 4, name: '완료 BOM',  link: 'DBM9', 	classId: 'finished-bom-view', 		className: 'FinishedBomView' },
//////                          { id: 5, name: '디자인 파일', link: 'DDW6',		classId: 'design-file-view', 		className: 'DesignFileView' },
//////        		            { id: 5, name: '프로젝트별 문서', link: 'DDW6',		classId: 'projct-docu-view', 		className: 'ProjectDocuView' },
////        		            { id: 6, name: 'CAD도면 관리', link: 'DDW8',		classId: 'docu-mgmt-view', 		className: 'DocuMgmtView' },
////        	                { id: 7, name: '승인도면 관리',  link: 'DDW2', 	classId: 'send-docu-view', 		className: 'SendDocuView' }//,
////        	                //{ id: 8, name: '부서파일 관리',  link: 'DDW6_MES', 	classId: 'dept-docu-view', 		className: 'DeptDocuView' }
////        							
////        							];
////    	}
////		var listMenu = [
////	                	{ id: 1, name: '디자인 파일', link: 'DDW6',		classId: 'design-file-view', 		className: 'DesignFileView' }//,
//////	                    { id: 2, name: '설계 BOM',  link: 'DBM7', 	classId: 'design-bom-view', 		className: 'DesignBomView' }
////
////    	];
////    	if(vCompanyReserved4  == 'SHNH01KR'){			//신화
////    		console_logs('vCompanyReserved4', vCompanyReserved4);
////    	/*	var linkName = "";
////    		switch(linkName){
////    			case "SHNH01KR" :
////    				//linkName = "SRO4";
////    				linkName = "SRO4_SEW";
////    				break;
////    			case "세원":
////    				linkName = "SRO4_SEW";
////    				break;
////    				
////    		}
////    		console_logs('linkName', linkName);*/
////           	var listMenu = [
////            	            { id: 1, name: '프로젝트 관리', link: 'EPJ2',		classId: 'project-mgmt-view', 		className: 'ProjectMgmtView' },
////                            { id: 2, name: '프로젝트 멤버',  link: 'AUS4_CLD', 	classId: 'project-member-view', 		className: 'ProjectMemberView' },
////                            { id: 3, name: '설계 BOM',  link: 'DBM7', 	classId: 'design-bom-view', 		className: 'DesignBomView' },
////                            { id: 4, name: '완료 BOM',  link: 'DBM9', 	classId: 'finished-bom-view', 		className: 'FinishedBomView' },
//////                          { id: 5, name: '디자인 파일', link: 'DDW6',		classId: 'design-file-view', 		className: 'DesignFileView' },
//////        		            { id: 5, name: '프로젝트별 문서', link: 'DDW6',		classId: 'projct-docu-view', 		className: 'ProjectDocuView' },
////        		            { id: 6, name: 'CAD도면 관리', link: 'DDW8',		classId: 'docu-mgmt-view', 		className: 'DocuMgmtView' },
////        	                { id: 7, name: '승인도면 관리',  link: 'DDW2', 	classId: 'send-docu-view', 		className: 'SendDocuView' }//,
////        	                //{ id: 8, name: '부서파일 관리',  link: 'DDW6_MES', 	classId: 'dept-docu-view', 		className: 'DeptDocuView' }
////        							
////        							];
////    	}else if(vCompanyReserved4  == 'SWON01KR'){			//세원
////    		console_logs('vCompanyReserved4', vCompanyReserved4);
////           	var listMenu = [
////            	            { id: 1, name: '프로젝트 관리', link: 'EPJ2',		classId: 'project-mgmt-view', 		className: 'ProjectMgmtView' },
//////                            { id: 2, name: '프로젝트 멤버',  link: 'AUS4_CLD', 	classId: 'project-member-view', 		className: 'ProjectMemberView' },
////                            { id: 3, name: '설계 BOM',  link: 'DBM7', 	classId: 'design-bom-view', 		className: 'DesignBomView' },
////                            { id: 4, name: '완료 BOM',  link: 'DBM9', 	classId: 'finished-bom-view', 		className: 'FinishedBomView' },
//////                          { id: 5, name: '디자인 파일', link: 'DDW6',		classId: 'design-file-view', 		className: 'DesignFileView' },
//////        		            { id: 5, name: '프로젝트별 문서', link: 'DDW6',		classId: 'projct-docu-view', 		className: 'ProjectDocuView' },
////        		            { id: 6, name: 'CAD도면 관리', link: 'DDW8',		classId: 'docu-mgmt-view', 		className: 'DocuMgmtView' },
////        	                { id: 7, name: '승인도면 관리',  link: 'DDW2', 	classId: 'send-docu-view', 		className: 'SendDocuView' }//,
////        	                //{ id: 8, name: '부서파일 관리',  link: 'DDW6_MES', 	classId: 'dept-docu-view', 		className: 'DeptDocuView' }
////        							
////        							];
////        	}else if(vCompanyReserved4  == 'DDNG01KR'){		//대동
////               	var listMenu = [
////                	            { id: 1, name: '프로젝트 관리', link: 'EPJ2',		classId: 'project-mgmt-view', 		className: 'ProjectMgmtView' },
////                                { id: 2, name: '프로젝트 멤버',  link: 'AUS4_CLD', 	classId: 'project-member-view', 		className: 'ProjectMemberView' },
////                                { id: 3, name: '설계 BOM',  link: 'DBM7', 	classId: 'design-bom-view', 		className: 'DesignBomView' },
////                                { id: 4, name: '완료 BOM',  link: 'DBM9', 	classId: 'finished-bom-view', 		className: 'FinishedBomView' }//,
//////                              { id: 5, name: '디자인 파일', link: 'DDW6',		classId: 'design-file-view', 		className: 'DesignFileView' },
//////            		            { id: 5, name: '프로젝트별 문서', link: 'DDW6',		classId: 'projct-docu-view', 		className: 'ProjectDocuView' },
//////            		            { id: 6, name: 'CAD도면 관리', link: 'DDW8',		classId: 'docu-mgmt-view', 		className: 'DocuMgmtView' },
//////            	                { id: 7, name: '승인도면 관리',  link: 'DDW2', 	classId: 'send-docu-view', 		className: 'SendDocuView' },
//////            	                { id: 8, name: '부서파일 관리',  link: 'DDW6_MES', 	classId: 'dept-docu-view', 		className: 'DeptDocuView' }
////            							
////            							];
////            	}
////    	
////    	
////    	
    	
    	var arr = [Ext.create('Ext.panel.Panel', {
			title: this.title, 
			region: 'center',
			////hidden: (vExtVersion > 5),
    		html: (vExtVersion > 5) ? this.getTopHtml(this.centerId) : ''
    	})];
    	
    	var menuName = '설계,디자인';
    	
        switch(vCompanyReserved4) {
        	case "PNLC01KR" :
        		menuName = '자료 관리';
        		break;
        	case "DOOS01KR" :
        	case "DAEH01KR" :
        	case "CHNG01KR" : 
        		menuName = '자료관리';
        		break;
        	case "SKNH01KR" :
        	case "SWON01KR" : 
        		menuName = '설계,도면';
        	default :
        		break;
        }
    	
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