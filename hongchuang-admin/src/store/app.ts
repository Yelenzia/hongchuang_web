import { defineStore } from 'pinia'
export const useAdminAppStore = defineStore('adminApp', {
  state: () => ({
    collapsed: false
  })
})
