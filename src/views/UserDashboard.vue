<template>
  <div>
    <div v-if="isMobile" class="mobile-buttons">
      <button @click="goToEduAppl" class="btn btn-primary">교육 신청하기</button>
    </div>

    <FullCalendar
      ref="calendarRef"
      class="demo-app-calendar"
      :options="calendarOptions"
    ></FullCalendar>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, nextTick, onMounted } from "vue";
import { useRouter } from "vue-router";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import events, { TODAY } from "@/core/data/events";
import koLocale from "@fullcalendar/core/locales/ko";
import { Modal } from "bootstrap";

export default defineComponent({
  name: "calendar-app-1",
  components: {
    FullCalendar,
  },
  setup() {
    const router = useRouter();
    const calendarRef = ref(null);
    const isMobile = ref(window.innerWidth <= 768);

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

    onMounted(() => {
      nextTick(() => {
        window.dispatchEvent(new Event("resize"));
      });

      window.addEventListener("resize", () => {
        isMobile.value = window.innerWidth <= 768;
      });
    });

    const calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      initialDate: TODAY,
      navLinks: true,
      selectable: true,
      selectMirror: true,
      views: {
        dayGridMonth: { buttonText: "month" },
        timeGridWeek: { buttonText: "week" },
        timeGridDay: { buttonText: "day" },
      },
      editable: false,
      dayMaxEvents: false,
      events: events,
      dateClick: newEvent,
      eventClick: newEvent,
      locale: koLocale,
    };

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
