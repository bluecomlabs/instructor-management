import { defineComponent, ref, onMounted, nextTick, computed } from "vue";
import regionsData from "../../components/dashboard-default-widgets/regions.json";

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
    // --- 데이터 및 ref 선언 ---
    const regions = ref(regionsData.regions);

    // hover 관련
    const hoveredRegion = ref<any>(null);
    const hoveredGroup = ref<string | null>(null);

    // 선택된 권역의 시·군 목록
    const selectedRegionGroup = ref<any[]>([]);

    // 단일 selectedItem (권역 또는 특수 항목)
    const selectedItem = ref<string | null>(null);

    // 툴팁 위치
    const tooltipPosition = ref({ x: 0, y: 0 });
    // 각 <g> 엘리먼트를 저장할 배열 (타입은 SVGGElement | null)
    const regionGroups = ref<(SVGGElement | null)[]>([]);
    // 각 권역의 중심 좌표를 저장
    const regionCenters = ref<{ [key: number]: { x: number; y: number } }>({});

    // 슬라이드 영역 (데스크탑 전용)
    const showDetails = ref(false);
    const slideContent = ref<HTMLDivElement | null>(null);

    // --- 색상, 데이터 등 기타 설정 ---
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
    const specialSelectedColors: { [key: string]: string } = {
      "도서·벽지": "#FF8A65",
      "50차시": "#8BC34A",
      "특수학급": "#E91E63",
    };
    const mapSelectedFontColors: { [key: string]: string } = {
      "1권역": "#B3D4F0",
      "2권역": "#F7C1B4",
      "3권역": "#FFD4A3",
      "4권역": "#8AD1C3",
      "5권역": "#D5B0F2",
      "6권역": "#A0E0E8",
    };

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

    const specialData: {
      [key: string]: {
        educationPercent: number;
        schools: number;
        classes: number;
        students: number;
      };
    } = {
      "도서·벽지": { educationPercent: 50, schools: 3, classes: 7, students: 150 },
      "50차시": { educationPercent: 90, schools: 2, classes: 5, students: 100 },
      "특수학급": { educationPercent: 75, schools: 4, classes: 10, students: 200 },
    };

    const allCardData = { ...regionData, ...specialData };

    const allCardKeys = [
      "1권역",
      "2권역",
      "3권역",
      "4권역",
      "5권역",
      "6권역",
      "도서·벽지",
      "50차시",
      "특수학급",
    ];

    const regionKeys = computed(() =>
      allCardKeys.filter((key) => key.endsWith("권역"))
    );
    const specialKeys = computed(() =>
      allCardKeys.filter((key) => !key.endsWith("권역"))
    );

    function isRegion(key: string | null): boolean {
      if (!key) return false;
      return key.endsWith("권역");
    }

    const uniqueregions = Array.from(new Set(regions.value.map((r) => r.Region)));
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
      if (![32, 33].includes(regionObj.id) || !regionCenters.value[regionObj.id])
        return "";
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
      if (regionObj.Region === "서울" || regionObj.Region === "인천") return;
      showRegionInfo(regionObj);
      hoveredGroup.value = regionObj.Region;
    }
    function handleMouseLeave(regionObj: any) {
      if (regionObj.Region === "서울" || regionObj.Region === "인천") return;
      hoveredGroup.value = null;
      hideRegionInfo();
    }

    function getRegionColor(regionObj: any) {
      if (regionObj.Region === "서울" || regionObj.Region === "인천")
        return regionObj.color;
      if (selectedItem.value === regionObj.Region)
        return selectedColors[regionObj.Region] || regionObj.color;
      if (hoveredGroup.value === regionObj.Region)
        return hoverColors[regionObj.Region] || regionObj.color;
      return normalColors[regionObj.Region] || regionObj.color;
    }

    function zoomToRegion(regionObj: any) {
      if (regionObj.Region === "인천" || regionObj.Region === "서울") return;
      selectedItem.value = regionObj.Region;
      selectedRegionGroup.value = regions.value.filter(
        (item) => item.Region === regionObj.Region
      );
    }

    function handleCardClick(key: string) {
      selectedItem.value = key;
      if (isRegion(key)) {
        selectedRegionGroup.value = regions.value.filter(
          (item) => item.Region === key
        );
      } else {
        selectedRegionGroup.value = [];
      }
    }

    function goBack() {
      selectedItem.value = null;
      selectedRegionGroup.value = [];
    }

    // 원형 프로그레스 (요약 카드용)
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
    function getMapFontColor(regionName: string) {
      if (selectedItem.value === regionName) {
        return "#2C3E50";
      }
      if (["1권역", "2권역", "3권역", "4권역", "5권역", "6권역"].includes(regionName)) {
        return selectedColors[regionName] || "#000";
      }
      return "#000";
    }

    // --- 핵심: 템플릿에서 ref를 호출할 함수 ---  
    // el은 Element 또는 컴포넌트 인스턴스({ $el: Element }) 또는 null일 수 있음.
    function setRegionRef(
      el: Element | { $el: Element } | null,
      index: number
    ) {
      let actualEl: Element | null = null;
      if (!el) {
        actualEl = null;
      } else if (typeof el === "object" && "$el" in el) {
        actualEl = (el as { $el: Element }).$el;
      } else {
        actualEl = el as Element;
      }
      // 실제 <g> 엘리먼트임을 단언하여 할당합니다.
      regionGroups.value[index] = actualEl as SVGGElement | null;
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
        if (slideContent.value) slideContent.value.style.height = "0";
      });
    });

    return {
      // 데이터, ref, 함수들을 템플릿에 반환
      regions,
      hoveredRegion,
      hoveredGroup,
      selectedItem,
      selectedRegionGroup,
      tooltipPosition,
      regionGroups,
      regionCenters,
      showDetails,
      slideContent,

      normalColors,
      hoverColors,
      selectedColors,
      specialSelectedColors,
      mapSelectedFontColors,

      regionData,
      specialData,
      allCardData,
      allCardKeys,

      regionKeys,
      specialKeys,
      isRegion,
      uniqueregions,
      regionLabelPositions,
      manualOffsets,
      scaleFactors,

      radius,
      center,
      circumference,
      getDashOffset,
      getCircleColor,
      getMapFontColor,

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
      handleCardClick,
      goBack,
      setRegionRef,
    };
  },
});