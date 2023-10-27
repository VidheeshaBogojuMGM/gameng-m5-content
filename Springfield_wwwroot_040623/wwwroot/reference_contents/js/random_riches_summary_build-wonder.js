;(function ($) {
  const defaults = {
    WonderPpercent: 0,
    WonderWidth: 256,
    WonderHeight: 630,
    WonderTop: 60,
    WonderInitPercent: 0.25, // Total is 1.0

    WorldLeft: 0,
    WorldTopVertical: 100,

    ArrowWidth: 78,
    ArrowHeight: 48,
    ArrowLeftVertical: 0,
    ArrowLeftHorizontal: 224,
    ArrowLeftTFT: 150,

    CameraLeft: 0,
    CameraTop: 0
  }

  let _this, WW, WH
  $.fn.BuildWonderInit = function () {
    let options = {}
    let arg

    for (let j = 0; j < arguments.length; j += 1) {
      arg = arguments[j]
      if (typeof arg === 'function') {
        options.callback = arg
      } else {
        options = $.extend(options, arg)
      }
    }

    _this = $(this)
    WW = parseInt(_this.css('width'))
    WH = parseInt(_this.css('height'))

    _this.Wonder = new Wonder(defaults.WonderWidth, defaults.WonderHeight, Math.abs(WW - defaults.WonderWidth) / 2, defaults.WonderTop)

    const worldtop = WH > 230 ? defaults.WorldTopVertical : (WH - _this.Wonder.height)
    _this.World = new World(WW, WH, defaults.WorldLeft, worldtop)

    // TFT screen content head is 150px, arrow should beiside to content header
    const arrowleft = (WW === 597 && WH === 224) ? defaults.ArrowLeftTFT : (WH > 230 ? defaults.ArrowLeftVertical : defaults.ArrowLeftHorizontal)
    const arrowTop = defaults.WonderHeight * (1 - defaults.WonderInitPercent) * (1 - defaults.WonderPpercent / 100.0) + defaults.WonderTop - defaults.ArrowHeight
    _this.Arrow = new Arrow(defaults.ArrowWidth, defaults.ArrowHeight, arrowleft, arrowTop)

    _this.Camera = new Camera(WW, WH, defaults.CameraLeft, defaults.CameraTop)

    function Wonder (width, height, left, top) {
      this.width = width
      this.height = height
      this.left = left
      this.top = top

      $('#promotion_img').css('width', this.width)
      $('#promotion_img').css('height', this.height)
      $('#promotion_img').css('left', this.left)
      $('#promotion_img').css('top', this.top)

      Wonder.prototype.update = function (newPercent) {
        this.currentPercent = newPercent
        $('#promotion_img').get(0).style.setProperty('--height', (100 - this.currentPercent))
      }
    }

    function World (width, height, left, top) {
      this.width = width
      this.height = height
      this.left = left
      this.top = top

      $('#world').css('width', this.width)
      $('#world').css('height', this.height)
      $('#world').css('left', this.left)
      $('#world').css('top', this.top)

      World.prototype.update = function (newTop) {
        TweenMax.fromTo('#world', 2.0, {
          css: {
            top: this.top + 'px'
          }
        }, {
          css: {
            top: newTop + 'px',
            delay: 0.5
          }
        })
        this.top = newTop
      }
    }

    function Arrow (width, height, left, top) {
      this.width = width
      this.height = height
      this.left = left
      this.top = top
      $('#arrow').css('width', this.width)
      $('#arrow').css('height', this.height)
      $('#arrow').css('left', this.left)
      $('#arrow').css('top', this.top)

      Arrow.prototype.update = function (newTop) {
        TweenMax.fromTo('#arrow', 0.3, {
          css: {
            top: this.top + 'px'
          }
        }, {
          css: {
            top: newTop + 'px',
            delay: 0.5
          }
        })
        this.top = newTop
      }
    }

    function Camera (width, height, left, top) {
      this.width = width
      this.height = height
      this.left = left
      this.top = top

      $('#camera').css('width', this.width)
      $('#camera').css('height', this.height)
      $('#camera').css('left', this.left)
      $('#camera').css('top', this.top)

      Camera.prototype.update = function (newTop) {
        TweenMax.fromTo('#camera', 1.0, {
          css: {
            top: this.top + 'px'
          }
        }, {
          css: {
            top: newTop + 'px',
            delay: 1.5
          }
        })
        this.top = newTop
      }
    }
  }

  $.fn.BuildWonderUpdate = function () {
    let options = {}
    let arg

    for (let j = 0; j < arguments.length; j += 1) {
      arg = arguments[j]
      if (j === 0) {
        options.newPercent = arg
      } else if (typeof arg === 'function') {
        options.callback = arg
      } else {
        options = $.extend(options, arg)
      }
    }

    const newPercent = options.newPercent

    if (newPercent >= 0 && newPercent <= 100 && _this) { // why _this undefined sometimes?
      const newTop = _this.Wonder.height * (1 - defaults.WonderInitPercent) * (1 - newPercent / 100.0)
      _this.Wonder.update((newPercent / 100.0 * (1 - defaults.WonderInitPercent) + defaults.WonderInitPercent) * 100)
      _this.Arrow.update(newTop + _this.Wonder.top - _this.Arrow.height)

      if (WH < 230) {
        _this.Camera.update(newTop)
        _this.World.update(-newTop)
      }
    }
  }
})(jQuery)
