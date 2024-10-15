<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <div class="d-flex align-items-center position-relative my-1">
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
        </div>
      </div>
      <div class="card-title">
        <button
          v-if="selectedIds.length === 0"
          tabindex="3"
          type="button"
          @click="onButtonAction"
          class="menu-link px-3 btn btn-light-primary"
          style="width: 140px; height: 45px"
        >
          <span class="indicator-label">교육기관 등록</span>
        </button>

        <div class="card-toolbar">
          <div v-if="selectedIds.length === 0" class="d-flex justify-content-end"></div>

          <div v-else class="d-flex justify-content-end align-items-center">
            <div class="fw-bold me-5">
              <span class="me-2">{{ selectedIds.length }}</span> Selected
            </div>
            <button
              type="button"
              class="btn btn-danger"
              @click="onDeletePrograms"
              style="width: 140px; height: 45px"
            >
              교육기관 삭제
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card-body pt-0">
      <!-- Loading Spinner Overlay -->
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
        <template v-slot:header-institutionName>
          <div>교육기관명</div>
        </template>
        <template v-slot:header-address>
          <div>주소</div>
        </template>
        <template v-slot:header-phoneNumber>
          <div>번호</div>
        </template>
        <template v-slot:header-createdAt>
          <div>생성 날짜</div>
        </template>

        <template v-slot:institutionName="{ row: customer }">
          <div @click="onProgramClick(customer)" style="cursor: pointer;">
            {{ customer.institutionName }}
          </div>
        </template>
        <template v-slot:address="{ row: customer }">
          <div>{{ customer.address }}</div>
        </template>
        <template v-slot:phoneNumber="{ row: customer }">
          <div>{{ customer.phoneNumber }}</div>
        </template>
        <template v-slot:createdAt="{ row: customer }">
          <div>{{ customer.createdAt }}</div>
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
              <a class="page-link" href="#">◀</a>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage === 0 }"
              @click="onPageChange(currentPage - 1)"
            >
              <a class="page-link" href="#">◁</a>
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
              <a class="page-link" href="#">▷</a>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage + 1 === totalPages }"
              @click="onPageChange(totalPages - 1)"
            >
              <a class="page-link" href="#">▶</a>
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
import arraySort from "array-sort";
import Swal from "sweetalert2";
import type { Sort } from "@/components/kt-datatable/table-partials/models";

interface Iinstitution {
  id: number;
  institutionName: string;
  address: number | null;
  phoneNumber: number | null;
  createdAt: number;
}

export default defineComponent({
  name: "kt-institution-list",
  components: {
    KTDatatable,
  },

  setup() {
    const router = useRouter();
    const data = ref<Array<Iinstitution>>([]);
    const totalElements = ref<number>(0);
    const totalPages = ref<number>(0);
    const currentPage = ref<number>(0);
    const pageSize = ref<number>(10);
    const search = ref<string>("");
    const isLoading = ref<boolean>(false);  // Loading state

    const selectedItems = ref<Array<Iinstitution>>([]);
    const selectedIds = ref<Array<number>>([]);

    const headerConfig = ref([
      {
        columnName: "교육기관명",
        columnLabel: "institutionName",
        sortEnabled: true,
        columnMaxWidth: 500,
      },
      {
        columnName: "주소",
        columnLabel: "address",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "번호",
        columnLabel: "phoneNumber",
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

    const fetchPrograms = async (page: number = 0) => {
      try {
        isLoading.value = true;  // Show loading spinner
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8081/api/v1/admin/institutions?page=${page}&size=${pageSize.value}&search=${search.value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseData = response.data;

        data.value = responseData.content.map((institution: Iinstitution) => ({
          ...institution,
          institutionName: institution.institutionName,
          address: institution.address ? institution.address : "/",
          phoneNumber: institution.phoneNumber ? institution.phoneNumber : "/",
          createdAt: new Date(institution.createdAt * 1000)
            .toLocaleDateString()
            .replace(/\.$/, ""),
        }));

        totalElements.value = responseData.totalElements;
        totalPages.value = responseData.totalPages;
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        isLoading.value = false;  // Hide loading spinner after fetching data
      }
    };

    onMounted(() => {
      fetchPrograms(currentPage.value);
    });

    const deleteSubscription = async (id: number) => {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8081/api/v1/admin/institutions/${id}`, {
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
        selectedIds.value.forEach(async (id) => {
          await deleteSubscription(id);
        });

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
      const reverse: boolean = sort.order === "asc";
      if (sort.label) {
        arraySort(data.value, sort.label, { reverse });
      }
    };

    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    const searchItems = () => {
      fetchPrograms(currentPage.value);
    };

    const onPageChange = async (page: number) => {
      const currentScrollPosition = window.scrollY;
      currentPage.value = page;
      await fetchPrograms(page);
      window.scrollTo(0, currentScrollPosition);
    };

    const onSelectionChange = (selectedRows: Array<Iinstitution>) => {
      selectedItems.value = selectedRows;
    };

    const onButtonAction = () => {
      if (selectedItems.value.length > 0) {
        console.log("선택된 프로그램 삭제:", selectedItems.value);
      } else {
        router.push({ name: "admin-EducationalAdd" });
      }
    };

    const onDeletePrograms = () => {
      if (selectedIds.value.length > 0) {
        deleteFewSubscriptions();
      }
    };

    const onProgramClick = (program: Iinstitution) => {
      localStorage.setItem("selectedProgramId", program.id.toString());
      router.push({ name: "admin-EducationalDetails", params: { id: program.id } });
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
      isLoading,  // Return loading state
    };
  },
});
</script>

<style>


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
</style>