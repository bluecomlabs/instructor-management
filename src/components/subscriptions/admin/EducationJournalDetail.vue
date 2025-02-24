<template>
  <div class="card card-flush pt-3 mb-5 mb-xl-10">
    <div class="card-body table-container">
      <!-- 상단 버튼 영역 -->
      <div class="button-container">
        <button type="button" class="btn-delete-attendance" @click="goToDeleteAttendance">
          삭제
        </button>
        <button type="button" class="btn-edit-attendance" @click="goToEditEducationJournal">
          수정
        </button>
      </div>

      <!-- 상단 큰 제목 + 활동일지 코드 -->
      <table class="attendance-table form-table">
        <tbody>
          <tr>
            <td class="title-cell" colspan="8">
              <h2 class="fw-bold">
                2025 소프트웨어(SW) 미래채움<br />
                <span class="big-title">교육 활동 일지</span>
              </h2>
            </td>
          </tr>
          <tr>
            <td class="key-cell">활동일지 코드</td>
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
              <span class="readonly">{{ educationTypeLabel }}</span>
            </td>

            <td class="key-cell">기관구분</td>
            <td class="value-cell" colspan="2">
              <span class="readonly">{{ institutionTypeLabel }}</span>
            </td>

            <td class="key-cell">지역(시/군)</td>
            <td class="value-cell">
              <span class="readonly">{{ regionName }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 기관명 / 학급명 / 교육기간 / 인원정보 -->
      <table class="attendance-table form-table">
        <tbody>
          <tr>
            <td class="key-cell">기관명</td>
            <td class="value-cell" colspan="3">
              <span class="readonly">{{ institutionName }}</span>
            </td>
            <td class="key-cell">학급명</td>
            <td class="value-cell" colspan="3">
              <span class="readonly">{{ grade }}학년 {{ className }}반</span>
            </td>
          </tr>
          <tr>
            <td class="key-cell">교육기간</td>
            <!-- startDate와 endDate를 하나의 셀에 표시 (colspan=3) -->
            <td class="value-cell" colspan="3">
              <span class="readonly">{{ startDate }} ~ {{ endDate }}</span>
            </td>
            <td class="key-cell">교육신청인원</td>
            <td class="value-cell">
              <span class="readonly">{{ appliedCount }}명</span>
            </td>
            <td class="key-cell">수료인원<br />남/여</td>
            <td class="value-cell">
              <span class="readonly">
                {{ completedCount }}명<br />
                ({{ completedMale }}/{{ completedFemale }})
              </span>
            </td>
          </tr>
        </tbody>
      </table>


      <!-- 회차/일자/시간/교육명(활동내용) -->
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

      <!-- 사진자료 -->
      <table class="attendance-table form-table">
        <tbody>
          <tr>
            <td class="key-cell" style="width:12.5%;">사진자료</td>
            <!-- colspan="7"으로 전체 폭을 사용 -->
            <td style="height:150px;" colspan="7">
              <!-- 가로로 두 장 배치할 영역 -->
              <div class="photo-row">
                <!-- 해상도가 큰 이미지를 넣어도 전체가 보이도록 수정 -->
                <img
                  src="../../../../public/test1.jpg"
                  alt="사진1"
                  class="photo"
                />
                <img
                  src="../../../../public/test2.jpg"
                  alt="사진2"
                  class="photo"
                />
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
            <td class="value-cell" style="width:200px;">{{ writeDate }}</td>
            <td class="key-cell" style="width:120px;">작성자</td>
            <td class="value-cell" style="width:200px;">{{ writerName }}</td>
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
  name: "AttendanceSheetView",
  data() {
    return {
      // 활동일지 코드
      sheetId: "2025-0001",

      // 교육구분, 기관구분: 조회용 단일 텍스트
      educationTypeLabel: "센터교육",
      institutionTypeLabel: "일반학교",
      regionName: "수원시",

      // 기관 및 학급 정보
      institutionName: "블루초등학교",
      grade: 3,
      className: 2,

      // 교육 기간 및 인원정보
      startDate: "2025-00-00",
      endDate: "2025-00-00",
      appliedCount: 18,
      completedCount: 16,
      completedMale: 8,
      completedFemale: 8,

      // 회차별 교육 내용
      sessions: [
        { round: 1, date: "03/05", time: "09:00~12:10", content: "로봇 코딩 기초" },
        { round: 2, date: "03/06", time: "13:00~16:00", content: "파이썬 기초 이론" },
        { round: 3, date: "03/07", time: "09:00~12:10", content: "파이썬 실습 1" },
        { round: 4, date: "03/08", time: "09:00~12:10", content: "파이썬 실습 2" },
      ],

      // 작성 관련
      writeDate: "2025-03-08",
      writerName: "홍길동",
    };
  },
  methods: {
    goToEditEducationJournal() {
      // 수정 페이지로 이동
      this.$router.push({ name: "admin-EditEducationJournal" });
    },
    goToDeleteAttendance() {
      Swal.fire({
        title: "정말 삭제하시겠습니까?",
        text: "삭제 후 복구할 수 없습니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "네, 삭제합니다",
        cancelButtonText: "아니요",
      }).then((result) => {
        if (result.isConfirmed) {
          // 실제 API 호출
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
  },
});
</script>

<style scoped>
/* --- 기존 코드의 스타일 그대로 유지 --- */

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
  /* 고정 레이아웃 적용 */
  table-layout: fixed;
}

.attendance-table th,
.attendance-table td {
  border: 1px solid #ddd;
  padding: 8px 6px;
  vertical-align: middle;
  text-align: center;
  /* 텍스트가 넘칠 경우 자동 줄바꿈 */
  word-wrap: break-word;
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

/* (추가) 삭제/추가 버튼 스타일 (조회 페이지에선 미사용 가능) */
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

/* 사진자료 영역: 부모 컨테이너 */
.photo-row {
  display: flex;
  flex-wrap: wrap;           /* 공간이 부족하면 줄 바꿈 */
  justify-content: center;   /* 가운데 정렬 */
  align-items: center;
  gap: 16px; 
  padding: 8px;
  box-sizing: border-box;
}

/* 이미지 스타일: 반응형이면서 최대 크기 제한 */
.photo {
  display: block;
  width: 100%;         /* 부모 컨테이너의 너비에 맞춰 축소 */
  max-width: 500px;    /* 최대 너비 500px */
  max-height: 300px;   /* 최대 높이 300px */
  height: auto;        /* 비율 유지 */
  object-fit: contain; /* 이미지 비율 유지하며 전체 보이도록 */
  border: 1px solid #ccc;
  background-color: #fff;
}


/* 회차/일자 열을 각각 12.5%씩 (합쳐 25%) */
.top-table th:nth-child(1),
.top-table th:nth-child(2) {
  width: 12.5%;
}

/* 시간 열 25% */
.top-table th:nth-child(3) {
  width: 25%;
}

/* 교육명(활동내용) 열 50% */
.top-table th:nth-child(4) {
  width: 50%;
}
@media (max-width: 768px) {
  .photo-row {
    flex-direction: column;  /* 세로 방향 배치 */
    gap: 8px;                /* 간격 조정 */
  }
  .photo {
    max-width: 100%;  /* 부모의 폭에 맞춰 이미지 크기 조정 */
    width: 100%;      /* 100% 사용하여 꽉 채움 */
    height: auto;     /* 비율 유지 */
  }
 
  .write-info-table {
    width: 100%;
  }
  /* 행을 flex 컨테이너로 변경하여 자식 셀들을 세로로 배치 */
  .write-info-table tbody tr {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  /* 각 셀은 100% 폭을 사용 (인라인 width를 !important로 덮어쓰기) */
  .write-info-table tbody td {
    display: block;
    width: 100% !important;
    box-sizing: border-box;
    text-align: left; /* 필요에 따라 중앙 정렬 대신 왼쪽 정렬 */
    margin-bottom: 8px;
  }
  /* 마지막 셀의 아래 마진 제거 */
  .write-info-table tbody td:last-child {
    margin-bottom: 0;
  } 
}
</style>
