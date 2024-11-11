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
                <h2 class="fw-bold m-0">사용자 조회</h2>
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
                    <label class="col-lg-4 col-form-label fw-semibold fs-6" style="font-weight: 600;">
                      ID
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="id"
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        disabled
                      />
                    </div>
                  </div>

                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6" style="font-weight: 600;">
                      사용자명
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="username"
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        disabled
                      />
                    </div>
                  </div>

                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6" style="font-weight: 600;">
                      이름
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="name"
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        disabled
                      />
                    </div>
                  </div>

                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6" style="font-weight: 600;">
                      이메일
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="email"
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-control form-control-lg form-control-solid" 
                        type="email"
                        disabled
                      />
                    </div>
                  </div>

                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6" style="font-weight: 600;">
                      성별
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="gender"
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        disabled
                      />
                    </div>
                  </div>

                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6" style="font-weight: 600;">
                      소속
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="affiliation"
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        disabled
                      />
                    </div>
                  </div>


                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6" style="font-weight: 600;">
                      상태
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="status"
                        style="font-weight: bold; font-size: 16px; float: left;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        disabled
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
              type="button"
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
  name: "UserView",
  setup() {
    const router = useRouter();
    const submitButton = ref<HTMLButtonElement | null>(null);
    const id = ref('');
    const username = ref('');
    const name = ref('');
    const email = ref('');
    const gender = ref('');
    const affiliation = ref('');
    const status = ref('');
    const errorMessage = ref('');

    const fetchUserData = async () => {
      const userId = localStorage.getItem('selectedUserId');
      if (!userId) {
        errorMessage.value = '사용자 ID를 찾을 수 없습니다.';
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const apiUrl = ApiUrl(`/api/v1/admin/user/${userId}`);
        console.log("API 호출 URL:", apiUrl);

        const response = await axios.get(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log("API 응답 데이터:", response.data);

        const userData = response.data;

        id.value = userData.id;
        username.value = userData.username;
        name.value = userData.name;
        email.value = userData.email;
        gender.value = userData.gender;
        affiliation.value = userData.affiliation;
        status.value = userData.status;
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
     * 사용자 삭제 함수
     */
    const deleteData = async () => {
      const userId = localStorage.getItem('selectedUserId');

      if (!userId) {
        Swal.fire({
          text: "삭제할 사용자 ID가 없습니다.",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "확인",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semibold btn-light-danger",
          },
        });
        return;
      }

      const result = await Swal.fire({
        title: "삭제하시겠습니까?",
        text: "삭제된 사용자는 복구할 수 없습니다.",
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
          const apiUrl = ApiUrl(`/api/v1/admin/user/${userId}`);
          console.log("API 호출 URL (삭제):", apiUrl);

          await axios.delete(apiUrl, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          Swal.fire({
            text: "사용자가 성공적으로 삭제되었습니다.",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "확인",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semibold btn-light-primary",
            },
          }).then(() => {
            router.push({ name: "admin-UserList" });
          });

        } catch (error: any) {
          console.error("Error deleting user:", error);
          Swal.fire({
            text: "사용자 삭제에 실패했습니다.",
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

    /**
     * 수정 버튼 클릭 시 동작 (수정 기능 비활성화)
     */
     const goEdit = () => {
      router.push({ name: "admin-TeacherEdit" })
    };

    /**
     * 뒤로 가기 함수
     */
    const goBack = () => {
      router.back();
    };

    onMounted(() => {
      fetchUserData();
    });

    return {
      id,
      username,
      name,
      email,
      gender,
      affiliation,
      status,
      submitButton,
      deleteData,
      goEdit,
      goBack,
      errorMessage,
    };
  },
});
</script>


