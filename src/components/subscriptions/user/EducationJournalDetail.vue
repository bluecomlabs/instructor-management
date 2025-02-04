<template>
  <div class="card card-flush pt-3 mb-5 mb-xl-10">
    <div class="card-header">
      <div class="card-title">
        <h2 class="fw-bold">교육일지</h2>
      </div>
      <div class="card-toolbar">
        <router-link to="EditEducationJournal" class="btn btn-light-primary"
          >수정하기</router-link
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
        <img alt="Pic" :src="getAssetPath('media/avatars/test1.png')" style="width: 50%; height: 300px;" />
        <img alt="Pic" :src="getAssetPath('media/avatars/test2.png')"  style="float: right; width: 50%; height: 300px;"/>
      </div>
      
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
