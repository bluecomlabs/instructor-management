<template>
  <div class="d-flex flex-column flex-xl-row">
    <div class="flex-column flex-lg-row-auto w-100 mb-10">
      <div class="card mb-5 mb-xl-8">
        <div class="card-body">
          <!-- 과정 정보 -->
          <div class="card mb-5 mb-xl-10">
            <div
              class="card-header border-0 cursor-pointer"
              role="button"
              data-bs-toggle="collapse"
              data-bs-target="#courseDetails"
              aria-expanded="true"
              aria-controls="courseDetails"
            >
              <div class="card-title m-0 d-flex align-items-center">
                <i class="bi bi-info-circle me-2"></i>
                <h2 class="fw-bold m-0">과정 조회</h2>
              </div>
            </div>
            <div id="courseDetails" class="collapse show">
              <div class="card-body border-top p-9">
                <div v-if="courseData">
                  <h3 class="fw-bold section-title">과정 정보</h3>
                  <div class="card mb-4">
                    <div class="card-body p-0">
                      <table class="table table-bordered mb-0">
                        <colgroup>
                          <col style="width: 20%;">
                          <col style="width: 30%;">
                          <col style="width: 20%;">
                          <col style="width: 30%;">
                        </colgroup>
                        <tbody>
                          <tr>
                            <th class="bg-light">과정 ID</th>
                            <td>{{ courseData.id }}</td>
                            <th class="bg-light">상태</th>
                            <td>{{ courseData.status }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">과정명</th>
                            <td>{{ courseData.courseName }}</td>
                            <th class="bg-light">설명</th>
                            <td>{{ courseData.description }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">시작일</th>
                            <td>{{ courseData.startDate }}</td>
                            <th class="bg-light">종료일</th>
                            <td>{{ courseData.endDate }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">확정 여부</th>
                            <td>{{ courseData.confirmed ? '확정' : '미확정' }}</td>
                            <th class="bg-light">비고</th>
                            <td>{{ courseData.remarks || '-' }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">학년</th>
                            <td>{{ courseData.grade }}</td>
                            <th class="bg-light">반</th>
                            <td>{{ courseData.classNo }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">학생 수</th>
                            <td>{{ courseData.studentCount }}</td>
                            <th class="bg-light"></th>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- 프로그램 정보 -->
                  <h3 class="fw-bold section-title">프로그램 정보</h3>
                  <div class="card mb-4">
                    <div class="card-body p-0">
                      <table class="table table-bordered mb-0">
                        <colgroup>
                          <col style="width: 20%;">
                          <col style="width: 30%;">
                          <col style="width: 20%;">
                          <col style="width: 30%;">
                        </colgroup>
                        <tbody>
                          <tr>
                            <th class="bg-light">프로그램 ID</th>
                            <td>{{ courseData.programId }}</td>
                            <th class="bg-light">프로그램명</th>
                            <td>{{ courseData.programName }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- 기관 정보 -->
                  <h3 class="fw-bold section-title">기관 정보</h3>
                  <div class="card mb-4">
                    <div class="card-body p-0">
                      <table class="table table-bordered mb-0">
                        <colgroup>
                          <col style="width: 20%;">
                          <col style="width: 30%;">
                          <col style="width: 20%;">
                          <col style="width: 30%;">
                        </colgroup>
                        <tbody>
                          <tr>
                            <th class="bg-light">비즈니스명</th>
                            <td>{{ courseData.businessName }}</td>
                            <th class="bg-light">교육기관 ID</th>
                            <td>{{ courseData.schoolId }}</td>
                          </tr>
                          <tr>
                            <th class="bg-light">교육기관명</th>
                            <td>{{ courseData.schoolName }}</td>
                            <th class="bg-light">주소</th>
                            <td>
                              {{ courseData.city }} {{ courseData.district }}
                              {{ courseData.street }} {{ courseData.number }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- 강의(세션) 정보 -->
                  <h3 class="fw-bold section-title">강의 정보</h3>
                  <div class="accordion" id="courseSessionsAccordion">
                    <div
                      class="accordion-item"
                      v-for="session in courseData.courseSessions"
                      :key="session.id"
                    >
                      <h2 class="accordion-header" :id="'heading' + session.id">
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          :data-bs-target="'#collapse' + session.id"
                          aria-expanded="false"
                          :aria-controls="'collapse' + session.id"
                        >
                          <i class="bi bi-journal-bookmark me-2"></i>
                          세션 {{ session.sessionNumber }} - {{ session.date }}
                        </button>
                      </h2>
                      <div
                        :id="'collapse' + session.id"
                        class="accordion-collapse collapse"
                        :aria-labelledby="'heading' + session.id"
                        data-bs-parent="#courseSessionsAccordion"
                      >
                        <div class="accordion-body">
                          <div class="card mb-4">
                            <div class="card-body p-0">
                              <table class="table table-bordered mb-0">
                                <colgroup>
                                  <col style="width: 20%;">
                                  <col style="width: 30%;">
                                  <col style="width: 20%;">
                                  <col style="width: 30%;">
                                </colgroup>
                                <tbody>
                                  <tr>
                                    <th class="bg-light">세션 ID</th>
                                    <td>{{ session.id }}</td>
                                    <th class="bg-light">날짜</th>
                                    <td>{{ session.date }}</td>
                                  </tr>
                                  <tr>
                                    <th class="bg-light">시작 시간</th>
                                    <td>{{ session.startTime }}</td>
                                    <th class="bg-light">종료 시간</th>
                                    <td>{{ session.endTime }}</td>
                                  </tr>
                                  <tr>
                                    <th class="bg-light">세션 상태</th>
                                    <td>{{ session.status }}</td>
                                    <th class="bg-light">필요 주강사 수</th>
                                    <td>{{ session.neededMainInstructors }}</td>
                                  </tr>
                                  <tr>
                                    <th class="bg-light">필요 보조강사 수</th>
                                    <td>{{ session.neededAssistantInstructors }}</td>
                                    <th class="bg-light"></th>
                                    <td></td>
                                  </tr>
                                  <!-- 필요시 추가 강사 관련 정보 표시 -->
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <p>데이터를 불러오는 중입니다...</p>
                </div>
                <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-end py-6 px-9">
          <button
            type="button"
            class="btn btn-light btn-active-light-primary me-2"
            @click="goBack"
          >
            뒤로
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ApiUrl } from "@/assets/ts/_utils/api";

interface CourseSession {
  id: number;
  sessionNumber: number;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  neededMainInstructors: number;
  neededAssistantInstructors: number;
  // 추가 강사 정보 등이 필요하면 여기에 확장
}

interface CourseData {
  id: number;
  businessId: number;
  businessName: string;
  schoolId: number;
  schoolName: string;
  programId: number;
  programName: string;
  courseName: string;
  description: string;
  startDate: string;
  endDate: string;
  confirmed: boolean;
  status: string;
  remarks: string;
  createdAt: number;
  createdId: number;
  updatedAt: number;
  updatedId: number;
  grade: string;
  classNo: string;
  studentCount: number;
  city: string;
  district: string;
  street: string;
  number: string;
  courseSessions: CourseSession[];
}

export default defineComponent({
  name: "CourseDetail",
  setup() {
    const router = useRouter();
    const courseData = ref<CourseData | null>(null);
    const errorMessage = ref("");

    const fetchCourseData = async () => {
      // localStorage에 저장된 selectedCourseId를 사용합니다.
      const courseId = localStorage.getItem("selectedCourseId");
      if (!courseId) {
        errorMessage.value = "과정 ID를 찾을 수 없습니다.";
        return;
      }

      try {
        const token = localStorage.getItem("token");
        // API URL에 과정 ID를 포함하여 호출
        const response = await axios.get(
          ApiUrl(`/user/courses/${courseId}/course-detailed?status=PROGRESS`),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // 응답 데이터가 { success, code, message, data } 구조이므로 data 프로퍼티 사용
        courseData.value = response.data.data;
      } catch (error) {
        console.error("Error fetching course data:", error);
        errorMessage.value = "과정 정보를 불러오는 데 실패했습니다.";
      }
    };

    const goBack = () => {
      router.back();
    };

    onMounted(() => {
      fetchCourseData();
    });

    return {
      courseData,
      errorMessage,
      goBack,
    };
  },
});
</script>

<style scoped>
.section-title {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.75rem;
  border-bottom: 2px solid #dee2e6;
  padding-bottom: 0.5rem;
}

.table {
  margin-bottom: 1.5rem;
}

.table th,
.table td {
  vertical-align: middle;
}

.table th {
  font-weight: 600;
  background-color: #f8f9fa;
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #dee2e6;
}

.alert {
  margin-top: 1rem;
}

.accordion-button:not(.collapsed) {
  color: #0d6efd;
  background-color: #e7f1ff;
}

.accordion-button {
  font-weight: 600;
}

.card {
  margin-bottom: 1rem;
}

.card-header {
  background-color: #f7f9fc;
  border-bottom: 1px solid #e3e6f0;
}

.card-title {
  margin-bottom: 0;
}

.bi-info-circle,
.bi-journal-bookmark {
  font-size: 1.2rem;
}

@media (max-width: 575.98px) {
  .row .col-md-6,
  .row .col-md-4,
  .row .col-md-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

.card-body strong {
  color: #495057;
}

.accordion-button i {
  color: #0d6efd;
}

.accordion-button.collapsed:hover,
.accordion-button:hover {
  background-color: #f1f3f5;
}

.card-header h5 {
  font-size: 1.1rem;
}

.border-end {
  border-right: 1px solid #dee2e6;
}

.table th.w-25 {
  width: 25%;
}

.table td,
.table th {
  padding: 0.75rem;
}

.card-body {
  padding: 1rem;
}
</style>
