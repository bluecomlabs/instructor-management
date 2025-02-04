<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!-- <div class="d-flex align-items-center me-3">
        <select v-model="filterStatus" class="form-select checkbox-button dropdown-button" style="width: 150px;">
          <option value="READY">강사 열람 가능</option>
          <option value="OPEN">강사 신청 가능</option>
          <option value="APPLIED">신청 마감</option>
          <option value="PENDING_ASSIGN">강사 역할 배정</option>
          <option value="CONFIRMED">출강 확정</option>
          <option value="PROGRESS">강의 진행 중</option>
          <option value="COMPLETE">강의 종료</option>
          <option value="PAUSE">강의 중지</option>
          <option value="CANCEL">강의 취소</option>
        </select>
        <button type="button" class="checkbox-button btn btn-primary ms-2" @click="applyStatusFilter">
          필터 상태 적용
        </button>
      </div> -->
      <div class="card-title"></div>
      <div class="card-toolbar">
        <!-- <div class="card-toolbar d-flex justify-content-between align-items-center">
          <div class="d-flex justify-content-start align-items-center">
            <transition name="fade">
              <div v-if="selectedIds.length > 0" class="d-flex align-items-center">
                <div class="fw-bold me-5">
                  <span class="me-2">{{ selectedIds.length }}</span> 항목 선택됨
                </div>

                <div class="vertical-separator mx-3"></div>

                <div class="d-flex align-items-center me-3" style="margin-right: 0 !important">
                  <div class="dropdown me-2">
                    <select v-model="selectedStatus" class="form-select checkbox-button dropdown-button" style="width: 150px;">
                      <option value="READY">강사 열람 가능</option>
                      <option value="OPEN">강사 신청 가능</option>
                      <option value="APPLIED">신청 마감</option>
                      <option value="PENDING_ASSIGN">강사 역할 배정</option>
                      <option value="CONFIRMED">출강 확정</option>
                      <option value="PROGRESS">강의 진행 중</option>
                      <option value="COMPLETE">강의 종료</option>
                      <option value="PAUSE">강의 중지</option>
                      <option value="CANCEL">강의 취소</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    class="btn btn-primary checkbox-button"
                    @click="changeProgramStatus"
                  >
                    상태 변경
                  </button>
                </div>

                <div class="vertical-separator mx-3"></div>
              </div>
            </transition>
          </div>
        </div> -->

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
          <Dropdown9 @apply-filter="handleFilter"></Dropdown9>
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

      <template v-slot:manualAssignment="{ row: program }">
          <button
            @click="openTeacherModal(program)"
            class="btn btn-sm btn-light btn-active-light-primary"
          >
            강사 선택
          </button>
        </template>
        <template v-slot:status="{ row: program }">
          <div class="column-status" @click="onProgramClick(program)" style="cursor: pointer;">
            <span :class="`badge py-3 px-4 fs-7 badge-light-${statusColor[program.status]}`">
              {{ statusLabel[program.status] }}
            </span>
          </div>
        </template>
        <template v-slot:institutionName="{ row: program }">
          <div class="column-institutionName" @click="onProgramClick(program)" style="cursor: pointer;">
            {{ program.institutionName }}
          </div>
        </template>
        <template v-slot:programName="{ row: program }">
          <div class="column-programName" @click="onProgramClick(program)" style="cursor: pointer;">
            {{ program.programName }}
          </div>
        </template>
        <template v-slot:chapterInfo="{ row: program }">
          <div class="column-chapterInfo" @click="onProgramClick(program)" style="cursor: pointer;">
            {{ program.chapterNumber }} / {{ program.totalChapters }}
          </div>
        </template>
        <template v-slot:classDate="{ row: program }">
          <div class="column-classDate" @click="onProgramClick(program)" style="cursor: pointer;">
            {{ program.classDate }}
          </div>
        </template>
        <template v-slot:instructorName="{ row: program }">
          <div class="column-instructorName" @click="onProgramClick(program)" style="cursor: pointer;">
            {{ program.instructorName }}
          </div>
        </template>
        <template v-slot:role="{ row: program }">
          <div class="column-role" @click="onProgramClick(program)" style="cursor: pointer;">
            <span :class="`badge py-3 px-4 fs-7 badge-light-${roleColor[program.role]}`">
              {{ roleLabel[program.role] }}
            </span>
          </div>
        </template>
        <template v-slot:startTime="{ row: program }">
          <div class="column-startTime" @click="onProgramClick(program)" style="cursor: pointer;">
            {{ program.startTime }}
          </div>
        </template>
        <template v-slot:endTime="{ row: program }">
          <div class="column-endTime" @click="onProgramClick(program)" style="cursor: pointer;">
            {{ program.endTime }}
          </div>
        </template>
      </KTDatatable>

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
      <TeacherSelectionModal
        v-if="showTeacherModal"
        :program="selectedProgram!"
        :role="selectedRole"
        @close="showTeacherModal = false"
      />
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
import Dropdown9 from "@/components/dropdown/Dropdown9.vue";
import TeacherSelectionModal from "@/components/dropdown/TeacherSelectionModal.vue";
import { ApiUrl } from "@/assets/ts/_utils/api";

interface IProgram {
  id: number;
  status: string;
  institutionName: string;
  programName: string;
  totalChapters: number;
  chapterNumber: number;
  classDate: string;
  instructorName: string;
  instructorId: number | null;
  role: string | null;
  instructorPhoneNumber: string | null;
  startTime: string;
  endTime: string;
  userId: number;
}

export default defineComponent({
  name: "kt-program-list",
  components: {
    KTDatatable,
    Dropdown9,
    TeacherSelectionModal,
  },

  setup() {
    const showTeacherModal = ref(false);
    const selectedProgram = ref<IProgram | null>(null);
    const selectedRole = ref<string>("");

    const openTeacherModal = (program: IProgram) => {
      selectedProgram.value = program;
      selectedRole.value = program.role || "MAIN"; // role 값이 없을 경우 'MAIN'으로 기본 설정
      showTeacherModal.value = true;
    };

    const filterStatus = ref("READY");
    const router = useRouter();
    const data = ref<Array<IProgram>>([]);
    const totalElements = ref<number>(0);
    const totalPages = ref<number>(0);
    const currentPage = ref<number>(0);
    const pageSize = ref<number>(10);
    const search = ref<string>("");
    const selectedItems = ref<Array<IProgram>>([]);
    const selectedIds = ref<Array<number>>([]);
    const selectedStatus = ref("READY");

    // 기타 반응형 변수 및 메소드

    const headerConfig = ref([
      {
        columnName: "강사수동신청",
        columnLabel: "manualAssignment",
        sortEnabled: false,
        columnWidth: 150,
      },
      {
        columnName: "상태",
        columnLabel: "status",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "교육기관명",
        columnLabel: "institutionName",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "프로그램명",
        columnLabel: "programName",
        sortEnabled: true,
        columnWidth: 200,
      },
      {
        columnName: "현재 차시 / 총 차시",
        columnLabel: "chapterInfo",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "수업 날짜",
        columnLabel: "classDate",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "강사 이름",
        columnLabel: "instructorName",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "강사 종류",
        columnLabel: "role",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "시작 시간",
        columnLabel: "startTime",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "종료 시간",
        columnLabel: "endTime",
        sortEnabled: true,
        columnWidth: 100,
      },
    ]);

    const statusColor: { [key: string]: string } = {
      INIT: "info",
      OPEN: "primary",
      READY: "warning",
      APPLIED: "info",
      PENDING_ASSIGN: "warning",
      CONFIRMED: "success",
      PROGRESS: "primary",
      COMPLETE: "success",
      PAUSE: "danger",
      CANCEL: "info",
    };

    const statusLabel: { [key: string]: string } = {
      INIT: "강의 대기 중",
      OPEN: "강사 신청 가능",
      READY: "강사 열람 가능",
      APPLIED: "신청 마감",
      PENDING_ASSIGN: "강사 역할 배정",
      CONFIRMED: "출강 확정",
      PROGRESS: "강의 진행 중",
      COMPLETE: "강의 종료",
      PAUSE: "강의 중지",
      CANCEL: "강의 취소",
    };

    const roleColor: { [key: string]: string } = {
      MAIN: "info",
      ASSISTANT: "warning",
    };

    const roleLabel: { [key: string]: string } = {
      MAIN: "주강사",
      ASSISTANT: "보조강사",
    };

    const isLoading = ref<boolean>(false);
    const isAscending = ref({
      status: true,
      institutionName: true,
      programName: true,
      totalChapters: true,
      chapterNumber: true,
      classDate: true,
      instructorName: true,
      instructorId: true,
      startTime: true,
      endTime: true,
      role: true,
    });

    const currentSortBy = ref<string>("");

    const filters = ref({
      status: "",
      institutionName: "",
      programName: "",
      startDate: "",
      endDate: "",
      chapterNumber: "",
      totalChapters: "",
      instructorId: null,
    });

    const handleFilter = (filterData: any) => {
      filters.value = filterData;
      currentPage.value = 0;
      fetchPrograms(currentPage.value, currentSortBy.value, filters.value);
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

    const fetchPrograms = async (
      page: number = 0,
      sortBy: string = currentSortBy.value,
      filtersData = filters.value
    ) => {
      try {
        if (page === 0 && sortBy === "") isLoading.value = true;
        const token = localStorage.getItem("token");
        const filterQuery = buildFilterQuery(filtersData);

        const response = await axios.get(
          ApiUrl(`/api/v1/admin/education-instructors/schedules?page=${page}&size=${pageSize.value}&search=${search.value}${sortBy}${filterQuery}`),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseData = response.data;

        data.value = responseData.content.map((program: any) => ({
          id: program.id,
          status: program.status,
          institutionName: program.institutionName || "-",
          programName: program.programName || "-",
          totalChapters: program.totalChapters || 0,
          chapterNumber: program.chapterNumber || 0,
          classDate: program.classDate || "-",
          instructorName: program.instructorName || "-",
          instructorId: program.instructorId || null,
          role: program.role || "-",
          startTime: program.startTime || "-",
          endTime: program.endTime || "-",
          userId: program.userId,
        }));

        totalElements.value = responseData.totalElements;
        totalPages.value = responseData.totalPages;
      } catch (error) {
        console.error("Error fetching data: ", error);
        Swal.fire({
          title: "오류",
          text: "데이터를 불러오는 데 실패했습니다.",
          icon: "error",
          customClass: {
            confirmButton: "btn fw-semibold btn-danger",
          },
        });
      } finally {
        isLoading.value = false;
      }
    };

    const buildFilterQuery = (filtersData: any) => {
      let query = "";
      if (filtersData.status) {
        query += `&status=${encodeURIComponent(filtersData.status)}`;
      }
      if (filtersData.institutionName) {
        query += `&institutionName=${encodeURIComponent(filtersData.institutionName)}`;
      }
      if (filtersData.programName) {
        query += `&programName=${encodeURIComponent(filtersData.programName)}`;
      }
      if (filtersData.startDate) {
        query += `&startDate=${encodeURIComponent(filtersData.startDate)}`;
      }
      if (filtersData.endDate) {
        query += `&endDate=${encodeURIComponent(filtersData.endDate)}`;
      }
      if (filtersData.chapterNumber) {
        query += `&chapterNumber=${encodeURIComponent(filtersData.chapterNumber)}`;
      }
      if (filtersData.totalChapters) {
        query += `&totalChapters=${encodeURIComponent(filtersData.totalChapters)}`;
      }
      if (filtersData.instructorId) {
        query += `&instructorId=${encodeURIComponent(filtersData.instructorId)}`;
      }
      return query;
    };

    onMounted(() => {
      fetchPrograms(currentPage.value, currentSortBy.value, filters.value);
    });

    const deleteSubscription = async (id: number) => {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(ApiUrl(`/api/v1/admin/education-instructors/schedules/${id}`), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        data.value = data.value.filter((program) => program.id !== id);
      } catch (error) {
        console.error("Error deleting program: ", error);
        Swal.fire({
          title: "오류",
          text: "프로그램 삭제에 실패했습니다.",
          icon: "error",
          customClass: {
            confirmButton: "btn fw-semibold btn-danger",
          },
        });
      }
    };

    const deleteFewSubscriptions = async () => {
      const result = await Swal.fire({
        title: "프로그램 삭제 확인",
        text: "선택한 프로그램을 정말로 삭제하시겠습니까?",
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
        for (const id of selectedIds.value) {
          await deleteSubscription(id);
        }

        selectedIds.value.length = 0;

        Swal.fire({
          title: "삭제 완료",
          text: "선택된 프로그램이 삭제되었습니다.",
          icon: "success",
          customClass: {
            confirmButton: "btn fw-semibold btn-primary",
          },
        });
      }
    };

    const sort = (sort: Sort) => {
      let sortBy = "";
      if (sort.label === "status") {
        sortBy = isAscending.value.status
          ? "&sortBy=status&direction=asc"
          : "&sortBy=status&direction=desc";
        isAscending.value.status = !isAscending.value.status;
      } else if (sort.label === "institutionName") {
        sortBy = isAscending.value.institutionName
          ? "&sortBy=institutionName&direction=asc"
          : "&sortBy=institutionName&direction=desc";
        isAscending.value.institutionName = !isAscending.value.institutionName;
      } else if (sort.label === "programName") {
        sortBy = isAscending.value.programName
          ? "&sortBy=programName&direction=asc"
          : "&sortBy=programName&direction=desc";
        isAscending.value.programName = !isAscending.value.programName;
      } else if (sort.label === "totalChapters") {
        sortBy = isAscending.value.totalChapters
          ? "&sortBy=totalChapters&direction=asc"
          : "&sortBy=totalChapters&direction=desc";
        isAscending.value.totalChapters = !isAscending.value.totalChapters;
      } else if (sort.label === "chapterNumber") {
        sortBy = isAscending.value.chapterNumber
          ? "&sortBy=chapterNumber&direction=asc"
          : "&sortBy=chapterNumber&direction=desc";
        isAscending.value.chapterNumber = !isAscending.value.chapterNumber;
      } else if (sort.label === "classDate") {
        sortBy = isAscending.value.classDate
          ? "&sortBy=classDate&direction=asc"
          : "&sortBy=classDate&direction=desc";
        isAscending.value.classDate = !isAscending.value.classDate;
      } else if (sort.label === "instructorName") {
        sortBy = isAscending.value.instructorName
          ? "&sortBy=instructorName&direction=asc"
          : "&sortBy=instructorName&direction=desc";
        isAscending.value.instructorName = !isAscending.value.instructorName;
      } else if (sort.label === "instructorId") {
        sortBy = isAscending.value.instructorId
          ? "&sortBy=instructorId&direction=asc"
          : "&sortBy=instructorId&direction=desc";
        isAscending.value.instructorId = !isAscending.value.instructorId;
      } else if (sort.label === "startTime") {
        sortBy = isAscending.value.startTime
          ? "&sortBy=startTime&direction=asc"
          : "&sortBy=startTime&direction=desc";
        isAscending.value.startTime = !isAscending.value.startTime;
      } else if (sort.label === "role") {
        sortBy = isAscending.value.role
          ? "&sortBy=role&direction=asc"
          : "&sortBy=role&direction=desc";
        isAscending.value.role = !isAscending.value.role;
      } else if (sort.label === "endTime") {
        sortBy = isAscending.value.endTime
          ? "&sortBy=endTime&direction=asc"
          : "&sortBy=endTime&direction=desc";
        isAscending.value.endTime = !isAscending.value.endTime;
      } else {
        return;
      }
      currentSortBy.value = sortBy;
      fetchPrograms(currentPage.value, sortBy, filters.value);
    };

    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    const searchItems = () => {
      currentPage.value = 0;
      fetchPrograms(currentPage.value, currentSortBy.value, filters.value);
    };

    const onPageChange = async (page: number) => {
      const currentScrollPosition = window.scrollY;
      currentPage.value = page;
      await fetchPrograms(page, currentSortBy.value, filters.value);
      window.scrollTo(0, currentScrollPosition);
    };

    const onSelectionChange = (selectedRows: Array<IProgram>) => {
      selectedItems.value = selectedRows;
      selectedIds.value = selectedRows.map(row => row.id);
    };

    const onButtonAction = () => {
      if (selectedItems.value.length > 0) {
        console.log("선택된 프로그램 삭제:", selectedItems.value);
      } else {
        router.push({ name: "admin-ProgramAdd" });
      }
    };

    const onDeletePrograms = () => {
      if (selectedIds.value.length > 0) {
        deleteFewSubscriptions();
      }
    };

    const onProgramClick = (program: IProgram) => {
      // 프로그램 클릭 처리
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
      onDeletePrograms,
      onProgramClick,
      selectedIds,
      sort,
      deleteFewSubscriptions,
      onItemSelect,
      isLoading,
      isAscending,
      currentSortBy,
      filters,
      handleFilter,
      statusColor,
      statusLabel,
      roleColor,
      roleLabel,
      openTeacherModal,
      showTeacherModal,
      selectedProgram,
      selectedRole,
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

/* 추가 스타일 */
</style>
