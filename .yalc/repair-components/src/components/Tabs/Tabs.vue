<template>
  <div>
    <div class="relative z-10 border-b-1">
      <button
        type="button"
        v-for="tab in tabs"
        :key="tab"
        class="p-0 border-1 border-b-0 border-solid cursor-pointer"
        :class="isTabActive(tab) ? 'bg-[transparent] border-gray-300' : 'bg-gray-100 border-gray-100'"
        @click="activeTab = tab"
      >
        <div
          class="p-2 border-0 border-b-1 border-solid min-w-[100px] text-small"
          :class="isTabActive(tab) ? 'border-white' : 'border-gray-300'"
        >
          {{ tab }}
        </div>
      </button>
    </div>
    <div class="relative top-[-1px] bg-white p-4 border-1 border-solid border-gray-300">
      <slot v-bind="{ activeTab }" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'r-tabs',
  props: {
    tabs: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    activeTab: null,
  }),
  watch: {
    tabs(tabs) {
      if (!tabs.includes(this.activeTab)) {
        this.resetTabs();
      }
    },
  },
  created() {
    this.resetTabs();
  },
  methods: {
    resetTabs() {
      this.activeTab = this.tabs[0];
    },
    isTabActive(tab) {
      return this.activeTab === tab;
    },
  },
};
</script>
