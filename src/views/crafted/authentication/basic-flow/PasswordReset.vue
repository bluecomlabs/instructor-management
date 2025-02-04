<template>
  <!--begin::Wrapper-->
  <div :class="`card pt-2 ${cardClasses}`">
    <div class="w-lg-500px p-10" style="margin-left: auto; margin-right: auto; display: block; ">
      <VForm
        class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
        @submit="onSubmitForgotPassword"
        id="kt_login_password_reset_form"
        :validation-schema="forgotPassword"
      >
        <div v-if="!isCodeSent" class="text-center mb-10">
          <h1 class="text-gray-900 mb-3">이메일 인증이 필요한 서비스입니다.</h1>
          <div class="text-gray-500 fw-semibold fs-4">
            등록하신 이메일을 입력해주세요.
          </div>
        </div>
        <div v-if="!isCodeSent" class="fv-row mb-10">
          <label class="form-label fw-bold text-gray-900 fs-6">이메일</label>
          <Field
            class="form-control form-control-solid"
            type="email"
            placeholder=""
            name="email"
            autocomplete="off"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="email" />
            </div>
          </div>
        </div>

        <div v-if="isCodeSent" class="text-center mb-10">
          <h1 class="text-gray-900 mb-3">등록하신 이메일로 인증번호가 발송되었습니다.</h1>
          <div class="text-gray-500 fw-semibold fs-4">
            등록하신 이메일을 입력해주세요.
          </div>
        </div>
        <div v-if="isCodeSent" class="fv-row mb-10">
          <label class="form-label fw-bold text-gray-900 fs-6">인증번호</label>
          <Field
            class="form-control form-control-solid"
            type="text"
            placeholder=""
            name="code"
            autocomplete="off"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="code" />
            </div>
          </div>
        </div>

        <div class="d-flex flex-wrap justify-content-center pb-lg-0">
          <button
            v-if="!isCodeSent"
            type="submit"
            ref="submitButton"
            id="kt_password_reset_submit"
            class="btn btn-lg btn-primary fw-bold me-4"
            @click="sendCode"
          >
            <span class="indicator-label"> 인증 </span>
            <span class="indicator-progress">
              잠시만 기다려주세요...
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>

          <button
            v-if="isCodeSent"
            type="submit"
            ref="submitButton"
            id="kt_password_reset_submit"
            class="btn btn-lg btn-primary fw-bold me-4"
          >
            <span class="indicator-label"> 확인 </span>
            <span class="indicator-progress">
              잠시만 기다려주세요...
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
        </div>

        <div v-if="isCodeSent" class="text-center mt-3">
          <p>남은 시간: {{ timer }}초</p>
        </div>
      </VForm>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onUnmounted, computed } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { useAuthStore } from "@/stores/auth";
import * as Yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "password-reset",
  props: {
    cardClasses: String,
  },
  components: {
    Field,
    VForm,
    ErrorMessage,
  },
  setup() {
    const store = useAuthStore();

    const submitButton = ref<HTMLButtonElement | null>(null);
    const isCodeSent = ref(false);
    const timer = ref(300);

    let interval: number;
    const startTimer = () => {
      interval = setInterval(() => {
        if (timer.value > 0) {
          timer.value--;
        } else {
          clearInterval(interval);
          Swal.fire({
            text: "인증시간이 만료되어 새로고침됩니다.",
            icon: "warning",
            buttonsStyling: false,
            confirmButtonText: "확인",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semibold btn-light-warning",
            },
          }).then(() => {
            window.location.reload();
          });
        }
      }, 1000);
    };

    onUnmounted(() => {
      clearInterval(interval);
    });

    const forgotPassword = computed(() =>
      Yup.object().shape({
        email: Yup.string().email().required().label("Email"),
        code: isCodeSent.value
          ? Yup.string().required().label("Code")
          : Yup.string(),
      })
    );

    const onSubmitForgotPassword = async (values: any) => {
      values = values as string;

      submitButton.value!.disabled = true;
      submitButton.value?.setAttribute("data-kt-indicator", "on");

      await store.forgotPassword(values);

      const error = Object.values(store.errors);

      if (!error) {
        Swal.fire({
          text: "You have successfully logged in!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semibold btn-light-primary",
          },
        });
      } else {
        Swal.fire({
          text: error[0] as string,
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Try again!",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semibold btn-light-danger",
          },
        });
      }

      submitButton.value?.removeAttribute("data-kt-indicator");
      submitButton.value!.disabled = false;
    };

    const sendCode = () => {
      isCodeSent.value = true;
      startTimer();
    };

    return {
      onSubmitForgotPassword,
      forgotPassword,
      submitButton,
      isCodeSent,
      timer,
      sendCode,
    };
  },
});
</script>
