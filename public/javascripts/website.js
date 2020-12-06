"use strict";

var JWT = localStorage.getItem("token");
var axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Authorization": JWT,
    }
};
var users = [];
var id = '';
var gainers = [];
var loosers = [];
var yhighs = [];
var ylows = [];
var tVols = [];
var tVals = [];
var wlive = [];
var cSearch = [];

var baseURL = 'http://localhost:3000/'
var pathname = window.location.pathname.split("/");
var symbol = pathname[pathname.length - 1]
var Dashboard = function () {
    var global = {
        tooltipOptions: {
            placement: "right"
        },
        menuClass: ".c-menu"
    };
    
    return {
        init: function init() {
            if(symbol=='home'){
                axios.get(`/api/stock/top-gainers`, axiosConfig)
                .then(res => {                    
                    gainers = res.data.data.data;
                    $.each(gainers, function (i, gainer) {
                        appendToGainerTable(gainer);
                    });
                })
                .catch(err => console.log(err));
                axios.get(`/api/stock/top-loosers`, axiosConfig)
                .then(res => {
                    
                    loosers = res.data.data.data;
                    $.each(loosers, function (i, looser) {
                        appendToLooserTable(looser);
                    });
                })
                .catch(err => console.log(err));
                axios.get(`/api/stock/year-high`, axiosConfig)
                .then(res => {
                    
                    yhighs = res.data.data.data;
                    $.each(yhighs, function (i, yhigh) {
                        if(i == 10){
                            return false;
                        }
                        appendToHighTable(yhigh);
                    });
                })
                .catch(err => console.log(err));
                axios.get(`/api/stock/year-low`, axiosConfig)
                .then(res => {
                    
                    ylows = res.data.data.data;
                    $.each(ylows, function (i, ylow) {
                        appendToLowTable(ylow);
                    });
                })
                .catch(err => console.log(err));
                axios.get(`/api/stock/top-volume`, axiosConfig)
                .then(res => {
                    
                    tVols = res.data.data.data;
                    $.each(tVols, function (i, tVol) {
                        appendToVolumeTable(tVol);
                    });
                })
                .catch(err => console.log(err));
                axios.get(`/api/stock/top-value`, axiosConfig)
                .then(res => {
                    
                    tVals = res.data.data.data;
                    $.each(tVals, function (i, tVal) {
                        appendToValueTable(tVal);
                    });
                })
                .catch(err => console.log(err));
                axios.get(`/api/stock/live-watch`, axiosConfig)
                .then(res => {
                    wlive = res.data.data.data;
                    $.each(wlive, function (i, live) {
                        if(i == 5){
                            return false;
                        }
                        appendToliveTable(live);
                    });
                })
                .catch(err => console.log(err));
                axios.get('/api/stock/getAll', axiosConfig)
                .then(res => {
                    var { data } = res;
                    var select = document.getElementById('selectBox');
                    
                    for (let i = 0; i < data.length; i++) {
                        var option = document.createElement("option");
                        option.value = data[i].SYMBOL;
                        option.text = data[i].SYMBOL;
                        option.className = 'form-control';
                        select.appendChild(option);
                    }
                })
                .catch(err => console.log(err));
                axios.get(`/api/stock/data/${symbol}`, axiosConfig)
                .then(res => {
                    console.log(res)
                })
                .catch(err => console.log(err));
                axios.get(`/api/stock/news/${symbol}`, axiosConfig)
                .then(res => {
                    console.log(res)
                    
                })
                .catch(err => console.log(err));
            }
        }
    };
}();

Dashboard.init();


function appendToGainerTable(gainer) {
    $("#stock-gainers > tbody:last-child").append(`
    <tr id="gainer-${gainer._id}">
    <td>${gainer.symbol}</td>
    <td>${gainer.previousPrice}</td>
    <td>${gainer.openPrice}</td>
    <td>${gainer.highPrice}</td>
    <td>${gainer.lowPrice}</td>
    <td>${gainer.ltp}</td>
    <td>${gainer.netPrice}</td>
    <td>${gainer.tradedQuantity}</td>
    <td>${gainer.turnoverInLakhs}</td>
    </tr>
    `);
}

function appendToLooserTable(looser) {
    $("#stock-loosers > tbody:last-child").append(`
    <tr>
    <td>${looser.symbol}</td>
    <td>${looser.previousPrice}</td>
    <td>${looser.openPrice}</td>
    <td>${looser.highPrice}</td>
    <td>${looser.lowPrice}</td>
    <td>${looser.ltp}</td>
    <td>${looser.netPrice}</td>
    <td>${looser.tradedQuantity}</td>
    <td>${looser.turnoverInLakhs}</td>
    </tr>    
    `);
}
function appendToHighTable(yhigh) {
    $("#stock-high > tbody:last-child").append(`
    <tr>
    <td>${yhigh.symbol}</td>
    <td>${yhigh.previousPrice}</td>
    <td>${yhigh.openPrice}</td>
    <td>${yhigh.highPrice}</td>
    <td>${yhigh.lowPrice}</td>
    <td>${yhigh.ltp}</td>
    <td>${yhigh.netPrice}</td>
    <td>${yhigh.tradedQuantity}</td>
    <td>${yhigh.turnoverInLakhs}</td>
    </tr>
    `);
}
function appendToLowTable(ylow) {
    $("#stock-low > tbody:last-child").append(`
    <tr>
    <td>${ylow.symbol}</td>
    <td>${ylow.previousPrice}</td>
    <td>${ylow.openPrice}</td>
    <td>${ylow.highPrice}</td>
    <td>${ylow.lowPrice}</td>
    <td>${ylow.ltp}</td>
    <td>${ylow.netPrice}</td>
    <td>${ylow.tradedQuantity}</td>
    <td>${ylow.turnoverInLakhs}</td>
    </tr>    
    `);
}

function appendToValueTable(tVol) {
    $("#stock-value > tbody:last-child").append(`
    <tr>
    <td>${tVol.symbol}</td>
    <td>${tVol.previousPrice}</td>
    <td>${tVol.openPrice}</td>
    <td>${tVol.highPrice}</td>
    <td>${tVol.lowPrice}</td>
    <td>${tVol.ltp}</td>
    <td>${tVol.netPrice}</td>
    <td>${tVol.tradedQuantity}</td>
    <td>${tVol.turnoverInLakhs}</td>
    </tr>    
    `);
}

function appendToVolumeTable(tVal) {
    $("#stock-volume > tbody:last-child").append(`
    <tr>
    <td>${tVal.symbol}</td>
    <td>${tVal.previousPrice}</td>
    <td>${tVal.openPrice}</td>
    <td>${tVal.highPrice}</td>
    <td>${tVal.lowPrice}</td>
    <td>${tVal.ltp}</td>
    <td>${tVal.netPrice}</td>
    <td>${tVal.tradedQuantity}</td>
    <td>${tVal.turnoverInLakhs}</td>
    </tr>    
    `);
}

function appendToliveTable(live) {
    $("#live-watch > tbody:last-child").append(`
    <tr>
    <td>${live.indexName}</td>
    <td>${live.previousClose}</td>
    <td>${live.open}</td>
    <td>${live.high}</td>
    <td>${live.low}</td>
    <td>${live.last}</td>
    <td>${live.percChange}</td>
    <td>${live.yearHigh}</td>
    <td>${live.yearLow}</td>
    </tr>
    `);
}

function openStockPage(){
    var stock = $('#selectBox').val();    
    location.href='/home/stock/'+ stock +'.NS';
}

$(".js-example-theme-single").select2({
    theme: "classic",
    placeholder: "Select a Stock"
  });
