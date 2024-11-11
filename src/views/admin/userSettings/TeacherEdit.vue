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
                data-bs-target="#kt_account_userprofile_details"
                aria-expanded="true"
                aria-controls="kt_account_userprofile_details"
            >
              <div class="card-title m-0">
                <h2 class="fw-bold m-0">사용자 수정</h2>
              </div>
            </div>

            <div id="kt_account_userprofile_details" class="collapse show">
              <VForm
                  id="kt_account_userprofile_details_form"
                  class="form"
                  novalidate
              >
                <div class="card-body border-top p-9">
                  
                  <!-- 이름 입력 필드 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label required fw-semibold fs-6">
                      이름
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="name"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        placeholder="이름을 입력하세요"
                      />
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
                        class="form-control form-control-lg form-control-solid" 
                        type="email"
                        placeholder="이메일을 입력하세요"
                      />
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
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        placeholder="소속을 입력하세요"
                      />
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
              type="button"
              id="kt_account_userprofile_details_submit"
              ref="submitButton1"
              class="btn btn-primary"
              @click="updateUser()"
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
  name: "UserEdit", // 컴포넌트 이름 변경
  setup() {
    const router = useRouter();
    const submitButton = ref<HTMLButtonElement | null>(null);
    const name = ref(''); // 이름 입력 필드 상태
    const email = ref(''); // 이메일 입력 필드 상태
    const gender = ref(''); // 성별 드롭다운 상태
    const affiliation = ref(''); // 소속 입력 필드 상태
    const status = ref(''); // 상태 드롭다운 상태
    const errorMessage = ref(''); // 에러 메시지 상태

    /**
     * 사용자 데이터를 가져오는 함수
     */
    const fetchUserData = async () => {
      const userId = localStorage.getItem('selectedUserId'); // 로컬스토리지에서 ID 가져오기
      if (!userId) {
        errorMessage.value = '사용자 ID를 찾을 수 없습니다.';
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const apiUrl = ApiUrl(`/api/v1/admin/user/${userId}`);
        console.log("API 호출 URL:", apiUrl); // API 호출 URL 콘솔 출력

        const response = await axios.get(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const userData = response.data;

        // 폼 필드에 데이터 반영
        name.value = userData.name;
        email.value = userData.email;
        gender.value = userData.gender;
        affiliation.value = userData.affiliation;
        status.value = userData.status;

        console.log("받은 사용자 데이터:", userData); // 받은 데이터 콘솔 출력
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        errorMessage.value = '사용자 정보를 불러오는 데 실패했습니다.';
        Swal.fire({
          text: "사용자 정보를 불러오는 데 실패했습니다.",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "확인",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semibold btn-light-danger",
          },
        });
      }
    };

    /**
     * 사용자 업데이트를 위한 PUT 요청 함수
     */
    const updateUser = async () => {
      const userId = localStorage.getItem('selectedUserId'); // 로컬스토리지에서 ID 가져오기

      if (!userId) {
        errorMessage.value = '사용자 ID를 찾을 수 없습니다.';
        return;
      }

      // 입력값 검증
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

      errorMessage.value = ''; // 에러 메시지 초기화

      if (submitButton.value) {
        submitButton.value.disabled = true;
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }

      try {
        const token = localStorage.getItem("token");
        const apiUrl = ApiUrl(`/api/v1/admin/user/${userId}`);

        const requestBody = {
          name: name.value,
          email: email.value,
          gender: gender.value,
          affiliation: affiliation.value,
          status: status.value,
        };

        console.log("API 호출 URL:", apiUrl); // API 호출 URL 콘솔 출력
        console.log("요청 바디:", requestBody); // 요청 본문 콘솔 출력

        const response = await axios.put(
          apiUrl,
          requestBody, // JSON 형식으로 전송
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log("API 응답:", response); // API 응답 콘솔 출력

        Swal.fire({
          text: "사용자가 성공적으로 업데이트되었습니다.",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "확인",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semibold btn-light-primary",
          },
        }).then(() => {
          router.push({ name: "admin-TeacherList" }); // 사용자 목록 페이지로 이동
        });

      } catch (error: any) { 
        console.error("사용자 업데이트 오류:", error);
        // 서버에서 반환된 에러 메시지가 있을 경우 표시
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage.value = error.response.data.message;
        } else {
          errorMessage.value = "사용자 업데이트에 실패했습니다.";
        }

        Swal.fire({
          text: "사용자 업데이트에 실패했습니다.",
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

    /**
     * 뒤로 가기 함수
     */
    const goBack = () => {
      router.back();
    };

    // 컴포넌트가 마운트될 때 사용자 데이터를 불러오기
    onMounted(() => {
      fetchUserData();
    });

    return {
      name,
      email,
      gender,
      affiliation,
      status,
      submitButton,
      updateUser,
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

.row {
  display: flex;
  align-items: center;
}

.col-lg-4 {
  flex: 0 0 33.333333%;
  max-width: 33.333333%;
}

.col-lg-8 {
  flex: 0 0 66.666667%;
  max-width: 66.666667%;
}

.form-control {
  width: 100%;
}

.alert {
  margin-top: 10px;
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
