"use strict";

var JWT = localStorage.getItem("token");
var axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Authorization": JWT,
    }
};
var users = [];
var baseURL = 'http://localhost:3000/'
var client_id = "";
var advisor_id = "";

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
            var user = [];
            axios.get(`/api/advisor/clients`, axiosConfig)
                .then(res => {
                    var clients = res.data.data;
                    $.each(clients, function (i, client) {
                        advisor_id = client.advisor_id;
                        appendToClientList(client);
                    });
                })
                .catch(err => console.log('Login: ', err));

            $(".js-hamburger").on("click", sidebarChangeWidth);
            $(".js-menu li").on("click", function (e) {
                menuChangeActive(e.currentTarget);
            });

            $('[data-toggle="tooltip"]').tooltip(global.tooltipOptions);
        }
    };
}();

Dashboard.init();

$("#logout").click(function (e) {
    axios.get(`/admin/logout`)
        .then(res => {
            location.reload();
        })
        .catch(err => console.log('Login: ', err));
});

$("form#addUser").submit(function (event) {
    event.preventDefault()
    var to = client_id;
    var from = advisor_id;
    var message = $('#message').val();
    var url = '/api/chat/add';

    var body = { to, from, message }

    axios.post(url, body, axiosConfig)
        .then(res => {
            $('#message').val("")
        })
        .catch(err => console.log(err))
});

function selectClient(id) {
    $("#chat-window").html("");
    client_id = id;
    var chatArr = [];
    setInterval(function () {
        axios.get(`/api/chat/get/advisor/${id}`, axiosConfig)
            .then(res => {
                users = res.data.data;
                $.each(users, function (i, user) {
                    var flag = chatArr.includes(user._id);
                    if (!flag) {
                        chatArr.push(user._id);
                        appendToUsrTable(user);
                    }
                });
            })
            .catch(err => console.log('Login: ', err));
    }, 2000);

}

function appendToUsrTable(user) {
    if (user.message) {
        if (advisor_id == user.from) {
            $("#chat-window ").append(`
            <div class="row">
            <div class="col-md-5"></div>
            <div class="col-md-7">
                <div class="from-side">${user.message}</div>
            </div>
        </div>
       `);
        }
        else {
            $("#chat-window ").append(`
            <div class="row">
            <div class="to-side">${user.message}</div>
            </div>
            `);
        }
    }


}

function appendToClientList(user) {
    $("#client-list").append(`<div class="row"><div class="client-name" onclick="selectClient('${user._id}')">${user.fullname}</div></div>`);
}

