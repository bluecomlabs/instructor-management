<template>
  <div class="card card-flush pt-3 mb-5 mb-xl-10">
    <div class="card-header">
      <div class="card-title">
        <h2 class="fw-bold">교육일지</h2>
      </div>
      <div class="card-toolbar">
        <!-- <router-link to="/subscriptions/add" class="btn btn-light-primary"
          ></router-link
        > -->
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
                  <input type="text" v-model="instructorName" class="form-control" />
                </td>
              </tr>
              <tr>
                <td class="text-gray-500">교육명 :</td>
                <td class="text-gray-800">
                  <input type="text" v-model="educationName" class="form-control" />
                </td>
              </tr>
            </table>
          </div>
          <div class="flex-equal">
            <table class="table fs-6 fw-semibold gs-0 gy-2 gx-2 m-0">
              <tr>
                <td class="text-gray-500 min-w-175px w-175px">
                  일시 :
                </td>
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
          <textarea v-model="educationContent" class="form-control" rows="10"></textarea>
        </div>
        <button class="btn btn-light-primary upload-button">
          이미지 업로드
        </button>
        <!-- <img alt="Pic" :src="getAssetPath('media/avatars/test1.png')" style="width: 390px; height: 250px;" />
        <img alt="Pic" :src="getAssetPath('media/avatars/test2.png')"  style="width: 390px; height: 250px; float: right;"/> -->
      </div>
      
      <div class="mb-0" style="margin-top: 30px;">
        <h5 class="mb-4">비고</h5>
        <div class="table-responsive" style="height: 200px;">
          <textarea v-model="remark" class="form-control" rows="5"></textarea>
        </div>
      </div>
      
      <!-- <div style="margin-top: 50px;" class="signature-section">
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
        </div> -->
        <!-- 서명란 끝 -->
    </div>
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref } from "vue";
import UserMenu from "@/layouts/default-layout/components/menus/UserAccountMenu.vue";

export default defineComponent({
  name: "kt-details",
  components: {
    UserMenu,
  },
  setup() {
    const instructorName = ref("");
    const educationName = ref("");
    const educationContent = ref("");
    const remark = ref("");

    return {
      getAssetPath,
      instructorName,
      educationName,
      educationContent,
      remark,
    };
  },
});
</script>

<style>
.btn-light-primary.upload-button {
  background-color: #f1f5f9;
  color: #1a73e8;
  border-color: #d1e5ff;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.btn-light-primary.upload-button:hover {
  background-color: #e2e8f0;
  border-color: #cbd5e1;
}
</style>
