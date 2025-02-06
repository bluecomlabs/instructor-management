<template>
  <div class="dashboard-container">
    <div class="map-wrapper">
      <div
        class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end"
        :class="className"
        :style="{ backgroundColor: bgColor, backgroundImage: `url('${bgImage}')` }"
      >
        <div class="card-header pt-5 position-relative">
          <div class="card-title d-flex flex-column">
            <span class="fs-2hx fw-bold text-black me-2 lh-1 ls-n2">72</span>
            <span class="text-black opacity-50 pt-1 fw-semibold fs-6">{{ description }}</span>
          </div>
          <!-- 지도 펼치는 버튼 -->
          <button class="toggle-button" @click="toggleDetails">
            <span v-if="!showDetails">&#9662;</span>
            <span v-else>&#9652;</span>
          </button>
        </div>

        <!-- 지도 펼치는 영역 바디 (더미 데이터) -->
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

        <!-- 지도 + 카드 데이터 영역 -->
        <div ref="slideContent" class="slide-content-wrapper">
          <div class="slide-content">
            <!-- 지도 영역 -->
            <div class="map-container">
              <!-- SVG 형식의 지도 -->
              <svg
                ref="mapSvg"
                width="auto"
                height="1200"
                viewBox="-1100 100 2000 946"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <defs>
                  <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="white" flood-opacity="5.0" />
                  </filter>
                </defs>
                <!-- 서울과 인천은 클릭 기능 비활성화 -->
                <g
                  v-for="(regionObj, index) in regions"
                  :key="regionObj.id"
                  :ref="el => setRegionRef(el, index)"
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

                <!-- 지도상의 권역명 텍스트 -->
                <g>
                  <text
                    v-for="regionName in uniqueregions"
                    :key="regionName"
                    :x="regionLabelPositions[regionName]?.x"
                    :y="regionLabelPositions[regionName]?.y"
                    :fill="(['1권역','2권역','3권역','4권역','5권역','6권역'].includes(regionName))
                             ? getMapFontColor(regionName)
                             : (regionName === '서울' || regionName === '인천' ? '#808080' : '#fff')"
                    :font-size="(regionName === '서울' || regionName === '인천') ? '38' : (regionName === '4권역' ? '45' : '50')"
                    font-family="'Pretendard-Regular', Arial, sans-serif"
                    font-weight="bold"
                    text-anchor="middle"
                    pointer-events="none"
                    filter="url(#textShadow)"
                  >
                    {{ regionName }}
                  </text>
                </g>
              </svg>

              <!-- 지도 마우스오버 시 툴팁 -->
              <div
                v-if="hoveredRegion"
                class="tooltip"
                :style="{ top: tooltipPosition.y + 'px', left: tooltipPosition.x + 'px' }"
              >
                <strong>{{ hoveredRegion.name }}</strong>
                <p>{{ hoveredRegion.info }}</p>
              </div>
            </div>


            <!-- 카드 영역 (데스크탑 화면) -->
            <div class="region-data-overlay">
              <!-- 뒤로가기 버튼 (세부화면일 때) -->
              <button v-if="selectedItem" class="back-button" @click="goBack">
                &#8592;
              </button>
              <template v-if="!selectedItem">
                <h4 class="intro-title">권역별 교육 진행 현황</h4>
                <!-- CSS Grid를 사용하여 카드 배치 -->
                <div class="region-summary-row">
                  <div
                    class="region-summary-card"
                    v-for="key in regionKeys"
                    :key="key"
                    @click="handleCardClick(key)"
                    :class="{ active: key === selectedItem }"
                  >
                    <h5 :style="{ color: selectedColors[key], fontSize: '16px' }">{{ key }}</h5>
                    <div class="circle-progress-wrapper">
                      <svg class="circle-progress" width="80" height="80">
                        <circle
                          class="progress-bg"
                          stroke="#eee"
                          stroke-width="8"
                          fill="transparent"
                          :r="radius"
                          :cx="center"
                          :cy="center"
                        />
                        <circle
                          class="progress-fg"
                          :stroke="getCircleColor(key)"
                          stroke-width="8"
                          fill="transparent"
                          :r="radius"
                          :cx="center"
                          :cy="center"
                          :stroke-dasharray="circumference"
                          :stroke-dashoffset="getDashOffset(allCardData[key].educationPercent)"
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
                          {{ allCardData[key].educationPercent }}%
                        </text>
                      </svg>
                    </div>
                    <p class="summary-info">도서·벽지: {{ allCardData[key].schools }}</p>
                    <p class="summary-info">50차시: {{ allCardData[key].classes }}</p>
                    <p class="summary-info">특수학급: {{ allCardData[key].students }}</p>
                  </div>
                </div>

                <h4 class="intro-title" style="margin-top: 1rem;">특수항목</h4>
                <div class="region-summary-row" style="margin-top: 0.5rem;">
                  <div
                    class="region-summary-card"
                    v-for="key in specialKeys"
                    :key="key"
                    @click="handleCardClick(key)"
                    :class="{ active: key === selectedItem }"
                  >
                    <!-- 특수 항목은 selectedSpecialColors를 사용 -->
                    <h5 :style="{ color: specialSelectedColors[key], fontSize: '16px' }">{{ key }}</h5>
                    <div class="circle-progress-wrapper">
                      <svg class="circle-progress" width="80" height="80">
                        <circle
                          class="progress-bg"
                          stroke="#eee"
                          stroke-width="8"
                          fill="transparent"
                          :r="radius"
                          :cx="center"
                          :cy="center"
                        />
                        <circle
                          class="progress-fg"
                          :stroke="specialSelectedColors[key]"
                          stroke-width="8"
                          fill="transparent"
                          :r="radius"
                          :cx="center"
                          :cy="center"
                          :stroke-dasharray="circumference"
                          :stroke-dashoffset="getDashOffset(allCardData[key].educationPercent)"
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
                          {{ allCardData[key].educationPercent }}%
                        </text>
                      </svg>
                    </div>
                    <!-- <p class="summary-info">도서·벽지: {{ allCardData[key].schools }}</p>
                    <p class="summary-info">50차시: {{ allCardData[key].classes }}</p>
                    <p class="summary-info">특수학급: {{ allCardData[key].students }}</p> -->
                  </div>
                </div>
              </template>

              <!-- 상세 화면: selectedItem이 있을 때 -->
              <template v-else>
                <!-- 카드 영역에 상단 작은 카드 (권역 / 특수 항목) -->
                <div class="top-row-group">
                  <h5 class="group-title">권역별 세부조회</h5>
                  <div class="top-row">
                    <div
                      class="region-card small"
                      v-for="key in regionKeys"
                      :key="key"
                      @click="handleCardClick(key)"
                      :class="{ active: key === selectedItem }"
                    >
                      <h4 :style="{ color: selectedColors[key], fontSize: '14px' }">{{ key }}</h4>
                      <p>교육: {{ allCardData[key].educationPercent }}%</p>
                    </div>
                  </div>
                </div>
                <div class="top-row-group">
                  <h5 class="group-title">특수 항목별 세부조회</h5>
                  <div class="top-row">
                    <div
                      class="region-card small"
                      v-for="key in specialKeys"
                      :key="key"
                      @click="handleCardClick(key)"
                      :class="{ active: key === selectedItem }"
                    >
                      <h4 :style="{ color: specialSelectedColors[key], fontSize: '14px' }">{{ key }}</h4>
                      <p>교육: {{ allCardData[key].educationPercent }}%</p>
                    </div>
                  </div>
                </div>

                <!-- 권역별 상세 카드 -->
                <transition name="fade">
                  <div v-if="selectedItem && allCardData[selectedItem]" class="region-card main">
                    <h4 :style="{ color: isRegion(selectedItem) ? selectedColors[selectedItem] : specialSelectedColors[selectedItem] }">
                      {{ selectedItem }}
                    </h4>
                    
                    <!-- 진행바 표시(원형그래프대신 막대로 넣음음) -->
                    <div class="region-progress-container">
                      <div class="region-progress-label">
                        교육 진행률: {{ allCardData[selectedItem].educationPercent }}%
                      </div>
                      <div class="region-progress-bar">
                        <div
                          class="region-progress-fill"
                          :style="{
                            width: allCardData[selectedItem].educationPercent + '%',
                            backgroundColor: isRegion(selectedItem)
                              ? selectedColors[selectedItem]
                              : specialSelectedColors[selectedItem]
                          }"
                        ></div>
                      </div>
                    </div>
                    
                    <!-- 권역일 때 자치단체별 상세 데이터 테이블 표시 -->
                    <div v-if="isRegion(selectedItem)">
                      <table class="local-gov-table">
                        <thead>
                          <tr>
                            <th>자치단체</th>
                            <th>학교수</th>
                            <th>학급수</th>
                            <th>학생수</th>
                            <th>도서·벽지</th>
                            <th>50차시</th>
                            <th>특수학급</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in selectedRegionGroup" :key="item.id">
                            <td>{{ item.name }}</td>
                            <td>{{ item.schools }}</td>
                            <td>{{ item.classes }}</td>
                            <td>{{ item.students }}</td>
                            <td>{{ item.sowae }}</td>
                            <td>{{ item.chasi50 }}</td>
                            <td>{{ item.specialClass }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <!-- 하단 정보 표 -->
                    <table class="local-gov-table" style="margin-top:10px;">
                      <thead>
                        <tr>
                          <th>구분</th>
                          <th>수치</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>교육 퍼센트</td>
                          <td>{{ allCardData[selectedItem].educationPercent }}%</td>
                        </tr>
                        <tr>
                          <td>도서·벽지</td>
                          <td>{{ allCardData[selectedItem].schools }}</td>
                        </tr>
                        <tr>
                          <td>50차시</td>
                          <td>{{ allCardData[selectedItem].classes }}</td>
                        </tr>
                        <tr>
                          <td>특수학급</td>
                          <td>{{ allCardData[selectedItem].students }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </transition>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts" src="../../assets/ts/adminDashborad.ts">
</script>

<style src="../../assets/css/adminDashborad.css">
</style>