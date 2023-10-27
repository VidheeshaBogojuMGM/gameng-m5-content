;(function ($) {
  const defaults = {
    ContainerWidthVertical: 256,
    ContainerWidthHorizontal: 350,
    ContainerHeight: 224
  }

  let _this, WW, WH
  $.fn.LuckySpinnerInit = function () {
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

    const width = WH > 230 ? defaults.ContainerWidthVertical : defaults.ContainerWidthHorizontal
    const height = defaults.ContainerHeight
    const left = (WW - width) / 2
    const top = WH > 230 ? (WH / 2 - height) / 2 : 0

    $('#spinnerProgress').css('width', width)
    $('#spinnerProgress').css('height', height)
    $('#spinnerProgress').css('left', left)
    $('#spinnerProgress').css('top', top)
  }

  $.fn.LuckySpinnerUpdate = function () {
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
    if (newPercent >= 0 && newPercent <= 100) {
      const val_1_X = 15
      const val_2_X = (newPercent >= 0 && newPercent <= 5) ? ((5 - newPercent) * 15.0 / 5.0) : 0
      const val_3_X = newPercent <= 5 ? 50 : 0
      const val_3_Y = newPercent <= 5 ? 50 : (newPercent <= 35 ? (100.0 - (newPercent - 5) * 100.0 / 30.0) : 0)
      const val_4_X = newPercent <= 35 ? 50 : (newPercent <= 65 ? ((newPercent - 35) * 100.0 / 30.0) : 100)
      const val_4_Y = newPercent <= 35 ? 50 : 0
      const val_5_X = newPercent <= 65 ? 50 : 100
      const val_5_Y = newPercent <= 65 ? 50 : (newPercent <= 95 ? ((newPercent - 65) * 100.0 / 30.0) : 100)
      const val_6_X = newPercent <= 95 ? 50 : (newPercent <= 100 ? (100.0 - (newPercent - 95) * 16.0 / 5.0) : 85)
      const val_6_Y = newPercent <= 95 ? 50 : 100

      setCssVal('--val_1_X', val_1_X)
      setCssVal('--val_2_X', val_2_X) // 0-15 to 0-5 percent
      setCssVal('--val_3_X', val_3_X)
      setCssVal('--val_3_Y', val_3_Y) // 100-0 to 5-35 percent
      setCssVal('--val_4_X', val_4_X) // 0-100 to 35-65 percent
      setCssVal('--val_4_Y', val_4_Y)
      setCssVal('--val_5_X', val_5_X)
      setCssVal('--val_5_Y', val_5_Y) // 0-100 to 65-95 percent
      setCssVal('--val_6_X', val_6_X) // 100-85 to 95-100 percent
      setCssVal('--val_6_Y', val_6_Y)
    }

    function setCssVal (id, val) {
      $('#progressBar-full').get(0).style.setProperty(id, val)
    }
  }
})(jQuery)
