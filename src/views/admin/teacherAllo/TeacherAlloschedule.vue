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
        >
        </div>
        <!--end::Toolbar-->

        <!--begin::Group actions-->
        <div v-else class="d-flex justify-content-end align-items-center">
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span> Selected
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
          <div>
            <div>{{ customer.billing }}</div>
            <small class="text-muted">
              {{ customer.createdDate }} | {{ customer.INST_NM }}
            </small>
          </div>
        </template>

        <template v-slot:ST_NM="{ row: customer }">
          <div>
            <small class="text-muted">
              {{ customer.ST_NM }} {{ customer.AT_NM }}
            </small>
          </div>
        </template>

        <template v-slot:customer="{ row: customer }">
          <router-link
            to="AdminAttendance"
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

        <template v-slot:lecturePlan="{ row: customer }">
          <div class="d-flex flex-column align-items-center">
            <router-link
              :to="getLecturePlanLink(customer)"
              class="btn btn-light-primary me-2"
            >
              바로가기
            </router-link>
          </div>
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
  ST_NM: string;
  AT_NM: string;
  lecturePlan: string;
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
    const isLoading = ref(false);  // 로딩 상태 추가

    const headerConfig = ref([
      {
        columnName: "프로그램명",
        columnLabel: "billing",
        sortEnabled: true,
      },
      {
        columnName: "강사",
        columnLabel: "ST_NM",
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
      {
        columnName: "강의계획서",
        columnLabel: "lecturePlan",
        sortEnabled: true,
      },
    ]);

    const getLecturePlanStatusStyle = (lecturePlan: string) => {
      switch (lecturePlan) {
        case "제출완료":
          return {
            color: "#ff8c00",
            fontWeight: "bold",
          };
        case "관리자 승인완료":
          return {
            color: "#008000",
            fontWeight: "bold",
          };
        default:
          return {
            color: "#8000ff",
            fontWeight: "bold",
          };
      }
    };

    const getLecturePlanLink = (customer: ISubscription) => {
      switch (customer.lecturePlan) {
        case "제출완료":
          return `/lecture-plan/${customer.id}/제출완료`;
        case "관리자 승인완료":
          return `/lecture-plan/${customer.id}/관리자승인완료`;
        default:
          return `/lecture-plan/${customer.id}/미제출`;
      }
    };

    const getLecturePlanButtonStyle = (lecturePlan: string) => {
      const baseStyle = {
        padding: "4px 10px",
        fontSize: "14px",
        borderRadius: "10px",
        fontWeight: "bold",
        minWidth: "140px",
        textAlign: "center",
        backgroundColor: "#ffffff",
        border: "1px solid #ddd",
        class: "hover-effect",
      };
      return {
        ...baseStyle,
        color: "#000000",
        margin: "0px !important",
      };
    };

    // 데이터 병합 함수
    const mergeDataByProgram = (rawData: any[]) => {
      const mergedData: any = {};

      rawData.forEach((item) => {
        // confirmedProgramId로 데이터 병합
        if (!mergedData[item.confirmedProgramId]) {
          mergedData[item.confirmedProgramId] = {
            id: item.id,
            customer: "상세보기",
            status: "상세보기",
            color: "success",
            billing: item.programName,
            product: "상세보기",
            createdDate: new Date(item.date).toISOString().split("T")[0],
            INST_NM: item.institutionName,
            ST_NM: item.assistantInstructorName,
            lecturePlan: "상세보기",
            instructors: new Set([item.assistantInstructorName]), // 강사 이름을 Set에 저장
          };
        } else {
          // 동일한 confirmedProgramId가 있다면 강사 이름을 Set에 추가
          mergedData[item.confirmedProgramId].instructors.add(item.assistantInstructorName);
        }
      });

      // instructors를 배열로 변환하여 출력
      return Object.values(mergedData).map((item: any) => ({
        ...item,
        ST_NM: Array.from(item.instructors).join(", "),
      }));
    };

    const fetchData = async () => {
      try {
        isLoading.value = true;
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Token이 없습니다.");
        }
        const response = await axios.get(ApiUrl('/api/v1/admin/assistant-instructors'),
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        
        const mergedApiData = mergeDataByProgram(response.data);

        data.value = mergedApiData;
        initData.value = [...mergedApiData];
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        isLoading.value = false;
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
      getLecturePlanLink,
      getLecturePlanButtonStyle,
      getLecturePlanStatusStyle,
      onItemsPerPageChange,
      isLoading,  // 로딩 상태 반환
    };
  },
});
</script>

<style>
.no-margin {
  margin: 0px !important;
}

.btn:hover {
  background-color: #9c9c9c !important;
  color: #ffffff !important;
  border-color: #9c9c9c !important;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.btn {
  border-radius: 0.42rem;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
}

.btn-light-primary {
  color: #009EF7;
  background-color: #E1F0FF;
  border: 1px solid #009EF7;
  margin: 0px !important;
}

.btn-light-primary:hover {
  background-color: #009EF7;
  color: white;
}
</style>
