<template>
  <div class="d-flex flex-column flex-xl-row">
    <div class="flex-column flex-lg-row-auto w-100 mb-10">
      <div class="card mb-5 mb-xl-8">
        <div class="card-body">
          <!-- Education Details -->
          <div class="card mb-5 mb-xl-10">
            <div
              class="card-header border-0 cursor-pointer"
              role="button"
              data-bs-toggle="collapse"
              data-bs-target="#kt_account_education_details"
              aria-expanded="true"
              aria-controls="kt_account_education_details"
            >
              <div class="card-title m-0 d-flex align-items-center">
                <i class="bi bi-info-circle me-2"></i>
                <h2 class="fw-bold m-0">교육 조회</h2>
              </div>
            </div>

            <div id="kt_account_education_details" class="collapse show">
              <div class="card-body border-top p-9">
                <div v-if="educationData">
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
                            <th class="bg-light">교육 ID</th>
                            <td>{{ educationData.educationId }}</td>
                            <th class="bg-light">상태</th>
                            <td>{{ educationData.status }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">학년</th>
                            <td>{{ educationData.grade }}</td>
                            <th class="bg-light">반 번호</th>
                            <td>{{ educationData.classNumber }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">학생 수</th>
                            <td>{{ educationData.numberOfStudents }}</td>
                            <th class="bg-light">챕터 수</th>
                            <td>{{ educationData.chapterNumber }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">확정 여부</th>
                            <td>{{ educationData.isConfirmed }}</td>
                            <th class="bg-light">메모</th>
                            <td>{{ educationData.remark || '-' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- Program Details -->
                  <h3 class="fw-bold section-title">프로그램 정보</h3>
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
                            <td>{{ educationData.program.programId }}</td>
                            <th class="bg-light">프로그램명</th>
                            <td>{{ educationData.program.programName }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">챕터</th>
                            <td>{{ educationData.program.chapter }}</td>
                            <th class="bg-light">제품</th>
                            <td>{{ educationData.program.product || '-' }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">상태</th>
                            <td>{{ educationData.program.status }}</td>
                            <th class="bg-light">난이도</th>
                            <td>{{ educationData.program.level }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">메모</th>
                            <td colspan="3">{{ educationData.program.remark || '-' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- Institution Details -->
                  <h3 class="fw-bold section-title">기관 정보</h3>
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
                            <th class="bg-light">기관 ID</th>
                            <td>{{ educationData.institution.institutionId }}</td>
                            <th class="bg-light">기관명</th>
                            <td>{{ educationData.institution.institutionName }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">도시</th>
                            <td>{{ educationData.institution.city }}</td>
                            <th class="bg-light">구/군</th>
                            <td>{{ educationData.institution.district }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">도로명 주소</th>
                            <td>{{ educationData.institution.street }}</td>
                            <th class="bg-light">담당자명</th>
                            <td>{{ educationData.institution.managerName }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">연락처</th>
                            <td>{{ educationData.institution.phoneNumber || '-' }}</td>
                            <th class="bg-light">비고</th>
                            <td>{{ educationData.institution.remarks || '-' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- Education Chapters -->
                  <h3 class="fw-bold section-title">교육 챕터 정보</h3>
                  <div class="accordion" id="educationAccordion">
                    <div
                      class="accordion-item"
                      v-for="chapter in educationData.educationChapters"
                      :key="chapter.educationChapterId"
                    >
                      <h2 class="accordion-header" :id="'heading' + chapter.educationChapterId">
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          :data-bs-target="'#collapse' + chapter.educationChapterId"
                          aria-expanded="false"
                          :aria-controls="'collapse' + chapter.educationChapterId"
                        >
                          <i class="bi bi-journal-bookmark me-2"></i>
                          챕터 {{ chapter.chapterNumber }} - {{ chapter.notes || '-' }}
                        </button>
                      </h2>
                      <div
                        :id="'collapse' + chapter.educationChapterId"
                        class="accordion-collapse collapse"
                        :aria-labelledby="'heading' + chapter.educationChapterId"
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
                                    <th class="bg-light">챕터 번호</th>
                                    <td>{{ chapter.chapterNumber }}</td>
                                    <th class="bg-light">주 강사 수</th>
                                    <td>{{ chapter.mainInstructorsNumber }}</td>
                                  </tr>
                                  <tr>
                                    <th class="bg-light">보조 강사 수</th>
                                    <td>{{ chapter.assistantInstructorsNumber }}</td>
                                    <th class="bg-light">날짜</th>
                                    <td>{{ chapter.date }}</td>
                                  </tr>
                                  <tr>
                                    <th class="bg-light">시작 시간</th>
                                    <td>{{ chapter.startTime }}</td>
                                    <th class="bg-light">종료 시간</th>
                                    <td>{{ chapter.endTime }}</td>
                                  </tr>
                                  <tr>
                                    <th class="bg-light">노트</th>
                                    <td colspan="3">{{ chapter.notes || '-' }}</td>
                                  </tr>
                                  <tr>
                                    <th class="bg-light">확정 여부</th>
                                    <td>{{ chapter.isConfirmed || '-' }}</td>
                                    <th class="bg-light"></th>
                                    <td></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
                <div v-else>
                  <p>데이터를 불러오는 중입니다...</p>
                </div>

                <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-end py-6 px-9">
          <!-- <button
            type="button"
            class="btn btn-left btn-active-left-primary me-2"
            style="margin-right: auto !important; background-color: red; color: white;"
            @click="deleteData()"
          >
            삭제
          </button> -->
          <button
            type="button"
            class="btn btn-light btn-active-light-primary me-2"
            @click="goBack"
          >
            뒤로
          </button>
          <!-- <button
            v-if="educationData"
            type="button"
            class="btn btn-primary me-2"
            @click="toggleApplication"
          >
            {{ educationData.isConfirmed === 'N' ? '신청하기' : '취소하기' }}
          </button> -->
          <!-- <button
            type="submit"
            id="kt_account_detaiprofile_details_submit"
            ref="submitButton1"
            class="btn btn-primary"
            @click="goEdit()"
          >
            <span class="indicator-label">
              수정
            </span>
            <span class="indicator-progress">
              잠시만 기다려주세요...
              <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          </button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, ref, onMounted } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useRouter } from "vue-router";
import { ApiUrl } from "@/assets/ts/_utils/api";

interface Program {
  programId: number;
  programName: string;
  chapter: number;
  product: string | null;
  status: string;
  level: number;
  remark: string | null;
}

interface Institution {
  institutionId: number;
  institutionName: string;
  city: string;
  district: string;
  street: string;
  number: string | null;
  representativeNumber: string | null;
  managerName: string;
  phoneNumber: string;
  remarks: string;
}

interface EducationChapter {
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

interface EducationData {
  educationId: number;
  status: string;
  grade: number;
  classNumber: number;
  numberOfStudents: number;
  productQuantity: number;
  chapterNumber: number;
  isConfirmed: string;
  remark: string;
  program: Program;
  institution: Institution;
  educationChapters: EducationChapter[];
  educationInstructors: any; // 타입을 알고 있다면 명시해주세요
}

export default defineComponent({
  name: "EducationDetail",
  setup() {
    const router = useRouter();
    const submitButton = ref<HTMLButtonElement | null>(null);
    const educationData = ref<EducationData | null>(null);
    const errorMessage = ref('');

    const fetchEducationData = async () => {
      const educationId = localStorage.getItem('selectedProgramId');
      if (!educationId) {
        errorMessage.value = '교육 ID를 찾을 수 없습니다.';
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(ApiUrl(`/api/v1/user/education/ready/${educationId}`), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        educationData.value = response.data;
      } catch (error) {
        console.error('Error fetching education data:', error);
        errorMessage.value = '교육 정보를 불러오는 데 실패했습니다.';
      }
    };
    const toggleApplication = async () => {
      if (!educationData.value) {
        return;
      }

      const educationId = educationData.value.educationId;
      const isConfirmed = educationData.value.isConfirmed;

      const goal = isConfirmed === 'N' ? 'UPDATA' : 'DELETE';
      const payload = {
        educationIds: [educationId],
        goal: goal
      };

      try {
        const token = localStorage.getItem("token");
        await axios.put(ApiUrl(`/api/v1/user/education`), payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        // isConfirmed 값을 업데이트
        educationData.value.isConfirmed = isConfirmed === 'N' ? 'Y' : 'N';

        Swal.fire({
          text: isConfirmed === 'N' ? '신청이 완료되었습니다.' : '취소가 완료되었습니다.',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: '확인',
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semibold btn-light-primary",
          },
        });

      } catch (error) {
        console.error('Error toggling application:', error);
        Swal.fire({
          text: '오류가 발생하였습니다.',
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: '확인',
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semibold btn-light-danger",
          },
        });
      }
    };
    const deleteData = async () => {
      const educationId = localStorage.getItem('selectedProgramId');

      const result = await Swal.fire({
        title: "삭제하시겠습니까?",
        text: "삭제된 교육은 복구할 수 없습니다.",
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
          await axios.delete(ApiUrl(`/api/v1/user/education/ready/${educationId}`), {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          Swal.fire({
            text: "교육이 성공적으로 삭제되었습니다.",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "확인",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semibold btn-light-primary",
            },
          }).then(() => {
            router.push({ name: "EducationList" });
          });

        } catch (error: unknown) {
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
        }
      }
    };

    const goEdit = () => {
      router.push({ name: "EducationEdit" });
    };

    onMounted(() => {
      fetchEducationData();
    });

    const goBack = () => {
      router.back();
    };

    return {
      educationData,
      submitButton,
      goEdit,
      deleteData,
      goBack,
      errorMessage,
      toggleApplication,
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

.table th,
.table td {
  vertical-align: middle;
}

.table th {
  font-weight: 600;
  background-color: #f8f9fa;
}

.table-bordered th,
.table-bordered td {
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

.bi-info-circle,
.bi-journal-bookmark {
  font-size: 1.2rem;
}

@media (max-width: 575.98px) {
  .row .col-md-6,
  .row .col-md-4,
  .row .col-md-12 {
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

.accordion-button.collapsed:hover,
.accordion-button:hover {
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

.table td,
.table th {
  padding: 0.75rem;
}

.card-body {
  padding: 1rem;
}
</style>
