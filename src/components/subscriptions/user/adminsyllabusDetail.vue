<template>
  <div class="card card-flush pt-3 mb-5 mb-xl-10">
    <div class="card-header">
      <div class="card-title">
        <h2 class="fw-bold">강의계획서</h2>
      </div>
      <div class="card-toolbar">
        <router-link to="syllabus" class="btn btn-light-primary"
          >강의확인서 보기
        </router-link>
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
              <tr>
                <td class="text-gray-500">교육차시 :</td>
                <td class="text-gray-800">총 8차시</td>
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
                    2024.08.01. (목) ~ 2024.08.08 (목) (매주 목요일)
                </td>
              </tr>
              <tr>
                <td class="text-gray-500">신청기관 :</td>
                <td class="text-gray-800">오조봇 실습</td>
              </tr>
              <tr>
                <td class="text-gray-500">학년 :</td>
                <td class="text-gray-800">초등학교 4학년 ~ 초등학교 6학년</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="mb-0">
        <h5 class="mb-4">2024.08.01. (목) 강의확인서</h5>
        <div class="table-responsive" style="height: 200px;">
          이곳에 업무내용이 들어갑니다.
        </div>
        <img alt="Pic" :src="getAssetPath('media/avatars/blank.png')" />
        <img alt="Pic" :src="getAssetPath('media/avatars/blank.png')"  style="float: right;"/>
      </div>
      <div class="mb-0" style="margin-top: 50px;">
        <h5 class="mb-4">2024.08.01. (목) 강의확인서</h5>
        <div class="table-responsive" style="height: 200px;">
          이곳에 업무내용이 들어갑니다.
        </div>
        <img alt="Pic" :src="getAssetPath('media/avatars/blank.png')" />
        <img alt="Pic" :src="getAssetPath('media/avatars/blank.png')"  style="float: right;"/>
      </div>
      
      <!-- <div class="flex-equal me-5" style="margin-top: 50px;">
            <table class="table fs-6 fw-semibold gs-0 gy-2 gx-2 m-0">
              <tr>
                <td class="text-gray-500 min-w-175px w-175px">담당자 확인 :</td>
                <td class="text-gray-800 min-w-200px">
                  박강명(서명이미지)
                </td>
              </tr>
            </table>
          </div> -->
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
