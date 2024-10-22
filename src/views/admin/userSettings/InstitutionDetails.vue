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
                <h2 class="fw-bold m-0">교육기관 조회</h2>
              </div>
            </div>

            <div id="kt_account_toturprofile_details" class="collapse show">
              <VForm
                  id="kt_account_toturprofile_details_form"
                  class="form"
                  novalidate
              >
                <div class="card-body border-top p-9">
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      ID
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="id"
                        style="font-weight: bold; font-size: 16px; float: left; background: rgb(191, 191, 191);"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        placeholder="프로그램명을 입력하세요"
                        disabled
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="id"/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      교육기관명
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="institutionName"
                        style="font-weight: bold; font-size: 16px; float: left; background: rgb(191, 191, 191);"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        placeholder="/"
                        disabled
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="institutionName"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      지역
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="region"
                        style="font-weight: bold; font-size: 16px; float: left; background: rgb(191, 191, 191);"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        placeholder="/"
                        disabled
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="region"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      주소
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="address"
                        style="font-weight: bold; font-size: 16px; float: left; background: rgb(191, 191, 191);"
                        class="form-control form-control-lg form-control-solid" 
                        type="number"
                        placeholder="/"
                        disabled
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="address"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      번호
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="phoneNumber"
                        style="font-weight: bold; font-size: 16px; float: left; background: rgb(191, 191, 191);"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        placeholder="/"
                        disabled
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="phoneNumber"/>
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
            뒤로가기
          </button>
          <button
              type="submit"
              id="kt_account_detaiprofile_details_submit"
              ref="submitButton1"
              class="btn btn-primary"
              @click="goEdit()"
             >
            <span class="indicator-label">
              수정하기
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
    const id = ref(''); // 프로그램명 입력 필드 상태
    const institutionName = ref(''); // 프로그램명 입력 필드 상태
    const region = ref(''); // 프로그램명 입력 필드 상태
    const address = ref(''); // 프로그램명 입력 필드 상태
    const phoneNumber = ref<number | null>(null); // 챕터 입력 필드 상태
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
        const response = await axios.get(ApiUrl(`/api/v1/admin/institutions/${programId}`), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const institutionsData = response.data;
        
        // 프로그램명과 챕터 값을 인풋 필드에 반영
        id.value = institutionsData.id;
        institutionName.value = institutionsData.institutionName;
        region.value = institutionsData.region;
        address.value = institutionsData.address;
        phoneNumber.value = institutionsData.phoneNumber;

        
      } catch (error) {
        console.error('Error fetching program data:', error);
        errorMessage.value = '교육기관 정보를 불러오는 데 실패했습니다.';
      }
    };
    
    const deleteData = async () => {
      const programId = localStorage.getItem('selectedProgramId');

      // 삭제 확인 프롬프트
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

      // 확인을 눌렀을 때만 삭제 실행
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.delete(ApiUrl(`/api/v1/admin/institutions/${programId}`), {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          Swal.fire({
            text: "교육기관 정보가 성공적으로 삭제되었습니다.",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "확인",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semibold btn-light-primary",
            },
          }).then(() => {
            router.push({ name: "admin-EducationalList" });
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
        } finally {
          if (submitButton.value) {
            submitButton.value.removeAttribute("data-kt-indicator");
            submitButton.value.disabled = false;
          }
        }
      }
    };

    const goEdit = () => {
      router.push({ name: "admin-EducationalEdit" })
    };

    onMounted(() => {
      fetchProgramData();
    });

    const goBack = () => {
      router.back();
    };

    return {
      id,
      institutionName,
      region,
      address,
      submitButton,
      phoneNumber,
      goEdit,
      deleteData,
      goBack,
      errorMessage,
    };
  },
});

</script>
