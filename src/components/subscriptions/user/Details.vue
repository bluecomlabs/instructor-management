<template>
  <div class="card card-flush pt-3 mb-5 mb-xl-10">
    <div class="card-header">
      <div class="card-title">
        <h2 class="fw-bold">업무일지</h2>
      </div>
      <div class="card-toolbar">
        <router-link to="/subscriptions/add" class="btn btn-light-primary"
          >Update Product</router-link
        >
      </div>
    </div>
    <div class="card-body pt-3">
      <div class="mb-10">
        <div class="d-flex flex-wrap py-5">
          <div class="flex-equal me-5">
            <table class="table fs-6 fw-semibold gs-0 gy-2 gx-2 m-0">
              <tr>
                <td class="text-gray-500 min-w-175px w-175px">강사명:</td>
                <td class="text-gray-800 min-w-200px">
                  홍길동
                </td>
              </tr>
              <tr>
                <td class="text-gray-500">업무명:</td>
                <td class="text-gray-800">오조봇 실습</td>
              </tr>
            </table>
          </div>
          <div class="flex-equal">
            <table class="table fs-6 fw-semibold gs-0 gy-2 gx-2 m-0">
              <tr>
                <td class="text-gray-500 min-w-175px w-175px">
                  일시:
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
        <h5 class="mb-4">업무내용</h5>
        <div class="table-responsive">
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          <br><br>
          
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          <br><br>
          
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          <br><br>
          
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
          업무내용 업무내용
        </div>
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
