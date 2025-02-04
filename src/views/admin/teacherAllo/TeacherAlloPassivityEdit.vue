<template>
  <div class="d-flex flex-column flex-xl-row">
    <div class="flex-column flex-lg-row-auto w-100 mb-10">
      <div class="card mb-5 mb-xl-8">
        <div class="card-body">
          <div class="card mb-5 mb-xl-10" id="kt_account_program_details_container">
            <div
              class="card-header border-0 cursor-pointer"
              role="button"
              data-bs-toggle="collapse"
              data-bs-target="#kt_account_program_details"
              aria-expanded="true"
              aria-controls="kt_account_program_details"
            >
              <div class="card-title m-0 d-flex align-items-center">
                <i class="bi bi-info-circle me-2"></i>
                <h2 class="fw-bold m-0">프로그램 및 교육기관 조회</h2>
              </div>
            </div>

            <div id="kt_account_program_details" class="collapse show">
              <VForm id="kt_account_program_details_form" class="form" novalidate>
                <div class="card-body border-top p-9">
                  <h3 class="fw-bold section-title">교육 챕터 및 강사</h3>
                  <div class="accordion" id="educationAccordion">
                    <div
                      class="accordion-item"
                      v-for="chapter in groupedChapters"
                      :key="chapter.chapter.educationChapterId"
                    >
                      <h2 class="accordion-header" :id="'heading' + chapter.chapter.educationChapterId">
                        <button
                          class="accordion-button"
                          type="button"
                          aria-expanded="true"
                          :aria-controls="'collapse' + chapter.chapter.educationChapterId"
                          disabled
                        >
                          <i class="bi bi-journal-bookmark me-2"></i>
                          챕터 {{ chapter.chapter.chapterNumber }} - {{ chapter.chapter.notes }}
                        </button>
                      </h2>
                      <div
                        :id="'collapse' + chapter.chapter.educationChapterId"
                        class="accordion-collapse collapse show"
                        :aria-labelledby="'heading' + chapter.chapter.educationChapterId"
                        data-bs-parent="#educationAccordion"
                      >
                        <div class="accordion-body">
                          <div class="card mb-4">
                            <div class="card-body p-0">
                              <table class="table table-bordered mb-0">
                                <colgroup>
                                  <col style="width: 20%;">
                                  <col style="width: 30%;">
                                  <col style="width: 20%;">
                                  <col style="width: 30%;">
                                </colgroup>
                                <tbody>
                                  <tr>
                                    <th class="bg-light">주 강사 수</th>
                                    <td>{{ chapter.chapter.mainInstructorsNumber }}</td>
                                    <th class="bg-light">보조 강사 수</th>
                                    <td>{{ chapter.chapter.assistantInstructorsNumber }}</td>
                                  </tr>
                                  <tr>
                                    <th class="bg-light">날짜</th>
                                    <td>{{ chapter.chapter.date }}</td>
                                    <th class="bg-light">확인 여부</th>
                                    <td>{{ chapter.chapter.isConfirmed || '-' }}</td>
                                  </tr>
                                  <tr>
                                    <th class="bg-light">시작 시간</th>
                                    <td>{{ chapter.chapter.startTime }}</td>
                                    <th class="bg-light">종료 시간</th>
                                    <td>{{ chapter.chapter.endTime }}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                              <h5 class="card-title mb-0">강사 목록</h5>
                              <button class="btn btn-primary btn-sm" @click="addInstructor(chapter.chapter.educationChapterId)">
                                <i class="bi bi-plus-lg" style="padding: 0px;"></i>
                              </button>
                            </div>
                            <div class="card-body p-0">
                              <table class="table table-striped table-hover table-bordered mb-0">
                                <colgroup>
                                  <col style="width: 5%;">
                                  <col style="width: 15%;">
                                  <col style="width: 30%;">
                                  <col style="width: 15%;">
                                  <col style="width: 20%;">
                                  <col style="width: 15%;">
                                </colgroup>
                                <thead class="table-light">
                                  <tr>
                                    <th>강사 ID</th>
                                    <th>상태</th>
                                    <th>이름</th>
                                    <th>전화번호</th>
                                    <th>소속</th>
                                    <th>역할</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                    v-for="instructor in chapter.instructors"
                                    :key="instructor.educationInstructorId || instructor.tempId"
                                  >
                                    <td>{{ instructor.educationInstructorId || '-' }}</td>
                                    <td>{{ instructorStatusDisplay(instructor.status) }}</td>
                                    <td>
                                      <div v-if="!instructor.educationInstructorId" class="position-relative">
                                        <!-- 신규 강사: 드롭다운 및 검색 기능이 있는 입력 필드 -->
                                        <div class="input-group">
                                          <input
                                            type="text"
                                            class="form-control form-control-solid"
                                            placeholder="강사 이름을 입력해주세요."
                                            v-model="instructor.searchText"
                                            @focus="instructor.showSuggestions = true"
                                            @input="onInstructorInput(instructor)"
                                            @blur="hideInstructorSuggestions(instructor)"
                                          />
                                          <button
                                            class="btn dropdown-button"
                                            type="button"
                                            @click="toggleInstructorDropdown(instructor)"
                                          >
                                            ▼
                                          </button>
                                        </div>
                                        <ul
                                          v-if="instructor.showSuggestions && instructor.suggestions.length"
                                          class="suggestions-list"
                                        >
                                          <li
                                            v-for="suggestion in instructor.suggestions"
                                            :key="suggestion.id"
                                            @mousedown.prevent="selectInstructor(instructor, suggestion)"
                                          >
                                            {{ suggestion.name }} ({{ suggestion.affiliation }})
                                          </li>
                                        </ul>
                                      </div>
                                      <div v-else>
                                        <!-- 기존 강사: 이름을 일반 텍스트로 표시 -->
                                        <span>{{ instructor.instructor.name }}</span>
                                      </div>
                                    </td>
                                    <td>{{ instructor.instructor.phoneNumber || '-' }}</td>
                                    <td>{{ instructor.instructor.affiliation || '-' }}</td>
                                    <td>
                                      <select
                                        v-model="instructor.role"
                                        class="form-select form-select-solid"
                                      >
                                        <option value="">선택하세요</option>
                                        <option value="MAIN">주강사</option>
                                        <option value="ASSISTANT">보조강사</option>
                                        <option value="UNDEFINED">미정</option>
                                      </select>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 교육 정보, 프로그램 상세 정보, 교육기관 상세 정보 등 다른 섹션은 이전과 동일하게 유지 -->
                  <!-- ... 생략 ... -->

                  <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
                </div>
              </VForm>
            </div>
          </div>
        </div>

        <div class="card-footer d-flex justify-content-end py-6 px-9">
          <button
            type="button"
            class="btn btn-left btn-active-left-primary me-2"
            style="margin-right: auto !important; background-color: red; color: white;"
            @click="deleteData"
          >
            삭제
          </button>
          <button
            type="button"
            class="btn btn-light btn-active-light-primary me-2"
            @click="goBack"
          >
            뒤로가기
          </button>
          <button
            type="button"
            id="kt_account_program_details_submit"
            ref="submitButton1"
            class="btn btn-primary"
            :disabled="isSubmitting"
            @click="goEdit"
          >
            <span v-if="!isSubmitting" class="indicator-label">
              수정하기
            </span>
            <span v-else class="indicator-progress">
              잠시만 기다려주세요...
              <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, ref, onMounted, computed } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useRouter } from "vue-router";
import { ApiUrl } from "@/assets/ts/_utils/api";

interface IProgram {
  programId: number;
  programName: string;
  chapter: number;
  product: string | null;
  status: string;
  level: number;
  remark: string;
}

interface IInstitutionDetail {
  institutionId: number;
  institutionName: string;
  city: string;
  district: string;
  street: string;
  number: string | null;
  representativeNumber: string | null;
  managerName: string;
  phoneNumber: string | null;
  remarks: string | null;
}

interface IEducationChapter {
  educationChapterId: number;
  chapterNumber: number;
  mainInstructorsNumber: number;
  assistantInstructorsNumber: number;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
  isConfirmed: string | null;
}

interface IInstructor {
  educationInstructorId: number | null; // 기존 강사는 숫자, 신규 강사는 null
  tempId?: number; // 신규 강사를 위한 임시 ID
  role: string | null;
  originalRole: string | null;
  userId: number; // 변경 추적을 위한 userId
  originalUserId: number | null; // 원래 userId 저장
  status: string;
  instructor: {
    userId: number;
    username: string;
    name: string;
    email: string | null;
    phoneNumber: string | null;
    birthDate: string | null;
    address: string | null;
    gender: string | null;
    affiliation: string;
    roles: string;
    status: string;
    signPath: string | null;
  };
  educationChapterId: number;
  searchText: string;
  showSuggestions: boolean;
  suggestions: InstructorCompact[];
}

interface IApiResponse {
  educationId: number;
  status: string;
  grade: number;
  classNumber: number;
  numberOfStudents: number;
  productQuantity: number;
  chapterNumber: number;
  isConfirmed: string;
  remark: string;
  program: IProgram;
  institution: IInstitutionDetail;
  educationChapters: IEducationChapter[];
  educationInstructors: IInstructor[];
}

interface IGroupedChapter {
  chapter: IEducationChapter;
  instructors: IInstructor[];
}

interface InstructorCompact {
  id: number;
  name: string;
  affiliation: string;
  phoneLast4Digits: string | null;
}

export default defineComponent({
  name: "ProgramDetail",

  setup() {
    const router = useRouter();
    const submitButton = ref<HTMLButtonElement | null>(null);

    const educationId = ref<number | null>(null);
    const status = ref<string>('');
    const grade = ref<number>(0);
    const classNumber = ref<number>(0);
    const numberOfStudents = ref<number>(0);
    const chapterNumber = ref<number>(0);
    const isConfirmed = ref<string>('');
    const remark = ref<string>('');

    const program = ref<IProgram>({
      programId: 0,
      programName: '',
      chapter: 0,
      product: null,
      status: '',
      level: 0,
      remark: ''
    });

    const institution = ref<IInstitutionDetail>({
      institutionId: 0,
      institutionName: '',
      city: '',
      district: '',
      street: '',
      number: null,
      representativeNumber: null,
      managerName: '',
      phoneNumber: null,
      remarks: null
    });

    const educationChapters = ref<IEducationChapter[]>([]);
    const educationInstructors = ref<IInstructor[]>([]);
    const errorMessage = ref<string>('');

    const allInstructors = ref<InstructorCompact[]>([]);

    const statusMap: { [key: string]: string } = {
      "READY": "강사 열람 가능",
      "OPEN": "강사 신청 가능",
      "APPLIED": "신청 마감",
      "CONFIRMED": "출강 확정",
      "PROGRESS": "강의 진행 중",
      "COMPLETE": "강의 종료",
      "PAUSE": "강의 중지",
      "CANCEL": "강의 취소"
    };

    const programStatusMap: { [key: string]: string } = {
      "READY": "강사 열람 가능",
      "OPEN": "강사 신청 가능",
      "APPLIED": "신청 마감",
      "CONFIRMED": "출강 확정",
      "PROGRESS": "강의 진행 중",
      "COMPLETE": "강의 종료",
      "PAUSE": "강의 중지",
      "CANCEL": "강의 취소"
    };

    const instructorStatusMap: { [key: string]: string } = {
      "INIT": "강의 대기 중",
      "OPEN": "강사 신청 가능",
      "READY": "강사 열람 가능",
      "APPLIED": "신청 마감",
      "PENDING_ASSIGN": "강사 역할 배정",
      "CONFIRMED": "출강 확정",
      "PROGRESS": "강의 진행 중",
      "COMPLETE": "강의 종료",
      "PAUSE": "강의 중지",
      "CANCEL": "강의 취소"
    };

    const statusDisplay = computed(() => {
      return statusMap[status.value] || status.value;
    });

    const programStatusDisplay = computed(() => {
      return programStatusMap[program.value.status] || program.value.status;
    });

    const isConfirmedDisplay = computed(() => {
      return isConfirmed.value === "Y" ? "예" : "아니오";
    });

    const roleDisplay = (role: string | null) => {
      if (role === "MAIN") return "주강사";
      if (role === "ASSISTANT") return "보조강사";
      if (role === "UNDEFINED") return "미정";
      return "-";
    };

    const instructorStatusDisplay = (status: string) => {
      return instructorStatusMap[status] || status;
    };

    const groupedChapters = computed<IGroupedChapter[]>(() => {
      return educationChapters.value.map(chapter => {
        const instructors = educationInstructors.value.filter(instr => instr.educationChapterId === chapter.educationChapterId);
        return {
          chapter,
          instructors
        };
      });
    });

    const fetchAllInstructors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<InstructorCompact[]>(
          `${ApiUrl("/api/v1/admin/user/compact")}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        allInstructors.value = response.data;
      } catch (error) {
        console.error("강사 데이터를 불러오는 데 실패했습니다:", error);
        Swal.fire({
          title: "오류",
          text: "강사 데이터를 불러오는 데 실패했습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      }
    };

    const onInstructorInput = (instructor: IInstructor) => {
      if (instructor.searchText.trim() !== '') {
        const searchQuery = instructor.searchText.toLowerCase();
        instructor.suggestions = allInstructors.value
          .filter(
            (item) =>
              item.name.toLowerCase().includes(searchQuery) ||
              item.affiliation.toLowerCase().includes(searchQuery)
          )
          .sort((a, b) => {
            // 가장 가까운 매칭을 위하여 이름의 시작 위치 기준으로 정렬
            const aIndex = a.name.toLowerCase().indexOf(searchQuery);
            const bIndex = b.name.toLowerCase().indexOf(searchQuery);
            return aIndex - bIndex;
          })
          .slice(0, 300); // 상위 10개만 표시
        instructor.showSuggestions = true;
      } else {
        instructor.suggestions = [];
        instructor.showSuggestions = false;
      }
    };

    const selectInstructor = (instructor: IInstructor, selected: InstructorCompact) => {
      instructor.instructor.name = selected.name;
      instructor.searchText = selected.name; // 이름만 입력 필드에 반영
      instructor.showSuggestions = false;
      instructor.suggestions = [];
      instructor.instructor.userId = selected.id;
      instructor.instructor.affiliation = selected.affiliation;
      instructor.userId = selected.id; // 이 줄을 추가합니다.
      // 전화번호 등 추가 정보가 필요하다면 여기에서 설정
    };

    const toggleInstructorDropdown = (instructor: IInstructor) => {
      if (instructor.educationInstructorId !== null) return; // 기존 강사일 경우 드롭다운 토글 방지

      instructor.showSuggestions = !instructor.showSuggestions;
      if (instructor.showSuggestions) {
        instructor.suggestions = allInstructors.value.slice(0, 300); // 상위 10개 표시
      } else {
        instructor.suggestions = [];
      }
    };

    const hideInstructorSuggestions = (instructor: IInstructor) => {
      setTimeout(() => {
        instructor.showSuggestions = false;
      }, 200);
    };

    const fetchProgramData = async () => {
      const programId = localStorage.getItem('selectedProgramId');
      if (!programId) {
        errorMessage.value = '프로그램 ID를 찾을 수 없습니다.';
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<IApiResponse>(ApiUrl(`/api/v1/admin/apply-for-programs/detail/${programId}`), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = response.data;

        educationId.value = data.educationId;
        status.value = data.status;
        grade.value = data.grade;
        classNumber.value = data.classNumber;
        numberOfStudents.value = data.numberOfStudents;
        chapterNumber.value = data.chapterNumber;
        isConfirmed.value = data.isConfirmed;
        remark.value = data.remark;

        program.value = data.program;
        institution.value = data.institution;
        educationChapters.value = data.educationChapters;
        educationInstructors.value = data.educationInstructors.map(instr => ({
          ...instr,
          userId: instr.instructor.userId, // 여기서 userId를 설정합니다
          searchText: instr.instructor.name, // 초기 값 설정
          showSuggestions: false,
          suggestions: [],
          originalRole: instr.role, // 원래 역할 저장
          originalUserId: instr.instructor.userId, // 원래 userId 저장
          tempId: undefined, // 기존 강사는 tempId 없음
        }));


      } catch (error) {
        console.error('Error fetching program data:', error);
        errorMessage.value = '프로그램 정보를 불러오는 데 실패했습니다.';
      }
    };

    const isSubmitting = ref(false);

    const deleteData = async () => {
      const programId = localStorage.getItem('selectedProgramId');

      if (!programId) {
        Swal.fire({
          text: "삭제할 프로그램 ID가 없습니다.",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "확인",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semibold btn-light-danger",
          },
        });
        return;
      }

      const result = await Swal.fire({
        title: "삭제하시겠습니까?",
        text: "삭제된 프로그램은 복구할 수 없습니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
        customClass: {
          confirmButton: "btn fw-semibold btn-danger",
          cancelButton: "btn fw-semibold btn-light"
        },
        buttonsStyling: false,
        heightAuto: false,
      });

      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(ApiUrl(`/api/v1/admin/apply-for-programs/detail/${programId}`), {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          Swal.fire({
            text: "프로그램 정보가 성공적으로 삭제되었습니다.",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "확인",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semibold btn-light-primary",
            },
          }).then(() => {
            router.push({ name: "admin-ProgramList" });
          });

        } catch (error: unknown) {
          console.error('Error deleting program:', error);
          Swal.fire({
            text: "오류가 발생하였습니다.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "확인",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semibold btn-light-danger",
            },
          });
        } finally {
          if (submitButton.value) {
            submitButton.value.removeAttribute("data-kt-indicator");
            submitButton.value.disabled = false;
          }
        }
      }
    };

    let tempInstructorId = 1; // 임시 ID 카운터

    const addInstructor = (chapterId: number) => {
      const newInstructor: IInstructor = {
        educationInstructorId: null, // 신규 강사
        tempId: tempInstructorId++, // 고유한 임시 ID 부여
        role: null,
        originalRole: null,
        userId: 0,
        originalUserId: null,
        status: 'INIT',
        instructor: {
          userId: 0,
          username: '',
          name: '',
          email: null,
          phoneNumber: null,
          birthDate: null,
          address: null,
          gender: null,
          affiliation: '',
          roles: '',
          status: '',
          signPath: null,
        },
        educationChapterId: chapterId,
        searchText: '',
        showSuggestions: false,
        suggestions: [],
      };

      educationInstructors.value.push(newInstructor);
    };

    const goEdit = async () => {
  // 변경된 강사 역할 및 userId 필터링
  const modifiedInstructors = educationInstructors.value.filter(instr => 
    (instr.role !== instr.originalRole || instr.userId !== instr.originalUserId) &&
    instr.role !== null &&
    instr.role !== ''
  );

  if (modifiedInstructors.length === 0) {
    Swal.fire({
      title: "정보",
      text: "변경된 사항이 없습니다.",
      icon: "info",
      confirmButtonText: "확인",
    });
    return;
  }

  // 사용자에게 수정 확인 요청
  const confirmResult = await Swal.fire({
    title: "수정하시겠습니까?",
    text: "변경된 강사 역할을 저장하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
    customClass: {
      confirmButton: "btn fw-semibold btn-primary",
      cancelButton: "btn fw-semibold btn-light"
    },
    buttonsStyling: false,
  });

  if (!confirmResult.isConfirmed) {
    return;
  }

  isSubmitting.value = true; // 로딩 상태 시작

  try {
    const token = localStorage.getItem("token");
    const apiEndpoint = ApiUrl("/api/v1/admin/education-instructors/assign");

    const requests = modifiedInstructors.map((instr, index) => {
      const dataToSend = {
        chapterId: instr.educationChapterId,
        userId: instr.userId,
        role: instr.role
      };

      // API 호출 전 데이터 로깅
      console.log(`API 호출 ${index + 1}: POST ${apiEndpoint}`);
      console.log("전송 데이터:", dataToSend);

      return axios.post(
        apiEndpoint,
        dataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      ).then(response => {
        // API 응답 로깅
        console.log(`API 응답 ${index + 1}:`, response.data);
        return response;
      }).catch(error => {
        // API 호출 오류 로깅
        console.error(`API 호출 오류 ${index + 1}:`, error);
        throw error;
      });
    });

    const responses = await Promise.all(requests);

    // 서버로부터 받은 응답을 통해 educationInstructorId 업데이트 (신규 강사)
    modifiedInstructors.forEach((instr, index) => {
      if (instr.educationInstructorId === null) {
        const responseData = responses[index].data;
        instr.educationInstructorId = responseData.educationInstructorId || tempInstructorId++;
        console.log(`신규 강사 ID 업데이트 ${index + 1}:`, instr.educationInstructorId);
      }
      instr.originalRole = instr.role;
      instr.originalUserId = instr.userId;
    });

    // 성공적인 수정 후 페이지 이동
    Swal.fire({
      title: "성공",
      text: "강사 역할이 성공적으로 수정되었습니다.",
      icon: "success",
      confirmButtonText: "확인",
    }).then(() => {
      router.push({ name: "admin-TeacherAlloPassivityDetails" });
    });

  } catch (error) {
    console.error('강사 역할 수정 중 오류:', error);
    Swal.fire({
      title: "오류",
      text: "강사 역할 수정 중 오류가 발생했습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
  } finally {
    isSubmitting.value = false; // 로딩 상태 종료
  }
};



    const goBack = () => {
      router.back();
    };

    onMounted(() => {
      fetchProgramData();
      fetchAllInstructors();
    });

    return {
      educationId,
      status,
      grade,
      classNumber,
      numberOfStudents,
      chapterNumber,
      isConfirmed,
      remark,
      program,
      institution,
      educationChapters,
      educationInstructors,
      groupedChapters,
      submitButton,
      deleteData,
      goEdit,
      goBack,
      errorMessage,
      statusDisplay,
      programStatusDisplay,
      isConfirmedDisplay,
      roleDisplay,
      instructorStatusDisplay,

      // 강사 관련 상태 및 메서드
      allInstructors,
      onInstructorInput,
      selectInstructor,
      toggleInstructorDropdown,
      hideInstructorSuggestions,

      isSubmitting,

      addInstructor,
    };
  },
});
</script>

<style scoped>
.section-title {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.75rem;
  border-bottom: 2px solid #dee2e6;
  padding-bottom: 0.5rem;
}

.table {
  margin-bottom: 1.5rem;
}

.table th, .table td {
  vertical-align: middle;
}

.table th {
  font-weight: 600;
  background-color: #f8f9fa;
}

.table-bordered th, .table-bordered td {
  border: 1px solid #dee2e6;
}

.alert {
  margin-top: 1rem;
}

.accordion-button:not(.collapsed) {
  color: #0d6efd;
  background-color: #e7f1ff;
}

.accordion-button {
  font-weight: 600;
}

.card {
  margin-bottom: 1rem;
}

.card-header {
  background-color: #f7f9fc;
  border-bottom: 1px solid #e3e6f0;
}

.card-title {
  margin-bottom: 0;
}

.bi-info-circle, .bi-journal-bookmark {
  font-size: 1.2rem;
}

@media (max-width: 575.98px) {
  .row .col-md-6, .row .col-md-4, .row .col-md-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

.card-body strong {
  color: #495057;
}

.accordion-button i {
  color: #0d6efd;
}

.accordion-button.collapsed:hover, .accordion-button:hover {
  background-color: #f1f3f5;
}

.card-header h5 {
  font-size: 1.1rem;
}

.border-end {
  border-right: 1px solid #dee2e6;
}

.table th.w-25 {
  width: 25%;
}

.table td, .table th {
  padding: 0.75rem;
}

.card-body {
  padding: 1rem;
}

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background: white;
  border: 1px solid #ccc;
  z-index: 1000;
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

.input-group .dropdown-button {
  background-color: #f5f8fa;
  border: 1px solid #e4e6ef;
  cursor: pointer;
}

.position-relative {
  position: relative;
}
</style>

