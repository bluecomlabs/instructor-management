<template>
  <div class="d-flex flex-column flex-xl-row">
    <div class="flex-column flex-lg-row-auto w-100 mb-10">
      <div class="card mb-5 mb-xl-8">
        <div class="card-header border-0">
          <div class="card-title d-flex align-items-center">
            <i class="bi bi-plus-square me-2"></i>
            <h2 class="fw-bold m-0">교육기관 등록</h2>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="registerSchool">
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
                      <th class="bg-light">학교명</th>
                      <td colspan="3">
                        <input v-model="name" type="text" class="form-control" placeholder="학교명" />
                      </td>
                    </tr>
                    <tr>
                      <th class="bg-light">교육기관 유형</th>
                      <td colspan="3">
                        <select v-model="selectedSchoolTypeId" class="form-select">
                          <option disabled value="">선택하세요</option>
                          <option
                            v-for="option in schoolTypeOptions"
                            :key="option.id"
                            :value="option.id"
                          >
                            {{ option.name }}
                          </option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <th class="bg-light">전화번호</th>
                      <td>
                        <input
                          v-model="representativeNumber"
                          type="text"
                          class="form-control"
                          placeholder="전화번호"
                        />
                      </td>
                      <th class="bg-light">도시</th>
                      <td>경기도</td>
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
                      <th class="bg-light">세부주소</th>
                      <td colspan="3">
                        <input v-model="street" type="text" class="form-control" placeholder="세부주소" />
                      </td>
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
                        <input
                          v-model="managerName"
                          type="text"
                          class="form-control"
                          placeholder="담당자명"
                        />
                      </td>
                    </tr>
                    <tr>
                      <th class="bg-light">담당자 전화</th>
                      <td>
                        <input
                          v-model="managerPhone"
                          type="text"
                          class="form-control"
                          placeholder="담당자 전화"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="d-flex justify-content-end py-6 px-9">
              <button type="button" class="btn btn-light me-2" @click="goBack">뒤로</button>
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
  name: "SchoolRegister",
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
    const name = ref("");
    const representativeNumber = ref("");
    const district = ref("");
    const street = ref("");
    const managerName = ref("");
    const managerPhone = ref("");
    const remarks = ref("");

    // 구/군 드롭다운 옵션
    const districtOptions = [
      "고양",
      "동두천",
      "양주",
      "연천",
      "김포",
      "파주",
      "의정부",
      "구리",
      "남양주",
      "가평",
      "포천",
      "성남",
      "과천",
      "하남",
      "광주",
      "앙평",
      "수원",
      "안양",
      "부천",
      "안산",
      "광명",
      "시흥",
      "군포",
      "의왕",
      "평택",
      "오산",
      "화성",
      "용인",
      "이천",
      "안성",
      "여주",
    ];

    // 교육기관 유형 옵션
    const schoolTypeOptions = ref<ISchoolType[]>([]);
    const selectedSchoolTypeId = ref<number | null>(null);

    const fetchSchoolTypeOptions = async (businessIdVal: number) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          ApiUrl(`/admin/school-types?businessId=${businessIdVal}`),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // 응답 데이터의 content 배열 사용
        schoolTypeOptions.value = response.data.data.content;
      } catch (error) {
        console.error("Error fetching school type options:", error);
        errorMessage.value = "교육기관 유형 옵션을 불러오는데 실패했습니다.";
      }
    };

    onMounted(() => {
      if (businessId.value) {
        fetchSchoolTypeOptions(businessId.value);
      }
    });

    const registerSchool = async () => {
      // 모든 필드 체크 (trim 처리)
      if (
        !name.value.trim() ||
        !district.value.trim() ||
        !street.value.trim() ||
        !representativeNumber.value.trim() ||
        !managerName.value.trim() ||
        !managerPhone.value.trim() ||
        !remarks.value.trim() ||
        selectedSchoolTypeId.value === null
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
        schoolTypeId: selectedSchoolTypeId.value,
        name: name.value,
        city: "경기도",
        district: district.value,
        street: street.value,
        representativeNumber: representativeNumber.value,
        managerName: managerName.value,
        managerPhone: managerPhone.value,
        remarks: remarks.value,
      };

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(ApiUrl("/admin/schools"), body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "success",
          title: "등록 완료",
          text: "교육기관 정보가 성공적으로 등록되었습니다.",
        }).then(() => {
          router.push({ name: "admin-SchoolList" });
        });
      } catch (error) {
        console.error("Error registering school:", error);
        Swal.fire({
          icon: "error",
          title: "등록 실패",
          text: "교육기관 정보를 등록하는 데 실패했습니다.",
        });
      }
    };

    const goBack = () => {
      router.back();
    };

    return {
      errorMessage,
      name,
      representativeNumber,
      district,
      street,
      managerName,
      managerPhone,
      remarks,
      districtOptions,
      schoolTypeOptions,
      selectedSchoolTypeId,
      registerSchool,
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
