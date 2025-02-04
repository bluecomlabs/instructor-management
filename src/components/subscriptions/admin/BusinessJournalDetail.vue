<template>
  <div class="card card-flush pt-3 mb-5 mb-xl-10">
    <div class="card-header">
      <div class="card-title">
        <h2 class="fw-bold">교육일지</h2>
      </div>
      <div class="card-toolbar">
        <button @click="showModal = true" class="btn btn-light-primary">서명하기</button>
      </div>
    </div>
    <div class="card-body pt-3">
      <div class="mb-10">
        <div class="d-flex flex-wrap py-5">
          <div class="flex-equal me-5">
            <table class="table fs-6 fw-semibold gs-0 gy-2 gx-2 m-0">
              <tr>
                <td class="text-gray-500 min-w-175px w-175px">강사명 :</td>
                <td class="text-gray-800 min-w-200px">
                  홍길동
                </td>
              </tr>
              <tr>
                <td class="text-gray-500">교육명 :</td>
                <td class="text-gray-800">오조봇 실습</td>
              </tr>
            </table>
          </div>
          <div class="flex-equal">
            <table class="table fs-6 fw-semibold gs-0 gy-2 gx-2 m-0">
              <tr>
                <td class="text-gray-500 min-w-175px w-175px">일시 :</td>
                <td class="text-gray-800 min-w-200px">
                    2024.08.09.
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="mb-0">
        <h5 class="mb-4">교육내용</h5>
        <div class="table-responsive" style="height: 300px;">
          □ 혜인학교 수업을 위한 오조봇 수업 준비
          <br><br>
          - 수업날짜 : 2024.08.09 (금)<br>
          - 수업 주제 : 오조봇 "도전! 볼링왕", "분리수거 하는 똑똑한 오조봇"<br>
          - 수업준비<br>
          1. 차시별 지도안 작성<br>
          2. 활동지 준비 및 출력<br>
          3. 수업내용 파악 및 진행순서 확인
        </div>
        <img alt="Pic" :src="getAssetPath('media/avatars/test1.png')" style="width: 390px; height: 250px;" />
        <img alt="Pic" :src="getAssetPath('media/avatars/test2.png')"  style="width: 390px; height: 250px; float: right;"/>
      </div>
      
      <div style="margin-top: 50px;" class="signature-section">
        <h5 class="mb-4">서명란</h5>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>교육담당자</th>
              <th>사업담당자</th>
              <th>총괄책임자</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>서명대기중</td>
              <td>서명대기중</td>
              <td>서명대기중</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="remark-section" style="margin-top: 30px;">
        <h5 class="mb-4">비고</h5>
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
            </thead>
            <tbody>
              <tr>
                <td>비고내용</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="showModal" class="modal-backdrop">
        <div class="modal-content">
          <h3>준비 중입니다</h3>
          <p>이 기능은 현재 준비 중입니다. 나중에 다시 시도해 주세요.</p>
          <button @click="showModal = false" class="btn btn-light-primary">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { getAssetPath } from "@/core/helpers/assets";

export default defineComponent({
  name: "kt-details",
  components: {},
  setup() {
    const showModal = ref(false);

    return {
      getAssetPath,
      showModal,
    };
  },
});
</script>

<style>
.table {
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.btn-light-primary {
  background-color: #e7f1ff;
  color: #1a73e8;
  border-color: #d1e5ff;
}

.btn-light-primary:hover {
  background-color: #d1e5ff;
}
</style>
