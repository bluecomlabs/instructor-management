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
                <h2 class="fw-bold m-0">교육기관 등록</h2>
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
                      번호 (-제외)
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
              등록
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
import { defineComponent, ref } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useRouter } from "vue-router";
import { ApiUrl } from "@/assets/ts/_utils/api";

export default defineComponent({
  name: "sign-in",
  setup() {
    const router = useRouter();
    const submitButton = ref<HTMLButtonElement | null>(null);
    const institutionName = ref('');
    const region = ref('');
    const address = ref('');
    const phoneNumber = ref<number | null>(null);
    const errorMessage = ref('');

    const fetchData = async () => {
      if (!institutionName.value) {
        errorMessage.value = "교육기관명을 입력하세요.";
        return;
      }
      if (!region.value) {
        errorMessage.value = "지역을 입력하세요.";
        return;
      }
      if (!address.value) {
        errorMessage.value = "주소를 입력하세요.";
        return;
      }
      if (!phoneNumber.value) {
        errorMessage.value = "번호를 입력하세요(-제외).";
        return;
      }
      
      errorMessage.value = '';

      if (submitButton.value) {
        submitButton.value.disabled = true;
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(ApiUrl('/api/v1/admin/institutions'),
        JSON.stringify({
            "institutionName": institutionName.value,
            "region": region.value,
            "address": address.value,
            "phoneNumber": phoneNumber.value,
        }),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log(response);

        Swal.fire({
          text: "프로그램이 성공적으로 등록되었습니다.",
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
          text: "프로그램 등록에 실패했습니다.",
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

    const goBack = () => {
      router.back();
    };

    return {
      institutionName,
      region,
      address,
      submitButton,
      phoneNumber,
      fetchData,
      goBack,
      errorMessage,
    };
  },
});
</script>
