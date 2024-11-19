<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!-- Header content (unchanged) -->
    </div>

    <div class="card-body pt-0">
      <!-- Loading Overlay -->
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
        <!-- Updated slot with click event -->
        <template v-slot:programName="{ row: item }">
          <div
            class="column-programName"
            @click="onRecordClick(item)"
            style="cursor: pointer;"
          >
            {{ item.programName }}
          </div>
        </template>
        <!-- Other columns remain the same -->
        <template v-slot:institutionName="{ row: item }">
          <div class="column-institutionName">
            {{ item.institutionName }}
          </div>
        </template>
        <template v-slot:chapterNumber="{ row: item }">
          <div class="column-chapterNumber">
            {{ item.chapterNumber }}
          </div>
        </template>
        <template v-slot:numberOfStudents="{ row: item }">
          <div class="column-numberOfStudents">
            {{ item.numberOfStudents }}
          </div>
        </template>
        <template v-slot:grade="{ row: item }">
          <div class="column-grade">
            {{ item.grade }}
          </div>
        </template>
        <template v-slot:classNumber="{ row: item }">
          <div class="column-classNumber">
            {{ item.classNumber }}
          </div>
        </template>
        <template v-slot:date="{ row: item }">
          <div class="column-date">
            {{ item.date }}
          </div>
        </template>
      </KTDatatable>

      <!-- Pagination Controls (unchanged) -->
      <div class="d-flex justify-content-end mt-4">
        <nav aria-label="Page navigation">
          <!-- Pagination items -->
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import axios from "axios";
import { ApiUrl } from "@/assets/ts/_utils/api";

interface ISubscription {
  id: number;
  programName: string;
  institutionName: string;
  chapterNumber: number;
  numberOfStudents: number;
  grade: number;
  classNumber: number;
  date: string;
}

export default defineComponent({
  name: "kt-subscription-list",
  components: {
    KTDatatable,
  },
  setup() {
    const router = useRouter();
    const filters = ref({
      startDate: "",
      endDate: "",
      programName: "",
      institutionName: "",
    });

    const handleFilter = (filterData: any) => {
      filters.value = filterData;
      currentPage.value = 0;
      fetchData(currentPage.value, currentSortBy.value, filters.value);
    };

    const data = ref<Array<ISubscription>>([]);
    const isAscending = ref({
      programName: true,
      institutionName: true,
      chapterNumber: true,
      numberOfStudents: true,
      grade: true,
      classNumber: true,
      date: true,
    });
    const isLoading = ref(false);
    const currentSortBy = ref<string>("");

    const headerConfig = ref([
      {
        columnName: "프로그램명",
        columnLabel: "programName",
        sortEnabled: true,
        columnWidth: 200,
      },
      {
        columnName: "교육기관",
        columnLabel: "institutionName",
        sortEnabled: true,
        columnWidth: 170,
      },
      {
        columnName: "차시",
        columnLabel: "chapterNumber",
        sortEnabled: true,
        columnWidth: 80,
      },
      {
        columnName: "학생 수",
        columnLabel: "numberOfStudents",
        sortEnabled: true,
        columnWidth: 80,
      },
      {
        columnName: "학년",
        columnLabel: "grade",
        sortEnabled: true,
        columnWidth: 80,
      },
      {
        columnName: "반",
        columnLabel: "classNumber",
        sortEnabled: true,
        columnWidth: 80,
      },
      {
        columnName: "날짜",
        columnLabel: "date",
        sortEnabled: true,
        columnWidth: 150,
      },
    ]);

    const totalElements = ref<number>(0);
    const totalPages = ref<number>(0);
    const currentPage = ref<number>(0);
    const pageSize = ref<number>(10);

    const fetchData = async (
      page: number = 0,
      sortBy: string = "",
      filtersData = filters.value
    ) => {
      try {
        isLoading.value = true;
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token이 없습니다.");
        }

        const filterQuery = buildFilterQuery(filtersData);

        const sortQuery = sortBy || "&sortBy=createdAt&direction=asc";

        const url = ApiUrl(
          `/api/v1/user/education/my-educations?page=${page}&size=${pageSize.value}${sortQuery}${filterQuery}`
        );

        console.log("API 호출 URL:", url);

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API 응답:", response.data);

        const apiData = response.data.content.map((item: any) => ({
          id: item.id,
          programName: item.programName,
          institutionName: item.institutionName,
          chapterNumber: item.chapterNumber,
          numberOfStudents: item.numberOfStudents,
          grade: item.grade,
          classNumber: item.classNumber,
          date: item.date,
        }));

        data.value = apiData;
        totalElements.value = response.data.totalElements;
        totalPages.value = response.data.totalPages;
      } catch (error) {
        console.error("데이터를 가져오는데 실패했습니다:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const buildFilterQuery = (filtersData: any) => {
      let query = "";
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
        query += `&institutionName=${encodeURIComponent(
          filtersData.institutionName
        )}`;
      }
      return query;
    };

    onMounted(() => {
      fetchData(currentPage.value, currentSortBy.value, filters.value);
    });

    const onItemsPerPageChange = () => {
      setTimeout(() => {
        // Reinitialize any components if needed
      }, 0);
    };

    const handleSort = (sortParam: Sort) => {
      let sortBy = "";
      if (sortParam.label === "programName") {
        sortBy = isAscending.value.programName
          ? "&sortBy=programName&direction=asc"
          : "&sortBy=programName&direction=desc";
        isAscending.value.programName = !isAscending.value.programName;
      } else if (sortParam.label === "institutionName") {
        sortBy = isAscending.value.institutionName
          ? "&sortBy=institutionName&direction=asc"
          : "&sortBy=institutionName&direction=desc";
        isAscending.value.institutionName = !isAscending.value.institutionName;
      } else if (sortParam.label === "chapterNumber") {
        sortBy = isAscending.value.chapterNumber
          ? "&sortBy=chapterNumber&direction=asc"
          : "&sortBy=chapterNumber&direction=desc";
        isAscending.value.chapterNumber = !isAscending.value.chapterNumber;
      } else if (sortParam.label === "numberOfStudents") {
        sortBy = isAscending.value.numberOfStudents
          ? "&sortBy=numberOfStudents&direction=asc"
          : "&sortBy=numberOfStudents&direction=desc";
        isAscending.value.numberOfStudents = !isAscending.value.numberOfStudents;
      } else if (sortParam.label === "grade") {
        sortBy = isAscending.value.grade
          ? "&sortBy=grade&direction=asc"
          : "&sortBy=grade&direction=desc";
        isAscending.value.grade = !isAscending.value.grade;
      } else if (sortParam.label === "classNumber") {
        sortBy = isAscending.value.classNumber
          ? "&sortBy=classNumber&direction=asc"
          : "&sortBy=classNumber&direction=desc";
        isAscending.value.classNumber = !isAscending.value.classNumber;
      } else if (sortParam.label === "date") {
        sortBy = isAscending.value.date
          ? "&sortBy=date&direction=asc"
          : "&sortBy=date&direction=desc";
        isAscending.value.date = !isAscending.value.date;
      }

      currentSortBy.value = sortBy;
      fetchData(currentPage.value, currentSortBy.value, filters.value);
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

    // Added method to handle record click
    const onRecordClick = (item: ISubscription) => {
      // Store the id in localStorage
      localStorage.setItem("selectedProgramId", item.id.toString());

      // Navigate to the details page
      router.push({ name: "user-MyEduDetails", params: { id: item.id } });
    };
    return {
      data,
      headerConfig,
      onItemsPerPageChange,
      isLoading,
      visiblePages,
      currentPage,
      totalPages,
      onPageChange,
      handleSort,
      handleFilter,
      filters,
      onRecordClick, // Expose the method to the template
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

.column-programName,
.column-institutionName,
.column-chapterNumber,
.column-numberOfStudents,
.column-grade,
.column-classNumber,
.column-date {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.column-programName {
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

.column-chapterNumber,
.column-numberOfStudents,
.column-grade,
.column-classNumber {
  width: 80px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.column-date {
  width: 200px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
</style>
