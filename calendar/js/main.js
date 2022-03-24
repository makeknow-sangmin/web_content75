var draggedEventIsAllDay;
var activeInactiveWeekends = true;

var calendar = $('#calendar').fullCalendar({

 /** ******************
   *  OPTIONS
   * *******************/
  locale                    : 'ko',    
  timezone                  : "local", 
  nextDayThreshold          : "09:00:00",
  allDaySlot                : true,
  displayEventTime          : true,
  displayEventEnd           : true,
  firstDay                  : 0, //월요일이 먼저 오게 하려면 1
  weekNumbers               : false,
  selectable                : true,
  weekNumberCalculation     : "ISO",
  eventLimit                : true,
  views                     : { 
                                month : { eventLimit : 3 } // 한 날짜에 최대 이벤트 12개, 나머지는 + 처리됨
                              },
  eventLimitClick           : 'popover', //popover
  navLinks                  : true,
  defaultDate               : new Date(), //실제 사용시 현재 날짜로 수정
  timeFormat                : 'HH:mm',
  defaultTimedEventDuration : '01:00:00',
  editable                  : true,
  minTime                   : '00:00:00',
  maxTime                   : '24:00:00',
  slotLabelFormat           : 'HH:mm',
  weekends                  : true,
  nowIndicator              : true,
  dayPopoverFormat          : 'MM/DD dddd',
  longPressDelay            : 0,
  eventLongPressDelay       : 0,
  selectLongPressDelay      : 0,  
  header                    : {
                                left   : 'today, prevYear, nextYear, viewWeekends',
                                center : 'prev, title, next',
                                // right  : 'month, agendaWeek, agendaDay, listWeek'
                                right  : 'month'
                              },
  views                     : {
                                month : {
                                  columnFormat : 'dddd'
                                },
                                agendaWeek : {
                                  columnFormat : 'M/D ddd',
                                  titleFormat  : 'YYYY년 M월 D일',
                                  eventLimit   : false
                                },
                                agendaDay : {
                                  columnFormat : 'dddd',
                                  eventLimit   : false
                                },
                                listWeek : {
                                  columnFormat : ''
                                }
                              },
  customButtons             : { //주말 숨기기 & 보이기 버튼
                                viewWeekends : {
                                  text  : '주말',
                                  click : function () {
                                    activeInactiveWeekends ? activeInactiveWeekends = false : activeInactiveWeekends = true;
                                    $('#calendar').fullCalendar('option', { 
                                      weekends: activeInactiveWeekends
                                    });
                                  }
                                }
                               },


  eventRender: function (event, element, view) {


    
   
		time = element.find('.fc-time').detach();					;
    element.find('.fc-title').after(time);
    // element.append("<div>" + event.description + "</div>");

    //일정에 hover시 요약
    element.popover({
      title: $('<div />', {
        class: 'popoverTitleCalendar',
        text: event.title
      }).css({
        'background': event.backgroundColor,
        'color': event.textColor
      }),
      content: $('<div />', {
          class: 'popoverInfoCalendar'
        }).append('<p><strong>시작:</strong> ' + event.start.format('HH:mm') + '</p>')
        .append('<p><strong>끝:</strong> ' + event.end.format('HH:mm') + '</p>')
        .append('<p><strong>구분:</strong> ' + event.type + '</p>')
        // .append('<div class="popoverDescCalendar"><strong>설명:</strong> ' + event.description + '</div>')
        .append('<strong>설명:</strong> ' + event.description + '</div>')
        .append('<p><strong>등록자:</strong> ' + event.username + '</p>')
        .append('<p><strong>등록시간:</strong> ' + event.createDate + '</p>')
        .append('<p><strong>수정자:</strong> ' + event.changerName + '</p>')
        .append('<p><strong>수정시간:</strong> ' + event.changeDate + '</p>')
       
      
        ,
      delay: {
        show: "800",
        hide: "50"
      },
      trigger: 'hover',
      placement: 'top',
      html: true,
      container: 'body'
    });

    return filtering(event);

  },

  /* ****************
   *  일정 받아옴 
   * ************** */
  // events: function (start, end, timezone, callback) {
  //   $.ajax({
  //     type: "get",
  //     url: CONTEXT_PATH + '/statistics/task.do?method=readTaskCal',
  //     data: {
  //       // 화면이 바뀌면 Date 객체인 start, end 가 들어옴
  //       //startDate : moment(start).format('YYYY-MM-DD'),
  //       //endDate   : moment(end).format('YYYY-MM-DD')
  //       user_uid : vCUR_USER_UID
  //     },
  //     success: function (response) {
  //       var arr = [{title: 'evt1', start:'ssssss'}, {title: 'evt2', start:'123123123'}];
  //       // var fixedDate = response.map(function (array) {
  //       //   if (array.allDay && array.start !== array.end) {
  //       //     array.end = moment(array.end).add(1, 'days'); // 이틀 이상 AllDay 일정인 경우 달력에 표기시 하루를 더해야 정상출력
  //       //   }
  //         console.log("test");
  //         console.log(response);
  //         console.log(callback);
  //         // return arr;
  //       // });
  //       callback(response);
  //     }
  //   });
  // },

  events: function(start, end, timezone, callback){//이벤트 출력부분
    $.ajax({
    url: CONTEXT_PATH + '/statistics/task.do?method=readTaskCal',
    type:'GET',
    dataType: 'json',
    data:{
      user_uid : vCUR_USER_UID,
      dept_code : vCUR_DEPT_CODE 
    },
    success:function(data){
      //         console.log(response);
     
    var events=[];
    $(data.list).each(function(index){
    //alert(val.start);
    
    
    events.push({
      id: data.list[index].id,
      title: data.list[index].title,
      start: data.list[index].start,
      end: data.list[index].end,
      textColor:data.list[index].textColor,
      backgroundColor:data.list[index].backgroundColor,
      username :data.list[index].user_name,
      type : (data.list[index].task_type_ko),
      changerName : data.list[index].changer_name,
      changeDate : data.list[index].change_date,
      createDate : data.list[index].create_date,
      description : data.list[index].description
    });
   
      });

      // $("#calendar").fullCalendar('renderEvent', data.list, true);
      console.log(events);
      callback(events);
    },
    errorr:function(status, request, error){
    alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error"+error);
    }
    });//ajax
    },

  // events: function(info, successCallback, failureCallback){ // ajax 처리로 데이터를 로딩 시킨다.
  //    $.ajax({ 
  //      type:"get",
  //      data: {
  //             // 화면이 바뀌면 Date 객체인 start, end 가 들어옴
  //             //startDate : moment(start).format('YYYY-MM-DD'),
  //             //endDate   : moment(end).format('YYYY-MM-DD')
  //             user_uid : vCUR_USER_UID
  //           },
  //      url: CONTEXT_PATH + '/statistics/task.do?method=readTaskCal',
  //       dataType:"json" 
  //     }); 
  //   },



  eventAfterAllRender: function (view) {
    if (view.name == "month") $(".fc-content").css('height', 'auto');
  },

  //일정 리사이즈
  // eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
  //   $('.popover.fade.top').remove();

  //   /** 리사이즈시 수정된 날짜반영
  //    * 하루를 빼야 정상적으로 반영됨. */
  //   var newDates = calDateWhenResize(event);

  //   //리사이즈한 일정 업데이트
  //   $.ajax({
  //     type: "get",
  //     url: "",
  //     data: {
  //       //id: event._id,
  //       //....
  //     },
  //     success: function (response) {
  //       alert('수정: ' + newDates.startDate + ' ~ ' + newDates.endDate);
  //     }
  //   });

  // },

  eventDragStart: function (event, jsEvent, ui, view) {
    draggedEventIsAllDay = event.allDay;
  },

  //일정 드래그앤드롭
  // eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
  //   $('.popover.fade.top').remove();

  //   //주,일 view일때 종일 <-> 시간 변경불가
  //   if (view.type === 'agendaWeek' || view.type === 'agendaDay') {
  //     if (draggedEventIsAllDay !== event.allDay) {
  //       alert('드래그앤드롭으로 종일<->시간 변경은 불가합니다.');
  //       location.reload();
  //       return false;
  //     }
  //   }

  //   // 드랍시 수정된 날짜반영
  //   var newDates = calDateWhenDragnDrop(event);

  //   //드롭한 일정 업데이트
  //   $.ajax({
  //     type: "get",
  //     url: "",
  //     data: {
  //       //...
  //     },
  //     success: function (response) {
  //       alert('수정: ' + newDates.startDate + ' ~ ' + newDates.endDate);
  //     }
  //   });

  // },

  select: function (startDate, endDate, jsEvent, view) {

    $(".fc-body").unbind('click');
    $(".fc-body").on('click', 'td', function (e) {

      $("#contextMenu")
        .addClass("contextOpened")
        .css({
          display: "block",
          left: e.pageX,
          top: e.pageY
        });
      return false;
    });

    var today = moment();

    if (view.name == "month") {
      startDate.set({
        hours: today.hours(),
        minute: today.minutes()
      });
      startDate = moment(startDate).format('YYYY-MM-DD HH:mm');
      endDate = moment(endDate).subtract(1, 'days');

      endDate.set({
        hours: today.hours() + 1,
        minute: today.minutes()
      });
      endDate = moment(endDate).format('YYYY-MM-DD HH:mm');
    } else {
      startDate = moment(startDate).format('YYYY-MM-DD HH:mm');
      endDate = moment(endDate).format('YYYY-MM-DD HH:mm');
    }

    //날짜 클릭시 카테고리 선택메뉴
    var $contextMenu = $("#contextMenu");
    $contextMenu.on("click", "a", function (e) {
      e.preventDefault();

      //닫기 버튼이 아닐때
      if ($(this).data().role !== 'close') {
        newEvent(startDate, endDate, $(this).html());
      }

      $contextMenu.removeClass("contextOpened");
      $contextMenu.hide();
    });

    $('body').on('click', function () {
      $contextMenu.removeClass("contextOpened");
      $contextMenu.hide();
    });

  },

  //이벤트 클릭시 수정이벤트
  eventClick: function (event, jsEvent, view) {
    editEvent(event);
  }

});

function getDisplayEventDate(event) {

  var displayEventDate;

  if (event.allDay == false) {
    var startTimeEventInfo = moment(event.start).format('HH:mm');
    var endTimeEventInfo = moment(event.end).format('HH:mm');
    displayEventDate = startTimeEventInfo + " - " + endTimeEventInfo;
  } else {
    displayEventDate = "하루종일";
  }

  return displayEventDate;
}

function filtering(event) {
  // var show_username = true;
  var show_type = false;

  var username = $('input:checkbox.filter:checked').map(function () {
    return $(this).val();
  }).get();
  var types = $('#type_filter').val();
 
  // show_username = username.indexOf(event.username) >= 0;

  if (types && types.length > 0) {
    if (types[0] == "전체") {
      show_type = true;
    } else {
      show_type = types.indexOf(event.type) >= 0;
    }
  }else{
    show_type = true;
  }

  return show_type;
}

function calDateWhenResize(event) {

  var newDates = {
    startDate: '',
    endDate: ''
  };

  if (event.allDay) {
    newDates.startDate = moment(event.start._d).format('YYYY-MM-DD');
    newDates.endDate = moment(event.end._d).subtract(1, 'days').format('YYYY-MM-DD');
  } else {
    newDates.startDate = moment(event.start._d).format('YYYY-MM-DD HH:mm');
    newDates.endDate = moment(event.end._d).format('YYYY-MM-DD HH:mm');
  }

  return newDates;
}

function calDateWhenDragnDrop(event) {
  // 드랍시 수정된 날짜반영
  var newDates = {
    startDate: '',
    endDate: ''
  }

  // 날짜 & 시간이 모두 같은 경우
  if(!event.end) {
    event.end = event.start;
  }

  //하루짜리 all day
  if (event.allDay && event.end === event.start) {
    console.log('1111')
    newDates.startDate = moment(event.start._d).format('YYYY-MM-DD');
    newDates.endDate = newDates.startDate;
  }

  //2일이상 all day
  else if (event.allDay && event.end !== null) {
    newDates.startDate = moment(event.start._d).format('YYYY-MM-DD');
    newDates.endDate = moment(event.end._d).subtract(1, 'days').format('YYYY-MM-DD');
  }

  //all day가 아님
  else if (!event.allDay) {
    newDates.startDate = moment(event.start._d).format('YYYY-MM-DD HH:mm');
    newDates.endDate = moment(event.end._d).format('YYYY-MM-DD HH:mm');
  }

  return newDates;
}