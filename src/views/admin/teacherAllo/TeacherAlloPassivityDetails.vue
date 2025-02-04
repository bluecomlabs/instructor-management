<template>
  <div class="d-flex flex-column flex-xl-row">
    <div class="flex-column flex-lg-row-auto w-100 mb-10">
      <div class="card mb-5 mb-xl-8">
        <div class="card-body">
          <!-- Program and Institution Details -->
          <div class="card mb-5 mb-xl-10">
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
              <VForm
                id="kt_account_program_details_form"
                class="form"
                novalidate
              >
                <div class="card-body border-top p-9">
                  <!-- Main Education Details -->
                  <h3 class="fw-bold section-title">교육 정보</h3>
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
                            <th class="bg-light">Education ID</th>
                            <td>{{ educationId }}</td>
                            <th class="bg-light">상태</th>
                            <td>{{ statusDisplay }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">학년</th>
                            <td>{{ grade }}</td>
                            <th class="bg-light">반 번호</th>
                            <td>{{ classNumber }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">학생 수</th>
                            <td>{{ numberOfStudents }}</td>
                            <th class="bg-light">챕터 번호</th>
                            <td>{{ chapterNumber }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">확인 여부</th>
                            <td>{{ isConfirmedDisplay }}</td>
                            <th class="bg-light">비고</th>
                            <td>{{ remark || '-' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- Program Details -->
                  <h3 class="fw-bold section-title">프로그램 상세 정보</h3>
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
                            <th class="bg-light">프로그램 ID</th>
                            <td>{{ program.programId }}</td>
                            <th class="bg-light">프로그램 이름</th>
                            <td>{{ program.programName }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">챕터</th>
                            <td>{{ program.chapter }}</td>
                            <th class="bg-light">난이도</th>
                            <td>{{ program.level }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">상태</th>
                            <td>{{ programStatusDisplay }}</td>
                            <th class="bg-light">프로그램 비고</th>
                            <td>{{ program.remark || '-' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- Institution Details -->
                  <h3 class="fw-bold section-title">교육기관 상세 정보</h3>
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
                            <th class="bg-light">교육기관 ID</th>
                            <td>{{ institution.institutionId }}</td>
                            <th class="bg-light">교육기관명</th>
                            <td>{{ institution.institutionName }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">시</th>
                            <td>{{ institution.city }}</td>
                            <th class="bg-light">구</th>
                            <td>{{ institution.district }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">도로명</th>
                            <td>{{ institution.street }}</td>
                            <th class="bg-light">관리자명</th>
                            <td>{{ institution.managerName }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">전화번호</th>
                            <td>{{ institution.phoneNumber || '-' }}</td>
                            <th class="bg-light">비고</th>
                            <td>{{ institution.remarks || '-' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- Education Chapters and Instructors -->
                  <h3 class="fw-bold section-title">교육 챕터 및 강사</h3>
                  <div class="accordion" id="educationAccordion">
                    <div 
                      class="accordion-item" 
                      v-for="chapter in groupedChapters" 
                      :key="chapter.chapter.educationChapterId"
                    >
                      <h2 class="accordion-header" :id="'heading' + chapter.chapter.educationChapterId">
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          :data-bs-target="'#collapse' + chapter.chapter.educationChapterId"
                          aria-expanded="false"
                          :aria-controls="'collapse' + chapter.chapter.educationChapterId"
                        >
                          <i class="bi bi-journal-bookmark me-2"></i>
                          챕터 {{ chapter.chapter.chapterNumber }} - {{ chapter.chapter.notes }}
                        </button>
                      </h2>
                      <div
                        :id="'collapse' + chapter.chapter.educationChapterId"
                        class="accordion-collapse collapse"
                        :aria-labelledby="'heading' + chapter.chapter.educationChapterId"
                        data-bs-parent="#educationAccordion"
                      >
                        <div class="accordion-body">
                          <!-- Chapter Details -->
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

                          <!-- Instructors Table -->
                          <div class="card">
                            <div class="card-header">
                              <h5 class="card-title mb-0">강사 목록</h5>
                            </div>
                            <div class="card-body p-0">
                              <table class="table table-striped table-hover table-bordered mb-0">
                                <colgroup>
                                  <col style="width: 10%;">
                                  <col style="width: 10%;">
                                  <col style="width: 15%;">
                                  <col style="width: 15%;">
                                  <col style="width: 15%;"> <!-- 전화번호 컬럼 너비 증가 -->
                                  <col style="width: 25%;"> <!-- 소속 컬럼 너비 축소 -->
                                  <col style="width: 10%;"> <!-- 역할 컬럼 너비 유지 -->
                                </colgroup>
                                <thead class="table-light">
                                  <tr>
                                    <th>강사 ID</th>
                                    <th>상태</th>
                                    <th>이름</th>
                                    <th>이메일</th>
                                    <th>전화번호</th>
                                    <th>소속</th>
                                    <th>역할</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="instructor in chapter.instructors" :key="instructor.educationInstructorId">
                                    <td>{{ instructor.educationInstructorId }}</td>
                                    <td>{{ instructorStatusDisplay(instructor.status) }}</td>
                                    <td>{{ instructor.instructor.name }}</td>
                                    <td>{{ instructor.instructor.email || '-' }}</td>
                                    <td>{{ instructor.instructor.phoneNumber || '-' }}</td>
                                    <td>{{ instructor.instructor.affiliation || '-' }}</td>
                                    <td>{{ roleDisplay(instructor.role) }}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

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
            @click="goEdit"
          >
            <span class="indicator-label">
              수정하기
            </span>
            <span class="indicator-progress">
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
  educationInstructorId: number;
  role: string | null;
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
}

interface IApiResponse {
  educationId: number;
  status: string;
  grade: number;
  classNumber: number;
  numberOfStudents: number;
  productQuantity: number; // This will be ignored as per the requirement
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

export default defineComponent({
  name: "ProgramDetail",
  components: {
    // Add any child components here if needed
  },

  setup() {
    const router = useRouter();
    const submitButton = ref<HTMLButtonElement | null>(null);
    
    // Main Education Details
    const educationId = ref<number | null>(null);
    const status = ref<string>('');
    const grade = ref<number>(0);
    const classNumber = ref<number>(0);
    const numberOfStudents = ref<number>(0);
    // Removed productQuantity as per requirement
    const chapterNumber = ref<number>(0);
    const isConfirmed = ref<string>('');
    const remark = ref<string>('');

    // Program Details
    const program = ref<IProgram>({
      programId: 0,
      programName: '',
      chapter: 0,
      product: null,
      status: '',
      level: 0,
      remark: ''
    });

    // Institution Details
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

    // Education Chapters
    const educationChapters = ref<IEducationChapter[]>([]);

    // Education Instructors
    const educationInstructors = ref<IInstructor[]>([]);

    const errorMessage = ref<string>('');

    // Status Mapping for Education Status
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

    // Status Mapping for Program Status
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

    // Status Mapping for Instructor Status
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

    // Function to map status to display text
    const statusDisplay = computed(() => {
      return statusMap[status.value] || status.value;
    });

    const programStatusDisplay = computed(() => {
      return programStatusMap[program.value.status] || program.value.status;
    });

    const isConfirmedDisplay = computed(() => {
      return isConfirmed.value === "Y" ? "예" : "아니오";
    });

    // Function to map instructor role to display text
    const roleDisplay = (role: string | null) => {
      if (role === "MAIN") return "주강사";
      if (role === "ASSISTANT") return "보조강사";
      return "-";
    };

    // Function to map instructor status to display text
    const instructorStatusDisplay = (status: string) => {
      return instructorStatusMap[status] || status;
    };

    // Computed property to group instructors by chapter
    const groupedChapters = computed<IGroupedChapter[]>(() => {
      return educationChapters.value.map(chapter => {
        const instructors = educationInstructors.value.filter(instr => instr.educationChapterId === chapter.educationChapterId);
        return {
          chapter,
          instructors
        };
      });
    });

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

        // Main Education Details
        educationId.value = data.educationId;
        status.value = data.status;
        grade.value = data.grade;
        classNumber.value = data.classNumber;
        numberOfStudents.value = data.numberOfStudents;
        // productQuantity is removed
        chapterNumber.value = data.chapterNumber;
        isConfirmed.value = data.isConfirmed;
        remark.value = data.remark;

        // Program Details
        program.value = data.program;

        // Institution Details
        institution.value = data.institution;

        // Education Chapters
        educationChapters.value = data.educationChapters;

        // Education Instructors
        educationInstructors.value = data.educationInstructors;

      } catch (error) {
        console.error('Error fetching program data:', error);
        errorMessage.value = '프로그램 정보를 불러오는 데 실패했습니다.';
      }
    };

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


    const goEdit = () => {
      router.push({ name: "admin-TeacherAlloPassivityEdit" })
    };

    const goBack = () => {
      router.back();
    };

    onMounted(() => {
      fetchProgramData();
    });

    return {
      educationId,
      status,
      grade,
      classNumber,
      numberOfStudents,
      // productQuantity is removed
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
      instructorStatusDisplay
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
</style>
