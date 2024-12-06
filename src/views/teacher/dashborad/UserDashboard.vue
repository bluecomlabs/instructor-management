<template>
  <div>
    <!-- <div v-if="isMobile" class="mobile-buttons">
      <button @click="goToEduAppl" class="btn btn-primary">교육 신청하기</button>
    </div> -->

    <FullCalendar
      ref="calendarRef"
      class="demo-app-calendar"
      :options="calendarOptions"
    ></FullCalendar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import { Modal } from "bootstrap";
import axios from "axios";
import { Tooltip } from "bootstrap";

export default defineComponent({
  name: "calendar-app-1",
  components: {
    FullCalendar,
  },
  setup() {
    const router = useRouter();
    const calendarRef = ref(null);
    const isMobile = ref(window.innerWidth <= 768);

    onBeforeUnmount(() => {
      const tooltipTriggerEls = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerEls.forEach((el) => {
        const tooltipInstance = Tooltip.getInstance(el);
        if (tooltipInstance) {
          tooltipInstance.dispose();
        }
      });
    });

    const newEvent = () => {
      const modal = new Modal(
        document.getElementById("kt_modal_add_event") as Element
      );
      modal.show();
    };

    const goToMyEdu = () => {
      router.push({ name: "user-MyEdu" });
    };

    const goToEduAppl = () => {
      router.push({ name: "user-EduAppl" });
    };

    const calendarOptions = ref({
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      initialDate: new Date(), 
      navLinks: true,
      selectable: true,
      selectMirror: true,
      views: {
        dayGridMonth: { buttonText: "month" },
        timeGridWeek: { buttonText: "week" },
        timeGridDay: { buttonText: "day" },
      },
      editable: false,
      dayMaxEvents: true,
      contentHeight: 900,
      events: [],
      eventClick: (info: any) => {
        const educationId = info.event.extendedProps.educationId;
        if (educationId) {
          localStorage.setItem("selectedProgramId", educationId.toString());
          router.push({ name: "user-MyEduDetails", params: { id: educationId } });
        }
      },
      locale: koLocale,
      eventMouseEnter: (info: any) => {
        const eventEl = info.el;
        const tooltipContent = (info.event.extendedProps.description || "No Description").replace(/\n/g, "<br>");
        
        eventEl.setAttribute('data-bs-toggle', 'tooltip');
        eventEl.setAttribute('data-bs-html', 'true');
        eventEl.setAttribute('title', tooltipContent);

        const tooltip = new Tooltip(eventEl, {
          container: 'body',
          trigger: 'manual',
          placement: 'auto',
          html: true,
        });
        tooltip.show();
        eventEl._tooltip = tooltip;
      },
      eventMouseLeave: (info: any) => {
        const eventEl = info.el;
        if (eventEl._tooltip) {
          eventEl._tooltip.dispose();
          delete eventEl._tooltip;
        }
      },
      datesSet: async (arg: any) => {
        const currentDate = arg.view.currentStart; 
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        await loadEvents(year, month);
      },
    });

    const loadEvents = async (year: number, month: number) => {
      const token = localStorage.getItem("token");
      try {
        const { data } = await axios.get(`http://localhost:8081/api/v1/user/education/user-schedule?month=${month}&year=${year}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const mappedEvents = data.map((item: any) => {
          const startTimeFormatted = item.startTime.endsWith(":00")
            ? item.startTime.slice(0, -3)
            : item.startTime;
          const endTimeFormatted = item.endTime.endsWith(":00")
            ? item.endTime.slice(0, -3)
            : item.endTime;

          let roleKor = "미정";
          if (item.role === "MAIN") {
            roleKor = "주강사";
          } else if (item.role === "ASSISTANT") {
            roleKor = "보조강사";
          }

          return {
            title: `${item.institutionName} - ${item.programName}`,
            start: `${item.classDate}T${item.startTime}`,
            end: `${item.classDate}T${item.endTime}`,
            description: 
              `프로그램명: ${item.programName}\n` +
              `기관명: ${item.institutionName}\n` +
              `수업일자: ${item.classDate}\n` +
              `시작시간: ${startTimeFormatted}\n` +
              `종료시간: ${endTimeFormatted}\n` +
              `역할: ${roleKor}`,
            className: item.role === 'MAIN' 
              ? 'fc-event-success' 
              : item.role === 'ASSISTANT'
                ? 'fc-event-warning'
                : 'fc-event-primary',
            educationId: item.educationId,
          };
        });

        calendarOptions.value.events = mappedEvents;
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
      }
    };


    onMounted(async () => {
      nextTick(() => {
        window.dispatchEvent(new Event("resize"));
      });

      window.addEventListener("resize", () => {
        isMobile.value = window.innerWidth <= 768;
      });

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      await loadEvents(year, month);
    });

    return {
      calendarOptions,
      newEvent,
      goToMyEdu,
      goToEduAppl,
      isMobile,
    };
  },
});
</script>

<style lang="scss">
.fc .fc-button {
  padding: 0.75rem 1.25rem;
  box-shadow: none !important;
  border: 0 !important;
  border-radius: 0.475rem;
  vertical-align: middle;
  font-weight: 500;
  text-transform: capitalize;
}

.mobile-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.mobile-buttons button {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
}
</style>
