<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title"></div>
      <div class="card-toolbar">
        <div class="card-toolbar d-flex justify-content-between align-items-center">
          <div class="d-flex justify-content-start align-items-center">
            <transition name="fade">
              <div v-if="selectedIds.length > 0" class="d-flex align-items-center">
                <div class="fw-bold me-5">
                  <span class="me-2">{{ selectedIds.length }}</span> 항목 선택됨
                </div>

                <div class="vertical-separator mx-3"></div>

                <div class="d-flex align-items-center me-3" style=" margin-right: 0 !important">
                  <div class="dropdown me-2">
                    <select v-model="selectedStatus" class="form-select checkbox-button dropdown-button">
                      <option value="Y">활성</option>
                      <option value="N">비활성</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    class="btn btn-primary checkbox-button"
                    @click="changeUserStatus"
                  >
                    상태 변경
                  </button>
                </div>

                <div class="vertical-separator mx-3"></div>

                <div class="ms-4" style=" margin-left: 0 !important">
                  <button
                    type="button"
                    class="btn btn-danger checkbox-button"
                    @click="onDeleteUsers"
                  >
                    사용자 삭제
                  </button>
                </div>
                <div class="vertical-separator mx-3"></div>
              </div>
            </transition>
          </div>

          <div class="d-flex justify-content-end align-items-center">
            <button
              tabindex="3"
              type="button"
              @click="onButtonAction"
              class="btn btn-light-primary checkbox-button"
            >
              <span class="indicator-label">사용자 등록</span>
            </button>
          </div>
        </div>

        <div class="card-toolbar">
          <button
            type="button"
            class="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-end"
            data-kt-menu-flip="top-end"
          >
            <KTIcon icon-name="category" icon-class="fs-2" />
          </button>
          <Dropdown10 @apply-filter="handleFilter"></Dropdown10>
        </div>
      </div>
    </div>

    <div class="card-body pt-0">
      <div v-if="isLoading" class="overlay">
        <div class="loader"></div>
      </div>

      <KTDatatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        :data="data"
        :header="headerConfig"
        :checkbox-enabled="true"
        @selection-change="onSelectionChange"
      >
        <!-- <template v-slot:header-id>
          <div>ID</div>
        </template> -->
        <template v-slot:header-username>
          <div>사용자명</div>
        </template>
        <template v-slot:header-name>
          <div>이름</div>
        </template>
        <template v-slot:header-email>
          <div>이메일</div>
        </template>
        <template v-slot:header-gender>
          <div>성별</div>
        </template>
        <template v-slot:header-affiliation>
          <div>소속</div>
        </template>
        <template v-slot:header-status>
          <div>상태</div>
        </template>

        <template v-slot:id="{ row: user }">
          <div class="column-id">{{ user.id }}</div>
        </template>
        <template v-slot:username="{ row: user }">
          <div class="column-username" @click="onUserClick(user)" style="cursor: pointer;">
            {{ user.username }}
          </div>
        </template>
        <template v-slot:name="{ row: user }">
          <div class="column-name" @click="onUserClick(user)" style="cursor: pointer;">
            {{ user.name }}
          </div>
        </template>
        <template v-slot:email="{ row: user }">
          <div class="column-email">{{ user.email }}</div>
        </template>
        <template v-slot:gender="{ row: user }">
          <div class="column-gender">{{ genderLabel[user.gender] }}</div>
        </template>
        <template v-slot:affiliation="{ row: user }">
          <div class="column-affiliation">{{ user.affiliation }}</div>
        </template>
        <template v-slot:status="{ row: user }">
          <div class="column-status">
            <span :class="`badge py-3 px-4 fs-7 badge-light-${statusColor[user.status]}`">
              {{ statusLabel[user.status] }}
            </span>
          </div>
        </template>
      </KTDatatable>

      <div class="d-flex justify-content-end mt-4">
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li
              class="page-item"
              :class="{ disabled: currentPage === 0 }"
              @click="onPageChange(0)"
            >
              <a class="page-link">
                <i class="ki-duotone ki-double-left fs-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </a>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage === 0 }"
              @click="onPageChange(currentPage - 1)"
            >
              <i class="page-link ki-duotone ki-left fs-2"></i>
            </li>
            <li
              class="page-item"
              v-for="page in visiblePages"
              :key="page"
              :class="{ active: page === currentPage + 1 }"
              @click="onPageChange(page - 1)"
            >
              <a class="page-link" href="#">{{ page }}</a>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage + 1 === totalPages }"
              @click="onPageChange(currentPage + 1)"
            >
              <i class="page-link ki-duotone ki-right fs-2"></i>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage + 1 === totalPages }"
              @click="onPageChange(totalPages - 1)"
            >
              <a class="page-link">
                <i class="ki-duotone ki-double-right fs-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import axios from "axios";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import Dropdown10 from "@/components/dropdown/Dropdown10.vue";

interface IUser {
  id: number;
  username: string;
  name: string;
  email: string;
  gender: string;
  affiliation: string;
  status: string;
}

export default defineComponent({
  name: "kt-user-list",
  components: {
    KTDatatable,
    Dropdown10,
  },

  setup() {
    const router = useRouter();
    const data = ref<Array<IUser>>([]);
    const totalElements = ref<number>(0);
    const totalPages = ref<number>(0);
    const currentPage = ref<number>(0);
    const pageSize = ref<number>(10);
    const search = ref<string>("");
    const selectedItems = ref<Array<IUser>>([]);
    const selectedIds = ref<Array<number>>([]);
    const selectedStatus = ref("Y");
    const genderLabel = {
      F: '여성',
      M: '남성',
    };

    const changeUserStatus = async () => {
      const token = localStorage.getItem("token");

      if (selectedIds.value.length === 0) {
        Swal.fire({
          title: "선택된 항목 없음",
          text: "상태를 변경할 항목을 선택하세요.",
          icon: "warning",
          customClass: {
            confirmButton: "btn fw-semibold btn-warning",
          },
        });
        return;
      }

      try {
        const requestBody = {
          userIds: selectedIds.value,
          status: selectedStatus.value,
        };

        const apiUrl = `http://localhost:8081/api/v1/admin/user/list/status`;
        console.log("API 호출 URL:", apiUrl);
        console.log("요청 바디:", requestBody);

        await axios.post(
          apiUrl,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire({
          title: "상태 변경 완료",
          text: "선택된 사용자의 상태가 변경되었습니다.",
          icon: "success",
          customClass: {
            confirmButton: "btn fw-semibold btn-primary",
          },
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error("Error changing user status: ", error);

        Swal.fire({
          title: "오류",
          text: "사용자 상태 변경에 실패했습니다.",
          icon: "error",
          customClass: {
            confirmButton: "btn fw-semibold btn-danger",
          },
        });
      }
    };

    const headerConfig = ref([
      // {
      //   columnName: "ID",
      //   columnLabel: "id",
      //   sortEnabled: true,
      //   columnWidth: 50,
      // },
      {
        columnName: "ID",
        columnLabel: "username",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "이름",
        columnLabel: "name",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "이메일",
        columnLabel: "email",
        sortEnabled: true,
        columnWidth: 200,
      },
      {
        columnName: "성별",
        columnLabel: "gender",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "소속",
        columnLabel: "affiliation",
        sortEnabled: true,
        columnWidth: 150,
      },
      {
        columnName: "상태",
        columnLabel: "status",
        sortEnabled: true,
        columnWidth: 100,
      },
    ]);

    const statusColor = {
      Y: "success",
      N: "danger",
    };

    const statusLabel = {
      Y: "활성",
      N: "비활성",
    };

    const isLoading = ref<boolean>(false);
    const isAscending = ref({
      id: true,
      username: true,
      name: true,
      email: true,
      gender: true,
      affiliation: true,
      status: true,
    });

    const currentSortBy = ref<string>("");

    const filters = ref({
      status: "",
      username: "",
      name: "",
      email: "",
      gender: "",
      affiliation: "",
    });

    const handleFilter = (filterData) => {
      console.log("적용된 필터 데이터:", filterData);
      filters.value = filterData;
      currentPage.value = 0;
      fetchUsers(currentPage.value, currentSortBy.value, filters.value);
    };

    const visiblePages = computed<Array<number>>(() => {
      const range = 2;
      let startPage = Math.max(1, currentPage.value + 1 - range);
      let endPage = Math.min(totalPages.value, currentPage.value + 1 + range);

      if (endPage - startPage < range * 2) {
        if (startPage === 1) {
          endPage = Math.min(totalPages.value, startPage + range * 2);
        } else if (endPage === totalPages.value) {
          startPage = Math.max(1, endPage - range * 2);
        }
      }

      const pages: Array<number> = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    });

    const fetchUsers = async (
      page: number = 0,
      sortBy: string = currentSortBy.value,
      filtersData = filters.value
    ) => {
      try {
        if (page === 0 && sortBy === "") isLoading.value = true;
        const token = localStorage.getItem("token");
        const filterQuery = buildFilterQuery(filtersData);

        const apiUrl = `http://localhost:8081/api/v1/admin/user/list?page=${page}&size=${pageSize.value}&search=${search.value}${sortBy}${filterQuery}`;
        console.log("API 호출 URL:", apiUrl);

        const response = await axios.get(
          apiUrl,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const responseData = response.data;
        console.log("API 응답 데이터:", responseData);

        data.value = responseData.content.map((user: IUser) => ({
          ...user,
          status: user.status,
        }));

        totalElements.value = responseData.totalElements;
        totalPages.value = responseData.totalPages;
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        isLoading.value = false;
      }
    };

    const buildFilterQuery = (filtersData) => {
      let query = "";
      if (filtersData.status) {
        query += `&status=${encodeURIComponent(filtersData.status)}`;
      }
      if (filtersData.username) {
        query += `&username=${encodeURIComponent(filtersData.username)}`;
      }
      if (filtersData.name) {
        query += `&name=${encodeURIComponent(filtersData.name)}`;
      }
      if (filtersData.email) {
        query += `&email=${encodeURIComponent(filtersData.email)}`;
      }
      if (filtersData.gender) {
        query += `&gender=${encodeURIComponent(filtersData.gender)}`;
      }
      if (filtersData.affiliation) {
        query += `&affiliation=${encodeURIComponent(filtersData.affiliation)}`;
      }

      return query;
    };

    onMounted(() => {
      fetchUsers(currentPage.value, currentSortBy.value, filters.value);
    });

    const deleteUser = async (id: number) => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = `http://localhost:8081/api/v1/admin/user/${id}`;
        console.log("API 호출 URL:", apiUrl);

        await axios.delete(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        data.value = data.value.filter((user) => user.id !== id);
      } catch (error) {
        console.error("Error deleting user: ", error);
      }
    };

    const deleteFewUsers = async () => {
      const result = await Swal.fire({
        title: "사용자 삭제 확인",
        text: "정말로 삭제하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
        customClass: {
          confirmButton: "btn fw-semibold btn-danger",
          cancelButton: "btn fw-semibold btn-light",
        },
        buttonsStyling: false,
      });

      if (result.isConfirmed) {
        try {
          for (const id of selectedIds.value) {
            await deleteUser(id);
          }

          selectedIds.value.length = 0;

          Swal.fire({
            title: "삭제 완료",
            text: "선택된 사용자가 삭제되었습니다.",
            icon: "success",
            customClass: {
              confirmButton: "btn fw-semibold btn-primary",
            },
          }).then(() => {
            window.location.reload();
          });
        } catch (error) {
          console.error("Error deleting user: ", error);

          Swal.fire({
            title: "오류",
            text: "사용자 삭제에 실패했습니다.",
            icon: "error",
            customClass: {
              confirmButton: "btn fw-semibold btn-danger",
            },
          });
        }
      }
    };

    const sort = (sort: Sort) => {
      let sortBy = "";
      if (sort.label === "id") {
        sortBy = isAscending.value.id
          ? "&sortBy=id&direction=asc"
          : "&sortBy=id&direction=desc";
        isAscending.value.id = !isAscending.value.id;
      } else if (sort.label === "username") {
        sortBy = isAscending.value.username
          ? "&sortBy=username&direction=asc"
          : "&sortBy=username&direction=desc";
        isAscending.value.username = !isAscending.value.username;
      } else if (sort.label === "name") {
        sortBy = isAscending.value.name
          ? "&sortBy=name&direction=asc"
          : "&sortBy=name&direction=desc";
        isAscending.value.name = !isAscending.value.name;
      } else if (sort.label === "email") {
        sortBy = isAscending.value.email
          ? "&sortBy=email&direction=asc"
          : "&sortBy=email&direction=desc";
        isAscending.value.email = !isAscending.value.email;
      } else if (sort.label === "gender") {
        sortBy = isAscending.value.gender
          ? "&sortBy=gender&direction=asc"
          : "&sortBy=gender&direction=desc";
        isAscending.value.gender = !isAscending.value.gender;
      } else if (sort.label === "affiliation") {
        sortBy = isAscending.value.affiliation
          ? "&sortBy=affiliation&direction=asc"
          : "&sortBy=affiliation&direction=desc";
        isAscending.value.affiliation = !isAscending.value.affiliation;
      } else if (sort.label === "status") {
        sortBy = isAscending.value.status
          ? "&sortBy=status&direction=asc"
          : "&sortBy=status&direction=desc";
        isAscending.value.status = !isAscending.value.status;
      } else {
        return;
      }
      currentSortBy.value = sortBy;
      console.log("정렬 요청:", sortBy);
      fetchUsers(currentPage.value, sortBy, filters.value);
    };

    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
      console.log("선택된 ID들:", selectedIds.value);
    };

    const searchItems = () => {
      console.log("검색 실행:", search.value);
      currentPage.value = 0;
      fetchUsers(currentPage.value, currentSortBy.value, filters.value);
    };

    const onPageChange = async (page: number) => {
      console.log(`페이지 변경: ${page + 1}`);
      const currentScrollPosition = window.scrollY;
      currentPage.value = page;
      await fetchUsers(page, currentSortBy.value, filters.value);
      window.scrollTo(0, currentScrollPosition);
    };

    const onSelectionChange = (selectedRows: Array<IUser>) => {
      selectedItems.value = selectedRows;
      console.log("선택된 행들:", selectedItems.value);
    };

    const onButtonAction = () => {
      if (selectedItems.value.length > 0) {
        console.log("선택된 사용자 삭제:", selectedItems.value);
      } else {
        console.log("사용자 등록 페이지로 이동");
        router.push({ name: "admin-TeacherAdd" });
      }
    };

    const onDeleteUsers = () => {
      if (selectedIds.value.length > 0) {
        deleteFewUsers();
      }
    };

    const onUserClick = (user: IUser) => {
      console.log("사용자 클릭:", user);
      localStorage.setItem("selectedUserId", user.id.toString());
      router.push({ name: "admin-TeacherDetails", params: { id: user.id } });
    };

    return {
      search,
      genderLabel,
      searchItems,
      data,
      headerConfig,
      currentPage,
      totalPages,
      onPageChange,
      visiblePages,
      selectedItems,
      onSelectionChange,
      onButtonAction,
      onDeleteUsers,
      onUserClick,
      selectedIds,
      sort,
      deleteFewUsers,
      onItemSelect,
      isLoading,
      isAscending,
      currentSortBy,
      filters,
      handleFilter,
      selectedStatus,
      changeUserStatus,
      statusColor,
      statusLabel,
    };
  },
});
</script>

<style scoped>
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
.column-id,
.column-username,
.column-name,
.column-email,
.column-gender,
.column-affiliation,
.column-status {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.column-id {
  width: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
.column-username {
  width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
.column-name {
  width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
.column-email {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
.column-gender {
  width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
.column-affiliation {
  width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
.column-status {
  width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave {
  opacity: 1;
}
.vertical-separator {
  border-left: 1px solid #dee2e6;
  height: 40px;
}
.checkbox-button {
  width: 120px;
  height: 40px;
  padding: 0 !important;
  font-weight: 600;
}
.dropdown-button {
  padding-left: 7px !important;
}
</style>
