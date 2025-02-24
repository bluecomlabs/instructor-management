<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title"></div>
      <div class="card-toolbar">
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
          <EduViewFilter @apply-filter="handleFilter" />
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
        :checkbox-enabled="false"
        @selection-change="onSelectionChange"
      >
        <template v-slot:courseName="{ row: course }">
          <div class="column-courseName" @click="onProgramClick(course)" style="cursor: pointer;">
            {{ course.courseName }}
          </div>
        </template>
        <template v-slot:programName="{ row: course }">
          <div class="column-programName" @click="onProgramClick(course)" style="cursor: pointer;">
            {{ course.programName }}
          </div>
        </template>
        <template v-slot:schoolName="{ row: course }">
          <div class="column-schoolName" @click="onProgramClick(course)" style="cursor: pointer;">
            {{ course.schoolName }}
          </div>
        </template>
        <template v-slot:startDate="{ row: course }">
          <div class="column-startDate" @click="onProgramClick(course)" style="cursor: pointer;">
            {{ course.startDate }}
          </div>
        </template>
        <template v-slot:endDate="{ row: course }">
          <div class="column-endDate" @click="onProgramClick(course)" style="cursor: pointer;">
            {{ course.endDate }}
          </div>
        </template>
        <template v-slot:remarks="{ row: course }">
          <div class="column-remarks" @click="onProgramClick(course)" style="cursor: pointer;">
            {{ course.remarks }}
          </div>
        </template>
        <!-- 신청 컬럼 개선 디자인 -->
        <template v-slot:apply="{ row: course }">
          <div v-if="course.userAssignmentType" class="applied-wrapper">
            <span class="applied-badge">
              <i class="bi bi-check-circle-fill"></i>
              {{ course.userAssignmentType }} 신청됨
            </span>
            <button class="btn btn-sm btn-outline-danger ms-2 cancel-btn" @click="cancelInstructor(course)">
              <i class="bi bi-x-circle"></i> 취소
            </button>
          </div>
          <div v-else class="apply-btns">
            <button class="btn btn-sm btn-primary me-2 apply-btn" @click="applyInstructor(course, '주강사')">
              <i class="bi bi-person-fill"></i> 주강사 신청
            </button>
            <button class="btn btn-sm btn-secondary apply-btn" @click="applyInstructor(course, '보조강사')">
              <i class="bi bi-people-fill"></i> 보조강사 신청
            </button>
          </div>
        </template>
      </KTDatatable>

      <div class="d-flex justify-content-end mt-4">
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 0 }" @click="onPageChange(0)">
              <a class="page-link">
                <i class="ki-duotone ki-double-left fs-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === 0 }" @click="onPageChange(currentPage - 1)">
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
import EduViewFilter from "@/components/dropdown/EduViewFilter.vue";
import { ApiUrl } from "@/assets/ts/_utils/api";

interface ICourse {
  id: number;
  courseName: string | null;
  programName: string | null;
  schoolName: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string;
  remarks: string | null;
  userAssignmentType?: string | null;
  isPartialAssignment?: boolean;
}

export default defineComponent({
  name: "kt-course-list",
  components: {
    KTDatatable,
    EduViewFilter,
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

    // headerConfig에 '신청' 컬럼 추가
    const headerConfig = ref([
      { columnName: "과정명", columnLabel: "courseName", sortEnabled: true, columnWidth: 150 },
      { columnName: "프로그램명", columnLabel: "programName", sortEnabled: true, columnWidth: 150 },
      { columnName: "교육기관명", columnLabel: "schoolName", sortEnabled: true, columnWidth: 150 },
      { columnName: "시작일", columnLabel: "startDate", sortEnabled: true, columnWidth: 150 },
      { columnName: "종료일", columnLabel: "endDate", sortEnabled: true, columnWidth: 150 },
      { columnName: "비고", columnLabel: "remarks", sortEnabled: false, columnWidth: 200 },
      { columnName: "신청", columnLabel: "apply", sortEnabled: false, columnWidth: 220 },
    ]);

    const isLoading = ref<boolean>(false);
    const isAscending = ref({
      courseName: true,
      programName: true,
      schoolName: true,
      startDate: true,
      endDate: true,
      status: true,
    });
    const currentSortBy = ref<string>("");

    const filters = ref({});

    const handleFilter = (filterData: any) => {
      filters.value = filterData;
      currentPage.value = 0;
      fetchCourses(0, currentSortBy.value, filters.value);
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

    const fetchCourses = async (
      page: number = 0,
      sortBy: string = currentSortBy.value,
      filterData = filters.value,
      showLoader: boolean = true
    ) => {
      try {
        if (showLoader && page === 0 && !sortBy) isLoading.value = true;
        const token = localStorage.getItem("token");
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("size", pageSize.value.toString());
        params.append("search", search.value);

        if (sortBy) {
          const [field, direction] = sortBy.split(",");
          if (field && direction) {
            params.append("sort", `${field},${direction}`);
          }
        }
        Object.keys(filterData).forEach((key) => {
          if (filterData[key]) {
            params.append(key, filterData[key]);
          }
        });
        const requestUrl = ApiUrl(`/user/courses/open?${params.toString()}`);
        console.log("API 호출 URL:", requestUrl);
        const response = await axios.get(requestUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = response.data.data;
        data.value = responseData.content.map((course: any) => ({
          id: course.id,
          courseName: course.courseName || "-",
          programName: course.programName || "-",
          schoolName: course.schoolName || "-",
          startDate: course.startDate || "-",
          endDate: course.endDate || "-",
          status: course.status || "-",
          remarks: course.remarks || "-",
          userAssignmentType: course.userAssignmentType || null,
          isPartialAssignment: course.isPartialAssignment || false,
        }));

        totalElements.value = responseData.totalElements;
        totalPages.value = responseData.totalPages;
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        if (showLoader) {
          isLoading.value = false;
        }
      }
    };

    onMounted(() => {
      fetchCourses();
    });

    const sort = (sort: Sort) => {
      let sortBy = "";
      if (sort.label === "courseName") {
        sortBy = isAscending.value.courseName ? "courseName,asc" : "courseName,desc";
        isAscending.value.courseName = !isAscending.value.courseName;
      } else if (sort.label === "programName") {
        sortBy = isAscending.value.programName ? "programName,asc" : "programName,desc";
        isAscending.value.programName = !isAscending.value.programName;
      } else if (sort.label === "schoolName") {
        sortBy = isAscending.value.schoolName ? "schoolName,asc" : "schoolName,desc";
        isAscending.value.schoolName = !isAscending.value.schoolName;
      } else if (sort.label === "startDate") {
        sortBy = isAscending.value.startDate ? "startDate,asc" : "startDate,desc";
        isAscending.value.startDate = !isAscending.value.startDate;
      } else if (sort.label === "endDate") {
        sortBy = isAscending.value.endDate ? "endDate,asc" : "endDate,desc";
        isAscending.value.endDate = !isAscending.value.endDate;
      } else if (sort.label === "status") {
        sortBy = isAscending.value.status ? "status,asc" : "status,desc";
        isAscending.value.status = !isAscending.value.status;
      } else {
        return;
      }
      currentSortBy.value = sortBy;
      fetchCourses(currentPage.value, sortBy, filters.value);
    };

    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    const searchItems = () => {
      currentPage.value = 0;
      fetchCourses(0, currentSortBy.value, filters.value);
    };

    const onPageChange = async (page: number) => {
      const currentScrollPosition = window.scrollY;
      currentPage.value = page;
      await fetchCourses(page, currentSortBy.value, filters.value);
      window.scrollTo(0, currentScrollPosition);
    };

    const onSelectionChange = (selectedRows: Array<ICourse>) => {
      selectedItems.value = selectedRows;
    };

    const onButtonAction = () => {
      if (selectedItems.value.length > 0) {
        console.log("선택된 과정 삭제:", selectedItems.value);
      } else {
        router.push({ name: "admin-CourseAdd" });
      }
    };

    const onProgramClick = (course: ICourse) => {
      localStorage.setItem("selectedCourseId", course.id.toString());
      router.push({ name: "user-EduApplDetails", params: { id: course.id } });
    };

    // 강사 신청 API 호출
    const applyInstructor = async (course: ICourse, role: string) => {
      try {
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : {};
        const businessId = user.businessId;
        if (!businessId) {
          Swal.fire("Error", "Business ID를 찾을 수 없습니다.", "error");
          return;
        }
        const payload = {
          businessId,
          courseId: course.id,
          role,
          isPartialAssignment: false,
        };
        console.log("Sending payload:", payload);
        const token = localStorage.getItem("token");
        await axios.post(ApiUrl("/user/instructor-assignments"), payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire("Success", `${role} 신청이 완료되었습니다.`, "success");
        // 신청 완료 후 로딩 스피너 없이 데이터 새로고침
        fetchCourses(currentPage.value, currentSortBy.value, filters.value, false);
      } catch (error) {
        console.error("Error applying instructor:", error);
        Swal.fire("Error", "강사 신청 중 에러가 발생했습니다.", "error");
      }
    };

    // 강사 신청 취소 API 호출 (DELETE 메서드 사용)
    // 엔드포인트를 /user/instructor-assignments/{courseId} 형식으로 변경하고, 바디에는 데이터가 담기지 않도록 처리
    const cancelInstructor = async (course: ICourse) => {
      try {
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : {};
        const businessId = user.businessId;
        if (!businessId) {
          Swal.fire("Error", "Business ID를 찾을 수 없습니다.", "error");
          return;
        }
        const token = localStorage.getItem("token");
        // courseId는 엔드포인트에 포함, 쿼리 파라미터 없이 호출
        const url = ApiUrl(`/user/instructor-assignments/course/${course.id}`);
        console.log("Cancel URL:", url);
        await axios.delete(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire("Success", "신청이 취소되었습니다.", "success");
        fetchCourses(currentPage.value, currentSortBy.value, filters.value, false);
      } catch (error) {
        console.error("Error canceling instructor:", error);
        Swal.fire("Error", "신청 취소 중 에러가 발생했습니다.", "error");
      }
    };


    return {
      search,
      searchItems,
      data,
      headerConfig,
      currentPage,
      totalPages,
      onPageChange,
      visiblePages,
      selectedItems,
      onSelectionChange,
      onButtonAction,
      onProgramClick,
      selectedIds,
      sort,
      onItemSelect,
      isLoading,
      isAscending,
      currentSortBy,
      filters,
      handleFilter,
      applyInstructor,
      cancelInstructor,
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
.column-courseName,
.column-programName,
.column-schoolName,
.column-startDate,
.column-endDate,
.column-status,
.column-remarks {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

/* 개선된 신청 영역 스타일 */
.applied-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.applied-badge {
  background-color: #d1e7dd;
  color: #0f5132;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.cancel-btn {
  border: none;
}

.apply-btns {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.apply-btn {
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
</style>
