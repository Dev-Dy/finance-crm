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
var Stocks = [];
var News = [];

var baseURL = 'http://localhost:3000/'

var Dashboard = function () {
    var global = {
        tooltipOptions: {
            placement: "right"
        },
        menuClass: ".c-menu"
    };
    
    return {
        init: function init() {
            var pathname = window.location.pathname.split("/");
            var symbol = pathname[pathname.length - 1] 
            
            axios.get(`/api/stock/data/${symbol}`, axiosConfig)
            .then(res => {
                Stocks = res.data.data;
                console.log(res.data)
                $.each(Stocks, function (i, stock) {
                    appendtoStock(stock)
                });
            })
            .catch(err => console.log('Login: ', err));
            axios.get(`/api/stock/news/${symbol}`, axiosConfig)
            .then(res => {
                News = res.data.data;
                console.log(res.data)
                $.each(News, function (i, news) {
                    appendtoNews(news)
                });
            })
            .catch(err => console.log('Login: ', err));
        }
    };
}();

Dashboard.init();



function appendtoStock(stock){
    $("#stock-detail").append(`
    <div class="row">
    <div class="col-md-12">
    <h3>
    ${stock.longName}
    </h3>
    <div class="row">
    <div class="col-md-3">
    <div class="card">
    <h5 class="card-header">
    Open
    </h5>
    <div class="card-body">
    <p class="card-text">
    ${stock.regularMarketOpen}
    </p>
    </div>
    </div>
    </div>
    <div class="col-md-3">
    <div class="card">
    <h5 class="card-header">
    High
    </h5>
    <div class="card-body">
    <p class="card-text">
    ${stock.regularMarketDayHigh}
    </p>
    </div>
    </div>
    </div>
    <div class="col-md-3">
    <div class="card">
    <h5 class="card-header">
    Low
    </h5>
    <div class="card-body">
    <p class="card-text">
    ${stock.regularMarketDayLow}
    </p>
    </div>
    </div>
    </div>
    <div class="col-md-3">
    <div class="card">
    <h5 class="card-header">
    Close
    </h5>
    <div class="card-body">
    <p class="card-text">
    ${stock.regularMarketDayLow}
    </p>
    </div>
    </div>
    </div>
    </div>
    </div>                
    </div>
    `)
}

function appendtoNews(news){
    console.log('hey')
    $('#stock-news').append(`
    <div class="row">
        <div class="col-md-12">
            <div class="row">
                <div class="col-md-4">
                    <h3 class="text-center">
                    ${news.title}
                    </h3>
                <a href="url">${news.link}</a>
                <p>
                ${news.description}
                </p>
                </div>
            </div>
        </div>
    </div>   
    `)
}