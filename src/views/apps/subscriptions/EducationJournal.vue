<template>
  <!--begin::Layout-->
  <div class="d-flex flex-column flex-lg-row">
    <!--begin::Content-->
    <div class="flex-lg-row-fluid me-lg-15 order-lg-1 mb-10 mb-lg-0">
      <EducationJournalDetail></EducationJournalDetail>
    </div>
    <!--end::Content-->

    <!--begin::Sidebar-->
    <!-- <div class="flex-column flex-lg-row-auto w-lg-250px w-xl-300px mb-10 order-lg-2">
      <ViewSummary></ViewSummary>
    </div> -->
    <!--end::Sidebar-->
  </div>
  <!--end::Layout-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EducationJournalDetail from "@/components/subscriptions/admin/EducationJournalDetail.vue";
import Events from "@/components/subscriptions/view/Events.vue";
import Invoices from "@/components/subscriptions/view/Invoices.vue";
import ViewSummary from "@/components/subscriptions/view/Summary.vue";

export default defineComponent({
  name: "kt-view-subscription",
  components: {
    EducationJournalDetail,
    Events,
    Invoices,
    ViewSummary,
  },
});
</script>
