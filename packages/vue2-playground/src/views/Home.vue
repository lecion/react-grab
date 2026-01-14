<template>
  <div class="home">
    <h2>Home Page</h2>
    <p>Welcome to Vue2 playground for testing react-grab!</p>
    <ProductList />
  </div>
</template>

<script>
import ProductList from '../components/ProductList.vue';

export default {
  name: 'Home',
  components: {
    ProductList
  }
};
</script>
