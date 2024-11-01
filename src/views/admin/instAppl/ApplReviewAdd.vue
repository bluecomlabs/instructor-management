<template>
  <div class="d-flex flex-column flex-xl-row">
    <div class="flex-column flex-lg-row-auto w-100 mb-10">
      <div class="card mb-5 mb-xl-8">
        <div class="card-body">
          <div class="card mb-5 mb-xl-10">
            <div
              class="card-header border-0 cursor-pointer"
              role="button"
              data-bs-toggle="collapse"
              data-bs-target="#kt_account_toturprofile_details"
              aria-expanded="true"
              aria-controls="kt_account_toturprofile_details"
            >
              <div class="card-title m-0">
                <h2 class="fw-bold m-0">교육 신청</h2>
              </div>
            </div>

            <div id="kt_account_toturprofile_details" class="collapse show">
              <VForm
                id="kt_account_toturprofile_details_form"
                class="form"
                novalidate
              >
                <div class="card-body border-top p-9">
                  <!-- 기관 검색 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      기관
                    </label>
                    <div class="col-lg-8 fv-row position-relative">
                      <div class="input-group">
                        <input
                          v-model="institutionSearch"
                          class="form-control form-control-lg form-control-solid"
                          type="text"
                          placeholder="기관 이름을 입력하세요"
                          @focus="showInstitutionSuggestions = true"
                          @input="onInstitutionInput"
                          @blur="hideInstitutionSuggestions"
                        />
                        <button
                          class="btn btn-outline-secondary"
                          type="button"
                          @click="toggleInstitutionDropdown"
                        >
                          ▼
                        </button>
                      </div>
                      <ul
                        v-if="(showInstitutionSuggestions || showInstitutionDropdown) && institutionSuggestions.length"
                        class="suggestions-list"
                      >
                        <li
                          v-for="institution in institutionSuggestions"
                          :key="institution.id"
                          @mousedown.prevent="selectInstitution(institution)"
                        >
                          {{ institution.institutionName }}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- 프로그램 검색 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      프로그램
                    </label>
                    <div class="col-lg-8 fv-row position-relative">
                      <div class="input-group">
                        <input
                          v-model="programSearch"
                          class="form-control form-control-lg form-control-solid"
                          type="text"
                          placeholder="프로그램 이름을 입력하세요"
                          @focus="showProgramSuggestions = true"
                          @input="onProgramInput"
                          @blur="hideProgramSuggestions"
                        />
                        <button
                          class="btn btn-outline-secondary"
                          type="button"
                          @click="toggleProgramDropdown"
                        >
                          ▼
                        </button>
                      </div>
                      <ul
                        v-if="(showProgramSuggestions || showProgramDropdown) && programSuggestions.length"
                        class="suggestions-list"
                      >
                        <li
                          v-for="program in programSuggestions"
                          :key="program.id"
                          @mousedown.prevent="selectProgram(program)"
                        >
                          {{ program.programName }}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- 학년 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      학년
                    </label>
                    <div class="col-lg-8 fv-row position-relative">
                      <div class="custom-number-input">
                        <button @click="decrement('grade')" :disabled="grade <= 0">-</button>
                        <input
                          v-model.number="grade"
                          class="form-control form-control-lg form-control-solid text-center"
                          min="0"
                          readonly
                        />
                        <button @click="increment('grade')">+</button>
                      </div>
                    </div>
                  </div>

                  <!-- 반 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      반
                    </label>
                    <div class="col-lg-8 fv-row position-relative">
                      <div class="custom-number-input">
                        <button @click="decrement('classNumber')" :disabled="classNumber <= 0">-</button>
                        <input
                          v-model.number="classNumber"
                          class="form-control form-control-lg form-control-solid text-center"
                          min="0"
                          readonly
                        />
                        <button @click="increment('classNumber')">+</button>
                      </div>
                    </div>
                  </div>

                  <!-- 학생 수 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      학생 수
                    </label>
                    <div class="col-lg-8 fv-row position-relative">
                      <div class="custom-number-input">
                        <button @click="decrement('numberOfStudents')" :disabled="numberOfStudents <= 0">-</button>
                        <input
                          v-model.number="numberOfStudents"
                          class="form-control form-control-lg form-control-solid text-center"
                          min="0"
                          readonly
                        />
                        <button @click="increment('numberOfStudents')">+</button>
                      </div>
                    </div>
                  </div>

                  <!-- 수업일 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      수업일
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input
                        v-model="date"
                        class="form-control form-control-lg form-control-solid"
                        type="date"
                      />
                    </div>
                  </div>

                  <!-- 총 차시 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      총 차시
                    </label>
                    <div class="col-lg-8 fv-row position-relative">
                      <div class="custom-number-input">
                        <button @click="decrement('chapterNumber')" :disabled="chapterNumber <= 0">-</button>
                        <input
                          v-model.number="chapterNumber"
                          class="form-control form-control-lg form-control-solid text-center"
                          min="0"
                          readonly
                        />
                        <button @click="increment('chapterNumber')">+</button>
                      </div>
                    </div>
                  </div>

                  <!-- 교육 차시 상세보기 -->
                  <h3 class="fw-bold mt-10 mb-5">교육 차시 상세</h3>
                  <div class="row">
                    <div
                      v-for="(chapter, index) in educationChapters"
                      :key="index"
                      class="col-md-12 mb-4"
                    >
                      <div class="card h-100">
                        <div
                          class="card-header p-0"
                          role="button"
                          data-bs-toggle="collapse"
                          :data-bs-target="'#chapterContent' + index"
                          aria-expanded="false"
                          :aria-controls="'chapterContent' + index"
                          style="margin-left: 10px;"
                        >
                          <h5 class="card-title m-0 p-3">
                            {{ chapter.chapterNumber }} 차시 상세보기
                          </h5>
                        </div>
                        <div :id="'chapterContent' + index" class="collapse">
                          <div class="card-body">
                            <div class="mb-3">
                              <label class="form-label fw-semibold">
                                날짜
                              </label>
                              <input
                                v-model="chapter.date"
                                class="form-control form-control-solid"
                                type="date"
                              />
                            </div>

                            <div class="mb-3">
                              <label class="form-label fw-semibold">
                                시간
                              </label>
                              <div class="d-flex align-items-center">
                                <input
                                  v-model="chapter.startTime"
                                  class="form-control form-control-solid me-2"
                                  type="time"
                                />
                                <span>~</span>
                                <input
                                  v-model="chapter.endTime"
                                  class="form-control form-control-solid ms-2"
                                  type="time"
                                />
                              </div>
                            </div>
                            <div class="mb-3">
                              <label class="form-label fw-semibold">
                                주 강사 수
                              </label>
                              <div class="custom-number-input">
                                <button @click="decrementChapter(index, 'mainInstructorsNumber')" :disabled="chapter.mainInstructorsNumber <= 0">-</button>
                                <input
                                  v-model.number="chapter.mainInstructorsNumber"
                                  class="form-control form-control-solid text-center"
                                  min="0"
                                  readonly
                                />
                                <button @click="incrementChapter(index, 'mainInstructorsNumber')">+</button>
                              </div>
                            </div>

                            <!-- 보조 강사 수 -->
                            <div class="mb-3">
                              <label class="form-label fw-semibold">
                                보조 강사 수
                              </label>
                            <div class="custom-number-input">
                              <button @click="decrementChapter(index, 'assistantInstructorsNumber')" :disabled="chapter.assistantInstructorsNumber <= 0">-</button>
                              <input
                                v-model.number="chapter.assistantInstructorsNumber"
                                class="form-control form-control-solid text-center"
                                min="0"
                                readonly
                              />
                              <button @click="incrementChapter(index, 'assistantInstructorsNumber')">+</button>
                            </div>
                            </div>
                            <div class="mb-3">
                              <label class="form-label fw-semibold">
                                비고
                              </label>
                              <input
                                v-model="chapter.notes"
                                class="form-control form-control-solid"
                                type="text"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </VForm>
            </div>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-end py-6 px-9">
          <button
            type="button"
            class="btn btn-light btn-active-light-primary me-2"
            @click="goBack"
          >
            취소
          </button>
          <button
            type="submit"
            id="kt_account_detaiprofile_details_submit"
            ref="submitButton1"
            class="btn btn-primary"
            @click="goRegister()"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, ref, watch, onMounted } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useRouter } from "vue-router";
import { ApiUrl } from "@/assets/ts/_utils/api";

interface EducationChapter {
  chapterNumber: number;
  mainInstructorsNumber: number | null;
  assistantInstructorsNumber: number | null;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
}
interface Institution {
  id: number;
  institutionName: string;
}
interface Program {
  id: number;
  programName: string;
}

export default defineComponent({
  name: "sign-in",
  setup() {
    const router = useRouter();
    const submitButton = ref<HTMLButtonElement | null>(null);
    const selectedProgramId = ref<number | null>(null);
    const selectedInstitutionId = ref<number | null>(null);

    const institutionSearch = ref('');
    const programSearch = ref('');

    const showInstitutionSuggestions = ref(false);
    const showProgramSuggestions = ref(false);

    const showInstitutionDropdown = ref(false);
    const showProgramDropdown = ref(false);

    const institutionSuggestions = ref<Institution[]>([]);
    const programSuggestions = ref<Program[]>([]);

    const allInstitutions = ref<Institution[]>([]);
    const allPrograms = ref<Program[]>([]);

    const grade = ref<number>(0);
    const isConfirmed = ref(false);
    const classNumber = ref<number>(0);
    const numberOfStudents = ref<number>(0);
    const chapterNumber = ref<number>(0);
    const date = ref<string>('');
    const educationChapters = ref<EducationChapter[]>([]);
    const remark = ref('');
    const errorMessage = ref('');

    // 초성 추출 함수
    const getChosung = (text: string): string => {
      const CHOSUNG = [
        "ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ",
        "ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"
      ];
      let result = "";
      for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i) - 44032;
        if (code > -1 && code < 11172) {
          const chosungIndex = Math.floor(code / 588);
          result += CHOSUNG[chosungIndex];
        } else {
          result += text.charAt(i);
        }
      }
      return result;
    };

    // 총 차시 수에 따른 교육 차시 상세 생성
    watch(chapterNumber, (newChapterNumber) => {
      if (newChapterNumber) {
        const existingChapters = educationChapters.value;

        educationChapters.value = Array.from({ length: newChapterNumber }, (_, index) => {
          const existingChapter = existingChapters[index];
          return existingChapter || {
            chapterNumber: index + 1,
            mainInstructorsNumber: null,
            assistantInstructorsNumber: null,
            date: "",
            startTime: "",
            endTime: "",
            notes: "",
          };
        });
      } else {
        educationChapters.value = [];
      }
    });

    // 전체 기관 및 프로그램 데이터 가져오기
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [institutionsResponse, programsResponse] = await Promise.all([
          axios.get(ApiUrl(`/api/v1/admin/institutions?&sortBy=institutionName&direction=asc`), {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          axios.get(ApiUrl(`/api/v1/admin/programs?&sortBy=programName&direction=asc`), {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);
        allInstitutions.value = institutionsResponse.data.content;
        allPrograms.value = programsResponse.data.content;
      } catch (error) {
        console.error('Error fetching data:', error);
        errorMessage.value = '기관 및 프로그램 정보를 불러오는 데 실패했습니다.';
      }
    };

    // 기관 검색 시 호출
    const onInstitutionInput = () => {
      showInstitutionDropdown.value = false;
      if (institutionSearch.value.trim() !== '') {
        const searchChosung = getChosung(institutionSearch.value);
        institutionSuggestions.value = allInstitutions.value.filter((institution: Institution) => {
          const institutionChosung = getChosung(institution.institutionName);
          return institutionChosung.includes(searchChosung);
        });
      } else {
        institutionSuggestions.value = [];
      }
    };

    // 프로그램 검색 시 호출
    const onProgramInput = () => {
      showProgramDropdown.value = false;
      if (programSearch.value.trim() !== '') {
        const searchChosung = getChosung(programSearch.value);
        programSuggestions.value = allPrograms.value.filter((program: Program) => {
          const programChosung = getChosung(program.programName);
          return programChosung.includes(searchChosung);
        });
      } else {
        programSuggestions.value = [];
      }
    };

    const selectInstitution = (institution: Institution) => {
      selectedInstitutionId.value = institution.id;
      institutionSearch.value = institution.institutionName;
      showInstitutionSuggestions.value = false;
      showInstitutionDropdown.value = false;
    };

    const selectProgram = (program: Program) => {
      selectedProgramId.value = program.id;
      programSearch.value = program.programName;
      showProgramSuggestions.value = false;
      showProgramDropdown.value = false;
    };

    const hideInstitutionSuggestions = () => {
      setTimeout(() => {
        showInstitutionSuggestions.value = false;
      }, 200);
    };

    const hideProgramSuggestions = () => {
      setTimeout(() => {
        showProgramSuggestions.value = false;
      }, 200);
    };

    const toggleInstitutionDropdown = () => {
      showInstitutionDropdown.value = !showInstitutionDropdown.value;
      if (showInstitutionDropdown.value) {
        institutionSuggestions.value = allInstitutions.value;
      } else {
        institutionSuggestions.value = [];
      }
    };

    const toggleProgramDropdown = () => {
      showProgramDropdown.value = !showProgramDropdown.value;
      if (showProgramDropdown.value) {
        programSuggestions.value = allPrograms.value;
      } else {
        programSuggestions.value = [];
      }
    };

    onMounted(() => {
      fetchAllData();
    });

    const goBack = () => {
      router.back();
    };

    const goRegister = async () => {
      // 날짜와 시간 필드 검증
      const invalidChapters = educationChapters.value.filter(chapter => {
        return !chapter.date || !chapter.startTime || !chapter.endTime;
      });

      if (invalidChapters.length > 0) {
        Swal.fire({
          text: '모든 교육 차시의 날짜와 시간을 입력해주세요.',
          icon: 'warning',
          confirmButtonText: '확인',
        });
        return;
      }

      // 등록 확인 모달
      const result = await Swal.fire({
        text: '등록하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
      });

      if (result.isConfirmed) {
        // 등록 진행
        const payload = {
          programId: selectedProgramId.value,
          programName: programSearch.value,
          institutionId: selectedInstitutionId.value,
          institutionName: institutionSearch.value,
          grade: grade.value,
          classNumber: classNumber.value,
          numberOfStudents: numberOfStudents.value,
          productQuantity: 0,
          chapterNumber: chapterNumber.value,
          status: null,
          isConfirmed: "N",
          remark: remark.value,
          date: date.value,
          educationChapters: educationChapters.value.map((chapter) => ({
            chapterNumber: chapter.chapterNumber,
            mainInstructorsNumber: chapter.mainInstructorsNumber,
            assistantInstructorsNumber: chapter.assistantInstructorsNumber,
            date: chapter.date,
            startTime: chapter.startTime,
            endTime: chapter.endTime,
            notes: chapter.notes,
          })),
        };
        console.log('API 요청 바디 값:', JSON.stringify(payload, null, 2));
        try {
          const token = localStorage.getItem('token');
          await axios.post(ApiUrl(`/api/v1/admin/apply-for-programs`), payload, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          Swal.fire({
            text: '프로그램이 성공적으로 등록되었습니다.',
            icon: 'success',
            confirmButtonText: '확인',
          }).then(() => {
            router.push({ name: 'admin-ApplReviewDetails' });
          });
        } catch (error) {
          console.error('Error registering program:', error);
          Swal.fire({
            text: '프로그램 등록 중 오류가 발생하였습니다.',
            icon: 'error',
            confirmButtonText: '확인',
          });
        }
      } else {
        // 등록 취소
        Swal.fire({
          text: '등록이 취소되었습니다.',
          icon: 'info',
          confirmButtonText: '확인',
        });
      }
    };

    const increment = (field: string) => {
      if (field === 'grade') grade.value = (grade.value || 0) + 1;
      else if (field === 'classNumber') classNumber.value = (classNumber.value || 0) + 1;
      else if (field === 'numberOfStudents') numberOfStudents.value = (numberOfStudents.value || 0) + 1;
      else if (field === 'chapterNumber') chapterNumber.value = (chapterNumber.value || 0) + 1;
    };

    const decrement = (field: string) => {
      if (field === 'grade' && grade.value! > 0) grade.value!--;
      else if (field === 'classNumber' && classNumber.value! > 0) classNumber.value!--;
      else if (field === 'numberOfStudents' && numberOfStudents.value! > 0) numberOfStudents.value!--;
      else if (field === 'chapterNumber' && chapterNumber.value! > 0) chapterNumber.value!--;
    };

    const incrementChapter = (index: number, field: string) => {
      const chapter = educationChapters.value[index];
      if (field === 'mainInstructorsNumber') {
        chapter.mainInstructorsNumber = (chapter.mainInstructorsNumber || 0) + 1;
      } else if (field === 'assistantInstructorsNumber') {
        chapter.assistantInstructorsNumber = (chapter.assistantInstructorsNumber || 0) + 1;
      }
    };

    const decrementChapter = (index: number, field: string) => {
      const chapter = educationChapters.value[index];
      if (field === 'mainInstructorsNumber' && (chapter.mainInstructorsNumber || 0) > 0) {
        chapter.mainInstructorsNumber!--;
      } else if (field === 'assistantInstructorsNumber' && (chapter.assistantInstructorsNumber || 0) > 0) {
        chapter.assistantInstructorsNumber!--;
      }
    };
    return {
      selectedProgramId,
      selectedInstitutionId,
      institutionSearch,
      programSearch,
      showInstitutionSuggestions,
      showProgramSuggestions,
      institutionSuggestions,
      programSuggestions,
      chapterNumber,
      grade,
      isConfirmed,
      classNumber,
      numberOfStudents,
      date,
      remark,
      submitButton,
      goRegister,
      goBack,
      errorMessage,
      educationChapters,
      selectInstitution,
      selectProgram,
      hideInstitutionSuggestions,
      hideProgramSuggestions,
      onInstitutionInput,
      onProgramInput,
      toggleInstitutionDropdown,
      toggleProgramDropdown,
      showInstitutionDropdown,
      showProgramDropdown,
      increment,
      decrement,
      incrementChapter,
      decrementChapter,
    };
  },
});
</script>
<style>
.disabled-input {
  font-weight: bold;
  font-size: 16px;
  float: left;
  text-align: center;
  background-color: #F9F9F9;
}
.card-header {
  background-color: #F1F3F4;
}
.card-title {
  font-size: 1.25rem;
  font-weight: bold;
}
.position-relative {
  position: relative;
}
.input-group {
  display: flex;
}
.input-group .form-control {
  flex: 1;
}
.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
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
/* input태그 키보드 입력 막는 스타일 */
input[type="number"] {
  -moz-appearance: textfield;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: inner-spin-button;
  display: inline;
}
.custom-number-input {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.custom-number-input button {
  width: 40px;
  height: 40px;
  font-size: 24px;
  font-weight: bold;
  background-color: #f1f3f4;
  border: 1px solid #ccc;
  cursor: pointer;
}

.custom-number-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.custom-number-input input {
  width: 100px;
  text-align: center !important;
  border: 1px solid #ccc;
  height: 40px;
}
</style>