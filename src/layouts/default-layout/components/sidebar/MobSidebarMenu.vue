<template>
  <!--begin::sidebar menu-->
  <div class="app-sidebar-menu overflow-hidden flex-column-fluid d-lg-none sidebar-custom">
    <!--begin::Menu wrapper-->
    <div class="menu-header-attribute">
      <img class="logo-img" src="/logo.png">
    </div>
    <div
      id="kt_app_sidebar_menu_wrapper"
      class="app-sidebar-wrapper hover-scroll-overlay-y my-5"
      data-kt-scroll="true"
      data-kt-scroll-activate="true"
      data-kt-scroll-max-height="auto"
      data-kt-scroll-dependencies="#kt_app_sidebar_logo, #kt_app_sidebar_footer"
      data-kt-scroll-wrappers="#kt_app_sidebar_menu"
      data-kt-scroll-offset="5px"
      data-kt-scroll-save-state="true"
    >
      <!--begin::Menu-->
      <div
        id="#kt_app_sidebar_menu"
        class="menu menu-column menu-rounded menu-sub-indention px-3"
        data-kt-menu="true"
      >
        <template v-for="(item, i) in activeMenuConfig" :key="i">
          <div v-if="item.heading" class="menu-item pt-5" @click="toggleDiv(`arrow-${i}`); toggleMenu(`menu-${i}`)">
            <div class="menu-content">
              <span class="menu-heading fw-bold text-uppercase fs-7 menu-heading-attribute">
                {{ translate(item.heading) }} 
                <div 
                  id="arrow-box"
                  :style="{ transform: arrowTransform(`arrow-${i}`).value }" 
                >
                </div>
              </span>
            </div>
          </div>
          <template v-for="(menuItem, j) in item.pages" :key="j">
            <template v-if="menuItem.heading">
              <div 
                class="menu-item"
                v-if="activeMenus[`menu-${i}`]"
              >
                <router-link
                  v-if="menuItem.route"
                  class="menu-link show-menu-bar"
                  active-class="active"
                  :to="menuItem.route"
                >
                  <span
                    v-if="menuItem.keenthemesIcon || menuItem.bootstrapIcon"
                    class="menu-icon"
                  >
                    <i
                      v-if="sidebarMenuIcons === 'bootstrap'"
                      :class="menuItem.bootstrapIcon"
                      class="bi fs-3"
                    ></i>
                    <KTIcon
                      v-else-if="sidebarMenuIcons === 'keenthemes'"
                      :icon-name="menuItem.keenthemesIcon"
                      icon-class="fs-2"
                    />
                  </span>
                  <span class="menu-title menu-title-attribute">{{
                    translate(menuItem.heading)
                  }}</span>
                </router-link>
              </div>
            </template>
            <div
              v-if="menuItem.sectionTitle && menuItem.route"
              :class="{ show: hasActiveChildren(menuItem.route) }"
              class="menu-item menu-accordion"
              data-kt-menu-sub="accordion"
              data-kt-menu-trigger="click"
            >
              <span class="menu-link show-menu-bar">
                <span
                  v-if="menuItem.keenthemesIcon || menuItem.bootstrapIcon"
                  class="menu-icon"
                >
                  <i
                    v-if="sidebarMenuIcons === 'bootstrap'"
                    :class="menuItem.bootstrapIcon"
                    class="bi fs-3"
                  ></i>
                  <KTIcon
                    v-else-if="sidebarMenuIcons === 'keenthemes'"
                    :icon-name="menuItem.keenthemesIcon"
                    icon-class="fs-2"
                  />
                </span>
                <span class="menu-title">{{
                  translate(menuItem.sectionTitle)
                }}</span>
                <span class="menu-arrow"></span>
              </span>
              <div
                :class="{ show: hasActiveChildren(menuItem.route) }"
                class="menu-sub menu-sub-accordion"
              >
                <template v-for="(item2, k) in menuItem.sub" :key="k">
                  <div v-if="item2.heading" class="menu-item">
                    <router-link
                      v-if="item2.route"
                      class="menu-link show-menu-bar"
                      active-class="active"
                      :to="item2.route"
                    >
                      <span class="menu-bullet">
                        <span class="bullet bullet-dot"></span>
                      </span>
                      <span class="menu-title">{{
                        translate(item2.heading)
                      }}</span>
                    </router-link>
                  </div>
                  <div
                    v-if="item2.sectionTitle && item2.route"
                    :class="{ show: hasActiveChildren(item2.route) }"
                    class="menu-item menu-accordion"
                    data-kt-menu-sub="accordion"
                    data-kt-menu-trigger="click"
                  >
                    <span class="menu-link show-menu-bar">
                      <span class="menu-bullet">
                        <span class="bullet bullet-dot"></span>
                      </span>
                      <span class="menu-title">{{
                        translate(item2.sectionTitle)
                      }}</span>
                      <span class="menu-arrow"></span>
                    </span>
                    <div
                      :class="{ show: hasActiveChildren(item2.route) }"
                      class="menu-sub menu-sub-accordion"
                    >
                      <template v-for="(item3, k) in item2.sub" :key="k">
                        <div v-if="item3.heading" class="menu-item">
                          <router-link
                            v-if="item3.route"
                            class="menu-link show-menu-bar"
                            active-class="active"
                            :to="item3.route"
                          >
                            <span class="menu-bullet">
                              <span class="bullet bullet-dot"></span>
                            </span>
                            <span class="menu-title">{{
                              translate(item3.heading)
                            }}</span>
                          </router-link>
                        </div>
                      </template>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </template>
        <!--begin:Menu item-->
        <!--end:Menu item-->
      </div>
      <!--end::Menu-->
    </div>
    <!--end::Menu wrapper-->
  </div>
  <!--end::sidebar menu-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import MainMenuConfig from "@/layouts/default-layout/config/MainMenuConfig";
import UserMainMenuConfig from "@/layouts/default-layout/config/UserMainMenuConfig";
import ClientMenuConfig from "@/layouts/default-layout/config/ClientMenuConfig";
import { sidebarMenuIcons } from "@/layouts/default-layout/config/helper";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "sidebar-menu",
  components: {},
  setup() {
    const { t, te } = useI18n();
    const route = useRoute();
    const scrollElRef = ref<null | HTMLElement>(null);
    const activeArrows = ref<{ [key: string]: boolean }>({});
    const activeMenus = ref<{ [key: string]: boolean }>({});

    onMounted(() => {
      if (scrollElRef.value) {
        scrollElRef.value.scrollTop = 0;
      }
    });

    // const maintainScrollPosition = () => {
    //   if (scrollElRef.value) {
    //     const currentScroll = scrollElRef.value.scrollTop;
    //     setTimeout(() => {
    //       scrollElRef.value!.scrollTop = currentScroll;
    //     }, 0);
    //   }
    // };

    const toggleDiv = (key: string) => {
      activeArrows.value[key] = !activeArrows.value[key];
    };

    const toggleMenu = (key: string) => {
      Object.keys(activeMenus.value).forEach((menuKey) => {
        if (menuKey !== key) {
          activeMenus.value[menuKey] = false;
          activeArrows.value[menuKey] = false;
        }
      });
      activeMenus.value[key] = !activeMenus.value[key];
      activeArrows.value[key] = !activeArrows.value[key];
    };

    const arrowTransform = (key: string) =>
      computed(() => (activeArrows.value[key] ? "rotate(-135deg)" : "rotate(45deg)"));

    const translate = (text: string) => {
      if (te(text)) {
        return t(text);
      } else {
        return text;
      }
    };

    const hasActiveChildren = (match: string) => {
      return route.path.indexOf(match) !== -1;
    };

    const activeMenuConfig = computed(() => {
      if (route.path.startsWith('/user')) {
        return UserMainMenuConfig;
      } else if (route.path.startsWith('/client')) {
        return ClientMenuConfig;
      } else {
        return MainMenuConfig;
      }
    });
    
    return {
      activeMenus,
      arrowTransform,
      toggleDiv,
      toggleMenu,
      hasActiveChildren,
      activeMenuConfig,
      sidebarMenuIcons,
      translate,
      getAssetPath,
    };
  },
});
</script>

<style scoped>
.menu-header-attribute {
  position: relative;
  display: inline-block;
  margin-top: 20px;
  height: 53.5px;
}

.logo-img {
  width: 100px;
  object-fit: cover;
  padding-top: 4px;
  padding-left: 10px;
}

#kt_app_sidebar_menu_wrapper {
  border-top: 3px solid #ddd;
}

.show-menu-bar {
  background-color: #F1F1F1;
}

.menu-heading-attribute {
  display: flex;
  justify-content: space-between;
  margin-top: -5px;
  padding-bottom: -10px;
  padding-top: 10px;
  align-items: center;
  font-size: 25px !important;
  color: #1d1f21;
  transition: transform 0.3s ease;
}

/* .menu-item:has(.menu-link.active) {
  color: #ddb900 !important;
} */

.menu-item:active, .show-menu-bar:active {
  background-color: #69b4ff;
  transition: 0.1s ease
}

.menu-title-attribute {
  color: black;
  font-size: 19px !important;
}

#arrow-box {
  position: relative;
  top: -5px;
  right: 10px;
  width: 10px;
  height: 10px;
  border-top: 2px solid black;
  border-left: 2px solid black;
  transform: rotate(45deg);
  display: inline-block;
  transition: transform 0.3s ease;
}

/* #arrow-box:active {
  background-color: rgb(130, 171, 238);
} */
</style>