<template>
  <!--begin::Statements-->
  <div :class="`card ${cardClasses}`">
    <!--begin::Header-->
    <div class="card-header">
      <!--begin::Title-->
      <div class="card-title">
        <h2>상세정보</h2>
      </div>
      <!--end::Title-->

      <!--end::Toolbar-->
    </div>
    <!--end::Header-->

    <!--begin::Card body-->
    <div class="card-body pb-5">
      <!--begin::Tab Content-->
      <div id="kt_customer_view_statement_tab_content" class="tab-content">
        <div
          id="kt_customer_view_statement_1"
          class="py-0 tab-pane fade active show"
          role="tabpanel"
        >
          <Datatable
            :header="tableHeader"
            :data="tableData1"
            :items-per-page="10"
            :items-per-page-dropdown-enabled="false"
          >
            <template v-slot:date="{ row: invoice }">
              {{ invoice.date }}
            </template>
            <template v-slot:order="{ row: invoice }">
              {{ invoice.order }}
            </template>
            <template v-slot:details="{ row: invoice }">
              {{ invoice.details }}
            </template>
            <template v-slot:amount="{ row: invoice }">
              <span :class="`text-${invoice.color}`">
                {{ invoice.amount }}
              </span>
            </template>
            <template v-slot:invoice>
              <button class="btn btn-sm btn-light btn-active-light-primary">
                Download
              </button>
            </template>
          </Datatable>
        </div>
        <div
          id="kt_customer_view_statement_2"
          class="py-0 tab-pane fade"
          role="tabpanel"
        >
          <Datatable
            :header="tableHeader"
            :data="tableData2"
            :items-per-page="10"
            :items-per-page-dropdown-enabled="false"
          >
            <template v-slot:date="{ row: invoice }">
              {{ invoice.date }}
            </template>
            <template v-slot:order="{ row: invoice }">
              {{ invoice.order }}
            </template>
            <template v-slot:details="{ row: invoice }">
              {{ invoice.details }}
            </template>
            <template v-slot:amount="{ row: invoice }">
              <span :class="`text-${invoice.color}`">
                {{ invoice.amount }}
              </span>
            </template>
            <template v-slot:invoice>
              <button class="btn btn-sm btn-light btn-active-light-primary">
                Download
              </button>
            </template>
          </Datatable>
        </div>
        <div
          id="kt_customer_view_statement_3"
          class="py-0 tab-pane fade"
          role="tabpanel"
        >
          <Datatable
            :header="tableHeader"
            :data="tableData3"
            :items-per-page="10"
            :items-per-page-dropdown-enabled="false"
          >
            <template v-slot:date="{ row: invoice }">
              {{ invoice.date }}
            </template>
            <template v-slot:order="{ row: invoice }">
              {{ invoice.order }}
            </template>
            <template v-slot:details="{ row: invoice }">
              {{ invoice.details }}
            </template>
            <template v-slot:amount="{ row: invoice }">
              <span :class="`text-${invoice.color}`">
                {{ invoice.amount }}
              </span>
            </template>
            <template v-slot:invoice>
              <button class="btn btn-sm btn-light btn-active-light-primary">
                Download
              </button>
            </template>
          </Datatable>
        </div>
        <div
          id="kt_customer_view_statement_4"
          class="py-0 tab-pane fade"
          role="tabpanel"
        >
          <Datatable
            :header="tableHeader"
            :data="tableData4"
            :items-per-page="10"
            :items-per-page-dropdown-enabled="false"
          >
            <template v-slot:date="{ row: invoice }">
              {{ invoice.date }}
            </template>
            <template v-slot:order="{ row: invoice }">
              {{ invoice.order }}
            </template>
            <template v-slot:details="{ row: invoice }">
              {{ invoice.details }}
            </template>
            <template v-slot:amount="{ row: invoice }">
              <span :class="`text-${invoice.color}`">
                {{ invoice.amount }}
              </span>
            </template>
            <template v-slot:invoice>
              <button class="btn btn-sm btn-light btn-active-light-primary">
                Download
              </button>
            </template>
          </Datatable>
        </div>
      </div>
      <!--end::Tab Content-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Statements-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";

export default defineComponent({
  name: "statement-card",
  props: {
    cardClasses: String,
  },
  components: {
    Datatable,
  },
  setup() {
    const tableHeader = ref([
      {
        columnName: "Date",
        columnLabel: "date",
        sortEnabled: true,
      },
      {
        columnName: "Order id",
        columnLabel: "order",
        sortEnabled: true,
      },
      {
        columnName: "Details",
        columnLabel: "details",
        sortEnabled: true,
      },
      {
        columnName: "Amount",
        columnLabel: "amount",
        sortEnabled: true,
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
