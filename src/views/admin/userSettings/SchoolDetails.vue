<template>
  <div class="d-flex flex-column flex-xl-row">
    <div class="flex-column flex-lg-row-auto w-100 mb-10">
      <div class="card mb-5 mb-xl-8">
        <div class="card-body">
          <!-- School Details -->
          <div class="card mb-5 mb-xl-10">
            <div class="card-header border-0 cursor-pointer" role="button">
              <div class="card-title m-0 d-flex align-items-center">
                <i class="bi bi-building me-2"></i>
                <h2 class="fw-bold m-0">교육기관 조회</h2>
              </div>
            </div>
            <div class="card-body border-top p-9">
              <div v-if="schoolData">
                <!-- 교육기관 정보 -->
                <h3 class="fw-bold section-title">교육기관 정보</h3>
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
                          <th class="bg-light">교육기관 ID</th>
                          <td>{{ schoolData.id }}</td>
                          <th class="bg-light">학교명</th>
                          <td>{{ schoolData.name }}</td>
                        </tr>
                        <tr>
                          <th class="bg-light">교육기관 유형</th>
                          <td colspan="3">{{ schoolTypeData?.name || '-' }}</td>
                        </tr>
                        <tr>
                          <th class="bg-light">대표번호</th>
                          <td>{{ schoolData.representativeNumber || '-' }}</td>
                          <th class="bg-light">도시</th>
                          <td>{{ schoolData.city || '-' }}</td>
                        </tr>
                        <tr>
                          <th class="bg-light">구/군</th>
                          <td>{{ schoolData.district || '-' }}</td>
                          <th class="bg-light">권역</th>
                          <td>{{ region }}</td>
                        </tr>
                        <tr>
                          <th class="bg-light">도로명/번호</th>
                          <td>
                            {{ schoolData.street ? schoolData.street : '-' }}
                            <span v-if="schoolData.number"> {{ schoolData.number }}</span>
                          </td>
                          <th class="bg-light">비고</th>
                          <td>{{ schoolData.remarks || '-' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <!-- 담당자 정보 -->
                <h3 class="fw-bold section-title">담당자 정보</h3>
                <div class="card mb-4">
                  <div class="card-body p-0">
                    <table class="table table-bordered mb-0">
                      <colgroup>
                        <col style="width: 50%;">
                        <col style="width: 50%;">
                      </colgroup>
                      <tbody>
                        <tr>
                          <th class="bg-light">담당자명</th>
                          <td>{{ schoolData.managerName || '-' }}</td>
                        </tr>
                        <tr>
                          <th class="bg-light">담당자 전화</th>
                          <td>{{ schoolData.managerPhone || '-' }}</td>
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
import axios from 'axios';
import { defineComponent, ref, onMounted, computed } from "vue";
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
  name: string;
  // 기타 필요한 필드가 있을 경우 추가
}

export default defineComponent({
  name: "SchoolDetails",
  setup() {
    const router = useRouter();
    const schoolData = ref<ISchool | null>(null);
    const schoolTypeData = ref<ISchoolType | null>(null);
    const errorMessage = ref('');

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
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        schoolData.value = response.data.data;
        // schoolTypeId가 있으면 교육기관 유형 정보를 별도로 호출
        if (schoolData.value && schoolData.value.schoolTypeId) {
          fetchSchoolTypeData(schoolData.value.schoolTypeId);
        }
      } catch (error) {
        console.error('Error fetching school data:', error);
        errorMessage.value = '교육기관 정보를 불러오는 데 실패했습니다.';
      }
    };

    const fetchSchoolTypeData = async (schoolTypeId: number) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<{ success: boolean; code: number; message: string; data: ISchoolType }>(
          ApiUrl(`/admin/school-types/${schoolTypeId}`),
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        schoolTypeData.value = response.data.data;
      } catch (error) {
        console.error('Error fetching school type data:', error);
      }
    };

    // 구/군 값을 기준으로 권역을 계산하는 computed property
    const region = computed(() => {
      const district = schoolData.value?.district;
      if (!district) return '-';
      const zone1 = ['고양', '동두천', '양주', '연천', '김포', '파주'];
      const zone2 = ['의정부', '구리', '남양주', '가평', '포천'];
      const zone3 = ['성남', '과천', '하남', '광주', '앙평'];
      const zone4 = ['수원', '안양', '부천', '안산', '광명', '시흥', '군포', '의왕'];
      const zone5 = ['평택', '오산', '화성'];
      const zone6 = ['용인', '이천', '안성', '여주'];
      
      if (zone1.includes(district)) return '1권역';
      if (zone2.includes(district)) return '2권역';
      if (zone3.includes(district)) return '3권역';
      if (zone4.includes(district)) return '4권역';
      if (zone5.includes(district)) return '5권역';
      if (zone6.includes(district)) return '6권역';
      
      return '-';
    });

    onMounted(() => {
      fetchSchoolData();
    });

    const goBack = () => {
      router.push({ name: "admin-SchoolList"});
    };

    const goEdit = () => {
      if (schoolData.value) {
        router.push({ name: "admin-SchoolEdit", params: { id: schoolData.value.id } });
      } else {
        errorMessage.value = "교육기관 정보가 로드되지 않았습니다.";
      }
    };

    return {
      schoolData,
      schoolTypeData,
      errorMessage,
      region,
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

.accordion-button:not(.collapsed) {
  color: #0d6efd;
  background-color: #e7f1ff;
}

.accordion-button {
  font-weight: 600;
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

.bi-info-circle,
.bi-building {
  font-size: 1.2rem;
}

@media (max-width: 575.98px) {
  .row .col-md-6,
  .row .col-md-4,
  .row .col-md-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

.card-body strong {
  color: #495057;
}

.accordion-button i {
  color: #0d6efd;
}

.accordion-button.collapsed:hover,
.accordion-button:hover {
  background-color: #f1f3f5;
}

.card-header h5 {
  font-size: 1.1rem;
}

.border-end {
  border-right: 1px solid #dee2e6;
}

.table th.w-25 {
  width: 25%;
}

.table td,
.table th {
  padding: 0.75rem;
}

.card-body {
  padding: 1rem;
}
</style>
