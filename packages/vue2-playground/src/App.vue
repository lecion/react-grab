<template>
  <div id="app">
    <Header />
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/user/123">User 123</router-link> |
      <router-link to="/user/123/posts">User Posts</router-link> |
      <router-link to="/user/123/settings">User Settings</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
import Header from './components/Header.vue';

export default {
  name: 'App',
  components: {
    Header
  }
};
</script>

<style>
#app {
  padding: 20px;
}

nav {
  padding: 20px 0;
}

nav a {
  margin-right: 15px;
  text-decoration: none;
  color: #42b983;
}

nav a.router-link-exact-active {
  color: #35495e;
  font-weight: bold;
}
</style>
