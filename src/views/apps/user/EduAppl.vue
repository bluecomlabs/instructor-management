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
      <!--begin::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
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
        <!--end::Toolbar-->

        <!--begin::Group actions-->
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
          {{ customer.billing }}
        </template>
        <template v-slot:createdDate="{ row: customer }">
          {{ customer.createdDate }}
        </template>
        <template v-slot:customer="{ row: customer }">
          <router-link
            to="Attendance"
            href=""
            class="text-gray-800 text-hover-primary mb-1 customer-name"
          >
            {{ customer.customer }}
          </router-link>
        </template>
        <template v-slot:status="{ row: customer }">
          <router-link
            to="EducationJournal"
            href=""
            class="text-gray-800 text-hover-primary mb-1"
          >
            {{ customer.status }}
          </router-link>
        </template>
        <template v-slot:product="{ row: customer }">
          <button
            v-if="customer.product === '신청하기'"
            class="btn btn-primary custom-button fade-transition"
            @click="applyForProduct(customer)"
          >
            신청하기
          </button>
          <button
            v-else
            class="btn btn-danger custom-button fade-transition"
            @click="cancelProduct(customer)"
          >
            신청취소
          </button>
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
              <router-link
                to="/apps/customers/customer-details"
                class="menu-link px-3"
                >View</router-link
              >
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
        customer: "성남청소년센터",
        status: "미배정",
        color: "success",
        billing: "MODI",
        product: "신청하기",
        createdDate: "",
      },
      {
        id: 2,
        customer: "성남청소년센터",
        status: "미배정",
        color: "success",
        billing: "MODI",
        product: "신청하기",
        createdDate: "",
      },
      {
        id: 3,
        customer: "성남청소년센터(단기)",
        status: "미배정",
        color: "primary",
        billing: "드론",
        product: "신청하기",
        createdDate: "",
      },
      {
        id: 4,
        customer: "남목청소년센터(도우리반)",
        status: "미배정",
        color: "warning",
        billing: "코스페이시스",
        product: "신청하기",
        createdDate: "",
      },
      {
        id: 5,
        customer: "남목청소년센터(나누리반)",
        status: "미배정",
        color: "warning",
        billing: "코스페이시스",
        product: "신청하기",
        createdDate: "",
      },
      {
        id: 6,
        customer: "남목청소년센터(동아리)",
        status: "미배정",
        color: "success",
        billing: "3D 모델링",
        product: "신청하기",
        createdDate: "",
      },
      {
        id: 7,
        customer: "북구청소년센터",
        status: "미배정",
        color: "success",
        billing: "스택버거, 엔트리",
        product: "신청하기",
        createdDate: "",
      },
      {
        id: 8,
        customer: "북구청소년센터",
        status: "미배정",
        color: "danger",
        billing: "스택버거, 엔트리",
        product: "신청하기",
        createdDate: "",
      },
      {
        id: 9,
        customer: "북구청소년센터(단기)",
        status: "미배정",
        color: "warning",
        billing: "프로보커넥트",
        product: "신청하기",
        createdDate: "",
      },
      {
        id: 10,
        customer: "북구청소년센터(동아리)",
        status: "미배정",
        color: "success",
        billing: "코스페이시스",
        product: "신청하기",
        createdDate: "",
      },
      {
        id: 11,
        customer: "Emma Bold",
        status: "Active",
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
      // {
      //   columnName: "프로그램명",
      //   columnLabel: "billing",
      //   sortEnabled: true,
      // },
      // {
      //   columnName: "강사명",
      //   columnLabel: "createdDate",
      //   sortEnabled: true,
      // },
      {
        columnName: "교육기관명",
        columnLabel: "customer",
        sortEnabled: true,
      },
      {
        columnName: "배정강사",
        columnLabel: "status",
        sortEnabled: true,
      },
      {
        columnName: "신청",
        columnLabel: "product",
        sortEnabled: true,
      },
      // {
      //   columnName: "설정",
      //   columnLabel: "actions",
      // },
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
  saveToLocalStorage();
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

const applyForProduct = (customer: ISubscription) => {
  if (customer.product === "신청하기") {
    customer.product = "신청완료";
    saveToLocalStorage();
  }
};

const cancelProduct = (customer: ISubscription) => {
  if (customer.product === "신청완료") {
    customer.product = "신청하기";
    saveToLocalStorage();
  }
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
  getAssetPath,
  onItemsPerPageChange,
  applyForProduct,
  cancelProduct,
};
},
});
</script>

<style scoped>
.fade-transition {
  transition: opacity 0.5s ease-in-out;
}

.btn[disabled] {
  pointer-events: none;
  opacity: 0.5;
}


.customer-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
  display: inline-block;
  vertical-align: middle;
}

.custom-button {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  transition: background-color 0.3s ease;
  width: 100px;
  text-align: center;
  margin-left: auto;
}

.custom-button.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.custom-button.btn-primary:hover {
  background-color: #0056b3;
}

.custom-button.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.custom-button.btn-danger:hover {
  background-color: #c82333;
}

.card-body {
  padding: 15px;
}

.kTDatatable {
  table-layout: fixed;
}

.kTDatatable th, .kTDatatable td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kTDatatable th:first-child, .kTDatatable td:first-child {
  width: 30px;
}

.kTDatatable th:nth-child(2), .kTDatatable td:nth-child(2) {
  width: 200px;
}

.kTDatatable th:nth-child(3), .kTDatatable td:nth-child(3) {
  width: 100px;
}

.kTDatatable th:nth-child(4), .kTDatatable td:nth-child(4) {
  width: 100px;
}

/* 모바일 반응형 스타일 (너비 430px 이하) */
@media (max-width: 430px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .card-title {
    width: 100%;
    margin-bottom: 10px;
  }

  .card-toolbar {
    width: 100%;
    justify-content: flex-start;
  }

  .btn {
    padding: 5px 10px;
    font-size: 12px;
  }

  .btn-danger {
    padding: 5px 10px;
    font-size: 12px;
  }

  .fw-bold {
    font-size: 12px;
  }

  .card-body {
    padding: 10px;
  }

  .form-control {
    width: 100% !important;
    padding: 10px;
  }

  .text-hover-primary {
    font-size: 14px;
  }

  .menu-link {
    font-size: 14px;
    padding: 5px 10px;
  }

  .menu-sub {
    width: 100px;
  }

  .w-250px {
    width: 100% !important;
  }

  .customer-name {
    max-width: 100px;
  }

  .custom-button {
    width: 80px;
    font-size: 10px;
  }

  .kTDatatable th:nth-child(2), .kTDatatable td:nth-child(2) {
    width: 120px;
  }
}
</style>
