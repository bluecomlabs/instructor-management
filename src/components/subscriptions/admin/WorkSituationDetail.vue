<template>
  <div class="card card-flush pt-3 mb-5 mb-xl-10">
    <div class="card-header">
      <div class="card-title">
        <h2 class="fw-bold">8월 근무상황부</h2>
      </div>
    </div>
    <div class="card-body pt-3">
      <div class="mb-10">
        <div class="d-flex flex-wrap py-5">
          <div class="flex-equal me-5">
            <table class="table fs-6 fw-semibold gs-0 gy-2 gx-2 m-0">
              <tr>
                <td class="text-gray-500 min-w-175px w-175px">작성일자:</td>
                <td class="text-gray-800 min-w-200px">2024년 7월 31일</td>
              </tr>
              <tr>
                <td class="text-gray-500">근무자명:</td>
                <td class="text-gray-800">홍길동</td>
              </tr>
              <tr>
                <td class="text-gray-500">근무기간:</td>
                <td class="text-gray-800">2024.08.01 ~ 2024.08.31</td>
              </tr>
              <tr>
                <td class="text-gray-500">기관명:</td>
                <td class="text-gray-800">울산SW미래채움</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="mb-0">
        <h5 class="mb-4">업무 스케줄</h5>
        <div class="table-responsive">
          <table class="table table-bordered" id="workTable">
            <thead>
              <tr>
                <th style="white-space: nowrap;">날짜/요일</th>
                <th style="white-space: nowrap;">근무처</th>
                <th style="white-space: nowrap;">업무시간</th>
                <th style="white-space: nowrap;">공휴시간</th>
                <th style="white-space: nowrap;">식사시간</th>
                <th style="white-space: nowrap;">근무시간</th>
                <th style="white-space: nowrap;">본근무시간</th>
                <th style="white-space: nowrap;">연구근무시간</th>
                <th style="white-space: nowrap;">업무내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1 (목)</td>
                <td>미래채움센터</td>
                <td>13:00 ~ 16:00</td>
                <td>02:00</td>
                <td>01:00</td>
                <td>03:00</td>
                <td>02:00</td>
                <td>00:00</td>
                <td>울산센터(제페토)</td>
              </tr>
              <tr>
                <td>2 (금)</td>
                <td>미래채움센터</td>
                <td>13:00 ~ 16:00</td>
                <td>02:00</td>
                <td>01:00</td>
                <td>03:00</td>
                <td>02:00</td>
                <td>00:00</td>
                <td>울산센터 오조봇(케미키트다운)</td>
              </tr>
              <tr>
                <td>3 (토)</td>
                <td>연구활동</td>
                <td>09:00 ~ 16:00</td>
                <td>07:00</td>
                <td>01:00</td>
                <td>06:00</td>
                <td>05:00</td>
                <td>00:00</td>
                <td>울산센터(제페토)</td>
              </tr>
              <tr>
                <td>4 (일)</td>
                <td>미래채움센터</td>
                <td>13:00 ~ 16:00</td>
                <td>02:00</td>
                <td>01:00</td>
                <td>03:00</td>
                <td>02:00</td>
                <td>00:00</td>
                <td>울산센터(제페토)</td>
              </tr>
              <tr>
                <td>5 (월)</td>
                <td>미래채움센터</td>
                <td>13:00 ~ 16:00</td>
                <td>02:00</td>
                <td>01:00</td>
                <td>03:00</td>
                <td>02:00</td>
                <td>00:00</td>
                <td>울산센터 오조봇(케미키트다운)</td>
              </tr>
              <tr>
                <td>6 (화)</td>
                <td>연구활동</td>
                <td>09:00 ~ 16:00</td>
                <td>07:00</td>
                <td>01:00</td>
                <td>06:00</td>
                <td>05:00</td>
                <td>00:00</td>
                <td>울산센터(제페토)</td>
              </tr>
              <tr>
                <td>7 (수)</td>
                <td>미래채움센터</td>
                <td>13:00 ~ 16:00</td>
                <td>02:00</td>
                <td>01:00</td>
                <td>03:00</td>
                <td>02:00</td>
                <td>00:00</td>
                <td>울산센터(제페토)</td>
              </tr>
              <tr>
                <td>8 (목)</td>
                <td>미래채움센터</td>
                <td>13:00 ~ 16:00</td>
                <td>02:00</td>
                <td>01:00</td>
                <td>03:00</td>
                <td>02:00</td>
                <td>00:00</td>
                <td>울산센터 오조봇(케미키트다운)</td>
              </tr>
              <tr>
                <td>9 (금)</td>
                <td>연구활동</td>
                <td>09:00 ~ 16:00</td>
                <td>07:00</td>
                <td>01:00</td>
                <td>06:00</td>
                <td>05:00</td>
                <td>00:00</td>
                <td>울산센터(제페토)</td>
              </tr>
              <tr>
                <td>10 (토)</td>
                <td>미래채움센터</td>
                <td>13:00 ~ 16:00</td>
                <td>02:00</td>
                <td>01:00</td>
                <td>03:00</td>
                <td>02:00</td>
                <td>00:00</td>
                <td>울산센터(제페토)</td>
              </tr>
              <tr>
                <td>11 (일)</td>
                <td>미래채움센터</td>
                <td>13:00 ~ 16:00</td>
                <td>02:00</td>
                <td>01:00</td>
                <td>03:00</td>
                <td>02:00</td>
                <td>00:00</td>
                <td>울산센터 오조봇(케미키트다운)</td>
              </tr>
              <tr>
                <td>12 (월)</td>
                <td>연구활동</td>
                <td>09:00 ~ 16:00</td>
                <td>07:00</td>
                <td>01:00</td>
                <td>06:00</td>
                <td>05:00</td>
                <td>00:00</td>
                <td>울산센터(제페토)</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2">합계</td>
                <td id="totalWorkTime"></td>
                <td id="totalHolidayTime"></td>
                <td id="totalMealTime"></td>
                <td id="totalWorkHourTime"></td>
                <td id="totalMainWorkTime"></td>
                <td id="totalResearchTime"></td>
                <td></td>
              </tr>
              <tr>
                <td colspan="9" class="text-right">
                  <div>
                    <strong>초과근무시간:</strong> 1시간 30분 미인정
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'kt-details',
  setup() {
    onMounted(() => {
      populateRemainingDates();
      calculateTotals();
    });

    function populateRemainingDates() {
      const tbody = document.querySelector("#workTable tbody");
      const month = 7; 
      const year = 2024;

      const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

      for (let day = 13; day <= 31; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = daysOfWeek[date.getDay()];
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${day} (${dayOfWeek})</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        `;
        tbody.appendChild(row);
      }
    }

    function calculateTotals() {
      const rows = document.querySelectorAll("#workTable tbody tr");

      let totalWorkTime = 0;
      let totalHolidayTime = 0;
      let totalMealTime = 0;
      let totalWorkHourTime = 0;
      let totalMainWorkTime = 0;
      let totalResearchTime = 0;

      rows.forEach(row => {
        const workTime = row.cells[2].innerText.split(':');
        const holidayTime = row.cells[3].innerText.split(':');
        const mealTime = row.cells[4].innerText.split(':');
        const workHourTime = row.cells[5].innerText.split(':');
        const mainWorkTime = row.cells[6].innerText.split(':');
        const researchTime = row.cells[7].innerText.split(':');

        if (workTime.length > 1) {
          totalWorkTime += parseInt(workTime[0]) * 60 + parseInt(workTime[1]);
        }
        if (holidayTime.length > 1) {
          totalHolidayTime += parseInt(holidayTime[0]) * 60 + parseInt(holidayTime[1]);
        }
        if (mealTime.length > 1) {
          totalMealTime += parseInt(mealTime[0]) * 60 + parseInt(mealTime[1]);
        }
        if (workHourTime.length > 1) {
          totalWorkHourTime += parseInt(workHourTime[0]) * 60 + parseInt(workHourTime[1]);
        }
        if (mainWorkTime.length > 1) {
          totalMainWorkTime += parseInt(mainWorkTime[0]) * 60 + parseInt(mainWorkTime[1]);
        }
        if (researchTime.length > 1) {
          totalResearchTime += parseInt(researchTime[0]) * 60 + parseInt(researchTime[1]);
        }
      });

      document.getElementById("totalWorkTime").innerText = `${Math.floor(totalWorkTime / 60)}:${(totalWorkTime % 60).toString().padStart(2, '0')}`;
      document.getElementById("totalHolidayTime").innerText = `${Math.floor(totalHolidayTime / 60)}:${(totalHolidayTime % 60).toString().padStart(2, '0')}`;
      document.getElementById("totalMealTime").innerText = `${Math.floor(totalMealTime / 60)}:${(totalMealTime % 60).toString().padStart(2, '0')}`;
      document.getElementById("totalWorkHourTime").innerText = `${Math.floor(totalWorkHourTime / 60)}:${(totalWorkHourTime % 60).toString().padStart(2, '0')}`;
      document.getElementById("totalMainWorkTime").innerText = `${Math.floor(totalMainWorkTime / 60)}:${(totalMainWorkTime % 60).toString().padStart(2, '0')}`;
      document.getElementById("totalResearchTime").innerText = `${Math.floor(totalResearchTime / 60)}:${(totalResearchTime % 60).toString().padStart(2, '0')}`;
    }

    return {};
  }
});
</script>
<style>
.table {
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
}
.table-bordered {
  border: 1px solid #dee2e6;
}
.table-bordered th,
.table-bordered td {
  border: 1px solid #dee2e6;
}
.table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
}
.table tbody + tbody {
  border-top: 2px solid #dee2e6;
}
</style>
