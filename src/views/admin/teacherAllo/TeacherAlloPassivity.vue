<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="d-flex align-items-center me-3">
        <select v-model="filterNewStatus" class="form-select checkbox-button dropdown-button">
          <option value="READY">강사 열람 가능</option>
          <option value="OPEN">강사 신청 가능</option>
          <option value="APPLIED">신청 마감</option>
          <option value="CONFIRMED">출강 확정</option>
          <option value="PROGRESS">강의 진행 중</option>
          <option value="COMPLETE">강의 종료</option>
          <option value="PAUSE">강의 중지</option>
          <option value="CANCEL">강의 취소</option>
        </select>
        <button type="button" class="checkbox-button btn btn-primary ms-2" @click="applyStatusFilter">
          필터 상태 적용
        </button>
      </div>
      <div class="card-title"></div>
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
                      <option value="READY">강사 열람 가능</option>
                      <option value="OPEN">강사 신청 가능</option>
                      <option value="APPLIED">신청 마감</option>
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

                <div class="ms-4" style="margin-left: 0 !important">
                  <button
                    type="button"
                    class="btn btn-danger checkbox-button"
                    @click="onDeletePrograms"
                  >
                    프로그램 삭제
                  </button>
                </div>
                <div class="vertical-separator mx-3"></div>
              </div>
            </transition>
          </div>
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
          <Dropdown8 @apply-filter="handleFilter"></Dropdown8>
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
        <template v-slot:status="{ row: program }">
          <div class="column-isConfirmed" @click="onProgramClick(program)" style="cursor: pointer;">
            <span :class="`badge py-3 px-4 fs-7 badge-light-${statusColor[program.status]}`">
              {{ statusLabel[program.status] }}
            </span>
          </div>
        </template>
        <template v-slot:institutionName="{ row: program }">
          <div class="column-institutionName" style="cursor: pointer;">
            {{ program.institutionName }}
          </div>
        </template>
        <template v-slot:programName="{ row: program }">
          <div class="column-programName" style="cursor: pointer;">
            {{ program.programName }}
          </div>
        </template>
        <template v-slot:totalChapters="{ row: program }">
          <div class="column-totalChapters" style="cursor: pointer;">
            {{ program.totalChapters }}
          </div>
        </template>
        <template v-slot:classDate="{ row: program }">
          <div class="column-classDate" style="cursor: pointer;">
            {{ program.classDate }}
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
import Dropdown8 from "@/components/dropdown/Dropdown8.vue";
import TeacherSelectionModal from "@/components/dropdown/TeacherSelectionModal.vue";
import { ApiUrl } from "@/assets/ts/_utils/api";

interface IProgram {
  id: number;
  status: string;
  isConfirmed: string;
  institutionName: string | null;
  programName: string | null;
  chapterNumber: number | null;
  grade: number | null;
  numberOfStudents: number | null;
  date: string | null;
}

export default defineComponent({
  name: "kt-program-list",
  components: {
    KTDatatable,
    Dropdown8,
    TeacherSelectionModal,
  },

  setup() {
    const showTeacherModal = ref(false);
    const selectedProgram = ref<IProgram | null>(null);

    const openTeacherModal = (program: IProgram) => {
      selectedProgram.value = program;
      showTeacherModal.value = true;
    };

    const filterNewStatus = ref("READY");
    const router = useRouter();
    const data = ref<Array<IProgram & { totalChapters: string | number; classDate: string | number }>>([]);
    const totalElements = ref<number>(0);
    const totalPages = ref<number>(0);
    const currentPage = ref<number>(0);
    const pageSize = ref<number>(10);
    const search = ref<string>("");
    const selectedItems = ref<Array<IProgram>>([]);
    const selectedIds = ref<Array<number>>([]);
    const selectedStatus = ref("READY");

    const applyStatusFilter = async () => {
      const result = await Swal.fire({
        title: "상태 변경 확인",
        text: "현재 필터링된 모든 프로그램의 상태를 변경하시겠습니까?",
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

      if (!result.isConfirmed) {
        return;
      }

      const token = localStorage.getItem("token");

      try {
        const requestBody = {
          status: filters.value.status || null,
          institutionName: filters.value.institutionName || null,
          programName: filters.value.programName || null,
          totalChapters: filters.value.chapterNumber || null,
          classDate: filters.value.date || null,
          newStatus: filterNewStatus.value,
          startDate: filters.value.startDate || null,
          endDate: filters.value.endDate || null,
        };

        Object.keys(requestBody).forEach(
          (key) => requestBody[key] == null && delete requestBody[key]
        );

        await axios.put(
          ApiUrl(`/api/v1/admin/apply-for-programs/list/status`),
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire({
          title: "상태 변경 완료",
          text: "필터링된 프로그램의 상태가 변경되었습니다.",
          icon: "success",
          customClass: {
            confirmButton: "btn fw-semibold btn-primary",
          },
        }).then(() => {
          fetchPrograms(); // 데이터 갱신
        });
      } catch (error) {
        console.error("Error applying status filter: ", error);
        Swal.fire({
          title: "오류",
          text: "상태 변경에 실패했습니다.",
          icon: "error",
          customClass: {
            confirmButton: "btn fw-semibold btn-danger",
          },
        });
      }
    };

    const changeProgramStatus = async () => {
      const token = localStorage.getItem("token");

      if (selectedIds.value.length === 0) {
        Swal.fire({
          title: "선택된 항목 없음",
          text: "상태를 변경할 항목을 선택하세요.",
          icon: "warning",
          customClass: {
            confirmButton: "btn fw-semibold btn-warning",
          },
        });
        return;
      }

      const result = await Swal.fire({
        title: "상태 변경 확인",
        text: "선택한 프로그램의 상태를 변경하시겠습니까?",
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

      if (!result.isConfirmed) {
        return;
      }

      try {
        const requestBody = {
          ids: selectedIds.value,
          newStatus: selectedStatus.value,
        };

        await axios.put(
          ApiUrl(`/api/v1/admin/apply-for-programs/list/`),
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire({
          title: "상태 변경 완료",
          text: "선택된 프로그램의 상태가 변경되었습니다.",
          icon: "success",
          customClass: {
            confirmButton: "btn fw-semibold btn-primary",
          },
        }).then(() => {
          fetchPrograms(); // 데이터 갱신
        });
      } catch (error) {
        console.error("Error changing program status: ", error);

        Swal.fire({
          title: "오류",
          text: "프로그램 상태 변경에 실패했습니다.",
          icon: "error",
          customClass: {
            confirmButton: "btn fw-semibold btn-danger",
          },
        });
      }
    };

    const headerConfig = ref([
      {
        columnName: "상태",
        columnLabel: "status",
        sortEnabled: true,
        columnWidth: 100,
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
        columnWidth: 150,
      },
      {
        columnName: "총 차시",
        columnLabel: "totalChapters",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "수업 날짜",
        columnLabel: "classDate",
        sortEnabled: true,
        columnWidth: 200,
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

    const isLoading = ref<boolean>(false);
    const isAscending = ref({
      status: true,
      institutionName: true,
      programName: true,
      totalChapters: true,
      classDate: true,
    });

    const currentSortBy = ref<string>("");

    const filters = ref({
      status: "",
      institutionName: "",
      programName: "",
      chapterNumber: "",
      date: "",
      startDate: "",
      endDate: "",
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
          ApiUrl(`/api/v1/admin/apply-for-programs/list?page=${page}&size=${pageSize.value}&search=${search.value}${sortBy}${filterQuery}`),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseData = response.data;

        data.value = responseData.content.map((program: IProgram) => ({
          ...program,
          totalChapters: program.chapterNumber || "-",
          classDate: program.date || "-",
        }));

        totalElements.value = responseData.totalElements;
        totalPages.value = responseData.totalPages;
      } catch (error) {
        console.error("Error fetching data: ", error);
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
      if (filtersData.chapterNumber) {
        query += `&chapterNumber=${encodeURIComponent(filtersData.chapterNumber)}`;
      }
      if (filtersData.date) {
        query += `&date=${encodeURIComponent(filtersData.date)}`;
      }
      if (filtersData.startDate) {
        query += `&startDate=${encodeURIComponent(filtersData.startDate)}`;
      }
      if (filtersData.endDate) {
        query += `&endDate=${encodeURIComponent(filtersData.endDate)}`;
      }
      return query;
    };

    onMounted(() => {
      fetchPrograms(currentPage.value, currentSortBy.value, filters.value);
    });

    const deleteSubscription = async (id: number) => {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(ApiUrl(`/api/v1/admin/apply-for-programs/list/${id}`), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        data.value = data.value.filter((program) => program.id !== id);
      } catch (error) {
        console.error("Error deleting program: ", error);
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
      } else if (sort.label === "totalChapters") {
        sortBy = isAscending.value.totalChapters
          ? "&sortBy=chapterNumber&direction=asc"
          : "&sortBy=chapterNumber&direction=desc";
        isAscending.value.totalChapters = !isAscending.value.totalChapters;
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
      } else if (sort.label === "classDate") {
        sortBy = isAscending.value.classDate
          ? "&sortBy=date&direction=asc"
          : "&sortBy=date&direction=desc";
        isAscending.value.classDate = !isAscending.value.classDate;
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
      selectedIds.value = selectedRows.map((row) => row.id);
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
      localStorage.setItem("selectedProgramId", program.id.toString());
      router.push({ name: "admin-TeacherAlloPassivityDetails", params: { id: program.id } });
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
      changeProgramStatus,
      selectedStatus,
      filterNewStatus,
      applyStatusFilter,
      openTeacherModal,
      showTeacherModal,
      selectedProgram,
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
.column-isConfirmed,
.column-institutionName,
.column-programName,
.column-totalChapters,
.column-classDate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.column-isConfirmed,
.column-institutionName,
.column-programName,
.column-totalChapters,
.column-classDate {
  width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
</style>
