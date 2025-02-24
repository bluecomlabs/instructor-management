<template>
  <div class="d-flex flex-column flex-xl-row">
    <div class="flex-column flex-lg-row-auto w-100 mb-10">
      <div class="card mb-5 mb-xl-8">
        <div class="card-body">
          <!-- 교육과정 Details -->
          <div class="card mb-5 mb-xl-10">
            <div class="card-header border-0 cursor-pointer" role="button">
              <div class="card-title m-0 d-flex align-items-center">
                <i class="bi bi-journal-text me-2"></i>
                <h2 class="fw-bold m-0">교육과정 조회</h2>
              </div>
            </div>
            <div class="card-body border-top p-9">
              <div v-if="courseData">
                <!-- 과정 정보 -->
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
                          <th class="bg-light">교육과정명</th>
                          <td>{{ courseData.courseName }}</td>
                        </tr>
                        <tr>
                          <th class="bg-light">사업장</th>
                          <td>{{ courseData.businessName }}</td>
                          <th class="bg-light">교육기관</th>
                          <td>{{ courseData.schoolName }}</td>
                        </tr>
                        <tr>
                          <th class="bg-light">프로그램</th>
                          <td>{{ courseData.programName }}</td>
                          <th class="bg-light">설명</th>
                          <td>{{ courseData.description || '-' }}</td>
                        </tr>
                        <tr>
                          <th class="bg-light">시작일</th>
                          <td>{{ courseData.startDate }}</td>
                          <th class="bg-light">종료일</th>
                          <td>{{ courseData.endDate }}</td>
                        </tr>
                        <tr>
                          <th class="bg-light">승인 여부</th>
                          <td>{{ courseData.confirmed ? '승인' : '미승인' }}</td>
                          <th class="bg-light">상태</th>
                          <td>{{ courseData.status || '-' }}</td>
                        </tr>
                        <tr>
                          <th class="bg-light">비고</th>
                          <td colspan="3">{{ courseData.remarks || '-' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <!-- 세션 정보 -->
                <h3 class="fw-bold section-title" v-if="courseData.courseSessions && courseData.courseSessions.length">세션 정보</h3>
                <div v-if="courseData.courseSessions && courseData.courseSessions.length" class="card mb-4">
                  <div class="card-body p-0">
                    <table class="table table-bordered mb-0">
                      <thead>
                        <tr>
                          <th class="bg-light">세션 번호</th>
                          <th class="bg-light">일자</th>
                          <th class="bg-light">시작시간</th>
                          <th class="bg-light">종료시간</th>
                          <th class="bg-light">주강사 수</th>
                          <th class="bg-light">주강사</th>
                          <th class="bg-light">보조강사 수</th>
                          <th class="bg-light">보조강사</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="session in courseData.courseSessions" :key="session.id">
                          <td>{{ session.sessionNumber }}</td>
                          <td>{{ session.date }}</td>
                          <td>{{ session.startTime }}</td>
                          <td>{{ session.endTime }}</td>
                          <td>{{ session.mainInstructorsCount }}</td>
                          <td>{{ getMainInstructorNames(session) }}</td>
                          <td>{{ session.assistantInstructorsCount }}</td>
                          <td>{{ getAssistantInstructorNames(session) }}</td>
                        </tr>
                      </tbody>
                    </table>
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
        <div class="card-footer d-flex justify-content-end py-6 px-9">
          <button type="button" class="btn btn-light btn-active-light-primary me-2" @click="goBack">
            뒤로
          </button>
          <!-- 수정 버튼 클릭 시 goEdit 함수에서 localStorage에 ID 저장 후 수정 페이지로 이동 -->
          <button type="button" class="btn btn-primary" @click="goEdit">
            수정
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ApiUrl } from "@/assets/ts/_utils/api";

interface IInstructor {
  id: number;
  businessId: number;
  courseSessionId: number;
  instructorId: number;
  instructorName: string;
  affiliation: string | null;
  role: string;
  status: string;
  assignedAt: number | null;
  isPartialAssignment: boolean;
  createdAt: number;
  createdId: number;
  updatedAt: number | null;
  updatedId: number | null;
}

interface ICourseSession {
  id: number;
  businessId: number;
  businessName: string;
  courseId: number;
  sessionNumber: number;
  date: string;
  startTime: string;
  endTime: string;
  mainInstructors: IInstructor[];
  assistantInstructors: IInstructor[];
  mainInstructorsCount: number;
  assistantInstructorsCount: number;
}

interface ICourse {
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
  status: string | null;
  remarks: string | null;
  createdAt: number;
  createdId: number;
  updatedAt: number | null;
  updatedId: number | null;
  courseSessions: ICourseSession[];
}

export default defineComponent({
  name: "CourseDetails",
  setup() {
    const router = useRouter();
    const courseData = ref<ICourse | null>(null);
    const errorMessage = ref('');

    const fetchCourseData = async () => {
      const selectedCourseId = localStorage.getItem('selectedCourseId');
      if (!selectedCourseId) {
        errorMessage.value = '교육과정 ID를 찾을 수 없습니다.';
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<{
          success: boolean;
          code: number;
          message: string;
          data: ICourse;
        }>(
          ApiUrl(`/admin/courses/${selectedCourseId}/detailed`),
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        courseData.value = response.data.data;
      } catch (error) {
        console.error('Error fetching course data:', error);
        errorMessage.value = '교육과정 정보를 불러오는 데 실패했습니다.';
      }
    };

    const getMainInstructorNames = (session: ICourseSession): string => {
      return session.mainInstructors.map(instructor => instructor.instructorName).join(', ');
    };

    const getAssistantInstructorNames = (session: ICourseSession): string => {
      return session.assistantInstructors.map(instructor => instructor.instructorName).join(', ');
    };

    onMounted(() => {
      fetchCourseData();
    });

    const goBack = () => {
      router.push({ name: "admin-CourseList" });
    };

    // 수정 버튼 클릭 시, 리스트 페이지에서 사용하는 방식과 동일하게
    // 선택한 교육과정 ID를 localStorage에 저장하고, 수정 페이지로 이동합니다.
    const goEdit = () => {
  if (courseData.value) {
    localStorage.setItem("selectedCourseId", courseData.value.id.toString());
    router.push({ name: "admin-CouresEdit", params: { id: courseData.value.id } });
  } else {
    errorMessage.value = "교육과정 정보가 로드되지 않았습니다.";
  }
};


    return {
      courseData,
      errorMessage,
      goBack,
      goEdit,
      getMainInstructorNames,
      getAssistantInstructorNames,
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

.bi-journal-text {
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

.card-footer {
  padding: 1rem;
}
</style>
