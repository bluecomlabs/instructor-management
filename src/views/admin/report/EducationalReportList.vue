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
      <!-- 로딩 오버레이 -->
      <div v-if="isLoading" class="overlay">
        <div class="loader"></div>
      </div>

      <KTDatatable
        class="text-center"
        @on-sort="sort"
        @on-items-select="onItemSelect"
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
          <span class="text-gray-800 mb-1">{{ customer.institutionName }}</span><br />
          <small class="text-gray-500">{{ customer.customer }}</small>
        </template>
        <template v-slot:date="{ row: customer }">
          <span class="text-gray-800 mb-1">{{ customer.date }}</span>
        </template>
        <template v-slot:product="{ row: customer }">
          <div
            :class="{
              'badge py-3 px-4 fs-7 badge-light-success': customer.product === '최종배정',
              'badge py-3 px-4 fs-7 badge-light-danger': customer.product === '탈락',
              'badge py-3 px-4 fs-7 badge-light-primary': customer.product === '신청완료',
              'badge py-3 px-4 fs-7 badge-light-secondary': customer.product === '미배정',
            }"
          >
            {{ customer.product }}
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
import axios from "axios";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";
import Swal from "sweetalert2";
import { ApiUrl } from "@/assets/ts/_utils/api";

interface ISubscription {
  id: number;
  customer: string;
  date: string;
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
    const data = ref<Array<ISubscription>>([]);
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
        columnLabel: "date",
        sortEnabled: true,
      },
      {
        columnName: "최종배정 여부",
        columnLabel: "product",
        sortEnabled: true,
      },
    ]);

    const initData = ref<Array<ISubscription>>([]);
    const isLoading = ref(false); 

    const statusMap = ref<Record<number, string>>({});
    const fetchData = async () => {
      try {
        isLoading.value = true; 
        const token = localStorage.getItem("token");
        const response = await axios.get(ApiUrl('/api/v1/admin/instructor-applications/all'),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const apiData = response.data.map((item: any) => ({
          id: item.confirmedProgramId,
          institutionName: item.institutionName || "미정",
          customer: item.instructorName || "미정",
          status: item.status,
          date: item.date.split("T")[0],
          color: item.status === "COMPLETE" ? "success" : "warning",
          billing: item.programName,
          product: item.status === "COMPLETE" ? "최종배정" : "미배정",
          createdDate: item.instructorName || "미정",
        }));

        data.value = [...apiData];
        initData.value = [...apiData];
      } catch (error) {
        console.error("Error fetching data:", error);
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

    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    const search = ref<string>("");
    const searchItems = () => {
      data.value.splice(0, data.value.length, ...initData.value);
      if (search.value !== "") {
        const results = initData.value.filter((item) =>
          searchingFunc(item, search.value)
        );
        data.value.splice(0, data.value.length, ...results);
      }
      MenuComponent.reinitialization();
    };

    const searchingFunc = (obj: any, value: string): boolean => {
      for (let key in obj) {
        if (!Number.isInteger(obj[key]) && typeof obj[key] === "string") {
          if (obj[key].toLowerCase().indexOf(value.toLowerCase()) !== -1) {
            return true;
          }
        }
      }
      return false;
    };
    const finalizeAssignments = async () => {
      const openProgramIds = data.value
        .filter((item) => item.status === "OPEN") 
        .map((item) => item.id);

      console.log("Open Program IDs: ", openProgramIds); 

      if (openProgramIds.length === 0) {
        Swal.fire({
          title: "모든 강의가 최종배정됨",
          text: "모든 강의가 최종배정된 상태입니다.",
          icon: "info",
          confirmButtonText: "OK",
        });
        return;
      }

      Swal.fire({
        title: "최종배정 하시겠습니까?",
        text: "강사들이 강의를 신청/취소할 수 없습니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "예",
        cancelButtonText: "아니오",
      }).then(async (result) => {
        if (result.isConfirmed) {

          try {
            const token = localStorage.getItem("token");
            await axios.post(ApiUrl('/api/v1/admin/confirmed-programs/complete-and-add-assistant-instructors'),
              { 
                confirmedProgramIds: openProgramIds
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            Swal.fire({
              title: "성공!",
              text: "모든 강의가 최종배정 되었습니다.",
              icon: "success",
              confirmButtonText: "확인",
            }).then(() => {
              fetchData();
            });
            
          } catch (error) {
            console.error("Error finalizing assignments:", error);
            Swal.fire(
              "Error!",
              "There was an issue finalizing the assignments.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "The process was cancelled.", "info");
        }
      });
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
      loadFromLocalStorage,
      isLoading,
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
</style>
