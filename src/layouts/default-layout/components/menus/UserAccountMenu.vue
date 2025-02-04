<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold py-4 fs-6 w-275px"
    data-kt-menu="true"
  >
    <!--begin::Menu item-->
    <div class="menu-item px-3">
      <div class="menu-content d-flex align-items-center px-3">
        <!--begin::Avatar-->
        <div class="symbol symbol-50px me-5">
          <img alt="Logo" :src="getAssetPath('media/avatars/blank.png')" />
        </div>
        <!--end::Avatar-->

        <!--begin::Username-->
        <div class="d-flex flex-column">
          <div class="fw-bold d-flex align-items-center fs-5">
            {{ user.name }}
            <span class="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2"
              >사용자</span
            >
          </div>
          <a href="#" class="fw-semibold text-muted text-hover-primary fs-7"
            >{{ user.email }}</a
          >
        </div>
        <!--end::Username-->
      </div>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <div class="separator my-2"></div>
    <!--end::Menu separator-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <router-link to="MyProfile" class="menu-link px-5">
        마이페이지
      </router-link>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <div class="separator my-2"></div>
    <!--end::Menu separator-->

    <div class="menu-item px-5">
      <a @click="signOut()" class="menu-link px-5"> 로그아웃 </a>
    </div>
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

export default defineComponent({
  name: "kt-user-menu",
  setup() {
    const router = useRouter();
    const store = useAuthStore();

    const user = ref({
      name: '',
      email: ''
    });

    const loadUserData = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        user.value = JSON.parse(storedUser);
      }
    };

    const signOut = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      store.logout();
      router.push({ name: "user-sign-in" });
    };

    loadUserData();
    return {
      signOut,
      user,
      getAssetPath,
    };
  },
});
</script>
