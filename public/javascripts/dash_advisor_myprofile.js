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
    $(document).ready(function(){
        $('[data-toggle="offcanvas"]').click(function(){
            $(".js-hamburger").toggleClass("hidden-xs");
        });
     });
     

    return {
        init: function init() {
            axios.get(`/api/advisor/current`, axiosConfig)
                .then(result => {
                    var user = result.data.data;
                    $("#username").val(user.username);       
                    $("#fullname").val(user.fullname);       
                    $("#reg_no").val(user.reg_no);       
                    $("#reg_company").val(user.reg_company);       
                    $("#email").val(user.email);       
                    $("#telephone").val(user.telephone);       
                    $("#fax").val(user.fax);       
                    $("#per_address").val(user.per_address);       
                    $("#cor_address").val(user.cor_address);       
                    $("#liscence_val").val(user.liscence_val);              
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

$("#logout").click(function (e) {
    axios.get(`/admin/logout`)
        .then(res => {
            location.reload();
        })
        .catch(err => console.log('Login: ', err));
});


function editUser(id) {

    var url = '/api/advisor/get/' + id;
    var user;
    axios.get(url, axiosConfig)
        .then(function (response) {
            if (response.data.message == 'success') {
                user = response.data.data;
                $(".modal-body").empty().append(`
                  <form id="updateUser" action="">
                <div class="form-group">
                  <label for="">Username</label>
                  <input class="form-control" type="text" name="username"   id="update_username"
                    placeholder="username" value="${user.username}" required>
                </div>
                  `);
                $(".modal-footer").empty().append(`
				   <button type="button" type="submit" id="pres_submit" class="btn btn-primary" onClick="updateUser('${user._id}')">Save changes</button>
					  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				  </form>
			  `);

            }
        })
        .catch(err => console.log('Login: ', err));
}

function updateUser() {
    var username = $('#username').val();
    var url = '/api/advisor/update/' + id;
    var body = { username, };
    axios.post(url, body, axiosConfig)
        .then(res => {
            location.reload();
        })
        .catch(err => console.log(err))
}

