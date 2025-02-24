<template>
  <div class="d-flex flex-column flex-xl-row">
    <div class="flex-column flex-lg-row-auto w-100 w-xl-350px mb-10">
      <div class="card mb-5 mb-xl-8">
        <div class="card-body pt-15">
          <div class="d-flex flex-center flex-column mb-5">
            <div class="symbol symbol-100px symbol-circle mb-7">
              <img :src="getAssetPath('media/avatars/blank.png')" alt="image" />
            </div>
            <a
              href="#"
              class="fs-3 text-gray-800 text-hover-primary fw-bold mb-1"
            >
              김철수
            </a>
            <div class="fs-5 fw-semibold text-muted mb-6">SW경기미래채움</div>
          </div>
          <div class="separator separator-dashed my-3"></div>
          <div id="kt_customer_view_details" class="collapse show">
            <div class="py-5 fs-6">
              <div class="badge badge-light-info d-inline">미래채움 4기 강사</div>
              <div class="fw-bold mt-5">사번</div>
              <div class="text-gray-600">SW23A_03</div>
              <div class="fw-bold mt-5">이메일</div>
              <div class="text-gray-600">
                <a href="#" class="text-gray-600 text-hover-primary">HGD@gmail.com</a>
              </div>
              <div class="fw-bold mt-5">성별</div>
              <div class="text-gray-600">남자</div>
              <div class="fw-bold mt-5">기수</div>
              <div class="text-gray-600">4기</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-lg-row-fluid ms-lg-15">
      <ul
        class="nav nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-0 fs-4 fw-semibold mb-8"
      >
        <li class="nav-item">
          <a
            class="nav-link text-active-primary pb-4 active"
            data-bs-toggle="tab"
            href="#kt_customer_view_overview_tab"
            >상세 정보</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link text-active-primary pb-4"
            data-bs-toggle="tab"
            href="#kt_customer_view_overview_events_and_logs_tab"
            >내 서명 이미지</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link text-active-primary pb-4"
            data-bs-toggle="tab"
            href="#kt_passwordreset"
            >비밀번호 변경</a
          >
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        <div
          class="tab-pane fade show active"
          id="kt_customer_view_overview_tab"
          role="tabpanel">
          <Invoices card-classes="mb-6 mb-xl-9"></Invoices>
        </div>
        <div
          class="tab-pane fade"
          id="kt_customer_view_overview_events_and_logs_tab"
          role="tabpanel">
          <Earnings card-classes="mb-6 mb-xl-9"></Earnings>
        </div>
        <div
          class="tab-pane fade"
          id="kt_passwordreset"
          role="tabpanel">
          <PasswordReset card-classes="mb-6 mb-xl-9"></PasswordReset>
        </div>
      </div>
    </div>
  </div>
  <NewCardModal></NewCardModal>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import Dropdown3 from "@/components/dropdown/Dropdown3.vue";
import NewCardModal from "@/components/modals/forms/NewCardModal.vue";
import PaymentRecords from "@/components/customers/cards/overview/PaymentRecords.vue";
import PaymentMethods from "@/components/customers/cards/overview/PaymentMethods.vue";
import CreditBalance from "@/components/customers/cards/overview/CreditBalance.vue";
import Invoices from "@/components/customers/cards/overview/Invoices.vue";

import Events from "@/components/customers/cards/events-and-logs/Events.vue";
import Logs from "@/components/customers/cards/events-and-logs/Logs.vue";

import Earnings from "@/components/customers/cards/statments/Earnings.vue";
import Statement from "@/components/customers/cards/statments/Statement.vue";
import PasswordReset from "@/views/crafted/authentication/basic-flow/PasswordReset.vue";

export default defineComponent({
  name: "customer-details",
  components: {
    PaymentRecords,
    PaymentMethods,
    CreditBalance,
    Invoices,
    Events,
    Logs,
    Earnings,
    Statement,
    Dropdown3,
    NewCardModal,
    PasswordReset
  },
  setup() {
    return {
      getAssetPath,
    };
  },
});
</script>
