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
                <h2 class="fw-bold m-0">프로그램 등록</h2>
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
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="programName"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 총 차시 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      총 차시
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="chapter"
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-control form-control-lg form-control-solid" 
                        type="number"
                        placeholder="총 차시를 입력하세요"
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="chapter"/>
                        </div>
                      </div>
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
                        <option disabled value="">상태를 선택하세요</option>
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
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="product"/>
                        </div>
                      </div>
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
                        placeholder="메모를 입력하세요"
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="remark"/>
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
    const programName = ref(''); 
    const chapter = ref<number | null>(null);
    const product = ref('');
    const level = ref<number | null>(null);
    const status = ref('');
    const remark = ref('');
    const errorMessage = ref('');

    const fetchData = async () => {
      if (!programName.value) {
        errorMessage.value = "프로그램명을 입력하세요.";
        return;
      }

      errorMessage.value = '';

      if (submitButton.value) {
        submitButton.value.disabled = true;
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(ApiUrl('/api/v1/admin/programs'),
        JSON.stringify({
            "programName": programName.value,
            "chapter": chapter.value,
            "productSn": product.value,
            "level": level.value,
            "status": status.value,
            "remark": remark.value
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
          router.push({ name: "admin-ProgramList" });
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
      programName,
      chapter,
      product,
      level,
      status,
      remark,
      submitButton,
      fetchData,
      goBack,
      errorMessage,
    };
  },
});
</script>

