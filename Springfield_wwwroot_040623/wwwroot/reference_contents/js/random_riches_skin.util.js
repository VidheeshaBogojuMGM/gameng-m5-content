const THEME = {
  BUILD_WONDER: 'build-wonder',
  LUCKY_SPINNER: 'lucky-spinner'
}

function Theme () {}

Theme.switch = function (newVal, oldVal) {
  document.getElementById(newVal).disabled = false
  if (oldVal) {
    document.getElementById(oldVal).disabled = true
  }
}

Theme.isLuckySpinner = function (theme) {
  return theme === THEME.LUCKY_SPINNER
}

Theme.isBuildWonder = function (theme) {
  return theme === THEME.BUILD_WONDER
}

function Animation () {}

Animation.spinWheel = function (theme, el, list, item, radius) {
  if (Theme.isLuckySpinner(theme)) {
    el.spinwheel_lucky(list, item, 12, radius)
  } else if (Theme.isBuildWonder(theme)) {
    el.spinwheel_wonder(list, item, 6, radius)
  }
}

Animation.rotate = function (theme, el, cb) {
  if (Theme.isLuckySpinner(theme)) {
    el.rotate_lucky(cb)
  } else if (Theme.isBuildWonder(theme)) {
    el.rotate_wonder(cb)
  }
}

function Paging () {
  this.currentPageIndex = 0
  this.countPerPage = 9
  this.totalPageCount = 0

  this.initializePaging = function (mcountPerPage, totalCount) {
    this.currentPageIndex = 0
    this.countPerPage = mcountPerPage
    this.totalPageCount = totalCount
    this.totalPageCount = Math.ceil(totalCount / this.countPerPage)
    if (this.currentPageIndex + 1 > this.totalPageCount) {
      this.currentPageIndex--
      if (this.currentPageIndex < 0) {
        this.currentPageIndex = 0
      }
    }
  }

  this.currentPageItems = function (itemList) {
    if (itemList) {
      var start = this.currentPageIndex * this.countPerPage
      if (this.currentPageIndex == this.totalPageCount) {
        return itemList.slice(start, this.totalPageCount)
      } else if (this.currentPageIndex < this.totalPageCount) {
        return itemList.slice(start, start + this.countPerPage)
      } else {
        console.log('invalid paging access..')
        return []
      }
    } else {
      return []
    }
  }

  this.toNextPage = function () {
    if (!this.isLastPage()) {
      this.currentPageIndex++
    }
  }

  this.toPrevPage = function () {
    if (!this.isFirstPage()) {
      this.currentPageIndex--
      return true
    }
    return false
  }

  this.isLastPage = function () {
    return (this.currentPageIndex + 1 >= this.totalPageCount)
  }

  this.isFirstPage = function () {
    return this.currentPageIndex <= 0
  }

  this.currentPageStartIndex = function () {
    return this.currentPageIndex * this.countPerPage
  }
}
