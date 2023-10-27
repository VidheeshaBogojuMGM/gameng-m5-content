var animationHasBeenPlayed = false;
var currentPage = 1;

function checkScrollable() {
	setTimeout(function(){
		var maxHeight = $('.scrollable')[0].scrollHeight;
		if(maxHeight > $('.scrollable').height()) {
			$('.property-info-prev-next').show();
		}
		else {
			$('.property-info-prev-next').hide();
		}
	},100);
}
const propertyinfo = window['com.igt.property_info']("#app", {
	data () {
		return {
		  propertyInfoList: {},
		  imageAdSrc: "",

		  description: "",
		  imageAdSrc2: "",
		}
 	},
	methods: {
			_navigatePropInfo: (e) => {
				localStorage.setItem('propInfo', e+'.json');
				navigate('property_info_hotel.html');
			},
			_navigatePropInfoPreview: (e) => {
				const selectedItem = propertyInfoList.data[e];
				localStorage.setItem('propInfoPreview', JSON.stringify(selectedItem)) ;
				navigate('property_info_description.html')
			},
			loadMenuItems(list) {
				const menus = [
					{label: 'Hotel', onClick: () => this._navigatePropInfo('hotels')},
					{label: 'Entertainment', onClick: () => this._navigatePropInfo('entertainments')},
					{label: 'Restaurant', onClick: () => this._navigatePropInfo('restaurants')},
					{label: 'Nightlife', onClick: () => this._navigatePropInfo('nightlifes')}
				];
				
				const menuItems = (start, end) => {
					const clone = list ? [...list] : [...menus];
					return clone.splice(start, end);
				}

				const container = document.getElementById('property-menu');
				container.innerHTML = '';
				
				const buttonsPerPage = this.isVertical ? 4 : 3;
				const start = (currentPage * buttonsPerPage) - buttonsPerPage;
				const end = buttonsPerPage;

				// Create the menu items
				const menuOptions = document.createElement('div');
				menuOptions.classList.add('menu-options');

				menuItems(start, end).forEach((m, index) => {
					const div = document.createElement('div');
					const span = document.createElement('span');
					span.innerHTML = list ? m.name : m.label;
					div.appendChild(span);
					div.classList.add('btn');
					div.classList.add('btn-dark');
					div.addEventListener('click', list ? () => this._navigatePropInfoPreview(index) : m.onClick);
					menuOptions.appendChild(div);

					const line = document.createElement('div');
					line.classList.add('line');
					menuOptions.appendChild(line);
				});
			
				container.appendChild(menuOptions);

				const length = list ? list.length : menus.length;

				// Create the navigation items if needed
				if (length > buttonsPerPage) {
					const navContainer = document.createElement('div');
					navContainer.classList.add('nav-container');
			
					const previous = document.createElement('div');
					const previousSpan = document.createElement('span');
					previousSpan.innerHTML = 'Prev';
					previous.appendChild(previousSpan);
					previous.classList.add('btn');
					previous.classList.add('btn-dark');
					previous.classList.add('prev');
					previous.addEventListener('click', () => this.prevNext(false, list));
					previous.style.visibility = currentPage == 1 ? 'hidden' : 'visible';
					navContainer.appendChild(previous);
			
					const maxPage = Math.ceil(length / buttonsPerPage);
					const next = document.createElement('div');
					const nextSpan = document.createElement('span');
					nextSpan.innerHTML = 'Next';
					next.appendChild(nextSpan);
					next.classList.add('btn');
					next.classList.add('btn-dark');
					next.classList.add('next');
					next.addEventListener('click', () => this.prevNext(true, list));
					next.style.visibility = currentPage == maxPage ? 'hidden' : 'visible';
					navContainer.appendChild(next);
			
					container.appendChild(navContainer);
				}
			},
			prevNext(increment, list) {
				const menus = [
					{label: 'Hotel', onClick: () => this._navigatePropInfo('hotels')},
					{label: 'Entertainment', onClick: () => this._navigatePropInfo('entertainments')},
					{label: 'Restaurant', onClick: () => this._navigatePropInfo('restaurants')},
					{label: 'Nightlife', onClick: () => this._navigatePropInfo('nightlifes')}
				];
				const length = list ? list.length : menus.length;
				const buttonsPerPage = this.isVertical ? 4 : 3;
				const maxPage = Math.ceil(length / buttonsPerPage);
				if (increment && currentPage < maxPage) {
					currentPage += 1
				}
				else if (!increment && currentPage > 1) {
					currentPage -= 1;
				}
				list ? this.loadMenuItems(list) : this.loadMenuItems();
			}
	},
	mounted () {
		$('.property-info-prev-next').hide();
		if ($('#app').hasClass('SCREEN_PROPERTY_INFO_DESCRIPTION')) {
			setTimeout(() => {
				var selected = JSON.parse(localStorage.getItem('propInfoPreview'));
				this.description = selected.description;
				this.imageAdSrc2 = `./propertyInfo/${selected.imageDetail}${this.displayName}.png`;
				checkScrollable()
			}, 1000);
		}
		else if ($('#app').hasClass('SCREEN_PROPERTY_INFO_SUB')) {
			setTimeout(() => {
				const propInfo = localStorage.getItem('propInfo');
				var propertyJson = `./propertyInfo/json/${propInfo}`;
				fetch(propertyJson).then((response) => { return response.json() }).then((list)=>{
					this.propertyInfoList = window.propertyInfoList = list;
					if (this.propertyInfoList) {
						this.imageAdSrc = `./propertyInfo/${this.propertyInfoList.imageSubMain}${this.displayName}.png`;
						this.loadMenuItems(this.propertyInfoList.data);
					}
					checkScrollable()
				});
			}, 1000);
		}
		else {
			checkScrollable();
			this.loadMenuItems();
		}
	},
  computed:{
    originalSize(){
      return {width : 840, height: 840}
	},
	adPlayerSrc() {
		if (this.appConfig == null) return "";
		if (!this.appConfig.hasOwnProperty('adServiceAddress')) return "";
		if (this.displayName === "") return "";
		if (this.floorLocation === "") return "";
		if (this.machineNumber === "") return "";
		if (this.adPlayerWidth === 0) return "";
		if (this.adPlayerHeight === 0) return "";
		if (this.appConfig.ads) {
			var displayResolution = this.displayName.replace('_', '');
			var displayName = "IDLE_PROPERTY_MAIN_" + displayResolution;
			var playlist = "propInfoMain" + displayResolution;
			var displayConfig = this.appConfig.ads[displayName];
			window.displayConfig = displayConfig.size;
			return window.adurl = `${this.appConfig.adServiceAddress}/ad-service/client/?name=${playlist + "-" + displayConfig.size}&size=${displayConfig.size}&location=${this.floorLocation}&machineNumber=${this.machineNumber}`;
		}
		return '${this.appConfig.adServiceAddress}/ad-service/client/?name=Idle-${this.displayName}&size=${this.adPlayerWidth}x${this.adPlayerHeight}&location=${this.floorLocation}&machineNumber=${this.machineNumber}';
	}
  },
  getters: {
    shouldShowBannerInFullscreen(state) {
      //during customization, it can return false for NV, or true for other casinos.
      return new Promise(function(resolve, reject){
        setTimeout(()=>{
(function(){ window.top.document.getElementById('ShellBackgroundFrame').contentWindow.toggleAttendant(); })();          resolve(state.appConfig.NevadaRegulation);
        }, 1000)
    })}
  },
});
propertyinfo.watch("isProcessing", value=>{
  if (!value && !animationHasBeenPlayed){
    animationHasBeenPlayed = true;
    TweenMax.staggerFrom(".container>*", 0.5, { scale: 0, ease: Back.easeOut, alpha: 0 }, 0.2);
  }
})
