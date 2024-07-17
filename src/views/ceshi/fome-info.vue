<template>
  <div>
    <tr v-for="(item, index) in fomeInfo" :key="item">
      <td>{{ index }}</td>
      <td>{{ item }}</td>
    </tr>
  </div>
</template>

<script>
import address from "./address.json";
export default {
  data() {
    return {
      fomeInfo:[],
      active: 1,
      id: null, //商品ID
    };
  },
  created() {
    console.log(this.$route.query);
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
    }
    this.getProductInfo();
  },
  methods: {
    // 查询id商品详情
    async getProductInfo() {
      const res = await this.$request.get(
        "/mall/cms/api/v1/product/get_product_info?id=" + this.id
      );
      if (res.data.code === 200) {
        this.fomeInfo = res.data.data;
      }
    },
  },
};
</script>

<style scoped>

</style>
