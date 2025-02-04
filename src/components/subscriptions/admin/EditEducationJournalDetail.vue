<template>
  <div class="card card-flush pt-3 mb-5 mb-xl-10">
    <div class="card-header">
      <div class="card-title">
        <h2 class="fw-bold">교육일지 수정</h2>
      </div>
      <div class="card-toolbar">
        <router-link to="EducationJournal" class="btn btn-light-primary"
          >저장하기</router-link>
      </div>
    </div>
    <div class="card-body pt-3">
      <div class="mb-10">
        <div class="d-flex flex-wrap py-5">
          <div class="flex-equal me-5">
            <table class="table fs-6 fw-semibold gs-0 gy-2 gx-2 m-0">
              <tr>
                <td class="text-gray-500 min-w-175px w-175px">강사명 :</td>
                <td>
                  <input v-model="teacherName" type="text" class="form-control" />
                </td>
              </tr>
              <tr>
                <td class="text-gray-500">교육명 :</td>
                <td>
                  <input v-model="courseName" type="text" class="form-control" />
                </td>
              </tr>
            </table>
          </div>
          <div class="flex-equal">
            <table class="table fs-6 fw-semibold gs-0 gy-2 gx-2 m-0">
              <tr>
                <td class="text-gray-500 min-w-175px w-175px">일시 :</td>
                <td>
                  <input v-model="date" type="date" class="form-control" />
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="mb-0">
        <h5 class="mb-4">교육내용</h5>
        <div class="mb-4">
          <textarea v-model="educationContent" class="form-control" rows="10"></textarea>
        </div>
        <div class="d-flex">
          <div class="image-upload-container me-2">
            <label for="imageUpload1" class="image-upload-label" :style="{ backgroundImage: image1Url ? 'url(' + image1Url + ')' : '' }">
              <input id="imageUpload1" ref="imageInput1" type="file" @change="handleImage1Upload" style="display: none;" />
              <span v-if="!image1Url">이미지 업로드 1</span>
            </label>
          </div>
          <div class="image-upload-container">
            <label for="imageUpload2" class="image-upload-label" :style="{ backgroundImage: image2Url ? 'url(' + image2Url + ')' : '' }">
              <input id="imageUpload2" ref="imageInput2" type="file" @change="handleImage2Upload" style="display: none;" />
              <span v-if="!image2Url">이미지 업로드 2</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "kt-details",
  components: {},
  setup() {
    const teacherName = ref("홍길동");
    const courseName = ref("오조봇 실습");
    const date = ref("2024-08-01");
    const educationContent = ref(`□ 혜인학교 수업을 위한 오조봇 수업 준비
- 수업날짜 : 2024.08.09 (금)
- 수업 주제 : 오조봇 "도전! 볼링왕", "분리수거 하는 똑똑한 오조봇"
- 수업준비
1. 차시별 지도안 작성
2. 활동지 준비 및 출력
3. 수업내용 파악 및 진행순서 확인`);
    const image1Url = ref<string | null>(null);
    const image2Url = ref<string | null>(null);

    const handleImage1Upload = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        image1Url.value = URL.createObjectURL(file);
      }
    };

    const handleImage2Upload = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        image2Url.value = URL.createObjectURL(file);
      }
    };

    const saveJournal = () => {
      console.log("저장된 데이터:", {
        teacherName: teacherName.value,
        courseName: courseName.value,
        date: date.value,
        educationContent: educationContent.value,
        image1Url: image1Url.value,
        image2Url: image2Url.value,
      });
    };

    return {
      teacherName,
      courseName,
      date,
      educationContent,
      image1Url,
      image2Url,
      handleImage1Upload,
      handleImage2Upload,
      saveJournal,
    };
  },
});
</script>

<style>
.table {
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
}
.form-control {
  width: 100%;
}

.image-upload-container {
  width: 50%;
}

.image-upload-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 300px;
  background-color: #f3f6f9;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 2px dashed #ccc;
  cursor: pointer;
  text-align: center;
  color: #888;
  font-size: 16px;
  position: relative;
}

.image-upload-label span {
  display: block;
}

.image-upload-label:hover {
  border-color: #007bff;
}
</style>