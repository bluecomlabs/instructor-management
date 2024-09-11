<template>
  <!--begin::Card-->
  <div class="card">
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
      <template v-slot:customer="{ row: customer }">
        <div>
          <div class="text-gray-800 text-hover-primary mb-1">
            {{ customer.customer }}
          </div>
          <div class="text-muted small">
            <span v-for="(teacher, index) in customer.status" :key="index">
              {{ teacher }}<span v-if="index < customer.status.length - 1">, </span>
            </span>
          </div>
        </div>
      </template>

        <template v-slot:product="{ row: customer }">
          <button
            v-if="customer.product === '신청하기'"
            class="btn btn-primary custom-button fade-transition"
            @click="applyForProduct(customer)"
          >
            신청
          </button>
          <button
            v-else
            class="btn btn-danger custom-button fade-transition"
            @click="cancelProduct(customer)"
          >
            취소
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
import { defineComponent, ref, onMounted } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";
import { SuccessAlert, WarningAlert, ErrorAlert } from '@/assets/ts/_utils/swal';

interface Sort {
  order: "asc" | "desc";
  label: string;
}

interface ISubscription {
  id: number;
  customer: string;
  status: string[];
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
        status: ["홍길동","홍길동","홍길동","홍길동"],
        color: "success",
        billing: "MODI",
        product: "신청하기",
        createdDate: "",
      },
      {
        id: 2,
        customer: "성남청소년센터",
        status: [],
        color: "success",
        billing: "MODI",
        product: "신청하기",
        createdDate: "",
      },
      {
        id: 3,
        customer: "성남청소년센터(단기)",
        status: [],
        color: "primary",
        billing: "드론",
        product: "신청하기",
        createdDate: "",
      },
      {
        id: 4,
        customer: "남목청소년센터(도우리반)",
        status: [],
        color: "warning",
        billing: "코스페이시스",
        product: "신청하기",
        createdDate: "",
      },
      {
        id: 5,
        customer: "남목청소년센터(나누리반)",
        status: [],
        color: "warning",
        billing: "코스페이시스",
        product: "신청하기",
        createdDate: "",
      },
      {
        id: 6,
        customer: "남목청소년센터(동아리)",
        status: [],
        color: "success",
        billing: "3D 모델링",
        product: "신청하기",
        createdDate: "",
      },
      {
        id: 7,
        customer: "북구청소년센터",
        status: ["홍길동"],
        color: "success",
        billing: "스택버거, 엔트리",
        product: "신청하기",
        createdDate: "",
      },
      {
        id: 8,
        customer: "북구청소년센터",
        status: ["홍길동"],
        color: "danger",
        billing: "스택버거, 엔트리",
        product: "신청하기",
        createdDate: "",
      },
      {
        id: 9,
        customer: "북구청소년센터(단기)",
        status: ["홍길동"],
        color: "warning",
        billing: "프로보커넥트",
        product: "신청하기",
        createdDate: "",
      },
      {
        id: 10,
        customer: "북구청소년센터(동아리)",
        status: ["홍길동"],
        color: "success",
        billing: "코스페이시스",
        product: "신청하기",
        createdDate: "",
      },
      {
        id: 11,
        customer: "Emma Bold",
        status: ["홍길동"],
        color: "success",
        billing: "Manual - Credit Card",
        product: "Enterprise",
        createdDate: "May 05, 2021",
      },
      {
        id: 12,
        customer: "Ana Crown",
        status: ["홍길동"],
        color: "success",
        billing: "Manual - Credit Card",
        product: "Basic",
        createdDate: "Jun 24, 2021",
      },
      {
        id: 13,
        customer: "Robert Doe",
        status: ["홍길동"],
        color: "danger",
        billing: "--",
        product: "Teams Bundle",
        createdDate: "Jul 25, 2021",
      },
      {
        id: 14,
        customer: "John Miller",
        status: ["홍길동"],
        color: "success",
        billing: "Manual - Paypal",
        product: "Enterprise",
        createdDate: "Sep 22, 2021",
      },
      {
        id: 15,
        customer: "Lucy Kunic",
        status: ["홍길동"],
        color: "success",
        billing: "Manual - Credit Card",
        product: "Basic",
        createdDate: "Nov 10, 2021",
      },
      {
        id: 16,
        customer: "Neil Owen",
        status: ["홍길동"],
        color: "danger",
        billing: "--",
        product: "Basic Bundle",
        createdDate: "Jun 20, 2021",
      },
      {
        id: 17,
        customer: "Dan Wilson",
        status: ["홍길동"],
        color: "warning",
        billing: "Manual - Paypal",
        product: "Enterprise",
        createdDate: "May 05, 2021",
      },
      {
        id: 18,
        customer: "Emma Smith",
        status: ["홍길동"],
        color: "success",
        billing: "Auto-debit",
        product: "Teams",
        createdDate: "Apr 15, 2021",
      },
      {
        id: 19,
        customer: "Melody Macy",
        status: ["홍길동"],
        color: "success",
        billing: "Manual - Credit Card",
        product: "Basic",
        createdDate: "Oct 25, 2021",
      },
      {
        id: 20,
        customer: "Max Smith",
        status: ["홍길동"],
        color: "danger",
        billing: "--",
        product: "Basic Bundle",
        createdDate: "Feb 21, 2021",
      },
      {
        id: 21,
        customer: "Max Smith",
        status: ["홍길동"],
        color: "danger",
        billing: "--",
        product: "Basic Bundle",
        createdDate: "Feb 21, 2021",
      },
    ]);
    const headerConfig = ref([
      {
        columnName: "교육기관명 및 강사명",
        columnLabel: "customer",
        sortEnabled: true,
      },
      {
        columnName: "신청 및 취소",
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
        WarningAlert('강의 신청', '해당 강의를 신청하시겠습니까?')
          .then((result) => {
            if (result.isConfirmed) {
              customer.product = "신청완료";
              saveToLocalStorage();
              SuccessAlert('신청 완료', '성공적으로 강의를 신청하였습니다!');
            }
          });
      }
    };

    const cancelProduct = (customer: ISubscription) => {
      if (customer.product === "신청완료") {
        WarningAlert('강의 취소', '해당 강의를 취소하시겠습니까?')
          .then((result) => {
            if (result.isConfirmed) {
              customer.product = "신청하기";
              saveToLocalStorage();
              // SuccessAlert('신청 취소', '성공적으로 강의를 취소하였습니다!');
              ErrorAlert('신청 실패', '(오류메세지)')
            }
          });
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
  /* font-weight: bold; */
  /* border-radius: 30px; */
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
  /* font-weight: bold;
  border-radius: 30px; */
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


</style>