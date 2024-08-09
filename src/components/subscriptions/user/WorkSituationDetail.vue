<template>
  <div class="card card-flush pt-3 mb-5 mb-xl-10">
    <div class="card-header">
      <div class="card-title">
        <h2 class="fw-bold">8월 근무상황부</h2>
      </div>
      <div class="card-toolbar">
        <router-link to="/subscriptions/add" class="btn btn-light-primary">수정하기</router-link>
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
                <td class="text-gray-800">권정미</td>
              </tr>
              <tr>
                <td class="text-gray-500">근무기간:</td>
                <td class="text-gray-800">2024.07.01 ~ 2024.07.31</td>
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
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>날짜</th>
                <th>근무처</th>
                <th>업무시간</th>
                <th>공휴시간</th>
                <th>식사시간</th>
                <th>근무시간</th>
                <th>본근무시간</th>
                <th>연구근무시간</th>
                <th>업무내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
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
                <td>2</td>
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
                <td>3</td>
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
                <td>4</td>
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
                <td>5</td>
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
                <td>6</td>
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
                <td>7</td>
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
                <td>8</td>
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
                <td>9</td>
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
                <td>10</td>
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
                <td>11</td>
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
                <td>12</td>
                <td>연구활동</td>
                <td>09:00 ~ 16:00</td>
                <td>07:00</td>
                <td>01:00</td>
                <td>06:00</td>
                <td>05:00</td>
                <td>00:00</td>
                <td>울산센터(제페토)</td>
              </tr>
              <!-- Add more rows as needed -->
            </tbody>
            <tfoot>
              <tr>
                <td colspan="9">합계 근무 시간 180:00 / 본근무 120:00 / 연구 50:00 / 기타 10:00</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import UserMenu from '@/layouts/default-layout/components/menus/UserAccountMenu.vue';

export default defineComponent({
  name: 'kt-details',
  components: {
    UserMenu,
  },
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
