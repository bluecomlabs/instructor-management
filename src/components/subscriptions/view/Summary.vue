<template>
  <!--begin::Card-->
  <div
    class="card card-flush mb-0"
    id="kt_view_summary"
    data-kt-sticky="true"
    data-kt-sticky-name="view-subscription-summary"
    data-kt-sticky-offset="{default: false, lg: '200px'}"
    data-kt-sticky-width="{lg: '250px', xl: '300px'}"
    data-kt-sticky-left="auto"
    data-kt-sticky-top="150px"
    data-kt-sticky-animation="false"
    data-kt-sticky-zindex="95"
  >
    <!--begin::Card header-->
    <div class="card-header">
      <!--begin::Card title-->
      <div class="card-title">
        <h2>강사정보</h2>
      </div>
      <!--end::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::More options-->
        <!-- <a
          href="#"
          class="btn btn-sm btn-light btn-icon"
          data-kt-menu-trigger="click"
          data-kt-menu-placement="bottom-end"
        >
          <KTIcon icon-name="dots-horizontal" icon-class="fs-3" />
        </a> -->
        <UserMenu></UserMenu>
        <!--end::More options-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body pt-0 fs-6">
      <!--begin::Section-->
      <div class="mb-7">
        <!--begin::Details-->
        <div class="d-flex align-items-center">
          <!--begin::Avatar-->
          <div class="symbol symbol-60px symbol-circle me-3">
            <img alt="Pic" :src="getAssetPath('media/avatars/blank.png')" />
          </div>
          <!--end::Avatar-->

          <!--begin::Info-->
          <div class="d-flex flex-column">
            <!--begin::Name-->
            <a
              href="#"
              class="fs-4 fw-bold text-gray-900 text-hover-primary me-2"
              >홍길동</a
            >
            <!--end::Name-->

            <!--begin::Email-->
            <a href="#" class="fw-semibold text-gray-600 text-hover-primary"
              >HGD@gmail.com</a
            >
            <!--end::Email-->
          </div>
          <!--end::Info-->
        </div>
        <!--end::Details-->
      </div>

      <!--begin::Seperator-->
      <div class="separator separator-dashed mb-7"></div>
      <!--end::Seperator-->

      <!--begin::Section-->
      <div class="mb-10">
        <!--begin::Title-->
        <h5 class="mb-4">상세 정보</h5>
        <!--end::Title-->

        <!--begin::Details-->
        <table class="table fs-6 fw-semibold gs-0 gy-2 gx-2">
          <!--begin::Row-->
          <tr class="">
            <td class="text-gray-500">사번 :</td>
            <td class="text-gray-800">SW23A_03</td>
          </tr>
          <!--end::Row-->

          <!--begin::Row-->
          <tr class="">
            <td class="text-gray-500">성별:</td>
            <td class="text-gray-800">남자</td>
          </tr>
          <!--end::Row-->

          <!--begin::Row-->
          <tr class="">
            <td class="text-gray-500">기수:</td>
            <td><span class="badge badge-light-success">4기</span></td>
          </tr>
          <!--end::Row-->

          <!--begin::Row-->
          <!-- <tr class="">
            <td class="text-gray-500">Next Invoice:</td>
            <td class="text-gray-800">15 Apr 2022</td>
          </tr> -->
          <!--end::Row-->
        </table>
        <!--end::Details-->
      </div>
      <!--end::Section-->

      <!--begin::Actions-->
      <!-- <div class="mb-0">
        <router-link
          to="/subscriptions/add"
          class="btn btn-primary"
          id="kt_subscriptions_create_button"
        >
          Edit Subscription
        </router-link>
      </div> -->
      <!--end::Actions-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Card-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import UserMenu from "@/layouts/default-layout/components/menus/UserAccountMenu.vue";

export default defineComponent({
  name: "kt-summary",
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
