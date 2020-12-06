"use strict";

var JWT = localStorage.getItem("token");
var axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Authorization": JWT,
    }
};
var users = [];
var id =' ';
var user =' ';
var baseURL = 'http://localhost:3000/'
var pathname = window.location.pathname.split("/");
var his = pathname[pathname.length - 1];
var historyFlag = pathname[pathname.length - 2]

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
            if (historyFlag = 'history'){
                axios.get(`/api/client/get/${id}`,axiosConfig)
                .then(res =>{
                    users = res.data.data;
                    console.log(users)
                })
            }

                axios.get(`/api/client/get`, axiosConfig)
                .then(res => {
                    users = res.data.data;
                    $.each(users, function (i, user) {
                        appendToUsrTable(user);
                    });
                    $(document).ready(function () {
                        $('#patient-data').DataTable({
                        dom: 'B<"top"fi<"float-right"l>>t<"table_wrapper">r<"bottom"p>',
                        lengthMenu: [
                            [10, 25, 50, -1],
                            [10, 25, 50, "All"]
                        ],
                        "scrollX": true,
                        "scrollY": true,
                        autoWidth: false,
                        buttons: [{
                            extend: "csv",
                            title: "MONAY_BHAIYA_ADMIN_CLIENT_CSV_" + (new Date).toString().replace(/ /g, '-')
                        },
                        {
                            extend: "copy"
                        },
                        {
                            extend: "pdf",
                            title: "MONAY_BHAIYA_ADMIN_CLIENT_PDF_" + (new Date).toString().replace(/ /g, '-'),
                            orientation: 'potrait',
                            pageSize: 'A0'
                        },
                        {
                            extend: "excelHtml5",
                            title: "MONAY_BHAIYA_ADMIN_CLIENT_XLS__" + (new Date).toString().replace(/ /g, '-')
                        },
                        {
                            extend: "print",
                            title: "MONAY_BHAIYA_ADMIN_CLIENT_PRINT_" + (new Date).toString().replace(/ /g, '-')
                        }
                    ]
                });
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

/*form submit*/
$("form").submit(function (e) {
    e.preventDefault();
});

/*logout function*/
$("#logout").click(function (e) {
    axios.get(`/admin/logout`)
    .then(res => {
        location.reload();
    })
    .catch(err => console.log('Login: ', err));
});

/*adding user*/
$("form#addUser").submit(function () {
    var username = $('#username').val();
    var fullname = $('#fullname').val();
    var password = $('#password').val();
    
    var url = '/api/client/add';
    
    var body = { username, password, fullname }
    
    axios.post(url, body, axiosConfig)
    .then(res => {
        location.reload();
    })
    .catch(err => console.log(err))
});

function addUser(user) {
    users.push(user);
    appendToUsrTable(user);
}

function editUser(id) {
    
    var url = '/api/client/get/' + id;
    var user;
    axios.get(url, axiosConfig)
    .then(function (response) {
        if (response.data.message == 'success') {
            user = response.data.data;
            $(".modal-body").empty().append(`
            <form id="updateUser" action="">
            <div class="form-group">
            <label for="">Username</label>
            <input class="form-control" type="text" name="username"   id="edit_username"
            placeholder="password" value="${user.username}" required>
            </div>
            <div class="form-group">
            <label for="">Full Name</label>
            <input class="form-control" type="text" name="fullname"   id="edit_fullname"
            placeholder="Full Name" value="${user.fullname}" required>
            </div>
            <div class="form-group">
            <label for="">E-mail</label>
            <input class="form-control" type="email" name="email"   id="edit_email"
            placeholder="E-mail" value="${user.email}" required>
            </div>
            <div class="form-group">
            <label for="">Telephone</label>
            <input class="form-control" type="text" name="phone"   id="edit_phone"
            placeholder="Telephone" value="${user.phone}" required>
            </div>
            `)
            $(".modal-footer").empty().append(`
            <button type="button" type="submit" id="press_submit" class="btn btn-primary" onClick="updateUser('${user._id}')">Save changes</button>
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </form>
            `);
            
        }
    })
    .catch(err => console.log('Login: ', err));
};

/*edit User*/
function updateUser(id) {
    var username = $('#edit_username').val();
    var fullname = $('#edit_fullname').val();
    var email = $('#edit_email').val();
    var phone = $('#edit_phone').val();
    var url = '/api/client/update/' + id;
    var body = {username, fullname, email, phone };
    axios.post(url, body, axiosConfig)
    .then(res => {
        location.reload();
    })
    .catch(err => console.log(err))
}

function deleteUser(id) {
    var action = confirm("Are you sure you want to delete this user?");
    var msg = "User deleted successfully!";
    var url = '/api/client/delete/' + id;
    console.log(id)
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Authorization": JWT,
        }
    }
    axios.get(url, axiosConfig)
    .then(res => {
        location.reload();
    })
    .catch(err => console.log(err))
}

function flashMessage(msg) {
    $(".flashMsg").remove();
    $(".row").prepend(`
    <div class="col-sm-12"><div class="flashMsg alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> <strong>${msg}</strong></div></div>
    `);
}


function appendToUsrTable(user) {
    $("#patient-data > tbody:last-child").append(`
    <tr id="user-${user._id}">
    <td class="userData" name="address">${user.username}</td>
    <td align="center">
    <button class="btn btn-success form-control" onClick="editUser('${user._id}')" data-toggle="modal" data-target="#editUserModal">Edit</button>
    </td>
    <td align="center">
    <button class="btn btn-success form-control" onClick="historyClient('${user._id}')">History</button>
    </td>
    <td>
    <button class="btn btn-danger form-control" onClick="deleteUser('${user._id}')">Delete</button>
    </td>
    </tr>
    `);
}

function historyClient(id){
    location.href = '/admin/dashboard/client/history/'+his;
}