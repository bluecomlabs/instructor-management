<template>
  <!--begin::Row-->
  <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
    <!--begin::Col-->
    <div class="col-md-12 col-lg-12 col-xl-12 col-xxl-12 mb-md-5 mb-xl-10">
      <Widget1
        className="h-md-100 mb-5 mb-xl-10"
        description="경기 미래채움 권역별 데이터 한 눈에 보기"
        bgColor="#FAFAFA"
      />
    </div>
    <!--end::Col-->

    <!--begin::Col-->
    <!-- <div class="col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-md-5 mb-xl-10">
      <Widget3 className="h-md-100 mb-5 mb-xl-10" :chartSize="70" />
    </div> -->
    <!-- <div class="col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-md-5 mb-xl-10">
      <Widget2 className="h-md-100 mb-5 mb-xl-10" :chartSize="70" />
    </div> -->
    <!-- <div class="col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-md-5 mb-xl-10">
      <Widget4 className="h-md-100 mb-5 mb-xl-10" :chartSize="70" />
    </div> -->
    <!-- <div class="col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-md-5 mb-xl-10">
      <Widget5 className="h-md-100 mb-5 mb-xl-10" :chartSize="70" />
    </div> -->
    <!-- <div class="col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-md-5 mb-xl-10">
      <Widget6 className="h-md-100 mb-5 mb-xl-10" :chartSize="70" />
    </div>
    <div class="col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-md-5 mb-xl-10">
      <UserSummary className="h-md-100 mb-5 mb-xl-10" :chartSize="70" />
    </div> -->
    <!-- <div class="col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-md-5 mb-xl-10">
      <Widget8 className="h-md-100 mb-5 mb-xl-10" :chartSize="70" />
    </div> -->
    <!--end::Col-->
  </div>
  <!--end::Row-->

  <!--begin::Row-->
  <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
    <div class="col-xxl-12">
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
                @input="searchItems()"
                type="text"
                data-kt-subscription-table-filter="search"
                class="form-control form-control-solid w-250px ps-14"
                placeholder="Search Subscriptions"
              />
            </div>
          </div>

          <div class="card-toolbar">
            <div
              v-if="selectedIds.length === 0"
              class="d-flex justify-content-end"
              data-kt-subscription-table-toolbar="base"
            >
            </div>

            <div v-else class="d-flex justify-content-end align-items-center">
              <div class="fw-bold me-5">
                <span class="me-2">{{ selectedIds.length }}</span
                >Selected
              </div>
              <button
                type="button"
                class="btn btn-danger"
                @click="deleteFewSubscriptions()"
              >
                Delete Selected
              </button>
            </div>
            <!-- <div class="card-toolbar">
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
            </div> -->
          </div>
        </div>
        <div class="card-body pt-0">
          <KTDatatable
            @on-sort="sort"
            @on-items-select="onItemSelect"
            @on-items-per-page-change="onItemsPerPageChange"
            :data="data"
            :header="headerConfig"
            :checkbox-enabled="false"
          >
            <template v-slot:billing="{ row: customer }">
              {{ customer.billing }}
            </template>
            <template v-slot:createdDate="{ row: customer }">
              {{ customer.createdDate }}
            </template>
            <template v-slot:INST_NM="{ row: customer }">
              {{ customer.INST_NM }}
            </template>
            <template v-slot:ST_NM="{ row: customer }">
              {{ customer.ST_NM }}
            </template>
            <template v-slot:AT_NM="{ row: customer }">
              {{ customer.AT_NM }}
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
    </div>
    <!--end::Col-->
  </div>
  <!--end::Row-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted, ref } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";
import Dropdown1 from "@/components/dropdown/Dropdown1.vue";
import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";
import Widget2 from "@/components/dashboard-default-widgets/Widget2.vue";
import Widget3 from "@/components/dashboard-default-widgets/Widget3.vue";
import Widget4 from "@/components/dashboard-default-widgets/Widget4.vue";
import Widget5 from "@/components/dashboard-default-widgets/Widget5.vue";
import Widget6 from "@/components/dashboard-default-widgets/Widget6.vue";
import UserSummary from "@/components/dashboard-default-widgets/UserSummary.vue";
import Widget8 from "@/components/dashboard-default-widgets/Widget8.vue";

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
}

export default defineComponent({
  name: "main-dashboard",
  components: {
    KTDatatable,
    Dropdown1,
    Widget1,
    Widget2,
    Widget3,
    Widget4,
    Widget5,
    Widget6,
    UserSummary,
    Widget8,
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
        INST_NM: "안산초등학교",
        ST_NM: "홍길동",
        AT_NM: "김만수",
      },
      {
        id: 2,
        customer: "상세보기",
        status: "상세보기",
        color: "success",
        billing: "MODI",
        product: "상세보기",
        createdDate: "2024-08-01",
        INST_NM: "안산초등학교",
        ST_NM: "홍길동",
        AT_NM: "이희재",
      },
      {
        id: 3,
        customer: "상세보기",
        status: "상세보기",
        color: "primary",
        billing: "드론",
        product: "상세보기",
        createdDate: "2024-08-15",
        INST_NM: "안산초등학교",
        ST_NM: "김만수",
        AT_NM: "이희재",
      },
      {
        id: 4,
        customer: "상세보기",
        status: "상세보기",
        color: "warning",
        billing: "코스페이시스",
        product: "상세보기",
        createdDate: "2024-08-03",
        INST_NM: "안산초등학교",
        ST_NM: "이희재",
        AT_NM: "김만수",
      },
      {
        id: 5,
        customer: "상세보기",
        status: "상세보기",
        color: "warning",
        billing: "코스페이시스",
        product: "상세보기",
        createdDate: "2024-08-01",
        INST_NM: "안산초등학교",
        ST_NM: "이희재",
        AT_NM: "홍길동",
      },
      {
        id: 6,
        customer: "상세보기",
        status: "상세보기",
        color: "success",
        billing: "3D 모델링",
        product: "상세보기",
        createdDate: "2024-08-01",
        INST_NM: "안산초등학교",
        ST_NM: "정준혁",
        AT_NM: "오지원",
      },
      {
        id: 7,
        customer: "상세보기",
        status: "상세보기",
        color: "success",
        billing: "스택버거, 엔트리",
        product: "상세보기",
        createdDate: "2024-08-05",
        INST_NM: "안산초등학교",
        ST_NM: "홍길동",
        AT_NM: "이재홍",
      },
      {
        id: 8,
        customer: "상세보기",
        status: "상세보기",
        color: "danger",
        billing: "스택버거, 엔트리",
        product: "상세보기",
        createdDate: "2024-08-01",
        INST_NM: "안산초등학교",
        ST_NM: "김지섭",
        AT_NM: "김만수",
      },
      {
        id: 9,
        customer: "상세보기",
        status: "상세보기",
        color: "warning",
        billing: "프로보커넥트",
        product: "상세보기",
        createdDate: "2024-08-06",
        INST_NM: "안산초등학교",
        ST_NM: "홍길동",
        AT_NM: "배주원",
      },
      {
        id: 10,
        customer: "상세보기",
        status: "상세보기",
        color: "success",
        billing: "코스페이시스",
        product: "상세보기",
        createdDate: "2024-08-10",
        INST_NM: "안산초등학교",
        ST_NM: "이상혁",
        AT_NM: "김만수",
      },
      // {
      //   id: 11,
      //   customer: "Emma Bold",
      //   status: "Active",
      //   color: "success",
      //   billing: "Manual - Credit Card",
      //   product: "Enterprise",
      //   createdDate: "May 05, 2021",
      //   INST_NM: "안산초등학교",
      //   ST_NM: "홍길동",
      //   AT_NM: "김만수",
      // },
      // {
      //   id: 12,
      //   customer: "Ana Crown",
      //   status: "Active",
      //   color: "success",
      //   billing: "Manual - Credit Card",
      //   product: "Basic",
      //   createdDate: "Jun 24, 2021",
      //   INST_NM: "안산초등학교",
      //   ST_NM: "홍길동",
      //   AT_NM: "김만수",
      // },
      // {
      //   id: 13,
      //   customer: "Robert Doe",
      //   status: "Suspended",
      //   color: "danger",
      //   billing: "--",
      //   product: "Teams Bundle",
      //   createdDate: "Jul 25, 2021",
      //   INST_NM: "안산초등학교",
      //   ST_NM: "홍길동",
      //   AT_NM: "김만수",
      // },
      // {
      //   id: 14,
      //   customer: "John Miller",
      //   status: "Active",
      //   color: "success",
      //   billing: "Manual - Paypal",
      //   product: "Enterprise",
      //   createdDate: "Sep 22, 2021",
      //   INST_NM: "안산초등학교",
      //   ST_NM: "홍길동",
      //   AT_NM: "김만수",
      // },
      // {
      //   id: 15,
      //   customer: "Lucy Kunic",
      //   status: "Active",
      //   color: "success",
      //   billing: "Manual - Credit Card",
      //   product: "Basic",
      //   createdDate: "Nov 10, 2021",
      //   INST_NM: "안산초등학교",
      //   ST_NM: "홍길동",
      //   AT_NM: "김만수",
      // },
      // {
      //   id: 16,
      //   customer: "Neil Owen",
      //   status: "Suspended",
      //   color: "danger",
      //   billing: "--",
      //   product: "Basic Bundle",
      //   createdDate: "Jun 20, 2021",
      //   INST_NM: "안산초등학교",
      //   ST_NM: "홍길동",
      //   AT_NM: "김만수",
      // },
      // {
      //   id: 17,
      //   customer: "Dan Wilson",
      //   status: "Expiring",
      //   color: "warning",
      //   billing: "Manual - Paypal",
      //   product: "Enterprise",
      //   createdDate: "May 05, 2021",
      //   INST_NM: "안산초등학교",
      //   ST_NM: "홍길동",
      //   AT_NM: "김만수",
      // },
      // {
      //   id: 18,
      //   customer: "Emma Smith",
      //   status: "Active",
      //   color: "success",
      //   billing: "Auto-debit",
      //   product: "Teams",
      //   createdDate: "Apr 15, 2021",
      //   INST_NM: "안산초등학교",
      //   ST_NM: "홍길동",
      //   AT_NM: "김만수",
      // },
      // {
      //   id: 19,
      //   customer: "Melody Macy",
      //   status: "Active",
      //   color: "success",
      //   billing: "Manual - Credit Card",
      //   product: "Basic",
      //   createdDate: "Oct 25, 2021",
      //   INST_NM: "안산초등학교",
      //   ST_NM: "홍길동",
      //   AT_NM: "김만수",
      // },
      // {
      //   id: 20,
      //   customer: "Max Smith",
      //   status: "Suspended",
      //   color: "danger",
      //   billing: "--",
      //   product: "Basic Bundle",
      //   createdDate: "Feb 21, 2021",
      //   INST_NM: "안산초등학교",
      //   ST_NM: "홍길동",
      //   AT_NM: "김만수",
      // },
      // {
      //   id: 21,
      //   customer: "Max Smith",
      //   status: "Suspended",
      //   color: "danger",
      //   billing: "--",
      //   product: "Basic Bundle",
      //   createdDate: "Feb 21, 2021",
      //   INST_NM: "안산초등학교",
      //   ST_NM: "홍길동",
      //   AT_NM: "김만수",
      // },
    ]);

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
        columnName: "주강사",
        columnLabel: "ST_NM",
        sortEnabled: true,
      },
      {
        columnName: "보조강사",
        columnLabel: "AT_NM",
        sortEnabled: true,
      },
      {
        columnName: "프로그램 생성날짜",
        columnLabel: "createdDate",
        sortEnabled: true,
      },
      {
        columnName: "교육 출석부",
        columnLabel: "customer",
        sortEnabled: true,
      },
      {
        columnName: "교육 활동 일지",
        columnLabel: "status",
        sortEnabled: true,
      },
      {
        columnName: "교구 확인서",
        columnLabel: "product",
        sortEnabled: true,
      },
    ]);

    const initData = ref<Array<ISubscription>>([]);

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
    };
  },
});
</script>

<style scoped>
.card-title {
  font-weight: 600;
}

.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
}

.text-muted {
  font-size: 0.875rem;
}
</style>
