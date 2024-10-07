<template>
  <!--begin::Card-->
  <div class="card">

    <div class="d-flex justify-content-end my-3">
      <button @click="goToDashboard" class="btn btn-primary custom-button top-button">
        <KTIcon icon-name="element-11" icon-class="fs-2 me-2" />
        대시보드
      </button>
    </div>

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
              >View</router-link>
            </div>
            <!--end::Menu item-->
            <!--begin::Menu item-->
            <div class="menu-item px-3">
              <a @click="deleteSubscription(customer.id)" class="menu-link px-3">Delete</a>
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
      },
      {
        columnName: "신청 및 취소",
        columnLabel: "product",
        sortEnabled: true,
      },
    ]);

    const isLoading = ref(false);
    const initData = ref<Array<ISubscription>>([]);
    const loadDataFromApi = async () => {
      try {
        isLoading.value = true;
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Token이 없습니다.");

        const response = await axios.get(ApiUrl('/api/v1/user/instructor-applications/all'),
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const programMap = new Map<number, any>(); // confirmedProgramId를 key로 사용하여 데이터 그룹핑

        response.data.forEach((item: any) => {
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
        initData.value.splice(0, initData.value.length, ...apiData); // 초기 데이터 업데이트
        isLoading.value = false;
      } catch (error) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다.', error);
        isLoading.value = false;
      }
    };

    onMounted(() => {
      loadDataFromApi();
    });

    const selectedIds = ref<Array<number>>([]);
    const deleteFewSubscriptions = () => {
      selectedIds.value.forEach((item) => deleteSubscription(item));
      selectedIds.value.length = 0;
    };
    const deleteSubscription = (id: number) => {
      data.value = data.value.filter((item) => item.id !== id);
      saveToLocalStorage();
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
      data.value.splice(0, data.value.length, ...initData.value);
      if (search.value !== "") {
        const results = initData.value.filter(item => searchingFunc(item, search.value));
        data.value.splice(0, data.value.length, ...results);
      }
      MenuComponent.reinitialization();
    };

    const searchingFunc = (obj: any, value: string): boolean => {
      for (let key in obj) {
        if (!Number.isInteger(obj[key]) && !(typeof obj[key] === "object")) {
          if (obj[key].toLowerCase().indexOf(value.toLowerCase()) !== -1) return true;
        }
      }
      return false;
    };

    const onItemsPerPageChange = () => {
      setTimeout(() => MenuComponent.reinitialization(), 0);
    };

    const applyForProduct = async (customer: ISubscription) => {
      if (customer.product === "신청하기") {
        try {
          const result = await WarningAlert('강의 신청', '해당 강의를 신청하시겠습니까?');
          if (result.isConfirmed) {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Token이 없습니다.");

            const requestData = { confirmedProgramId: customer.id };
            const response = await axios.post(ApiUrl('/api/v1/user/instructor-applications'), requestData,
            {
              headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200 || response.status === 201) {
              await loadDataFromApi();
              SuccessAlert('신청 완료', '성공적으로 강의를 신청하였습니다!');
            }
          }
        } catch (error) {
          console.error('신청하는 중 오류가 발생했습니다.', error);
          ErrorAlert('신청 실패', '강의 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      }
    };

    const cancelProduct = (customer: ISubscription) => {
      if (customer.product === "신청완료") {
        WarningAlert('강의 취소', '해당 강의를 취소하시겠습니까?')
          .then((result) => {
            if (result.isConfirmed) {
              customer.product = "신청하기";
              saveToLocalStorage();
              ErrorAlert('신청 실패', '(오류메세지)');
            }
          });
      }
    };

    const saveToLocalStorage = () => {
      const dataToSave = data.value.map((item) => ({ id: item.id, product: item.product }));
      localStorage.setItem("subscriptions", JSON.stringify(dataToSave));
    };

    const goToDashboard = () => {
      router.push({ path: "/user/dashboard" });
    };
    const loadFromLocalStorage = () => {
      const savedData = localStorage.getItem("subscriptions");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        parsedData.forEach((savedItem: { id: number; product: string }) => {
          const item = data.value.find((d) => d.id === savedItem.id);
          if (item) item.product = savedItem.product;
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
      isLoading,
      goToDashboard
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

.top-button {

  margin-right: 10px
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
@media (min-width: 768px) {
  .top-button {
    display: none;
  }
}

@media (max-width: 767px) {
  .top-button {
    display: block;
  }
}

</style>
