<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="d-flex align-items-center me-3">
        <select v-model="filterNewStatus" class="form-select checkbox-button dropdown-button">
          <option value="INIT">대기</option>
          <option value="READY">오픈 예정</option>
          <option value="OPEN">강사 공개</option>
          <option value="APPRIED">신청 마감</option>
          <option value="CONFIRMED">확정</option>
          <option value="PAUSE">중지</option>
          <option value="CANCEL">취소</option>
        </select>
        <button type="button" class="checkbox-button btn btn-primary ms-2" @click="applyStatusFilter">
          전체 상태 적용
        </button>
      </div>
      <div class="card-toolbar">
        <div class="card-toolbar d-flex justify-content-between align-items-center">
          <div class="d-flex justify-content-start align-items-center">
            <transition name="fade">
              <div v-if="selectedIds.length > 0" class="d-flex align-items-center">
                <div class="fw-bold me-5">
                  <span class="me-2">{{ selectedIds.length }}</span> 항목 선택됨
                </div>
                <div class="vertical-separator mx-3"></div>
                <div class="d-flex align-items-center me-3" style="margin-right: 0 !important">
                  <div class="dropdown me-2">
                    <select v-model="selectedStatus" class="form-select checkbox-button dropdown-button">
                      <option value="INIT">대기</option>
                      <option value="READY">오픈 예정</option>
                      <option value="OPEN">강사 공개</option>
                      <option value="APPRIED">신청 마감</option>
                      <option value="CONFIRMED">확정</option>
                      <option value="PAUSE">중지</option>
                      <option value="CANCEL">취소</option>
                    </select>
                  </div>
                  <button type="button" class="btn btn-primary checkbox-button" @click="changeCourseStatus">
                    상태 변경
                  </button>
                </div>
                <div class="vertical-separator mx-3"></div>
              </div>
            </transition>
          </div>
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
            <!-- 필터링 드롭다운 컴포넌트 -->
            <EduStatusFilter @apply-filter="handleFilter"></EduStatusFilter>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body pt-0">
      <div v-if="isLoading" class="overlay">
        <div class="loader"></div>
      </div>
      <KTDatatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        :data="data"
        :header="headerConfig"
        :checkbox-enabled="true"
        @selection-change="onSelectionChange"
      >
        <!-- 각 컬럼에 대해 클릭 시 상세페이지로 이동 -->
        <template v-slot:status="{ row: course }">
          <div class="column-status" @click="onCourseClick(course)" style="cursor: pointer;">
            <span :class="`badge py-3 px-4 fs-7 badge-light-${statusColor[course.status]}`">
              {{ statusLabel[course.status] }}
            </span>
          </div>
        </template>
        <template v-slot:courseName="{ row: course }">
          <div class="column-courseName" style="cursor: pointer;">
            {{ course.courseName }}
          </div>
        </template>
        <template v-slot:programName="{ row: course }">
          <div class="column-programName" style="cursor: pointer;">
            {{ course.programName }}
          </div>
        </template>
        <template v-slot:businessName="{ row: course }">
          <div class="column-businessName" style="cursor: pointer;">
            {{ course.businessName }}
          </div>
        </template>
        <template v-slot:startDate="{ row: course }">
          <div class="column-startDate" style="cursor: pointer;">
            {{ course.startDate }}
          </div>
        </template>
        <template v-slot:endDate="{ row: course }">
          <div class="column-endDate" style="cursor: pointer;">
            {{ course.endDate }}
          </div>
        </template>
      </KTDatatable>
      <!-- 페이지네이션 영역 -->
      <div class="d-flex justify-content-end mt-4">
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 0 }" @click="onPageChange(0)">
              <a class="page-link">
                <i class="ki-duotone ki-double-left fs-2"></i>
              </a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === 0 }" @click="onPageChange(currentPage - 1)">
              <i class="page-link ki-duotone ki-left fs-2"></i>
            </li>
            <li class="page-item" v-for="page in visiblePages" :key="page" :class="{ active: page === currentPage + 1 }" @click="onPageChange(page - 1)">
              <a class="page-link" href="#">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage + 1 === totalPages }" @click="onPageChange(currentPage + 1)">
              <i class="page-link ki-duotone ki-right fs-2"></i>
            </li>
            <li class="page-item" :class="{ disabled: currentPage + 1 === totalPages }" @click="onPageChange(totalPages - 1)">
              <a class="page-link">
                <i class="ki-duotone ki-double-right fs-2"></i>
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
import EduStatusFilter from "@/components/dropdown/EduStatusFilter.vue";
import { ApiUrl } from "@/assets/ts/_utils/api";

interface ICourse {
  id: number;
  businessId: number;
  businessName: string;
  schoolId: number;
  schoolName: string;
  programId: number;
  programName: string;
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
  assignmentStatus: any;
}

export default defineComponent({
  name: "kt-course-list",
  components: {
    KTDatatable,
    EduStatusFilter,
  },
  setup() {
    const router = useRouter();
    const data = ref<Array<ICourse>>([]);
    const totalElements = ref<number>(0);
    const totalPages = ref<number>(0);
    const currentPage = ref<number>(0);
    const pageSize = ref<number>(10);
    const search = ref<string>("");
    const selectedItems = ref<Array<ICourse>>([]);
    const selectedIds = ref<Array<number>>([]);
    const selectedStatus = ref("INIT");
    const filterNewStatus = ref("INIT");

    // 부모와 필터링 컴포넌트에서 동일하게 사용할 필터 항목
    const filters = ref({
      status: "",
      courseName: "",
      programName: "",
      businessName: "",
      startDate: "",
      endDate: ""
    });

    const buildFilterQuery = (filtersData) => {
      let query = "";
      if (filtersData.status) {
        query += `&status=${encodeURIComponent(filtersData.status)}`;
      }
      if (filtersData.courseName) {
        query += `&courseName=${encodeURIComponent(filtersData.courseName)}`;
      }
      if (filtersData.programName) {
        query += `&programName=${encodeURIComponent(filtersData.programName)}`;
      }
      if (filtersData.businessName) {
        query += `&businessName=${encodeURIComponent(filtersData.businessName)}`;
      }
      if (filtersData.startDate) {
        query += `&startDate=${encodeURIComponent(filtersData.startDate)}`;
      }
      if (filtersData.endDate) {
        query += `&endDate=${encodeURIComponent(filtersData.endDate)}`;
      }
      return query;
    };

    const currentSortBy = ref<string>("");
    const isLoading = ref<boolean>(false);
    const isAscending = ref({
      status: true,
      businessName: true,
      courseName: true,
      programName: true,
      startDate: true,
      endDate: true,
    });

    const headerConfig = ref([
      { columnName: "상태", columnLabel: "status", sortEnabled: true, columnWidth: 100 },
      { columnName: "과정명", columnLabel: "courseName", sortEnabled: true, columnWidth: 150 },
      { columnName: "프로그램명", columnLabel: "programName", sortEnabled: true, columnWidth: 150 },
      { columnName: "교육기관명", columnLabel: "businessName", sortEnabled: true, columnWidth: 150 },
      { columnName: "시작 날짜", columnLabel: "startDate", sortEnabled: true, columnWidth: 150 },
      { columnName: "종료 날짜", columnLabel: "endDate", sortEnabled: true, columnWidth: 150 },
    ]);

    const statusColor = {
      INIT: "secondary",
      READY: "primary",
      OPEN: "success",
      APPRIED: "info",
      CONFIRMED: "primary",
      PAUSE: "warning",
      CANCEL: "danger",
    };

    const statusLabel = {
      INIT: "대기",
      READY: "오픈 예정",
      OPEN: "강사 공개",
      APPRIED: "신청 마감",
      CONFIRMED: "확정",
      PAUSE: "중지",
      CANCEL: "취소",
    };

    const fetchCourses = async (
      page: number = 0,
      sortBy: string = currentSortBy.value,
      filtersData = filters.value
    ) => {
      try {
        if (page === 0 && sortBy === "") isLoading.value = true;
        const token = localStorage.getItem("token");
        const filterQuery = buildFilterQuery(filtersData);
        const response = await axios.get(
          ApiUrl(`/admin/courses?page=${page}&size=${pageSize.value}&search=${search.value}${sortBy}${filterQuery}`),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const responseData = response.data.data;
        data.value = responseData.content.map((course: ICourse) => ({
          ...course,
          courseName: course.courseName || "-",
          businessName: course.businessName || "-",
          programName: course.programName || "-",
          startDate: course.startDate || "-",
          endDate: course.endDate || "-",
          status: course.status || "-",
        }));
        totalElements.value = responseData.totalElements;
        totalPages.value = responseData.totalPages;
      } catch (error) {
        console.error("Error fetching courses: ", error);
      } finally {
        isLoading.value = false;
      }
    };

    const handleFilter = (filterData) => {
      filters.value = filterData;
      currentPage.value = 0;
      fetchCourses(currentPage.value, currentSortBy.value, filters.value);
    };

    const visiblePages = computed<Array<number>>(() => {
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
      const pages: Array<number> = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    });

    onMounted(() => {
      fetchCourses(currentPage.value, currentSortBy.value, filters.value);
    });

    const changeCourseStatus = async () => {
      const token = localStorage.getItem("token");
      let idsToUpdate = selectedIds.value;
      if (idsToUpdate.length === 0) {
        idsToUpdate = data.value.map((course) => course.id);
      }
      const result = await Swal.fire({
        title: "상태 변경 확인",
        text: idsToUpdate.length === data.value.length
          ? "현재 테이블에 있는 모든 과정의 상태를 변경하시겠습니까?"
          : "선택한 과정의 상태를 변경하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "예",
        cancelButtonText: "아니오",
        customClass: {
          confirmButton: "btn fw-semibold btn-primary",
          cancelButton: "btn fw-semibold btn-light",
        },
        buttonsStyling: false,
      });
      if (!result.isConfirmed) return;
      try {
        const requestBody = {
          courseIds: selectedIds.value.length ? selectedIds.value : data.value.map(course => course.id),
          newStatus: selectedStatus.value,
        };
        await axios.put(ApiUrl(`/admin/courses/status`), requestBody, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          title: "상태 변경 완료",
          text: "과정의 상태가 변경되었습니다.",
          icon: "success",
          customClass: { confirmButton: "btn fw-semibold btn-primary" },
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error("Error changing course status: ", error);
        Swal.fire({
          title: "오류",
          text: "과정 상태 변경에 실패했습니다.",
          icon: "error",
          customClass: { confirmButton: "btn fw-semibold btn-danger" },
        });
      }
    };

    const applyStatusFilter = async () => {
      const token = localStorage.getItem("token");
      let idsToUpdate = selectedIds.value;
      if (idsToUpdate.length === 0) {
        idsToUpdate = data.value.map(course => course.id);
      }
      const result = await Swal.fire({
        title: "상태 필터 적용 확인",
        text: idsToUpdate.length === data.value.length
          ? "현재 테이블에 있는 모든 과정의 상태를 변경하시겠습니까?"
          : "선택한 과정의 상태를 변경하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "예",
        cancelButtonText: "아니오",
        customClass: {
          confirmButton: "btn fw-semibold btn-primary",
          cancelButton: "btn fw-semibold btn-light",
        },
        buttonsStyling: false,
      });
      if (!result.isConfirmed) return;
      const requestBody = {
        courseIds: idsToUpdate,
        newStatus: filterNewStatus.value,
      };
      try {
        await axios.put(ApiUrl(`/admin/courses/status`), requestBody, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          title: "필터 적용 완료",
          text: "선택된 과정의 상태가 변경되었습니다.",
          icon: "success",
          customClass: { confirmButton: "btn fw-semibold btn-primary" },
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error("Error applying status filter: ", error);
        Swal.fire({
          title: "오류",
          text: "과정 상태 변경에 실패했습니다.",
          icon: "error",
          customClass: { confirmButton: "btn fw-semibold btn-danger" },
        });
      }
    };

    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    const onSelectionChange = (selectedRows: Array<ICourse>) => {
      selectedItems.value = selectedRows;
    };

    const onPageChange = async (page: number) => {
      const currentScrollPosition = window.scrollY;
      currentPage.value = page;
      await fetchCourses(page, currentSortBy.value, filters.value);
      window.scrollTo(0, currentScrollPosition);
    };

    const sort = (sort: Sort) => {
      let sortBy = "";
      if (sort.label === "status") {
        sortBy = isAscending.value.status ? "&sort=status,asc" : "&sort=status,desc";
        isAscending.value.status = !isAscending.value.status;
      } else if (sort.label === "businessName") {
        sortBy = isAscending.value.businessName ? "&sort=businessName,asc" : "&sort=businessName,desc";
        isAscending.value.businessName = !isAscending.value.businessName;
      } else if (sort.label === "courseName") {
        sortBy = isAscending.value.courseName ? "&sort=courseName,asc" : "&sort=courseName,desc";
        isAscending.value.courseName = !isAscending.value.courseName;
      } else if (sort.label === "programName") {
        sortBy = isAscending.value.programName ? "&sort=programName,asc" : "&sort=programName,desc";
        isAscending.value.programName = !isAscending.value.programName;
      } else if (sort.label === "startDate") {
        sortBy = isAscending.value.startDate ? "&sort=startDate,asc" : "&sort=startDate,desc";
        isAscending.value.startDate = !isAscending.value.startDate;
      } else if (sort.label === "endDate") {
        sortBy = isAscending.value.endDate ? "&sort=endDate,asc" : "&sort=endDate,desc";
        isAscending.value.endDate = !isAscending.value.endDate;
      } else {
        return;
      }
      currentSortBy.value = sortBy;
      fetchCourses(currentPage.value, sortBy, filters.value);
    };

    const onCourseClick = (course: ICourse) => {
      localStorage.setItem("selectedCourseId", course.id.toString());
      router.push({ name: "admin-CourseDetails", params: { id: course.id } });
    };

    return {
      search,
      data,
      headerConfig,
      currentPage,
      totalPages,
      onPageChange,
      visiblePages,
      selectedItems,
      onSelectionChange,
      onItemSelect,
      sort,
      onCourseClick,
      selectedIds,
      isLoading,
      isAscending,
      currentSortBy,
      filters,
      handleFilter,
      statusColor,
      statusLabel,
      changeCourseStatus,
      selectedStatus,
      filterNewStatus,
      fetchCourses,
      applyStatusFilter
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
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
.column-status,
.column-courseName,
.column-businessName,
.column-programName,
.column-startDate,
.column-endDate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
</style>
