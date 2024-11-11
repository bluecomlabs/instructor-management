<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content modal-content-custom">
        <div class="modal-header">
          <h5 class="modal-title">강사 선택</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <!-- 강사 선택 폼 내용 -->
          <form @submit.prevent="assignTeacher">
            <div class="mb-3">
              <label for="teacherSelect" class="form-label">강사 검색</label>
              <div class="position-relative">
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
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

            <div class="mb-3">
              <label for="selectedInstructor" class="form-label">선택된 강사</label>
              <input
                type="text"
                id="selectedInstructor"
                class="form-control"
                v-model="selectedInstructorName"
                readonly
              />
            </div>

            <div class="text-end">
              <button type="button" class="btn btn-secondary me-2" @click="$emit('close')">
                취소
              </button>
              <button type="submit" class="btn btn-primary">강사 배정</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

interface Instructor {
  id: number;
  name: string;
  affiliation: string;
  phoneLast4Digits: string;
}

export default defineComponent({
  name: "TeacherSelectionModal",
  props: {
    program: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const instructors = ref<Instructor[]>([]);
    const selectedTeacherId = ref<number | null>(null);
    const selectedInstructorName = ref("");

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
      selectedTeacherId.value = instructor.id;
      selectedInstructorName.value = `${instructor.name} (${instructor.affiliation})`;
      instructorSearch.value = selectedInstructorName.value;
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

    const assignTeacher = async () => {
      if (selectedTeacherId.value === null) {
        Swal.fire({
          title: "강사 선택",
          text: "강사를 선택해주세요.",
          icon: "warning",
          customClass: {
            confirmButton: "btn fw-semibold btn-warning",
          },
        });
        return;
      }

      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `http://localhost:8081/api/v1/admin/education-instructors/assign`,
          {
            programId: props.program.id,
            teacherId: selectedTeacherId.value,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          title: "강사 배정 완료",
          text: "강사가 성공적으로 배정되었습니다.",
          icon: "success",
          customClass: {
            confirmButton: "btn fw-semibold btn-primary",
          },
        });
        emit("close");
      } catch (error) {
        console.error("Error assigning teacher: ", error);
        Swal.fire({
          title: "오류",
          text: "강사 배정에 실패했습니다.",
          icon: "error",
          customClass: {
            confirmButton: "btn fw-semibold btn-danger",
          },
        });
      }
    };

    onMounted(() => {
      fetchInstructors();
    });

    return {
      instructors,
      selectedTeacherId,
      selectedInstructorName,
      assignTeacher,
      instructorSearch,
      showInstructorSuggestions,
      showInstructorDropdown,
      instructorSuggestions,
      selectInstructor,
      onInstructorInput,
      hideInstructorSuggestions,
      toggleInstructorDropdown,
    };
  },
});
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  max-width: 500px;
}

.btn-close {
  background: none;
  border: none;
}

.modal-content-custom {
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
