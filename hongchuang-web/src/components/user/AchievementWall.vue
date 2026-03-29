<template>
  <div class="achievement-wall">
    <div class="wall-head">
      <div class="title">成就墙</div>
      <div class="sub">点亮属于你的社区徽章与成长轨迹</div>
    </div>
    <div v-if="items.length" class="grid">
      <article v-for="item in items" :key="item.id" class="achievement-card" :class="{ locked: item.obtained === false }" :style="{ '--badge-color': item.color || '#22c55e' }">
        <div class="icon">🏆</div>
        <div class="name-row">
          <div class="name">{{ item.name }}</div>
          <span class="state">{{ item.obtained === false ? '未解锁' : '已获得' }}</span>
        </div>
        <div class="desc">{{ item.description || '暂无描述' }}</div>
        <div class="time">{{ item.obtainedAt ? `获得于 ${item.obtainedAt}` : '继续活跃以解锁更多成就' }}</div>
      </article>
    </div>
    <el-empty v-else description="暂未获得成就" />
  </div>
</template>

<script setup lang="ts">
import type { AchievementItem } from '@/types/forum'

defineProps<{ items: AchievementItem[] }>()
</script>

<style scoped lang="scss">
.achievement-wall {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.wall-head .title {
  font-size: 20px;
  font-weight: 700;
}
.wall-head .sub {
  color: var(--hc-text-secondary);
  margin-top: 6px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}
.achievement-card {
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: linear-gradient(180deg, rgba(255,255,255,.96), rgba(248,250,252,.96));
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
  position: relative;
}
.achievement-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 4px;
  border-radius: 16px 16px 0 0;
  background: var(--badge-color);
}
.achievement-card.locked {
  opacity: .72;
}
.icon {
  font-size: 28px;
}
.name-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  margin-top: 10px;
}
.name {
  font-weight: 700;
}
.state {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.06);
}
.desc {
  margin-top: 8px;
  color: var(--hc-text-secondary);
  line-height: 1.75;
  min-height: 48px;
}
.time {
  margin-top: 12px;
  font-size: 12px;
  color: var(--hc-text-secondary);
}
</style>
