
<template>
   <div class="card card-flush pt-3 mb-5 mb-xl-10">
    <div class="mb-10">
      <div class="d-flex flex-wrap py-5" style="padding: 20px;">
        <div class="flex-equal me-5">
          <table class="table fs-6 fw-semibold gs-0 gy-2 gx-2 m-0">
            <tr>
              <td class="text-gray-500 min-w-175px w-175px">강사명 :</td>
              <td class="text-gray-800 min-w-200px">
                홍길동
              </td>
            </tr>
            <tr>
              <td class="text-gray-500">교육명 :</td>
              <td class="text-gray-800">오조봇 실습</td>
            </tr>
            <tr>
              <td class="text-gray-500">교육차시 :</td>
              <td class="text-gray-800">총 8차시</td>
            </tr>
          </table>
        </div>
        <div class="flex-equal">
          <table class="table fs-6 fw-semibold gs-0 gy-2 gx-2 m-0">
            <tr>
              <td class="text-gray-500 min-w-175px w-175px">
                일시 :
              </td>
              <td class="text-gray-800 min-w-200px">
                  2024.08.01. (목) ~ 2024.08.08 (목) (매주 목요일)
              </td>
            </tr>
            <tr>
              <td class="text-gray-500">신청기관 :</td>
              <td class="text-gray-800">오조봇 실습</td>
            </tr>
            <tr>
              <td class="text-gray-500">학년 :</td>
              <td class="text-gray-800">초등학교 4학년 ~ 초등학교 6학년</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div class="card card-flush pt-3 mb-5 mb-xl-10" style="
    width: 50%;
    margin: 0 auto;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  ">
    <div class="card-header">
      <div class="card-title">
        <h2 class="fw-bold">파일 업로드 및 다운로드</h2>
      </div>
    </div>
    <div class="card-body pt-3">
      <div class="d-flex justify-content-center mb-4">
        <button @click="triggerFileUpload" class="btn btn-light-primary">파일 업로드</button>
        <input ref="fileInput" type="file" @change="handleFileUpload" style="display: none;" accept=".xlsx,.xls,.ppt,.pptx,.pdf,.doc,.docx" />
      </div>
      <div v-if="uploadedFile" class="text-center">
        <p>업로드된 파일: {{ uploadedFile.name }}</p>
        <a :href="uploadedFileUrl || ''" download class="btn btn-light-success">파일 다운로드</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "FileUploadDownload",
  setup() {
    const uploadedFile = ref<File | null>(null);
    const uploadedFileUrl = ref<string | undefined>(undefined);
    const fileInput = ref<HTMLInputElement | null>(null);

    const triggerFileUpload = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    const handleFileUpload = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        uploadedFile.value = file;
        uploadedFileUrl.value = URL.createObjectURL(file);
      }
    };

    return {
      uploadedFile,
      uploadedFileUrl,
      triggerFileUpload,
      handleFileUpload,
      fileInput,
    };
  },
});
</script>

<style>
.card {
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  padding: 0.75rem 1.25rem;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
}

.card-title {
  margin-bottom: 0;
  font-size: 1.25rem;
  font-weight: 500;
}

.card-body {
  padding: 1.25rem;
}

.btn-light-primary {
  background-color: #e7f1ff;
  color: #1a73e8;
  border-color: #d1e5ff;
}

.btn-light-success {
  background-color: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
}
</style>
