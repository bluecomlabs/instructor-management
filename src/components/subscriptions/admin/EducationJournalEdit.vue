<template>
  <div class="card card-flush pt-3 mb-5 mb-xl-10">
    <div class="card-body table-container">
      <!-- 상단 버튼 영역 -->
      <div class="button-container">
        <button type="button" class="btn-delete-attendance" @click="handleDelete">
          삭제
        </button>
        <button type="button" class="btn-edit-attendance" @click="handleSave">
          저장
        </button>
      </div>

      <!-- 상단 큰 제목 + 활동일지 코드 -->
      <table class="attendance-table form-table">
        <tbody>
          <tr>
            <td class="title-cell" colspan="8">
              <h2 class="fw-bold">
                2025 소프트웨어(SW) 미래채움<br />
                <span class="big-title">교육 활동 일지 (수정 폼)</span>
              </h2>
            </td>
          </tr>
          <tr>
            <td class="key-cell">활동일지 코드</td>
            <!-- 읽기 전용 -->
            <td class="value-cell" colspan="7">
              <span class="readonly">{{ sheetId }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 교육구분 / 기관구분 / 지역(시/군) -->
      <table class="attendance-table form-table">
        <tbody>
          <tr>
            <td class="key-cell">교육구분</td>
            <td class="value-cell" colspan="2">
              <!-- 드롭다운 (센터교육, 방문교육, 온라인) -->
              <select v-model="educationType" class="edit-input">
                <option v-for="(opt, idx) in educationTypeOptions" :key="idx" :value="opt">
                  {{ opt }}
                </option>
              </select>
            </td>

            <td class="key-cell">기관구분</td>
            <td class="value-cell" colspan="2">
              <!-- 드롭다운 (일반학교, 도서관, 도서벽지 등) -->
              <select v-model="institutionType" class="edit-input">
                <option v-for="(opt, idx) in institutionTypeOptions" :key="idx" :value="opt">
                  {{ opt }}
                </option>
              </select>
            </td>

            <td class="key-cell">지역(시/군)</td>
            <!-- 읽기 전용 -->
            <td class="value-cell">
              <span class="readonly">{{ regionName }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 기관명 / 학급명 / 교육시작일 / 종료일 / 인원정보 -->
      <table class="attendance-table form-table">
        <tbody>
          <tr>
            <td class="key-cell">기관명</td>
            <td class="value-cell" colspan="3">
              <!-- 드롭다운 (예시: 여러 학교) -->
              <select v-model="institutionName" class="edit-input">
                <option v-for="(opt, idx) in institutionNameOptions" :key="idx" :value="opt">
                  {{ opt }}
                </option>
              </select>
            </td>
            <td class="key-cell">학급명</td>
            <td class="value-cell" colspan="3">
              <!-- 학년/반: 숫자 입력 -->
              <label>학년:
                <input type="number" v-model.number="grade" class="edit-input class-input" />
              </label>
              <label>반:
                <input type="number" v-model.number="className" class="edit-input class-input" />
              </label>
            </td>
          </tr>
          <tr>
            <!-- 교육시작일 / 종료일 -->
            <td class="key-cell">교육시작일</td>
            <td class="value-cell">
              <input type="date" v-model="startDate" class="edit-input" style="width:120px;" />
            </td>
            <td class="key-cell">교육종료일</td>
            <td class="value-cell">
              <input type="date" v-model="endDate" class="edit-input" style="width:120px;" />
            </td>
            <td class="key-cell">교육신청인원</td>
            <td class="value-cell">
              <span class="inline-group">
                <input type="number" v-model.number="appliedCount" class="edit-input" style="width:50px;" />
                <span class="unit">명</span>
              </span>
            </td>
            <td class="key-cell">수료인원<br />남/여</td>
            <td class="value-cell">
              <div class="inline-group">
                총:
                <input type="number" v-model.number="completedCount" class="edit-input" style="width:50px;" />
                <span class="unit">명</span>
              </div>
              <div class="inline-group">
                남:
                <input type="number" v-model.number="completedMale" class="edit-input" style="width:40px;" />
                <span class="unit">명</span>
              </div>
              <div class="inline-group">
                여:
                <input type="number" v-model.number="completedFemale" class="edit-input" style="width:40px;" />
                <span class="unit">명</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 회차/일자/시간/교육명(활동내용) - 읽기 전용 -->
      <table class="attendance-table top-table">
        <thead>
          <tr>
            <th>회차</th>
            <th>일자</th>
            <th>시간</th>
            <th>교육명(활동내용)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(session, index) in sessions" :key="index">
            <td>{{ session.round }}</td>
            <td>{{ session.date }}</td>
            <td>{{ session.time }}</td>
            <td>{{ session.content }}</td>
          </tr>
        </tbody>
      </table>

      <!-- 사진자료: 각 사진마다 로컬 파일 업로드 -->
      <table class="attendance-table form-table">
        <tbody>
          <tr>
            <td class="key-cell" style="width:12.5%;">사진자료</td>
            <!-- 높이 고정 속성 제거하여 내용에 맞게 높이가 조절되도록 함 -->
            <td colspan="7">
              <div class="photo-row">
                <div class="photo-container" v-for="(photo, index) in photos" :key="index">
                  <img :src="photo.src" :alt="photo.alt" class="photo" />
                  <!-- 커스텀 파일 업로드 버튼 -->
                  <label class="custom-file-upload">
                    파일 추가
                    <input type="file" @change="onFileChange($event, index)" style="display: none;" />
                  </label>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 작성일 / 작성자 / (인) -->
      <table class="attendance-table form-table write-info-table">
        <tbody>
          <tr>
            <td class="key-cell" style="width:120px;">작성일</td>
            <td class="value-cell" style="width:200px;">
              <span class="readonly">{{ writeDate }}</span>
            </td>
            <td class="key-cell" style="width:120px;">작성자</td>
            <td class="value-cell" style="width:200px;">
              <span class="readonly">{{ writerName }}</span>
            </td>
            <td class="value-cell" style="width:60px;">(인)</td>
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
  name: "AttendanceSheetEdit",
  data() {
    return {
      // 활동일지 코드 (읽기 전용)
      sheetId: "2025-0001",

      // 드롭다운 옵션들
      educationTypeOptions: ["센터교육", "방문교육", "온라인"],
      institutionTypeOptions: [
        "일반학교",
        "도서관",
        "도서벽지",
        "지역아동센터",
        "특수학급",
        "수원센터",
        "의정부센터",
        "온라인",
        "연계거점",
      ],
      institutionNameOptions: [
        "블루초등학교",
        "그린초등학교",
        "레드초등학교",
        "노랑중학교",
        "오렌지고등학교",
      ],

      // 수정 가능 데이터
      educationType: "센터교육",
      institutionType: "일반학교",
      institutionName: "블루초등학교",
      grade: 3,
      className: 2,

      startDate: "2025-03-05",
      endDate: "2025-03-08",
      appliedCount: 18,
      completedCount: 16,
      completedMale: 8,
      completedFemale: 8,

      // 읽기 전용
      regionName: "수원시",
      writeDate: "2025-03-08",
      writerName: "홍길동",

      // 회차별 교육 내용 (읽기 전용)
      sessions: [
        { round: 1, date: "03/05", time: "09:00~12:10", content: "로봇 코딩 기초" },
        { round: 2, date: "03/06", time: "13:00~16:00", content: "파이썬 기초 이론" },
        { round: 3, date: "03/07", time: "09:00~12:10", content: "파이썬 실습 1" },
        { round: 4, date: "03/08", time: "09:00~12:10", content: "파이썬 실습 2" },
      ],

      // 사진 자료 배열 (초기 기본 사진)
      photos: [
        { src: "../../../../public/test1.jpg", alt: "사진1" },
        { src: "../../../../public/test2.jpg", alt: "사진2" },
      ],
    };
  },
  methods: {
    // 삭제 로직 (예시)
    handleDelete() {
      Swal.fire({
        title: "정말 삭제하시겠습니까?",
        text: "삭제 후 복구할 수 없습니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "네, 삭제합니다",
        cancelButtonText: "아니요",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: "success",
            title: "삭제되었습니다.",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.$router.back();
          });
        }
      });
    },
    // 저장 로직 (예시)
    handleSave() {
      Swal.fire({
        icon: "success",
        title: "수정 내용이 저장되었습니다.",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    // 파일 업로드 시 선택한 파일을 읽어 해당 사진 슬롯에 미리보기 적용
    onFileChange(event: Event, index: number) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            this.photos[index].src = e.target.result as string;
          }
        };
        reader.readAsDataURL(file);
      }
    },
  },
});
</script>

<style scoped>
/* 기본 카드 및 테이블 스타일 */
.card {
  background-color: #fff;
}
.table-container {
  padding: 20px;
}
.attendance-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
.attendance-table th,
.attendance-table td {
  border: 1px solid #ddd;
  padding: 8px 6px;
  vertical-align: middle;
  text-align: center;
  word-wrap: break-word;
}
.attendance-table th {
  background-color: #f2f2f2;
}

/* 폼 영역 스타일 */
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

/* 인풋/셀렉트 및 읽기 전용 스타일 */
.edit-input {
  /* 기본 데스크탑용 width는 50% */
  width: 50%;
  padding: 3px 6px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.2;
}
.class-input {
  /* 학년/반 입력 필드에 동일한 너비 적용 */
  width: 50px;
}
.readonly {
  display: inline-block;
  width: 100%;
  padding: 3px 6px;
  background-color: #e9e9e9;
  border-radius: 4px;
  font-size: 13px;
}

/* 상단 버튼 영역 */
.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 16px;
}
.btn-delete-attendance,
.btn-edit-attendance {
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

/* 사진자료 영역 */
.photo-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: flex-start;
  gap: 16px;
  padding: 8px;
  box-sizing: border-box;
}
.photo-container {
  /* 컨테이너가 부모(td) 너비에 맞춰 100% 사용, 최대 300px까지 */
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;
  padding: 5px;
}
.photo {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: contain;
  border: 1px solid #ccc;
  background-color: #fff;
}

/* 인풋과 단위 텍스트를 한 줄로 표시하는 래퍼 */
.inline-group {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}
.inline-group .unit {
  margin-left: 4px;
}

/* 커스텀 파일 업로드 버튼 */
.custom-file-upload {
  display: inline-block;
  padding: 6px 12px;
  margin-top: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #333;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.custom-file-upload:hover {
  background-color: #f1f1f1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 회차/일자/시간/교육명 열 너비 */
.top-table th:nth-child(1),
.top-table th:nth-child(2) {
  width: 12.5%;
}
.top-table th:nth-child(3) {
  width: 25%;
}
.top-table th:nth-child(4) {
  width: 50%;
}

/* 모바일 반응형 스타일 */
@media (max-width: 768px) {
  .form-table tbody tr {
    display: block;
  }
  .form-table tbody tr td {
    display: block;
    width: 100% !important;
    box-sizing: border-box;
    text-align: left;
    margin-bottom: 8px;
  }
  .form-table tbody tr td:last-child {
    margin-bottom: 0;
  }
  .edit-input {
    width: 100% !important;
  }
  .write-info-table {
    width: 100%;
  }
  .write-info-table tbody tr {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .write-info-table tbody td {
    display: block;
    width: 100% !important;
    box-sizing: border-box;
    text-align: left;
    margin-bottom: 8px;
  }
  .write-info-table tbody td:last-child {
    margin-bottom: 0;
  }
  .photo-row {
    flex-direction: column;
    gap: 8px;
  }
  .photo {
    width: 100%;
    max-width: 300px;
    height: auto;
  }
}
</style>
