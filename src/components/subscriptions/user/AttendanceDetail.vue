<template>
  <div class="card card-flush pt-3 mb-5 mb-xl-10">
    <div class="card-header">
      <div class="card-title">
        <h2 class="fw-bold">업무일지</h2>
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
                <td class="text-gray-500 min-w-175px w-175px">강사명:</td>
                <td class="text-gray-800 min-w-200px">박강명</td>
              </tr>
              <tr>
                <td class="text-gray-500">교육명:</td>
                <td class="text-gray-800">오조봇 실습</td>
              </tr>
            </table>
          </div>
          <div class="flex-equal">
            <table class="table fs-6 fw-semibold gs-0 gy-2 gx-2 m-0">
              <tr>
                <td class="text-gray-500 min-w-175px w-175px">근무기간:</td>
                <td class="text-gray-800 min-w-200px">2024.08.01.(목) ~ 2024.08.06.(화)</td>
              </tr>
              <tr>
                <td class="text-gray-500">신청기관:</td>
                <td class="text-gray-800">어썸초등학교</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="mb-0">
        <h5 class="mb-4">출석부</h5>
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>번호</th>
                <th>성명</th>
                <th>성별</th>
                <th>학교</th>
                <th>학년</th>
                <th>비고</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>서서현</td>
                <td>남자</td>
                <td>해운대초등학교</td>
                <td>5학년</td>
                <td></td>
              </tr>
              <tr>
                <td>2</td>
                <td>김민수</td>
                <td>남자</td>
                <td>해운대초등학교</td>
                <td>5학년</td>
                <td>우등생</td>
              </tr>
              <tr>
                <td>3</td>
                <td>이수연</td>
                <td>여자</td>
                <td>해운대초등학교</td>
                <td>1학년</td>
                <td></td>
              </tr>
              <!-- Add more rows as needed -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserMenu from "@/layouts/default-layout/components/menus/UserAccountMenu.vue";

export default defineComponent({
  name: "kt-details",
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
