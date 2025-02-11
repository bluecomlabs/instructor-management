<template>
  <div class="card card-flush pt-3 mb-5 mb-xl-10">
    <div class="card-body table-container">
      <!-- 상단 버튼 영역 (삭제/수정 예시) -->
      <div class="button-container">
        <button type="button" class="btn-delete-attendance" @click="goToDeleteCheckForm">
          삭제
        </button>
        <button type="button" class="btn-edit-attendance" @click="goToEditCheckForm">
          수정
        </button>
      </div>

      <!-- 상단 제목: 교구 확인서 -->
      <h2 class="form-title">교구 확인서</h2>

      <!-- 상단 메인 테이블 (배정번호, 과정명, 교육기관, 교육원자 등) -->
      <table class="attendance-table form-table">
        <tbody>
          <tr>
            <td class="key-cell">배정번호</td>
            <td class="value-cell">
              {{ assignmentNumber }}
            </td>
            <td class="key-cell">과 정 명</td>
            <td class="value-cell">
              {{ courseName }}
            </td>
            <td class="key-cell">교육기관</td>
            <td class="value-cell">
              {{ educationCenter }}
            </td>
            <td class="key-cell">교육원자</td>
            <td class="value-cell">
              {{ educationOfficer }}
            </td>
          </tr>
          <tr>
            <td class="key-cell">당일차시 / 총차시</td>
            <td class="value-cell">
              {{ todaySession }} / {{ totalSession }}
            </td>
            <td class="key-cell">당일 참여 강사</td>
            <td class="value-cell">
              {{ instructorName }}
            </td>
            <td class="key-cell">예상 참여 인원</td>
            <td class="value-cell">
              {{ expectedParticipants }}명
            </td>
            <td class="key-cell">대여예정 날짜 / 시간</td>
            <td class="value-cell">
              {{ rentalDateTime }}
            </td>
          </tr>
          <tr>
            <td class="key-cell">교구대여자</td>
            <td class="value-cell">
              {{ renterName }}
            </td>
            <td class="key-cell">반납예정자</td>
            <td class="value-cell">
              {{ returnerName }}
            </td>
            <td class="key-cell">반납예정 날짜 / 시간</td>
            <td class="value-cell">
              {{ returnDateTime }}
            </td>
            <td class="key-cell">비고</td>
            <td class="value-cell">
              {{ note }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 대여 교구 목록 및 수량 -->
      <div class="table-title">대여 교구 목록 및 수량</div>
      <table class="attendance-table form-table">
        <thead>
          <tr>
            <th>품 명</th>
            <th>수 량</th>
            <th>품 명</th>
            <th>수 량</th>
          </tr>
        </thead>
        <tbody>
          <!-- 교구 목록을 2개 열씩 묶어 출력 (예시) -->
          <tr v-for="(itemRow, rowIndex) in splitRentalItems" :key="rowIndex">
            <td>{{ itemRow[0]?.name }}</td>
            <td>{{ itemRow[0]?.count }}</td>
            <td>{{ itemRow[1]?.name }}</td>
            <td>{{ itemRow[1]?.count }}</td>
          </tr>
        </tbody>
      </table>
      <div class="footnote">
        * 위 교구 목록에 관한 특이사항/오탈자 등 내용이 있는 경우 아래에 기재하여 주십시오.
      </div>

      <!-- 교구 반납 확인 -->
      <div class="table-title">교구 반납 확인</div>
      <table class="attendance-table form-table">
        <tbody>
          <tr>
            <td class="key-cell">교구 반납자</td>
            <td class="value-cell">{{ returnerNameOnSite }}</td>
            <td class="key-cell">서명</td>
            <td class="value-cell">{{ returnerSignature }}</td>
            <td class="key-cell">교구반납 날짜 / 시간</td>
            <td class="value-cell">{{ actualReturnDateTime }}</td>
          </tr>
          <tr>
            <td class="key-cell">반납 교구 상태 확인</td>
            <td colspan="3" class="value-cell">
              {{ returnCheckResult }}
            </td>
            <td class="key-cell">교구반환 수량<br />지급 대상 여부</td>
            <td class="value-cell">
              {{ isPaymentTarget }}
            </td>
          </tr>
          <tr>
            <td class="key-cell">사업담당자<br />(이름/서명)</td>
            <td colspan="5" class="value-cell">
              {{ managerNameAndSign }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import Swal from "sweetalert2";

/**
 * 교구 확인서 폼 예시 컴포넌트
 */
export default defineComponent({
  name: "EquipmentCheckForm",
  data() {
    return {
      // 상단 폼 필드
      assignmentNumber: "2025-ABC123",
      courseName: "로봇 코딩 과정",
      educationCenter: "미래코딩교육센터",
      educationOfficer: "홍길동",
      todaySession: 1,
      totalSession: 5,
      instructorName: "이몽룡",
      expectedParticipants: 20,
      rentalDateTime: "2025-03-01 09:00",
      renterName: "김교구",
      returnerName: "박반납",
      returnDateTime: "2025-03-05 18:00",
      note: "수업 운영 시 사용 예정",

      // 교구 목록 예시
      rentalItems: [
        { name: "로봇키트 A", count: 10 },
        { name: "아두이노 세트", count: 5 },
        { name: "점퍼선 세트", count: 3 },
        { name: "태블릿", count: 2 },
      ],

      // 교구 반납 확인 정보
      returnerNameOnSite: "박반납",
      returnerSignature: "서명 생략",
      actualReturnDateTime: "2025-03-05 17:50",
      returnCheckResult: "교구 정상 반납, 분실/파손 없음",
      isPaymentTarget: "N",
      managerNameAndSign: "오주관 (서명 생략)",
    };
  },
  computed: {
    /**
     * 2개 열씩 묶어 테이블 행을 만들기 위한 계산 프로퍼티
     * 예: [[item1, item2], [item3, item4], ...]
     */
    splitRentalItems(): Array<Array<{ name: string; count: number }>> {
      const result: Array<Array<{ name: string; count: number }>> = [];
      for (let i = 0; i < this.rentalItems.length; i += 2) {
        result.push(this.rentalItems.slice(i, i + 2));
      }
      return result;
    },
  },
  methods: {
    goToEditCheckForm() {
      // 수정 로직 (예: 수정 페이지 이동)
      Swal.fire("수정 페이지로 이동합니다.", "", "info");
    },
    goToDeleteCheckForm() {
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
          });
        }
      });
    },
  },
});
</script>

<style scoped>
/* 공통 카드/컨테이너 스타일 */
.card {
  background-color: #fff;
}

.table-container {
  padding: 20px;
}

/* 상단 타이틀 */
.form-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
}

/* 버튼 영역 스타일 */
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

/* 테이블 스타일 */
.attendance-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* 고정 레이아웃 */
  margin-bottom: 20px;
}

.attendance-table th,
.attendance-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  vertical-align: middle;
  word-wrap: break-word;
}

.attendance-table th {
  background-color: #f2f2f2;
}

/* key/value 셀 구분 */
.form-table .key-cell {
  background-color: #f0f0f0;
  font-weight: bold;
}

.form-table .value-cell {
  background-color: #fff;
}

/* 소제목 스타일 */
.table-title {
  margin: 16px 0 8px 0;
  font-weight: bold;
  text-align: left;
}

/* 하단 주석(footnote) */
.footnote {
  font-size: 0.875rem;
  color: #666;
  margin-top: 5px;
  margin-bottom: 20px;
}

/* 반응형 대응 (간단 예시) */
@media (max-width: 768px) {
  .attendance-table {
    font-size: 0.9rem;
  }

  .button-container {
    flex-direction: column;
    align-items: flex-end;
  }
}
</style>
