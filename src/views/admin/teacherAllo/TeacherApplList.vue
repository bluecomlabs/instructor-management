<template>
  <div class="card">
    <div class="card-header border-0 pt-6 cmcard-header">
      <div class="d-flex align-items-center me-3">
        <div class="d-flex align-items-center">
          <select v-model="filterNewStatus" class="form-select filtercheckbox-button dropdown-button">
            <option value="ASSIGNED">배정</option>
            <option value="UNASSIGNED">미배정</option>
            <option value="REJECTED">탈락</option>
          </select>
          <button :class="{ 'cmdel-selected': selectedIds.length > 0 }" type="button" class="applycheckbox-button btn btn-primary ms-2" @click="applyStatusFilter">
            <span class="desktop-text">필터 상태 적용</span>
            <span class="mobile-text">변경</span>
          </button>
          <button :class="{ 'cmdel-selected': selectedIds.length === 0, 'comdel-selected':  selectedIds.length > 0 }" type="button" class="applycheckbox-button btn btn-primary ms-2" @click="changeProgramStatus">
            변경
          </button>
        </div>
      </div>
      <div class="card-title"></div>
      <div class="card-toolbar">
        <div class="card-toolbar d-flex justify-content-between align-items-center">
          <div class="d-flex justify-content-start align-items-center box-leftsort">
            <transition name="fade">
              <div v-if="selectedIds.length > 0" class="d-flex align-items-center">
                <div class="fw-bold me-5">
                  <span class="desktop-text"><span class="me-2">{{ selectedIds.length }}</span> 항목 선택됨</span> 
                </div>
                <div class="d-flex align-items-center">
                  <div class="vertical-separator mx-3 check-delline"></div>
                </div>

                <div class="d-flex align-items-center me-3">
                  <button
                    type="button"
                    class="btn btn-primary applycheckbox-button"
                    @click="changeProgramStatus"
                    :class="{ 'del-selected': selectedIds.length > 0 }"
                  >
                    <span class="desktop-text">상태 변경</span>
                    <span class="mobile-text">변경</span>
                  </button>
                </div>

                <div class="vertical-separator mx-3" :class="{ 'del-selected': selectedIds.length > 0 }"></div>

                <div class="ms-4">
                  <button
                    type="button"
                    class="btn btn-danger delcheckbox-button"
                    @click="onDeletePrograms"
                    :class="{ 'check-selected': selectedIds.length > 0 }"
                  >
                  <span class="desktop-text">프로그램 삭제</span>
                  <span class="mobile-text">삭제</span>
                  </button>
                </div>
                <div class="vertical-separator mx-3" :class="{ 'del-selected': selectedIds.length > 0 }"></div>
              </div>
            </transition>
          </div>

          <div class="d-flex justify-content-end align-items-center" style="margin-left: 2px !important">
            <button
              v-if="showRegisterButton"
              tabindex="3"
              type="button"
              @click="onButtonAction"
              class="btn btn-light-primary checkbox-button"
            >
              <span class="desktop-text">프로그램 등록</span>
              <span class="mobile-text">등록</span>
            </button>
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
            <Dropdown5 @apply-filter="handleFilter"></Dropdown5>
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

        <template v-slot:status="{ row: program }">
          <div class="column-isConfirmed" @click="onProgramClick(program)" style="cursor: pointer;">
            <span :class="`badge py-3 px-4 fs-7 badge-light-${statusColor[program.status]}`">
              {{ statusLabel[program.status] }}
            </span>
          </div>
        </template>
        <!-- <template v-slot:status="{ row: program }">
          <div class="column-status" style="cursor: pointer;">
            {{ program.status }}
          </div>
        </template> -->
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
        <template v-slot:classDates="{ row: program }">
          <div class="column-classDates" style="cursor: pointer;">
            {{ program.classDates }}
          </div>
        </template>
        <template v-slot:instructorName="{ row: program }">
          <div class="column-instructorName" style="cursor: pointer;">
            {{ program.instructorName }}
          </div>
        </template>
        <template v-slot:instructorPhoneNumber="{ row: program }">
          <div class="column-instructorPhoneNumber" style="cursor: pointer;">
            {{ program.instructorPhoneNumber }}
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
import { defineComponent, onMounted, ref, computed, watch } from "vue";
import axios from "axios";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import Dropdown5 from "@/components/dropdown/Dropdown5.vue";

interface IProgram {
  id: number;
  status: string;
  isConfirmed: string;
  institutionName: string | null;
  programName: string | null;
  totalChapters: number | null;
  classDates: string | null;
  instructorName: string | null;
  instructorPhoneNumber: string | null;
  chapterNumber: number | null;
  numberOfStudents: string | null;
  grade: number | null;
  classNumber: number | null;
  remark: string | null;
  date: number | null;
  role: number | null;
}


export default defineComponent({
  name: "kt-program-list",
  components: {
    KTDatatable,
    Dropdown5,
  },

  setup() {
    const filterGoalIsConfirmed = ref("Y");
    const router = useRouter();
    const data = ref<Array<IProgram>>([]);
    const totalElements = ref<number>(0);
    const totalPages = ref<number>(0);
    const currentPage = ref<number>(0);
    const pageSize = ref<number>(10);
    const search = ref<string>("");
    const selectedItems = ref<Array<IProgram>>([]);
    const selectedIds = ref<Array<number>>([]);
    const selectedStatus = ref("ASSIGNED");
    const filterNewStatus = ref("ASSIGNED");

    // 딜레이함수
    const showRegisterButton = ref(true);
    let registerButtonTimeout: number | null = null;

    watch(selectedIds, (newVal) => {
      if (newVal.length === 0) {
        showRegisterButton.value = false;
        if (registerButtonTimeout) {
          clearTimeout(registerButtonTimeout);
        }
        registerButtonTimeout = window.setTimeout(() => {
          showRegisterButton.value = true;
        }, 30);
      } else {
        showRegisterButton.value = false;
        if (registerButtonTimeout) {
          clearTimeout(registerButtonTimeout);
          registerButtonTimeout = null;
        }
      }
    });

    const applyStatusFilter = async () => {
      const result = await Swal.fire({
        title: "상태 필터 적용 확인",
        text: "정말로 이 상태 필터를 적용하시겠습니까?",
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

      const requestBody = {
        status: filters.value.status || null,
        newStatus: filterNewStatus.value,
        programName: filters.value.programName || null,
        institutionName: filters.value.institutionName || null,
        totalChapters: filters.value.totalChapters || null,
        classDates: filters.value.classDates || null,
        instructorName: filters.value.instructorName || null,
        instructorPhoneNumber: filters.value.instructorPhoneNumber || null,
        startDate: filters.value.startDate || null,
        endDate: filters.value.endDate || null,
      };

      Object.keys(requestBody).forEach((key) => {
        if (requestBody[key] == null || requestBody[key] === "") {
          delete requestBody[key];
        }
      });

      console.log("Request Body:", requestBody);

      try {
        await axios.put(
          `http://localhost:8081/api/v1/admin/instructor-applications/status`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire({
          title: "필터 적용 완료",
          text: "선택된 상태 필터가 적용되었습니다.",
          icon: "success",
          customClass: {
            confirmButton: "btn fw-semibold btn-primary",
          },
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error("Error applying status filter: ", error);
        Swal.fire({
          title: "오류",
          text: "상태 필터 적용에 실패했습니다.",
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
          `http://localhost:8081/api/v1/admin/instructor-applications/status-by-ids`,
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
          window.location.reload();
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
        columnLabel: "classDates",
        sortEnabled: true,
        columnWidth: 200,
      },
      {
        columnName: "강사 이름",
        columnLabel: "instructorName",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "강사 전화번호",
        columnLabel: "instructorPhoneNumber",
        sortEnabled: false,
        columnWidth: 150,
      },
    ]);


    const statusColor = {
      ASSIGNED: "primary",
      UNASSIGNED: "info",
      REJECTED: "danger"
    };

    const statusLabel = {
      ASSIGNED: "배정",
      UNASSIGNED: "미배정",
      REJECTED: "탈락"
    };

    const isLoading = ref<boolean>(false);
    const isAscending = ref({
      status: true,
      institutionName: true,
      programName: true,
      totalChapters: true,
      classDates: true,
      instructorName: true,
      instructorPhoneNumber: true,
      date: true,
    });

    const currentSortBy = ref<string>("");

    const filters = ref({
      status: "",
      institutionName: "",
      programName: "",
      totalChapters: "",
      classDates: "",
      instructorName: "",
      instructorPhoneNumber: "",
      startDate: "",
      endDate: "",
    });


    const handleFilter = (filterData) => {
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
          `http://localhost:8081/api/v1/admin/instructor-applications?page=${page}&size=${pageSize.value}&search=${search.value}${sortBy}${filterQuery}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseData = response.data;

        data.value = responseData.content.map((program: IProgram) => ({
          ...program,
          status: program.status || "-",
          institutionName: program.institutionName || "-",
          programName: program.programName || "-",
          totalChapters: program.totalChapters || "-",
          classDates: program.classDates || "-",
          instructorName: program.instructorName || "-",
          instructorPhoneNumber: program.instructorPhoneNumber || "-",
          role: program.role || "-",
        }));

        totalElements.value = responseData.totalElements;
        totalPages.value = responseData.totalPages;
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        isLoading.value = false;
      }
    };

    const buildFilterQuery = (filtersData) => {
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
      if (filtersData.totalChapters) {
        query += `&totalChapters=${encodeURIComponent(filtersData.totalChapters)}`;
      }
      if (filtersData.classDates) {
        query += `&classDates=${encodeURIComponent(filtersData.classDates)}`;
      }
      if (filtersData.instructorName) {
        query += `&instructorName=${encodeURIComponent(filtersData.instructorName)}`;
      }
      if (filtersData.instructorPhoneNumber) {
        query += `&instructorPhoneNumber=${encodeURIComponent(filtersData.instructorPhoneNumber)}`;
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
        await axios.delete(`http://localhost:8081/api/v1/admin/instructor-applications/${id}`, {
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
          ? "&sortBy=totalChapters&direction=asc"
          : "&sortBy=totalChapters&direction=desc";
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
      } else if (sort.label === "classDates") {
        sortBy = isAscending.value.classDates
          ? "&sortBy=classDates&direction=asc"
          : "&sortBy=classDates&direction=desc";
        isAscending.value.classDates = !isAscending.value.classDates;
      } else if (sort.label === "instructorName") {
        sortBy = isAscending.value.instructorName
          ? "&sortBy=instructorName&direction=asc"
          : "&sortBy=instructorName&direction=desc";
        isAscending.value.instructorName = !isAscending.value.instructorName;
      } else if (sort.label === "instructorPhoneNumber") {
        sortBy = isAscending.value.instructorPhoneNumber
          ? "&sortBy=instructorPhoneNumber&direction=asc"
          : "&sortBy=instructorPhoneNumber&direction=desc";
        isAscending.value.instructorPhoneNumber = !isAscending.value.instructorPhoneNumber;
      } else if (sort.label === "date") {
        sortBy = isAscending.value.date
          ? "&sortBy=date&direction=asc"
          : "&sortBy=date&direction=desc";
        isAscending.value.date = !isAscending.value.date;
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
      router.push({ name: "admin-ApplReviewDetails", params: { id: program.id } });
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
      filterGoalIsConfirmed,
      applyStatusFilter,
      filterNewStatus,
      showRegisterButton,
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
  transition: opacity 0s ease;
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
.checkbox-button, .filtercheckbox-button, .applycheckbox-button, .delcheckbox-button {
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
.column-createdAt {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.column-isConfirmed {
  width: 70px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.column-institutionName {
  width: 110x;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.column-programName {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.column-createdAt {
  width: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.column-grade {
  width: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.column-classNumber {
  width: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.column-numberOfStudents {
  width: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
.column-date {
  width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
.column-remark {
  width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

@media (min-width: 769px) {
  .desktop-text {
    display: inline;
  }
  .mobile-text {
    display: none;
  }
  .cmdel-selected {
    display: none;
  }
  .comdel-selected {
    display: none;
  }
}

@media (max-width: 768px) {
  .desktop-text {
    display: none;
  }
  .mobile-text {
    display: inline;
  }

  .cmdel-selected {
    display: none;
  }

  .del-selected {
    display: none;
  }

  .check-delline {
    display: none;
  }
  
  .check-selected {
    margin-left: -10px;
  }
  
  .box-leftsort {
    margin-left: 0;
  }

  .applycheckbox-button, .checkbox-button, .delcheckbox-button {
    width: 60px;
  }

  .filtercheckbox-button {
    width: 90px;
  }

  .justify-content-between {
    justify-content: flex-start !important;
  }

  .table-row {
    display: block;
    margin-bottom: 15px;
  }
  .column-isConfirmed,
  .column-institutionName,
  .column-programName,
  .column-createdAt,
  .column-grade,
  .column-classNumber,
  .column-numberOfStudents,
  .column-date,
  .column-remark {
    display: block;
    width: auto; /* 너비를 자동으로 조정 */
    white-space: normal; /* 텍스트가 너무 길면 자동 줄 바꿈 */
    overflow: visible;
    text-overflow: clip; /* 넘치는 텍스트를 표시하지 않음 */
    margin: 10px 0;
  }

  /* 열을 세로로 나열하면서 셀 내용에도 스타일 적용 */
  .table-row > div {
    display: block;
    padding: 10px;
    border: 1px solid #ddd;
    margin: 5px 0;
  }
}
</style>
