;(function ($) {
  var options = {}
  var prizes = []
  var realPrizeIndex = 0

  $.fn.spinwheel_lucky = function () {
    for (var j = 0; j < arguments.length; j++) {
      const arg = arguments[j]
      if (j === 0) {
        options.prizelist = arg
      } else if (j === 1) {
        options.prize = arg
      } else if (j === 2) {
        options.magicNumber = arg
      } else if (j === 3) {
        options.radius = arg
      } else {
        options = $.extend(options, arg)
      }
    }

    const prizeArray = new Int32Array(options.magicNumber)

    fillPrizeArray()

    function fillPrizeArray () {
      buildPrizeList()

      for (var j = 0; j < options.prizelist.length; j++) {
        const tempArr = splitNumber(options.prizelist[j])
        if (j % 2 !== 0) { // special case, if all award amounts are 0, make the dispay more naturally.
          tempArr.reverse()
        }
        for (var k = 0; k < 3; k++) {
          prizeArray[j + k * options.prizelist.length] = tempArr[k]
        }

        if (options.prizelist[j] === options.prize) {
          realPrizeIndex = j
          prizes = tempArr
        }
      }
    }

    function buildPrizeList () {
      var prizeListLength = options.prizelist.length
      var magicNumberLength = options.magicNumber / 3

      if (prizeListLength >= magicNumberLength) {
        options.prizelist = options.prizelist.slice(0, magicNumberLength)

        if (options.prizelist.indexOf(options.prize) < 0) {
          options.prizelist.splice(options.prizelist.length - 1, 1, options.prize)
        }
      } else {
        const repeatCount = Math.floor(magicNumberLength / prizeListLength)
        const arr = options.prizelist

        for (var i = 0; i < repeatCount - 1; i++) {
          options.prizelist = options.prizelist.concat(arr)
        }

        options.prizelist = options.prizelist.concat(arr.slice(0, magicNumberLength - repeatCount * prizeListLength))
      }
    }

    function splitNumber (number) {
      const arr = []
      const maximum = (number < 3) ? number : number / 2

      var random1 = Math.floor(getRandomArbitrary(0, maximum))
      var random2 = Math.floor(getRandomArbitrary(0, maximum))
      arr.push(random1)
      arr.push(random2)
      arr.push(number - random1 - random2)

      return arr
    }

    function getRandomArbitrary (min, max) {
      return Math.random() * (max - min) + min
    }

    return this.each(function () {
      $(this).html(`<div class="wheel-pointer-box">
                            <div class="wheel-pointer"></div>
                          </div>
                          <div class="wheel-bg">
                            <div class="prize-list"></div>
                            <div id="wheel-roll"></div>
                          </div>`)

      var el = $(this).find('.prize-list')
      prizeArray.forEach((p, i) => {
        el.append(function () {
          return `<p style='position: absolute; text-align: center; width:auto;
                                      transform :translate(-50%, -50%)  rotate(${i * 360 / prizeArray.length}deg) translate(0, -${options.radius}px);
                                      transform-origin: center;'>${p}</p>`
        })
      })
    })
  }

  $.fn.rotate_lucky = function (callback) {
    var orbitingTimes = 4
    var rotationDegree = orbitingTimes * 360 + 360 * (realPrizeIndex + 2) / options.magicNumber

    $(this).find('#wheel-roll').css({
      transform: `rotate(${rotationDegree}deg)`,
      transition: 'transform 10s'
    })
    document.getElementById('wheel-roll').addEventListener('transitionend', () => {
      setTimeout(() => {
        callback(prizes)
      }, 1500)
    })
  }
})(jQuery)
