<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <div class="d-flex align-items-center position-relative my-1">
          <KTIcon
            icon-name="magnifier"
            icon-class="fs-1 position-absolute ms-6"
          />
          <input
            v-model="search"
            @input="searchItems"
            type="text"
            class="form-control form-control-solid w-250px ps-14"
            placeholder="Search Subscriptions"
          />
        </div>
        
      </div>
      <div class="card-title">
      <button tabindex="3" type="button" @click="onAdminLogin" class="menu-link px-3 btn btn-light-primary me-3" style="width: 140px; height: 45px">
        <span class="indicator-label"> 프로그램 등록 </span>
      </button>
      </div>
      <!-- Other parts of the template -->
    </div>

    <div class="card-body pt-0">
      <KTDatatable
        :data="data"
        :header="headerConfig"
        :checkbox-enabled="true"
      >
        <template v-slot:programName="{ row: customer }">
          {{ customer.programName }}
        </template>
        <template v-slot:chapter="{ row: customer }">
          {{ customer.chapter }}
        </template>
        <template v-slot:createdAt="{ row: customer }">
          {{ customer.createdAt }}
        </template>
      </KTDatatable>

      <div class="d-flex justify-content-end mt-4">
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li
              class="page-item"
              :class="{ disabled: currentPage === 0 }"
              @click="onPageChange(0)"
            >
              <a class="page-link" href="#">◀</a>
            </li>
            
            <li
              class="page-item"
              :class="{ disabled: currentPage === 0 }"
              @click="onPageChange(currentPage - 1)"
            >
              <a class="page-link" href="#">◁</a>
            </li>
            
            <li
              class="page-item"
              v-for="page in visiblePages"
              :key="page"
              :class="{ active: page === currentPage + 1 }"
              @click="onPageChange(page - 1)"
            >
              <a class="page-link" href="#">{{ page }}</a>
            </li>
            
            <li
              class="page-item"
              :class="{ disabled: currentPage + 1 === totalPages }"
              @click="onPageChange(currentPage + 1)"
            >
              <a class="page-link" href="#">▷</a>
            </li>

            <li
              class="page-item"
              :class="{ disabled: currentPage + 1 === totalPages }"
              @click="onPageChange(totalPages - 1)"
            >
              <a class="page-link" href="#">▶</a>
            </li>
          </ul>
        </nav>
      </div>


    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue"; 
import axios from "axios";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import { useRouter } from "vue-router";

interface IProgram {
  id: number;
  programName: string;
  chapter: number | null;
  createdAt: number;
}

export default defineComponent({
  name: "kt-program-list",
  components: {
    KTDatatable,
  },
  
  setup() {
    const router = useRouter();
    const data = ref<Array<IProgram>>([]);
    const totalElements = ref<number>(0);
    const totalPages = ref<number>(0);    
    const currentPage = ref<number>(0);   
    const pageSize = ref<number>(10);     
    const search = ref<string>("");

    const headerConfig = ref([
      { columnName: "프로그램명", columnLabel: "programName", sortEnabled: true },
      { columnName: "총 차시", columnLabel: "chapter", sortEnabled: true },
      { columnName: "생성 날짜", columnLabel: "createdAt", sortEnabled: true },
    ]);

    const visiblePages = computed<Array<number>>(() => {
      const range = 2;
      let startPage = Math.max(1, currentPage.value + 1 - range);
      let endPage = Math.min(totalPages.value, currentPage.value + 1 + range);

      if (endPage - startPage < range * 2) {
        if (startPage === 1) {
          endPage = Math.min(totalPages.value, startPage + range * 2);
        } else if (endPage === totalPages.value) {
          startPage = Math.max(1, endPage - range * 2);
        }
      }

      const pages: Array<number> = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    });
    const fetchPrograms = async (page: number = 0) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8081/api/v1/admin/programs?page=${page}&size=${pageSize.value}&search=${search.value}`,
        {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseData = response.data;

        data.value = responseData.content.map((program: IProgram) => ({
          programName: program.programName,
          chapter: program.chapter ? program.chapter : "N/A",  
          createdAt: new Date(program.createdAt * 1000).toLocaleDateString(),
        }));
        
        totalElements.value = responseData.totalElements;
        totalPages.value = responseData.totalPages;
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    onMounted(() => {
      fetchPrograms(currentPage.value);
    });

    const searchItems = () => {
      fetchPrograms(currentPage.value);
    };

    const onPageChange = (page: number) => {
      currentPage.value = page;
      fetchPrograms(page);  
    };
    const onAdminLogin = () => {
      router.push({ name: "admin-ProgramAdd" });
    };
    return {
      search,
      searchItems,
      data,
      headerConfig,
      currentPage,
      totalPages,
      onPageChange,
      visiblePages,
      onAdminLogin
    };
  },
});
</script>
