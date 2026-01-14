<template>
  <div class="product-list">
    <h2>Products</h2>
    <ul>
      <li v-for="product in products" :key="product.id">
        {{ product.name }} - ${{ product.price }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ProductList',
  data() {
    return {
      products: [
        { id: 1, name: 'Product A', price: 29.99 },
        { id: 2, name: 'Product B', price: 39.99 },
        { id: 3, name: 'Product C', price: 49.99 }
      ]
    };
  }
};
</script>

<style scoped>
.product-list {
  padding: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
</style>
