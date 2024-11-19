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

                <!-- <div class="d-flex align-items-center me-3" style=" margin-right: 0 !important">
                  <div class="dropdown me-2">
                    <select v-model="selectedStatus" class="form-select checkbox-button dropdown-button">
                      <option value="OPEN">OPEN</option>
                      <option value="CLOSE">CLOSE</option>
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

                <div class="ms-4" style=" margin-left: 0 !important">
                  <button
                    type="button"
                    class="btn btn-danger checkbox-button"
                    @click="onDeletePrograms"
                  >
                    프로그램 삭제
                  </button>
                </div> -->
                <div class="vertical-separator mx-3"></div>
              </div>
            </transition>
          </div>


          <!-- <div class="d-flex justify-content-end align-items-center">
            <button
              tabindex="3"
              type="button"
              @click="onButtonAction"
              class="btn btn-light-primary checkbox-button"
            >
              <span class="indicator-label">프로그램 등록</span>
            </button>
          </div> -->
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
          <Dropdown3 @apply-filter="handleFilter"></Dropdown3>
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
        <template v-slot:header-status>
          <div>상태</div>
        </template>
        <template v-slot:header-programName>
          <div>프로그램명</div>
        </template>
        <template v-slot:header-chapter>
          <div>총 차시</div>
        </template>
        <template v-slot:header-product>
          <div>교구</div>
        </template>
        <template v-slot:header-level>
          <div>레벨</div>
        </template>
        <template v-slot:header-remark>
          <div>비고</div>
        </template>
        <template v-slot:header-createdAt>
          <div>생성 날짜</div>
        </template>

        <template v-slot:status="{ row: customer }">
          <div class="column-status" @click="onProgramClick(customer)" style="cursor: pointer;">
            <span :class="`badge py-3 px-4 fs-7 badge-light-${statusColor[customer.status]}`">
              {{ statusLabel[customer.status] }}
            </span>
          </div>
        </template>
        <template v-slot:programName="{ row: customer }">
          <div class="column-programName" @click="onProgramClick(customer)" style="cursor: pointer;">
            {{ customer.programName }}
          </div>
        </template>
        <template v-slot:chapter="{ row: customer }">
          <div class="column-chapter">{{ customer.chapter }}</div>
        </template>
        <template v-slot:product="{ row: customer }">
          <div class="column-product">{{ customer.product }}</div>
        </template>
        <template v-slot:level="{ row: customer }">
          <div class="column-level">{{ customer.level }}</div>
        </template>
        <template v-slot:remark="{ row: customer }">
          <div class="column-remark">{{ customer.remark }}</div>
        </template>
        <template v-slot:createdAt="{ row: customer }">
          <div class="column-createdAt">{{ customer.createdAt }}</div>
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
import Dropdown3 from "@/components/dropdown/Dropdown3.vue";
import { ApiUrl } from "@/assets/ts/_utils/api";

interface IProgram {
  id: number;
  status: string;
  programName: string;
  chapter: number | null;
  product: number | null;
  level: number | null;
  remark: string | null;
  createdAt: number;
}

export default defineComponent({
  name: "kt-program-list",
  components: {
    KTDatatable,
    Dropdown3,
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
    const selectedStatus = ref("OPEN");

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

      try {
        const requestBody = {
          programIds: selectedIds.value,
          status: selectedStatus.value,
        };

        console.log("API 호출 URL:", ApiUrl(`/client/programs/status`));
        console.log("요청 바디:", requestBody);

        await axios.post(
          ApiUrl(`/client/programs/status`),
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
        columnWidth: 50,
      },
      {
        columnName: "프로그램명",
        columnLabel: "programName",
        sortEnabled: true,
        columnWidth: 200,
      },
      {
        columnName: "총 차시",
        columnLabel: "chapter",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "교구",
        columnLabel: "product",
        sortEnabled: true,
        columnWidth: 50,
      },
      {
        columnName: "레벨",
        columnLabel: "level",
        sortEnabled: true,
        columnWidth: 50,
      },
      {
        columnName: "비고",
        columnLabel: "remark",
        sortEnabled: false,
        columnWidth: 200,
      },
      {
        columnName: "생성 날짜",
        columnLabel: "createdAt",
        sortEnabled: false,
        columnWidth: 150,
      },
    ]);

    const statusColor = {
      OPEN: "primary",
      CLOSE: "danger"
    };

    const statusLabel = {
      OPEN: "OPEN",
      CLOSE: "CLOSE"
    };

    const isLoading = ref<boolean>(false);
    const isAscending = ref({
      status: true,
      programName: true,
      chapter: true,
      product: true,
      level: true,
    });

    const currentSortBy = ref<string>("");

    const filters = ref({
      status: "",
      programName: "",
      chapter: "",
      product: "",
      startDate: "",
      endDate: "",
      level: "",
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
          ApiUrl(`/client/programs?page=${page}&size=${pageSize.value}&search=${search.value}${sortBy}${filterQuery}`),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseData = response.data;
        console.log(
          "API 호출 URL:",
          ApiUrl(`/client/programs?page=${page}&size=${pageSize.value}&search=${search.value}${sortBy}${filterQuery}`)
        );
        console.log("API 응답 데이터:", response.data);

        data.value = responseData.content.map((program: IProgram) => ({
          ...program,
          status: program.status,
          programName: program.programName,
          chapter: program.chapter ? program.chapter : "-",
          product: program.product ? program.product : "-",
          level: program.level ? program.level : "-",
          remark: program.remark ? program.remark : "-",
          createdAt: new Date(program.createdAt * 1000).toISOString().split("T")[0], 
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
      if (filtersData.programName) {
        query += `&programName=${encodeURIComponent(filtersData.programName)}`;
      }
      if (filtersData.product) {
        query += `&product=${encodeURIComponent(filtersData.product)}`;
      }
      if (filtersData.chapter) {
        query += `&chapter=${encodeURIComponent(filtersData.chapter)}`;
      }
      if (filtersData.level) {
        query += `&level=${encodeURIComponent(filtersData.level)}`;
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
        await axios.delete(ApiUrl(`/client/programs/${id}`), {
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
          }).then(() => {
            window.location.reload();
          });
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
      }
    };

    const sort = (sort: Sort) => {
      let sortBy = "";
      if (sort.label === "programName") {
        sortBy = isAscending.value.programName
          ? "&sortBy=programName&direction=asc"
          : "&sortBy=programName&direction=desc";
        isAscending.value.programName = !isAscending.value.programName;
      } else if (sort.label === "chapter") {
        sortBy = isAscending.value.chapter
          ? "&sortBy=chapter&direction=asc"
          : "&sortBy=chapter&direction=desc";
        isAscending.value.chapter = !isAscending.value.chapter;
      } else if (sort.label === "product") {
        sortBy = isAscending.value.product
          ? "&sortBy=product&direction=asc"
          : "&sortBy=product&direction=desc";
        isAscending.value.product = !isAscending.value.product;
      } else if (sort.label === "level") {
        sortBy = isAscending.value.level
          ? "&sortBy=level&direction=asc"
          : "&sortBy=level&direction=desc";
        isAscending.value.level = !isAscending.value.level;
      } else if (sort.label === "status") {
        sortBy = isAscending.value.status
          ? "&sortBy=status&direction=asc"
          : "&sortBy=status&direction=desc";
        isAscending.value.status = !isAscending.value.status;
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
      router.push({ name: "client-programDetails", params: { id: program.id } });
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
      selectedStatus,
      changeProgramStatus,
      statusColor,
      statusLabel,
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
.column-status,
.column-programName,
.column-chapter,
.column-product,
.column-createdAt {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.column-status{
  width: 70px;
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

.column-chapter {
  width: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.column-product {
  width: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.column-createdAt {
  width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
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
</style>
