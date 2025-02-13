<template>
  <div class="card card-flush pt-3 mb-5 mb-xl-10">
    <div class="card-body table-container">
      <!-- 상단 버튼 영역 -->
      <div class="button-container">
        <button type="button" class="btn-cancel" @click="goToCancel">취소</button>
        <button type="button" class="btn-save" @click="goToSave">저장</button>
      </div>

      <table class="attendance-table top-table">
        <thead>
          <tr>
            <td class="title-cell" colspan="5">
              <h2 class="fw-bold">
                교육관리 시스템<br />
                <span class="big-title">교육기관 타입별 관리</span>
              </h2>
            </td>
          </tr>
          <tr>
            <th style="width: 43px;">번호</th>
            <th style="width: 60px;">사용사업</th>
            <th style="width: 120px;">이름</th>
            <th>비고</th>
            <th style="width: 60px;">삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(schoolType, idx) in schoolTypes"
            :key="schoolType.id || idx"
            :class="rowClass(schoolType)"
          >
            <td>{{ schoolType.id }}</td>
            <td>
              <input
                type="text"
                class="edit-input"
                v-model="schoolType.businessId"
                placeholder="사용사업"
              />
            </td>
            <td>
              <input
                type="text"
                class="edit-input"
                v-model="schoolType.name"
                placeholder="이름"
              />
            </td>
            <td>
              <input
                type="text"
                class="edit-input"
                v-model="schoolType.description"
                placeholder="비고"
              />
            </td>
            <td>
              <button type="button" class="btn-delete" @click="deleteSchoolType(idx)">
                삭제
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="add-student-container">
        <button type="button" class="btn-add-student" @click="addSchoolType">
          교육기관 추가
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { ApiUrl } from "@/assets/ts/_utils/api";

export default defineComponent({
  name: "SchoolTypesManagement",
  data() {
    return {
      // 각 레코드에 original 값을 추가하여 수정 여부를 판단
      schoolTypes: [] as Array<{
        id: number | string;
        businessId: number | string;
        name: string;
        description: string;
        original?: {
          businessId: number | string;
          name: string;
          description: string;
        } | null;
      }>,
      // 삭제할 항목의 id를 보관
      deletedSchoolTypeIds: [] as Array<number | string>,
      attemptedSave: false,
    };
  },
  mounted() {
    const token = localStorage.getItem("token");
    axios
      .get(ApiUrl("/admin/school-types"), {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.success) {
          // 서버에서 받아온 데이터에 대해 원본 값을 함께 저장
          this.schoolTypes = response.data.data.content.map((item: any) => ({
            id: item.id,
            businessId: item.businessId,
            name: item.name,
            description: item.description,
            original: {
              businessId: item.businessId,
              name: item.name,
              description: item.description,
            },
          }));
        } else {
          Swal.fire({
            icon: "error",
            title: "오류",
            text: response.data.message || "데이터를 불러오지 못했습니다.",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching school types:", error);
        Swal.fire({
          icon: "error",
          title: "오류",
          text: "데이터를 불러오지 못했습니다.",
        });
      });
  },
  methods: {
    // 각 레코드의 상태에 따라 CSS 클래스를 반환
    rowClass(schoolType: any) {
      // 신규 등록: id가 없으면 신규 등록 중
      if (!schoolType.id || schoolType.id === "") {
        return "new-record";
      }
      // 기존 레코드: original 값이 존재하고 값이 변경되었으면 수정 중
      if (schoolType.original) {
        if (
          schoolType.businessId !== schoolType.original.businessId ||
          schoolType.name !== schoolType.original.name ||
          schoolType.description !== schoolType.original.description
        ) {
          return "modified-record";
        }
      }
      return "";
    },
    goToCancel() {
      Swal.fire({
        title: "정말 취소하시겠습니까?",
        text: "저장되지 않은 내용은 사라집니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "네, 취소합니다",
        cancelButtonText: "아니요",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$router.back();
        }
      });
    },
    goToSave() {
      this.attemptedSave = true;
      // 모든 행의 필수 입력값(사용사업, 이름, 비고)이 입력되었는지 확인
      const hasEmptyField = this.schoolTypes.some((st) =>
        !st.businessId.toString().trim() ||
        !st.name.toString().trim() ||
        !st.description.toString().trim()
      );
      if (hasEmptyField) {
        Swal.fire({
          icon: "warning",
          title: "입력 오류",
          text: "모든 폼을 다 입력해야 합니다.",
        });
        return;
      }
      Swal.fire({
        title: "저장하시겠습니까?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "저장",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.isConfirmed) {
          const token = localStorage.getItem("token");
          // 신규 등록: id가 없는 항목
          const newSchoolTypes = this.schoolTypes.filter(
            (st) => !st.id || st.id === ""
          );
          // 수정: id가 있는 항목
          const updatedSchoolTypes = this.schoolTypes.filter(
            (st) => st.id && st.id !== ""
          );
          // 신규 등록 API (POST)
          const newPromises = newSchoolTypes.map((st) =>
            axios.post(
              ApiUrl("/admin/school-types"),
              {
                businessId: st.businessId,
                name: st.name,
                description: st.description,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            )
          );
          // 수정 API (PUT)
          const updatePromises = updatedSchoolTypes.map((st) =>
            axios.put(
              ApiUrl(`/admin/school-types/${st.id}`),
              {
                businessId: st.businessId,
                name: st.name,
                description: st.description,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            )
          );
          // 삭제 API (DELETE)
          const deletionPromises = this.deletedSchoolTypeIds.map((id) =>
            axios.delete(ApiUrl(`/admin/school-types/${id}`), {
              headers: { Authorization: `Bearer ${token}` },
            })
          );

          Promise.all([
            ...newPromises,
            ...updatePromises,
            ...deletionPromises,
          ])
            .then(() => {
              Swal.fire({
                icon: "success",
                title: "저장되었습니다.",
              }).then(() => {
                this.$router.back();
              });
            })
            .catch((error) => {
              console.error("Error saving school types:", error);
              Swal.fire({
                icon: "error",
                title: "오류",
                text: "저장 중 오류가 발생했습니다.",
              });
            });
        }
      });
    },
    addSchoolType() {
      // 신규 항목 추가 시 original은 null로 지정하여 신규임을 표시
      const newSchoolType = {
        id: "",
        businessId: "",
        name: "",
        description: "",
        original: null,
      };
      this.schoolTypes.push(newSchoolType);
    },
    deleteSchoolType(index: number) {
      const item = this.schoolTypes[index];
      if (item.id && item.id !== "") {
        this.deletedSchoolTypeIds.push(item.id);
      }
      this.schoolTypes.splice(index, 1);
    },
  },
});
</script>

<style scoped>
.edit-input {
  width: 100%;
  padding: 4px 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}
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
.btn-delete {
  padding: 4px 8px;
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
.btn-add-student {
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  background-color: #3498db;
  color: #fff;
  cursor: pointer;
}
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
.title-cell {
  text-align: center;
  background-color: #fafafa;
}
/* 신규 등록 중인 레코드: 연한 녹색 선 테두리 */
tr.new-record td {
  border: 2px solid #90ee90 !important;
}
/* 수정 중인 레코드: 연한 파란색 선 테두리 */
tr.modified-record td {
  border: 2px solid #add8e6 !important;
}
</style>
