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

                <div class="ms-4" style=" margin-left: 0 !important">
                  <button
                    type="button"
                    class="btn btn-danger checkbox-button"
                    @click="onDeleteInstitutions"
                  >
                    기관 삭제
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
              <span class="indicator-label">기관 등록</span>
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
        <template v-slot:header-institutionName>
          <div>기관명</div>
        </template>
        <template v-slot:header-managerName>
          <div>관리자</div>
        </template>
        <template v-slot:header-phoneNumber>
          <div>전화번호</div>
        </template>
        <template v-slot:header-address>
          <div>주소</div>
        </template>
        <template v-slot:header-remarks>
          <div>비고</div>
        </template>
        <template v-slot:header-createdAt>
          <div>생성 날짜</div>
        </template>

        <template v-slot:status="{ row: institution }">
          <div class="column-status" @click="onInstitutionClick(institution)" style="cursor: pointer;">
            <span :class="`badge py-3 px-4 fs-7 badge-light-${statusColor[institution.status]}`">
              {{ statusLabel[institution.status] }}
            </span>
          </div>
        </template>
        <template v-slot:institutionName="{ row: institution }">
          <div class="column-institutionName" @click="onInstitutionClick(institution)" style="cursor: pointer;">
            {{ institution.institutionName }}
          </div>
        </template>
        <template v-slot:managerName="{ row: institution }">
          <div class="column-managerName">{{ institution.managerName || '-' }}</div>
        </template>
        <template v-slot:phoneNumber="{ row: institution }">
          <div class="column-phoneNumber">{{ institution.phoneNumber || '-' }}</div>
        </template>
        <template v-slot:address="{ row: institution }">
          <div class="column-address">{{ institution.address }}</div>
        </template>
        <template v-slot:remarks="{ row: institution }">
          <div class="column-remarks">{{ institution.remarks || '-' }}</div>
        </template>
        <template v-slot:createdAt="{ row: institution }">
          <div class="column-createdAt">{{ institution.createdAt }}</div>
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

interface IInstitution {
  id: number;
  institutionName: string;
  managerName: string | null;
  phoneNumber: string | null;
  remarks: string | null;
  createdAt: string;
  address: string;
}

export default defineComponent({
  name: "kt-institution-list",
  components: {
    KTDatatable,
    Dropdown3,
  },

  setup() {
    const router = useRouter();
    const data = ref<Array<IInstitution>>([]);
    const totalElements = ref<number>(0);
    const totalPages = ref<number>(0);
    const currentPage = ref<number>(0);
    const pageSize = ref<number>(10);
    const search = ref<string>("");
    const selectedItems = ref<Array<IInstitution>>([]);
    const selectedIds = ref<Array<number>>([]);
    const selectedStatus = ref("ACTIVE");

    const headerConfig = ref([
      {
        columnName: "기관명",
        columnLabel: "institutionName",
        sortEnabled: true,
        columnWidth: 200,
      },
      {
        columnName: "관리자",
        columnLabel: "managerName",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "전화번호",
        columnLabel: "phoneNumber",
        sortEnabled: false,
        columnWidth: 150,
      },
      {
        columnName: "주소",
        columnLabel: "address",
        sortEnabled: true,
        columnWidth: 300,
      },
      {
        columnName: "비고",
        columnLabel: "remarks",
        sortEnabled: false,
        columnWidth: 200,
      },
      {
        columnName: "생성 날짜",
        columnLabel: "createdAt",
        sortEnabled: true,
        columnWidth: 150,
      },
    ]);

    const statusColor = {
      ACTIVE: "primary",
      INACTIVE: "danger",
    };

    const statusLabel = {
      ACTIVE: "활성",
      INACTIVE: "비활성",
    };

    const isLoading = ref<boolean>(false);
    const isAscending = ref({
      status: true,
      institutionName: true,
      managerName: true,
      address: true,
      createdAt: true,
    });

    const currentSortBy = ref<string>("");

    const filters = ref({
      status: "",
      institutionName: "",
      managerName: "",
      phoneNumber: "",
      address: "",
      remarks: "",
    });

    const handleFilter = (filterData) => {
      filters.value = filterData;
      currentPage.value = 0;
      fetchInstitutions(currentPage.value, currentSortBy.value, filters.value);
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

    const fetchInstitutions = async (
      page: number = 0,
      sortBy: string = currentSortBy.value,
      filtersData = filters.value
    ) => {
      try {
        if (page === 0 && sortBy === "") isLoading.value = true;
        const token = localStorage.getItem("token");
        const filterQuery = buildFilterQuery(filtersData);

        const response = await axios.get(
          `http://localhost:8081/api/v1/admin/institutions?page=${page}&size=${pageSize.value}&search=${search.value}${sortBy}${filterQuery}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseData = response.data;
        console.log(
          "API 호출 URL:",
          `http://localhost:8081/api/v1/admin/institutions?page=${page}&size=${pageSize.value}&search=${search.value}${sortBy}${filterQuery}`
        );
        console.log("API 응답 데이터:", response.data);

        data.value = responseData.content.map((institution: any) => ({
          id: institution.id,
          institutionName: institution.institutionName,
          managerName: institution.managerName || "-",
          phoneNumber: institution.phoneNumber || "-",
          remarks: institution.remarks || "-",
          createdAt: institution.createdAt
            ? new Date(institution.createdAt * 1000).toISOString().split("T")[0]
            : "-",
          address: institution.address || "-",
          status: institution.status || "ACTIVE",
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
      if (filtersData.managerName) {
        query += `&managerName=${encodeURIComponent(filtersData.managerName)}`;
      }
      if (filtersData.phoneNumber) {
        query += `&phoneNumber=${encodeURIComponent(filtersData.phoneNumber)}`;
      }
      if (filtersData.address) {
        query += `&address=${encodeURIComponent(filtersData.address)}`;
      }
      if (filtersData.remarks) {
        query += `&remarks=${encodeURIComponent(filtersData.remarks)}`;
      }

      return query;
    };

    onMounted(() => {
      fetchInstitutions(currentPage.value, currentSortBy.value, filters.value);
    });

    const deleteInstitution = async (id: number) => {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8081/api/v1/admin/institutions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        data.value = data.value.filter((institution) => institution.id !== id);
      } catch (error) {
        console.error("Error deleting institution: ", error);
      }
    };

    const deleteFewInstitutions = async () => {
      const result = await Swal.fire({
        title: "기관 삭제 확인",
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
            await deleteInstitution(id);
          }

          selectedIds.value.length = 0;

          Swal.fire({
            title: "삭제 완료",
            text: "선택된 기관이 삭제되었습니다.",
            icon: "success",
            customClass: {
              confirmButton: "btn fw-semibold btn-primary",
            },
          }).then(() => {
            window.location.reload();
          });
        } catch (error) {
          console.error("Error deleting institution: ", error);

          Swal.fire({
            title: "오류",
            text: "기관 삭제에 실패했습니다.",
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
      if (sort.label === "institutionName") {
        sortBy = isAscending.value.institutionName
          ? "&sortBy=institutionName&direction=asc"
          : "&sortBy=institutionName&direction=desc";
        isAscending.value.institutionName = !isAscending.value.institutionName;
      } else if (sort.label === "managerName") {
        sortBy = isAscending.value.managerName
          ? "&sortBy=managerName&direction=asc"
          : "&sortBy=managerName&direction=desc";
        isAscending.value.managerName = !isAscending.value.managerName;
      } else if (sort.label === "address") {
        sortBy = isAscending.value.address
          ? "&sortBy=address&direction=asc"
          : "&sortBy=address&direction=desc";
        isAscending.value.address = !isAscending.value.address;
      } else if (sort.label === "createdAt") {
        sortBy = isAscending.value.createdAt
          ? "&sortBy=createdAt&direction=asc"
          : "&sortBy=createdAt&direction=desc";
        isAscending.value.createdAt = !isAscending.value.createdAt;
      } else if (sort.label === "status") {
        sortBy = isAscending.value.status
          ? "&sortBy=status&direction=asc"
          : "&sortBy=status&direction=desc";
        isAscending.value.status = !isAscending.value.status;
      } else {
        return;
      }
      currentSortBy.value = sortBy;
      fetchInstitutions(currentPage.value, sortBy, filters.value);
    };

    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    const searchItems = () => {
      currentPage.value = 0;
      fetchInstitutions(currentPage.value, currentSortBy.value, filters.value);
    };

    const onPageChange = async (page: number) => {
      const currentScrollPosition = window.scrollY;
      currentPage.value = page;
      await fetchInstitutions(page, currentSortBy.value, filters.value);
      window.scrollTo(0, currentScrollPosition);
    };

    const onSelectionChange = (selectedRows: Array<IInstitution>) => {
      selectedItems.value = selectedRows;
      selectedIds.value = selectedRows.map(row => row.id);
    };

    const onButtonAction = () => {
      if (selectedItems.value.length > 0) {
        console.log("선택된 기관 삭제:", selectedItems.value);
      } else {
        router.push({ name: "admin-InstitutionAdd" });
      }
    };

    const onDeleteInstitutions = () => {
      if (selectedIds.value.length > 0) {
        deleteFewInstitutions();
      }
    };

    const onInstitutionClick = (institution: IInstitution) => {
      localStorage.setItem("selectedInstitutionId", institution.id.toString());
      router.push({ name: "admin-InstitutionDetails", params: { id: institution.id } });
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
      onDeleteInstitutions,
      onInstitutionClick,
      selectedIds,
      sort,
      deleteFewInstitutions,
      onItemSelect,
      isLoading,
      isAscending,
      currentSortBy,
      filters,
      handleFilter,
      selectedStatus,
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
.column-institutionName,
.column-managerName,
.column-phoneNumber,
.column-address,
.column-remarks,
.column-createdAt {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.column-status {
  width: 70px;
  text-align: center;
}

.column-institutionName {
  width: 200px;
}

.column-managerName {
  width: 150px;
}

.column-phoneNumber {
  width: 150px;
}

.column-address {
  width: 300px;
}

.column-remarks {
  width: 200px;
}

.column-createdAt {
  width: 150px;
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
