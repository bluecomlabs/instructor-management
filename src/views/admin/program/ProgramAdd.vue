<template>
  <div class="d-flex flex-column flex-xl-row">
    <div class="flex-column flex-lg-row-auto w-100 mb-10">
      <div class="card mb-5 mb-xl-8">
        <div class="card-header border-0">
          <div class="card-title d-flex align-items-center">
            <i class="bi bi-plus-square me-2"></i>
            <h2 class="fw-bold m-0">프로그램 등록</h2>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="registerProgram">
            <!-- 프로그램 정보 테이블 -->
            <h3 class="fw-bold section-title">프로그램 정보</h3>
            <div class="card mb-4">
              <div class="card-body p-0">
                <table class="table table-bordered mb-0">
                  <colgroup>
                    <col style="width: 20%;" />
                    <col style="width: 30%;" />
                    <col style="width: 20%;" />
                    <col style="width: 30%;" />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th class="bg-light">프로그램명</th>
                      <td colspan="3">
                        <input
                          v-model="programName"
                          type="text"
                          class="form-control"
                          placeholder="프로그램명"
                        />
                      </td>
                    </tr>
                    <tr>
                      <th class="bg-light">상태</th>
                      <td colspan="3">
                        <select v-model="status" class="form-select">
                          <option disabled value="">선택하세요</option>
                          <option value="INIT">대기</option>
                          <option value="OPEN">활성</option>
                          <option value="CLOSE">비활성</option>
                        </select>
                      </td>
                      <!-- <th class="bg-light">Teaching Aid ID</th>
                      <td>
                        <input
                          v-model.number="teachingAidId"
                          type="number"
                          class="form-control"
                          placeholder="Teaching Aid ID"
                        />
                      </td> -->
                    </tr>
                    <tr>
                      <th class="bg-light">비고</th>
                      <td colspan="3">
                        <textarea
                          v-model="remarks"
                          class="form-control"
                          rows="3"
                          placeholder="비고"
                        ></textarea>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="d-flex justify-content-end py-6 px-9">
              <button type="button" class="btn btn-light me-2" @click="goBack">
                뒤로
              </button>
              <button type="submit" class="btn btn-primary">등록하기</button>
            </div>
          </form>
          <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import Swal from "sweetalert2";
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ApiUrl } from "@/assets/ts/_utils/api";

export default defineComponent({
  name: "ProgramRegister",
  setup() {
    const router = useRouter();
    const errorMessage = ref("");

    // 로컬스토리지의 user에서 businessId 추출
    const userStr = localStorage.getItem("user");
    let businessIdValue = 0;
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        businessIdValue = userObj.businessId;
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
        errorMessage.value = "사용자 정보를 불러오는데 실패했습니다.";
      }
    } else {
      errorMessage.value = "사용자 정보가 없습니다.";
    }
    const businessId = ref(businessIdValue);

    // 등록에 필요한 입력 필드
    const programName = ref("");
    const status = ref("");
    const teachingAidId = ref<number | null>(null);
    const remarks = ref("");

    const registerProgram = async () => {
      // 모든 필드 체크 (trim 처리)
      if (
        !programName.value.trim() ||
        !status.value.trim() ||
        // teachingAidId.value === null ||
        !remarks.value.trim()
      ) {
        Swal.fire({
          icon: "error",
          title: "입력 오류",
          text: "모든 필드를 입력해주세요.",
        });
        return;
      }

      const body = {
        businessId: businessId.value,
        programName: programName.value,
        status: status.value,
        teachingAidId: teachingAidId.value,
        remarks: remarks.value,
      };

      try {
        const token = localStorage.getItem("token");
        await axios.post(ApiUrl("/admin/programs"), body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "success",
          title: "등록 완료",
          text: "프로그램 정보가 성공적으로 등록되었습니다.",
        }).then(() => {
          router.push({ name: "admin-ProgramList" });
        });
      } catch (error) {
        console.error("Error registering program:", error);
        Swal.fire({
          icon: "error",
          title: "등록 실패",
          text: "프로그램 정보를 등록하는 데 실패했습니다.",
        });
      }
    };

    const goBack = () => {
      router.back();
    };

    onMounted(() => {
      // 필요 시 초기 로직 추가
    });

    return {
      errorMessage,
      programName,
      status,
      teachingAidId,
      remarks,
      registerProgram,
      goBack,
    };
  },
});
</script>

<style scoped>
.section-title {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.75rem;
  border-bottom: 2px solid #dee2e6;
  padding-bottom: 0.5rem;
}
.table {
  margin-bottom: 1.5rem;
}
.table th,
.table td {
  vertical-align: middle;
}
.table th {
  font-weight: 600;
  background-color: #f8f9fa;
}
.alert {
  margin-top: 1rem;
}
.card {
  margin-bottom: 1rem;
}
.card-header {
  background-color: #f7f9fc;
  border-bottom: 1px solid #e3e6f0;
}
.card-title {
  margin-bottom: 0;
}
.btn {
  min-width: 100px;
}
@media (max-width: 575.98px) {
  .row .col-md-6,
  .row .col-md-4,
  .row .col-md-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
.card-body {
  padding: 1rem;
}
</style>
