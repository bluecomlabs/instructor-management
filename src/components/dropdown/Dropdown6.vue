<template>
  <div
    class="menu menu-sub menu-sub-dropdown w-250px w-md-450px modal-content"
    data-kt-menu="true"
  >
    <div class="px-7 py-5 d-flex justify-content-between align-items-center">
      <div class="fs-5 text-gray-900 fw-bold">오픈 예정 교육 필터링</div>
      <button
          ref="closeButton"
          type="button"
          class="btn btn-sm btn-icon btn-light btn-hover-primary"
          data-kt-menu-dismiss="true"
        >
        <i class="bi bi-x-lg"></i> 
      </button>
    </div>
    <div class="separator border-gray-200"></div>
    <div class="px-7 py-5">
      <!-- <div class="mb-10">
        <label class="form-label fw-semibold">확정여부</label>
        <div>
          <select class="form-select form-select-solid select2-hidden-accessible" v-model="data.status">
            <option value="">전체</option>
            <option value="ASSIGNED">배정</option>
            <option value="UNASSIGNED">미배정</option>
            <option value="REJECTED">탈락</option>
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
        <label class="form-label fw-semibold">교육기관명</label>
        <div>
          <input type="text" class="form-control form-control-solid" placeholder="교육기관명을 입력해주세요." v-model="data.institutionName" />
        </div>
      </div>
      <div class="mb-10">
        <label class="form-label fw-semibold">차시</label>
        <div>
          <input type="text" class="form-control form-control-solid" placeholder="총 차시를 입력해주세요." v-model="data.chapter" />
        </div>
      </div>
      <div class="mb-10">
        <label class="form-label fw-semibold">총 차시</label>
        <div>
          <input type="number" class="form-control form-control-solid" placeholder="총 차시를 입력해주세요." v-model="data.totalChapters" />
        </div>
      </div>
      <div class="mb-10">
        <label class="form-label fw-semibold">핸드폰 번호</label>
        <div>
          <input type="text" class="form-control form-control-solid" placeholder="강사 핸드폰 번호를 입력해주세요." v-model="data.instructorPhoneNumber" />
        </div>
      </div>
      <!-- <div class="mb-10">
        <label class="form-label fw-semibold">반</label>
        <div>
          <input type="number" class="form-control form-control-solid" placeholder="난이도를 입력해주세요." v-model="data.classNumber" />
        </div>
      </div> -->
      <div class="mb-10">
        <label class="form-label fw-semibold">날짜</label>
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
          @click="resetForm"
        >
          초기화
        </button>
        <button
          type="submit"
          class="btn btn-sm btn-primary"
          @click="submitForm"
        >
          필터 적용
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Swal from "sweetalert2";

interface Filter {
  status: string;
  institutionName: string;
  totalChapters: string;
  classNumber: string;
  instructorPhoneNumber: string;
  programName: string;
  chapter: string;
  startDate: string;
  endDate: string;
}

export default defineComponent({
  name: "Dropdown1",
  setup() {
    return {
      data: {
        status: "",
        institutionName: "",
        totalChapters: "",
        classNumber: "",
        instructorPhoneNumber: "",
        programName: "",
        chapter: "",
        startDate: "",
        endDate: "",
      } as Filter,
    };
  },
  methods: {
    submitForm() {
      Swal.fire({
        title: "필터를 적용하시겠습니까?",
        text: "작성한 값에 따른 데이터가 출력됩니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "네, 적용합니다",
        cancelButtonText: "취소",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.$emit("apply-filter", this.data);
          (this.$refs.closeButton as HTMLElement).click();
        }
      });
    },
    resetForm() {
      Swal.fire({
        title: "필터를 초기화하시겠습니까?",
        text: "필터값이 저장되지 않습니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "네, 초기화합니다",
        cancelButtonText: "취소",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.data = {
            status: "",
            institutionName: "",
            totalChapters: "",
            classNumber: "",
            instructorPhoneNumber: "",
            programName: "",
            chapter: "",
            startDate: "",
            endDate: "",
          };
          this.$emit("apply-filter", this.data);
          (this.$refs.closeButton as HTMLElement).click();
        }
      });
    },
  },
});
</script>
<style scoped>
.modal-content {
  height: 60%;
  overflow-y: auto;
}
</style>
