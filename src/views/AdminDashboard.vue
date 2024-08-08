<template>
  <!--begin::Row-->
  <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
    <!--begin::Col-->
    <div class="col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-md-5 mb-xl-10">
      <Widget1
        className="h-md-100 mb-5 mb-xl-10"
        description="7월의 교육 교육 완료 수"
        bgColor="#F1416C"
        :bgImage="getAssetPath('media/patterns/vector-1.png')"
      />

    </div>
    <!--end::Col-->

    <!--begin::Col-->
    <div class="col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-md-5 mb-xl-10">
      <Widget3 className="h-md-100 mb-5 mb-xl-10" :chartSize="70" />
    </div>
    <!--end::Col-->

    <!--begin::Col-->
    <!--end::Col-->
  </div>
  <img src="/logo.png" class="col-xxl-4 h-md-100" />
  <img src="/logo.png" class="col-xxl-4 h-md-100" />
  <img src="/logo.png" class="col-xxl-4 h-md-100" />
  <!--end::Row-->


</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";
import Widget3 from "@/components/dashboard-default-widgets/Widget3.vue";

export default defineComponent({
  name: "main-dashboard",
  components: {
    Widget1,
    Widget3,
  },
  setup() {
    return {
      getAssetPath,
    };
  },
});
</script>
