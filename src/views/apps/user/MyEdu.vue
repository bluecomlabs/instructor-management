<template>
  <!--begin::Card-->
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title">
        <!--begin::Search-->
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
        <!--end::Search-->
      </div>
      <!--begin::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div
          v-if="selectedIds.length === 0"
          class="d-flex justify-content-end"
          data-kt-subscription-table-toolbar="base"
        ></div>
        <!--end::Toolbar-->

        <!--begin::Group actions-->
        <div v-else class="d-flex justify-content-end align-items-center">
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
        </div>
        <!--begin::Card header-->
        <div class="card-toolbar">
          <!--begin::Menu-->
          <button
            type="button"
            class="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-end"
            data-kt-menu-flip="top-end"
          >
            <KTIcon icon-name="category" icon-class="fs-2" />
          </button>
          <Dropdown1></Dropdown1>
          <!--end::Menu-->
        </div>
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
        @on-items-per-page-change="onItemsPerPageChange"
        :data="data"
        :header="headerConfig"
        :checkbox-enabled="true"
      >
        <template v-slot:billing="{ row: customer }">
          {{ customer.billing }}
        </template>
        <template v-slot:INST_NM="{ row: customer }">
          {{ customer.INST_NM }}
        </template>
        <template v-slot:createdDate="{ row: customer }">
          {{ customer.createdDate }}
        </template>
        <template v-slot:customer="{ row: customer }">
          <router-link
            to="Attendance"
            href=""
            class="btn btn-light-primary me-2"
          >
            {{ customer.customer }}
          </router-link>
        </template>
        <template v-slot:status="{ row: customer }">
          <router-link
            to="EducationJournal"
            href=""
            class="btn btn-light-primary me-2"
          >
            {{ customer.status }}
          </router-link>
        </template>
        <template v-slot:product="{ row: customer }">
          <router-link
            to="syllabus"
            href=""
            class="btn btn-light-primary me-2"
          >
            {{ customer.product }}
          </router-link>
        </template>
        <template v-slot:actions="{ row: customer }">
          <a
            href="#"
            class="btn btn-sm btn-light btn-active-light-primary"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-end"
            data-kt-menu-flip="top-end"
          >Actions
            <KTIcon icon-name="down" icon-class="fs-5 m-0" />
          </a>
          <div
            class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4"
            data-kt-menu="true"
          >
            <div class="menu-item px-3">
              <router-link
                to="/apps/customers/customer-details"
                class="menu-link px-3"
                >View</router-link
              >
            </div>
            <div class="menu-item px-3">
              <a @click="deleteSubscription(customer.id)" class="menu-link px-3"
                >Delete</a
              >
            </div>
          </div>
        </template>
      </KTDatatable>
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Card-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted, ref } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import axios from "axios";
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";
import Dropdown1 from "@/components/dropdown/Dropdown1.vue";
import { ApiUrl } from "@/assets/ts/_utils/api";

interface ISubscription {
  id: number;
  customer: string;
  status: string;
  color: string;
  billing: string;
  product: string;
  createdDate: string;
  INST_NM: string;
}

export default defineComponent({
  name: "kt-subscription-list",
  components: {
    KTDatatable,
    Dropdown1
  },
  setup() {
    const data = ref<Array<ISubscription>>([]);
    const initData = ref<Array<ISubscription>>([]);

    const isLoading = ref(false); // 로딩 상태 관리

    const headerConfig = ref([
      {
        columnName: "프로그램명",
        columnLabel: "billing",
        sortEnabled: true,
      },
      {
        columnName: "교육기관",
        columnLabel: "INST_NM",
        sortEnabled: true,
      },
      {
        columnName: "수업날짜",
        columnLabel: "createdDate",
        sortEnabled: true,
      },
      {
        columnName: "출석부",
        columnLabel: "customer",
        sortEnabled: true,
      },
      {
        columnName: "교육일지",
        columnLabel: "status",
        sortEnabled: true,
      },
      {
        columnName: "강의확인서",
        columnLabel: "product",
        sortEnabled: true,
      },
    ]);

    // Fetching data from API and processing it
    const fetchData = async () => {
      try {
        isLoading.value = true; // 로딩 시작
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Token이 없습니다.");
        }

        const response = await axios.get(ApiUrl('/api/v1/user/assistant-instructors'),
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const apiData = response.data.map((item: any) => ({
          id: item.id,
          customer: "상세보기", // 출석부는 상세보기로
          status: "상세보기", // 교육일지도 상세보기
          color: "success", // 상태에 따라 변경할 수 있음
          billing: item.programName, // 프로그램명
          product: "상세보기", // 강의확인서
          createdDate: new Date(item.createdAt).toISOString().split("T")[0], // 날짜에서 시간 제거
          INST_NM: item.institutionName, // 교육기관
        }));

        data.value = apiData;
        initData.value = [...apiData]; // 초기 데이터 복사
        isLoading.value = false; // 로딩 완료
      } catch (error) {
        console.error("Failed to fetch data:", error);
        isLoading.value = false; // 로딩 완료
      }
    };

    onMounted(() => {
      fetchData();
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

    const searchItems = () => {
      data.value = initData.value.filter((item) =>
        searchingFunc(item, search.value)
      );
      MenuComponent.reinitialization();
    };

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

    return {
      search,
      searchItems,
      data,
      headerConfig,
      sort,
      selectedIds,
      deleteFewSubscriptions,
      deleteSubscription,
      getAssetPath,
      onItemsPerPageChange,
      isLoading, // 로딩 상태 반환
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
</style>
