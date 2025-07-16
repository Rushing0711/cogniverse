<script setup>
import {data} from '../utils/Frontend.data.mjs'
</script>

<template>
  {{ data }}
  <div class="toc-container">
    <div class="toc-title">目录</div>
    <div class="toc-list">
      <div
          v-for="(node,index) in data"
          :key="index"
          class="toc-item"
          :class="{ 'active': true}"
          :style="{ paddingLeft: node.level * 20 + 'px' }"
      >
        {{ node.url }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.toc-container {
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toc-title {
  font-weight: bold;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}

.toc-item {
  cursor: pointer;
  padding: 6px 12px;
  margin: 2px 0;
  border-radius: 4px;
  transition: all 0.2s;
  color: #666;
}

.toc-item:hover {
  background: #f5f5f5;
  color: #333;
}

.toc-item.active {
  background: #e8f0fe;
  color: #1967d2;
  font-weight: 500;
}
</style>