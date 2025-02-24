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
                    @click="onDeleteCourses"
                  >
                    교육 삭제
                  </button>
                </div>
                <div class="vertical-separator mx-3"></div>
              </div>
            </transition>
          </div>

          <!-- 우측: 교육 등록 버튼 -->
          <div class="d-flex justify-content-end align-items-center">
            <button
              tabindex="3"
              type="button"
              @click="onButtonAction"
              class="btn btn-light-primary checkbox-button"
            >
              <span class="indicator-label">교육 등록</span>
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
            <KTIcon icon-name="category" icon-class="fs-2" />
          </button>
          <!-- 필터 컴포넌트 (Dropdown) -->
          <CourseListFilter @apply-filter="handleFilter" />
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
        <template v-slot:header-courseName>
          <div>과정명</div>
        </template>
        <template v-slot:header-schoolName>
          <div>학교명</div>
        </template>
        <template v-slot:header-businessName>
          <div>사업자명</div>
        </template>
        <template v-slot:header-startDate>
          <div>시작일</div>
        </template>
        <template v-slot:header-endDate>
          <div>종료일</div>
        </template>

        <!-- ====== [본문 슬롯들] ====== -->
        <!-- 상태 -->
        <template v-slot:status="{ row: course }">
          <div
            class="column-status"
            @click="onCourseClick(course)"
            style="cursor: pointer;"
          >
            <span :class="['badge', 'py-3', 'px-4', 'fs-7', 'badge-light-' + statusColor[course.status]]">
              {{ statusLabel[course.status] }}
            </span>
          </div>
        </template>

        <!-- 과정명 -->
        <template v-slot:courseName="{ row: course }">
          <div
            class="column-courseName"
            @click="onCourseClick(course)"
            style="cursor: pointer;"
          >
            {{ course.courseName }}
          </div>
        </template>

        <!-- 학교명 -->
        <template v-slot:schoolName="{ row: course }">
          <div class="column-schoolName">
            {{ course.schoolName }}
          </div>
        </template>

        <!-- 사업자명 -->
        <template v-slot:businessName="{ row: course }">
          <div class="column-businessName">
            {{ course.businessName }}
          </div>
        </template>

        <!-- 시작일 -->
        <template v-slot:startDate="{ row: course }">
          <div class="column-startDate">
            {{ course.startDate }}
          </div>
        </template>

        <!-- 종료일 -->
        <template v-slot:endDate="{ row: course }">
          <div class="column-endDate">
            {{ course.endDate }}
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
import CourseListFilter from "@/components/dropdown/CourseListFilter.vue";
import { ApiUrl } from "@/assets/ts/_utils/api";

interface IApiCourse {
  id: number;
  businessId: number;
  businessName: string;
  schoolId: number;
  schoolName: string;
  programId: number;
  courseName: string;
  description: string;
  startDate: string;
  endDate: string;
  confirmed: boolean;
  status: string;
  remarks: string;
  createdAt: number;
  createdId: number;
  updatedAt: number | null;
  updatedId: number | null;
}

/** 실제 테이블에 표시할 데이터 구조 */
interface ITableCourse {
  id: number;
  courseName: string;
  schoolName: string;
  businessName: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}

export default defineComponent({
  name: "kt-course-list",
  components: {
    KTDatatable,
    CourseListFilter,
  },
  setup() {
    const router = useRouter();

    // 테이블에 표시할 최종 데이터
    const data = ref<ITableCourse[]>([]);
    // 페이지네이션 관련
    const totalElements = ref(0);
    const totalPages = ref(0);
    const currentPage = ref(0);
    const pageSize = ref(5);

    // 선택된 아이템
    const selectedItems = ref<ITableCourse[]>([]);
    const selectedIds = ref<number[]>([]);
    // 로딩 상태
    const isLoading = ref(false);

    // 정렬 상태
    const isAscending = ref({
      courseName: true,
      schoolName: true,
      businessName: true,
      startDate: true,
      status: true,
    });
    const currentSortBy = ref("");

    // 필터 데이터
    const filters = ref<any>({});

    // 테이블 헤더 설정
    const headerConfig = ref([
      {
        columnName: "과정명",
        columnLabel: "courseName",
        sortEnabled: true,
      },
      {
        columnName: "학교명",
        columnLabel: "schoolName",
        sortEnabled: true,
      },
      {
        columnName: "사업자명",
        columnLabel: "businessName",
        sortEnabled: true,
      },
      {
        columnName: "시작일",
        columnLabel: "startDate",
        sortEnabled: true,
      },
      {
        columnName: "종료일",
        columnLabel: "endDate",
        sortEnabled: false,
      },
    ]);

    // 상태에 따른 배지 색상/라벨 (필요에 따라 수정)
    const statusColor: Record<string, string> = {
      CONFIRMED: "primary",
      OPEN: "success",
      CLOSED: "danger",
    };
    const statusLabel: Record<string, string> = {
      CONFIRMED: "확정",
      OPEN: "모집중",
      CLOSED: "종료",
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
    const fetchCourses = async (
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
          // sortBy는 "&sort=xxx,asc" 형태이므로 처리
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

        const finalUrl = ApiUrl(`/admin/courses?${params.toString()}`);
        console.log("[fetchCourses] Request URL:", finalUrl);
        console.log("[fetchCourses] Filters:", filterData);
        console.log("[fetchCourses] SortBy:", sortBy);

        // GET 요청
        const response = await axios.get(finalUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 응답 처리
        const responseData = response.data.data;
        data.value = responseData.content.map((course: IApiCourse) => {
          return {
            id: course.id,
            courseName: course.courseName,
            schoolName: course.schoolName,
            businessName: course.businessName,
            description: course.description,
            startDate: course.startDate,
            endDate: course.endDate,
            status: course.status,
          } as ITableCourse;
        });

        totalElements.value = responseData.totalElements;
        totalPages.value = responseData.totalPages;
      } catch (error) {
        console.error("Error fetching courses: ", error);
      } finally {
        isLoading.value = false;
      }
    };

    /** 컴포넌트 마운트 시 목록 불러오기 */
    onMounted(() => {
      fetchCourses();
    });

    /** ================ [정렬 처리] ================ */
    const sort = (sort: Sort) => {
      let sortBy = "";
      if (sort.label === "courseName") {
        sortBy = isAscending.value.courseName
          ? "&sort=courseName,asc"
          : "&sort=courseName,desc";
        isAscending.value.courseName = !isAscending.value.courseName;
      } else if (sort.label === "schoolName") {
        sortBy = isAscending.value.schoolName
          ? "&sort=schoolName,asc"
          : "&sort=schoolName,desc";
        isAscending.value.schoolName = !isAscending.value.schoolName;
      } else if (sort.label === "businessName") {
        sortBy = isAscending.value.businessName
          ? "&sort=businessName,asc"
          : "&sort=businessName,desc";
        isAscending.value.businessName = !isAscending.value.businessName;
      } else if (sort.label === "startDate") {
        sortBy = isAscending.value.startDate
          ? "&sort=startDate,asc"
          : "&sort=startDate,desc";
        isAscending.value.startDate = !isAscending.value.startDate;
      } else if (sort.label === "status") {
        sortBy = isAscending.value.status
          ? "&sort=status,asc"
          : "&sort=status,desc";
        isAscending.value.status = !isAscending.value.status;
      } else {
        return;
      }

      currentSortBy.value = sortBy;
      fetchCourses(currentPage.value, sortBy, filters.value);
    };

    /** ================ [필터 적용] ================ */
    const handleFilter = (filterData: any) => {
      filters.value = filterData;
      currentPage.value = 0;
      fetchCourses(0, currentSortBy.value, filterData);
    };

    /** ================ [체크박스 선택] ================ */
    const onItemSelect = (selected: number[]) => {
      selectedIds.value = selected;
    };
    const onSelectionChange = (selectedRows: ITableCourse[]) => {
      selectedItems.value = selectedRows;
      selectedIds.value = selectedRows.map((row) => row.id);
    };

    /** ================ [페이지 변경] ================ */
    const onPageChange = async (page: number) => {
      const currentScrollPosition = window.scrollY;
      currentPage.value = page;
      await fetchCourses(page, currentSortBy.value, filters.value);
      window.scrollTo(0, currentScrollPosition);
    };

    /** ================ [등록 버튼/삭제 버튼 등] ================ */
    const onButtonAction = () => {
      if (selectedItems.value.length > 0) {
        console.log("선택된 교육 삭제:", selectedItems.value);
      } else {
        router.push({ name: "admin-CouresAdd" });
      }
    };

    // 선택된 교육들 삭제
    const onDeleteCourses = () => {
      if (selectedIds.value.length > 0) {
        deleteFewCourses();
      }
    };

    // 다건 삭제
    const deleteFewCourses = async () => {
      const result = await Swal.fire({
        title: "교육 삭제 확인",
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
        console.log("[deleteFewCourses] 선택된 교육 ID:", selectedIds.value);
        try {
          for (const id of selectedIds.value) {
            await deleteCourse(id);
          }
          selectedIds.value = [];
          Swal.fire({
            title: "삭제 완료",
            text: "선택된 교육이 삭제되었습니다.",
            icon: "success",
            customClass: { confirmButton: "btn fw-semibold btn-primary" },
          }).then(() => {
            window.location.reload();
          });
        } catch (error) {
          console.error("Error deleting course: ", error);
          Swal.fire({
            title: "오류",
            text: "교육 삭제에 실패했습니다.",
            icon: "error",
            customClass: { confirmButton: "btn fw-semibold btn-danger" },
          });
        }
      }
    };


    // 삭제
    const deleteCourse = async (id: number) => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = ApiUrl(`/admin/courses/${id}`);
        console.log("[deleteCourse] 호출 URL:", apiUrl);
        const response = await axios.delete(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("[deleteCourse] 응답 데이터:", response.data);
        // 삭제 후 data 배열에서 해당 id 제거
        data.value = data.value.filter((course) => course.id !== id);
      } catch (error) {
        console.error("Error deleting course: ", error);
      }
    };



    // 상세보기 이동
    const onCourseClick = (course: ITableCourse) => {
      localStorage.setItem("selectedCourseId", course.id.toString());
      router.push({
        name: "admin-CouresDetails",
        params: { id: course.id },
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
      visiblePages,
      fetchCourses,
      handleFilter,
      sort,
      onItemSelect,
      onSelectionChange,
      onPageChange,
      onButtonAction,
      onDeleteCourses,
      deleteFewCourses,
      deleteCourse,
      onCourseClick,
    };
  },
});
</script>

<style scoped>
/* 로딩 오버레이 스타일 */
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
.kt-datatable tbody .column-courseName,
.kt-datatable tbody .column-schoolName,
.kt-datatable tbody .column-businessName,
.kt-datatable tbody .column-startDate,
.kt-datatable tbody .column-endDate {
  max-width: 150px;
}
.kt-datatable thead .column-status,
.kt-datatable thead .column-courseName,
.kt-datatable thead .column-schoolName,
.kt-datatable thead .column-businessName,
.kt-datatable thead .column-startDate,
.kt-datatable thead .column-endDate {
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
