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
                          <!-- 챕터 상세 정보 테이블 -->
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

                          <!-- 강사 목록 테이블 -->
                          <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                              <h5 class="card-title mb-0">강사 목록</h5>
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
                                    :class="{'highlight-row': instructor.instructor.userId === currentUserId}"
                                  >
                                    <td>{{ instructor.instructor.userId || '-' }}</td>
                                    <td>{{ instructorStatusDisplay(instructor.status) }}</td>
                                    <td>{{ instructor.instructor.name }}</td>
                                    <td>{{ instructor.instructor.phoneNumber || '-' }}</td>
                                    <td>{{ instructor.instructor.affiliation || '-' }}</td>
                                    <td>
                                      <template v-if="instructor.instructor.userId === currentUserId">
                                        <div class="d-flex align-items-center">
                                          <select v-model="instructor.role" class="form-select form-select-sm">
                                            <option value="MAIN">주강사</option>
                                            <option value="ASSISTANT">보조강사</option>
                                          </select>
                                          <button
                                            @click="assignRole(instructor)"
                                            :disabled="isSubmitting"
                                            class="btn btn-sm btn-primary ms-2"
                                          >
                                            수정
                                          </button>
                                        </div>
                                      </template>
                                      <template v-else>
                                        {{ roleDisplay(instructor.role) }}
                                      </template>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <!-- ... 다른 섹션은 이전과 동일하게 유지 ... -->
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 프로그램 상세 정보 -->
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
                            <th class="bg-light">프로그램명</th>
                            <td>{{ program.programName }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">챕터 수</th>
                            <td>{{ program.chapter }}</td>
                            <th class="bg-light">제품</th>
                            <td>{{ program.product || '-' }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">상태</th>
                            <td>{{ programStatusDisplay }}</td>
                            <th class="bg-light">레벨</th>
                            <td>{{ program.level }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">비고</th>
                            <td colspan="3">{{ program.remark }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- 교육기관 상세 정보 -->
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
                            <th class="bg-light">주소</th>
                            <td colspan="3">{{ institution.city }} {{ institution.district }} {{ institution.street }} {{ institution.number || '' }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">대표 번호</th>
                            <td>{{ institution.representativeNumber || '-' }}</td>
                            <th class="bg-light">담당자 이름</th>
                            <td>{{ institution.managerName }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">담당자 전화번호</th>
                            <td>{{ institution.phoneNumber || '-' }}</td>
                            <th class="bg-light">비고</th>
                            <td>{{ institution.remarks || '-' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- 교육 정보 -->
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
                            <th class="bg-light">교육 ID</th>
                            <td>{{ educationId }}</td>
                            <th class="bg-light">상태</th>
                            <td>{{ statusDisplay }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">학년</th>
                            <td>{{ grade }}</td>
                            <th class="bg-light">반</th>
                            <td>{{ classNumber }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">학생 수</th>
                            <td>{{ numberOfStudents }}</td>
                            <th class="bg-light">제품 수량</th>
                            <td>{{ productQuantity }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">챕터 수</th>
                            <td>{{ chapterNumber }}</td>
                            <th class="bg-light">확인 여부</th>
                            <td>{{ isConfirmedDisplay }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">비고</th>
                            <td colspan="3">{{ remark || '-' }}</td>
                          </tr>
                        </tbody>
                      </table>
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
            class="btn btn-light btn-active-light-primary me-2"
            @click="goBack"
          >
            뒤로가기
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
  educationInstructorId: number | null;
  tempId?: number;
  role: string | null;
  originalRole?: string | null;
  userId: number;
  originalUserId?: number | null;
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
  searchText?: string;
  showSuggestions?: boolean;
  suggestions?: InstructorCompact[];
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
    const productQuantity = ref<number>(0);
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
      "CLOSE": "강의 마감",
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

    // 현재 사용자 ID 가져오기
    const currentUserId = ref<number | null>(null);
    onMounted(() => {
      const userData = localStorage.getItem('user');
      const currentUser = userData ? JSON.parse(userData) : null;
      currentUserId.value = currentUser ? currentUser.id : null;

      fetchProgramData();
    });

    const fetchProgramData = async () => {
      const programId = localStorage.getItem('selectedProgramId');
      if (!programId) {
        errorMessage.value = '프로그램 ID를 찾을 수 없습니다.';
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<IApiResponse>(ApiUrl(`/api/v1/user/education/pending-assign/detail/${programId}`), {
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
        productQuantity.value = data.productQuantity;
        chapterNumber.value = data.chapterNumber;
        isConfirmed.value = data.isConfirmed;
        remark.value = data.remark;

        program.value = data.program;
        institution.value = data.institution;
        educationChapters.value = data.educationChapters;
        educationInstructors.value = data.educationInstructors.map(instr => ({
          ...instr,
          userId: instr.instructor.userId,
          educationChapterId: instr.educationChapterId,
          role: instr.role,
          status: instr.status,
          instructor: instr.instructor,
        }));

      } catch (error) {
        console.error('Error fetching program data:', error);
        errorMessage.value = '프로그램 정보를 불러오는 데 실패했습니다.';
      }
    };

    const isSubmitting = ref(false);

    const goBack = () => {
      router.back();
    };

    // 역할 지정 함수 추가
    const assignRole = async (instructor: IInstructor) => {
      if (isSubmitting.value) return;
      isSubmitting.value = true;

      try {
        const token = localStorage.getItem("token");
        const apiUrl = ApiUrl('/api/v1/user/education/pending-assign/assign');
        const payload = {
          chapterId: instructor.educationChapterId,
          userId: currentUserId.value,
          role: instructor.role,
        };

        // 콘솔에 API URL과 전송되는 데이터 출력
        console.log('API URL:', apiUrl);
        console.log('Payload:', payload);

        await axios.post(apiUrl, payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // 성공 메시지 표시
        Swal.fire('성공', '역할이 성공적으로 지정되었습니다.', 'success');

      } catch (error) {
        console.error('Error assigning role:', error);
        errorMessage.value = '역할 지정에 실패했습니다.';
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      educationId,
      status,
      grade,
      classNumber,
      numberOfStudents,
      productQuantity,
      chapterNumber,
      isConfirmed,
      remark,
      program,
      institution,
      educationChapters,
      educationInstructors,
      groupedChapters,
      submitButton,
      goBack,
      errorMessage,
      statusDisplay,
      programStatusDisplay,
      isConfirmedDisplay,
      roleDisplay,
      instructorStatusDisplay,
      isSubmitting,
      currentUserId,
      assignRole, // 추가된 함수
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

/* 현재 사용자와 일치하는 강사 행에 대한 스타일 */
.highlight-row {
  background-color: #fff3cd !important; /* 노란색 배경 */
  font-weight: 700;
  font-size: 15px;
}
</style>
