<template>
  <!--begin::List Widget 2-->
  <div class="card" :class="widgetClasses">
    <!--begin::Header-->
    <div class="card-header border-0">
      <h3 class="card-title fw-bold text-gray-900">권정미 강사님의 업무일지 목록</h3>
      <div class="card-toolbar">
        <!--begin::Menu-->
        <router-link to="BusinessJournalAdd" class="btn btn-light-primary">
          생성하기
        </router-link>
        <button
          type="button"
          class="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
          data-kt-menu-trigger="click"
          data-kt-menu-placement="bottom-end"
          data-kt-menu-flip="top-end"
        >
          <KTIcon icon-name="category" icon-class="fs-2" />
        </button>
        <Dropdown2></Dropdown2>
        <!--end::Menu-->
      </div>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body pt-2">
      <template v-for="(item, index) in list" :key="index">
        <!--begin::Item-->
        <div
          :class="{ 'mb-7': list.length - 1 !== index }"
          class="d-flex align-items-center justify-content-between"
        >
          <!--begin::Left side: Avatar and Text-->
          <div class="d-flex align-items-center">
            <!--begin::Avatar-->
            <!-- <div class="symbol symbol-50px me-5">
              <img :src="item.avatar" alt="" />
            </div> -->
            <!--end::Avatar-->
            <!--begin::Text-->
            <div class="flex-grow-1">
              <a href="#" class="text-gray-900 fw-bold text-hover-primary fs-6">
                {{ item.name }}
              </a>
              <span class="text-muted d-block fw-semibold">
                {{ item.description }}
              </span>
            </div>
            <!--end::Text-->
          </div>
          <!--end::Left side-->
          <!--begin::Right side: Buttons-->
          <div>
            <!-- <router-link to="WorkSituation" class="btn btn-light-primary me-2">
              근무상황부
            </router-link> -->
            <router-link to="BusinessJournal" class="btn btn-light-primary">
              자세히보기
            </router-link>
          </div>
          <!--end::Right side-->
        </div>
        <!--end::Item-->
      </template>
    </div>
    <!--end::Body-->
  </div>
  <!--end::List Widget 2-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref } from "vue";
import Dropdown2 from "@/components/dropdown/Dropdown2.vue";

export default defineComponent({
  name: "kt-widget-2",
  components: {
    Dropdown2,
  },
  props: {
    widgetClasses: String,
  },
  setup() {
    const list = ref([
      {
        avatar: getAssetPath("media/avatars/blank.png"),
        name: "오조봇 실습",
        description: "24.08.09.",
      },
      {
        avatar: getAssetPath("media/avatars/blank.png"),
        name: "어썸봇 실습",
        description: "24.07.09.",
      },
      {
        avatar: getAssetPath("media/avatars/blank.png"),
        name: "오조봇을 활용한 코딩 실습",
        description: "24.06.15.",
      },
      {
        avatar: getAssetPath("media/avatars/blank.png"),
        name: "오조봇 실습",
        description: "24.08.02.",
      },
      {
        avatar: getAssetPath("media/avatars/blank.png"),
        name: "어썸카 실습",
        description: "24.03.09.",
      },
      {
        avatar: getAssetPath("media/avatars/blank.png"),
        name: "오조봇 실습",
        description: "24.05.09.",
      },
      {
        avatar: getAssetPath("media/avatars/blank.png"),
        name: "어썸키트 실습",
        description: "24.08.01.",
      },
      {
        avatar: getAssetPath("media/avatars/blank.png"),
        name: "오조봇 실습",
        description: "24.08.09.",
      },
      {
        avatar: getAssetPath("media/avatars/blank.png"),
        name: "오조봇 실습",
        description: "24.07.09.",
      },
    ]);

    return {
      list,
      getAssetPath,
    };
  },
});
</script>

<style>
.symbol-50px {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}
.mb-7 {
  margin-bottom: 1.75rem;
}
.text-gray-900 {
  color: #212529;
}
.text-hover-primary:hover {
  color: #009ef7;
}
.text-muted {
  color: #6c757d;
}
.d-block {
  display: block;
}
.flex-grow-1 {
  flex-grow: 1;
}
</style>
