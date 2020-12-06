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
            axios.get('/api/advisor/get', axiosConfig)
            .then(res =>{
                var users = res.data.data
                $.each(users, function (i, user) {
                    id = user._id
                    console.log(id)
                    appendToProfileCard(user);
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


function selectadvisor(){
    location.href= '/client/details/selectAdvisor'
}
function appendToProfileCard(user) {

    $("#advisor-list:last-child").append(`
    <div class="col-md-4">
    <div class="card user-card">
    <div class="card-header">
    <h5>Profile</h5>
    </div>
    <div class="card-block">
    <div class="user-image">
    <img src="https://bootdey.com/img/Content/avatar/avatar7.png" class="img-radius" alt="User-Profile-Image">
    </div>
    <h6 class="f-w-600 m-t-25 m-b-10">${user.fullname}</h6>
    <p class="text-muted">Active | Male</p>
    <hr>
    <p class="text-muted m-t-15">Activity Level: 100%</p>
    <ul class="list-unstyled activity-leval">
    <li class="active"></li>
    <li class="active"></li>
    <li class="active"></li>
    <li class="active"></li>
    <li class="active"></li>
    </ul>
    <div class="bg-light counter-block m-t-10 p-20">
    <p class="m-t-15 text-muted">${user.language}</p>
    </div>
    <hr>
    <input name="" class="form-control" placeholder="username" type="hidden" id='advisor_id'>
    <button type="button" class="btn btn-success btn-lg btn-block" onclick='selectAdvisor()'>Follow</button>
    </div>
    </div>
    </div>        
    `);
}

function selectAdvisor(){
    
    // var advisor = $('#advisor_id').val(id);
    // var body = {advisor}
    // var url = 'api/client/selectadvisor';
    // axios.post(url, body)
    // .then(res=>{
    //     console.log(res)
        location.href='/client/dashboard/myprofile'
    // })
    
}