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
                    @click="onDeleteAssignments"
                  >
                    과제 삭제
                  </button>
                </div>
                <div class="vertical-separator mx-3"></div>
              </div>
            </transition>
          </div>

          <!-- 우측: 과제 등록 버튼 및 필터 버튼 -->
          <div class="d-flex justify-content-end align-items-center">
            <!-- 필터 버튼 및 필터 드롭다운 -->
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
              <!-- 필터 컴포넌트 (AssignmentFilter) -->
              <AssignmentFilter @apply-filter="handleFilter" />
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
      <KTDatatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        :data="data"
        :header="headerConfig"
        :checkbox-enabled="false"
        @selection-change="onSelectionChange"
      >
        <!-- 헤더 슬롯들 -->
        <template v-slot:header-instructorName>
          <div>강사명</div>
        </template>
        <template v-slot:header-instructorAffiliation>
          <div>소속</div>
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
        <!-- 수락/거절 버튼 컬럼 -->
        <template v-slot:header-action>
          <div>수락/거절</div>
        </template>

        <!-- 본문 슬롯들 -->
        <template v-slot:instructorName="{ row: assignment }">
          <div class="column-instructorName" @click="onAssignmentClick(assignment)" style="cursor: pointer;">
            {{ assignment.instructorName }}
          </div>
        </template>
        <template v-slot:instructorAffiliation="{ row: assignment }">
          <div class="column-instructorAffiliation">
            {{ assignment.instructorAffiliation }}
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
        <!-- 수락/거절 버튼 -->
        <template v-slot:action="{ row: assignment }">
          <div class="d-flex justify-content-center">
            <button class="btn btn-sm btn-success me-2" @click="onAcceptAssignment(assignment)">수락</button>
            <button class="btn btn-sm btn-danger" @click="onRejectAssignment(assignment)">거절</button>
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
import { ApiUrl } from "@/assets/ts/_utils/api";
import AssignmentFilter from "@/components/dropdown/AssignmentFilter.vue";

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
    AssignmentFilter,
  },
  setup() {
    const router = useRouter();

    // 테이블 데이터 및 페이지네이션 관련 상태
    const data = ref<ITableAssignment[]>([]);
    const totalElements = ref(0);
    const totalPages = ref(0);
    const currentPage = ref(0);
    const pageSize = ref(10);

    // 선택된 항목
    const selectedItems = ref<ITableAssignment[]>([]);
    const selectedIds = ref<number[]>([]);
    // 로딩 상태
    const isLoading = ref(false);

    // 정렬 관련 상태
    const isAscending = ref({
      instructorName: true,
      instructorAffiliation: true,
      courseName: true,
      assignmentStatus: true,
      assignmentCreatedAt: true,
    });
    const currentSortBy = ref("");

    // 필터 객체 – AssignmentFilter와 동일한 필드명을 사용 (초기 assignmentStatus는 "INIT")
    const filters = ref({
      programName: "",
      schoolName: "",
      assignmentStatus: "INIT",
      startDate: "",
      endDate: ""
    });

    // 테이블 헤더 설정 (수락/거절 컬럼 포함)
    const headerConfig = ref([
      { columnName: "강사명", columnLabel: "instructorName", sortEnabled: true },
      { columnName: "소속", columnLabel: "instructorAffiliation", sortEnabled: true },
      { columnName: "신청 역할", columnLabel: "assignmentRole", sortEnabled: false },
      { columnName: "과정명", columnLabel: "courseName", sortEnabled: true },
      { columnName: "상태", columnLabel: "assignmentStatus", sortEnabled: true },
      { columnName: "신청일", columnLabel: "assignmentCreatedAt", sortEnabled: true },
      { columnName: "수락/거절", columnLabel: "action", sortEnabled: false },
    ]);

    // 상태에 따른 배지 색상 및 라벨
    const statusColor: Record<string, string> = {
      INIT: "warning",
      OPEN: "primary",
      CONFIRMED: "success",
      REJECTED: "danger",
    };
    const statusLabel: Record<string, string> = {
      INIT: "신청 대기중",
      OPEN: "열림",
      CONFIRMED: "수락됨",
      REJECTED: "거절됨",
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

    /** API 호출: 필터 및 정렬 정보를 기반으로 과제 목록을 가져옵니다. */
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
        // 필터 데이터에 따라 파라미터 추가
        params.append("assignmentStatus", filterData.assignmentStatus || "INIT");
        if (filterData.programName) {
          params.append("programName", filterData.programName);
        }
        if (filterData.schoolName) {
          params.append("schoolName", filterData.schoolName);
        }
        if (filterData.startDate) {
          params.append("startDate", filterData.startDate);
        }
        if (filterData.endDate) {
          params.append("endDate", filterData.endDate);
        }
        // 정렬 파라미터 (필요시)
        if (sortBy) {
          const cleanSortBy = sortBy.startsWith("&") ? sortBy.slice(1) : sortBy;
          const [key, value] = cleanSortBy.split("=");
          if (key && value) {
            params.append(key, value);
          }
        }
        const finalUrl = ApiUrl(`/admin/instructor-assignments?${params.toString()}`);
        console.log("[fetchAssignments] Request URL:", finalUrl);
        const response = await axios.get(finalUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const responseData = response.data.data;
        data.value = responseData.content.map((assignment: IApiAssignment) => {
          return {
            id: assignment.assignmentId,
            instructorName: assignment.instructorName,
            instructorAffiliation: assignment.instructorAffiliation || "-",
            assignmentRole: assignment.assignmentRole,
            courseName: assignment.courseName,
            assignmentStatus: assignment.assignmentStatus,
            assignmentCreatedAt: assignment.assignmentCreatedAt,
          } as ITableAssignment;
        });
        totalElements.value = responseData.totalElements;
        totalPages.value = responseData.totalPages;
      } catch (error) {
        console.error("Error fetching assignments: ", error);
      } finally {
        isLoading.value = false;
      }
    };

    /** 필터 적용 이벤트 핸들러 */
    const handleFilter = (filterData: any) => {
      filters.value = filterData;
      currentPage.value = 0;
      fetchAssignments(0, currentSortBy.value, filterData);
    };

    onMounted(() => {
      fetchAssignments();
    });

    /** 정렬 처리 */
    const sort = (sort: Sort) => {
      let sortBy = "";
      if (sort.label === "instructorName") {
        sortBy = isAscending.value.instructorName
          ? "&sort=instructorName,asc"
          : "&sort=instructorName,desc";
        isAscending.value.instructorName = !isAscending.value.instructorName;
      } else if (sort.label === "instructorAffiliation") {
        sortBy = isAscending.value.instructorAffiliation
          ? "&sort=instructorAffiliation,asc"
          : "&sort=instructorAffiliation,desc";
        isAscending.value.instructorAffiliation = !isAscending.value.instructorAffiliation;
      } else if (sort.label === "courseName") {
        sortBy = isAscending.value.courseName
          ? "&sort=courseName,asc"
          : "&sort=courseName,desc";
        isAscending.value.courseName = !isAscending.value.courseName;
      } else if (sort.label === "assignmentStatus") {
        sortBy = isAscending.value.assignmentStatus
          ? "&sort=assignmentStatus,asc"
          : "&sort=assignmentStatus,desc";
        isAscending.value.assignmentStatus = !isAscending.value.assignmentStatus;
      } else if (sort.label === "assignmentCreatedAt") {
        sortBy = isAscending.value.assignmentCreatedAt
          ? "&sort=assignmentCreatedAt,asc"
          : "&sort=assignmentCreatedAt,desc";
        isAscending.value.assignmentCreatedAt = !isAscending.value.assignmentCreatedAt;
      } else {
        return;
      }
      currentSortBy.value = sortBy;
      fetchAssignments(currentPage.value, sortBy, filters.value);
    };

    /** 체크박스 선택 */
    const onItemSelect = (selected: number[]) => {
      selectedIds.value = selected;
    };
    const onSelectionChange = (selectedRows: ITableAssignment[]) => {
      selectedItems.value = selectedRows;
      selectedIds.value = selectedRows.map((row) => row.id);
    };

    /** 페이지 변경 */
    const onPageChange = async (page: number) => {
      const currentScrollPosition = window.scrollY;
      currentPage.value = page;
      await fetchAssignments(page, currentSortBy.value, filters.value);
      window.scrollTo(0, currentScrollPosition);
    };

    /** 과제 삭제 처리 */
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

    // 상세보기 이동
    const onAssignmentClick = (assignment: ITableAssignment) => {
      localStorage.setItem("selectedAssignmentId", assignment.id.toString());
      router.push({
        name: "admin-AssignmentDetails",
        params: { id: assignment.id },
      });
    };

    // 수락 버튼 처리
    const onAcceptAssignment = async (assignment: ITableAssignment) => {
      try {
        const result = await Swal.fire({
          title: "과제 수락",
          text: `${assignment.instructorName}님의 과제를 수락하시겠습니까?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "수락",
          cancelButtonText: "취소",
        });
        if (result.isConfirmed) {
          const token = localStorage.getItem("token");
          await axios.put(
            ApiUrl("/admin/instructor-assignments/status"),
            {
              assignmentIds: [assignment.id],
              newStatus: "CONFIRMED",
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          Swal.fire({
            title: "수락 완료",
            text: "과제가 수락되었습니다.",
            icon: "success",
          });
          data.value = data.value.filter((a) => a.id !== assignment.id);
        }
      } catch (error) {
        console.error("수락 처리 중 오류", error);
        Swal.fire({
          title: "오류",
          text: "과제 수락에 실패했습니다.",
          icon: "error",
        });
      }
    };

    // 거절 버튼 처리
    const onRejectAssignment = async (assignment: ITableAssignment) => {
      try {
        const result = await Swal.fire({
          title: "과제 거절",
          text: `${assignment.instructorName}님의 과제를 거절하시겠습니까?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "거절",
          cancelButtonText: "취소",
        });
        if (result.isConfirmed) {
          const token = localStorage.getItem("token");
          await axios.put(
            ApiUrl("/admin/instructor-assignments/status"),
            {
              assignmentIds: [assignment.id],
              newStatus: "REJECTED",
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          Swal.fire({
            title: "거절 완료",
            text: "과제가 거절되었습니다.",
            icon: "success",
          });
          data.value = data.value.filter((a) => a.id !== assignment.id);
        }
      } catch (error) {
        console.error("거절 처리 중 오류", error);
        Swal.fire({
          title: "오류",
          text: "과제 거절에 실패했습니다.",
          icon: "error",
        });
      }
    };

    // 타임스탬프를 로컬 날짜 형식으로 변환
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
      onAcceptAssignment,
      onRejectAssignment,
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
.kt-datatable tbody .column-instructorName,
.kt-datatable tbody .column-instructorAffiliation,
.kt-datatable tbody .column-assignmentRole,
.kt-datatable tbody .column-courseName,
.kt-datatable tbody .column-assignmentStatus,
.kt-datatable tbody .column-assignmentCreatedAt {
  max-width: 150px;
}
.kt-datatable thead .column-instructorName,
.kt-datatable thead .column-instructorAffiliation,
.kt-datatable thead .column-assignmentRole,
.kt-datatable thead .column-courseName,
.kt-datatable thead .column-assignmentStatus,
.kt-datatable thead .column-assignmentCreatedAt {
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
