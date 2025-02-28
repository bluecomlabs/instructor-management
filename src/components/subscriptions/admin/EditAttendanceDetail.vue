<template>
  <div class="card card-flush pt-3 mb-5 mb-xl-10">
    <div class="card-header">
      <div class="card-title">
        <h2 class="fw-bold">출석부</h2>
      </div>
      <div class="card-toolbar">
        <!-- <button @click="saveAttendance" class="btn btn-light-primary">저장하기</button> -->
        <router-link to="Attendance" class="btn btn-light-primary">저장하기</router-link>
      </div>
    </div>
    <div class="card-body pt-3">
      <div class="mb-10">
        <div class="d-flex flex-wrap py-5">
          <div class="flex-equal me-5">
            <table class="table fs-6 fw-semibold gs-0 gy-2 gx-2 m-0">
              <tr>
                <td class="text-gray-500 min-w-175px w-175px">강사명:</td>
                <td><input v-model="teacherName" type="text" class="form-control" /></td>
              </tr>
              <tr>
                <td class="text-gray-500">교육명:</td>
                <td><input v-model="courseName" type="text" class="form-control" /></td>
              </tr>
            </table>
          </div>
          <div class="flex-equal">
            <table class="table fs-6 fw-semibold gs-0 gy-2 gx-2 m-0">
              <tr>
                <td class="text-gray-500 min-w-175px w-175px">근무기간:</td>
                <td><input v-model="workPeriod" type="text" class="form-control" /></td>
              </tr>
              <tr>
                <td class="text-gray-500">신청기관:</td>
                <td><input v-model="institutionName" type="text" class="form-control" /></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="mb-0">
        <h5 class="mb-4">출석부</h5>
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>번호</th>
                <th>성명</th>
                <th>성별</th>
                <th>학교</th>
                <th>학년</th>
                <th>비고</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, index) in students" :key="index">
                <td>{{ index + 1 }}</td>
                <td><input v-model="student.name" type="text" class="form-control" /></td>
                <td>
                  <select v-model="student.gender" class="form-select">
                    <option value="남자">남자</option>
                    <option value="여자">여자</option>
                  </select>
                </td>
                <td><input v-model="student.school" type="text" class="form-control" /></td>
                <td><input v-model="student.grade" type="text" class="form-control" /></td>
                <td><input v-model="student.remark" type="text" class="form-control" /></td>
                <td>
                  <button @click="removeStudent(index)" class="btn btn-light-danger">-</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button @click="addStudent" class="btn btn-light-primary mt-4">+</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserMenu from "@/layouts/default-layout/components/menus/UserAccountMenu.vue";

export default defineComponent({
  name: "kt-details",
  components: {
    UserMenu,
  },
  data() {
    return {
      teacherName: "홍길동",
      courseName: "오조봇 실습",
      workPeriod: "2024.08.01.(목) ~ 2024.08.06.(화)",
      institutionName: "안산초등학교",
      students: [
        { name: "서서현", gender: "남자", school: "해운대초등학교", grade: "5학년", remark: "" },
        { name: "김민수", gender: "남자", school: "해운대초등학교", grade: "5학년", remark: "우등생" },
        { name: "이수연", gender: "여자", school: "해운대초등학교", grade: "1학년", remark: "" },
      ],
    };
  },
  methods: {
    saveAttendance() {
      console.log("저장된 데이터:", {
        teacherName: this.teacherName,
        courseName: this.courseName,
        workPeriod: this.workPeriod,
        institutionName: this.institutionName,
        students: this.students,
      });
    },
    addStudent() {
      this.students.push({
        name: "",
        gender: "남자",
        school: "",
        grade: "",
        remark: "",
      });
    },
    removeStudent(index: number) {
      this.students.splice(index, 1);
    },
  },
});
</script>

<style>
.table {
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
}
.table-bordered {
  border: 1px solid #dee2e6;
}
.table-bordered th,
.table-bordered td {
  border: 1px solid #dee2e6;
}
.table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
}
.table tbody + tbody {
  border-top: 2px solid #dee2e6;
}
.form-control {
  width: 100%;
}
</style>
