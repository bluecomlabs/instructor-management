<template>
  <div class="d-flex flex-column flex-xl-row">
    <div class="flex-column flex-lg-row-auto w-100 mb-10">
      <div class="card mb-5 mb-xl-8">
        <div class="card-header border-0">
          <div class="card-title d-flex align-items-center">
            <i class="bi bi-pencil-square me-2"></i>
            <h2 class="fw-bold m-0">과정 수정</h2>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="updateCourse">
            <!-- 코스 기본 정보 -->
            <h3 class="fw-bold section-title">과정 기본 정보</h3>
            <div class="card mb-4">
              <div class="card-body">
                <!-- 프로그램 선택 -->
                <div class="mb-3">
                  <label class="form-label">프로그램</label>
                  <select v-model="selectedProgramId" class="form-select">
                    <option disabled value="">선택하세요</option>
                    <option v-for="option in programOptions" :key="option.id" :value="option.id">
                      {{ option.programName }}
                    </option>
                  </select>
                </div>
                <!-- 교육기관 선택 -->
                <div class="mb-3">
                  <label class="form-label">학교</label>
                  <select v-model="selectedSchoolId" class="form-select">
                    <option disabled value="">선택하세요</option>
                    <option v-for="option in schoolOptions" :key="option.id" :value="option.id">
                      {{ option.name }}
                    </option>
                  </select>
                </div>
                <!-- 코스명 -->
                <div class="mb-3">
                  <label class="form-label">과정명</label>
                  <input v-model="courseName" type="text" class="form-control" placeholder="과정명" />
                </div>
                <!-- 설명 -->
                <div class="mb-3">
                  <label class="form-label">설명</label>
                  <textarea v-model="description" class="form-control" rows="3" placeholder="설명"></textarea>
                </div>
                <!-- 기간 -->
                <div class="row mb-3">
                  <div class="col">
                    <label class="form-label">시작일</label>
                    <input v-model="startDate" type="date" class="form-control" />
                  </div>
                  <div class="col">
                    <label class="form-label">종료일</label>
                    <input v-model="endDate" type="date" class="form-control" />
                  </div>
                </div>
                <!-- 상태 및 비고 -->
                <div class="mb-3">
                  <label class="form-label">상태</label>
                  <select v-model="status" class="form-select">
                    <option disabled value="">선택하세요</option>
                    <option value="OPEN">OPEN</option>
                    <option value="INIT">INIT</option>
                    <option value="CANCEL">CANCEL</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">비고</label>
                  <textarea v-model="remarks" class="form-control" rows="2" placeholder="비고 내용"></textarea>
                </div>
              </div>
            </div>

            <!-- 학급 정보 -->
            <h3 class="fw-bold section-title">학급 정보</h3>
            <div class="card mb-4">
              <div class="card-body">
                <div class="row mb-3">
                  <div class="col">
                    <label class="form-label">학년</label>
                    <input v-model="grade" type="text" class="form-control" placeholder="예: 1학년" />
                  </div>
                  <div class="col">
                    <label class="form-label">반</label>
                    <input v-model="classNo" type="text" class="form-control" placeholder="예: 3반" />
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">학생 수</label>
                  <input v-model.number="studentCount" type="number" class="form-control" placeholder="학생 수" />
                </div>
              </div>
            </div>

            <!-- 세션 정보 (여러 개 추가 가능) -->
            <h3 class="fw-bold section-title">세션 정보</h3>
            <div class="card mb-4" v-for="(session, index) in sessions" :key="index">
              <div class="card-body">
                <h5>세션 {{ index + 1 }}</h5>
                <div class="mb-3">
                  <label class="form-label">일자</label>
                  <input v-model="session.date" type="date" class="form-control" />
                </div>
                <div class="row mb-3">
                  <div class="col">
                    <label class="form-label">시작시간</label>
                    <input v-model="session.startTime" type="time" class="form-control" />
                  </div>
                  <div class="col">
                    <label class="form-label">종료시간</label>
                    <input v-model="session.endTime" type="time" class="form-control" />
                  </div>
                </div>
                <!-- 필요한 강사 수 및 신청된 강사 수 표시 -->
                <div class="row mb-3">
                  <div class="col">
                    <label class="form-label">필요 주강사 수</label>
                    <input v-model.number="session.neededMainInstructors" type="number" class="form-control" placeholder="필요 주강사 수" />
                    <small class="text-muted">신청된 주강사: {{ session.mainInstructorsCount }}</small>
                  </div>
                  <div class="col">
                    <label class="form-label">필요 보조강사 수</label>
                    <input v-model.number="session.neededAssistantInstructors" type="number" class="form-control" placeholder="필요 보조강사 수" />
                    <small class="text-muted">신청된 보조강사: {{ session.assistantInstructorsCount }}</small>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">세션 비고</label>
                  <input v-model="session.remarks" type="text" class="form-control" placeholder="세션 비고" />
                </div>
                <button type="button" class="btn btn-danger" @click="removeSession(index)">세션 삭제</button>
              </div>
            </div>
            <div class="mb-4">
              <button type="button" class="btn btn-secondary" @click="addSession">세션 추가</button>
            </div>

            <!-- 버튼 -->
            <div class="d-flex justify-content-end py-6 px-9">
              <button type="button" class="btn btn-light me-2" @click="goBack">
                뒤로
              </button>
              <button type="submit" class="btn btn-primary">
                수정하기
              </button>
            </div>
          </form>
          <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import Swal from "sweetalert2";
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ApiUrl } from "@/assets/ts/_utils/api";

interface IProgram {
  id: number;
  businessId: number;
  programName: string;
  status: string;
  remarks: string;
}

interface ISchool {
  id: number;
  businessId: number;
  name: string;
}

interface ISession {
  date: string;
  startTime: string;
  endTime: string;
  neededMainInstructors: number;         // 필요한 주강사 수 (수정 가능)
  neededAssistantInstructors: number;      // 필요한 보조강사 수 (수정 가능)
  mainInstructorsCount: number;            // 신청된 주강사 수 (표시 전용)
  assistantInstructorsCount: number;       // 신청된 보조강사 수 (표시 전용)
  status: string;
  remarks: string;
}

interface ICourse {
  id: number;
  businessId: number;
  schoolId: number;
  programId: number;
  courseName: string;
  description: string;
  startDate: string;
  endDate: string;
  confirmed: boolean;
  status: string;
  remarks: string;
  grade: string;
  classNo: string;
  studentCount: number;
  courseSessions: any[]; // 원본 세션 데이터 (추후 매핑)
}

export default defineComponent({
  name: "CourseEdit",
  setup() {
    const router = useRouter();
    const errorMessage = ref("");
    const courseData = ref<ICourse | null>(null);

    // 수정 폼 필드
    const selectedProgramId = ref<number | null>(null);
    const selectedSchoolId = ref<number | null>(null);
    const courseName = ref("");
    const description = ref("");
    const startDate = ref("");
    const endDate = ref("");
    const confirmed = ref(false);
    const status = ref("");
    const remarks = ref("");
    const grade = ref("");
    const classNo = ref("");
    const studentCount = ref<number | null>(null);
    // 세션은 배열로 관리 (등록 시와 동일한 구조)
    const sessions = ref<ISession[]>([]);

    const programOptions = ref<IProgram[]>([]);
    const schoolOptions = ref<ISchool[]>([]);

    // businessId는 로컬스토리지의 user 정보에서 가져옴
    const userStr = localStorage.getItem("user");
    let businessIdValue = 0;
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        businessIdValue = userObj.businessId;
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
        errorMessage.value = "사용자 정보를 불러오는데 실패했습니다.";
      }
    } else {
      errorMessage.value = "사용자 정보가 없습니다.";
    }
    const businessId = ref(businessIdValue);

    // API 호출로 프로그램 옵션 불러오기
    const fetchProgramOptions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(ApiUrl("/admin/programs"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        programOptions.value = response.data.data.content;
      } catch (error) {
        console.error("Error fetching program options:", error);
        errorMessage.value = "프로그램 옵션을 불러오는데 실패했습니다.";
      }
    };

    // API 호출로 학교 옵션 불러오기
    const fetchSchoolOptions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(ApiUrl("/admin/schools"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        schoolOptions.value = response.data.data.content;
      } catch (error) {
        console.error("Error fetching school options:", error);
        errorMessage.value = "학교 옵션을 불러오는데 실패했습니다.";
      }
    };

    // 교육과정 상세 데이터 불러오기 (수정할 데이터 미리 채우기)
    const fetchCourseData = async () => {
      const selectedCourseId = localStorage.getItem("selectedCourseId");
      if (!selectedCourseId) {
        errorMessage.value = "교육과정 ID가 없습니다.";
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(ApiUrl(`/admin/courses/${selectedCourseId}/detailed`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.data;
        courseData.value = data;
        // 기존 데이터를 폼 필드에 할당
        selectedProgramId.value = data.programId;
        selectedSchoolId.value = data.schoolId;
        courseName.value = data.courseName;
        description.value = data.description;
        startDate.value = data.startDate;
        endDate.value = data.endDate;
        confirmed.value = data.confirmed;
        status.value = data.status || "";
        remarks.value = data.remarks || "";
        grade.value = data.grade || "";
        classNo.value = data.classNo || "";
        studentCount.value = data.studentCount;
        // API의 필드명이 courseSessions이므로 이를 sessions 배열로 매핑
        sessions.value = data.courseSessions
          ? data.courseSessions.map((s: any) => ({
              date: s.date,
              startTime: s.startTime.substring(0, 5),
              endTime: s.endTime.substring(0, 5),
              neededMainInstructors: s.neededMainInstructors,         // 필요한 주강사 수
              neededAssistantInstructors: s.neededAssistantInstructors,   // 필요한 보조강사 수
              mainInstructorsCount: s.mainInstructorsCount,               // 신청된 주강사 수
              assistantInstructorsCount: s.assistantInstructorsCount,     // 신청된 보조강사 수
              status: "INIT",
              remarks: s.remarks,
            }))
          : [];
      } catch (error) {
        console.error("Error fetching course data", error);
        errorMessage.value = "교육과정 정보를 불러오는 데 실패했습니다.";
      }
    };

    // 세션 추가 및 삭제
    const addSession = () => {
      sessions.value.push({
        date: "",
        startTime: "",
        endTime: "",
        neededMainInstructors: 0,
        neededAssistantInstructors: 0,
        mainInstructorsCount: 0,
        assistantInstructorsCount: 0,
        status: "INIT",
        remarks: "",
      });
    };

    const removeSession = (index: number) => {
      sessions.value.splice(index, 1);
    };

    // 시간 포맷 보완 함수 (HH:mm이면 HH:mm:ss로)
    const formatTime = (time: string) => {
      return time.length === 5 ? time + ":00" : time;
    };

    // 교육과정 수정 함수 (PUT 요청)
    const updateCourse = async () => {
      if (
        !selectedProgramId.value ||
        !selectedSchoolId.value ||
        !courseName.value.trim() ||
        !startDate.value ||
        !endDate.value ||
        !status.value ||
        !grade.value.trim() ||
        !classNo.value.trim() ||
        studentCount.value === null ||
        sessions.value.some((s) => !s.date || !s.startTime || !s.endTime)
      ) {
        Swal.fire({
          icon: "error",
          title: "입력 오류",
          text: "모든 필드를 올바르게 입력해주세요.",
        });
        return;
      }
      const selectedCourseId = localStorage.getItem("selectedCourseId");
      if (!selectedCourseId) {
        errorMessage.value = "교육과정 ID가 없습니다.";
        return;
      }
      const body = {
        businessId: businessId.value,
        schoolId: selectedSchoolId.value,
        programId: selectedProgramId.value,
        courseName: courseName.value,
        description: description.value,
        startDate: startDate.value,
        endDate: endDate.value,
        confirmed: confirmed.value,
        status: status.value,
        remarks: remarks.value,
        grade: grade.value,
        classNo: classNo.value,
        studentCount: studentCount.value,
        sessions: sessions.value.map((session, idx) => ({
          businessId: businessId.value,
          sessionNumber: idx + 1,
          date: session.date,
          startTime: formatTime(session.startTime),
          endTime: formatTime(session.endTime),
          neededMainInstructors: session.neededMainInstructors,         // 수정된 값 전송
          neededAssistantInstructors: session.neededAssistantInstructors,   // 수정된 값 전송
          status: "INIT",
          remarks: session.remarks,
        })),
      };

      console.log("업데이트 API 호출 URL:", ApiUrl(`/admin/courses/${selectedCourseId}/with-sessions`));
      console.log("전송 데이터:", body);

      try {
        const token = localStorage.getItem("token");
        await axios.put(ApiUrl(`/admin/courses/${selectedCourseId}/with-sessions`), body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "success",
          title: "수정 완료",
          text: "교육과정 정보가 성공적으로 수정되었습니다.",
        }).then(() => {
          router.push({ name: "admin-CourseDetails", params: { id: selectedCourseId } });
        });
      } catch (error) {
        console.error("Error updating course", error);
        Swal.fire({
          icon: "error",
          title: "수정 실패",
          text: "교육과정 정보를 수정하는 데 실패했습니다.",
        });
      }
    };

    const goBack = () => {
      router.back();
    };

    onMounted(() => {
      fetchCourseData();
      fetchProgramOptions();
      fetchSchoolOptions();
    });

    return {
      errorMessage,
      programOptions,
      schoolOptions,
      selectedProgramId,
      selectedSchoolId,
      courseName,
      description,
      startDate,
      endDate,
      confirmed,
      status,
      remarks,
      grade,
      classNo,
      studentCount,
      sessions,
      addSession,
      removeSession,
      updateCourse,
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
.card {
  margin-bottom: 1rem;
}
.card-header {
  background-color: #f7f9fc;
  border-bottom: 1px solid #e3e6f0;
}
.btn {
  min-width: 100px;
}
.alert {
  margin-top: 1rem;
}
</style>
