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
                <h2 class="fw-bold m-0">출강교육 상세보기</h2>
              </div>
            </div>

            <div id="kt_account_toturprofile_details" class="collapse show">
              <VForm
                  id="kt_account_toturprofile_details_form"
                  class="form"
                  novalidate
              >
                <div class="card-body border-top p-9">
                  
                  <!-- ID 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      ID
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="id"
                        style="font-weight: bold; font-size: 16px; float: left; background: rgb(240, 240, 240);"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        disabled
                      />
                    </div>
                  </div>

                  <!-- 프로그램명 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      프로그램명
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="programName"
                        style="font-weight: bold; font-size: 16px; float: left; background: rgb(240, 240, 240);"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        disabled
                      />
                    </div>
                  </div>

                  <!-- 총 차시 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      총 차시 (챕터)
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="chapterNumber"
                        style="font-weight: bold; font-size: 16px; float: left; background: rgb(240, 240, 240);"
                        class="form-control form-control-lg form-control-solid" 
                        type="number"
                        disabled
                      />
                    </div>
                  </div>

                  <!-- 교육기관명 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      교육기관명
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="institutionName"
                        style="font-weight: bold; font-size: 16px; float: left; background: rgb(240, 240, 240);"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        disabled
                      />
                    </div>
                  </div>

                  <!-- 학년 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      학년
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="grade"
                        style="font-weight: bold; font-size: 16px; float: left; background: rgb(240, 240, 240);"
                        class="form-control form-control-lg form-control-solid" 
                        type="number"
                        disabled
                      />
                    </div>
                  </div>

                  <!-- 반 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      반
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="classNumber"
                        style="font-weight: bold; font-size: 16px; float: left; background: rgb(240, 240, 240);"
                        class="form-control form-control-lg form-control-solid" 
                        type="number"
                        disabled
                      />
                    </div>
                  </div>

                  <!-- 학생 수 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      학생 수
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="numberOfStudents"
                        style="font-weight: bold; font-size: 16px; float: left; background: rgb(240, 240, 240);"
                        class="form-control form-control-lg form-control-solid" 
                        type="number"
                        disabled
                      />
                    </div>
                  </div>

                  <!-- 날짜 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      날짜
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="date"
                        style="font-weight: bold; font-size: 16px; float: left; background: rgb(240, 240, 240);"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        disabled
                      />
                    </div>
                  </div>
                  
                  <!-- Remark 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      메모
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="remark"
                        style="font-weight: bold; font-size: 16px; float: left; background: rgb(240, 240, 240);"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        disabled
                      />
                    </div>
                  </div>
                  <h3 class="fw-bold mt-10 mb-5">교육 차시 상세</h3>
                  <div class="row">
                    <div
                      v-for="(chapter, index) in educationChapters"
                      :key="index"
                      class="col-md-4 mb-4"
                    >
                      <div class="card h-100">
                        <div
                          class="card-header p-0"
                          role="button"
                          data-bs-toggle="collapse"
                          :data-bs-target="'#chapterContent' + index"
                          aria-expanded="false"
                          :aria-controls="'chapterContent' + index"
                        >
                          <h5 class="card-title m-0 p-3">
                            {{ chapter.chapterNumber }}차시 상세보기
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
                                type="text"
                                disabled
                              />
                            </div>

                            <div class="mb-3">
                              <label class="form-label fw-semibold">
                                시작 시간
                              </label>
                              <input 
                                v-model="chapter.startTime"
                                class="form-control form-control-solid" 
                                type="text"
                                disabled
                              />
                            </div>

                            <div class="mb-3">
                              <label class="form-label fw-semibold">
                                종료 시간
                              </label>
                              <input 
                                v-model="chapter.endTime"
                                class="form-control form-control-solid" 
                                type="text"
                                disabled
                              />
                            </div>

                            <div class="mb-3">
                              <label class="form-label fw-semibold">
                                설명
                              </label>
                              <textarea
                                v-model="chapter.notes"
                                class="form-control form-control-solid"
                                rows="3"
                                disabled>
                              </textarea>
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
              @click="deleteData()"
              >
            삭제
          </button>
          <button
              type="button"
              class="btn btn-light btn-active-light-primary me-2"
              @click="goBack"
              >
            뒤로
          </button>
          <button
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
              <span class="spinner-border spinner-border-sm align-middle ms-2">
              </span>
            </span>
          </button>
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
interface EducationChapter {
  chapterNumber: number;
  mainInstructorsNumber: number | null;
  assistantInstructorsNumber: number | null;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
}
export default defineComponent({
  name: "sign-in",
  setup() {
    const router = useRouter();
    const submitButton = ref<HTMLButtonElement | null>(null);
    const id = ref('');
    const programName = ref('');
    const institutionName = ref('');
    const chapterNumber = ref<number | null>(null);
    const grade = ref<number | null>(null);
    const classNumber = ref<number | null>(null);
    const numberOfStudents = ref<number | null>(null);
    const date = ref<number | null>(null);
      const educationChapters = ref<EducationChapter[]>([]);
      
    const remark = ref('');
    const errorMessage = ref('');

    const fetchProgramData = async () => {
      const programId = localStorage.getItem('selectedProgramId');
      if (!programId) {
        errorMessage.value = '프로그램 ID를 찾을 수 없습니다.';
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(ApiUrl(`/api/v1/admin/apply-for-programs/${programId}`), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const programData = response.data;
        
        id.value = programData.id;
        programName.value = programData.programName;
        institutionName.value = programData.institutionName;
        chapterNumber.value = programData.chapterNumber;
        grade.value = programData.grade;
        classNumber.value = programData.classNumber;
        numberOfStudents.value = programData.numberOfStudents;
        date.value = programData.date;
        remark.value = programData.remark;
        educationChapters.value = programData.educationChapters;
      } catch (error) {
        console.error('Error fetching program data:', error);
        errorMessage.value = '프로그램 정보를 불러오는 데 실패했습니다.';
      }
    };

    const deleteData = async () => {
      const programId = localStorage.getItem('selectedProgramId');

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
          await axios.delete(ApiUrl(`/api/v1/admin/programs/${programId}`), {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          Swal.fire({
            text: "프로그램이 성공적으로 삭제되었습니다.",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "확인",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semibold btn-light-primary",
            },
          }).then(() => {
            router.push({ name: "admin-ProgramEdit" });
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
    const chapterStates = ref<Record<number, boolean>>({});

    const isChapterOpen = (index: number) => {
      return chapterStates.value[index] || false;
    };

    const toggleChapter = (index: number) => {
      chapterStates.value[index] = !chapterStates.value[index];
    };

    const goEdit = () => {
      router.push({ name: "admin-ProgramEdit" })
    };

    onMounted(() => {
      fetchProgramData();
    });

    const goBack = () => {
      router.back();
    };

    return {
      id,
      programName,
      institutionName,
      chapterNumber,
      grade, 
      classNumber,
      numberOfStudents,
      date,
      remark,
      submitButton,
      goEdit,
      deleteData,
      goBack,
      errorMessage,
      educationChapters, // Return educationChapters
      isChapterOpen,
      toggleChapter,
    };
  },
});
</script>

