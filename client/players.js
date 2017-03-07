export default {
  hash: {},
  list: [],
  removeIndex (idx) {
    const item = this.list[idx]
    this.hash[item.id] = false
    item.destroy()
    this.list.splice(idx, 1)
    return this.list
  },

  add (item) {
    if (item.id === 0) this.user = item
    this.list.push(item)
    this.hash[item.id] = item
  },

  get () {
    return this.list
  },

  getOne (id) {
    return this.hash[id]
  },

  getOthers () {
    return this.list.slice(1)
  },

  containsId (id) {
    return this.hash[id]
  }
}
