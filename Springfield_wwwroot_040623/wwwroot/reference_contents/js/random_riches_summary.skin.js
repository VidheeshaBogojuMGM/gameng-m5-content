try {
	(new Date()).toLocaleTimeString()
} catch (e) {
  Date.prototype.toLocaleTimeString = function () {
    var h = this.getHours();
    var m = this.getMinutes();
    var s = this.getSeconds();
    var suffix = h > 12 ? "PM" : "AM";
    h = h % 12;
    m = `00${m}`.substr(-2, 2);
    s = `00${s}`.substr(-2, 2);
    return `${h}:${m}:${s} ${suffix}`
  }
}

window.RR_summary = window['com.igt.RR.summary'](
  '#app', {
    data () {
      return {
        pageStatus: {
          promotion: true,
          detail: false,
          list: false,
          info: {
            message: false,
            error: false
          }
        },
        infoMessage: '',
        tierPaging: new Paging()
      }
    },
    computed: {
      isLuckySpinnerTheme () {
        return Theme.isLuckySpinner(this.currentTheme)
      },
      shouldShowInfo () {
        return this.pageStatus.info.message || this.pageStatus.info.error
      },
      shouldShowDetailOrList () {
        return this.pageStatus.detail || this.pageStatus.list
      },
      tierList () {
        return this.tierPaging.currentPageItems(this.currentPromotion.thresholds)
      },
      emptyTd () {
        return this.tierPaging.countPerPage - this.tierList.length > 0 ? this.tierPaging.countPerPage - this.tierList.length : 0
      },
      isTierFirstPage () {
        return this.tierPaging.isFirstPage()
      },
      isTierLastPage () {
        return this.tierPaging.isLastPage()
      },
      tierListStartNum () {
        return this.tierPaging.currentPageStartIndex() + 1
      },
      tierStatus () {
        return function (value) {
          if (value < this.currentThresholdId + 1) return 'Completed'
          if (value > this.currentThresholdId + 1) return '--'
          return 'In Progress'
        }
      },
      promotionName () {
        return this.currentPromotion.promoName
      },
      nextBonusAt () {
        return this.currentThreshold
      },
      activePointTotal () {
        return this.currentPromotion.pointBalance
      },
      pointsToGo () {
        return Math.floor(this.currentThreshold - this.activePointTotal)
      }
    },
    methods: {
      switchPageStatus (paths) {
        // reset all to false
        Object.keys(this.pageStatus).forEach((k) => {
          if (typeof this.pageStatus[k] === 'object') {
            Object.keys(this.pageStatus[k]).forEach((k2) => {
              this.pageStatus[k][k2] = false
            })
          } else {
            this.pageStatus[k] = false
          }
        })

        Object.assign(this.pageStatus, paths)
      },
      backHome () {
        this.navigate('SESSION_SCREEN')
      },
      toNextPromotion () {
        this.$store.dispatch('nextPromotion')
      },
      toPrePromotion () {
        this.$store.dispatch('previousPromotion')
      },
      updatePage () {
        this.switchPageStatus({
          promotion: !this.allTiersHit,
          detail: this.pageStatus.detail,
          list: this.pageStatus.list,
          info: {
            message: this.allTiersHit,
            error: this.errorMessage !== ''
          }
        })
      },
      refreshPromotionTiersPaging () {
        const countPerPage = this.$store.getters.isVertical ? 10 : 3
        this.tierPaging.initializePaging(countPerPage, this.currentPromotion.thresholds.length)
      },
      toNextTiersPage () {
        this.tierPaging.toNextPage()
      },
      toPreTiersPage () {
        this.tierPaging.toPrevPage()
      },
      bet () {
        this.$store.dispatch('betSimulator')
      },
      showDetail () {
        this.switchPageStatus({
          promotion: true,
          detail: true
        })
      },
      showList () {
        this.refreshPromotionTiersPaging()
        this.switchPageStatus({
          promotion: true,
          list: true
        })
      },
      showPromotionHome () {
        this.switchPageStatus({
          promotion: true
        })
      }
    },
    watch: {
      allTiersHit (newVal) {
        if (newVal) {
          this.infoMessage = window.messageDefinition.summary.all_tiers_hit
          this.updatePage()
        }
      },
      calculatedPercentage (newVal) {
        $('#app').BuildWonderUpdate(newVal)
        $('#app').LuckySpinnerUpdate(newVal)
      },
      isReady (newVal) {
        if (newVal) {
          $('#app').BuildWonderInit()
          $('#app').LuckySpinnerInit()

          if (this.calculatedPercentage) { // in case of calculatedPercentage was executed before ready was called
            $('#app').BuildWonderUpdate(this.calculatedPercentage)
            $('#app').LuckySpinnerUpdate(this.calculatedPercentage)
          }
        }
      },
      currentTheme (newVal, oldVal) {
        Theme.switch(newVal, oldVal)
      },
      currentPromotion () {
        this.refreshPromotionTiersPaging()
        this.updatePage()
      },
      errorMessage (newVal) {
        this.infoMessage = newVal
        this.switchPageStatus({
          info: {
            error: true
          }
        })
      },
      shouldShowDetailOrList () {
        if (this.$store.getters.contentWidth / this.$store.getters.contentHeight < 5) return
        $('#promotion_img').toggleClass('progress-new')
        $('#spinnerProgress').toggleClass('progress-new')
      }
    }
  }
)
