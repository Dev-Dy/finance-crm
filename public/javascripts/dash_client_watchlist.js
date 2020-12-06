"use strict";

var JWT = localStorage.getItem("token");
var axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Authorization": JWT,
    }
};
var users = [];
var baseURL = 'http://localhost:3000'
var id = '';
var Dashboard = function () {
    var global = {
        tooltipOptions: {
            placement: "right"
        },
        menuClass: ".c-menu"
    };
    
    var menuChangeActive = function menuChangeActive(el) {
        var hasSubmenu = $(el).hasClass("has-submenu");
        $(global.menuClass + " .is-active").removeClass("is-active");
        $(el).addClass("is-active");
        
    };
    
    var sidebarChangeWidth = function sidebarChangeWidth() {
        var $menuItemsTitle = $("li .menu-item__title");
        
        $("body").toggleClass("sidebar-is-reduced sidebar-is-expanded");
        $(".hamburger-toggle").toggleClass("is-opened");
        
        if ($("body").hasClass("sidebar-is-expanded")) {
            $('[data-toggle="tooltip"]').tooltip("destroy");
        } else {
            $('[data-toggle="tooltip"]').tooltip(global.tooltipOptions);
        }
    };
    
    return {
        init: function init() {
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
                
                document.getElementById("selectBoxContainer").appendChild(select);
                
            })
            .catch(err => console.log(err));
            axios.get(`/api/watchlist/current/get`, axiosConfig)
            .then(res => {
                
                users = res.data.data;
                $.each(users, function (i, user) {
                    appendToUsrTable(user);
                });
            })
            .catch(err => console.log('Login: ', err));
            
            axios.get(`/api/announcement/get`, axiosConfig)
            .then(res => {
                console.log(res)
                users = res.data.data;
                $.each(users, function (i, user) {
                    appendToAnnouncementTable(user);
                });
            })
            .catch(err => console.log(err));
            $(".js-hamburger").on("click", sidebarChangeWidth);
            $(".js-menu li").on("click", function (e) {
                menuChangeActive(e.currentTarget);
            });
            
            $('[data-toggle="tooltip"]').tooltip(global.tooltipOptions);
        }
    };
}();

Dashboard.init();

$("form").submit(function (e) {
    e.preventDefault();
});

$("form#addUser").submit(function () {
    
    var stock = $('#selectBox').val();
    var url = '/api/watchlist/add';
    var body = { stock }
    
    axios.post(url, body, axiosConfig)
    .then(res => {
        location.reload();
    })
    .catch(err => console.log(err))
});

$("#logout").click(function (e) {
    axios.get(`/admin/logout`)
    .then(res => {
        location.reload();
    })
    .catch(err => console.log('Login: ', err));
});


function getNews(symbol) {
    var url = '/api/news/get/' + symbol;
    
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Authorization": JWT,
        }
    };
    
    axios.get(url, axiosConfig)
    .then(res => {
        var users = res.data.data;
        $.each(users, function (i, user) {
            appendToNewsBlock(user);
        });
        
    })
    .catch(err => console.log(err))
}

function deleteUser(symbol) {
    var action = confirm("Are you sure you want to delete this user?");
    var msg = "User deleted successfully!";
    var url = '/api/watchlist/delete/' + symbol;
    
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Authorization": JWT,
        }
    };
    
    
    axios.get(url, axiosConfig)
    .then(res => {
        location.reload();
    })
    .catch(err => console.log(err))
}

function appendToNewsBlock(news) {
    $(".modal-body").append(`
    <p>${news.title}</p>
    `);
}

function appendToUsrTable(stock) {
    $("#patient-data > tbody:last-child").append(`
    <tr id="stock-data${stock._id}">
    <td class="userData" name="address">${stock.symbol}</td>
    <td class="userData" name="address">${stock.regularMarketPrice}</td>
    <td>
    <button class="btn btn-primary form-control" onClick="getNews('${stock.symbol}')" data-toggle="modal" data-target="#editUserModal">View News</button>
    </td>
    <td>
    <button class="btn btn-danger form-control" onClick="deleteUser('${stock.symbol}')">Delete </button>
    </td>
    </tr>
    `);
}

$(".js-example-theme-single").select2({
    theme: "classic"
});

function appendToAnnouncementTable(user) {
    $("#patient-data > tbody:last-child").append(`
    <tr id="stock-data${user._id}">
    <td class="userData" name="address">${user.stock}</td>
    <td class="userData" name="address">${user.regularMarketPrice}</td>
    <td>
    <button class="btn btn-primary form-control" onClick="getNews('${user.symbol}')" data-toggle="modal" data-target="#editUserModal">View News</button>
    </td>
    <td>
    <button class="btn btn-danger form-control" onClick="deleteUser('${user.symbol}')">Delete </button>
    </td>
    </tr>
    `);
}
