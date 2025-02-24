<template>
  <div class="card card-flush" :class="className">
    <!-- Header: 환영 메시지 및 메뉴 버튼 -->
    <div class="card-header pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold text-gray-800">xxx 강사님 안녕하세요!</span>
        <span class="text-gray-500 mt-1 fw-semibold fs-6">{{ headerMessage }}</span>
      </h3>
      <div class="card-toolbar">
        <button class="btn btn-icon btn-color-gray-500 btn-active-color-primary justify-content-end" 
                data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-overflow="true">
          <span class="fs-1 text-gray-300 me-n1">•••</span>
        </button>
        <Dropdown2 />
      </div>
    </div>
    <!-- End Header -->

    <!-- Body: 탭 네비게이션 및 테이블 영역 -->
    <div class="card-body pt-6">
      <!-- 탭 네비게이션: 좌우 버튼과 스크롤 가능한 영역 -->
      <div class="tab-wrapper position-relative">
        <!-- 좌측 버튼 -->
        <button class="btn btn-icon left-arrow"
            @mousedown="startScrollLeft"
            @mouseup="stopScrollLeft"
            @mouseleave="stopScrollLeft">
          <KTIcon icon-name="arrow-left" icon-class="fs-3" />
        </button>

        <!-- 스크롤 가능한 탭 컨테이너 -->
        <div class="tabs-container" ref="tabsContainer">
          <ul class="nav nav-pills nav-pills-custom mb-3 d-flex flex-nowrap">
            <li v-for="(item, i) in items" :key="i" class="nav-item mb-3 me-3 me-lg-6">
              <a href="#"
                 class="nav-link btn btn-outline btn-flex btn-color-muted btn-active-color-primary flex-column overflow-visible h-85px pt-5 pb-2"
                 :style="{ minWidth: '80px' }"
                 :class="{ active: activeTabIndex === i }"
                 @click.prevent="selectTab(i)">
                <div class="nav-icon mb-3">
                  <KTIcon :icon-name="item.icon" icon-class="fs-1 p-0" />
                </div>
                <div class="nav-text text-gray-800 fw-bold fs-6 lh-1">
                  {{ item.title }}
                </div>
                <span class="bullet-custom position-absolute bottom-0 w-100 h-4px bg-primary"></span>
              </a>
            </li>
          </ul>
        </div>

        <!-- 우측 버튼 -->
        <button class="btn btn-icon right-arrow"
                @mousedown="startScrollRight"
                @mouseup="stopScrollRight"
                @mouseleave="stopScrollRight">
          <KTIcon icon-name="arrow-right" icon-class="fs-3" />
        </button>
      </div>
      <!-- End 탭 네비게이션 -->

      <!-- 탭 콘텐츠: 선택된 항목의 데이터를 KTDatatable으로 표시 -->
      <div class="tab-content">
        <div class="tab-pane fade active show">
          <div class="position-relative">
            <!-- 로딩 오버레이 -->
            <div v-if="isLoading" class="overlay">
              <div class="loader"></div>
            </div>

            <!-- KTDatatable (체크박스 제거) -->
            <KTDatatable @on-sort="sort" :data="data" :header="headerConfig">
              <!-- 헤더 슬롯 -->
              <template v-slot:header-courseName>
                <div>과정명</div>
              </template>
              <template v-slot:header-schoolName>
                <div>학교</div>
              </template>
              <template v-slot:header-startDate>
                <div>시작일</div>
              </template>
              <template v-slot:header-endDate>
                <div>종료일</div>
              </template>
              <template v-slot:header-view>
                <div>VIEW</div>
              </template>

              <!-- 본문 슬롯 -->
              <template v-slot:courseName="{ row: course }">
                <div class="column-courseName" @click="onCourseClick(course)" style="cursor: pointer;">
                  {{ course.courseName }}
                </div>
              </template>
              <template v-slot:schoolName="{ row: course }">
                <div class="column-schoolName">
                  {{ course.schoolName }}
                </div>
              </template>
              <template v-slot:startDate="{ row: course }">
                <div class="column-startDate">
                  {{ course.startDate }}
                </div>
              </template>
              <template v-slot:endDate="{ row: course }">
                <div class="column-endDate">
                  {{ course.endDate }}
                </div>
              </template>
              <template v-slot:view="{ row: course }">
                <div class="text-end">
                  <button class="btn btn-sm btn-light" @click.prevent="onViewCourse(course)">
                    <KTIcon icon-name="black-right" icon-class="fs-5 text-gray-700" />
                  </button>
                </div>
              </template>
            </KTDatatable>

            <!-- 페이지네이션 -->
            <div class="d-flex justify-content-end mt-4">
              <nav aria-label="Page navigation">
                <ul class="pagination">
                  <li class="page-item" :class="{ disabled: currentPage === 0 }" @click="handlePageChange(0)">
                    <a class="page-link">
                      <i class="ki-duotone ki-double-left fs-2">
                        <span class="path1"></span><span class="path2"></span>
                      </i>
                    </a>
                  </li>
                  <li class="page-item" :class="{ disabled: currentPage === 0 }" @click="handlePageChange(currentPage - 1)">
                    <i class="page-link ki-duotone ki-left fs-2"></i>
                  </li>
                  <li class="page-item" v-for="page in visiblePages" :key="page" 
                      :class="{ active: page === currentPage + 1 }" @click="handlePageChange(page - 1)">
                    <a class="page-link" href="#">{{ page }}</a>
                  </li>
                  <li class="page-item" :class="{ disabled: currentPage + 1 === totalPages }" @click="handlePageChange(currentPage + 1)">
                    <i class="page-link ki-duotone ki-right fs-2"></i>
                  </li>
                  <li class="page-item" :class="{ disabled: currentPage + 1 === totalPages }" @click="handlePageChange(totalPages - 1)">
                    <a class="page-link">
                      <i class="ki-duotone ki-double-right fs-2">
                        <span class="path1"></span><span class="path2"></span>
                      </i>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <!-- End 페이지네이션 -->
          </div>
        </div>
      </div>
      <!-- End 탭 콘텐츠 -->
    </div>
    <!-- End Body -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import axios from "axios";
import Dropdown2 from "@/components/dropdown/Dropdown2.vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import { ApiUrl } from "@/assets/ts/_utils/api";

export default defineComponent({
  name: "DashboardCourseTable",
  components: {
    Dropdown2,
    KTDatatable,
  },
  props: {
    className: { type: String, required: false },
  },
  setup() {
    // 탭 항목 설정
    const items = ref([
      { title: "내 출강 리스트", icon: "brifecase-tick", status: "CONFIRMED" },
      { title: "오픈 예정 교육", icon: "briefcase", status: "READY" },
      { title: "신청할 수 있는 교육", icon: "click", status: "OPEN" },
      { title: "내가 신청한 교육", icon: "brifecase-timer", status: "APPLIED" },
      // { title: "주강사 협의", icon: "brush", status: "PENDING_ASSIGN" },
      { title: "교육 진행 중", icon: "book-open", status: "PROGRESS" },
      { title: "교육 완료", icon: "flag", status: "COMPLETE" },
    ]);
    const activeTabIndex = ref(0);

    // 헤더 안내 문구
    const headerMessage = computed(() => {
      switch (items.value[activeTabIndex.value].status) {
        case "CONFIRMED":
          return "내 출강 일정입니다. 학생들을 맞이할 준비를 해주세요.";
        case "READY":
          return "곧 오픈될 교육입니다. 강의 계획을 점검해 보세요.";
        case "OPEN":
          return "지금 신청 가능! 놓치지 마세요.";
        case "APPLIED":
          return "수강 신청이 완료된 교육 목록입니다.";
        case "PENDING_ASSIGN":
          return "주강사/보조강사 협의가 필요한 교육입니다. 동료 강사님과 협의해 보세요!";
        case "PROGRESS":
          return "열심히 진행중이신 교육이네요!";
        case "COMPLETE":
          return "수고하셨습니다! 완료된 교육 목록입니다.";
        default:
          return "다가오는 강의를 한눈에 확인해 보세요.";
      }
    });

    // KTDatatable 관련 변수
    const data = ref<Array<{ id: number; courseName: string; schoolName: string; startDate: string; endDate: string }>>([]);
    const headerConfig = ref([
      { columnName: "과정명", columnLabel: "courseName", sortEnabled: true },
      { columnName: "학교", columnLabel: "schoolName", sortEnabled: true },
      { columnName: "시작일", columnLabel: "startDate", sortEnabled: true },
      { columnName: "종료일", columnLabel: "endDate", sortEnabled: true },
      { columnName: "VIEW", columnLabel: "view", sortEnabled: false },
    ]);

    // 페이지네이션 및 로딩 상태
    const totalElements = ref(0);
    const totalPages = ref(0);
    const currentPage = ref(0);
    const pageSize = ref(5);
    const isLoading = ref(false);

    // 정렬 상태
    const isAscending = ref({
      courseName: true,
      schoolName: true,
      startDate: true,
      endDate: true,
    });
    const currentSortBy = ref("");

    // 페이지네이션 계산
    const visiblePages = computed(() => {
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
      const pages: number[] = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    });

    // 탭 선택 시
    const selectTab = (index: number) => {
      activeTabIndex.value = index;
      currentPage.value = 0;
      currentSortBy.value = "";
      isAscending.value = {
        courseName: true,
        schoolName: true,
        startDate: true,
        endDate: true,
      };
      fetchCourses(0, "");
    };

    const fetchCourses = async (page: number = 0, sortBy: string = currentSortBy.value) => {
      try {
        if (page === 0 && sortBy === "") isLoading.value = true;
        const token = localStorage.getItem("token");
        const status = items.value[activeTabIndex.value].status;
        const endpoint = `/user/courses/${status.toLowerCase()}`;
        
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("size", pageSize.value.toString());
        if (sortBy) {
          const [key, order] = sortBy.split(",");
          if (key && order) {
            params.append("sort", `${key},${order}`);
          }
        }
        const url = ApiUrl(`${endpoint}?${params.toString()}`);
        console.log("Sending API request to:", url);
        
        const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        const responseData = response.data.data;
        data.value = responseData.content.map((course: any) => ({
          id: course.id,
          courseName: course.courseName,
          schoolName: course.schoolName,
          startDate: course.startDate,
          endDate: course.endDate,
        }));
        totalElements.value = responseData.totalElements;
        totalPages.value = responseData.totalPages;
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        isLoading.value = false;
      }
    };


    onMounted(() => {
      fetchCourses();
    });

    // 정렬 함수
    const sort = (sort: { label: string }) => {
      let sortBy = "";
      if (sort.label === "courseName") {
        sortBy = isAscending.value.courseName ? "courseName,asc" : "courseName,desc";
        isAscending.value.courseName = !isAscending.value.courseName;
      } else if (sort.label === "schoolName") {
        sortBy = isAscending.value.schoolName ? "schoolName,asc" : "schoolName,desc";
        isAscending.value.schoolName = !isAscending.value.schoolName;
      } else if (sort.label === "startDate") {
        sortBy = isAscending.value.startDate ? "startDate,asc" : "startDate,desc";
        isAscending.value.startDate = !isAscending.value.startDate;
      } else if (sort.label === "endDate") {
        sortBy = isAscending.value.endDate ? "endDate,asc" : "endDate,desc";
        isAscending.value.endDate = !isAscending.value.endDate;
      } else {
        return;
      }
      currentSortBy.value = sortBy;
      currentPage.value = 0;
      fetchCourses(0, sortBy);
    };

    // 강의 클릭 (상세보기)
    const onCourseClick = (course: any) => {
      console.log("Course clicked:", course);
      // 상세 페이지 이동 등 처리
    };

    // VIEW 버튼 클릭
    const onViewCourse = (course: any) => {
      console.log("View course:", course);
      // 상세 조회 페이지 이동 등 처리
    };

    // 페이지 변경
    const handlePageChange = async (page: number) => {
      currentPage.value = page;
      await fetchCourses(page, currentSortBy.value);
    };

    // tabs container에 대한 ref 추가 (좌우 버튼용)
    const tabsContainer = ref<HTMLElement | null>(null);

    // 좌측 지속 스크롤 구현
    let leftInterval: ReturnType<typeof setInterval> | null = null;
    const startScrollLeft = () => {
      if (tabsContainer.value) {
        leftInterval = setInterval(() => {
          tabsContainer.value?.scrollBy({ left: -10, behavior: "auto" });
        }, 16);
      }
    };
    const stopScrollLeft = () => {
      if (leftInterval) {
        clearInterval(leftInterval);
        leftInterval = null;
      }
    };

    // 우측 지속 스크롤 구현
    let rightInterval: ReturnType<typeof setInterval> | null = null;
    const startScrollRight = () => {
      if (tabsContainer.value) {
        rightInterval = setInterval(() => {
          tabsContainer.value?.scrollBy({ left: 10, behavior: "auto" });
        }, 16);
      }
    };
    const stopScrollRight = () => {
      if (rightInterval) {
        clearInterval(rightInterval);
        rightInterval = null;
      }
    };

    return {
      className: "",
      items,
      activeTabIndex,
      data,
      headerConfig,
      isLoading,
      visiblePages,
      currentPage,
      totalPages,
      sort,
      handlePageChange,
      onCourseClick,
      onViewCourse,
      selectTab,
      headerMessage,
      tabsContainer,
      startScrollLeft,
      stopScrollLeft,
      startScrollRight,
      stopScrollRight,
    };
  },
});
</script>

<style scoped>
/* 로딩 오버레이 스타일 */
.overlay {
  position: absolute;
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

/* KTDatatable 테이블 스타일 */
.kt-datatable table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}
.kt-datatable thead th,
.kt-datatable tbody td {
  width: calc(100% / 5);
  padding: 8px;
  border: 1px solid #ddd;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.kt-datatable tbody {
  min-height: 200px;
}

/* 페이지네이션 스타일 */
.pagination .page-item.active .page-link {
  background-color: #3699FF;
  border-color: #3699FF;
  color: #fff;
}
.pagination .page-link {
  cursor: pointer;
}

/* 탭 네비게이션 관련 스타일 */
.tab-wrapper {
  position: relative;
}
.tabs-container {
  overflow-x: hidden; /* 스크롤바 숨김 */
  margin: 0 40px; /* 좌우 버튼 공간 확보 */
}
.left-arrow,
.right-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  cursor: pointer;
  padding: 5px;
}
.left-arrow {
  left: 0;
}
.right-arrow {
  right: 0;
}

/* 내부 콘텐츠가 모두 보이도록 처리 */
.nav-text {
  white-space: nowrap;
  overflow: visible;
}
</style>
