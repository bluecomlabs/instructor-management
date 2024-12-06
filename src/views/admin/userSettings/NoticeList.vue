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

                <div class="ms-4" style=" margin-left: 0 !important">
                  <button
                    type="button"
                    class="btn btn-danger checkbox-button"
                    @click="onDeleteNotices"
                  >
                    공지 삭제
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
              <span class="indicator-label">공지 등록</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card-body pt-0">
      <div v-if="isLoading" class="overlay">
        <div class="loader"></div>
      </div>

      <KTDatatable
        :data="data"
        :header="headerConfig"
        :checkbox-enabled="true"
        @selection-change="onSelectionChange"
      >
        <!-- Header slots -->
        <template v-slot:header-number>
          <div class="header-cell">번호</div>
        </template>
        <template v-slot:header-title>
          <div class="header-cell">제목</div>
        </template>
        <template v-slot:header-author>
          <div class="header-cell">작성자</div>
        </template>
        <template v-slot:header-createdAt>
          <div class="header-cell">작성일</div>
        </template>
        <template v-slot:header-views>
          <div class="header-cell">조회수</div>
        </template>

        <!-- Data slots -->
        <template v-slot:number="{ row: notice }">
          <div class="column-number">{{ notice.number }}</div>
        </template>
        <template v-slot:title="{ row: notice }">
          <div
            class="column-title"
            @click="onInstitutionClick(notice)"
            style="cursor: pointer;"
          >
            {{ notice.title }}
          </div>
        </template>
        <template v-slot:author="{ row: notice }">
          <div class="column-author">{{ notice.author }}</div>
        </template>
        <template v-slot:createdAt="{ row: notice }">
          <div class="column-createdAt">{{ notice.createdAt }}</div>
        </template>
        <template v-slot:views="{ row: notice }">
          <div class="column-views">{{ notice.views }}</div>
        </template>
      </KTDatatable>

      <div class="d-flex justify-content-end mt-4">
        <!-- 페이지네이션이 필요하면 여기에 추가할 수 있습니다 -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";

interface INotice {
  id: number;
  number: number;
  title: string;
  author: string;
  createdAt: string;
  views: number;
}

export default defineComponent({
  name: "kt-notice-list",
  components: {
    KTDatatable,
  },
  setup() {
    const router = useRouter();
    const data = ref<Array<INotice>>([
      { id: 1, number: 1, title: "공지사항 제목 1", author: "관리자", createdAt: "2023-10-01", views: 123 },
      { id: 2, number: 2, title: "공지사항 제목 2", author: "홍길동", createdAt: "2023-10-02", views: 456 },
      { id: 3, number: 3, title: "공지사항 제목 3", author: "이순신", createdAt: "2023-10-03", views: 789 },
      { id: 4, number: 4, title: "공지사항 제목 4", author: "김철수", createdAt: "2023-10-04", views: 101 },
      { id: 5, number: 5, title: "공지사항 제목 5", author: "박영희", createdAt: "2023-10-05", views: 202 },
      { id: 6, number: 6, title: "공지사항 제목 6", author: "관리자", createdAt: "2023-10-06", views: 303 },
      { id: 7, number: 7, title: "공지사항 제목 7", author: "홍길동", createdAt: "2023-10-07", views: 404 },
      { id: 8, number: 8, title: "공지사항 제목 8", author: "이순신", createdAt: "2023-10-08", views: 505 },
      { id: 9, number: 9, title: "공지사항 제목 9", author: "김철수", createdAt: "2023-10-09", views: 606 },
      { id: 10, number: 10, title: "공지사항 제목 10", author: "박영희", createdAt: "2023-10-10", views: 707 },
      // 데이터 생략
    ]);

    const headerConfig = ref([
      {
        columnName: "번호",
        columnLabel: "number",
        sortEnabled: true,
        columnWidth: 70,
        textAlign: "center",
      },
      {
        columnName: "제목",
        columnLabel: "title",
        sortEnabled: true,
        columnWidth: 300,
        textAlign: "center",
      },
      {
        columnName: "작성자",
        columnLabel: "author",
        sortEnabled: true,
        columnWidth: 150,
        textAlign: "center",
      },
      {
        columnName: "작성일",
        columnLabel: "createdAt",
        sortEnabled: true,
        columnWidth: 150,
        textAlign: "center",
      },
      {
        columnName: "조회수",
        columnLabel: "views",
        sortEnabled: true,
        columnWidth: 100,
        textAlign: "center",
      },
    ]);

    const selectedItems = ref<Array<INotice>>([]);
    const selectedIds = ref<Array<number>>([]);
    const isLoading = ref<boolean>(false);

    const onSelectionChange = (selectedRows: Array<INotice>) => {
      selectedItems.value = selectedRows;
      selectedIds.value = selectedRows.map((row) => row.id);
    };

    const onButtonAction = () => {
      router.push({ name: "admin-NoticeAdd" });
    };

    const onDeleteNotices = () => {
      if (selectedIds.value.length > 0) {
        data.value = data.value.filter((notice) => !selectedIds.value.includes(notice.id));
        selectedItems.value = [];
        selectedIds.value = [];
        alert("선택된 공지가 삭제되었습니다.");
      }
    };

    const onInstitutionClick = (notice: INotice) => {
      localStorage.setItem("selectedInstitutionId", notice.id.toString());
      router.push({ name: "admin-NoticeDetails", params: { id: notice.id } });
    };

    return {
      data,
      headerConfig,
      selectedItems,
      selectedIds,
      onSelectionChange,
      onButtonAction,
      onDeleteNotices,
      onInstitutionClick,
      isLoading,
    };
  },
});
</script>

<style>
/* 스타일에서 scoped를 제거합니다 */
.header-cell,
.column-number,
.column-title,
.column-author,
.column-createdAt,
.column-views {
  text-align: center;
}

/* 기존 스타일은 그대로 유지합니다 */
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

.column-number,
.column-title,
.column-author,
.column-createdAt,
.column-views {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.column-number {
  width: 70px;
}

.column-title {
  width: 300px;
  cursor: pointer;
}

.column-author {
  width: 150px;
}

.column-createdAt {
  width: 150px;
}

.column-views {
  width: 100px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave {
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
.column-number,
.column-title,
.column-author,
.column-createdAt,
.column-views {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}
</style>
