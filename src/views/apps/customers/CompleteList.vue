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
      <KTDatatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
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
              {{ customer.ST_NM }} | {{ customer.AT_NM }}
            </small>
          </div>
        </template>

        <template v-slot:customer="{ row: customer }">
          <router-link
            to="AdminAttendance"
            href=""
            class="btn"
            :style="getLecturePlanButtonStyle(customer.customer)"
          >
            {{ customer.customer }}
          </router-link>
        </template>
        <template v-slot:status="{ row: customer }">
          <router-link
            to="EducationJournal"
            href=""
            class="btn me-2"
            :style="getLecturePlanButtonStyle(customer.status)"
          >
            {{ customer.status }}
          </router-link>
        </template>
        <template v-slot:product="{ row: customer }">
          <router-link
            to="syllabus"
            href=""
            class="btn me-2"
            :style="getLecturePlanButtonStyle(customer.product)"
          >
            {{ customer.product }}
          </router-link>
        </template>
        <template v-slot:lecturePlan="{ row: customer }">
          <div class="d-flex flex-column align-items-center">
            <!-- Center-aligned Status indicator with distinct text colors -->
            <span :style="getLecturePlanStatusStyle(customer.lecturePlan)">
              {{ customer.lecturePlan }}
            </span>
            
            <!-- "바로가기" link with original button design -->
            <router-link
              :to="getLecturePlanLink(customer)"
              class="btn me-2"
              :style="getLecturePlanButtonStyle(customer.lecturePlan)"
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
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";
import Dropdown1 from "@/components/dropdown/Dropdown1.vue";

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
    const data = ref<Array<ISubscription>>([
    {
      id: 1,
      customer: "상세보기",
      status: "상세보기",
      color: "success",
      billing: "MODI",
      product: "상세보기",
      createdDate: "2024-08-01",
      INST_NM: "어썸초등학교",
      ST_NM: "홍길동",
      AT_NM: "김만수",
      lecturePlan: "관리자 승인완료", 
    },
    {
      id: 2,
      customer: "상세보기",
      status: "상세보기",
      color: "success",
      billing: "MODI",
      product: "상세보기",
      createdDate: "2024-08-01",
      INST_NM: "어썸초등학교",
      ST_NM: "홍길동",
      AT_NM: "이희재",
      lecturePlan: "관리자 승인완료", 
    },
    {
      id: 3,
      customer: "상세보기",
      status: "상세보기",
      color: "primary",
      billing: "드론",
      product: "상세보기",
      createdDate: "2024-08-15",
      INST_NM: "어썸초등학교",
      ST_NM: "김만수",
      AT_NM: "이희재",
      lecturePlan: "미제출", 
    },
    {
      id: 4,
      customer: "상세보기",
      status: "상세보기",
      color: "warning",
      billing: "코스페이시스",
      product: "상세보기",
      createdDate: "2024-08-03",
      INST_NM: "어썸초등학교",
      ST_NM: "이희재",
      AT_NM: "김만수",
      lecturePlan: "미제출", 
    },
    {
      id: 5,
      customer: "상세보기",
      status: "상세보기",
      color: "warning",
      billing: "코스페이시스",
      product: "상세보기",
      createdDate: "2024-08-01",
      INST_NM: "어썸초등학교",
      ST_NM: "이희재",
      AT_NM: "홍길동",
      lecturePlan: "상세보기", 
    },
    {
      id: 6,
      customer: "상세보기",
      status: "상세보기",
      color: "success",
      billing: "3D 모델링",
      product: "상세보기",
      createdDate: "2024-08-01",
      INST_NM: "어썸초등학교",
      ST_NM: "정준혁",
      AT_NM: "오지원",
      lecturePlan: "미제출", 
    },
    {
      id: 7,
      customer: "상세보기",
      status: "상세보기",
      color: "success",
      billing: "스택버거, 엔트리",
      product: "상세보기",
      createdDate: "2024-08-05",
      INST_NM: "어썸초등학교",
      ST_NM: "홍길동",
      AT_NM: "이재홍",
      lecturePlan: "미제출", 
    },
    {
      id: 8,
      customer: "상세보기",
      status: "상세보기",
      color: "danger",
      billing: "스택버거, 엔트리",
      product: "상세보기",
      createdDate: "2024-08-01",
      INST_NM: "어썸초등학교",
      ST_NM: "김지섭",
      AT_NM: "김만수",
      lecturePlan: "상세보기", 
    },
    {
      id: 9,
      customer: "상세보기",
      status: "상세보기",
      color: "warning",
      billing: "프로보커넥트",
      product: "상세보기",
      createdDate: "2024-08-06",
      INST_NM: "어썸초등학교",
      ST_NM: "홍길동",
      AT_NM: "배주원",
      lecturePlan: "상세보기", 
    },
    {
      id: 10,
      customer: "상세보기",
      status: "상세보기",
      color: "success",
      billing: "코스페이시스",
      product: "상세보기",
      createdDate: "2024-08-10",
      INST_NM: "어썸초등학교",
      ST_NM: "이상혁",
      AT_NM: "김만수",
      lecturePlan: "상세보기", 
    },
    {
      id: 11,
      customer: "Emma Bold",
      status: "Active",
      color: "success",
      billing: "Manual - Credit Card",
      product: "Enterprise",
      createdDate: "May 05, 2021",
      INST_NM: "어썸초등학교",
      ST_NM: "홍길동",
      AT_NM: "김만수",
      lecturePlan: "상세보기", 
    },
    {
      id: 12,
      customer: "Ana Crown",
      status: "Active",
      color: "success",
      billing: "Manual - Credit Card",
      product: "Basic",
      createdDate: "Jun 24, 2021",
      INST_NM: "어썸초등학교",
      ST_NM: "홍길동",
      AT_NM: "김만수",
      lecturePlan: "상세보기", 
    },
    {
      id: 13,
      customer: "Robert Doe",
      status: "Suspended",
      color: "danger",
      billing: "--",
      product: "Teams Bundle",
      createdDate: "Jul 25, 2021",
      INST_NM: "어썸초등학교",
      ST_NM: "홍길동",
      AT_NM: "김만수",
      lecturePlan: "상세보기", 
    },
    {
      id: 14,
      customer: "John Miller",
      status: "Active",
      color: "success",
      billing: "Manual - Paypal",
      product: "Enterprise",
      createdDate: "Sep 22, 2021",
      INST_NM: "어썸초등학교",
      ST_NM: "홍길동",
      AT_NM: "김만수",
      lecturePlan: "상세보기", 
    },
    {
      id: 15,
      customer: "Lucy Kunic",
      status: "Active",
      color: "success",
      billing: "Manual - Credit Card",
      product: "Basic",
      createdDate: "Nov 10, 2021",
      INST_NM: "어썸초등학교",
      ST_NM: "홍길동",
      AT_NM: "김만수",
      lecturePlan: "상세보기", 
    },
    {
      id: 16,
      customer: "Neil Owen",
      status: "Suspended",
      color: "danger",
      billing: "--",
      product: "Basic Bundle",
      createdDate: "Jun 20, 2021",
      INST_NM: "어썸초등학교",
      ST_NM: "홍길동",
      AT_NM: "김만수",
      lecturePlan: "상세보기", 
    },
    {
      id: 17,
      customer: "Dan Wilson",
      status: "Expiring",
      color: "warning",
      billing: "Manual - Paypal",
      product: "Enterprise",
      createdDate: "May 05, 2021",
      INST_NM: "어썸초등학교",
      ST_NM: "홍길동",
      AT_NM: "김만수",
      lecturePlan: "상세보기", 
    },
    {
      id: 18,
      customer: "Emma Smith",
      status: "Active",
      color: "success",
      billing: "Auto-debit",
      product: "Teams",
      createdDate: "Apr 15, 2021",
      INST_NM: "어썸초등학교",
      ST_NM: "홍길동",
      AT_NM: "김만수",
      lecturePlan: "상세보기", 
    },
    ]);

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
    const initData = ref<Array<ISubscription>>([]);
      const getLecturePlanStatusClass = (lecturePlan: string) => {
        return "text-center fw-bold";
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

    const uniformButtonStyle = {
      padding: "4px 10px",
      margin: "0px !important",
      fontSize: "14px",
      borderRadius: "4px",
      fontWeight: "bold",
      minWidth: "140px",
      textAlign: "center",
      backgroundColor: "rgba(0, 123, 255, 0.1)", 
      color: "#007bff", 
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
      switch (lecturePlan) {
        default:
          return {
            ...baseStyle,
            color: "#000000",
            margin: "0px !important",
          };
      }
    };

    onMounted(() => {
      initData.value.splice(0, data.value.length, ...data.value);
    });

    const selectedIds = ref<Array<number>>([]);
    const deleteFewSubscriptions = () => {
      selectedIds.value.forEach((item) => {
        deleteSubscription(item);
      });
      selectedIds.value.length = 0;
    };
    const deleteSubscription = (id: number) => {
      for (let i = 0; i < data.value.length; i++) {
        if (data.value[i].id === id) {
          data.value.splice(i, 1);
        }
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

    const search = ref<string>("");
    const searchItems = () => {
      data.value.splice(0, data.value.length, ...initData.value);
      if (search.value !== "") {
        let results: Array<ISubscription> = [];
        for (let j = 0; j < initData.value.length; j++) {
          if (searchingFunc(initData.value[j], search.value)) {
            results.push(initData.value[j]);
          }
        }
        data.value.splice(0, data.value.length, ...results);
      }
      MenuComponent.reinitialization();
    };

    const searchingFunc = (obj: any, value: string): boolean => {
      for (let key in obj) {
        if (!Number.isInteger(obj[key]) && !(typeof obj[key] === "object")) {
          if (obj[key].toLowerCase().indexOf(value.toLowerCase()) != -1) {
            return true;
          }
        }
      }
      return false;
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
      onItemSelect,
      selectedIds,
      deleteFewSubscriptions,
      deleteSubscription,
      getAssetPath,
      onItemsPerPageChange,
      getLecturePlanLink, 
      getLecturePlanButtonStyle,
      getLecturePlanStatusClass,
      uniformButtonStyle,getLecturePlanStatusStyle
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
</style>