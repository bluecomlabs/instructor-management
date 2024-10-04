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
        <!-- 선택된 아이템이 없을 때만 '프로그램 등록' 버튼 표시 -->
        <button
          v-if="selectedIds.length === 0"
          tabindex="3"
          type="button"
          @click="onButtonAction"
          class="menu-link px-3 btn btn-light-primary"
          style="width: 140px; height: 45px"
        >
          <span class="indicator-label">프로그램 등록</span>
        </button>

        <div class="card-toolbar">
          <!--begin::Toolbar-->
          <div
            v-if="selectedIds.length === 0"
            class="d-flex justify-content-end"
            data-kt-subscription-table-toolbar="base"
          >
          </div>
          <!--end::Toolbar-->

          <!--begin::Group actions-->
          <div v-else class="d-flex justify-content-end align-items-center">
            <div class="fw-bold me-5">
              <span class="me-2">{{ selectedIds.length }}</span> Selected
            </div>
            <!-- 프로그램 삭제 버튼 -->
            <button
              type="button"
              class="btn btn-danger"
              @click="onDeletePrograms"
              style="width: 140px; height: 45px"
            >
              프로그램 삭제
            </button>
          </div>
          <!--end::Group actions-->
        </div>
      </div>

    </div>

    <div class="card-body pt-0">
      <KTDatatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        :data="data"
        :header="headerConfig"
        :checkbox-enabled="true"
        @selection-change="onSelectionChange"
      >
        <!-- Header slots for setting column width -->
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

        <!-- Body slots for setting column width -->
        <template v-slot:programName="{ row: customer }">
          <div @click="onProgramClick(customer)" style="cursor: pointer;">
            {{ customer.programName }}
          </div>
        </template>
        <template v-slot:chapter="{ row: customer }">
          <div>
            {{ customer.chapter }}
          </div>
        </template>
        <template v-slot:product="{ row: customer }">
          <div>
            {{ customer.product }}
          </div>
        </template>
        <template v-slot:createdAt="{ row: customer }">
          <div>
            {{ customer.createdAt }}
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
import Swal from "sweetalert2";  // SweetAlert2 모듈 추가
import type { Sort } from "@/components/kt-datatable/table-partials/models";

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

    const headerConfig = ref([
      {
        columnName: "프로그램명",
        columnLabel: "programName",
        sortEnabled: true,
        columnMaxWidth: 500,
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
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8081/api/v1/admin/programs?page=${page}&size=${pageSize.value}&search=${search.value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseData = response.data;

        data.value = responseData.content.map((program: IProgram) => ({
          ...program,
          programName: program.programName,
          chapter: program.chapter ? program.chapter : "/",
          product: program.product ? program.product : "/",
          createdAt: new Date(program.createdAt * 1000).toLocaleDateString().replace(/\.$/, ""),
        }));


        totalElements.value = responseData.totalElements;
        totalPages.value = responseData.totalPages;
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    onMounted(() => {
      fetchPrograms(currentPage.value);
    });

    const deleteSubscription = async (id: number) => {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8081/api/v1/admin/programs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // 성공적으로 삭제한 후 선택된 데이터 목록에서 해당 프로그램 제거
        data.value = data.value.filter((program) => program.id !== id);
      } catch (error) {
        console.error("Error deleting program: ", error);
      }
    };

    // 여러 개의 프로그램 삭제
    const deleteFewSubscriptions = async () => {
      // 삭제 확인 모달을 띄움
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

      // 삭제를 확인하면 진행
      if (result.isConfirmed) {
        selectedIds.value.forEach(async (id) => {
          await deleteSubscription(id);
        });

        // 삭제 후 선택된 ID 초기화
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

    // 프로그램 삭제 버튼 클릭 시
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
    };
  },
});
</script>
