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

$("#logout").click(function (e) {
    axios.get(`/admin/logout`)
        .then(res => {
            location.reload();
        })
        .catch(err => console.log('Login: ', err));
});

function addBlog(isPublish) {
    var title = $('#title').val();
    var content = $('#content').val();
    var url = '/api/blog/add';
    var body = { title, content, isPublish };
    console.log(body);
    axios.post(url, body, axiosConfig)
        .then(res => {
            location.href = '/advisor/dashboard/blog/';
        })
        .catch(err => console.log(err))
}

