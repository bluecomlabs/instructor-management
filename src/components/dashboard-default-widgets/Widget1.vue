<template>
  <div class="dashboard-container">
    <!-- 지도/데이터 영역 -->
    <div class="map-wrapper">
      <div
        class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end"
        :class="className"
        :style="{ backgroundColor: bgColor, backgroundImage: `url('${bgImage}')` }"
      >
        <!-- 헤더 -->
        <div class="card-header pt-5 position-relative">
          <div class="card-title d-flex flex-column">
            <span class="fs-2hx fw-bold text-black me-2 lh-1 ls-n2">72</span>
            <span class="text-black opacity-50 pt-1 fw-semibold fs-6">
              {{ description }}
            </span>
          </div>
          <button class="toggle-button" @click="toggleDetails">
            <span v-if="!showDetails">&#9662;</span>
            <span v-else>&#9652;</span>
          </button>
        </div>

        <!-- 바 차트 형태의 카드 바디 예시 -->
        <div class="card-body d-flex align-items-end pt-0">
          <div class="d-flex align-items-center flex-column mt-3 w-100">
            <div class="d-flex justify-content-between fw-bold fs-6 text-black opacity-50 w-100 mt-auto mb-2">
              <span>1월 72/100 개의 교육 완료</span>
              <span>72%</span>
            </div>
            <div class="h-8px mx-3 w-100 bg-white bg-opacity-50 rounded" style="background-color: #E0E0E0;">
              <div
                class="rounded h-8px"
                role="progressbar"
                style="background-color: #949494; width: 72%;"
                aria-valuenow="50"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>

        <!-- 지도 + 권역 데이터 슬라이드 영역 -->
        <div ref="slideContent" class="slide-content-wrapper">
          <div class="slide-content">
            <!-- 지도 -->
            <div class="map-container">
              <!-- SVG 지도 -->
              <svg
                ref="mapSvg"
                width="auto"
                height="946"
                viewBox="-1100 100 2000 946"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <g
                  v-for="(regionObj, index) in regions"
                  :key="regionObj.id"
                  :ref="(el) => { regionGroups[index] = el as SVGGElement | null }"
                  @mouseenter="regionObj.Region !== '서울' && regionObj.Region !== '인천' && handleMouseOver(regionObj)"
                  @mousemove="regionObj.Region !== '서울' && regionObj.Region !== '인천' && updateTooltipPosition"
                  @mouseleave="regionObj.Region !== '서울' && regionObj.Region !== '인천' && handleMouseLeave(regionObj)"
                  @click="zoomToRegion(regionObj)"
                  :transform="computeTransform(regionObj)"
                  :style="{ cursor: (regionObj.Region === '서울' || regionObj.Region === '인천') ? 'default' : 'pointer' }"
                  >


                  <path
                    :d="regionObj.d"
                    :fill="getRegionColor(regionObj)"
                    stroke="#fff"
                    stroke-width="1"
                  />
                </g>

                <!-- 권역명 텍스트 -->
                <g>
                  <text
                    v-for="regionName in uniqueregions"
                    :key="regionName"
                    :x="regionLabelPositions[regionName]?.x"
                    :y="regionLabelPositions[regionName]?.y"
                    :fill="(regionName === '서울' || regionName === '인천') ? '#808080' : '#000'"
                    :font-size="(regionName === '서울' || regionName === '인천') ? '38' : '44'"
                    font-family="'Pretendard-Regular', Arial, sans-serif"
                    font-weight="bold"
                    text-anchor="middle"
                    pointer-events="none"
                    :stroke="(regionName === '서울' || regionName === '인천') ? 'none' : '#fff'"
                    :stroke-width="(regionName === '서울' || regionName === '인천') ? 0 : 0.5"
                  >
                    {{ regionName }}
                  </text>
                </g>
              </svg>

              <!-- 마우스오버 툴팁 -->
              <div
                v-if="hoveredRegion"
                class="tooltip"
                :style="{ top: tooltipPosition.y + 'px', left: tooltipPosition.x + 'px' }"
              >
                <strong>{{ hoveredRegion.name }}</strong>
                <p>{{ hoveredRegion.info }}</p>
              </div>

              <!-- 지도 위 오버레이 -->
              <div class="region-data-overlay">
                <!-- (1) 처음 화면 -->
                <template v-if="!selectedRegionName">
                  <h4 class="intro-title">권역별 교육 진행 현황</h4>
                  <div class="region-summary-row">
                    <div
                      class="region-summary-card"
                      v-for="(data, regionName) in regionData"
                      :key="regionName"
                      @click="zoomToRegionByName(String(regionName))"
                      :class="{ active: regionName === selectedRegionName }"
                    >
                      <h5>{{ regionName }}</h5>
                      <div class="circle-progress-wrapper">
                        <!-- ... 원형 프로그레스 ... -->
                        <svg class="circle-progress" width="80" height="80">
                          <!-- 배경 원 -->
                          <circle
                            class="progress-bg"
                            stroke="#eee"
                            stroke-width="8"
                            fill="transparent"
                            :r="radius"
                            :cx="center"
                            :cy="center"
                          />
                          <!-- 진행 원 -->
                          <circle
                            class="progress-fg"
                            :stroke="getCircleColor(String(regionName))"
                            stroke-width="8"
                            fill="transparent"
                            :r="radius"
                            :cx="center"
                            :cy="center"
                            :stroke-dasharray="circumference"
                            :stroke-dashoffset="getDashOffset(data.educationPercent)"
                          />
                          <text
                            x="50%"
                            y="50%"
                            text-anchor="middle"
                            dy=".3em"
                            font-size="16"
                            fill="#333"
                            font-weight="600"
                          >
                            {{ data.educationPercent }}%
                          </text>
                        </svg>
                      </div>
                      <p class="summary-info">학교수: {{ data.schools }}</p>
                      <p class="summary-info">학급수: {{ data.classes }}</p>
                      <p class="summary-info">학생수: {{ data.students }}</p>
                    </div>
                  </div>
                </template>

                <!-- (2) 권역 선택됨 -->
                <template v-else>
                  <!-- 나머지 권역(상단 작은 카드) -->
                  <div class="top-row">
                    <div
                      class="region-card small"
                      v-for="(data, regionName) in regionData"
                      :key="regionName"
                      @click="zoomToRegionByName(String(regionName))"
                      :class="{ active: regionName === selectedRegionName }"
                    >
                      <h4>{{ regionName }}</h4>
                      <p>교육: {{ data.educationPercent }}%</p>
                    </div>
                  </div>

                  <!-- 메인 카드 -->
                  <transition name="fade">
                    <div
                      v-if="regionData[selectedRegionName]"
                      class="region-card main"
                    >
                      <h4>{{ selectedRegionName }}</h4>
                      <ul class="region-list">
                        <li v-for="item in selectedRegionGroup" :key="item.id">
                          <i class="fas fa-map-marker-alt"></i>
                          <strong>{{ item.name }}</strong>
                        </li>
                      </ul>

                      <table class="table region-info-table">
                        <thead>
                          <tr>
                            <th>구분</th>
                            <th>수치</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>교육 퍼센트</td>
                            <td>{{ regionData[selectedRegionName].educationPercent }}%</td>
                          </tr>
                          <tr>
                            <td>학교수</td>
                            <td>{{ regionData[selectedRegionName].schools }}</td>
                          </tr>
                          <tr>
                            <td>학급수</td>
                            <td>{{ regionData[selectedRegionName].classes }}</td>
                          </tr>
                          <tr>
                            <td>학생수</td>
                            <td>{{ regionData[selectedRegionName].students }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </transition>
                </template>
              </div>
              <!-- // region-data-overlay -->
            </div>
            <!-- // map-container -->
          </div>
        </div>
        <!-- // slide-content-wrapper -->
      </div>
      <!-- // card -->
    </div>
    <!-- // map-wrapper -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from "vue";
import regionsData from "./regions.json";

const RADIUS = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default defineComponent({
  name: "DashboardMap",
  props: {
    className: String,
    bgColor: { type: String, default: "#080655" },
    bgImage: String,
    description: { type: String, required: true },
  },
  setup() {
    const regions = ref(regionsData.regions);

    // hover
    const hoveredRegion = ref<any>(null);
    const hoveredGroup = ref<string | null>(null);

    // 선택된 권역
    const selectedRegionName = ref<string | null>(null);
    const selectedRegionGroup = ref<any[]>([]);

    // 툴팁
    const tooltipPosition = ref({ x: 0, y: 0 });
    const regionGroups = ref<(SVGGElement | null)[]>([]);
    const regionCenters = ref<{ [key: number]: { x: number; y: number } }>({});

    // 슬라이드
    const showDetails = ref(false);
    const slideContent = ref<HTMLDivElement | null>(null);

    // 색상
    const normalColors: { [key: string]: string } = {
      "1권역": "#C8D2F0",
      "2권역": "#FFD0CB",
      "3권역": "#FFE7BF",
      "4권역": "#B4E5D8",
      "5권역": "#EBD9FC",
      "6권역": "#D0F7F9",
    };
    const hoverColors: { [key: string]: string } = {
      "1권역": "#9AA8E0",
      "2권역": "#FFA798",
      "3권역": "#FFD07D",
      "4권역": "#82D5C1",
      "5권역": "#D3A9F7",
      "6권역": "#8FDDE5",
    };
    const selectedColors: { [key: string]: string } = {
      "1권역": "#495EA5",
      "2권역": "#F26350",
      "3권역": "#FFA238",
      "4권역": "#379F8C",
      "5권역": "#9B51E0",
      "6권역": "#34B2B9",
    };

    // 권역 데이터
    const regionData: {
      [key: string]: {
        educationPercent: number;
        schools: number;
        classes: number;
        students: number;
      };
    } = {
      "1권역": { educationPercent: 60, schools: 10, classes: 50, students: 1000 },
      "2권역": { educationPercent: 78, schools: 8, classes: 40, students: 800 },
      "3권역": { educationPercent: 50, schools: 12, classes: 60, students: 1200 },
      "4권역": { educationPercent: 90, schools: 5, classes: 25, students: 500 },
      "5권역": { educationPercent: 85, schools: 7, classes: 35, students: 700 },
      "6권역": { educationPercent: 73, schools: 9, classes: 45, students: 900 },
    };

    // 권역명(서울/인천 포함) 중복 제거
    const uniqueregions = Array.from(new Set(regions.value.map(r => r.Region)));

    // 레이블 좌표
    const regionLabelPositions = {
      "1권역": { x: 270, y: 310 },
      "2권역": { x: 500, y: 330 },
      "3권역": { x: 500, y: 580 },
      "4권역": { x: 265, y: 635 },
      "5권역": { x: 300, y: 800 },
      "6권역": { x: 550, y: 775 },
      "서울": { x: 330, y: 520 },
      "인천": { x: 170, y: 550 },
    };

    // 서울/인천 transform
    const manualOffsets = { 32: { x: -262, y: 568 }, 33: { x: -513, y: 205 } };
    const scaleFactors = { 32: 0.284, 33: 1.5 };

    function toggleDetails() {
      showDetails.value = !showDetails.value;
      adjustHeight();
    }
    function adjustHeight() {
      if (!slideContent.value) return;
      slideContent.value.style.height = showDetails.value
        ? slideContent.value.scrollHeight + "px"
        : "0";
    }

    function computeTransform(regionObj: any) {
      if (![32, 33].includes(regionObj.id) || !regionCenters.value[regionObj.id]) {
        return "";
      }
      const center = regionCenters.value[regionObj.id];
      const offset = manualOffsets[regionObj.id] || { x: 0, y: 0 };
      const scale = scaleFactors[regionObj.id] || 1;
      return `translate(${center.x},${center.y}) scale(${scale}) translate(${-center.x + offset.x},${-center.y + offset.y})`;
    }

    function showRegionInfo(regionObj: any) {
      hoveredRegion.value = regionObj;
    }
    function hideRegionInfo() {
      hoveredRegion.value = null;
    }
    function updateTooltipPosition(e: MouseEvent) {
      tooltipPosition.value = { x: e.pageX + 10, y: e.pageY + 10 };
    }

    function handleMouseOver(regionObj: any) {
      if (regionObj.Region === "서울" || regionObj.Region === "인천") {
        return; // 서울과 인천은 hover 이벤트 제외
      }
      showRegionInfo(regionObj);
      hoveredGroup.value = regionObj.Region;
    }
    function handleMouseLeave(regionObj: any) {
      if (regionObj.Region === "서울" || regionObj.Region === "인천") {
        return; // 서울과 인천은 hover 이벤트 제외
      }
      hoveredGroup.value = null;
      hideRegionInfo();
    }


    // 지도 색상 결정
    function getRegionColor(regionObj: any) {
      if (regionObj.Region === "서울" || regionObj.Region === "인천") {
        return regionObj.color;
      }
      if (selectedRegionName.value === regionObj.Region) {
        return selectedColors[regionObj.Region] || regionObj.color;
      }
      if (hoveredGroup.value === regionObj.Region) {
        return hoverColors[regionObj.Region] || regionObj.color;
      }
      return normalColors[regionObj.Region] || regionObj.color;
    }

    function zoomToRegion(regionObj: any) {
      if (regionObj.Region === "인천" || regionObj.Region === "서울") {
        return;
      }
      selectedRegionName.value = regionObj.Region;
      selectedRegionGroup.value = regions.value.filter(
        (item) => item.Region === regionObj.Region
      );
    }
    function zoomToRegionByName(regionName: string) {
      if (regionName === "인천" || regionName === "서울") return;
      selectedRegionName.value = regionName;
      selectedRegionGroup.value = regions.value.filter(
        (item) => item.Region === regionName
      );
    }

    // 원형 프로그레스
    const radius = RADIUS;
    const center = 40;
    const circumference = CIRCUMFERENCE;
    function getDashOffset(percent: number) {
      const progress = percent / 100;
      return circumference - progress * circumference;
    }
    function getCircleColor(regionName: string) {
      return selectedColors[regionName] || "#3b6bd2";
    }


    onMounted(() => {
      nextTick(() => {
        regionGroups.value.forEach((gElement, idx) => {
          if (!gElement) return;
          const path = gElement.querySelector("path");
          if (!path) return;
          const bbox = path.getBBox();
          const regionId = regions.value[idx].id;
          regionCenters.value[regionId] = {
            x: bbox.x + bbox.width / 2,
            y: bbox.y + bbox.height / 2,
          };
        });
        if (slideContent.value) {
          slideContent.value.style.height = "0";
        }
      });
    });

    return {
      regions,
      hoveredRegion,
      hoveredGroup,
      selectedRegionName,
      selectedRegionGroup,
      tooltipPosition,
      regionGroups,
      regionCenters,
      showDetails,
      slideContent,

      // 색상
      normalColors,
      hoverColors,
      selectedColors,

      // 권역 데이터
      regionData,
      uniqueregions,
      regionLabelPositions,
      manualOffsets,
      scaleFactors,

      // 원형 프로그레스
      radius,
      center,
      circumference,
      getDashOffset,
      getCircleColor,

      // 메서드
      toggleDetails,
      adjustHeight,
      computeTransform,
      showRegionInfo,
      hideRegionInfo,
      updateTooltipPosition,
      handleMouseOver,
      handleMouseLeave,
      getRegionColor,
      zoomToRegion,
      zoomToRegionByName,
    };
  },
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');

.dashboard-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  font-family: 'Noto Sans KR', sans-serif;
}

.map-wrapper {
  width: 100%;
  position: relative;
}

.map-container {
  position: relative;
  width: 100%;
  margin: 0 auto;
}

/* 툴팁 */
.tooltip {
  position: absolute;
  background: #fff;
  color: #333;
  border: 1px solid #ccc;
  padding: 8px;
  z-index: 999;
  pointer-events: none;
  transform: translate(-50%, -100%);
  white-space: nowrap;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

/* 슬라이드 열고 닫힘 */
.slide-content-wrapper {
  overflow: hidden;
  transition: height 0.5s ease;
}
.slide-content {
  transform-origin: top;
  will-change: transform, opacity;
  backface-visibility: hidden;
}

.toggle-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666666;
}

/* 지도 위 오버레이 */
.region-data-overlay {
  position: absolute;
  top: 10px;
  left: 1.5%;
  width: 45%; /* 적절히 조정 가능 */
  background-color: rgba(255, 255, 255, 0.9);
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 1000;
}

/* 첫 화면 제목 */
.intro-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

/* 첫 화면: 6개 권역 가로 나열 */
.region-summary-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.region-summary-card {
  flex: 0 0 calc(33.3% - 12px);
  min-width: 180px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fafafa;
  padding: 10px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.region-summary-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.region-summary-card h5 {
  margin: 0 0 8px 0;
  font-weight: 600;
}

/* 원형 프로그레스 */
.circle-progress-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 6px;
}
.circle-progress {
  display: block;
}
.progress-bg {
  stroke-linecap: round;
}
.progress-fg {
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}

/* 간단 요약 텍스트 */
.summary-info {
  margin: 4px 0 0 0;
  font-size: 14px;
}

/* 상단 작은 카드 (두 번째 화면) */
.top-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  margin-bottom: 1rem;
}
.region-card.small {
  width: 130px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fafafa;
  padding: 8px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.region-card.small:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

/* 메인 카드 (선택된 권역) */
.region-card.main {
  border: 2px solid #333;
  padding: 16px;
  background-color: #fff;
  color: #333;
  transition: transform 0.2s ease;
}
.region-card.main h4 {
  margin-bottom: 10px;
  font-weight: 600;
}

/* 지역 목록 (아이콘) */
.region-list {
  margin: 0 0 14px 0;
  padding: 0;
  list-style: none;
}
.region-list li {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 5px 0;
  font-size: 15px;
}
.region-list li i {
  color: #d9534f; /* 붉은 핀 아이콘 */
}

/* 상세 표 */
.region-info-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
.region-info-table thead th {
  background-color: #f3f3f3;
  font-weight: 600;
  text-align: left;
  padding: 8px;
  border-bottom: 2px solid #ddd;
}
.region-info-table tbody td {
  padding: 8px;
  border-bottom: 1px solid #eee;
}
.region-info-table tbody tr:last-child td {
  border-bottom: none;
}

/* 페이드 트랜지션 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.region-summary-card.active,
.region-card.small.active {
  border-color: #444;
  transform: scale(1.03);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
@font-face {
  font-family: 'Pretendard-Regular';
  src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
  font-weight: 600;
  font-style: normal;
}
</style>
