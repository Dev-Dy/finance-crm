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

var pathname = window.location.pathname.split("/");
var id = pathname[pathname.length - 1]
var editFlag = pathname[pathname.length - 2]

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
    $(document).ready(function () {
        $('[data-toggle="offcanvas"]').click(function () {
            $(".js-hamburger").toggleClass("hidden-xs");
        });
    });
    
    
    return {
        init: function init() {
            if (editFlag == "edit") {
                axios.get(`/api/blog/get/${id}`, axiosConfig)
                .then(res => {
                    users = res.data.data;
                    $('#title').val(users.title);
                    $('#content').val(users.content);
                })
                .catch(err => console.log('Login: ', err));
            }
            else {
                axios.get(`/api/blog/current/get`, axiosConfig)
                .then(res => {
                    users = res.data.data;
                    $.each(users, function (i, user) {
                        appendToUsrTable(user);
                    }); 
                })
                .catch(err => console.log('Login: ', err));
            }
            
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

$("#add").click(function (e) {
    location.href = '/advisor/dashboard/blog/add';
});

function editUser(id) {
    location.href = '/advisor/dashboard/blog/edit/' + id;
}

function deleteUser(id) {
    var action = confirm("Are you sure you want to delete this user?");
    var msg = "User deleted successfully!";
    var url = '/api/blog/delete/' + id;
    
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

function updateBlog(isPublish) {
    var pathname = window.location.pathname.split("/");
    var id = pathname[pathname.length - 1]
    var title = $('#title').val();
    var content = $('#content').val();
    var url = `/api/blog/update/${id}`;
    var body = { title, content, isPublish };
    axios.post(url, body, axiosConfig)
    .then(res => {
        location.href = '/advisor/dashboard/blog/';
    })
    .catch(err => console.log(err))
}

function appendToUsrTable(user) {
    $("#patient-data > tbody:last-child").append(`
    <tr id="user-${user._id}">
    <td class="userData" name="address">${user.title}</td>
    <td class="userData" name="address">${user.isPublish}</td>
    <td align="center">
    <button class="btn btn-success form-control" onClick="editUser('${user._id}')" data-toggle="modal" data-target="#editUserModal">Edit</button>
    </td>
    <td>
    <button class="btn btn-danger form-control" onClick="deleteUser('${user._id}')">Delete </button>
    </td>
    </tr>
    `);
}