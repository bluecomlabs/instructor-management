<template>
  <div class="card card-flush pt-3 mb-5 mb-xl-10">
    <div class="card-header">
      <div class="card-title">
        <h2 class="fw-bold">교육일지</h2>
      </div>
      <div class="card-toolbar">
        <router-link to="/subscriptions/add" class="btn btn-light-primary"
          >서명하기</router-link
        >
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
                  박강명
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
                <td class="text-gray-500 min-w-175px w-175px">
                  일시 :
                </td>
                <td class="text-gray-800 min-w-200px">
                    2024.08.01.
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="mb-0">
        <h5 class="mb-4">교육내용</h5>
        <div class="table-responsive" style="height: 400px;">
          이곳에 업무내용이 들어갑니다
        </div>
        <img alt="Pic" :src="getAssetPath('media/avatars/blank.png')" />
        <img alt="Pic" :src="getAssetPath('media/avatars/blank.png')"  style="float: right;"/>
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
        <!-- 서명란 끝 -->
    </div>
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import UserMenu from "@/layouts/default-layout/components/menus/UserAccountMenu.vue";

export default defineComponent({
  name: "kt-details",
  components: {
    UserMenu,
  },
  setup() {
    return {
      getAssetPath,
    };
  },
});
</script>
