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
                  <button type="button" class="btn btn-danger checkbox-button" @click="onDeleteAssignments">
                    과제 삭제
                  </button>
                </div>
                <div class="vertical-separator mx-3"></div>
              </div>
            </transition>
          </div>

          <!-- 우측: 필터 버튼 및 필터 드롭다운 -->
          <div class="d-flex justify-content-end align-items-center">
            <div class="card-toolbar">
              <button type="button" class="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
                data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">
                <KTIcon icon-name="category" icon-class="fs-2" />
              </button>
              <!-- 필터 컴포넌트 (TeacherAlloPassivityFilter) -->
              <TeacherAlloPassivityFilter @apply-filter="handleFilter" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card-body pt-0 position-relative">
      <!-- 로딩 오버레이 -->
      <div v-if="isLoading" class="overlay">
        <div class="loader"></div>
      </div>

      <!-- KTDatatable (체크박스 및 컬럼 슬롯) -->
      <KTDatatable @on-sort="sort" @on-items-select="onItemSelect" :data="data" :header="headerConfig"
        :checkbox-enabled="false" @selection-change="onSelectionChange">
        <!-- 헤더 슬롯들 -->
        <template v-slot:header-instructorName>
          <div>강사명</div>
        </template>
        <template v-slot:header-assignmentRole>
          <div>신청 역할</div>
        </template>
        <template v-slot:header-courseName>
          <div>과정명</div>
        </template>
        <template v-slot:header-assignmentStatus>
          <div>상태</div>
        </template>
        <template v-slot:header-assignmentCreatedAt>
          <div>신청일</div>
        </template>

        <!-- 본문 슬롯들 -->
        <template v-slot:instructorName="{ row: assignment }">
          <div class="column-instructorName" @click="onAssignmentClick(assignment)" style="cursor: pointer;">
            {{ assignment.instructorName }}
          </div>
        </template>
        <template v-slot:assignmentRole="{ row: assignment }">
          <div class="column-assignmentRole">
            {{ assignment.assignmentRole }}
          </div>
        </template>
        <template v-slot:courseName="{ row: assignment }">
          <div class="column-courseName">
            {{ assignment.courseName }}
          </div>
        </template>
        <template v-slot:assignmentStatus="{ row: assignment }">
          <div class="column-assignmentStatus">
            <span :class="['badge', 'py-3', 'px-4', 'fs-7', 'badge-light-' + statusColor[assignment.assignmentStatus]]">
              {{ statusLabel[assignment.assignmentStatus] }}
            </span>
          </div>
        </template>
        <template v-slot:assignmentCreatedAt="{ row: assignment }">
          <div class="column-assignmentCreatedAt">
            {{ formatDate(assignment.assignmentCreatedAt) }}
          </div>
        </template>
      </KTDatatable>

      <!-- 페이지네이션 -->
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
            <li class="page-item" v-for="page in visiblePages" :key="page" :class="{ active: page === currentPage + 1 }"
              @click="onPageChange(page - 1)">
              <a class="page-link" href="#">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage + 1 === totalPages }"
              @click="onPageChange(currentPage + 1)">
              <i class="page-link ki-duotone ki-right fs-2"></i>
            </li>
            <li class="page-item" :class="{ disabled: currentPage + 1 === totalPages }"
              @click="onPageChange(totalPages - 1)">
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
import { ApiUrl } from "@/assets/ts/_utils/api";
import TeacherAlloPassivityFilter from "@/components/dropdown/TeacherAlloPassivityFilter.vue";

interface IApiAssignment {
  assignmentId: number;
  assignmentStatus: string;
  assignmentRole: string;
  assignmentCreatedAt: number;
  instructorId: number;
  instructorName: string;
  instructorAffiliation: string;
  courseId: number;
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
  courseStatus: string;
  remarks: string;
  createdAt: number;
  createdId: number;
  updatedAt: number;
  updatedId: number;
  mainInstructorRequired: number;
  assistantInstructorRequired: number;
  mainInstructorApplied: number;
  assistantInstructorApplied: number;
}

interface ITableAssignment {
  id: number;
  instructorName: string;
  instructorAffiliation: string;
  assignmentRole: string;
  courseName: string;
  assignmentStatus: string;
  assignmentCreatedAt: number;
}

export default defineComponent({
  name: "kt-assignment-list",
  components: {
    KTDatatable,
    TeacherAlloPassivityFilter,
  },
  setup() {
    const router = useRouter();
    const data = ref<ITableAssignment[]>([]);
    const totalElements = ref(0);
    const totalPages = ref(0);
    const currentPage = ref(0);
    const pageSize = ref(10);
    const selectedItems = ref<ITableAssignment[]>([]);
    const selectedIds = ref<number[]>([]);
    const isLoading = ref(false);
    const isAscending = ref({
      instructorName: true,
      instructorAffiliation: true,
      courseName: true,
      assignmentStatus: true,
      assignmentCreatedAt: true,
    });
    const currentSortBy = ref("");

    // 필터 객체: 강사명(instructorName), 과정명(courseName), 신청 상태(assignmentStatus), 시작일, 종료일
    const filters = ref({
      instructorName: "",
      courseName: "",
      assignmentStatus: "CONFIRMED", // 기본 CONFIRMED
      startDate: "",
      endDate: "",
    });

    const headerConfig = ref([
      { columnName: "강사명", columnLabel: "instructorName", sortEnabled: true },
      { columnName: "과정명", columnLabel: "courseName", sortEnabled: true },
      { columnName: "신청 역할", columnLabel: "assignmentRole", sortEnabled: false },
      { columnName: "과정명", columnLabel: "courseName", sortEnabled: true },
      { columnName: "상태", columnLabel: "assignmentStatus", sortEnabled: true },
      { columnName: "신청일", columnLabel: "assignmentCreatedAt", sortEnabled: true },
    ]);

    const statusColor: Record<string, string> = {
      CONFIRMED: "primary",
      OPEN: "primary",
    };
    const statusLabel: Record<string, string> = {
      CONFIRMED: "확정됨",
      OPEN: "열림",
    };

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

    const fetchAssignments = async (
      page: number = 0,
      sortBy: string = currentSortBy.value,
      filterData = filters.value
    ) => {
      try {
        if (page === 0 && sortBy === "") isLoading.value = true;
        const token = localStorage.getItem("token");
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("size", pageSize.value.toString());
        // 기본 assignmentStatus 사용 (필터에 값이 있으면 사용)
        params.append("assignmentStatus", filterData.assignmentStatus || "CONFIRMED");
        if (sortBy) {
          const cleanSortBy = sortBy.startsWith("&") ? sortBy.slice(1) : sortBy;
          const [key, value] = cleanSortBy.split("=");
          if (key && value) {
            params.append(key, value);
          }
        }
        // 필터 객체의 각 키를 URL 파라미터로 추가 (instructorName, courseName, startDate, endDate)
        Object.keys(filterData).forEach((key) => {
          if (filterData[key] && key !== "assignmentStatus") {
            params.append(key, filterData[key]);
          }
        });
        const finalUrl = ApiUrl(`/admin/instructor-assignments?${params.toString()}`);
        console.log("[fetchAssignments] Request URL:", finalUrl);
        console.log("[fetchAssignments] Filters:", filterData);
        console.log("[fetchAssignments] SortBy:", sortBy);

        const response = await axios.get(finalUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const responseData = response.data.data;
        data.value = responseData.content.map((assignment: IApiAssignment) => ({
          id: assignment.assignmentId,
          instructorName: assignment.instructorName,
          instructorAffiliation: assignment.instructorAffiliation || "-",
          assignmentRole: assignment.assignmentRole,
          courseName: assignment.courseName,
          assignmentStatus: assignment.assignmentStatus,
          assignmentCreatedAt: assignment.assignmentCreatedAt,
        }));
        totalElements.value = responseData.totalElements;
        totalPages.value = responseData.totalPages;
      } catch (error) {
        console.error("Error fetching assignments: ", error);
      } finally {
        isLoading.value = false;
      }
    };

    const handleFilter = (filterData: any) => {
      filters.value = filterData;
      currentPage.value = 0;
      fetchAssignments(0, currentSortBy.value, filters.value);
    };

    onMounted(() => {
      fetchAssignments();
    });

    const sort = (sort: Sort) => {
      let sortBy = "";
      if (sort.label === "instructorName") {
        sortBy = isAscending.value.instructorName ? "&sort=instructorName,asc" : "&sort=instructorName,desc";
        isAscending.value.instructorName = !isAscending.value.instructorName;
      } else if (sort.label === "instructorAffiliation") {
        sortBy = isAscending.value.instructorAffiliation ? "&sort=instructorAffiliation,asc" : "&sort=instructorAffiliation,desc";
        isAscending.value.instructorAffiliation = !isAscending.value.instructorAffiliation;
      } else if (sort.label === "courseName") {
        sortBy = isAscending.value.courseName ? "&sort=courseName,asc" : "&sort=courseName,desc";
        isAscending.value.courseName = !isAscending.value.courseName;
      } else if (sort.label === "assignmentStatus") {
        sortBy = isAscending.value.assignmentStatus ? "&sort=assignmentStatus,asc" : "&sort=assignmentStatus,desc";
        isAscending.value.assignmentStatus = !isAscending.value.assignmentStatus;
      } else if (sort.label === "assignmentCreatedAt") {
        sortBy = isAscending.value.assignmentCreatedAt ? "&sort=assignmentCreatedAt,asc" : "&sort=assignmentCreatedAt,desc";
        isAscending.value.assignmentCreatedAt = !isAscending.value.assignmentCreatedAt;
      } else {
        return;
      }
      currentSortBy.value = sortBy;
      fetchAssignments(currentPage.value, sortBy, filters.value);
    };

    const onItemSelect = (selected: number[]) => {
      selectedIds.value = selected;
    };
    const onSelectionChange = (selectedRows: ITableAssignment[]) => {
      selectedItems.value = selectedRows;
      selectedIds.value = selectedRows.map((row) => row.id);
    };
    const onPageChange = async (page: number) => {
      const currentScrollPosition = window.scrollY;
      currentPage.value = page;
      await fetchAssignments(page, currentSortBy.value, filters.value);
      window.scrollTo(0, currentScrollPosition);
    };
    const onDeleteAssignments = () => {
      if (selectedIds.value.length > 0) {
        deleteFewAssignments();
      }
    };
    const deleteFewAssignments = async () => {
      const result = await Swal.fire({
        title: "과제 삭제 확인",
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
            await deleteAssignment(id);
          }
          selectedIds.value = [];
          Swal.fire({
            title: "삭제 완료",
            text: "선택된 과제가 삭제되었습니다.",
            icon: "success",
            customClass: { confirmButton: "btn fw-semibold btn-primary" },
          }).then(() => {
            window.location.reload();
          });
        } catch (error) {
          console.error("Error deleting assignment: ", error);
          Swal.fire({
            title: "오류",
            text: "과제 삭제에 실패했습니다.",
            icon: "error",
            customClass: { confirmButton: "btn fw-semibold btn-danger" },
          });
        }
      }
    };
    const deleteAssignment = async (id: number) => {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(ApiUrl(`/admin/instructor-assignments/${id}`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        data.value = data.value.filter((assignment) => assignment.id !== id);
      } catch (error) {
        console.error("Error deleting assignment: ", error);
      }
    };

    const onAssignmentClick = (assignment: ITableAssignment) => {
      localStorage.setItem("selectedAssignmentId", assignment.id.toString());
      router.push({
        name: "admin-AssignmentDetails",
        params: { id: assignment.id },
      });
    };

    const formatDate = (timestamp: number) => {
      const date = new Date(timestamp);
      return date.toLocaleDateString();
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
      fetchAssignments,
      handleFilter,
      sort,
      onItemSelect,
      onSelectionChange,
      onPageChange,
      onDeleteAssignments,
      deleteFewAssignments,
      deleteAssignment,
      onAssignmentClick,
      formatDate,
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
.column-instructorName,
.column-instructorAffiliation,
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

/* 신청 영역 스타일 */
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
