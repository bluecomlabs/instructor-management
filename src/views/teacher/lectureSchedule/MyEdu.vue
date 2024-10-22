<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
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
      <div class="card-toolbar">
        <div
          v-if="selectedIds.length === 0"
          class="d-flex justify-content-end"
          data-kt-subscription-table-toolbar="base">
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
          <Dropdown1 @apply-filter="handleFilter"></Dropdown1>
        </div>
      </div>
    </div>

    <div class="card-body pt-0">
      <!-- 로딩 오버레이 -->
      <div v-if="isLoading" class="overlay">
        <div class="loader"></div>
      </div>

      <KTDatatable
        @on-sort="handleSort"
        @on-items-per-page-change="onItemsPerPageChange"
        :data="data"
        :header="headerConfig"
        :checkbox-enabled="false"
      >
        <template v-slot:status="{ row: customer }">
          <div class="column-status">
            <span :class="`badge py-3 px-4 fs-7 badge-light-${statusColor[customer.status]}`">
              {{ statusLabel[customer.status] }}
            </span>
          </div>
        </template>
        <template v-slot:PRGN_NM="{ row: customer }">
          <div class="column-PRGN_NM">
            {{ customer.PRGN_NM }}
          </div>
        </template>
        <template v-slot:INST_NM="{ row: customer }">
          <div class="column-INST_NM">
            {{ customer.INST_NM }}
          </div>
        </template>
        <template v-slot:createdDate="{ row: customer }">
          <div class="column-createdDate">
            {{ customer.createdDate }}
          </div>
        </template>
        <template v-slot:customer="{ row: customer }">
          <div class="column-customer">
            <router-link to="Attendance" class="btn btn-light-primary me-2">
              {{ customer.customer }}
            </router-link>
          </div>
        </template>
        <template v-slot:educationjournal="{ row: customer }">
          <div class="column-educationjournal">
            <router-link to="EducationJournal" class="btn btn-light-primary me-2">
              {{ customer.educationjournal }}
            </router-link>
          </div>
        </template>
        <template v-slot:product="{ row: customer }">
          <div class="column-product">
            <router-link to="syllabus" class="btn btn-light-primary me-2">
              {{ customer.product }}
            </router-link>
          </div>
        </template>
        <!-- 나머지 템플릿 그대로 유지 -->
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
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted, ref, computed } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import axios from "axios";
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";
import Dropdown1 from "@/components/dropdown/Dropdown1.vue";
import { ApiUrl } from "@/assets/ts/_utils/api";

interface ISubscription {
  id: number;
  status: string;
  PRGN_NM: string;
  INST_NM: string;
  createdDate: string;
  customer: string;
  educationjournal: string;
  color: string;
  product: string;
}

export default defineComponent({
  name: "kt-subscription-list",
  components: {
    KTDatatable,
    Dropdown1
  },
  setup() {
    const filters = ref({
      status: "",
      startDate: "",
      endDate: "",
      programName: "",
      institutionName: "",
    });
    const handleFilter = (filterData) => {
      filters.value = filterData;
      currentPage.value = 0; // 첫 페이지로 리셋
      fetchData(currentPage.value, currentSortBy.value, filters.value);
    };
    const statusColor = {
      INIT: "primary",
      PROGRESS: "info",
      COMPLETE: "success",
      PAUSE: "warning",
      CANCEL: "danger",
    };

    const statusLabel = {
      INIT: "신청완료",
      PROGRESS: "진행 중",
      COMPLETE: "수업완료",
      PAUSE: "수업중지",
      CANCEL: "수업취소",
    };

    const data = ref<Array<ISubscription>>([]);
    const initData = ref<Array<ISubscription>>([]);
    const isAscending = ref({ PRGN_NM: true, INST_NM: true, status: true, createdDate: true });
    const isLoading = ref(false);
    const currentSortBy = ref<string>("");

    const headerConfig = ref([
      {
        columnName: "상태",
        columnLabel: "status",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "프로그램명",
        columnLabel: "PRGN_NM",
        sortEnabled: true,
        columnWidth: 200,
      },
      {
        columnName: "교육기관",
        columnLabel: "INST_NM",
        sortEnabled: true,
        columnWidth: 170,
      },
      {
        columnName: "수업날짜",
        columnLabel: "createdDate",
        sortEnabled: true,
        columnWidth: 120,
      },
      {
        columnName: "출석부",
        columnLabel: "customer",
        sortEnabled: true,
      },
      {
        columnName: "교육일지",
        columnLabel: "educationjournal",
        sortEnabled: true,
      },
      {
        columnName: "강의확인서",
        columnLabel: "product",
        sortEnabled: true,
      },
    ]);

    const totalElements = ref<number>(0);
    const totalPages = ref<number>(0);
    const currentPage = ref<number>(0);
    const pageSize = ref<number>(10);

    const fetchData = async (
      page: number = 0,
      sortBy: string = currentSortBy.value,
      filtersData = filters.value
    ) => {
      try {
        if (page === 0 && sortBy === "") isLoading.value = true;
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token이 없습니다.");
        }

        const filterQuery = buildFilterQuery(filtersData);

        const url = ApiUrl(
          `/api/v1/user/assistant-instructors?page=${page}&size=${pageSize.value}${sortBy}${filterQuery}`
        );

        console.log("API 호출 URL:", url);

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API 응답:", response.data);

        const apiData = response.data.content.map((item) => ({
          id: item.id,
          customer: "상세보기",
          educationjournal: "상세보기",
          color: "success",
          PRGN_NM: item.programName,
          status: item.status,
          product: "상세보기",
          createdDate: new Date(item.createdAt).toISOString().split("T")[0],
          INST_NM: item.institutionName,
        }));

        data.value = apiData;
        initData.value = [...apiData];
        totalElements.value = response.data.totalElements;
        totalPages.value = response.data.totalPages;
        isLoading.value = false;
      } catch (error) {
        console.error("Failed to fetch data:", error);
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
      fetchData(currentPage.value, currentSortBy.value, filters.value);
    });

    const selectedIds = ref<Array<number>>([]);
    const deleteFewSubscriptions = () => {
      selectedIds.value.forEach((item) => {
        deleteSubscription(item);
      });
      selectedIds.value.length = 0;
    };

    const deleteSubscription = (id: number) => {
      data.value = data.value.filter((item) => item.id !== id);
    };

    const sort = (sort: Sort) => {
      const reverse: boolean = sort.order === "asc";
      if (sort.label) {
        arraySort(data.value, sort.label, { reverse });
      }
    };

    const search = ref<string>("");

    // const searchItems = () => {
    //   data.value = initData.value.filter((item) =>
    //     searchingFunc(item, search.value)
    //   );
    //   MenuComponent.reinitialization();
    // };

    const searchingFunc = (obj: any, value: string): boolean => {
      return Object.keys(obj).some((key) =>
        obj[key].toString().toLowerCase().includes(value.toLowerCase())
      );
    };

    const onItemsPerPageChange = () => {
      setTimeout(() => {
        MenuComponent.reinitialization();
      }, 0);
    };

    const handleSort = (sort: Sort) => {
      let sortBy = "";
      if (sort.label === "PRGN_NM") {
        sortBy = isAscending.value.PRGN_NM
          ? "&sortBy=programName&direction=asc"
          : "&sortBy=programName&direction=desc";
        isAscending.value.PRGN_NM = !isAscending.value.PRGN_NM;
      } 
      else if (sort.label === "INST_NM") {
        sortBy = isAscending.value.INST_NM
          ? "&sortBy=institutionName&direction=asc"
          : "&sortBy=institutionName&direction=desc";
        isAscending.value.INST_NM = !isAscending.value.INST_NM;
      } 
      else if (sort.label === "createdDate") {
        sortBy = isAscending.value.createdDate
          ? "&sortBy=date&direction=asc"
          : "&sortBy=date&direction=desc";
        isAscending.value.createdDate = !isAscending.value.createdDate;
      } 
      else if (sort.label === "status") {
        sortBy = isAscending.value.status
          ? "&sortBy=status&direction=asc"
          : "&sortBy=status&direction=desc";
        isAscending.value.status = !isAscending.value.status;
      }
      currentSortBy.value = sortBy;
      fetchData(currentPage.value, sortBy, filters.value);
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

    const onPageChange = async (page: number) => {
      currentPage.value = page;
      await fetchData(page, currentSortBy.value, filters.value);
    };

    return {
      search,
      // searchItems,
      data,
      headerConfig,
      sort,
      selectedIds,
      deleteFewSubscriptions,
      deleteSubscription,
      getAssetPath,
      onItemsPerPageChange,
      isLoading,
      visiblePages,
      currentPage,
      totalPages,
      onPageChange,
      handleSort,
      statusColor,
      statusLabel,
      handleFilter,
      filters,
    };
  },
});
</script>

<style scoped>
.fade-transition {
  transition: opacity 0.5s ease-in-out;
  width: 70px;
}

.customer-name {
  font-weight: bold;
}

.text-muted {
  color: #6c757d;
  font-size: 12px;
}

.btn-primary.custom-button {
  width: auto;
  height: 50%;
  background-color: #4A90E2;
  border: none;
  color: white;
  padding: 8px 18px !important;
  text-align: center;
  font-size: 14px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary.custom-button:hover {
  background-color: #357ABD;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}

.btn-primary.custom-button:active {
  background-color: #2C5A8A;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  transform: scale(0.95);
}

.btn-danger.custom-button {
  width: auto;
  background-color: #E74C3C;
  border: none;
  color: white;
  padding: 8px 18px !important;
  text-align: center;
  font-size: 14px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-danger.custom-button:hover {
  background-color: #C0392B;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}

.btn-danger.custom-button:active {
  background-color: #A93226;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  transform: scale(0.95);
}

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

.column-status,
.column-PRGN_NM,
.column-INST_NM,
.column-createdDate,
.column-customer,
.column-educationjournal,
.column-product {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.column-status {
  width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.column-PRGN_NM {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.column-INST_NM {
  width: 170px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.column-createdDate {
  width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

</style>