<template>
  <!--begin::Card-->
  <div class="card">

    <!--begin::Card header-->
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <!-- Search input (if needed) -->
        <!-- <div class="d-flex align-items-center position-relative my-1">
          <KTIcon
            icon-name="magnifier"
            icon-class="fs-1 position-absolute ms-6"
          />
          <input
            v-model="search"
            @input="searchItems()"
            type="text"
            data-kt-subscription-table-filter="search"
            class="form-control form-control-solid w-250px ps-14"
            placeholder="Search Subscriptions"
          />
        </div> -->
      </div>

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <div class="d-flex justify-content-end align-items-center">
          <!-- Loading button or other toolbar items -->
        </div>
        <!--begin::Toolbar-->
        <div
          v-if="selectedIds.length === 0"
          class="d-flex justify-content-end"
          data-kt-subscription-table-toolbar="base"
        >
          <!--begin::Dropdown-->
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
            <Dropdown2 @apply-filter="handleFilter"></Dropdown2>
          </div>
          <!--end::Dropdown-->
        </div>
        <!--end::Toolbar-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body pt-0">
      <!-- Loading Overlay -->
      <div v-if="isLoading" class="overlay">
        <div class="loader"></div>
      </div>
      <KTDatatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        :data="data"
        :header="headerConfig"
      >
        <template v-slot:customer="{ row: customer }">
          <div class="column-customer">
            <div>
              <div class="text-gray-800 text-hover-primary mb-1">
                {{ customer.customer }}
              </div>
              <div class="text-muted small">
                <!-- List of instructor names -->
                <!-- <span v-if="customer.status.length > 0" v-for="(teacher, index) in customer.status" :key="index">
                  {{ teacher }}<span v-if="index < customer.status.length - 1">, </span>
                </span> -->
                <span>
                  신청현황
                </span>

                <!-- Instructor count / max instructors or full indication -->
                <span class="ms-2">
                  <template v-if="!customer.status || customer.status.length === 0 || customer.status.includes(null)">
                    (0 / {{ customer.maxInstructors }})
                  </template>
                  <template v-else-if="customer.status.length === customer.maxInstructors">
                    <span class="text-danger">(마감)</span>
                  </template>
                  <template v-else>
                    ({{ customer.status.length }} / {{ customer.maxInstructors }})
                  </template>
                </span>
              </div>
            </div>
          </div>
        </template>

        <template v-slot:institutionName="{ row: customer }">
          <div class="column-institutionName">
            {{ customer.institutionName }}
          </div>
        </template>

        <template v-slot:date="{ row: customer }">
          <div class="column-date">
            {{ customer.date }}
          </div>
        </template>

      </KTDatatable>

      <!-- Pagination Controls -->
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
              <i class="page-link ki-duotone ki-left fs-2">
              </i>
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
              <i class="page-link ki-duotone ki-right fs-2">
              </i>
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
    <!--end::Card body-->
  </div>
  <!--end::Card-->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import axios from "axios";
import { ApiUrl } from "@/assets/ts/_utils/api";
import Dropdown2 from "@/components/dropdown/Dropdown2.vue";

interface Sort {
  order: "asc" | "desc";
  label: string;
}

interface ISubscription {
  id: number;
  customer: string;
  status: Array<string | null>; // Instructor names (can include null)
  product: string;
  maxInstructors: number; // Max number of instructors
  institutionName: string;
  date: string;
}

export default defineComponent({
  name: "kt-subscription-list",
  components: {
    KTDatatable,
    Dropdown2,
  },
  setup() {

    const router = useRouter();
    const data = ref<Array<ISubscription>>([]);
    const totalElements = ref<number>(0);
    const totalPages = ref<number>(0);
    const currentPage = ref<number>(0);
    const pageSize = ref<number>(10);
    const headerConfig = ref([
      {
        columnName: "프로그램명 및 모집인원",
        columnLabel: "customer",
        sortEnabled: true,
      },
      {
        columnName: "교육기관명",
        columnLabel: "institutionName",
        sortEnabled: true,
      },
      {
        columnName: "날짜",
        columnLabel: "date",
        sortEnabled: true,
      }
    ]);

    const isLoading = ref(false);
    const currentSortBy = ref<string>("");
    const isAscending = ref({ customer: true, institutionName: true, date: true });

    // Filters for the dropdown
    const filters = ref({
      status: "",
      startDate: "",
      endDate: "",
      programName: "",
      institutionName: "",
    });

    const handleFilter = (filterData) => {
      filters.value = filterData;
      currentPage.value = 0; // Reset to first page
      loadDataFromApi(currentPage.value, currentSortBy.value, filters.value);
    };

    const loadDataFromApi = async (
      page: number = 0,
      sortBy: string = currentSortBy.value,
      filtersData = filters.value
    ) => {
      try {
        if (page === 0 && sortBy === "") isLoading.value = true;
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Token이 없습니다.");

        const filterQuery = buildFilterQuery(filtersData);
        const url = ApiUrl(`/api/v1/user/instructor-applications/status-ready/paged?page=${page}&size=${pageSize.value}${sortBy}${filterQuery}`);
        console.log("API 호출 URL:", url);

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (Array.isArray(response.data.content)) {
          const programMap = new Map<number, any>(); // Group data by confirmedProgramId

          response.data.content.forEach((item: any) => {
            const existingProgram = programMap.get(item.confirmedProgram);
            if (existingProgram) {
              if (item.instructorName) {
                existingProgram.status.push(item.instructorName);
              }
            } else {
              programMap.set(item.confirmedProgram, {
                id: item.confirmedProgram,
                customer: item.programName,
                status: item.instructorName ? [item.instructorName] : [],
                product: "신청하기",
                maxInstructors: item.numberOfInstructors,
                institutionName: item.institutionName,
                date: item.date.split("T")[0],
              });
            }
          });

          const apiData = Array.from(programMap.values());
          data.value.splice(0, data.value.length, ...apiData);
          totalElements.value = response.data.totalElements;
          totalPages.value = response.data.totalPages;
        } else {
          throw new Error("API 응답의 content가 배열이 아닙니다.");
        }

        isLoading.value = false;
      } catch (error) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다.', error);
        isLoading.value = false;
      }
    };

    const buildFilterQuery = (filtersData) => {
      let query = '';
      if (filtersData.status) {
        query += `&status=${filtersData.status}`;
      }
      if (filtersData.startDate) {
        query += `&startDate=${filtersData.startDate}`;
      }
      if (filtersData.endDate) {
        query += `&endDate=${filtersData.endDate}`;
      }
      if (filtersData.programName) {
        query += `&programName=${encodeURIComponent(filtersData.programName)}`;
      }
      if (filtersData.institutionName) {
        query += `&institutionName=${encodeURIComponent(filtersData.institutionName)}`;
      }
      return query;
    };

    onMounted(() => {
      loadDataFromApi(currentPage.value, currentSortBy.value, filters.value);
    });

    const selectedIds = ref<Array<number>>([]);
    const deleteFewSubscriptions = () => {
      selectedIds.value.forEach((item) => deleteSubscription(item));
      selectedIds.value.length = 0;
    };
    const deleteSubscription = (id: number) => {
      data.value = data.value.filter((item) => item.id !== id);
    };
    const sort = (sort: Sort) => {
      let sortBy = "";
      if (sort.label === "customer") {
        sortBy = isAscending.value.customer
          ? "&sortBy=programName&direction=asc"
          : "&sortBy=programName&direction=desc";
        isAscending.value.customer = !isAscending.value.customer;
      } 
      else if (sort.label === "institutionName") {
        sortBy = isAscending.value.institutionName
          ? "&sortBy=institutionName&direction=asc"
          : "&sortBy=institutionName&direction=desc";
        isAscending.value.institutionName = !isAscending.value.institutionName;
      } 
      else if (sort.label === "date") {
        sortBy = isAscending.value.date
          ? "&sortBy=date&direction=asc"
          : "&sortBy=date&direction=desc";
        isAscending.value.date = !isAscending.value.date;
      }
      currentSortBy.value = sortBy;
      loadDataFromApi(currentPage.value, sortBy, filters.value);
    };

    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    const search = ref<string>("");
    const searchItems = () => {
      loadDataFromApi(currentPage.value, currentSortBy.value, filters.value);
    };

    const onPageChange = async (page: number) => {
      currentPage.value = page;
      await loadDataFromApi(page, currentSortBy.value, filters.value);
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

    return {
      search,
      searchItems,
      data,
      headerConfig,
      sort,
      onItemSelect,
      selectedIds,
      deleteFewSubscriptions,
      deleteSubscription,
      isLoading,
      visiblePages,
      currentPage,
      totalPages,
      onPageChange,
      filters,
      handleFilter,
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.column-customer,
.column-institutionName,
.column-date {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.column-customer {
  width: 200px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.column-institutionName {
  width: 170px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.column-date {
  width: 120px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

</style>
