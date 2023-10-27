
var helperMethods = {
    dateFormatter(intValue){
        var date = new Date(intValue);
        try {
            return date.toLocaleString();
        } catch (e) {
            trace("Error formatting " + intValue + " to date time!");
            return intValue.toString().substr(0,24);
        }
    },
    showDetail(offer){
        // this.$store.commit('SetCurrentOffer', offer);
        this.$store.state.CurrentOffer = offer;
        showPage('#offer-detail');
    }
}
var tl = new TimelineLite();
var animation = function(targetPage){
    if(targetPage == null){
        targetPage = '#offer-list';
    }
    var target = targetPage+' .detail-title,'+targetPage+' .label-title,'+targetPage + ' h2,' +targetPage+' p,'+targetPage +' button,'+targetPage+' span';

    if((this.isReady == undefined || this.isReady ) && !tl.isActive()){
        tl.staggerFromTo(target , 0.3, { alpha: 0, scale: 0 }, {alpha:1, scale:1,  ease:Back.easeOut, clearProps:"transform"}, 0.07)
    }
}
var myFilters ={
    lengthFilter(value){
        const maxLength = 18;
        if(value.length > maxLength){

            return value.substr(0, maxLength-3) + "..."
        }else{
            return value;
        }
    }
}
const intelOffer = window['com.igt.intelOffer']("#app", {methods:helperMethods, filters:myFilters, updated:animation});
intelOffer.state.Paging.offerCountPerPage = intelOffer.computed.Orientation == "portrait"? 8 : intelOffer.computed.Orientation== 'landscape_narrow' ?9 :6 ;
showPage("#offer-list");
$(".mask").show();
intelOffer.state.ProcessMessage = "Fetching offers";

trace('Preparing Offer List with default config: nonRedeemedOnly:no, show redeemed offers in 30 days');
intelOffer.dispatch('PrepareOfferList', {nonRedeemed:"no",latestOfferForDays:30})

function showPage(el) {
    $(".page").hide();
    $(el).show();
    // TweenMax.set("button, span", {alpha:0}); //hide first for animation
    animation(el);
}

intelOffer.watch((state)=>state.ProcessStatus, function (after, before) {
    if(after == 'SUCCEEDED'){
        setTimeout(()=>{$(".mask").hide();},3000);
    }else if(after == 'FAILED'){
        setTimeout(()=>{
            $(".mask").hide();
            showPage("#offer-list");
        },3000);
        intelOffer.dispatch("PrepareOfferList");
    }else if(after =='FETCHFAILED'){
        intelOffer.state.ProcessMessage = 'Cannot connect to Intelligent Offer server';
        $(".mask").show();
        setTimeout(()=>{
            intelOffer.navigate("./apps.html");
        },3000);
    }else if(after =='FETCHSUCCEEDED'){
        if(intelOffer.state.OfferList == null || intelOffer.state.OfferList.length == 0){
            intelOffer.state.ProcessMessage = 'No offer available.';
            setTimeout(()=>{
                intelOffer.navigate("./apps.html");
            },3000);
        }else{
            var awardId = getParameter('awardId');
            intelOffer.state.CurrentOffer = intelOffer.state.OfferList==null? null : intelOffer.state.OfferList.find(offer=>{return offer.sourceAwardId == awardId});
            if(intelOffer.state.CurrentOffer){
                showPage("#offer-detail");
            }else{
                showPage("#offer-list");
            }
            $(".mask").hide();
        }
    }
    else if(after == 'INPROGRESS'){
        $(".mask").show();
    }else{
        console.log('process status changed, no handle. From '+before + ' to '+ after);
    }
}, this);

intelOffer.press("#back", function(){
    //intelOffer.navigate('./session_screen.html');
    intelOffer.navigate('SESSION_SCREEN');
})

function redeemCurrent(){
    intelOffer.dispatch('RedeemOffer', intelOffer.state.CurrentOffer.sourceAwardId);
}
function rejectCurrent(){
    intelOffer.dispatch('RejectOffer', intelOffer.state.CurrentOffer.sourceAwardId);
}
function previousPage(){
    intelOffer.state.Paging.toPrevPage();
}
function nextPage(){
    intelOffer.state.Paging.toNextPage();
}


function getParameter(name) {
    const params = location.search.split(name + '=')[1];
    if (params === undefined) {
      return "";
    }
    const values = params.split('&');
    if (values.length > 0) {
      return values[0];
    }
    return "";
  }
