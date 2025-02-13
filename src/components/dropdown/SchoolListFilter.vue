<template>
  <div
    class="menu menu-sub menu-sub-dropdown w-250px w-md-450px modal-content"
    data-kt-menu="true"
  >
    <div class="px-7 py-5 d-flex justify-content-between align-items-center">
      <div class="fs-5 text-gray-900 fw-bold">학교 정보 필터링</div>
      <button
        ref="closeButton"
        type="button"
        class="btn btn-sm btn-icon btn-light btn-hover-primary"
        data-kt-menu-dismiss="true"
      >
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
    <div class="separator border-gray-200"></div>
    <div class="px-7 py-5">
      <!-- 학교명 입력 -->
      <div class="mb-10">
        <label class="form-label fw-semibold">학교명</label>
        <div>
          <input
            type="text"
            class="form-control form-control-solid"
            placeholder="학교명을 입력해주세요."
            v-model="data.programName"
          />
        </div>
      </div>

      <!-- 권역 선택: 개별 권역 체크박스와 전체권역 체크박스(맨 아래) -->
      <div class="mb-10">
        <label class="form-label fw-semibold">권역 선택</label>
        <div class="d-flex flex-wrap">
          <!-- 개별 권역 체크박스 (1권역 ~ 6권역) -->
          <div
            v-for="zone in allZones"
            :key="zone"
            class="form-check me-3 mb-2"
            style="min-width: 45%;"
          >
            <input
              class="form-check-input"
              type="checkbox"
              :id="zone"
              :checked="isZoneChecked(zone)"
              @change="handleZoneChange(zone, ($event.target as HTMLInputElement).checked)"
              :disabled="data.selectedZones.length === 1 && isZoneChecked(zone)"
            />
            <label
              class="form-check-label"
              :for="zone"
              :style="{ color: zoneColors[zone], fontWeight: 'bold' }"
            >
              {{ zone }}
            </label>
          </div>
          <!-- 전체권역 체크박스 (맨 아래) -->
          <div class="form-check me-3 mb-2" style="min-width: 45%;">
            <input
              class="form-check-input"
              type="checkbox"
              id="전체권역"
              :checked="isAllSelected"
              :disabled="isAllSelected"
              @change="handleAllZoneChange(($event.target as HTMLInputElement).checked)"
            />
            <label
              class="form-check-label"
              for="전체권역"
              style="color: black; font-weight: bold;"
            >
              전체권역
            </label>
          </div>
        </div>
      </div>

      <!-- 지역 선택: 선택된 권역에 해당하는 지역들을 고정 순서대로 표시 -->
      <div class="mb-10" v-if="data.selectedZones.length">
        <label class="form-label fw-semibold">지역 선택</label>
        <div class="dropdown">
          <button
            class="btn btn-secondary dropdown-toggle w-100 text-start"
            type="button"
            id="areaDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            지역을 선택해주세요
          </button>
          <div
            class="dropdown-menu p-2 w-100"
            aria-labelledby="areaDropdown"
            data-bs-auto-close="outside"
            @click.stop
          >
            <div v-for="zone in sortedSelectedZones" :key="zone" class="mb-3">
              <div class="fw-bold mb-1" :style="{ color: zoneColors[zone] }">
                {{ zone }}
              </div>
              <div class="d-flex flex-wrap">
                <div
                  v-for="area in zoneData[zone]"
                  :key="area"
                  class="form-check me-3 mb-2"
                  style="min-width: 45%;"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="zone + '-' + area"
                    :value="area"
                    v-model="data.district"
                  />
                  <label class="form-check-label" :for="zone + '-' + area">
                    {{ area }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 기타 필드들 -->
      <div class="mb-10">
        <label class="form-label fw-semibold">상세주소</label>
        <div>
          <input
            type="text"
            class="form-control form-control-solid"
            placeholder="상세주소를 입력해주세요."
            v-model="data.chapter"
          />
        </div>
      </div>
      <div class="mb-10">
        <label class="form-label fw-semibold">관리자</label>
        <div>
          <input
            type="text"
            class="form-control form-control-solid"
            placeholder="관리자명 입력해주세요."
            v-model="data.grade"
          />
        </div>
      </div>
      <div class="mb-10">
        <label class="form-label fw-semibold">관리자 전화번호 (-제외)</label>
        <div>
          <input
            type="number"
            class="form-control form-control-solid"
            placeholder="관리자 전화번호를 입력해주세요."
            v-model="data.representativeNumber"
          />
        </div>
      </div>
      <div class="mb-10">
        <label class="form-label fw-semibold">날짜</label>
        <div>
          <div class="input-group mx-2">
            <input
              type="date"
              v-model="data.startDate"
              class="form-control"
              placeholder="시작 날짜"
            />
            <span class="input-group-text">~</span>
            <input
              type="date"
              v-model="data.endDate"
              class="form-control"
              placeholder="종료 날짜"
            />
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-end">
        <button
          type="reset"
          class="btn btn-sm btn-light btn-active-light-primary me-2"
          @click="resetForm"
        >
          초기화
        </button>
        <button
          type="submit"
          class="btn btn-sm btn-primary"
          @click="submitForm"
        >
          필터 적용
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, computed } from "vue";
import Swal from "sweetalert2";

interface Filter {
  isConfirmed: string;
  selectedZones: string[]; // 내부 관리용 (최종 필터 데이터에는 포함하지 않음)
  district: string[];
  representativeNumber: string;
  classNumber: string;
  grade: string;
  programName: string;
  chapter: string;
  startDate: string;
  endDate: string;
}

export default defineComponent({
  name: "SchoolListFilter",
  setup() {
    // 고정 순서 배열 (1권역부터 6권역까지)
    const zoneOrder = ["1권역", "2권역", "3권역", "4권역", "5권역", "6권역"];

    // 각 권역별 지역 데이터
    const zoneData: { [key: string]: string[] } = {
      "1권역": ["고양", "동두천", "양주", "연천", "김포", "파주"],
      "2권역": ["의정부", "구리", "남양주", "가평", "포천"],
      "3권역": ["성남", "과천", "하남", "광주", "앙평"],
      "4권역": ["수원", "안양", "부천", "안산", "광명", "시흥", "군포", "의왕"],
      "5권역": ["평택", "오산", "화성"],
      "6권역": ["용인", "이천", "안성", "여주"]
    };

    // 권역별 색상 매핑
    const zoneColors: { [key: string]: string } = {
      "1권역": "#495EA5",
      "2권역": "#F26350",
      "3권역": "#FFA238",
      "4권역": "#379F8C",
      "5권역": "#9B51E0",
      "6권역": "#34B2B9",
    };

    // 모든 개별 권역 목록 (고정 순서 사용)
    const allZones = computed(() => zoneOrder);

    // 모든 지역 목록 (모든 권역의 지역들을 합침)
    const allAreas = computed(() => {
      return Object.values(zoneData).flat();
    });

    // 초기 상태: 모든 권역과 모든 지역 선택
    const data = reactive<Filter>({
      isConfirmed: "",
      selectedZones: [...zoneOrder],
      district: [...allAreas.value],
      representativeNumber: "",
      classNumber: "",
      grade: "",
      programName: "",
      chapter: "",
      startDate: "",
      endDate: "",
    });

    // 전체권역 체크 여부: 모든 개별 권역이 선택되어 있으면 true
    const isAllSelected = computed(() => {
      return data.selectedZones.length === allZones.value.length;
    });

    // 특정 권역이 체크되었는지 여부
    const isZoneChecked = (zone: string) => data.selectedZones.includes(zone);

    // 전체권역 체크박스 클릭 시 (해제 시도는 무시)
    const handleAllZoneChange = (checked: boolean) => {
      if (checked) {
        data.selectedZones = [...allZones.value];
      }
      // 해제 시도는 무시
    };

    // 개별 권역 체크박스 변경 처리
    const handleZoneChange = (zone: string, checked: boolean) => {
      if (checked) {
        if (!data.selectedZones.includes(zone)) {
          data.selectedZones.push(zone);
        }
      } else {
        // 마지막 남은 권역은 해제할 수 없음
        if (data.selectedZones.length === 1 && data.selectedZones.includes(zone)) {
          return;
        }
        data.selectedZones = data.selectedZones.filter((z) => z !== zone);
      }
    };

    // 선택된 권역들을 고정 순서대로 정렬한 computed 프로퍼티
    const sortedSelectedZones = computed(() => {
      return zoneOrder.filter(zone => data.selectedZones.includes(zone));
    });

    return {
      data,
      zoneData,
      allZones,
      isAllSelected,
      isZoneChecked,
      handleAllZoneChange,
      handleZoneChange,
      allAreas,
      sortedSelectedZones,
      zoneColors,
    };
  },
  methods: {
    submitForm() {
      Swal.fire({
        title: "필터를 적용하시겠습니까?",
        text: "작성한 값에 따른 데이터가 출력됩니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "네, 적용합니다",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.isConfirmed) {
          // 선택된 권역에 해당하는 지역 목록을 구합니다.
          const allowedDistricts: string[] = []; // 타입 명시!
          this.data.selectedZones.forEach(zone => {
            if (this.zoneData[zone]) {
              allowedDistricts.push(...this.zoneData[zone]);
            }
          });
          // data.district에 포함된 값 중에서 allowedDistricts에 있는 값만 남깁니다.
          const filteredDistrict = this.data.district.filter(area =>
            allowedDistricts.includes(area)
          );
          // 최종 필터 데이터 구성 (selectedZones 필드는 제외)
          const { selectedZones, ...rest } = this.data;
          const filterData = { ...rest, district: filteredDistrict };
          this.$emit("apply-filter", filterData);
          (this.$refs.closeButton as HTMLElement).click();
        }
      });
    },
    resetForm() {
      Swal.fire({
        title: "필터를 초기화하시겠습니까?",
        text: "필터값이 저장되지 않습니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "네, 초기화합니다",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.isConfirmed) {
          this.data.isConfirmed = "";
          // 초기 상태: 모든 권역과 모든 지역 선택
          this.data.selectedZones = ["1권역", "2권역", "3권역", "4권역", "5권역", "6권역"];
          this.data.district = [...this.allAreas];
          this.data.representativeNumber = "";
          this.data.classNumber = "";
          this.data.grade = "";
          this.data.programName = "";
          this.data.chapter = "";
          this.data.startDate = "";
          this.data.endDate = "";
          const { selectedZones, ...rest } = this.data;
          const filterData = { ...rest, district: [...this.data.district] };
          this.$emit("apply-filter", filterData);
          (this.$refs.closeButton as HTMLElement).click();
        }
      });
    },
  },
});
</script>



<style scoped>
.modal-content {
  height: 60%;
  overflow-y: auto;
}

/* 드롭다운 메뉴 스크롤 처리 */
.dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
}
</style>
