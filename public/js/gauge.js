!(function(n) {
  if ('object' === typeof exports && 'undefined' !== typeof module)
    module.exports = n()
  else if ('function' === typeof define && define.amd) define([], n)
  else {
    let a
    'undefined' !== typeof window
      ? (a = window)
      : 'undefined' !== typeof global
        ? (a = global)
        : 'undefined' !== typeof self && (a = self)
    a.Gauge = n()
  }
})(() => {
  return (function a(g, h, d) {
    function f(b, c) {
      if (!h[b]) {
        if (!g[b]) {
          var e = 'function' === typeof require && require
          if (!c && e) return e(b, !0)
          if (l) return l(b, !0)
          e = Error(`Cannot find module '${b}'`)
          throw ((e.code = 'MODULE_NOT_FOUND'), e)
        }
        e = h[b] = { exports: {} }
        g[b][0].call(
          e.exports,
          (e) => {
            let a = g[b][1][e]
            return f(a ? a : e)
          },
          e,
          e.exports,
          a,
          g,
          h,
          d,
        )
      }
      return h[b].exports
    }
    for (
      var l = 'function' === typeof require && require, c = 0;
      c < d.length;
      c++
    )
      f(d[c])
    return f
  })(
    {
      1: [
        function(a, g, h) {
          function d(e, a) {
            if (!(e instanceof HTMLElement)) throw Error('Bad target element')
            if (!(this instanceof d)) return new d(e, a)
            c(this, a)
            this.el = e
            this.el.classList.add('gauge')
            this.el.innerHTML =
              '<svg class="gauge-colors" version="1.1" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" opacity="0"/></svg><div class="gauge-marks"></div><div class="gauge-values"></div><div class="gauge-arrow"></div>'
            this.colorsEl = this.el.querySelector('.gauge-colors')
            this.valuesEl = this.el.querySelector('.gauge-values')
            this.arrowEl = this.el.querySelector('.gauge-arrow')
            this.marksEl = this.el.querySelector('.gauge-marks')
            this.createColors()
            this.createValues()
            this.createMarks()
            this.update()
            this.setValue(this.value)
            let b = this
            window.addEventListener('resize', () => {
              b.update()
            })
          }
          function f(e, a) {
            return 0.01 * e * (a[1] - a[0]) + a[0]
          }
          function l(e, a, b) {
            e *= Math.PI / 180
            return [
              (Math.cos(e) * a) / 2 + a / 2,
              (Math.sin(e) * b) / 2 + b / 2,
            ]
          }
          h = a('component-emitter')
          var c = a('xtend/mutable'),
            b = a('mucss/css'),
            k = document
          a = d.prototype = Object.create(h.prototype)
          a.angle = [150, 390]
          a.values = (function() {
            for (var e = {}, a = 0; 10 > a; a++) e[~~((100 * a) / 10)] = a
            return e
          })()
          a.values[100] = 10
          a.marks = Object.keys(a.values).map(parseFloat)
          a.colors = { 0: '#666', 60: '#ffa500', 80: 'red' }
          a.value = 0
          a.setValue = function(a) {
            this.emit('change')
            this.value = +a
            let c = f(this.value, this.angle)
            b(this.arrowEl, { transform: `rotate(${c + 90}deg)` })
            this.value = a
          }
          a.createMarks = function() {
            let a
            this.marksEls = {}
            for (let b = 0; b < this.marks.length; b++)
              (a = k.createElement('span')),
                (a.className = 'gauge-mark'),
                (this.marksEls[this.marks[b]] = a),
                this.marksEl.appendChild(a)
          }
          a.createValues = function() {
            let a, b
            this.valuesEl.innerHTML = ''
            this.valuesEls = {}
            for (let c in this.values)
              (a = this.values[c]),
                (b = k.createElement('span')),
                (b.textContent = a),
                b.setAttribute('class', 'gauge-value'),
                (this.valuesEls[c] = b),
                this.valuesEl.appendChild(b)
          }
          a.createColors = function() {
            let a
            this.colorsEl.innerHTML = ''
            this.colorsEls = {}
            for (let b in this.colors)
              (a = k.createElementNS('http://www.w3.org/2000/svg', 'path')),
                a.setAttribute('class', 'gauge-color'),
                (this.colorsEls[b] = a),
                this.colorsEl.appendChild(a)
          }
          a.update = function() {
            let a = this.el.clientWidth,
              c = this.el.clientHeight,
              f = this.colorsEl.clientWidth || a,
              d = this.colorsEl.clientHeight || c,
              k = '',
              g = this.angle[0],
              h = l(g, f, d),
              m,
              p = this.angle[0] > this.angle[1]
            this.walk(this.colors, function(a, b) {
              let c,
                e = l(b, f, d)
              m &&
                ((c = `M ${h} A ${f / 2} ${d / 2} 0 ${
                  180 < Math.abs(b - g) ? 1 : 0
                } ${p ? 0 : 1} ${e}`),
                m.setAttribute('d', c),
                m.setAttribute('stroke', k))
              m = this.colorsEls[a]
              h = e
              k = this.colors[a]
              g = b
            })
            a = this.angle[1]
            m.setAttribute('stroke', k)
            m.setAttribute(
              'd',
              `M ${h} A ${f / 2} ${d / 2} 0 ${
                180 < Math.abs(a - g) ? 1 : 0
              } 1 ${l(a, f, d)}`,
            )
            let q = this.valuesEl.clientWidth,
              r = this.valuesEl.clientHeight
            this.walk(this.values, function(a, c) {
              let f = l(c, q, r),
                e = this.valuesEls[a]
              b(e, {
                left: f[0] - e.clientWidth / 2,
                top: f[1] - e.clientHeight / 2,
              })
            })
            let s = this.marksEl.clientWidth,
              t = this.marksEl.clientHeight
            this.walk(this.marksEls, function(a, c) {
              let f = l(c, s, t),
                e = this.marksEls[a]
              b(e, {
                transform: `rotate(${c + 90}deg)`,
                left: f[0] - e.clientWidth / 2,
                top: f[1] - e.clientHeight / 2,
              })
            })
          }
          a.walk = function(a, b) {
            let c,
              d = this
            Object.keys(a)
              .map(parseFloat)
              .sort()
              .forEach((a) => {
                c = f(a, d.angle)
                b.call(d, a, c)
              })
          }
          g.exports = d
        },
        { 'component-emitter': 2, 'mucss/css': 3, 'xtend/mutable': 6 },
      ],
      2: [
        function(a, g, h) {
          function d(a) {
            if (a) {
              for (let l in d.prototype) a[l] = d.prototype[l]
              return a
            }
          }
          g.exports = d
          d.prototype.on = d.prototype.addEventListener = function(a, d) {
            this._callbacks = this._callbacks || {}
            ;(this._callbacks[a] = this._callbacks[a] || []).push(d)
            return this
          }
          d.prototype.once = function(a, d) {
            function c() {
              b.off(a, c)
              d.apply(this, arguments)
            }
            var b = this
            this._callbacks = this._callbacks || {}
            c.fn = d
            this.on(a, c)
            return this
          }
          d.prototype.off = d.prototype.removeListener = d.prototype.removeAllListeners = d.prototype.removeEventListener = function(
            a,
            d,
          ) {
            this._callbacks = this._callbacks || {}
            if (0 == arguments.length) return (this._callbacks = {}), this
            let c = this._callbacks[a]
            if (!c) return this
            if (1 == arguments.length) return delete this._callbacks[a], this
            for (var b, k = 0; k < c.length; k++)
              if (((b = c[k]), b === d || b.fn === d)) {
                c.splice(k, 1)
                break
              }
            return this
          }
          d.prototype.emit = function(a) {
            this._callbacks = this._callbacks || {}
            var d = [].slice.call(arguments, 1),
              c = this._callbacks[a]
            if (c)
              for (var c = c.slice(0), b = 0, k = c.length; b < k; ++b)
                c[b].apply(this, d)
            return this
          }
          d.prototype.listeners = function(a) {
            this._callbacks = this._callbacks || {}
            return this._callbacks[a] || []
          }
          d.prototype.hasListeners = function(a) {
            return !!this.listeners(a).length
          }
        },
        {},
      ],
      3: [
        function(a, g, h) {
          function d(a) {
            let b = a[0].toUpperCase() + a.slice(1)
            return void 0 !== f[a] ? a : void 0 !== f[l + b] ? l + b : ''
          }
          var f = a('./fake-element').style,
            l = a('./prefix').dom
          g.exports = function(a, b) {
            if (a && b) {
              let f, e
              if ('string' === typeof b) {
                f = b
                if (3 > arguments.length) return a.style[d(f)]
                e = arguments[2] || ''
                b = {}
                b[f] = e
              }
              for (f in b)
                'number' === typeof b[f] &&
                  /left|right|bottom|top|width|height/i.test(f) &&
                  (b[f] += 'px'),
                  (e = b[f] || ''),
                  (a.style[d(f)] = e)
            }
          }
        },
        { './fake-element': 4, './prefix': 5 },
      ],
      4: [
        function(a, g, h) {
          g.exports = document.createElement('div')
        },
        {},
      ],
      5: [
        function(a, g, h) {
          a = getComputedStyle(document.documentElement, '')
          a = (Array.prototype.slice
            .call(a)
            .join('')
            .match(/-(moz|webkit|ms)-/) ||
            ('' === a.OLink && ['', 'o']))[1]
          dom = 'WebKit|Moz|MS|O'.match(new RegExp(`(${a})`, 'i'))[1]
          g.exports = {
            dom: dom,
            lowercase: a,
            css: `-${a}-`,
            js: a[0].toUpperCase() + a.substr(1),
          }
        },
        {},
      ],
      6: [
        function(a, g, h) {
          g.exports = function(a) {
            for (let f = 1; f < arguments.length; f++) {
              var g = arguments[f],
                c
              for (c in g) g.hasOwnProperty(c) && (a[c] = g[c])
            }
            return a
          }
        },
        {},
      ],
    },
    {},
    [1],
  )(1)
})
