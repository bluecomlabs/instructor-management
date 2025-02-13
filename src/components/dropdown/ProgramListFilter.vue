<template>
  <div
    class="menu menu-sub menu-sub-dropdown w-250px w-md-450px modal-content"
    data-kt-menu="true"
  >
    <div class="px-7 py-5 d-flex justify-content-between align-items-center">
      <div class="fs-5 text-gray-900 fw-bold">프로그램 정보 필터링</div>
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
      <!-- 프로그램명 입력 -->
      <div class="mb-10">
        <label class="form-label fw-semibold">프로그램명</label>
        <div>
          <input
            type="text"
            class="form-control form-control-solid"
            placeholder="프로그램명을 입력해주세요."
            v-model="data.programName"
          />
        </div>
      </div>

      <!-- 프로그램 상태 선택 -->
      <div class="mb-10">
        <label class="form-label fw-semibold">상태</label>
        <div>
          <select v-model="data.status" class="form-select">
            <option value="">전체 상태</option>
            <option value="Active">활성</option>
            <option value="Inactive">비활성</option>
          </select>
        </div>
      </div>

      <!-- 비고 입력 -->
      <div class="mb-10">
        <label class="form-label fw-semibold">비고</label>
        <div>
          <input
            type="text"
            class="form-control form-control-solid"
            placeholder="비고를 입력해주세요."
            v-model="data.remarks"
          />
        </div>
      </div>

      <!-- 날짜 범위 선택: 등록일자 -->
      <!-- <div class="mb-10">
        <label class="form-label fw-semibold">등록일자</label>
        <div>
          <div class="input-group mx-2">
            <input
              type="date"
              v-model="data.startDate"
              class="form-control"
              placeholder="시작 날짜"
            />
            <span class="input-group-text">~</span>
            <input
              type="date"
              v-model="data.endDate"
              class="form-control"
              placeholder="종료 날짜"
            />
          </div>
        </div>
      </div> -->
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
import { defineComponent, reactive, ref } from "vue";
import Swal from "sweetalert2";

interface Filter {
  programName: string;
  status: string;
  remarks: string;
  startDate: string;
  endDate: string;
}

export default defineComponent({
  name: "ProgramListFilter",
  setup() {
    // 프로그램 필터에 필요한 기본 필드들
    const data = reactive<Filter>({
      programName: "",
      status: "",
      remarks: "",
      startDate: "",
      endDate: "",
    });

    const closeButton = ref<HTMLElement | null>(null);

    return {
      data,
      closeButton,
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
      }).then((result) => {
        if (result.isConfirmed) {
          // 필터 데이터 그대로 emit
          this.$emit("apply-filter", { ...this.data });
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
      }).then((result) => {
        if (result.isConfirmed) {
          this.data.programName = "";
          this.data.status = "";
          this.data.remarks = "";
          this.data.startDate = "";
          this.data.endDate = "";
          this.$emit("apply-filter", { ...this.data });
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

/* 드롭다운 메뉴 스크롤 처리 (필요 시) */
.dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
}
</style>
