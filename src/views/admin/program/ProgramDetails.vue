<template>
  <div class="d-flex flex-column flex-xl-row">
    <div class="flex-column flex-lg-row-auto w-100 mb-10">
      <div class="card mb-5 mb-xl-8">
        <div class="card-body">
          <!-- Program Details -->
          <div class="card mb-5 mb-xl-10">
            <div class="card-header border-0 cursor-pointer" role="button">
              <div class="card-title m-0 d-flex align-items-center">
                <i class="bi bi-journal-text me-2"></i>
                <h2 class="fw-bold m-0">프로그램 조회</h2>
              </div>
            </div>
            <div class="card-body border-top p-9">
              <div v-if="programData">
                <!-- 프로그램 정보 -->
                <h3 class="fw-bold section-title">프로그램 정보</h3>
                <div class="card mb-4">
                  <div class="card-body p-0">
                    <table class="table table-bordered mb-0">
                      <colgroup>
                        <col style="width: 20%;">
                        <col style="width: 30%;">
                        <col style="width: 20%;">
                        <col style="width: 30%;">
                      </colgroup>
                      <tbody>
                        <tr>
                          <th class="bg-light">프로그램 ID</th>
                          <td>{{ programData.id }}</td>
                          <th class="bg-light">프로그램명</th>
                          <td>{{ programData.programName }}</td>
                        </tr>
                        <tr>
                          <th class="bg-light">상태</th>
                          <td>{{ statusLabel }}</td>
                          <th class="bg-light">비고</th>
                          <td>{{ programData.remarks || '-' }}</td>
                        </tr>
                        <tr>
                          <th class="bg-light">생성일시</th>
                          <td>{{ formattedCreatedAt }}</td>
                          <th class="bg-light">수정일시</th>
                          <td>{{ formattedUpdatedAt }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div v-else>
                <p>데이터를 불러오는 중입니다...</p>
              </div>
              <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
            </div>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-end py-6 px-9">
          <button type="button" class="btn btn-light btn-active-light-primary me-2" @click="goBack">
            뒤로
          </button>
          <button type="button" class="btn btn-primary" @click="goEdit">
            수정
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { ApiUrl } from "@/assets/ts/_utils/api";

interface IProgram {
  id: number;
  businessId: number;
  programName: string;
  status: string;
  teachingAidId: number | null;
  remarks: string | null;
  createdAt: number;
  createdId: number;
  updatedAt: number | null;
  updatedId: number | null;
}

export default defineComponent({
  name: "ProgramDetails",
  setup() {
    const router = useRouter();
    const programData = ref<IProgram | null>(null);
    const errorMessage = ref("");

    const fetchProgramData = async () => {
      const programId = localStorage.getItem("selectedProgramId");
      if (!programId) {
        errorMessage.value = "프로그램 ID를 찾을 수 없습니다.";
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<{ success: boolean; code: number; message: string; data: IProgram }>(
          ApiUrl(`/admin/programs/${programId}`),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        programData.value = response.data.data;
      } catch (error) {
        console.error("Error fetching program data:", error);
        errorMessage.value = "프로그램 정보를 불러오는 데 실패했습니다.";
      }
    };

    // 생성일시, 수정일시 포맷팅 (숫자 타임스탬프 → 지역시간 문자열)
    const formattedCreatedAt = computed(() =>
      programData.value ? new Date(programData.value.createdAt).toLocaleString() : "-"
    );
    const formattedUpdatedAt = computed(() =>
      programData.value && programData.value.updatedAt
        ? new Date(programData.value.updatedAt).toLocaleString()
        : "-"
    );

    // 상태에 따른 라벨 매핑: Active -> 활성, Inactive -> 비활성
    const statusLabel = computed(() => {
      if (programData.value) {
        return programData.value.status === "OPEN"
          ? "활성"
          : programData.value.status === "CLOSE"
          ? "비활성"
          : programData.value.status === "INIT"
          ? "대기"
          : programData.value.status;
      }
      return "-";
    });

    onMounted(() => {
      fetchProgramData();
    });

    const goBack = () => {
      router.push({ name: "admin-ProgramList" });
    };

    const goEdit = () => {
      if (programData.value) {
        router.push({ name: "admin-ProgramEdit", params: { id: programData.value.id } });
      } else {
        errorMessage.value = "프로그램 정보가 로드되지 않았습니다.";
      }
    };

    return {
      programData,
      errorMessage,
      formattedCreatedAt,
      formattedUpdatedAt,
      statusLabel,
      goBack,
      goEdit,
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

.table-bordered th,
.table-bordered td {
  border: 1px solid #dee2e6;
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

.bi-journal-text {
  font-size: 1.2rem;
}

.card-body strong {
  color: #495057;
}

.card-footer {
  background-color: #fff;
}
</style>
