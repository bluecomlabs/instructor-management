<template>
  <!--begin::Wrapper-->
  <div class="background-container"></div>
  <div class="form-wrapper">
    <!--begin::Form-->
    <img src="/logo.png" style="width: 60%; display: block; margin-left: auto; margin-right: auto; margin-bottom: 30px;">

    <form @submit.prevent="login">
      <div class="text-center mb-10">
        <h1 class="text-gray-900 mb-3" style="font-size: 35px;">관리자 로그인</h1>
      </div>

      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">ID</label>
        <input v-model="username" tabindex="1" class="form-control form-control-lg form-control-solid" type="text" name="ADMN_ACC" placeholder="관리자 ID" autocomplete="on" />
      </div>

      <div class="fv-row mb-10">
        <label class="form-label fw-bold text-gray-900 fs-6 mb-0">비밀번호</label>
        <input v-model="password" tabindex="2" class="form-control form-control-lg form-control-solid" type="password" name="ADMN_PWD" placeholder="비밀번호" autocomplete="off" />
      </div>

      <div class="text-center">
        <button tabindex="3" type="submit" ref="submitButton" id="kt_sign_in_submit" class="btn btn-lg btn-primary w-100 mb-5">
          <span class="indicator-label"> 로그인 </span>
          <span class="indicator-progress"> 잠시만 기다려주세요 <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
        </button>

        <div class="text-center text-muted text-uppercase fw-bold mb-5">or</div>

        <button tabindex="3" type="button" @click="onAdminLogin" class="btn btn-lg w-100 mb-5" style="border: 1px solid black;">
          <span class="indicator-label"> 강사로 로그인 </span>
        </button>
      </div>
    </form>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ApiUrl } from "@/assets/ts/_utils/api";

export default defineComponent({
  name: "sign-in",
  setup() {
    const router = useRouter();
    const submitButton = ref<HTMLButtonElement | null>(null);
    const username = ref('');
    const password = ref('');

    const login = async () => {
      if (submitButton.value) {
        submitButton.value.disabled = true;
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }
      
      try {
        const response = await axios.post(ApiUrl('/auth/login'),
          {
            username: username.value,
            password: password.value,
          },
          {
            headers: {
              'Content-Type': 'application/json'
            },
          }
        );

        // 새로운 응답 구조: response.data = { code, data, message, success }
        const result = response.data;
        if (result.success) {
          // 로그인 성공 시 토큰과 사용자 정보는 result.data 안에 있음
          // businessId도 함께 받아옵니다.
          const { token, role, username: userUsername, businessId } = result.data;
          
          // 혹시 토큰에 "Bearer " 접두어가 붙어 있다면 제거 (현재 예시에서는 붙어있지 않음)
          const tokenWithoutBearer = token.startsWith("Bearer ") ? token.replace("Bearer ", "") : token;
          localStorage.setItem('token', tokenWithoutBearer);

          // 필요한 사용자 정보만 로컬 스토리지에 저장 (businessId 추가)
          localStorage.setItem('user', JSON.stringify({
            role,
            username: userUsername,
            businessId,
          }));

          Swal.fire({
            text: "방문을 환영합니다.",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "확인",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semibold btn-light-primary",
            },
          }).then(() => {
            router.push({ name: "admin-AllProgramStatusList" });
          });
        } else {
          // API에서 success가 false인 경우, 에러 메시지 출력
          throw new Error(result.message || "로그인 실패");
        }
      } catch (error: unknown) {
        Swal.fire({
          text: "아이디와 비밀번호가 틀렸습니다.",
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

    const onAdminLogin = () => {
      router.push({ name: "user-sign-in" });
    };

    return {
      login,
      onAdminLogin,
      username,
      password,
      submitButton,
    };
  },
});
</script>


<style scoped>
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: contain;
  opacity: 0.2;
  z-index: -1;
}

.form-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
  padding: 10px;
  margin: 0 auto;
}
</style>
