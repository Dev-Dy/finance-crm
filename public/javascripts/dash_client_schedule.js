"use strict";

var JWT = localStorage.getItem("token");
var axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Authorization": JWT,
    }
};
var users = [];
var schArr = [];
var baseURL = 'http://localhost:3000/'
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
            
            axios.get(`/api/schedule/client/get`, axiosConfig)
            .then(res => {
                users = res.data.data;
                $.each(users, function (i, user) {
                    appendToUsrTable(user);
                });
                for (var i = 0; i < users.length; i++) {
                    schArr.push(users[i].meet_time)
                }
                axios.get(`/api/schedule/slots/available`, axiosConfig)
                .then(res => {
                    var res = res.data.data;
                    var select = document.getElementById('selectBox');
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].client_id == undefined) {
                            var option = document.createElement("option");
                            option.value = res[i]._id;
                            option.text = res[i].meet_time;
                            option.className = 'form-control';
                            select.appendChild(option);
                        }
                    }
                    document.getElementById("selectBoxContainer").appendChild(select);
                })
                .catch(err => console.log(err));
                
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

$("form#addUser").submit(function () {
    
    var id = $('#selectBox').val();
    
    var url = '/api/schedule/client/book/' + id;
    
    axios.get(url, axiosConfig)
    .then(res => {
        location.reload();
    })
    .catch(err => console.log(err))
});

function editUser(id) {
    var url = '/api/schedule/get/' + id;
    var user;
    axios.get(url, axiosConfig)
    .then(function (response) {
        if (response.data.message == 'success') {
            user = response.data.data;
            $(".modal-body").empty().append(`
            <form id="updateUser" action="">
            <div class="form-group" id="selectBoxPlanUpdateContainer">
            <label for="">Choose Time</label>
            <select class="form-control" id="update_selectBoxPlan">
            </select>
            </div>
            `);
            $(".modal-footer").empty().append(`
            <button type="button" type="submit" id="pres_submit" class="btn btn-primary" onClick="updateUser('${user._id}')">Save changes</button>
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </form>
            `);
            
            axios.get(`/api/schedule/slots/available`, axiosConfig)
            .then(res => {
                var res = res.data.data;
                var select = document.getElementById('update_selectBoxPlan');
                for (var i = 0; i < res.length; i++) {
                    if (res[i].client_id == undefined) {
                        var option = document.createElement("option");
                        option.value = res[i]._id;
                        option.text = res[i].meet_time;
                        option.className = 'form-control';
                        select.appendChild(option);
                    }
                }
                var option = document.createElement("option");
                option.value = user.meet_time;
                option.text = user.meet_time;
                option.className = 'form-control';
                select.appendChild(option);
                document.getElementById("selectBoxPlanUpdateContainer").appendChild(select);
                $("#update_selectBoxPlan").val(user.meet_time);
                document.getElementById("selectBoxPlanUpdateContainer").appendChild(select);
            })
            .catch(err => console.log(err));
            
            
        }
    })
    .catch(err => console.log('Login: ', err));
}

function updateUser(prevId) {
    var id = $('#update_selectBoxPlan').val();
    
    var url = '/api/schedule/client/update/' + id;
    var body = { prevId };
    axios.post(url, body, axiosConfig)
    .then(res => {
        location.reload();
    })
    .catch(err => console.log(err))
}

function appendToUsrTable(user) {
    var clientName = user.client_id !== undefined ? user.client_id.fullname : "--";
    
    $("#patient-data > tbody:last-child").append(`
    <tr id="user-${user._id}">
    <td class="userData" name="address">${user.meet_time}</td>
    <td align="center"><button class="btn btn-primary form-control" onClick="editUser('${user._id}')" data-toggle="modal" data-target="#editUserModal">Join</button></td>
    <td align="center"><button class="btn btn-success form-control" onClick="editUser('${user._id}')" data-toggle="modal" data-target="#editUserModal">Edit</button></td>
    </tr>
    `);
}
