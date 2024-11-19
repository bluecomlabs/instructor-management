<template>
  <div
    class="menu menu-sub menu-sub-dropdown w-250px w-md-450px modal-content"
    data-kt-menu="true"
  >
    <div class="px-7 py-5 d-flex justify-content-between align-items-center">
      <div class="fs-5 text-gray-900 fw-bold">강사 필터링</div>
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
        <label class="form-label fw-semibold">ID</label>
        <div>
          <input type="text" class="form-control form-control-solid" placeholder="사용자명을 입력해주세요." v-model="data.username" />
        </div>
      </div>

      <div class="mb-10">
        <label class="form-label fw-semibold">이름</label>
        <div>
          <input type="text" class="form-control form-control-solid" placeholder="이름을 입력해주세요." v-model="data.name" />
        </div>
      </div>

      <div class="mb-10">
        <label class="form-label fw-semibold">이메일</label>
        <div>
          <input type="email" class="form-control form-control-solid" placeholder="이메일을 입력해주세요." v-model="data.email" />
        </div>
      </div>

      <div class="mb-10">
        <label class="form-label fw-semibold">성별</label>
        <div>
          <select class="form-select form-select-solid" v-model="data.gender">
            <option value="">전체</option>
            <option value="M">남</option>
            <option value="F">여</option>
          </select>
        </div>
      </div>

      <div class="mb-10">
        <label class="form-label fw-semibold">소속</label>
        <div>
          <input type="text" class="form-control form-control-solid" placeholder="소속을 입력해주세요." v-model="data.affiliation" />
        </div>
      </div>

      <div class="mb-10">
        <label class="form-label fw-semibold">상태</label>
        <div>
          <select class="form-select form-select-solid" v-model="data.status">
            <option value="">전체</option>
            <option value="Y">활성</option>
            <option value="N">비활성</option>
          </select>
        </div>
      </div>

      <!-- <div class="mb-10">
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
import { defineComponent, ref, onMounted } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import { ApiUrl } from "@/assets/ts/_utils/api";

interface Filter {
  id: string;
  username: string;
  name: string;
  email: string;
  gender: string;
  affiliation: string;
  status: string;
  programName: string;
  institutionName: string;
  chapter: string;
  totalChapters: string;
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
  name: "UserFilterModal",
  emits: ["apply-filter"],
  setup(props, { emit }) {
    const data = ref<Filter>({
      id: "",
      username: "",
      name: "",
      email: "",
      gender: "",
      affiliation: "",
      status: "",
      programName: "",
      institutionName: "",
      chapter: "",
      totalChapters: "",
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
        const response = await axios.get(
          ApiUrl(`/api/v1/admin/user/compact`),
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
          emit("apply-filter", { ...data.value });
          (document.activeElement as HTMLElement).blur();
          closeButton.value?.click();
          console.log("적용된 필터 데이터:", data.value);
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
            id: "",
            username: "",
            name: "",
            email: "",
            gender: "",
            affiliation: "",
            status: "",
            programName: "",
            institutionName: "",
            chapter: "",
            totalChapters: "",
            startDate: "",
            endDate: "",
            instructorName: "",
          };
          instructorSearch.value = "";
          instructorSuggestions.value = [];
          showInstructorSuggestions.value = false;
          showInstructorDropdown.value = false;

          emit("apply-filter", { ...data.value });
          (document.activeElement as HTMLElement).blur();
          closeButton.value?.click();
          console.log("초기화된 필터 데이터:", data.value);
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
