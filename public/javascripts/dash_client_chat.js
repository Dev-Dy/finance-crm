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
var chatArr = [];

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}

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
                    var select = document.getElementById('target_1');

                    for (let i = 0; i < data.length; i++) {
                        var option = document.createElement("option");
                        option.value = data[i].SYMBOL;
                        option.text = data[i].SYMBOL;
                        option.className = 'form-control';
                        select.appendChild(option);
                    }

                    document.getElementById("selectBoxContainer").appendChild(select);

                })
            axios.get(`/api/client/current`, axiosConfig)
                .then(res => {
                    var client = res.data.data;
                    client_id = client._id;
                    advisor_id = client.advisor_id;
                })
                .catch(err => console.log('Login: ', err));
            axios.get(`/api/chat/get/client/current`, axiosConfig)
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
            setInterval(function () {
                axios.get(`/api/chat/get/client/current`, axiosConfig)
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
    var to = advisor_id;
    var from = client_id;
    var message = $('#message').val();

    var url = '/api/chat/add';

    var body = { to, from, message }

    axios.post(url, body, axiosConfig)
        .then(res => {
            $('#message').val("")
        })
        .catch(err => console.log(err))
});

function updateUser(id) {
    var plan_id = $('#update_selectBoxPlan').val();
    var target_1 = $('#update_target_1').val();
    var target_2 = $('#update_target_2').val();
    var message = $('#update_message').val();

    var url = '/api/announcement/update/' + id;
    var body = { plan_id, target_1, target_2, message };
    axios.post(url, body, axiosConfig)
        .then(res => {
            location.reload();
        })
        .catch(err => console.log(err))
}

function appendToUsrTable(user) {
    if (user.message) {
        if (client_id == user.from) {
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
