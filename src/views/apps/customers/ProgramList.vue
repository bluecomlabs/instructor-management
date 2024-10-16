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
            @input="searchItems"
            type="text"
            class="form-control form-control-solid w-250px ps-14"
            placeholder="Search Subscriptions"
          />
        </div> -->
      </div>
      <div class="card-toolbar">
        <div v-if="selectedIds.length === 0" class="d-flex justify-content-end align-items-center">
          <button
            tabindex="3"
            type="button"
            @click="onButtonAction"
            class="menu-link px-3 btn btn-light-primary"
            style="width: 140px; height: 45px; margin-right: 10px"
          >
            <span class="indicator-label">프로그램 등록</span>
          </button>
        </div>
        <div v-else class="d-flex justify-content-end align-items-center">
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span> Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="onDeletePrograms"
            style="width: 140px; height: 45px; margin-right: 10px"
          >
            프로그램 삭제
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
            <Dropdown1 @apply-filter="handleFilter"></Dropdown1>
          </div>
      </div>
    </div>

    <div class="card-body pt-0">
      <!-- 로딩 스피너 오버레이 -->
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
        <!-- 테이블 템플릿 -->
        <template v-slot:header-programName>
          <div>프로그램명</div>
        </template>
        <template v-slot:header-chapter>
          <div>총 차시</div>
        </template>
        <template v-slot:header-product>
          <div>교구</div>
        </template>
        <template v-slot:header-createdAt>
          <div>생성 날짜</div>
        </template>

        <template v-slot:programName="{ row: customer }">
          <div @click="onProgramClick(customer)" style="cursor: pointer;">
            {{ customer.programName }}
          </div>
        </template>
        <template v-slot:chapter="{ row: customer }">
          <div>{{ customer.chapter }}</div>
        </template>
        <template v-slot:product="{ row: customer }">
          <div>{{ customer.product }}</div>
        </template>
        <template v-slot:createdAt="{ row: customer }">
          <div>{{ customer.createdAt }}</div>
        </template>
      </KTDatatable>

      <!-- 페이지네이션 -->
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
import { defineComponent, onMounted, ref, computed } from "vue";
import axios from "axios";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import Dropdown1 from "@/components/dropdown/Dropdown1.vue";

interface IProgram {
  id: number;
  programName: string;
  chapter: number | null;
  product: number | null;
  createdAt: number;
}

export default defineComponent({
  name: "kt-program-list",
  components: {
    KTDatatable,
    Dropdown1,
  },

  setup() {
    const router = useRouter();
    const data = ref<Array<IProgram>>([]);
    const totalElements = ref<number>(0);
    const totalPages = ref<number>(0);
    const currentPage = ref<number>(0);
    const pageSize = ref<number>(10);
    const search = ref<string>("");
    const isLoading = ref<boolean>(false);

    const selectedItems = ref<Array<IProgram>>([]);
    const selectedIds = ref<Array<number>>([]);

    const headerConfig = ref([
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
        columnWidth: 100,
      },
      {
        columnName: "생성 날짜",
        columnLabel: "createdAt",
        sortEnabled: true,
        columnWidth: 150,
      },
    ]);

    const isAscending = ref({
      programName: true,
      chapter: true,
      product: true,
      createdAt: true,
    });

    const currentSortBy = ref<string>("");

    const filters = ref({
      programName: "",
      product: "",
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
          `http://localhost:8081/api/v1/admin/programs?page=${page}&size=${pageSize.value}&search=${search.value}${sortBy}${filterQuery}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseData = response.data;
        console.log('API 호출 URL:', `http://localhost:8081/api/v1/admin/programs?page=${page}&size=${pageSize.value}&search=${search.value}${sortBy}${filterQuery}`);
        console.log('API 응답 데이터:', response.data);

        data.value = responseData.content.map((program: IProgram) => ({
          ...program,
          programName: program.programName,
          chapter: program.chapter ? program.chapter : "-",
          product: program.product ? program.product : "-",
          createdAt: new Date(program.createdAt * 1000)
            .toLocaleDateString()
            .replace(/\.$/, ""),
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
      let query = '';
      if (filtersData.programName) {
        query += `&programName=${encodeURIComponent(filtersData.programName)}`;
      }
      if (filtersData.product) {
        query += `&product=${encodeURIComponent(filtersData.product)}`;
      }
      if (filtersData.startDate) {
        query += `&startDate=${filtersData.startDate}`;
      }
      if (filtersData.endDate) {
        query += `&endDate=${filtersData.endDate}`;
      }
      return query;
    };

    onMounted(() => {
      fetchPrograms(currentPage.value, currentSortBy.value, filters.value);
    });

    const deleteSubscription = async (id: number) => {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8081/api/v1/admin/programs/${id}`, {
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
      } else if (sort.label === "createdAt") {
        sortBy = isAscending.value.createdAt
          ? "&sortBy=createdAt&direction=asc"
          : "&sortBy=createdAt&direction=desc";
        isAscending.value.createdAt = !isAscending.value.createdAt;
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
      router.push({ name: "admin-ProgramDetails", params: { id: program.id } });
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

.column-programName,
.column-chapter,
.column-product,
.column-createdAt {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.column-programName {
  width: 200px;
}

.column-chapter {
  width: 100px;
}

.column-product {
  width: 100px;
}

.column-createdAt {
  width: 150px;
}
</style>
