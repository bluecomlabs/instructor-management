<template>
  <div
    class="menu menu-sub menu-sub-dropdown w-250px w-md-450px"
    data-kt-menu="true"
  >
    <div class="px-7 py-5">
      <div class="fs-5 text-gray-900 fw-bold">내 출강 리스트 필터링</div>
    </div>
    <div class="separator border-gray-200"></div>
    <div class="px-7 py-5">
      <!-- <div class="mb-10">
        <label class="form-label fw-semibold">상태</label>
        <div>
          <select class="form-select form-select-solid select2-hidden-accessible" v-model="data.status">
            <option value="">전체</option>
            <option value="INIT">신청 완료</option>
            <option value="PROGRESS">진행 중</option>
            <option value="COMPLETE">수업 완료</option>
            <option value="PAUSE">수업 중지</option>
            <option value="CANCEL">수업 취소</option>
          </select>
        </div>
      </div> -->

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

      <div class="d-flex justify-content-end">
        <button
            type="reset"
            class="btn btn-sm btn-light btn-active-light-primary me-2"
            data-kt-menu-dismiss="true"
            @click="resetForm"
          >
          초기화
        </button>
        <button
          type="submit"
          class="btn btn-sm btn-primary"
          data-kt-menu-dismiss="true"
          @click="submitForm"
        >
          필터 적용
        </button>
      </div>
      <!--end::Actions-->
    </div>
    <!--end::Form-->
  </div>
  <!--end::Menu 1-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

interface Filter {
  status: string;
  startDate: string;
  endDate: string;
  programName: string;
  institutionName: string;
}

export default defineComponent({
  name: "Dropdown1",
  setup() {
    const data = ref<Filter>({
      status: "",
      startDate: "",
      endDate: "",
      programName: "",
      institutionName: "",
    });

    return {
      data,
    };
  },
  methods: {
    submitForm() {
      this.$emit('apply-filter', this.data);
    },
    resetForm() {
      this.data = {
        status: "",
        startDate: "",
        endDate: "",
        programName: "",
        institutionName: "",
      };
      this.$emit('apply-filter', this.data);
    },
  },
});
</script>
