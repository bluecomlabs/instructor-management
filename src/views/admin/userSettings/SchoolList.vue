<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title"></div>

      <div class="card-toolbar">
        <div class="card-toolbar d-flex justify-content-between align-items-center">
          <!-- 좌측: 선택된 항목 표시/삭제 버튼 -->
          <div class="d-flex justify-content-start align-items-center">
            <transition name="fade">
              <div v-if="selectedIds.length > 0" class="d-flex align-items-center">
                <div class="fw-bold me-5">
                  <span class="me-2">{{ selectedIds.length }}</span> 항목 선택됨
                </div>
                <div class="vertical-separator mx-3"></div>
                <div class="ms-4" style="margin-left: 0 !important">
                  <button
                    type="button"
                    class="btn btn-danger checkbox-button"
                    @click="onDeleteInstitutions"
                  >
                    기관 삭제
                  </button>
                </div>
                <div class="vertical-separator mx-3"></div>
              </div>
            </transition>
          </div>

          <!-- 우측: 기관 등록 버튼 -->
          <div class="d-flex justify-content-end align-items-center">
            <button
              tabindex="3"
              type="button"
              @click="onButtonAction"
              class="btn btn-light-primary checkbox-button"
            >
              <span class="indicator-label">기관 등록</span>
            </button>
          </div>
        </div>

        <!-- 필터 아이콘 & 필터 컴포넌트 -->
        <div class="card-toolbar">
          <button
            type="button"
            class="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-end"
            data-kt-menu-flip="top-end"
          >
            <!-- 아이콘 (예: 'category') -->
            <KTIcon icon-name="category" icon-class="fs-2" />
          </button>
          <!-- 필터 컴포넌트 (Dropdown) -->
          <SchoolListFilter @apply-filter="handleFilter" />
        </div>
      </div>
    </div>

    <div class="card-body pt-0 position-relative">
      <!-- 로딩 오버레이 -->
      <div v-if="isLoading" class="overlay">
        <div class="loader"></div>
      </div>

      <!-- KTDatatable (체크박스 및 컬럼 슬롯) -->
      <KTDatatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        :data="data"
        :header="headerConfig"
        :checkbox-enabled="true"
        @selection-change="onSelectionChange"
      >
        <!-- ====== [헤더 슬롯들] ====== -->
        <template v-slot:header-status>
          <div>상태</div>
        </template>
        <template v-slot:header-institutionName>
          <div>기관명</div>
        </template>
        <template v-slot:header-managerName>
          <div>관리자</div>
        </template>
        <template v-slot:header-phoneNumber>
          <div>전화번호</div>
        </template>
        <!-- 시+군/구 (주소) -->
        <template v-slot:header-address>
          <div>주소</div>
        </template>
        <!-- 도로명 주소 -->
        <template v-slot:header-street>
          <div>상세 주소</div>
        </template>
        <!-- 권역 -->
        <template v-slot:header-region>
          <div>권역</div>
        </template>

        <!-- ====== [본문 슬롯들] ====== -->
        <!-- 상태 -->
        <template v-slot:status="{ row: institution }">
          <div
            class="column-status"
            @click="onInstitutionClick(institution)"
            style="cursor: pointer;"
          >
            <span :class="['badge', 'py-3', 'px-4', 'fs-7', 'badge-light-' + statusColor[institution.status]]">
              {{ statusLabel[institution.status] }}
            </span>
          </div>
        </template>

        <!-- 기관명 -->
        <template v-slot:institutionName="{ row: institution }">
          <div
            class="column-institutionName"
            @click="onInstitutionClick(institution)"
            style="cursor: pointer;"
          >
            {{ institution.institutionName }}
          </div>
        </template>

        <!-- 관리자 -->
        <template v-slot:managerName="{ row: institution }">
          <div class="column-managerName">
            {{ institution.managerName }}
          </div>
        </template>

        <!-- 전화번호 -->
        <template v-slot:phoneNumber="{ row: institution }">
          <div class="column-phoneNumber">
            {{ institution.phoneNumber }}
          </div>
        </template>

        <!-- 주소 (city + district) -->
        <template v-slot:address="{ row: institution }">
          <div class="column-address">
            {{ institution.address }}
          </div>
        </template>

        <!-- 상세 주소 (street) -->
        <template v-slot:street="{ row: institution }">
          <div class="column-street">
            {{ institution.street }}
          </div>
        </template>

        <!-- 권역 (region) - 디자인 변경 -->
        <template v-slot:region="{ row: institution }">
          <div class="column-region" @click="onInstitutionClick(institution)" style="cursor: pointer;">
            <span :class="`badge py-3 px-4 fs-7 badge-light-${regionVariant[institution.region]}`">
              {{ institution.region }}
            </span>
          </div>
        </template>
      </KTDatatable>

      <!-- 페이지네이션 -->
      <div class="d-flex justify-content-end mt-4">
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li
              class="page-item"
              :class="{ disabled: currentPage === 0 }"
              @click="onPageChange(0)"
            >
              <a class="page-link">
                <i class="ki-duotone ki-double-left fs-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </a>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage === 0 }"
              @click="onPageChange(currentPage - 1)"
            >
              <i class="page-link ki-duotone ki-left fs-2"></i>
            </li>
            <li
              class="page-item"
              v-for="page in visiblePages"
              :key="page"
              :class="{ active: page === currentPage + 1 }"
              @click="onPageChange(page - 1)"
            >
              <a class="page-link" href="#">{{ page }}</a>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage + 1 === totalPages }"
              @click="onPageChange(currentPage + 1)"
            >
              <i class="page-link ki-duotone ki-right fs-2"></i>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage + 1 === totalPages }"
              @click="onPageChange(totalPages - 1)"
            >
              <a class="page-link">
                <i class="ki-duotone ki-double-right fs-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import axios from "axios";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import SchoolListFilter from "@/components/dropdown/SchoolListFilter.vue";
import { ApiUrl } from "@/assets/ts/_utils/api";

interface IApiSchool {
  id: number;
  businessId: number;
  schoolTypeId: number;
  name: string;
  city: string;
  district: string;
  street: string;
  number: string;
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

/** 실제 테이블에 표시할 데이터 구조 */
interface ITableSchool {
  id: number;
  institutionName: string;
  managerName: string;
  phoneNumber: string;
  address: string;
  street: string;
  region: string;
  status: string;
}

export default defineComponent({
  name: "kt-institution-list",
  components: {
    KTDatatable,
    SchoolListFilter,
  },
  setup() {
    const router = useRouter();

    // 테이블에 표시할 최종 데이터
    const data = ref<ITableSchool[]>([]);
    // 페이지네이션 관련
    const totalElements = ref(0);
    const totalPages = ref(0);
    const currentPage = ref(0);
    const pageSize = ref(10);

    // 선택된 아이템
    const selectedItems = ref<ITableSchool[]>([]);
    const selectedIds = ref<number[]>([]);
    // 로딩 상태
    const isLoading = ref(false);

    // 정렬 상태
    const isAscending = ref({
      status: true,
      institutionName: true,
      managerName: true,
      address: true,
    });
    const currentSortBy = ref("");

    // 필터 데이터
    const filters = ref<any>({});

    // 테이블 헤더 설정
    const headerConfig = ref([
      {
        columnName: "기관명",
        columnLabel: "institutionName",
        sortEnabled: true,
      },
      {
        columnName: "권역",
        columnLabel: "region",
        sortEnabled: false,
      },
      {
        columnName: "주소",
        columnLabel: "address",
        sortEnabled: true,
      },
      {
        columnName: "상세 주소",
        columnLabel: "street",
        sortEnabled: false,
      },
      {
        columnName: "전화번호",
        columnLabel: "phoneNumber",
        sortEnabled: false,
      },
      {
        columnName: "관리자",
        columnLabel: "managerName",
        sortEnabled: true,
      },
    ]);

    // 상태에 따른 배지 색상/라벨
    const statusColor: Record<string, string> = {
      ACTIVE: "primary",
      INACTIVE: "danger",
    };
    const statusLabel: Record<string, string> = {
      ACTIVE: "활성",
      INACTIVE: "비활성",
    };

    // 권역 버튼에 적용할 디자인용 variant 매핑
    const regionVariant: Record<string, string> = {
      "1권역": "primary",
      "2권역": "danger",
      "3권역": "warning",
      "4권역": "success",
      "5권역": "info",
      "6권역": "secondary",
    };

    // district 값에 따라 권역을 산출하는 헬퍼 함수
    const getRegion = (district: string): string => {
      const region1 = ["고양", "동두천", "양주", "연천", "김포", "파주"];
      const region2 = ["의정부", "구리", "남양주", "가평", "포천"];
      const region3 = ["성남", "과천", "하남", "광주", "앙평"];
      const region4 = ["수원", "안양", "부천", "안산", "광명", "시흥", "군포", "의왕"];
      const region5 = ["평택", "오산", "화성"];
      const region6 = ["용인", "이천", "안성", "여주"];
      if (region1.includes(district)) return "1권역";
      if (region2.includes(district)) return "2권역";
      if (region3.includes(district)) return "3권역";
      if (region4.includes(district)) return "4권역";
      if (region5.includes(district)) return "5권역";
      if (region6.includes(district)) return "6권역";
      return "-";
    };

    // 페이지네이션 계산
    const visiblePages = computed(() => {
      const range = 2;
      let startPage = Math.max(1, currentPage.value + 1 - range);
      let endPage = Math.min(totalPages.value, currentPage.value + 1 + range);

      if (endPage - startPage < range * 2) {
        if (startPage === 1) {
          endPage = Math.min(totalPages.value, startPage + range * 2);
        } else if (endPage === totalPages.value) {
          startPage = Math.max(1, endPage - range * 2);
        }
      }

      const pages: number[] = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    });

    /** ================ [API 호출 함수] ================ */
    const fetchInstitutions = async (
      page: number = 0,
      sortBy: string = currentSortBy.value,
      filterData = filters.value
    ) => {
      try {
        if (page === 0 && sortBy === "") isLoading.value = true;

        const token = localStorage.getItem("token");

        // URLSearchParams를 이용해 쿼리 파라미터 구성
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("size", pageSize.value.toString());

        if (sortBy) {
          // sortBy는 "&sort=name,asc" 형태이므로 처리
          const cleanSortBy = sortBy.startsWith("&") ? sortBy.slice(1) : sortBy;
          const [key, value] = cleanSortBy.split("=");
          if (key && value) {
            params.append(key, value);
          }
        }

        // 필터 데이터 추가
        if (filterData) {
          Object.keys(filterData).forEach((key) => {
            if (filterData[key]) {
              params.append(key, filterData[key]);
            }
          });
        }

        const finalUrl = ApiUrl(`/admin/schools?${params.toString()}`);
        console.log("[fetchInstitutions] Request URL:", finalUrl);
        console.log("[fetchInstitutions] Filters:", filterData);
        console.log("[fetchInstitutions] SortBy:", sortBy);

        // GET 요청
        const response = await axios.get(finalUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 응답 처리
        const responseData = response.data.data;
        data.value = responseData.content.map((school: IApiSchool) => {
          return {
            id: school.id,
            institutionName: school.name,
            managerName: school.managerName ?? "-",
            phoneNumber: school.representativeNumber ?? "-",
            address: `${school.city} ${school.district}`.trim() || "-",
            street: school.street || "-",
            region: getRegion(school.district),
            status: "ACTIVE",
          } as ITableSchool;
        });

        totalElements.value = responseData.totalElements;
        totalPages.value = responseData.totalPages;
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        isLoading.value = false;
      }
    };

    /** 컴포넌트 마운트 시 목록 불러오기 */
    onMounted(() => {
      fetchInstitutions();
    });

    /** ================ [정렬 처리] ================ */
    const sort = (sort: Sort) => {
      let sortBy = "";
      if (sort.label === "institutionName") {
        sortBy = isAscending.value.institutionName
          ? "&sort=name,asc"
          : "&sort=name,desc";
        isAscending.value.institutionName = !isAscending.value.institutionName;
      } else if (sort.label === "managerName") {
        sortBy = isAscending.value.managerName
          ? "&sort=managerName,asc"
          : "&sort=managerName,desc";
        isAscending.value.managerName = !isAscending.value.managerName;
      } else if (sort.label === "address") {
        sortBy = isAscending.value.address
          ? "&sort=district,asc"
          : "&sort=district,desc";
        isAscending.value.address = !isAscending.value.address;
      } else if (sort.label === "status") {
        sortBy = isAscending.value.status
          ? "&sort=status,asc"
          : "&sort=status,desc";
        isAscending.value.status = !isAscending.value.status;
      } else {
        return;
      }

      currentSortBy.value = sortBy;
      fetchInstitutions(currentPage.value, sortBy, filters.value);
    };

    /** ================ [필터 적용] ================ */
    const handleFilter = (filterData: any) => {
      filters.value = filterData;
      currentPage.value = 0;
      fetchInstitutions(0, currentSortBy.value, filterData);
    };

    /** ================ [체크박스 선택] ================ */
    const onItemSelect = (selected: number[]) => {
      selectedIds.value = selected;
    };
    const onSelectionChange = (selectedRows: ITableSchool[]) => {
      selectedItems.value = selectedRows;
      selectedIds.value = selectedRows.map((row) => row.id);
    };

    /** ================ [페이지 변경] ================ */
    const onPageChange = async (page: number) => {
      const currentScrollPosition = window.scrollY;
      currentPage.value = page;
      await fetchInstitutions(page, currentSortBy.value, filters.value);
      window.scrollTo(0, currentScrollPosition);
    };

    /** ================ [등록 버튼/삭제 버튼 등] ================ */
    const onButtonAction = () => {
      if (selectedItems.value.length > 0) {
        console.log("선택된 기관 삭제:", selectedItems.value);
      } else {
        router.push({ name: "admin-InstitutionAdd" });
      }
    };

    // 선택된 기관들 삭제
    const onDeleteInstitutions = () => {
      if (selectedIds.value.length > 0) {
        deleteFewInstitutions();
      }
    };

    // 다건 삭제
    const deleteFewInstitutions = async () => {
      const result = await Swal.fire({
        title: "기관 삭제 확인",
        text: "정말로 삭제하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
        customClass: {
          confirmButton: "btn fw-semibold btn-danger",
          cancelButton: "btn fw-semibold btn-light",
        },
        buttonsStyling: false,
      });
      if (result.isConfirmed) {
        try {
          for (const id of selectedIds.value) {
            await deleteInstitution(id);
          }
          selectedIds.value = [];
          Swal.fire({
            title: "삭제 완료",
            text: "선택된 기관이 삭제되었습니다.",
            icon: "success",
            customClass: { confirmButton: "btn fw-semibold btn-primary" },
          }).then(() => {
            window.location.reload();
          });
        } catch (error) {
          console.error("Error deleting institution: ", error);
          Swal.fire({
            title: "오류",
            text: "기관 삭제에 실패했습니다.",
            icon: "error",
            customClass: { confirmButton: "btn fw-semibold btn-danger" },
          });
        }
      }
    };

    // 단건 삭제
    const deleteInstitution = async (id: number) => {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(ApiUrl(`/admin/institutions/${id}`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        data.value = data.value.filter((inst) => inst.id !== id);
      } catch (error) {
        console.error("Error deleting institution: ", error);
      }
    };

    // 상세보기 이동
    const onInstitutionClick = (institution: ITableSchool) => {
      localStorage.setItem("selectedInstitutionId", institution.id.toString());
      router.push({
        name: "admin-InstitutionDetails",
        params: { id: institution.id },
      });
    };

    return {
      data,
      totalElements,
      totalPages,
      currentPage,
      pageSize,
      selectedItems,
      selectedIds,
      isLoading,
      isAscending,
      currentSortBy,
      filters,
      headerConfig,
      statusColor,
      statusLabel,
      regionVariant,
      visiblePages,
      fetchInstitutions,
      handleFilter,
      sort,
      onItemSelect,
      onSelectionChange,
      onPageChange,
      onButtonAction,
      onDeleteInstitutions,
      deleteFewInstitutions,
      deleteInstitution,
      onInstitutionClick,
    };
  },
});
</script>

<style scoped>
/* 로딩 오버레이 스타일 */
.overlay {
  position: absolute;
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

/* 테이블 */
.kt-datatable table {
  width: 100%;
  table-layout: auto;
}
.kt-datatable thead th {
  white-space: nowrap;
  overflow: visible;
  text-overflow: clip;
}
.kt-datatable tbody td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.kt-datatable tbody .column-status,
.kt-datatable tbody .column-institutionName,
.kt-datatable tbody .column-managerName,
.kt-datatable tbody .column-phoneNumber,
.kt-datatable tbody .column-address,
.kt-datatable tbody .column-street,
.kt-datatable tbody .column-region {
  max-width: 150px;
}
.kt-datatable thead .column-status,
.kt-datatable thead .column-institutionName,
.kt-datatable thead .column-managerName,
.kt-datatable thead .column-phoneNumber,
.kt-datatable thead .column-address,
.kt-datatable thead .column-street,
.kt-datatable thead .column-region {
  max-width: none;
}

/* Hover 효과 */
.kt-datatable tbody tr:hover {
  background-color: #f1f1f1;
}

/* Fade 트랜지션 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave {
  opacity: 1;
}

/* 기타 버튼/레이아웃 */
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

/* 페이지네이션 */
.pagination .page-item.active .page-link {
  background-color: #3699FF;
  border-color: #3699FF;
  color: #fff;
}
.pagination .page-link {
  cursor: pointer;
}
</style>
