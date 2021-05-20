let uuid = 0;

export default {
  computed: {
    htmlId() {
      return `${this.$options.name}-${this.uuid}`;
    },
  },
  beforeCreate() {
    this.uuid = uuid.toString();
    uuid += 1;
  },
};
