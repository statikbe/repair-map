<template>
  <div>
    <div class="text-white space-x-2 flex justify-between">
      <r-checkbox
        v-model="groupVal"
        :label="$t('circufix_category_group_' + categoryGroup.code + '_label')"
        class="font-bold category-group"
        @change.native="selectAllCategories(categoryGroup.code)"
      />
      <div
        v-if="categoryGroup.items && categoryGroup.items.length > 1"
        @click="isOpen = !isOpen"
        class="text-small p-2 border-0 leading-0 cursor-pointer transition-colors !bg-none"
      >
        <template v-if="isOpen">
          {{ $t('circufix_category_show_less') }}
          <r-icon name="mdiChevronUp"/>
        </template>
        <template v-else>
          {{ $t('circufix_category_show_more') }}
          <r-icon name="mdiChevronDown"/>
        </template>
      </div>
    </div>
    <r-grid v-if="categoryGroup.items && categoryGroup.items.length > 1 && isOpen" class="!mt-0 mb-2 ml-3">
      <r-grid-item v-for="(category, key) in categoryGroup.items" :key="key" class="sm:w-1/2 md:w-1/3 lg:w-1/5 !mt-0">
        <r-checkbox v-model="inputVal" :label="$t('circufix_category_' + category + '_label')" :value="category" />
      </r-grid-item>
    </r-grid>
  </div>
</template>

<script>
export default {
  name: 'category-group',
  props: {
    value: null,
    group: {
      type: Boolean,
      default: false,
    },
    categoryGroup: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    inputVal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    groupVal: {
      get() {
        return this.group;
      },
      set(val) {
        if (val) {
          this.isOpen = true;
        }
        this.$emit('input-group', val);
      },
    },
  },
  methods: {
    selectAllCategories() {
      this.$emit('select-all', this.categoryGroup.code);
    },
  },
};
</script>

<style scoped lang="css"></style>
