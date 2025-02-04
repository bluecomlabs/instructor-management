<template>
  <div :class="`card ${cardClasses}`">
    <div class="card-header border-0">
      <div class="card-title">
        <h2>서명 이미지</h2>
      </div>
    </div>
    <div style="display: block; margin-left: 30px; margin-right: auto; text-align: left; padding: 0;" class="card-body py-0">
      <div class="fs-5 fw-semibold text-gray-500 mb-4">
        <p style="color: red;">*서명은 배경을 투명하게 한 PNG,JPG파일만 가능합니다.</p>
        <a style="margin-bottom: 20px;" href="#" class="btn btn-sm btn-light-primary flex-shrink-0"
          >이미지 업로드</a
        >
      </div>
      <div>
        <img :src="getAssetPath('media/misc/image.png')" alt="image" style="width: 30%;" />
      </div>
      <a style="margin-bottom: 20px; margin-top: 40px;" href="#" class="btn btn-sm btn-light-primary flex-shrink-0"
        >저장</a
      >
    </div>
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";

export default defineComponent({
  name: "earnings-card",
  props: {
    cardClasses: String,
  },
  components: {},
  setup() {
    return {
      getAssetPath,
    };
  },
});
</script>
