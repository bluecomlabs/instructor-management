<template>
  <div class="row g-5 g-xl-8">
    <div class="col-xl-12">
      <ListsWidget2 widget-classes="card-xl-stretch mb-xl-8"></ListsWidget2>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ListsWidget1 from "@/components/widgets/lists/Widget1.vue";
import ListsWidget2 from "@/components/widgets/lists/Widget2.vue";
import ListsWidget3 from "@/components/widgets/lists/Widget3.vue";
import ListsWidget4 from "@/components/widgets/lists/Widget4.vue";
import ListsWidget5 from "@/components/widgets/lists/Widget5.vue";
import ListsWidget6 from "@/components/widgets/lists/Widget6.vue";
import ListsWidget7 from "@/components/widgets/lists/UserSummary.vue";
import ListsWidget8 from "@/components/widgets/lists/Widget8.vue";

export default defineComponent({
  name: "widgets-lists",
  components: {
    ListsWidget1,
    ListsWidget2,
    ListsWidget3,
    ListsWidget4,
    ListsWidget5,
    ListsWidget6,
    ListsWidget7,
    ListsWidget8,
  },
});
</script>
