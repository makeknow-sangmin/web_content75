var dayText = '<spring:message code="calendar.dayText" text="Day"/>';
var weekText = '<spring:message code="calendar.weekText" text="Week"/>';
var monthText = '<spring:message code="calendar.monthText" text="Month"/>';
var toText	='<spring:message code="calendar.toText" text="to"/>';
var allDayText	='<spring:message code="calendar.allDayText" text="All day"/>';
var emptyText	='<spring:message code="calendar.emptyText" text="Event Title"/>';
var delEvent	='<spring:message code="calendar.delEvent" text="Delete Event"/>';
var save	='<spring:message code="calendar.save" text="Save"/>';
var cancel	='<spring:message code="calendar.cancel" text="Cancel"/>';
var editDetail	='<spring:message code="calendar.editDetail" text="Edit Details…"/>';
var ddMoveEventText	='<spring:message code="calendar.ddMoveEventText" text="Move event to {0}"/>';
var ddResizeEventText	='<spring:message code="calendar.ddResizeEventText" text="Update event to {0}"/>';
var todayText	='<spring:message code="calendar.todayText" text="Today"/>';
var ddCreateEventText	='<spring:message code="calendar.ddCreateEventText" text="Create event for {0}"/>';
var fieldLabel_calendar	='<spring:message code="calendar.fieldLabel.calendar" text="Calendar"/>';
var fieldLabel_reminder	='<spring:message code="calendar.fieldLabel.reminder" text="Reminder"/>';
var fieldLabel_title	='<spring:message code="calendar.fieldLabel.title" text="Title"/>';
var fieldLabel_when	='<spring:message code="calendar.fieldLabel.when" text="When"/>';
var fieldLabel_notes	='<spring:message code="calendar.fieldLabel.notes" text="Notes"/>';
var fieldLabel_location	='<spring:message code="calendar.fieldLabel.location" text="Location"/>';
var fieldLabel_link	='<spring:message code="calendar.fieldLabel.link" text="Web Link"/>';
var selectedUser = null;
var selectedResrarchYn = null;

var eastNorthWidth = 800;
var eastNorthHeight = 300;
var eastCenterWidth = 800;
var eastCenterHeight = 300;
var eastSouth1Width = 300;
var eastSouth1Height = 200;
var eastSouth2Width = 300;
var eastSouth2Height = 200;
var eastSouth3Width = 300;
var eastSouth3Height = 200;
var eastSouth4Width = 300;
var eastSouth4Height = 200;
var ocProjectTotalEastNorth = null;
var ocProjectTotalEastCenter = null;
var ocProjectTotalEastSouth1 = null;
var ocProjectTotalEastSouth2 = null;
var ocProjectTotalEastSouth3 = null;
var ocProjectTotalEastSouth4 = null;

var VIEW_ALL_POWER =true;
var AUTO_REFRESH = true;

var projectPopupParams = {};

var PRODUCT_PARAMS = {};
var ORG_PARAMS = {};
var CAR_PARAMS = {};
var TECH_PARAMS = {};
var TEAM_PARAMS = {};
var COST_PARAMS = {};
var TOTAL_PARAMS = {};
var HISTORY_PARAMS = {};
       
PRODUCT_PARAMS['projectProduct-SearchType'] = '공수';
PRODUCT_PARAMS['projectProduct-Month'] = '2016년 01월';
        
ORG_PARAMS['projectOrg-SearchType'] = '공수';
ORG_PARAMS['projectOrg-Month'] = '2016년 01월';

CAR_PARAMS['projectCar-SearchType'] = '공수';
CAR_PARAMS['projectCar-Month'] = '2016년 01월';
CAR_PARAMS['projectCar-SearchOem'] = 'HMC';

TECH_PARAMS['projectTech-SearchType'] = '공수';
TECH_PARAMS['projectTech-Month'] = '2016년 01월';

TEAM_PARAMS['projectTeam-SearchType'] = '공수';
TEAM_PARAMS['projectTeam-SearchOrg'] = '연구';
TEAM_PARAMS['projectTeam-Month'] = '2016년 01월';

COST_PARAMS['projectCost-Month'] = '2016년 01월';
COST_PARAMS['projectCost-SearchOem'] = 'HMC';
//COST_PARAMS['projectCost-SearchCarmodel'] = 'AE 16';

HISTORY_PARAMS['projectHistory-SearchOem'] = 'HMC';

TOTAL_PARAMS['projectTotal-Month'] = '2016년 01월';


var Util = {
    thousandsRenderer : function() {
        return Ext.util.Format.numberRenderer('0,000');
    }
};

