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
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      교육기관명
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="institutionName"
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        placeholder="교육기관명을 입력하세요"
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
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
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
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
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
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-control form-control-lg form-control-solid" 
                        type="number"
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
        errorMessage.value = '프로그램 정보를 불러오는 데 실패했습니다.';
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
            text: "프로그램이 성공적으로 삭제되었습니다.",
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


    // 프로그램 업데이트를 위한 PUT 요청 함수
    const fetchData = async () => {
      const programId = localStorage.getItem('selectedProgramId'); // 로컬스토리지에서 ID 가져오기

      // 입력값 검증
      if (!institutionName.value) {
        errorMessage.value = "교육기관명을 입력하세요.";
        return;
      }
      // if (!product.value) {
      //   errorMessage.value = "교구명을 입력하세요.";
      //   return;
      // }
      // if (!chapter.value) {
      //   errorMessage.value = "총 차시(챕터)를 입력하세요.";
      //   return;
      // }
      errorMessage.value = ''; // 입력이 있으면 에러 메시지 초기화

      if (submitButton.value) {
        submitButton.value.disabled = true;
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }

      try {
        const token = localStorage.getItem("token");
        // PUT 요청으로 프로그램 업데이트
        const response = await axios.put(ApiUrl(`/api/v1/admin/institutions/${programId}`),
        JSON.stringify({
            institutionName: institutionName.value,
            region: region.value,
            address: address.value,
            phoneNumber: phoneNumber.value
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
      institutionName,
      region,
      address, // 챕터 상태 리턴
      phoneNumber,
      submitButton,
      fetchData,
      deleteData,
      goBack,
      errorMessage, // 에러 메시지 상태 리턴
    };
  },
});

</script>
