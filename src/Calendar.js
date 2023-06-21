import { useState } from "react";
import {
  format,
  subMonths,
  addMonths,
  startOfWeek,
  addDays,
  isSameDay,
  lastDayOfWeek,
  getWeek,
  addWeeks,
  subWeeks,
  isPast,
  isBefore
} from "date-fns";

import times from "./modules/time-files";
import timeZones from "./modules/time-zones";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import moment from "moment/moment";


const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(getWeek(currentMonth));

  const changeMonthHandle = (btnType) => {
    if (btnType === "prev") {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
    if (btnType === "next") {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  const changeWeekHandle = (btnType) => {
    if (btnType === "prev") {
      setCurrentMonth(subWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(subWeeks(currentMonth, 1)));
    }
    if (btnType === "next") {
      setCurrentMonth(addWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(addWeeks(currentMonth, 1)));
    }
  };


  const renderHeader = () => {
    const dateFormat = "MMM yyyy";
    return (
      <div className="header row flex-middle">
        <div className="col col-start nextPreviousColor">
          <div className="icon" onClick={() => changeWeekHandle("prev")}>
            <AiFillCaretLeft />Previous Week
          </div>
        </div>
        {/*  <div className="col col-start">
          <div className="icon" onClick={() => changeMonthHandle("prev")}>
            prev month
          </div>
        </div> */}
        <div className="col col-center">
          <span>{format(currentMonth, dateFormat)}</span>
        </div>
        {/* <div className="col col-end">
          <div className="icon" onClick={() => changeMonthHandle("next")}>next month</div>
        </div> */}
        <div className="col col-end nextPreviousColor" onClick={() => changeWeekHandle("next")}>
          <div className="icon">Next Week<AiFillCaretRight /></div>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEE";
    const days = [];
    let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i + '_q'}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  };

  const timeZoneComponent = () => {
    const dateFormat = "EEE";
    const tzs = [];
    let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    for (let i = 0; i < timeZones.length; i++) {
      tzs.push(
        <option key={timeZones[i].tzCode} value={timeZones[i].label}>{timeZones[i].label}</option>
      );
    }

    return <div className="row m-0 p-3">

      <div className="h5 d-flex p-0"><strong>Timezone:</strong></div>
      <select class="custom-select" id="inputGroupSelect01">
        <option selected>Choose...</option>
        {tzs}
      </select>
    </div>;
  };

  const renderCells = () => {
    const dateFormatDay = "EEE";
    const daysStr = [];
    let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      daysStr.push(
        <div className="col col-center" key={i}>
          {format(addDays(startDate, i), dateFormatDay)}
        </div>
      );
    }

    const endDate = lastDayOfWeek(currentMonth, { weekStartsOn: 1 });
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const d = new Date();
        let h = d.getHours();
        let m = d.getMinutes();
        let s = d.getSeconds();

        if (i < 5) { // conditioning to remove saturday sunday
          days.push(
            <div className="d-flex">
              <div className={`col-1 cell ${isSameDay(day, new Date()) ? "today" : ""}`} key={day} >
                <div className="d-flex col-center flex-column h-100" key={i}>
                  <div className="w-100">
                    {format(addDays(startDate, i), dateFormatDay)}
                  </div>
                  <div className="number w-100">
                    {formattedDate}
                  </div>
                </div>
              </div>
              <div className="col-11 cell-time">

                {(isBefore(day, Date.now()) && !isSameDay(day, new Date())) ? <div className="d-flex fontTime p-2">Past</div> :
                  times.map(item =>
                    isSameDay(day, new Date()) ?
                    <div key={day + '-' + item} className='displayTime fontTime p-2'>
                        <input key={day + '-' + item + 'input'} id={day + '-' + item + 'input'} type='checkbox' value={item} 
                          disabled = {
                            moment.duration(moment(item, ["h:mm A"]).format("HH:mm")).asSeconds() < moment.duration(moment(new Date(), ["h:mm A"]).format("HH:mm")).asSeconds()
                          }
                        />
                        <label key={day + '-' + item + 'label'} forHtml={day + '-' + item + 'input'}
                          className={
                            (moment.duration(moment(item, ["h:mm A"]).format("HH:mm")).asSeconds() < moment.duration(moment(new Date(), ["h:mm A"]).format("HH:mm")).asSeconds()) ? 'disabledText' : 'text'
                          }
                        >{item}</label>
                      </div>
                      : <div key={day + '-' + item} className='displayTime fontTime p-2'>
                        <input key={day + '-' + item + 'input'} id={day + '-' + item + 'input'} type='checkbox' value={item} />
                        <label key={day + '-' + item + 'label'} forHtml={day + '-' + item + 'input'}>{item}</label>
                      </div>
                  )
                }
              </div>
            </div>
          );
        }
        day = addDays(day, 1);
      }

      rows.push(
        <div className="col-center calenderTable" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  const renderFooter = () => {
    return (
      <div className="footer row flex-middle m-0">
        {/* <div className="col col-start">
          <div className="icon" onClick={() => changeWeekHandle("prev")}>
            prev week
          </div>
        </div> */}
        <div>Week : {currentWeek}</div>
        {/* <div className="col col-end" onClick={() => changeWeekHandle("next")}>
          <div className="icon">next week</div>
        </div> */}
      </div>
    );
  };
  return (
    <div className="calendar">
      {renderHeader()}
      {/* {renderDays()} */}
      {timeZoneComponent()}
      {renderCells()}
      {renderFooter()}
    </div>
  );
};

export default Calendar;
