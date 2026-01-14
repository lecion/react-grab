<template>
  <div class="post-item">
    <h4>{{ post.title }}</h4>
    <p>{{ post.content }}</p>
    <div class="post-meta">
      <span class="post-id">ID: {{ post.id }}</span>
      <span class="post-date">{{ formattedDate }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostItem',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedDate() {
      return new Date().toLocaleDateString();
    }
  }
};
</script>

<style scoped>
.post-item {
  background: #f5f5f5;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
}

.post-item h4 {
  margin: 0 0 10px 0;
  color: #42b983;
}

.post-item p {
  margin: 0 0 10px 0;
  color: #666;
  line-height: 1.6;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  border-top: 1px solid #ddd;
  padding-top: 8px;
  margin-top: 8px;
}

.post-id {
  font-weight: 500;
}

.post-date {
  font-style: italic;
}
</style>
