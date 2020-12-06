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
var user ='';
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
                $('#client_id').val(user._id);
                $("#username").val(user.username);       
                $("#password").val(user.password);       
                $("#fullname").val(user.fullname);            
                $("#email").val(user.email);       
                $("#phone").val(user.phone);       
                id = user._id;          
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

function addClient(){
    
    var id = $('#client_id').val();
    
    var username = $('#username').val();
    var password = $('#password').val();
    var fullname = $('#fullname').val();
    var email = $('#email').val();
    var phone = $('#phone').val(); 
    var url = '/api/client/update/' + id;
    var body = {username, password, fullname, email, phone };
    
    axios.post(url, body, axiosConfig)
    .then(res => {
        console.log(res)
    })
    .catch(err => console.log(err))   
}
