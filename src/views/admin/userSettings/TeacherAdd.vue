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
                <h2 class="fw-bold m-0">사용자 등록</h2>
              </div>
            </div>

            <div id="kt_account_toturprofile_details" class="collapse show">
              <VForm
                id="kt_account_toturprofile_details_form"
                class="form"
                novalidate
              >
                <div class="card-body border-top p-9">
                  <!-- 사용자명 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label required fw-semibold fs-6">
                      사용자명
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="username"
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        placeholder="사용자명을 입력하세요"
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="username"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 비밀번호 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label required fw-semibold fs-6">
                      비밀번호
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="password"
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-control form-control-lg form-control-solid" 
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="password"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 이름 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label required fw-semibold fs-6">
                      이름
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="name"
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        placeholder="이름을 입력하세요"
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="name"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 이메일 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label required fw-semibold fs-6">
                      이메일
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="email"
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-control form-control-lg form-control-solid" 
                        type="email"
                        placeholder="이메일을 입력하세요"
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="email"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 성별 드롭다운 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label required fw-semibold fs-6">
                      성별
                    </label>
                    <div class="col-lg-8 fv-row">
                      <select 
                        v-model="gender"
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-select form-select-lg form-select-solid"
                      >
                        <option disabled value="">성별을 선택하세요</option>
                        <option value="M">남</option>
                        <option value="F">여</option>
                      </select>
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="gender"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 소속 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label required fw-semibold fs-6">
                      소속
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="affiliation"
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        placeholder="소속을 입력하세요"
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="affiliation"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 상태 드롭다운 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label required fw-semibold fs-6">
                      상태
                    </label>
                    <div class="col-lg-8 fv-row">
                      <select 
                        v-model="status"
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-select form-select-lg form-select-solid"
                      >
                        <option disabled value="">상태를 선택하세요</option>
                        <option value="Y">활성</option>
                        <option value="N">비활성</option>
                      </select>
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="status"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- roles (고정 값) -->
                  <div class="row mb-6" style="display: none;">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6">
                      역할
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="roles"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        readonly
                      />
                    </div>
                  </div>

                  <!-- 에러 메시지 표시 -->
                  <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
                </div>
              </VForm>
            </div>
          </div>
        </div>
        <!-- 폼 제출 버튼 -->
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
import { defineComponent, ref } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useRouter } from "vue-router";
import { ApiUrl } from "@/assets/ts/_utils/api";

export default defineComponent({
  name: "UserRegister",
  setup() {
    const router = useRouter();
    const submitButton = ref<HTMLButtonElement | null>(null);
    const username = ref('');
    const password = ref('');
    const name = ref('');
    const email = ref('');
    const gender = ref('');
    const affiliation = ref('');
    const status = ref('');
    const roles = ref('USER');
    const errorMessage = ref('');

    const fetchData = async () => {
      if (!username.value) {
        errorMessage.value = "사용자명을 입력하세요.";
        return;
      }
      if (!password.value) {
        errorMessage.value = "비밀번호를 입력하세요.";
        return;
      }
      if (!name.value) {
        errorMessage.value = "이름을 입력하세요.";
        return;
      }
      if (!email.value) {
        errorMessage.value = "이메일을 입력하세요.";
        return;
      }
      if (!gender.value) {
        errorMessage.value = "성별을 선택하세요.";
        return;
      }
      if (!affiliation.value) {
        errorMessage.value = "소속을 입력하세요.";
        return;
      }
      if (!status.value) {
        errorMessage.value = "상태를 선택하세요.";
        return;
      }

      errorMessage.value = '';

      if (submitButton.value) {
        submitButton.value.disabled = true;
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }

      try {
        const token = localStorage.getItem("token");
        const apiUrl = ApiUrl('/api/v1/join');

        const requestBody = {
          username: username.value,
          password: password.value,
          name: name.value,
          email: email.value,
          gender: gender.value,
          affiliation: affiliation.value,
          status: status.value,
          roles: roles.value,
        };

        console.log("API 호출 URL:", apiUrl);
        console.log("요청 바디:", requestBody);

        const response = await axios.post(
          apiUrl,
          requestBody,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log("API 응답:", response);

        Swal.fire({
          text: "사용자가 성공적으로 등록되었습니다.",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "확인",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semibold btn-light-primary",
          },
        }).then(() => {
          router.push({ name: "admin-TeacherList" });
        });

      } catch (error: any) {
        console.error("사용자 등록 오류:", error);
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage.value = error.response.data.message;
        } else {
          errorMessage.value = "사용자 등록에 실패했습니다.";
        }

        Swal.fire({
          text: "사용자 등록에 실패했습니다.",
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
      username,
      password,
      name,
      email,
      gender,
      affiliation,
      status,
      roles,
      submitButton,
      fetchData,
      goBack,
      errorMessage,
    };
  },
});
</script>



<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; 
}

.loader {
  border: 16px solid #f3f3f3; 
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.column-id,
.column-username,
.column-name,
.column-email,
.column-gender,
.column-affiliation,
.column-status {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.column-id {
  width: 50px;
  text-align: center;
}
.column-username {
  width: 150px;
  text-align: center;
  cursor: pointer;
}
.column-name {
  width: 150px;
  text-align: center;
  cursor: pointer;
}
.column-email {
  width: 200px;
  text-align: center;
}
.column-gender {
  width: 100px;
  text-align: center;
}
.column-affiliation {
  width: 150px;
  text-align: center;
}
.column-status {
  width: 100px;
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave {
  opacity: 1;
}
.vertical-separator {
  border-left: 1px solid #dee2e6;
  height: 40px;
}
.checkbox-button {
  width: 120px;
  height: 40px;
  padding: 0 !important;
  font-weight: 600;
}
.dropdown-button {
  padding-left: 7px !important;
}
</style>
