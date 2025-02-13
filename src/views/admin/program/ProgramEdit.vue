<template>
  <div class="d-flex flex-column flex-xl-row">
    <div class="flex-column flex-lg-row-auto w-100 mb-10">
      <div class="card mb-5 mb-xl-8">
        <div class="card-header border-0">
          <div class="card-title d-flex align-items-center">
            <i class="bi bi-pencil-square me-2"></i>
            <h2 class="fw-bold m-0">프로그램 수정</h2>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="updateProgram">
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
                      <th class="bg-light">프로그램 ID</th>
                      <td>{{ programData?.id || '-' }}</td>
                      <th class="bg-light">프로그램명</th>
                      <td>
                        <input v-model="programName" type="text" class="form-control" />
                      </td>
                    </tr>
                    <tr>
                      <th class="bg-light">상태</th>
                      <td>
                        <select v-model="status" class="form-select">
                          <option disabled value="">선택하세요</option>
                          <option value="INIT">활성</option>
                          <option value="OPEN">활성</option>
                          <option value="CLOSE">비활성</option>
                        </select>
                      </td>
                      <th class="bg-light">비고</th>
                      <td>
                        <textarea v-model="remarks" class="form-control" rows="3"></textarea>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="d-flex justify-content-end py-6 px-9">
              <button type="button" class="btn btn-light me-2" @click="goBack">뒤로</button>
              <button type="submit" class="btn btn-primary">수정하기</button>
            </div>
          </form>
          <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import Swal from "sweetalert2";
import { defineComponent, ref, onMounted } from "vue";
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
  name: "ProgramEdit",
  setup() {
    const router = useRouter();
    const programData = ref<IProgram | null>(null);
    const errorMessage = ref('');

    // 수정 가능한 필드
    const programName = ref('');
    const status = ref('');
    const remarks = ref('');

    const fetchProgramData = async () => {
      const programId = localStorage.getItem('selectedProgramId');
      if (!programId) {
        errorMessage.value = '프로그램 ID를 찾을 수 없습니다.';
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<{ success: boolean; code: number; message: string; data: IProgram }>(
          ApiUrl(`/admin/programs/${programId}`),
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        programData.value = response.data.data;
        // 초기값 할당
        programName.value = programData.value.programName;
        status.value = programData.value.status;
        remarks.value = programData.value.remarks || '';
      } catch (error) {
        console.error('Error fetching program data:', error);
        errorMessage.value = '프로그램 정보를 불러오는 데 실패했습니다.';
      }
    };

    const updateProgram = async () => {
      // 필수 필드 체크 (trim 처리하여 공백만 있는 경우도 체크)
      if (!programName.value.trim() || !status.value.trim() || !remarks.value.trim()) {
        Swal.fire({
          icon: 'error',
          title: '입력 오류',
          text: '모든 필드를 입력해주세요.',
        });
        return;
      }
      if (!programData.value) {
        errorMessage.value = '프로그램 정보가 없습니다.';
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const body = {
          businessId: programData.value.businessId, // 기존 businessId 유지
          programName: programName.value,
          status: status.value,
          teachingAidId: programData.value.teachingAidId, // 기존 teachingAidId 유지
          remarks: remarks.value
        };
        await axios.put(
          ApiUrl(`/admin/programs/${programData.value.id}`),
          body,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        Swal.fire({
          icon: 'success',
          title: '수정 완료',
          text: '프로그램 정보가 성공적으로 수정되었습니다.',
        }).then(() => {
          router.push({ name: "admin-ProgramDetails", params: { id: programData.value?.id } });
        });
      } catch (error) {
        console.error('Error updating program:', error);
        Swal.fire({
          icon: 'error',
          title: '수정 실패',
          text: '프로그램 정보를 수정하는 데 실패했습니다.',
        });
      }
    };

    const goBack = () => {
      router.back();
    };

    onMounted(() => {
      fetchProgramData();
    });

    return {
      programData,
      errorMessage,
      programName,
      status,
      remarks,
      updateProgram,
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
