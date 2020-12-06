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
var user = '';
var Dashboard = function () {
    var global = {
        tooltipOptions: {
            placement: "right"
        },
        menuClass: ".c-menu"
    };
    return {
        init: function init() {
            axios.get(`/api/blog/get`, axiosConfig)
            .then(res => {
                console.log(res)
                users = res.data.data;
                $.each(users, function (i, user) {
                    appendToBlogTable(user);
                    console.log(user)
                });
            })
            .catch(err => console.log(err));    
        }
    };
}();

Dashboard.init();

function appendToBlogTable(blog){
    console.log('hey')
    $("#article").append(`
    <h1 class="posttitle">${blog.title}</h1>
    <p>
    ${blog.content}    
    </p>
    `)
}
