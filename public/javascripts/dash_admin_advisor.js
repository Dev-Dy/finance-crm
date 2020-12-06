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
var id = pathname[pathname.length - 1];
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
            if (historyFlag=='history'){   
                axios.get(`/api/advisor/get/${id}`, axiosConfig)
                .then(res => {
                    console.log(res)
                    
                })
                .catch(err => console.log('Login: ', err));
            } 

                axios.get(`/api/advisor/get`, axiosConfig)
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
                                title: "MONEY_BHAIYA_ADMIN_CLIENT_CSV_" + (new Date).toString().replace(/ /g, '-')
                            },
                            {
                                extend: "copy"
                            },
                            {
                                extend: "pdf",
                                title: "MONEY_BHAIYA_ADMIN_CLIENT_PDF_" + (new Date).toString().replace(/ /g, '-'),
                                orientation: 'potrait',
                                pageSize: 'A0'
                            },
                            {
                                extend: "excelHtml5",
                                title: "MONEY_BHAIYA_ADMIN_CLIENT_XLS__" + (new Date).toString().replace(/ /g, '-')
                            },
                            {
                                extend: "print",
                                title: "MONEY_BHAIYA_ADMIN_CLIENT_PRINT_" + (new Date).toString().replace(/ /g, '-')
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


$("form").submit(function (e) {
    e.preventDefault();
});


$("#logout").click(function (e) {
    axios.get(`/admin/logout`)
    .then(res => {
        location.reload();
    })
    .catch(err => console.log('Login: ', err));
});

$("form#addUser").submit(function () {
    var username = $('#username').val();
    var password = $('#password').val();
    var fullname = $('#fullname').val();
    var reg_no = $('#reg_no').val();
    var reg_company = $('#reg_company').val();
    var email = $('#email').val();
    var telephone = $('#telephone').val();
    var language = $('#language').val();
    var fax = $('#fax').val();
    var per_address = $('#per_address').val();
    var cor_address = $('#cor_address').val();
    var liscence_val = $('#liscence_val').val();
    
    var url = '/api/advisor/add';
    
    var body = { username,password, fullname,reg_company,reg_no, telephone, email,language, fax, per_address,cor_address, liscence_val }
    
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
            <div class="form-group">
            <label for="">Full Name</label>
            <input class="form-control" type="text" name="fullname"   id="update_fullname"
            placeholder="fullname" value="${user.fullname}" required>
            </div>
            <div class="form-group">
            <label for="">Registration Company Name</label>
            <input class="form-control" type="text" name="registration company"   id="update_reg_company"
            placeholder="Registartion Company Name" value="${user.reg_company}" required>
            </div>
            <div class="form-group">
            <label for="">Registration No.</label>
            <input class="form-control" type="text" name="registration no"   id="update_reg_no"
            placeholder="Rgistration No." value="${user.reg_no}" required>
            </div>
            <div class="form-group">
            <label for="">E-mail</label>
            <input class="form-control" type="email" name="email"   id="update_email"
            placeholder="E-mail" value="${user.email}" required>
            </div>
            <div class="form-group">
            <label for="">Telephone</label>
            <input class="form-control" type="number" name="telephone"   id="update_telephone"
            placeholder="telephone" value="${user.telephone}" required>
            </div>
            <div class="form-group">
            <label for="">Languages</label>
            <input class="form-control" type="text" name="language"   id="update_language"
            placeholder="language" value="${user.language}" required>
            </div>
            <div class="form-group">
            <label for="">Fax No.</label>
            <input class="form-control" type="number" name="fax"   id="update_fax"
            placeholder="Fax No." value="${user.fax}" required>
            </div>
            <div class="form-group">
            <label for="">Permanent Address</label>
            <input class="form-control" type="text" name="per_address"   id="update_per_address"
            placeholder="Permanent Address" value="${user.per_address}" required>
            </div>
            <div class="form-group">
            <label for="">Corresponding Address</label>
            <input class="form-control" type="text" name="cor_address"   id="update_cor_address"
            placeholder="Corresponding Address" value="${user.cor_address}" required>
            </div>
            <div class="form-group">
            <label for="">Liscence validity</label>
            <input class="form-control" type="text" name="liscence"   id="update_liscence_val"
            placeholder="liscence" value="${user.liscence_val}" required>
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


function deleteUser(id) {
    var action = confirm("Are you sure you want to delete this user?");
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


function updateUser(id) {
    var username = $('#update_username').val();
    var fullname = $('#update_fullname').val();
    var reg_no = $('#update_reg_no').val();
    var reg_company = $('#update_reg_company').val();
    var email = $('#update_email').val();
    var telephone = $('#update_telephone').val();
    var per_address = $('#update_per_address').val();
    var language = $('#update_language').val();
    var cor_address = $('#update_cor_address').val();
    var fax = $('#update_fax').val();
    var liscence_val = $('#update_liscence_val').val();
    var url = '/api/advisor/update/' + id;
    var body = {username,fullname,reg_no,reg_company,email,telephone,language,per_address,cor_address, fax, liscence_val};
    axios.post(url, body, axiosConfig)
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
    <td>
    <button class="btn btn-success form-control" onClick="editUser('${user._id}')" data-toggle="modal" data-target="#editUserModal">Edit</button>
    </td>
    <td>
    <button class="btn btn-success form-control" onClick="historyAdvisor('${user._id}')">History</button>
    </td>
    <td>
    <button class="btn btn-danger form-control" onClick="deleteUser('${user._id}')">Delete </button>
    </td>
    </tr>
    `);
}

function historyAdvisor(user){
    console.log('hey')
    location.href = '/admin/dashboard/advisor/history/'+user;
}