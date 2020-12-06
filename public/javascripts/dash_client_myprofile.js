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
            axios.get(`/api/client/current`, axiosConfig)
            .then(result => {
                var user = result.data.data;
                $("#username").val(user.username);       
                $("#fullname").val(user.fullname);              
                $("#email").val(user.email);       
                $("#phone").val(user.phone);       
                id = user._id;           
            })
            .catch(err => console.log('Login: ', err));
            axios.get(`/api/announcement/get`, axiosConfig)
            .then(res => {
                console.log(res)
                users = res.data.data;
                $.each(users, function (i, user) {
                    appendToAnnouncementTable(user);
                    console.log(user)
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

$("#logout").click(function (e) {
    axios.get(`/admin/logout`)
    .then(res => {
        location.reload();
    })
    .catch(err => console.log('Login: ', err));
});


function updateUser(){
    
    var id = $('#client_id').val();
    
    var username = $('#username').val();
    var fullname = $('#fullname').val();
    var email = $('#email').val();
    var phone = $('#phone').val(); 
    var url = '/api/client/update/' + id;
    var body = {username, fullname,email, phone };
    
    axios.post(url, body, axiosConfig)
    .then(res => {
        console.log(res)
    })
    .catch(err => console.log(err))   
}

function appendToAnnouncementTable(user) {
    $("#ann-data > tbody:last-child").append(`
    <tr id="user-${user._id}">
    <td class="userData" name="address">${user.stock}</td>
    <td class="userData" name="address">${user.target_1}</td>
    <td class="userData" name="address">${user.target_2}</td>
    <td class="userData" name="address">${user.entryPoint}</td>
    <td class="userData" name="address">${user.stopLoss}</td>
    <td class="userData" name="address">${user.message}</td>
    </tr>
    `);
}

function flashMessage(msg) {
    $(".flashMsg").remove();
    $(".row").prepend(`
    <div class="col-sm-12"><div class="flashMsg alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> <strong>${msg}</strong></div></div>
   `);
}

function unfollow(id) {
    var action = confirm("Are you sure you want to unfollow this advisor?");
    var msg = "User deleted successfully!";
    var url = '/api/advisor/delete/' + id;

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

function moreAdvisor(){
    location.href = '/client/details/selectAdvisor'
}