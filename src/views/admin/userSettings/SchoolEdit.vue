<template>
  <div class="d-flex flex-column flex-xl-row">
    <div class="flex-column flex-lg-row-auto w-100 mb-10">
      <div class="card mb-5 mb-xl-8">
        <div class="card-header border-0">
          <div class="card-title d-flex align-items-center">
            <i class="bi bi-pencil-square me-2"></i>
            <h2 class="fw-bold m-0">교육기관 수정</h2>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="updateSchool">
            <!-- 교육기관 정보 테이블 -->
            <h3 class="fw-bold section-title">교육기관 정보</h3>
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
                      <th class="bg-light">교육기관 ID</th>
                      <td>{{ schoolData?.id || '-' }}</td>
                      <th class="bg-light">학교명</th>
                      <td>
                        <input v-model="name" type="text" class="form-control" />
                      </td>
                    </tr>
                    <tr>
                      <th class="bg-light">교육기관 유형</th>
                      <td colspan="3">
                        <select v-model="selectedSchoolTypeId" class="form-select">
                          <option disabled value="">선택하세요</option>
                          <option v-for="option in schoolTypeOptions" :key="option.id" :value="option.id">
                            {{ option.name }}
                          </option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <th class="bg-light">대표번호</th>
                      <td>
                        <input v-model="representativeNumber" type="text" class="form-control" />
                      </td>
                      <th class="bg-light">도시</th>
                      <td>{{ schoolData?.city || '-' }}</td>
                    </tr>
                    <tr>
                      <th class="bg-light">구/군</th>
                      <td colspan="3">
                        <select v-model="district" class="form-select">
                          <option disabled value="">선택하세요</option>
                          <option v-for="option in districtOptions" :key="option" :value="option">
                            {{ option }}
                          </option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <th class="bg-light">도로명/번호</th>
                      <td>
                        <input v-model="street" type="text" class="form-control" placeholder="도로명" />
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
            <!-- 담당자 정보 테이블 -->
            <h3 class="fw-bold section-title">담당자 정보</h3>
            <div class="card mb-4">
              <div class="card-body p-0">
                <table class="table table-bordered mb-0">
                  <colgroup>
                    <col style="width: 50%;" />
                    <col style="width: 50%;" />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th class="bg-light">담당자명</th>
                      <td>
                        <input v-model="managerName" type="text" class="form-control" />
                      </td>
                    </tr>
                    <tr>
                      <th class="bg-light">담당자 전화</th>
                      <td>
                        <input v-model="managerPhone" type="text" class="form-control" />
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

interface ISchool {
  id: number;
  businessId: number;
  schoolTypeId: number;
  name: string;
  city: string | null;
  district: string | null;
  street: string | null;
  number: string | null;
  representativeNumber: string | null;
  managerName: string | null;
  managerPhone: string | null;
  signaturePath: string | null;
  remarks: string | null;
  createdAt: number;
  createdId: number;
  updatedAt: number | null;
  updatedId: number | null;
}

interface ISchoolType {
  id: number;
  businessId: number;
  name: string;
  description: string;
  createdAt: number;
  createdId: number;
  updatedAt: number | null;
  updatedId: number | null;
}

export default defineComponent({
  name: "SchoolEdit",
  setup() {
    const router = useRouter();
    const schoolData = ref<ISchool | null>(null);
    const errorMessage = ref('');

    // 수정 가능한 필드
    const name = ref('');
    const street = ref('');
    const district = ref('');
    const representativeNumber = ref('');
    const managerName = ref('');
    const managerPhone = ref('');
    const remarks = ref('');

    // 드롭다운 옵션: 구/군 값
    const districtOptions = [
      "고양", "동두천", "양주", "연천", "김포", "파주",
      "의정부", "구리", "남양주", "가평", "포천",
      "성남", "과천", "하남", "광주", "앙평",
      "수원", "안양", "부천", "안산", "광명", "시흥", "군포", "의왕",
      "평택", "오산", "화성",
      "용인", "이천", "안성", "여주"
    ];

    // 교육기관 유형 옵션과 선택된 교육기관 유형
    const schoolTypeOptions = ref<ISchoolType[]>([]);
    const selectedSchoolTypeId = ref<number | null>(null);

    const fetchSchoolData = async () => {
      const institutionId = localStorage.getItem('selectedInstitutionId');
      if (!institutionId) {
        errorMessage.value = '교육기관 ID를 찾을 수 없습니다.';
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<{ success: boolean; code: number; message: string; data: ISchool }>(
          ApiUrl(`/admin/schools/${institutionId}`),
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        schoolData.value = response.data.data;
        // 초기값 할당
        name.value = schoolData.value.name;
        street.value = schoolData.value.street || '';
        district.value = schoolData.value.district || '';
        representativeNumber.value = schoolData.value.representativeNumber || '';
        managerName.value = schoolData.value.managerName || '';
        managerPhone.value = schoolData.value.managerPhone || '';
        remarks.value = schoolData.value.remarks || '';
        selectedSchoolTypeId.value = schoolData.value.schoolTypeId;
        // 교육기관 유형 옵션은 교육기관 레코드의 businessId를 사용하여 가져옵니다.
        fetchSchoolTypeOptions(schoolData.value.businessId);
      } catch (error) {
        console.error('Error fetching school data:', error);
        errorMessage.value = '교육기관 정보를 불러오는 데 실패했습니다.';
      }
    };

    const fetchSchoolTypeOptions = async (businessId: number) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(ApiUrl(`/admin/school-types?businessId=${businessId}`), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // 응답 데이터의 content 배열 사용
        schoolTypeOptions.value = response.data.data.content;
      } catch (error) {
        console.error('Error fetching school type options:', error);
      }
    };

    const updateSchool = async () => {
      // 빈 칸 체크 (trim하여 공백만 있는 경우도 체크)
      if (
        !name.value.trim() ||
        !street.value.trim() ||
        !district.value.trim() ||
        !representativeNumber.value.trim() ||
        !managerName.value.trim() ||
        !managerPhone.value.trim() ||
        !remarks.value.trim() ||
        selectedSchoolTypeId.value === null
      ) {
        Swal.fire({
          icon: 'error',
          title: '입력 오류',
          text: '모든 필드를 입력해주세요.',
        });
        return;
      }

      if (!schoolData.value) {
        errorMessage.value = '교육기관 정보가 없습니다.';
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const body = {
          businessId: schoolData.value.businessId, // 기존 레코드의 businessId 사용
          schoolTypeId: selectedSchoolTypeId.value,
          name: name.value,
          city: schoolData.value.city, // 수정 불가
          district: district.value,
          street: street.value,
          // number 필드는 제외
          representativeNumber: representativeNumber.value,
          managerName: managerName.value,
          managerPhone: managerPhone.value,
          signaturePath: schoolData.value.signaturePath, // 수정 불가
          remarks: remarks.value
        };
        await axios.put(
          ApiUrl(`/admin/schools/${schoolData.value.id}`),
          body,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        Swal.fire({
          icon: 'success',
          title: '수정 완료',
          text: '교육기관 정보가 성공적으로 수정되었습니다.',
        }).then(() => {
          router.push({ name: "admin-SchoolDetails" });
        });
      } catch (error) {
        console.error('Error updating school:', error);
        Swal.fire({
          icon: 'error',
          title: '수정 실패',
          text: '교육기관 정보를 수정하는 데 실패했습니다.',
        });
      }
    };

    const goBack = () => {
      router.back();
    };

    onMounted(() => {
      fetchSchoolData();
    });

    return {
      schoolData,
      errorMessage,
      name,
      street,
      district,
      representativeNumber,
      managerName,
      managerPhone,
      remarks,
      districtOptions,
      schoolTypeOptions,
      selectedSchoolTypeId,
      updateSchool,
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
