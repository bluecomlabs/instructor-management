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
                <h2 class="fw-bold m-0">프로그램 수정</h2>
              </div>
            </div>

            <div id="kt_account_toturprofile_details" class="collapse show">
              <VForm
                  id="kt_account_toturprofile_details_form"
                  class="form"
                  novalidate
              >
                <div class="card-body border-top p-9">
                  
                  <!-- 프로그램명 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label required fw-semibold fs-6">
                      프로그램명
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="programName"
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        placeholder="프로그램명을 입력하세요"
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
                        v-model="chapter"
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-control form-control-lg form-control-solid" 
                        type="number"
                        placeholder="총 차시를 입력하세요"
                      />
                    </div>
                  </div>

                  <!-- Level 드롭다운 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      난이도
                    </label>
                    <div class="col-lg-8 fv-row">
                      <select 
                        v-model="level"
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-select form-select-lg form-select-solid"
                      >
                        <option disabled value="">난이도를 선택하세요</option>
                        <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                      </select>
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="level"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 상태 드롭다운 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      상태
                    </label>
                    <div class="col-lg-8 fv-row">
                      <select 
                        v-model="status"
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-select form-select-lg form-select-solid"
                      >
                        <option value="">상태를 선택하세요</option>
                        <option value="OPEN">OPEN</option>
                        <option value="CLOSE">CLOSE</option>
                      </select>
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="status"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 교구 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      교구
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="product"
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        placeholder="/"
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
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        placeholder="비고를 입력하세요"
                      />
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
            취소
          </button>
          <button
              type="submit"
              id="kt_account_detaiprofile_details_submit"
              ref="submitButton1"
              class="btn btn-primary"
              @click="fetchData()"
             >
            <span class="indicator-label">
              수정
            </span>
            <span class="indicator-progress">
              잠시만 기다려주세요...
              <span
                  class="spinner-border spinner-border-sm align-middle ms-2">
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

export default defineComponent({
  name: "sign-in",
  setup() {
    const router = useRouter();
    const submitButton = ref<HTMLButtonElement | null>(null);
    const programName = ref(''); // 프로그램명 입력 필드 상태
    const product = ref(''); // 프로그램명 입력 필드 상태
    const chapter = ref<number | null>(null); // 챕터 입력 필드 상태
    const level = ref<number | null>(null); // level 입력 필드 상태 추가
    const status = ref(''); // status 상태 추가
    const remark = ref(''); // remark 입력 필드 상태 추가
    const errorMessage = ref(''); // 에러 메시지 상태

    // API 응답으로 프로그램 데이터를 가져오는 함수
    const fetchProgramData = async () => {
      const programId = localStorage.getItem('selectedProgramId'); // 로컬스토리지에서 ID 가져오기
      if (!programId) {
        errorMessage.value = '프로그램 ID를 찾을 수 없습니다.';
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(ApiUrl(`/api/v1/admin/programs/${programId}`), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const programData = response.data;

        // 프로그램명과 챕터, level, remark 값을 인풋 필드에 반영
        programName.value = programData.programName;
        product.value = programData.product;
        chapter.value = programData.chapter;
        level.value = programData.level; // level 값 반영
        status.value =  programData.status; // status 상태 추가
        remark.value = programData.remark; // remark 값 반영
      } catch (error) {
        console.error('Error fetching program data:', error);
        errorMessage.value = '프로그램 정보를 불러오는 데 실패했습니다.';
      }
    };

    // 프로그램 업데이트를 위한 PUT 요청 함수
    const fetchData = async () => {
      const programId = localStorage.getItem('selectedProgramId'); // 로컬스토리지에서 ID 가져오기

      // 입력값 검증
      if (!programName.value) {
        errorMessage.value = "프로그램명을 입력하세요.";
        return;
      }
      
      errorMessage.value = ''; // 입력이 있으면 에러 메시지 초기화

      if (submitButton.value) {
        submitButton.value.disabled = true;
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(ApiUrl(`/api/v1/admin/programs/${programId}`),
        JSON.stringify({
            programName: programName.value,
            productSn: product.value,
            chapter: chapter.value,
            level: level.value,
            status: status.value,
            remark: remark.value
        }),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        Swal.fire({
          text: "프로그램이 성공적으로 업데이트되었습니다.",
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
        Swal.fire({
          text: "프로그램 업데이트에 실패했습니다.",
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
    };

    // 컴포넌트가 마운트될 때 프로그램 데이터를 불러오기
    onMounted(() => {
      fetchProgramData();
    });

    const goBack = () => {
      router.back(); // 뒤로가기 함수
    };

    return {
      programName,
      product,
      chapter,
      level, // level 상태 리턴
      remark, // remark 상태 리턴
      status,
      submitButton,
      fetchData,
      goBack,
      errorMessage, // 에러 메시지 상태 리턴
    };
  },
});
</script>

