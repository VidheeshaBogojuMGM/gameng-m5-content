;(function ($) {
  var options = {}

  $.fn.spinwheel_wonder = function () {
    for (var j = 0; j < arguments.length; j += 1) {
      const arg = arguments[j]
      if (j === 0) {
        options.prizelist = arg
      } else if (
        j === 1) {
        options.prize = arg
      } else if (j === 2) {
        options.magicNumber = arg
      } else if (j === 3) {
        options.radius = arg
      } else {
        options = $.extend(options, arg)
      }
    }

    var prizeListLength = options.prizelist.length
    var magicNumber = options.magicNumber

    // reconstruct prize list
    if (prizeListLength >= magicNumber) {
      options.prizelist = options.prizelist.slice(0, magicNumber)
      if (options.prizelist.indexOf(options.prize) < 0) {
        options.prizelist.splice(prizeListLength - 1, 1, options.prize)
      }
    } else {
      const repeatCount = Math.floor(magicNumber / prizeListLength)
      for (var i = 0; i < repeatCount - 1; i++) {
        options.prizelist = options.prizelist.concat(options.prizelist)
      }
      options.prizelist = options.prizelist.concat(options.prizelist.slice(0, magicNumber - repeatCount * prizeListLength))
    }

    return this.each(function () {
      $(this).html(`<div class="wheel-pointer-box">
                      <div class="wheel-pointer"></div>
                    </div>
                    <div class="wheel-bg">
                      <div id="wheel-roll">
                        <div class="prize-list"></div>
                      </div>
                    </div>`)

      var el = $(this).find('.prize-list')
      options.prizelist.forEach((p, i) => {
        el.append(`<p style='position:absolute;text-align:center;width:auto;
                             transform:translate(-50%, -50%) rotate(${i * 360 / magicNumber}deg) translate(0, -${options.radius}px);
                             transform-origin:center;'>${p}</p>`)
      })
    })
  }

  $.fn.rotate_wonder = function (callback) {
    var orbitingTimes = 6
    var realPrizeIndex = options.prizelist.indexOf(options.prize)
    var rotationDegree = orbitingTimes * 360 + 360 * (1 - realPrizeIndex / options.magicNumber)

    $(this).find('#wheel-roll').css({
      transform: `rotate(${rotationDegree}deg)`,
      transition: 'transform 6s ease-in-out'
    })

    document.getElementById('wheel-roll').addEventListener('transitionend', () => {
      setTimeout(() => {
        callback()
      }, 1500)
    })
  }
})(jQuery)
