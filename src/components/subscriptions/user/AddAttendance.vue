<template>
  <div class="card card-flush pt-3 mb-5 mb-xl-10">
    <div class="card-body table-container">
      <!-- 상단 버튼 영역 -->
      <div class="button-container">
        <button type="button" class="btn-cancel" @click="goToCancelAttendance">취소</button>
        <button type="button" class="btn-save" @click="goToSaveAttendance">저장</button>
      </div>

      <!-- 교육 출석부 정보 (프로그램 정보) 폼 -->
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
          <!-- 프로그램명 및 학교명 (드롭다운) -->
          <tr>
            <td class="key-cell" rowspan="3">프로그램명</td>
            <td class="value-cell" rowspan="3" colspan="4">
              <select class="edit-input"
                      v-model="programName"
                      :class="{'modified': programName !== originalProgramName, 'error': attemptedSave && !programName}">
                <option v-for="option in programOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </td>
            <td class="key-cell" colspan="1">기관명</td>
            <td class="value-cell" colspan="2">
              <select class="edit-input"
                      v-model="institutionName"
                      :class="{'modified': institutionName !== originalInstitutionName, 'error': attemptedSave && !institutionName}">
                <option v-for="option in schoolOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </td>
          </tr>
          <!-- 학년 (숫자 입력) -->
          <tr>
            <td class="key-cell" colspan="1">학년</td>
            <td class="value-cell" colspan="2">
              <input type="number" class="edit-input"
                     v-model.number="grade"
                     :class="{'modified': grade !== originalGrade, 'error': attemptedSave && !grade}" />
            </td>
          </tr>
          <!-- 반 (숫자 입력) -->
          <tr>
            <td class="key-cell" colspan="1">반</td>
            <td class="value-cell" colspan="2">
              <input type="number" class="edit-input"
                     v-model.number="className"
                     :class="{'modified': className !== originalClassName, 'error': attemptedSave && !className}" />
            </td>
          </tr>
          <!-- 교육신청인원, 수료인원, 수료 남/여 (자동 계산, 읽기 전용) -->
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
              <span class="readonly">{{ completedMale }} / {{ completedFemale }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 학생 출석부 테이블 -->
      <table class="attendance-table top-table">
        <thead>
          <tr>
            <th style="width: 43px;">번호</th>
            <th style="width: 120px;">이름</th>
            <th style="width: 60px;">성별</th>
            <th v-for="(date, dIndex) in dates" :key="dIndex" style="width: 59px;">
              {{ date.label }}
            </th>
            <th>비고</th>
            <th style="width: 60px;">삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, idx) in students" :key="idx">
            <td>{{ idx + 1 }}</td>
            <td>
              <input type="text" class="edit-input name-input"
                     v-model="student.name"
                     placeholder="이름"
                     :class="{'modified': student.name !== student.original.name, 'error': attemptedSave && (student.name === '-' || !student.name)}" />
            </td>
            <td>
              <!-- 드롭다운: placeholder 역할 옵션은 disabled, selected, hidden 처리하여 목록에 나타나지 않고 기본 텍스트로만 보입니다. -->
              <select class="dropdown-select"
                      v-model="student.gender"
                      :class="{'modified': student.gender !== student.original.gender, 'error': attemptedSave && !student.gender}">
                <option value="" disabled selected hidden>-</option>
                <option value="남">남</option>
                <option value="여">여</option>
              </select>
            </td>
            <!-- 출석 여부 드롭다운 -->
            <td v-for="(att, aIndex) in student.attendance" :key="aIndex">
              <select class="dropdown-select"
                      v-model="student.attendance[aIndex]"
                      :class="{'modified': student.attendance[aIndex] !== student.original.attendance[aIndex], 'error': attemptedSave && !student.attendance[aIndex]}">
                <option value="" disabled selected hidden>-</option>
                <option value="O">O</option>
                <option value="X">X</option>
              </select>
            </td>
            <td>
              <input type="text" class="edit-input" v-model="student.remark" placeholder="비고" />
            </td>
            <td>
              <button type="button" class="btn-delete" @click="deleteStudent(idx)">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 학생 추가 버튼 -->
      <div class="add-student-container">
        <button type="button" class="btn-add-student" @click="addStudent">학생 추가</button>
      </div>

      <!-- 강사 정보 테이블 (폼 형식 그대로 유지) -->
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
            <td class="value-cell" colspan="3">{{ teacher.name }}</td>
            <td class="value-cell" colspan="3">{{ teacher.signature }}</td>
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
  name: "AttendanceSheet",
  data() {
    const dates = [
      { label: "3/5(화)" },
      { label: "3/6(수)" }
    ];
    // 초기 학생 데이터 (original 필드 포함)
    const initialStudents = [
      { name: "남궁민수", gender: "남", attendance: ["O", "X"], remark: "" },
      { name: "김민수", gender: "남", attendance: ["O", "O"], remark: "우등생" },
      { name: "이수연", gender: "여", attendance: ["X", "O"], remark: "" },
      { name: "홍길동", gender: "남", attendance: ["O", "X"], remark: "" }
    ];
    const students = initialStudents.map(s => ({
      ...s,
      original: { ...s, attendance: [...s.attendance] }
    }));
    const teachers = [
      { role: "주강사", name: "홍길동", signature: "(인)" },
      { role: "보조강사", name: "이상혁", signature: "(인)" },
      { role: "보조강사2", name: "손흥민", signature: "(인)" }
    ];
    return {
      dates,
      students,
      teachers,
      // 프로그램 정보 (드롭다운용 예시 데이터)
      programName: "program1",
      institutionName: "blue",
      grade: 3,
      className: 2,
      originalProgramName: "program1",
      originalInstitutionName: "blue",
      originalGrade: 3,
      originalClassName: 2,
      programOptions: [
        { value: "program1", label: "4차시 파이참과 함께하는 파이썬 코딩" },
        { value: "program2", label: "1차시 자바 기초" }
      ],
      schoolOptions: [
        { value: "blue", label: "수원초등학교" },
        { value: "red", label: "레드초등학교" },
        { value: "green", label: "그린초등학교" }
      ],
      // 저장 버튼 클릭 시 누락된 필드를 강조하기 위한 플래그
      attemptedSave: false
    };
  },
  computed: {
    appliedCount(): number {
      return this.students.length;
    },
    completedCount(): number {
      return this.students.filter(student =>
        student.attendance.every((val: string) => val === "O")
      ).length;
    },
    completedMale(): number {
      return this.students.filter(student =>
        student.gender === "남" && student.attendance.every((val: string) => val === "O")
      ).length;
    },
    completedFemale(): number {
      return this.students.filter(student =>
        student.gender === "여" && student.attendance.every((val: string) => val === "O")
      ).length;
    }
  },
  methods: {
    goToCancelAttendance() {
      Swal.fire({
        title: "정말 취소하시겠습니까?",
        text: "저장되지 않은 내용은 사라집니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "네, 취소합니다",
        cancelButtonText: "아니요"
      }).then((result) => {
        if (result.isConfirmed) {
          this.$router.back();
        }
      });
    },
    goToSaveAttendance() {
      this.attemptedSave = true;
      if (!this.programName || !this.institutionName || !this.grade || !this.className) {
        Swal.fire({
          icon: "error",
          title: "입력 오류",
          text: "프로그램 정보의 모든 필드를 입력해주세요."
        });
        return;
      }
      for (let i = 0; i < this.students.length; i++) {
        const student = this.students[i];
        if (student.name === '-' || !student.name || !student.gender || student.attendance.some((att: string) => !att)) {
          Swal.fire({
            icon: "error",
            title: "입력 오류",
            text: `학생 ${i + 1}의 필수 정보를 모두 입력해주세요.`
          });
          return;
        }
      }
      Swal.fire({
        title: "저장하시겠습니까?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "저장",
        cancelButtonText: "취소"
      }).then((result) => {
        if (result.isConfirmed) {
          this.students.forEach((student) => {
            student.original = {
              name: student.name,
              gender: student.gender,
              attendance: [...student.attendance],
              remark: student.remark
            };
          });
          this.originalProgramName = this.programName;
          this.originalInstitutionName = this.institutionName;
          this.originalGrade = this.grade;
          this.originalClassName = this.className;
          Swal.fire({
            icon: "success",
            title: "저장되었습니다."
          }).then(() => {
            this.$router.back();
          });
        }
      });
    },
    addStudent() {
      const newStudent = {
        name: "-",
        gender: "", // 드롭다운은 빈 문자열이면 placeholder가 보입니다.
        attendance: this.dates.map(() => ""),
        remark: "-",
        original: {
          name: "-",
          gender: "",
          attendance: this.dates.map(() => ""),
          remark: "-"
        }
      };
      this.students.push(newStudent);
    },
    deleteStudent(index: number) {
      this.students.splice(index, 1);
    }
  }
});
</script>

<style scoped>
/* --- 폼 영역 (프로그램 정보) 스타일 --- */
.form-table .key-cell {
  background-color: #f0f0f0;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  text-align: center;
}
.form-table .value-cell {
  background-color: #fff;
  font-family: 'Verdana', sans-serif;
}

/* --- 공통 인풋 필드 스타일 --- */
.edit-input {
  width: 100%;
  padding: 4px 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

/* --- 이름 입력 필드 (넓게) --- */
.name-input {
  width: 100%;
}

/* --- 드롭다운 select 스타일 --- */
.dropdown-select {
  width: 55px;
  padding: 4px 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  /* native 드롭다운 화살표가 보이도록 appearance 관련 속성은 제거함 */
}

/* --- 상단 버튼 영역 스타일 --- */
.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 16px;
}

.btn-cancel,
.btn-save {
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel {
  background-color: #ccc;
  color: #333;
}

.btn-save {
  background-color: #4caf50;
  color: #fff;
}

/* --- 학생 삭제 버튼 스타일 --- */
.btn-delete {
  padding: 4px 8px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  background-color: #e74c3c;
  color: #fff;
  cursor: pointer;
}

/* --- 학생 추가 버튼 스타일 --- */
.add-student-container {
  text-align: right;
  margin: 10px 0;
}

.btn-add-student {
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  background-color: #3498db;
  color: #fff;
  cursor: pointer;
}

/* --- 테이블 공통 스타일 --- */
.attendance-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.attendance-table td,
.attendance-table th {
  border: 1px solid #ddd;
  padding: 8px;
  vertical-align: middle;
}

.attendance-table th {
  background-color: #f2f2f2;
  text-align: center;
}

/* --- 제목 셀 및 강사 타이틀 --- */
.title-cell,
.teacher-title {
  text-align: center;
  background-color: #fafafa;
}

/* --- 읽기 전용 필드 스타일 --- */
.readonly {
  display: inline-block;
  width: 100%;
  padding: 4px 8px;
  background-color: #e9e9e9;
  border-radius: 4px;
  font-size: 14px;
}

/* --- 강사 key 스타일 --- */
.teacher-key {
  background-color: #f0f0f0;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  text-align: center;
}

/* --- 수정된 필드 표시 (modified 클래스) --- */
.modified {
  border-color: #4caf50 !important;
}

/* --- 에러(입력 누락) 필드 표시 --- */
.error {
  border-color: #e74c3c !important;
}
</style>
