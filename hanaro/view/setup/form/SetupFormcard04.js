Ext.define('Hanaro.view.setup.form.SetupFormcard04', {
    extend: 'Ext.form.Panel',
    xtype: 'rfx.setupForm4',
    frame:true,
    title: '(4/4) 시스템 설정',
    bodyPadding: 10,
    scrollable:false,
    border: false,
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 115,
        msgTarget: 'side'
    },
    initComponent:  function(){
        console_logs('Hanaro.view.setup.form.SetupFormcard04', 'initComponent');
        this.callParent(arguments);
        
        // Ext.getCmp('f2_biz_no').setValue('111');
        // Ext.getCmp('f2_wa_code').setValue('222');
    },
    items: [
        {id: 'progressInit', xtype: 'component',    html: '<p>시스템 초기화    .......</p>'},
        {id: 'progressCompany', xtype: 'component', html: '<p>회사정보 설정    .......</p>'},
        {id: 'progressEnv', xtype: 'component',     html: '<p>환경정보 설정    .......</p>'},
        {id: 'progressMenu', xtype: 'component',    html: '<p>메뉴정보 생성    .......</p>'},
        {
            id: 'progressPart',
            xtype: 'component',
            html: '<hr><P>작업중입니다.</p>'
            //html: '<hr><P>축하합니다.</p><p>성공적으로 설치되었습니다. <br><a href="">메인화면으로 이동</a></p>'
        }

    ],
    doSetup: function() {
       
        var progressPart = Ext.getCmp('progressPart');
        progressPart.setLoading(true);
        var task = null;
        var runner = new Ext.util.TaskRunner();
        progress_init = false;  //초기화
        progress_company = false;  //회사정보
        progress_system = false;  //환경정보
        progress_menu = false;  //메뉴정보

        overallSuccess = true;

        num = 0;
        var setupForm = Ext.getCmp('setupForm');
        console_logs('companyInfo', setupForm.companyInfo);
        console_logs('systemInfo', setupForm.systemInfo);

        this.doInit(setupForm, runner);       
        var me=this;
        var stoploading = function() {
            console_logs('num=',      num);
            console_logs('progress_init 초기화', progress_init);
            console_logs('progress_company 회사정보', progress_company);
            console_logs('progress_system 환경정보', progress_system);
            console_logs('progress_menu 메뉴정보', progress_menu);

            if(overallSuccess == false) {
                me.arrangeFinal(runner);
            }

            if((progress_init==true) && (progress_company==true) && (progress_system==true)) {
                if (progress_menu==true) {
                    me.arrangeFinal(runner);
                } else {
                    me.checkCount();       
                }
            }
            num++;
        };

        task = runner.start({
            run: stoploading,
            interval: 3000
        });

    },
    totalMenuCnt : -1,
    currentMenuCnt : 0,
    checkCount: function() {
        var me = this;
        if(me.totalMenuCnt<0) {
            return;
        } else {
            var progressMenu = Ext.getCmp('progressMenu');
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/setup.do?method=checkMenuCnt',
                method: 'GET',
                timeout: 60000*30, //30분
                params: {
                    totalMenuCnt : me.totalMenuCnt
                },
                success : function(result, request) {
                    me.currentMenuCnt = Number(result.responseText);
                    progressMenu.setHtml( '<p>메뉴정보 생성    ....................... 처리중  (' + me.currentMenuCnt + '/' + me.totalMenuCnt + ')</p>');
    
                    if(me.totalMenuCnt>me.currentMenuCnt) {
    
                    } else {
                        progress_menu = true;
                        progressMenu.setHtml( '<p>메뉴정보 생성    ....................... 완료  (' + me.currentMenuCnt + '/' + me.totalMenuCnt + ')</p>');
                    }
                },
                failure: function(result, action){
                    progressMenu.setHtml( '<p>메뉴정보 생성 실패. 사유:</p>' + result.responseText + '');
                    progress_menu = true;
                    overallSuccess = false;
                    me.arrangeFinal(runner);
                }
            });
        }

    },

    arrangeFinal: function(runner) {
        var progressPart = Ext.getCmp('progressPart');
        if(overallSuccess == true) {
            progressPart.setHtml('<hr><P>축하합니다.</p><p>성공적으로 설치되었습니다. <br>시스템을 재시작 해주세요.</p>');
        } else {
            progressPart.setHtml('<hr><P>설치중 오류발생.</p><p>시스템관리자에게 문의하세요. <br><a href="/">다시한번 재시도</a></p>');
        }               
        
        progressPart.setLoading(false);
        runner.destroy();
    },

    doInit: function(setupForm, runner) {
        var me = this;
        var progressInit = Ext.getCmp('progressInit');
        progressInit.setHtml( '<p>시스템 초기화    ....................... 처리중</p>');
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/setup.do?method=init',
            method: 'POST',
            timeout: 60000*30, //30분
            params: {
                comast_uid: setupForm.companyInfo.comast_uid,
                wa_code:    setupForm.companyInfo.wa_code
            },
            success : function(result, request) {

                progressInit.setHtml( '<p>시스템 초기화    ....................... 완료</p>');
                progress_init = true;

                me.doCompany(setupForm, runner);
            },
            failure: function(result, action){
                console.log('fail result.responseText', result.responseText);
                progressInit.setHtml( '<p>시스템 초기화 실패. 사유:</p>' + result.responseText + '');
                progress_init = true;
                overallSuccess = false;
                me.arrangeFinal(runner);
            }
        });
    },


    doCompany: function(setupForm, runner) {
        var me = this;
        var progressCompany = Ext.getCmp('progressCompany');
        progressCompany.setHtml( '<p>회사정보 설정    ....................... 처리중</p>');
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/setup.do?method=company',
            method: 'POST',
            timeout: 60000*30, //30분
            params: setupForm.companyInfo,
            success : function(result, request) {
                progressCompany.setHtml( '<p>회사정보 설정    ....................... 완료</p>');
                progress_company = true;
                me.doSystem(setupForm, runner);
            },
            failure: function(result, action){
                console.log('fail result.responseText', result.responseText);
                progressCompany.setHtml( '<p>회사정보 설정 실패. 사유:</p>' + result.responseText + '');
                progress_company = true;
                overallSuccess = false;
                me.arrangeFinal(runner);
            }
        });
    },

    doSystem: function(setupForm, runner) {
        var me = this;
        setupForm.systemInfo.comast_uid = setupForm.companyInfo.comast_uid;
        setupForm.systemInfo.wa_code = setupForm.companyInfo.wa_code;

        var progressEnv = Ext.getCmp('progressEnv');
        progressEnv.setHtml( '<p>환경정보 설정    ....................... 처리중</p>');
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/setup.do?method=system',
            method: 'POST',
            timeout: 60000*30, //30분
            params: setupForm.systemInfo,
            success : function(result, request) {
                progressEnv.setHtml( '<p>환경정보 설정    ....................... 완료</p>');
                progress_system = true;
                me.doMenu(setupForm, runner);
            },
            failure: function(result, action){
                progressCompany.setHtml( '<p>환경정보 설정 실패. 사유:</p>' + result.responseText + '');
                progress_system = true;
                overallSuccess = false;
                me.arrangeFinal(runner);
            }
        });
    },

    doMenu: function(setupForm, runner) {
        var me = this;
        var progressMenu = Ext.getCmp('progressMenu');
        progressMenu.setHtml( '<p>메뉴정보 생성    ....................... 처리중</p>');
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/setup.do?method=menu',
            method: 'POST',
            timeout: 60000*30, //30분
            params: {
                comast_uid: setupForm.companyInfo.comast_uid,
                modules: setupForm.systemInfo.modules
            },
            success : function(result, request) {
                me.totalMenuCnt = Number(result.responseText);
                //progressMenu.setHtml( '<p>메뉴정보 생성    ....................... 완료</p>');
                //progress_menu = true;
                //me.arrangeFinal(runner);
            },
            failure: function(result, action){
                progressMenu.setHtml( '<p>메뉴정보 생성 실패. 사유:</p>' + result.responseText + '');
                progress_menu = true;
                overallSuccess = false;
                me.arrangeFinal(runner);
            }
        });
    }

   
   

});