<template>
  <div :class="`card pt-2 ${cardClasses}`">
    <div class="card-header border-0">
      <div class="card-title">
        <!-- <h2>상세 정보</h2> -->
          <div class="text-gray-600">
            <p style="color: red;" class="fs-3 text-hover-primary fw-bold mb-1">※ 마이페이지 영역은 더미데이터로 이루어진 테스트 페이지이며 실제 데이터가 아닙니다. ※</p>
          </div>
      </div>
    </div>
      <div class="card-body">
          <a href="#" class="fs-3 text-gray-800 text-hover-primary fw-bold mb-1">김철수</a>
          <div class="fs-5 fw-semibold text-muted mb-6">SW경기미래채움</div>
        <div id="kt_customer_view_details" class="collapse show">
          <div class="fs-6">
            <div class="fw-bold mt-5">주소</div>
            <div class="text-gray-600">경기도 상세주소</div>
            <div class="fw-bold mt-5">나이</div>
            <div class="text-gray-600">
              <a href="#" class="text-gray-600 text-hover-primary">28</a>
            </div>
            <div class="fw-bold mt-5">특이사항</div>
            <div class="text-gray-600">교사경력있음</div>
            <div class="fw-bold mt-5">메모</div>
            <div class="text-gray-600">교사경력있음</div>
          </div>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";

export default defineComponent({
  name: "invoices-card",
  props: {
    cardClasses: String,
  },
  components: {
    Datatable,
  },
  setup() {
    const tableHeader = ref([
      {
        columnName: "Order id",
        columnLabel: "order",
        sortEnabled: false,
      },
      {
        columnName: "Amount",
        columnLabel: "amount",
        sortEnabled: false,
      },
      {
        columnName: "Status",
        columnLabel: "status",
        sortingField: "status.label",
        sortEnabled: false,
      },
      {
        columnName: "Date",
        columnLabel: "date",
        sortEnabled: false,
      },
      {
        columnName: "Invoice",
        columnLabel: "invoice",
        sortEnabled: false,
      },
    ]);
    const tableData1 = ref([
      {
        date: "Nov 01, 2020",
        order: "102445788",
        details: "Darknight transparency  36 Icons Pack",
        color: "success",
        amount: "$38.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Oct 24, 2020",
        order: "423445721",
        details: "Seller Fee",
        color: "danger",
        amount: "$-2.60",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Oct 08, 2020",
        order: "312445984",
        details: "Cartoon Mobile Emoji Phone Pack",
        color: "success",
        amount: "$76.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Sep 15, 2020",
        order: "312445984",
        details: "Iphone 12 Pro Mockup  Mega Bundle",
        color: "success",
        amount: "$5.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "May 30, 2020",
        order: "523445943",
        details: "Seller Fee",
        color: "danger",
        amount: "$-1.30",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Apr 22, 2020",
        order: "231445943",
        details: "Parcel Shipping / Delivery Service App",
        color: "success",
        amount: "$204.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Feb 09, 2020",
        order: "426445943",
        details: "Visual Design Illustration",
        color: "success",
        amount: "$31.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Nov 01, 2020",
        order: "984445943",
        details: "Abstract Vusial Pack",
        color: "success",
        amount: "$52.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Jan 04, 2020",
        order: "324442313",
        details: "Seller Fee",
        color: "danger",
        amount: "$-0.80",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
    ]);
    const tableData2 = ref([
      {
        date: "May 30, 2020",
        order: "523445943",
        details: "Seller Fee",
        color: "danger",
        amount: "$-1.30",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Apr 22, 2020",
        order: "231445943",
        details: "Parcel Shipping / Delivery Service App",
        color: "success",
        amount: "$204.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Feb 09, 2020",
        order: "426445943",
        details: "Visual Design Illustration",
        color: "success",
        amount: "$31.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Nov 01, 2020",
        order: "984445943",
        details: "Abstract Vusial Pack",
        color: "success",
        amount: "$52.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Jan 04, 2020",
        order: "324442313",
        details: "Seller Fee",
        color: "danger",
        amount: "$-0.80",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Nov 01, 2020",
        order: "102445788",
        details: "Darknight transparency  36 Icons Pack",
        color: "success",
        amount: "$38.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Oct 24, 2020",
        order: "423445721",
        details: "Seller Fee",
        color: "danger",
        amount: "$-2.60",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Oct 08, 2020",
        order: "312445984",
        details: "Cartoon Mobile Emoji Phone Pack",
        color: "success",
        amount: "$76.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Sep 15, 2020",
        order: "312445984",
        details: "Iphone 12 Pro Mockup  Mega Bundle",
        color: "success",
        amount: "$5.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
    ]);
    const tableData3 = ref([
      {
        date: "Feb 09, 2020",
        order: "426445943",
        details: "Visual Design Illustration",
        color: "success",
        amount: "$31.00",
        status: {
          label: "Successful",
          state: "success",
        },
      },
      {
        date: "Nov 01, 2020",
        order: "984445943",
        details: "Abstract Vusial Pack",
        color: "success",
        amount: "$52.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Jan 04, 2020",
        order: "324442313",
        details: "Seller Fee",
        color: "danger",
        amount: "$-0.80",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Sep 15, 2020",
        order: "312445984",
        details: "Iphone 12 Pro Mockup  Mega Bundle",
        color: "success",
        amount: "$5.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Nov 01, 2020",
        order: "102445788",
        details: "Darknight transparency  36 Icons Pack",
        color: "success",
        amount: "$38.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Oct 24, 2020",
        order: "423445721",
        details: "Seller Fee",
        color: "danger",
        amount: "$-2.60",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Oct 08, 2020",
        order: "312445984",
        details: "Cartoon Mobile Emoji Phone Pack",
        color: "success",
        amount: "$76.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "May 30, 2020",
        order: "523445943",
        details: "Seller Fee",
        color: "danger",
        amount: "$-1.30",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Apr 22, 2020",
        order: "231445943",
        details: "Parcel Shipping / Delivery Service App",
        color: "success",
        amount: "$204.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
    ]);
    const tableData4 = ref([
      {
        date: "Nov 01, 2020",
        order: "102445788",
        details: "Darknight transparency  36 Icons Pack",
        color: "success",
        amount: "$38.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Oct 24, 2020",
        order: "423445721",
        details: "Seller Fee",
        color: "danger",
        amount: "$-2.60",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Nov 01, 2020",
        order: "102445788",
        details: "Darknight transparency  36 Icons Pack",
        color: "success",
        amount: "$38.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Oct 24, 2020",
        order: "423445721",
        details: "Seller Fee",
        color: "danger",
        amount: "$-2.60",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Feb 09, 2020",
        order: "426445943",
        details: "Visual Design Illustration",
        color: "success",
        amount: "$31.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Nov 01, 2020",
        order: "984445943",
        details: "Abstract Vusial Pack",
        color: "success",
        amount: "$52.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Jan 04, 2020",
        order: "324442313",
        details: "Seller Fee",
        color: "danger",
        amount: "$-0.80",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Oct 08, 2020",
        order: "312445984",
        details: "Cartoon Mobile Emoji Phone Pack",
        color: "success",
        amount: "$76.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
      {
        date: "Oct 08, 2020",
        order: "312445984",
        details: "Cartoon Mobile Emoji Phone Pack",
        color: "success",
        amount: "$76.00",
        status: {
          label: "Pending",
          state: "warning",
        },
      },
    ]);

    return { tableHeader, tableData1, tableData2, tableData3, tableData4 };
  },
});
</script>
