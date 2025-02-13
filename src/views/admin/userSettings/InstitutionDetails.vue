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
              data-bs-target="#kt_account_institution_details"
              aria-expanded="true"
              aria-controls="kt_account_institution_details"
            >
              <div class="card-title m-0">
                <h2 class="fw-bold m-0">교육기관 조회</h2>
              </div>
            </div>

            <div id="kt_account_institution_details" class="collapse show">
              <VForm
                id="kt_account_institution_details_form"
                class="form"
                novalidate
              >
                <div class="card-body border-top p-9">
                  <!-- ID -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6" style="font-weight: 700 !important;">
                      ID
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="id"
                        style="font-weight: bold; font-size: 16px;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        disabled
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="id"/>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 교육기관명 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6" style="font-weight: 700 !important;">
                      교육기관명
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="institutionName"
                        style="font-weight: bold; font-size: 16px;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        disabled
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="institutionName"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 관리자명 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6" style="font-weight: 700 !important;">
                      관리자명
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="managerName"
                        style="font-weight: bold; font-size: 16px;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        placeholder="/"
                        disabled
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="managerName"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 전화번호 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6" style="font-weight: 700 !important;">
                      전화번호
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="phoneNumber"
                        style="font-weight: bold; font-size: 16px;"
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

                  <!-- 주소 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6" style="font-weight: 700 !important;">
                      시
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="city"
                        style="font-weight: bold; font-size: 16px;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        placeholder="/"
                        disabled
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="city"/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6" style="font-weight: 700 !important;">
                      구
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="district"
                        style="font-weight: bold; font-size: 16px;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        placeholder="/"
                        disabled
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="district"/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6" style="font-weight: 700 !important;">
                      동 / 도로명
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="street"
                        style="font-weight: bold; font-size: 16px;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        placeholder="/"
                        disabled
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="street"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 비고 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6" style="font-weight: 700 !important;">
                      비고
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="remarks"
                        style="font-weight: bold; font-size: 16px;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        placeholder="/"
                        disabled
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="remarks"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 생성 날짜 -->
                  <div class="row mb-6">
                    <label class="col-lg-4 col-form-label fw-semibold fs-6" style="font-weight: 700 !important;">
                      생성 날짜
                    </label>
                    <div class="col-lg-8 fv-row">
                      <input 
                        v-model="createdAt"
                        style="font-weight: bold; font-size: 16px;"
                        class="form-control form-control-lg form-control-solid" 
                        type="text"
                        disabled
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="createdAt"/>
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
            @click="deleteData"
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
            type="button"
            id="kt_account_institution_details_submit"
            ref="submitButton1"
            class="btn btn-primary"
            @click="goEdit"
          >
            <span class="indicator-label">
              수정하기
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
import { defineComponent, ref, onMounted } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useRouter } from "vue-router";
import { ApiUrl } from "@/assets/ts/_utils/api";

interface IInstitution {
  id: number;
  institutionName: string;
  managerName: string | null;
  phoneNumber: string | null;
  remarks: string | null;
  createdAt: number | null;
  city: string | null;
  district: string | null;
  street: string | null;
}

export default defineComponent({
  name: "InstitutionDetail",
  components: {
  },

  setup() {
    const router = useRouter();
    const submitButton = ref<HTMLButtonElement | null>(null);
    
    const id = ref<number | null>(null);
    const institutionName = ref<string>('');
    const managerName = ref<string | null>(null);
    const phoneNumber = ref<string | null>(null);
    const city = ref<string | null>(null);
    const district = ref<string | null>(null);
    const street = ref<string | null>(null);
    const remarks = ref<string | null>(null);
    const createdAt = ref<string>('');
    const errorMessage = ref<string>('');

    const fetchInstitutionData = async () => {
      const institutionId = localStorage.getItem('selectedInstitutionId');
      if (!institutionId) {
        errorMessage.value = '교육기관 ID를 찾을 수 없습니다.';
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<IInstitution>(ApiUrl(`/api/v1/admin/institutions/${institutionId}`), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const institutionData = response.data;
        
        id.value = institutionData.id;
        institutionName.value = institutionData.institutionName;
        managerName.value = institutionData.managerName;
        phoneNumber.value = institutionData.phoneNumber;
        city.value = institutionData.city;
        district.value = institutionData.district;
        street.value = institutionData.street;
        remarks.value = institutionData.remarks;
        createdAt.value = institutionData.createdAt
          ? new Date(institutionData.createdAt * 1000).toLocaleDateString()
          : '-';
        
      } catch (error) {
        console.error('Error fetching institution data:', error);
        errorMessage.value = '교육기관 정보를 불러오는 데 실패했습니다.';
      }
    };
    
    const deleteData = async () => {
      const institutionId = localStorage.getItem('selectedInstitutionId');

      if (!institutionId) {
        Swal.fire({
          text: "삭제할 교육기관 ID가 없습니다.",
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
        text: "삭제된 교육기관은 복구할 수 없습니다.",
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
          await axios.delete(ApiUrl(`/api/v1/admin/institutions/${institutionId}`), {
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
            router.push({ name: "admin-SchoolList" });
          });

        } catch (error: unknown) {
          console.error('Error deleting institution:', error);
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
      if (id.value !== null) {
        router.push({ name: "admin-InstitutionEdit", params: { id: id.value.toString() } });
      } else {
        Swal.fire({
          text: "수정할 교육기관 ID가 없습니다.",
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

    const goBack = () => {
      router.back();
    };

    onMounted(() => {
      fetchInstitutionData();
    });

    return {
      id,
      institutionName,
      managerName,
      phoneNumber,
      city,
      district,
      street,
      remarks,
      createdAt,
      submitButton,
      deleteData,
      goEdit,
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

.column-status,
.column-institutionName,
.column-managerName,
.column-phoneNumber,
.column-address,
.column-remarks,
.column-createdAt {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.column-status {
  width: 70px;
  text-align: center;
}

.column-institutionName {
  width: 200px;
}

.column-managerName {
  width: 150px;
}

.column-phoneNumber {
  width: 150px;
}

.column-address {
  width: 300px;
}

.column-remarks {
  width: 200px;
}

.column-createdAt {
  width: 150px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave {
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
