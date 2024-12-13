<template>
  <!--begin::sidebar menu-->
  <div class="app-sidebar-menu overflow-hidden flex-column-fluid d-lg-none sidebar-custom"
    :class="{ 'sidebar-hidden': !sidebarVisible, 'sidebar-visible': sidebarVisible }"
    @animationend="handleAnimationEnd"
  >
    <!--begin::Menu wrapper-->
    <div class="menu-header-attribute">
      <img class="logo-img" src="/logo.png">
      <div class="menu-close-btn" @click="closeMenu">X</div>
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
        class="menu menu-column menu-rounded menu-sub-indention menu-attribute"
        data-kt-menu="true"
      >
        <template v-for="(item, i) in activeMenuConfig" :key="i">
          <div v-if="item.heading" class="menu-item pt-5" @click="toggleDiv(`arrow-${i}`); toggleMenu(`menu-${i}`)">
            <div class="menu-content">
              <span class="menu-heading fw-bold text-uppercase fs-7 menu-heading-attribute">
                {{ translate(item.heading) }} 
                <div 
                  id="arrow-box"
                  :style="{ transform: arrowTransform(`menu-${i}`).value }" 
                >
                </div>
              </span>
            </div>
          </div>
          <template v-if="item.pages && Array.isArray(item.pages)">
            <template v-for="(menuItem, j) in item.pages" :key="j">
              <template v-if="menuItem.heading">
                <Transition name = min-menu-bar>
                  <div 
                    class="menu-item"
                    v-if="activeMenus[`menu-${i}`]"
                    :class="{ 'first-menu-item': j === 0, 'last-menu-item': j === item.pages.length - 1 }"
                  >
                    <router-link
                      v-if="menuItem.route"
                      class="menu-link show-menu-bar border-radius-attribute"
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
                      <span class="menu-title menu-title-attribute" @click="closeMenu">{{
                        translate(menuItem.heading)
                      }}</span>
                    </router-link>
                  </div>
                </Transition>
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
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:visible"],
  components: {},
  setup(props, { emit }) {
    const { t, te } = useI18n();
    const route = useRoute();
    const scrollElRef = ref<null | HTMLElement>(null);
    const activeArrows = ref<{ [key: string]: boolean }>({});
    const activeMenus = ref<{ [key: string]: boolean }>({});
    const sidebarVisible = ref(true);

    onMounted(() => {
      if (scrollElRef.value) {
        scrollElRef.value.scrollTop = 0;
      }
    });

    const closeMenu = () => {
      sidebarVisible.value = false;
      setTimeout(() => {
        emit("update:visible", false);
      }, 300);
    };

    const handleAnimationEnd = (event: AnimationEvent) => {
      const target = event.target as HTMLElement;
      if (!sidebarVisible.value && target.classList.contains("sidebar-hidden")) {
        target.style.visibility = "hidden";
      }
    };

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
      setTimeout(() => {
      activeMenus.value[key] = !activeMenus.value[key];
      activeArrows.value[key] = !activeArrows.value[key];
      }, 200);
    };

    const arrowTransform = (key: string) =>
      computed(() => (activeArrows.value[key] ? "rotate(45deg)" : "rotate(-135deg)"));

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
      sidebarVisible,
      closeMenu,
      handleAnimationEnd,
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
@keyframes slideOutToTop {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}

.min-menu-bar-enter-active {
  transition: opacity 0.3s ease, transform 1s ease, max-height 1s ease;
}

.min-menu-bar-enter-from {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

.min-menu-bar-enter-to,
.min-menu-bar-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 500px;
}

.sidebar-visible {
  display: block;
  animation: slideInFromTop 0.5s forwards;
}

.sidebar-hidden {
  display: block;
  animation: slideOutToTop 0.2s ease-out forwards;
}

.menu-header-attribute {
  position: relative;
  display: block;
  padding-top: 20px;
  padding-bottom: 75px;
  margin: 0;
  height: 53.5px;
  background-color: white;
  box-shadow: 0 0.2px 1px 0.5px #f1f1f4;
}

.logo-img {
  width: 80px;
  object-fit: cover;
  padding-top: 14px;
  padding-left: 10px;
}

.sidebar-custom {
  background-color: #fcfcfc;
}

.show-menu-bar {
  background-color: #fbfbfb;
  /* border-radius: 0; */
  border-bottom: 10px solid #fbfbfb;
  margin-bottom: -8px !important;
  padding-left: 2.25rem;
  padding-right: 2.25rem;
  padding-top: 10px;
}

.border-radius-attribute {
  border-radius: 0 0 10px 10px;
}

.menu-heading-attribute {
  display: flex;
  justify-content: space-between;
  margin-top: -5px;
  padding-top: 10px;
  padding-left: 1rem;
  padding-right: 1rem;
  align-items: center;
  font-size: 25px !important;
  color: #444444;
  transition: transform 0.3s ease;
}

.menu-item {
  padding: 0;
}

.menu-item:active {
  background-color: #69b4ff62;
  transition: 0.1s ease
}

.show-menu-bar:active {
  box-shadow: inset 0 0 87px 11px #fdfdfd;
  background-color: #3b3c3d;
}

.menu-title-attribute {
  color: #3b3c3d;
  font-size: 23px !important;
}

#arrow-box {
  position: relative;
  top: -5px;
  right: 10px;
  width: 10px;
  height: 10px;
  border-top: 2px solid black;
  border-left: 2px solid black;
  transform: rotate(-135deg);
  display: inline-block;
  transition: transform 0.3s ease;
}

.menu-close-btn {
  position: absolute;
  top: 38px;
  right: 20px;
  color: black;
  font-size: 18px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.first-menu-item {
  border-top : 0.1px solid #f1f1f4;
  box-shadow: 0 -1px 5px 2px #535455 inset;
}

/* .last-menu-item {
  border-bottom-left-radius: 10px !important;
  border-bottom-right-radius: 10px !important;
} */
</style>