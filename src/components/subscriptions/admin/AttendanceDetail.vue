<template>
  <div class="card card-flush pt-3 mb-5 mb-xl-10">
    <div class="card-body table-container">
      <!-- 상단 버튼 영역 -->
      <div class="button-container">
        <button type="button" class="btn-delete-attendance" @click="goToDeleteAttendance">
          삭제
        </button>
        <button type="button" class="btn-edit-attendance" @click="goToEditAttendance">
          수정
        </button>
      </div>

      <!-- 프로그램/기관 정보 (폼 영역 - 읽기 전용) -->
      <table class="attendance-table form-table">
        <tbody>
          <!-- 제목 영역 -->
          <tr>
            <td class="title-cell" colspan="8">
              <h2 class="fw-bold">
                2025 소프트웨어(SW) 미래채움<br />
                <span class="big-title">교육 출석부</span>
              </h2>
            </td>
          </tr>
          <!-- 출석부 고유 코드 -->
          <tr>
            <td class="key-cell">출석부 코드</td>
            <td class="value-cell" colspan="7">
              <span class="readonly">{{ sheetId }}</span>
            </td>
          </tr>
          <!-- 프로그램명 및 기관명 -->
          <tr>
            <td class="key-cell" rowspan="3">프로그램명</td>
            <td class="value-cell" rowspan="3" colspan="4">
              <span class="readonly">{{ programName }}</span>
            </td>
            <td class="key-cell" colspan="1">기관명</td>
            <td class="value-cell" colspan="2">
              <span class="readonly">{{ institutionName }}</span>
            </td>
          </tr>
          <!-- 학년 -->
          <tr>
            <td class="key-cell" colspan="1">학년</td>
            <td class="value-cell" colspan="2">
              <span class="readonly">{{ grade }}학년</span>
            </td>
          </tr>
          <!-- 반 -->
          <tr>
            <td class="key-cell" colspan="1">반</td>
            <td class="value-cell" colspan="2">
              <span class="readonly">{{ className }}반</span>
            </td>
          </tr>
          <!-- 교육신청/수료 인원 -->
          <tr>
            <td class="key-cell">교육신청인원</td>
            <td class="value-cell" colspan="2">
              <span class="readonly">{{ appliedCount }}명</span>
            </td>
            <td class="key-cell">수료인원</td>
            <td class="value-cell">
              <span class="readonly">{{ completedCount }}명</span>
            </td>
            <td class="key-cell">수료 남/여</td>
            <td class="value-cell" colspan="2">
              <span class="readonly">{{ completedMale }}/{{ completedFemale }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 학생 출석부 (읽기 전용) -->
      <table class="attendance-table top-table">
        <thead>
          <tr>
            <th style="width: 42px;">번호</th>
            <th style="width: 120px;">이름</th>
            <th style="width: 60px;">성별</th>
            <th v-for="(date, dIndex) in dates" :key="dIndex" style="width: 59px;">
              {{ date.label }}
            </th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, idx) in students" :key="student.no">
            <td>{{ idx + 1 }}</td>
            <td><span class="readonly">{{ student.name }}</span></td>
            <td><span class="readonly">{{ student.gender }}</span></td>
            <td v-for="(att, aIndex) in student.attendance" :key="aIndex">
              <span class="readonly">{{ att }}</span>
            </td>
            <td><span class="readonly">{{ student.remark }}</span></td>
          </tr>
        </tbody>
      </table>

      <!-- 강사 정보 (읽기 전용) -->
      <table class="attendance-table">
        <thead>
          <tr>
            <th class="teacher-title" colspan="8">
              <h2 class="fw-bold">강사 정보</h2>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(teacher, index) in teachers" :key="index">
            <td class="key-cell teacher-key" colspan="2">{{ teacher.role }}</td>
            <td class="value-cell" colspan="3">
              <span class="readonly">{{ teacher.name }}</span>
            </td>
            <td class="value-cell" colspan="3">
              <span class="readonly">{{ teacher.signature }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Swal from "sweetalert2";

export default defineComponent({
  name: "AttendanceSheetView",
  data() {
    const dates = [
      { label: "3/5(화)" },
      { label: "3/6(수)" }
    ];

    const students = [
      { no: 1, name: "남궁민수", gender: "남", attendance: ["O", "X"], remark: "" },
      { no: 2, name: "김민수", gender: "남", attendance: ["O", "O"], remark: "우등생" },
      { no: 3, name: "이수연", gender: "여", attendance: ["X", "O"], remark: "" },
      { no: 4, name: "홍길동", gender: "남", attendance: ["O", "X"], remark: "" },
      { no: 5, name: "김민수", gender: "남", attendance: ["O", "O"], remark: "우등생" },
      { no: 6, name: "이수연", gender: "여", attendance: ["X", "O"], remark: "" },
      { no: 7, name: "홍길동", gender: "남", attendance: ["O", "X"], remark: "" },
      { no: 8, name: "김민수", gender: "남", attendance: ["O", "O"], remark: "우등생" },
      { no: 9, name: "이수연", gender: "여", attendance: ["X", "O"], remark: "" },
      { no: 10, name: "홍길동", gender: "남", attendance: ["O", "X"], remark: "" },
      { no: 11, name: "김민수", gender: "남", attendance: ["O", "O"], remark: "우등생" },
      { no: 12, name: "이수연", gender: "여", attendance: ["X", "O"], remark: "" },
      { no: 13, name: "홍길동", gender: "남", attendance: ["O", "X"], remark: "" },
      { no: 14, name: "김민수", gender: "남", attendance: ["O", "O"], remark: "우등생" },
      { no: 15, name: "이수연", gender: "여", attendance: ["X", "O"], remark: "" },
      { no: 16, name: "홍길동", gender: "남", attendance: ["O", "X"], remark: "" },
      { no: 17, name: "김민수", gender: "남", attendance: ["O", "O"], remark: "우등생" },
      { no: 18, name: "김민수", gender: "남", attendance: ["O", "O"], remark: "우등생" }
    ];

    const teachers = [
      { role: "주강사", name: "박강명", signature: "(인)" },
      { role: "보조강사", name: "박강명2", signature: "(인)" },
      { role: "보조강사", name: "박강명3", signature: "(인)" }
    ];

    return {
      dates,
      students,
      teachers,
      sheetId: "2025-0001",
      programName: "4차시 어썸봇과 함께하는 파이썬 코딩",
      institutionName: "블루초등학교",
      grade: 3,
      className: 2,
      appliedCount: 18,
      completedCount: 16,
      completedMale: 8,
      completedFemale: 8
    };
  },
  methods: {
    goToEditAttendance() {
      this.$router.push({ name: "admin-AdminAttendanceEdit" });
    },
    goToDeleteAttendance() {
      Swal.fire({
        title: "정말 삭제하시겠습니까?",
        text: "삭제 후 복구할 수 없습니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "네, 삭제합니다",
        cancelButtonText: "아니요"
      }).then((result) => {
        if (result.isConfirmed) {
          // 실제 API 호출 코드 추가 예정
          Swal.fire({
            icon: "success",
            title: "삭제되었습니다.",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.$router.back();
          });
        }
      });
    }
  }
});
</script>

<style scoped>
/* 기본 카드 및 컨테이너 스타일 */
.card {
  background-color: #fff;
}

.table-container {
  padding: 20px;
}

/* 테이블 및 셀 스타일 - 높이와 패딩을 일관되게 조정 */
.attendance-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.attendance-table th,
.attendance-table td {
  border: 1px solid #ddd;
  padding: 8px 6px;
  vertical-align: middle;
  text-align: center;
}

.attendance-table th {
  background-color: #f2f2f2;
}

/* 폼 영역 (프로그램 정보) 스타일 */
.form-table .key-cell {
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
  font-weight: bold;
  text-align: center;
  padding: 8px 6px;
}

.form-table .value-cell {
  background-color: #fff;
  font-family: Verdana, sans-serif;
  padding: 8px 6px;
}

.title-cell {
  text-align: center;
  background-color: #fafafa;
  padding: 8px 6px;
}

/* 강사 영역 스타일 */
.teacher-title {
  text-align: center;
  background-color: #fafafa;
  padding: 8px 6px;
}

.teacher-key {
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
  font-weight: bold;
  text-align: center;
  padding: 8px 6px;
}

/* 읽기 전용 텍스트 스타일 */
.readonly {
  display: inline-block;
  width: 100%;
  padding: 4px 6px;
  font-size: 14px;
  color: #333;
  box-sizing: border-box;
}

/* 상단 버튼 영역 스타일 */
.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 16px;
}

.btn-delete-attendance,
.btn-edit-attendance,
.btn-cancel,
.btn-save {
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-delete-attendance {
  background-color: #e74c3c;
  color: #fff;
}

.btn-edit-attendance {
  background-color: #4caf50;
  color: #fff;
}

/* (추가) 삭제/추가 버튼 스타일 (조회 페이지에는 사용하지 않더라도) */
.btn-delete,
.btn-add-student {
  padding: 6px 12px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  background-color: #e74c3c;
  color: #fff;
  cursor: pointer;
}

.add-student-container {
  text-align: right;
  margin: 10px 0;
}
</style>
