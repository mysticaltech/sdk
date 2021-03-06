import Vue from 'vue'
import ReactDOM from 'react-dom'
import microlink from '@microlink/vanilla'

const camelCase = string => string.replace(/-([a-z])/g, g => g[1].toUpperCase())

export const Microlink = Vue.component('Microlink', {
  props: {
    url: {
      type: String,
      required: true
    }
  },

  mounted () {
    this.renderCard()
  },

  methods: {
    renderCard () {
      const { cardSpace } = this.$refs

      if (cardSpace && cardSpace.childNodes.length > 0) {
        ReactDOM.unmountComponentAtNode(cardSpace)
      }

      const anchor = document.createElement('a')
      anchor.href = this.url
      anchor.innerHTML = this.url
      microlink(anchor, this.options, cardSpace)
    }
  },

  watch: {
    $attrs: {
      handler () {
        this.renderCard()
      },
      deep: true
    }
  },

  computed: {
    options () {
      const opts = Object.keys(this.$attrs).reduce(
        (acc, value) =>
          value.startsWith('data-')
            ? acc
            : { ...acc, [camelCase(value)]: this.$attrs[value] },
        Vue.microlinkGlobalOptions || {}
      )

      return {
        ...opts,
        as: 'a'
      }
    }
  },

  template: '<div class="microlink_vue_dom" ref="cardSpace" />'
})

export default {
  install (v, options = {}) {
    v.microlinkGlobalOptions = options
    v.component(Microlink.name, Microlink)
  }
}
