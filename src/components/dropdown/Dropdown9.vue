<template>
  <div
    class="menu menu-sub menu-sub-dropdown w-250px w-md-450px modal-content"
    data-kt-menu="true"
  >
    <div class="px-7 py-5 d-flex justify-content-between align-items-center">
      <div class="fs-5 text-gray-900 fw-bold">출강 신청 필터링</div>
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
      <div class="mb-10">
        <label class="form-label fw-semibold">신청상태</label>
        <div>
          <select class="form-select form-select-solid select2-hidden-accessible" v-model="data.status">
            <option value="">전체</option>
            <option value="READY">강사 열람 가능</option>
            <option value="OPEN">강사 신청 가능</option>
            <option value="APPLIED">신청 마감</option>
            <option value="CONFIRMED">출강 확정</option>
            <option value="PROGRESS">강의 진행 중</option>
            <option value="COMPLETE">강의 종료</option>
            <option value="PAUSE">강의 중지</option>
            <option value="CANCEL">강의 취소</option>
          </select>
        </div>
      </div>
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
          <input type="text" class="form-control form-control-solid" placeholder="차시를 입력해주세요." v-model="data.chapter" />
        </div>
      </div>
      <div class="mb-10">
        <label class="form-label fw-semibold">총 차시</label>
        <div>
          <input type="number" class="form-control form-control-solid" placeholder="총 차시를 입력해주세요." v-model="data.totalChapters" />
        </div>
      </div>
      <!-- <div class="mb-10">
        <label class="form-label fw-semibold">강사명</label>
        <div>
          <input type="text" class="form-control form-control-solid" placeholder="강사명을 입력해주세요." v-model="data.instructorName" />
        </div>
      </div> -->
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

      <div class="mb-10">
        <label class="form-label fw-semibold">강사선택</label>
        <div>
          <div class="position-relative">
            <div class="input-group">
              <input
                type="text"
                class="form-control form-control-solid"
                placeholder="강사 이름을 입력해주세요."
                v-model="instructorSearch"
                @focus="showInstructorSuggestions = true"
                @input="onInstructorInput"
                @blur="hideInstructorSuggestions"
              />
              <button
                class="btn dropdown-button"
                type="button"
                @click="toggleInstructorDropdown"
              >
                ▼
              </button>
            </div>
            <ul
              v-if="(showInstructorSuggestions || showInstructorDropdown) && instructorSuggestions.length"
              class="suggestions-list"
            >
              <li
                v-for="instructor in instructorSuggestions"
                :key="instructor.id"
                @mousedown.prevent="selectInstructor(instructor)"
              >
                {{ instructor.name }} ({{ instructor.affiliation }})
              </li>
            </ul>
          </div>
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
import { defineComponent, ref, onMounted } from "vue";
import Swal from "sweetalert2";
import axios from "axios";

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
  instructorName: string;
}

interface Instructor {
  id: number;
  name: string;
  affiliation: string;
  phoneLast4Digits: string;
}

export default defineComponent({
  name: "Dropdown1",
  setup(props, { emit }) {
    const data = ref<Filter>({
      status: "",
      institutionName: "",
      totalChapters: "",
      classNumber: "",
      instructorPhoneNumber: "",
      programName: "",
      chapter: "",
      startDate: "",
      endDate: "",
      instructorName: "",
    });

    const closeButton = ref<HTMLElement | null>(null);

    const instructorSearch = ref("");
    const showInstructorSuggestions = ref(false);
    const showInstructorDropdown = ref(false);
    const instructorSuggestions = ref<Instructor[]>([]);
    const allInstructors = ref<Instructor[]>([]);

    const fetchInstructors = async () => {
      try {
        const token = localStorage.getItem("token");
        const baseUrl = "http://localhost:8081";
        const response = await axios.get(
          `${baseUrl}/api/v1/admin/user/compact`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        allInstructors.value = response.data;
      } catch (error) {
        console.error("Error fetching instructors:", error);
        Swal.fire({
          title: "강사 정보를 불러오는 데 실패했습니다.",
          text: "API 호출 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      }
    };

    const onInstructorInput = () => {
      showInstructorDropdown.value = false;
      if (instructorSearch.value.trim() !== "") {
        const searchQuery = instructorSearch.value.toLowerCase();
        instructorSuggestions.value = allInstructors.value.filter(
          (instructor) =>
            instructor.name.toLowerCase().includes(searchQuery) ||
            instructor.affiliation.toLowerCase().includes(searchQuery)
        );
      } else {
        instructorSuggestions.value = [];
      }
    };

    const selectInstructor = (instructor: Instructor) => {
      data.value.instructorName = instructor.name;
      instructorSearch.value = `${instructor.name} (${instructor.affiliation})`;
      showInstructorSuggestions.value = false;
      showInstructorDropdown.value = false;
    };

    const hideInstructorSuggestions = () => {
      setTimeout(() => {
        showInstructorSuggestions.value = false;
      }, 200);
    };

    const toggleInstructorDropdown = () => {
      showInstructorDropdown.value = !showInstructorDropdown.value;
      if (showInstructorDropdown.value) {
        instructorSuggestions.value = allInstructors.value;
      } else {
        instructorSuggestions.value = [];
      }
    };

    onMounted(() => {
      fetchInstructors();
    });

    const submitForm = () => {
      Swal.fire({
        title: "필터를 적용하시겠습니까?",
        text: "작성한 값에 따른 데이터가 출력됩니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "네, 적용합니다",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.isConfirmed) {
          // Emit the filter data
          emit("apply-filter", { ...data.value });
          // Close the dropdown menu
          (document.activeElement as HTMLElement).blur();
          closeButton.value?.click();
        }
      });
    };

    const resetForm = () => {
      Swal.fire({
        title: "필터를 초기화하시겠습니까?",
        text: "필터값이 저장되지 않습니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "네, 초기화합니다",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.isConfirmed) {
          data.value = {
            status: "",
            institutionName: "",
            totalChapters: "",
            classNumber: "",
            instructorPhoneNumber: "",
            programName: "",
            chapter: "",
            startDate: "",
            endDate: "",
            instructorName: "",
          };
          // Also reset the instructor search field
          instructorSearch.value = "";
          instructorSuggestions.value = [];
          showInstructorSuggestions.value = false;
          showInstructorDropdown.value = false;

          // Emit the reset event
          emit("apply-filter", { ...data.value });
          // Close the dropdown menu
          (document.activeElement as HTMLElement).blur();
          closeButton.value?.click();
        }
      });
    };

    return {
      data,
      closeButton,
      instructorSearch,
      showInstructorSuggestions,
      showInstructorDropdown,
      instructorSuggestions,
      selectInstructor,
      onInstructorInput,
      hideInstructorSuggestions,
      toggleInstructorDropdown,
      submitForm,
      resetForm,
    };
  },
});
</script>

<style scoped>
.modal-content {
  height: 60%;
  overflow-y: auto;
}

.position-relative {
  position: relative;
}

.input-group .form-control {
  flex: 1;
}

.input-group .dropdown-button {
  background-color: #F5F8FA;
  border: 1px solid #E4E6EF;
}

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background: white;
  border: 1px solid #ccc;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestions-list li {
  padding: 8px;
  cursor: pointer;
}

.suggestions-list li:hover {
  background-color: #f1f1f1;
}
</style>
