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
            var stockArr = []
            axios.get('/api/stock/getAll', axiosConfig)
            .then(res => {
                
                for(let i=0; i<res.data.length;i++){
                    stockArr.push(res.data[i].SYMBOL)
                }
                
                var select = document.getElementById('stock');
                
                for (var i = 0; i < stockArr.length; i++) {
                    var option = document.createElement("option");
                    option.value = stockArr[i];
                    option.text = stockArr[i];
                    option.className = 'form-control';
                    select.appendChild(option);
                    
                }
                
            })
            .catch(err => console.log(err));
            
            
            axios.get(`/api/announcement/get`, axiosConfig)
            .then(res => {
                users = res.data.data;
                $.each(users, function (i, user) {
                    appendToUsrTable(user);
                });
                axios.get(`/api/plan/get`, axiosConfig)
                .then(result => {
                    console.log(res)
                    var plans = result.data.data;
                    var select = document.getElementById('selectBoxPlan');
                    for (const plan of plans) {
                        var option = document.createElement("option");
                        option.value = plan._id;
                        option.text = plan.name;
                        option.className = 'form-control';
                        select.appendChild(option);
                    }
                    document.getElementById("selectBoxPlanContainer").appendChild(select);
                    
                })
                .catch(err => console.log('Login: ', err));
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
    
    var plan_id = $('#selectBoxPlan').val();
    var stock = $('#stock').val();
    var target_1 = $('#target_1').val();
    var target_2 = $('#target_2').val();
    var entryPoint = $('#entryPoint').val();
    var stopLoss = $('#stopLoss').val();
    var status = $('#status').val();
    var message = $('#message').val();
    
    var url = '/api/announcement/add';
    
    var body = { plan_id, target_1, stock, target_2, message, entryPoint, stopLoss }
    
    axios.post(url, body, axiosConfig)
    .then(res => {
        location.reload();
    })
    .catch(err => console.log(err))
});



function appendToUsrTable(user) {
    $("#patient-data > tbody:last-child").append(`
    <tr id="user-${user._id}">
    <td class="userData" name="address">${user.plan_id.name}</td>
    <td class="userData" name="address">${user.stock}</td>
    <td class="userData" name="address">${user.target_1}/${user.target_2}</td>
    <td class="userData" name="address">${user.entryPoint}/${user.stopLoss}</td>
    <td class="userData" name="address">${user.status}</td>
    <td align="center"><button class="btn btn-danger form-control" onClick="removePosition('${user._id}')" data-toggle="modal" data-target="#editUserModal">Remove</button></td>
    <td align="center"><button class="btn btn-danger form-control" onClick="deletePosition('${user._id}')" data-toggle="modal" data-target="#editUserModal">Delete</button></td>
    </tr>
    `);
}


function deletePosition(id) {
    var action = confirm("Are you sure you want to delete this Announcement?");
    var msg = "Announcement deleted successfully!";
    var url = '/api/announcement/delete/' + id;

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
    
function removePosition(){
    var action = confirm("Are you sure remove this position?")
    var msg = "This position is expired";
    var url = "/api/announcement/remove/"+id;

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



// announcement over

// whatsapp begin
function whatsApp(){
    var message = $('#message').val();
    var url = '/api/announcement/sendMessage';
    const API_TOKEN = process.env.API_TOKEN;
    var body = {message}
    var axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "x-maytapi-key": API_TOKEN,
            
        },
        message:{
            "message": "http://placehold.it/180", 
            "text": "", 
            "to_number": "+918827832128", 
            "type": "media"
            
        }
    };
    
    axios.get(url, body, axiosConfig)
    .then(res=>{
        location.reload();
    })
    .catch(err=> console.log(err))   
}




// function updateUser(id) {
//     var plan_id = $('#update_selectBoxPlan').val();
//     var target_1 = $('#update_target_1').val();
//     var target_2 = $('#update_target_2').val();
//     var message = $('#update_message').val();
    
//     var url = '/api/announcement/update/' + id;
//     var body = { plan_id, target_1, target_2, message };
//     axios.post(url, body, axiosConfig)
//     .then(res => {
//         location.reload();
//     })
//     .catch(err => console.log(err))
// }
// function editUser(id) {
        //     var url = '/api/announcement/get/' + id;
        //     var user;
        //     axios.get(url, axiosConfig)
        //     .then(function (response) {
            //         if (response.data.message == 'success') {
        //             user = response.data.data;
        //             $(".modal-body").empty().append(`
        //             <form id="updateUser" action="">
        //             <div class="form-group">
        //             <label for="">Target 1</label>
        //             <input class="form-control" type="text" name="target_1" id="update_target_1" placeholder="Target 1" value="${user.target_1}">
        //             </div>
        //             <div class="form-group">
        //             <label for="">Target 2</label>
        //             <input class="form-control" type="text" name="target_2" id="update_target_2" placeholder="Target 2" value="${user.target_2}">
        //             </div>
        //             <div class="form-group">
        //             <label for="">Message</label>
        //             <input class="form-control" type="text" name="message" id="update_message" placeholder="Message" value="${user.message}">
        //             </div>
        //             `);
        //             $(".modal-footer").empty().append(`
        //             <button type="button" type="submit" id="pres_submit" class="btn btn-primary" onClick="updateUser('${user._id}')">Save changes</button>
        //             <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        //             </form>
        //             `);
                    
        //             axios.get(`/api/plan/get`, axiosConfig)
        //             .then(result => {
        //                 var plans = result.data.data;
        //                 var select = document.getElementById('update_selectBoxPlan');
        //                 for (const plan of plans) {
        //                     var option = document.createElement("option");
        //                     option.value = plan._id;
        //                     option.text = plan.name;
        //                     option.className = 'form-control';
        //                     select.appendChild(option);
        //                 }
        //                 document.getElementById("selectBoxPlanUpdateContainer").appendChild(select);
        //                 $("#update_selectBoxPlan").val(user.plan_id);
                        
        //             })
        //             .catch(err => console.log('Login: ', err));
                    
        //         }
        //     })
        //     .catch(err => console.log('Login: ', err));
        // }
