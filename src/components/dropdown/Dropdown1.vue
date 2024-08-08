<template>
  <div
    class="menu menu-sub menu-sub-dropdown w-250px w-md-450px"
    data-kt-menu="true"
  >
    <div class="px-7 py-5">
      <div class="fs-5 text-gray-900 fw-bold">교육신청 필터링</div>
    </div>
    <div class="separator border-gray-200"></div>
    <div class="px-7 py-5">
      <div class="mb-10">
        <label class="form-label fw-semibold">교육상태</label>
        <div>
          <select class="form-select form-select-solid select2-hidden-accessible" v-model="data.status">

            <option value="">전체</option>
            <option value="0">설정완료</option>
            <option value="1">보류(취소)</option>
            <option value="2">일정 협의 완료</option>
            <option value="3">강사 자동 배정 시작</option>
            <option value="4">강사 자동 배정 실패</option>
            <option value="5">강사 자동 배정 완료</option>
            <option value="6">강사 최종 배정 완료</option>
            <option value="7">교육 종료</option>
          </select>
        </div>
      </div>
      
      <div class="mb-10">
        <label class="form-label fw-semibold">신청날짜</label>
        <div>
          <label
            class="form-check form-check-sm form-check-custom form-check-solid me-5"
          >
            <div class="input-group mx-2" >
              <input type="date" v-model="data.startDate" class="form-control" placeholder="시작 날짜">
              <span class="input-group-text">~</span>
              <input type="date" v-model="data.endDate" class="form-control" placeholder="종료 날짜">
            </div>
          </label>
          <label
            class="form-check form-check-sm form-check-custom form-check-solid"
          >
          </label>
        </div>
      </div>
      
      <div class="mb-10">
        <label class="form-label fw-semibold">프로그램명</label>
        <div>
          <input type="text" class="form-control form-control-solid" placeholder="프로그램명을 입력해주세요." v-model="data.programName" />

        </div>
      </div>
      <div class="mb-10">
        <label class="form-label fw-semibold">교육기관</label>
        <div>
          <input type="text" class="form-control form-control-solid" placeholder="교육기관을 입력해주세요." v-model="data.institutionName" />

        </div>
      </div>
      <div class="mb-10">
        <label class="form-label fw-semibold">학년</label>
        <div>
          <input type="number" class="form-control form-control-solid" placeholder="학년을 입력해주세요." v-model="data.grade" />

        </div>
      </div>
      <div class="mb-10">
        <label class="form-label fw-semibold">반</label>
        <div>
          <input type="number" class="form-control form-control-solid" placeholder="반을 입력해주세요." v-model="data.classNumber" />

        </div>
      </div>
      <!--begin::Input group-->
      <!-- <div class="mb-10">
        <label class="form-label fw-semibold">Notifications:</label>
        <div
          class="form-check form-switch form-switch-sm form-check-custom form-check-solid"
        >
          <label class="form-check-label">
            <input
              class="form-check-input"
              type="checkbox"
              name="notifications"
              v-model="data.notifications"
            />
            <span class="form-check-label user-select-none">Enabled</span>
          </label>
        </div>
      </div> -->
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="d-flex justify-content-end">
        <!-- <button
          type="reset"
          class="btn btn-sm btn-light btn-active-light-primary me-2"
          data-kt-menu-dismiss="true"
        >
          초기화
        </button> -->

        <!-- <button
          type="submit"
          class="btn btn-sm btn-primary"
          data-kt-menu-dismiss="true"
          @click="submitForm"
        >
          필터 적용
        </button> -->
      </div>
      <!--end::Actions-->
    </div>
    <!--end::Form-->
  </div>
  <!--end::Menu 1-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// import { getEduTable2 } from "@/core/data/educations";

interface Filter {
  status: string;
  startDate: string;
  endDate: string;
  programName: string;
  institutionName: string;
  grade: string;
  classNumber: string;
}

export default defineComponent({
  name: "Dropdown1",
  components: {},
  setup() {
    const data = ref<Filter>({
      status: "",
      startDate: "",
      endDate: "",
      programName: "",
      institutionName: "",
      grade: "",
      classNumber: "",
    });

    return {
      data,
    };
  },
  methods: {
    // async submitForm() {
    //   const convertDateToIso = (dateStr) => {
    //     return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
    //   };
    //   const formData = {
    //     EDU_ST: this.data.status,
    //     YYYYMMDD_START: this.data.startDate ? convertDateToIso(this.data.startDate.replaceAll('-', '')) : '',
    //     YYYYMMDD_END: this.data.endDate ? convertDateToIso(this.data.endDate.replaceAll('-', '')) : '',
    //     PRGM_NM: this.data.programName,
    //     INST_NM: this.data.institutionName,
    //     SCHL_Y: this.data.grade.toString(),
    //     APPL_CLS: this.data.classNumber.toString(),
    //   };
      
    // const result = await getEduTable2(formData);
    // this.$emit('updateData', result); 
    // console.log(formData);
    // console.log(result);
    // }
  }
});
</script>
