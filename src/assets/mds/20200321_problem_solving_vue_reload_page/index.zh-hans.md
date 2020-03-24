---
title: ⭕ ️解决 Vue 刷新当前页面的坑
date: '2020-03-21'
spoiler: 解决 Vue 项目在 iOS Safari 中无法用 vue.$route.go(0) 刷新页面的坑
tags: Vue
---

# 背景

做项目时遇到一个小需求：

页面是由一系列动态生成的表单组成，用户需要在规定时间内完成填写，否则页面会提示超时，然后重新加载当前页面恢复页面初始状态。

# 尝试

## `this.$router.go(0)`

通常在 Vue 中刷新页面只要调用 `this.$router.go(0)` 就可以刷新当前了，但是这个方法在 iOS 内置的 Safari 浏览器中不起效果

## `window.location.reload()`

调用浏览器的提供的 API 这样虽然可以重新加载页面，但是由于要整个页面全部刷新，Vue 要重新加载所有资源，用户体验会比较差。

# 解决办法

## `provide` 和 `inject`

Vue 提供了一个 `provide` 接口，可以在页面最上层的 `App.vue` 或者 `Layout.vue` 中提供一个 API，这样任何层级的子孙组件都可以使用 `inject` 接口得到这个 API。[^1]



在 `Layout.vue` 中，提供一个 `reload` 的方法用来控制 `route-view` 先隐藏，再显示，起到一个刷新的效果

```vue
<template>
  <div>
    <keep-alive>
      <router-view v-if="isRouterAlive" />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>
```

在子组件中，使用 `inject` API 获得 `Layout.vue` 中定义的 `reload` 方法。

```vue
<template>
  ...
</template>

<script>
export default {
  name: 'Page',
  inject: [ 'reload' ],
  methods: {
    handleReload () {
      this.reload()
    }
  }
}
</script>
```


Reference:

[^1]: [API - Vue.js](https://vuejs.org/v2/api/#provide-inject)