<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
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
                    <select v-model="selectedIsConfirmed" class="form-select checkbox-button dropdown-button">
                      <option value="Y">확정</option>
                      <!-- <option value="N">미확정</option> -->
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

          <div class="d-flex justify-content-end align-items-center">
            <button
              tabindex="3"
              type="button"
              @click="onButtonAction"
              class="btn btn-light-primary checkbox-button"
            >
              <span class="indicator-label">프로그램 등록</span>
            </button>
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
          <Dropdown4 @apply-filter="handleFilter"></Dropdown4>
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

        <template v-slot:isConfirmed="{ row: customer }">
          <div class="column-isConfirmed" @click="onProgramClick(customer)" style="cursor: pointer;">
            <span :class="`badge py-3 px-4 fs-7 badge-light-${statusColor[customer.isConfirmed]}`">
              {{ statusLabel[customer.isConfirmed] }}
            </span>
          </div>
        </template>
        <template v-slot:institutionName="{ row: customer }">
          <div class="column-institutionName" @click="onProgramClick(customer)" style="cursor: pointer;">
            {{ customer.institutionName }}
          </div>
        </template>
        <template v-slot:programName="{ row: customer }">
          <div class="column-programName" @click="onProgramClick(customer)" style="cursor: pointer;">
            {{ customer.programName }}
          </div>
        </template>
        <template v-slot:chapterNumber="{ row: customer }">
          <div class="column-chapterNumber" @click="onProgramClick(customer)" style="cursor: pointer;">
            {{ customer.chapterNumber }}
          </div>
        </template>
        <template v-slot:numberOfStudents="{ row: customer }">
          <div class="column-numberOfStudents" @click="onProgramClick(customer)" style="cursor: pointer;">
            {{ customer.numberOfStudents }}
          </div>
        </template>
        <template v-slot:grade="{ row: customer }">
          <div class="column-grade" @click="onProgramClick(customer)" style="cursor: pointer;">
            {{ customer.grade }}
          </div>
        </template>
        <template v-slot:classNumber="{ row: customer }">
          <div class="column-classNumber" @click="onProgramClick(customer)" style="cursor: pointer;">
            {{ customer.classNumber }}
          </div>
        </template>
        <template v-slot:date="{ row: customer }">
          <div class="column-date" @click="onProgramClick(customer)" style="cursor: pointer;">
            {{ customer.date }}
          </div>
        </template>
        <template v-slot:remark="{ row: customer }">
          <div class="column-remark" @click="onProgramClick(customer)" style="cursor: pointer;">
            {{ customer.remark }}
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
import Dropdown4 from "@/components/dropdown/Dropdown4.vue";

interface IProgram {
  id: number;
  status: string;
  isConfirmed: string;
  institutionName: number | null;
  programName: number | null;
  chapterNumber: number | null;
  numberOfStudents: string | null;
  grade: number | null;
  classNumber: number | null;
  remark: string | null;
  date: number | null;
  // createdAt: number;
}

export default defineComponent({
  name: "kt-program-list",
  components: {
    KTDatatable,
    Dropdown4,
  },

  setup() {
    const router = useRouter();
    const data = ref<Array<IProgram>>([]);
    const totalElements = ref<number>(0);
    const totalPages = ref<number>(0);
    const currentPage = ref<number>(0);
    const pageSize = ref<number>(10);
    const search = ref<string>("");
    const selectedItems = ref<Array<IProgram>>([]);
    const selectedIds = ref<Array<number>>([]);
    const selectedIsConfirmed = ref("Y");

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
        text: "한번 결정하면 돌릴 수 없어요! 정말 확정 하실건가요?",
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
          educationIds: selectedIds.value,
          isConfirmed: selectedIsConfirmed.value,
        };

        await axios.post(
          `http://localhost:8081/api/v1/admin/apply-for-programs/isConfirmed`,
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
        columnName: "확정",
        columnLabel: "isConfirmed",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "교육기관명",
        columnLabel: "institutionName",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "프로그램명",
        columnLabel: "programName",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "총 차시",
        columnLabel: "chapterNumber",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "학생 수",
        columnLabel: "numberOfStudents",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "학년",
        columnLabel: "grade",
        sortEnabled: true,
        columnWidth: 50,
      },
      {
        columnName: "반",
        columnLabel: "classNumber",
        sortEnabled: false,
        columnWidth: 50,
      },
      {
        columnName: "날짜",
        columnLabel: "date",
        sortEnabled: true,
        columnWidth: 300,
      },
      {
        columnName: "메모",
        columnLabel: "remark",
        sortEnabled: false,
        columnWidth: 300,
      },
    ]);

    const statusColor = {
      Y: "primary",
      N: "danger"
    };

    const statusLabel = {
      Y: "확정",
      N: "미확정"
    };

    const isLoading = ref<boolean>(false);
    const isAscending = ref({
      status: true,
      isConfirmed: true,
      institutionName: true,
      programName: true,
      chapterNumber: true,
      grade: true,
      numberOfStudents: true,
      date: true,
    });

    const currentSortBy = ref<string>("");

    const filters = ref({
      status: "",
      isConfirmed: "",
      institutionName: "",
      programName: "",
      startDate: "",
      endDate: "",
      chapterNumber: "",
      grade: "",
      numberOfStudents: "",
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
          `http://localhost:8081/api/v1/admin/apply-for-programs?page=${page}&size=${pageSize.value}&search=${search.value}${sortBy}${filterQuery}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseData = response.data;
          console.log('Number of contents:', responseData.content.length);
          console.log('Total elements:', responseData.totalElements);
          console.log('Total pages from API:', responseData.totalPages);
          console.log(
            "API 호출 URL:",
            `http://localhost:8081/api/v1/admin/apply-for-programs?page=${page}&size=${pageSize.value}&search=${search.value}${sortBy}${filterQuery}`
          );
          console.log("API 응답 데이터:", response.data);

        data.value = responseData.content.map((program: IProgram) => ({
          ...program,
          status: program.status,
          isConfirmed: program.isConfirmed,
          institutionName: program.institutionName ? program.institutionName : "-",
          programName: program.programName ? program.programName : "-",
          chapterNumber: program.chapterNumber ? program.chapterNumber : "-",
          numberOfStudents: program.numberOfStudents ? program.numberOfStudents : "-",
          grade: program.grade ? program.grade : "-",
          classNumber: program.classNumber ? program.classNumber : "-",
          date: program.date ? program.date : "-",
          remark: program.remark ? program.remark : "-",
        }));

        totalElements.value = responseData.content.length;
        totalPages.value = Math.ceil(totalElements.value / pageSize.value); // totalPages를 직접 계산합니다.
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        isLoading.value = false;
      }
    };



    const buildFilterQuery = (filtersData) => {
      let query = "";
      if (filtersData.chapter) {
        query += `&chapter=${encodeURIComponent(filtersData.chapter)}`;
      }
      if (filtersData.isConfirmed) {
        query += `&isConfirmed=${encodeURIComponent(filtersData.isConfirmed)}`;
      }
      if (filtersData.programName) {
        query += `&programName=${encodeURIComponent(filtersData.programName)}`;
      }
      if (filtersData.institutionName) {
        query += `&institutionName=${encodeURIComponent(filtersData.institutionName)}`;
      }
      if (filtersData.startDate) {
        query += `&startDate=${encodeURIComponent(filtersData.startDate)}`;
      }
      if (filtersData.endDate) {
        query += `&endDate=${encodeURIComponent(filtersData.endDate)}`;
      }
      if (filtersData.numberOfStudents) {
        query += `&numberOfStudents=${encodeURIComponent(filtersData.numberOfStudents)}`;
      }
      if (filtersData.grade) {
        query += `&grade=${encodeURIComponent(filtersData.grade)}`;
      }
      if (filtersData.classNumber) {
        query += `&classNumber=${encodeURIComponent(filtersData.classNumber)}`;
      }
      if (filtersData.numberOfStudents) {
        query += `&numberOfStudents=${encodeURIComponent(filtersData.numberOfStudents)}`;
      }
      // if (filtersData.startDate) {
      //   query += `&startDate=${filtersData.startDate}`;
      // }
      // if (filtersData.endDate) {
      //   query += `&endDate=${filtersData.endDate}`;
      // }

      return query;
    };

    onMounted(() => {
      fetchPrograms(currentPage.value, currentSortBy.value, filters.value);
    });

    const deleteSubscription = async (id: number) => {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8081/api/v1/admin/apply-for-programs/${id}`, {
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
      if (sort.label === "isConfirmed") {
        sortBy = isAscending.value.isConfirmed
          ? "&sortBy=isConfirmed&direction=asc"
          : "&sortBy=isConfirmed&direction=desc";
        isAscending.value.isConfirmed = !isAscending.value.isConfirmed;
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
      } else if (sort.label === "chapterNumber") {
        sortBy = isAscending.value.chapterNumber
          ? "&sortBy=chapterNumber&direction=asc"
          : "&sortBy=chapterNumber&direction=desc";
        isAscending.value.chapterNumber = !isAscending.value.chapterNumber;
      } else if (sort.label === "grade") {
        sortBy = isAscending.value.grade
          ? "&sortBy=grade&direction=asc"
          : "&sortBy=grade&direction=desc";
        isAscending.value.grade = !isAscending.value.grade;
      } else if (sort.label === "numberOfStudents") {
        sortBy = isAscending.value.numberOfStudents
          ? "&sortBy=numberOfStudents&direction=asc"
          : "&sortBy=numberOfStudents&direction=desc";
        isAscending.value.numberOfStudents = !isAscending.value.numberOfStudents;
      } else if (sort.label === "chapterNumber") {
        sortBy = isAscending.value.chapterNumber
          ? "&sortBy=chapterNumber&direction=asc"
          : "&sortBy=chapterNumber&direction=desc";
        isAscending.value.chapterNumber = !isAscending.value.chapterNumber;
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
      selectedIsConfirmed,
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

</style>
