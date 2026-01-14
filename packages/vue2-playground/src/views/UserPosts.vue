<template>
  <div class="user-posts">
    <h3>User Posts</h3>
    <div class="posts-list">
      <PostItem
        v-for="post in posts"
        :key="post.id"
        :post="post"
      />
    </div>
  </div>
</template>

<script>
import PostItem from '../components/PostItem.vue';

export default {
  name: 'UserPosts',
  components: {
    PostItem
  },
  computed: {
    userId() {
      return this.$route.params.id;
    },
    posts() {
      return [
        {
          id: 1,
          title: `Post 1 by User ${this.userId}`,
          content: 'This is the first post content...'
        },
        {
          id: 2,
          title: `Post 2 by User ${this.userId}`,
          content: 'This is the second post content...'
        },
        {
          id: 3,
          title: `Post 3 by User ${this.userId}`,
          content: 'This is the third post content...'
        }
      ];
    }
  }
};
</script>

<style scoped>
.user-posts {
  padding: 20px;
}

.posts-list {
  margin-top: 15px;
}
</style>
