import moment from "moment";
import type { EventInput } from "@fullcalendar/core";

const todayDate = moment().startOf("day");
const YM = todayDate.format("YYYY-MM");
const YESTERDAY = todayDate.clone().subtract(1, "day").format("YYYY-MM-DD");
const TODAY = todayDate.format("YYYY-MM-DD");
const TOMORROW = todayDate.clone().add(1, "day").format("YYYY-MM-DD");

const events: Array<EventInput> = [
  {
    title: "성남청소년센터 - Basic",
    start: TODAY + "T10:00:00",
    description: "이가영 - 중구, 연락처: 010-4125-8381",
    className: "fc-event-success",
  },
  {
    title: "성남청소년센터 - Basic",
    start: TODAY + "T12:00:00",
    description: "이가영 - 중구, 연락처: 010-4125-8381",
    className: "fc-event-success",
  },
  {
    title: "성남청소년센터(단기) - Teams Bundle",
    start: TOMORROW + "T14:00:00",
    description: "정호경 - 중구, 연락처: 010-4641-0270",
    className: "fc-event-primary",
  },
  {
    title: "남목청소년센터(도우리반) - Enterprise",
    start: TOMORROW + "T16:00:00",
    description: "이기은 - 중구, 연락처: 010-8634-9556",
    className: "fc-event-warning",
  },
  {
    title: "남목청소년센터(나누리반) - Basic",
    start: YM + "-09T10:00:00",
    description: "이기은 - 중구, 연락처: 010-8634-9556",
    className: "fc-event-warning",
  },
  {
    title: "남목청소년센터(동아리) - Enterprise Bundle",
    start: YM + "-09T12:00:00",
    description: "이기은 - 중구, 연락처: 010-8634-9556",
    className: "fc-event-success",
  },
  {
    title: "북구청소년센터 - Teams",
    start: YM + "-10",
    description: "북구청소년센터 연락처: 없음",
    className: "fc-event-success",
  },
  {
    title: "북구청소년센터 - Enterprise",
    start: YM + "-11",
    description: "북구청소년센터 연락처: 없음",
    className: "fc-event-danger",
  },
  {
    title: "북구청소년센터(단기) - Basic",
    start: YM + "-12T10:00:00",
    description: "신명재 - 북구, 연락처: 010-9905-2520",
    className: "fc-event-warning",
  },
  {
    title: "북구청소년센터(동아리) - Enterprise Bundle",
    start: YM + "-12T14:00:00",
    description: "신명재 - 북구, 연락처: 010-9905-2520",
    className: "fc-event-success",
  },
];

export default events;

export { todayDate, YM, YESTERDAY, TODAY, TOMORROW };
