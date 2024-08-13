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
  </div>
  <!--end::Row-->

  <!--begin::Row-->
  <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
    <!--begin::Col-->
    <div class="col-xxl-4">
      <div class="card h-md-100">
        <div class="card-header">
          <h3 class="card-title">교육기관 목록</h3>
        </div>
        <div class="card-body">
          <ul class="list-group">
            <li class="list-group-item">
              성남청소년센터
              <span class="text-muted d-block">중구, 이가영</span>
            </li>
            <li class="list-group-item">
              남목청소년센터(도우리반)
              <span class="text-muted d-block">중구, 이기은</span>
            </li>
            <li class="list-group-item">
              북구청소년센터
              <span class="text-muted d-block">북구, 연락처: 없음</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--end::Col-->

    <!--begin::Col-->
    <div class="col-xxl-4">
      <div class="card h-md-100">
        <div class="card-header">
          <h3 class="card-title">프로그램 목록</h3>
        </div>
        <div class="card-body">
          <ul class="list-group">
            <li class="list-group-item">
              프로그램
              <span class="text-muted d-block">성남청소년센터, 남목청소년센터(나누리반)</span>
            </li>
            <li class="list-group-item">
              프로그램
              <span class="text-muted d-block">남목청소년센터(도우리반), 북구청소년센터</span>
            </li>
            <li class="list-group-item">
              프로그램
              <span class="text-muted d-block">성남청소년센터(단기)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--end::Col-->

    <!--begin::Col-->
    <div class="col-xxl-4">
      <div class="card h-md-100">
        <div class="card-header">
          <h3 class="card-title">배정 예정 목록</h3>
        </div>
        <div class="card-body">
          <ul class="list-group">
            <li class="list-group-item">
              성남청소년센터
              <span class="text-muted d-block">배정일: 2024-08-01</span>
            </li>
            <li class="list-group-item">
              남목청소년센터(도우리반)
              <span class="text-muted d-block">배정일: 2024-08-08</span>
            </li>
            <li class="list-group-item">
              북구청소년센터(단기)
              <span class="text-muted d-block">배정일: 2024-08-03</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--end::Col-->
  </div>
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

<style scoped>
.card-title {
  font-weight: 600;
}

.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
}

.text-muted {
  font-size: 0.875rem;
}
</style>
