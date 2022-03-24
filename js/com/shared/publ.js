/**
 * jQuery custom checkboxes
 *
 * Copyright (c) 2008 Khavilo Dmitry (http://widowmaker.kiev.ua/checkbox/)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @version 1.3.0 Beta 1
 * @author Khavilo Dmitry
 * @mailto wm.morgun@gmail.com
**/
(function($){
	/* Little trick to remove event bubbling that causes events recursion */
	var CB = function(e)
	{
		if (!e) var e = window.event;
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
	};

	$.fn.wrap = function(options) {
		/* IE6 background flicker fix */
		try	{ document.execCommand('BackgroundImageCache', false, true);	} catch (e) {}

		/* Default settings */
		var settings = {
			namespace: 'jquery',
			cls: '',
			empty: '/ui/img/button/empty.png'  /* checkbox  */
		};


		/*
		if(this.is(':radio')) {
			alert('radio');
			settings = {
				cls: 'jquery-radio',
				empty: 'empty.png'
			};
		}
		else if(this.is(':checkbox')) {
			alert('checkbox');
			settings = {
				cls: 'jquery-checkbox',
				empty: 'empty.png'
			};
		}
		*/

		/* Processing settings */
		settings = $.extend(settings, options || {});

		/* Adds check/uncheck & disable/enable events */
		var addEvents = function(object)
		{
			var checked = object.checked;
			var disabled = object.disabled;
			var $object = $(object);

			if ( object.stateInterval )
				clearInterval(object.stateInterval);

			object.stateInterval = setInterval(
				function()
				{
					if ( object.disabled != disabled )
						$object.trigger( (disabled = !!object.disabled) ? 'disable' : 'enable');
					if ( object.checked != checked )
						$object.trigger( (checked = !!object.checked) ? 'check' : 'uncheck');
				},
				10 /* in miliseconds. Low numbers this can decrease performance on slow computers, high will increase responce time */
			);
			return $object;
		};
		//try { console_log(this); } catch(e) {}

		/* Wrapping all passed elements */
		return this.each(function()
		{
			var ch = this; /* Reference to DOM Element*/
			var $ch = addEvents(ch); /* Adds custom events and returns, jQuery enclosed object */

			/* Removing wrapper if already applied  */
			if (ch.wrapper) ch.wrapper.remove();

			/*
			 * checkbox, radio class를 다르게 가져가도록 수정
			 */
			if (ch.type == 'radio') {
				settings.cls = settings.namespace + '-radio';
			}
			else if (ch.type == 'checkbox') {
				settings.cls = settings.namespace + '-checkbox';
			} else {
				return false;
			}

			/* Creating wrapper for checkbox and assigning "hover" event */
			ch.wrapper = $('<span class="' + settings.cls + '"><span class="mark"><img src="' + settings.empty + '" /></span></span>');
			ch.wrapperInner = ch.wrapper.children('span:eq(0)'); // <img src="' + settings.empty + '" />

			ch.wrapper.hover(
				function(e) { ch.wrapperInner.addClass(settings.cls + '-hover');CB(e); },
				function(e) { ch.wrapperInner.removeClass(settings.cls + '-hover');CB(e); }
			);

			/* Wrapping checkbox */
			$ch.css({position: 'absolute', zIndex: -1, visibility: 'hidden'}).after(ch.wrapper);

			/* Ttying to find "our" label */
			var label = false;
			if ($ch.attr('id'))
			{
				label = $('label[for='+$ch.attr('id')+']');
				if (!label.length) label = false;
			}
			if (!label)
			{
				/* Trying to utilize "closest()" from jQuery 1.3+ */
				label = $ch.closest ? $ch.closest('label') : $ch.parents('label:eq(0)');
				if (!label.length) label = false;
			}
			/* Labe found, applying event hanlers */
			if (label)
			{
				label.hover(
					function(e) { ch.wrapper.trigger('mouseover', [e]); },
					function(e) { ch.wrapper.trigger('mouseout', [e]); }
				);
				label.click(function(e) { $ch.trigger('click',[e]); CB(e); return false;});
			}
			ch.wrapper.click(function(e) { $ch.trigger('click',[e]); CB(e); return false;});
			$ch.click(function(e) { CB(e); });
			$ch.bind('disable', function() { ch.wrapperInner.addClass(settings.cls+'-disabled');}).bind('enable', function() { ch.wrapperInner.removeClass(settings.cls+'-disabled');});
			$ch.bind('check', function() { ch.wrapper.addClass(settings.cls+'-checked' );}).bind('uncheck', function() { ch.wrapper.removeClass(settings.cls+'-checked' );});

			/* Disable image drag-n-drop for IE */
			$('img', ch.wrapper).bind('dragstart', function () {return false;}).bind('mousedown', function () {return false;});

			/* Firefox antiselection hack */
			if ( window.getSelection )
				ch.wrapper.css('MozUserSelect', 'none');

			/* Applying checkbox state */
			if ( ch.checked )
				ch.wrapper.addClass(settings.cls + '-checked');
			if ( ch.disabled )
				ch.wrapperInner.addClass(settings.cls + '-disabled');
		});
	}
})(jQuery);

/*
===============================================================================
WResize is the jQuery plugin for fixing the IE window resize bug
...............................................................................
                                               Copyright 2007 / Andrea Ercolino
-------------------------------------------------------------------------------
LICENSE: http://www.opensource.org/licenses/mit-license.php
WEBSITE: http://noteslog.com/
===============================================================================
*/
(function($){
    $.fn.wresize = function(f){
       // version = '1.1';	필요없보여 주석처리하였습니다.(나의 진행 현황에서 자바스크립트 에러발생) : 이영한(yhappy.lee) 2010.03.22
        wresize = {fired: false, width: 0};

        function resizeOnce() {
            if ( $.browser.msie ) {
                if ( ! wresize.fired ) {
                    wresize.fired = true;
                } else {
                    var version = parseInt( $.browser.version, 10 );
                    wresize.fired = false;
                    if ( version < 7 ) {
                        return false;
                    } else if ( version == 7 ) {
                        //a vertical resize is fired once, an horizontal resize twice
                        var width = $( window ).width();
                        if ( width != wresize.width )
                        {
                            wresize.width = width;
                            return false;
                        }
                    }
                }
            }
             return true;
        }

        function handleWResize( e ) {
            if ( resizeOnce() ) {
                return f.apply(this, [e]);
            }
        }

        this.each( function() {
            if ( this == window )
            {
                $( this ).resize( handleWResize );
            }
            else
            {
                $( this ).resize( f );
            }
        } );

        return this;
    };
})(jQuery);

/*
 * jQuery resizeList/resizePop plugin
 *
 * iframe 의 innerDivPage 영역 유무에 상관없이 적용 가능

 * iframe 의 id 나 name 에 상관없음.
 *
 */

var mainListHeight = {}; // 아이프레임 높이를 담은 개체

var resizeListInit = function(){
	//list에 자료 컴포넌트 부착하여 아래 코드 수행시 개체가 이 속성 또는 메소드를 지원하지 않습니다. 에러 발생하여 일단 try catch 처리함.
	try {
		$("#ResultHeader").next().resizeList();  //#ResultHeader 객체의 다음 객체.. 즉 Iframe 을 리사이징 함.
	}catch(e){}
};

var resizeGridXFixedInit = function(){ // 가로세로 틀고정 리사이즈 시행
	//list에 자료 컴포넌트 부착하여 아래 코드 수행시 개체가 이 속성 또는 메소드를 지원하지 않습니다. 에러 발생하여 일단 try catch 처리함.
	try {
		$(".scrollGrid").resizeGridXFixed();
	}catch(e){}
};

(function($){
	$.resizeConfig = {
		listDefaults: {
			parent: "#ContentFrame",
			header: "#ResultHeader",
			footer: "#ResultFooter",
			btnHeader: "#btnHeader",
			list: "#innerDiv",
			notes: "#innerNote",
			paging: "#innerDivPage",
			pageBtn: "#innerDivPageBtn",
			fixedGridHeight: "",
			getFixedGridHeight: function(){
				return this.fixedGridHeight;
			}
		},
		popDefaults: {
			win: "body",
			header: "#popHead",
			content: ".pcWin:first",
			footer: "#popFoot"
		}
	};
	$.fn.extend({
		resizeList: function(settings){
			settings = $.extend({}, $.resizeConfig.listDefaults, settings);
			return this.each(function() {
				getMainListHeight(settings);
				$.fn.resizeGridPlain(settings, $(this));
				if(mainListHeight <= 0) mainListHeight = 0;
			}).height(mainListHeight);
		},
		resizeGridPlain: function(settings, frame){
			settings = $.extend({}, $.resizeConfig.listDefaults, settings);
			var btnHeader = frame.contents().find(settings.btnHeader),
				listDiv = frame.contents().find(settings.list),
				pagingDiv = frame.contents().find(settings.paging),
				pageBtnDiv = frame.contents().find(settings.pageBtn),
				isPaging, isPageBtn;

			var iFrameContentHeight = listDiv.height();

			isPaging = (pagingDiv.length > 0) ? 30 : 0;
			isPageBtn = (pageBtnDiv.length > 0) ? 10 : 0;

			var isTableBody = (frame.contents().find(".tableBody1").length > 0) ? 34 : 0;
			iFrameContentHeight = mainListHeight - (btnHeader.height() + isTableBody + pagingDiv.height() + pageBtnDiv.height() + isPaging + isPageBtn)-1; //-1을 해주는 것은 #innerDiv 하단 라인이 짤리는 것에 대한 보정 값이다.

			if(frame.contents().find(".colui-fixedgrid").length <= 0) {
				// 목록 스크롤 영역 설정
				if(mainListHeight >= btnHeader.height() + listDiv.children().height() + pagingDiv.height() + pageBtnDiv.height() + isPaging + isPageBtn) {
					listDiv.height(listDiv.children().height());
				} else {
					listDiv.height(iFrameContentHeight);
				}
			}

			frame.contents().find(".addDel .cropwin-list").height(mainListHeight - 53); // 체크리스트 추가/삭제용 (예: 자원성과 > 실행계획수립 과제선정)
			frame.contents().find(".colui-2-lead-box").css("min-height", 0).height(mainListHeight - btnHeader.height() - 7);
			frame.contents().find(".colui-lead .cropwin").height(mainListHeight - 58);
			frame.contents().find(".colui-fol .cropwin-list").height(mainListHeight - 116);
		},
		resizeGridXFixed: function(settings){
			settings = $.extend({}, $.resizeConfig.listDefaults, settings);
			return this.each(function() {
				var fixedGrid = $(this).parents(".xyFix").find(".fixedGrid:first");
				var scrollHeader = $(this).parents(".xyFix").find(".scrollHeader:first");
				var scrollTable = $(this).children();
				var btnHeader = $(settings.btnHeader),
					listDiv = $(settings.list),
					noteDiv = $(settings.notes),
					pagingDiv = $(settings.paging),
					pageBtnDiv = $(settings.pageBtn),
					isPaging, isPageBtn;
	
				var iFrameContentHeight = listDiv.height();
	
				isPaging = (pagingDiv.length > 0) ? 24 : 0;
				isPageBtn = (pageBtnDiv.length > 0) ? 10 : 0;
	
				if($("#popContent").length > 0) {
					if( $(".pcWin:first").height() >= btnHeader.height() + scrollHeader.height() + scrollTable.height() + pagingDiv.height() + isPaging) {
						settings.fixedGridHeight = scrollTable.height() + 16;
					} else {
						settings.fixedGridHeight = $(".pcWin:first").height() - 32;
					}
				} else {
					iFrameContentHeight = parent.mainListHeight - (btnHeader.height() + scrollHeader.height() + noteDiv.height() + pagingDiv.height() + pageBtnDiv.height() + isPaging + isPageBtn);
	
					// 목록 스크롤 영역 설정
					if( parent.mainListHeight >= btnHeader.height() + scrollHeader.height() + scrollTable.height() + noteDiv.height() + pagingDiv.height() + pageBtnDiv.height() + isPaging + isPageBtn + 21) {
						settings.fixedGridHeight = scrollTable.height() + 16;
					} else {
						settings.fixedGridHeight = iFrameContentHeight - 5;
					}
				}
	
				fixedGrid.height(settings.fixedGridHeight - 16);
			}).height(settings.getFixedGridHeight());
		},
		syncGridXFixed: function(){// 스크롤 싱크
			return this.bind("scroll", function(){
				$(this).parents(".xyFix").find(".scrollHeader").scrollLeft($(this).scrollLeft());
				$(this).parents(".xyFix").find(".fixedGrid").scrollTop($(this).scrollTop());
			});
		},
		resizePop: function(settings){
			settings = $.extend({}, $.resizeConfig.popDefaults, settings);
			$(settings.content).height($(settings.win).height() - $(settings.header).height() - $(settings.footer).height() - 26);
			if($(settings.content)[0].scrollHeight > $(settings.content).height()+ 15) {
				$("#popFoot .popBtn").addClass("indented");
			} else {
				$("#popFoot .popBtn").removeClass("indented");
			}
		}
	});

	 var getMainListHeight = function(settings) {
		 var parentDiv;
		/* 고정영역과 프레임을 담은 주체가
		 * 1. 단일 페이지인 경우 컨테이너를 window 로 인식하게 하고 .container 의 높이를 100% 화 한다(실제로는 100% - 32).
		 * 2. PLM 레이아웃 내에 들어 있을 경우 컨테이너를 #ContentFrame 으로 설정한다.
		 */
		if($(settings.parent, parent.document).length <= 0) {
			$(".container").css({
				"height" : $(window).height() - 15,
				"overflow" : "hidden"
			});
			parentDiv = $(".container");
			// frame 사이즈 구하기

			mainListHeight = parentDiv.height() - ( $(settings.header).height() + $(settings.footer).height() + 15 );
			if ($(".ResultFooter") != null){
				mainListHeight -= 30;
			}
		} else {
			parentDiv = $(settings.parent, parent.document);
			// frame 사이즈 구하기

			mainListHeight = parentDiv.height() - $(settings.header).height() - $(settings.footer).height() - 35;
		}
	};
})(jQuery);

//alert();

$(function(){
	// IE6의 input 엘리먼트를 포함한 label 의 포커싱 버그 수정
	jQuery.each(jQuery.browser, function(i, val) {
		if(i=="msie" && jQuery.browser.version.substr(0,3)=="6.0") {
			/* 라디오 버튼 변환과 충돌하여 문제가 발생하거나 활용방법에 문제가 있는 것같아 비활성화.2010-02-18.공인식

			$("label").click(function(){
			// IE6의 input 엘리먼트를 포함한 label 의 포커싱 버그 수정
				$(this).find(":checkbox, :radio")[0].click();
			}); */
			$(".hasContext").mouseover(function(){
			// context 메뉴 버튼 토글 - IE6의 :hover 하위 엘리먼트 제어를 도움
				$(this).addClass("hasContextHover");
				$(this).children(".proc").show();
			}).mouseout(function(){
				$(this).removeClass("hasContextHover");
				$(this).children(".proc").hide();
			});
		}
	});
	// 체크리스트 - 전체선택
	if($(".checklist th.chk :checkbox")) {
		$(".checklist th.chk :checkbox").bind("click",function(){
			if(this.checked) {
				$(".checklist td.chk :checkbox").attr("checked",true);
			} else {
				$(".checklist td.chk :checkbox").attr("checked",false);
			}
		});
	}
	
	if($(".searchbox-toggle img")) {
		$(".searchbox-toggle img").click(function(){
			$(this).parent().prev().toggle();
			$(this).attr("src",
				($(this).parent().prev().is(":hidden")) ?
					$(this).attr("src").replace("close","open") : $(this).attr("src").replace("open","close")
			);
			$(this).attr("alt",
				($(this).parent().prev().is(":hidden")) ? "검색열기" : "검색닫기"
			);
			resizeListInit();
			return false;
		});
	}
	
	if($(".coChain-toggle img")) {
		$(".coChain-toggle img").click(function(){
			$(this).parent().prev().toggle();
			$(this).attr("src",
				($(this).parent().prev().is(":hidden")) ?
					$(this).attr("src").replace("close","open") : $(this).attr("src").replace("open","close")
			);
			$(this).attr("alt",
				($(this).parent().prev().is(":hidden")) ? "CoChain 열기" : "CoChain 닫기"
			);
			return false;
		});
	}
	
	if($(".openClose-toggle img")) {
		$(".openClose-toggle img").click(function(){
			$(this).parent().prev().toggle();
			$(this).attr("src",
				($(this).parent().prev().is(":hidden")) ?
					$(this).attr("src").replace("close","open") : $(this).attr("src").replace("open","close")
			);
			$(this).attr("alt",
				($(this).parent().prev().is(":hidden")) ? "열기" : "닫기"
			);
			if($(this).parent().parent().prev().is("iframe")) {
				$(this).parent().parent().prev().toggle();
				$(this).attr("src",
					($(this).parent().parent().prev().is(":hidden")) ?
						$(this).attr("src").replace("close","open") : $(this).attr("src").replace("open","close")
				);
			}
			if($("#ResultHeader").length > 0 && $("#ResultHeader").next("iframe").not(":hidden").length > 0) {
				resizeListInit();
			}
			return false;
		});
	}
	
	try {
		$(".closedDefault").hide(); // 토글영역 기본닫힘
	}catch(e){}
	//$(":checkbox:not(.win)").wrap({namespace:'jquery'}); 운용상의 문제로 비활성화.
	try {
		$(":radio:not(.win)").wrap({namespace:'jquery'});
	}catch(e){}


	/*
	 * 조회결과 목록영역(iframe) 리사이징
	 * innerDiv ID를 가진 영역이 존재할 경우 페이지 로딩($(document).ready)시 호출
	 */
	if($("#ResultHeader")!=null && $("#ResultHeader").length > 0) { // 본 페이지용

		resizeListInit();
		//$(window).bind("resize", resizeListInit);
		$(window).wresize(resizeListInit);
	}
	if($("#innerDiv")!=null && $("#innerDiv").length > 0) { // iframe용

		parent.resizeListInit();
		resizeGridXFixedInit();
		$(".scrollGrid").syncGridXFixed();
		$(window).wresize(resizeGridXFixedInit);
	}
	if($("#btnHeader")!=null && 
			$(".colui-2-lead-box")!=null && 
			$("#btnHeader").length > 0 && $(".colui-2-lead-box").length > 0) {
		parent.resizeListInit();
	}
	if($(".popContainer:first")!=null && $(".popContainer:first").length > 0) { // 팝업 레이아웃용

		$("html").css("overflow-y","hidden");
		$(window).resizePop();
		resizeGridXFixedInit();
		$(".scrollGrid").syncGridXFixed();
		$(window).wresize($.fn.resizePop);
		$(window).wresize(resizeGridXFixedInit);
	}

	try {
		$(".btn-cont .btn").mouseover(function(){
			$(this).parent().addClass("hover");
		}).mouseout(function(){
			$(this).parent().removeClass("hover");
		}).mousedown(function(){
			$(this).parent().addClass("down");
	    }).mouseup(function(){
			$(this).parent().removeClass("down");
			$(this).blur();
	    }).focus(function(){
			$(this).parent().addClass("down");
	    }).keyup(function(){
			$(this).parent().addClass("down");
	    }).blur(function(){
			$(this).parent().removeClass("down");
	    });
	} catch(e){}

	try {
		$(".pageBtn span a, .blockBtn span a, .listBtn span a, .popBtn span a, .compBtn span a, .fileBtn span a").mouseover(function(){
			$(this).parent().addClass("hover");
		}).mouseout(function(){
			$(this).parent().removeClass("hover");
		}).mousedown(function(){
			$(this).parent().addClass("down");
	    }).mouseup(function(){
			$(this).parent().removeClass("down");
			$(this).blur();
	    }).focus(function(){
			$(this).parent().addClass("down");
	    }).keyup(function(){
			$(this).parent().addClass("down");
	    }).blur(function(){
			$(this).parent().removeClass("down");
	    });
	} catch(e){}

	try {
		$("#AuthInfoDisplay").toggle(
			function(){
				$("#AuthInfoDetails").show();
				//$(this).text("권한정보 닫기");
			},
			function(){
				$("#AuthInfoDetails").hide();
				//$(this).text("권한정보 보기");
			}
		);
		$("#MenuExpand").click(function(){
			$(".searchbox .menu .addl").show();
		});
		$("#UserList tr").mouseover(function(){
			$(this).addClass("on");
		}).mouseout(function(){
			$(this).removeClass("on");
		}).mousedown(function(){
			$(this).removeClass("on");
			$(this).addClass("selected");
		}).mouseup(function(){
			location.href="../admin/user_info_modify.html";
		});
		$("#BoardList tr").mouseover(function(){
			$(this).addClass("on");
		}).mouseout(function(){
			$(this).removeClass("on");
		});
		$("#ReportList tr").mouseover(function(){
			$(this).addClass("on");
		}).mouseout(function(){
			$(this).removeClass("on");
		});
		$("#admin_ddadmin tr").mouseover(function(){
			$(this).addClass("on");
		}).mouseout(function(){
			$(this).removeClass("on");
		}).mousedown(function(){
			$(this).removeClass("on");
			$(this).addClass("selected");
		}).mouseup(function(){
			$(this).removeClass("selected");
		});
		$("tbody.content:not(.rowColor) tr:not(.selected), ul.checklist li").mouseover(function(){
			$(this).addClass("over");
		}).mouseout(function(){
			$(this).removeClass("over");
		});
		$("tbody.nOver tr").mouseover(function(){
			$(this).addClass("non");
		}).mouseout(function(){
			$(this).removeClass("non");
		});
	
		$("input.text").focus(function(){ 
			$(this).css("border","1px solid #3496B6");
		}).blur(function(){
			$(this).css("border","1px solid #829db8");
		});
	
		
		$("input.readOnly").focus(function(){ 
	
			$(this).css("border","0");
		}).blur(function(){
			$(this).css("border","0");
		});
		
		$("#MenuAdd").toggle(
			function(){
				$("#AddlMenu1").show();
			},
			function(){
				$("#AddlMenu2").show();
			}
		);
		$("#MenuAuthority .remove").click(function(){
			$(this).parent().hide();
		});
		$("#CheckUserSearch").toggle(
			function(){
				$("#Tip-UserSearch").show();
			},
			function(){
				$("#Tip-UserSearch").hide();
			}
		);
		$(".search button.search-user").click(function(){
			pop.searchuser("../search/user_org.html");
		});
		$("#WriteMail").click(function(){
			pop.open($(this).attr("href"),"WriteMailWin","width=840,height=552,scrollbars=yes,resizable=yes");
			return false;
		});
		$("#WriteSanctionReport").click(function(){
			pop.open($(this).attr("href"),"WriteSanctionReportWin","width=840,height=580,scrollbars=yes,resizable=yes");
			return false;
		});
		$("#SanctionReportWrite button.search-user").click(function(){
			pop.open("../search/user_approver_org.html","MailReceiver","width=700,height=532");
		});
		$(".user .index-tab a").mouseover(function(){
			$(this).parents("li").addClass("hover");
		}).mouseout(function(){
			$(this).parents("li").removeClass("hover");
		});
		$("#SanctionOption .note").toggle(
			function(){
				$("#SanctionOption .cont").show();
				$(this).addClass("open");
			},
			function(){
				$("#SanctionOption .cont").hide();
				$(this).removeClass("open");
			}
		);
		$("#ProdImageView").mouseover(function(){
			$("#ProdImageSample").show();
		}).mouseout(function(){
			$("#ProdImageSample").hide();
		});
		$("#Organization .apply-all, #Organization .apply-selected").click(function(){
			$(opener.document).find("select[name='mail_reciever_list']").prepend("<option>asdfasdfa</option>");
			//var target = $("select[name='mail_reciever_list']",opener.document);
			//$(target[0]).prepend("<option>asdfasdfa</option>");
			//opener.focus();
			return false;
		});
		
	} catch(e){}
	
	try {
		$(".toggle-details a").click(function(){
			var target = $(this).attr("href").split("#")[1];
			$("#"+target).slideToggle("fast",function(){
				if($(".toggle-details a").hasClass("open")) {
					$(".toggle-details img").attr("src",$(".toggle-details img").attr("src").replace("close","view"));
					$(".toggle-details a").switchClass("closed","open");
				} else {
					$(".toggle-details img").attr("src",$(".toggle-details img").attr("src").replace("view","close"));
					$(".toggle-details a").switchClass("open","closed");
				}
			});
			return false;
		});
	} catch(e){}
	
	try {
	$("#PS .slide .toggle").click(function(){
		// 언더탭 토글
			if ($(this).hasClass("closed")) {
				// 열림
					$("#PS .slide").height(284).animate({
						marginTop: "-254px"
					}, 100, "", function(){
						$("#PS .slide .toggle").show().switchClass("open", "closed");
						$("#PS .tabLeft, #PS .tabRight").show();
						var el = $("#PS .slide .sup li").hasClass("ui-tabs-selected");
						if (!el) {
							$("#PS .slide .sup").tabs("option", "selected", 0);
						}
					});
			} else {
				// 닫힘
				$("#PS .slide").height(29).animate({
					marginTop: 0
					}, 100, "", function(){
						$("#PS .slide .toggle").hide().switchClass("closed","open");
						$("#PS .tabLeft, #PS .tabRight").hide();
						var el = $("#PS .slide .sup li").hasClass("ui-tabs-selected");
						if(el) {
							var target = $("#PS .slide .sup li.ui-tabs-selected a").attr("href");
							$(target).switchClass("ui-tabs-hide","ui-tabs-panel");
							$("#PS .slide .sup li.ui-tabs-selected").removeClass("ui-tabs-selected");
						}
					}
				);
			}
		});

	$("#PS .slide .tab a").mouseover(function(){
		$(this).parent().addClass("on");
	}).mouseout(function(){
		$(this).parent().removeClass("on");
	});
	} catch(e){}

});

// 윈도우 팝업 단순 개체(리터럴)
pop = {
	open : function(url,name,opt) {
		window.open(url,name,opt);
	},
	close : function() {
		self.close();
	},
	datepicker : function(url) {
		window.open(url,"DatePicker","width=329,height=229");
	},
	setauth : function(url) {
		window.open(url,"SetAuthority","width=482,height=496");
	},
	setauth_reg : function(url) {
		window.open(url,"SetAuthority","width=482,height=589");
	},
	authaddl : function(url) {
		window.open(url,"AdditionalAuthority","width=260,height=300");
	},
	searchuser : function(url) {
		window.open(url,"SearchUser","width=700,height=419");
	},
	alert : function(url) {
		window.open(url,"Alert","width=292,height=150");
	}
};

// tab
function tabControl(tabNumber, maxNumber){
	for(i=0; i<maxNumber; i++){
		if(i == tabNumber){
		eval('tabOn'+i).style.display = 'block';
		eval('tabOff'+i).style.display = 'none';
		eval('tabCont'+i).style.display = 'block';
		}else{
		eval('tabOn'+i).style.display = 'none';
		eval('tabOff'+i).style.display = 'block';
		eval('tabCont'+i).style.display = 'none';
		}
	}
}
function tabControlUrl(tabNumber, maxNumber, contentUrl){
	for(i=0; i<maxNumber; i++){
		if(i == tabNumber){
		eval('tabOn'+i).style.display = 'block';
		eval('tabOff'+i).style.display = 'none';
		document.all.tabContentInfo.src = contentUrl;
		}else{
		eval('tabOn'+i).style.display = 'none';
		eval('tabOff'+i).style.display = 'block';
		}
	}
}