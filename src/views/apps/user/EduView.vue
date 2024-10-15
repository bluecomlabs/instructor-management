<template>
  <!--begin::Card-->
  <div class="card">

    <!-- <div class="d-flex justify-content-end my-3">
      <button @click="goToDashboard" class="btn btn-primary custom-button top-button">
        <KTIcon icon-name="element-11" icon-class="fs-2 me-2" />
        대시보드
      </button>
    </div> -->

    <!--begin::Card header-->
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <div class="d-flex align-items-center position-relative my-1">
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
        </div>
      </div>

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <div class="d-flex justify-content-end align-items-center">
          <!-- 로딩 버튼 -->
        </div>
        <!--begin::Toolbar-->
        <div
          v-if="selectedIds.length === 0"
          class="d-flex justify-content-end"
          data-kt-subscription-table-toolbar="base"
        >
        </div>
        <!--end::Toolbar-->

        <!--begin::Group actions-->
        <!-- <div v-else class="d-flex justify-content-end align-items-center">
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span>Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteFewSubscriptions()"
          >
            Delete Selected
          </button>
        </div> -->
        <!--end::Group actions-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body pt-0">
      <!-- 로딩 오버레이 -->
      <div v-if="isLoading" class="overlay">
        <div class="loader"></div>
      </div>
      <KTDatatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        :data="data"
        :header="headerConfig"
        :checkbox-enabled="true"
      >
        <template v-slot:customer="{ row: customer }">
          <div>
            <div class="text-gray-800 text-hover-primary mb-1">
              {{ customer.customer }}
            </div>
            <div class="text-muted small">
              <!-- 강사명 나열 -->
              <span v-if="customer.status.length > 0" v-for="(teacher, index) in customer.status" :key="index">
                {{ teacher }}<span v-if="index < customer.status.length - 1">, </span>
              </span>

              <!-- 강사 수 / 최대 강사 수 혹은 마감 표시 -->
              <span class="ms-2">
                <!-- 강사 수가 0이거나 강사가 없는 경우 처리 -->
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
        </template>

        <template v-slot:institutionName="{ row: customer }">
          <div>{{ customer.institutionName }}</div>
        </template>

        <template v-slot:date="{ row: customer }">
          <div>{{ customer.date }}</div>
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
              <a class="page-link" href="#">◀</a>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage === 0 }"
              @click="onPageChange(currentPage - 1)"
            >
              <a class="page-link" href="#">이전</a>
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
              <a class="page-link" href="#">다음</a>
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
    <!--end::Card body-->
  </div>
  <!--end::Card-->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import axios from "axios";
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";
import { SuccessAlert, WarningAlert, ErrorAlert } from '@/assets/ts/_utils/swal';
import { ApiUrl } from "@/assets/ts/_utils/api";

interface Sort {
  order: "asc" | "desc";
  label: string;
}

interface ISubscription {
  id: number;
  customer: string;
  status: Array<string | null>; // 강사명 배열 (null 포함 가능)
  product: string;
  maxInstructors: number; // 최대 강사 수
}

export default defineComponent({
  name: "kt-subscription-list",
  components: {
    KTDatatable,
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
        columnName: "프로그램명 및 강사명",
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

    const loadDataFromApi = async (page: number = 0) => {
      try {
        isLoading.value = true;
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Token이 없습니다.");

        const response = await axios.get(ApiUrl(`/api/v1/user/instructor-applications/status-ready/paged?page=${page}&size=${pageSize.value}`), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // 응답 데이터의 content가 배열인지 확인
        if (Array.isArray(response.data.content)) {
          const programMap = new Map<number, any>(); // confirmedProgramId를 key로 사용하여 데이터 그룹핑

          response.data.content.forEach((item: any) => {
            const existingProgram = programMap.get(item.confirmedProgram);
            if (existingProgram) {
              // 기존에 있는 프로그램일 경우 강사명 추가
              if (item.instructorName) {
                existingProgram.status.push(item.instructorName);
              }
            } else {
              // 처음 추가하는 프로그램일 경우
              programMap.set(item.confirmedProgram, {
                id: item.confirmedProgram,
                customer: item.programName,
                status: item.instructorName ? [item.instructorName] : [], // 강사명이 있으면 배열에 넣기
                product: "신청하기",
                maxInstructors: item.numberOfInstructors,
                institutionName: item.institutionName,
                date: item.date.split("T")[0],
              });
            }
          });

          const apiData = Array.from(programMap.values()); // Map에서 배열로 변환
          data.value.splice(0, data.value.length, ...apiData); // Vue 데이터 업데이트
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

    onMounted(() => {
      loadDataFromApi(currentPage.value);
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
      const reverse = sort.order === "asc";
      arraySort(data.value, sort.label, { reverse });
    };
    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    const search = ref<string>("");
    const searchItems = () => {
      loadDataFromApi(currentPage.value);
    };

    const onPageChange = async (page: number) => {
      currentPage.value = page;
      await loadDataFromApi(page);
    };

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
</style>