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
          <!--begin::Export-->
          <!-- <button
            type="button"
            class="btn btn-light-primary me-3"
            data-bs-toggle="modal"
            data-bs-target="#kt_subscriptions_export_modal"
          >
            <KTIcon icon-name="exit-up" icon-class="fs-2" />
            Export
          </button> -->
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
      </div>
    </div>
    <div class="card-body pt-0">
      <KTDatatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        @on-items-per-page-change="onItemsPerPageChange"
        :data="data"
        :header="headerConfig"
        :checkbox-enabled="true"
      >
        <template v-slot:customer="{ row: customer }">
          <router-link
            to="/apps/subscriptions/view-subscription"
            href=""
            class="text-gray-800 text-hover-primary mb-1"
          >
            {{ customer.customer }}
          </router-link>
        </template>
        <template v-slot:status="{ row: customer }">
          <a href="#" class="text-gray-600 text-hover-primary mb-1">
            <div :class="`badge badge-light-${customer.color}`">
              {{ customer.status }}
            </div>
          </a>
        </template>
        <template v-slot:billing="{ row: customer }">
          {{ customer.billing }}
        </template>
        <template v-slot:product="{ row: customer }">
          {{ customer.product }}
        </template>
        <template v-slot:createdDate="{ row: customer }">
          {{ customer.createdDate }}
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
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted, ref } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";

interface ISubscription {
  id: number;
  customer: string;
  status: string;
  color: string;
  billing: string;
  product: string;
  createdDate: string;
}

export default defineComponent({
  name: "kt-subscription-list",
  components: {
    KTDatatable,
  },
  setup() {
    const data = ref<Array<ISubscription>>([
      {
        id: 1,
        customer: "MODI",
        status: "교육 종료",
        color: "success",
        billing: "오후 6시 20분  ~ 오후 7시 10분",
        product: "1",
        createdDate: "2024.08.01.",
      },
      {
        id: 2,
        customer: "MODI",
        status: "교육 종료",
        color: "success",
        billing: "오후 7시 20분 ~ 오후 8시 10분",
        product: "1",
        createdDate: "2024.08.01.",
      },
      {
        id: 3,
        customer: "드론",
        status: "교육 전",
        color: "warning",
        billing: "오전 10시 30분 ~ 오후 12시 30분",
        product: "2",
        createdDate: "2024.08.17.",
      },
      {
        id: 4,
        customer: "코스페이시스",
        status: "교육 전",
        color: "warning",
        billing: "오후 5시 30분 ~ 오후 6시 40분",
        product: "1.5",
        createdDate: "2024.08.08.",
      },
      {
        id: 5,
        customer: "코스페이시스",
        status: "교육 전",
        color: "warning",
        billing: "오후 6시 50분 ~ 오후 8시 00분",
        product: "1.5",
        createdDate: "2024.08.08.",
      },
      {
        id: 6,
        customer: "3D 모델링",
        status: "교육 종료",
        color: "success",
        billing: "오후 6시 20분 ~ 오후 7시 20분",
        product: "1",
        createdDate: "2024.08.09.",
      },
      {
        id: 7,
        customer: "스택버거, 엔트리",
        status: "교육 종료",
        color: "success",
        billing: "오후 5시 30분 ~ 오후 6시 45분",
        product: "1.5",
        createdDate: "2024.08.06.",
      },
      {
        id: 8,
        customer: "스택버거, 엔트리",
        status: "보류(취소)",
        color: "danger",
        billing: "오후 6시 55분 ~ 오후 8시 10분",
        product: "1.5",
        createdDate: "2024.08.06.",
      },
      {
        id: 9,
        customer: "프로보커넥트",
        status: "교육 전",
        color: "warning",
        billing: "오후 3시 00분 ~ 오후 4시 30분",
        product: "2",
        createdDate: "2024.08.07.",
      },
      {
        id: 10,
        customer: "코스페이시스",
        status: "교육 종료",
        color: "success",
        billing: "오전 10시 00분 ~ 오전 11시 30분",
        product: "2",
        createdDate: "2024.08.03.",
      },
      {
        id: 11,
        customer: "Emma Bold",
        status: "교육 전",
        color: "success",
        billing: "Manual - Credit Card",
        product: "Enterprise",
        createdDate: "May 05, 2021",
      },
      {
        id: 12,
        customer: "Ana Crown",
        status: "Active",
        color: "success",
        billing: "Manual - Credit Card",
        product: "Basic",
        createdDate: "Jun 24, 2021",
      },
      {
        id: 13,
        customer: "Robert Doe",
        status: "Suspended",
        color: "danger",
        billing: "--",
        product: "Teams Bundle",
        createdDate: "Jul 25, 2021",
      },
      {
        id: 14,
        customer: "John Miller",
        status: "Active",
        color: "success",
        billing: "Manual - Paypal",
        product: "Enterprise",
        createdDate: "Sep 22, 2021",
      },
      {
        id: 15,
        customer: "Lucy Kunic",
        status: "Active",
        color: "success",
        billing: "Manual - Credit Card",
        product: "Basic",
        createdDate: "Nov 10, 2021",
      },
      {
        id: 16,
        customer: "Neil Owen",
        status: "Suspended",
        color: "danger",
        billing: "--",
        product: "Basic Bundle",
        createdDate: "Jun 20, 2021",
      },
      {
        id: 17,
        customer: "Dan Wilson",
        status: "Expiring",
        color: "warning",
        billing: "Manual - Paypal",
        product: "Enterprise",
        createdDate: "May 05, 2021",
      },
      {
        id: 18,
        customer: "Emma Smith",
        status: "Active",
        color: "success",
        billing: "Auto-debit",
        product: "Teams",
        createdDate: "Apr 15, 2021",
      },
      {
        id: 19,
        customer: "Melody Macy",
        status: "Active",
        color: "success",
        billing: "Manual - Credit Card",
        product: "Basic",
        createdDate: "Oct 25, 2021",
      },
      {
        id: 20,
        customer: "Max Smith",
        status: "Suspended",
        color: "danger",
        billing: "--",
        product: "Basic Bundle",
        createdDate: "Feb 21, 2021",
      },
      {
        id: 21,
        customer: "Max Smith",
        status: "Suspended",
        color: "danger",
        billing: "--",
        product: "Basic Bundle",
        createdDate: "Feb 21, 2021",
      },
    ]);
    const headerConfig = ref([
      {
        columnName: "프로그램명",
        columnLabel: "customer",
        sortEnabled: true,
      },
      {
        columnName: "상태",
        columnLabel: "status",
        sortEnabled: true,
      },
      {
        columnName: "총 차시",
        columnLabel: "product",
        sortEnabled: true,
      },
      {
        columnName: "수업날짜",
        columnLabel: "createdDate",
        sortEnabled: true,
      },
      {
        columnName: "수업시간",
        columnLabel: "billing",
        sortEnabled: true,
      },
      // {
      //   columnName: "설정",
      //   columnLabel: "actions",
      // },
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
