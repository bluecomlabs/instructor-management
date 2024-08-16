<template>
  <!--begin::Card-->
  <div class="card">
    <!--begin::Card header-->
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
      <!--end::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div
          v-if="selectedIds.length === 0"
          class="d-flex justify-content-end"
          data-kt-subscription-table-toolbar="base"
        >
          <!--begin::Export-->
          <button
            type="button"
            class="btn btn-primary pastel-primary"
            @click="finalizeAssignments"
          >
            최종배정완료
          </button>
        </div>
        <!--end::Toolbar-->

        <!--begin::Group actions-->
        <div v-else class="d-flex justify-content-end align-items-center">
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger pastel-danger"
            @click="deleteFewSubscriptions()"
          >
            Delete Selected
          </button>
        </div>
        <!--end::Group actions-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body pt-0">
      <KTDatatable
        class="text-center"
        @on-sort="sort"
        @on-items-select="onItemSelect"
        @on-items-per-page-change="onItemsPerPageChange"
        :data="data"
        :header="headerConfig"
        :checkbox-enabled="true"
      >
        <template v-slot:billing="{ row: customer }">
          {{ customer.billing }}
        </template>
        <template v-slot:createdDate="{ row: customer }">
          {{ customer.createdDate }}
        </template>
        <template v-slot:customer="{ row: customer }">
          <span class="text-gray-800 mb-1">{{ customer.customer }}</span>
        </template>
        <template v-slot:status="{ row: customer }">
          <span class="text-gray-800 mb-1">{{ customer.status }}</span>
        </template>
        <template v-slot:product="{ row: customer }">
          <span
            v-if="customer.product === '최종배정'"
            class="badge badge-success"
          >
            최종배정
          </span>
          <span
            v-else-if="customer.product === '탈락'"
            class="badge badge-danger"
          >
            탈락
          </span>
          <span
            v-else-if="customer.product === '신청완료'"
            class="badge badge-primary"
          >
            신청완료
          </span>
          <span
            v-else
            class="badge badge-secondary"
          >
            미신청
          </span>
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
          <!--begin::Menu-->
          <div
            class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4"
            data-kt-menu="true"
          >
            <!--begin::Menu item-->
            <div class="menu-item px-3">
              <a href="#" class="menu-link px-3">View</a>
            </div>
            <!--end::Menu item-->
            <!--begin::Menu item-->
            <div class="menu-item px-3">
              <a @click="deleteSubscription(customer.id)" class="menu-link px-3"
                >Delete</a
              >
            </div>
            <!--end::Menu item-->
          </div>
          <!--end::Menu-->
        </template>
      </KTDatatable>
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Card-->
</template>

<script lang="ts">
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
        customer: "성남청소년센터",
        status: "2024.08.01.",
        color: "success",
        billing: "MODI",
        product: "신청완료",
        createdDate: "권정미",
      },
      {
        id: 2,
        customer: "성남청소년센터",
        status: "2024.08.01.",
        color: "success",
        billing: "MODI",
        product: "신청완료",
        createdDate: "권혜경",
      },
      {
        id: 3,
        customer: "성남청소년센터(단기)",
        status: "2024.08.17.",
        color: "primary",
        billing: "드론",
        product: "신청완료",
        createdDate: "김미",
      },
      {
        id: 4,
        customer: "남목청소년센터(도우리반)",
        status: "2024.08.08.",
        color: "warning",
        billing: "코스페이시스",
        product: "미신청",
        createdDate: "김미령",
      },
      {
        id: 5,
        customer: "남목청소년센터(나누리반)",
        status: "2024.08.09.",
        color: "warning",
        billing: "코스페이시스",
        product: "신청완료",
        createdDate: "김보미",
      },
      {
        id: 6,
        customer: "남목청소년센터(동아리)",
        status: "2024.08.06.",
        color: "success",
        billing: "3D 모델링",
        product: "미신청",
        createdDate: "김은희",
      },
      {
        id: 7,
        customer: "북구청소년센터",
        status: "2024.08.06.",
        color: "success",
        billing: "스택버거, 엔트리",
        product: "신청완료",
        createdDate: "김인경",
      },
      {
        id: 8,
        customer: "북구청소년센터",
        status: "2024.08.07.",
        color: "danger",
        billing: "스택버거, 엔트리",
        product: "신청완료",
        createdDate: "김지숙",
      },
      {
        id: 9,
        customer: "북구청소년센터(단기)",
        status: "2024.08.03.",
        color: "warning",
        billing: "프로보커넥트",
        product: "신청완료",
        createdDate: "김희정",
      },
      {
        id: 10,
        customer: "북구청소년센터(동아리)",
        status: "2024.08.03.",
        color: "success",
        billing: "코스페이시스",
        product: "미신청",
        createdDate: "나성자",
      },
    ]);

    const headerConfig = ref([
      {
        columnName: "프로그램명",
        columnLabel: "billing",
        sortEnabled: true,
      },
      {
        columnName: "교육기관명",
        columnLabel: "customer",
        sortEnabled: true,
      },
      {
        columnName: "교육날짜",
        columnLabel: "status",
        sortEnabled: true,
      },
      {
        columnName: "최종배정 여부",
        columnLabel: "product",
        sortEnabled: true,
      },
    ]);

    const initData = ref<Array<ISubscription>>([]);

    onMounted(() => {
      loadFromLocalStorage();
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

    const finalizeAssignments = () => {
      data.value.forEach((item) => {
        if (item.product === "신청완료") {
          item.product = "최종배정";
        } else if (item.product === "미신청") {
          item.product = "탈락";
        }
      });
      saveToLocalStorage();
    };

    const saveToLocalStorage = () => {
      const dataToSave = data.value.map((item) => ({
        id: item.id,
        product: item.product,
      }));
      localStorage.setItem("subscriptions", JSON.stringify(dataToSave));
    };

    const loadFromLocalStorage = () => {
      const savedData = localStorage.getItem("subscriptions");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        parsedData.forEach((savedItem: { id: number; product: string }) => {
          const item = data.value.find((d) => d.id === savedItem.id);
          if (item) {
            item.product = savedItem.product;
          }
        });
      }
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
      finalizeAssignments,
      onItemsPerPageChange,
    };
  },
});
</script>

<style scoped>
.text-center {
  text-align: center;
}

.pastel-primary {
  background-color: #4da6b2;
  border-color: #4da6b2;
  color: #fff;
  font-size: 1rem;
  padding: 0.2rem 0.4rem;
}

.pastel-success {
  background-color: #70ab74;
  border-color: #70ab74;
  color: #fff;
  font-size: 0.75rem;
  padding: 0.2rem 0.4rem;
}

.pastel-danger {
  background-color: #c77a7d;
  border-color: #c77a7d;
  color: #fff;
  font-size: 0.75rem;
  padding: 0.2rem 0.4rem;
}

.pastel-secondary {
  background-color: #8f7168;
  border-color: #8f7168;
  color: #fff;
  font-size: 0.75rem;
  padding: 0.2rem 0.4rem;
}

.fade-transition {
  transition: opacity 0.5s ease-in-out;
}

.no-hover {
  pointer-events: none;
}

.btn[disabled] {
  pointer-events: none;
  opacity: 0.5;
}

tr {
  text-align: center !important;
}

.badge {
  font-size: 0.875rem;
  padding: 0.5em 0.75em;
  border-radius: 0.375rem;
  text-align: center;
}

.badge-success {
  background-color: #28a745;
  color: #fff;
}

.badge-danger {
  background-color: #dc3545;
  color: #fff;
}

.badge-primary {
  background-color: #007bff;
  color: #fff;
}

.badge-secondary {
  background-color: #6c757d;
  color: #fff;
}
</style>
